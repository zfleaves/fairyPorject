<template>
  <div class="assessment">
    <div class="assessmentSearch" :class="this.btnFlag ? 'active' : ''">
      <el-form :model="searchForm" :rules="rules" ref="searchForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="供应商名称" prop="supplierFullName">
              <el-select clearable @change="handlechangeSupplier" v-model="searchForm.supplierId"
                         placeholder="请选择供应商名称">
                <el-option v-for="(item,index) in SupplierListAll" :key="index" :label="item.supplierFullName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程状态" prop="flowStatus">
              <el-select clearable @change="handleSearch" v-model="searchForm.flowStatus" placeholder="请选择流程状态">
                <el-option v-for="(item,index) in flowStatusList" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评价状态" prop="appraiseStatus">
              <el-select clearable @change="handleSearch" v-model="searchForm.appraiseStatus" placeholder="请选择评价状态">
                <el-option label="合格" value="01">
                </el-option>
                <el-option label="不合格" value="02">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:right;" :span="6">
            <el-button size="small" @click="handleSearch" type="warning" icon="el-icon-search">查询</el-button>
            <el-button size="small" type="primary" @click="searchBtnFun" icon="el-icon-search" plain>{{searchBtn}}
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="btnFlag" :gutter="20">
          <el-col :span="6">
            <el-form-item label="供应商等级" prop="level">
              <el-select clearable @change="handleSearch" v-model="searchForm.level" placeholder="请选择供应商等级">
                <el-option v-for="(item,index) in levelList" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商类型" prop="property">
              <el-select clearable @change="handleSearch" v-model="searchForm.property" placeholder="请选择供应商类型">
                <el-option v-for="(item,index) in propertyList" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评价等级" prop="appraiseLevels">
              <el-select clearable @change="handleSearch" v-model="searchForm.appraiseLevels" placeholder="请选择评价等级">
                <el-option v-for="(item,index) in appraiseLevelsList" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="btnFlag" :gutter="20">
          <el-col :span="12">
            <el-form-item label="考核日期" prop="createTime">
              <el-date-picker
                clearable
                v-model="searchForm.createTimeStart"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                style="width: 45%;float:left;"
                placeholder="请选择考核日期">
              </el-date-picker>
              <span style="width: 10%;text-align: center;;float:left;line-height: 32px;">-</span>
              <el-date-picker
                clearable
                v-model="searchForm.createTimeEnd"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                style="width: 45%;float:left;"
                placeholder="请选择考核日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="assessmentCon">
      <buttonComponent2 @handleAddTo="handleAddTo" @handleSubmissionProcess="handleSubmissionProcess"
                        @handleProcessMonitoring="handleMoniter" @handlePrint="handleImprotExcel"></buttonComponent2>
      <div class="assessmentConTable">
        <el-table
          ref="maintainConTable"
          @selection-change="handleSelectionChange"
          :data="tableData"
          style="width: 100%">
          <el-table-column
          fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="流程状态">
            <template slot-scope="scope">
              <span>{{scope.row.flowStatus | setFlowStatus}}</span>
            </template>

          </el-table-column>
          <el-table-column

            label="评价状态">
            <template slot-scope="scope">
              <span>{{judgeDataList(scope.row.appraiseStatus,'appraiseStatus')}}</span>
            </template>

          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="供应商名称"
          >
            <template slot-scope="scope">
              <span style="color:#3e75ff" @click="handClickInfo(scope.row)">{{scope.row.supplierFullName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip

            label="供应商类型">
            <template slot-scope="scope">
              <span>{{judgeDataList(scope.row.property,'property')}}</span>
            </template>
          </el-table-column>
          <el-table-column

            label="供应商等级"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{judgeDataList(scope.row.level,'level')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="评价等级">
            <template slot-scope="scope">
              <span>{{judgeDataList(scope.row.appraiseLevels,'appraiseLevels')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="examinationName"
            label="考核描述"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="totalSocre"
            label="考核评分">
          </el-table-column>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            label="创建日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | setTime}}</span>
            </template>
          </el-table-column>
           <el-table-column
           fixed="right"
            label="操作">
            <template slot-scope="scope">
              <span  :disabled="scope.row.flowStatus!=='0'"  style="color:#3e75ff;margin-right:10px;" @click="handClickEdit(scope.row)">修改</span><span style="color:red;" :disabled="scope.row.flowStatus!=='0'" @click="handClickDelet(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageSize="pageSize" :total="total" @sentPages="sentPages"></Pagination>
      
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
  import ButtonComponent2 from 'components/buttonComponent/buttonComponent2'
  import Pagination from '../../components/Pagination/Pagination'
  import {
    getSupplierExmList,
    getDicDicdata,
    getSupplierListAll,
    getWorkflowStartAssigneeUsers,
    startSupplierExmWorkflow,
    deleteSupplierExm
  } from 'api/supplierManagement/assessment'
  import {dataDictionary, freshRouter, processMix} from 'mixins'

  export default {
    name: 'assessment',
    mixins: [dataDictionary, freshRouter, processMix],
    components: {
      ButtonComponent2,Pagination
    },
    data() {
      return {
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
        },
        tableData: [],
        total: 0,
        pageNo: 1,
        pageSize: 7,
        searchBtn: '高级搜索',
        btnFlag: false,
        searchForm: {
          appraiseLevels: "",
          appraiseStatus: "",
          contactName: "",
          createTimeEnd: "",
          createTimeStart: "",
          examinationName: "",
          flowStatus: "",
          level: "",
          property: "",
          supplierFullName: "",
          supplierId: "",
        },
        selectArr: ['flowStatus', 'property', 'level', 'appraiseStatus', 'appraiseLevels'],
        SupplierListAll: [],
        dialogVisible: false,
        dialogVisible_detail: false,
        sid: '',
        projectId: ''
      }
    },
    created() {
      this._getSupplierListAll()
      this._getDicdataList(this.selectArr);
    },
    mounted() {
      this._getSupplierExmList();
    },
    methods: {
      //供应商考核条件分页查询
      _getSupplierExmList() {
        let data = {
          ...this.searchForm,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getSupplierExmList(data).then(res => {
          this.tableData = res.results.result;
          this.total = res.results.total;
        })
      },
      //高级搜索 or 普通搜索
      searchBtnFun() {
        this.btnFlag = !this.btnFlag;
        if (this.btnFlag) {
          this.searchBtn = '普通搜索';
        } else {
          this.searchBtn = '高级搜索';
        }

      },
      //获取供应商名称
      _getSupplierListAll() {
        getSupplierListAll().then(res => {
          this.SupplierListAll = res.results;

        })
      },
      //点击查询
      handleSearch() {
        this._getSupplierExmList()
      },
      handlechangeSupplier() {
        let index = this.SupplierListAll.findIndex(v => v.id === this.searchForm.supplierId);
        if (index >= 0) {
          this.searchForm.supplierFullName = this.Supplierlist[index].supplierFullName;
        } else {
          this.searchForm.supplierFullName = '';
        }
        this.handleSearch();
      },
      //添加
      handleAddTo() {
        // this.$router.push('/assessmentSet');
        this.changeRouter(-1, 'add', 'assessmentSet');
      },
      //查看
      handClickInfo(row){
         this.changeRouter(row.id, 'info', 'assessmentSet');
      },
      // 修改
      handClickEdit(row){
         this.changeRouter(row.id, 'edit', 'assessmentSet');
      },
      //删除
      handClickDelet(row){
         this.deleteData(row, deleteSupplierExm, this._getSupplierExmList);
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
        getWorkflowStartAssigneeUsers(this.sid, this.projectId).then(res => {
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
      //提交流程
      getIsSubmit(val) {
        console.log(val)
        this.dialogVisible = false;
        startSupplierExmWorkflow(val).then(res => {
          if (res.status === 0) {
            this.$message.success('流程提交成功');
            this._getSupplierExmList();
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      },
      handleImprotExcel() {
        if (this.selectionList.length === 0) {
          Message({
            message: '请您先选中想要进行打印的一行数据。',
            type: "info"
          });
          return
        }
        ;
        let row = this.selectionList[0];
        console.log(row);
        let printModelCode = Base64.encode('supplierExamination');
        let taskId = Base64.encode(row.taskId);  // 打印
        let id = Base64.encode(row.id);
        this.$router.push(`/printDesign/${printModelCode}/${taskId}/${id}`)
        // if (this.selectionChangeList.length === 0) return;
        // let id = this.selectionChangeList.map(item => item.budId).join(",");
        // this.printTitle = this.selectionChangeList[0];
        // await budgetInfo(id).then(res => {
        //   getProjectUsersList(res.results.projectId).then(res => {
        //     res.results.forEach(item => {
        //       if (item.rolesName === '供应商收录及评审负责人') {
        //         this.printTitle.personInCharge = item.userName
        //       }
        //       if (item.rolesName === '供应商收录及评审领导') {
        //         this.printTitle.porjectLeader = item.userName
        //       }
        //     })
        //   })
        // })
        // GoodsBudgetList(id).then(res => {
        //   this.printTableData = res.results
        //   this.isPrint = true
        // })
      },
      sentPages(val){
        this.pageNo = val
        this._getSupplierExmList();
      }
    }
  }
</script>
<style scoped lang="scss">
  .assessment {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .assessmentSearch {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      margin-bottom: 10px;
      padding-top: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      &.active {
        height: 210px;
      }
    }
    .assessmentCon {
      flex: 1;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      padding: 10px;
      .assessmentConTable {
        margin-top: 10px;
      }
    }
  }
</style>
