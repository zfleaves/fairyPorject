<template>
  <div class="lyout">
    <Headers>
    </Headers>
    <div class="lyoutMain">
      <menubar class="left" :class="menubarFlag?'menubarFlag':''">
      </menubar>
      <div class="right">
        <tabbar class="tabbar">
        </tabbar>
        <div class="lyoutCon">
          <div class="lyoutCon_fix">
            <webMain>
            </webMain>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogFormVisibleFlag"
    title="提示"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
               @close="closeDialog">
      <div>
        <p style="text-align: center;font-size:18px;"><i style="color:red;margin-right: 10px;" class="el-icon-warning"></i>当前会话已超时，请重新登录</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="goBackHome">登录</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="modal"
      title="流程监控"
      top="10vh"
      @close="closeMoniter"
      v-if="moniterFlag"
      :visible.sync="moniterFlag"
      width="90%">
      <processMonitoring :id="taskId">
      </processMonitoring>
    </el-dialog>
  </div>
</template>

<script>
  import Headers from './component/headers'
  import menubar from './component/menubar'
  import tabbar from './component/tabbar'
  import webMain from './component/webMain'
  import {resetStoreState} from 'util'
  import Auth from 'util/auth'
  import ProcessMonitoring from 'views/home/component/processWindow/processMonitoring';

  export default {
    name: "lyout",
    components: {Headers, menubar, tabbar, webMain,ProcessMonitoring},
    data() {
      return {
        moniterFlag: false,
        dialogFormVisibleFlag: false
      }
    },
    computed: {
      menubarFlag() {
        return this.$store.state.menubar.menubarShowOrHide
      },
      taskId() {
        return this.$store.state.user.taskId
      },
      dialogFormVisible() {
        return this.$store.state.dailog.isDialogFormVisible
      }
    },
    watch: {
      taskId() {
        if (this.taskId) {
          this.moniterFlag = true;
        } else {
          this.moniterFlag = false;
        }
      },
      dialogFormVisible() {
        if (this.dialogFormVisible) {
          this.dialogFormVisibleFlag = true;
        } else {
          this.dialogFormVisibleFlag = false;
        }
        console.log(this.dialogFormVisibleFlag);
      }
    },
    methods: {
      closeMoniter() {
        this.$store.commit('user/setTaskId');
      },
      goBackHome() {
        Auth.reLogin();
        this.$router.push('/login');
        resetStoreState()
      },
      closeDialog() {
        this.$store.commit('dailog/setIsDialogFormVisible', false);
        this.goBackHome();
      }
    }
  }
</script>

<style scoped lang="scss">
  .lyout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .headers {
      height: 65px;
      background-color: #223355;
    }
    .lyoutMain {
      flex: 1;
      display: flex;
      .left {
        width: 220px;
        background-color: #334455;
        &.menubarFlag {
          width: 66px;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #f5f5f5;
        border-radius: 50%;
        .tabbar {
          height: 30px;
        }
        .lyoutCon {
          flex: 1;
          position: relative;
          .lyoutCon_fix {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
