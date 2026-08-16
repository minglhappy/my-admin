export enum ResultEnum {
  SUCCESS = 200,
  OVERDUE = 401,
  TIMEOUT = 30000,
}

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM = 'application/x-www-form-urlencoded;charset=UTF-8',
  UPLOAD = 'multipart/form-data',
}
