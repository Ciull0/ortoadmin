import './registerServiceWorker'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import ElementUI from 'element-ui';
// import ElementUI's styles
import 'element-ui/lib/theme-chalk/index.css';
// import this package's styles
import 'element-tiptap/lib/index.css';
import { ElementTiptapPlugin } from 'element-tiptap';

import configAxios from './plugins/axios';
import router from './plugins/router';
import EventBus from './plugins/extension';

configAxios();

// use ElementUI's plugin
Vue.use(ElementUI);
// use this package's plugin
Vue.use(ElementTiptapPlugin, {
  /* plugin options */
});

const app = new Vue({
  vuetify,
  router,
  render: h => h(App)
});


app.$mount('#app');
