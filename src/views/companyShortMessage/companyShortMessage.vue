<template>
  <div class="companyShortMessage">
    <div class="companyShortMessageSearch" :class="moreSearchFlag? 'active' : ''">
      <el-form :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj" label-width="120px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input clearable size="small" v-model="searchFormObj.projectName"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发送内容">
              <el-input clearable size="small" v-model="searchFormObj.context"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入发送内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input clearable size="small" v-model="searchFormObj.oprateName"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入操作人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:right;padding-top: 5px;">
            <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">查询</el-button>
           <el-button @click="handleGeneralSearch" size="small" type="primary" plain icon="el-icon-search">
              {{moreSearchFlag?'普通' : '高级'}}搜索
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="moreSearchFlag">
          <el-col :span="6">
            <el-form-item label="发送状态">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.sendStatus"
                         placeholder="请选择所属字段类别">
                <el-option label="发送成功" value="0"></el-option>
                <el-option label="发送失败" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接收手机号码">
              <el-input clearable size="small" v-model="searchFormObj.recivePhone"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入接收手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接收人">
              <el-input clearable size="small" v-model="searchFormObj.reciveName"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入接收人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="moreSearchFlag">
          <el-col :span="12">
            <el-form-item label="发送日期">
              <el-date-picker
                @change="handleSearch"
                size="small"
                v-model="time"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="companyShortMessageCon">
      <el-row style="padding:0 10px;">
        <el-col :span="22">
          <p>企业可发送短信总条数：<span class="blue">{{smsCount}}</span>条； 当前已发送总条数：<span class="blue">{{sendCount}}</span>条；
            剩余可发送条数：<span class="blue">{{smsCount-sendCount}}</span>条。</p>
        </el-col>
        <el-col :span="2">
          <el-button @click="Export" size="small" type="primary" plain icon="el-icon-search">导出</el-button>
        </el-col>

      </el-row>
      <div class="companyShortMessageTableCon">
        <div>
          <el-table
            :data="sysNotePointList"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="context"
              label="发送内容">
            </el-table-column>
            <el-table-column
              prop="oprateName"
              width="80"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="sendTime"
              width="160"
              label="发送时间">
              <template slot-scope="scope">
                <span>{{scope.row.sendStatus | setTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="发送状态">
              <template slot-scope="scope">
                <span>{{scope.row.sendStatus | setSendStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="recivePhone"
              width="150"
              label="接收手机号码">
            </el-table-column>
            <el-table-column
              prop="reciveName"
              width="120"
              label="接收人">
            </el-table-column>
          </el-table>
          <page @pages="getPages" ref="Page" :total="total" :page-size="pageSize">
          </page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getConnotepointList,
    getCompanySmssAccount
  } from 'api/companyShortMessage/companyShortMessage'
  import Auth from 'util/auth'
  import page from 'components/Pagination/page'

  export default {
    name: "companyShortMessage",
    data() {
      return {
        labelPosition: 'right',
        sysNotePointList: [],
        pageNo: 1,
        pageSize: 8,
        total: 0,
        time: [],
        searchFormObj: {
          companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
          projectName: "",
          context: "",
          oprateName: "",
          sendStatus: "",
          recivePhone: "",
          reciveName: "",
          sendTimeFrom: "",
          sendTimeTo: "",

          templateCode: "",
          triggerBusiness: ""
        },
        moreSearchFlag: false,
        sendCount: '',
        smsCount: ''
      }
    },
    components: {page},
    created() {
      this._getConnotepointList();
      this._getCompanySmssAccount()
    },
    methods: {
      //条件分页查询企业短信发送记录
      _getConnotepointList() {
        if (this.time && this.time.length) {
          this.searchFormObj.sendTimeFrom = this.time[0];
          this.searchFormObj.sendTimeTo = this.time[1];
        } else {
          this.searchFormObj.sendTimeFrom = "";
          this.searchFormObj.sendTimeTo = "";
        }

        let data = {
          ...this.searchFormObj,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }

        getConnotepointList(data).then(res => {
          this.sysNotePointList = res.results.sysNotePoint;
          this.total = res.results.total
        })
      },
      // 获取短信条数
      _getCompanySmssAccount() {
        getCompanySmssAccount(297).then(res => {
          this.smsCount = res.results.smsCount;
          this.sendCount = res.results.sendCount
        })
      },
      //查询
      handleSearch() {
        this.$refs.Page.resetCurrentPage();
        this._getConnotepointList();
      },
      //普通查询
      handleGeneralSearch() {
        this.moreSearchFlag = !this.moreSearchFlag
      },
      //获得点击的页码
      getPages(val) {
        this.pageNo = val;
        this._getConnotepointList();
      },
      // //
      // handleCurrentChange(val) {
      //   console.log(val)
      //   this.pageNo = val;
      //   this.handleSearch();
      // },
      //导出
      Export() {

      }
    },
    filters: {
      setSendStatus(val) {
        let arr = ['发送成功', '发送失败'];
        return val ? arr[val] : ''

      }
    }
  }
</script>
<style lang="scss" scoped>
  .companyShortMessage {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .companyShortMessageSearch {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      &.active {
        height: 110px;
      }
      .el-button {
        // width: 100%;
      }
    }
    .companyShortMessageCon {
      flex: 1;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      padding: 10px;
      .blue {
        color: #3296fa;
      }
      .companyShortMessageTableCon {
        margin-top: 20px;
        .pagination {
          text-align: right;
          margin-top: 20px;
        }
      }

    }
  }
</style>


