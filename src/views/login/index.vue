<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/stores/modules/user';
import { HOME_URL } from '@/config';
import { loginApi } from '@/api/modules/login';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const userStore = useUserStore();

/** 表单引用（用于调用校验方法） */
const loginFormRef = ref<FormInstance>();

/** 表单数据 */
const loginForm = reactive({
  username: 'admin',
  password: '123456',
});

/** 校验规则 */
const loginRules: FormRules = {
  username: [{ required: true, message: t('login.usernameRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passwordRequired'), trigger: 'blur' }],
};

/** 登录按钮 loading 状态 */
const loading = ref(false);

/** 点击登录 */
const handleLogin = () => {
  // validate 校验通过后回调 valid = true
  loginFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    // TODO: 阶段 11 接入 Mock 接口后，替换为真实的 loginApi 调用
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // // ★ 核心：写入 token（持久化插件会自动同步到 localStorage）
    // userStore.setToken('test-token-123');

    const res = await loginApi(loginForm);
    userStore.setToken(res.data.access_token);

    userStore.setUserInfo({ id: 1, username: loginForm.username, avatar: '' });
    loading.value = false;
    ElMessage.success(t('login.success'));
    router.push(HOME_URL);
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">MyAdmin</h1>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :placeholder="t('login.usernamePlaceholder')" :prefix-icon="'User'" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" :placeholder="t('login.passwordPlaceholder')" :prefix-icon="'Lock'" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin"> {{ t('login.button') }} </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-color 0%, #00bcd4 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 15%);
}

.login-title {
  margin-bottom: 30px;
  text-align: center;
  color: $primary-color;
  font-size: 28px;
}

.login-btn {
  width: 100%;
}
</style>
