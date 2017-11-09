import { asyncRouterMap, constantRouterMap } from '@/router';
import * as types from '../mutation-types';
import store from '../index';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param menus api传入表
 * @param route 全部权限路由表中某个权限路由
 */
function hasPermission(menus, route) {
  if (route.path) {
    return menus.some(menu => route.path == menu);
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 全部权限路由表
 * @param menus api传入表
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  });
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,//渲染左侧菜单
    addRouters: [],//需要加载到Router对象中去
  },
  mutations: {
    [types.SET_ROUTERS]: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);// 追加渲染路由
    }
  },
  actions: {/////////////以下是对外接口/////////////
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters = filterAsyncRouter(asyncRouterMap, data.menus);
        commit(types.SET_ROUTERS, accessedRouters);
        resolve();
      })
    }
  }
}

export default permission
