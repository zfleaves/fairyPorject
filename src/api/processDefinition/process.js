import request from '@/util/ajax';

// 移动节点
export function moveProcessNode(processNodeCode, indexX, indexY) {
  return request({
    url: '/sysbase/workflow/build/instance/node/move',
    method: 'get',
    params: {
      processNodeCode,
      indexX,
      indexY
    }
  })
}

// 初始化企业流程的节点（拖拽到画布时保存， 不设置节点内容）
export function createProcessNode(data) {
  return request({
    url: '/sysbase/workflow/build/instance/node/init',
    method: 'get',
    params: data
  })
}

// 删除节点，并删除了节点连接
export function deleteProcessNode(processNodeCode) {
  return request({
    url: '/sysbase/workflow/build/instance/node/remove',
    method: 'get',
    params: {
      processNodeCode
    }
  })
}

// 删除节点连接
export function deleteProcessNodeLine(fromNodeCode, toNodeCode) {
  return request({
    url: '/sysbase/workflow/build/instance/node/connect/remove',
    method: 'get',
    params: {
      fromNodeCode,
      toNodeCode
    }
  })
}

// 企业流程节点连接信息，返回值：status为0则正常， 为1则异常， msg为输出显示
export function checkProcessesConnect(fromNodeCode, toNodeCode, processCode) {
  return request({
    url: '/sysbase/workflow/build/instance/node/connect',
    method: 'get',
    params: {
      fromNodeCode,
      toNodeCode,
      processCode
    }
  })
}

// 测试流程是否能发布
export function tryPublishProcesses(processCode) {
  return request({
    url: '/sysbase/workflow/build/instance/process/publish/try',
    method: 'get',
    params: {
      processCode
    }
  })
}

// 发布企业流程
export function publishProcesses(formCode, processCode) {
  return request({
    url: '/sysbase/workflow/build/instance/process/publish/try',
    method: 'get',
    params: {
      formCode,
      processCode
    }
  })
}
