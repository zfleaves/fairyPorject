
<template>
    <div class="budgetDetailed">
        <div class="searchCon">
            <el-form ref="searchForm" :model="searchForm" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="公司名称">
                            <el-select clearable @change="selectPermissionOrgs" v-model="searchForm.orgName" placeholder="请选择公司名称">
                            <el-option v-for="item in permissionOrgs" :key="item.id" :label="item.orgName" :value="item.orgName"></el-option>
                          
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目名称">
                            <el-select clearable @change="selectPermissionOrgs" v-model="searchForm.projectName" placeholder="请选择公司名称">
                                <el-option v-for="item in companyProject" :key="item.id" :label="item.proName" :value="item.proName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目经理">
                            <el-input clearable v-model="searchForm.projectManager"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align:right;" :span="6">
                        <el-button @click="generateReports" type="warning">生成报表</el-button><el-button @click="handleMoreSearch" type="primary" plain>{{moreSearch? '收起条件':'更多条件'}}</el-button>
                    </el-col>
                </el-row>
                <el-row v-if="moreSearch" :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="物资分类">
                            <el-input clearable v-model="searchForm.topClassifyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物资名称">
                            <el-input clearable v-model="searchForm.materialName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    
                    </el-col>
                    <el-col :span="6">
                        
                    </el-col>
                </el-row>
                <el-row v-if="moreSearch" :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="单位">
                            <el-input clearable v-model="searchForm.unit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开工日期">
                            <el-date-picker
                            clearable
                            v-model="searchForm.startDate"
                            type="daterange"
                            value-format="yyyy-MM-dd 00:00:00"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="budgetDetailedCon">
            <div class="selectCheckBox">
                <el-checkbox-group @change="changeCheckBoxList" v-model="checkList">
                    <el-checkbox  v-for="item in checkBoxList" :key="item.id" :label="item.name"></el-checkbox>
                </el-checkbox-group>
                <el-button style="float:right;" @click="exportTable" type="primary" plain>导出</el-button>
            </div>
            <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                :summary-method="getSummaries"
                show-summary
                id="tableId"
                style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                 fixed
                width="60">
                </el-table-column>
                <el-table-column
                prop="orgName"
                label="公司名称"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="projectName"
                label="项目名称"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="projectManager"
                label="项目经理"
                v-if="checkFlag1"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="startDate"
                label="开工日期"
                v-if="checkFlag2"
                show-overflow-tooltip
               >
                <template slot-scope="scope">
                    <span>{{scope.row.startDate | setYear }}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="topClassifyName"
                label="物资分类"
                v-if="checkFlag3"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="materialName"
                label="物资名称"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="materialCode"
                label="物资编码"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="standard"
                label="规格"
                v-if="checkFlag4"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column
                prop="unit"
                label="单位"
                v-if="checkFlag5"
                show-overflow-tooltip
               >
                </el-table-column>
                <el-table-column label="投标预算">
                    <el-table-column
                        prop="budTotalNum"
                        label="数量"
                        
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="budAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="施工预算">
                    <el-table-column
                        prop="demTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="demAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="需求计划">
                    <el-table-column
                        prop="applyTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="applyAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="合同">
                    <el-table-column
                        prop="signTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="signAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="订单">
                    <el-table-column
                        prop="orderTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="orderAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="结算">
                    <el-table-column
                        prop="settleTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="settleAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="库存">
                    <el-table-column
                        prop="stockTotalNum"
                        label="数量"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        prop="stockAmount"
                        label="金额"
                        width="60">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {getCompanyProject,getPermissionOrgs,getDetailAnalysis} from 'api/statisticalManagement'
    import {exportExcelMethod} from '@/exportExcel.js'
    export default {
        name:'budgetDetailed',
        data(){
            return{
                searchForm:{
                    materialName: "",
                    orgName: "",
                    projectManager: "",
                    projectName: "",
                    startDate: [],
                    pageNo: 0,
                    pageSize: 0,
                    // startDateFrom: this.searchForm.startDate[0],
                    // startDateTo: this.searchForm.startDate[1],
                    topClassifyName: "",
                    unit: ""
                },
                companyProject:[],
                permissionOrgs:[],
                moreSearch:false,
                checkBoxList:[
                    {id:1,name:'项目经理'},
                    {id:2,name:'开工日期'},
                    {id:3,name:'物资分类'},
                    {id:4,name:'规格'},
                    {id:5,name:'单位'}
                ],
                checkList:['物资分类'],
                tableData:[],
                checkFlag1:false,
                checkFlag2:false,
                checkFlag3:true,
                checkFlag4:false,
                checkFlag5:false,
                spanArr:[],
                pos:0
            }
        },
        created(){
            this._getCompanyProject()
            this._getPermissionOrgs()
        },
        methods:{
            //获取项目名称
            _getCompanyProject(){
                getCompanyProject().then(res=>{
                    this.companyProject = res.results
                })
            },
            //公司名称
            _getPermissionOrgs(){
                getPermissionOrgs().then(res=>{
                    this.permissionOrgs = res.results
                })
            },
            //搜索更多
            handleMoreSearch(){
                this.moreSearch = !this.moreSearch
            },
            //获得表格数据
            _getDetailAnalysis(){
                let data = {
                    ...this.searchForm
                }
                if(this.searchForm.startDate && this.searchForm.startDate.length){
                    data.startDateFrom = this.searchForm.startDate[0]
                    data.startDateTo = this.searchForm.startDate[1]
                }
                getDetailAnalysis(data).then(res=>{
                    if(res.status === 0){
                        this.tableData = res.results.costAnalysisDto

                        this.getSpanArr(this.tableData,"orgName")
                        this.getSpanArr(this.tableData,"projectName")
                    }
                   
                })
            },
            //表尾合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = data.length++;
                    return;
                }
                if (index === 1) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                console.log(column.property)
                if (column.property === 'budAmount' || column.property === 'stockAmount' || column.property === 'settleAmount' 
                ||column.property === 'orderAmount' || column.property === 'signAmount' || column.property === 'applyAmount'
                || column.property === 'demAmount'
                ) {
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] += sums[index].toFixed(2);
                } else {
                    sums[index] = '';
                }
                });

                return sums;
            },
            //切换多选框
            changeCheckBoxList(e){
                console.log(e)
                console.log(this.checkList)
                this.checkFlag1 = false
                this.checkFlag2 = false
                this.checkFlag3 = false
                this.checkFlag4 = false
                this.checkFlag5 = false
                for(let i in this.checkList){
                    let item = this.checkList[i]
                    for(let j in this.checkBoxList){
                        let item_j = this.checkBoxList[j]
                        if(item === item_j.name){
                            this['checkFlag'+item_j.id] = true
                            
                        }
                    }
                }
            },
            //选择公司
            selectPermissionOrgs(){
                if(!this.searchForm.projectName){
                    this.$message({
                    message: '请选择项目名称',
                    type: 'warning'
                    });
                    return
                }
                this._getDetailAnalysis()
            },
            //生成报表
            generateReports(){
                if(!this.searchForm.projectName){
                    this.$message({
                    message: '请选择项目名称',
                    type: 'warning'
                    });
                    return
                }
                this._getDetailAnalysis()
            },
            //导出表格
            exportTable(){
                exportExcelMethod("tableId", "物资成本核算明细", "sheet")
            },
            // 获取多少换行
        getSpanArr(data, key, target) {
            this.pos = 0;
            this.spanArr = [];
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i][key] === data[i - 1][key]) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            }
        },
         

             objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                 if(columnIndex === 1){
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                 }
                 else if(columnIndex === 2){
                  
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                 }
            }
        }
    }
</script>
<style scoped lang="scss">
.budgetDetailed{
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .searchCon{
        width: 100%;
    //   height: 80px;
      padding: 20px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    .budgetDetailedCon{
        padding: 20px;
        .selectCheckBox{
            position: relative;
            height: 50px;
        }
        button{
            float: right;
            position: absolute;
            right: 0;
            top: 0;
            height: 35px;
            line-height: 10px;
        }
    }
}

</style>