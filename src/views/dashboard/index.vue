<script setup lang="ts">
import { computed } from 'vue';
// import { ref } from 'vue';
import ECharts from '@/components/ECharts/index.vue';
import { getDashboardDataApi } from '@/api/modules/dashboard';
// import { type DashboardData } from '@/api/modules/dashboard';

import { type EChartsOption } from 'echarts';

import { usePolling } from '@/hooks/usePolling';

const {
  data: dashboardData,
  loading,
  isPolling,
  lastUpdate,
  start,
  stop,
  refresh,
} = usePolling({
  fetchFn: async () => (await getDashboardDataApi()).data,
  interval: 10000,
});

start();
// const dashboardData = ref<DashboardData>();
// const loadData = async () => {
//   const res = await getDashboardDataApi();
//   dashboardData.value = res.data;
// };
// loadData();

// ─── 三个 option：由接口数据组装（computed：数据到 → option 自动更新）───

/** 折线图：访问量趋势 */
const lineOption = computed<EChartsOption>(() => ({
  title: { text: '本周访问量' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: dashboardData.value?.line.days ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      data: dashboardData.value?.line.values ?? [],
      smooth: true, // 平滑曲线
      areaStyle: {}, // 渐变填充面积
    },
  ],
}));

/** 柱状图：分类销量 */
const barOption = computed<EChartsOption>(() => ({
  title: { text: '分类销量' },
  tooltip: {},
  xAxis: { type: 'category', data: dashboardData.value?.bar.categories ?? [] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: dashboardData.value?.bar.values ?? [], barWidth: '50%' }],
}));

/** 饼图：流量来源（环形图） */
const pieOption = computed<EChartsOption>(() => ({
  title: { text: '流量来源' },
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'], // 内外半径 = 环形
      data: dashboardData.value?.pie ?? [],
    },
  ],
}));
</script>

<template>
  <div class="page-container">
    <!-- ★ 轮询控制区 -->
    <el-card class="mb20">
      <div class="flex-between">
        <div>
          最后更新：{{ lastUpdate?.toLocaleTimeString() || '--' }}
          <el-tag :type="isPolling ? 'success' : 'info'" class="ml10">
            {{ isPolling ? '轮询中（每 10 秒）' : '已暂停' }}
          </el-tag>
        </div>
        <div>
          <el-button :loading="loading" icon="Refresh" @click="refresh">立即刷新</el-button>
          <el-button v-if="isPolling" icon="VideoPause" @click="stop">暂停</el-button>
          <el-button v-else type="primary" icon="VideoPlay" @click="start">继续</el-button>
        </div>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card><ECharts :options="lineOption" /></el-card>
      </el-col>
      <el-col :span="12">
        <el-card><ECharts :options="barOption" /></el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :span="12">
        <el-card><ECharts :options="pieOption" /></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.mb20 {
  margin-bottom: 20px;
}

.ml10 {
  margin-left: 10px;
}
</style>
