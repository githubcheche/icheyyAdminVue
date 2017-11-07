import Cookies from 'js-cookie';
import * as types from '../mutation-types';

const app = {
  state: {
    sidebar: {
      opened: ! +Cookies.get('sidebarStatus'),// 侧边栏状态
    },
    visitedViews: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {// 切换侧边栏
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path))
        return state.visitedViews.push({ name: view.name, path: view.path });
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i;
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {/////////////以下是对外接口/////////////
    ToggleSideBar({ commit }) {// 切换侧边栏
      commit(types.TOGGLE_SIDEBAR);
    },
    addVisitedViews({ commit }, view) {
      commit(types.ADD_VISITED_VIEWS, view);
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(types.DEL_VISITED_VIEWS, view);
        resolve([...state.visitedViews]);
      })
    }
  }
}

export default app;
