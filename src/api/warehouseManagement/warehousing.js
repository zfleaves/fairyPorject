import request from '../../util/ajax'

//
export function getProjectsList(menuId) {
  return request({
    url: '/bizbase/project/permission/menu/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}

//获取入库单列表
export function getIncomingList(data) {
  return request({
    url: '/contract/incoming/list',
    method: 'post',
    data
  })
}

//获取仓库列表
export function getProjectListHouse(projectId) {
  return request({
    url: '/contract/warehouse/project/list/',
    method: 'get',
    params: {
      projectId
    }
  })
}

//删除入库单
export function deleteInandoutList(inAndOutId) {
  return request({
    url: '/contract/inandout/delete',
    method: 'get',
    params: {
      inAndOutId


    }

  })
}


//获取项目名称
export function getProjectsLists(menuId) {
  return request({
    url: '/contract/incoming/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}

//获取项目经理名字
export function getProjectWarehouseList(projectId) {
  return request({
    url: 'contract/warehouse/project/list/',
    method: 'get',
    params: {
      projectId
    }

  })
}

//切换项目之后 获得仓库列表，以及项目经理名字
// export function getProjectListHouse(projectId) {
//   return request({
//     url: '/contract/warehouse/project/list/',
//     method: 'get',
//     params: {
//       projectId
//     }

//   })
// }

//添加入库单
export function createIncomingList(data) {
  return request({
    url: '/contract/incoming/create',
    method: 'post',
    data
  })
}

//查询出库单详情
export function getIncomingInfo(incomingId) {
  return request({
    url: '/contract/incoming/info',
    method: 'get',
    params: {
      incomingId
    }
  })
}

// 修改出库单
export function updateIncomingList(data) {
  return request({
    url: '/contract/incoming/update',
    method: 'post',
    data
  })
}

//删除出库单
export function deleteIncomingList(incomingId) {
  return request({
    url: '/contract/incoming/delete',
    method: 'get',
    params: {
      incomingId
    }
  })
}

// 获取开始节点的处理人信息
export function getStartNodeAssigneeIncomingUsers(warHouseId, projectId) {
  return request({
    url: '/contract/incoming/workflow/start/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      projectId
    }
  })
}


// 获取开始节点的处理人信息
export function getNextNodeAssigneeInandoutUsers(warHouseId, processNodeCode,projectId,taskId) {
  return request({
    url: '/contract/inandout/workflow/next/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      processNodeCode,
      projectId,
      taskId
    }
  })
}




//获得树形菜单公司名称
export function getOrgsList() {
  return request({
    url: '/passport/org/orgs',
    method: 'get'
  })
}

//流程启动
export function startProcess(data) {
  return request({
    url: '/contract/incoming/workflow/start',
    method: 'post',
    data
  })
}

export function updateContractInandout(data) {
  return request({
    url: '/contract/inandout/workflow/start',
    method: 'post',
    data
  })
}


