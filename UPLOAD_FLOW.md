# 分片上传全链路梳理

> 从前端点击"分片上传演示"菜单 → 选择文件 → 分片上传 → Mock 配合 → 上传成功提示的完整链路
> 覆盖五个阶段、九个文件、关键函数与变量
> 配套知识点：断点续传、主动终止、Promise 并发池

---

## 阶段一：点击菜单 → 页面呈现（路由链路）

```mermaid
sequenceDiagram
    participant M as 侧边栏菜单项
    participant L as LayoutClassic/index.vue
    participant G as routers/index.ts 守卫
    participant R as 路由匹配器
    participant V as upload/index.vue

    Note over M: 菜单数据来源：mock/menu/list.js<br/>→ getMenuListApi → authStore.authMenuList<br/>→ 侧边栏 v-for 渲染
    M->>L: 点击"分片上传演示" → el-menu @select 事件
    L->>L: handleMenuClick('/upload')
    L->>G: router.push('/upload')
    G->>G: 守卫：token 有 ✅ / 菜单已初始化 ✅ → return true
    G->>R: 匹配 /upload
    Note over R: /upload 是登录时动态注册的：<br/>initDynamicRouter → transformMenuToRoute<br/>→ addRoute('layout', upload路由)<br/>→ matched = [layout, upload]
    R->>V: 布局渲染（侧边栏不变）+ 内容区渲染 upload/index.vue
```

### 经过的文件与关键点

| 文件                      | 函数/变量               | 作用                                                  |
| ------------------------- | ----------------------- | ----------------------------------------------------- |
| `mock/menu/list.js`       | 菜单 JSON               | "分片上传演示"菜单项的数据源头                        |
| `LayoutClassic/index.vue` | `handleMenuClick(path)` | 菜单点击 → 路由跳转                                   |
| `routers/index.ts`        | `beforeEach` 守卫       | 安检：登录态 + 菜单初始化检查                         |
| `dynamicRouter.ts`        | `transformMenuToRoute`  | 登录时把 `component: 'upload/index'` 字符串翻译成组件 |

---

## 阶段二：点击"选择文件" → 上传启动

```mermaid
sequenceDiagram
    participant U as el-upload 组件
    participant P as upload/index.vue
    participant H as useChunkUpload.ts

    U->>U: :auto-upload="false" 点击 → 弹出系统文件对话框
    Note over U: 用户选中 845MB 的 zip 文件
    U->>P: on-change 事件触发 → handleChange(file)
    Note over P: file.raw = 原生 File 对象<br/>（file 是 el-upload 包装对象，raw 才是真文件）
    P->>H: uploadFile(file.raw)
    H->>H: uploading = true<br/>progress = 0<br/>abortFlag = false<br/>sharedController = new AbortController()
```

### 关键变量（useChunkUpload.ts 内部）

| 变量                             | 类型                | 作用                               |
| -------------------------------- | ------------------- | ---------------------------------- |
| `chunks`                         | `Blob[]`            | 423 个分片（845MB ÷ 2MB）          |
| `totalChunks`                    | number              | 423                                |
| `pendingIndexes`                 | `number[]`          | 待传片序号（断点续传时跳过已传的） |
| `completedCount`                 | number              | 已完成片数（进度计算基准）         |
| `cursor`                         | number              | 并发池共享游标                     |
| `abortFlag` / `sharedController` | 终止标志 / 取消信号 | 主动终止用                         |

---

## 阶段三：check 接口 —— 问服务端"你有哪些片了"

```mermaid
sequenceDiagram
    participant H as useChunkUpload.uploadFile
    participant API as api/modules/upload.ts
    participant A as api/index.ts (axios实例)
    participant M as build/mockServer.ts
    participant MK as mock/upload.js

    H->>API: checkChunkApi(file.name)
    API->>A: http.get('/geeker/upload/check?filename=xxx.zip')
    A->>A: 请求拦截器：addPending 去重 + 注入 token
    A->>M: GET /geeker/upload/check?filename=xxx.zip（同源 → Vite 接手）
    M->>M: urlPrefixes 匹配 /geeker/ → 进入 mock 中间件
    M->>MK: 插件剥掉 query → pattern '/geeker/upload/check' + GET 匹配成功
    MK->>MK: uploadedChunks.get(filename) → 空的 Set（第一次传）
    MK-->>H: { code: 200, data: [], msg: 'ok' }
    H->>H: uploadedSet = new Set(res.data)  ← 空集
    H->>H: 生成 pendingIndexes = [0, 1, 2, ..., 422]（全部待传）
```

### 关键点

- `mock/upload.js` 顶部的 **`uploadedChunks` Map** 是"服务端磁盘"的模拟——`filename → Set<片序号>`
- 响应经 axios **响应拦截器**统一处理（错误提示、code 校验）后才回到业务代码
- `res.data` 解包是接口约定（`{ code, data, msg }` 结构）——忘记解包会报 `object is not iterable`

---

## 阶段四：并发上传 —— Promise 池 + mock 记录

```mermaid
sequenceDiagram
    participant W1 as worker 1
    participant W2 as worker 2
    participant W3 as worker 3
    participant A as axios
    participant MK as mock/upload.js chunk handler

    Note over W1,W3: 3 个 worker 共享 cursor 游标<br/>while 循环："干完一片领下一片"

    W1->>A: POST /geeker/upload/chunk?index=0&filename=xxx（cancel: false 跳过去重！）
    W2->>A: POST ...chunk?index=1...
    W3->>A: POST ...chunk?index=2...
    A->>MK: 匹配 pattern '/geeker/upload/chunk' + POST
    MK->>MK: uploadedChunks.get(filename).add(0/1/2)  ← 记录已收片
    MK-->>W1: { code: 200, msg: 'chunk 0 ok' }
    MK-->>W2: { code: 200, msg: 'chunk 1 ok' }
    MK-->>W3: { code: 200, msg: 'chunk 2 ok' }
    W1->>W1: completedCount++ → progress = 1/423 → 更新进度条
    W1->>A: 领下一片 index=3 ...（循环直到 422 全部传完）
```

### 这一步的三个关键设计

1. **`{ cancel: false }`**（uploadChunkApi 第三参数）——**没有它整个上传直接崩**：423 个请求的 method+url 相同、FormData 序列化后都是 `{}`，去重 key 全相同，AxiosCanceler 会把每个新片当成"重复请求"取消掉前一片（CanceledError 坑）
2. **游标共享**：`pendingIndexes[cursor++]` 是原子操作（JS 单线程），3 个 worker 不会领到同一片
3. **进度公式**：`progress = completedCount / totalChunks × 100`——每片等大，按片数算即可

---

## 阶段五：merge + 成功提示

```mermaid
sequenceDiagram
    participant H as useChunkUpload
    participant A as axios
    participant MK as mock/upload.js merge handler
    participant UI as 页面

    H->>H: Promise.all 完成（423 片全部传完）
    H->>A: mergeChunksApi({ filename, totalChunks: 423 })
    A->>MK: POST /geeker/upload/merge
    MK->>MK: uploadedChunks.delete(filename)  ← 清理记录（上传任务闭环）
    MK-->>H: { code: 200, data: { url: '/files/xxx.zip' } }
    H->>H: progress = 100
    H->>UI: ElMessage.success('上传成功')  ← 你看到的提示
```

---

## 全链路一张总图

```mermaid
flowchart TD
    subgraph 数据层
        MENU["mock/menu/list.js<br/>菜单数据"]
        UP["mock/upload.js<br/>chunk/check/merge 三接口<br/>uploadedChunks Map"]
    end
    subgraph 服务层
        API["api/modules/upload.ts<br/>uploadChunkApi/checkChunkApi/mergeChunksApi"]
        HTTP["api/index.ts<br/>RequestHttp 拦截器"]
    end
    subgraph 逻辑层
        HOOK["hooks/useChunkUpload.ts<br/>切片/并发池/进度/终止"]
    end
    subgraph 视图层
        VIEW["views/upload/index.vue<br/>el-upload + 进度条"]
    end

    MENU -->|"菜单渲染"| LAYOUT["LayoutClassic 侧边栏"]
    LAYOUT -->|"handleMenuClick"| GUARD["路由守卫"]
    GUARD -->|"匹配动态路由 /upload"| VIEW
    VIEW -->|"handleChange → uploadFile"| HOOK
    HOOK <-->|"check/chunk/merge 三请求"| HTTP
    HTTP <-->|"拦截 /geeker/*"| UP
```

---

## 十个关键文件速查

| #   | 文件                      | 职责         | 关键函数/变量                                                   |
| --- | ------------------------- | ------------ | --------------------------------------------------------------- |
| 1   | `mock/menu/list.js`       | 菜单数据源   | 菜单 JSON                                                       |
| 2   | `LayoutClassic/index.vue` | 菜单点击跳转 | `handleMenuClick`                                               |
| 3   | `routers/index.ts`        | 导航安检     | `beforeEach` 守卫                                               |
| 4   | `dynamicRouter.ts`        | 动态路由注册 | `initDynamicRouter`、`transformMenuToRoute`                     |
| 5   | `views/upload/index.vue`  | 上传页       | `handleChange`、`progress`                                      |
| 6   | `hooks/useChunkUpload.ts` | **核心逻辑** | `uploadFile`、`uploadOne`、`chunks`、`cursor`、`completedCount` |
| 7   | `api/modules/upload.ts`   | 接口声明     | `uploadChunkApi`、`checkChunkApi`、`mergeChunksApi`             |
| 8   | `api/index.ts`            | 拦截器层     | 请求/响应拦截器、`cancel: false` 逃生舱                         |
| 9   | `build/mockServer.ts`     | Mock 入口    | `urlPrefixes`、JSON body 中间件                                 |
| 10  | `mock/upload.js`          | 假后端       | `uploadedChunks` Map、三个 handler                              |

---

## 断点续传与主动终止要点速记

### 断点续传三要素

1. **切片**：文件切成可定位的单元（`file.slice`）
2. **check 接口**：查询服务端已收到的片序号
3. **跳过已传**：游标遍历"待传列表"（`pendingIndexes`），进度从已有片数起步

### 主动终止两件事

1. `abortFlag = true` —— 阻止新片开始（循环条件）
2. `sharedController.abort()` —— 中断正在飞的请求（axios `signal`）

### 本次实战踩过的坑

| 坑                           | 根因                                       | 解法                                  |
| ---------------------------- | ------------------------------------------ | ------------------------------------- |
| `CanceledError`              | 去重 key 相同（FormData 序列化都是 {}）    | `{ cancel: false }` 逃生舱            |
| check 接口 404               | mock 文件模板字符串未闭合（反引号+单引号） | 修复语法 + 重启 dev                   |
| `checkApi is not defined`    | hook 里没解构                              | 解构补上                              |
| `checkApi is not a function` | 演示页没传配置                             | `checkApi: checkChunkApi`             |
| `object is not iterable`     | 忘了解包 `res.data`                        | `new Set(res.data)`                   |
| 刷新动态路由页 404           | 兜底重定向发生在守卫前                     | 守卫用 `to.redirectedFrom` 找回原目标 |

---

_文档生成时间：2026-09-27 ｜ 项目路径：F:\frontend-program\vue\my-admin_
