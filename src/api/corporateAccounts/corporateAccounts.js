import request from '../../util/ajax'

//分页条件查询公司账户
export function getCompanyAccountList(data){
    return request({
        url:'/sysbase/company/account/list',
        method:'get',
        params:data

    })
}

//注销公司账户
export function cancelCompanyAccount(accountId){
    return request({
        url:'/sysbase/company/account/cancel',
        method:'get',
        params:{
            accountId
        }

    })
}



//添加公司账户
export function createCompanyAccount(data){
    return request({
        url:'/sysbase/company/account/create',
        method:'post',
        data

    })
}

//禁用公司账户
export function disableCompanyAccount(accountId){
    return request({
        url:'/sysbase/company/account/disable',
        method:'get',
        params:{
            accountId
        }

    })
}

//启用公司账户
export function enableCompanyAccount(accountId){
  return request({
    url:'/sysbase/company/account/enable',
    method:'get',
    params:{
      accountId
    }
  })
}

//更改公司状态
export function setCompanyAccountStatus(url,accountId){
  return request({
    url:url,
    method:'get',
    params:{
      accountId
    }
  })
}



//公司账户列表导出
export function exportexcelCompanyAccount(data){
    return request({
        url:'/sysbase/company/account/exportexcel',
        method:'get',
        params:data

    })
}
//查询公司账户
export function getCompanyAccountListAll(){
    return request({
        url:'/sysbase/company/account/list/all',
        method:'get'


    })
}

//修改公司账户
export function updateCompanyAccount(data){
    return request({
        url:'/sysbase/company/account/update',
        method:'post',
        data

    })
}
