<template>
  <div class="processWindow_detail">
    <div class="modal_con">
      <el-form :rules="rules" ref="searchFormObj" :model="searchFormObj" label-width="140px">
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="24">
            <el-form-item prop="taskName" label="流程主题/描述：">
              <el-input v-model="searchFormObj.taskName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0px 0 0;" v-if="searchFormObj.step===0">
          <el-col :span="24">
            <el-form-item label="选择处理人：">
              <div v-for="(item,index) in nextNodesList" @click="handleChooseRole(item)" :key="index"
                   class="dealingPeople">
                <p>{{item.processNodeName}}</p>
                <div class="dealingPeople_inner">
                  <span class="name">审批人：</span>
                  <div class="name_list">
                    <el-tag
                      :disable-transitions="false"
                      @close.stop="handleClose(item.assigneeUsers,tag)"
                      v-for="tag in item.assigneeUsers"
                      :key="tag.id"
                      closable
                      size="small">
                      {{tag.userName}}
                    </el-tag>
                    <el-tag @click="add_Approver(item.assigneeUsers,index)" size="small">+</el-tag>
                  </div>
                </div>
                <div class="select_icon" v-if="item.flag">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="24">
            <el-form-item label="我的意见：">
              <el-input class="yijian" placeholder="请填写" style="min-height:70px" type="textarea"
                        v-model="searchFormObj.comment">
              </el-input>
              <div class="chuli">
                <div class="chuli_btn">
                  <el-tag
                    @click.native="addTag(tag)"
                    :disable-transitions="false"
                    v-for="(tag,index) in tags2"
                    :key="index"
                    size="small">
                    {{tag.workflowTag}}
                  </el-tag>
                  <el-tag
                    @click.native="addTag(tag)"
                    @close="handleClose2(tag)"
                    :disable-transitions="false"
                    v-for="(tag,index) in newTags2"
                    :key="tag.id"
                    closable
                    size="small">
                    {{tag.workflowTag}}
                  </el-tag>
                </div>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  style="width: 100px;"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
              </div>
            </el-form-item>
            <el-checkbox style="padding-left: 140px;" v-model="checked">发短信提醒下一步处理人</el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0px 0 0;">
          <el-col :span="24">
            <el-form-item label="抄送人：">
              <el-tag
                :disable-transitions="false"
                @close.stop="handleClose(CopyPersonList,tag)"
                v-for="tag in CopyPersonList"
                :key="tag.id"
                closable
                size="small">
                {{tag.userName}}
              </el-tag>
              <el-tag @click="add_CopyPerson(CopyPersonList)" size="small">+添加抄送人</el-tag>
              <!-- <el-button @click="add_CopyPerson(item.assigneeUsers,index)" size="small" icon="el-icon-plus">添加抄送人</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align:center">
      <el-button type="danger" plain @click="cancel">暂不提交</el-button>
      <el-button type="primary" @click="submit('searchFormObj')">确认提交</el-button>
    </div>

    <el-dialog
      class="modal"
      append-to-body
      :title="approverTitle"
      v-if="approver_dialogVisible"
      :visible.sync="approver_dialogVisible">
      <approver :assigneeUsersList="assigneeUsersList" @closeRole="getCloseRole">
      </approver>
    </el-dialog>
  </div>
</template>
<script>
  import {getTagList, deleteTagList, createTagList} from 'api/warehouseManagement/straightForward/straightForward'
  import approver from 'components/processWindow/approver'
  import {EventBus} from '@/event-bus.js'


  export default {
    name: 'processWindow',
    components: {
      approver
    },
    data() {
      return {
        labelPosition: 'right',
        checked: true,
        searchFormObj: {},
        rules: {
          taskName: [
            {required: true, message: '请输入流程主题/描述', trigger: 'blur'},
            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ]
        },
        inputVisible: false,
        inputValue: '',
        newTags2: [],
        tags: [],
        tags2: [
          {workflowTag: '同意'},
          {workflowTag: '不同意'}
        ],
        approverTitle: '',
        nextNodesList: [],
        assigneeUsers: [],
        approver_dialogVisible: false,
        assigneeUsersList: [],
        currentIndex: 0,
        isAddType: '',
        CopyPersonList: [],
      }
    },
    props: {
      isdialogVisible_detail: {
        type: Boolean,
        default: false
      },
      processObj: {
        type: Object,
        default: () => {
        }
      },
      projectId: {
        type: Number,
        default: 0
      },
      sid: {
        type: Number,
        default: 0
      }
    },
    watch: {
      processObj: {
        handler() {
          this.setProcessData();
        },
        immediate: true
      }
    },
    created() {
      this._getTagList();
    },
    mounted() {
      // EventBus.$on('closeRole', param => {
      //   console.log(param);
      //   this.approver_dialogVisible = param.flag;
      // })
    },
    methods: {
      // 获取评论标签
      _getTagList() {
        // this.newTags2 = [];
        getTagList().then(res => {
          // let results = res.results;
          this.newTags2 = res.results;
        })
      },
      setProcessData() {
        this.searchFormObj = JSON.parse(JSON.stringify(this.processObj));
        this.searchFormObj.taskName = localStorage.getItem('taskName');
        let workflowNextNodes = this.searchFormObj.workflowNextNodes;
        let nextNodes = workflowNextNodes.nextNodes;
        for (let i in nextNodes) {
          let item = nextNodes[i];
          if (workflowNextNodes.currentNodeCode === 'PARALLEL') {  // 代表并行
            item.flag = true;
          }
          item.flag = Number(i) === 0;
        }
        this.nextNodesList = nextNodes;
      },
      // 选择审批节点
      handleChooseRole(item) {
        let workflowNextNodes = this.searchFormObj.workflowNextNodes;
        if (this.nextNodesList.length <= 1) return;
        if (workflowNextNodes.currentNodeCode === 'PARALLEL') return;
        if (workflowNextNodes.currentNodeCode === 'TOLERANCE') {
          this.checkBoxRule(item);
        }
        if (workflowNextNodes.currentNodeCode === 'EXCLUSION') {
          this.radioRule(item);
        }
      },
      //多选
      checkBoxRule(item) {
        item.flag = !item.flag;
        this.$forceUpdate(); // 强制刷新节点
        console.log(this.nextNodesList);
      },
      // 单选
      radioRule(item) {
        for (let i in this.nextNodesList) {
          let child = this.nextNodesList[i];
          child.flag = false;
        }
        item.flag = true;
        this.$forceUpdate();
      },
      cancel() {
        this.$emit('isCancle');
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.searchFormObj
            let workflowNextNodes = this.searchFormObj.workflowNextNodes;
            let newNextNodesList = this.nextNodesList.filter(v => v.flag);
            let isEnd = newNextNodesList.length ? newNextNodesList[0].nodeCode  : '';
            if (newNextNodesList.length === 0 && this.searchFormObj.step === 0 && isEnd!=='END') {
              this.$message.error('请选择审批节点');
              return
            }
            let workflowTaskApproveNodes = [];
            for (let i in newNextNodesList) {
              let item = newNextNodesList[i];
              // if(item.)
              workflowTaskApproveNodes.push({
                "assigneeIds": item.assigneeUsers.map(v => v.id),
                "processNodeCode": item.processNodeCode
              })
            }
            const data = {
              "comment": this.searchFormObj.comment,
              
              "currentProcessNodeCode": workflowNextNodes.currentProcessNodeCode,
              
              "isSendSms": this.checked ? 1 : 0,
              "processCode": workflowNextNodes.processCode,
              "projectId": this.projectId,
              "sendTo": this.CopyPersonList.map(v => v.id),
              "sid": this.sid,
              "taskId": this.searchFormObj.taskId,
              "taskName": this.searchFormObj.taskName,
              workflowTaskApproveNodes: this.searchFormObj.step === 0 &&  isEnd!=='END' ? workflowTaskApproveNodes : [],
              // warehouseId:this.warehouseId
              // "workflowTaskApproveNodes": [
              //   {
              //     "assigneeIds": item.assigneeUsers.map(),
              //     "processNodeCode": item.processNodeCode
              //   }
              // ]
            }
            this.$emit('isSubmit', data);
          } else {
            return false
          }
        })

      },
      handleClose(list, tag) {
        list.splice(list.indexOf(tag), 1);
      },
      handleClose2(tag) {
        if (!tag.id) return;
        deleteTagList(tag.id).then(res => {
          this._getTagList();
        })
        // this.newTags2.splice(this.newTags2.indexOf(tag), 1);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          createTagList(inputValue).then(res => {
            this._getTagList();
          })
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      addTag(tag) {
        this.$set(this.searchFormObj, 'comment', tag.workflowTag);
        // this.searchFormObj.comment = tag.workflowTag;
      },
      //添加审批人
      add_Approver(arr, index) {
        // var  =
        this.approverTitle = "添加审批人";
        this.isAddType = 'Approver';
        this.currentIndex = index;
        this.assigneeUsersList = arr;
        this.approver_dialogVisible = true;
      },
      //添加抄送人
      add_CopyPerson(arr) {
        this.approverTitle = "添加抄送人";
        this.isAddType = 'CopyPerson';
        if (arr.length > 0) {
          this.assigneeUsersList = arr;
        } else {
          this.assigneeUsersList = [];
        }
        this.approver_dialogVisible = true;
      },
      //关闭弹窗
      getCloseRole(val) {
        this.approver_dialogVisible = false;
        if (this.isAddType === 'Approver') {
          if (val) {
            this.nextNodesList[this.currentIndex].assigneeUsers = val;
          }
        } else {
          if (val) {
            this.CopyPersonList = val;
          }
        }
      },
    }

  }
</script>
<style lang="scss" scoped>
  .processWindow_detail {
    .modal_con {
      padding-top: 20px;
      .dealingPeople {
        width: 33%;
        border: 1px #ddd solid;
        border-radius: 10px;
        padding: 0px 0px 30px 20px;
        position: relative;
        margin-right: 5%;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.active {
          border: 1px #0079e8 solid;
        }
        .dealingPeople_inner {
          display: flex;
          .name {
            width: 70px;
          }
          .name_list {
            flex: 1;
            padding-top: 5px;
            li {
              float: left;
              padding: 0px 8px;
              position: relative;
              border: 1px solid #a4cef5;
              background: rgba(0, 121, 232, 0.1);
              border-radius: 5px;
              line-height: 26px;
              margin-right: 8px;
              font-size: 12px;
              padding-right: 25px;
              margin-bottom: 5px;
              i {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 10px;
              }
            }
            .add_btn {
              width: 50px;
              height: 30px;
              border: 1px #ccc solid;
              border-radius: 3px;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                font-size: 20px;
              }

            }
          }
        }
        .select_icon {
          width: 30px;
          height: 30px;
          border: 1px #ccc solid;
          display: inline-block;
          position: absolute;
          top: 0px;
          right: 0px;
          border: none;
          border-left: 1px #ddd solid;
          border-bottom: 1px #0079e8 solid;
          border-radius: 0 10px 0 0;
          &.active {
            border-left: 1px #0079e8 solid;
            border-bottom: 1px #0079e8 solid;
          }
          i {
            font-size: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #0079e8;
          }

        }
      }
      .yijian {
        width: 50%;
        display: inline-block;
        float: left;
      }
      .chuli {
        display: inline-block;
        float: left;
        padding-left: 5%;

        .chuli_btn {
          float: left;
        }
        .add_btn2 {
          width: 50px;
          height: 30px;
          display: inline-block;
          float: left;
          border: 1px #ccc solid;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 10px;
          i {
            font-size: 20px
          }
        }
      }

    }

  }

</style>
