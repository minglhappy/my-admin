module.exports = {
    root: true,
    extends: [
      "stylelint-config-standard",
      "stylelint-config-recommended-scss",
      "stylelint-config-recommended-vue",
    ],
    plugins: ["stylelint-order"],
    rules: {
      // 指定 CSS 属性排序规则
      "order/properties-order": [
        "position",
        "top",
        "right",
        "bottom",
        "left",
        "display",
        "width",
        "height",
        "margin",
        "padding",
        "background",
        "color",
        "font-size",
      ],
      // 类名允许 kebab-case 和驼峰
      "selector-class-pattern": null,
      // 允许未知的 @ 规则（SCSS 的 @mixin、@include 等）
      "at-rule-no-unknown": null,
      "scss/at-rule-no-unknown": true,
      "declaration-property-value-no-unknown": null,  // 允许属性值中出现 SCSS 变量（$primary-color 等）
    },
  };
