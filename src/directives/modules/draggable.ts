import type { Directive } from 'vue';

export const draggable: Directive = {
  mounted(el: HTMLElement) {
    el.style.position = 'absolute'; // 定位后才能用 left/top 移动
    el.style.cursor = 'move';

    el.addEventListener('mousedown', (e: MouseEvent) => {
      // 按下时：计算鼠标与元素左上角的固定差值
      const startX = e.clientX - el.offsetLeft;
      const startY = e.clientY - el.offsetTop;

      const handleMove = (ev: MouseEvent) => {
        el.style.left = `${ev.clientX - startX}px`;
        el.style.top = `${ev.clientY - startY}px`;
      };

      const handleUp = () => {
        // ★ 松开时移除监听器：否则每次按下都会叠加一套新的
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      // ★ 关键：mousemove 监听在 document 上而不是元素上——
      //   鼠标移动速度快时会"滑出"元素，监听元素就丢了跟踪
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    });
  },
};
