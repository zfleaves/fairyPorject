import request from '../../util/ajax';

//获取岗位列表
export function getCompanyRoles(pageNo,pageSize){
    return request({
      url:'/passport/company/role/roles',
      method:'get',
      params:{
        pageNo,
        pageSize
      }
    })
  }

  //查询企业能看的菜单资源
export function getCompanyMenusTreeList(){
  return request({
    url:'/passport/menus/company/tree',
    method:'get'
  })
}

// 获取树形菜单已经勾选
export function roleMenusTreeCheckd(roleId) {
  return request({
    url: '/passport/company/role/menus',
    method: 'get',
    params: {
      roleId
    }
  })
}

//角色和权限关联
export function roleRolemenusRelation(menusIds, roleId) {
  const data = {
    menusIds,
    roleId
  };
  return request({
    url: '/passport/company/role/rolemenus/relation',
    method: 'post',
    data
  })
}

// 删除角色
export function roleDelete(roleId) {
  return request({
    url: '/passport/company/role/delete',
    method: 'get',
    params: {
      roleId
    }
  })
}