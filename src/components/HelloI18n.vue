<template>
  <div>
    <p>{{ $t('message') }}</p>
    <p>{{ $n(9999, 'currency') }}</p>
    <p>{{ this.$vuetify.lang.current }}</p>
    <v-date-picker :locale="this.$vuetify.lang.current"></v-date-picker>
    <v-select v-model="language" :items="langs">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang"> {{ lang }}</option>
    </v-select>
  </div>
</template>

<script lang="ts">
/*
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelloI18n extends Vue {
  langs: Array<string> = ['zh-TW', 'en-US'];

  @Watch('$i18n.locale')
  watchI18n() {
    console.log(this.$root.$i18n.locale);
  }

  test(a) {
    console.log(a);
  }
}
*/
</script>

<script lang="ts">
import Vue from 'vue';
import localeService from '@/util/localeService.js';

export default Vue.extend({
  data: () => ({
    // need to match thie file name under locales foloder
    langs: ['zh-TW', 'en-US'],
    language: '',
  }),

  created() {
    this.language = this.getLanguage();
    console.log(this.$root.$vuetify);
  },

  watch: {
    language() {
      localeService.switchLanguage(this.language);
      // this.$root.$i18n.locale = this.language;
      // this.$root.$vuetify.lang.current = this.language;
      // localStorage.setItem('locale', this.language);
    },
  },

  methods: {
    getLanguage() {
      return localeService.getLanguage();
      // return localStorage.getItem('locale') || 'en-US';
    },
  },
});
</script>

<i18n>
{
  "en": {},
  "zh-TW": {}
}
</i18n>
