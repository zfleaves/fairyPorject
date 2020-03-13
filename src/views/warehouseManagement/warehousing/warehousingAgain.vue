<template>
  <div class="warehousingAgain">
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
        <el-button size="small" type="danger" plain icon="el-icon-search">流程监控</el-button>
        <el-button size="small" type="warning" plain icon="el-icon-search">打印</el-button>
        <el-button size="small" type="primary" plain icon="el-icon-search">导出</el-button>
      </div>
      <div class="warehousingConTable">
        <el-table
          ref="maintainConTable"
          :data="maintainConTable"
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
              <span>{{scope.row.flowStatus | setFlowStatus }}</span>
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
              <el-button @click="handleClickEdit(scope.row)" style="color:#409eff;" type="text" size="small">修改
              </el-button>
              <el-button style="color:red;" @click="handleClickDelete(scope.row)" type="text" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Page @pages="getPages" :pageSize="pageSize" ref="page" :total="total"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getProjectsList,
    getIncomingList,
    getProjectListHouse,
    deleteIncomingList
  } from 'api/warehouseManagement/warehousing'
  import {dataDictionary, freshRouter, closeRoute} from 'mixins'
  import Page from 'components/Pagination/page'

  export default {
    name: 'warehousingAgain',
    mixins: [dataDictionary, freshRouter, closeRoute],
    data() {
      return {
        labelPosition: 'right',
        WarehouseList: [],
        maintainConTable: [],
        ProjectsList: [],
        selectArr: ['flowStatus'],
        searchFormObj: {
          flowStatus: '',
          menuId: '',
          projectId: "",
          wareHouseId: ""
        },
        pageNo: 1,
        pageSize: 7,
        total: 0,
      }
    },
    created() {
      this._getDicdataList(this.selectArr);
      console.log(this.menuId)
      this._getProjectsList(this.menuId);
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
      //切换项目名称
      handleChangeProjectName() {
        this._getProjectListHouse(this.searchFormObj.projectId)
      },
      //获得仓库名称
      _getProjectListHouse(id) {
        getProjectListHouse(id).then(res => {
          if (res.status === 0)
            this.WarehouseList = res.results
          this._getIncomingList()
        })
      },
      //获取入库单列表
      _getIncomingList() {
        let data = {
          ...this.searchFormObj,
          menuId: this.menuId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getIncomingList(data).then(res => {
          console.log(res)
          this.maintainConTable = res.results.result;
          this.total = res.results.total;
          this.maintainConTable.forEach(item => {
            item.checked = false;
          })
        })
      },
      // 搜索
      handleSearch() {
        this.$refs.page.resetCurrentPage();
        this._getIncomingList()
      },
      //添加
      handleSearchAdd() {
        this.changeRouter(-1, 'add', 'warehousingAgainSet');
      },
      //修改
      handleClickEdit(row) {
        if (!this.judgeIsOneself(row)) {
          this.editErrorTips('修改');
          return
        }
        this.changeRouter(row.id, 'edit', 'warehousingAgainSet');
      },
      //查看
      handleInfo(row) {
        this.changeRouter(row.id, 'info', 'warehousingAgainSet');
      },
      //删除
      handleClickDelete(row) {
        this.deleteData(row, deleteIncomingList, this._getIncomingList);
      },
      //提交流程
      handleSubmissionProcess() {
        if (this.selectionList.length === 0) {
          this.$message({
            message: "请您先选中想要提交流程的一行数据",
            type: "info"
          });
          return
        }
        if (this.selectionList[0].flowStatus === '01') {
          Message({
            message: "入库单流程在审批中",
            type: "info"
          });
          return
        }
        if (this.selectionList[0].flowStatus === '02') {
          Message({
            message: "入库单在已审批中",
            type: "info"
          });
          return
        }
        if (!this.judgeIsOneself(this.selectionList[0])){
          this.editErrorTips('提交流程');
          return
        }
      },
      //获取页码
      getPages(val) {
        this.pageNo = val;
        this._getIncomingList();
      },
    },

  }
</script>
<style scoped lang="scss">
  .warehousingAgain {
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
