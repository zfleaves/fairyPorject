
<template>
    <div class="processMenu">
        <div class="processMenuSearch">
            <el-row style="padding-top: 20px;">
                <el-col :span="8" style="padding-left:20px">
                    <el-form :label-position="labelPosition"  ref="companyDesignForm" :model="companyDesignForm" label-width="100px">
                        <el-form-item label="业务表单名">
                            <el-input clearable size="small" v-model="companyDesignForm.formName" placeholder="请输入业务表单名"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col style="padding-left:20px;line-height: 40px;float: right;text-align: right;" :span="4">
                    <el-button  style="width:50%" size="small" type="warning" @click="searchFormName"  icon="el-icon-search">查询</el-button>
                </el-col>
            </el-row>
              
        </div>
        <div class="processMenuCon">
            <div class="processMenuTable">
                <el-row>
                    <el-col style="padding-left:20px;line-height: 40px;float: right;text-align: right;" :span="4">
                        <el-button style="width:50%" size="small" type="primary" @click="addFormName"  icon="el-icon-search">添加</el-button>
                    </el-col>
                </el-row>
                 <el-table
                    ref="multipleTable"
                    :data="getFormNameList"
                    tooltip-effect="dark"
                    @select-all="dialogCheck"
                    @select="dialogCheck"
                    style="width: 100%;margin-top: 10px;"
                    border
                    :span-method="objectSpanMethod"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="序号"
                    type="index"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="formName"
                    label="业务表单名"
                   >
                    </el-table-column>
                    <el-table-column
                    prop="formStatusName"
                    label="表单状态名"
                    show-overflow-tooltip>
                    </el-table-column>
                     <el-table-column
                    prop="createName"
                    label="创建人"
                    width="120">
                    </el-table-column>
                     <el-table-column
                    prop="createCode"
                    label="创建人账号"
                   >
                    </el-table-column>
                     <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="120">
                        <template slot-scope="scope">{{scope.row.createTime | setYear}}</template>
                    </el-table-column>
                     <el-table-column
                    prop="操作"
                    label="操作"
                    width="200">
                        <template slot-scope="scope">
                            <el-button @click="EditHandleClick(scope.row)" type="text" size="small">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    const Base64 = require('js-base64').Base64;
    import {getWorkflowFormStatusList} from 'api/processDefinition/processMenu.js'
    export default {
        name:'processMenu',
        data(){
            return {
                labelPosition:'right',
                companyDesignForm:{
                    formName:''
                },
                getFormNameList:[],
                selectioned:'',
                statusCode:'',
                type:'',
                selectionChangeList:[]
            }
        },
        created(){
            this.searchFormName()
        },
        methods:{
            //查询
            searchFormName(){
                getWorkflowFormStatusList(this.companyDesignForm.formName).then(res=>{
                    if(res.status===0){
                        this.getFormNameList = res.results
                        this.getSpanArr(this.getFormNameList)
                    }
                })
            },
            handleSelectionChange(){

            },
            //修改
            EditHandleClick(row){
                let statusCode = Base64.encode(row.statusCode);
                let type = Base64.encode('edit');
                this.$router.push(`processCompanyEdit/${statusCode}/${type}`)
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex < 3) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            // 获取多少换行
            getSpanArr(data) {
                this.spanArr = [];
                for (let i = 0; i < data.length; i++) {
                let item = data[i];
                item.index = i;
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].formCode === data[i - 1].formCode) {
                    this.spanArr[this.pos] += 1;
                    this.spanArr.push(0);
                    } else {
                    this.spanArr.push(1);
                    this.pos = i;
                    }
                }
                }
            },
            //添加
            addFormName(){
               if(this.selectionChangeList.length){
                    let statusCode = Base64.encode(this.selectionChangeList[0].formCode);
                    let type = Base64.encode('add');
                    this.$router.push(`processCompanyEdit/${statusCode}/${type}`)
               }else{
                    this.$message({
                    message: '请选择业务表单',
                    type: 'error'
                })
               }
               
            },
            dialogCheck: function(selection, row) {
                this.$refs.multipleTable.clearSelection()
                if (selection.length === 0) { // 判断selection是否有值存在
                    return
                }
                if (row) {
                    this.selectioned = row
                    this.$refs.multipleTable.toggleRowSelection(row, true)
                }
            },
            handleSelectionChange(val) {
                 if (val.length > 1) {
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.multipleTable.toggleRowSelection(val[val.length - 1]);
                    }
                if (val.length > 1) {
                    this.selectionChangeList = [val[val.length - 1]];
                    } else {
                    this.selectionChangeList = val;
                }
                // if (row.length === 0) {
                //     this.selectioned = row
                // }
            }
        }
    }
</script>
<style scoped lang="scss">
  .processMenu {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .processMenuSearch {
      width: 100%;
      height: 80px;
      padding: 0 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    .processMenuCon {
      flex: 1;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      padding: 15px;
      .processMenuTable {
        margin-top: 10px;
      }
    }
  }
</style>