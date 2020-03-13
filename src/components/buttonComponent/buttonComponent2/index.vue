<template>
  <div class="buttonComponent2">
    <el-button v-fast-click type="primary" @click="handleAddTo" size="small" icon="el-icon-search">添加</el-button>
    <el-button v-fast-click type="danger" class="urgent" @click="handleSubmissionProcess" size="small" plain icon="el-icon-search">提交流程</el-button>
    <el-button v-fast-click type="danger" class="urgent" @click="handleProcessMonitoring" size="small" plain icon="el-icon-search">流程监控
    </el-button>
    <el-button v-fast-click type="warning" class="other" @click="handlePrint" size="small" plain icon="el-icon-search">打印</el-button>
    <el-button v-fast-click class="more"   type="primary" @click="handleExport" size="small" plain
               icon="el-icon-search">导出
    </el-button>
  </div>
</template>
<script>
  export default {
    props: {
     
    },
    data() {
      return {
        // showDeleteProcess:false
      }
    },
    methods: {
        //添加
      handleAddTo() {
        this.$emit('handleAddTo')
      },
    //   提交流程
      handleSubmissionProcess() {
        this.$emit('handleSubmissionProcess')
      },
    //   流程监控
      handleProcessMonitoring() {
        this.$emit('handleProcessMonitoring')
      },
    //   打印
      handlePrint() {
        this.$emit('handlePrint')
      },
    //   导出
      handleExport() {
        this.$emit('handleExport')
      }
    }
  }
</script>
<style scoped lang='scss'>
  .buttonComponent2 {
    text-align: right;
    padding-right: 10px;
    button {
      width: 110px;
    }
  }
</style>
