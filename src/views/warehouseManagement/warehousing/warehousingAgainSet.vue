<template>
  <div class="warehousingAgainSet">
    <div class="top">
      <div class="titles">
        <span class="title">入库单</span>
        <el-button @click="submitoProjectFrom('projectForm')" :disabled="!flowStatus"
                   size="small" type="primary" icon="el-icon-circle-check">
          保存数据
        </el-button>
        <el-button size="small" :disabled="!flowStatus" @click="cancelProjectFrom" style="margin-right:20px;"
                   type="danger"
                   icon="el-icon-circle-check" plain>取消保存
        </el-button>
      </div>
    </div>
    <div class="search">
      <el-form :label-position="labelPosition" ref="projectForm" :model="projectForm"
               label-width="120px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectId">
              <el-select clearable @change="changeProjectName" size="small" v-model="projectForm.projectId"
                         placeholder="请选择项目名称" :disabled="!flowStatus">
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
            <el-form-item label="仓库" prop="warehouseId">
              <el-select @change="changeWarehouse" :disabled="!flowStatus" clearable size="small"
                         v-model="projectForm.warehouseId"
                         placeholder="请选择仓库">
                <el-option v-for="(item,index) in warehouseList" :key="index" :label="item.warehouseName"
                           :value="item.id">
                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input :disabled="!flowStatus" clearable size="small" v-model="projectForm.supplierName"

                        placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期" prop="incomingTime">
              <el-date-picker
                :disabled="!flowStatus"
                size="small"
                v-model="projectForm.incomingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择登记日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库描述" prop="incomingDescription">
              <el-input clearable size="small" v-model="projectForm.incomingDescription"

                        :disabled="!flowStatus" placeholder="请输入入库描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上传附件">
              <uploadFile
                @attachment="getAttachment"
                :flowStatus="flowStatus"
                :attachment="projectForm.attachmentId">
              </uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input
                size="small" :disabled="!flowStatus" type="textarea"
                v-model="projectForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="straightForwardSetCon">
      <div class="btn">
        <el-button size="small" :disabled="!flowStatus" style="margin-right:10px;"
                   type="danger" @click="handleBatchDeletion"
                   icon="el-icon-circle-check" plain>批量删除
        </el-button>
        <el-button size="small" :disabled="!flowStatus" @click="selectDetail"
                   type="primary" icon="el-icon-circle-check">选择明细
        </el-button>
      </div>
      <div class="table" style="margin-top: 10px;">
        <el-table
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
          <el-table-column prop="quantityIn" :show-overflow-tooltip="!flowStatus" width="100" label="本次入库数量">
            <template slot-scope="scope">
              <el-number
                v-if="flowStatus"
                @change="changeTaxableAmount(scope.row)"
                size="small" placeholder="请输入本次入库数量"
                v-model="scope.row.quantityIn"
                controls-position="right" :min="0">
              </el-number>
              <span v-else>{{scope.row.quantityIn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="averagePrice" width="100" label="单价(暂估)">
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
          <el-table-column :show-overflow-tooltip="!flowStatus" label="金额(元)(含税)" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.totalPrice | setMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column label="税率(%)" width="100">
            <template slot-scope="scope">
              <el-select @change="changeTaxableAmount(scope.row)" v-if="flowStatus" clearable
                         size="small" v-model="scope.row.taxRate"
                         placeholder="请选择税率(%)">
                <el-option v-for="(item,index) in taxRateList" :key="index" :label="item.dataName"
                           :value="item.dataName">
                </el-option>
              </el-select>
              <span v-else>{{scope.row.taxRate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ratePrice" label="税额(元)" width="100">
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
          <el-table-column prop="manufacturer" width="100" label="生产厂家或品牌" :show-overflow-tooltip="!flowStatus">
            <template slot-scope="scope">
              <el-input clearable size="small" v-model="scope.row.manufacturer"
                        v-if="flowStatus" placeholder="请输入生产厂家或品牌">
              </el-input>
              <span v-else>{{scope.row.manufacturer}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="!flowStatus">
            <template slot-scope="scope">
              <el-input v-if="flowStatus" size="small" v-model="scope.row.remarks">
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
  import {dataDictionary, closeRoute} from 'mixins'
  import {
    getProjectsLists,
    getProjectListHouse,
    updateIncomingList,
    createIncomingList,
    getIncomingInfo
  } from 'api/warehouseManagement/warehousing'
  import WarehouseMaterial from '../components/warehouseMaterial'
  import {formatTime} from 'util'
  import uploadFile from 'components/upload/uploadFile'

  export default {
    name: 'warehousingAgainSet1',
    mixins: [dataDictionary, closeRoute],
    components: {
      WarehouseMaterial, uploadFile
    },
    data() {
      return {
        labelPosition: 'right',
        ProjectsList: [],
        warehouseList: [],
        UnitList: [],
        tableSele: [],
        dataDictionaryArr: ['taxRate'],
        pmName: '',
        id: '',
        type: '',
        flowStatus: '',
        modalFlag: false,
        projectForm: {
          attachmentId: '',
          orgId: '',
          projectId: "",
          warehouseId: "",
          supplierName: '',
          incomingTime: '',
          incomingDescription: '',
          remarks: ""
        },
        tableData: [],

      }
    },
    created() {
      this._getProjectsLists();
      this._getDicdataList(this.dataDictionaryArr);
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
      this.type = this.Base64.decode(params.type);
      this.flowStatus = this.type !== 'info';
      console.log(this.type);
      if (this.id >= 0) {
        this._getIncomingInfo();
      }
    },
    methods: {
      //获取项目名称
      _getProjectsLists() {
        getProjectsLists(this.menuId).then(res => {
          this.ProjectsList = res.results.proProjectDtos;
        })
      },
      //切换项目
      changeProjectName(val) {
        let flag = this.oldProjectId && this.tableData.length;
        if (!flag) {
          this.setProjectData(val);
          this.projectForm.warehouseId = '';
          this.oldWarehouseId = '';
          this._getProjectListHouse();
          return;
        }
        this.$confirm(`切换项目将会删除明细数据,保存后生效`, '切换项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData = [];
          this.setProjectData(val);
          this.projectForm.warehouseId = '';
          this.oldWarehouseId = '';
          this._getProjectListHouse();
        }).catch((e) => {
          this.projectForm.projectId = this.oldProjectId;
        });
      },
      // 获取详细信息
      _getIncomingInfo() {
        getIncomingInfo(this.id).then(res => {
          console.log(res.results);
          res.results.incomingTime = res.results.incomingTime ? formatTime(res.results.incomingTime) : '';
          console.log(res.results.incomingTime)
          this.projectForm.remarks = res.results.remarks;
          // this.DetailedTable = res.results.details;
          for (let key in this.projectForm) {
            this.projectForm[key] = res.results[key];
          }
          this._getProjectListHouse();
          this.pmName = res.results.pmName;
          this.oldProjectId = this.projectForm.projectId;
          this.oldWarehouseId = this.projectForm.warehouseId;
          for (let i in res.results.details) {
            let item = res.results.details[i];
            item.edit = true;
            item.taxRate = item.taxRate < 1 ? item.taxRate * 100 : item.taxRate;
          }
          this.tableData = res.results.details;
          // for (let i = 0; i < this.tableData.length; i++) {
          //   let item = this.tableData[i];
          //   if (item.taxRate) {
          //     // item.taxRate = item.taxRate;
          //   }
          // }
        })
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitData(type) {
        let warIncomingDetailCreateReqs = [];
        let setDataFun = type === 'edit' ? updateIncomingList : createIncomingList;
        for (let i in this.tableData) {
          let item = this.tableData[i];
          let obj = this.getQuickWarehouseDetail(item, 'quantityIn');
          if (type === 'edit') {
            obj.id = item.edit ? item.id : '';
          }
          warIncomingDetailCreateReqs.push(obj);
        }
        let data = {
          ...this.projectForm,
          warIncomingDetailCreateReqs
        }
        if (type === 'edit') {
          data.id = this.id;
        }
        setDataFun(data).then(res => {
          console.log(res);
          let typeStr = type === 'edit' ? '修改' : '添加';
          let message = '入库单' + typeStr + '成功';
          if (res.status === 0) {
            this.$message({
              message: message,
              type: 'success'
            })
            this.setRoute();
          }
        })
      },
      //获取表格数据列表
      getTableData(val) {
        this.tableData = val;
      },
      //改变含税金额
      changeTaxableAmount(item) {
        console.log(item);
        item.totalPrice = item.quantityIn * item.averagePrice;
        if (isNaN(item.taxRate)) {
          item.taxRate = Number(item.taxRate.substring(0, item.taxRate.length - 1));
        }
        item.ratePrice = item.totalPrice / (1 + item.taxRate / 100) * item.taxRate / 100;
        console.log(item.taxRate); //16
      },

    }
  }
</script>
<style scoped lang="scss">
  .warehousingAgainSet {
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
  }
</style>
