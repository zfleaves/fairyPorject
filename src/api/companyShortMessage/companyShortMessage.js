import request from '../../util/ajax'

//条件分页查询企业短信发送记录
export function getConnotepointList(data){
    return request({
        url:'/bizbase/connotepoint/list',
        method:'post',
        data

    })
}
//查询企业账户
export function getCompanySmssAccount(companyId){
    return request({
        url:'/passport/api/company/sms/account',
        method:'get',
        params:{
            companyId
        }

    })
}