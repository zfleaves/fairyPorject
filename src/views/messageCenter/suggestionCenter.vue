<template>
  <div class="suggestionCenter">
    <div class="top">
      <p class="BigTitle">我们在聆听...</p>
      <p class="smallTitle">我们渴望您的建议，让我们不断前行...</p>
      <ul class="detailUL">
        <li>
          <span class="num">{{passCount}}</span>
          <div class="title">
            <span>条建议</span>
            <span>预审通过</span>
          </div>
        </li>
        <li>
          <span class="num">{{acceptedCount}}</span>
          <div class="title">
            <span>条建议</span>
            <span>预审通过</span>
          </div>
        </li>
        <li>
          <span class="num">{{realizedCount}}</span>
          <div class="title">
            <span>条建议</span>
            <span>预审通过</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="center">
      <el-form ref="form" :model="selectForm" label-width="80px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select clearable @change="_getSuggestUserList" v-model="typeName" placeholder="请选择类型">
                <el-option :key="index" v-for="(item,index) in typeList" :label="item.dataName"
                           :value="item.dataName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select clearable @change="_getSuggestUserList" v-model="status" placeholder="请选择状态">
                <el-option :key="index" v-for="(item,index) in statusList" :label="item.dataName"
                           :value="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标题">
              <el-input clearable v-model="title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button style="margin-top: 6px;" @change="_getSuggestUserList()" size="small" type="warning"
                       icon="el-icon-search">查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottom">
      <div>
        <span>我的建议列表</span>
        <el-button @click.native="handleClickEdit" size="small" type="primary" icon="el-icon-plus">提建议</el-button>
      </div>
      <div style="margin-top: 20px;" class="tableXCon">
        <el-table
          :header-cell-style="{ 'background-color':'#fafafa'}"
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="单据编号"
            show-overflow-tooltip
            width="220">
             <template slot-scope="scope">
                <span style="color:#3e75ff" @click="handleList(scope.row)">{{scope.row.code}}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="title"
            show-overflow-tooltip
            label="标题">
          </el-table-column>
          <el-table-column
            prop="createTime"
             show-overflow-tooltip
            label="提交时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | setTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <span>{{setStatus(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="feedback"
            show-overflow-tooltip
            label="反馈意见">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  const Base64 = require("js-base64").Base64;
  import {getSuggestStatusCount, getSuggestUserList} from 'api/messageCenter'

  export default {
    name: 'suggestionCenter',
    data() {
      return {
        selectForm: {},
        tableData: [],
        passCount: 0,
        acceptedCount: 0,
        realizedCount: 0,
        pageNo: 1,
        pageSize: 7,
        typeName: '',
        status: "",
        title: '',
        total: 0,
        typeList: [
          {
            dataValue: '01',
            dataName: '功能优化'
          },
          {
            dataValue: '02',
            dataName: '系统缺陷'
          }
        ],
        statusList: [
          {dataValue: 0, dataName: '预审中'},
          {dataValue: 1, dataName: '预审通过'},
          {dataValue: 2, dataName: '被采纳'},
          {dataValue: 3, dataName: '已实现'},
          {dataValue: 4, dataName: '预审不通过'},
        ],
      }
    },
    created() {
      this._getSuggestStatusCount();
      this._getSuggestUserList()
    },
    methods: {
      //获取建议数量
      _getSuggestStatusCount() {
        getSuggestStatusCount().then(res => {
          let couts = res.results;
          this.passCount = couts.passCount;
          this.acceptedCount = couts.acceptedCount;
          this.realizedCount = couts.realizedCount;
        })
      },
      _getSuggestUserList() {
        let data = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          typeName: this.typeName,
          status: this.status,
          title: this.title
        }
        getSuggestUserList(data).then(res => {
          this.total = res.results.total;
          this.tableData = res.results.result;
        })
      },
      handleClickEdit() {
        let id = Base64.encode(0);
        let flowStatus = Base64.encode(false);
        this.$router.push(`/suggestionCenterEdit/${id}/${flowStatus}`);
        let RouteTitleObj = {name: "suggestionCenterEdit", title: "建议中心添加"};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      },
      setStatus(item){
        let index = this.statusList.findIndex(v=>v.dataValue === item);
        if(index>=0){
          return this.statusList[index].dataName
        }
      },
      //   查看
      handleList(row) {
        let id = Base64.encode(row.id);
        let flowStatus = Base64.encode(true);
        this.$router.push(`/suggestionCenterEdit/${id}/${flowStatus}`);
        let RouteTitleObj = {name: "suggestionCenterEdit", title: "建议中心查看"};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      },

    }
  }
</script>
<style scoped lang="scss">
  .suggestionCenter {
    height: 100%;
    .top {
      margin: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: #fff;
      padding: 10px;
      overflow: hidden;
      text-align: center;
      .BigTitle {
        font-size: 25px;
        line-height: 60px;
      }
      .smallTitle {
        font-size: 18px;
      }
      .detailUL {
        width: 50%;
        display: flex;
        margin: 10px auto;
        li {
          flex: 1;
          display: flex;
          flex-direction: row;
          border-right: 1px #ccc solid;
          justify-content: center;
          align-items: center;
          &:last-of-type{
            border-right: 1px #ffffff solid;
          }
          .num {
            flex: 1;
            font-size: 25px;
            color: #ff9d33;
            font-weight: 600;
          }
          .title {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: baseline;
            span {
              flex: 1;
            }
          }
        }
      }
    }
    .center {
      margin: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: #fff;
      padding: 10px;
      overflow: hidden;
    }
    .bottom {
      margin: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: #fff;
      padding: 10px;
      overflow: hidden;
      height: calc(100% - 290px);
      // .tableXCon{
      //     height: calc(100% - 200px);
      // }
    }
  }
</style>
