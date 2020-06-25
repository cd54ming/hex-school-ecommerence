module.exports = {
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'en-US',
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/main.scss"`,
      },
    },
  },
};
