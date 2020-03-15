<template>
  <div class="projectMembers">
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
    <el-dialog :close-on-click-modal="false" class="one" center title="查看权限" height="80%" width="80%"
               :visible.sync="ViewPermissionsVisible">
      <div class="tableHeader">
        <div class="functionMenu">功能菜单</div>
        <div class="operationButton">操作按钮</div>
      </div>
      <div class="tableMain" v-loading="loading">

        <ul>
          <li v-for="item in UserMenus" :key="item.id" class="height40">
            <div class="firstLi">
              <div class="left">
                <i @click="handleExpand(item)" :class="item.flag ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>{{item.resName}}
              </div>
              <div class="right">
                <el-checkbox :disabled="item.disabled" v-model="item.checked">所有</el-checkbox>
              </div>
            </div>
            <ul class="secondUL" :class="item.flag ? 'active' : ''">
              <li v-for="child in item.children" :key="child.id" class="secondLi">
                <div class="left">
                  <el-checkbox :disabled="item.disabled" v-model="child.checked">{{child.resName}}</el-checkbox>
                </div>
                <div class="right">
                  <ul>
                    <li v-for="threeChild in child.children" :key="threeChild.id">
                      <el-checkbox :disabled="item.disabled" v-model="threeChild.checked">{{threeChild.resName}}
                      </el-checkbox>
                    </li>

                  </ul>
                </div>
              </li>
            </ul>

          </li>

        </ul>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="two" center title="项目成员选择岗位" height="80%" width="80%"
               :visible.sync="projectMembersVisible">
      <el-table
        border
        :data="projectMembersTableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          show-overflow-tooltip
          width="80">
        </el-table-column>
        <el-table-column
          prop="userCode"
          width="100"
          show-overflow-tooltip
          label="电话">
        </el-table-column>
        <el-table-column

          prop="rolesNames"
          label="选择岗位">
          <template slot-scope="scope">

            <el-tag
              v-if="scope.row.rolesNames.length"
              :key="tag"
              v-for="tag in scope.row.rolesNames"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(scope.row.rolesNames,tag)">
              {{tag}}
            </el-tag>
            <el-button size="small" @click="selectRoles(scope.row.rolesNames)" icon="el-icon-plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="remarks"
          label="备注">
          <template slot-scope="scope">
            <el-input
              style="height:40px;"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="scope.row.remarks">
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="projectMembersVisibleCancel">取 消</el-button>
        <el-button type="primary" @click="projectMembersVisibleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="three" center title="选择岗位" width="60%" v-if="selectRolesVisible"
               :visible.sync="selectRolesVisible">
      <el-table
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="selectRolesTableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="rolesName"
          show-overflow-tooltip
          label="岗位名称">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="selectRolesCancel">取 消</el-button>
        <el-button type="primary" @click="selectRolesSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="four" center title="选择项目成员" width="80%"
               v-if="selectProjectMembersVisible"
               :visible.sync="selectProjectMembersVisible">
      <div class="selectProjectMembers">
        <div class="treeCon">
          <el-tree ref="tree" lazy node-key="id" v-if="orgsList" :props="defaultProps"
                   :data="orgsList" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{node,data}">
                  <!-- <span>{{node}}</span> -->
                <!-- <span>{{data}}</span> -->
                <span
                  class="data.orgAttribute === '01' ? '' : data.orgAttribute === '02' ? 'pad10' : 'pad20'">
                  {{ data.orgName || data.departmentName }}
                  <span>
                    {{data.orgAttribute === '01' ? '(总公司)' : data.orgAttribute === '02' ? '(分公司)' : '(部门)'}}
                  </span>
                </span>
              </span>
          </el-tree>
        </div>
        <div class="membersList">
          <p class="title">企业用户列表</p>
          <div class="searchCon">
            <el-input class="input" @change="_getRoleUsersList" size="small" v-model="params4"
                      placeholder="请输入姓名/手机号查询"></el-input>
            <el-button class="btn" @click="_getRoleUsersList" size="small" type="warning">查询</el-button>
          </div>
          <el-table
            border
            ref="multipleTable4"
            @selection-change="handleSelectionChange4"
            :data="selectUserListTableData"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="userName"
              show-overflow-tooltip
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="userCode"
              show-overflow-tooltip
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="roles"
              show-overflow-tooltip
              label="所属岗位">
              <template slot-scope="scope">
                <span>{{scope.row.roles | setRolesList}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="selectMembersList">
          <p class="title">已选用户</p>
          <div class="selectTabelCon">
            <el-button @click="selectSubmit" class="btn" size="small" type="warning">确认选择</el-button>
          </div>
          <div>
            <el-table
              border
              :data="multipleSelection4"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                prop="userName"
                show-overflow-tooltip
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="userCode"
                show-overflow-tooltip
                label="手机号">
              </el-table-column>
              <el-table-column
                prop="roles"
                show-overflow-tooltip
                label="所属岗位">
                <template slot-scope="scope">
                  <span>{{scope.row.roles | setRolesList}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                show-overflow-tooltip
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleClickDelet(scope.row)" type="text" size="small">删除</el-button>

                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="five" center title="项目成员选择岗位" width="80%"
               v-if="selectProjectMembersVisible5"
               :visible.sync="selectProjectMembersVisible5">
      <el-table
        border
        close-on-click-modal="false"
        :data="multipleSelection5"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          show-overflow-tooltip
          width="80">
        </el-table-column>
        <el-table-column
          prop="userCode"
          width="100"
          show-overflow-tooltip
          label="电话">
        </el-table-column>
        <el-table-column

          prop="roles"
          label="选择岗位">
          <template slot-scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.rolesArr"
              closable
              :disable-transitions="false"
              @close="handleCloseTag5(scope.row,tag)">
              {{tag}}
            </el-tag>
            <el-button size="small" @click="selectRoles5(scope.$index,scope.row.rolesArr)"
                       icon="el-icon-plus">
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="remarks"
          label="备注">
          <template slot-scope="scope">
            <el-input
              style="height:40px;"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="scope.row.remarks">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop=""
          label="操作">
          <template slot-scope="scope">
            <span style="color:red" @click="handelClickDelet5(scope.$index,scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="selectRolesCancel5">取 消</el-button>
        <el-button type="primary" @click="selectRolesSubmit5">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="six" center title="选择岗位" width="60%" v-if="selectRolesVisible6"
               :visible.sync="selectRolesVisible6">
      <el-table
        border
        ref="multipleTable6"
        @selection-change="handleSelectionChange6"
        :data="selectRolesTableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="rolesName"
          show-overflow-tooltip
          label="岗位名称">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="selectRolesCancel6">取 消</el-button>
        <el-button type="primary" @click="selectRolesSubmit6">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Auth from 'util/auth'
  import {
    getPermissionProjects, getProjectsUsers, getUserMenus,
    getRolesProject, updateUserProject, deleteUserProject,
    getOrgsList, getDepartmentList, getRoleUsersList, createUserProject
  } from 'api/companyProject/projectMembers'

  export default {
    name: 'projectMembers',
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
        defaultProps: {
          label: function(node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        pageNo: 1,
        pageSize: 7,
        orgId4: '',
        params4: '',
        selectUserListTableData: [],
        userInput: '',
        multipleSelection4: [],
        multipleSelection5: [],
        selectProjectMembersVisible5: false,
        selectRolesVisible6: false,
        multipleSelection6: [],
        selectRolesTableData6: [],
        cloneMultipleSelection4: [],
        eventItem: {},
        eventTableIndex: '',


      }
    },
    created() {
      console.log(this);
      this._getPermissionProjects()
      this._getRolesProject()
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
      //选择岗位
      selectRoles(arr) {

        this.selectRolesVisible = true
        this.$nextTick(function () {
          for (var i = 0; i < this.selectRolesTableData.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (this.selectRolesTableData[i].rolesName == arr[j]) {
                this.$refs.multipleTable.toggleRowSelection(this.selectRolesTableData[i]);
                //  this.selectRolesTableData[i].checked = true
              } else {
                //  this.selectRolesTableData[i].checked = false
              }
            }
          }
        })
        // this.$refs.multipleTable.clearSelection();


      },
      handleCloseTag(arr, item) {
        // console.log(arr)
        let index = arr.findIndex(v => v === item)
        if (index >= 0) {
          arr.splice(index, 1)
        }

      },
      //选择岗位确定
      selectRolesSubmit() {
        // console.log(this.multipleSelection)
        let Arr = JSON.parse(JSON.stringify(this.multipleSelection))
        this.projectMembersTableData[0].rolesNames = Arr.map(v => v.rolesName)
        this.selectRolesVisible = false;

      },
      selectRolesCancel() {
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
      handleSelectionChange(val) {
        // console.log(val)
        this.multipleSelection = val;
      },
      //添加项目成员
      handleClickAdd() {
        this.selectProjectMembersVisible = true
        getOrgsList().then(res => {
          // for (let i in res.results) {
          //   let item = res.results[i]
          //   if (item.children && item.children.length) {
          //     item.leaf = false
          //   } else {
          //     item.leaf = true
          //   }
          // }
          this.orgsList = res.results

        })
      },
      //tree点击展开
      handleNodeClick(row) {
        // console.log(row)
        // return
        this.orgId4 = row.id
        getDepartmentList(row.id).then(res => {
          let departmentList = res.results

          for (let i in departmentList) {
            let item = departmentList[i]
            if (item.children && item.children.length) {
              item.leaf = false
            } else {
              item.leaf = true
            }
          }
          if (departmentList.length) {
            let index = this.orgsList.findIndex(v => v.id === row.id)
            if (index >= 0) {
              this.orgsList[index].leaf = false
            }
          }

          this.$refs.tree.updateKeyChildren(row.id, departmentList)//更新node-key的子节点
          // console.log(this.orgsList)
          this._getRoleUsersList()
        })
      },
      //
      _getRoleUsersList() {
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
      //
      handleSelectionChange4(val) {
        // console.log(val)
        this.multipleSelection4 = val;
      },
      //删除选中的
      handleClickDelet(row) {
        let index = this.multipleSelection4.findIndex(v => v.id === row.id)
        if (index >= 0) {
          this.multipleSelection4.splice(index, 1)
          this.$refs.multipleTable4.toggleRowSelection(row, false);
          //  this.multipleSelection4 = this.multipleSelection4;
        }
      },
      //点击确认选择按钮
      selectSubmit() {
        this.selectProjectMembersVisible5 = true;
        this.cloneMultipleSelection4 = JSON.parse(JSON.stringify(this.multipleSelection4))//保存一份
        this.multipleSelection5 = JSON.parse(JSON.stringify(this.multipleSelection4))//保存一份
        for (let i in this.multipleSelection5) {
          let item = this.multipleSelection5[i]
          item.rolesArr = []
        }

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
      //成员选择岗位删除
      handelClickDelet5(index, item) {
        this.multipleSelection5.splice(index, 1)
      },
      //选择岗位
      selectRoles5(index, arr) {
        console.log(index)
        console.log(arr)
        this.eventTableIndex = index
        this.selectRolesVisible6 = true
        this.$nextTick(function () {
          for (var i = 0; i < this.selectRolesTableData.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (this.selectRolesTableData[i].rolesName === arr[j]) {
                this.$refs.multipleTable6.toggleRowSelection(this.selectRolesTableData[i]);
                //  this.selectRolesTableData[i].checked = true
              } else {
                //  this.selectRolesTableData[i].checked = false
              }
            }
          }
        })
        // this.$refs.multipleTable.clearSelection();


      },
      handleCloseTag5(row, item) {
        // console.log(arr)
        let index = row.rolesArr.findIndex(v => v === item)
        if (index >= 0) {
          row.rolesArr.splice(index, 1)
        }
        let userName = row.userName
        row.userName = "123"
        row.userName = userName
        console.log(arr)

      },
      handleSelectionChange6(val) {
        console.log(val)
        this.multipleSelection6 = val;
      },
      selectRolesSubmit6() {
        console.log(this.multipleSelection6)
        let Arr = JSON.parse(JSON.stringify(this.multipleSelection6))
        let userName = this.multipleSelection5[this.eventTableIndex].userName;
        this.multipleSelection5[this.eventTableIndex].userName = '小仙女';
        this.multipleSelection5[this.eventTableIndex].userName = userName;
        // this.multipleSelection5[this.eventTableIndex].rolesArr = Arr.map(v => v.rolesName)
        this.$set(this.multipleSelection5[this.eventTableIndex], 'rolesArr', Arr.map(v => v.rolesName))
        // this.eventItem.rolesArr = Arr.map(v=>v.rolesName)
        this.selectRolesVisible6 = false;
        console.log(this.multipleSelection5)
        //    console.log(this.eventItem)
        // this.projectMembersTableData[0].rolesNames = Arr.map(v=>v.rolesName)
        // this.selectRolesVisible = false;
        this.$forceUpdate();
      },
      selectRolesCancel6() {
        this.selectRolesVisible6 = false;
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

      handleExpand(item) {
        item.flag = !item.flag
      }

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
    display: flex;
    padding: 10px;
    width: 100%;
    height: 100%;
    background: #fff;
    .myProject {
      flex: 1;
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
      flex: 1.5;
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
    .tableHeader {
      display: flex;
      height: 50px;
      line-height: 50px;
      background: #f8f8f9;
      .functionMenu {
        text-align: center;
        flex: 1;
        border-left: 1px #eee solid;
        border-bottom: 1px #eee solid;
        border-top: 1px #eee solid;
      }
      .operationButton {
        text-align: center;
        flex: 1.3;
        border-left: 1px #eee solid;
        border-bottom: 1px #eee solid;
        border-top: 1px #eee solid;
      }
    }
    .tableMain {
      .height40 {

        .firstLi {
          display: flex;
          // padding-left: 10px;
          border-left: 1px #eee solid;
          border-bottom: 1px #eee solid;
          height: 40px;
          line-height: 40px;
          .left {
            flex: 1;
            // padding-left: 10px;
            border-right: 1px #eee solid;
            i {
              margin-right: 10px;
              padding-left: 10px;
            }
          }
          .right {
            flex: 1.3;
            label {
              padding-left: 20px;
            }
          }
        }
      }
      .secondUL {
        width: 100%;
        display: none;
        // padding-left: 10px;
        .secondLi {
          display: flex;
          border-left: 1px #eee solid;
          border-bottom: 1px #eee solid;
          //  height: 40px;
          // line-height: 40px;
          .left {
            flex: 1;
            border-right: 1px #eee solid;
            padding: 10px 0;
            label {
              margin-left: 25px;
            }
          }
          .right {
            flex: 1.3;
            overflow: hidden;
            li {
              label {
                padding-left: 10px;
              }
              display: inline-block;
              float: left;
              padding: 10px;
            }
          }
        }
        &.active {
          display: block;
        }
      }
    }
    .selectProjectMembers {
      width: 100%;
      display: flex;
      padding: 20px;
      .treeCon {
        width: 200px;
        border: 1px #fafafa solid;
        margin-right: 10px;
        &.pad10 {
          padding-left: 10px;
        }
        &.pad20 {
          padding-left: 20px;
        }
      }
      .membersList {
        flex: 1;
        border: 1px #fafafa solid;
        padding: 5px;
        .title {
          border-bottom: 1px solid #fafafa;
          height: 40px;
          line-height: 40px;
        }
        .searchCon {
          overflow: hidden;
          height: 50px;
          padding-top: 10px;
          .input {
            float: left;
            width: 300px;
          }
          .btn {
            float: right;
            width: 100px;
          }
        }

      }
      .selectMembersList {
        flex: 1;
        border: 1px #fafafa solid;
        .title {
          border-bottom: 1px solid #fafafa;
          height: 40px;
          line-height: 40px;
        }
        .selectTabelCon {
          overflow: hidden;
          height: 50px;
          padding-top: 10px;
          .btn {
            float: right;
          }
        }
      }
    }
  }
</style>
