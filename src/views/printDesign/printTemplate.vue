<template>
  <div class="printTemplate">
    <div class="printTemplateInner">
      <el-table
        :data="PrintModelList"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="printModelName"
          label="打印模板名"
        >
        </el-table-column>
        <el-table-column
          prop="printModelCode"
          label="打印模板代码"
        >
        </el-table-column>
        <el-table-column
          prop="updateByName"
          label="更改人"
        >
        </el-table-column>
        <el-table-column
          label="更改时间"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | setTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="操作"
          width="160"
          label="地址">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑打印模板</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Auth from 'util/auth'
  import {formatTime} from 'util'
  import {getSysbasePrintModelList} from 'api/printDesign'

  const Base64 = require("js-base64").Base64;
  export default {
    name: 'printTemplate',
    data() {
      return {
        PrintModelList: []
      }
    },
    created() {
      getSysbasePrintModelList(Auth.hasUserInfo().userId).then(res => {
        this.PrintModelList = res.results
        console.log(res.results)
      })
    },
    methods: {
      handleClick(row) {
        console.log(row)
        let printModelCode = Base64.encode(row.printModelCode);
        let taskId = Base64.encode('template');  // 模板
        let id = Base64.encode(0);
        this.$router.push(`printDesign/${printModelCode}/${taskId}/${id}`)
      }
    },
    filters: {
      setTime(val) {
        return formatTime(val)
      }
    }
  }
</script>
<style scoped lang="scss">
  .printTemplate {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 10px;
    .printTemplateInner {
      border: 1px #eee solid;
      padding: 10px;
    }
  }
</style>
