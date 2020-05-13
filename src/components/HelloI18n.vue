<template>
  <div>
    <p>{{ $t('message') }}</p>
    <v-select v-model="$root.$i18n.locale" :items="langs">
      <!-- <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ lang }}</option> -->
    </v-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelloI18n extends Vue {
  langs: Array<string> = ['zh-TW', 'en'];

  @Watch('$i18n.locale')
  watchI18n() {
    console.log(this.$root.$i18n.locale);
  }
}
</script>

<i18n>
{
  "en": {},
  "zh-TW": {}
}
</i18n>
