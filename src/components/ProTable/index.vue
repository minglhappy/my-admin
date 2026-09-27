<script lang="ts">
/** 列配置类型（普通 script 块可以导出类型给父组件用） */
export interface ColumnProps {
  prop: string; // 字段名（也是插槽名）
  label: string; // 列标题 / 表单项标签
  width?: number | string; // 列宽
  fixed?: 'left' | 'right'; // 固定列
  align?: 'left' | 'center' | 'right'; // 对齐方式
  search?: {
    el?: 'input' | 'select';
    options?: { label: string; value: string | number }[];
    // 动态选项函数（联动场景）：根据当前表单计算本列选项
    optionsFn?: (form: Record<string, any>) => { label: string; value: string | number }[];
    defaultValue?: string | number;
  };
}
</script>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
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
  /** 虚拟滚动模式（大数据量用） */
  virtual?: boolean;
  /** 虚拟模式表格高度 */
  height?: number;
}

const props = withDefaults(defineProps<ProTableProps>(), {
  pagination: true,
  selection: false,
  rowKey: 'id',
  virtual: false,
  height: 500,
});

// ─── 搜索 ───
const searchColumns = computed(() => props.columns.filter((col) => col.search));
const searchForm = reactive<Record<string, any>>({});

// 动态选项（联动机制）
// 动态选项缓存：字段名->选项列表
const dynamicOptions = reactive<Record<string, { label: string; value: string | number }[]>>({});

// 1、重算所有的 optionsFn列的选项
const refreshDynamicOptions = () => {
  props.columns.forEach((col) => {
    if (col.search?.optionsFn) {
      dynamicOptions[col.prop] = col.search.optionsFn(searchForm);
    }
  });
};

// 2、通用规则：已选值不再新选项中--->自动清空；
const clearInvalidValues = () => {
  props.columns.forEach((col) => {
    const opts = dynamicOptions[col.prop];
    if (!opts) return;
    const current = searchForm[col.prop];
    if (current !== '' && current !== undefined && current !== null) {
      if (!opts.some((o) => o.value === current)) {
        searchForm[col.prop] = '';
      }
    }
  });
};

// 3、监听表单变化->重算+清理
watch(
  searchForm,
  () => {
    refreshDynamicOptions();
    clearInvalidValues();
  },
  { deep: true }
);

// ─── 虚拟模式列配置（★ 在 props 之后）───
const virtualColumns = computed(() =>
  props.columns.map((col) => ({
    key: col.prop,
    dataKey: col.prop,
    title: col.label,
    width: typeof col.width === 'number' ? col.width : 150,
    align: col.align || 'right',
  }))
);

// ─── 虚拟模式表格总宽（★ 列宽总和，el-table-v2 对百分比宽度支持差）───
const virtualTableWidth = computed(() => virtualColumns.value.reduce((sum, col) => sum + (typeof col.width === 'number' ? col.width : 150), 0));

onMounted(() => {
  searchColumns.value.forEach((col) => {
    if (col.search?.defaultValue !== undefined) searchForm[col.prop] = col.search.defaultValue;
  });
  getTableList();
  refreshDynamicOptions();
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

defineExpose({
  getTableList,
  selectedRows,
});
</script>

<template>
  <div class="pro-table">
    <!-- ① 搜索表单 -->
    <el-form v-if="searchColumns.length > 0" :inline="true" :model="searchForm" class="pro-table-search">
      <el-form-item v-for="col in searchColumns" :key="col.prop" :label="col.label">
        <el-input v-if="!col.search?.el || col.search.el === 'input'" v-model="searchForm[col.prop]" placeholder="请输入" clearable @keyup.enter="handleSearch" />
        <el-select v-else-if="col.search.el === 'select'" v-model="searchForm[col.prop]" placeholder="请选择" clearable>
          <!-- <el-option v-for="opt in col.search?.options" :key="opt.value" :label="opt.label"
:value="opt.value" /> -->
          <el-option v-for="opt in dynamicOptions[col.prop] || col.search?.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- ② 虚拟滚动表格 -->
    <el-table-v2 v-if="virtual" :columns="virtualColumns" :data="tableData" :width="virtualTableWidth" :height="height" fixed />

    <!-- ② 普通表格 -->
    <el-table v-else v-loading="loading" :data="tableData" :row-key="rowKey" border stripe @selection-change="handleSelectionChange">
      <el-table-column v-if="selection" type="selection" width="55" align="center" />
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :fixed="col.fixed" :align="col.align" show-overflow-tooltip>
        <template #default="scope">
          <slot :name="`column-${col.prop}`" :row="scope.row" :index="scope.$index">
            <span>{{ scope.row[col.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
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

    :deep(.el-select) {
      width: 200px;
    }

    :deep(.el-input) {
      width: 200px;
    }
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
