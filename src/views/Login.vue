<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card :loading="loading" raised>
          <validation-observer ref="form" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(login)">
              <v-card-title class="justify-center">六角學院</v-card-title>
              <v-card-text class="px-6 py-4">
                <validation-provider vid="email" name="email" v-slot="{ errors }" rules="required">
                  <v-text-field
                    v-model="username"
                    dense
                    outlined
                    :label="$t('email')"
                    type="email"
                    :error-messages="errors"
                    :disabled="loading"
                    autocomplete="username"
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
                    dense
                    outlined
                    autocomplete="current-password"
                    :error-messages="errors"
                    :disabled="loading"
                    @keyup.enter="handleSubmit(login)"
                  ></v-text-field>
                </validation-provider>

                <div class="caption grey--text">
                  <div>測試用帳號: hi54ming@gmail.com</div>
                  <div>測試用密碼: hexvueapi</div>
                </div>
                <!-- <v-checkbox label="保持登入"></v-checkbox> -->
              </v-card-text>
              <v-card-actions class="pa-6 pt-0">
                <v-spacer></v-spacer>
                <!-- <v-btn @click="test">test</v-btn> -->
                <v-btn depressed type="submit" color="primary" :disabled="loading">
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
    test() {
      const myHeaders = new Headers();
      myHeaders.append(
        'Cookie',
        'buyClass=valuation; ShopLan=1; dns%5Fgoogle%5Ftag=++++++++++++++++++++++++++++++++++++++++++++++++++; dns%5Fgoogle%5Fsite%5Fverification=; ShopDefault=1; dns%5Fyahoo%5Fverification%5Fkey=; dns%5Fyahoo%5Fwebmaster%5Fcode=; dns%5FPageTracker=UA%2D93583410%2D4; Enable%5FShareButton=False; NoFixUrl=True; WaterMark=False; partnerID=rwd1262; dns%5Fbing%5Fuet=8ED90FB69BCA31CF55BE7AADDF6636F3; WebName=%E5%8A%9B%E5%AE%87%E5%BD%A9%E8%97%9D%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8; PageTracker=; ASPSESSIONIDQCRBSACD=HDCOFHJANJBEEPLHKFCIJMEF',
      );

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        'http://www.liyu-gravure.com.tw/ec99/rwd1262/product.asp?prodid=2_37&category_id=2',
        requestOptions,
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
    },
    async login() {
      const { username, password } = this;
      const apiURL = '/admin/signin';
      const apiParams = { username, password };
      const callbackURL = this.$route.query.callback;
      const path = callbackURL || 'mockShopping';

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
