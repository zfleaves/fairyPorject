<template>
  <div class="buttonComponent3">
    <el-button v-fast-click type="primary" class="urgent" @click="handleOneClickSync" size="small" icon="el-icon-search">一键同步</el-button>
    <el-button v-fast-click type="primary" class="urgent" @click="handleOneClickClear" size="small" plain icon="el-icon-search">一键清除</el-button>
    <el-button v-fast-click type="primary" class="other" @click="handleDownloadTemplate" size="small" plain icon="el-icon-search">下载模板
    </el-button>
    <el-button v-fast-click type="primary" class="other" @click="handleImportClassification" size="small" plain icon="el-icon-search">导入分类</el-button>
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
        //一键同步
      handleOneClickSync() {
        this.$emit('handleOneClickSync')
      },
    //   一键清除
      handleOneClickClear() {
        this.$emit('handleOneClickClear')
      },
    //   下载模板
      handleDownloadTemplate() {
        this.$emit('handleDownloadTemplate')
      },
    //   导入分类
      handleImportClassification() {
        this.$emit('handleImportClassification')
      },
    }
  }
</script>
<style scoped lang='scss'>
  .buttonComponent3 {
    padding-right: 10px;
    button {
      width: 110px;
    }
  }
</style>
