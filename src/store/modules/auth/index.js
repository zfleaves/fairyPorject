const state = {
    setMessageReminder: false, // true 消息状态发生了改变 
  }
  
  const mutations = {
      // 当消息状态发生更改时
        SET_MessageReminder: (state, data) => {
            state.setMessageReminder = data;
        },
  }
  
  export default {
    namespaced: true,
    state,
    mutations
  }
  