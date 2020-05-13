<template>
  <v-dialog v-model="value" width="350">
    <v-card>
      <v-toolbar flat dense color="primary">
        <v-spacer></v-spacer>
        <v-btn icon small color="white" @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title class="justify-center">六角學院</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field solo type="email" label="電子郵件"></v-text-field>
          <v-text-field solo type="password" label="密碼"></v-text-field>
          <v-checkbox label="保持登入"></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" @click="login">登入</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: ['value'],

  methods: {
    login() {
      const apiURL = '/signin';
      this.axios.get(apiURL).then((result) => {
        console.log(result);
      });
    },
  },
});
</script>
