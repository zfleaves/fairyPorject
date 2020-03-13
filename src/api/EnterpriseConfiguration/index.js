import request from '../../util/ajax'

//获取路径列表
export function getPassportCfgCompanyServices(){
    return request({
        url:'/passport/cfg/company/services',
        method:'get',
        
    })
}
//获取企业规定是否允许取消选择
export function getPassportCfgCompanyFlagCanupdate(){
    return request({
        url:'/passport/cfg/company/flag/canupdate',
        method:'get',
        
    })
}
