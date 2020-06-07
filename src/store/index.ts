import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    // productsAll: {},
    cart: {},
    product: {},
    productsForSaleByPage: [],
    productsForSalePagination: {},
    productsByPage: [],
    productsPagination: {},
    uploadedImageUrl: '',
    checkingLogin: false,
    navigateTo: null,
  },
  mutations: {
    // productsAll(state, productsAll) {
    //   state.productsAll = productsAll;
    // },
    cart(state, cart) {
      state.cart = cart;
    },
    checkingLogin(state, { loading, navigateTo }) {
      state.checkingLogin = loading;
      state.navigateTo = navigateTo;
    },
    product(state, product) {
      state.product = product;
    },
    productsForSaleByPage(state, productsForSaleByPage) {
      state.productsForSaleByPage = productsForSaleByPage;
    },
    productsForSalePagination(state, productsForSalePagination) {
      state.productsForSalePagination = productsForSalePagination;
    },
    uploadedImageUrl(state, imageUrl) {
      state.uploadedImageUrl = imageUrl;
    },
    productsByPage(state, productsByPage) {
      state.productsByPage = productsByPage;
    },
    productsPagination(state, productsPagination) {
      state.productsPagination = productsPagination;
    },
  },
  actions: {
    async logout() {
      await axios.post('/logout');
    },
    // MockCart
    async getCart({ commit }) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/cart`;
      const { data: response } = await axios.get(apiURL);
      commit('cart', response.data);
    },
    // MockOrder
    async getProductsForSaleByPage({ commit }, page) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/products?page=${page}`;
      const { data } = await axios.get(apiURL);
      commit('productsForSaleByPage', data.products);
      commit('productsForSalePagination', data.pagination);
    },
    async getProductById({ commit }, id) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/product/${id}`;
      const { data } = await axios.get(apiURL);
      commit('product', data.product);
    },
    async addProductsToCart(_, payload) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/cart`;
      await axios.post(apiURL, payload);
    },
    // product
    async getProductsByPage({ commit }, page) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/products?page=${page}`;
      const { data } = await axios.get(apiURL);
      commit('productsByPage', data.products);
      commit('productsPagination', data.pagination);
    },
    async uploadImage({ commit }, formData) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/upload`;
      const { data } = await axios.post(apiURL, formData);
      commit('uploadedImageUrl', data.imageUrl);
    },
    async deleteProduct(_, productId) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.delete(apiURL);
    },
    async updateProduct(_, { productId, apiParams }) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product/${productId}`;
      await axios.put(apiURL, apiParams);
    },
    async addProduct(_, apiParams) {
      const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/product`;
      await axios.post(apiURL, apiParams);
    },
    // async getProducts({ commit }) {
    //   const apiURL = `/api/${process.env.VUE_APP_CUSTOM_API_PATH}/admin/products/all`;
    //   const { data } = await axios.get(apiURL);
    //   commit('productsAll', data.products);
    // },
  },
  modules: {},
});
