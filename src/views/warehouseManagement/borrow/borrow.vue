<template>
  <div class="borrow">
    <el-number :precision="2" placeholder="请输入数值" v-model="total">
    </el-number>
    <el-input placeholder="请输入中文" v-model="query">
    </el-input>
    <el-button type="primary" size="small" @click="setNumber">
      设置数据
    </el-button>
    <!--<el-tooltip-->
    <!--effect="dark" :content="query" placement="top">-->
    <!--</el-tooltip>-->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="cons" ref="isOverflow" style="width: 100%;height: 40px;">
          <el-tooltip v-if="isEllipsis" class="item" effect="dark" :content="query" placement="top-start">
            <span>{{query}}</span>
          </el-tooltip>
          <span v-else>{{query}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'borrow',
    data() {
      return {
        total: '',
        title: '',
        query: '的方式发送犯得上电风扇的方式告诉方法电',
        isEllipsis: false
      }
    },
    watch: {
      query() {
        this.judgeMax();
      }
    },
    mounted() {
      this.judgeMax();
    },
    methods: {
      setNumber() {
        let price = 12.61;
        let num = 11.14;
        this.total = price * num;
      },
      judgeMax() {
        this.$nextTick(()=>{
          let isOverflow = this.$refs.isOverflow;
          let cWidth = isOverflow.clientWidth;
          let sWidth = isOverflow.scrollWidth;
          console.log(cWidth);
          console.log(sWidth);
          this.isEllipsis = sWidth > cWidth;
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .cons {
    width: 100%;
    height: 40px;
    white-space: nowrap;
    background: pink;
    line-height: 40px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
