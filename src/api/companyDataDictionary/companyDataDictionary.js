import request from '../../util/ajax'

//条件分页查询数据字典记录
export function getSysdatadicList(data){
    return request({
        url:'/sysbase/sysdatadic/list',
        method:'post',
        data
       
    })
}

//字典主键关联查询数据项记录
export function getCondatadicDetailList(id){
    return request({
        url:'/bizbase/condatadic/detail/list',
        method:'get',
        params:{
            id
        }
       
    })
}
//新增数据项记录
export function saveCondatadicDetail(data){
    return request({
        url:'/bizbase/condatadic/detail/save',
        method:'post',
        data
       
    })
}

