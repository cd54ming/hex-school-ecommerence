import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import en from 'vuetify/es5/locale/en';

// import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { 'en-US': en, 'zh-TW': zhHant },
    current: 'zh-TW',
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    // TODO chage theme color
    themes: {
      // light: {
      //   primary: colors.red.darken1, // #E53935
      //   secondary: colors.red.lighten4, // #FFCDD2
      //   accent: colors.indigo.base, // #3F51B5
      // },
    },
  },
});
