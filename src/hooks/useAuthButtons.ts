import { computed } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';

/**
 * 按钮权限判断（逻辑版，配合 v-auth 指令使用）
 */
export function useAuthButtons() {
  const authStore = useAuthStore();

  const authButtonList = computed(() => authStore.authButtonList);

  /** 是否拥有某权限码 */
  const hasAuth = (code: string) => authButtonList.value.includes(code);

  return { authButtonList, hasAuth };
}
