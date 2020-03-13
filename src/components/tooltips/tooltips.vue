<template>
  <div class="tooltip" :style="{textAlign:textAlign}" ref="isOverflow" :class="border?'border':''">
    <el-tooltip v-if="isEllipsis" class="item" effect="dark" :content="value" placement="top-start">
      <span>{{value}}</span>
    </el-tooltip>
    <span v-else>{{value}}</span>
  </div>
</template>

<script>
  export default {
    name: 'borrow',
    data() {
      return {
        isEllipsis: false
      }
    },
    props: {
      value: {},
      border: {
        type: Boolean,
        default: false
      },
      textAlign: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      isCollapse() {
        return this.$store.state.call.sidebarOpen
      }
    },
    watch: {
      value() {
        this.judgeMax();
      },
      isCollapse() {
        this.judgeMax();
      }
    },
    mounted() {
      this.judgeMax();
    },
    methods: {
      judgeMax() {
        this.$nextTick(() => {
          let isOverflow = this.$refs.isOverflow;
          let cWidth = isOverflow.clientWidth;
          let sWidth = isOverflow.scrollWidth;
          this.isEllipsis = sWidth > cWidth;
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .tooltip {
    width: 100%;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #606266;
    &.border {
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      cursor: not-allowed;
    }
  }
</style>
