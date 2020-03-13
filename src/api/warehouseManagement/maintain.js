import request from '../../util/ajax'

//仓库创建维护list
export function getWarehouseList(data){
    return request({
        url:'/contract/warehouse/list',
        method:'post',
        data
    })
}

//获取流程状态
export function getDicdataStatus(dicId,companyId,flg){
    return request({
        url:'/bizbase/api/dic/dicdata',
        method:'get',
        params:{
            dicId,companyId,flg
        }
    })
}

//获取项目名称
export function getProjectsList(){
    return request({
        url:'/bizbase/project/permission/projects',
        method:'get',
       
    })
}

//添加项目
export function createWarehouseList(data){
    return request({
        url:'/contract/warehouse/create',
        method:'post',
        data
       
    })
}

//修改
export function updateWarehouseList(data){
    return request({
        url:'/contract/warehouse/update',
        method:'post',
        data
       
    })
}

//删除
export function deleteWarehouseList(warHouseId){
    return request({
        url:'/contract/warehouse/delete',
        method:'get',
        params:{
            warHouseId
        }
       
    })
}





