<template>
  <div class="warehousingSet">
    <div class="top">
      <div class="titles">
        <span class="title">入库单</span>
        <el-button size="small" @click="submitoProjectFrom('searchFormObj')" type="primary" icon="el-icon-circle-check">
          保存数据
        </el-button>
        <el-button size="small" style="margin-right:20px;" @click="cancelProjectFrom" type="danger"
                   icon="el-icon-circle-check" plain>取消保存
        </el-button>
      </div>
    </div>
    <div class="search">
      <el-form :rules="rules" :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj"
               label-width="120px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectId">
              <el-select clearable @change="changeProjectName" size="small" v-model="searchFormObj.projectId"
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
            <el-form-item label="仓库" prop="warehouseId">
              <el-select clearable size="small" v-model="searchFormObj.warehouseId"
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
              <el-input clearable size="small" v-model="searchFormObj.supplierName"

                        placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期" prop="incomingTime">
              <el-date-picker
                size="small"
                v-model="searchFormObj.incomingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择登记日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库描述" prop="incomingDescription">
              <el-input clearable size="small" v-model="searchFormObj.incomingDescription"

                        placeholder="请输入入库描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上传附件">
              <el-button type="text" size="small">点击上传</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input size="small" type="textarea" v-model="searchFormObj.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="straightForwardSetCon">
      <div class="btn">
        <el-button :disabled="!flowStatus" size="small" style="margin-right:10px;"
                   type="danger" icon="el-icon-circle-check" plain>批量删除
        </el-button>
        <el-button :disabled="!flowStatus" size="small" @click="selectDetail"
                   type="primary" icon="el-icon-circle-check">选择明细
        </el-button>
      </div>
      <div class="table" style="margin-top: 10px;">
        <el-table
          ref="DetailedTable"
          :data="DetailedTable"
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
          <el-table-column prop="quantityIn" width="150" :show-overflow-tooltip="!flowStatus" label="本次入库数量">
            <template slot-scope="scope">
              <el-input-number
                v-if="flowStatus"
                @change="changeTaxableAmount(scope.row)"
                size="small" placeholder="请输入本次入库数量"
                v-model="scope.row.quantityIn"
                controls-position="right" :min="0">
              </el-input-number>
              <span v-else>{{scope.row.quantityIn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="averagePrice" width="150" label="单价(暂估)">
            <template slot-scope="scope">
              <el-input-number
                v-if="flowStatus"
                @change="changeTaxableAmount(scope.row)"
                :precision="2"
                size="small" placeholder="请输入单价(暂估)"
                v-model="scope.row.averagePrice"
                controls-position="right" :min="0">
              </el-input-number>
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
              <el-input-number
                v-if="flowStatus"
                :precision="2"
                size="small" placeholder="请输入税额(元)"
                v-model="scope.row.ratePrice"
                controls-position="right" :min="0">
              </el-input-number>
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

  </div>
</template>

<script>
  import {dataDictionary, closeRoute} from 'mixins'
  import {getProjectWarehouseList, getProjectsLists} from 'api/warehouseManagement/warehousing'
  import WarehouseMaterial from '../components/warehouseMaterial'

  export default {
    name: 'warehousingSet',
    mixins: [dataDictionary, closeRoute],
    data() {
      return {
        labelPosition: 'right',
        id: '',
        type: '',
        flowStatus: '',
        dataDictionaryArr: ['taxRate'],
        warehouseList: [],
        ProjectsList: [],
        DetailedTable: [],
        tableSele: [],
        modalFlag: false,
        rules: [],
        searchFormObj: {
          attachmentId: "",
          incomingDescription: "",
          incomingTime: "",
          orgId: 318,
          projectId: 294,
          remarks: "备注",
          supplierName: "",

          warehouseId: 117
        }
      }
    },
    created() {
      this._getProjectsLists();
      this._getDicdataList(this.dataDictionaryArr);
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
      this.type = this.Base64.decode(params.type);
      this.flowStatus = this.type !== 'info';
    },
    methods: {
      //获取项目名称
      _getProjectsLists() {
        getProjectsLists(this.menuId).then(res => {
          this.ProjectsList = res.results.proProjectDtos
        })
      },
      //切换项目名称
      changeProjectName(val) {
        this.setProject(val);
      },
      setProject(val) {
        this.warehouseList = [];
        this.searchFormObj.remarks = "";
        this.searchFormObj.incomingTime = "";
        this.searchFormObj.warehouseId = "";
        this.searchFormObj.supplierName = "";
        let index = this.ProjectsList.findIndex(v => v.id === val);
        if (index >= 0) {
          this.pmName = this.ProjectsList[index].pmName;
          this.searchFormObj.orgId = this.ProjectsList[index].orgId;
        }
      },
      //选择明细
      selectDetail() {
        if (!this.searchFormObj.projectId) {
          this.$message({
            message: '请选择项目名称',
            type: 'warning'
          });
          return
        }
        this.modalFlag = true;
      },
      //取消弹窗
      getCancelModal() {
        this.modalFlag = false;
      },
      //保存数据
      submitoProjectFrom() {

      },
      //取消保存
      cancelProjectFrom() {

      }
    },
    watch: {
      "searchFormObj.projectId"() {
        if (this.searchFormObj.projectId) {
          //获取仓库名称
          getProjectWarehouseList(this.searchFormObj.projectId).then(res => {
            console.log(res.results);
            this.warehouseList = res.results;
          })
        }
      },
      DetailedTable: {
        deep: true,
        handler() {
          this.tableSele = JSON.parse(JSON.stringify(this.DetailedTable));
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .warehousingSet {
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
