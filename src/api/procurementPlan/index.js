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
//获取零星采购修改表格物资
export function getDetailList(id){
    return request({
        url:'/contract/pursporadic/detail/list',
        method:'get',
        params:{
            id
        }
    })
}
//添加零星采购
export function savePursporadicList(data){
    return request({
        url:'/contract/pursporadic/save',
        method:'post',
        data
    })
}
