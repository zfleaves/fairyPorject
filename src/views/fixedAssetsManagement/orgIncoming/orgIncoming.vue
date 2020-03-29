
<template>
  <div class="orgIncoming">
    <el-form class="searchForm" ref="searchFrom" :model="searchFrom" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="流程状态">
            <el-select
              @change="changeSearch"
              v-model="searchFrom.flowStatus"
              placeholder="请选择流程状态"
            >
              <el-option
                v-for="(item,index) in flowStatusList"
                :key="index"
                :label="item.dataName"
                :value="item.dataValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属公司">
            <el-select @change="changeManagerOrgs" v-model="searchFrom.orgId" placeholder="请选择所属公司">
              <el-option
                v-for="item in managerOrgs"
                :key="item.id"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司仓库">
            <el-select
              @change="changeSearch"
              v-model="searchFrom.orgWarehouseId"
              placeholder="请选择公司仓库"
            >
              <el-option
                v-for="item in warehouseListAll"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="text-align:right;" :span="6">
          <el-button @click="changeSearch" type="warning" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="maintainCon">
      <button-component2
        @handleAddTo="handleAddTo"
        @handleSubmissionProcess="handleSubmissionProcess"
        @handleProcessMonitoring="handleProcessMonitoring"
        @handlePrint="handlePrint"
        @handleExport="handleExport"
      ></button-component2>
      <el-table
        id="maintainConTable"
        :data="incomingList"
        border
        class="maintainConTable"
        ref="maintainConTable"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="flowStatus" label="流程状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.flowStatus | setFlowStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="docNo" label="单据编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#3e75ff" @click="handClickInfo(scope.row)">{{scope.row.docNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orgManagerName" label="公司经理" width="100"></el-table-column>
        <el-table-column prop="orgWarehouseName" label="公司仓库名称" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="incomingDescription" label="入库描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createByName" label="登记人" width="80"></el-table-column>
        <el-table-column prop="createTime" label="登记日期" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.createTime | setYear}}</span>
            </template>
            
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              
              @click="handClickEdit(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.flowStatus!=='0'"
            >修改</el-button>
            <el-button
              :disabled="scope.row.flowStatus!=='0'"
              @click="handClickDelet(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="page" :total="total" :pageSize="pageSize"
        @pages="handleCurrentChange"
      ></pagination>
    </div>
     <el-dialog center title="固定资产入库审批流程提交" :visible.sync="dialogProcessWindowVisible">
            <process-window @isCancle="isCancle" @isSubmit="isSubmit"></process-window>
        </el-dialog>
        <el-dialog center title="固定资产入库审批流程提交" :visible.sync="dialogProcessWindowdetailVisible">
            <process-window-detail :sid="sid" :projectId="projectId" :processObj="submitinf" @isCancle="isCancle" @isSubmit="isSubmit"></process-window-detail>
        </el-dialog>
  </div>
</template>

<script>
import {
  getManagerOrgs,
  getIncomingList,
  getWarehouseListAll,
  getStartNodeAssigneeUsers,
  startIncomingWorkflow
} from "api/fixedAssetsManagement";
import ButtonComponent2 from "components/buttonComponent/buttonComponent2";
import Pagination from "components/Pagination/page"
 import ProcessWindow from 'components/processWindow/processWindow'
    import processWindowDetail from 'components/processWindow/processWindow_detail'
import { dataDictionary, freshRouter } from "mixins";
import { exportExcelMethod } from '@/exportExcel.js';
export default {
  name: "orgIncoming",
  mixins: [dataDictionary, freshRouter],
  components: {
    ButtonComponent2,Pagination,ProcessWindow,processWindowDetail
  },
  data() {
    return {
      managerOrgs: [],
      selectArr: ["flowStatus"],
      searchFrom: {
        flowStatus: "",
        orgId: "",
        orgWarehouseId: ""
      },
      pageNo: 1,
      pageSize: 8,
      total: 0,
      incomingList: [],
      warehouseListAll: [],
      sid:'',
      projectId:'',
      submitinf:{},
      dialogProcessWindowVisible:false,
      dialogProcessWindowdetailVisible:false

    };
  },
  created() {
    this._getDicdataList(this.selectArr);
    this._getIncomingList();
  },
  methods: {
    //获取所属公司
    _getManagerOrgs() {
      getManagerOrgs().then(res => {
        this.managerOrgs = res.results;
      });
    },
    //获取资产入库表格数据
    _getIncomingList() {
      let data = {
        ...this.searchFrom
      };
      getIncomingList(data).then(res => {
        if (res.status === 0) {
          this.incomingList = res.results.result;
          this.total = res.total;
        }
      });
    },
    //获取公司仓库
    changeManagerOrgs() {
      this.$refs.page.resetCurrentPage()
      getWarehouseListAll(this.searchFrom.orgId).then(res => {
        this.warehouseListAll = res.results;
      });
    },
    //切换流程 切换公司仓库 查询
    changeSearch(){
        this.$refs.page.resetCurrentPage()
    },
    //切换页码
    handleCurrentChange(val){
        this.pageNo = val;
        this._getIncomingList()
    },
    //添加
    handleAddTo() {
        if(!this.selectionList.length){

        }
         this.changeRouter(-1, 'add', 'orgIncomingSet');
    },
    //查看
    handClickInfo(row){
        this.changeRouter(row.id, 'info', 'orgIncomingSet');
    },
    // 修改
    handClickEdit(row){
       if (!this.judgeIsOneself(row)) {
                    this.editErrorTips('修改');
                    return
                }
        this.changeRouter(row.id, 'edit', 'orgIncomingSet');
    },
    //删除
    handClickDelet(row){
        this.deleteData(row, deleteSupplierExm, this._getSupplierExmList);
    },
    //提交流程
    handleSubmissionProcess() {
      // console.log(row)
                if(!this.selectionList.length){
                    this.$message({
                        message: '请您先选中想要提交流程的一行数据',
                        type: 'warning'
                    });
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
                if (!this.judgeIsOneself(this.selectionList[0])) {
                    this.editErrorTips('流程提交');
                    return
                }
                this.sid= this.selectionList[0].id
                 this.projectId= this.selectionList[0].projectId
                getStartNodeAssigneeUsers(this.sid).then(res=>{
                    if(res.status === 0){
                        this.submitinf = res.results
                        if(!res.results.workflowNextNodes){
                            this.dialogProcessWindowVisible = true
                        }else{
                            this.dialogProcessWindowdetailVisible = true
                            
                        }
                    }
                })
    },
    //暂不提交
            isCancle(){
                if(this.dialogProcessWindowVisible){
                     this.dialogProcessWindowVisible = false
                }else{
                     this.dialogProcessWindowdetailVisible = false
                }
               
            },
            //确认提交
            isSubmit(val){
                let data = {}
                    if(this.dialogProcessWindowVisible){
                        data = {
                        ...this.submitinf  
                        }
                         this.dialogProcessWindowVisible = false
                    }else{
                        data = val
                        this.dialogProcessWindowdetailVisible = false
                    }

                startIncomingWorkflow(data).then(res=>{
                        if(res.status === 0){
                           this.$message({
                              message: '流程提交成功',
                              type: 'success'
                          });
                        
                            this._getIncomingList();
                        }
                    })  
            },
    //流程监控
    handleProcessMonitoring() {},
    //打印
    handlePrint() {},
    //导出
    handleExport() {
      exportExcelMethod('maintainConTable', "固定资产入库单明细", 'sheet');
    }
  }
};
</script>
<style scoped lang="scss">
.orgIncoming {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  .searchForm {
    width: 100%;
    padding: 20px;
    margin-bottom: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .maintainCon {
    width: 100%;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .maintainConTable{
        margin-top: 20px;
    }
  }
}
</style>