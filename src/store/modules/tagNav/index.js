const state = {
  cachedPageList: [
    {
      name: 'home',
      path: '/home',
      title: '首页',
      saveContent: false
    }
  ],
  cachedPageName: ['home'],
  freshRouterObj: '',//用来刷新页面
  // 当前页面
  currentPage: {},
}

const mutations = {
  addTagNav(state, data) {
    if (state.cachedPageList.some(v => v.name === data.name && v.path === data.path)) return;

    let index = state.cachedPageList.findIndex(v => v.name === data.name && v.path !== data.path);

    if (index >= 0) {
      state.cachedPageList[index].name = data.name;
      state.cachedPageList[index].path = data.path;
      state.cachedPageList[index].title = data.meta.title || '';
      state.cachedPageList[index].saveContent = false;
    } else {
      state.cachedPageList.push({
        name: data.name,
        path: data.path,
        title: data.meta.title,
        saveContent: false
      })
    }

    if (data.meta.isCached) {
      let index = state.cachedPageName.findIndex(v => v === data.name);
      if (index >= 0) {
        state.cachedPageName.splice(index, 1);
      }
      state.cachedPageName.push(data.name)
    }
  },
  //删除

  removeTagNav(state, data) {
    //错误示范 =》 不能判断一个 数组里得item 跟一个对象相等
    // let index = state.cachedPageList.findIndex(v=> v === data)

    state.cachedPageList.splice(state.cachedPageList.indexOf(data), 1);
    if (state.cachedPageName.some(v => v === data.name)) {
      state.cachedPageName.splice(state.cachedPageName.indexOf(data.name), 1)
    }
  },

  //关闭所有
  closeAllTags(state, data) {
    state.cachedPageList = [
      {
        name: 'home',
        path: '/home',
        title: '首页',
        saveContent: false
      }
    ];
    state.cachedPageName = ['home'];
  },

  //关闭其他
  closeOtherTags(state, data) {
    console.log(data)
    if (data.name === "home") {
      state.cachedPageList = [
        {
          name: 'home',
          path: '/home',
          title: '首页',
          saveContent: false
        }
      ]
      state.cachedPageName = ['home'];

    } else {
      state.cachedPageList = [
        {
          name: 'home',
          path: '/home',
          title: '首页',
          saveContent: false
        }
      ]
      state.cachedPageList.push(data)
      state.cachedPageName = ['home'];
      state.cachedPageName.push(data.name)

    }


  },

  //改变刷新页面的对象
  setFreshRouterObj(state, data) {
    if (data) {
      state.freshRouterObj = data;
    } else {
      state.freshRouterObj = '';
    }
  },
  //清空当前数据仓库
  resetTagNavState(state,data){
    state.cachedPageList = [
      {
        name: 'home',
        path: '/home',
        title: '首页',
        saveContent: false
      }
    ];
    state.cachedPageName = ['home'];
    state.freshRouterObj = '',//用来刷新页面
    state.currentPage = {}
  },
  SET_CURRENT_PAGE: (state, data) => {
    state.currentPage = data;
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
