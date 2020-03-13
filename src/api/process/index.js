import request from '../../util/ajax';


//获取我的待办列表
export function getSysbaseWorkflowTasksList(pageNo,pageSize) {
  return request({
    url: '/sysbase/workflow/build/task/tasks',
    method: 'get',
    params: {
        pageNo,
        pageSize
    }
  })
}


//获取我的待阅列表
export function getSysbaseWorkflowUndotasksList(pageNo,pageSize) {
    return request({
      url: '/sysbase/workflow/build/task/undotasks',
      method: 'get',
      params: {
          pageNo,
          pageSize
      }
    })
  }
