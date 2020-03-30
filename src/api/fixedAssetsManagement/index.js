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
//获取修改的数据
export function getIncomingInfo(incomingId){
    return request({
        url:'/contract/org/incoming/info',
        method:'get',
        params:{
            incomingId
        }
    })
}

export function downTemplate(){
    return request({
        url:'/contract/org/incoming/down/template',
        method:'get',
    })
}
//修改
export function updateOrgIncoming(data){
    return request({
        url:'/contract/org/incoming/update',
        method:'post',
        data
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
//判断是否有流程审批功能
export function getStartNodeAssigneeUsers(orgWarIncomingId){
    return request({
        url:'/contract/org/incoming/workflow/start/node/assignee/users',
        method:'get',
        params:{
            orgWarIncomingId
        }
    })
}
//提交流程
export function startIncomingWorkflow(data){
    return request({
        url:'/contract/org/incoming/workflow/start',
        method:'post',
        data
    })
}

//导入模板
export function importIncomingDetail(data){
    return request({
        url:'/contract/org/incoming/detail/import',
        method:'post',
        data
    })
}

//导出
export function exportexcelIncoming(data){
    return request({
        url:'/contract/org/incoming/exportexcel',
        method:'post',
        responseType: 'arraybuffer',  // 加了这个后 下载的文件不会乱码
        data
    })
}
