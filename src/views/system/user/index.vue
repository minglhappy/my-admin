<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue';
import type { ColumnProps } from '@/components/ProTable/index.vue';
import { getUserListApi } from '@/api/modules/user';

const columns: ColumnProps[] = [
  { prop: 'username', label: '用户名', width: 150, search: { el: 'input' } },
  { prop: 'nickname', label: '昵称', width: 150 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    search: {
      el: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  { prop: 'createTime', label: '创建时间', width: 180 },
];

/** 真实调用 Mock 接口（阶段 9 的模拟数据可以退休了） */
const requestApi = (params: any) => getUserListApi(params);
</script>

<template>
  <div class="page-container">
    <ProTable :columns="columns" :request-api="requestApi">
      <template #column-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </ProTable>
  </div>
</template>
