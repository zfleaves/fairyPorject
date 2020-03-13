<template>
  <div class="companyDesign">
    <div class="companyDesignCon">
      <el-row>
        <el-col :span="8" style="padding-left:20px">
          <el-form :label-position="labelPosition" ref="companyDesignForm" :model="companyDesignForm"
                   label-width="80px">
            <el-form-item label="功能名称">
              <el-input clearable size="small" v-model="companyDesignForm.processName" placeholder="请输入功能名称"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="padding-left:20px;line-height: 40px;" :span="4">
          <el-button size="small" @click="searchProcessName" plain icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <div class="WorkflowProcessesTable">
        <el-table class="tableInner" border
                  :data="WorkflowProcessesList"
                  style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="processName"
            label="功能名称"
          >
          </el-table-column>
          <el-table-column
            prop="processCode"
            label="功能编号">
          </el-table-column>
          <el-table-column
            prop="formCode"
            label="唯一标识码">
          </el-table-column>
          <el-table-column
            width="200"
            label="创建时间">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.createTime | setTimes}}</span> -->
              <span>{{scope.row.createTime | setTime}}</span>

            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作">
            <template slot-scope="scope">
              <span style="color:#32a3fb;font-size:14px;margin-right:20px;"
                    @click="editingProcess(scope.row)">编辑流程</span>
              <span style="color:#32a3fb;font-size:14px;" @click="copyProcess(scope.row)">复制流程</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: right;margin-top:20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="Number(total)"
          background
          layout="prev, pager, next,jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {getWorkflowProcessesList} from 'api/processDefinition/companyDesign'
  import Filters from 'filters'

  export default {
    name: 'companyDesign',
    data() {
      return {
        labelPosition: 'right',
        companyDesignForm: {
          processName: ''
        },
        currentPage: 1, //初始页
        pageSize: 11,    //    每页的数据
        WorkflowProcessesList: [],
        total: ''
      }
    },
    created() {
      this._getWorkflowProcessesList()
    },
    methods: {
      //分页查询企业流程列表
      _getWorkflowProcessesList() {
        let data = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          processName: this.companyDesignForm.processName
        }
        getWorkflowProcessesList(data).then(res => {
          console.log(res)
          this.WorkflowProcessesList = res.results.result;
          this.total = res.results.total
        })
      },
      //每页下拉显示数据
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)
        this._getWorkflowProcessesList()
        //   this._getProjectList()
      },
      //点击第几页
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
        this._getWorkflowProcessesList()
      },
      //查询
      searchProcessName() {
        this.currentPage = 1;
        this._getWorkflowProcessesList()
      },
      //点击编辑流程
      editingProcess(row){
        let formCode = Base64.encode(row.formCode);
        let processCode = Base64.encode(row.processCode);
        let processName = Base64.encode(row.processName);
        processName = Base64.encode(processName);
        this.$router.push(`/processCompanyDesign/${formCode}/${processCode}/${processName}`);
      }
    },
    // filters:{
    //     setTimes(val){
    //         return val ? Filters.setTime(val) : ''
    //     }
    // }
  }
</script>
<style scoped lang="scss">
  .companyDesign {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    .companyDesignCon {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: 1px #ebeef5 solid;
      .WorkflowProcessesTable {
        margin-top: 10px;
        width: 100%;
        height: 100%;
        .tableInner {
          min-height: 500px;
          // border: 1px #ebeef5 solid;
        }

      }

    }

  }
</style>


