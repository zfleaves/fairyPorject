
<template>
    <div class="needToBeDealtWith">
        <el-table
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
             prop="taskName"
            show-overflow-tooltip
            label="任务名称">
          </el-table-column>
          <el-table-column
            prop="nodeName"
          show-overflow-tooltip
            label="节点名称">
          </el-table-column>
          <el-table-column
            prop="taskCreateBy"
            show-overflow-tooltip
            label="发起人">
          </el-table-column>
          <el-table-column
          
           show-overflow-tooltip
            label="发起时间">
             <template slot-scope="scope">
              <span>{{scope.row.taskCreateTime | setTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prevAssigneeName"
            show-overflow-tooltip
            label="上一步发起人">
          </el-table-column>
          <el-table-column
           show-overflow-tooltip
            label="到达时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | setTime}}</span>
            </template>
          </el-table-column>
        </el-table>
         <Pagination @sentPages="sentPages" :total="total" :pageSize="pageSize">
        </Pagination>
    </div>
</template>

<script>
    import {getSysbaseWorkflowTasksList} from 'api/process'
    import Pagination from 'components/Pagination/Pagination'
    export default {
        name:'needToBeDealtWith',
        components: {
            Pagination
        },
        data(){
            return{
                tableData:[],
                pageNo:0,
                pageSize:5,
                total:0
            }
        },
        created(){
            this._getSysbaseWorkflowTasksList();
        },
        methods:{
            //我的待办列表
            _getSysbaseWorkflowTasksList(){
                getSysbaseWorkflowTasksList(this.pageNo,this.pageSize).then(res=>{
                    this.tableData = res.results.result;
                    this.total = res.results.total
                })
            },
            sentPages(val){
                this.pageNo = val;
            }
        }
    }
</script>
<style scoped lang="scss">
.needToBeDealtWith {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 10px;
    height: calc(100% - 20px);
    overflow: hidden;
}
</style>