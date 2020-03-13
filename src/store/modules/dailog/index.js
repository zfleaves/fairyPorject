const state = {
    isDialogFormVisible:false,
  }
  const mutations = {
    setIsDialogFormVisible:(state,data) =>{
      if(data){
        state.isDialogFormVisible = data
      }else{
        state.isDialogFormVisible  = '';
      }
    }
  }
  
  export default {
    namespaced:true,
    state,
    mutations
  }
  