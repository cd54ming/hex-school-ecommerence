import i18n from '@/i18n';
import vuetify from '@/plugins/vuetify';

const locales = Object.freeze({
  'zh-TW': '中文',
  'en-US': 'English',
});

function getDefaultLocale() {
  return process.env.VUE_APP_DEFAULT_LOCALE;
}

function setDefaultLocale() {
  if (!localStorage.getItem('locale')) {
    localStorage.setItem('locale', getDefaultLocale());
  }
}

function getCurrentLocale() {
  return localStorage.getItem('locale') || getDefaultLocale();
}

function switchLocale(locale) {
  if (locale === getCurrentLocale()) return;
  if (!Object.keys(locales).includes(locale)) switchLocale(getDefaultLocale());
  i18n.locale = locale;
  vuetify.framework.lang.current = locale;
  localStorage.setItem('locale', locale);
}

export default {
  getDefaultLocale,
  setDefaultLocale,
  switchLocale,
  getCurrentLocale,
  locales,
};
