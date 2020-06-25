import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import en from 'vuetify/es5/locale/en';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { 'en-US': en, 'zh-TW': zhHant },
    current: process.env.VUE_APP_DEFAULT_LOCALE,
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    // TODO chage theme color
    themes: {
      light: {
        // primary: colors.teal.darken3, // #E53935
        //   secondary: colors.red.lighten4, // #FFCDD2
        //   accent: colors.indigo.base, // #3F51B5
      },
    },
  },
});
