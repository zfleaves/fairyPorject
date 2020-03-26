import request from 'util/ajax';

//获取项目名称
export function getCompanyProject(){
    return request({
        url:'/bizbase/project/company',
        method:'get',
        
    })
}
//公司名称
export function getPermissionOrgs(){
    return request({
        url:'/passport/org/permission/orgs',
        method:'get',
        
    })
}
//生成报表
export function getDetailAnalysis(data){
    return request({
        url:'/contract/reportanalysis/cost/detail/analysis',
        method:'post',
        data
        
    })
}

//生成报表
export function getReportWarWarDetail(data){
    return request({
        url:'/contract/reportWar/warDetail',
        method:'post',
        data
        
    })
}
//生成报表
export function getReportWarInDown(data){
    return request({
        url:'/contract/reportWar/in/down',
        method:'post',
        data
        
    })
}
//出库明细汇总表
export function getReportWarWarOutDetail(data){
    return request({
        url:'/contract/reportWar/warOutDetail',
        method:'post',
        data
        
    })
}
