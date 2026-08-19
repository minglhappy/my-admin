<script lang="ts">
/** 列配置类型（普通 script 块可以导出类型给父组件用） */
export interface ColumnProps {
  prop: string; // 字段名（也是插槽名）
  label: string; // 列标题 / 表单项标签
  width?: number | string; // 列宽
  fixed?: 'left' | 'right'; // 固定列
  align?: 'left' | 'center' | 'right'; // 对齐方式
  search?: {
    // 配了 search 的列会出现在搜索表单
    el?: 'input' | 'select'; // 控件类型
    options?: { label: string; value: string | number }[];
    defaultValue?: string | number;
  };
}
</script>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { ResultData } from '@/api/interface';

interface ProTableProps {
  /** 列配置 */
  columns: ColumnProps[];
  /** 请求函数，返回 { code, data: { list, total } } */
  requestApi?: (params: any) => Promise<ResultData<any>>;
  /** 是否显示分页 */
  pagination?: boolean;
  /** 是否显示多选列 */
  selection?: boolean;
  /** 行唯一键 */
  rowKey?: string;
}

const props = withDefaults(defineProps<ProTableProps>(), {
  pagination: true,
  selection: false,
  rowKey: 'id',
});

// ─── 搜索 ───
const searchColumns = computed(() => props.columns.filter((col) => col.search));
const searchForm = reactive<Record<string, any>>({});

onMounted(() => {
  // 用 defaultValue 初始化搜索表单
  searchColumns.value.forEach((col) => {
    if (col.search?.defaultValue !== undefined) searchForm[col.prop] = col.search.defaultValue;
  });
  getTableList();
});

const handleSearch = () => {
  pageParams.pageNum = 1;
  getTableList();
};

const handleReset = () => {
  searchColumns.value.forEach((col) => {
    searchForm[col.prop] = col.search?.defaultValue ?? '';
  });
  pageParams.pageNum = 1;
  getTableList();
};

// ─── 表格数据 ───
const tableData = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const pageParams = reactive({ pageNum: 1, pageSize: 10 });

const getTableList = async () => {
  if (!props.requestApi) return;
  loading.value = true;
  try {
    const res = await props.requestApi({ ...pageParams, ...searchForm });
    tableData.value = res.data.list ?? [];
    total.value = res.data.total ?? 0;
  } finally {
    loading.value = false;
  }
};

// ─── 多选 ───
const selectedRows = ref<any[]>([]);
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// ─── 分页 ───
const handlePageChange = () => {
  getTableList();
};

/** 暴露给父组件的方法（父组件通过 ref 调用） */
defineExpose({
  getTableList, // 手动刷新表格
  selectedRows, // 当前选中的行
});
</script>

<template>
  <div class="pro-table">
    <!-- ① 搜索表单：由 searchColumns 自动生成 -->
    <el-form v-if="searchColumns.length > 0" :inline="true" :model="searchForm" class="pro-table-search">
      <el-form-item v-for="col in searchColumns" :key="col.prop" :label="col.label">
        <el-input v-if="!col.search?.el || col.search.el === 'input'" v-model="searchForm[col.prop]" placeholder="请输入" clearable @keyup.enter="handleSearch" />
        <el-select v-else-if="col.search.el === 'select'" v-model="searchForm[col.prop]" placeholder="请选择" clearable>
          <el-option v-for="opt in col.search?.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- ② 表格：由 columns 自动生成 -->
    <el-table v-loading="loading" :data="tableData" :row-key="rowKey" border stripe @selection-change="handleSelectionChange">
      <el-table-column v-if="selection" type="selection" width="55" align="center" />
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :fixed="col.fixed" :align="col.align" show-overflow-tooltip>
        <!-- 单元格：父组件可用 #column-字段名 插槽自定义，否则显示原值 -->
        <template #default="scope">
          <slot :name="`column-${col.prop}`" :row="scope.row" :index="scope.$index">
            <span>{{ scope.row[col.prop] }}</span>
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列：父组件用 #operation 插槽定义，没定义就不渲染 -->
      <el-table-column v-if="$slots.operation" label="操作" width="180" fixed="right" align="center">
        <template #default="scope">
          <slot name="operation" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- ③ 分页 -->
    <el-pagination
      v-if="pagination"
      v-model:current-page="pageParams.pageNum"
      v-model:page-size="pageParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      class="pro-table-pagination"
      @change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.pro-table {
  .pro-table-search {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
  }

  .el-table {
    margin-top: 15px;
  }

  .pro-table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
