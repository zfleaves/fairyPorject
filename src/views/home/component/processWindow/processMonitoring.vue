<template>
  <div class="processMonitoring">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="流程图" name="flowChart">流程图</el-tab-pane>
      <el-tab-pane label="审批记录" name="approvalRecord">审批记录</el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 'flowChart'">
      flowChart
    </div>
    <div v-else>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="nodeName"
          label="节点名称"
        >
        </el-table-column>
        <el-table-column
          width="140"
          prop="approval"
          label="处理类型">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="处理意见">
        </el-table-column>
        <el-table-column
          width="140"
          prop="assigneeName"
          label="处理人">
        </el-table-column>
        <el-table-column
          label="处理时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | setTime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getWorkflowBuildTaskLogs} from 'api/home/home'

  export default {
    name: 'processMonitoring',
    props: {
      id: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        activeName: 'flowChart',
        tableData: []
      };
    },
    methods: {
      handleClick(tab, event) {
        this.activeName = tab.name
      },
      _getWorkflowBuildTaskLogs() {
        getWorkflowBuildTaskLogs(this.id).then(res => {
          this.tableData = res.results;
        })
      }
    },
    mounted() {
      this._getWorkflowBuildTaskLogs()
    }
  }
</script>
<style scoped lang="scss">

</style>
