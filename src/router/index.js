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

// 全部权限路由表
export const asyncRouterMap = [
  {
    path: '/parent/setting',
    component: Layout,
    name: '系统管理',
    noDropdown: false,
    redirect: 'noredirect',
    icon: 'cog',
    // children: [
    //   { path: '/menus/index', component: _import('manage/Menus'), name: '菜单列表' },
    //   { path: '/permissions/index', component: _import('manage/Permissions'), name: '权限列表' },
    //   { path: '/roles/index', component: _import('manage/Roles'), name: '角色列表' },
    //   { path: '/users/index', component: _import('manage/Users'), name: '用户列表' }
    // ]
  },
  {
    path: '/parent/content',
    component: Layout,
    name: '内容管理',
    noDropdown: false,
    redirect: 'noredirect',
    icon: 'th-large',
    children: [
      // { path: '/articles/index', component: _import('content/Articles'), name: '文章列表' },
    ]
  }
];

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
      //     router.addRoutes(store.getters.addRouters)//api获取的路由表增加到Router对象中
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
