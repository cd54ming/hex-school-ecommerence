import Vue from 'vue';
import store from '@/store';
import axios from 'axios';
import VueRouter, { RouteConfig } from 'vue-router';
import AppBaseLayout from '@/components/AppBaseLayout.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

async function checkLogin() {
  const apiURL = `${process.env.VUE_APP_BASE_API_PATH}/api/user/check`;
  const { data: response } = await axios.post(apiURL);
  return response.success;
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: async (to, from, next) => {
      const isLogin = await checkLogin();

      if (isLogin) {
        next({ path: from.fullPath });
      } else {
        next();
      }
    },
  },
  {
    path: '/',
    component: AppBaseLayout,
    children: [
      {
        path: '',
        name: 'Home',
        redirect: { name: 'MockShopping' },
        // component: () => import('@/views/MockShopping.vue'),
        // meta: { requiresAuth: true },
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mockShopping',
        name: 'MockShopping',
        component: () => import('@/views/MockShopping.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mockShoppingCart',
        name: 'MockShoppingCart',
        component: () => import('@/views/MockShoppingCart.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/coupons',
        name: 'Coupons',
        component: () => import('@/views/Coupons.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    store.commit('checkingLogin', { loading: true, navigateTo: to.name });
    const isLogin = await checkLogin();
    store.commit('checkingLogin', { loading: false, navigateTo: null });
    if (isLogin) {
      next();
    } else {
      next({ path: `/login?&callback=${to.fullPath}` });
    }
  } else {
    next();
  }
});

export default router;
