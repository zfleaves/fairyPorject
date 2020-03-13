<template>
  <div class="outboundSet">
    <div class="top">
      <div class="titles">
        <span class="title">出库单</span>
        <el-button size="small"
                   @click="submitoProjectFrom('projectForm')"
                   type="primary" icon="el-icon-circle-check">
          保存数据
        </el-button>
        <el-button size="small"
                   @click="cancelProjectFrom"
                   style="margin-right:20px;" type="danger"
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
                clearable @change="changeProjectName" size="small" v-model="projectForm.projectId"
                placeholder="请选择项目名称">
                <el-option v-for="(item,index) in outboundProjectsList" :key="index" :label="item.proName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目经理">
              <el-input clearable size="small" disabled v-model="pmName"
                        placeholder="请输入项目经理">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用单位">
              <el-select clearable
                         @change="changeUnit" size="small" v-model="projectForm.projectUnitId"
                         placeholder="请选择领用单位">
                <el-option v-for="(item,index) in UnitList" :key="index" :label="item.unitName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门/工程">
              <el-select @change="changeProjectChildId"
                         clearable size="small" v-model="projectForm.projectChildId"
                         placeholder="请选择使用部门/工程">
                <el-option v-for="(item,index) in ChildrenAllList" :key="index" :label="item.childProjectName"
                           :value="item.id"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select clearable size="small"
                         v-model="projectForm.warehouseId"
                         placeholder="请选择仓库">
                <el-option v-for="(item,index) in warehouseList" :key="index" :label="item.warehouseName"
                           :value="item.id">
                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用人" prop="outboundUser">
              <el-input clearable
                        size="small" v-model="projectForm.outboundUser"

                        placeholder="请输入领用人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领用原因" prop="outboundDescription">
              <el-input clearable size="small"
                        v-model="projectForm.outboundDescription"

                        placeholder="请输入领用原因"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库日期" prop="outboundTime">
              <el-date-picker
                size="small"
                v-model="projectForm.outboundTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择出库日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上传附件">
              <el-button type="text" size="small">点击上传</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input
                size="small" autosize
                type="textarea" v-model="projectForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="outboundSetCon">
      <div class="btn">
        <el-button size="small" style="margin-right:10px;"
                   type="danger" @click="handleBatchDeletion" icon="el-icon-circle-check" plain>批量删除
        </el-button>
        <el-button size="small" @click="selectDetail"
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
          <el-table-column label="物资类别" prop="classifyName" min-width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="物资名称" prop="materialName" min-width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="materialCode" label="物资编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="standards" label="规格" min-width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="80">
          </el-table-column>
          <el-table-column prop="stock" label="库存数量" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  width="150" label="本次出库数量">
            <template slot-scope="scope">
              <el-number
                :max="scope.row.stock"
                size="small" placeholder="请输入本次出库数量"
                v-model="scope.row.quantityOut"
                controls-position="right" :min="0">
              </el-number>
              <!-- <span v-else>{{scope.row.quantityIn}}</span> -->
            </template>
          </el-table-column>
          <el-table-column  width="150" label="用途">
            <template slot-scope="scope">
              <el-input clearable size="small" v-model="scope.row.purpose"
                        placeholder="请输入用途">
              </el-input>
              <!-- <span v-else>{{scope.row.manufacturer}}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="remarks" width="150" label="备注">
            <template slot-scope="scope">
              <el-input placeholder="请输入备注" v-model="scope.row.remarks">
              </el-input>
              <!-- <span v-else>{{scope.row.remarks}}</span> -->
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
      <OutboundSetMaterial
        :table-sele="tableSele"
        :warehouseId="projectForm.warehouseId"
        @tableData="getTableData" @cancelModal="getCancelModal">
      </OutboundSetMaterial>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getOutboundProjectsList,
    getProjectWarehouseList,
    getUnitList,
    getChildrenAllList,
    createOutboundList,
    deleteOutboundLists,
    updateOutboundList,
    getOutboundInfo

  } from 'api/warehouseManagement/outbound'
  import {closeRoute} from 'mixins'
  import OutboundSetMaterial from '../components/outboundSetMaterial'

  export default {
    name: 'outboundSet',
    mixins: [closeRoute],
    components: {
      OutboundSetMaterial
    },
    data() {
      return {
        labelPosition: 'right',
        outboundProjectsList: [],
        UnitList: [],
        pmName: '',
        ChildrenAllList: [],
        warehouseList: [],
        projectForm: {
          projectId: '',
          projectUnitId: "",
          projectChildId: '',
          warehouseId: '',
          outboundUser: '',
          outboundDescription: '',
          outboundTime: '',
          attachmentId: '',
          remarks: '',
          orgId: ''
        },
        rules: {
          projectId: [
            {required: true, message: '请选择项目名称', trigger: 'change'}
          ],
          warehouseId: [
            {required: true, message: '请选择仓库名称', trigger: 'change'}
          ],
          outboundUser: [
            {required: true, message: '请输入领用人', trigger: 'blur'}
          ],
          outboundDescription: [
            {required: true, message: '请输入领用原因', trigger: 'blur'}
          ],
          outboundTime: [
            {required: true, message: '请选择出库时间', trigger: 'change'}
          ]

        },
        tableShow: true,
        tableData: [],
        modalFlag: false,
        tableSele: [],
        id: '',
        type: '',
        flowStatus: '',
      }
    },
    created() {
      this._getOutboundProjectsList()
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
      this.type = this.Base64.decode(params.type);
      this.flowStatus = this.type !== 'info';
      if (this.id >= 0) {
        this._getOutboundInfo();
      }
    },
    watch: {},
    methods: {
      //获取项目名称
      _getOutboundProjectsList() {
        getOutboundProjectsList(this.menuId).then(res => {
          this.outboundProjectsList = res.results.proProjectDtos
        })
      },
      // 切换项目名称
      changeProjectName(val) {
        let flag = this.oldProjectId && this.tableData.length
        if (!flag) {
          this.setPmName(val);
          this.oldProjectId = val;
          this.projectForm.warehouseId = '';
          this.oldWarehouseId = '';
          this.getSelectList(val);
          return
        }
        this.$confirm(`切换项目将会删除明细数据,保存后生效`, '切换项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData = [];
          this.oldProjectId = val;
          this.setPmName(val);
          this.projectForm.warehouseId = '';
          this.oldWarehouseId = '';
          this.getSelectList(val);
        }).catch((e) => {
          this.projectForm.projectId = this.oldProjectId;
        });


      },
      //设置pm
      setPmName(val) {
        this.warehouseList = [];
        this.UnitList = [];
        this.ChildrenAllList = [];
        this.projectForm.projectChildId = "";
        this.projectForm.projectUnitId = "";
        this.projectForm.warehouseId = "";
        this.projectForm.outboundUser = "";
        this.projectForm.outboundDescription = "";
        this.projectForm.outboundTime = "";
        this.projectForm.attachmentId = "";
        this.projectForm.remarks = "";
        let index = this.outboundProjectsList.findIndex(v => v.id === val);
        if (index >= 0) {
          this.pmName = this.outboundProjectsList[index].pmName;
          this.projectForm.orgId = this.outboundProjectsList[index].orgId;
        }
      },
      //获得下拉列表
      getSelectList(id) {
        //获得仓库名称
        getProjectWarehouseList(id).then(res => {
          this.warehouseList = res.results
        })
        //获得领用单位
        getUnitList(id).then(res => {
          this.UnitList = res.results
        })
        //获得使用部门/工程
        getChildrenAllList(id).then(res => {
          this.ChildrenAllList = res.results
        })
      },
      //切换领用单位
      changeUnit() {

      },
      // 切换使用部门
      changeProjectChildId() {

      },
      //获取弹窗表格数据列表
      getTableData(val) {
        this.tableData = val;
      },
      // 获取详细信息
      _getOutboundInfo() {
        getOutboundInfo(this.id).then(res => {
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
      //
      submitData(type) {
        let warOutboundDetailCreateReqDtos = [];
        let setDataFun = type === 'edit' ? updateOutboundList : createOutboundList;
        for (let i in this.tableData) {
          let item = this.tableData[i];
          // let obj = this.getQuickWarehouseDetail(item, 'quantityIn');
          if (type === 'edit') {
            item.id = item.edit ? item.id : '';
          }
          warOutboundDetailCreateReqDtos.push({
            
          });
        }
        let data = {
          ...this.projectForm,
          warOutboundDetailCreateReqDtos
        }
        if (type === 'edit') {
          data.id = this.id;
        }
        setDataFun(data).then(res => {
          console.log(res);
          let typeStr = type === 'edit' ? '修改' : '添加';
          let message = '出库单' + typeStr + '成功';
          if (res.status === 0) {
            this.$message({
              message: message,
              type: 'success'
            })
            this.setRoute();
          }
        })
      },
      // 明细批量删除
      handleBatchDeletion() {
        if (this.selectTableList.length === 0) {
          this.$message({
            message: '请选择所要删除数据',
            type: 'error'
          });
          return
        }
        this.$confirm(`此操作将永久删除明细数据, 是否删除?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectTableList.forEach(item => {
            this.tableData.splice(this.tableData.indexOf(item), 1)
          });
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$refs.tableData.clearSelection();
        }).catch((e) => {
          // console.log(e);
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    }
  }
</script>
<style scoped lang="scss">
  .outboundSet {
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
    .outboundSetCon {
      margin-top: 20px;
      .btn {
        text-align: right;
      }
    }
  }
</style>
