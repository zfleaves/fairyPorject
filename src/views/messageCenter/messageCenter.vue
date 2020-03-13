<template>
  <div class="messageCenter">
    <title-message :titles="title">
      <div class="btn" slot="btn">
        <el-button size="small" type="primary" icon="el-icon-delete" class="urgent" >删除</el-button>
        <el-button size="small" type="primary" icon="el-icon-edit-outline" class="more" >标记已读</el-button>
        <el-button size="small" type="primary" icon="el-icon-edit-outline" class="more" >全部已读</el-button>
        <el-button size="small" type="primary" icon="el-icon-delete" class="urgent">全部删除</el-button>
      </div>
    </title-message>
    <div class="main" ref="newCons">
      <ul class="left">
        <li :class="currentIndex===index?'active':''"
            @click="handleSetNewsType(item,index)"
            v-for="(item,index) in typeNewList" :key="index">
          {{item.title}}
          <span style="float: right;" v-if="item.num>0" class="midFont"
                :style="currentIndex===index ? 'color: #ffffff' : 'color:#3296fa'">{{item.num}}</span>
        </li>
      </ul>
      <div class="right">
        <ul class="right_tabbar">
          <li :class="currentTypeIndex===index?'active':''"
              @click="handleSetNewsModle(item,index)"
              v-for="(item,index) in typeList" :key="index">
            {{item.title}}
            <span>({{(item.num > 99) ? item.num : '99+'}})</span>
            <!-- <span>({{(item.num < 99) ? item.num:'99+'}})</span> -->
          </li>
        </ul>
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          highlight-current-row
          :row-click="handleClickRow"
          @selection-change="selectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="60">
          </el-table-column>
          <el-table-column
            prop="date"
            label="序号"
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="标题内容">
            <template slot-scope="scope">
              <span style="color:#248bfe;" @click="handleInfo(scope.row)">{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            width="120"
            label="类型">
          </el-table-column>
          <el-table-column
            width="200"
            label="提交时间">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime}}</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination @sentPages="sentPages" :total="total" :pageSize="pageSize">
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleMessage from 'components/titleComponent'
  import Pagination from 'components/Pagination/Pagination'
  import {getMessageCount, getMessageList, messageRead} from '../../api/messageCenter'

  export default {
    name: 'messageCenter',
    components: {
      TitleMessage, Pagination
    },
    data() {
      return {
        title: '消息中心',
        pageIndex: 1,
        pageNo: 1,
        pageSize: 14,
        tableData: [],
        total: 0,
        isRead: 0,
        type: null,
        currentIndex: 1,
        currentTypeIndex: 0,
        typeNewList: [
          {title: "全部消息", num: 0, isRead: null, type: 'all'},
          {title: "未读消息", num: 0, isRead: 0, type: 'allUnRead'},
          {title: "已读消息", num: 0, isRead: 1, type: 'allRead'},
        ],
        typeList: [
          {title: "全部类型消息", num: 0, type: 'all', value: null},
          {title: "站内消息", num: 0, type: 'urGent', value: 4},
          {title: "待办事项", num: 0, type: 'done', value: 6},
          {title: "待阅事项", num: 0, type: 'read', value: 5},
          {title: "通知公告", num: 0, type: 'notice', value: 1},
          {title: "更新升级", num: 0, type: 'upGrade', value: 2},
          {title: "其它消息", num: 0, type: 'other', value: 3},
        ],
        typeAllList: [
          {label: '通知公告', value: 1},
          {label: '更新升级', value: 2},
          {label: '其它消息', value: 3},
          {label: '站内消息', value: 4},
          {label: '待办事项', value: 6},
          {label: '待阅事项', value: 5},
        ],
        goodsDeleteList: []
      }
    },
    created() {

    },
    mounted() {
      const that = this;
      let newCons = this.$refs.newCons;
      this.tableMaxHeight = newCons.offsetHeight - 92;
      console.log(newCons.offsetHeight)
      this.height = newCons.offsetHeight;
      this.pageSize = Math.floor(this.tableMaxHeight / 40) - 1;
      console.log(this.pageSize);
      this._getMessageList();
    },
    methods: {
      //查看消息
      handleSetNewsType(item, index) {
        this.pageIndex = 1;
        // this.$refs.Page.setCurrentPage();
        this.currentIndex = index;
        this.isRead = item.isRead;
        this.typeList[0].type = item.type;
        this._getMessageList();
      },
      handleSetNewsModle(item, index) {
        this.pageIndex = 1;
        // this.$refs.Page.setCurrentPage();
        this.currentTypeIndex = index;
        this.type = item.value;
        this._getMessageList();
      },
      // 获取未读消息
      _getMessageList() {
        let obj = {
          type: this.type,
          isRead: this.isRead,
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        }
        getMessageList(obj).then(res => {
          res.results.result.length > 0 && res.results.result.forEach(item => {
            item.typeName = this.typeAllList[this.typeAllList.findIndex(v => v.value === item.type)].label;//通知公告
          })
          this.tableData = res.results.result;
          this.total = res.results.total;
        })
        getMessageCount(this.isRead).then(res => {
          for (let i in res.results) {
            let index = this.typeNewList.findIndex(v => v.type === i);
            if (index >= 0) {
              this.typeNewList[index].num = res.results[i];
            }
            let key = this.typeList.findIndex(v => v.type === i);
            if (key >= 0) {
              this.typeList[key].num = res.results[i];
            }
          }
        })
        this.$store.commit('auth/SET_MessageReminder', true);
      },
      //
      sentPages(val) {
        this.pageIndex = val;
        this._getMessageList();
      },
      selectionChange(val) {
        this.goodsDeleteList = val
      },

      //点击表格的某一行
      handleClickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
        // this.$router.push('/needToBeDealtWith')
      },
      // 查看消息正文
      handleInfo(row) {
        if (row.type === 5) {
          this.$router.push(`toDeRead`)
        } else if (row.type === 6) {
          this.$router.push(`needToBeDealtWith`)
        } else {
          this.$router.push(`messageText/${this.Base64.encode(row.id)}`)
        }
        if (row.isRead === 0) {
          messageRead([row.id]).then(res => {
            this._getMessageList();
          })
        }

      },
    }
  }
</script>
<style scoped lang="scss">
  .messageCenter {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 10px;
    height: calc(100% - 20px);
    overflow: hidden;
    .main {
      margin-top: 20px;
      height: calc(100% - 60px);
      overflow: hidden;
      .left {
        width: 200px;
        background: #e9edf1;
        float: left;
        height: 100%;
        li {
          padding: 0 20px;
          overflow: hidden;
          color: #333;
          line-height: 50px;
          height: 50px;
          &.active {
            background: #248bfe;
            color: #fff;
            .num {
              float: right;
              color: #fff;
            }
          }
          .msg {
            float: left;

          }
          .num {
            float: right;
            color: #248bfe;
          }

        }

      }
      .right {
        float: left;
        width: calc(100% - 210px);
        padding: 0 10px;
        .right_tabbar {
          overflow: hidden;
          margin-bottom: 10px;
          li {
            padding: 5px 10px;
            color: #333;
            margin-right: 20px;
            float: left;
            background: #e9edf1;
            &.active {
              background: #248bfe;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
