<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue';
import type { ColumnProps } from '@/components/ProTable/index.vue';

const cityMap: Record<string, string[]> = {
  广东: ['广州', '深圳', '珠海'],
  江苏: ['南京', '苏州', '无锡'],
  浙江: ['杭州', '宁波', '温州'],
};

const columns: ColumnProps[] = [
  {
    prop: 'province',
    label: '省份',
    width: 150,
    search: {
      el: 'select',
      options: ['广东', '江苏', '浙江'].map((p) => ({ label: p, value: p })),
    },
  },

  {
    prop: 'city',
    label: '城市',
    width: 150,
    search: {
      el: 'select',
      optionsFn: (form) => {
        const cities = cityMap[form.province] || [];
        return cities.map((c) => ({ label: c, value: c }));
      },
    },
  },

  { prop: 'username', label: '姓名', width: 150, search: { el: 'input' } },
  { prop: 'createTime', label: '创建时间', width: 180 },
];

/** 模拟数据 */
const mockData = [
  { id: 1, username: '张三', province: '广东', city: '深圳', createTime: '2026-09-01 10:00:00' },
  { id: 2, username: '李四', province: '广东', city: '广州', createTime: '2026-09-02 11:00:00' },
  { id: 3, username: '王五', province: '江苏', city: '南京', createTime: '2026-09-03 12:00:00' },
  { id: 4, username: '赵六', province: '江苏', city: '苏州', createTime: '2026-09-04 13:00:00' },
  { id: 5, username: '钱七', province: '浙江', city: '杭州', createTime: '2026-09-05 14:00:00' },
  { id: 6, username: '张一', province: '广东', city: '深圳', createTime: '2026-09-01 10:00:00' },
  { id: 7, username: '张二', province: '广东', city: '深圳', createTime: '2026-09-01 10:00:00' },
];

/** 模拟接口：按省份/城市/姓名过滤 */
const requestApi = async (params: any) => {
  const filtered = mockData.filter((item) => {
    if (params.province && item.province !== params.province) return false;
    if (params.city && item.city !== params.city) return false;
    if (params.username && !item.username.includes(params.username)) return false;
    return true;
  });
  return { code: 200, data: { list: filtered, total: filtered.length }, msg: 'success' };
};
</script>

<template>
  <div class="page-container">
    <ProTable :columns="columns" :request-api="requestApi" :pagination="false" />
  </div>
</template>
