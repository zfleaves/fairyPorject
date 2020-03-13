import request from '../../util/ajax';

//获取组织机构
export function getPersonnelAuthorizationOrgs(){
    return request({
        url:'/passport/org/orgs',
        method:'get'
    })
}

//获取组织机构下的人
export function getUserRoles(orgId){
    return request({
        url:'/passport/department/list',
        method:'get',
        params:{
            orgId
        }
    })
}


//获取组织机构下的人的角色
export function getUserRolesList(orgId){
    return request({
        url:'/passport/company/user/roles',
        method:'get',
        params:{
            orgId
        }
    })
}



