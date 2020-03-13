<template>
  <div class="InvoiceRegistration">
    <el-form  label-width="100px" :label-position="labelPosition"  ref="searchForm" :model="searchForm">
        <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="流程状态">
            <el-select clearable @change="handleSearch" size="small" v-model="searchForm.flowStatus" placeholder="请选择流程状态">
              <el-option v-for="(item,index) in DicdataStatusArr" :key="index" :label="item.dataName"
                        :value="item.dataValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目名称">
            <el-select clearable @change="handleSearch" size="small" v-model="searchForm.projectId" placeholder="请选择项目名称">
              <el-option v-for="(item,index) in ProjectSelectArr" :key="index" :label="item.proName"
                        :value="item.proCode"></el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="开票日期">
            <el-date-picker 
              size="small"
              clearable @change="handleSearch"
              v-model="searchForm.invoiceTimeStart"
              type="date"
              placeholder="选择开票日期"
              value-format="timestamp"
              style="width:40%"
              >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker 
              size="small"
              clearable @change="handleSearch"
              v-model="searchForm.invoiceTimeEnd"
              type="date"
              placeholder="选择开票日期"
              value-format="timestamp"
              style="width:40%"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="line-height:43px;" :span="2">
          <el-button size="small" @click="handleSearch" plain>查询</el-button>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
            <el-button size="small" @click="handleAdd" type="primary" icon="el-icon-search">添加</el-button>
            <el-button size="small" type="primary" icon="el-icon-search">提交流程</el-button>
            <el-button size="small" type="primary" icon="el-icon-search">流程监控</el-button>
            <el-button size="small" type="primary" icon="el-icon-search">导出Excel</el-button>
      </el-row>
      <div class="InvoiceRegistrationTable">
        <el-table
            ref="InvoiceRegistrationTable"
            :data="InvoiceRegistrationTableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="55">
            </el-table-column>
            <el-table-column
              prop="flowStatus"
              label="单据状态"
              >
                <template slot-scope="scope">{{ scope.row.flowStatus | setFlowStatus}}</template>
            </el-table-column>
            <el-table-column
              label="单据编号"
              width="160"
              show-overflow-tooltip>
               <template  slot-scope="scope">
                 <span style="color: rgb(50, 150, 250);">{{ scope.row.invoiceCode}}</span>
               </template>

            </el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称"
              
              >
            </el-table-column>
            <el-table-column
            
              prop="invoiceNumber"
              label="发票号码"
              
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="invoiceTypeName"
              label="发票类型"
              
             >
            </el-table-column>
            <el-table-column
              prop="invoiceSerialName"
              label="发票联次"
            
             >
            </el-table-column>
            <el-table-column
              label="发票金额(含税)"
              >
                <template slot-scope="scope">{{ scope.row.invoiceAmount | setMoney}}</template>
              
            </el-table-column>
            <el-table-column
              prop="invoiceContent"
              label="开票内容"
             
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="开票日期"
             >
              <template slot-scope="scope">{{ scope.row.createTime | setYear}}</template>
             
            </el-table-column>
            <el-table-column
              prop="receiver"
              label="签收人"
            
              >
            </el-table-column>
            <el-table-column
              prop="a"
              label="操作"
             
              show-overflow-tooltip>
              <template  slot-scope="scope">{{ scope.row.date }}
                <span style="margin-right:20px;color: rgb(50, 150, 250);">修改</span>
                <span style="color: rgb(50, 150, 250);">删除</span>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-form>
  </div>
</template>
<script>
  import {
    getDicDicdataStatus,
    getProjectSelect,
    createRecInvoice,
    deleteRecInvoice,
    exportexcelRecInvoice,
    getRecInvoiceInfo,
    getRecInvoiceList,
    updateRecInvoice,
    approveWorkflowRecInvoice,
    getNextNodeUsersRecInvoice,
    startWorkflowRecInvoice,
    getStartNodeUsersRecInvoice
  } from 'api/receivable/InvoiceRegistration/InvoiceRegistration';


  export default {
    name: 'InvoiceRegistration',
    data() {
      return {
        dicId: 14,
        companyId: 1,
        flg: 0,
        DicdataStatusArr: [],
        ProjectSelectArr: [],
        timeArr: [],
        searchForm: {
          flowStatus: '',
          invoiceTimeEnd:'',
          invoiceTimeStart:'',
          projectId: '',
        },
        pageNo: 1,
        pageSize: 8,
        labelPosition: 'right',
        InvoiceRegistrationTableData:[]
      }
    },
    created() {
      this._getDicDicdataStatus();
      this._getProjectSelect();
      this._getRecInvoiceList()
    },
    methods: {
      //获取流程状态
      _getDicDicdataStatus() {
        getDicDicdataStatus(this.dicId, this.companyId, this.flg).then(res => {
          console.log(res)
          this.DicdataStatusArr = res.results;
        })
      },
      //获取项目名称
      _getProjectSelect() {
        getProjectSelect().then(res => {
          console.log(res)
          this.ProjectSelectArr = res.results;
        })
      },
      //分页条件查询开票信息
      _getRecInvoiceList() {
        let data = {
          ...this.searchForm
        }
        getRecInvoiceList(data).then(res => {
          console.log(res.results)
          this.InvoiceRegistrationTableData = res.results.result
        })
      },
      //查询
      handleSearch() {
        this._getRecInvoiceList();
        console.log(this.timeArr)
      },
      handleSelectionChange(){

      },
      //添加
      handleAdd(){
       this.$router.push('/InvoiceRegistrationEdit')
     }
      

    },
    filters:{
      setFlowStatus(val){
        if(val === '0'){
          return '未审批'
        }else if(val === '02'){
          return '已审批'
        }
      },
     
    }
  }
</script>
<style lang="scss" scoped>
  .InvoiceRegistration {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    padding: 20px;
    .el-select{
      width: 100%;
    }
    .el-form-item{
      margin-bottom: 10px;
    }
    .InvoiceRegistrationTable{
      margin-top: 10px;
    }
  }
</style>


