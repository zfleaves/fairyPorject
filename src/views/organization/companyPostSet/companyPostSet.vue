<template>
  <div class="companyPostSet">
    <h4>岗位设置主要用于区分菜单权限和操作按钮权限。岗位分类在一定条件下决定数据查询权限规则。<a href="javaScript:;">查看详细规则说明</a></h4>
    <div class="companyPostSetCon">
      <el-row :gutter="20" style="height:100%;">
        <el-col :span="rightModalShow?12:24" style="height:100%;">
          <div class="JobList">
            <div class="JobListTitle">
              <span>岗位列表</span>
              <el-button type="primary" icon="el-icon-plus" size="small">添加岗位</el-button>
            </div>
            <div class="JobListTable">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="rolesName"
                  label="岗位名称"
                >
                </el-table-column>
                <el-table-column
                  prop="rolesCode"
                  label="岗位编号">
                </el-table-column>
                <el-table-column
                  label="岗位分类">
                  <template slot-scope="scope">
                    <span>{{scope.row.rolesType | setRolesTypeSele}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="projectName"

                  label="所属项目">
                </el-table-column>
                <el-table-column

                  label="岗位成员">
                  <template slot-scope="scope">
                    <span>{{scope.row.userNames | setPostMembers}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  width="160"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleClickToGrantAuthorization(scope.row)" type="text" size="small">授权
                    </el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                    <el-button type="text" @click.stop.prevent="handleDel(row)" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-if="rightModalShow" style="height:100%;">
          <transition name="move">
            <div class="ListOfPermissions">
              <div class="ListOfPermissionsTitle">
                <span>权限列表</span>
                <div>
                  <el-button @click="handleCLose" plain icon="el-icon-close" size="small">关闭</el-button>
                  <el-button type="primary" icon="el-icon-check" @click="handleSave" size="small">保存权限</el-button>
                </div>
              </div>
              <div class="JobListTable">
                <Jurisdiction :admin-data="adminData">
                </Jurisdiction>
              </div>
            </div>
          </transition>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {
    getCompanyRoles,
    getCompanyMenusTreeList,
    roleMenusTreeCheckd,
    roleRolemenusRelation
  } from 'api/organization/companyPostSet'
  import Jurisdiction from '../componet/jurisdiction'

  export default {
    name: 'companyPostSet',
    components: {
      Jurisdiction
    },
    data() {
      return {
        pageNo: 1,
        pageSize: 10,
        tableData: [],
        rightModalShow: true,
        adminData: [],
        adminData1: [],
        currentIndex: '',
        roleId: '',
      }
    },
    async created() {
      await  this._getCompanyRoles();
      // await  this._getCompanyMenusTreeList()
    },
    watch: {
      currentIndex() {
        this.adminData = JSON.parse(JSON.stringify(this.adminData1))
        this.getCheckdTree();
      }
    },
    methods: {
      _getCompanyRoles() {
        console.log(1111111)
        getCompanyRoles(this.pageNo, this.pageSize).then(res => {
          console.log(res)
          this.tableData = JSON.parse(JSON.stringify(res.results.roles));
          this._getCompanyMenusTreeList();
        })
      },
      handleClick(item) {

      },
      //授权
      handleClickToGrantAuthorization(item) {
        console.log(item)
        this.currentIndex = item.roleId;
        this.roleId = item.roleId;
        this.rightModalShow = true;
      },
      handleCLose() {
        this.rightModalShow = false;
      },
      //查询企业能看的菜单资源
      _getCompanyMenusTreeList() {
        getCompanyMenusTreeList().then(res => {
          console.log(res)
          for (let i in res.results) {
            let item = res.results[i];
            item.firstCheckAll = false;
            item.isIndeterminate = false;
            item.checkedList = [];
            item.buttonList = [];
            item.folded = Number(i) === 0;
            for (let j in item.children) {
              let child = item.children[j];
              child.checkAll = false;
              child.isIndeterminate = false;
              child.checkedList = [];
              child.buttonList = JSON.parse(JSON.stringify(child.children));
            }
          }
          this.adminData = JSON.parse(JSON.stringify(res.results));
          this.adminData1 = JSON.parse(JSON.stringify(res.results));// 用于重置勾选数据

          this.currentIndex = this.tableData[0].roleId;
          this.roleId = this.tableData[0].roleId;
        })
      },
      // 获取 已经勾选的树形带单
      getCheckdTree() {
        let arr1 = [];
        console.log(this.roleId)
        roleMenusTreeCheckd(this.roleId).then(res => {
          let arr = this.setAdmindata(res.results);
          this.checkedTree(arr);

        })
      },
      checkedTree(arr) {
        console.log(arr);  // 已经勾选的数组
        for (let i in arr) {
          let item = arr[i];
          // 找到勾选对应的整个勾选框的索引号 =》 比如项目仓库 为 7
          let index = this.adminData.findIndex(v => v.path === item.path);
          let first = this.adminData[index]; // this.adminData 第一层
          if (typeof first.isIndeterminate === 'undefined') {
            this.$set(first, 'isIndeterminate', false);
          }
          if (typeof first.firstCheckAll === 'undefined') {
            this.$set(first, 'firstCheckAll', false);
          }
          for (let j in item.children) {
            let child = item.children[j];
            // 找到勾选对应的项目仓库索引号 =》 "比如仓库创建维护" 为 0
            let secondIndex = first.children.findIndex(v => v.path === child.path);
            let second = first.children[secondIndex]; // this.adminData 第二层
            if (typeof second.isIndeterminate === 'undefined') {
              this.$set(second, 'isIndeterminate', false);
            }
            if (typeof second.checkedList === 'undefined') {
              this.$set(second, 'checkedList', []);
            }
            if (typeof second.checkAll === 'undefined') {
              this.$set(second, 'checkAll', true);
            }
            second.checkedList = child.buttonList.map(v => v.id);  //child.buttonList  是我们返回勾选的按钮
            second.checkAll = child.buttonList.length === second.buttonList.length; // second.buttonList 所有的按钮
            second.isIndeterminate = child.buttonList.length > 0 && child.buttonList.length < second.buttonList.length;
          }
          let checkLList = first.children.map(v => v.checkedList.length); //this.adminData  内层循环完 后 勾选按钮的数组的长度
          let checkLListLength = checkLList.reduce((preValue, curValue) =>
            preValue + curValue
          )
          // 所有子按钮的长度
          let buttonList = first.children.map(v => v.buttonList.length);  //this.adminData  内层循环完 后 所有按钮的数组的长度
          let buttonListLentgh = buttonList.reduce((preValue, curValue) =>
            preValue + curValue
          )
          // 判断所有勾选
          first.firstCheckAll = checkLListLength === buttonListLentgh;
          first.isIndeterminate = checkLListLength > 0 && checkLListLength < buttonListLentgh
        }
        console.log(this.adminData);
      },

      setAdmindata(arr) {
        if (arr.length === 0) return;
        for (let i in arr) {
          let item = arr[i];
          item.checkedList = [];
          item.buttonList = [];
          item.title = item.resName;
          if (item.children && item.children.length) {
            for (let j in item.children) {
              let child = item.children[j];
              child.buttonList = child.children.slice();
              child.title = child.resName;
              child.checkedList = [];
              for (let k in child.buttonList) {
                child.buttonList[k].name = child.buttonList[k].resName;
              }
              child.children = [];
            }
          }
        }
        return arr;
      },
      // 保存
      handleSave() {
        let menusIds = [];
        let parentIds = [];
        for (let i in this.adminData) {
          let item = this.adminData[i];
          if (item.firstCheckAll || item.isIndeterminate) {
            menusIds.push(item.id);
            for (let j in item.children) {
              let child = item.children[j];
              if (child.checkAll || child.isIndeterminate) {
                menusIds.push(child.id);
                menusIds = menusIds.concat(child.checkedList);
              }
            }
          }
        }

         this.roleRolemenus(menusIds)
        // for (let i = 0; i < this.adminData.length; i++) {
        //   let item = this.adminData[i];
        //   if (item.firstCheckAll) {
        //     menusIds.push(item.id);
        //     if (item.children && item.children.length) {
        //       for (let k = 0; k < item.children.length; k++) {
        //         let child = item.children[k];
        //         menusIds.push(item.children[k].id);
        //         for (let k in child.checkedList) {
        //           menusIds.push(child.checkedList[k]);
        //         }
        //       }
        //     }
        //   } else {
        //     for (let j = 0; j < item.children.length; j++) {
        //       let child = item.children[j];
        //       if (child.buttonList.length === 0 && child.checkAll) {
        //         menusIds.push(child.id);
        //         menusIds.push(item.id);
        //       } else {
        //         if (child.checkedList && child.checkedList.length) {
        //           menusIds.push(child.id);
        //           if (!parentIds.some(v => v === item.id)) {
        //             parentIds.push(child.parentId);
        //           }
        //           for (let k in child.checkedList) {
        //             menusIds.push(child.checkedList[k]);
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        // for (let i in parentIds) {
        //   menusIds.push(parentIds[i]);
        // }
       
      },
      // 角色和权限相关联
      roleRolemenus(menus) {
        console.log(menus);
        roleRolemenusRelation(menus, this.roleId).then(res => {
          if (!res.status) {
            this.$message({
              type: 'success',
              message: '关联成功!'
            });
            this.rightModalShow = false;
          }
        }).catch(e => {
          this.$message({
            type: 'error',
            message: e.errorMessage || '关联失败'
          });
        })
      },
      // 删除角色
      handleDel(row) {
        this.currentIndex = row.roleId;
        this.roleId = row.roleId;
        this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          roleDelete(row.roleId).then(res => {
            if (res.status === 0) {
              this.getRoleList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              let code = res.results.code
              if (code === 10001021) {
                this.$message({
                  type: 'error',
                  message: res.errorMessage || '此角色下有关联的用户，无法删除，请先解除关联后删除'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败'
                });
              }
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e.errorMessage || '服务繁忙'
            });
          })
        })
      },
      // 点击修改
      handleClick(rows) {
        // if(rows.projectId === -1) rows.projectId = ''
        // // this.rowsUpdate = rows;
        // this.currentIndex = rows.roleId;
        // this.roleId = rows.roleId;
        // this.dialogRoleUpdate = true
      },
    },
    filters: {
      setPostMembers(val) {
        return val ? val.join(',') : ''
      },
      setRolesTypeSele(val) {
        return val ? val === '01' ? '项目岗位' : '公司岗位' : ''
      }
    }
  }
</script>
<style scoped lang="scss">
  .companyPostSet {
    padding: 20px;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    h4 {
      font-size: 14px;
      a {
        text-decoration: none;
        color: #3e75ff;
        margin-left: 10px;
      }
    }
    .companyPostSetCon {
      width: 100%;
      /*display: flex;*/
      margin-top: 10px;
      height: 100%;
      padding-bottom: 30px;
      .JobList {
        flex: 1;
        height: 100%;
        border: 1px #ccc solid;
        margin-right: 10px;
        padding: 10px;
        .JobListTitle {
          height: 40px;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }
        .JobListTable {
          margin-top: 10px;
          flex: 1;
        }
      }
      .ListOfPermissions {
        flex: 1;
        height: 100%;
        /*background: pink;*/
        display: flex;
        border: 1px #ccc solid;
        margin-left: 10px;
        padding: 10px;
        flex-direction: column;
        .ListOfPermissionsTitle {
          height: 40px;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }
        .JobListTable {
          margin-top: 10px;
          flex: 1;
        }
      }
    }
  }
</style>


