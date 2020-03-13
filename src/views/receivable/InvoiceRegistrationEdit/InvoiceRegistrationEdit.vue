<template>
  <div class="InvoiceRegistrationEdit">
    <el-form label-width="100px" :rules="rules" :label-position="labelPosition" ref="writingInformationForm"
             :model="writingInformationForm">
      <el-row class="handleClickBtn" style="text-align:right">
        <el-button size="small" @click="handleCancel" type="primary" icon="el-icon-search">取消保存</el-button>
        <el-button size="small" @click="saveData('writingInformationForm')" type="primary" icon="el-icon-search">保存数据
        </el-button>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectId">
            <el-select @change="handleChange(writingInformationForm.projectId)" size="small"
                       v-model="writingInformationForm.projectId" placeholder="请选择项目名称">
              <el-option v-for="(item,index) in ProjectSelectArr" :key="index" :label="item.proName"
                         :value="item.proCode"></el-option>

            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="项目经理">
            <el-input size="small" placeholder="请选择项目经理" v-model="writingInformationForm.pmName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目编号">
            <el-input size="small" v-model="writingInformationForm.projectCode" placeholder="请选择项目编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同名称" prop="recContractId">
            <el-select size="small" v-model="writingInformationForm.recContractId" placeholder="请选择合同名称">
              <el-option v-for="(item,index) in ProjectChildrenSelectArr" :key="index" :label="item.contractName"
                         :value="item.contractCode"></el-option>

            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号" placeholder="请选择合同编号">
            <el-input size="small" v-model="writingInformationForm.contractCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订日期" placeholder="请选择签订日期">
            <el-input size="small" v-model="writingInformationForm.signTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="建设单位" placeholder="请选择建设单位">
            <el-input size="small" v-model="writingInformationForm.buildCompany"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订金额" placeholder="请选择签订金额">
            <el-input size="small" v-model="writingInformationForm.signAmount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="InvoiceDetails">
        <el-row>
          <el-col :span="8">
            <el-form-item label="开票日期" prop="invoiceTime">
              <el-time-picker type="date" size="small" placeholder="请选择开票日期"
                              v-model="writingInformationForm.invoiceTime" style="width: 100%;"></el-time-picker>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="开票内容" prop="invoiceContent">
              <el-input size="small" placeholder="请输入开票内容" v-model="writingInformationForm.invoiceContent"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票号码" prop="invoiceNumber">
              <el-input size="small" v-model="writingInformationForm.invoiceNumber" placeholder="请选择发票号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发票类型" prop="invoiceTypeCode">
              <el-select size="small" v-model="writingInformationForm.invoiceTypeCode" placeholder="请选择项目名称">
                <el-option v-for="(item,index) in InvoiceTypeArr" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票联次" prop="invoiceSerialCode">
              <el-select size="small" v-model="writingInformationForm.invoiceSerialCode" placeholder="请输入发票联次">
                <el-option v-for="(item,index) in consolidatedInvoicesArr" :key="index" :label="item.dataName"
                           :value="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票金额" prop="invoiceAmount">
              <el-input-number size="small" v-model="writingInformationForm.invoiceAmount" controls-position="right"
                               :min="1" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="签收人" placeholder="请选择建设单位" prop="receiver">
              <el-input size="small" v-model="writingInformationForm.receiver"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" placeholder="请填写备注" prop="name">
              <el-input size="small" type="textarea" v-model="writingInformationForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
  import {

    getProjectSelect,
    getDicDicdataStatus,
    createRecInvoice,
    getRecContractProjectList

  } from 'api/receivable/InvoiceRegistration/InvoiceRegistration';

  export default {
    name: "InvoiceRegistrationEdit",
    data() {
      return {
        labelPosition: 'right',
        ProjectSelectArr: [],
        DicdataStatusArr: [],
        consolidatedInvoicesArr: [],
        InvoiceTypeArr: [],
        writingInformationForm: {
          projectId: '',
          pmName: '',
          projectCode: '',
          recContractId: '',
          contractCode: '',
          signTime: '',
          buildCompany: '',
          signAmount: '',
          invoiceTime: '',
          invoiceContent: '',
          invoiceNumber: '',
          invoiceTypeCode: '',
          invoiceSerialCode: '',
          invoiceAmount: '',
          receiver: '',
          remarks: '',

          invoiceCode: "",
          invoiceSerialName: "",
          invoiceTypeName: "",
          orgId: ""
        },
        ProjectChildrenSelectArr: [],
        dicId2: 62,
        dicId1: 61,
        companyId: 1,
        flg: 1,
        rules: {
          projectId: [
            {required: true, message: '请选择项目名称', trigger: 'change'}

          ],
          recContractId: [
            {required: true, message: '请选择合同名称', trigger: 'blur'}
          ],
          invoiceTime: [
            {required: true, message: '请选择开票日期', trigger: 'change'}
          ],
          invoiceContent: [
            {required: true, message: '请输入开票内容', trigger: 'blur'},
          ],
          invoiceNumber: [
            {required: true, message: '请输入发票号码', trigger: 'blur'}
          ],
          invoiceTypeCode: [
            {required: true, message: '请选择发票类型', trigger: 'change'}
          ],
          invoiceSerialCode: [
            {required: true, message: '请选择发票联次', trigger: 'change'}
          ],
          invoiceAmount: [
            {required: true, message: '请输入发票金额', trigger: 'blur'}
          ],
          receiver: [
            {required: true, message: '请输入签收人', trigger: 'blur'}
          ]

        }

      }
    },
    created() {
      this._getDicDicdataStatus();
      this._getProjectSelect();

    },
    methods: {
      //获取发票联次
      _getDicDicdataStatus() {
        getDicDicdataStatus(this.dicId2, this.companyId, this.flg).then(res => {
          console.log(res)
          this.consolidatedInvoicesArr = res.results;
        })
      },
      //获取发票类型
      _getDicDicdataStatus() {
        getDicDicdataStatus(this.dicId1, this.companyId, this.flg).then(res => {
          console.log(res)
          this.InvoiceTypeArr = res.results;
        })
      },
      //获取项目名称
      _getProjectSelect() {
        getProjectSelect().then(res => {
          console.log(res)
          this.ProjectSelectArr = res.results;


        })
      },
      //
      handleChange(data) {
        let index = this.ProjectSelectArr.findIndex(v => v.id === data);
        if (index >= 0) {
          this.ProjectSelectArr.orgId = this.ProjectSelectArr[index].orgId;
        }
        // getRecContractProjectList(this.ProjectSelectArr[index].id).then(res => {
        //   this.ProjectChildrenSelectArr = res.results;
        //   //     for(let i in this.ProjectSelectArr){
        //   //     let item = this.ProjectSelectArr[i]
        //   //     this.ProjectChildrenSelectArr[i] = {
        //   //         contractName:item.contractName,
        //   //         contractCode:item.contractCode
        //   //     }
        //
        //   // }
        //   console.log(this.ProjectChildrenSelectArr)
        // })

      },
      //保存
      saveData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.writingInformationForm.invoiceSerialCode === '01') {
              this.writingInformationForm.invoiceSerialName = '发票联'
            } else if (this.writingInformationForm.invoiceSerialCode === '02') {
              this.writingInformationForm.invoiceSerialName = '折扣联'
            } else if (this.writingInformationForm.invoiceSerialCode === '03') {
              this.writingInformationForm.invoiceSerialName = '发票联和抵扣联'
            }

            if (this.writingInformationForm.invoiceTypeCode === '01') {
              this.writingInformationForm.invoiceTypeName = '专票'
            } else if (this.writingInformationForm.invoiceTypeCode === '02') {
              this.writingInformationForm.invoiceTypeName = '普票'
            } else if (this.writingInformationForm.invoiceTypeCode === '03') {
              this.writingInformationForm.invoiceTypeName = '电子普票'
            }
            let data = {
              ...this.writingInformationForm
            }
            createRecInvoice(data).then(res => {
              console.log(res)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消保存
      handleCancel() {
        this.$router.push('/InvoiceRegistration')
      }
    }
  }
</script>

<style scoped lang="scss">
  .InvoiceRegistrationEdit {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 0 20px;
    .handleClickBtn {
      padding: 20px;
    }
    .InvoiceDetails {
      border-top: 1px #ddd solid;
      margin-top: 20px;
      padding: 30px 0;
    }
    .el-select {
      width: 100%;
    }
  }
</style>

