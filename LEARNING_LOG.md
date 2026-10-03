# MyAdmin 项目学习全记录

> 从 0 到 1 构建 Vue3 + TypeScript 后台管理系统（复刻 Geeker-Admin）的完整学习笔记
> 学习模式：**你写 → AI 审 → 你改**（先尝试自己写代码，再由 AI review 纠错）
> 开始时间：2026-08-05 ｜ 技术栈：Vue 3.5 + TypeScript + Vite + Pinia + Element Plus
> 完成时间：2026-10-03 ｜ 12 阶段 + 7 进阶阶段 + 57 个踩坑记录，前后端联调验证通过

---

## 目录

- [项目总览](#项目总览)
- [阶段 1：项目脚手架搭建](#阶段-1项目脚手架搭建)
- [阶段 2：工程化规范配置](#阶段-2工程化规范配置)
- [阶段 3：环境变量与 Vite 深度配置](#阶段-3环境变量与-vite-深度配置)
- [阶段 4：目录结构设计与基础样式](#阶段-4目录结构设计与基础样式)
- [阶段 5：API 层 — Axios 企业级封装](#阶段-5api-层--axios-企业级封装)
- [阶段 6：路由系统](#阶段-6路由系统)
- [阶段 7：状态管理 — Pinia + 持久化](#阶段-7状态管理--pinia--持久化)
- [阶段 8：布局系统与登录页](#阶段-8布局系统与登录页)
- [Git 版本控制实战](#git-版本控制实战)
- [阶段 9：全局组件开发](#阶段-9全局组件开发)
- [阶段 10：自定义指令与 Hooks](#阶段-10自定义指令与-hooks)
- [阶段 11：国际化与 Mock 数据（动态路由收官）](#阶段-11国际化与-mock-数据动态路由收官)
- [阶段 12：构建优化与部署](#阶段-12构建优化与部署)
- [踩坑记录全集](#踩坑记录全集)
- [核心机制深度问答](#核心机制深度问答)
- [项目收官与进阶建议](#项目收官与进阶建议)

---

## 项目总览

### 技术栈

| 技术                        | 用途                                                    |
| --------------------------- | ------------------------------------------------------- |
| Vue 3.5（`<script setup>`） | 前端框架                                                |
| TypeScript                  | 类型安全                                                |
| Vite                        | 构建工具（开发服务器 + 打包）                           |
| Pinia + persistedstate      | 状态管理 + 持久化                                       |
| Element Plus                | UI 组件库                                               |
| vue-router                  | 路由（hash 模式）                                       |
| axios                       | HTTP 请求                                               |
| pnpm                        | 包管理（注意：必须用 pnpm，项目有 pnpm-workspace.yaml） |

### 依赖链架构

```
基础设施层 → 工程化层 → 核心服务层 → 业务逻辑层 → 用户界面层
(阶段1-2)    (阶段3-4)   (阶段5-7)     (阶段8-9)    (阶段10-12)
```

### 最终目录结构

```
my-admin/
├─ .env / .env.development / .env.production / .env.test   # 多环境配置
├─ .editorconfig / .prettierrc.cjs / eslint.config.js      # 代码规范
├─ .stylelintrc.cjs / commitlint.config.cjs / lint-staged.config.cjs
├─ .husky/                    # Git hooks（pre-commit + commit-msg）
├─ build/                     # Vite 配置模块
│  ├─ getEnv.ts               # 环境变量类型转换
│  ├─ proxy.ts                # 跨域代理
│  ├─ plugins.ts              # 插件注册（含 dropConsolePlugin）
│  ├─ mockServer.ts           # 本地 Mock 插件
│  └─ vite-env.d.ts           # ViteEnv 类型声明
├─ mock/                      # Mock 处理器（MockHandler 数组格式）
├─ index.html                 # HTML 入口（Vite 设计：HTML 驱动 JS）
├─ vite.config.ts             # Vite 总配置
├─ src/
│  ├─ api/                    # 接口层
│  │  ├─ index.ts             # RequestHttp 类（核心）
│  │  ├─ helper/              # checkStatus + axiosCancel
│  │  ├─ interface/           # 接口类型
│  │  └─ modules/             # 按业务拆分（login.ts）
│  ├─ assets/icons/           # SVG 图标（雪碧图方案）
│  ├─ components/             # 全局组件
│  │  ├─ SvgIcon/ SwitchDark/ ErrorMessage/
│  │  └─ ProTable/            # 核心表格组件（配置化）
│  ├─ config/                 # 全局常量 + nprogress
│  ├─ directives/             # 7 个自定义指令
│  ├─ enums/                  # HTTP 枚举
│  ├─ hooks/                  # 8 个组合式函数
│  ├─ languages/              # i18n 中英文语言包
│  ├─ layouts/                # LayoutClassic 布局
│  ├─ routers/                # 静态路由 + 动态路由 + 守卫
│  ├─ stores/                 # Pinia（user/auth/global/tabs/keepAlive）
│  ├─ styles/                 # reset/var/common/element/element-dark
│  ├─ typings/                # 全局类型声明
│  ├─ utils/                  # 工具函数
│  ├─ views/                  # 页面（login/home/error/proTable/directives/system）
│  ├─ App.vue                 # 根组件（router-view + 暗黑恢复）
│  └─ main.ts                 # 入口（注册顺序：ElementPlus → router → pinia）
```

### Git 提交历史

| 提交 | 内容                                                                     |
| ---- | ------------------------------------------------------------------------ |
| 1    | feat: 完成项目脚手架到登录布局的开发（阶段1-8）                          |
| 2    | feat: 阶段9 完成全局组件开发（SvgIcon/SwitchDark/ErrorMessage/ProTable） |
| 3    | feat: 阶段10 完成自定义指令与Hooks开发                                   |
| 4    | feat: 阶段11 完成国际化与Mock数据及完整动态路由体系                      |
| 5    | feat: 阶段12 完成构建优化与部署配置                                      |
| 6    | feat: ProTable增强（虚拟滚动/表单联动/分片上传+断点续传）                |
| 7    | test: 为useChunkUpload添加单元测试（含若干 fix/ci 提交）                 |
| 8    | feat: 多级菜单与页面缓存（KeepAlive）落地                                |
| 9    | feat: 按钮权限闭环（mock权限接口+v-auth全量挂载）                        |
| 10   | feat: ECharts数据可视化（封装图表组件+dashboard仪表盘）                  |
| 11   | feat: 轮询自动刷新（usePolling hook+实时看板）                           |

---

## 阶段 1：项目脚手架搭建

### 目标

用 Vite 创建 Vue3 + TS 空项目，理解 4 个核心文件。

### 命令与知识点

```bash
pnpm create vite my-admin --template vue-ts
```

- `pnpm create vite` = 用 pnpm 执行 Vite 脚手架工具
- `my-admin` = 目录名（kebab-case 是 npm 生态约定；PascalCase 如 MyAdmin 用于产品名）
- `--template vue-ts` = Vue3 + TypeScript 模板

### 4 个核心文件

| 文件             | 作用                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `package.json`   | 项目身份证。`dependencies`（运行时需要，会打包）vs `devDependencies`（开发构建需要，不打包）；`"type": "module"` 启用 ESM   |
| `vite.config.ts` | 构建工具大脑。`defineConfig` 提供智能提示                                                                                   |
| `index.html`     | **在根目录**（Vue CLI 在 public/）。Vite 哲学：HTML 是应用入口，HTML 驱动 JS（`<script type="module" src="/src/main.ts">`） |
| `tsconfig.json`  | 新版 Vite 模板用项目引用拆成 tsconfig.app.json（浏览器环境）+ tsconfig.node.json（Node 环境，管 vite.config.ts）            |

### 协作关系

```
用户访问 → index.html → main.ts → App.vue（挂载到 <div id="app">）
         背后：vite.config.ts 编译、tsconfig.json 类型检查
```

---

## 阶段 2：工程化规范配置

### 代码质量流水线

```
写代码时                       git commit 时
─────────                      ────────────
EditorConfig（缩进/编码）      lint-staged 自动运行：
Prettier（格式化）              ├─ Prettier 格式化暂存文件
ESLint（代码质量）              ├─ ESLint 检查质量
Stylelint（样式规范）           └─ Stylelint 检查样式
                              commitlint 校验提交信息格式
```

### 各文件要点

| 文件                     | 关键配置                                      | 为什么                                                                                     |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `.editorconfig`          | `indent_size = 2`、`end_of_line = lf`         | 跨编辑器统一；LF 避免 Windows CRLF 污染 diff                                               |
| `.prettierrc.cjs`        | `printWidth: 200`                             | 后台代码行长，默认 80 换行太频繁                                                           |
| `eslint.config.js`       | 扁平配置（见踩坑 #6）                         | ESLint 10 只认此格式                                                                       |
| `.stylelintrc.cjs`       | `declaration-property-value-no-unknown: null` | 允许 SCSS 变量出现在属性值                                                                 |
| `commitlint.config.cjs`  | Conventional Commits                          | `feat: xxx` / `fix: xxx` / `docs:` / `style:` / `refactor:` / `perf:` / `test:` / `chore:` |
| `lint-staged.config.cjs` | 按文件类型分发任务                            | 只检查 git add 的文件，秒级出结果                                                          |
| `.husky/pre-commit`      | `pnpm lint:lint-staged`                       | 检查不过 → 拒绝提交                                                                        |
| `.husky/commit-msg`      | `pnpm exec commitlint --edit $1`              | 信息格式不对 → 拒绝提交                                                                    |

### 核心概念

- **ESLint vs Prettier**：质量 vs 格式。`eslint-config-prettier` 关掉 ESLint 中与 Prettier 重叠的格式规则
- **husky init 只生成 pre-commit**，commit-msg 要手动创建
- `.cjs` 后缀：`"type": "module"` 下强制 CommonJS

---

## 阶段 3：环境变量与 Vite 深度配置

### Vite 环境变量加载机制

```
.env                公共配置（所有环境共享）
  ↓ 覆盖
.env.development    pnpm dev 时加载
.env.production     pnpm build:pro 时加载
.env.test           pnpm build:test 时加载
```

`.env` 里所有值**都是字符串**，`wrapperEnv()` 做类型转换（"true"→布尔、"8848"→数字、JSON 字符串→数组）。

### 数据流向

```
pnpm dev → loadEnv("development") → wrapperEnv() → viteEnv
  → server: { port: 8848, open: true }
  → plugins: createVitePlugins(viteEnv)
  → proxy: createProxy(viteEnv.VITE_PROXY)
```

### 关键配置

- **端口 8848**：`.env` 第 5 行 `VITE_PORT = 8848`
- **自动开浏览器**：`.env` 第 8 行 `VITE_OPEN = true`
- **路径别名**：`"@": resolve(__dirname, "./src")` — 任何文件里 `@/xxx` = `src/xxx`（避免 `../../../` 地狱；tsconfig 的 paths 要同步配）
- **SCSS 全局注入**：`additionalData: '@use "@/styles/var.scss" as *;'` — 任何组件的 `<style lang="scss">` 不用 import 就能用 `$primary-color`
- **代理原理**：开发时浏览器 → Vite（伪装成后端）→ 真实后端，绕过跨域

### 常用插件（build/plugins.ts）

| 插件                     | 作用                              |
| ------------------------ | --------------------------------- |
| vite-plugin-html         | `<%- title %>` 占位符动态注入标题 |
| vite-plugin-svg-icons    | SVG 雪碧图（阶段 9 用）           |
| vite-plugin-compression  | gzip/brotli 压缩                  |
| rollup-plugin-visualizer | 打包体积分析                      |
| vite-plugin-pwa          | 离线缓存                          |

---

## 阶段 4：目录结构设计与基础样式

### 样式四层体系

```
reset.scss      重置浏览器默认样式（box-sizing: border-box 等）
var.scss        CSS 变量（主题色、布局尺寸）→ 全局注入
common.scss     工具类（.flex-center、.text-ellipsis）
element.scss    Element Plus 样式覆盖
element-dark.scss  暗黑模式变量（html.dark 作用域）
```

### 关键知识点

- `box-sizing: border-box`：width 包含 padding，不再撑大盒子
- **SCSS 变量不能写在内联 `style=""` 里**（浏览器不认识 `$`），只能写在 `<style lang="scss">` 块
- `scoped` 属性：样式只作用于当前组件

---

## 阶段 5：API 层 — Axios 企业级封装

### 为什么不能直接用 axios？

| 问题                 | 封装方案                            |
| -------------------- | ----------------------------------- |
| 每个请求手动写 token | 请求拦截器自动注入 `x-access-token` |
| 失败要手动弹错误     | 响应拦截器统一 ElMessage.error      |
| 连点按钮发重复请求   | AxiosCanceler 自动取消前一个        |
| 登录过期要跳转       | 拦截器统一判断 code === 401         |
| loading 动画         | 拦截器统一控制                      |

### 核心：RequestHttp 类（src/api/index.ts）

```
请求 → [请求拦截器] → 服务器 → [响应拦截器] → 你的代码
        ↑ ①取消重复 ②loading ③注入token      ↑ ①登录过期 ②业务错误 ③HTTP错误
```

- **用类不用函数**：状态管理（service 实例）+ 方法复用（get/post/put/delete/download 5 个方法）
- **泛型**：`get<T>(url)` — 调用 `loginApi(params)` 返回 `Promise<ResultData<LoginResult>>`，`res.data.access_token` 有智能提示
- **AxiosCanceler**：AbortController + Map。key = method+url+params+data，相同 key 的请求取消前一个
- **单例导出**：`export default new RequestHttp(config)` 全应用共享一个实例
- `withCredentials: true`：跨域携带 cookie

---

## 阶段 6：路由系统

### 静态路由 vs 动态路由（安全本质）

|            | 静态路由                 | 动态路由                    |
| ---------- | ------------------------ | --------------------------- |
| 注册时机   | 启动时（createRouter）   | 登录后（addRoute）          |
| 典型内容   | /login /404 /500 /layout | /system/user 等按角色       |
| 未登录访问 | 守卫拦截                 | **路由表不存在 → 直接 404** |

**藏菜单 ≠ 权限控制**。只有"不注册 = 不存在"才是真正的安全：普通用户登录后路由表里根本没有 /system/user，手输 URL 也进不去。

### 守卫流程（阶段 8 完善版）

```
每次导航：
① NProgress.start()
② 设置页面标题（to.meta.title，兜底 MyAdmin）
③ 已登录访问 /login → 踢回首页
④ 未登录访问 /login → 放行（★ 否则死循环）
⑤ 白名单 → 放行
⑥ 未登录 → 重定向 /login
⑦ 已登录但菜单未初始化 → initDynamicRouter() → return { ...to, replace: true } 重新导航
⑧ 放行
```

### 新 API：return 替代 next()

| 旧（废弃）                | 新                         |
| ------------------------- | -------------------------- |
| `next()`                  | `return true`              |
| `next("/home")`           | `return "/home"`           |
| `next({ path, replace })` | `return { path, replace }` |

**函数签名里不能出现 `next` 参数**——只要有 `next`，vue-router 就按旧风格检查。

### `return { ...to, replace: true }` 的含义

- 展开 `to`（当前目标路由的全部字段）+ `replace: true`
- 中止本次导航 → 以 replace 方式重新导航 → 守卫从头再跑一遍
- 为什么必须：菜单数据要**先于渲染**就绪；阶段 11 后动态路由必须先 addRoute 再匹配（否则刷新 /system/user 直接 404）
- `replace: true`：历史记录不留重复条目，后退键行为正常

---

## 阶段 7：状态管理 — Pinia + 持久化

### Pinia vs Vuex

砍掉 mutations；TS 原生支持；独立 store 扁平化。

### 三层架构（重要！）

```
守卫 → userStore.token → Pinia 状态 ← 持久化插件 ← localStorage 的 "user" 键
```

- 持久化插件：`persist: createPersistedState("user", ["token", "userInfo"])`
- **存储格式**：键名 = store 名（"user"），值 = JSON 字符串
- 手动测试：`localStorage.setItem("user", JSON.stringify({ token: "test123", userInfo: {} }))`
- `useUserStore()` 必须写在**函数内部**（守卫函数里），不能写模块顶层——模块加载时 pinia 还没 install

### 5 个 store 分工

| Store     | 职责                               |
| --------- | ---------------------------------- |
| user      | token + 用户信息（持久化）         |
| auth      | 按钮权限列表 + 菜单列表 + 扁平路由 |
| global    | 语言、组件大小、主题配置（持久化） |
| tabs      | 标签页列表                         |
| keepAlive | 页面缓存名单                       |

---

## 阶段 8：布局系统与登录页

### 布局结构

```
┌──────────┬──────────────────────────┐
│ 侧边栏    │ 顶部栏（折叠/面包屑/暗黑/头像）│
│ Logo+菜单 ├──────────────────────────┤
│          │ 标签页                    │
│          ├──────────────────────────┤
│          │ 主内容区 <router-view />  │
│          ├──────────────────────────┤
│          │ 页脚                      │
└──────────┴──────────────────────────┘
```

### 关键知识点

- 布局 = 画框，router-view = 画布。切路由只换画布
- `:deep()` 穿透 scoped 样式到子组件内部
- `html.dark .layout-main` 在 scoped 里能用——html 是全局元素不参与 scope 匹配
- 退出登录：`userStore.loginOut()` + `router.replace(LOGIN_URL)`
- afterEach 自动记录标签页（登录页除外）

---

## Git 版本控制实战

### 三区模型

```
工作区 → git add → 暂存区 → git commit → 仓库（历史快照）
```

### 日常命令

```bash
git status                # 看状态
git diff                  # 看改动
git add .                 # 入暂存区
git commit -m "feat: xxx" # 提交（触发 husky 工具链）
git log --oneline         # 看历史
git checkout -- 文件名     # 撤销工作区改动（后悔药）
git reset --soft HEAD~1   # 撤销最近一次提交
git branch feature-xxx    # 分支（多人在主线稳定版上开功能分支）
```

### 每次大改动前先提交 = 存游戏存档点

---

## 阶段 9：全局组件开发

### 抽组件判断标准

"这段模板/逻辑会不会在 2+ 处出现？"

### SvgIcon（SVG 雪碧图）

```
构建时：vite-plugin-svg-icons 把 src/assets/icons/*.svg
       全部注入页面为 <symbol id="icon-xxx">
使用时：<use href="#icon-xxx" /> → 零请求、可改色（fill="currentColor"）、可改大小
```

### SwitchDark（暗黑模式）

```
切换：globalStore.setThemeConfig({isDark}) + document.documentElement.classList.toggle("dark")
生效：element-dark.scss 引入 element-plus 官方暗黑变量（html.dark 作用域下 el-* 全部变色）
恢复：App.vue onMounted 检查持久化的 isDark 重新挂 class
```

### ErrorMessage（错误页）

三个页面结构相同文案不同 → 抽组件，props 传 code/message。

### ProTable（配置化核心）

**设计哲学：Configuration over Code** —— 表格长什么样 = 一份配置数据：

```ts
const columns = [
  { prop: "id", label: "ID" },
  { prop: "username", label: "用户名", search: { el: "input" } },   // 自动进搜索栏
  { prop: "status", label: "状态", search: { el: "select", options: [...] } },
];
```

- **插槽逃生舱**：配置解决不了的 10% 场景用插槽（`#column-字段名` 自定义单元格、`#operation` 操作列）
- `$slots.operation` 判断插槽是否被使用，没定义就不渲染操作列
- **defineExpose**：暴露 `getTableList`、`selectedRows` 给父组件（通过 ref 调用）
- 类型导出：普通 `<script>` 块 export interface，`<script setup>` 里用——SFC 双 script 块模式
- 从 .vue 文件导入类型：`import type { ColumnProps } from "@/components/ProTable/index.vue"`

---

## 阶段 10：自定义指令与 Hooks

### 四种代码复用机制分工

| 机制      | 管什么                    | 例子                       |
| --------- | ------------------------- | -------------------------- |
| 组件      | 完整 UI（模板+逻辑+样式） | ProTable、SvgIcon          |
| **指令**  | 对已有 DOM 元素附加行为   | v-copy、v-auth、v-debounce |
| **Hooks** | 逻辑复用（状态+副作用）   | useTable、useOnline        |
| 工具函数  | 纯计算，无状态            | 格式化日期                 |

**判断标准**：给元素加行为 → 指令；复用逻辑 → Hook；渲染 UI → 组件。

### 指令的 7 个生命周期钩子

```
created → beforeMount → mounted(★最常用) → beforeUpdate → updated
→ beforeUnmount(★清理) → unmounted
```

钩子参数：

- `el` — 绑定的 DOM 元素
- `binding.value` — `v-xxx="值"` 的值
- `binding.arg` — `v-xxx:事件名` 冒号后的部分
- `binding.modifiers` — 点修饰符

### 7 个指令速查

| 指令          | 用途     | 核心实现                                                                                         |
| ------------- | -------- | ------------------------------------------------------------------------------------------------ |
| v-auth        | 按钮权限 | mounted 时查权限列表，无权限 `el.parentNode?.removeChild(el)`（不能自删，让父删子）              |
| v-copy        | 一键复制 | `navigator.clipboard.writeText`（仅 https/localhost）                                            |
| v-debounce    | 防抖     | 每次触发清 timer 重计时（"电梯门：有人进就重新计时"）                                            |
| v-throttle    | 节流     | isLocked 锁，1 秒最多执行一次（"地铁闸机：固定节奏放行"）                                        |
| v-longpress   | 长按     | mousedown 计时 800ms，mouseup/mouseout 取消                                                      |
| v-draggable   | 拖拽     | mousedown 记录差值；**mousemove 监听在 document 上**（否则鼠标滑出元素丢跟踪）；mouseup 移除监听 |
| v-waterMarker | 水印     | Canvas 画字 → toDataURL 转背景图 → 平铺 div + `pointer-events: none` 点击穿透                    |

**防抖 vs 节流（面试高频）**：

|          | 防抖           | 节流                 |
| -------- | -------------- | -------------------- |
| 触发节奏 | 不规律（输入） | 持续高频（滚动）     |
| 执行时机 | 最后一次后延迟 | 每 N 秒固定          |
| 场景     | 搜索框、resize | 滚动加载、按钮防连点 |

**内存泄漏防护**：beforeUnmount 必须清理监听器和定时器（元素销毁了，它们还活着 = 泄漏）。

### 8 个 Hooks 速查

| Hook           | 用途               | 核心                                                             |
| -------------- | ------------------ | ---------------------------------------------------------------- |
| useOnline      | 网络状态           | navigator.onLine + online/offline 事件                           |
| useTime        | 时钟               | setInterval 每秒                                                 |
| useSelection   | 表格多选           | ref 选中行 + computed 派生 selectedIds                           |
| useTable       | 表格数据           | ProTable 的逻辑版（给裸 el-table 用）                            |
| useDownload    | 文件下载           | Blob → createObjectURL → a.click() → **revokeObjectURL 释放**    |
| useTheme       | 换主题色           | 改 `--el-color-primary` CSS 变量 + 计算浅色变体                  |
| useHandleData  | 二次确认删除       | ElMessageBox.confirm 返回 Promise（取消=reject，try/catch 静默） |
| useAuthButtons | 权限判断（逻辑版） | v-auth 管模板显隐，它管 JS 判断                                  |

### Hook 命名与判断

- `use` 开头；内部有 ref 响应式状态或生命周期钩子
- 对比 Vue2 mixin：Hook 来源清晰（import 明确），无命名冲突

---

## 阶段 11：国际化与 Mock 数据（动态路由收官）

### 目标

本地 Mock 服务器 + **真正的动态路由** + vue-i18n 中英文切换。

### Mock 服务器（build/mockServer.ts + mock/*.js）

- 插件：vite-plugin-mock-server，`urlPrefixes: ["/geeker/"]`
- **mock 文件必须是 MockHandler 数组格式**（`{ pattern, method, handle }`）——导出裸函数会被插件当"工厂函数"在加载时无参调用（坑 21）
- 插件默认不解析请求体 → 自定义 JSON body 解析中间件；默认文件后缀 `.mock.js` → 配 `mockJsSuffix: ".js"`
- 依赖 esbuild 需手动安装（Vite 8 不再传递依赖，坑 19）

### 完整动态路由链路

```
守卫 → initDynamicRouter(router)
  → getMenuListApi() 拿菜单 JSON（component 是字符串）
  → import.meta.glob 映射表把 "proTable/index" 翻译成组件
  → addRoute('layout', route)（hasRoute 防御重复注册）
  → setAuthMenuList（侧边栏渲染）+ setFlatMenuList（★只记真正动态添加的！）
```

- **"不注册=不存在"**：业务页从 staticRouter 移除 → 未登录访问 /system/user 直接 404
- **flatMenuList 只记真正 addRoute 的路由**——否则 resetRouter 误删静态 home（坑 24）

### 国际化（vue-i18n）

- `createI18n({ legacy: false })` + `messages: { zh, en }`，语言包按模块嵌套（login.xxx / layout.xxx）
- 切换 = `setLanguage`（持久化）+ `i18n.global.locale.value`（立即生效）——两步缺一不可
- `t()` 找不到 key 时**返回 key 本身**（"layout.logout" 字样的来源，坑 26）
- Element 组件语言：App.vue 的 `el-config-provider :locale`
- 刷新恢复：languages/index.ts 直接读 localStorage（模块加载时 pinia 未激活）

### logout 五件套清理

`loginOut` + `resetRouter` + `tabsStore.$reset()` + `keepAlive 清空` + `回登录页`——缺一个就是坑（24/27）。

---

## 阶段 12：构建优化与部署

### 构建脚本

`build:dev/test/pro` = `vue-tsc -b && vite build --mode xxx`（类型检查不过就不打包；`--mode` 决定加载哪份 .env）

### Vite 8 / TS 6 时代适配（本阶段踩坑精华，见坑 29）

- **build.esbuild 已移除** → console 剔除改用自定义 transform 插件（dropConsolePlugin，`apply: "build"`）
- TS 6 `baseUrl` 废弃 → paths 写 `"./src/*"`
- `erasableSyntaxOnly` 禁 enum → const 对象 + `as const`
- `verbatimModuleSyntax` → 类型一律 `import type`
- 第三方类型改名：`PersistedStateOptions` → `PersistenceOptions`、`paths` → `pick`（报错信息会提示新名字）

### 产物优化

- hash 文件名 = 缓存策略基础（内容变名字变，长缓存无风险）
- gzip/brotli 预压缩（`VITE_BUILD_COMPRESS = gzip,brotli`）+ nginx `gzip_static`
- visualizer 打包分析（`VITE_REPORT=true` → stats.html）
- PWA：生产需 HTTPS；测试时注意 SW 缓存旧代码（无痕窗口最稳）

### 部署（nginx + Docker）

- dist 是纯静态文件，由 nginx 分发；**hash 路由无需 history fallback**
- **Mock 只在 dev 存在**——生产必须真实后端，本地测试可用 nginx `return JSON` 临时模拟（坑 30）
- 本地验证路径：WSL + Docker 挂载 dist 和 nginx.conf → 浏览器访问 → 云服务器
- 常用命令：`nginx -t`（查语法）、`nginx -s reload`（热重载）、`docker logs`（看日志）

### 验收

- console.log 剔除验证（grep dist；"debugger" 匹配可能是库文案误报，埋点测试是决定性证据）
- 部署后登录/菜单/页面全流程正常

---

## 踩坑记录全集

### 坑 1：删了 style.css 但 main.ts 还在引用

**报错**：`Failed to resolve import "./style.css" from "src/main.ts"`
**解法**：删文件时同步删引用。

### 坑 2：husky init 报 .git can't be found

**原因**：Vite 模板不初始化 Git 仓库
**解法**：先 `git init`。

### 坑 3：husky init 后没有 commit-msg

**原因**：husky init 只生成 pre-commit
**解法**：手动创建 `.husky/commit-msg`，内容 `pnpm exec commitlint --edit $1`。Windows 下 echo 重定向可能写成 UTF-16，用编辑器手动粘贴最稳。

### 坑 4：build/plugins.ts 报 5 个 UNRESOLVED_IMPORT

**原因**：import 了但没安装依赖
**解法**：`pnpm add -D vite-plugin-html vite-plugin-svg-icons vite-plugin-pwa rollup-plugin-visualizer vite-plugin-compression sass`

### 坑 5：`$primary-color` 写在内联 style 里无效

**原因**：SCSS 变量只在 `<style lang="scss">` 块内有效，浏览器不认识 `$`
**解法**：移到 `<style>` 块。

### 坑 6（大坑）：ESLint 10 废弃 .eslintrc.cjs

**报错**：`ESLint couldn't find an eslint.config.(js|mjs|cjs) file`
**原因**：ESLint 10 只认扁平配置 eslint.config.js
**迁移要点**：

- `env: { browser: true }` → `globals: { ...globals.browser }`（需安装 globals 包）
- `.eslintignore` 文件 → 配置里 `ignores` 字段
- `extends: ["plugin:vue/..."]` → `...pluginVue.configs["flat/recommended"]` 数组展开
- `--ext` 参数已删除 → script 改 `eslint --fix ./src`

### 坑 7（连环坑）：Vue 格式规则与 Prettier 打架

**报错**：`prettier/prettier` 10 个 error 无法自动修复 + 一堆 vue/xxx 警告
**原因**：eslint-plugin-prettier 内嵌了**旧版** eslint-config-prettier（旧版主入口不含 Vue 规则），导致 Vue 格式规则没被关闭，两边规则互相拉扯
**排查方法（重要技能）**：

1. `eslint --print-config 文件` 看最终生效配置
2. `node -e` 直接检查插件导出内容
   **解法**：`import prettierConfig from "eslint-config-prettier/flat"` + `...prettierConfig.rules`（v10 完整规则含 Vue 关闭项）

### 坑 8：`config.cancel && axiosCanceler.addPending(config)` 被拦截

**报错**：`@typescript-eslint/no-unused-expressions`
**解法**：改 `if (config.cancel) axiosCanceler.addPending(config);`

### 坑 9：`import { RouteRecordRaw } from "vue-router"` 报不导出

**报错**：`does not provide an export named 'RouteRecordRaw'`
**原因**：新版 Vite 模板 `verbatimModuleSyntax: true`，类型导入必须显式写 `import type`
**判断规则**：只出现在冒号后面（类型位置）= `import type`；在等号右边使用（值）= 普通 import

### 坑 10：白屏 — 无限重定向死循环

**报错**：`[VUE_ROUTER_R0023] The "next" callback was never called`
**原因**：守卫里"未登录 → 跳登录页"的判断在"访问登录页 → 放行"**之前**，导致 /login 永远重定向到 /login
**解法**：先判断 `to.path === LOGIN_URL && !token → return true`
**经验**：白屏时看浏览器 Console 第一条报错，逐层排查导航流程。

### 坑 11：守卫混用 next() 和 return

**报错**：`Invalid navigation guard`
**原因**：函数签名里保留 `next` 参数但部分分支用 return
**解法**：签名 `async (to) =>`，全部用 return（`return true` / `return "路径"` / `return { path }`）

### 坑 12：afterEach 回调没写 to 参数

**报错**：`to is not defined`
**解法**：`router.afterEach((to) => {...})`

### 坑 13：@/store 拼成 @/store（少 s）

**报错**：`Failed to resolve import "@/store/modules/global"`
**排查技巧**：`@` 换成 `src` 拼真实路径去文件管理器确认。

### 坑 14：组件标签没闭合

**报错**：`Element is missing end tag`
**解法**：自闭合 `<Xxx />` 或成对 `<Xxx></Xxx>`，二选一。

### 坑 15：vue-router 新版本 next() 废弃警告

**报错**：`[VUE_ROUTER_R0025] The next() callback is deprecated`
**解法**：改用 return 值（见坑 11）。

### 坑 16：stylelint 报 SCSS 变量无法解析

**报错**：`Cannot parse property value "linear-gradient(...$primary-color...)"`
**解法**：`.stylelintrc.cjs` 加 `"declaration-property-value-no-unknown": null`

### 坑 17：pina 假包！

**发现**：package.json 里出现 `"pina": "0.0.1-security.2"` —— npm 上的**恶意山寨包**（typosquatting）
**解法**：`pnpm remove pina`
**教训**：安装依赖看清拼写；package.json 里出现不认识的东西要警惕。

### 坑 18：rgba 旧写法被 stylelint 拦截

**报错**：`Expected "rgba" to be "rgb"`
**解法**：`stylelint --fix` 自动转现代写法 `rgb(0 0 0 / 15%)`。

### 坑 19：vite-plugin-mock-server 报 Cannot find package 'esbuild'

**原因**：Vite 8（Rolldown 内核）不再传递依赖 esbuild，插件自己又没声明
**解法**：`pnpm add -D esbuild`
**经验**：报错路径在 `node_modules/.pnpm/某个插件/` 里 = 插件依赖缺失，手动补装即可。

### 坑 20：pnpm 拦截依赖安装脚本（IGNORED_BUILDS 连环坑）

**原因**：pnpm 10+ 安全机制——默认禁止所有 postinstall（防供应链投毒，呼应坑 17 的 pina 假包）
**解法**：`pnpm-workspace.yaml` 里 `allowBuilds` 用**"包名: true" 映射格式**（pnpm 11 不是列表格式！）
**教训**：配置文件不生效时，第一步是读文件内容，而不是再跑命令；小配置文件坏了就"全部删光重写"。

### 坑 21：Mock 文件报 TypeError: reading 'body'

**原因**：插件把函数导出当"工厂函数"在**加载时**无参调用；正确格式是 MockHandler 数组
**解法**：`export default [{ pattern: '/geeker/xxx', method: 'POST', handle: (req, res) => {...} }]`

### 坑 22：POST /geeker/login 404

**原因**：① 插件默认找 `*.mock.js` 文件（需配 `mockJsSuffix: ".js"`）；② 插件默认不解析请求体（req.body 为 undefined）
**解法**：配 `mockJsSuffix` + 自定义 JSON body 解析中间件（十几行的"攒数据 + JSON.parse"）

### 坑 23：动态路由页面空白

**原因**：拼 glob key 漏了斜杠——`/src/views${menu.component}.vue` → "/src/viewsproTable/..."
**解法**：`/src/views/${menu.component}.vue`；调试时 `console.log(Object.keys(modules))` 对照真实 key

### 坑 24：重新登录后进 404（最深的坑）

**因果链**：flatMenuList 混入静态 home → resetRouter 误删它 → 再登录 push('/home/index') 匹配不到 → 兜底重定向 /404（发生在守卫**之前**）→ 守卫把 /404 当目标重新导航 → 渲染 404
**解法**：flatMenuList 只记录**真正 addRoute** 的路由（addedRoutes）
**教训**："记录名单 → 批量操作"模式必须保证名单与实际操作一致。

### 坑 25：切换英文没反应

**原因**：① `switchLangue` 里用了未导入的 `i18n`（ReferenceError）；② 模板 `@command="switchLanguage"` 与函数名 `switchLangue` 拼写不一致 → 静默无事
**解法**：补 `import i18n` + 统一函数名
**经验**："点击没反应"优先检查事件绑定名与函数名是否一致。

### 坑 26：下拉菜单显示 "layout.logout" 字样

**原因**：`{{ "layout.logout" }}` 是字符串字面量，不是翻译调用
**解法**：`{{ t("layout.logout") }}`

### 坑 27：退出再登录标签残留

**原因**：logout 只清了 token 和动态路由，tabsStore/keepAlive 原封不动（同一应用会话不刷新页面）
**解法**：`tabsStore.$reset()` + `keepAliveStore.setKeepAliveName([])`（$reset 是 Pinia 内置，恢复 state() 初始值）

### 坑 28：vue-tsc 报 40+ 个 Cannot find module '@/...'

**原因**：`@` 别名只配了 vite.config.ts，没配 tsconfig 的 paths（dev 不跑类型检查所以潜伏到 build 才爆）
**解法**：tsconfig.app.json 加 `"paths": { "@/*": ["./src/*"] }`
**教训**：别名、环境变量这类"全局配置"永远要问自己：还有哪份配置需要同步？

### 坑 29：TS 6 / Vite 8 构建报错合集

- `baseUrl` 已废弃（TS5101）→ 删掉，paths 值写 `"./src/*"`（TS5090 提示要加 ./ 前缀）
- `erasableSyntaxOnly` 禁 enum（TS1294）→ enum 改 const 对象 + `as const`（注意对象内是冒号不是等号！TS1312）
- `verbatimModuleSyntax` → 类型一律 `import type`（UserConfig、PluginOption、ViteEnv 的 d.ts 要进 include）
- `build.esbuild` 已移除（TS2353）→ 自定义 dropConsolePlugin（transform 钩子按行删 console.log/debugger）
- 类型改名：`PersistedStateOptions` → `PersistenceOptions`、`paths` → `pick`——报错信息会直接告诉你新名字

### 坑 30：部署后无法登录 + debugger 搜索误报

**登录失败根因**：Mock 是 Vite **开发插件**，只存在于 pnpm dev；生产构建的 dist 是纯静态文件，`.env.production` 里 `VITE_API_URL = https://mock.example.com/api` 是假地址 → 请求打到不存在的域名
**解法**：VITE_API_URL 留空 + nginx `return JSON` 临时模拟（或跑独立 Mock 容器 + proxy_pass）
**认知**：开发与生产的本质差异——Mock 是脚手架，生产必须有真实后端。
**debugger 误报**：dist 里搜到 "debugger" 可能只是 Vue 库的警告文案；决定性验证 = 源码埋 `console.log("剔除测试")` 重建后搜索无输出。

### 坑 31：el-table-v2 有表头无数据 / 全空白

**现象**：`'100%'` 字符串宽度 → 表头渲染但数据区空白；改数字宽度时把代码贴错文件 → 演示页 ReferenceError
**解法**：宽度 = 列宽总和数字（el-table-v2 对百分比宽度支持差）；新建 .vue 文件后**重启 dev**（import.meta.glob 不收录新文件）
**经验**：调试复杂问题用"裸组件对照实验"二分定位——绕过封装层直接测底层组件。

### 坑 32：表单联动加 watch 后页面空白（TDZ 死区）

**原因**：`watch(searchForm, ...)` 是**立即执行**的代码，写在 `searchForm` 声明之前 → `Cannot access 'searchForm' before initialization`
**解法**：searchForm 声明放联动三件套之前
**规则**：函数定义可以前置（懒执行），立即执行的代码（watch、reactive 初始化）必须声明在后。

### 坑 33：分片上传 CanceledError（去重机制误杀）

**原因**：去重 key = method+url+params+data；72 个分片 url 相同、FormData 序列化都是 `{}` → key 全相同 → 去重机制把并发分片当"重复请求"取消
**解法**：`{ cancel: false }` 关闭该请求的去重（阶段 5 预留的逃生舱）
**教训**：封装任何"默认行为"都必须留关闭口子——你永远不知道未来哪个场景需要绕过它。

### 坑 34：check 接口 404

**原因**：mock 文件模板字符串反引号开头、单引号结尾 → 整个模块解析失败，所有 handler 失效
**解法**：修复语法；这类 404 **先看 dev 终端**（插件加载报错在终端，浏览器只有结果）

### 坑 35：checkApi 三连错（典型排查链）

- `not defined` → hook 里没解构（接口声明了变量没取出）
- `not a function` → 演示页导入了但没传给 hook（值 undefined）
- `object is not iterable` → 忘了解包 `res.data`（接口约定 `{code, data, msg}`）
  **规律**："not a function" = 值是 undefined = 顺着数据流往回找"谁该给它赋值"。

### 坑 36：刷新动态路由页 404

**原因**：动态路由未注册 → 初始导航被兜底 `/:pathMatch(.*)*` 重定向到 /404（**发生在守卫之前**）→ 守卫把 /404 当目标重新导航
**解法**：守卫里 `to.redirectedFrom?.fullPath || to.fullPath` 找回用户原本想去的地方

### 坑 37：破坏性实验没变红（测试盲区）

**原因**：bug 在"过程值"（每片后的进度），测试断言的却是"终值"——`progress.value = 100` 兜底赋值把中间错误掩盖了
**解法**：过程快照用例（mock 里记录每片间的进度）
**铁律**：写测试先问"错误会以什么形式出现？我的断言看得见它吗？"——断言粒度 = 测试质量。

### 坑 38：并发下测试时序不确定

**原因**：concurrency=3 + 瞬间完成的 mock → 3 个调用在第一批片完成前发出 → 快照拍到 0
**解法**：进度用例设 `concurrency: 1`（一个用例只测一个变量；并发由专门用例测）
**铁律**：异步测试的时序必须确定——隔离变量是测试设计的核心动作。

### 坑 39：GitHub Actions 报 yaml 语法错误

**原因**：YAML 用缩进表达层级，顶层键（`on:`、`jobs:`）被缩进了 2 空格 → 解析器认为它们是"上一层的子项"
**解法**：顶层键顶格（第 0 列），子项保持相对缩进
**铁律**：YAML 和 Python 一样"缩进即语法"；用 VS Code + YAML 插件即时校验。

### 坑 40：CI 抓到本地漏掉的 5 个类型错误

**案例**：checkApi 返回类型过时（ResultData 包装）、signal 参数未同步到接口类型、未使用变量、requestApi 缺默认值
**原因**：本地 `vue-tsc -b` 是增量模式且"忘了跑"；CI 每次全新虚拟机全量检查
**教训**：CI 从不相信"本地跑过"——这是它存在的意义。

### 坑 41：中文输入法全角标点（：，等）

**报错**：`SyntaxError: Invalid or unexpected token`
**原因**：中文输入法下打的冒号/逗号/括号是全角字符，JS 引擎不认，肉眼几乎无法分辨
**预防**：写代码时切英文输入法；VS Code 装全角字符检测插件。

### 坑 42：递归组件导入路径错误

**报错**：`Failed to resolve import "./components/MenuTree.vue"`
**原因**：`./components` 相对**当前文件目录**（LayoutClassic/）解析，而文件建在 layouts/components/
**解法**：`@/layouts/components/MenuTree.vue`（别名从 src 出发）或 `../components/`（上跳一级）
**规则**：`./` 当前目录、`../` 上一级、`@/` 从 src 出发。

### 坑 43：keep-alive 缓存不生效

**排查链**：① mock 菜单没加 isKeepAlive 标记（afterEach 的 if 永远 false）② 组件 name 与缓存名单不一致
**解法**：菜单 meta 加 `isKeepAlive: true` + 组件 `defineOptions({ name })` + 缓存名单存 `to.name`——**三处名字必须一致**
**验证**：改完关键配置先 grep 确认改动真实存在，再谈下一步。

### 坑 44：RouteRecordRaw 判别联合类型错误

**过程**：条件展开 `...(cond ? {x} : {})` 产出"可选字段"（x?: T）→ 判别联合无法判别 → 报错
**解法**：**分支构造**——每个 if 分支返回形状确定的对象，精确匹配某一变体
**铁律**：判别联合的判别依据是字段**存在性**；"按条件拼字段"与它相克，"按分支造对象"与它相容。

### 坑 45：RawRouteComponent 类型不存在

**报错**：`'"vue-router"' has no exported member named 'RawRouteComponent'. Did you mean 'RouteComponent'?`
**解法**：用 `RouteComponent`
**经验**：TS 的 "Did you mean" 提示经常直接给出答案。

### 坑 46：拼写错误致全站白屏（最高危的一类）

**报错**：`ReferenceError: getAuthButtionsApi is not defined`
**因果链**：拼错 → initDynamicRouter 抛出 → 守卫失败 → **所有导航中止 → 连静态首页都白屏**
**教训**：① 挂在"初始化路径"上的代码单点失败 = 全局瘫痪（真实项目要 try/catch 兜底）② Button→Buttion 笔误出现两次——提交前全局搜索自查拼写模式。

### 坑 47：ProTable 默认插槽不渲染

**现象**：放在 `<ProTable>` 内部的工具栏 div 永远不显示
**原因**：ProTable 模板里没有 `<slot />`（只有 #column-xxx 和 #operation 具名插槽）——默认插槽内容被丢弃
**解法**：工具栏放组件外面
**规则**：用别人的组件前，先确认它渲染哪些插槽。

### 坑 48：dev 能跑、build 报错（转译 vs 类型检查）

**原理**：dev 的 esbuild 只**转译**（剥类型注解，不验证）；build 的 vue-tsc 做**全量类型检查**
**推论**：类型错误是"编译期影子世界"的问题——剥掉注解的 JS 能跑，不代表类型正确
**行动**：开发靠 IDE 红波浪线，提交前 `pnpm build:pro`，推送后 CI 兜底。

### 坑 49：computed 字面量类型拓宽

**报错**：`Type 'string' is not assignable to type '"category"'`
**原因**：`computed(() => ({ type: 'category' }))` 无泛型注解 → 返回类型被推断 → 字面量拓宽成 string
**解法**：`computed<EChartsOption>(() => ({...}))`——泛型提供**上下文类型**，字面量保持窄类型。

### 坑 50：类型接口漏导入

**报错**：`Cannot find name 'DashboardData'`
**原因**：`import { getDashboardDataApi }` 只导了函数，接口类型忘导
**解法**：`import { getDashboardDataApi, type DashboardData } from ...`
**规则**：用到的类型和值一样要显式导入——TS 不会自动帮你找类型。

### 坑 51：PowerShell 里 curl 的引号与别名

**报错**：`curl: (3) URL rejected` / 后端收到坏 JSON（code 400）
**原因**：PowerShell 双引号里 `\"` 不是转义（反斜杠是字面量）；`curl` 可能是 Invoke-WebRequest 的别名
**解法**：JSON 用单引号 `-d '{"username":"admin"}'`；用 `curl.exe` 强制真 curl
**规则**：PowerShell 单引号=纯字面量，双引号=会做变量插值。

### 坑 52：旧 token 与新后端冲突（401 → 白屏）

**现象**：切真实后端后，刷新提示"登录已过期"然后白屏
**原因**：localStorage 里的 mock 时代 token 不是 Go 签发的 JWT → 验签失败 401 → initDynamicRouter 抛错 → 守卫失败 → 白屏
**解法**：清 localStorage 重新登录；**长期修复**：守卫给 initDynamicRouter 加 try/catch——初始化失败时清登录态优雅回登录页（初始化路径必须容错）。

### 坑 53：axios 拦截器还在读不存在的 localStorage 键（mock 掩盖的第三例）

**现象**：登录成功但紧接着"登录已过期"、不跳转
**根因**：阶段 7 切 Pinia 持久化（键="user"）时，守卫改了、**axios 拦截器漏改**——还在读 `localStorage.getItem("token")`（这个键从未存在）→ 请求头永远带空 token → 真后端 401
**解法**：拦截器改读 `useUserStore().token`
**教训**：改存储方案时全局搜旧键名；mock 不校验 token 所以此 bug 潜伏至今。

### 坑 54：后端漏实现接口（404）

**现象**：数据可视化页面提示"您访问的资源不存在"
**根因**：前端有 6 组接口，后端只实现了 4 组（dashboard/upload 漏了）→ gin 默认 404
**解法**：补齐接口
**习惯**：联调前做"接口清单对照表"——前端 api/modules 的每个函数 URL 逐行对照后端路由表。

### 坑 55：Go 嵌套 gin.H 括号层级错位

**报错**：`unexpected ) in composite literal` / `unexpected EOF, expected }`
**原因**：多层嵌套 JSON（gin.H 套 gin.H）闭括号放错位置——字段被甩到函数调用外；替换代码时又把函数闭括号弄丢
**解法**：逐层缩进 + VS Code Go 插件括号高亮；"unexpected EOF" = 有开括号到文件尾没闭合，查最后编辑的函数结尾。

### 坑 56：CORS 白名单写错地址（Network Error）

**现象**：后端正常、curl 正常，浏览器登录报"网络错误"
**根因**：白名单里放的是**后端自己的地址**（localhost:3000）；Origin 头是"来访者"前端地址（localhost:8848）→ 白名单未命中 → 响应无 Allow-Origin → 浏览器拦截 → axios 报 Network Error
**解法**：白名单放前端地址
**排查套路**：F12 看 OPTIONS 预检响应头有没有 Access-Control-Allow-Origin——没有 = 白名单未命中。

### 坑 57：commit message 全角冒号

**报错**：`subject may not be empty / type may not be empty`
**原因**：`feat：xxx` 用了中文全角冒号，commitlint 按半角 `:` 切分失败
**解法**：半角 `feat: xxx`（坑 41 的提交消息版）
**根治**：写命令前切英文输入法。

---

## 前后端联调经验表（进阶 7 核心产出）

| 现象             | 第一反应（错的）      | 实际根因                     | 定位方法              |
| ---------------- | --------------------- | ---------------------------- | --------------------- |
| 网络错误         | 后端挂了              | CORS 白名单未命中            | 看 OPTIONS 预检响应头 |
| 登录已过期+白屏  | 后端 token 校验有问题 | 前端压根没发 token           | 看 Network 请求头     |
| 资源不存在       | 页面路由问题          | 后端漏实现接口               | 接口清单对照表        |
| 登录成功但被踢回 | token 过期            | 旧 mock token 与新后端不兼容 | 清 localStorage 重登  |

**联调第一原则**：先二分——后端单独用 curl 可验证（排除前端），前端看 Network 请求是否发出（排除后端）。永远用证据（Network 面板）代替猜测。

---

## 核心机制深度问答

### Q1：登录页的 router 和 routers/index.ts 的 router 是同一个吗？

**是同一个。** 两个衔接机制：

1. **ES 模块单例**：routers/index.ts 只执行一次，export default 导出的对象全应用共享
2. **useRouter() 不是新建是取回**：`app.use(router)` 把实例放进 provide 容器，useRouter() 内部 `inject(routerKey)` 取出同一实例
   守卫注册是模块加载时的副作用，远早于任何 push()。

### Q2：二级路由 /home/index 不带 /layout 前缀怎么匹配？

**子路由 path 以 / 开头 = 绝对路径，不拼接父路径。** 父子关系存在路由记录的 `parent` 引用里，不在 URL 里。匹配过程：URL 命中 home 记录本身 → 沿 parent 引用回溯 → matched = [layout, home]。

### Q3：顶层也有同名 /home/index 会怎样？

匹配表按"分数 + 注册顺序"排序，分数相同先注册的赢 → 二级子路由被"饿死"。**路径必须全局唯一**，这是铁律。

### Q4：守卫放行后如何渲染页面？

```
① matcher.resolve("/home/index") 查编译好的匹配树
② matched = [layout记录, home记录]（父前子后）
③ meta 合并（子覆盖父）
④ 懒加载组件执行（导航等待下载）
⑤ currentRoute 更新（响应式）
⑥ 两个 router-view 按"深度"认领：App.vue 的深度 0 → matched[0]（布局）
   布局里的深度 1 → matched[1]（页面）—— provide/inject 传递深度
```

### Q5：浏览器标题"登录"哪来的？

守卫第 2 行 `document.title = to.meta.title || 兜底`，meta.title 来自路由配置。跳转链中标题被设置两次（首页→登录），最终值取胜。

### Q6：访问 localhost:8848 的完整链路？

```
① 浏览器 GET / → Vite 返回 index.html（title 已注入）
② 浏览器按 import 递归加载模块图（router/stores/组件库…）
   —— pinia 此刻只创建未激活；懒加载组件不下载
③ main.ts 函数体：createApp → use(ElementPlus) → use(router)（发起首次导航）
   → use(pinia)（激活）→ 注册图标 → mount
④ 首次导航：/ → 重定向 /home/index → 守卫（无token）→ return /login
   → 守卫放行 → 懒加载下载 login 组件 → router-view 渲染
⑤ 地址栏变 #/login
```

### Q7：ProTable 的"配置化 + 插槽逃生舱"模式

90% 场景靠 columns 配置解决；10% 特殊场景（状态列渲染成 tag、操作列按钮）靠插槽兜底。配置解决不了的用插槽，插槽名约定 `column-字段名`。

### Q8：一次 abort() 能同时中断 3 个并发请求吗？

**能。** AbortController 是**一对多广播**——3 个请求共享同一个 signal，`abort()` 一调全部同时收到取消通知。终止按钮干两件事：`flag`（管排队的片，循环条件拦截）+ `signal`（管在飞的片）。signal 一旦 abort 永久死亡，所以**每次上传 new 一个 controller**。粒度决定数量：全停共享一个，单停（取消某一片）才需要每请求一个。

### Q9：为什么"测试全绿"不等于"代码没坏"？

断言粒度决定测试质量：**终值断言**抓不住过程 bug（`progress=100` 的兜底赋值会掩盖中间错误）；**过程快照断言**才能抓住。写测试先问"错误以什么形式出现？断言看得见吗？"另外异步测试的时序必须确定——并发变量要用专门用例测、进度变量要降并发隔离。

---

## 项目收官与进阶建议

### 已完成能力清单（12 阶段全部收官）

| 领域     | 能力                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 工程化   | husky + lint-staged + commitlint + ESLint 扁平配置 + Prettier + Stylelint |
| 环境体系 | .env 多环境 + 代理 + wrapperEnv 类型转换                                  |
| API 层   | RequestHttp 拦截器封装（token 注入/loading/请求去重/统一错误处理）        |
| 权限路由 | 静态 + 动态（addRoute）+ 守卫 + resetRouter + "不注册=不存在"             |
| 状态管理 | 5 个 store + persistedstate 持久化                                        |
| UI       | 经典布局 + 登录 + 暗黑模式 + 中英文切换                                   |
| 复用能力 | 7 个指令 + 8 个 Hooks + ProTable 配置化                                   |
| 构建部署 | 多环境构建 + gzip/brotli + PWA + console 剔除 + nginx/Docker              |

### ProTable 增强（已完成）

| 特性     | 核心知识点                                                                        |
| -------- | --------------------------------------------------------------------------------- |
| 虚拟滚动 | DOM 与数据解耦；startIndex = scrollTop / rowHeight；薄适配层模式                  |
| 表单联动 | optionsFn 函数式表达依赖；值失效自动清空（通用规则兜底）                          |
| 分片上传 | File.slice 切片；Promise 池 worker 模式；cancel:false 逃生舱                      |
| 断点续传 | check 接口问进度；待传列表游标；进度从已有片数起步                                |
| 主动终止 | AbortController 一对多广播；flag 管排队 + signal 管在飞；粒度决定 controller 数量 |

### 进阶路线（全部完成）

| #   | 阶段                    | 核心知识点                                                                                                                                                   |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 单元测试（Vitest）      | AAA 模式；vi.fn/mockResolvedValue/mockImplementation；断言粒度三档；异步时序确定性（并发变量隔离）                                                           |
| 2   | CI/CD（GitHub Actions） | workflow/job/step 三级结构；push 触发器；pnpm 缓存；--frozen-lockfile；本地增量漏检由 CI 全量兜底                                                            |
| 3   | 多级菜单与页面缓存      | 递归组件（自渲染+出口条件）；pass-through 无组件路由；route.matched 多级面包屑；keep-alive include 按组件 name 匹配（路由 name/缓存名单/组件 name 三处一致） |
| 4   | 按钮权限闭环            | 权限码命名（模块:操作）；登录初始化一次拿齐菜单+权限；resetRouter 三层清理；后端改权限前端不发版                                                             |
| 5   | ECharts 数据可视化      | option 驱动模型；init/setOption/resize/dispose 生命周期四件套；computed 把数据翻译成配置                                                                     |
| 6   | 轮询自动刷新            | usePolling hook；请求序号防竞态；visibilitychange 切后台暂停；options 对象参数设计                                                                           |
| 7   | Go + gin 真实后端联调   | gin 三件套（Context/ShouldBindJSON/JSON）；JWT 签发与校验；CORS 白名单（Origin 是来访者地址）；Go map 并发锁；联调"谁的问题"二分法                           |

### 进阶期间踩坑速览（坑 39-57，详见踩坑记录）

YAML 缩进、全角标点、CI 兜底价值、递归组件导入路径、keep-alive 三名字一致、判别联合分支构造、Buttion 笔误致全站白屏、默认插槽不渲染、转译 vs 类型检查、computed 字面量拓宽、PowerShell curl 引号、旧 token 冲突、拦截器漏改读 store、后端漏接口、Go 括号层级、CORS 白名单地址、commit 全角冒号。

### 长期方向（按优先级）

1. **真实后端联调**：token 刷新机制、CORS、接口文档对接——最大空白
2. **Git 协作**：分支模型、PR review、冲突解决、rebase
3. **性能优化**：首屏分包、CDN、内存泄漏排查
4. **安全**：XSS（v-html）、CSRF、token 存储方案
5. **TS 进阶**：泛型约束、条件类型（写组件库时才真正用到）

---

## 常用命令速查

```bash
# 开发
pnpm dev                 # 启动（端口 8848，自动开浏览器）
pnpm build:pro           # 生产构建
pnpm lint:eslint         # ESLint 检查
pnpm lint:prettier       # 格式化
pnpm lint:stylelint      # 样式检查

# Git
git add . && git commit -m "feat: xxx"
git log --oneline
git checkout -- 文件     # 撤销改动
git reset --soft HEAD~1  # 撤销提交

# 调试
localStorage.setItem("user", JSON.stringify({ token: "test123", userInfo: {} }))  # 模拟登录
localStorage.removeItem("user")  # 模拟退出
```

---

_文档更新时间：2026-10-03 ｜ 项目路径：F:\frontend-program\vue\my-admin_
