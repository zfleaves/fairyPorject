import request from '../../util/ajax'

//获取消息数量
export function getMessageCount(isRead) {
  return request({
    url: '/sysbase/message/count',
    method: 'get',
    params: {
      isRead
    }
  })
}


//获取消息列表
export function getMessageList(data) {
  return request({
    url: '/sysbase/message/list',
    method: 'get',
    params: data
  })
}

//获取建议中心消息数量
export function getSuggestStatusCount() {
  return request({
    url: '/sysbase/suggest/status/count',
    method: 'get',

  })
}

//获取建议中心消息列表
export function getSuggestUserList(data) {
  return request({
    url: '/sysbase/suggest/user/list',
    method: 'get',
    params:data
  })
}



//获取建议中心消息数量
export function messageRead(data) {
  return request({
    url: '/sysbase/message/read',
    method: 'post',
    data
  })
}


// 查询单个消息
export function getMessageInfo(messageId) {
  return request({
    url: '/sysbase/message/info',
    method: 'get',
    params:{
      messageId
    }
  })
}
export function getFilepath(data) {
  return request({
    url: '/sysbase/confiles/filepath/list',
    method: 'post',
    data: {
      fileIds: data
    },
  })
}

//提交建议
export function createSuggest(data) {
  return request({
    url: '/sysbase/suggest/create',
    method: 'post',
    data
  })
}

export function suggestInfo(suggestId) {
  return request({
    url: '/sysbase/suggest/info',
    method: 'get',
    params: {
      suggestId
    }
  })
}

