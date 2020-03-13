import {resetStoreState} from './index'
const authToken = {
  tokenTimeoutMethod: 'getNewToken',
  //获得手机号
  hasLoginPhone: function () {
    return localStorage.getItem('phone')
  },
  //设置手机号
  setLoginPhone: function (phone) {
    localStorage.setItem('phone', phone)
  },


  // Token是否超时
  hasToken: function () {
    return localStorage.getItem('token')
  },
  // 设置Token
  setToken: function (token) {
    // 设置token，并填写有效期
    // let maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    // Cookies.set('token', token, {
    //   expires: maxAge
    // })
    localStorage.setItem('token', token)
  },
  // 移除Token
  removeToken: function () {
    localStorage.removeItem('token');
  },

  //得到UserInfo
  hasUserInfo: function () {
    let obj = localStorage.getItem('UserInfo');
    // obj = JSON.parse(obj);
    return obj;
  },
  //设置个人信息资料
  setUserInfo: function (data) {
    console.log(data);
    localStorage.setItem('UserInfo', JSON.stringify(data))
  },
  //移除个人信息资料
  removeUserInfo: function (data) {
    localStorage.removeItem('UserInfo')
  },

  //设置动态路由
  saveObjArr: function (data) {
    if (data) {
      localStorage.setItem('router', JSON.stringify(data))
    } else {
      localStorage.setItem('router', '')
    }
  },
  //得到动态路由
  getObjArr: function () {
    let obj = localStorage.getItem('router');
    return obj ? JSON.parse(obj) : '';

  },
   // 设置模拟登录Token
   setLoginSimulatedToken: function (token) {
    // 设置token，并填写有效期
    // let maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    // Cookies.set('token', token, {
    //   expires: maxAge
    // })
    localStorage.setItem('loginSimulated', token)
  },

  // 得到模拟登录Token
  hasLoginSimulatedToken: function () {
    // 设置token，并填写有效期
    // let maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    // Cookies.set('token', token, {
    //   expires: maxAge
    // })
    return localStorage.getItem('loginSimulated')
  },

  // 移除模拟登录Token
  removeLoginSimulatedToken: function () {
    // 设置token，并填写有效期
    // let maxAge = new Date(new Date().getTime() + 30 * 60 * 1000);
    // Cookies.set('token', token, {
    //   expires: maxAge
    // })
    localStorage.removeItem('loginSimulated')
  },
  //移除动态路由
  removeObjArr: function () {
    localStorage.removeItem('router')
  },


  // 重新登录
  reLogin() {
    this.removeToken();
    this.removeUserInfo();
    this.removeObjArr();
    resetStoreState();
  },


}

export default authToken
