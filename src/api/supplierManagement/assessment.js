import request from '../../util/ajax';

//
export function getDicDicdata(dicId,companyId,flg){
    return request({
        url:'/bizbase/api/dic/dicdata',
        method:'get',
       params:{
        dicId,
        companyId,
        flg
       }
    })
}
//获取考核内容
export function getExmContents(){
    return request({
        url:'/contract/supplier/exm/contents',
        method:'get',
        
    })
}

//添加供应商考核
export function createSupplierExm(data){
    return request({
        url:'/contract/supplier/exm/create',
        method:'post',
        data
    })
}

//删除供应商考核
export function deleteSupplierExm(cocSupplierExaminationId){
    return request({
        url:'/contract/supplier/exm/delete',
        method:'get',
        params:{
            cocSupplierExaminationId
        }
       
    })
}

//供应商导出
export function exportexcelSupplierExm(cocSupplierExaminationQueryReqDto){
    return request({
        url:'/contract/supplier/exm/exportexcel',
        method:'post',
        cocSupplierExaminationQueryReqDto
    })
}

//查询供应商考核详情
export function getSupplierExmInfo(cocSupplierExaminationId){
    return request({
        url:'/contract/supplier/exm/info',
        method:'get',
        params:{
            cocSupplierExaminationId
        }
       
    })
}

//供应商考核条件分页查询
export function getSupplierExmList(data){
    return request({
        url:'/contract/supplier/exm/list',
        method:'post',
        data
    })
}

//修改供应商考核
export function updateSupplierExm(data){
    return request({
        url:'/contract/supplier/exm/update',
        method:'post',
        data
    })
}

//流程审批
export function approveSupplierExmWorkflow(workflowReqDto){
    return request({
        url:'/contract/supplier/exm/workflow/approve',
        method:'post',
        workflowReqDto
    })
}

//流程启动
export function startSupplierExmWorkflow(data){
    return request({
        url:'/contract/supplier/exm/workflow/start',
        method:'post',
        data
    })
}

//获取开始节点的处理人信息
export function getWorkflowStartAssigneeUsers(cocSupplierId){
    return request({
        url:'/contract/supplier/exm/workflow/start/node/assignee/users',
        method:'get',
        params:{
            cocSupplierId
        }
       
    })
}

//获取下一个节点的处理人信息
export function getWorkflowNextAssigneeUsers(cocSupplierId,processNodeCode,taskId){
    return request({
        url:'/contract/supplier/exm/workflow/next/node/assignee/users',
        method:'get',
        params:{
            cocSupplierId,
            processNodeCode,
            taskId
        }
       
    })
}
// 获取供应商名称
export function getSupplierListAll(){
    return request({
        url:'/contract/supplier/list/all',
        method:'get',
       
    })
}
