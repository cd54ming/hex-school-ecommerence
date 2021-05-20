<template>
  <div>
    <p>{{ $t('testi18n') }}</p>
    <p>{{ $n(9999, 'currency') }}</p>
    <p>{{ $vuetify.lang.current }}</p>
    <p>{{ $i18n.locale }}</p>
    <v-date-picker :locale="$vuetify.lang.current"></v-date-picker>
  </div>
</template>

<script>
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

<script>
import Vue from 'vue';
import localeService from '@/util/localeService.js';

export default Vue.extend({
  created() {
    console.log(this.$root);
  },
});
</script>

<i18n>
{
  "en": {},
  "zh-TW": {}
}

</i18n>
