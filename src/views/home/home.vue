<template>
  <div class="home">
    <div class="top">
      <div class="topTitleLeft">
        <h2>工程物资云平台 引领物资管理新模式</h2>
        <p v-if="!rolseFlag">
          {{userInfo.userName}},<span v-html="roles"></span>,{{fortime}}
        </p>
        <p v-else>
          <el-dropdown v-if="rolseFlag">
            <span>{{userInfo.userName}},<span v-html="roles"></span>,{{fortime}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :key="item.id"
                v-for="item in userInfo.rolesCacheDtos">{{item.rolesName}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
      </div>
      <div class="topTitleRight">
        <h2>{{day}}</h2>
        <p>农历{{ oldTime}}</p>
      </div>
    </div>
    <div class="bottom">
      <div class="top1">
        <div class="menus dataKanban">
          <div class="title">
            <span class="titleLeft">数据看板</span>
            <img src="static/icon/homeIcon/sj_xiangmuqiehuan.png" alt="">
            <div class="titleRight">
              <el-dropdown style="color: #333;font-weight: 600;">
                  <span class="el-dropdown-link">
                   {{ companyList.length>0 ? companyList[0].proName : ''}}
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in companyList"
                    :key="item.id">{{item.proName}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <ul class="leftArr">
            <li v-for="item in leftArr" :key="item.id">
              <img :src="item.img" alt="">
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
        <div class="menus commonMenus">
          <div class="title"><span class="titleLeft">常用菜单</span></div>
          <ul>
            <!--childMenusColorList-->
            <li @click="handleRouterMenus(item)" v-for="(item,index) in CommunlyLists" :key="index">
              <i style="font-size:40px;"
                 :style="{color:childMenusColorList[index%3]}"
                 :class="'el-icon-third-'+item.path"></i>
              <p>{{item.resName}}</p>
            </li>

          </ul>
        </div>
      </div>
      <div class="bottom1">
        <div style="position: relative;">
          <ul class="switchTabbar">
            <li @click="getTabbarIndex(index)" v-for="(item,index) in tabbarListArr" :key="index"
                :class="index === currentIndex ? 'active' : ''">{{item}}
            </li>
          </ul>
          <el-pagination
            class="page"
            v-show="currentIndex===0"
            small layout="prev, pager, next"
            :total="total">
          </el-pagination>
          <el-pagination
            class="page"
            v-show="currentIndex===1"
            small layout="prev, pager, next"
            :total="totalDone">
          </el-pagination>
          <el-pagination
            class="page"
            v-show="currentIndex===2"
            small layout="prev, pager, next"
            :total="totalRead">
          </el-pagination>
        </div>
        <div class="showTable">
          <!--未读消息-->
          <el-table @row-click="handleChangeToDoList" v-show="currentIndex === 0" :data="tableData" height="250"
                    style="width: 100%">
            <el-table-column prop="" label="序号" type="index">
            </el-table-column>
            <el-table-column
              prop="taskName"
              label="任务名称">
            </el-table-column>
            <el-table-column
              prop="nodeName"
              label="节点名称">
            </el-table-column>
            <el-table-column
              prop="taskCreateBy"
              label="发起人">
            </el-table-column>
            <el-table-column
              label="发起时间">
              <template slot-scope="scope">
                <span>{{scope.row.taskCreateTime | setTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="prevAssigneeName"
              label="上一步发起人">
            </el-table-column>
            <el-table-column
              label="到达时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | setTime}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--已读消息-->
          <el-table v-show="currentIndex === 1" :data="tableDoneData" height="250" style="width: 100%">
            <el-table-column prop="" label="序号" type="index">
            </el-table-column>
            <el-table-column
              prop="taskName"
              label="任务名称">
            </el-table-column>
            <el-table-column
              prop="nodeName"
              label="节点名称">
            </el-table-column>
            <el-table-column
              prop="taskCreateBy"
              label="发起人">
            </el-table-column>
            <el-table-column
              label="发起时间">
              <template slot-scope="scope">
                <span>{{scope.row.taskCreateTime | setTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="prevAssigneeName"
              label="上一步发起人">
            </el-table-column>
            <el-table-column
              label="到达时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | setTime}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--待阅消息-->
          <el-table v-show="currentIndex === 2" :data="tableReadData" height="250" style="width: 100%">
            <el-table-column prop="" label="序号" type="index">
            </el-table-column>
            <el-table-column
              prop="taskName"
              label="任务名称">
            </el-table-column>
            <el-table-column
              prop="nodeName"
              label="节点名称">
            </el-table-column>
            <el-table-column
              prop="taskCreateBy"
              label="发起人">
            </el-table-column>
            <el-table-column
              label="发起时间">
              <template slot-scope="scope">
                <span>{{scope.row.taskCreateTime | setTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="prevAssigneeName"
              label="上一步发起人">
            </el-table-column>
            <el-table-column
              label="到达时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | setTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Auth from 'util/auth';
  import {formDay, formTime} from 'util';
  import {showCal} from 'util/nongTime';
  import {getTasks, getUndoTasks, getReadTasks, getCompanyList, getCommunlyList} from 'api/home/home'


  export default {
    name: 'home1',
    data() {
      return {
        activeName: 'first',
        tableData: [],
        tableData1: [],
        currentIndex: 0,
        tabbarListArr: ['待办任务', '待阅任务', '跟踪任务'],
        pageSize: 10,
        pageNo: 1,
        total: 28,
        pageDoneSize: 10,
        pageDoneNo: 1,
        totalDone: 2,
        tableDoneData: [],
        pageReadSize: 10,
        pageReadNo: 1,
        totalRead: 2,
        tableReadData: [],
        companyList: [],
        CommunlyLists: [],
        childMenusList: [],
        childMenusColorList: ['rgb(26, 188, 156)', 'rgb(252, 149, 65)', 'rgb(52, 152, 219)'],
        leftArr: [
          {id: 0, img: 'static/icon/homeIcon/sj_biaozhun.png', title: '标准编码库'},
          {id: 1, img: 'static/icon/homeIcon/sj_hege.png', title: '合格供应商'},
          {id: 2, img: 'static/icon/homeIcon/cy_shigong.png', title: '施工总预算'},
          {id: 3, img: 'static/icon/homeIcon/sj_yuedu.png', title: '月度需求计划'},
          {id: 4, img: 'static/icon/homeIcon/sj_hetong.png', title: '合同统计台账'},
          {id: 5, img: 'static/icon/homeIcon/sj_kucun.png', title: '库存统计'},
          {id: 6, img: 'static/icon/homeIcon/sj_pandian.png', title: '盘点分析'},
          {id: 7, img: 'static/icon/homeIcon/sj_gongying.png', title: '供应商账款'},
          {id: 8, img: 'static/icon/homeIcon/sj_xiangmu.png', title: '预算执行动态'},
          {id: 9, img: 'static/icon/homeIcon/sj_caigou.png', title: '采购价格分析'}
        ],
        roles: '',
        rolseFlag: false,
      }
    },
    created() {
      let rolesList = JSON.parse(Auth.hasUserInfo()).rolesCacheDtos;
      let roleStr = rolesList && rolesList.length ? rolesList.map(v => v.rolesName).join('、') : '';
      if (roleStr.length > 30) {
        this.rolseFlag = true;
        this.roles = roleStr.slice(0, 30) + '<span style="color: #004c9f;">......</span>';
      } else {
        this.roles = roleStr;
        this.rolseFlag = false;
      }
      console.log(this.variable);
      this._getTasks();
      this._getUndoTasks();
      this._getReadTasks();
      this._getCompanyList();
      this._getCommunlyList();
      this.getMenusList();
    },
    methods: {
      getData11: function () {
        var that = this;  //用that去保存vue的实例
        that.$axios.get('/list/index').then(function (res) {
          // that.message = res.data.list
          console.log(res);
        })
      },

      getTabbarIndex(index) {
        this.currentIndex = index;
      },
      //获取待办任务列表
      _getTasks() {
        let data = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getTasks(data).then(res => {
          // console.log(res)
          this.tableData = res.results.result;
          // this.total = res.results.total;
        })
      },

      //获取待阅任务列表
      _getUndoTasks() {
        let data = {
          pageNo: this.pageDoneSize,
          pageSize: this.pageDoneSize,
          taskName: ''
        }
        getUndoTasks(data).then(res => {
          // console.log(res)
          this.tableDoneData = res.results.result;
          this.totalDone = res.results.total;
        })
      },

      //获取跟踪任务列表
      _getReadTasks() {
        let data = {
          pageNo: this.pageReadNo,
          pageSize: this.pageReadSize
        }
        getReadTasks(data).then(res => {
          // console.log(res)
          this.tableReadData = res.results.result;
          this.totalRead = res.results.total;
        })
      },

      //获取公司信息列表
      _getCompanyList() {
        getCompanyList().then(res => {
          this.companyList = res.results;
        })
      },
      //获取router数组的子元素
      getMenusList() {
        let rout = Auth.getObjArr();
        for (let i in rout) {
          let item = rout[i];
          if (item.children && item.children.length) {
            this.childMenusList = this.childMenusList.concat(item.children);
            // for (let j in item.children){
            //   let child = item.children[j];
            //   this.childMenusList.push(child);
            // }
          }
        }
        // console.log(this.childMenusList);
      },
      //查询用户的常用菜单
      _getCommunlyList() {
        getCommunlyList().then(res => {
          console.log(res)
          let CommunlyList = res.results;
          if (CommunlyList && CommunlyList.length >= 6) {
            for (let i in CommunlyList) {
              let itemId = CommunlyList[i];
              let newRoutIndex = this.childMenusList.findIndex(v => v.id === itemId);
              if (newRoutIndex >= 0) {
                this.CommunlyLists.push(this.childMenusList[newRoutIndex]);
              }
            }
            this.CommunlyLists = this.CommunlyLists.splice(0, 6);
            // console.log(this.CommunlyLists)
          } else {
            let len = CommunlyList.length;
            let lens = 6 - len;
            for (let i in CommunlyList) {
              let itemId = CommunlyList[i];
              let newRoutIndex = this.childMenusList.findIndex(v => v.id === itemId);
              if (newRoutIndex >= 0) {
                this.CommunlyLists.push(this.childMenusList[newRoutIndex]);
              }
            }
            let newRouters = this.childMenusList.splice(0, lens);
            this.CommunlyLists = this.CommunlyLists.concat(newRouters);
            // console.log(this.CommunlyLists)
          }
        })
      },
      //常用菜单跳转
      handleRouterMenus(item) {
        this.$router.push('/' + item.path);
      },
      // 跳转到代办详情页面
      handleChangeToDoList(row) {
        console.log(row.nodeCode)
        localStorage.setItem('nodeCode', row.nodeCode);
        this.$router.push(`/backlog/${row.taskId}/${row.sid}/0/${row.formCode}/${row.formStatusCode}/${row.processNodeCode}`);
        let RouteTitleObj = {name: "backlog", title: "待办事项"};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        localStorage.setItem('taskName', row.taskName);
        localStorage.setItem('nodeCode', row.nodeCode);
      },

    },
    mounted() {
      //  this.getData11();
    },
    computed: {
      userInfo() {
        return JSON.parse(Auth.hasUserInfo())
      },
      fortime() {
        return formTime()
      },
      day() {
        return formDay()
      },
      oldTime() {
        return showCal()
      },
      // rolesStr() {
      //   let rolesList = JSON.parse(Auth.hasUserInfo()).rolesCacheDtos;
      //   return rolesList && rolesList.length ? rolesList.map(v => v.rolesName).join('、') : ''
      // },
      // maxRolesStr() {
      //   let rolesList = JSON.parse(Auth.hasUserInfo()).rolesCacheDtos;
      //   return rolesList && rolesList.length ? rolesList.map(v => v.rolesName).join('、').substring(0, 36) : ''
      // }
    },
    filters: {
      setRoleName(val) {
        return val && val.length ? val.map(v => v.rolesName).join('、') : ''
      },
      // setTime(val) {
      //   return val ? format(val) : ''
      // },
      setOldTime(val) {
        return val ? format22(val) : ''
      }
    }

  }
</script>
<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top {
      height: 80px;
      margin-bottom: 10px;
      background-color: #fff;
      padding: 5px 30px;
      .topTitleLeft {
        display: inline-block;
        float: left;
        width: calc(100% - 200px);

        h2 {
          font-size: 24px;
          font-weight: 400;
        }
        p {
          font-size: 16px;
          margin-top: 10px;
          width: 100%;
          overflow: hidden;
        }
        .el-dropdown-link {
          width: 50%;
          &.active {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .topTitleRight {
        display: inline-block;
        float: right;
        padding-top: 8px;
        width: 200px;
        h2 {
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;

        }
      }
    }
    .bottom {
      flex: 1;
      display: flex;
      flex-direction: column;
      .top1 {
        flex: 1;
        display: flex;
        .menus {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #fff;
          margin-left: 5px;
          .title {
            height: 30px;
            border-bottom: 1px #eee solid;
            padding: 0 20px;
            line-height: 30px;
            .titleLeft {
              float: left;
            }
          }
          ul {
            flex: 1;
            width: 100%;
            li {
              width: 33%;
              float: left;
              height: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              img {
                width: 40px;
                height: 40px;
              }
              p {
                margin-top: 10px;
                font-size: 14px;
                color: #666;
              }
            }
          }
          &.dataKanban {
            flex: 1.6;
            .titleRight {
              float: right;
              display: inline-block;
            }
            img {
              float: right;
              margin-top: 7px;
              margin-left: 5px;
            }
            ul {
              li {
                width: 20%;
              }
            }
          }
        }
      }
      .bottom1 {
        flex: 1.2;
        background-color: #fff;
        margin-top: 10px;
        .page {
          position: absolute;
          right: 0px;
          top: 0px;
        }
        .switchTabbar {
          height: 30px;
          li {
            width: 100px;
            text-align: center;
            line-height: 30px;
            color: #333;
            float: left;
            position: relative;
            /*border-right: 2px solid #eee;*/
            border-top: 2px #fff solid;
            font-weight: 600;
            font-size: 15px;
            margin-right: 12px;
            &:after {
              content: '';
              display: inline-block;
              width: 3px;
              position: absolute;
              right: -8px;
              height: 32px;
              background: #eee;
            }
            &.active {
              border-top: 2px #3e75ff solid;
            }
            &:last-child {
              border-right: none;
            }
          }
        }
        .showTable {
          width: 100%;
          height: 240px;
          border-bottom: 1px #eee solid;
          position: relative;
          .showTable_fix {
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


