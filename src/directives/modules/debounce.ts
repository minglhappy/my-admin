import type { Directive, DirectiveBinding } from 'vue';

export const debounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const event = binding.arg || 'click'; // 事件类型：v-debounce:input → "input"
    console.log('debounce mounted--->', event, binding.value);
    const delay = 500; // 防抖延迟
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = (...args: unknown[]) => {
      console.log('收到1次点击，重置计时器');
      console.log('Event and binding value---->', event, binding.value);
      // ★ 核心逻辑：每次触发先清掉上次的定时器，再重新计时
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('收到点击后500ms后执行回调');
        binding.value(...args);
      }, delay);
    };

    el.addEventListener(event, handler);

    // 把清理函数挂到元素上，供 beforeUnmount 钩子使用
    (el as any)._debounceCleanup = () => {
      el.removeEventListener(event, handler);
      if (timer) clearTimeout(timer);
    };
  },

  beforeUnmount(el: HTMLElement) {
    // ★ 卸载时必须清理：元素销毁了，监听器和定时器还活着 = 内存泄漏
    (el as any)._debounceCleanup?.();
  },
};
