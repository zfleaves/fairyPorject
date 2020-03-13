<template>
  <div class="buttonComponent">
    <el-button v-fast-click type="primary" @click="handleSubmission" size="small" icon="el-icon-search">提交</el-button>
    <el-button v-fast-click type="danger" @click="handleStepBack" size="small" plain icon="el-icon-search">退上一步</el-button>
    <el-button v-fast-click type="warning" @click="handleReturningOriginator" size="small" plain icon="el-icon-search">退发起人
    </el-button>
    <el-button v-fast-click type="primary" @click="handleProcessMonitoring" size="small" plain icon="el-icon-search">流程监控</el-button>
    <el-button v-fast-click v-show="isShowDeleteProcess" type="danger" @click="handleDeleteProcess" size="small" plain
               icon="el-icon-search">删除流程
    </el-button>
    <!-- <el-row style="text-align: right;padding: 0 10px;height: 65px;border-bottom: 1px #eee solid;line-height: 65px;">
        <el-col :span="2" :offset="isShowDeleteProcess ? 14 : 16">
            <el-button type="primary" @click="handleSubmission" size="small" icon="el-icon-search">提交</el-button>
        </el-col>
        <el-col :span="2">

        </el-col>
        <el-col :span="2">

        </el-col>
        <el-col :span="2">

        </el-col>
        <el-col :span="2" v-show="isShowDeleteProcess">

        </el-col>
    </el-row> -->

  </div>
</template>
<script>
  export default {
    props: {
      isShowDeleteProcess: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // showDeleteProcess:false
      }
    },
    methods: {
      handleSubmission() {
        this.$emit('toHandleSubmission')
      },
      handleStepBack() {
        this.$emit('toHandleStepBack')
      },
      handleReturningOriginator() {
        this.$emit('toHandleReturningOriginator')
      },
      handleProcessMonitoring() {
        this.$emit('toHandleProcessMonitoring')
      },
      handleDeleteProcess() {
        this.$emit('toHandleDeleteProcess')
      }
    }
  }
</script>
<style scoped lang='scss'>
  .buttonComponent {
    text-align: right;
    padding-right: 10px;
    button {
      width: 110px;
    }
  }
</style>
