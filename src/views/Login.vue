<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card :loading="loading" raised>
          <validation-observer ref="form" v-slot="{ handleSubmit, invalid }">
            <v-form @submit.prevent="handleSubmit(login)">
              <v-card-title class="justify-center">六角學院</v-card-title>
              <v-card-text>
                <validation-provider vid="email" name="email" v-slot="{ errors }" rules="required">
                  <v-text-field
                    v-model="username"
                    :label="$t('email')"
                    type="email"
                    :error-messages="errors"
                    :disabled="loading"
                  >
                  </v-text-field>
                </validation-provider>

                <validation-provider
                  vid="password"
                  name="Password"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <v-text-field
                    v-model="password"
                    :label="$t('password')"
                    type="password"
                    :error-messages="errors"
                    :disabled="loading"
                    @keyup.enter="login"
                  ></v-text-field>
                </validation-provider>

                <!-- <v-checkbox label="保持登入"></v-checkbox> -->
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed type="submit" color="primary" :disabled="loading || invalid">
                  {{ $t('login') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
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
    };
  },

  watch: {
    username() {
      this.$refs.form.reset();
    },
    password() {
      this.$refs.form.reset();
    },
  },

  methods: {
    async login() {
      const { username, password } = this;
      const apiURL = '/admin/signin';
      const apiParams = { username, password };
      const callbackURL = this.$route.query.callback;
      const path = callbackURL || '/';

      this.loading = true;
      const {
        data: { success: signInSuccess = false },
      } = await this.axios.post(apiURL, apiParams);
      if (!signInSuccess) {
        this.$refs.form.setErrors({
          email: this.$t('login-error'),
          password: this.$t('login-error'),
        });
      } else {
        this.$router.push({ path });
      }
      this.loading = false;
    },
  },
});
</script>
