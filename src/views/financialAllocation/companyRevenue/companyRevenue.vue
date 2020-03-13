<template>
  <div class="companyRevenue">
    <div class="companyRevenueCon">
      <div class="tableHeader">
        <div class="subjectTypes">科目类型/科目名称</div>
        <div class="subjectLevel">科目级别</div>
        <div class="state">状态</div>
        <div class="Remarks">备注</div>
      </div>
      <div class="companyRevenueTable">
        <el-tree
          :data="companyRevenueTableData"
          node-key="id"
          :props="props"
          lazy ref="tree"
          :load="loadNode"
          highlight-current
          @node-click="nodeClick"
          :empty-text="emptyText">
          <div class="custom-tree-node" slot-scope="{node}">
            <div class="subjectName">
              <span class="name" :class="node.data.level ? 'active' : ''">{{node.data.subjectName}}</span>
              <div v-if="node.data.level" class="operation">
                <span @click="handleSetStatus(node.data)">
                  {{node.data.status === 0 ? '停用' : node.data.status === 1 ?  '启用' : ''}}
                </span>
                <span @click="modifys(node.data)">修改</span>
                <span @click="deletSubject(node.data)">删除</span>
              </div>
              <div v-else class="operation">
                <span @click.stop="handleClickdialogFormVisible(node.data)">添加</span>
              </div>
            </div>
            <span class="oneSubject">{{getLevel(node.data.level)}}</span>
            <span class="normal">{{node.data.status === 0 ? '正常' : node.data.status === 1 ?  '停用' : ''}}</span>
            <span class="Remark">{{node.data.remarks}}</span>
          </div>
        </el-tree>
      </div>
    </div>
    <!--弹窗-->
    <el-dialog title="添加公司收支科目" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="addCompanySubjectModalObj" ref="addCompanySubjectModalObj" :rules="rules" label-width="80px">
        <el-form-item label="科目类别">
          <el-input size="small" disabled v-model="typeCompany" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="科目级别" prop="level">
          <el-select size="small" v-model="addCompanySubjectModalObj.level" placeholder="请选择科目级别">
            <el-option v-for="item in subjectLevelArr" :key="item.id" :label="item.level"
                       :value="item.code"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
          <el-input size="small" placeholder="请输入科目名称" v-model="addCompanySubjectModalObj.subjectName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="科目编号" prop="subjectCode">
          <el-input size="small" clearable placeholder="请输入科目编号" v-model="addCompanySubjectModalObj.subjectCode"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="同级排序">
          <el-input size="small" clearable type="number" placeholder="" v-model="addCompanySubjectModalObj.sorts"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" type="textarea" v-model="addCompanySubjectModalObj.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="Determine('addCompanySubjectModalObj')">确 定</el-button>
        <el-button size="small" @click="cancelModal">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getCompanyList,
    createCompanySubject,
    deleteCompanySubject,
    checkDeleteCompanySubject,
    disableCompanySubject,
    checkCompanySubjectCode,
    updateCompanySubject,
    checkCompanySubjectName,
    enableCompanySubject,
    setCompanySubject
  } from 'api/companyRevenue/companyRevenue'

  export default {
    name: 'companyRevenue',
    data() {
      let subjectCodeFun = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入科目编号'));
        } else {
          checkCompanySubjectCode(this.addCompanySubjectModalObj.subjectCode).then(res => {
            let resultCode = res.results
            if (resultCode === 1) {
              return callback(new Error('科目编号不能重复'));
            } else if (resultCode === 0) {
              callback();
            }
          })
        }
      }

      let subjectNameFun = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入科目名称'))
        } else {
          checkCompanySubjectName(value).then(res => {
            let resultName = res.results
            if (resultName === 1) {
              return callback(new Error('科目名称不能重复'));
            } else if (resultName === 0) {
              callback();
            }
          })
        }
      }
      return {
        companyRevenueTableData: [
          {
            id: -1,
            subjectName: '公司收入科目',
            type: 1,
          },
          {
            id: -2,
            subjectName: '公司支出科目',
            type: 2
          }
        ],
        props: {
          label: function (node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        emptyText: '加载中...',
        addCompanySubjectModalObj: {
          level: "",
          remarks: "",
          sorts: 1,
          subjectCode: "",
          subjectName: "",
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
        subjectLevelArr: [
          {
            id: 1, level: '一级科目', code: 1
          },
          {
            id: 2, level: '二级科目', code: 2
          },
          {
            id: 3, level: '三级科目', code: 3
          }
        ],
        typeCompany: '',
        rules: {
          level: [
            {required: true, message: '请选择科目级别', trigger: 'change'}
          ],
          subjectName: [
            {required: true, message: '请输入科目名称', trigger: 'blur'},
            {validator: subjectNameFun, trigger: 'blur'}
          ],
          subjectCode: [
            {required: true, message: '请输入科目编号', trigger: 'blur'},
            {validator: subjectCodeFun, trigger: 'blur'}
          ]


        },
        editeId: '',
        treeNodeEvent: {},
        refreshType: ''
      }
    },
    created() {
      // this._getCompanyList()
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.companyRevenueTableData);
        } else {
          //   let newId = node.data.id === -2 ? -1 : node.data.id;
          getCompanyList(node.data.type).then(res => {
            let ProjectList = res.results && res.results.length ? res.results : [];
            if (node.level === 1) {
              for (let i in ProjectList) {
                let item = ProjectList[i]
                item.leaf = true;
              }
            }
            resolve(ProjectList);
          })
        }
      },
      // 更新子节点下的元素
      _updatekeyChildren(type, id) {
        getCompanyList(type).then(res => {
          let ProjectList = res.results && res.results.length ? res.results : [];
          for (let i in ProjectList) {
            let item = ProjectList[i]
            item.leaf = true;
          }
          this.$refs.tree.updateKeyChildren(id, ProjectList)
        })
      },
      //点击添加
      handleClickdialogFormVisible(item) {
        this.editeId = ""
        this.dialogFormVisible = true
        this.typeCompany = item.subjectName

      },


      //点击修改
      modifys(item) {
        this.addCompanySubjectModalObj.level = item.level
        this.addCompanySubjectModalObj.remarks = item.remarks
        this.addCompanySubjectModalObj.sorts = item.sorts
        this.addCompanySubjectModalObj.subjectCode = item.subjectCode
        this.addCompanySubjectModalObj.subjectName = item.subjectName
        if (item.type === 1) {
          this.typeCompany = "公司收入科目"
        } else if (item.type === 2) {
          this.typeCompany = "公司支出科目"
        }
        this.editeId = item.id;
        this.dialogFormVisible = true;
      },
      //点击确定
      Determine(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //添加
            if (!this.editeId) {
              let id = '';
              let data = {
                ...this.addCompanySubjectModalObj
              }
              if (this.typeCompany = '公司收入科目') {
                data.type = 1;
                id = -1

              } else if (this.typeCompany = '公司支出科目') {
                data.type = 2;
                id = -2
              }
              createCompanySubject(data).then(res => {
                console.log(res)
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this._updatekeyChildren(data.type, id)
                this.cancelModal()
              })
            } else {
              let data = {
                ...this.addCompanySubjectModalObj
              }
              if (this.typeCompany = '公司收入科目') {
                data.type = 1
              } else if (this.typeCompany = '公司支出科目') {
                data.type = 2
              }
              data.id = this.editeId
              updateCompanySubject(data).then(res => {
                console.log(res)
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.refreshNode()
                this.cancelModal()
              })
            }
          } else {

            return false;
          }
        });

      },
      //点击删除
      deletSubject(item) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          checkDeleteCompanySubject(item.id).then(res => {
            if (res.results === 0) {
              deleteCompanySubject(item.id).then(res => {
                this.$refs.tree.remove(this.treeNodeEvent)
                // this.$refs.tree.remove(this.nodeEvent);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              })
            } else if (res.results === 1) {
              console.log('不能删除')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //点击取消
      cancelModal() {
        this.dialogFormVisible = false;
        this.addCompanySubjectModalObj = {
          level: "",
          remarks: "",
          sorts: 1,
          subjectCode: "",
          subjectName: "",
        }
        this.typeCompany = ""

      },
      //点击树形菜单
      nodeClick(event) {
        console.log(event);
        this.treeNodeEvent = event;
      },
      //修改节点刷新
      refreshNode() {
        this.$set(this.treeNodeEvent, 'level', this.addCompanySubjectModalObj.remarks);
        this.$set(this.treeNodeEvent, 'remarks', this.addCompanySubjectModalObj.sorts);
        this.$set(this.treeNodeEvent, 'sorts', this.addCompanySubjectModalObj.level);
        this.$set(this.treeNodeEvent, 'subjectCode', this.addCompanySubjectModalObj.subjectCode);
        this.$set(this.treeNodeEvent, 'subjectName', this.addCompanySubjectModalObj.subjectName);
      },
      getLevel(val) {
        let level = ''
        if (val === 1) {
          level = '一级科目'
        } else if (val === 2) {
          level = '二级科目'
        } else if (val === 3) {
          level = '三级科目'
        } else {
          level = ''
        }
        return level
      },
      //停用
      handleSetStatus(item) {
        console.log(item)
        let msg = item.status === 0 ? '停用' : '启用';
        let url = item.status === 0 ? '/sysbase/subject/company/disable' : '/sysbase/subject/company/enable';
        this.$confirm(`您将${msg}该科目吗`, `${msg}操作`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setCompanySubject(url, item.id).then(res => {
            this.$message({
              type: 'success',
              message: msg + '成功'
            })
            let status = item.status === 0 ? 1 : 0;
            this.$set(this.treeNodeEvent, 'status', status);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + msg
          });
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .companyRevenue {
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 14px;
    background-color: #fff;
    .companyRevenueCon {
      width: 100%;
      height: 100%;
      .tableHeader {
        width: 100%;
        display: flex;
        height: 40px;
        line-height: 40px;
        background-color: #e4e4e4;
        .subjectTypes {
          flex: 4;
          padding-left: 24px;
        }
        .subjectLevel {
          flex: 1;
          text-align: center;
        }
        .state {
          flex: 1;
          text-align: center;
        }
        .Remarks {
          flex: 2;
          text-align: center;
        }
      }
      .companyRevenueTable {
        width: 100%;
        height: 100%;
        .custom-tree-node {
          width: 100%;
          display: flex;
          .subjectName {
            flex: 4;
            // padding-right: 30px;
            .name {
              float: left;
              &.active {
                text-indent: 2rem;
              }
            }
            .operation {
              float: right;
              color: #32a3fb;
              font-size: 14px;
              span {
                margin-right: 15px;
              }
            }

          }
          .oneSubject {
            flex: 1;
            text-align: center;
          }
          .normal {
            flex: 1;
            text-align: center;
          }
          .Remark {
            flex: 2;
            text-align: center;
          }
        }
      }
    }

  }
</style>


