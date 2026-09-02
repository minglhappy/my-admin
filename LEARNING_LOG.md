# MyAdmin 项目学习全记录

> 从 0 到 1 构建 Vue3 + TypeScript 后台管理系统（复刻 Geeker-Admin）的完整学习笔记
> 学习模式：**你写 → AI 审 → 你改**（先尝试自己写代码，再由 AI review 纠错）
> 开始时间：2026-08-05 ｜ 技术栈：Vue 3.5 + TypeScript + Vite + Pinia + Element Plus

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
- [踩坑记录全集](#踩坑记录全集)
- [核心机制深度问答](#核心机制深度问答)
- [待完成阶段](#待完成阶段)

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
│  ├─ plugins.ts              # 插件注册
│  └─ vite-env.d.ts           # ViteEnv 类型声明
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
│  ├─ layouts/                # LayoutClassic 布局
│  ├─ routers/                # 静态路由 + 动态路由 + 守卫
│  ├─ stores/                 # Pinia（user/auth/global/tabs/keepAlive）
│  ├─ styles/                 # reset/var/common/element/element-dark
│  ├─ typings/                # 全局类型声明
│  ├─ utils/                  # 工具函数
│  ├─ views/                  # 页面（login/home/error/proTable/directives）
│  ├─ App.vue                 # 根组件（router-view + 暗黑恢复）
│  └─ main.ts                 # 入口（注册顺序：ElementPlus → router → pinia）
```

### Git 提交历史

| 提交 | 内容                                                                     |
| ---- | ------------------------------------------------------------------------ |
| 1    | feat: 完成项目脚手架到登录布局的开发（阶段1-8）                          |
| 2    | feat: 阶段9 完成全局组件开发（SvgIcon/SwitchDark/ErrorMessage/ProTable） |
| 3    | feat: 阶段10 完成自定义指令与Hooks开发                                   |

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

---

## 待完成阶段

### 阶段 11：国际化与 Mock 数据

- vue-i18n 中英文切换（src/languages/）
- 本地 Mock 服务器（build/mockServer.ts + mock/db.json）
- 登录接口换成真实 loginApi 调用
- **完整的动态路由机制**：getMenuList → transformMenuToRoutes → router.addRoute("layout", route)
- logout 时 resetRouter（卸载动态路由，防换账号残留）

### 阶段 12：构建优化与部署

- `pnpm build:pro` vs `build:dev` 区别
- gzip/brotli 压缩、打包分析（stats.html）、PWA
- VITE_DROP_CONSOLE 生产剔除 console.log
- postcss 配置

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

_文档生成时间：2026-08-26 ｜ 项目路径：F:\frontend-program\vue\my-admin_
