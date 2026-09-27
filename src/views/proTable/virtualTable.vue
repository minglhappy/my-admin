<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue';
import type { ColumnProps } from '@/components/ProTable/index.vue';

const columns: ColumnProps[] = [
  { prop: 'id', label: 'ID', width: 100, align: 'center' },
  { prop: 'name', label: '姓名', width: 150, align: 'center' },
  { prop: 'email', label: '邮箱', width: 250, align: 'center' },
  { prop: 'amount', label: '金额', width: 80, align: 'center' },
  { prop: 'createTime', label: '时间', width: 200 },
  { prop: 'address', label: '地址', width: 200, align: 'center' },
];
const testData = [
  { id: 1, name: '测试1', email: 'a@b.com', amount: '1.00', createTime: '2026-09-20' },
  { id: 2, name: '测试2', email: 'c@d.com', amount: '2.00', createTime: '2026-09-21' },
];
const testColumns = [
  { key: 'id', dataKey: 'id', title: 'ID', width: 100 },
  { key: 'name', dataKey: 'name', title: '姓名', width: 150 },
];

/** 生成 10 万条模拟数据（性能对比用） */
const bigData = Array.from({ length: 100000 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  amount: (Math.random() * 10000).toFixed(2),
  createTime: new Date(Date.now() - i * 3600000).toLocaleString(),
  address: `用户${i + 1}@北京`,
}));

/** 模拟接口：一次性返回（演示虚拟滚动的渲染性能） */
const requestApi = async (params: any) => {
  const start = (params.pageNum - 1) * params.pageSize;
  return {
    code: 200,
    data: {
      // list: bigData.slice(start, start + params.pageSize),
      list: bigData,
      total: bigData.length,
    },
    msg: 'success',
  };
};
</script>

<template>
  <div class="page-container">
    <el-table-v2 :columns="testColumns" :data="testData" :width="400" :height="300" fixed />

    <el-divider>下面是 ProTable 版本</el-divider>
    <ProTable :columns="columns" :request-api="requestApi" :pagination="false" virtual :height="600" />
  </div>
</template>
