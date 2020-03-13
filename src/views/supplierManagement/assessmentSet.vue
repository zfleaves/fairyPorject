<template>
  <div class="assessmentSet">
    <titleComponents titles="供应商考核">
      <div class="btn" slot="btn">
        <el-button :disabled="!flowStatus" @click="successCancel" icon="el-icon-circle-close" size="small" type="danger"
                   plain>取消
        </el-button>
        <el-button :disabled="!flowStatus" @click="successSubmit('searchForm')" icon="el-icon-circle-check" size="small"
                   type="primary">确认提交
        </el-button>
      </div>
    </titleComponents>
    <el-form :model="searchForm" :rules="rules" ref="searchForm" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
            <el-select :disabled="!flowStatus" clearable @change="handlechangeSupplier" v-model="searchForm.supplierId"
                       placeholder="请选择供应商名称">
              <el-option v-for="(item,index) in SupplierListAll" :key="index" :label="item.supplierFullName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商等级" prop="level">
            <el-select :disabled="!flowStatus" clearable v-model="searchForm.level" placeholder="请选择供应商等级">
              <el-option v-for="(item,index) in levelList" :key="index" :label="item.dataName"
                         :value="item.dataValue"></el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否合格" prop="appraiseStatus">
            <el-select :disabled="!flowStatus" clearable v-model="searchForm.appraiseStatus" placeholder="请选择是否合格">
              <el-option v-for="(item,index) in appraiseStatusList" :key="index" :label="item.dataName"
                         :value="item.dataValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="评价等级" prop="appraiseLevels">
            <el-select :disabled="!flowStatus" clearable v-model="searchForm.appraiseLevels" placeholder="请选择评价等级">
              <el-option v-for="(item,index) in appraiseLevelsList" :key="index" :label="item.dataName"
                         :value="item.dataValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考核描述" prop="examinationName">
            <el-input :disabled="!flowStatus" v-model="searchForm.examinationName"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div class="assessmentSetConTable">
      <el-table
        border
        :data="tableData"
        :header-cell-style="{ 'backgorund-color':'fafafa' }"
        :span-method="objectSpanMethod"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="examinationCategoryName"
          label="考核项目">
        </el-table-column>
        <el-table-column
          prop="examinationCategoryChildName"
          label="考核名称">
        </el-table-column>
        <el-table-column
          prop="referenceScore"
          show-overflow-tooltip
          label="参考分值"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="examinationContent"
          label="考核内容">
        </el-table-column>
        <el-table-column

          label="所得分值"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-number
              v-if="flowStatus"
              size="small"
              v-model="scope.row.score"
              :placeholder="'请输入0~'+scope.row.referenceScore+'之间的分值'"
              controls-position="right" :min="0" :max="scope.row.referenceScore">
            </el-number>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column
          label="详细说明">
          <template slot-scope="scope">
            <el-input v-if="flowStatus" style="height: 35px;margin-bottom: 2px;" type="textarea" maxlength="250"
                      v-model="scope.row.remarks"></el-input>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import TitleComponents from '../../components/titleComponent'
  import {
    getSupplierListAll,
    getExmContents,
    createSupplierExm,
    getSupplierExmInfo,
    updateSupplierExm
    // getSupplierExmList
  } from 'api/supplierManagement/assessment'
  import {dataDictionary, closeRoute} from 'mixins'

  export default {
    name: 'assessmentSet',
    mixins: [dataDictionary, closeRoute],
    components: {
      TitleComponents
    },
    data() {
      return {
        SupplierListAll: [],
        selectArr: ['level', 'appraiseStatus', 'appraiseLevels'],
        tableData: [],
        rules: {
          supplierId: [
            {required: true, message: '请选择供应商', trigger: 'blur'},
          ],
          level: [
            {required: true, message: '请选择供应商等级', trigger: 'blur'},
          ],
          appraiseStatus: [
            {required: true, message: '请选择是否合格', trigger: 'blur'},
          ],
          appraiseLevels: [
            {required: true, message: '请选择评价等级', trigger: 'blur'},
          ],
          examinationName: [
            {required: true, message: '请输入考核描述', trigger: 'blur'},
          ],
        },
        searchForm: {
          appraiseLevels: "",
          appraiseStatus: "",
          examinationName: "",
          level: "",
          supplierId: ''
        },
        spanArr: [],
        id: '',
        type: '',
        flowStatus: '',
      }
    },
    created() {
      this._getSupplierListAll();
      this._getDicdataList(this.selectArr);
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
      this.type = this.Base64.decode(params.type);
      this.flowStatus = this.type !== 'info';
      // console.log(this.type);
      if (this.id >= 0) {
        this._getSupplierExmInfo();
      }
    },
    mounted() {
      this._getExmContents()
    },
    methods: {
      //获取供应商名称
      _getSupplierListAll() {
        getSupplierListAll().then(res => {
          this.SupplierListAll = res.results;

        })
      },
      handlechangeSupplier() {
        let index = this.SupplierListAll.findIndex(v => v.id === this.searchForm.supplierId);
        if (index >= 0) {
          this.searchForm.supplierFullName = this.SupplierListAll[index].supplierFullName;
        } else {
          this.searchForm.supplierFullName = '';
        }
      },
      _getExmContents() {
        getExmContents().then(res => {
          this.tableData = res.results;
          this.getSpanArr(this.tableData);
        })
      },
      //确定
      successSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setSubmitData(this.type)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //
      setSubmitData(type) {
        let setDataFun = type === 'edit' ? updateSupplierExm : createSupplierExm;
        let cocSupplierExaminationCreateReqDtos = [];
        for (let i in this.tableData) {
          let item = this.tableData[i];
          cocSupplierExaminationCreateReqDtos.push({
            examinationChildCode: item.examinationCategoryChildCode,
            examinationChildName: item.examinationCategoryChildName,
            examinationContentId: item.id,
            remarks: item.remarks,
            score: item.score,
          })
        }
        let data = {}
        if (type === 'edit') {
          data = {
            ...this.searchForm,
            scores: cocSupplierExaminationCreateReqDtos,
          }
          data.id = this.id;
        } else {
          data = {
            ...this.searchForm,
            cocSupplierExaminationCreateReqDtos: cocSupplierExaminationCreateReqDtos,
          }
        }
        setDataFun(data).then(res => {
          let typeStr = type === 'edit' ? '修改' : '添加';
          let message = '供应商考核' + typeStr + '成功';
          if (res.status === 0) {
            this.$message({
              message: message,
              type: 'success'
            })
            this.setRoute();
          }

        })
      },
      //取消
      successCancel() {

      },
      // 获取多少换行
      getSpanArr(data) {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0
            } else {
              // 判断当前元素与上一个元素是否相同
              if (data[i].examinationCategoryCode === data[i - 1].examinationCategoryCode) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
          }
        }
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      //查看
      _getSupplierExmInfo() {
        getSupplierExmInfo(this.id).then(res => {
          this.searchForm.supplierId = res.results.supplierId;
          this.searchForm.level = res.results.level;
          this.searchForm.appraiseStatus = res.results.appraiseStatus;
          this.searchForm.appraiseLevels = res.results.appraiseLevels;
          this.searchForm.examinationName = res.results.examinationName;
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .assessmentSet {
    width: calc(100% - 20px);
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    margin: 10px;
    box-sizing: border-box;
    .assessmentSetConTable {
      margin-top: 20px;
    }
  }
</style>
