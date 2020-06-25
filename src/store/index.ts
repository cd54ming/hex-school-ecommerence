import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const API_PATH = process.env.VUE_APP_CUSTOM_API_PATH;

export default new Vuex.Store({
  strict: true,
  state: {
    // productsAll: {},
    orders: [],
    ordersPagination: {},
    isAppliedCouponSuccessful: undefined,
    messageOfAppliedCoupon: '',
    coupons: [],
    couponsPagination: {},
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
    ordersPagination(state, ordersPagination) {
      state.ordersPagination = ordersPagination;
    },
    orders(state, orders) {
      state.orders = orders;
    },
    isAppliedCouponSuccessful(state, isAppliedCouponSuccessful) {
      state.isAppliedCouponSuccessful = isAppliedCouponSuccessful;
    },
    messageOfAppliedCoupon(state, messageOfAppliedCoupon) {
      state.messageOfAppliedCoupon = messageOfAppliedCoupon;
    },
    coupons(state, coupons) {
      state.coupons = coupons;
    },
    couponsPagination(state, couponsPagination) {
      state.couponsPagination = couponsPagination;
    },
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
    // Orders
    async getOrders({ commit }, page) {
      const apiURL = `/api/${API_PATH}/admin/orders?page=${page}`;
      const { data: response } = await axios.get(apiURL);
      commit('orders', response.orders);
      commit('ordersPagination', response.pagination);
    },
    // Coupons
    async getCoupons({ commit }, page) {
      const apiURL = `/api/${API_PATH}/admin/coupons?page=${page}`;
      const { data: response } = await axios.get(apiURL);
      commit('coupons', response.coupons);
      commit('couponsPagination', response.pagination);
    },
    async addCoupon(_, coupon) {
      const apiURL = `/api/${API_PATH}/admin/coupon`;
      await axios.post(apiURL, { data: coupon });
    },
    async updateCoupon(_, coupon) {
      const apiURL = `/api/${API_PATH}/admin/coupon/${coupon.id}`;
      await axios.put(apiURL, { data: coupon });
    },
    async deleteCoupon(_, couponId) {
      const apiURL = `/api/${API_PATH}/admin/coupon/${couponId}`;
      await axios.delete(apiURL);
    },
    // MockShppingCart
    async applyCoupon({ commit }, couponCode) {
      const apiURL = `/api/${API_PATH}/coupon`;
      const { data: response } = await axios.post(apiURL, { data: { code: couponCode } });
      commit('isAppliedCouponSuccessful', response.success);
      commit('messageOfAppliedCoupon', response.message);
    },
    async deleteShoppingCartItem(_, productId) {
      const apiURL = `/api/${API_PATH}/cart/${productId}`;
      await axios.delete(apiURL);
    },
    async getCart({ commit }) {
      const apiURL = `/api/${API_PATH}/cart`;
      const { data: response } = await axios.get(apiURL);
      commit('cart', response.data);
    },
    async pay(_, orderId) {
      const apiURL = `/api/${API_PATH}/pay/${orderId}`;
      try {
        await axios.post(apiURL);
      } catch (error) {
        throw new Error(error);
      }
    },
    async createOrder(_, customerInfo) {
      const apiURL = `/api/${API_PATH}/order`;
      try {
        const response = await axios.post(apiURL, { data: customerInfo });
        await this.dispatch('pay', response.data.orderId);
      } catch (error) {
        throw new Error(error);
      }
    },
    // MockOrder
    async getProductsForSaleByPage({ commit }, page) {
      const apiURL = `/api/${API_PATH}/products?page=${page}`;
      const { data } = await axios.get(apiURL);
      commit('productsForSaleByPage', data.products);
      commit('productsForSalePagination', data.pagination);
    },
    async getProductById({ commit }, productId) {
      const apiURL = `/api/${API_PATH}/product/${productId}`;
      const { data } = await axios.get(apiURL);
      commit('product', data.product);
    },
    async addProductsToCart(_, products) {
      const apiURL = `/api/${API_PATH}/cart`;
      await axios.post(apiURL, { data: products });
    },
    // product
    async getProductsByPage({ commit }, page) {
      const apiURL = `/api/${API_PATH}/admin/products?page=${page}`;
      const { data } = await axios.get(apiURL);
      commit('productsByPage', data.products);
      commit('productsPagination', data.pagination);
    },
    async uploadImage({ commit }, formData) {
      const apiURL = `/api/${API_PATH}/admin/upload`;
      const { data } = await axios.post(apiURL, formData);
      commit('uploadedImageUrl', data.imageUrl);
    },
    async deleteProduct(_, productId) {
      const apiURL = `/api/${API_PATH}/admin/product/${productId}`;
      await axios.delete(apiURL);
    },
    async updateProduct(_, product) {
      const apiURL = `/api/${API_PATH}/admin/product/${product.id}`;
      await axios.put(apiURL, { data: product });
    },
    async addProduct(_, product) {
      const apiURL = `/api/${API_PATH}/admin/product`;
      await axios.post(apiURL, { data: product });
    },
    // async getProducts({ commit }) {
    //   const apiURL = `/api/${API_PATH}/admin/products/all`;
    //   const { data } = await axios.get(apiURL);
    //   commit('productsAll', data.products);
    // },
  },
  modules: {},
});
