<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ProTable from '@/components/ProTable/index.vue';
import type { ColumnProps } from '@/components/ProTable/index.vue';

/** 列配置：表格列和搜索项都由它定义 */
const columns: ColumnProps[] = [
  { prop: 'id', label: 'ID', width: 80 },
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

/** 模拟数据（阶段 11 换成真实接口，返回结构不变） */
const mockData = [
  { id: 1, username: 'admin', nickname: '管理员', status: 1, createTime: '2026-08-01 10:00:00' },
  { id: 2, username: 'zhangsan', nickname: '张三', status: 1, createTime: '2026-08-02 11:30:00' },
  { id: 3, username: 'lisi', nickname: '李四', status: 0, createTime: '2026-08-03 14:20:00' },
];

// const props = withDefaults(defineProps<ProTableProps>(), {
//     // ...默认值不变
//   });

//   // ─── 虚拟模式列配置（★ 移到这里，props 之后）───
// const virtualColumns = computed(() =>
//   props.columns.map((col) => ({
//     key: col.prop,
//     dataKey: col.prop,
//     title: col.label,
//     width: typeof col.width === 'number' ? col.width : 150,
//     align: col.align || 'left',
//   }))
// );

// const virtualTableWidth = computed(() =>
//   virtualColumns.value.reduce((sum, col) => sum + (typeof col.width === 'number' ?
//   col.width : 150), 0)
// );

/** 请求函数：模拟后端过滤 + 分页 */
const requestApi = async (params: any) => {
  const filtered = mockData.filter((item) => {
    if (params.username && !item.username.includes(params.username)) return false;
    if (params.status !== '' && params.status !== undefined && item.status !== params.status) return false;
    return true;
  });
  const start = (params.pageNum - 1) * params.pageSize;
  return {
    code: 200,
    data: { list: filtered.slice(start, start + params.pageSize), total: filtered.length },
    msg: 'success',
  };
};

const proTableRef = ref();

const handleEdit = (row: any) => {
  ElMessage.success(`编辑 ${row.username}`);
};

const handleDelete = (row: any) => {
  ElMessage.warning(`删除 ${row.username}`);
  proTableRef.value?.getTableList(); // ★ 通过 ref 调用组件暴露的方法
};
</script>

<template>
  <div class="page-container">
    <ProTable ref="proTableRef" :columns="columns" :request-api="requestApi" selection>
      <!-- 状态列自定义渲染（插槽名 = column-字段名） -->
      <template #column-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>
