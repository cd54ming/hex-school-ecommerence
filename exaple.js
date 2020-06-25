/* eslint-disable @typescript-eslint/no-unused-vars */

import Vue from 'vue';
const DEFAULT_LOCALE = process.env.VUE_APP_DEFAULT_LOCALE;

// // main.js
// new Vue({
//   data: {
//     locale: DEFAULT_LOCALE,
//   },
// }).$mount('#app');

// // swichLanguageComponent.vue
// const swichLanguageComponent = {
//   methods: {
//     switchLocale(locale) {
//       this.$root.locale = locale;
//     },
//   },
// };

// // anotherComponent.vue
// const anotherChildComponent = {
//   watch: {
//     locale() {
//       // do something...
//     },
//   },
//   computed: {
//     locale() {
//       return this.$root.locale;
//     },
//   },
// };

// locale.js
const vueLocale = Vue.observable({ locale: DEFAULT_LOCALE });
Object.defineProperty(Vue.prototype, '$locale', {
  get() {
    return vueLocale.locale;
  },
  set(locale) {
    vueLocale.locale = locale;
  },
});

// swichLanguageComponent.vue
const swichLanguageComponent = {
  methods: {
    switchLocale(locale) {
      Vue.prototype.$locale = locale;
    },
  },
};

// childComponent.vue
const anotherChildComponent = {
  watch: {
    locale() {
      // do something...
    },
  },
  computed: {
    locale() {
      return this.$locale;
    },
  },
};
