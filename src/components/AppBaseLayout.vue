<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-subheader>管理員</v-subheader>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item link :to="{ name: 'Products' }" color="primary" exact>
          <v-list-item-content>
            <v-list-item-title>產品列表</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link color="primary" :to="{ name: 'About' }" exact>
          <v-list-item-content>
            <v-list-item-title>訂單列表</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link color="primary">
          <v-list-item-content>
            <v-list-item-title>優惠券</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-subheader>模擬功能</v-subheader>
      <v-divider></v-divider>
      <v-list dense shaped>
        <v-list-item link>
          <v-list-item-content color="primary">
            <v-list-item-title>模擬訂單</v-list-item-title>
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
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon color="white" v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list nav>
          <v-list-item @click="logout">
            <v-list-item-title>登出</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item @click="login">
            <v-list-item-title>登入</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <!-- <HelloI18n /> -->
      <!-- <HelloWorld /> -->
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// import HelloI18n from './components/HelloI18n.vue';
// import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'AppBaseLayout',

  components: {
    // HelloI18n,
    // HelloWorld,
  },

  data: () => ({
    isOpenLogin: false,
    //
  }),

  methods: {
    login() {
      this.$router.push({ path: '/login' });
    },
    async logout() {
      await this.axios.post('/logout');
      await this.$router.push({ path: '/login' });
    },
  },
});
</script>
