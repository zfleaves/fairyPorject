<template>
  <div class="tag-nav">
    <scroll-bar ref="scrollBar">
      <router-link ref="tag" tag="div" class="tag-nav-item left midFont"
                   v-for="(item , index) in tagNavList"
                   :key="index"
                   :class="item.name===$route.name ? 'active' : ''"
                   :title="item.title"
                   @contextmenu.prevent.native="openMenu(item,$event,index)"
                   :to="item.path">
        {{item.title}}
        <span class="el-icon-close" v-show="IsRouteTo(item)" @click.prevent.stop="closeTheTag(item,index)"></span>
      </router-link>
    </scroll-bar>
    <ul v-show="visible" ref="contextmenu" class="contextmenu">
      <li v-show="IsRouteTo(selectTag)" @click.prevent="closeTheTag(selectTag,selectIndex)">关闭</li>
      <li @click="refreshSelectedTag" v-show="$route.name===selectTag.name">刷新</li>
      <li @click="closeOtherTags(selectTag)">关闭其他</li>
      <li @click="closeAllTags(selectTag)" v-show="IsRouteTo(selectTag)">关闭所有</li>
    </ul>
  </div>
</template>
<script>
  import ScrollBar from '../../components/scrollBar/scrollBar'
  import {addCommunlyUsed} from 'api/login/login'
  import Auth from 'util/auth'

  export default {
    //子组件注册父组件方法
    inject: ['reload'],
    name: 'tag-nav',
    components: {
      ScrollBar
    },
    data() {
      return {
        defaultPage: '/home/first',
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        selectedIndex: "",
        permission_routers: [],
        processDesignList: [
          {name: 'processDesign', url: 'workflow/build/template/process/publish/try'},
          {name: 'processCompanyDesign', url: 'workflow/build/instance/process/publish/try'},
          {name: 'publishDesign', url: 'workflow/build/publish/process/publish/try'},
        ],
        selectTag: '',
        selectIndex: '',
        menusList: [],
      }
    },
    computed: {
      tagNavList() {
        return this.$store.state.tagNav.cachedPageList
      }
    },
    created() {
      this.getMenusLis();
      this.setCurrentPage()
      // this.setCurrentPage()
    },
    //监听路由变化
    watch: {
      $route: {
        handler: function (val, oldVal) {
          console.log(val);
          this.addTagNav();
          this.setCurrentPage()
        },
        // 深度观察监听
        deep: true
      },
      visible() {
        if (this.visible) {
          document.body.addEventListener('click', this.closeMenu);
        } else {
          document.body.removeEventListener('click', this.closeMenu);
        }
      },
      tagNavList: {
        handler: function (val, oldVal) {
          if (this.$refs.scrollBar) {
            this.$refs.scrollBar.scrollToCurTag()
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    mounted() {
      this.addTagNav();
    },
    methods: {
      getMenusLis() {
        this.menusList = [];
        let menusArr = Auth.getObjArr();
        for (let i in menusArr) {
          let item = menusArr[i];
          if (item.children && item.children.length) {
            for (let j in item.children) {
              let child = item.children[j];
              this.menusList.push(child);
            }
          }
        }
      },
      // 添加 tagNav 子项
      addTagNav() {
        // let route = this.$route; // 跳转下一个页面的路由
        let route = this.generateRoute(); // 跳转下一个页面的路由
        // console.log(route);
        this.$store.commit('tagNav/addTagNav', route);
        let index = this.menusList.findIndex(v => v.name === route.name);
        if (index >= 0) {
          addCommunlyUsed(this.menusList[index].id).then(res => {
            console.log(res);
          })
        }
        // let menusList = Auth.getObjArr();
        // for (let i in menusList) {
        //   let item = menusList[i];
        //   if (item.children && item.children.length) {
        //     for (let j in item.children) {
        //       let child = item.children[j];
        //       if (child.name === route.name) {
        //         addCommunlyUsed(child.id).then(res => {
        //           console.log(res);
        //         })
        //       }
        //     }
        //   }
        // }
      },
      generateRoute() {
        let obj = localStorage.getItem('RouteTitle') ? JSON.parse(localStorage.getItem('RouteTitle')) : '';
        if (obj.name && obj.name === this.$route.name) {
          this.$route.meta.title = obj.title;
        }
        return this.$route;
      },
      //判断是否不是首页
      IsRouteTo(item) {
        return item.name !== 'home';
      },
      //打开右键菜单
      openMenu(item, event, index) {
        // this.visible = true;
        console.log(event);
        let x = event.clientX;
        let y = event.clientY;
        this.top = y + 30;
        this.left = x + 10;
        this.$refs.contextmenu.style.left = this.left + 'px';
        this.$refs.contextmenu.style.top = this.top + 'px';
        this.selectTag = item;
        this.selectIndex = index;
        this.visible = true;
      },
      //关闭右键菜单
      closeMenu() {
        this.visible = false;
      },
      //关闭页面
      closeTheTag(item, index) {
        // this.tagNavList.splice(index, 1);
        this.$store.commit('tagNav/removeTagNav', item);
        if (item.path === this.$route.path) {
          this.$router.push(this.tagNavList[index - 1].path);
        }
      },
      //关闭所有页面
      closeAllTags(item) {
        this.$store.commit('tagNav/closeAllTags');
        if (this.IsRouteTo(item)) {
          this.$router.push('/home');
        }
      },
      //关闭其他
      closeOtherTags(item) {
        // console.log(item)
        this.$store.commit('tagNav/closeOtherTags', item);
        if ($route.name === item.name) return
        if (this.IsRouteTo(item.name)) {
          this.$router.push(item.path)
        } else {
          this.$router.push('/home')
        }

      },
      // 存取 当前页面
      setCurrentPage() {
        this.$store.commit("tagNav/SET_CURRENT_PAGE", this.$route);
      },
      //刷新
      refreshSelectedTag() {
        this.reload();
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "./style/TagNav.scss";

  .tag-nav-item {
    background: #ccc;
    background-size: cover;
    height: 30px;
    float: left;
    box-shadow: 5px 2px 6px #666;
    margin-top: 10px;
    &#first {
      height: 30px;
      line-height: 30px;
      margin-left: 0;
      background: #ccc;
      background-size: cover;
      &.active {
        background: #00b38a;
        background-size: cover;
      }
    }
    &.active {
      background: #00b38a;
      background-size: cover;
    }
  }

  .tag-nav-item:hover {
    cursor: pointer;
  }

  .contextmenu {
    position: fixed;
    width: 110px;
    margin: 0;
    background: #fff;
    z-index: 100;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }


</style>


