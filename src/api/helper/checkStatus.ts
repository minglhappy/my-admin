import { ElMessage } from 'element-plus';

export function checkStatus(status: number): void {
  const messages: Record<number, string> = {
    400: '请求错误,请您稍后重试~',
    401: '登录失效,请您重新登录~',
    403: '当前账号无权限访问~',
    404: '您所访问的资源不存在',
    405: '请求方式错误，请您稍后重试~',
    408: '请求超时，请您稍后重试~',
    500: '服务器内部错误，请您稍后重试~',
    501: '服务未实现，请您稍后重试~',
    502: '网关错误，请您稍后重试~',
    503: '服务不可用，请您稍后重试~',
    504: '网关超时，请您稍后重试~',
  };

  const message = messages[status] || '请求失败，请您稍后重试~';
  ElMessage.error(message);
}
