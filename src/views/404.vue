<template>
  <v-container fill-height>
    <v-row>
      <v-col class="text-center">
        <h1 class="primary--text display-2">歐哦, 404</h1>
        <p>您找尋的網頁不存在</p>
        <v-btn outlined color="primary" exact>帶我離開這裡</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'notFuound',
};
</script>
