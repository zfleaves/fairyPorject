<template>
  <div class="outbound">
      <div class="outboundSearch" :class="isOpenSearchFlag?'active':''">
        <el-form :label-position="labelPosition" ref="searchForm" :model="searchForm" label-width="100px">
          <el-row style="margin: 15px 0px 0 0;">
            <el-col :span="6">
              <el-form-item label="流程状态">
                <el-select clearable @change="handleSearch" size="small" v-model="searchForm.flowStatus"
                          placeholder="请选择流程状态">
                  <el-option v-for="(item,index) in flowStatusList" :key="index" :label="item.dataName"
                            :value="item.dataValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目名称">
                <el-select clearable @change="handleSearchWarehouseId" size="small" v-model="searchForm.projectId"

                          placeholder="请选择项目名称">
                  <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库名称">
                <el-select  clearable size="small"
                          v-model="searchForm.warehouseId"
                          placeholder="请选择仓库">
                  <el-option v-for="(item,index) in warehouseList" :key="index" :label="item.warehouseName"
                            :value="item.id">
                  </el-option>

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align:right;padding-top: 5px;">
              <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">查询</el-button>
              <el-button @click="handleOpenSearch" size="small" type="warning" icon="el-icon-search">高级搜索</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpenSearchFlag">
            <el-col :span="6">
              <el-form-item label="领用人" prop="outboundUser">
              <el-input  clearable
                        size="small" v-model="searchForm.outboundUser"

                        placeholder="请输入领用人"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="outboundCon">
        <div style="text-align:right;">
          <el-button @click="handleSearchAdd" size="small" type="primary" icon="el-icon-search">添加</el-button>
          <el-button @click="handleSubmissionProcess" size="small" type="danger" plain icon="el-icon-search">提交流程
          </el-button>
          <el-button size="small" type="danger" plain icon="el-icon-search">流程监控</el-button>
          <el-button size="small" type="warning" plain icon="el-icon-search">打印</el-button>
          <el-button size="small" type="primary" plain icon="el-icon-search">导出</el-button>
        </div>
        <div class="outboundConTable">
          <el-table
            ref="maintainConTable"
            :data="outboundList"
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
            <el-table-column prop="projectUnitName" label="领用单位" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="projectChildName" label="使用部门/工程" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="wareHouseName" label="仓库名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="outboundUser" label="领用人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="outboundDescription" label="领用原因" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="出库日期" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.outboundTime | setYear }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" width="150" label="备注" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.remarks}}</span>
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
  </div>
</template>

<script>
  import {dataDictionary,freshRouter} from 'mixins'
  import {getProjectsList,getOutboundList,getProjectWarehouseList,deleteOutboundList} from 'api/warehouseManagement/outbound'
  export default {
    name: 'outbound',
    mixins:[dataDictionary,freshRouter],
    data(){
      return{
        labelPosition:'right',
        DicdataArr:['flowStatus'],
        ProjectsList:[],
        warehouseList:[],
        searchForm:{
          flowStatus:"",
          projectId:"",
          menuId: "",
          outboundUser: "",
          wareHouseId: ""
        },
        isOpenSearchFlag:false,
        pageNo:1,
        pageSize:8,
        total:0,
        outboundList:[]
      }
    },
    created(){
      this._getDicdataList(this.DicdataArr);
      this._getProjectsList();
      this._getOutboundList()
    },
    methods:{
      //获得项目名称
      _getProjectsList(){
        getProjectsList(this.menuId).then(res=>{
          this.ProjectsList = res.results.proProjectDtos
        })
      },
      //获得出库单表格数据
      _getOutboundList(){
          let data = {
            ...this.searchForm,
            menuId : this.menuId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          }
          getOutboundList(data).then(res=>{
              console.log(res);
              this.total = res.results.total;
              this.outboundList = res.results.result;
              this.outboundList.forEach(item => {
                item.checked = false;
              })
          })
      },
      //获得仓库名称
      handleSearchWarehouseId(){
        this.searchForm.wareHouseId = "";
        this.warehouseList = [];
        this.handleSearch();
        if(this.searchForm.projectId){
          getProjectWarehouseList(this.searchForm.projectId).then(res=>{
            this.warehouseList = res.results
          })
        }
      },
      // 查询
      handleSearch(){
        this.$refs.page.resetCurrentPage();
        this._getOutboundList()
      },
      //普通搜索 or 高级搜索
      handleOpenSearch(){
        this.isOpenSearchFlag = !this.isOpenSearchFlag
      },
      //获取页码
      getPages(val) {
        this.pageNo = val;
        this._getOutboundList();
      },
      //添加
      handleSearchAdd(){
        this.changeRouter(-1, 'add', 'outboundSet');
      },
      //修改
      handleClickEdit(row) {
        if (!this.judgeIsOneself(row)) {
          this.editErrorTips('修改');
          return
        }
        this.changeRouter(row.id, 'edit', 'outboundSet');
      },
      //删除
      handleClickDelete(row) {
        this.deleteData(row, deleteOutboundList, this._getOutboundList);
      },
      //提交流程
      handleSubmissionProcess(){
        if (this.selectionList.length === 0) {
          this.$message({
            message: "请您先选中想要提交流程的一行数据",
            type: "info"
          });
          return
        }
        if (this.selectionList[0].flowStatus === '01') {
          Message({
            message: "出库单流程在审批中",
            type: "info"
          });
          return
        }
        if (this.selectionList[0].flowStatus === '02') {
          Message({
            message: "出库单在已审批中",
            type: "info"
          });
          return
        }
        if (!this.judgeIsOneself(this.selectionList[0])){
          this.editErrorTips('提交流程');
          return
        }
      }

    }
  }
</script>
<style scoped lang="scss">
    .outbound {
      width: 100%;
      height: 100%;
      padding: 10px;
      background: #fff;
      display: flex;
      flex-direction: column;
      position: relative;
      .outboundSearch {
        width: 100%;
        height: 75px;
        padding: 0 20px;
        margin-bottom: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        overflow: hidden;
        &.active{
          height: 115px;
        }
      }
      .outboundCon {
        flex: 1;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 10px;
        .outboundConTable {
          margin-top: 10px;
        }
      }

    }
</style>
