<template>
  <div id="sample" style="width:100%;margin: 0 auto">
    <div class="title" style="padding: 10px 0;height: 32px;">
      固定资产仓库登记流程设计
      <el-button @click="handlePublishProcess" style="float: right;margin-right: 10px;"
                 size="small" type="primary" icon="el-icon-plus">
        发布流程
      </el-button>
    </div>
    <div style="width:100%; white-space:nowrap;">
      <!--  控件 -->
      <span style="display: inline-block; vertical-align: top; padding: 5px; width:230px">
      <div id="myPaletteDiv" style="border: solid 1px #ccc; height: 750px"></div>
    </span>

      <!--  设计面板 -->
      <span style="display: inline-block; vertical-align: top; padding: 5px; width:80%">
      <div id="myFlowDesignerDiv" style="border: solid 1px #ccc; height: 750px"></div>
    </span>
    </div>


    <el-dialog title="编辑步骤" @close="closeNode" v-if="editNode" :visible.sync="editNode">
      <el-input v-model="text" autocomplete="off">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNode">取 消</el-button>
        <el-button type="primary" @click="_updateNodeData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {FlowDesigner} from '../../util/flow-desgin'
  import {
    getProcessToolNodeList,
    getWorkflowBuildInstanceProcess,
  } from '@/api/processDefinition/companyDesign'
  import {tryPublishProcesses, publishProcesses} from "api/processDefinition/process";
  import {closeRoute} from 'mixins'

  export default {
    name: "process-company-design1",
    mixins: [closeRoute],
    data() {
      return {
        editNode: false,
        text: '',
        nodeObj: {
          "class": "go.GraphLinksModel",
          "modelData": {"position": "-5 -5"},
          "nodeDataArray": [
            {"key": "1", "text": "开始", "figure": "Circle", "fill": "#4fba4f", "stepType": 1, "loc": "90 110"},
            {"key": "2", "text": "结束", "figure": "Circle", "fill": "#CE0620", "stepType": 2, "loc": "770 110"},
            {"key": "3", "text": "填写请假信息 ", "loc": "210 110", "remark": "22"},
            {"key": "4", "text": "部门经理审核 ", "loc": "370 110", "remark": "33"},
            {"key": "5", "text": "人事审核  ", "loc": "640 110", "remark": "44"},
            {"key": "6", "text": "副总经理审核  ", "loc": "510 40", "remark": ""},
            {"key": "7", "text": "总经理审核  ", "loc": "500 180", "remark": ""}
          ],
          "linkDataArray": [
            {"from": "1", "to": "3"},
            {"from": "3", "to": "4"},
            {"from": "4", "to": "5"},
            {"from": "5", "to": "2"},
            {"from": "4", "to": "6", "key": "1001", "text": "小于5天 ", "remark": "", "condition": "Days<5"},
            {"from": "6", "to": "5"},
            {"from": "4", "to": "7", "key": "1002", "text": "大于5天 ", "remark": "", "condition": "Days>5"},
            {"from": "7", "to": "5"}
          ]
        },
        formCode: '',
        processCode: '',
        processName: '',
        typeList: [
          {nodeCode: 'BEGIN', figure: 'Circle', fill: '#4fba4f'},
          {nodeCode: 'APPROVAL', figure: 'Rectangle', fill: '#004c9f'},
          {nodeCode: 'COUNTERSIGN', figure: 'Rectangle', fill: '#004c9f'},
          {nodeCode: 'DECIDE', figure: 'Diamond', fill: '#f18127'},
          {nodeCode: 'TOLERANCE', figure: 'Diamond', fill: '#f18127'},
          {nodeCode: 'EXCLUSION', figure: 'Diamond', fill: '#f18127'},
          {nodeCode: 'PARALLEL', figure: 'Diamond', fill: '#f18127'},
          {nodeCode: 'MERGE', figure: 'Diamond', fill: '#f18127'},
          {nodeCode: 'END', figure: 'Circle', fill: '#4fba4f'},
        ],
      }
    },
    created() {
      let params = this.$route.params;
      this.formCode = Base64.decode(params.formCode);
      this.processCode = Base64.decode(params.processCode);
      this.processName = Base64.decode(params.processName);

    },
    mounted() {
      this.myDesigner = new FlowDesigner('myFlowDesignerDiv', this.processCode);
      // this.myDesigner.initToolbar('myPaletteDiv');
      // this.myDesigner.displayFlow(this.nodeObj);
      this._getProcessToolNodeList();
      this._getWorkflowBuildInstanceProcess()
    },
    methods: {
      closeNode() {

      },
      _updateNodeData() {

      },
      // 初始化工具栏
      _getProcessToolNodeList() {
        getProcessToolNodeList().then(res => {
          let arr = this.setToolNodeList(res.results);
          console.log(arr)
          this.myDesigner.initToolbar('myPaletteDiv', arr);
        })
      },
      // 处理工具栏 数据
      setToolNodeList(arr) {
        let list = [];
        // arr = arr.filter(v=>v.nodeCode !== 'END' || v.nodeCode !== 'BEGIN');
        for (let i in arr) {
          let item = arr[i];
          for (let j in item.wfNodes) {
            let child = item.wfNodes[j];
            child.key = child.nodeCode;
            child.text = child.nodeName;
            child.width = 150;
            child.height = 150;
            child.type = 'tool';
            // console.log(child.nodeCode)
            // MERGE
            if (child.nodeCode !== 'END' && child.nodeCode !== 'BEGIN') {
              let index = this.typeList.findIndex(v => v.nodeCode === child.nodeCode);
              child.figure = this.typeList[index].figure || '';
              child.fill = this.typeList[index].fill || '';
              list.push(child);
            }
          }
        }
        // console.log(list);
        return list;
      },
      _getWorkflowBuildInstanceProcess() {
        getWorkflowBuildInstanceProcess(this.processCode).then(res => {
          let nodeObj = res.results;
          this.nodeObj.nodeDataArray = this.setNodeDataArray(nodeObj.processNodes);
          this.nodeObj.linkDataArray = this.setLinkDataArray(nodeObj.processNodeConnects);
          this.myDesigner.displayFlow(this.nodeObj);// 在设计面板中显示流程图
        })
      },
      // 处理流程节点
      setNodeDataArray(arr) {
        // {"key": "1", "text": "开始", "figure": "Circle", "fill": "#4fba4f", "stepType": 1, "loc": "90 110"},
        let list = [];
        for (let i in arr) {
          let item = arr[i];
          item.key = item.processNodeCode;
          item.text = item.nodeName;
          item.width = 50;
          item.height = 50;
          let index = this.typeList.findIndex(v => v.nodeCode === item.nodeCode);
          item.figure = this.typeList[index].figure || '';
          item.fill = this.typeList[index].fill || '';
          item.loc = item.indexX + ' ' + item.indexY;
          if (item.nodeCode !== 'BEGIN') {
            item.stepType = 1;
          }
          if (item.nodeCode === 'BEGIN') {
            item.category = 'nodeStyleOne';
          }
          if (item.nodeCode !== 'END') {
            item.stepType = 4;
          }
          list.push(item);
        }
        return list;
      },
      // 处理连线
      setLinkDataArray(arr) {
        // {"from": "4", "to": "6", "key": "1001", "text": "小于5天 ", "remark": "", "condition": "Days<5"},
        let list = [];
        for (let i in arr) {
          let item = arr[i];
          item.text = item.tips;
          item.from = item.processNodeCode;
          item.to = item.nextProcessNodeCode;
          list.push(item);
        }
        console.log(list);
        return list;
      },
      // 发布流程
      handlePublishProcess() {
        tryPublishProcesses(this.processCode).then(res => {
          if (res.status === 0) {
            if (res.results.status === 1) {
              this.$message({
                dangerouslyUseHTMLString: true,
                message: res.results.errorMsg,
                type: 'error'
              });
              return
            }
            this._publishProcesses();
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      },
      // 发布流程
      _publishProcesses() {
        publishProcesses(this.formCode, this.processCode).then(res => {
          if (res.status === 0) {
            this.$message.success('发布流程成功');
            this.setRoute();
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
