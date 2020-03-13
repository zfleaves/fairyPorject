<template>
  <div class="Pagination">
    <el-pagination
    v-if="total>pageSize"
      style="text-align: right;margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      background
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'Pagination',
    data() {
      return {
        currentPage: 1
      }
    },
    props: {
      pageSize: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('sentPages', val);
      },
      handleCurrentChange(val) {
        this.$emit('sentPages', val);
      },
      setCurrentPage() {
        this.currentPage = 1;
        this.$emit('sentPages', 1);
      }
    }
  }
</script>

