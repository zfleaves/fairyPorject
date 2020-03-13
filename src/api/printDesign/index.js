import request from '../../util/ajax';


//获取企业打印模版列表
export function getSysbasePrintModelList(userId) {
  return request({
    url: '/sysbase/print/model/list',
    method: 'get',
    params: {
      userId
    }
  })
}


// 保存打印
export function createPrintModel(data) {
  return request({
    url: '/sysbase/print/model/create',
    method: 'post',
    data
  })
}

// 恢复初始设置
export function resetPrintModel(printModelCode) {
  return request({
    url: '/sysbase/print/model/reset',
    method: 'get',
    params: {
      printModelCode
    }
  })
}

// 获取企业配置的打印显示字段
export function getPrintModelShowList(printModelCode) {
  return request({
    url: '/sysbase/print/model/detail',
    method: 'get',
    params: {
      printModelCode
    }
  })
}

// 查询流程处理人信息
export function getPrintModelProcessList(data) {
  return request({
    url: '/sysbase/print/model/foot/assignees',
    method: 'post',
    data
  })
}

// 获取打印模版字段的排序
export function getPrintModelSortList(printModelCode) {
  return request({
    url: '/sysbase/print/model/sort',
    method: 'get',
    params: {
      printModelCode
    }
  })
}

// 获取打印模版的foot字段
export function getPrintModelFootList(printModelCode) {
  return request({
    url: '/sysbase/print/model/foots',
    method: 'get',
    params: {
      printModelCode
    }
  })
}

// 获取审批打印模版的foot字段
export function getPrintModelTaskIdFootList(taskId) {
  return request({
    url: '/sysbase/print/model/task/foots',
    method: 'get',
    params: {
      taskId
    }
  })
}
