import request from '../../util/ajax';

//获取组织机构
export function getPersonnelAuthorizationOrgs(){
  return request({
    url:'/passport/org/orgs',
    method:'get'
  })
}

//获取组织机构下的人
export function getDepartmentList(orgId){
  return request({
    url:'/passport/department/list',
    method:'get',
    params:{
      orgId
    }
  })
}

// 查询部门下的员工和权限
export function getDepartmentUserRolesList(departmentId) {
  return request({
    url: '/passport/department/user/roles/list',
    method: 'get',
    params: {
      departmentId
    }
  })
}


//  查询 公司或区下么员工和权限
export function getCompanyUserRolesList(orgId){
  return request({
    url:'/passport/company/user/roles',
    method:'get',
    params:{
      orgId
    }
  })
}




