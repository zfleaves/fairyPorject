<template>
  <div class="maintain">
    <div class="maintainSearch" :class="moreSearchFlag? 'active' : ''">
        <el-form :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj" label-width="120px">
            <el-row style="margin: 15px 0px 0 0;">
                <el-col :span="6">
                    <el-form-item label="流程状态">
                        <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.flowStatus"
                                placeholder="请选择流程状态">
                            <el-option v-for="(item,index) in StatusList" :key="index" :label="item.dataName" :value="item.dataValue"></el-option>
                            
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="项目名称">
                        <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.projectId"
                            placeholder="请选择项目名称">
                            <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName" :value="item.id"></el-option>
                           
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库名称">
                    <el-input clearable size="small" v-model="searchFormObj.warehouseName"
                                @keyup.enter.native="handleSearch"
                                placeholder="请输入仓库名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" style="text-align:right;padding-top: 5px;">
                    <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">查询</el-button>
                <el-button @click="handleGeneralSearch" size="small" type="primary" plain icon="el-icon-search">
                    {{moreSearchFlag?'普通' : '高级'}}搜索
                    </el-button>
                </el-col>
            </el-row>
            <el-row v-if="moreSearchFlag">
                <el-col :span="6">
                    <el-form-item label="仓库编号">
                        <el-input clearable size="small" v-model="searchFormObj.warehouseCode"
                                @keyup.enter.native="handleSearch"
                                placeholder="请输入仓库编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库管理员">
                    <el-input clearable size="small" v-model="searchFormObj.managerName"
                                @keyup.enter.native="handleSearch"
                                placeholder="请输入仓库管理员"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库物资描述">
                    <el-input clearable size="small" v-model="searchFormObj.materials"
                                @keyup.enter.native="handleSearch"
                                placeholder="请输入仓库存放主要物资描述"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="maintainCon">
      <div style="text-align:right;">
          <el-button @click="handleSearchAdd" size="small" type="primary"  icon="el-icon-search">添加</el-button>
          <el-button size="small" type="danger" plain icon="el-icon-search">提交</el-button>
          <el-button size="small" type="danger" plain icon="el-icon-search">流程监控</el-button>
          <el-button size="small" type="warning" plain icon="el-icon-search">打印</el-button>
          <el-button size="small" type="primary" plain icon="el-icon-search">导出</el-button>
      </div>
      <div class="maintainConTable">
        <el-table
            ref="maintainConTable"
            :data="WarehouseList"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{'background-color': '#fafafa'}"
            stripe
            border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="55">
              
            </el-table-column>
            <el-table-column
              label="流程状态"
             >
                  <template slot-scope="scope">
                      <span>{{scope.row.flowStatus | setStatus }}</span>
                  </template>
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
             >
            </el-table-column>
            <el-table-column
              prop="warehouseCode"
              label="仓库编号"
             >
            </el-table-column>
            <el-table-column
              prop="managerName"
              label="仓库管理员"
              >
            </el-table-column>
            <el-table-column
              prop="materials"
              label="仓库物资描述"
              >
            </el-table-column>
            <el-table-column
              prop="address"
              label="仓库地址"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              >
                 <template slot-scope="scope">
                    <el-button style="color:#409eff;" @click="handleClickEdit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button style="color:red;"  @click="handleClickDelete(scope.row)" type="text" size="small">删除</el-button>
                 </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
    <RightModal class="rightModal" v-show="RightModalFlag">
        <div slot="header">
          <p><span>添加</span>仓库维护</p>
        </div>
        <div slot="body">
          <el-form :rules="rules" :label-position="labelPosition" ref="ModalFormObj" :model="ModalFormObj" label-width="120px">
                <el-form-item label="项目名称" prop="projectId">
                    <el-select clearable  size="small" v-model="ModalFormObj.projectId"
                        placeholder="请选择项目名称">
                        <el-option v-for="(item,index) in ProjectsList" :key="index" :label="item.proName" :value="item.id"></el-option>
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库名称" prop="warehouseName">
                <el-input clearable size="small" v-model="ModalFormObj.warehouseName"
                            placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item label="仓库编号" prop="warehouseCode">
                <el-input clearable size="small" v-model="ModalFormObj.warehouseCode"
                          
                            placeholder="请输入仓库编号"></el-input>
                </el-form-item>
                  <p style="color:red;font-size:12px;padding-left: 55px;margin-bottom: 10px;">如果不输入仓库编号，则按照系统规则（流水号）进行编号</p>
                <el-form-item label="仓库物资描述" prop="materials">
                <el-input clearable size="small" v-model="ModalFormObj.materials"
                          
                            placeholder="请输入仓库存放主要物资描述"></el-input>
                </el-form-item>
                <el-form-item label="仓库管理员" prop="managerName">
                <el-input clearable size="small" v-model="ModalFormObj.managerName"
                         
                            placeholder="请输入仓库管理员"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址">
                <el-input clearable size="small" v-model="ModalFormObj.address"
                        
                            placeholder="请输入仓库地址"></el-input>
                </el-form-item>
                <el-form-item label="备注说明">
                  <el-input type="textarea" v-model="ModalFormObj.description"></el-input>
                </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button size="small" style="margin-right:30px;"  type="danger" @click="handleCancel" icon="el-icon-circle-check" plain>取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('ModalFormObj')" icon="el-icon-circle-check">保存</el-button>
        </div>
    </RightModal>
  </div>
</template>

<script>
  import Auth from 'util/auth'
  import {
    getWarehouseList,
    getDicdataStatus,
    getProjectsList,
    createWarehouseList,
    updateWarehouseList,
    deleteWarehouseList

    } from 'api/warehouseManagement/maintain'
  import RightModal from 'components/rightModal/rightModal'
  export default {
    name: 'maintain',
    data() {
      return {
        labelPosition: 'right',
        moreSearchFlag: false,
        WarehouseList: [],
        companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
        pageNo: 1,
        pageSize: 8,
        editerId:'',
        searchFormObj: {
          flowStatus: '',
          projectId: '',
          warehouseName: '',
          warehouseCode: '',
          managerName: '',
          materials: '',
          menuId: 230
        },
        moreSearchFlag: false,
        StatusList:[],
        ProjectsList:[],
        RightModalFlag:false,
        ModalFormObj:{
          address: "",
          description: "",
          managerName: "",
          materials: "",
          orgId: 342,
          projectId: "",
          warehouseCode: "",
          warehouseName: ""
        },
        rules: {
          projectId: [
            { required: true, message: '请输入项目', trigger: 'blur' }
          ],
           warehouseName: [
            { required: true, message: '请输入仓库名称', trigger: 'blur' }
          ],
           materials: [
            { required: true, message: '请输入仓库物资描述', trigger: 'blur' }
          ],
           managerName: [
            { required: true, message: '请输入仓库管理员', trigger: 'blur' }
          ]
        }
      }
    },
    components:{
      RightModal
    },
    created() {
      this._getWarehouseList()
      this._getDicdataStatus()
      this._getProjectsList()
    },
    methods: {
      //获取表格列表
      _getWarehouseList() {
        let data = {
          ...this.searchFormObj,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getWarehouseList(data).then(res => {
          console.log(res)
          this.WarehouseList = res.results.result
        })
      },
      //获取流程状态
      _getDicdataStatus(){
        getDicdataStatus(14,this.companyId,0).then(res=>{
           this.StatusList =  res.results
        })
      },
      //获取项目名称
      _getProjectsList(){
        getProjectsList().then(res=>{
          this.ProjectsList =  res.results.proProjectDtos
        })
      },
      //点击查询
      handleSearch() {
        this._getWarehouseList()
      },
       //普通查询
      handleGeneralSearch() {
        this.moreSearchFlag = !this.moreSearchFlag
      },
      //
      handleSelectionChange(){

      },
      //添加
      handleSearchAdd(){
        this.RightModalFlag = true;
        this.editerId = ""
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(this.editerId){
                let data = {
                  ...this.ModalFormObj
                }
                data.id = this.editerId
                updateWarehouseList(data).then(res=>{
                    console.log(res)
                    if(res.status === 0){
                      this.handleCancel()
                      this._getWarehouseList();
                      
                    }
                })
              }else{
                let data = {
                  ...this.ModalFormObj
                }
                createWarehouseList(data).then(res=>{
                    console.log(res)
                    if(res.status === 0){
                      this.handleCancel()
                      this._getWarehouseList();
                      
                    }
                })
              }
              
               
            
             
             
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      handleCancel(){
        this.RightModalFlag = false;
        this.ModalFormObj = {
          address: "",
          description: "",
          managerName: "",
          materials: "",
          orgId: 342,
          projectId: "",
          warehouseCode: "",
          warehouseName: ""
        }
      },
      //修改
      handleClickEdit(row){
        console.log(row);
        this.editerId = row.id;
        this.RightModalFlag = true;
        this.ModalFormObj.projectId = row.projectId;
        this.ModalFormObj.address = row.address;
        this.ModalFormObj.description = row.description;
        this.ModalFormObj.managerName = row.managerName;
        this.ModalFormObj.materials = row.materials;
        this.ModalFormObj.warehouseCode = row.warehouseCode;
        this.ModalFormObj.warehouseName = row.warehouseName;
       

        // this.editerId = 
      },
      //删除
      handleClickDelete(row){
         this.$confirm('此操作将删除该仓库维护记录文件, 是否继续?/n 删除后数据不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           deleteWarehouseList(row.id).then(res=>{
              if(res.status === 0){
                  this.RightModalFlag = false;
                  this._getWarehouseList();
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
          })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       
      },
      headerStyle({row, rowIndex}){
        if(rowIndex === 1){
          return 'bgColor'
        }else{
          return ''
        }
      }
    },
    filters:{
      setStatus(val){
        let arr = ['未审批','审批中','已审批']
        return val ? arr[Number(val)] : ''
      }
    }
  }
</script>
<style scoped lang="scss">

  .maintain{
      width: 100%;
      height: 100%;
      padding: 10px;
      background: #fff;
      display: flex;
      flex-direction: column;
      position: relative;
      .maintainSearch{
          width: 100%;
          height: 80px;
          padding: 0 20px;
          margin-bottom: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          height: auto;
          padding-bottom: 15px;
          &.active {
            
          }
      }
      .maintainCon{
          flex: 1;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          padding: 10px;
          .maintainConTable{
            margin-top: 10px;
            
          }
      }
      .rightModal{
        .el-form{
            padding-right: 60px;
            .el-select{
              width: 100%;
            }
        }
      }
  }
</style>
