import http from '@/api';

/** 仪表盘数据 */
export interface DashboardData {
  line: { days: string[]; values: number[] };
  bar: { categories: string[]; values: number[] };
  pie: { value: number; name: string }[];
  updatedAt: string;
}

/** 获取仪表盘数据 */
export function getDashboardDataApi() {
  return http.get<DashboardData>('/geeker/dashboard/data');
}
