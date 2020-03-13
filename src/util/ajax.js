import axios from 'axios'
import store from 'store'
import router from 'router'

import {Message} from 'element-ui'

import Auth from './auth'

let userInfo = JSON.parse(Auth.hasUserInfo());
import config from './config'

let CancelToken = axios.CancelToken
let cancel;
// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    baseURL: config.url
    // timeout: 5000 // 请求超时时间



})
//添加一个请求拦截器
service.interceptors.request.use(
    config =>{
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        })
        config.headers['Access-Token'] = Auth.hasToken() ? Auth.hasToken() : '';
        config.headers['resource'] = 'P2';
        config.headers['userId'] = JSON.parse(Auth.hasUserInfo()) ? `${JSON.parse(Auth.hasUserInfo()).userId}` : '';
       return config;
    },error =>{
        return  Promise.reject(error)
    }
)

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use
(
    response =>{
        // console.log(response.data)
        return response.data

    },
    error => {
    // console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit('dailog/setIsDialogFormVisible',true);
          // Auth.reLogin();
          // router.push('/error/401');
          // router.push('/login');
          // if(Auth.hasToken() && Auth.isLogin()){
          //   store.commit('auth/SET_OVERDUETOKEN',true);
          // }
          break;
        case 403:
          Message({
            message: `您无权限访问`,
            type: 'error'
          });
          // router.push('/error/403');
          break;
        case 404:
          // router.push('/error/404');
          break;
        case 405:
          Message({
            message: `请求失败：${error.response.status}`,
            type: 'error'
          });
          break;
        default:

      }
      return Promise.reject(error.response.data)
    }
  }
    // error =>{
    //     return Promise.reject(error)
    // }
)

export default service;
