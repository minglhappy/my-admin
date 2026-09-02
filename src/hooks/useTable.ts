import { onMounted, reactive, ref } from 'vue';

/**
 * 表格数据管理
 * @param requestApi - 请求函数，返回 { code, data: { list, total } }
 * @param initParams - 搜索条件的初始值
 */
export function useTable(requestApi: (params: any) => Promise<any>, initParams: object = {}) {
  const tableData = ref<any[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const pageParams = reactive({ pageNum: 1, pageSize: 10 });
  const searchParams = reactive({ ...initParams });

  /** 获取表格数据 */
  const getTableList = async () => {
    loading.value = true;
    try {
      const res = await requestApi({ ...pageParams, ...searchParams });
      tableData.value = res.data.list ?? [];
      total.value = res.data.total ?? 0;
    } finally {
      loading.value = false;
    }
  };

  /** 搜索：回到第一页再查 */
  const handleSearch = () => {
    pageParams.pageNum = 1;
    getTableList();
  };

  /** 重置：清空条件回到第一页 */
  const handleReset = () => {
    Object.keys(searchParams).forEach((key) => {
      (searchParams as any)[key] = '';
    });
    pageParams.pageNum = 1;
    getTableList();
  };

  /** 分页变化 */
  const handlePageChange = () => {
    getTableList();
  };

  onMounted(getTableList); // 挂载即加载

  return { tableData, total, loading, pageParams, searchParams, getTableList, handleSearch, handleReset, handlePageChange };
}
