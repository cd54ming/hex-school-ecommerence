import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import { localize as veeValidateLocalize } from '@/plugins/veeValidate';

const DEFAULT_LOCALE = process.env.VUE_APP_DEFAULT_LOCALE;
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

  i18n.locale = locale;
  vuetify.framework.lang.current = locale;
  veeValidateLocalize(locale);
  localStorage.setItem('locale', locale);
}

function setDefaultLocale() {
  const locale = getCurrentLocale();

  i18n.locale = locale;
  vuetify.framework.lang.current = locale;
  veeValidateLocalize(locale);
  localStorage.setItem('locale', locale);
}

// eslint-disable-next-line object-curly-newline
export { setDefaultLocale, switchLocale, getCurrentLocale, locales };
// eslint-disable-next-line object-curly-newline
export default { setDefaultLocale, switchLocale, getCurrentLocale, locales };
