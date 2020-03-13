<template>
  <div class="projectAdd">
    <div class="projectAddCon">
      <div class="projectAddSearch">
        <el-form label-width="120px" :label-position="labelPosition" ref="form" :model="projectForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="项目名称">
                <el-input placeholder="请输入项目名称"
                          @keyup.enter.native="handleSearch"
                          size="small" clearable
                          v-model="projectForm.proName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目状态">
                <el-select @change="handleSearch"
                           size="small" clearable
                           placeholder="请选择项目状态"
                           v-model="projectForm.proStatus">
                  <el-option v-for="(item,index) in statusList" :key="index" :label="item.dataName"
                             :value="item.dataValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属区域">
                <el-select @change="handleSearch"
                           size="small" clearable
                           placeholder="请选择活动区域"
                           v-model="projectForm.orgId">
                  <el-option v-for="(item,index) in RegionList" :key="index" :label="item.orgName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-col :span="12">
                <el-button @click="handleSearch" size="small"
                           type="primary" icon="el-icon-search">查询
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-link @click="showScreen" size="small" type="primary">高级筛选</el-link>
              </el-col>
            </el-col>
          </el-row>
          <el-row v-if="ScreenFlag" :gutter="20">
            <el-col :span="6">
              <el-form-item label="项目类型">
                <el-select @change="handleSearch" size="small" clearable placeholder="请选择项目类型"
                           v-model="projectForm.proTypeCode">
                  <el-option v-for="(item,index) in proTypeCodeList" :key="index" :label="item.dataName"
                             :value="item.dataValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目开工日期">
                <el-date-picker
                  @change="handleSearch"
                  v-model="time"
                  size="small"
                  clearable
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  align="right"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="projectAddTable">
        <el-row :gutter="20">
          <el-col :offset="18" :span="6">
            <el-button size="small" @click="AddProject" type="primary" icon="el-icon-plus">添加</el-button>
            <el-button size="small" type="primary" icon="el-icon-third-excel">导出Excel</el-button>
          </el-col>
        </el-row>
        <div class="projectAddTableInner">
          <el-table
            :data="tableData" style="width: 100%">
            <el-table-column
              type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column
              prop="proName" label="项目名称"
            >
            </el-table-column>
            <el-table-column
              prop="orgName" width="200" label="所属区域">
            </el-table-column>
            <el-table-column
              prop="proTypeName" width="100" label="项目类型">
            </el-table-column>
            <el-table-column
              width="100" prop="constructionNatureName" label="承包方式">
            </el-table-column>
            <el-table-column
              width="100" prop="pmName" label="项目经理">
            </el-table-column>
            <el-table-column
              width="100" prop="usersCount" label="成员个数">
            </el-table-column>
            <el-table-column
              width="120" label="开工日期">
              <template slot-scope="scope">
                <span>
                    {{scope.row.beginTime | setTime}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="100" prop="proStatus" label="项目状态">
            </el-table-column>
            <el-table-column
              width="200" prop="address" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClickToGrantAuthorization(scope.row)" type="text" size="small">启动项目</el-button>
                <el-button @click="handleClickModify(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" @click="handleClickDelet(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
              style="text-align: right;margin-top:20px;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"

              :page-size="pageSize"
              background
              layout="prev, pager, next"
              :total="Number(total)">
          </el-pagination> -->
          <!-- <Paginations :page-size="pageSize" :page-total="total" @pageIndex="handleCurrentChange"></Paginations> -->
          <Paginations
            v-show="total>pageSize" ref="Page" :page-size="pageSize" :total="total"
            @sentPages="getPages">
          </Paginations>
        </div>
      </div>
    </div>
    <RightModal v-if="rightModalShow">
      <div slot="header">添加项目</div>
      <div slot="body">
        <el-form :model="projectFormCopy" :rules="rules" ref="projectFormCopy" label-width="120px"
                 class="demo-ruleForm">
          <el-form-item label="项目名称" prop="proName">
            <el-input size="small" clearable v-model="projectFormCopy.proName"></el-input>
          </el-form-item>
          <el-form-item label="项目编号">
            <el-input size="small" clearable v-model="projectFormCopy.proCode"></el-input>
          </el-form-item>
          <p class="tips">如果不输入项目编号，则按照系统规则（流水号）进行编号</p>
          <el-form-item label="所属区域" prop="orgId">
            <el-button size="small" style="padding: 9px 10px;" type="primary" plain>{{RegionList.length>0 ?
              ModalRegionList : ''}}
              <i style="margin-left: 10px;" class="el-icon-close"></i></el-button>
            <el-button size="small" plain icon="el-icon-plus"></el-button>
          </el-form-item>
          <el-form-item prop="beginTimeStart" label="开工日期">
            <el-date-picker size="small" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="projectFormCopy.beginTime"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="项目类型" prop="proTypeCode">
            <el-select @change="handleSelectProTypeCode" size="small" clearable style="width:100%"
                       v-model="projectFormCopy.proTypeCode" placeholder="请选择项目类型">
              <el-option v-for="(item,index) in proTypeCodeList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="承包方式" prop="constructionNatureCode">
            <el-select @change="handleSelectConstructionNatureCode" size="small" clearable style="width:100%"
                       v-model="projectFormCopy.constructionNatureCode" placeholder="请选择承包方式">
              <el-option v-for="(item,index) in ConstructionNatureList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" clearable label="项目经理账号" prop="pmCode">
            <el-input v-model="projectFormCopy.pmCode"></el-input>
          </el-form-item>
          <el-form-item size="small" disabled label="项目经理" prop="pmName">
            <el-input v-model="projectFormCopy.pmName"></el-input>
          </el-form-item>
          <el-form-item size="small" clearable label="备注说明" prop="desc">
            <el-input type="textarea" v-model="projectFormCopy.remarks"></el-input>
          </el-form-item>
          <div style="padding-left: 50px;"> 项目创建完成后，系统将发送短信给项目经理，后续由项目经理完成项目的人员维护、启动项目及后续项目的物资管理工作</div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="submitForm('projectFormCopy')" style="width:100px;" type="primary" size="small">保存
        </el-button>
        <el-button style="width:100px;" @click="handleCancel" size="small">取消</el-button>
      </div>
    </RightModal>
  </div>
</template>
<script>
  import {formatYear, formatTime} from 'util'
  import {
    getRegionList,
    getProjectList,
    getProjectStatus,
    handleSubmitForm,
    handleModify,
    projectDisable
  } from 'api/companyProject/projectAdd'
  import Auth from 'util/auth'
  import RightModal from 'components/rightModal/rightModal'
  import Paginations from 'components/Pagination/Pagination'

  export default {
    name: 'projectAdd',
    components: {
      RightModal, Paginations
    },
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        labelPosition: 'right',
        projectForm: {
          proCode: "",
          proName: "",
          proStatus: "",
          proTypeCode: "",
          beginTimeEnd: "",
          beginTimeStart: "",
          orgId: '',
        },
        projectFormCopy: {
          proName: '',
          proCode: '',
          orgId: '',
          beginTime: '',
          proTypeCode: '',
          proTypeName: '',
          constructionNatureCode: '',
          constructionNatureName: '',
          pmCode: '',
          pmName: '',
          remarks: '',
        },
        // projectFormCopy: JSON.parse(JSON.stringify(this.projectForm)),
        time: '',

        RegionList: [],
        statusList: [],
        dicId: 13,
        flg: 1,
        companyId: '',
        ScreenFlag: false,
        proTypeCodeList: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        rules: {
          proName: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
            {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
          ],
          beginTime: [
            {type: 'date', required: true, message: '请选择开工日期', trigger: 'change'}
          ],
          proTypeCode: [
            {required: true, message: '请选择项目类型', trigger: 'change'}
          ],
          constructionNatureCode: [
            {required: true, message: '请选择建设性质', trigger: 'change'}
          ],
          pmCode: [
            {required: true, message: '请输入项目经理账号', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          pmName: [
            {required: true, message: '项目经理账号为必填项', trigger: 'blur'},
          ],
          orgId: [
            {required: true, message: '请选择所属区域', trigger: 'change'},
          ],
        },
        rightModalShow: false,
        ModalRegionList: '',
        editId: '',
        ConstructionNatureList: [],

        currentPage: 1, //初始页
        pageSize: 2,    //    每页的数据
        tableData: [],
        total: 1
      }
    },
    created() {

      this._getRegionList();
      this._getProjectStatus();
      this._getProjectList();
      this._getProjectType();
      this._getProjectConstructionNatureName();
    },
    methods: {
      //获取表格信息
      _getProjectList() {
        console.log(this.time);

        if (this.time) {
          this.projectForm.beginTimeStart = this.time[0];
          this.projectForm.beginTimeEnd = this.time[1];
        } else {
          this.projectForm.beginTimeStart = '';
          this.projectForm.beginTimeEnd = '';
        }
        let data = {
          pageSize: this.pageSize,//2
          pageNo: this.currentPage,//1

          ...this.projectForm
        }
        console.log(data)
        getProjectList(data).then(res => {
          console.log(res)
          this.total = res.results.total
          this.tableData = res.results.proProjectDtos
        })
      },
      // 分页
      getPages(page) {
        this.currentPage = page;
      },
      //每页下拉显示数据
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)
        this._getProjectList()
      },
      //点击第几页
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
        this._getProjectList()
      },
      //获取第一行区域信息
      _getRegionList() {
        getRegionList().then(res => {
          this.RegionList = res.results;
          this.ModalRegionList = this.RegionList[0].orgName;
          this.projectFormCopy.orgId = this.RegionList[0].id;

          console.log(this.ModalRegionList)

        })
      },
      //获取项目状态
      _getProjectStatus() {
        // console.log(this.companyId);
        this.companyId = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '';
        console.log(this.companyId);
        let data = {
          dicId: this.dicId,
          companyId: this.companyId,
          flg: this.flg
        }
        getProjectStatus(data).then(res => {
          this.statusList = res.results
        })

      },
      //查询
      handleSearch() {
        this._getProjectList()
      },
      //获取项目类型
      _getProjectType() {
        let data = {
          dicId: 52,
          companyId: 1,
          flg: 1
        }
        getProjectStatus(data).then(res => {
          this.proTypeCodeList = res.results;

        })
      },
      //显示隐藏高级筛选
      showScreen() {
        this.ScreenFlag = !this.ScreenFlag
      },
      //添加项目
      AddProject() {
        this.rightModalShow = true;
        this.editId = ''
      },
      //取消右弹窗
      handleCancel() {
        this.rightModalShow = false;
      },
      //切换项目类型
      handleSelectProTypeCode(val) {
        let index = this.proTypeCodeList.findIndex(v => v.dataValue === val);
        if (index >= 0) {
          this.projectFormCopy.proTypeName = this.proTypeCodeList[index].dataName;
        }
      },
      //切换承包方式
      handleSelectConstructionNatureCode(val) {
        console.log(val)
        // constructionNatureCodeList
        let index = this.ConstructionNatureList.findIndex(v => v.dataValue === val);
        if (index >= 0) {
          this.projectFormCopy.constructionNatureName = this.ConstructionNatureList[index].dataName;
        }
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            let data = {
              companyId: this.companyId,
              ...this.projectFormCopy
            }
            if (!this.editId) {

              console.log(data)
              handleSubmitForm(data).then(res => {
                this.$message({
                  message: '项目添加成功',
                  type: 'success'
                })
                this.rightModalShow = false;
                this._getProjectList()

              })
            } else {
              data.id = this.editId;
              handleModify(data).then(res => {
                this.$message({
                  message: '项目修改成功',
                  type: 'success'
                })
                this.rightModalShow = false;
                this._getProjectList()
              })

            }

          } else {
            console.log('请完善表单！！');
            return false;
          }
        });
      },
      //修改
      handleClickModify(item) {
        console.log(item)
        this.editId = item.id;
        this.rightModalShow = true;
        this.projectFormCopy.proName = item.proName;
        this.projectFormCopy.proCode = item.proCode;
        this.projectFormCopy.orgId = item.orgId;
        this.projectFormCopy.beginTime = formatTime(item.beginTime);
        this.projectFormCopy.proTypeCode = item.proTypeCode;
        this.projectFormCopy.proTypeName = item.proTypeName;
        this.projectFormCopy.constructionNatureCode = item.constructionNatureCode;
        this.projectFormCopy.constructionNatureName = item.constructionNatureName;
        this.projectFormCopy.pmCode = item.pmCode;
        this.projectFormCopy.pmName = item.pmName;
        this.projectFormCopy.remarks = item.remarks;
        console.log(this.projectFormCopy)
      },
      //删除
      handleClickDelet(item) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          projectDisable(item.id, 1).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this._getProjectList()
            console.log(res)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //获取弹窗中的承包方式
      _getProjectConstructionNatureName() {
        this.companyId = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '';
        console.log(this.companyId);
        let data = {
          dicId: 42,
          companyId: this.companyId,
          flg: 1
        }
        getProjectStatus(data).then(res => {
          this.ConstructionNatureList = res.results
          console.log(this.ConstructionNatureList)
        })
      }
    },

    filters: {
      setTime(val) {
        return val ? formatYear(val) : ''
      }
    },
    // computed:{
    //     companyId(){
    //         return Auth.hasUserInfo ? Auth.hasUserInfo.companyId : ''
    //     }
    // }

  }
</script>
<style scoped lang="scss">
  .projectAdd {
    padding: 20px;
    background-color: #fff;
    .projectAddTable {
      margin-top: 20px;
      .el-row {
        text-align: right;
      }
      .projectAddTableInner {
        margin-top: 10px;
      }
    }
    .tips {
      font-size: 14px;
      text-align: center;
      margin-left: 35px;
      margin-bottom: 5px;
      color: red;
    }
  }
</style>


