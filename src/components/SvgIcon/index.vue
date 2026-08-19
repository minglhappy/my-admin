<script setup lang="ts">
import { computed } from 'vue';

interface SvgIconProps {
  /** 图标名称（对应 src/assets/icons 下的文件名） */
  name: string;
  /** 颜色 */
  color?: string;
  /** 尺寸（px） */
  size?: number | string;
}

const props = withDefaults(defineProps<SvgIconProps>(), {
  color: '#333',
  size: 18,
});

/** 符号 id，对应插件的 symbolId 配置 */
const symbolId = computed(() => `#icon-${props.name}`);

/** 图标样式 */
const iconStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
}));
</script>

<template>
  <svg class="svg-icon" :style="iconStyle" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}
</style>
