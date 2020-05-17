<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card :loading="loading" raised>
          <v-card-title class="justify-center">六角學院</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="username"
                type="email"
                dense
                required
                label="電子郵件"
                :error="userNameError"
              ></v-text-field>
              <v-text-field
                @keyup.enter="login"
                v-model="password"
                type="password"
                label="密碼"
                dense
                required
              ></v-text-field>
              <v-checkbox label="保持登入"></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" :disabled="loading" @click="login">登入 </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      userNameError: false,
      passwordError: false,
    };
  },

  watch: {
    username() {
      this.userNameError = false;
    },
    password() {
      this.passwordError = false;
    },
  },

  methods: {
    async login() {
      const { username, password } = this;
      const apiURL = '/admin/signin';
      const apiParams = { username, password };
      const callbackURL = this.$route.query.callback;
      this.loading = true;
      const { data: response } = await this.axios.post(apiURL, apiParams);
      if (response.success) {
        if (callbackURL) {
          await this.$router.push({ path: `${callbackURL}` });
        } else {
          await this.$router.push({ path: '/' });
        }
      } else {
        console.log(response.message);
        console.table(response.error);
        this.userNameError = true;
        this.passwordError = true;
      }
      this.loading = false;
    },
  },
});
</script>
