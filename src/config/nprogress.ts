// src/config/nprogress.ts
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  easing: 'ease', // 动画缓动
  speed: 500, // 进度条速度
  showSpinner: false, // 不显示右上角加载圈
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 最小百分比
});

export default NProgress;
