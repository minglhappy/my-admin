import type { App, Directive } from 'vue';
import { auth } from './modules/auth';
import { copy } from './modules/copy';
import { debounce } from './modules/debounce';
import { throttle } from './modules/throttle';
import { longpress } from './modules/longpress';
import { draggable } from './modules/draggable';
import { waterMarker } from './modules/waterMarker';

/** 指令注册表：名字 → 指令对象 */
const directivesMap: Record<string, Directive> = {
  auth,
  copy,
  debounce,
  throttle,
  longpress,
  draggable,
  waterMarker,
};

/** 批量注册所有自定义指令 */
export function setupDirectives(app: App) {
  Object.entries(directivesMap).forEach(([name, directive]) => {
    app.directive(name, directive); // 注册后模板里就能用 v-名字
  });
}
