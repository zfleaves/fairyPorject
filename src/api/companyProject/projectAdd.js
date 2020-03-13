import request from '../../util/ajax'

//
export function getRegionList(){
    return request({
        url:'/passport/org/permission/orgs',
        method:'get',
       
    })
}

//获取待办任务列表
export function getProjectList(data){
    return request({
        url:'/bizbase/project/list',
        method:'post',
        data
    })
}


//获取项目状态
export function getProjectStatus(data){
    return request({
        url:'/bizbase/api/dic/dicdata',
        method:'get',
        params:data
       
    })
}

//保存添加项目
export function handleSubmitForm(data){
    return request({
        url:'/bizbase/project/create',
        method:'post',
        data
       
    })
}

//修改
export function handleModify(data){
    return request({
        url:'/bizbase/project/update',
        method:'post',
        data
       
    })
}

//删除
export function projectDisable(projectId,status){
    return request({
        url:'/bizbase/project/disable',
        method:'get',
        params:{
            projectId,
            status
        }
        
       
    })
}

// //承包方式
// export function getProjectStatus(data){
//     return request({
//         url:'/bizbase/api/dic/dicdata',
//         method:'get',
//         params:data
       
//     })
// }

