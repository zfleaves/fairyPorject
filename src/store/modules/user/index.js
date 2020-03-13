const state = {
  userName:'张鸣',
  age:'',
  num:'',
  taskId:''//流程监控
}
const mutations = {
  setUserName:(state,data) =>{
    if(data){
      state.userName = data
    }else{
      state.userName  = '';
    }
  },
  setAge:(state,data) =>{
    if(data){
      state.age = data
    }else{
      state.age  = '';
    }
  },
  setNum:(state,data) =>{
    if(data){
      state.num = data
    }else{
      state.num  = '';
    }
  },
  setTaskId:(state,data)=>{
    if(data){
      state.taskId = data;
    }else {
      state.taskId = ""
    }
  }
}

export default {
  namespaced:true,
  state,
  mutations
}
