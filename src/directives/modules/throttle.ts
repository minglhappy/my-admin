import type { Directive, DirectiveBinding } from 'vue';

// export const throttle: Directive = {
//   mounted(el: HTMLElement, binding: DirectiveBinding) {
//     const event = binding.arg || "click";
//     const delay = 1000;
//     let isLocked = false;   // ★ 用"锁"而不是计时器：执行期间上锁，结束解锁

//     el.addEventListener(event, (...args: unknown[]) => {
//       if (isLocked) return;          // 锁着 → 丢弃这次触发
//       isLocked = true;               // 上锁
//       binding.value(...args);        // 执行
//       setTimeout(() => {
//         isLocked = false;            // 延迟后解锁，等待下一次触发
//       }, delay);
//     });
//   },
// };

export const throttle: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const event = binding.arg || 'click';
    const delay = 1000;
    let isLocked = false;
    let timer: ReturnType<typeof setTimeout> | null = null; // 把定时器提出来

    const handler = (...args: unknown[]) => {
      if (isLocked) return;
      isLocked = true;
      binding.value(...args);
      timer = setTimeout(() => {
        isLocked = false;
      }, delay);
    };

    el.addEventListener(event, handler);

    // ★ 补全扫地机器人
    (el as any)._throttleCleanup = () => {
      el.removeEventListener(event, handler);
      if (timer) clearTimeout(timer);
    };
  },

  // ★ 补全销毁钩子
  beforeUnmount(el: HTMLElement) {
    (el as any)._throttleCleanup?.();
  },
};
