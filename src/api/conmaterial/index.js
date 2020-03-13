import request from '../../util/ajax'

//条件树物资分类查询
export function getconmaterialTree(data) {
  return request({
    url: '/bizbase/conmaterial/tree',
    method: 'post',
    data

  })
}

// 分页查询物资明细记录
export function getconmaterialDetailList(data) {
  return request({
    url: '/bizbase/conmaterial/detail/list',
    method: 'post',
    data
  })
}


// 新增物资分类保存
export function saveConmaterial(data) {
  return request({
    url: '/bizbase/conmaterial/save',
    method: 'post',
    data
  })
}

// 点击修改
export function editConmaterialInf(id) {
  return request({
    url: '/bizbase/conmaterial/inf',
    method: 'get',
    params: {
      id
    }

  })
}

//修改物资分类保存
export function updateConmaterial(data) {
  return request({
    url: '/bizbase/conmaterial/update',
    method: 'put',
    data
  })
}

// 删除物资分类记录
export function deleteConmaterial(id, deleteBy) {
  return request({
    url: '/bizbase/conmaterial/delete',
    method: 'put',
    params: {
      id,
      deleteBy
    }
  })
}


// 获取默认物资明细编号(4位)
export function getDefultDetailCode(classifyId) {
  return request({
    url: '/bizbase/conmaterial/defultDetailCode',
    method: 'get',
    params: {
      classifyId
    }
  })
}

// 新增物资明细记录
export function saveConmaterialDetail(data) {
  return request({
    url: '/bizbase/conmaterial/detail/save',
    method: 'post',
    data
  })
}

// 修改物资明细记录
export function updateConmaterialDetail(data) {
  return request({
    url: '/bizbase/conmaterial/detail/update',
    method: 'put',
    data
  })
}

// 删除物资明细记录
export function deleteConmaterialDetail(id, deleteBy) {
  return request({
    url: '/bizbase/conmaterial/detail/delete',
    method: 'put',
    params: {
      id,
      deleteBy
    }
  })
}

// 查询物资明细记录
export function getConmaterialDetailInfo(id) {
  return request({
    url: '/bizbase/conmaterial/detail/inf',
    method: 'get',
    params: {
      id
    }
  })
}

// 判断是否有启动项，true 不允许一键清除
export function chkStartProject(companyId) {
  return request({
    url: '/bizbase/materialBatch/chkStartProject',
    method: 'post',
    params: {
      companyId
    }
  })
}

// 判断物资编号是否存在:true存在，false不存在
export function getCheckMaterialCode(materialCode) {
  return request({
    url: '/bizbase/conmaterial/checkMaterialCode',
    method: 'get',
    params: {
      materialCode
    }
  })
}
