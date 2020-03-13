<template>
  <div class="warehousing">
    <!-- <loading></loading> -->
    <div class="warehousingSearch">
      <el-form :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj" label-width="100px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="6">
            <el-form-item label="流程状态">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.flowStatus"
                         placeholder="请选择流程状态">
                <el-option v-for="(item,index) in flowStatusList" :key="index" :label="item.dataName"
                           :value="item.dataValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-select clearable @change="handleChangeProjectName" size="small" v-model="searchFormObj.projectId"

                         placeholder="请选择项目名称">
                <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库名称">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.wareHouseId"

                         placeholder="请选择仓库名称">
                <el-option v-for="(item,index) in WarehouseList" :key="index" :label="item.warehouseName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:right;padding-top: 5px;">
            <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="warehousingCon">
      <div style="text-align:right;">
        <el-button @click="handleSearchAdd" size="small" type="primary" icon="el-icon-search">添加</el-button>
        <el-button @click="handleSubmissionProcess" size="small" type="danger" plain icon="el-icon-search">提交流程
        </el-button>
        <el-button size="small" @click="handleMoniter" type="danger" plain icon="el-icon-search">流程监控</el-button>
        <el-button size="small" type="warning" plain icon="el-icon-search">打印</el-button>
        <el-button size="small" type="primary" plain icon="el-icon-search">导出</el-button>
      </div>
      <div class="warehousingConTable">
        <el-table
          ref="maintainConTable"
          :data="warehousingList"
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
          <el-table-column prop="supplierName" label="供应商名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="incomingDescription" label="入库描述" show-overflow-tooltip>
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
  import {getProjectsList, getIncomingList, getProjectListHouse,getStartNodeAssigneeIncomingUsers,startProcess} from 'api/warehouseManagement/warehousing'
  import {dataDictionary, freshRouter,processMix} from 'mixins'
  import Page from 'components/Pagination/page'

  export default {
    name: 'warehousing',
    mixins: [dataDictionary, freshRouter,processMix],
    data() {
      return {
        // loading:true,
        labelPosition: 'right',
        searchFormObj: {
          flowStatus: "",
          menuId: 231,
          projectId: "",
          wareHouseId: ""
        },
        pageNo: 1,
        pageSize: 7,
        total: 0,
        selectArr: ['flowStatus'],
        ProjectsList: [],
        warehousingList: [],
        WarehouseList: [],
        sid:"",
        projectId:'',
        processName:'',
        processObj:'',
        processWidth:'',
        processTop:'',
        dialogVisible:false
      }
    },
    created() {
      this._getDicdataList(this.selectArr);
      this._getProjectsList(231);
      this._getIncomingList()

    },
    methods: {
      //获取项目名称
      _getProjectsList(data) {
        getProjectsList(data).then(res => {
          console.log(res)
          this.ProjectsList = res.results.proProjectDtos
        })
      },
      //获取入库单列表
      _getIncomingList() {
        let data = {
          ...this.searchFormObj,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getIncomingList(data).then(res => {
          console.log(res)
          this.warehousingList = res.results.result
        })
      },
      //获得仓库名称
      _getProjectListHouse(id) {
        getProjectListHouse(id).then(res => {
          if (res.status === 0)
            this.WarehouseList = res.results
          this._getIncomingList()
        })
      },
      //切换项目名称
      handleChangeProjectName() {
        this._getProjectListHouse(this.searchFormObj.projectId)
      },
      //查询
      handleSearch() {
        this.$refs.page.resetCurrentPage();
        this._getIncomingList()
      },
      //添加
      handleSearchAdd() {
        this.$router.push('/warehousingSet')
        //  this.changeRouter(-1, 'add', 'straightForwardSet');
      },
      //提交流程
      handleSubmissionProcess() {
        if (this.selectionList.length === 0) {
            this.$message.error('请您先选中想要提交流程的一行数据');
         
          return
        }
        if (this.selectionList[0].flowStatus === '01') {
           this.$message.error("入库单流程在审批中");
          return
        }
        if (this.selectionList[0].flowStatus === '02') {
            this.$message.error({
              message: "入库单在已审批中",
              type: "info"
            });
          return
        }
        this.sid = this.selectionList[0].id;
        this.projectId = this.selectionList[0].projectId;
        getStartNodeAssigneeIncomingUsers(this.sid,this.projectId).then(res=>{
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
      },
      //修改
      handleClickEdit() {
        this.changeRouter(row.id, 'edit', 'warehousingSet');
      },
      //查看
      handleInfo() {
        this.changeRouter(row.id, 'info', 'warehousingSet');
      },
      //删除
      handleClickDelete() {
        //  this.deleteData(row, deleteInandoutList, this._getInandoutList);
      },
      //获取页码
      getPages(val) {
        this.pageNo = val;
        this._getIncomingList();
      },
      //提交流程
      getIsSubmit(val) {
        this.dialogVisible = false;
        startProcess(val).then(res => {
          if (res.status === 0) {
            this.$message.success('流程提交成功');
            this._getIncomingList()
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
  .warehousing {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .warehousingSearch {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    .warehousingCon {
      flex: 1;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      padding: 10px;
      .warehousingConTable {
        margin-top: 10px;
      }
    }
  }
</style>
