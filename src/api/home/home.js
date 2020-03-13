import request from '../../util/ajax'

//获取待办任务列表
export function getTasks(data) {
  return request({
    url: '/sysbase/workflow/build/task/tasks',
    method: 'get',
    params: data
  })
}


//获取待阅任务列表
export function getUndoTasks(data) {
  return request({
    url: '/sysbase/workflow/build/task/undotasks',
    method: 'get',
    params: data
  })
}

//获取跟踪任务列表
export function getReadTasks(data) {
  return request({
    url: '/sysbase/workflow/build/task/user/copy/read/tasks',
    method: 'get',
    params: data
  })
}


//获取公司信息列表
export function getCompanyList() {
  return request({
    url: '/bizbase/project/permission/company',
    method: 'get'

  })
}


//查询用户的常用菜单
export function getCommunlyList() {
  return request({
    url: '/passport/menus/used/list',
    method: 'get'

  })
}

// 编制依据下载
export function getFilePath(data) {
  return request({
    url: '/sysbase/confiles/filepath/list',
    method: 'post',
    data: {
      fileIds: data
    },
  })
}

// w文件下载
export function downloadFile(fileId) {
  return request({
    url: '/sysbase/confiles/download',
    method: 'get',
    responseType: 'arraybuffer',  // 加了这个后 下载的文件不会乱码
    params: {
      fileId
    }
  })
}

// w文件下载
export function getContractInandoutInfo(inAndOutId) {
  return request({
    url: '/contract/inandout/info',
    method: 'get',
    params: {
      inAndOutId
    }
  })
}

// 企业表单字段状态
export function getWorkflowFormStatus(formStatusCode, isDisable) {
  return request({
    url: '/sysbase/workflow/form/column/status',
    method: 'get',
    params: {
      formStatusCode,
      isDisable
    }
  })
}

//退回上一步
export function returnWorkflowFormTask(data) {
  return request({
    url: '/sysbase/workflow/build/task/return/prev',
    method: 'post',
    data
  })
}

//退回发起人
export function returnStartWorkflowFormTask(data) {
  return request({
    url: '/sysbase/workflow/build/task/return/start',
    method: 'post',
    data
  })
}

// 获得监控列表详情
export function getWorkflowBuildTaskLogs(taskId) {
  return request({
    url: '/sysbase/workflow/build/task/logs',
    method: 'get',
    params: {
      taskId
    }
  })
}

// 删除流程
export function deleteProcessNode(taskId) {
  return request({
    url: '/sysbase/workflow/build/task/delete',
    method: 'post',
    params: {
      taskId: taskId
    }
  })
}

// 统一删除数据接口
export function deleteProcessNodeAndData(url, key, id, method = 'get') {
  return request({
    url: url + '?' + key + '=' + id,
    method: method,
  })
}
