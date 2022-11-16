import './registerServiceWorker'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'


import configAxios from './plugins/axios';
import router from './plugins/router';
import EventBus from './plugins/extension';

configAxios();

const app = new Vue({
  vuetify,
  router,
  render: h => h(App)
});


app.$mount('#app');
