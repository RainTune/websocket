import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import NProgress from 'nprogress'
import {isEmptyObject} from '@/util'
import store from '@/store'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/chat',
    name: 'Chat',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue')
  },
  {
    path: '/3d',
    name: 'Three3d',
    component: () => import(/* webpackChunkName: "chat" */ '../views/Three3d.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if(to.path !== '/' && isEmptyObject(store.state.userInfo)) {
    // NProgress.done()
    // return next({path: '/'})
  }
  next()
})

router.afterEach(() => {
  NProgress.done();
})
export default router
