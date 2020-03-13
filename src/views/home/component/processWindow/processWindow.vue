<template>
  <div class="processWindow">
    <!-- <div class="processWindowTitle">供应商收录审批流程提交<i class="el-icon-close"></i></div> -->
    <div class="modal_con">
      <p>本业务功能没有启用流程审批功能</p>
      <p>本业务功能没有启用流程审批功能</p>
      <p>本业务功能没有启用流程审批功能</p>
    </div>
    <div class="dialog-footer">
      <el-button @click="cancel">暂不提交</el-button>
      <el-button type="primary" @click="submit">确认提交</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'processWindow',
    data() {
      return {
        dialogVisible: false
      }
    },
    props: {
      isdialogVisible: {
        type: Boolean,
        default: false
      },
      processObj:{
        type: String,
        default: ''
      }
    },
    methods: {
      cancel() {
        this.$emit('isCancle')
      },
      submit() {
        this.$emit('isSubmit')
      }
    }

  }
</script>
<style lang="scss" scoped>
  .processWindow {
      .modal_con {
        padding-top: 20px;
        p {
          line-height: 30px;
          font-size: 16px;
        }
      }
  }

</style>
