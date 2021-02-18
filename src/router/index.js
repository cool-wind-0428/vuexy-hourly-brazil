import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/about-page',
      name: 'about-page',
      component: () => import('@/views/About.vue'),
      meta: {
        pageTitle: 'About Page',
        breadcrumb: [
          {
            text: 'About Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/host-list',
      name: 'host-list',
      component: () => import('@/views/user/user-list/UserList.vue'),
      meta: {
        pageTitle: 'Hosts',
        breadcrumb: [
          {
            text: 'Hosts',
            active: true,
          },
        ],
      },
    },
    {
      path: '/host-view',
      name: 'host-view',
      component: () => import('@/views/user/user-view/UsersView.vue'),
      meta: {
        pageTitle: 'Detalhes do Host',
        breadcrumb: [
          {
            text: 'Ver Host',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        auth: 'guest'
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach(async (to, from, next) => {

  if (to.meta.auth !== 'guest') {

    // if (!store.getters['auth/isLoggedIn']) {
    //   next('/login');
    // }

    // if (store.getters['auth/isLoggedIn']) {
      await store.dispatch('auth/loadUser')
    // }
  }

  next();

});

export default router
