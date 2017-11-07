import Vue from 'vue';
import api from '../../api';
import * as types from '../mutation-types';

// 储存字段名
const AUTH_ACCESS_TOKEN = 'auth.access_token';
const AUTH_USER = 'auth.user';
const AUTH_USER_ID = 'auth.id';

// const localStorage = global.localStorage;
// const sessionStorage = global.sessionStorage;
// const JSON = global.JSON;

export default {
  state: {
    auth: {// 用户数据
      /**
       * 检查是否存在id
       * @returns {boolean}
       */
      check() {
        return this.id !== null && this.id !== 0;
      },
      access_token: JSON.parse(localStorage.getItem(AUTH_ACCESS_TOKEN)),
      id: parseInt(localStorage.getItem(AUTH_USER_ID), 10) || 0,//10十进制
      user: JSON.parse(localStorage.getItem(AUTH_USER)),
    },
    login: {// 登录数据
      success: false,
      failure: null
    },
    register: {// 注册数据
      success: false,
      failure: null
    }
  },
  mutations: {
    // 改变数值，运用store.commit('ACCOUNT_AUTH_STATUS_CHANGED')来改变状态
    ACCOUNT_AUTH_STATUS_CHANGED: (state, data) => {// 用户状态改变
      if (!data.status) {//状态为0，则为错误
        // state中状态置空
        Vue.set(state.auth, 'access_token', null);
        Vue.set(state.auth, 'id', 0);
        Vue.set(state.auth, 'user', null);
        // 移除localStorage中保存的数据
        localStorage.removeItem(AUTH_ACCESS_TOKEN);
        localStorage.removeItem(AUTH_USER_ID);
        localStorage.removeItem(AUTH_USER);
        return;
      }
      // 设置state和localStorage中的数据
      Vue.set(state.auth, 'access_token', data.data.jwt_token.access_token);
      Vue.set(state.auth, 'id', data.data.id);
      Vue.set(state.auth, 'user', data.data);
      localStorage.setItem(AUTH_ACCESS_TOKEN, JSON.stringify(data.data.jwt_token.access_token));
      localStorage.setItem(AUTH_USER_ID, data.data.id);
      localStorage.setItem(AUTH_USER, JSON.stringify(data.data));
    },
    ACCOUNT_LOGIN_SUCCESS: (state) => {//登入成功
      Vue.set(state.login, 'success', true);
    },
    ACCOUNT_LOGIN_FAILURE: (state, data) => {//登入失败
      Vue.set(state.login, 'success', false);
      Vue.set(state.login, 'failure', data);
    },
    ACCOUNT_REGISTER_SUCCESS: (state) => {//注册成功
      Vue.set(state.register, 'success', true);
    },
    ACCOUNT_REGISTER_FAILURE: (state, data) => {//注册失败
      Vue.set(state.register, 'success', false);
      Vue.set(state.register, 'failure', data);
    }
  },
  actions: {/////////////以下是对外接口/////////////
    accountLoginSubmit({ commit }, params) {
      // 用户登入
      api.account.login(params).then((response) => {
        if (response.data.status) {
          commit(types.ACCOUNT_AUTH_STATUS_CHANGED, response.data);
          commit(types.ACCOUNT_LOGIN_SUCCESS);
        } else {
          commit(types.ACCOUNT_LOGIN_FAILURE, response.data);
        }
      })
    },
    // 用户登出
    accountLogoutSubmit({ commit }) {
      api.account.logout().then((response) => {
        // 成功
        commit(types.ACCOUNT_AUTH_STATUS_CHANGED, { status: 0 });
      },  (response) => {
        //错误
        commit(types.ACCOUNT_AUTH_STATUS_CHANGED, { status: 0 });
      });
    },
    // 用户注册
    // accountRegisterSubmit({ commit }, params) {
    //   api.account.register(params).then((response) => {
    //     if (response.data.status) {
    //       //commit(types.ACCOUNT_AUTH_STATUS_CHANGED, response.data);
    //       commit(types.ACCOUNT_REGISTER_SUCCESS);
    //     } else {
    //       commit(types.ACCOUNT_REGISTER_FAILURE, response.data);
    //     }
    //   })
    // }
  }
}
