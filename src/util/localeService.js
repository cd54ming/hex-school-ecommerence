import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import { localize as veeValidateLocalize } from '@/plugins/veeValidate';
import moment from 'moment';
import Vue from 'vue';

// 添加 local 變數至 vue instance 中，可以使用 this.$locale 來做訪問
const DEFAULT_LOCALE = process.env.VUE_APP_DEFAULT_LOCALE;
const vueLocale = Vue.observable({ locale: DEFAULT_LOCALE });
Object.defineProperty(Vue.prototype, '$locale', {
  get() {
    return vueLocale.locale;
  },
  set(locale) {
    vueLocale.locale = locale;
  },
});

const locales = Object.freeze({
  'zh-TW': '中文',
  'en-US': 'English',
});

function getCurrentLocale() {
  return localStorage.getItem('locale') || DEFAULT_LOCALE;
}

function switchLocale(locale) {
  if (locale === getCurrentLocale()) return;
  if (!Object.keys(locales).includes(locale)) switchLocale(DEFAULT_LOCALE);

  Vue.prototype.$locale = locale;
  i18n.locale = locale;
  vuetify.framework.lang.current = locale;
  veeValidateLocalize(locale);
  moment.locale(locale);
  localStorage.setItem('locale', locale);
}

function setDefaultLocale() {
  const locale = getCurrentLocale();

  Vue.prototype.$locale = locale;
  i18n.locale = locale;
  vuetify.framework.lang.current = locale;
  veeValidateLocalize(locale);
  moment.locale(locale);
  localStorage.setItem('locale', locale);
}

// eslint-disable-next-line object-curly-newline
export { setDefaultLocale, switchLocale, getCurrentLocale, locales };
// eslint-disable-next-line object-curly-newline
export default { setDefaultLocale, switchLocale, getCurrentLocale, locales };
