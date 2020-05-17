import i18n from '@/i18n';
import vuetify from '@/plugins/vuetify';

function switchLanguage(language) {
  i18n.locale = language;
  vuetify.framework.lang.current = language;
  localStorage.setItem('locale', language);
}

function getLanguage() {
  return localStorage.getItem('locale') || 'en-US';
}

export default {
  switchLanguage,
  getLanguage,
};
