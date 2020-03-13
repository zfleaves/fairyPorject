<template>
  <div
    v-if="total>pageSize"
    class="pagination" :style="{textAlign:textAlign}">
    <el-pagination
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      background
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: "page",
    data() {
      return {
        currentPage: 1,
      }
    },
    props: {
      textAlign: {
        type: String,
        default: 'right'
      },
      total: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('pages', val);
      },
      resetCurrentPage() {
        this.currentPage = 1;
        this.$emit('pages', this.currentPage);
      }
    }
  }
</script>
<style scoped lang="scss">
  .pagination {
    width: 100%;
    margin-top: 20px;
  }
</style>
