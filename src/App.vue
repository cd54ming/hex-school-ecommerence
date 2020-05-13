<template>
  <v-app>
    <v-app-bar app color="primary" dark>
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

      <v-avatar size="36" color="primary lighten-1" @click="isOpenLogin = true">
        <v-icon dark>mdi-account-circle</v-icon>
        <!-- <span class="white--text headline">K</span> -->
      </v-avatar>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <!-- <HelloI18n /> -->
      <!-- <HelloWorld /> -->
    </v-content>

    <Login v-model="isOpenLogin" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Login from '@/components/Login.vue';
// import HelloI18n from './components/HelloI18n.vue';
// import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',

  components: {
    Login,
    // HelloI18n,
    // HelloWorld,
  },

  data: () => ({
    isOpenLogin: false,
    //
  }),

  created() {
    const apiURL = '/products';
    this.axios.get(apiURL).then((result) => {
      console.log(result);
    });
  },

  methods: {},
});
</script>
