<template>
  <div class="receiveMasterUnit">
    <div class="receiveMasterUnitCon">
      <div class="receiveMasterUnitConInner">
        <div class="tableHeader">
          <div class="Name">名称</div>
          <div class="number">编号</div>
          <div class="PersonInCharge">负责人</div>
          <div class="ContactInformation">联系方式</div>
          <div class="Remarks">备注</div>
          <div class="operation">操作</div>
        </div>
        <div class="tableCon">
          <el-tree
            :data="tableTreeData"
            :props="props"
            ref="tree"
            :empty-text="emptyText"
            :default-checked-keys="[defaultCheckId]"
            :default-expanded-keys="[defaultCheckId]"
            lazy
            :load="loadNode"
            highlight-current
            @node-click="nodeClick"
            node-key="id">q
            <div class="custom-tree-node" slot-scope="{node}">
              <span style="text-align: left;" :class="node.label.unitName ? 'textIndent' : ''">{{node.label.proName  || node.label.unitName}}</span>
              <span>{{node.label.unitCode}}</span>
              <span>{{node.label.unitContactName}}</span>
              <span>{{node.label.unitContactInfo}}</span>
              <span v-if="node.label.proName"></span>
              <span v-else>{{node.label.remarks}}</span>
              <span v-if="node.label.proName" @click.prevent.stop="addingConsumptionUnit(node.label.id)"
                    style="color:#32a3fb;font-size:14px;">添加领料单位</span>
              <span v-else>
                <el-button

                  type="text"
                  size="mini"
                  style="color:#32a3fb;font-size:14px;"
                  @click="modifyConsumptionUnit(node.label)">
                  修改
                </el-button>
                <el-button
                  style="color:#32a3fb;font-size:14px;"

                  type="text"
                  size="mini"
                  @click="deletConsumptionUnit(node.label)">
                  删除
                </el-button>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
    <RightModal v-if="rightModalShow">
      <div slot="header">添加领料单位</div>
      <div slot="body">
        <el-form :model="projectFormObj" :rules="rules" ref="projectFormObj" label-width="120px" class="demo-ruleForm">

          <el-form-item label="所属项目" prop="proTypeCode">
            <el-select disabled size="small" clearable style="width:100%"
                       v-model="projectFormObj.projectId" placeholder="请选择项目类型">
              <el-option
                v-for="(item,index) in tableTreeData" :key="index"
                :label="item.proName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位名称" prop="unitName">
            <el-input size="small" clearable v-model="projectFormObj.unitName"></el-input>
          </el-form-item>
          <el-form-item label="单位编号">
            <el-input size="small" disabled placeholder="自动形成：项目编号-001自增长规则" clearable  v-model="unitCode"></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input size="small" clearable v-model="projectFormObj.unitContactName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式"  prop="unitContactInfo">
            <el-input size="small" clearable v-model="projectFormObj.unitContactInfo"></el-input>
          </el-form-item>
          <el-form-item label="账号名称">
            <el-input size="small" clearable v-model="projectFormObj.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户行">
            <el-input size="small" clearable v-model="projectFormObj.bankName"></el-input>
          </el-form-item>
          <el-form-item label="开户账号" prop="accountCard">
            <el-input size="small" clearable v-model="projectFormObj.accountCard"></el-input>
          </el-form-item>
          <el-form-item size="small" clearable label="备注说明">
            <el-input type="textarea" v-model="projectFormObj.remarks"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="submitForm('projectFormObj')" style="width:100px;" type="primary" size="small">保存</el-button>
        <el-button style="width:100px;" @click="handleCancel" size="small">取消</el-button>
      </div>
    </RightModal>
  </div>
</template>
<script>
  import {
    getCompanyProject,
    getProjectUnitList,
    getProjectUnitCreate,
    checkProjectUnitName,
    updateProjectUnit,
    deleteProjectUnit
  } from 'api/companyProject/receiveMasterUnit'
  import RightModal from 'components/rightModal/rightModal'

  export default {
    name: 'receiveMasterUnit',
    components: {
      RightModal
    },
    data() {
      //验证单位名称
      let unitName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入单位名称'));
        } else if (value.length > 20 || value < 1) {
          callback(new Error('单位名称长度在 1 到 20 个字符'));
        } else {
          // 修改的时候 值没有改变过 为true 否则 为false
          let flag = this.editId && this.oldUnitName === value;
          if (!flag) {
            checkProjectUnitName(this.projectFormObj.projectId, value).then(res => {
              if (res.results === 1) {
                callback(new Error('单位名称已经重复'));
              } else {
                callback();
              }
            })
          } else {
            callback();
          }
        }
      }

      //验证手机号
      let unitContactInfo  = (rule, value, callback) => {
        if (!value) {
         callback();
        }else{
           const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          // console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }

      }
      //验证银行卡
      let accountCard = (rule, value, callback) =>{
         if (!this.acount_check(value)) {
          callback(new Error('请输入合法的开户账号'));
        } else {
          callback();
        }

      }
      return {
        tableTreeData: [],
        emptyText: '加载中...',
        props: {
          label: function (node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        defaultCheckId: '',
        rightModalShow: false,
        unitCode: '',
        projectFormObj: {
          projectId: '',
          accountCard: "",
          accountName: "",
          bankName: "",
          remarks: "",
          unitContactInfo: "",
          unitContactName: "",
          unitName: ""
        },
        editId: '',
        rules: {
          unitName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
            {validator: unitName, trigger: 'blur'}

          ],
          unitContactInfo: [
              {validator: unitContactInfo, trigger: 'blur'}
          ],
          accountCard:[
             {validator: accountCard, trigger: 'blur'}
          ]
        },
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }],
        oldUnitName: '',
        nodeEvent: '',
      }
    },
    created() {
      this._getCompanyProject();
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.tableTreeData);
        } else {
          getProjectUnitList(node.data.id).then(res => {
            let ProjectUnitList = res.results && res.results.length ? res.results : [];
            for (let i in ProjectUnitList) {
              let item = ProjectUnitList[i];
              item.leaf = true;
            }
            resolve(ProjectUnitList);
          })
        }
      },
      nodeClick(event) {
        // this.detailObj = JSON.parse(JSON.stringify(event));
        //   this._getOrganizationalTableList()
      },
      //查询企业下的有效项目
      _getCompanyProject() {
        getCompanyProject().then(res => {
          this.tableTreeData = res.results;
          this.defaultCheckId = this.tableTreeData[0].id
        })
      },
      //添加领料单位
      addingConsumptionUnit(id) {
        this.editId = "";
        this.unitCode = "";
        this.rightModalShow = true;
        this.projectFormObj.projectId = id;
      },
      //修改
      modifyConsumptionUnit(item) {
        console.log(item);
        this.nodeEvent = item;
        this.editId = item.id;
        this.rightModalShow = true;
        this.projectFormObj.accountCard = item.accountCard;
        this.projectFormObj.accountName = item.accountName;
        this.projectFormObj.bankName = item.bankName;
        this.projectFormObj.projectId = item.projectId;
        this.projectFormObj.remarks = item.remarks;
        this.projectFormObj.unitContactInfo = item.unitContactInfo;
        this.projectFormObj.unitContactName = item.unitContactName;
        this.projectFormObj.unitName = item.unitName;
        this.unitCode = item.unitCode;
        this.oldUnitName = item.unitName;
      },
      //删除
      deletConsumptionUnit(item){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(item.id)
          deleteProjectUnit(item.id).then(res=>{
                console.log(res)
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this._updateKeyChildren(item.projectId);
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //修改弹窗中的值
      updateUnitForm() {
        // node  需要更新的对象  'xxxx' 需要更新对象的key  value 更新后的值
        this.$set(this.nodeEvent,'accountCard',this.projectFormObj.accountCard);
        this.$set(this.nodeEvent,'accountName',this.projectFormObj.accountName);
        this.$set(this.nodeEvent,'bankName',this.projectFormObj.bankName);
        this.$set(this.nodeEvent,'remarks',this.projectFormObj.remarks);
        this.$set(this.nodeEvent,'unitContactInfo',this.projectFormObj.unitContactInfo);
        this.$set(this.nodeEvent,'unitContactName',this.projectFormObj.unitContactName);
        this.$set(this.nodeEvent,'unitName',this.projectFormObj.unitName);
      },
      // 更新子节点下的元素
      _updateKeyChildren(id) {
        getProjectUnitList(id).then(res => {
          let ProjectUnitList = res.results && res.results.length ? res.results : [];
          for (let i in ProjectUnitList) {
            let item = ProjectUnitList[i];
            item.leaf = true;
          }
          this.$refs.tree.updateKeyChildren(id, ProjectUnitList);
          // resolve(ProjectUnitList);
        })
      },

      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            let data = {
              ...this.projectFormObj
            }
            if (!this.editId) {
              getProjectUnitCreate(data).then(res => {
                this.$message({
                  message: '领料单位添加成功',
                  type: 'success'
                })
                this._updateKeyChildren(this.projectFormObj.projectId);
                this.handleCancel();
                // this._getProjectList()
              })
            } else {
              data.id = this.editId;
              updateProjectUnit(data).then(res => {
                this.$message({
                  message: '项目修改成功',
                  type: 'success'
                })
                this.updateUnitForm();
                this.handleCancel();
                //   this._getProjectList()
              })
            }
          } else {
            console.log('请完善表单！！');
            return false;
          }
        });
      },
      //关闭弹窗
      handleCancel() {
        this.rightModalShow = false;
        this.projectFormObj = {
          projectId: '',
          accountCard: "",
          accountName: "",
          bankName: "",
          remarks: "",
          unitContactInfo: "",
          unitContactName: "",
          unitName: ""
        };
      },
      // JS进行银行卡号校验
      acount_check(cardNum) {
        if (!cardNum) return true;
        let len = cardNum.length;
        let carNumArr = Array.from(cardNum.slice(0, len));
        let tem = 0;
        for (let i = len - 2; i >= 0; i -= 2) {
          tem = parseInt(cardNum[i]) * 2;
          carNumArr[i] = Math.floor(tem / 10) + tem % 10;
        }
        let result = 0;
        carNumArr.forEach(val => {
          result += parseInt(val);
        })
        return result % 10 === 0;
      }
    }

  }
</script>
<style scoped lang="scss">
  .receiveMasterUnit {
    padding: 20px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
    .receiveMasterUnitCon {
      border: 1px #ebeef5 solid;
      width: 100%;
      height: 100%;
      padding: 10px;
      .receiveMasterUnitConInner {
        border: 1px #ebeef5 solid;
        width: 100%;
        height: 100%;
        .tableHeader {
          width: 100%;
          display: flex;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px #ebeef5 solid;
          background-color: #fafafa;
          padding-left: 24px;
          .Name, .number, .PersonInCharge, .ContactInformation, .Remarks, .operation {
            flex: 1;
            text-align: center;
          }
        }
        .tableCon {
          width: 100%;
          .custom-tree-node {
            display: flex;
            width: 100%;
            .textIndent{
              text-indent: 1rem;
            }
            span {
              flex: 1;
              text-align: center;
            }
          }

        }
      }

    }

  }
</style>

