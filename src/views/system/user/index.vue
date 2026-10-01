<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue';
import type { ColumnProps } from '@/components/ProTable/index.vue';
import { getUserListApi } from '@/api/modules/user';
import { ElMessage } from 'element-plus';

const handleAdd = () => ElMessage.success('新增用户');
const handleEdit = (row: any) => ElMessage.success(`编辑 ${row.username}`);
const handleDelete = (row: any) => ElMessage.warning(`删除 ${row.username}`);

const handleExport = () => ElMessage.success('导出中...');

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
    <!-- 表格上方工具栏：v-auth 控制显隐 -->
    <div class="toolbar">
      <el-button v-auth="'user:add'" type="primary" @click="handleAdd">新增用户</el-button>
      <el-button v-auth="'user:export'" @click="handleExport">导出</el-button>
    </div>

    <ProTable :columns="columns" :request-api="requestApi">
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button v-auth="'user:edit'" type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button v-auth="'user:delete'" type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </ProTable>
  </div>
</template>
