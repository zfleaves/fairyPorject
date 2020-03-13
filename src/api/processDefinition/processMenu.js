import request from '../../util/ajax';


//查询业务表单名列表
export function getWorkflowFormStatusList(formName){
    return request({
        url:'/sysbase/workflow/form/status',
        method:'get',
        params:{
            formName
        }
    })
}
//获得下拉框值
export function getWorkflowColumnStatusCollect(){
    return request({
        url:'/sysbase/workflow/column/status/collect',
        method:'get'
    })
}
//获取
export function getWorkflowFormColumnsList(formCode){
    return request({
        url:'/sysbase/workflow/form/columns',
        method:'get',
        params:{
            formCode
        }
    })
}

//添加
export function getWorkflowFormStatusBuild(data){
    return request({
        url:'/sysbase/workflow/form/status/build',
        method:'post',
        data
    })
}

//修改
export function getWorkflowFormColumnStatus(formStatusCode,isDisable){
    return request({
        url:'/sysbase/workflow/form/column/status',
        method:'get',
        params:{
            formStatusCode,
            isDisable
        }
    })
}

