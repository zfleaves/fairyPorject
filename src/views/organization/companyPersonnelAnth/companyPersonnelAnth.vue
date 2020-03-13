<template>
  <div class="personnelAuthorization">
    <div class="personnelAuthorization_fix">
      <div class="tableHeader">
        <div class="personnel">组织机构/人员</div>
        <div class="post">所属岗位</div>
        <div class="operation">操作</div>
      </div>
      <div class="personnelAuthorization_tree">
        <el-tree
          :data="treeOrgsList"
          :props="props"
          :empty-text="emptyText"
          :default-checked-keys="[defaultCheckId]"
          :default-expanded-keys="[defaultCheckId]"
          node-key="id"
          lazy
          :load="loadNode"
          highlight-current
          @node-click="nodeClick"
        >
          <div class="custom-tree-node" slot-scope="{node}">
            <span style="flex: 1;"
                  :style="(node.level == 2 && node.label.orgAttribute === '04') ? 'padding-left: 18px': (node.level == 2 && node.label.userName) ? 'padding-left: 36px' : ''">
              {{node.label.orgName || node.label.departmentName || node.label.userName}}
            </span>
            <!-- <span style="flex: 1;text-align: center;">超级管理员</span> -->
            <el-tooltip v-if="node.label.rolesName"
                        style="flex: 5;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 20px;text-align: center;"
                        class="item" effect="dark" :content="node.label.rolesName" placement="top">
              <span style="flex: 1;text-align: center;">{{node.label.rolesName}}</span>
            </el-tooltip>
            <span v-else style="flex: 5;text-align: center;"></span>
            <span style="flex: 1;display: flex;justify-content: center;">
              <el-button
                v-if="!node.label.orgAttribute"
                type="text"
                size="mini"
                @click="() => append(data)">
                  Append
              </el-button>
              <el-button
                v-if="!node.label.orgAttribute"
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                  Delete
              </el-button>
            </span>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getPersonnelAuthorizationOrgs,
    getDepartmentList, getCompanyUserRolesList, getDepartmentUserRolesList
  } from '../../../api/organization/companyPersonnelAnth'

  export default {
    name: 'companyPersonnelAnth',
    data() {
      return {
        treeDataList: [],
        OrgsList: [],
        treeOrgsList: [],
        defaultCheckId: '',
        detailObj: {},
        emptyText: '加载中...',
        childrenList: [],
        props: {
          label: function (node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
      }
    },
    created() {
      this._getPersonnelAuthorizationOrgs()
    },
    methods: {
      _getPersonnelAuthorizationOrgs() {
        getPersonnelAuthorizationOrgs().then(res => {
          if (res.results && res.results.length) {
            let fatherList = res.results.filter(item => {
              return item.orgAttribute === '01'
            })
            this.childrenList = res.results.filter(item => {
              return item.orgAttribute !== '01'
            })
            this.childrenList.forEach(item => {
              item.children = [];
            })
            fatherList[0].children = this.childrenList;
            this.treeOrgsList = fatherList;
            this.detailObj = JSON.parse(JSON.stringify(fatherList[0]));
            this.defaultCheckId = this.detailObj.id;
            // this._getOrganizationalTableList();
          }
        })
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.treeOrgsList);
        } else {
          if (node.data.orgAttribute !== '04') {
            let val = node.data.children ;  // 总公司下的区 / 区下面的[]
            // let val = node.data.orgAttribute === '01' ? this.childrenList : [];  // 总公司下的区 / 区下面的[]
            getDepartmentList(node.data.id).then(res => {
              let departList = res.results && res.results.length ? res.results : [];
              departList.forEach(item => {
                item.orgAttribute = '04';
              });
              let newVal = val.concat(departList);
              getCompanyUserRolesList(node.data.id).then(res => {
                let companyUserRoleList = res.results && res.results.length ? res.results : [];
                for (let i in companyUserRoleList) {
                  let item = companyUserRoleList[i];
                  item.leaf = true;
                  item.rolesName = item.roles && item.roles.length ? item.roles.map(v => v.rolesName).join(',') : '';
                }
                // let allArr = newVal.concat(companyUserRoleList);
                let allArr = companyUserRoleList.concat(newVal);
                resolve(allArr);
              })
            })
          } else {
            getDepartmentUserRolesList(node.data.id).then(res => {
              let companyUserRoleList = res.results && res.results.length ? res.results : [];
              for (let i in companyUserRoleList) {
                let item = companyUserRoleList[i];
                item.leaf = true;
                item.rolesName = item.roles && item.roles.length ? item.roles.map(v => v.rolesName).join(',') : '';
              }
              resolve(companyUserRoleList);
            })
          }
        }
      },
      //点击树形菜单
      nodeClick(event) {
        this.detailObj = JSON.parse(JSON.stringify(event));
        //   this._getOrganizationalTableList()
      },
      append(data) {
        const newChild = {id: id++, label: 'testtest', children: []};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
    }
  }
</script>
<style scoped lang="scss">
  .personnelAuthorization {
    width: 100%;
    //  border: 1px #eee solid;
    padding: 0px;
    box-sizing: border-box;
    position: relative;
    height: 100%;
    .personnelAuthorization_fix {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      overflow-y: auto;
      height: 100%;
      padding: 10px;
      border: 1px #ccc solid;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .tableHeader {
      width: 100%;
      display: flex;
      height: 40px;
      line-height: 40px;
      border: 1px #ddd solid;
      .personnel {
        flex: 1;
        text-align: center;
      }
      .post {
        flex: 1;
        text-align: center;
      }
      .operation {
        flex: 1;
        text-align: center;
      }
    }
    .personnelAuthorization_tree {
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        button:nth-child(1) {
          margin-right: 80px;
        }
      }
    }
  }
</style>


