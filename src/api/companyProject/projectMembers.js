
import request from '../../util/ajax'

//获取我的项目
export function getPermissionProjects(){
    return request({
        url:'/bizbase/project/permission/projects',
        method:'get',
       
    })
}
//获取我的项目成员信息
export function getProjectsUsers(projectId){
    return request({
        url:'/bizbase/project/users',
        method:'get',
        params:{
            projectId
        }
       
    })
}

//获取权限弹窗信息
export function getUserMenus(currentUserId){
    return request({
        url:'/passport/company/role/user/menus',
        method:'get',
        params:{
            currentUserId
        }
       
    })
}

//选择岗位
export function getRolesProject(){
    return request({
        url:'/passport/company/role/roles/project',
        method:'get'
    })
}
//确定修改岗位
export function updateUserProject(data){
    return request({
        url:'/bizbase/project/user/update',
        method:'post',
        data
    })
}
//删除项目成员
export function deleteUserProject(data){
    return request({
        url:'/bizbase/project/user/delete',
        method:'post',
        data
    })
}

//获取添加项目成员的 企业
export function getOrgsList(){
    return request({
        url:'/passport/org/orgs',
        method:'get'
    })
}
//点击展开子集部门列表
export function getDepartmentList(orgId){
    return request({
        url:'/passport/department/list',
        method:'get',
        params:{
            orgId
        }

    })
}

//获得企业列表
export function getRoleUsersList(data){
    return request({
        url:'/passport/org/role/users',
        method:'get',
        params:data

    })
}
// ?pageNo=1&pageSize=7&orgId=378&params=
