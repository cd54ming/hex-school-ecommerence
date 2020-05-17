import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    productsAll: {},
    isLogin: false,
  },
  mutations: {
    productsAll(state, productsAll) {
      state.productsAll = productsAll;
    },
    isLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
  },
  actions: {
    // product
    async deleteProduct(_, productId) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.delete(apiURL);
    },
    async updateProduct(_, { productId, apiParams }) {
      console.log(apiParams);
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.put(apiURL, apiParams);
    },
    async addProduct(_, apiParams) {
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
