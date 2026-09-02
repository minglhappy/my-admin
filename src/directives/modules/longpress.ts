// import type { Directive, DirectiveBinding } from "vue";

// export const longpress: Directive = {
//   mounted(el: HTMLElement, binding: DirectiveBinding) {
//     if (typeof binding.value !== "function") return;  // 防御：值必须是函数
//     let timer: ReturnType<typeof setTimeout> | null = null;

//     /** 按下：开始计时 */
//     const start = (e: MouseEvent) => {
//       timer = setTimeout(() => binding.value(e), 800);  // 800ms 后触发
//     };

//     /** 松开/移出：取消计时 */
//     const cancel = () => {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }
//     };

//     el.addEventListener("mousedown", start);
//     el.addEventListener("mouseup", cancel);
//     el.addEventListener("mouseout", cancel);   // 按住后移出元素也算取消
//   },
// };

import type { Directive, DirectiveBinding } from 'vue';

export const longpress: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 1. 防御性编程：确保传入的是一个函数
    if (typeof binding.value !== 'function') {
      console.warn('[v-longpress] 绑定的值必须是一个函数！');
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    let isLongPressFired = false; // ★ 商业级核心：标记长按是否真正触发了

    /** 按下：开始计时 */
    const start = (e: Event) => {
      // ★ 商业级细节 1：如果是鼠标事件，只响应左键（button === 0），排除右键和中键的干扰
      if (e.type === 'mousedown' && (e as MouseEvent).button !== 0) return;

      // 每次按下前，重置状态
      isLongPressFired = false;
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        isLongPressFired = true; // 标记：长按已经爆炸（执行）了
        binding.value(e); // 真正执行业务函数
      }, 800); // 800ms 阈值
    };

    /** 松开/移出：取消计时 */
    const cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    /**
     * ★ 商业级细节 2：拦截原生点击事件
     * 痛点：当用户长按结束后松开手指，浏览器会立刻补发一个 "click" 事件。
     * 如果你不拦截它，长按逻辑执行完后，还会意外触发一次普通的点击逻辑！
     */
    const preventClick = (e: MouseEvent | TouchEvent) => {
      if (isLongPressFired) {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 停止事件冒泡
        isLongPressFired = false; // 拦截完一次后重置
      }
    };

    // ==========================================
    // 2. 绑定 PC 端鼠标事件
    // ==========================================
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseout', cancel);
    // 使用捕获阶段 (capture: true) 优先拦截 click
    el.addEventListener('click', preventClick, { capture: true });

    // ==========================================
    // 3. 绑定移动端触摸事件（修复触屏不兼容问题）
    // ==========================================
    // passive: true 告诉浏览器此事件不会调用 preventDefault，大幅提升页面滚动流畅度
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel); // 系统强行打断（如来电话）

    // ==========================================
    // 4. 封装扫地机器人（修复内存泄漏问题）
    // ==========================================
    (el as any)._longpressCleanup = () => {
      // 移除 PC 端事件
      el.removeEventListener('mousedown', start);
      el.removeEventListener('mouseup', cancel);
      el.removeEventListener('mouseout', cancel);
      el.removeEventListener('click', preventClick, { capture: true });

      // 移除移动端事件
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchend', cancel);
      el.removeEventListener('touchcancel', cancel);

      // 清理未引爆的定时器
      if (timer) clearTimeout(timer);
    };
  },

  // ==========================================
  // 5. 销毁阶段执行清理
  // ==========================================
  beforeUnmount(el: HTMLElement) {
    (el as any)._longpressCleanup?.();
  },
};
