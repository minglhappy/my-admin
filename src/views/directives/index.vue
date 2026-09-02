<script setup lang="ts">
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useOnline } from '@/hooks/useOnline';
import { useTime } from '@/hooks/useTime';
import { useAuthStore } from '@/stores/modules/auth';

// 演示 v-auth：初始化权限列表（有 add 和 delete，没有 edit）
const authStore = useAuthStore();
onMounted(() => {
  authStore.setAuthButtonList(['user:add', 'user:delete']);
});

// 演示 Hooks
const { isOnline } = useOnline();
const { nowTime } = useTime();

/** v-debounce 演示：停止点击 500ms 后才执行 */
const handleDebounce = () => {
  ElMessage.success('防抖触发（停止点击 500ms 后）');
};

/** v-throttle 演示：1 秒内最多执行一次 */
const handleThrottle = () => {
  ElMessage.success('节流触发（1 秒最多一次）');
};

/** v-longpress 演示 */
const handleLongpress = () => {
  ElMessage.warning('长按触发！');
};
</script>

<template>
  <div class="page-container">
    <el-card header="Hooks 演示">
      <div class="flex-between">
        <span>
          网络状态：
          <el-tag :type="isOnline ? 'success' : 'danger'">{{ isOnline ? '在线' : '离线' }}</el-tag>
        </span>
        <span>当前时间：{{ nowTime }}</span>
      </div>
    </el-card>

    <el-card header="指令演示" class="mt20">
      <!-- v-copy -->
      <el-button v-copy="'MyAdmin 复制测试~'" type="primary">点击复制文本</el-button>

      <!-- v-debounce -->
      <el-button v-debounce:click="handleDebounce">防抖按钮（疯狂连点试试）</el-button>

      <!-- v-throttle -->
      <el-button v-throttle:click="handleThrottle">节流按钮（疯狂连点试试）</el-button>

      <!-- v-longpress -->
      <el-button v-longpress="handleLongpress">长按 0.8 秒触发</el-button>

      <!-- v-auth -->
      <el-button v-auth="'user:add'" type="success">有权限显示</el-button>
      <el-button v-auth="'user:edit'" type="warning">无权限隐藏</el-button>
      <el-button v-auth="['user:edit', 'user:delete']" type="danger">数组权限（满足其一）</el-button>

      <!-- v-draggable -->
      <div v-draggable class="drag-box">拖我移动</div>
    </el-card>

    <!-- v-waterMarker 包住整个页面 -->
    <div v-waterMarker="'MyAdmin-张三'" class="watermark-box">
      <el-card header="水印演示">
        <p>这个区域被水印覆盖，截屏可看到水印文字</p>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.drag-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 60px;
  margin-top: 10px;
  color: #fff;
  background-color: $primary-color;
  border-radius: 8px;
  user-select: none; /* 拖拽时禁止选中文字 */
}

.watermark-box {
  position: relative;
  height: 200px;
  margin-top: 20px;
}
</style>
