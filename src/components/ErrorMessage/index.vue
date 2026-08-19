<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HOME_URL } from '@/config';

interface ErrorMessageProps {
  /** 错误码 */
  code: string;
  /** 错误描述 */
  message?: string;
}

withDefaults(defineProps<ErrorMessageProps>(), {
  message: '',
});

const router = useRouter();

/** 返回首页 */
const goHome = () => {
  router.push(HOME_URL);
};
</script>

<template>
  <div class="error-page">
    <h1 class="error-code">{{ code }}</h1>
    <p class="error-message">{{ message }}</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;

  .error-code {
    color: $primary-color;
    font-size: 120px;
    font-weight: bold;
  }

  .error-message {
    color: $text-color-secondary;
    font-size: 18px;
  }
}
</style>
