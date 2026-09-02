import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding; // 权限码：字符串或字符串数组
    const authStore = useAuthStore(); // 在指令里用 store：先取权限列表
    const authButtonList = authStore.authButtonList;

    if (Array.isArray(value)) {
      // 传数组：满足其中任意一个权限即可显示
      const hasPermission = value.some((code) => authButtonList.includes(code));
      if (!hasPermission) el.parentNode?.removeChild(el);
    } else {
      // 传字符串：必须有这个权限码
      if (!authButtonList.includes(value)) el.parentNode?.removeChild(el);
    }
  },
};
