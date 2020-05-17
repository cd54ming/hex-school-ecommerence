import Vue from 'vue';
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

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: async (to, from, next) => {
      const isLogin = await checkLogin();
      if (!isLogin) {
        next();
      } else {
        next({ path: from.fullPath });
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
        component: Home,
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
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
      {
        path: '/i18n',
        name: 'i18n',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/components/HelloI18n.vue'),
      },
    ],
  },
  {
    path: '*',
    name: 'a404',
    component: () => import('@/views/404.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isLogin = await checkLogin();
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
