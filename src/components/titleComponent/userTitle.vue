<template>
  <div class="userTitle">
    <!--<h3 class="midFont grey">{{title}}</h3>-->
    <div class="btn-group" ref="btnGroup">
      <el-button v-show="IsAdd" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">
        添加
      </el-button>
      <el-button class="urgent" v-show="IsProcess" type="primary" icon="iconfont icon-submit" size="small" @click="handleProcess">
        提交流程
      </el-button>
      <el-button class="urgent" v-show="IsMonitor" type="primary" icon="el-icon-third-Monitor" size="small" @click="handleMonitor">
        流程监控
      </el-button>
      <el-button class="other" v-show="IsPrint" type="primary" icon="el-icon-printer" size="small" @click="handlePrint">
        打印
      </el-button>
      <el-button class="more" v-show="IsImportant" type="primary"  icon="iconfont icon-import" size="small" @click="handleImprotExcel">
        导 出
      </el-button>
      <el-button class="urgent" v-show="IsDeleteMore" type="primary" icon="iconfont icon-delete" size="small"
                 @click="handleDeleteMore" :disabled="!flowStatus">
        批量删除
      </el-button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "userTitle",
    props: {
      title: {
        type: String,
        default: ""
      },
      flowStatus: {type: Boolean, default: true},
      IsAdd: {type: Boolean, default: true,},
      IsImportant: {type: Boolean, default: true,},
      IsPrint: {type: Boolean, default: true,},
      IsProcess: {type: Boolean, default: true,},
      IsMonitor: {type: Boolean, default: true,},
      IsDeleteMore: {type: Boolean, default: false,},
    },
    methods: {
      handleAdd() {
        this.$emit('sendAddClick', '添加');
      },
      handleImprotExcel() {
        this.$emit('sendExcelClick', '导出Excel');
      },
      handlePrint() {
        this.$emit('sendPrintClick', '打印');
      },
      handleProcess() {
        this.$emit('sendProcessClick', '提交流程');
      },
      handleMonitor() {
        this.$emit('sendMonitorClick', '流程监控');
      },
      handleDeleteMore() {
        this.$emit('sendDeleteMoreClick', '批量删除');
      }
    },
    mounted() {
      // let buttonList = this.$refs.btnGroup.getElementsByTagName("button");
      // let flag = false;
      // for (let i = 0; i < buttonList.length; i++) {
      //   let item = buttonList[i];
      //   if (item.style.display !== 'none') {
      //     flag = true;
      //     break;
      //   }
      // }
      // console.log(flag);
      // return flag;
    }
  }
</script>

<style scoped lang="scss">
  .userTitle {
    width: 100%;
    padding: 10px;
    /*height: 40px;*/
     /*margin-bottom: 12px;*/
    h3 {
      float: left;
      line-height: 40px;
    }
    .btn-group {
      /*float: right;*/
      text-align: right;
      height: 40px;
    }
  }
</style>
