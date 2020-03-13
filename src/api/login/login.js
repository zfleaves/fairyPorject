import request from '../../util/ajax'

//密码登录
export function getLogin(data){
    return request({
        url:'/passport/api/password/login',
        method:'post',
        data
    })
}

//图形验证码密码登录
export function getVerifyLogin(data) {
  return request({
    url: '/passport/api/verify/login',
    method: 'post',
    data
  })
}

//短信验证码密码登录
export function getSmsLogin(data) {
  return request({
    url: '/passport/api/sms/login',
    method: 'post',
    data
  })
}


//登录请求短信验证码
export function getVerificationCode(loginName) {
  return request({
    url: '/passport/smscode/send',
    method: 'get',
    params:{
      loginName
    }
  })
}

//生成图形验证码

export function getImgCode(loginName) {
  return request({
    url: '/passport/api/verify/code',
    method: 'get',
    params:{
      loginName
    }
  })
}

//验证是否登录
export function getIsLogin(loginName) {
  return request({
    url: '/passport/api/login/check',
    method: 'get',
    params:{
      loginName
    }
  })
}

//短信登录
export function getMessageLogin2(data) {
  return request({
    url: '/passport/smscode/check',
    method: 'post',
    data
  })
}

// 验证是否设置了密码
export function loginFirst(loginName) {
  return request({
    url: '/passport/first/login',
    method: 'post',
    params:{
      loginName
    }
  })
}

// 设置密码
export function setPassWord(data) {
  return request({
    url: '/passport/password/set',
    method: 'post',
    data
  })
}

// 退出登录
export function loginOut() {
  return request({
    url: '/passport/login/out',
    method: 'get',
  })
}

//获取菜单列表
export function getMenusList() {
  return request({
    url: '/passport/menus',
    method: 'get',
  })
}

// 验证token是否过期
export function checkToken(token) {
  return request({
    url: '/passport/api/token/check',
    method: 'get',
    params:{
      token
    }
  })
}

//添加用户的常用菜单
export function addCommunlyUsed(menusId) {
  return request({
    url: '/passport/menus/used/add',
    method: 'get',
    params:{
      menusId
    }
  })
}


