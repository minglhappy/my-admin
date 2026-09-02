import type { Directive, DirectiveBinding } from 'vue';
import { ElMessage } from 'element-plus';

export const copy: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.addEventListener('click', async () => {
      try {
        // navigator.clipboard：浏览器原生剪贴板 API（仅 https 或 localhost 可用）
        await navigator.clipboard.writeText(binding.value);
        console.log('复制成功-->', binding.value);
        ElMessage.success('复制成功');
      } catch {
        ElMessage.error('复制失败');
      }
    });
  },
};
