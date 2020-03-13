import {formatTime,formatYear,toQfw} from 'util';

//设置完成时间
let setTime = (val) =>{
    return val ? formatTime(val) : ''
}
//设置年月日
let setYear = (val) =>{
    return val ? formatYear(val) : ''
}
//设置金钱千分位
let setMoney = (val) =>{
    return toQfw(val)
}

//设置流程状态
let setFlowStatus = (val) =>{
    let arr = ['未审批','审批中','已审批'];
    let index = Number(val);
    return val ? arr[index] : ''
}


//设置字段定义
let setStatus = (val) =>{
    return val === 0 ? '系统字段' : '自定义字段'
}

//设置文件名称
let fileNameFilter = (val) =>{
    return val ? val.substr(0,val.lastIndexOf('_')) : ''
}

//设置税率
let setTaxRate = (val) =>{
    return val ? Number(val.taxRate.split('%')[0]) : ''
}

//根据身份证判断男女
let setIdcardFilter = (val) =>{
    return val ? val.substr(16,1) %2 ===1 ?'男' : '女' : ''
}
//身份证号脱敏
let IDcardHide = (num) =>{
    return num.replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
}
//手机号脱敏
let telHide = (num) =>{
    return num.replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
}

//设置地址
let setAddress = (val) =>{
    return val ? val.split('_')[1] : ''
}

export default{
    setTime,
    setYear,
    setMoney,
    setFlowStatus,
    setStatus,
    fileNameFilter,
    setTaxRate,
    setIdcardFilter,
    IDcardHide,
    telHide,
    setAddress
}
