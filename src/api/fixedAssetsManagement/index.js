import request from '../../util/ajax'

//获取所属公司
export function getManagerOrgs(){
    return request({
        url:'/passport/org/company/warehouse/manager/orgs',
        method:'get',
        
    })
}
//获取资产入库表格数据
export function getIncomingList(data){
    return request({
        url:'/contract/org/incoming/list',
        method:'post',
        data
    })
}
//获取公司仓库
export function getWarehouseListAll(orgId){
    return request({
        url:'/contract/org/warehouse/list/all',
        method:'get',
        params:{
            orgId
        }
        
    })
}
//添加
export function createOrgIncoming(data){
    return request({
        url:'/contract/org/incoming/create',
        method:'post',
        data
    })
}
//判断固定资产编码 是否已经存在
export function checkMaterialCode(materialCode){
    return request({
        url:'/contract/org/incoming/materialCode/check',
        method:'get',
        params:{
            materialCode
        }
    })
}
//供应商名称
export function getSupplierListAll(){
    return request({
        url:'/contract/supplier/list/all',
        method:'get',
        
    })
}




