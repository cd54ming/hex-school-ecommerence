import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import numberFormats from '@/util/numberFormats';

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  locale: localStorage.getItem('locale') || process.env.VUE_APP_DEFAULT_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || process.env.VUE_APP_DEFAULT_LOCALE,
  numberFormats,
  silentFallbackWarn: true,
  messages: loadLocaleMessages(),
});
