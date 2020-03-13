import request from '../../util/ajax';

//获取查询项目科目列表
export function getProjectList(type,parentId){
    return request({
        url:'/sysbase/subject/project/list',
        method:'get',
        params:{
          type,
          parentId
        }
    })
}
