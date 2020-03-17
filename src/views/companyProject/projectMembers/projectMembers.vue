<template>
  <div class="projectMembers">
    <div style="background:#fff;height:100%;">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="myProject">
            <div class="myProjectTitle"><span>我的项目</span></div>
            <div class="myProjectTable">
              <el-table
                border
                @row-click="handClickMyProjectTable"
                :data="myProjectTableData"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="proName"
                  label="项目名称"
                  show-overflow-tooltip
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  show-overflow-tooltip
                  label="所属公司">
                </el-table-column>
                <el-table-column
                  width="100"
                  prop="pmName"
                  label="项目经理">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="memberInformation">
            <div class="myProjectTitle"><span class="title">项目成员信息</span>
              <el-button size="small" @click="handleClickAdd" type="primary" icon="el-icon-plus">添加</el-button>
            </div>
            <div class="memberInformationTable">
              <el-table
                border
                :data="memberInformationTableData"
                style="width: 100%">
                <el-table-column
                  fixed
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="userName"
                  label="姓名"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="userCode"
                  show-overflow-tooltip
                  label="账号">
                </el-table-column>
                <el-table-column
                  prop="rolesNames"
                  show-overflow-tooltip
                  label="岗位">
                  <template slot-scope="scope">
                    <span>{{scope.row.rolesNames | setRolesNames}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="200" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <span style="color:orange" @click="handleViewPermissions(scope.row)">查看权限</span>
                    <span style="color:#248bfe" @click="handleEdit(scope.row)">修改</span>
                    <span style="color:red" @click="handleDelete(scope.row)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>

    <el-dialog :close-on-click-modal="false" class="ViewPermissions" center title="查看权限" height="80%" width="80%"
               :visible.sync="ViewPermissionsVisible">
      <viewPermissions-component :UserMenus="UserMenus" :loading="loading">
      </viewPermissions-component>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="projectMembers" center title="项目成员选择岗位" height="80%" width="80%"
               :visible.sync="projectMembersVisible">
      <project-members-component
        :projectMembersTableData="projectMembersTableData"
        :selectRolesTableData="selectRolesTableData"
        @selectRoles="selectRoles"
        @projectMembersVisibleCancel="projectMembersVisibleCancel"
        @projectMembersVisibleSubmit="projectMembersVisibleSubmit">
      </project-members-component>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="selectRoles" center title="选择岗位" width="60%"
               v-if="selectRolesVisible"
               :visible.sync="selectRolesVisible">
      <select-roles-component
        ref="multipleTable" :selectRolesTableData="selectRolesTableData"
        :selectRolesArr="selectRolesArr"
        @sendMultipleSelection="sendMultipleSelection"
        @selectRolesCancel="isSelectRolesCancel"
        @selectRolesSubmit="selectRolesSubmit">
      </select-roles-component>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="projectMemberAgain" center title="选择项目成员" width="80%"
               v-if="selectProjectMembersVisible"
               :visible.sync="selectProjectMembersVisible">
      <select-project-members-component
        :orgsList="orgsList" :defaultOrgId="defaultOrgId"
        @ToHandleNodeClick="ToHandleNodeClick"
        :selectUserListTableData="selectUserListTableData"
        @sendSelectSubmit="sendSelectSubmit">
      </select-project-members-component>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="projectMembersAgain" center title="项目成员选择岗位" width="80%"
               v-if="selectProjectMembersVisible5"
               :visible.sync="selectProjectMembersVisible5">
              <project-members2 @sendSelectRoles5="sendSelectRoles5" 
              :selectRolesTableData="selectRolesTableData"
              @selectRolesCancel5="selectRolesCancel5"
              @handelClickDelet5="handelClickDelet5"
              :multipleSelection5="multipleSelection5"
              @selectRolesSubmit5="selectRolesSubmit5"
              ></project-members2>
    </el-dialog>
    <!-- <el-dialog :close-on-click-modal="false" class="selectRolesAgain" center title="选择岗位" width="60%" v-if="selectRolesVisible6"
               :visible.sync="selectRolesVisible6">
              <select-roles-component2 :selectRolesTableData="selectRolesTableData"
              @selectRolesCancel6="selectRolesCancel6"
              @selectRolesSubmit6="selectRolesSubmit6"
              :selectArr="selectArr"
              @handleSelectionChange6="handleSelectionChange6"
              ></select-roles-component2>
    </el-dialog> -->
  </div>

</template>

<script>
  import Auth from 'util/auth'
  import {
    getPermissionProjects, getProjectsUsers, getUserMenus,
    getRolesProject, updateUserProject, deleteUserProject,
    getOrgsList, getDepartmentList, getRoleUsersList, createUserProject
  } from 'api/companyProject/projectMembers'
  import ViewPermissionsComponent from '../component/viewPermissionsComponent'
  import projectMembersComponent from '../component/projectMembersComponent'
  import selectRolesComponent from '../component/selectRolesComponent'
  import selectProjectMembersComponent from '../component/selectProjectMembersComponent'
  import projectMembers2 from '../component/projectMembers2'
  // import selectRolesComponent2 from '../component/selectRolesComponent2'
  

  export default {
    name: 'projectMembers',
    components: {
      ViewPermissionsComponent, projectMembersComponent, 
      selectRolesComponent, selectProjectMembersComponent,projectMembers2
    },
    data() {
      return {
        myProjectTableData: [],
        memberInformationTableData: [],
        ViewPermissionsVisible: false,
        UserMenus: [],
        loading: false,
        projectMembersVisible: false,
        selectRolesVisible: false,
        selectRolesTableData: [],
        projectMembersTableData: [],
        textarea: '',
        multipleSelection: [],
        tagArr: [],
        eventObj: {},
        projectId: '',
        orgId: '',
        selectProjectMembersVisible: false,
        orgsList: [],

        pageNo: 1,
        pageSize: 7,
        orgId4: '',
        selectUserListTableData: [],
        userInput: '',
        // multipleSelection4: [],
        multipleSelection5: [],
        selectProjectMembersVisible5: false,
        // selectRolesVisible6: false,
        multipleSelection6: [],
        selectRolesTableData6: [],
        cloneMultipleSelection4: [],
        eventItem: {},
        eventTableIndex: '',
        defaultOrgId: 0,
        selectRolesArr: [],
        params4: '',
        selectArr:[],
        selectRolesFlag:false
      }
    },
    created() {
      //   console.log(this);
      this._getPermissionProjects()
      this._getRolesProject()

    },
    mounted() {
      //  this.$nextTick(function(){

      //  })
      // if(this.orgsList[0].id){

      // }


    },
    methods: {

      //获取我的项目表格数据
      _getPermissionProjects() {
        getPermissionProjects().then(res => {
          this.myProjectTableData = res.results.proProjectDtos
          getProjectsUsers(this.myProjectTableData[0].id).then(res => {
            this.memberInformationTableData = res.results
            this.projectId = this.myProjectTableData[0].id
            this.orgId = this.myProjectTableData[0].orgId
          })
          // this.handClickMyProjectTable(this.myProjectTableData[0].id)
          // this.projectId = this.myProjectTableData[0].id
        })
      },
      //获取项目成员信息表格数据
      _getProjectsUsers(id) {
        getProjectsUsers(id).then(res => {
          this.memberInformationTableData = res.results

        })
      },
      // 点击我的项目表格行
      handClickMyProjectTable(row) {
        // console.log(row)
        this._getProjectsUsers(row.id)
        this.projectId = row.id
        this.orgId = row.orgId

      },
      //点击查看权限
      handleViewPermissions(row) {
        this.ViewPermissionsVisible = true;
        console.log(row)
        this.loading = true
        this._getUserMenus(row.id)
      },
      //修改
      handleEdit(row) {
        this.selectRolesFlag = false
        this.projectMembersVisible = true

        this.eventObj = JSON.parse(JSON.stringify(row))
        if (row.rolesNames.length) {
          let index = row.rolesNames.findIndex(v => v === '项目经理')
          if (index >= 0) {
            row.rolesNames.splice(index, 1)
          }
        }
        this.projectMembersTableData = [row]
        this._getRolesProject()
      },
      //获得multipleSelection
      sendMultipleSelection(val) {
        if(this.selectRolesFlag){//为真就是添加弹窗的选中角色
           this.multipleSelection6 = val;
        }else{//为false就是修改弹窗的选中角色
            this.multipleSelection = val;
        }
     
      },
      //
      selectRoles(arr) {
        this.selectRolesVisible = true
        this.selectRolesArr = arr

      },
      //删除
      handleDelete(row) {
        this.$confirm(`您确定删除${row.userName}项目成员吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        }).then(() => {
          let data = {
            companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
            orgId: this.orgId,
            projectId: this.projectId,
            remarks: row.remarks,
            userCode: row.userCode,
            userId: row.id,
            userName: row.userName
          }
          deleteUserProject(data).then(res => {
            if (res.status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            } else {
              this.$message({
                type: 'info',
                message: res.errorMessage
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
      ////获取权限弹窗信息
      _getUserMenus(id) {
        getUserMenus(id).then(res => {
          this.loading = false
          this.UserMenus = this.setArr(res.results)

        })
      },
      //
      _getRolesProject() {
        getRolesProject().then(res => {
          if (res.results.length) {

            this.selectRolesTableData = res.results

          }

        })
      },


      //选择岗位确定
      selectRolesSubmit() {
        if(this.selectRolesFlag){
           console.log(this.multipleSelection6)
          let Arr = JSON.parse(JSON.stringify(this.multipleSelection6))
          let userName = this.multipleSelection5[this.eventTableIndex].userName;
          this.multipleSelection5[this.eventTableIndex].userName = '小仙女';
          this.multipleSelection5[this.eventTableIndex].userName = userName;
          // this.multipleSelection5[this.eventTableIndex].rolesArr = Arr.map(v => v.rolesName)
          this.$set(this.multipleSelection5[this.eventTableIndex], 'rolesArr', Arr.map(v => v.rolesName))
          // this.eventItem.rolesArr = Arr.map(v=>v.rolesName)
          this.selectRolesVisible = false;
          console.log(this.multipleSelection5)
          //    console.log(this.eventItem)
          // this.projectMembersTableData[0].rolesNames = Arr.map(v=>v.rolesName)
          // this.selectRolesVisible = false;
          this.$forceUpdate();
        }else{
            let Arr = JSON.parse(JSON.stringify(this.multipleSelection))
            this.projectMembersTableData[0].rolesNames = Arr.map(v => v.rolesName)
            this.selectRolesVisible = false;
        }
      

      },
      isSelectRolesCancel() {
        this.selectRolesVisible = false;
      },
      //弹窗2 确定
      projectMembersVisibleSubmit() {
        this.projectMembersVisible = false;
        let roleIds = []
        for (var i = 0; i < this.selectRolesTableData.length; i++) {
          for (let j = 0; j < this.projectMembersTableData[0].rolesNames.length; j++) {
            if (this.selectRolesTableData[i].rolesName == this.projectMembersTableData[0].rolesNames[j]) {
              roleIds.push(this.selectRolesTableData[i].roleId)
            } else {
              //  this.selectRolesTableData[i].checked = false
            }
          }
        }
        let data = {
          companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
          orgId: this.orgId,
          projectId: this.projectId,
          remarks: this.projectMembersTableData[0].remarks,
          roleIds,
          userId: this.projectMembersTableData[0].id,
        }
        updateUserProject(data).then(res => {
          if (res.status === 0) {
            getProjectsUsers(this.projectId).then(res => {
              this.memberInformationTableData = res.results
            })
          }

        })
      },
      //弹窗2 取消
      projectMembersVisibleCancel() {
        this.projectMembersTableData[0].rolesNames = this.eventObj.rolesNames
        this.projectMembersTableData[0].remarks = this.eventObj.remarks
        this.projectMembersVisible = false;
      },
      // handleSelectionChange(val) {
      //   // console.log(val)
      //   this.multipleSelection = val;
      // },
      //添加项目成员
      handleClickAdd() {
        this.selectRolesFlag = true
        this.selectProjectMembersVisible = true
        this.orgsList = []
        getOrgsList().then(res => {
          // this.orgsList = res.results.filters(v=>v.orgAttribute === '01')
          // this.orgsList[0].children = []
          // this.orgsList[0].children.push(res.results.filters(v=>v.orgAttribute !== '01'))
          for (let i in res.results) {
            let item = res.results[i]
            if (item.orgAttribute === '01') {
              item.children = []
              this.orgsList.push(item)
            }
          }
          for (let i in res.results) {
            let item = res.results[i]
            if (item.orgAttribute !== '01') {
              this.orgsList[0].children.push(item)
            }
          }
          console.log(this.orgsList)
          //   this.orgsList = res.results
          this.defaultOrgId = Number(this.orgsList[0].id)
          this.orgId4 = this.orgsList[0].id

          this._getRoleUsersList('')
        })
      },
      //获得
      ToHandleNodeClick(row) {
        this.orgId4 = row.id
        this._getRoleUsersList('')
      },
      //
      _getRoleUsersList(params4) {
        this.params4 = params4
        let data = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          orgId: this.orgId4,
          params: this.params4
        }
        getRoleUsersList(data).then(res => {
          this.selectUserListTableData = res.results.result
        })
      },
      // sendHandleSelectionChange4(val) {
       
      // },
      // sendRowClick4(row){
      //     console.log(row)
      //     let index = this.multipleSelection4.findIndex(v=>v.userId === row.userId)
      //     if(index>=0){
      //             this.$refs.multipleTable4.toggleRowSelection(row,false);
      //     }else{
      //       //    this.multipleSelection4.push(row);
      //           this.$refs.multipleTable4.toggleRowSelection(row);
      //     }

      // },

      //点击确认选择按钮
      sendSelectSubmit(arr) {
        console.log(arr)
        this.selectProjectMembersVisible5 = true;
        this.cloneMultipleSelection4 = JSON.parse(JSON.stringify(arr))//保存一份
        this.multipleSelection5 = JSON.parse(JSON.stringify(arr))//保存一份
        for (let i in this.multipleSelection5) {
          let item = this.multipleSelection5[i]
          item.rolesArr = []
        }

      },
      handelClickDelet5(index){
          this.multipleSelection5.splice(index, 1)
      },
      //取消
      selectRolesCancel5() {
        this.selectProjectMembersVisible5 = false;
        this.multipleSelection4 = this.cloneMultipleSelection4
      },
      //确定
      selectRolesSubmit5() {
        if (!this.multipleSelection5.length) {
          this.$message.error('请选择要添加的项目成员');
          return
        }

        let userProjectReqDtos = []
        for (let i in this.multipleSelection5) {
          let item = this.multipleSelection5[i]
          if (!item.rolesArr.length) {
            this.$message.error(`${item.userName}没有设置岗位,无法保存`);
            return
          }
          let obj = {
            companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
            orgId: this.orgId,
            projectId: this.projectId,
            remarks: item.remarks,
            userId: item.userId,
            roleIds: this.setRoleIdArr(item.rolesArr)
          }
          userProjectReqDtos.push(obj)
        }
        let data = {
          userProjectReqDtos
        }
        createUserProject(data).then(res => {
          if (res.status === 0) {
            this.selectProjectMembersVisible5 = false;
            this.selectProjectMembersVisible = false;
            getProjectsUsers(this.projectId).then(res => {
              this.memberInformationTableData = res.results
            })
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          } else {
            this.$message.error(res.errorMessage);
          }

        })
        // let Arr =  JSON.parse(JSON.stringify(this.multipleSelection))
        // this.projectMembersTableData[0].rolesNames = Arr.map(v=>v.rolesName)

      },
      //转换为id 的数组
      setRoleIdArr(arr) {
        let newArr = []
        for (let i = 0; i < this.selectRolesTableData.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (this.selectRolesTableData[i].rolesName === arr[j]) {
              newArr.push(this.selectRolesTableData[i].roleId)
            } else {

            }
          }
        }
        return newArr
      },
      
      
      sendSelectRoles5(row){
        this.selectRolesArr = row.arr
         this.eventTableIndex = row.index
          // this.selectRolesVisible6 = true
          this.selectRolesVisible = true
      },
      setArr(arr) {
        for (let i in arr) {
          let item = arr[i]
          item.checked = true
          item.flag = Number(i) === 0 ? true : false
          item.disabled = true
          if (item.children && item.children.length) {
            this.setArr(item.children)
          }
        }
        return arr
      },


    },
    filters: {
      setRolesNames(val) {
        if (val.length) {
          return val.join('、')
        } else {
          return ''
        }
      },
      setRolesList(val) {
        // console.log(val)
        if (val && val.length) {
          return val.map(v => v.rolesName).join('、')
        } else {
          return ' '
        }

      },
    }

  }
</script>
<style scoped lang="scss">
  .projectMembers {
    padding: 10px;
    width: 100%;
    height: 100%;
    // background: #fff;
    .myProject {
      width: 100%;
      border: 1px solid #ddd;
      margin-right: 20px;
      padding: 10px;
      .myProjectTitle {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .myProjectTable {
        height: calc(100% - 60px);
        border: 1px #ddd solid;
      }
    }
    .memberInformation {
      width: 100%;
      border: 1px solid #ddd;
      padding: 10px;
      .myProjectTitle {
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        button {
          height: 40px;
          margin-top: 10px;
        }
      }
      .memberInformationTable {
        height: calc(100% - 60px);
        border: 1px #ddd solid;

      }
    }

  }
</style>
