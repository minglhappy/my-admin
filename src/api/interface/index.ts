export interface ResultData<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface PageParams {
  pageNum: number;
  pageSize: number;
}

export interface PageResult<T = any> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
