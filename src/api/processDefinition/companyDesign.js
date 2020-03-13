import request from '../../util/ajax';


//分页查询企业流程列表
export function getWorkflowProcessesList(data){
    return request({
        url:'/sysbase/workflow/build/instance/processes',
        method:'get',
        params:data
    })
}

export function getWorkflowBasicNodes(){
    return request({
        url:'/sysbase/workflow/basic/nodes',
        method:'get',
     
    })
}

// 获取工具栏节点集合
export function getProcessToolNodeList() {
    return request({
      url: '/sysbase/workflow/basic/nodes',
      method: 'get',
    })
  }
export function getWorkflowBuildInstanceProcess(processCode){
    return request({
        url:'/sysbase/workflow/build/instance/process',
        method:'get',
        params:{
            processCode
        }
    })
}

