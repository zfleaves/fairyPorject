import request from '../../../util/ajax'

//仓库创建维护list
export function getInandoutList(data) {
  return request({
    url: '/contract/inandout/list',
    method: 'post',
    data
  })
}

//获取流程状态
export function getDicdataStatus(dicId, companyId, flg) {
  return request({
    url: '/bizbase/api/dic/dicdata',
    method: 'get',
    params: {
      dicId, companyId, flg
    }
  })
}

//获取项目名称
export function getProjectsList(menuId) {
  return request({
    url: '/bizbase/project/permission/menu/projects',
    method: 'get',
    params: {
      menuId
    }

  })
}

//提交流程前验证
export function getAssigneeUsers(warHouseId, projectId) {
  return request({
    url: '/contract/inandout/workflow/start/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      projectId

    }

  })
}

//提交流程
export function getWorkflowStart(data) {
  return request({
    url: '/contract/inandout/workflow/start',
    method: 'post',
    data

  })
}

//删除直进直出单
export function deleteInandoutList(inAndOutId) {
  return request({
    url: '/contract/inandout/delete',
    method: 'get',
    params: {
      inAndOutId
    }
  })
}


// 获取开始节点的处理人信息
export function getStartNodeAssigneeUsers(warHouseId, projectId) {
  return request({
    url: '/contract/inandout/workflow/start/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      projectId
    }
  })
}

// 获取开始节点的处理人信息
export function getBasicNodes() {
  return request({
    url: '/sysbase/workflow/basic/nodes',
    method: 'get'
  })
}

// 获取常用评价文字列表
export function getTagList() {
  return request({
    url: '/sysbase/tag/list',
    method: 'get'
  })
}

// 删除用户的流程标签
export function deleteTagList(tagId) {
  return request({
    url: '/sysbase/tag/delete',
    method: 'get',
    params: {
      tagId
    }
  })
}

export function createTagList(workflowTag) {
  return request({
    url: '/sysbase/tag/create',
    method: 'post',
    data: {
      workflowTag
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

//获取第一个公司下面的人员
export function getUserRoles(orgId) {
  return request({
    url: '/passport/company/user/roles',
    method: 'get',
    params: {
      orgId
    }

  })
}


//流程启动
export function startProcess(data) {
  return request({
    url: '/contract/inandout/workflow/start',
    method: 'post',
    data
  })
}
