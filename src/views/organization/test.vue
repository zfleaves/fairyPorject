<template>
  <div class="organizationalStructure">
    <div class="organizationalList">
      <div class="OrganizationTree">
          <div class="add-dialog">
            <div class="dialog-left">
              <div class="block">
                <!-- <div class="title"> -->
                  <!-- <span>xxx</span>
                  <span>aaa</span>
                  <span>set</span> -->
                <!-- </div> -->
                <el-tree
                  class="filter-tree"
                  :props="props"
                  :empty-text="emptyText" 
                  :load="loadNode"
                  :default-checked-keys="[defaultCheckId]"
                  :default-expanded-keys="[defaultCheckId]"
                  node-key="id"
                  highlight-current
                  lazy
                  @node-click="nodeClick"
                  :data="treeOrgsList">
                  <div class="custom-tree-node" slot-scope="{node}">
                    <el-tooltip effect="dark" :content="node.label.orgName || node.label.departmentName" placement="top">
                      <span class="tree-heater"
                            :style="(node.level == 2 && node.label.orgAttribute === '04') ? 'padding-left: 18px': ''">
                        <i :class="node.label.orgAttribute === '01' ? 'iconfont icon-gongsiyewu' :
                        (node.label.orgAttribute === '02' || node.label.orgAttribute === '03') ? 'iconfont icon-home' : 'iconfont icon-bumen'"
                          :style="node.label.orgAttribute === '01' ? 'color:#409eff': node.label.orgAttribute === '02' ||
                           node.label.orgAttribute === '03' ? 'color:#3296fa': node.label.orgAttribute === '04' ?
                           'color:#00b38a' : 'color:#66b1ff'"></i>
                        {{node.label.orgName || node.label.departmentName}}
                        <span v-if="node.label.orgName && node.label.orgAttribute === '01'"
                              style="font-size:12px">(总公司)</span>
                        <span v-else-if="node.label.orgName && node.label.orgAttribute === '02'"
                              style="font-size:12px"></span>
                        <span v-else-if="node.label.orgName && node.label.orgAttribute === '03'"
                              style="font-size:12px"></span>
                        <span v-else-if="node.label.departmentName && node.label.orgAttribute === '04'"
                              style="font-size:12px">(部门)</span>
                      </span>
                    </el-tooltip>
                      <!-- <span>xxx</span>
                      <span>aaa</span>
                      <span>set</span> -->
                  </div>
                </el-tree>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="organizationalDetail">
      <div class="setDetail">
        <div class="organizationalDetailTitle">
          <span>{{detailObj.orgName || detailObj.departmentName}}</span>
          <el-button  size="small" icon="el-icon-plus" v-if="detailObj.orgAttribute === '01'">添加区域</el-button>
          <el-button  size="small" icon="el-icon-plus" v-if="detailObj.orgAttribute !== '04'">添加下级部门</el-button>
          <el-button  size="small" icon="el-icon-plus" v-if="detailObj.orgAttribute === '04'">修改</el-button>
          <el-button  size="small" icon="el-icon-plus" v-if="detailObj.orgAttribute === '04'">删除</el-button>
        </div>
        <p class="employeeNumber" v-if="detailObj.orgAttribute !== '04'">
          {{ detailObj.orgAttribute === '01' ? '系统管理员:' : '公司管理员' }}<span>{{detailObj.managerName}}/{{detailObj.managerCode}}</span>
          <el-button style="margin-left:10px;" plain v-if="detailObj.orgAttribute !== '01' && detailObj.orgAttribute !== '04'"  size="small" icon="el-icon-plus">修改</el-button>
        </p>
        <div class="organizationalDetailBtn">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="NewEmployees">新增总公司员工</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="exportEmployeeList">导出总公司员工</el-button>
        </div>
      </div>
      <div class="organizationalDetailTable">
        <div class="organizationalDetailTable_fix">
          <el-table
            :data="organizationalTableData"
            stripe border
            height="100%"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="userCode"
              width="120"
              label="账号/手机号">
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="所属岗位">
            </el-table-column>
            <el-table-column
              width="160"
              label="创建日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | setTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>


    <RightModal v-if ="showRightModal" >
      <div slot="header">增加区域</div>
      <div slot="body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="区域名称" prop="a">
            <!-- <el-input v-model="ruleForm.a"></el-input> -->
          </el-form-item>
          <el-form-item label="管理员账号">
            <!-- <el-input v-model="form.b"></el-input> -->
          </el-form-item>
          <el-form-item label="区域管理员">
            <!-- <el-input v-model="form.c"></el-input> -->
          </el-form-item>
          <el-form-item label="同级排序">
            <!-- <el-input v-model="form.d"></el-input> -->
          </el-form-item>
          <el-form-item label="备注说明">
            <!-- <el-input type="textarea" v-model="ruleForm.e"></el-input> -->
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small">保存</el-button>
        <el-button size="small">取消</el-button>
      </div>
    </RightModal>

  </div>
</template>
<script>
  import RightModal from 'components/rightModal/rightModal'
  import {getOrganizationalTableList, getTreeOrgs,getDepartmentList,getDepartmentUserList} from 'api/organization/corporateOrganizations';
  import {setTime1} from 'util';

  export default {
    name: 'organization',
    data() {
      return {
        organizationalTableData: [],
        orgId: 1,
        props: {
          label: function(node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        detailObj:{},
        treeOrgsList: [],
        showRightModal: false,
        ruleForm: {
          // a:a,
          // b:b,
          // c:c,
          // d:d,
          // e:e,
        },
        rules: {
          // a: [
          //     { required: true, message: '请输入活动名称', trigger: 'blur' },
          //     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          // ],
        },
        emptyText:'努力加载中...',
        nodeEvent:'',
        defaultCheckId:''
      }
    },
    components: {
      RightModal
    },
    created() {
      this._getTreeOrgs()
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.treeOrgsList);
        }else{
            getDepartmentList(node.data.id).then(res =>{
                if(res.results && res.results.length){
                    res.results.forEach(item => {
                        item.leaf = true;
                        item.orgAttribute = '04';
                    });
                    let departmentList = res.results;
                    if(node.data.children && node.data.children.length){
                        departmentList = departmentList.concat(node.data.children);
                    }
                    resolve(departmentList)
                } else{
                    if(node.data.children && node.data.children.length){
                         resolve(node.data.children)
                    }else{
                         resolve([])
                    }
                }
            })
        }
      },
      //获取树形列表数据
      _getTreeOrgs() {
        getTreeOrgs().then(res => {
          console.log(res)
          if(res.results && res.results.length){
              let fatherList = res.results.filter(item =>{
                  return item.orgAttribute === '01'
              })
              let childrenList = res.results.filter(item =>{
                 return item.orgAttribute !== '01'
              })
             fatherList[0].children = childrenList;
             this.treeOrgsList = fatherList;
             this.detailObj = JSON.parse(JSON.stringify(fatherList[0]));
             this.defaultCheckId = this.detailObj.id;
             this._getOrganizationalTableList();
          }
        })
      },
      // 获取成员列表
      _getOrganizationalTableList() {
            if(this.detailObj.orgAttribute === '04'){
                 getDepartmentUserList(this.detailObj.id).then(res=>{
                    this.organizationalTableData = res.results;
                })
            }else{
                 getOrganizationalTableList(this.detailObj.id).then(res=>{
                    this.organizationalTableData = res.results;
                })
            }
           
      },
      //点击树形菜单
      nodeClick(event){
          this.detailObj = JSON.parse(JSON.stringify(event));
          this._getOrganizationalTableList()
      },
      //添加区域
      addRegion() {
        this.showRightModal = !this.showRightModal;
      },
      // 修改成员
      handleEdit(item) {
        console.log(item)
      },
      //添加下级部门
      addNextDepartments() {

      },
      //新增员工
      NewEmployees() {

      },
      //导出总公司员工
      exportEmployeeList() {

      }
    },
  }
</script>

<style lang="scss" scoped>
  .organizationalStructure {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    padding: 25px 20px;
    .organizationalList {
      flex: 3;
      background-color: #f5f7fa;
      border: 1px #eee solid;
      margin-right: 10px;
      padding: 20px 10px;
    }
    .organizationalDetail {
      flex: 7;
      padding: 20px;
      border: 1px #eee solid;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .setDetail{
        overflow: hidden;
        .organizationalDetailTitle {
          padding: 20px 15px;
          line-height: 45px;
          .name {
            font-size: 28px;
          }
          button {
            margin-left: 20px;
            display:inline-block;
            vertical-align: middle
          }
        }
        .employeeNumber {
          padding: 0 15px;
          span {
            color: #3e75ff;
          }
        }
        .organizationalDetailBtn {
          text-align: right;
          margin-top: 10px;
          margin-bottom: 20px;
        }
      }
    }
    .organizationalDetailTable {
      width: 100%;
      flex: 1;
      // height: calc(100% - 143px);
      // height: 100%;
      position: relative;
      .organizationalDetailTable_fix {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  .OrganizationTree {
    height: 100%;
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
        .custom-tree-node {
          width: 100%;
          position: relative;
          background: transparent;
        }
      }
    }
  }
</style>

