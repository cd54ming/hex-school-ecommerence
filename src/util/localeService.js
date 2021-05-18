import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import { localize as veeValidateLocalize } from '@/plugins/veeValidate';
import moment from 'moment';
import Vue from 'vue';

const locales = Object.freeze({
  'zh-TW': '中文',
  'en-US': 'English',
});

// 添加 local 變數至 vue instance 中，可以使用 this.$locale 來做訪問
let vueLocale;
Object.defineProperty(Vue.prototype, '$locale', {
  get() {
    return vueLocale;
  },
  set(locale) {
    if (vueLocale && (locale === vueLocale || !(locale in locales))) return;

    vueLocale = locale;
    i18n.locale = locale;
    vuetify.framework.lang.current = locale;
    veeValidateLocalize(locale);
    moment.locale(locale);
    localStorage.setItem('locale', locale);
  },
});

export { locales };
export default { locales };
