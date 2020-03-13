import request from '../../util/ajax'

//查询公司科目列表
export function getCompanyList(type){
    return request({
        url:'/sysbase/subject/company/list',
        method:'get',
        params:{
            type
        }

    })
}

//添加公司科目
export function createCompanySubject(data){
    return request({
        url:'/sysbase/subject/company/create',
        method:'post',
        data

    })
}

//删除公司科目
export function deleteCompanySubject(subjectId){
    return request({
        url:'/sysbase/subject/company/delete',
        method:'get',
        params:{
            subjectId
        }

    })
}

//验证是否能删除， 1==不能删除，0==能删除
export function checkDeleteCompanySubject(subjectId){
    return request({
        url:'/sysbase/subject/company/delete/check',
        method:'get',
        params:{
            subjectId
        }

    })
}

//验证公司科目名称是否存在, 1==存在， 0==不存在

export function checkCompanySubjectName(subjectName){
    return request({
        url:'/sysbase/subject/company/subject/name/check',
        method:'get',
        params:{
            subjectName
        }

    })
}


//禁用公司科目
export function disableCompanySubject(subjectId){
    return request({
        url:'/sysbase/subject/company/disable',
        method:'get',
        params:{
            subjectId
        }
    })
}

//启用公司科目
export function enableCompanySubject(subjectId){
  return request({
    url:'/sysbase/subject/company/enable',
    method:'get',
    params:{
      subjectId
    }
  })
}

//设置公司状态
export function setCompanySubject(url,subjectId){
  return request({
    url:url,
    method:'get',
    params:{
      subjectId
    }
  })
}


//验证公司科目编号是否存在, 1==存在， 0==不存在
export function checkCompanySubjectCode(subjectCode){
    return request({
        url:'/sysbase/subject/company/subject/code/check',
        method:'get',
        params:{
            subjectCode
        }

    })
}

//修改公司科目
export function updateCompanySubject(data){
    return request({
        url:'/sysbase/subject/company/update',
        method:'post',
        data

    })
}
