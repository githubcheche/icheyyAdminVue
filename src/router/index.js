import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '../views/layout/Layout'

const _import = require('./_import');
Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/login',
    component: _import('account/Login'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    icon: 'home',
    noDropdown: true,
    children:
      [{
        path: '/dashboard',
        component: _import('dashboard/Dashboard'),
        name: '首页'
      }]
  }
]; //路由白名单

const router = new Router({
  routes: constantRouterMap
});


const whiteList = ['/login']; // 不重定向白名单
let ifRouteFresh = true; // 刷新重新加载路由
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!store.state.account.auth.check()) { // 判断是否登录
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {// 否则全部重定向到登录页
      next({
        path: '/login',
        query: { redirect_url: to.fullPath },//保存路由要去的页面
      });
    }
  } else {// 已登录,api获取菜单
    if (ifRouteFresh) {
      ifRouteFresh = false;
      // api.account.get_menu().then((res) => {
      //   let menus = res.data.data;
      //   store.dispatch('generateRoutes', { menus }).then(() => {
      //     router.addRoutes(store.getters.addRouters)
      //     next({ ...to });
      //   });
      // })
      next();//到时去掉
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
