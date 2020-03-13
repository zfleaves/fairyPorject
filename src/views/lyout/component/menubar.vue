<template>
  <div class="menusList">
    <el-menu
      class="el-menu-vertical-demo"
      :show-timeout="150"
      :hide-timeout="150"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="menubarFlag">
      <template v-for="item in menusList" v-if="item.children && item.children.length">
        <!--当子菜单个数大于1，显示-->
        <el-submenu :index="String(item.id)" v-if="item.children.length>1">
          <template slot="title">
            <i :class="'el-icon-third-'+item.icon"></i>
            <span>{{item.resName}}</span>
          </template>
          <el-menu-item-group>
            <router-link
              class="daymicRouter"
              :class="$route.name === child.name ? 'is-active' : ''" tag="div"
              :to="'/'+child.path" v-for="(child,index) in item.children" :key="index">
              <el-menu-item :index="String(child.id)">
                <i :class="'el-icon-third-'+child.name"></i>
                <span slot="title"> {{child.resName}}</span>
              </el-menu-item>
            </router-link>


          </el-menu-item-group>
        </el-submenu>
        <router-link
          class="daymicRouter"
          :class="$route.name===item.children[0].name ? 'is-active' : ''" tag="div"
          :to="'/'+item.children[0].name" v-else>
          <el-menu-item :index="String(item.id)">
            <i :class="'el-icon-third-'+item.children[0].name"></i>
            <span slot="title">{{item.children[0].resName}}</span>
          </el-menu-item>
        </router-link>

      </template>


    </el-menu>
  </div>

</template>

<script>
  // import {mapActions} from 'vuex'
  import {getMenusList} from 'api/login/login'
  import Auth from 'util/auth'

  export default {
    name: "menubar",
    data() {
      return {
        isCollapse: this.menubarFlag,
        menusList: Auth.getObjArr() ? Auth.getObjArr() : []
      }
    },
    created() {
      // this._getMenusList();
    },
    computed: {
      menubarFlag() {
        return this.$store.state.menubar.menubarShowOrHide
      }
    },
    methods: {
      //获取菜单列表
      _getMenusList() {
        getMenusList().then(res => {
          if (res.results && res.results.length) {
            this.menusList = res.results;
            Auth.saveObjArr(this.menusList)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .menusList {
    position: relative;
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
    .el-menu-vertical-demo {
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    // .is-active{
    //   color: red;
    //   background: #00ff00;
    // }
  }
</style>
