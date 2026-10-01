<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface EChartsProps {
  /** ECharts 配置项 */
  options: echarts.EChartsOption;
  /** 图表高度 */
  height?: string;
}

const props = withDefaults(defineProps<EChartsProps>(), {
  height: '400px',
});

const chartRef = ref<HTMLDivElement>();
let chartInstance: echarts.ECharts | null = null;

onMounted(() => {
  // ① 创建实例：绑定到容器 div
  chartInstance = echarts.init(chartRef.value!);
  // ② 渲染配置
  chartInstance.setOption(props.options);
  // ③ 监听窗口缩放 → 图表跟着自适应
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  // ④ 销毁实例（ECharts 实例占内存，不销毁 = 泄漏）
  chartInstance?.dispose();
  chartInstance = null;
});

const handleResize = () => {
  chartInstance?.resize();
};

// options 变化时更新图表（数据从接口异步回来后自动重绘）
watch(
  () => props.options,
  (newVal) => {
    chartInstance?.setOption(newVal);
  },
  { deep: true }
);
</script>

<template>
  <div ref="chartRef" :style="{ width: '100%', height }" />
</template>
