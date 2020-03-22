
<template>
    <div class="sporadicPurchase">
        <div class="searchCon">
            <el-form ref="searchForm" :model="searchForm" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="流程状态">
                            <el-select @change="_resetPursporadicList()" clearable v-model="searchForm.flowStatus" placeholder="请选择流程状态">
                                <el-option v-for="(item,index) in flowStatusList" :key="index" :label="item.dataName" :value="item.dataValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目名称">
                            <el-select @change="_resetPursporadicList()" filterable clearable v-model="searchForm.projectName" placeholder="请选择或输入项目名称">
                                <el-option v-for="item in projectsList" :key="item.id" :label="item.proName" :value="item.proName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="采购事由">
                            <el-input clearable v-model="searchForm.sporadicReason" placeholder="请填写采购事由或原因"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="2" :span="4">
                        <el-button type="warning" icon="el-icon-search" @click="_resetPursporadicList()">搜索</el-button>
                        <el-button icon="el-icon-search" @click="searchMore">{{searchMoreFlag?'普通搜索': '高级搜索'}}</el-button>
                    </el-col>
                </el-row>
                <el-row v-if="searchMoreFlag" :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="日期选择器">
                            <el-date-picker
                                @change="_resetPursporadicList()"
                                clearable
                                v-model="searchForm.createTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>   
                </el-row>    
            </el-form>      
        </div>
        <div class="sporadicPurchaseTable">
                <button-component2 @handleAddTo="handleAddTo"
                @handleProcessMonitoring="handleProcessMonitoring"
                @handleSubmissionProcess="handleSubmissionProcess"
                @handlePrint="handlePrint"
                @handleExport="handleExport"
                ></button-component2>
                <el-table
                    class="maintainConTable"
                    :data="tableData"
                    ref="maintainConTable"
                    @selection-change="handleSelectionChange"
                    border
                    style="width: 100%">
                    <el-table-column
                    type="selection"
                    width="60">
                    </el-table-column>
                    <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    width="60">
                    </el-table-column>
                    <el-table-column
                    
                    label="流程状态"
                    width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.flowStatus | setFlowStatus}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="docNo"
                    label="单据编号"
                    show-overflow-tooltip
                    width="140">
                    <template slot-scope="scope">
                        <span style="color:#3e75ff" @click="handleInfo(scope.row)">{{scope.row.docNo}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="projectName"
                    label="项目名称"
                    show-overflow-tooltip
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="projectManager"
                    label="项目经理"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="sporadicReason"
                    label="采购事由或原因"
                    width="160"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                    prop="sporadicAmount"
                    label="费用总金额(元)"
                    width="160"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="createName"
                    label="申请人"
                    >
                    </el-table-column>
                    <el-table-column
                   
                    label="申请日期"
                    show-overflow-tooltip
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | setYear}}</span>
                    </template>
                    
                    </el-table-column>
                    <el-table-column
                    fixed="right"
                    label="操作"
                    width="160">
                    <template slot-scope="scope">
                        <el-button @click="handleClickEdit(scope.row)" :disabled="scope.row.flowStatus!=='0'" type="text" size="small">修改</el-button>
                        <el-button @click="handleClickDelet(scope.row)" :disabled="scope.row.flowStatus!=='0'" type="text" size="small">删除</el-button>
                       
                    </template>
                    </el-table-column>
                </el-table>
                <pagination ref="page" :total="total" :pageSize="pageSize" @sentPages="sentPages"></pagination>
        </div>
        <el-dialog center title="零星采购审批流程提交" :visible.sync="dialogProcessWindowVisible">
            <process-window @isCancle="isCancle" @isSubmit="isSubmit"></process-window>
        </el-dialog>
        <el-dialog center title="零星采购审批流程提交" :visible.sync="dialogProcessWindowdetailVisible">
            <process-window-detail :sid="sid" :projectId="projectId" :processObj="submitinf" @isCancle="isCancle" @isSubmit="isSubmit"></process-window-detail>
        </el-dialog>
        
        
    </div>
</template>

<script>
    import {getMenuProjectsList,getPursporadicList,
    deletePursporadic,getPursporadicSubmitinf,submitPursporadic} from 'api/procurementPlan'
    import {dataDictionary,closeRoute,freshRouter} from 'mixins'
    import buttonComponent2 from 'components/buttonComponent/buttonComponent2'
    import Pagination from 'components/Pagination/Pagination'
    import ProcessWindow from 'components/processWindow/processWindow'
    import processWindowDetail from 'components/processWindow/processWindow_detail'
    export default {
        name:'sporadicPurchase',
        mixins:[dataDictionary,closeRoute,freshRouter],
        components:{
            buttonComponent2,Pagination,ProcessWindow,processWindowDetail
        },
        data(){
            return{
                projectsList:[],
                selectArr:['flowStatus'],
                tableData:[],
                total:0,
                searchForm:{
                    createTime:null,
                    createTimeFrom:'',
                    createTimeTo:'',
                    flowStatus:"",
                    projectName:'',
                    sporadicReason:'',
                    sporadicAmountFrom:0,
                    sporadicAmountTo:0,
                    
                },
                pageNo:1,
                pageSize:9,
                searchMoreFlag:false,
                dialogProcessWindowVisible:false,
                submitinf:{},
                dialogProcessWindowdetailVisible:false,
                sid:'',
                projectId:''
                
            }
        },
        created(){
            this._getDicdataList(this.selectArr)
            this._getPursporadicList()
            this._getMenuProjectsList()
        },
        methods:{
            //获取项目名称下拉框数组
            _getMenuProjectsList(){
                getMenuProjectsList(this.menuId).then(res=>{
                    if(res.status===0){
                        this.projectsList = res.results.proProjectDtos
                    }
                })
            },
            //获取零星采购表格列表
            _getPursporadicList(){
                let data = {
                    ...this.searchForm,
                    menuId:this.menuId,
                    createTimeFrom: this.searchForm.createTime ? this.searchForm.createTime[0] : '',
                    createTimeTo: this.searchForm.createTime ? this.searchForm.createTime[1] : '',
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                }
                getPursporadicList(data).then(res=>{
                    if(res.status===0){
                        if(res.results){
                             this.tableData = res.results.purSporadicDto || []
                             this.total = res.results.total
                        }else{
                            this.tableData = []
                        }
                       
                    }else{
                        // this.tableData = []
                    }
                    
                })
            },
            //重置页码
            _resetPursporadicList(){
                this.$refs.page.setCurrentPage()
            },
            //切换页码
            sentPages(val){
                this.pageNo = val
                this._getPursporadicList()
            },
            //高级搜索
            searchMore(){
                this.searchMoreFlag = !this.searchMoreFlag
            },
            //点击添加
            handleAddTo(){
                this.changeRouter(-1, 'add', 'sporadicPurchaseSet')
            },
            //修改
            handleClickEdit(row) {
                if (!this.judgeIsOneself(row)) {
                    this.editErrorTips('修改');
                    return
                }
                this.changeRouter(row.id, 'edit', 'sporadicPurchaseSet');
                
            },
            //删除
            handleClickDelet(row) {
                 this.deleteData2(row, deletePursporadic, this._getPursporadicList);  
            },
            //查看
            handleInfo(row) {
                this.changeRouter(row.id, 'info', 'sporadicPurchaseSet');
            },
            // 提交流程
            handleSubmissionProcess(){
                // console.log(row)
                if(!this.selectionList.length){
                    this.$message({
                        message: '请您先选中想要提交流程的一行数据',
                        type: 'warning'
                    });
                    return
                }
                if (!this.judgeIsOneself(this.selectionList[0])) {
                    this.editErrorTips('流程提交');
                    return
                }
                this.sid= this.selectionList[0].id
                this.projectId= this.selectionList[0].projectId
                
                getPursporadicSubmitinf(this.sid,this.projectId).then(res=>{
                    if(res.status === 0){
                        this.submitinf = res.results
                        if(!res.results.workflowNextNodes){
                            this.dialogProcessWindowVisible = true
                        }else{
                            this.dialogProcessWindowdetailVisible = true
                            
                        }
                    }
                })

            },
            //暂不提交
            isCancle(){
                if(this.dialogProcessWindowVisible){
                     this.dialogProcessWindowVisible = false
                }else{
                     this.dialogProcessWindowdetailVisible = false
                }
               
            },
            //确认提交
            isSubmit(val){
                let data = {}
                    if(this.dialogProcessWindowVisible){
                        data = {
                        ...this.submitinf  
                        }
                         this.dialogProcessWindowVisible = false
                    }else{
                        data = val
                        this.dialogProcessWindowdetailVisible = false
                    }

                submitPursporadic(data).then(res=>{
                        if(res.status === 0){
                            this._getPursporadicList()
                        }
                    })  
            },
            //流程监控
            handleProcessMonitoring() {
                if(!this.selectionList.length){
                    this.$message({
                        message: '请您先选中想要提交流程的一行数据',
                        type: 'warning'
                    });
                    return
                }
               if(!this.selectionList[0].taskId){
                   this.$message({
                        message: '本数据提交时未启用流程审批，无审批记录.',
                        type: 'warning'
                    });
                    return
                   
               }
            },
            //打印
            handlePrint(){

            },
            //导出
            handleExport(){

            }
        }
    }
</script>
<style scoped lang="scss">
    .sporadicPurchase{
        padding: 10px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .searchCon{
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            padding: 20px 0 20px 20px;
            background: #fff;
        }
        .sporadicPurchaseTable{
            margin-top: 10px;
            padding: 10px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            flex: 1;
            background: #fff;
            .el-table{
                min-height: 400px;
                margin-top: 20px;
            }
        }
    }
</style>