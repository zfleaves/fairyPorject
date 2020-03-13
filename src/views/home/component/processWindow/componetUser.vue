<template>
  <div class="componet-User subprojectTree">
    <el-tree
      border
      :data="orgsList"
      :props="props"
      :load="loadNode"
      ref="tree"
      node-key="id" highlight-current
      :default-expanded-keys="[defaultOrgId]"
      :empty-text="emptyText"
      lazy>
      <div class="custom-tree-node" style="width: 100%;background: transparent;overflow: hidden;" slot-scope="{node}">
        <span
          v-if="node.label.orgName || node.label.departmentName">{{node.label.orgName || node.label.departmentName}}</span>
        <div v-else style="display: inline-block;" @click.stop.prevent="handleCheck(node.label)">
          <el-checkbox v-if="node.label.userId" v-model="node.label.checked">
          </el-checkbox>
          <span>{{node.label.userName}}</span>
          <span>{{node.label.rolesName}}</span>
        </div>
      </div>
    </el-tree>
    <div class="dialog-footer" style="text-align: center;margin-top:20px;">
      <el-button
        size="small"
        icon="el-icon-circle-check"
        type="primary" class="urgent"
        @click="close">取 消
      </el-button>
      <el-button
        size="small"
        icon="el-icon-circle-check"
        type="primary"
        @click="sumbit">确 定
      </el-button>
    </div>
  </div>
</template>

<script>
  import {EventBus} from '@/event-bus.js'
  import {
    getTreeOrgs, getDepartmentList,
    getCompanyUserRolesList, getDepartmentUserList,
  } from 'api/organization/corporateOrganizations'

  export default {
    name: "componet-User",
    props: {
      assigneeUsersList: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      assigneeUsersList: {
        handler() {
          this.userList = [];
          for (let i in this.assigneeUsersList) {
            let item = this.assigneeUsersList[i];
            item.userId = item.id;
            this.userList.push(item);
          }
        },
        // deep:true,
        immediate:true
      }
    },
    data() {
      return {
        orgsList: [],
        emptyText: '努力加载中…',
        props: {
          children: "children",
          label: function (node) {
            return node;
          },
          isLeaf: 'leaf',
        },
        defaultOrgId: '',
        orgId: '',
        userList: [],
      }
    },
    created() {
      this._getTreeOrgs()
    },
    mounted() {
      console.log(this.assigneeUsersList);
    },
    methods: {
      // 获取公司组织列表
      _getTreeOrgs() {
        getTreeOrgs().then(res => {
          if (res.status === 0) {
            let results = res.results;
            let headquartersList = results.filter(v => v.orgAttribute === '01');
            let subsidiaryList = results.filter(v => v.orgAttribute !== '01');
            for (let i in headquartersList) {
              let item = headquartersList[i];
              item.children = subsidiaryList.slice();
            }
            this.defaultOrgId = headquartersList[0].id;
            this.orgId = headquartersList[0].id;
            this.orgsList = headquartersList.slice();// 浅拷贝
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      },
      // 树懒加载
      loadNode(node, resolve) {
        if (node.level === 0) {
          resolve(this.orgsList);
        } else { // 代表是总公司根下面
          let children = node.data.children || []; //子公司
          if (node.data.orgAttribute !== '04') {
            getDepartmentList(node.data.id).then(res => {
              // 获取部门
              let results = res.results && res.results.length ? res.results : [];
              for (let i in results) {
                results[i].orgAttribute = '04';
              }
              getCompanyUserRolesList(node.data.id).then(ret => {
                // 获取人
                let list = ret.results && ret.results.length ? ret.results : [];
                for (let i in list) {
                  list[i].leaf = true;
                  if (list[i].roles && list[i].roles.length) {
                    let item = list[i];
                    item.rolesName = item.roles.map(v => v.rolesName).join(',');
                    // this.$nextTick(() => {
                    let index = this.assigneeUsersList.findIndex(v => v.id === item.userId);
                    if (index >= 0) {
                      item.checked = true;
                    } else {
                      item.checked = false;
                    }
                    // })
                    // item.checked = true;
                  }
                }
                let arr = [...list, ...children, ...results];
                resolve(arr);
              })
            })
          } else {
            getDepartmentUserList(node.data.id).then(res => {
              // 获取人
              let list = res.results && res.results.length ? res.results : [];
              for (let i in list) {
                list[i].leaf = true;
                if (list[i].roles && list[i].roles.length) {
                  list[i].rolesName = list[i].roles.map(v => v.rolesName).join(',');
                }
              }
              resolve(list);
            })
          }
        }
      },
      handleCheck(event) {
        console.log(event);
        if (event.checked) {
          this.$set(event, "checked", false);
        } else {
          this.$set(event, "checked", true);
        }
        let index = this.userList.findIndex(v => v.userId === event.userId);
        if (index >= 0) {
          this.userList.splice(index, 1);
        } else {
          this.userList.push(event);
        }
        // this.$forceUpdate();
      },
      // 关闭弹窗
      close() {
        // EventBus.$emit('closeRole', {
        //   flag: true
        // })
        this.$emit('closeRole');
      },
      sumbit() {
        if(this.userList.length===0){
          this.$message.error('请选择审批人');
          return
        }
        this.userList.forEach(value=>{
          value.id = value.userId;
        })
        this.$emit('closeRole',this.userList);

      },
    }
  }
</script>

<style scoped lang="scss">
  .subprojectTree {
    height: 500px;
    width: 100%;
    .add-dialog {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
      .dialog-left {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .header-search {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          span {
            color: rgb(101, 198, 236);
          }
          div {
            width: 70%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-input--small .el-input__inner {
              width: 100px;
            }
          }
        }
      }
    }
    .el-tree-node__content{
      border: 1px #ccc solid;
    }
  }
</style>
