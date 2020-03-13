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
    url: '/contract/inandout/projects',
    method: 'get',
    params: {
      menuId
    }
  })
}

//获取项目经理名字
export function getProjectWarehouseList(projectId) {
  return request({
    url: '/contract/warehouse/project/list/',
    method: 'get',
    params: {
      projectId
    }

  })
}

//获取领用单位列表
export function getUnitList(projectId) {
  return request({
    url: '/bizbase/project/unit/list',
    method: 'get',
    params: {
      projectId
    }

  })
}

//获取使用部门/工程
export function getChildrenAllList(projectId) {
  return request({
    url: '/bizbase/project/child/children/all',
    method: 'get',
    params: {
      projectId
    }

  })
}

//获取明细物资弹窗数据列表
export function getMaterialList(classifyName) {
  return request({
    url: '/bizbase/conmaterial/import/Material',
    method: 'post',
    params: {
      classifyName
    }

  })
}

//树节点的children 列表
export function getDetailList(data) {
  return request({
    url: '/bizbase/conmaterial/detail/list',
    method: 'post',
    data


  })
}


//添加直进直出单
export function createInandoutList(data) {
  return request({
    url: '/contract/inandout/create',
    method: 'post',
    data
  })
}

//查询直进直出单详情
export function getInandoutInfo(inAndOutId) {
  return request({
    url: '/contract/inandout/info',
    method: 'get',
    params:{
      inAndOutId
    }
  })
}

// 修改直进直出单
export function updateInandoutList(data) {
  return request({
    url: '/contract/inandout/update',
    method: 'post',
    data
  })
}
