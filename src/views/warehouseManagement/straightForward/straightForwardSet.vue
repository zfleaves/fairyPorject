<template>
  <div class="straightForwardSet">
    <div class="top">
      <div class="titles">
        <span class="title">直进直出单</span>
        <el-button :disabled="!flowStatus" size="small"
                   @click="submitoProjectFrom('projectForm')"
                   type="primary" icon="el-icon-circle-check">
          保存数据
        </el-button>
        <el-button :disabled="!flowStatus" size="small"
                   style="margin-right:20px;" @click="cancelProjectFrom" type="danger"
                   icon="el-icon-circle-check" plain>取消保存
        </el-button>
      </div>
    </div>
    <div class="search">
      <el-form :rules="rules" :label-position="labelPosition" ref="projectForm" :model="projectForm"
               label-width="120px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectId">
              <el-select
                :disabled="!flowStatus"
                clearable @change="changeProjectName" size="small" v-model="projectForm.projectId"
                placeholder="请选择项目名称">
                <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目经理" prop="pmName">
              <el-input clearable size="small" disabled v-model="pmName"
                        placeholder="请输入项目经理">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用单位" prop="projectUnitId">
              <el-select :disabled="!flowStatus" clearable
                         @change="changeUnit" size="small" v-model="projectForm.projectUnitId"
                         placeholder="请选择领用单位">
                <el-option v-for="(item,index) in UnitList" :key="index" :label="item.unitName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
          <el-col :span="8">
            <el-form-item label="使用部门/工程" prop="projectChildId">
              <el-select :disabled="!flowStatus" @change="changeProjectChildId"
                         clearable size="small" v-model="projectForm.projectChildId"
                         placeholder="请选择使用部门/工程">
                <el-option v-for="(item,index) in ChildrenAllList" :key="index" :label="item.childProjectName"
                           :value="item.id"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用人" prop="inandoutUser">
              <el-input :disabled="!flowStatus" clearable
                        size="small" v-model="projectForm.inandoutUser"

                        placeholder="请输入领用人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select @change="changeWarehouse" :disabled="!flowStatus"
                         clearable size="small"
                         v-model="projectForm.warehouseId"
                         placeholder="请选择仓库">
                <el-option v-for="(item,index) in warehouseList" :key="index" :label="item.warehouseName"
                           :value="item.id">
                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input :disabled="!flowStatus" clearable size="small"
                        v-model="projectForm.supplierName"

                        placeholder="请输入领用人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期" prop="inandoutTime">
              <el-date-picker
                :disabled="!flowStatus"
                size="small"
                v-model="projectForm.inandoutTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择登记日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上传附件">
              <uploadFile
                @attachment="getAttachment"
                :flowStatus="flowStatus"
                :attachment="projectForm.attachmentId">
              </uploadFile>
              <!--<el-button :disabled="!flowStatus" type="text" size="small">点击上传</el-button>-->
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input
                :disabled="!flowStatus" size="small" autosize
                type="textarea" v-model="projectForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="straightForwardSetCon">
      <div class="btn">
        <el-button :disabled="!flowStatus" size="small" style="margin-right:10px;"
                   type="danger" @click="handleBatchDeletion" icon="el-icon-circle-check" plain>批量删除
        </el-button>
        <el-button :disabled="!flowStatus" size="small" @click="selectDetail"
                   type="primary" icon="el-icon-circle-check">选择明细
        </el-button>
      </div>
      <div class="table" style="margin-top: 10px;">
        <el-table
          v-if="tableShow"
          ref="tableData"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{'background-color': '#fafafa'}"
          stripe border
          @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="55">
          </el-table-column>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="物资分类" prop="classifyName" width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="物资名称" prop="materialName" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="materialCode" label="物资编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="standard" label="规格" width="55" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="55">
          </el-table-column>
          <el-table-column prop="quantityIn" width="150" :show-overflow-tooltip="!flowStatus" label="直进直出数量">
            <template slot-scope="scope">
              <el-number
                v-if="flowStatus"
                @change="changeTaxableAmount(scope.row)"
                size="small" placeholder="请输入直进直出数量"
                v-model="scope.row.quantityIn"
                controls-position="right" :min="0">
              </el-number>
              <span v-else>{{scope.row.quantityIn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="averagePrice" width="150" label="单价(暂估)">
            <template slot-scope="scope">
              <el-number
                v-if="flowStatus"
                @change="changeTaxableAmount(scope.row)"
                :precision="2"
                size="small" placeholder="请输入单价(暂估)"
                v-model="scope.row.averagePrice"
                controls-position="right" :min="0">
              </el-number>
              <span v-else>{{scope.row.averagePrice | setMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额(元)(含税)" :show-overflow-tooltip="!flowStatus" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.totalPrice | setMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column label="税率(%)" width="120">
            <template slot-scope="scope">
              <el-select v-if="flowStatus" @change="changeTaxableAmount(scope.row)" clearable
                         size="small" v-model="scope.row.taxRate"
                         placeholder="请选择税率(%)">
                <el-option v-for="(item,index) in taxRateList" :key="index" :label="item.dataName"
                           :value="item.dataName">
                </el-option>
              </el-select>
              <span v-else>{{scope.row.taxRate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ratePrice" label="税额(元)" width="120">
            <template slot-scope="scope">
              <el-number
                v-if="flowStatus"
                :precision="2"
                size="small" placeholder="请输入税额(元)"
                v-model="scope.row.ratePrice"
                controls-position="right" :min="0">
              </el-number>
              <span v-else>{{scope.row.ratePrice | setMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="manufacturer" width="150" label="生产厂家或品牌" :show-overflow-tooltip="!flowStatus">
            <template slot-scope="scope">
              <el-input v-if="flowStatus" clearable size="small" v-model="scope.row.manufacturer"
                        placeholder="请输入生产厂家或品牌">
              </el-input>
              <span v-else>{{scope.row.manufacturer}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" width="150" label="备注" :show-overflow-tooltip="!flowStatus">
            <template slot-scope="scope">
              <el-input v-if="flowStatus" autosize type="textarea" v-model="scope.row.remarks">
              </el-input>
              <span v-else>{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="选择明细物资" center
      :visible.sync="modalFlag"
      top="15vh"
      v-if="modalFlag"
      width="1200px">
      <WarehouseMaterial
        :table-sele="tableSele"
        @tableData="getTableData" @cancelModal="getCancelModal">
      </WarehouseMaterial>
    </el-dialog>
  </div>
</template>

<script>
  import Auth from 'util/auth'
  import {dataDictionary, closeRoute} from 'mixins'
  import MaterialModal from 'components/MaterialModal/MaterialModal'
  import WarehouseMaterial from '../components/warehouseMaterial'
  import {
    getProjectsList,
    getProjectWarehouseList,
    getChildrenAllList,
    getUnitList,
    createInandoutList,
    getInandoutInfo,
    updateInandoutList
  } from 'api/warehouseManagement/straightForward/straightForwardSet'
  import {formatTime} from "util";
  import uploadFile from 'components/upload/uploadFile'

  export default {
    name: 'straightForwardSet1',
    mixins: [dataDictionary, closeRoute],
    components: {
      MaterialModal, WarehouseMaterial, uploadFile
    },
    data() {
      return {
        dataDictionaryArr: ['taxRate'],
        labelPosition: 'right',
        pmName: '',
        id: '',
        type: '',
        flowStatus: '',
        projectForm: {
          attachmentId: "",
          inandoutDescription: "",
          orgId: '',
          projectChildId: '',
          projectUnitId: "",
          projectId: '',
          inandoutUser: '',
          projectUnitName: '',
          projectChildName: '',
          warehouseId: '',
          supplierName: '',
          inandoutTime: '',
          remarks: '',
        },
        rules: {
          projectId: [
            {required: true, message: '请选择项目名称', trigger: 'change'}
          ],
          inandoutUser: [
            {required: true, message: '请输入领用人', trigger: 'blur'}
          ],
          inandoutTime: [
            {required: true, message: '请选择领用时间', trigger: 'change'}
          ],
          warehouseId: [
            {required: true, message: '请选择仓库名称', trigger: 'change'}
          ]
        },
        ProjectsList: [],
        warehouseList: [],
        UnitList: [],
        ChildrenAllList: [],
        tableData: [],
        selectListTables: [],
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        emptyText: '努力加载中...',
        defaultCheckId: '',
        treeData: [],
        modalFlag: false,
        treeChildrenList: [],
        tableShow: true,
        tableSele: [],
        selectTableList:[]
      }
    },
    created() {
      this._getProjectsList();
      this._getDicdataList(this.dataDictionaryArr);
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
      this.type = this.Base64.decode(params.type);
      this.flowStatus = this.type !== 'info';
      console.log(this.type);
      if (this.id >= 0) {
        this._getInandoutInfo();
      }
    },
    // watch: {
    //   tableData: {
    //     deep: true,
    //     handler() {
    //       this.tableSele = JSON.parse(JSON.stringify(this.tableData));
    //     }
    //   }
    // },
    methods: {
      //获取详情
      _getInandoutInfo() {
        getInandoutInfo(this.id).then(res => {
          console.log(res.results);
          res.results.inandoutTime = res.results.inandoutTime ? formatTime(res.results.inandoutTime) : '';
          this.projectForm.remarks = res.results.remarks;
          // this.tableData = res.results.details;
          for (let key in this.projectForm) {
            this.projectForm[key] = res.results[key];
          }
          this.pmName = res.results.pmName;
          this.oldProjectId =  this.projectForm.projectId;
          this.oldWarehouseId = this.projectForm.warehouseId;
          this.getSelectList(this.projectForm.projectId);
          for (let i in res.results.details) {
            let item = res.results.details[i];
            item.edit = true;
            item.taxRate = item.taxRate < 1 ? item.taxRate * 100 : item.taxRate;
          }
          this.tableData = res.results.details;
        })
      },
      //获取项目名称
      _getProjectsList() {
        getProjectsList(this.menuId).then(res => {
          this.ProjectsList = res.results.proProjectDtos
        })
      },
      //切换项目名称
      changeProjectName(val) {
        let flag = this.oldProjectId && this.tableData.length;
        if(!flag){
          this.setProject(val);
          this.oldProjectId = val;
          this.oldWarehouseId = ""
          this.getSelectList(val);
          return
        }
        this.$confirm(`切换项目将会删除明细数据,保存后生效`, '切换项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData = [];
          this.setProject(val);
          this.oldProjectId = val;
          this.oldWarehouseId = "";
          this.getSelectList(val);
        }).catch((e) => {
          this.projectForm.projectId = this.oldProjectId;
        });

      },
      setProject(val) {
        this.warehouseList = [];
        this.UnitList = [];
        this.ChildrenAllList = [];
        this.projectForm.projectChildId = "";
        this.projectForm.projectUnitId = "";
        this.projectForm.projectUnitName = "";
        this.projectForm.projectChildName = "";
        this.projectForm.warehouseId = "";
        //错误写法
        // this.projectForm =  {
        //     projectChildId: '',
        //     projectUnitId: "",
        //     projectUnitName: '',
        //     projectChildName: '',
        //     warehouseId: '',
        // }
        let index = this.ProjectsList.findIndex(v => v.id === val);
        if (index >= 0) {
          this.pmName = this.ProjectsList[index].pmName;
          this.projectForm.orgId = this.ProjectsList[index].orgId;
        }
      },
      getSelectList(id){
        //获取仓库名称
        getProjectWarehouseList(id).then(res => {
          console.log(res.results);
          this.warehouseList = res.results;
        })
        //获取领用单位列表
        getUnitList(id).then(res => {
          this.UnitList = res.results;
        })
        //获取使用部门/工程
        getChildrenAllList(id).then(res => {
          this.ChildrenAllList = res.results;
        })
      },
      //切换领用单位
      changeUnit(val) {
        let index = this.UnitList.findIndex(v => v.id === val);
        if (index >= 0) {
          this.projectForm.projectUnitName = this.UnitList[index].unitName;
        }
      },
      //子工程
      changeProjectChildId(val) {
        let index = this.ChildrenAllList.findIndex(v => v.id === val);
        if (index >= 0) {
          this.projectForm.projectChildName = this.ChildrenAllList[index].childProjectName;
        }
      },

      handleSelectionChange(val) {
         this.selectTableList = val;
      },

      //获取表格数据列表
      getTableData(val) {
        this.tableData = val;
        // this.projectForm.warInAndOutDetailCreateReqs = val;
      },
      //改变含税金额
      changeTaxableAmount(item) {
        console.log(item);
        item.totalPrice = item.quantityIn * item.averagePrice;
        if (isNaN(item.taxRate)) {
          // let str = 'abcxyz123ddd';
          // str = str.substring()  //16
          item.taxRate = Number(item.taxRate.substring(0, item.taxRate.length - 1));
        }
        // item.taxRate.sub
        item.ratePrice = item.totalPrice / (1 + item.taxRate / 100) * item.taxRate / 100;
        console.log(item.taxRate);
      },
      //保存数据
      submitoProjectFrom(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.tableData.length === 0) {
              this.$message({
                message: '请添加明细',
                type: 'error'
              })
              return
            }
            this.submitData(this.type);
            // if (this.type === 'add') {
            //   let warInAndOutDetailCreateReqs = [];
            //   for (let i in this.tableData) {
            //     let item = this.tableData[i];
            //     warInAndOutDetailCreateReqs.push(this.getQuickWarehouseDetail(item, 'quantityIn'))
            //   }
            //   // fotr
            //   let data = {
            //     ...this.projectForm,
            //     warInAndOutDetailCreateReqs
            //   }
            //   createInandoutList(data).then(res => {
            //     console.log(res);
            //     if (res.status === 0) {
            //       this.setRoute();
            //     }
            //   })
            // } else {
            //
            // }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitData(type) {
        let warInAndOutDetailCreateReqs = [];
        let setDataFun = type === 'edit' ? updateInandoutList : createInandoutList;
        for (let i in this.tableData) {
          let item = this.tableData[i];
          let obj = this.getQuickWarehouseDetail(item, 'quantityIn');
          if (type === 'edit') {
            obj.id = item.edit ? item.id : '';
          }
          warInAndOutDetailCreateReqs.push(obj);
        }
        let data = {
          ...this.projectForm,
          warInAndOutDetailCreateReqs
        }
        if (type === 'edit') {
          data.id = this.id;
        }
        setDataFun(data).then(res => {
          console.log(res);
          let typeStr = type === 'edit' ? '修改' : '添加';
          let message = '直进直出单' + typeStr + '成功';
          if (res.status === 0) {
            this.$message({
              message: message,
              type: 'success'
            })
            this.setRoute();
          }
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  .straightForwardSet {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    .top {
      height: 43px;
      padding: 0 10px;
      line-height: 43px;
      .titles {
        border-bottom: 1px #eee solid;
        overflow: hidden;
        padding-left: 20px;
        &::before {
          content: '';
          width: 3px;
          height: 25px;
          background: #3e75ff;
          position: absolute;
          top: 21px;
          left: 30px;
          bottom: 0px;
        }
        .title {
          margin-left: 5px;
        }
        button {
          float: right;
          margin-top: 5px;
        }
      }
    }
    .straightForwardSetCon {
      margin-top: 20px;
      .btn {
        text-align: right;
      }
    }
    .selectListInner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .selectListTable {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .ListTable {
          flex: 1;
          overflow-y: auto;
        }
        .Tablebtn {
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
    .detailListInner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .detailListTable {
        flex: 1;
        .detailListTableHeader {
          display: flex !important;
          .MaterialClassification {
            flex: 3 !important;
          }
          .MaterialCoding {
            flex: 1 !important;
          }
          .MaterialName {
            flex: 1 !important;
          }
          .MaterialUnit {
            flex: 1 !important;
          }
          .Specifications {
            flex: 1 !important;
          }

        }
      }
    }
  }
</style>
