<template>
  <div>
    <component
      ref="backlog"
      @showDialog="showDialog" @freshData="getfreshData" :is="formCode" :dialogFormVisible="dialogFormVisible">
    </component>
    <el-dialog
      class="modal"
      :title="processTitle"
      :top="processTop"
      :visible.sync="dialogVisible"
      :width="processWidth">
      <component
        :projectId="projectId"
        :sid="sid"
        :process-obj="processObj"
        :is="processName"
        :id="id"
        @isCancle="getIsCancle" @isSubmit="getIsSubmit">
      </component>
    </el-dialog>
  </div>
</template>
<script>
  import {processMix2} from 'mixins'
  import warInAndOut from './component/warInAndOut'
  import {getNextNodeAssigneeInandoutUsers, updateContractInandout} from 'api/warehouseManagement/warehousing'
  import processWindow2 from 'views/home/component/processWindow/processWindow'
  import processWindow_detail2 from 'views/home/component/processWindow/processWindow_detail'
  import processMonitoring from 'views/home/component/processWindow/processMonitoring'


  export default {
    mixins: [processMix2],
    components: {
      processWindow_detail2, processWindow2, processMonitoring,
      //业务组件
      warInAndOut
    },
    data() {
      return {
        id: '',
        sid: '',
        formCode: '',
        dialogFormVisible: false,
        processName: '',
        processObj: '',
        processWidth: '',
        processTop: '',
        processTitle: '',
        dialogVisible: false,
        projectId: '',
        step: ''
      }
    },
    created() {
      let params = this.$route.params;
      this.id = Number(params.id);
      this.sid = Number(params.sid);
      this.formCode = params.formCode;
      //   this._findWorkflowLogs();
    },
    methods: {
      getfreshData() {

      },
      getIsCancle() {
        this.dialogVisible = false;
      },
      getIsSubmit(val) {
        this.dialogVisible = false;
        if (this.step === 0) {
          this.$refs.backlog.saveProjectForm(val);
        }
        if (this.step === 1) {
          this.$refs.backlog.handleStepBack(val);
        }
        if (this.step === 2) {
          console.log(val);
          this.$refs.backlog.handleReturningOriginator(val);
        }
        // updateContractInandout(val).then(res => {
        //   if (res.status === 0) {
        //     this.$message.success('流程提交成功');
        //
        //   } else {
        //     this.$message.error(res.errorMessage);
        //   }
        // })
      },
      showDialog(results) {
        if (!results) {
          this.processName = 'processMonitoring';
          this.processWidth = '80%';
          this.processTop = '10vh';
          this.processTitle = '流程监控';
          this.dialogVisible = true;
        } else {
          this.projectId = results.projectId || 0;
          this.step = results.step;
          if (results.workflowNextNodes === null) {
            this.processName = 'processWindow2';
            this.processObj = '';
            this.processWidth = '30%';
            this.processTop = '25vh';
          } else {
            this.processName = 'processWindow_detail2';
            this.processObj = results;
            this.processWidth = '80%';
            this.processTop = '10vh';
          }
          this.processTitle = this.$route.meta.title + '流程提交';
          this.dialogVisible = true;
        }
      }
    }
  }
</script>
