<script setup lang="ts">
import { computed, ref } from 'vue';
import ECharts from '@/components/ECharts/index.vue';
import { getDashboardDataApi } from '@/api/modules/dashboard';
import { type DashboardData } from '@/api/modules/dashboard';

import { type EChartsOption } from 'echarts';

const dashboardData = ref<DashboardData>();

const loadData = async () => {
  const res = await getDashboardDataApi();
  dashboardData.value = res.data;
};
loadData();

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
</style>
