<template>
  <component
    :is="formCode" :form-code="formCode"
    :task-id="taskId"
    :id="id">
  </component>

</template>

<script>
  import warInAndOut from './component/warInAndOut'
  import supplierExamination from './component/supplierExamination'
  
  // import warInAndOut from './component/warInAndOut'

  const Base64 = require("js-base64").Base64;
  export default {
    name: 'printDesign',
    components: {
      warInAndOut,supplierExamination
    },
    data() {
      return {
        formCode: 'warInAndOut',
      }
    },
    created() {
      let params = this.$route.params;
      this.formCode = Base64.decode(params.formCode);
      this.taskId = Base64.decode(params.taskId);
      this.id = Base64.decode(params.id);
      // this.isPrint = this.taskId !== 'template';
    }
  }
</script>
<style scoped lang="scss">
  .printDesign {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 10px;
    .BTN {
      text-align: right;
    }
    .printDesignCon {
      display: flex;
      .left {
        width: 450;
        height: 100%;
        .leftTop {
          width: 100%;
          height: 60px;
          line-height: 60px;
          border-bottom: 1px #eee solid;
          padding: 0 2px;
          .title {
            float: left;
          }
          .btn {
            float: right;
          }
        }
      }
      .right {
        flex: 1;
      }
    }
  }
</style>
