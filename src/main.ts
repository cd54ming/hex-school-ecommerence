import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/i18n';
import { setup as veeValidateSetup } from '@/plugins/veeValidate';
import { setup as axiosSetup } from '@/plugins/axios';
import { setDefaultLocale } from '@/util/localeService';
import App from './App.vue';
import router from './router';
import store from './store';

veeValidateSetup();
axiosSetup();
setDefaultLocale();
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
