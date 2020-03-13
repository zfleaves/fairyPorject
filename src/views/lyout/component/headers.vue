<template>
  <div class="headers">
    <div class="hamburger-container" @click="changeMenubar">
      <i class="el-icon-s-fold"></i>
    </div>
    <div class="logo">
      <img src="https://static.junnysoft.cn/TradeMark.png" alt="">
      <span>{{userInfo.companyFullName}}</span>
    </div>
    <ul class="floatRight">
      <li @click="messageCenter">
       <img style="width: 17px;margin-top: 22px;" src="static/images/news.png" alt="">
      </li>
      <li>
        <el-dropdown style="color: white;">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>个人信息
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item>更换账号</el-dropdown-item>
            <el-dropdown-item @click.native="suggestionCenter">建议中心</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li @click="logOut">
        <i class="el-icon-switch-button"></i>
        退出登录
      </li>
    </ul>
  </div>
</template>

<script>
// import {mapActions} from 'vuex'

import {loginOut} from 'api/login/login'
import Auth from 'util/auth'
  export default {
    name: "headers",
    computed: {
      userInfo() {
        return JSON.parse(Auth.hasUserInfo())
      }
    },
    methods:{
      changeMenubar(){
        console.log(111111)
        // this.changeFlag()
        this.$store.commit('menubar/isMenubarShow');
        // this.$store.commit('menubar/setMenubarShowOrHide')
      },
      logOut(){
         this.$confirm('您确定退出登录吗？', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
            loginOut().then(res=>{
              console.log(res)
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
              Auth.reLogin();
              this.$router.push('/login')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: ''
          });
        });

      },
      messageCenter(){
        this.$router.push('/messageCenter');
        // this.$router.push('/messageCenter')
      },
      suggestionCenter(){
         this.$router.push('/suggestionCenter');
      }
      //  ...mapActions({
      // changeFlag: 'menubar/changeSetMenubar'
      // })
    },

  }
</script>

<style scoped lang="scss">
  .headers {
    width: 100%;
    color: #fff;
    line-height: 65px;
    .hamburger-container {
      float: left;
      margin: 0 20px;
      i {
        font-size: 48px;
        line-height: 65px;
      }
    }
    .logo {
      float: left;
      img {
        height: 60px;
        display: inline-block;
        vertical-align: middle;
        margin: 0px 6px;
      }
      span {
        color: #fff;
        font-size: 20px;
      }
    }
    .floatRight {
      float: right;
      display: inline-block;
      font-size: 14px;
      li {
        color: white;
        float: left;
        /*margin:0 10px;*/
        cursor: pointer;
        line-height: 65px;
        padding-right: 20px;
        i{
          margin-right: 10px;
        }
      }
    }
  }
</style>
