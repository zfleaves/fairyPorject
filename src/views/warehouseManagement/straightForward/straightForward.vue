<template>
  <div class="straightForward">
    <div class="straightForwardSearch">
      <el-form :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj" label-width="100px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="6">
            <el-form-item label="流程状态">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.flowStatus"
                         placeholder="请选择流程状态">
                <el-option v-for="(item,index) in StatusList" :key="index" :label="item.dataName"
                           :value="item.dataValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.projectId"

                         placeholder="请选择项目名称">
                <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align:right;padding-top: 5px;">
            <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="straightForwardCon">
      <div style="text-align:right;">
        <el-button @click="handleSearchAdd" size="small" type="primary" icon="el-icon-search">添加</el-button>
        <el-button @click="handleSubmissionProcess" size="small" type="danger" plain icon="el-icon-search">提交流程
        </el-button>
        <el-button size="small" @click="handleMoniter" type="danger" plain icon="el-icon-search">流程监控</el-button>
        <el-button size="small" @click="handlePrint" type="warning" plain icon="el-icon-search">打印</el-button>
        <el-button size="small" type="primary" plain icon="el-icon-search">导出</el-button>
      </div>
      <div class="maintainConTable">
        <el-table
          ref="maintainConTable"
          :data="InandoutList"
          tooltip-effect="dark"
          highlight-current-row
          :header-cell-style="{'background-color': '#fafafa'}"
          stripe border style="width: 100%"
          @row-click="rowClick"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" type="index" width="55">
          </el-table-column>
          <el-table-column label="流程状态">
            <template slot-scope="scope">
              <span>{{scope.row.flowStatus | setStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span @click="handleInfo(scope.row)" style="color: #004c9f;cursor: pointer;">
                {{scope.row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmName" label="项目经理" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="wareHouseName" label="仓库名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="projectUnitName" label="领用单位" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="projectChildName" label="使用部门/工程" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="登记日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.createTime | setYear }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="color:#409eff;" @click="handleClickEdit(scope.row)" type="text" size="small">修改
              </el-button>
              <el-button style="color:red;" @click="handleClickDelete(scope.row)" type="text" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Page @pages="getPages" :pageSize="pageSize" ref="page" :total="total"></Page>
      </div>
    </div>
    <!-- <ProcessWindow @isCancle="isCancle" @isSubmit="isSubmit" :isdialogVisible="dialogVisible"></ProcessWindow> -->
    <!--<ProcessDetail @isCancle_detail="isCancle_detail" @isSubmit_detail="isSubmit_detail"-->
    <!--:isdialogVisible_detail="dialogVisible_detail">-->
    <!--</ProcessDetail>-->
    <el-dialog
      class="modal"
      :title="processTitle"
      :top="processTop"
      :visible.sync="dialogVisible"
      :width="processWidth">
      <component
        :projectId="projectId"
        :sid="sid"
        :process-obj="processObj"
        :is="processName"
        @isCancle="getIsCancle" @isSubmit="getIsSubmit">
      </component>
    </el-dialog>
  </div>
</template>

<script>
  const Base64 = require("js-base64").Base64;
  import Auth from 'util/auth'
  
  import {
    getDicdataStatus,
    getProjectsList,
    getInandoutList,
    getAssigneeUsers,
    getWorkflowStart,
    deleteInandoutList,
    getStartNodeAssigneeUsers,
    getBasicNodes,
    startProcess
  } from 'api/warehouseManagement/straightForward/straightForward'
  import {freshRouter, processMix} from '@/mixins/index'
  // import ProcessWindow from 'components/processWindow/processWindow'
  // import ProcessDetail from 'components/processWindow/processWindow_detail'


  export default {
    name: 'straightForward1',
    mixins: [freshRouter, processMix],
    // components: {
    //   ProcessWindow, ProcessDetail
    // },
    data() {
      return {
        labelPosition: 'right',
        StatusList: [],
        companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
        ProjectsList: [],
        InandoutList: [],
        pageNo: 1,
        pageSize: 8,
        total: 0,
        searchFormObj: {
          flowStatus: '',
          projectIdl: '',
          menuId: 232
        },
        RightModalFlag: false,
        editerId: '',
        dialogVisible: false,
        dialogVisible_detail: false,
        projectId: '',
        sid: ''
      }
    },
    created() {
      this._getDicdataStatus();
      this._getProjectsList();
      this._getInandoutList();
    },
    watch: {
      processObj: {
        handler() {

        },
        immediate: true
      }
    },
    methods: {
      //获取流程状态
      _getDicdataStatus() {
        getDicdataStatus(14, this.companyId, 0).then(res => {
          this.StatusList = res.results
        })
      },
      //获取项目名称
      _getProjectsList() {
        getProjectsList(this.menuId).then(res => {
          this.ProjectsList = res.results.proProjectDtos
        })
      },
      //获取列表数据
      _getInandoutList() {
        let data = {
          ...this.searchFormObj,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getInandoutList(data).then(res => {
          console.log(res);
          this.total = res.results.total;
          this.InandoutList = res.results.result;
          this.InandoutList.forEach(item => {
            item.checked = false;
          })

        })
      },
      //点击查询
      handleSearch() {
        this.$refs.page.resetCurrentPage();
        this._getInandoutList();
      },
      //获取页码
      getPages(val) {
        this.pageNo = val;
        this._getInandoutList();
      },
      //添加
      handleSearchAdd() {
        // let id = this.Base64.encode(-1);
        // let type = this.Base64.encode('add');
        // let RouteTitle = {name: 'straightForwardSet', title: this.$route.meta.title + '添加'};
        // localStorage.setItem('RouteTitle', JSON.stringify(RouteTitle));
        // this.$router.push(`/straightForwardSet/${type}/${id}`);
        this.changeRouter(-1, 'add', 'straightForwardSet');
      },
      //修改
      handleClickEdit(row) {
        // let id = this.Base64.encode(row.id);
        // let type = this.Base64.encode('edit');
        // let RouteTitle = {name: 'straightForwardSet', title: this.$route.meta.title + '修改'};
        // localStorage.setItem('RouteTitle', JSON.stringify(RouteTitle));
        // this.$router.push(`/straightForwardSet/${type}/${id}`);
        this.changeRouter(row.id, 'edit', 'straightForwardSet');
      },
      //查看
      handleInfo(row) {
        // let id = this.Base64.encode(row.id);
        // let type = this.Base64.encode('info');
        // let RouteTitle = {name: 'straightForwardSet', title: this.$route.meta.title + '查看'};
        // localStorage.setItem('RouteTitle', JSON.stringify(RouteTitle));
        // this.$router.push(`/straightForwardSet/${type}/${id}`);
        this.changeRouter(row.id, 'info', 'straightForwardSet');
      },
      //删除
      handleClickDelete(row) {
        this.deleteData(row, deleteInandoutList, this._getInandoutList);
        // this.$confirm('此操作将永久删除直进直出单数据, 是否删除?', '删除', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   deleteInandoutList(row.id).then(res=>{
        //     console.log(res)
        //     if(res.status === 0){
        //       this._getInandoutList();
        //       this.$message({
        //         type:'success',
        //         message:'直进直出单删除成功'
        //       })
        //     }
        //   })
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });
        // });
      },

      //提交流程
      handleSubmissionProcess() {
        if (this.selectionList.length === 0) {
          this.$message.error('请您先选中想要提交流程的一行数据');
          return
        }
        if (this.selectionList[0].flowStatus === '01') {
          this.$message.error("本流程在审批中");
          return
        }
        if (this.selectionList[0].flowStatus === '02') {
          this.$message.error({
            message: "本流程在已审批中",
            type: "info"
          });
          return
        }
        this.sid = this.selectionList[0].id;
        this.projectId = this.selectionList[0].projectId;
        getStartNodeAssigneeUsers(this.sid, this.projectId).then(res => {
          let results = res.results;
          if (results.workflowNextNodes === null) {
            this.processName = 'processWindow';
            this.processObj = '';
            this.processWidth = '30%';
            this.processTop = '25vh';
          } else {
            this.processName = 'processWindow_detail';
            this.processObj = results;
            this.processWidth = '80%';
            this.processTop = '10vh';
          }
          this.processTitle = this.$route.meta.title + '流程提交';
          this.dialogVisible = true;
        })
        // if (this.selectionList.length === 0) {
        //   this.$message({
        //     message: "请您先选中想要提交流程的一行数据",
        //     type: "info"
        //   });
        //   return
        // }
        // if (this.selectionList[0].flowStatus === '01') {
        //   Message({
        //     message: "直进直出单流程在审批中",
        //     type: "info"
        //   });
        //   return
        // }
        // if (this.selectionList[0].flowStatus === '02') {
        //   Message({
        //     message: "直进直出单在已审批中",
        //     type: "info"
        //   });
        //   return
        // }
        // getAssigneeUsers(this.selectionList[0].id, this.selectionList[0].projectId).then(res => {
        //   console.log(res)
        //   if (res.status === 0) {
        //     let data = res.results
        //     data.sendTo = []
        //     getWorkflowStart(data).then(res => {
        //       console.log(res)
        //       if (res.status === 0) {
        //         this._getInandoutList()
        //       }
        //     })
        //   }
        // })
      },
      //提交流程
      getIsSubmit(val) {
        this.dialogVisible = false;
        startProcess(val).then(res => {
          if (res.status === 0) {
            this.$message.success('流程提交成功');
            this._getInandoutList()
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      },
    },
    filters: {
      setStatus(val) {
        let arr = ['未审批', '审批中', '已审批'];
        return val ? arr[Number(val)] : ''
      }
    }
  }
</script>
<style scoped lang="scss">
  .straightForward {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .straightForwardSearch {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    .straightForwardCon {
      flex: 1;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      padding: 10px;
      .maintainConTable {
        margin-top: 10px;
      }
    }
    .modal {
      .el-dialog__header {
        background: #0079e8;
        padding: 10px;
        height: 40px;
        text-align: center;
        color: #fff;
      }
    }
  }
</style>
