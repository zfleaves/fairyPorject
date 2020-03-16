<template>
  <div class="selectProjectMembersCon">
    <div class="selectProjectMembers">
      <div class="treeCon">
        <el-tree :load="loadNode" :default-expanded-keys="[defaultOrgId]"
                 ref="tree" :highlight-current="true" lazy node-key="id" v-if="orgsList" :props="defaultProps"
                 :data="orgsList" current-node-key="defaultOrgId" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{node,data}">
                <!-- <span>{{node}}</span> -->
              <!-- <span>{{data}}</span> -->
              <span
              >{{data.orgName || data.departmentName}}<span>{{data.orgAttribute === '01' ? '(总公司)' : data.orgAttribute === '02' ? '(分公司)' : '(部门)'}}</span></span>

           </span>
          <!-- data.orgAttribute === '01' ? '' : data.orgAttribute === '02' ? 'pad10' : 'pad20' -->
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
          @row-click="rowClick4"
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
  </div>
</template>
<script>
  import {
    getDepartmentList
  } from 'api/companyProject/projectMembers'

  export default {
    name: "",
    props: {
      orgsList: {
        type: Array,
        default: () => []
      },
      defaultOrgId: {
        type: Number,
        default: 0
      },
      selectUserListTableData: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        defaultProps: {
          label: function (node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        params4: '',
        multipleSelection4:[]

      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.defaultOrgId);
      })
    },
    methods: {
      loadNode(node, resolve) {
        console.log(node)
        if (node.level === 0) {
          return resolve(this.orgsList);
        }
        if (node.level >= 1) {
          console.log(node.data)
          // return
          if (node.data.children && node.data.children.length) {
            getDepartmentList(node.data.id).then(res => {
              if (res.results && res.results.length) {
                let departmentList = res.results
                for (let i in departmentList) {
                  let item = departmentList[i]
                  if (node.data.orgAttribute !== '01' && node.data.orgAttribute !== '02') {
                    item.leaf = false
                  } else {
                    item.leaf = true
                  }

                }
                return resolve(node.data.children.concat(departmentList));
              } else {
                resolve(node.data.children)
              }

            })
          } else {
            getDepartmentList(node.data.id).then(res => {
              if (res.results && res.results.length) {
                let departmentList = res.results
                for (let i in departmentList) {
                  let item = departmentList[i]
                  if (node.data.orgAttribute !== '01' && node.data.orgAttribute !== '02') {
                    item.leaf = false
                  } else {
                    item.leaf = true
                  }

                }
                return resolve(departmentList);
              } else {
                resolve([])
              }

            })
          }


        }
      },
      //tree点击渲染表格
      handleNodeClick(row) {
        this.$emit('ToHandleNodeClick', row)
      },
      _getRoleUsersList() {
        this.$emit('_getRoleUsersList', this.params4)
      },
      //点击勾选表格
      handleSelectionChange4(val) {
        // console.log(val)
        this.multipleSelection4 = val;
      },
      rowClick4(row) {
        //   console.log(row)
        let index = this.multipleSelection4.findIndex(v => v.userId === row.userId)
        if (index >= 0) {
          this.$refs.multipleTable4.toggleRowSelection(row, false);
        } else {
          //    this.multipleSelection4.push(row);
          this.$refs.multipleTable4.toggleRowSelection(row);
        }

      },
      selectSubmit() {
        this.$emit('sendSelectSubmit',this.multipleSelection4)
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
    },
    filters: {
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
<style lang="scss" scoped>
  .selectProjectMembersCon {
    .selectProjectMembers {
      width: 100%;
      display: flex;
      padding: 20px;
      .treeCon {
        width: 200px;
        border: 1px #fafafa solid;
        margin-right: 10px;
        .pad10 {
          padding-left: 10px;
        }
        .pad20 {
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
