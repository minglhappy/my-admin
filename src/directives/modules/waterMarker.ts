import type { Directive, DirectiveBinding } from 'vue';

export const waterMarker: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const text = binding.value || 'MyAdmin';

    // ① Canvas 画水印文字
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;
    ctx.rotate((-20 * Math.PI) / 180); // 旋转 -20 度（度数转弧度）
    ctx.font = '16px Microsoft YaHei';
    ctx.fillStyle = 'rgba(180, 180, 180, 0.3)'; // 半透明灰色
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 8, canvas.height / 2);

    // ② 转成 base64 背景图
    const bg = `url(${canvas.toDataURL('image/png')})`;

    // ③ 创建水印层
    const watermarkDiv = document.createElement('div');
    watermarkDiv.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: ${bg};
      background-repeat: repeat;
      pointer-events: none;   /* ★ 点击穿透：水印层不拦截任何鼠标操作 */
      z-index: 9999;
    `;

    // ④ 父元素需要是定位元素（水印的定位基准）
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.appendChild(watermarkDiv);
  },
};
