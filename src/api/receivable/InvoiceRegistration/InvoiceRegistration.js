import request from '../../../util/ajax';

//获取流程状态
export function getDicDicdataStatus(dicId,companyId,flg){
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

//获取项目名称下拉列表
export function getProjectSelect(){
    return request({
        url:'/bizbase/project/company',
        method:'get',
       
    })
}


//添加开票信息
export function createRecInvoice(data){
    return request({
        url:'/contract/rec/invoice/create',
        method:'post',
        data
    })
}

//删除开票信息
export function deleteRecInvoice(RecInvoiceId){
    return request({
        url:'/contract/rec/invoice/delete',
        method:'get',
        params:{
            RecInvoiceId
        }
    })
}

//项目开票信息列表导出
export function exportexcelRecInvoice(data){
    return request({
        url:'/contract/rec/invoice/exportexcel',
        method:'post',
        data
    })
}

//查询单个开票信息
export function getRecInvoiceInfo(RecInvoiceId){
    return request({
        url:'/contract/rec/invoice/info',
        method:'get',
        params:{
            RecInvoiceId
        }
    })
}

//分页条件查询开票信息
export function getRecInvoiceList(data){
    return request({
        url:'/contract/rec/invoice/list',
        method:'post',
        data
    })
}

//修改开票信息
export function updateRecInvoice(data){
    return request({
        url:'/contract/rec/invoice/update',
        method:'post',
        data
    })
}

//流程审批
export function approveWorkflowRecInvoice(data){
    return request({
        url:'/contract/rec/invoice/workflow/approve',
        method:'post',
        data
    })
}

//获取下一个节点的处理人信息
export function getNextNodeUsersRecInvoice(invoiceId,processNodeCode,projectId){
    return request({
        url:'/contract/rec/invoice/workflow/next/node/assignee/users',
        method:'get',
        params:{
            invoiceId,
            processNodeCode,
            projectId
        }
    })
}

//流程启动
export function startWorkflowRecInvoice(data){
    return request({
        url:'/contract/rec/invoice/workflow/start',
        method:'post',
        data
    })
}

//获取开始节点的处理人信息
export function getStartNodeUsersRecInvoice(invoiceId,projectId){
    return request({
        url:'/contract/rec/invoice/workflow/start/node/assignee/users',
        method:'get',
        params:{
            invoiceId,
            projectId
        }
    })
}


//通过项目名称获取合同名称下拉框的值
export function getRecContractProjectList(projectId){
    return request({
        url:'/contract/rec/contract/project/list',
        method:'get',
        params:{
            projectId
        }
    })
}