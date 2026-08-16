import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as Icons from '@element-plus/icons-vue';
import router from '@/routers';
import pinia from '@/stores';

import '@/styles/reset.scss';
import '@/styles/common.scss';
import '@/styles/element.scss';

const app = createApp(App);

app.use(ElementPlus);

app.use(router);
app.use(pinia);

for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component);
}

app.mount('#app');
