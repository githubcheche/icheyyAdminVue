import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '../views/layout/Layout'
import Login from '../views/account/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // redirect: '/dashboard',
      component: Layout,
      name: '首页',
      icon: 'home',
      noDropdown: true,
    },
    {
      path: '/login',
      component: Login,
    }
  ]
});

