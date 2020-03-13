<template>
  <div class="straightForwardSet">
    <buttonAndDetailComponents
      :isShowDeleteProcess="isBeginNode"
      :flowStatus="isBeginNode"
      @toHandleSubmission="getHandleSubmission('projectForm')"
      @toHandleStepBack="getHandleStepBack"
      @toHandleReturningOriginator="getHandleReturningOriginator"
      @toHandleProcessMonitoring="getHandleProcessMonitoring"
      @toHandleDeleteProcess="getHandleDeleteProcess"
      @toHandleSubmitoProjectFrom="getHandleSubmitoProjectFrom"
      @toHandleCancelProjectFrom="getHandleCancelProjectFrom">
    </buttonAndDetailComponents>
    <div class="search">
      <el-form :rules="rules" ref="projectForm" :model="projectForm"
               label-width="120px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectId">
              <el-select
                :disabled="projectFromStatus.projectName === 'DISABLED'"
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
              <el-input clearable size="small" disabled v-model="projectForm.pmName"
                        placeholder="请输入项目经理">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据编号" prop="docNo">
              <el-input clearable size="small" disabled v-model="projectForm.docNo"
                        placeholder="请输入单据编号">
              </el-input>
            </el-form-item>
          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
          <el-col :span="8">
            <el-form-item label="领用单位" prop="projectUnitId">
              <el-select :disabled="projectFromStatus.projectUnitId === 'DISABLED'" clearable
                         @change="changeUnit" size="small" v-model="projectForm.projectUnitId"
                         placeholder="请选择领用单位">
                <el-option v-for="(item,index) in UnitList" :key="index" :label="item.unitName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门/工程" prop="projectChildId">
              <el-select :disabled="projectFromStatus.projectChildId === 'DISABLED'" @change="changeProjectChildId"
                         clearable size="small" v-model="projectForm.projectChildId"
                         placeholder="请选择使用部门/工程">
                <el-option v-for="(item,index) in ChildrenAllList" :key="index" :label="item.childProjectName"
                           :value="item.id"></el-option>

              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="领用人" prop="inandoutUser">
              <el-input :disabled="projectFromStatus.inandoutUser === 'DISABLED'" clearable
                        size="small" v-model="projectForm.inandoutUser"
                        placeholder="请输入领用人"></el-input>
            </el-form-item>

          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select @change="changeWarehouse" :disabled="projectFromStatus.warehouseId === 'DISABLED'"
                         clearable size="small"
                         v-model="projectForm.warehouseId"
                         placeholder="请选择仓库">
                <el-option v-for="(item,index) in warehouseList" :key="index" :label="item.warehouseName"
                           :value="item.id">
                </el-option>

              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input :disabled="projectFromStatus.supplierName === 'DISABLED'"
                        clearable size="small"
                        v-model="projectForm.supplierName"

                        placeholder="请输入领用人"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期" prop="inandoutTime">
              <el-date-picker
                :disabled="projectFromStatus.inandoutTime === 'DISABLED'"
                size="small"
                v-model="projectForm.inandoutTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择登记日期">
              </el-date-picker>
            </el-form-item>

          </el-col>
          <!--</el-row>-->
          <!--<el-row>-->
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
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input
                :disabled="projectFromStatus.remarks === 'DISABLED'"
                size="small" autosize
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
          ref="tableData"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{'background-color': '#fafafa'}"
          stripe border
          @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="55">
          </el-table-column>
          <el-table-column type="selection" width="55" disabled>
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
                v-if="tableFromStatus.quantityIn !== 'DISABLED'"
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
                v-if="tableFromStatus.averagePrice !== 'DISABLED'"
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
              <el-select v-if="tableFromStatus.taxRate !== 'DISABLED'" @change="changeTaxableAmount(scope.row)"
                         clearable
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
                v-if="tableFromStatus.ratePrice !== 'DISABLED'"
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
              <el-input v-if="tableFromStatus.manufacturer !== 'DISABLED'" clearable size="small"
                        v-model="scope.row.manufacturer"
                        placeholder="请输入生产厂家或品牌">
              </el-input>
              <span v-else>{{scope.row.manufacturer}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" width="150" label="备注" :show-overflow-tooltip="!flowStatus">
            <template slot-scope="scope">
              <el-input v-if="tableFromStatus.remarks !== 'DISABLED'" autosize type="textarea"
                        v-model="scope.row.remarks">
              </el-input>
              <span v-else>{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- <el-dialog
      title="选择明细物资" center
      :visible.sync="modalFlag"
      top="15vh"
      v-if="modalFlag"
      width="1200px">
      <WarehouseMaterial
        :table-sele="tableSele"
        @tableData="getTableData" @cancelModal="getCancelModal">
      </WarehouseMaterial>
    </el-dialog> -->
  </div>
</template>
<script>
  import {dataDictionary, closeRoute, backlogProcess} from 'mixins'
  import WarehouseMaterial from '../../warehouseManagement/components/warehouseMaterial'
  import uploadFile from 'components/upload/uploadFile'
  import {
    getContractInandoutInfo,
    getWorkflowFormStatus,
    returnWorkflowFormTask,
    returnStartWorkflowFormTask
  } from 'api/home/home'
  import buttonAndDetailComponents from 'components/buttonAndDetailComponents'
  import {formatTime} from 'util'
  import {
    getProjectsList,
    getProjectWarehouseList,
    getChildrenAllList,
    getUnitList,
    updateInandoutList
  } from 'api/warehouseManagement/straightForward/straightForwardSet'
  import {getNextNodeAssigneeInandoutUsers, updateContractInandout} from 'api/warehouseManagement/warehousing'

  export default {
    name: '',
    mixins: [dataDictionary, closeRoute, backlogProcess],
    components: {
      WarehouseMaterial, uploadFile, buttonAndDetailComponents
    },
    data() {
      return {
        flowStatus: false,
        projectForm: {
          projectId: '',
          projectUnitId: '',
          projectChildId: "",
          inandoutUser: "",
          warehouseId: '',
          supplierName: "",
          inandoutTime: "",
          attachmentId: '',
          remarks: '',
          documentNumber: '',
          pmName: ''
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
        UnitList: [],
        ChildrenAllList: [],
        warehouseList: [],
        tableData: [],
        dataDictionaryArr: ['taxRate'],
        modalFlag: false,
        tableSele: [],
      }
    },
    created() {
      this._getDicdataList(this.dataDictionaryArr);
      this._getProjectsList();
    },
    mounted(){
      this._getWorkflowFormStatus(this._getContractInandoutInfo);
    },
    methods: {
      // _getWorkflowFormStatus() {
      //   getWorkflowFormStatus(this.formStatusCode, this.isDisable).then(res => {
      //     console.log(res.results)
      //     this.singletonColumns = res.results.singletonColumns;
      //     this.multitonColumns = res.results.multitonColumns[0].multitonColumns;
      //     this._getContractInandoutInfo();
      //   })
      // },
      //活动页面信息
      _getContractInandoutInfo() {
        getContractInandoutInfo(this.sid).then(res => {
          console.log(res)
          this.projectForm = res.results;
          this.projectForm.inandoutTime = formatTime(res.results.inandoutTime);
          for (let i in res.results.details) {
            let item = res.results.details[i];
            item.edit = true;
            item.taxRate = item.taxRate < 1 ? item.taxRate * 100 : item.taxRate;
          }
          this.tableData = res.results.details;
          this.getSelectList(this.projectForm.projectId);
          this.judgeSingleForm(this.projectForm);
          this.judgeTableFrom(this.tableData)
        })
      },

      //获取项目名称
      _getProjectsList() {
        getProjectsList(this.menuId).then(res => {
          this.ProjectsList = res.results.proProjectDtos
        })
      },

      getSelectList(id) {
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
      // 保存数据
      getHandleSubmitoProjectFrom() {

      },

      //取消保存
      getHandleCancelProjectFrom() {

      },
      //切换项目名称
      changeProjectName() {

      },
      // 切换领用单位
      changeUnit() {

      },
      //切换使用部门
      changeProjectChildId() {

      },
      // 切换仓库
      changeWarehouse() {

      },
      //批量删除
      handleBatchDeletion() {

      },
      //选择明细
      selectDetail() {

      },
      handleSelectionChange() {

      },
      changeTaxableAmount() {

      },
      getTableData() {

      },
      getCancelModal() {

      },
      // getHandleSubmission() {

      // },
      //保存数据
      getHandleSubmission(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.tableData.length === 0) {
              this.$message({
                message: '请添加明细',
                type: 'error'
              })
              return
            }
            this.step = 0;
            this.nextStep();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 获取下一步节点信息
      nextStep() {
        this.getNexNodeInfo(getNextNodeAssigneeInandoutUsers);
        // this.sid = this.projectForm.id;
        // this.projectId = this.projectForm.projectId;
        // getNextNodeAssigneeInandoutUsers(this.sid, this.currentProcessNodeCode, this.projectId, this.id).then(res => {
        //   let results = res.results;
        //   results.step = this.step;
        //   this.$emit('showDialog', results);
        // })
      },
      saveProjectForm(val) {
        let warInAndOutDetailCreateReqs = [];
        for (let i in this.tableData) {
          let item = this.tableData[i];
          let obj = this.getQuickWarehouseDetail(item, 'quantityIn');
          obj.id = item.edit ? item.id : '';
          warInAndOutDetailCreateReqs.push(obj);
        }
        const data = {
          ...this.projectForm,
          warInAndOutDetailCreateReqs
        }
        const loading = this.getLoading('提交流程...');
        updateInandoutList(data).then(res => {
          updateContractInandout(val).then(ret => {
            this.setRoute();
            this.$message.success('提交流程成功');
            loading.close()
          }).catch(e => {
            console.log(e);
            loading.close()
          })
        })
        // const approvalForm = {}
        // updateInandoutList
      },
      // submitData(type) {
      //   let warInAndOutDetailCreateReqs = [];
      //   let setDataFun = type === 'edit' ? updateInandoutList : createInandoutList;
      //   for (let i in this.tableData) {
      //     let item = this.tableData[i];
      //     let obj = this.getQuickWarehouseDetail(item, 'quantityIn');
      //     if (type === 'edit') {
      //       obj.id = item.edit ? item.id : '';
      //     }
      //     warInAndOutDetailCreateReqs.push(obj);
      //   }
      //   let data = {
      //     ...this.projectForm,
      //     warInAndOutDetailCreateReqs
      //   }
      //   if (type === 'edit') {
      //     data.id = this.id;
      //   }
      //   setDataFun(data).then(res => {
      //     console.log(res);
      //     let typeStr = type === 'edit' ? '修改' : '添加';
      //     let message = '直进直出单' + typeStr + '成功';
      //     if (res.status === 0) {
      //       this.$message({
      //         message: message,
      //         type: 'success'
      //       })
      //       this.setRoute();
      //     }
      //   })
      // },
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
      // margin-: 65px;
      height: 43px;
      padding: 0 10px;
      line-height: 43px;
      .titles {
        border-bottom: 1px #eee solid;
        overflow: hidden;
        padding: 5px 0 5px 20px;
        &::before {
          content: '';
          width: 3px;
          height: 25px;
          background: #3e75ff;
          position: absolute;
          top: 90px;
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
