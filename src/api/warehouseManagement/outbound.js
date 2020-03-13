import request from '../../util/ajax'

//获得项目名称
export function getProjectsList(menuId) {
  return request({
    url: '/bizbase/project/permission/menu/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}

//获得出库单列表
export function getOutboundList(data) {
  return request({
    url: '/contract/outbound/list',
    method: 'post',
    data
  })
}

//获得仓库名称
export function getProjectWarehouseList(projectId) {
  return request({
    url: '/contract/warehouse/project/list/',
    method: 'get',
    params: {
      projectId
    }

  })
}

//删除出库单表格数据
export function deleteOutboundList(OutboundId) {
  return request({
    url: '/contract/outbound/delete',
    method: 'get',
    params: {
      OutboundId
    }
  })
}

//获取项目名称
export function getOutboundProjectsList(menuId) {
  return request({
    url: '/contract/outbound/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}

//获得领用单位
export function getUnitList(projectId) {
  return request({
    url: '/bizbase/project/unit/list',
    method: 'get',
    params: {
      projectId
    }

  })
}

//获得使用部门/工程
export function getChildrenAllList(projectId) {
  return request({
    url: '/bizbase/project/child/children/all',
    method: 'get',
    params: {
      projectId
    }
  })
}


// 添加出库单
export function createOutboundList(data) {
  return request({
    url: '/outbound/create',
    method: 'post',
    data
  })
}
//删除出库单
export function deleteOutboundLists(OutboundId) {
  return request({
    url: '/outbound/delete',
    method: 'get',
    params: {
      OutboundId
    }
  })
}
//删除明细
export function deleteDetailOutboundList(data) {
  return request({
    url: '/outbound/detail/delete',
    method: 'post',
    data
  })
}
//出库单列表导出
export function exportexcelOutboundList(data) {
  return request({
    url: '/outbound/exportexcel',
    method: 'post',
    data
  })
}
//查询出库单详情
export function getOutboundInfo(OutboundId) {
  return request({
    url: '/outbound/info',
    method: 'get',
    params: {
      OutboundId
    }
  })
}
//出库单条件分页查询
export function getOutboundPageList(data) {
  return request({
    url: '/outbound/list',
    method: 'post',
    data
  })
}
//查询企业下的所有仓库的出库单明细
export function getOutboundMaterialDetailsProject(projectId) {
  return request({
    url: '/outbound/material/details/project',
    method: 'get',
    params: {
      projectId
    }
  })
}
//获取用户当前业务模块可以选择的项目信息
export function getOutboundProject(menuId) {
  return request({
    url: '/outbound/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}
//修改出库单
export function updateOutboundList(data) {
  return request({
    url: '/outbound/update',
    method: 'post',
    data
  })
}
//流程审批
export function approveOutboundWorkflow(data) {
  return request({
    url: '/outbound/workflow/approve',
    method: 'post',
    data
  })
}
//获取下一个节点的处理人信息
export function getOutboundWorkflowNextUsers(warHouseId,processNodeCode,projectId) {
  return request({
    url: '/outbound/workflow/next/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      processNodeCode,
      projectId

    }
  })
}
//流程启动
export function startOutboundWorkflow(data) {
  return request({
    url: '/outbound/workflow/start',
    method: 'post',
    data
  })
}
//获取开始节点的处理人信息
export function getOutboundWorkflowStartUsers(warHouseId,projectId) {
  return request({
    url: '/outbound/workflow/start/node/assignee/users',
    method: 'get',
    params: {
      warHouseId,
      projectId

    }
  })
}

//获取明细物资弹窗数据列表
export function getOutboundSetMaterialList(warehouseId) {
  return request({
    url: '/contract/warehouse/materials',
    method: 'get',
    params: {
      warehouseId
    }

  })
}

