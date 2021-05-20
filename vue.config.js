module.exports = {
  transpileDependencies: ['vuetify'],

  publicPath: process.env.NODE_ENV === 'production' ? '/hex-school-ecommerence/' : './',

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

  lintOnSave: false,

  configureWebpack: {
    devtool: 'source-map',
  },

  pages: {
    index: {
      entry: './src/main.js',
    },
  },
};
