// eslint.config.js（ESLint 10 扁平配置）
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier/flat';

export default [
  // ① 全局忽略（替代 .eslintignore 文件）
  {
    ignores: ['node_modules/**', 'dist/**', 'public/**', '*.d.ts', '*.cjs', 'eslint.config.js'],
  },

  // ② Vue 推荐规则（插件自带的 flat 版本）
  ...pluginVue.configs['flat/recommended'],

  // ③ TS + Vue 文件规则
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: vueParser, // 解析 .vue 文件
      parserOptions: {
        parser: tsParser, // <script> 里用 TS 解析器
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser, // window、document、localStorage 等浏览器全局变量
        ...globals.node, // process 等 Node 全局变量（build/ 下的脚本要用）
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // TS 推荐规则
      ...prettierPlugin.configs.recommended.rules, // prettier 规则（已包含"关闭冲突规则"）
      ...prettierConfig.rules, // ★ 新增：v10 完整规则（含 Vue 格式规则关闭）
      'vue/multi-word-component-names': 'off', // 允许单单词组件名
      '@typescript-eslint/no-explicit-any': 'off', // 允许 any
      '@typescript-eslint/no-unused-vars': 'warn', // 未使用变量降为警告
    },
  },
];
