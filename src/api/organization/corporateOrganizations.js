import request from '../../util/ajax';

//获取表格数据
export function getOrganizationalTableList(orgId) {
  return request({
    url: '/passport/org/managers',
    method: 'get',
    params: {
      orgId
    }
  })
}

//获取树形列表数据
export function getTreeOrgs() {
  return request({
    url: '/passport/org/orgs',
    method: 'get'
  })
}

//获取查询机构下的部门列表
export function getDepartmentList(orgId) {
  return request({
    url: '/passport/department/list',
    method: 'get',
    params: {
      orgId
    }
  })
}

//查询部门下的员工
export function getDepartmentUserList(departmentId) {
  return request({
    url: '/passport/department/user/list',
    method: 'get',
    params: {
      departmentId
    }
  })
}

//  查询 公司下么员工和权限
export function getCompanyUserRolesList(orgId){
  return request({
    url:'/passport/company/user/roles',
    method:'get',
    params:{
      orgId
    }
  })
}
