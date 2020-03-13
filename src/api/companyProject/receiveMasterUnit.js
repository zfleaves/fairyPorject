import request from '../../util/ajax'

//查询企业下的有效项目
export function getCompanyProject() {
  return request({
    url: '/bizbase/project/company',
    method: 'get',

  })
}

//获取公司下的单元列表
export function getProjectUnitList(projectId) {
  return request({
    url: '/bizbase/project/unit/list',
    method: 'get',
    params: {
      projectId
    }
  })
}

//添加项目接口
export function getProjectUnitCreate(data) {
  return request({
    url: '/bizbase/project/unit/create',
    method: 'post',
    data
  })
}

//判断领料单位名字是否重复, 0 == 可用，1==不可用
export function checkProjectUnitName(projectId, unitName) {
  return request({
    url: '/bizbase/project/unit/name/check',
    method: 'get',
    params: {
      projectId,
      unitName
    }
  })
}

//修改项目下的领料单位

export function updateProjectUnit(data) {
  return request({
    url: '/bizbase/project/unit/update',
    method: 'post',
    data
  })
}

//删除项目下的领料单位
export function deleteProjectUnit(projectUnitId) {
  return request({
    url: '/bizbase/project/unit/delete',
    method: 'post',
    params:{
      projectUnitId
    }
  })
}
