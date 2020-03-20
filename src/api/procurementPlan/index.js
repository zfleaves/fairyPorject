import request from '../../util/ajax'

//获取项目名称
export function getMenuProjectsList(menuId){
    return request({
        url:'/bizbase/project/permission/menu/projects',
        method:'get',
        params:{
            menuId
        }
       
    })
}
//获取零星采购表格列表
export function getPursporadicList(data){
    return request({
        url:'/contract/pursporadic/list',
        method:'post',
        data
    })
}

//获取零星采购添加项目名称
export function getPursporadicProjectsList(menuId){
    return request({
        url:'/contract/pursporadic/projects',
        method:'get',
        params:{
            menuId
        }
       
    })
}
// //获取零星采购修改表格物资
// export function getDetailList(id){
//     return request({
//         url:'/contract/pursporadic/detail/list',
//         method:'get',
//         params:{
//             id
//         }
//     })
// }
//添加零星采购
export function savePursporadicList(data){
    return request({
        url:'/contract/pursporadic/save',
        method:'post',
        data
    })
}

//修改零星采购 项目名称赋值
export function getPursporadicInf(id){
    return request({
        url:'/contract/pursporadic/inf',
        method:'get',
        params:{
            id
        }
    })
}
//修改零星采购 详情表格赋值
export function getPursporadicDetailList(id){
    return request({
        url:'/contract/pursporadic/detail/list',
        method:'get',
        params:{
            id
        }
    })
}
//修改 获得附件内容
export function getFilepathList(data){
    return request({
        url:'/sysbase/confiles/filepath/list',
        method:'post',
        data
    })
}
//删除
export function deletePursporadic(id){
    return request({
        url:'/contract/pursporadic/delete',
        method:'put',
        params:{
            id
        }
    })
}
//判断是否有流程审批功能
export function getPursporadicSubmitinf(sid,projectId){
    return request({
        url:'/contract/pursporadic/submitinf',
        method:'get',
        params:{
            sid,
            projectId
        }
    })
}
export function submitPursporadic(data){
    return request({
        url:'/contract/pursporadic/submit',
        method:'put',
        data
    })
}
