import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    productsAll: {},
    isLogin: false,
    uploadedImageUrl: '',
  },
  mutations: {
    productsAll(state, productsAll) {
      state.productsAll = productsAll;
    },
    isLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    uploadedImageUrl(state, imageUrl) {
      state.uploadedImageUrl = imageUrl;
    },
  },
  actions: {
    // product
    async uploadImage({ commit }, formData) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/upload`;
      const { data } = await axios.post(apiURL, formData);
      commit('uploadedImageUrl', data.imageUrl);
    },
    async deleteProduct(_, productId) {
      const apiURL = `wer/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.delete(apiURL);
    },
    async updateProduct(_, { productId, apiParams }) {
      console.log(apiParams);
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.put(apiURL, apiParams);
    },
    async addProduct(_, apiParams) {
      console.log(apiParams);
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product`;
      await axios.post(apiURL, apiParams);
    },
    async getProducts({ commit }) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/products/all`;
      const { data } = await axios.get(apiURL);
      commit('productsAll', data.products);
    },
  },
  modules: {},
});
