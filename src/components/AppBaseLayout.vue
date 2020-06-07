<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-subheader>管理員</v-subheader>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item link color="primary" :to="{ name: 'Products' }" exact>
          <v-list-item-content>
            <v-list-item-title>
              <span>產品列表</span>
              <v-progress-circular
                v-if="checkingLogin && navigateTo === 'Products'"
                class="ml-3"
                color="primary"
                indeterminate
                size="15"
                width="2"
              ></v-progress-circular>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link color="primary" :to="{ name: 'Orders' }" exact>
          <v-list-item-content>
            <v-list-item-title>
              <span>訂單列表</span>
              <v-progress-circular
                v-if="checkingLogin && navigateTo === 'Orders'"
                class="ml-3"
                color="primary"
                indeterminate
                size="15"
                width="2"
              ></v-progress-circular
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link color="primary" :to="{ name: 'Coupons' }" exact>
          <v-list-item-content>
            <v-list-item-title>
              <span>優惠券</span>
              <v-progress-circular
                v-if="checkingLogin && navigateTo === 'Coupons'"
                class="ml-3"
                color="primary"
                indeterminate
                size="15"
                width="2"
              ></v-progress-circular>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-subheader>模擬功能</v-subheader>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item link color="primary" :to="{ name: 'MockShopping' }" exact>
          <v-list-item-content>
            <v-list-item-title>模擬購物</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link color="primary" :to="{ name: 'MockShoppingCart' }" exact>
          <v-list-item-content>
            <v-list-item-title>模擬購物車</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat app color="primary" clipped-left height="56">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <v-menu v-model="settingMenu" offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn icon color="white" v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-group v-model="localeList">
            <template v-slot:activator>
              <v-list-item-title>
                {{ $t('language') }}
                <!-- <v-icon small>mdi-translate</v-icon> -->
              </v-list-item-title>
            </template>
            <v-list-item
              v-for="(locale, key, index) in locales"
              :key="index"
              @click="switchLocale(key)"
            >
              <v-list-item-title>{{ locale }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { locales, switchLocale as localServiceSwitchLocale } from '@/util/localeService';

export default Vue.extend({
  name: 'AppBaseLayout',

  data: () => ({
    isOpenLogin: false,
    settingMenu: false,
    localeList: false,
  }),

  created() {
    this.locales = locales;
  },

  methods: {
    async logout() {
      this.closeSettingMenu();
      await this.$store.dispatch('logout');
      this.$router.push({ path: '/login' });
    },
    switchLocale(locale: string) {
      localServiceSwitchLocale(locale);
      this.closeSettingMenu();
    },
    closeSettingMenu() {
      this.localeList = false;
      this.settingMenu = false;
    },
  },

  computed: {
    checkingLogin() {
      return this.$store.state.checkingLogin;
    },
    navigateTo() {
      return this.$store.state.navigateTo;
    },
  },
});
</script>
