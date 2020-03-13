import request from '../../util/ajax'

//获取项目状态
export function getDicdataList(dicId,companyId,flg){
    return request({
        url:'/bizbase/api/dic/dicdata',
        method:'get',
        params:{
            dicId,
            companyId,
            flg
        }
    })
}