export const ResultEnum = {
  SUCCESS: 200,
  OVERDUE: 401,
  TIMEOUT: 30000,
} as const;

export const RequestEnum = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export const ContentTypeEnum = {
  JSON: 'application/json;charset=UTF-8',
  FORM: 'application/x-www-form-urlencoded;charset=UTF-8',
  UPLOAD: 'multipart/form-data',
} as const;
