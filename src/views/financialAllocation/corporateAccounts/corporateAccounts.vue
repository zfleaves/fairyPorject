<template>
  <div class="corporateAccounts">
    <div class="corporateAccountsSearch">
      <el-form v-model="labelPosition" ref="searchForm" :model="searchForm" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="账户类型">
              <el-select clearable @change="_getCompanyAccountList()" size="small" v-model="searchForm.accountTypeCode"
                         placeholder="请选择用途或属性">
                <el-option v-for="item in accountTypeCodeArr" :key="item.id" :label="item.msg"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin-right: 20px;" :span="6">
            <el-form-item label="账户姓名">
              <el-input clearable @keyup.enter.native="_getCompanyAccountList()" size="small"
                        v-model="searchForm.accountName" placeholder="请输入账户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="line-height: 40px;" :span="1">
            <el-button class="searchBtn" size="small" @click="handleSearch" plain>查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <p class="addBTN">
      <el-button size="small" @click="addAccounts" type="primary" icon="el-icon-plus">添加</el-button>
    </p>
    <div class="corporateAccountsTable">
      <el-table
        :data="corporateAccountsTableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="accountTypeName"
          label="账户类型"
          width="140">
        </el-table-column>
        <el-table-column
          prop="accountName"
          width="140"
          label="账户姓名">
        </el-table-column>
        <el-table-column
          prop="accountCard"
          show-overflow-tooltip
          width="200"
          label="卡号">
        </el-table-column>
        <el-table-column
          prop="bankName"
          show-overflow-tooltip
          label="开户银行">
        </el-table-column>
        <el-table-column
          prop="initBalance"
          width="160"
          label="期初余额">
        </el-table-column>
        <el-table-column
          width="100"
          label="账户状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus}}
          </template>

          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="address"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="modify(scope.row)">
              修改
            </el-button>
            <el-button
              v-for="(item,index) in scope.row.setList" :key="index"
              type="text" size="small" @click="handleSetCompanyStatus(item)">
              {{item.label}}
            </el-button>
            <!--<span style="color:#409eff;margin-right:10px;" @click="modify(scope.row)">修改</span>-->
            <!--<span style="color:#409eff;margin-right:10px;" @click="Cancellation(scope.row)">注销</span>-->
            <!--<span style="color:#409eff;" @click="discontinueUse(scope.row)">停用</span>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加公司账户" :visible.sync="dialogFormVisible">
      <el-form :model="addCompanyAccountObj" ref="addCompanyAccountObj" :rules="rules" label-width="80px">
        <el-form-item label="账户类型" prop="accountTypeCode">
          <el-select clearable size="small" @change="handleSelectAccountTypeCode"
                     v-model="addCompanyAccountObj.accountTypeCode"
                     placeholder="请选择账户类型">
            <el-option v-for="item in accountTypeCodeArr" :key="item.id" :label="item.msg"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
          <el-input clearable size="small" v-model="addCompanyAccountObj.accountName"
                    placeholder="请输入账户姓名"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountCard">
          <el-input type="number" clearable size="small" v-model="addCompanyAccountObj.accountCard"
                    placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input clearable size="small" v-model="addCompanyAccountObj.bankName"
                    placeholder="请输入开户银行"></el-input>
        </el-form-item>
        <el-form-item label="期初余额">
          <el-input size="small" clearable type="number" placeholder=""
                    v-model="addCompanyAccountObj.initBalance"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户状态">
          <el-select size="small" v-model="addCompanyAccountObj.status"
                     placeholder="请选择账户类型">
            <el-option v-for="item in accountTypeStatus" :key="item.id" :label="item.msg"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号别名">
          <el-input clearable size="small" v-model="addCompanyAccountObj.accountAlias"
                    placeholder="请输入账号别名"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" type="textarea" v-model="addCompanyAccountObj.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="Determine('addCompanyAccountObj')">确 定</el-button>
        <el-button size="small" @click="cancelModal">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getCompanyAccountList,
    cancelCompanyAccount,
    createCompanyAccount,
    disableCompanyAccount,
    enableCompanyAccount,
    exportexcelCompanyAccount,
    getCompanyAccountListAll,
    updateCompanyAccount,
    setCompanyAccountStatus


  } from 'api/corporateAccounts/corporateAccounts'

  export default {
    name: "corporateAccounts",
    data() {
      let accountCardFun = (rule, value, callback) => {
        if (!this.acount_check(value)) {
          callback(new Error('请输入合法的银行账号'));
        } else {
          callback();
        }

      }
      return {
        searchForm: {
          accountTypeCode: '',
          accountName: ''
        },
        pageNo: 1,
        pageSize: 10,
        total: '',
        corporateAccountsTableData: [],
        labelPosition: 'right',
        accountTypeCodeArr: [
          {id: 0, msg: '对公账户', code: '01'},
          {id: 1, msg: '法人账户', code: '02'}

        ],
        accountTypeStatus: [
          {id: 0, msg: '正常', code: '0'},
          {id: 1, msg: '停用', code: '1'},
          {id: 2, msg: '注销', code: '2'}
        ],
        addCompanyAccountObj: {
          accountTypeName: '',
          accountName: '',
          accountCard: '',
          bankName: '',
          initBalance: "",
          status: "0",
          accountTypeCode: '',
          accountAlias: "",
          remarks: ''
        },
        CompanyAccountStatus: '',
        status: '',
        accountTypeCode: "",
        editId: '',
        dialogFormVisible: false,
        rules: {
          accountTypeCode: [
            {required: true, message: '请选择账户类型', trigger: 'change'}
          ],
          accountName: [
            {required: true, message: '请输入账户名称', trigger: 'blur'},
            // {validator: accountNameFun, trigger: 'blur'}
          ],
          accountCard: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {validator: accountCardFun, trigger: 'blur'}

          ],
          bankName: [
            {required: true, message: '请输入开户银行', trigger: 'blur'},

          ],
        }
      }
    },
    created() {
      this._getCompanyAccountList()
    },
    filters:{
      setStatus(val){
        let arr  = ['正常','停用','注销'];
        return arr[val] ? arr[val] : '';
      }
    },

    methods: {
      //点击查询
      handleSearch() {

        this._getCompanyAccountList();

      },
      //获取表格数据
      _getCompanyAccountList() {
        let data = {
          ...this.searchForm,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getCompanyAccountList(data).then(res => {
          console.log(1111)
          this.total = res.results.total;
          let result = res.results.result;
          for (let i in result) {
            let item = result[i];
            if (item.status === 0) {
              item.setList = [
                {status: item.status, label: '注销', accountId: item.id, url: 'cancel'},
                {status: item.status, label: '停用', accountId: item.id, url: 'disable'},
              ]
            } else if (item.status === 1) {
              item.setList = [
                {status: item.status, label: '注销', accountId: item.id, url: 'cancel'},
                {status: item.status, label: '启用', accountId: item.id, url: 'enable'},
              ]
            } else {
              item.setList = [
                {status: item.status, label: '启用', accountId: item.id, url: 'enable'},
                {status: item.status, label: '停用', accountId: item.id, url: 'disable'},
              ]
            }
          }
          this.corporateAccountsTableData = res.results.result;

        })
      },
      //切换账户类型
      handleSelectAccountTypeCode(val) {
        let index = this.accountTypeCodeArr.findIndex(v => v.code === val);
        if (index >= 0) {
          this.addCompanyAccountObj.accountTypeName = this.accountTypeCodeArr[index].msg;
        }

      },
      //点击添加
      addAccounts() {
        this.editId = "";
        this.dialogFormVisible = true;
      },
      //点击修改
      modify(item) {
        this.dialogFormVisible = true;
        this.addCompanyAccountObj.accountTypeName = item.accountTypeName;
        this.addCompanyAccountObj.accountTypeCode = item.accountTypeCode;
        this.addCompanyAccountObj.accountName = item.accountName;
        this.addCompanyAccountObj.accountCard = item.accountCard;
        this.addCompanyAccountObj.bankName = item.bankName;
        this.addCompanyAccountObj.initBalance = item.initBalance;
        this.addCompanyAccountObj.status = item.status;
        this.addCompanyAccountObj.remarks = item.remarks;
        this.addCompanyAccountObj.accountAlias = item.accountAlias;
        this.editId = item.id;
      },

      //点击确定
      Determine(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.editId) {
              let data = {
                ...this.addCompanyAccountObj
              }

              createCompanyAccount(data).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this._getCompanyAccountList();
                this.cancelModal();
              })
            } else {
              let data = {
                ...this.addCompanyAccountObj,
              }
              data.id = this.editId;
              updateCompanyAccount(data).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this._getCompanyAccountList();
                this.cancelModal();
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //设置公司账户状态
      handleSetCompanyStatus(item) {
        this.$confirm(`您将${item.label}此公司账户数据吗`, item.label + '操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/sysbase/company/account/' + item.url;
          setCompanyAccountStatus(url,item.accountId).then(res => {
            this.$message({
              type: 'success',
              message: `${item.label}公司账户数据成功`
            })

            this._getCompanyAccountList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + item.label
          });
        });
      },
      //注销
      Cancellation(item) {
        cancelCompanyAccount(item.id).then(res => {
          this.$message({
            type: 'success',
            message: '注销成功'
          })
        })
      },
      //停用

      discontinueUse(item) {
        let msg = item.status ===
          setCompanyAccountStatus().then(res => {

          })
      },
      //关闭弹窗
      cancelModal() {
        this.dialogFormVisible = false;
        this.addCompanyAccountObj = {
          accountTypeName: '',
          accountName: '',
          accountCard: '',
          bankName: '',
          initBalance: "",
          status: "0",
          accountTypeCode: '',
          accountAlias: "",
          remarks: ''
        }
      },
      // 校验卡号
      acount_check(cardNum) {
        if (!cardNum) return true;
        let len = cardNum.length;
        let carNumArr = Array.from(cardNum.slice(0, len));
        let tem = 0;
        for (let i = len - 2; i >= 0; i -= 2) {
          tem = parseInt(cardNum[i]) * 2;
          carNumArr[i] = Math.floor(tem / 10) + tem % 10;
        }
        let result = 0;
        carNumArr.forEach(val => {
          result += parseInt(val);
        })
        return result % 10 === 0;
      }

    }
  }
</script>
<style lang="scss" scoped>
  .corporateAccounts {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    .addBTN {
      text-align: right;
      margin-bottom: 20px;
    }
  }
</style>

