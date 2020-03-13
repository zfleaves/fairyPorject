const state = {
  menubarShowOrHide: false,
}

const mutations = {
  setMenubarShowOrHide: (state, data) => {
    if (data) {
      state.menubarShowOrHide = data
    } else {
      state.menubarShowOrHide = '';
    }
  },

  isMenubarShow: (state, data) => {
    state.menubarShowOrHide = ! state.menubarShowOrHide;
  },
  //清空当前数据仓库
  resetMenubarState(state,data){
    state.menubarShowOrHide= false;
  }
}

const actions = {
  changeSetMenubar({commit, state}, data) {
    console.log(!state.menubarShowOrHide)
    commit('setMenubarShowOrHide', !state.menubarShowOrHide)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
