<template>
    <div class="sporadicPurchaseSet">
        <div class="top">
            <div class="titles">
                <span class="title">零星采购</span>
                <el-button  size="small"
                        :disabled="flowStatus"
                        @click="submitoProjectFrom('projectForm')"
                        type="primary" icon="el-icon-circle-check">
                保存数据
                </el-button>
                <el-button size="small"
                        :disabled="flowStatus"
                        style="margin-right:20px;" @click="cancelProjectFrom" type="danger"
                        icon="el-icon-circle-check" plain>取消保存
                </el-button>
            </div>
        </div>
        <div class="search">
            <el-form :rules="rules" :label-position="labelPosition" ref="projectForm" :model="projectForm"
                    label-width="140px">
                <el-row style="margin: 15px 0px 0 0;">
                    <el-col :span="8">
                        <el-form-item label="项目名称" prop="projectId">
                        <el-select
                            :disabled="flowStatus"
                            @change="changeSelectProject"
                            clearable  size="small" v-model="projectForm.projectId"
                            placeholder="请选择项目名称">
                            <el-option v-for="(item,index) in pursporadicProjectsList" :key="index" :label="item.proName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目经理">
                        <el-input clearable size="small" disabled v-model="projectForm.projectManager"
                                    placeholder="请输入项目经理">
                        </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单据编号">
                            <el-input v-model="projectForm.docNo" clearable size="small" disabled
                                        placeholder="单据编号由系统自动生成">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin: 15px 0px 0 0;">
                    <el-col :span="8">
                        <el-form-item prop="sporadicAmount" label="费用总金额(元)">
                            <el-input :disabled="flowStatus"  clearable size="small" v-model="projectForm.sporadicAmount"
                                        placeholder="采购明细计算自动计算赋值">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="sporadicReason" label="采购事由或原因">
                            <el-input
                            :disabled="flowStatus"
                            type="textarea"
                            autosize
                            placeholder="请输入采购事由或原因"
                            v-model="projectForm.sporadicReason">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编制依据">
                        <!-- <uploadFile
                            @attachment="getAttachment"
                            :flowStatus="flowStatus"
                            :attachment="projectForm.attachmentId">
                        </uploadFile> -->
                        <span :disabled="flowStatus" v-if="filepathList.length">{{filepathList[0].fileName.split('_')[0]}}</span>
                        <el-button :disabled="flowStatus" @click="elUpload" type="text" size="small">上传</el-button>
                        <el-button :disabled="flowStatus" v-if="filepathList.length" type="text" size="small">查看<span>({{filepathList.length}})</span></el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin: 15px 0px 0 0;">
                    <el-col :span="8">
                        <el-form-item label="备注">
                        <el-input
                            :disabled="flowStatus"
                            type="textarea"
                            autosize
                            placeholder="请输入备注"
                            v-model="projectForm.remarks">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期">
                        <el-date-picker
                            :disabled="flowStatus"
                            size="small"
                            v-model="projectForm.inandoutTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            placeholder="选择申请日期">
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="sporadicPurchaseSetCon">
            <div class="btn">
                <el-button  size="small" :disabled="flowStatus" style="margin-right:10px;"
                        type="danger" @click="handleBatchDeletion1" icon="el-icon-circle-check" plain>批量删除
                </el-button>
                <el-button :disabled="flowStatus" size="small" @click="selectDetail"
                        type="primary" icon="el-icon-circle-check">添加明细
                </el-button>
            </div>
            <div class="table" style="margin-top: 10px;">
                <el-form :rules="model.rules" :model="model"  ref="tableDataFrom">
                <el-table
                    ref="tableData"
                    :data="model.tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="{'background-color': '#fafafa'}"
                    stripe border
                    @selection-change="handleSelectionChange1">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="55">
                    </el-table-column>
                    <el-table-column label="物资名称" prop="materialName" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-form-item  :prop="'tableData[' + scope.$index + '].materialName'" :rules='model.rules.materialName'>
                                <el-input v-if="!flowStatus" clearable size="small"  v-model="scope.row.materialName"
                                            placeholder="请输入物资名称">
                                </el-input>
                                 <span v-else>{{scope.row.materialName}}</span>
                            </el-form-item>

                        </template>
                    </el-table-column>
                    <el-table-column prop="stands" label="规格" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-form-item  :prop="'tableData[' + scope.$index + '].stands'" :rules='model.rules.stands'>
                                <el-input v-if="!flowStatus" clearable size="small"  v-model="scope.row.stands"
                                            placeholder="请输入规格">
                                </el-input>
                                <span v-else>{{scope.row.stands}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mode" label="型号" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <el-input v-if="!flowStatus" clearable size="small"  v-model="scope.row.mode"
                                                placeholder="请输入型号">
                                </el-input>
                                 <span v-else>{{scope.row.mode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" width="80">
                        <template slot-scope="scope">
                            <el-form-item :prop="'tableData[' + scope.$index + '].unit'" :rules='model.rules.unit'>
                                <el-input v-if="!flowStatus" clearable size="small"  v-model="scope.row.unit"
                                                placeholder="请输入单位">
                                </el-input>
                                <span v-else>{{scope.row.unit}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sporadicNum"  :show-overflow-tooltip="!flowStatus" label="数量">
                        <template slot-scope="scope">
                            <el-form-item v-if="!flowStatus" :prop="'tableData[' + scope.$index + '].sporadicNum'" :rules='model.rules.sporadicNum'>
                                <el-number
                                    v-if="!flowStatus"
                                    @change="changeTaxableAmount(scope.row)"
                                    size="small" placeholder="请输入数量"
                                    v-model="scope.row.sporadicNum"
                                    controls-position="right" :min="0">
                                </el-number>
                                 <span v-else>{{scope.row.sporadicNum}}</span>
                            </el-form-item>

                        </template>
                    </el-table-column>
                    <el-table-column prop="sporadicPrice" label="单价(元)">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'tableData[' + scope.$index + '].sporadicPrice'" :rules='model.rules.sporadicPrice'>
                                <el-number
                                    v-if="!flowStatus"
                                    @change="changeTaxableAmount(scope.row)"
                                    :precision="2"
                                    size="small" placeholder="请输入单价(元)"
                                    v-model="scope.row.sporadicPrice"
                                    controls-position="right" :min="0">
                                </el-number>
                                 <span v-else>{{scope.row.remarks}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额(元)" :show-overflow-tooltip="!flowStatus" >
                        <template slot-scope="scope">
                            <el-form-item  :prop="'tableData[' + scope.$index + '].sporadicAmount'" :rules='model.rules.sporadicAmount'>
                                <el-number
                                    :precision="2"
                                    v-if="!flowStatus"
                                    size="small" placeholder="请填写"
                                    v-model="scope.row.sporadicAmount"
                                    controls-position="right" :min="0">
                                </el-number>
                                <span v-else>{{scope.row.sporadicAmount | setMoney}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand" width="150" label="品牌" :show-overflow-tooltip="!flowStatus">
                        <template slot-scope="scope">
                        <el-input v-if="!flowStatus" clearable size="small" v-model="scope.row.brand"
                                    placeholder="请输入生产厂家或品牌">
                        </el-input>
                        <span v-else>{{scope.row.brand}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" width="150" label="备注" :show-overflow-tooltip="!flowStatus">
                        <template slot-scope="scope">
                        <el-input v-if="!flowStatus" autosize type="textarea" v-model="scope.row.remarks">
                        </el-input>
                        <span v-else>{{scope.row.remarks}}</span>
                        </template>
                    </el-table-column>
                    </el-table>
                </el-form>
            </div>
        </div>
        <el-dialog width="80%" center title="上传" :visible.sync="elUploadDialog">
            <upload @attachment="getAttachment"></upload>
        </el-dialog>
    </div>
</template>
<script>
import {getPursporadicProjectsList,savePursporadicList,getPursporadicInf,getPursporadicDetailList,getFilepathList} from 'api/procurementPlan'
import {dataDictionary,closeRoute,freshRouter} from 'mixins'
import Auth from 'util/auth'
import {formatYear} from 'util';
import Upload from 'components/upload/upload'
export default {
    name:'sporadicPurchaseSet',
    mixins:[dataDictionary,closeRoute,freshRouter],
    components:{
        Upload
    },
    data(){
            var changeSporadicAmount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请填写费用总金额'));
                }else{
                    if (isNaN(value)) {
                        this.projectForm.sporadicAmount = 0
                    } else {

                    callback();
                    }
                }

            };
        return{
            labelPosition:'right',
            projectForm:{
                attachmentId: "",
                createBy: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '',
                createTime: new Date().getTime(),
                id: 0,
                orgId: "",
                projectId: "",
                projectManager: "",
                projectName: "",
                remarks: "",
                sporadicAmount: '',
                sporadicReason: "",
                updateBy: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '',
                docNo:''
            },
            rules: {
                    projectId: [
                        {required: true, message: '请选择项目名称', trigger: 'change'}
                    ],
                    sporadicReason:[
                        {required: true, message: '请填写采购事由或原因', trigger: 'blur'}
                    ],
                    sporadicAmount:[
                        {required: true, message: '请填写费用总金额', validator: changeSporadicAmount, trigger: 'blur'}
                    ]
                },
            model:{
                rules: {
                    materialName: [
                        {required: true,message: ' ', trigger: 'blur'}
                    ],
                    stands:[
                        {required: true,message: ' ',trigger: 'blur'}
                    ],
                    unit:[
                        {required: true,message: ' ', trigger: 'blur'}
                    ],
                    sporadicNum:[
                        {required: true,message: ' ', trigger: 'blur'}
                    ],
                    sporadicPrice:[
                        {required: true,message: ' ', trigger: 'blur'}
                    ],
                    sporadicAmount:[
                        {required: true,message: ' ', trigger: 'blur'}
                    ]
                },
                tableData:[]
            },
            pursporadicProjectsList:[],
            flowStatus:false,
            selectTableList:[],
            id:'',
            type:'',
            filepathList:[],
            cloneProjectId:'',
            elUploadDialog:false
        }
    },
    created(){
        let params =   this.$route.params
        this.id=Base64.decode(params.id);
        this.type=Base64.decode(params.type);
    },
    mounted(){
        this._getPursporadicProjectsList()
        if(this.type === 'edit'){
            this._getPursporadicInf()
            this._getPursporadicDetailList()
        }else if(this.type === 'info'){
            this.flowStatus = true
            this._getPursporadicInf()
            this._getPursporadicDetailList()
        }
    },
    methods:{
        //上传
        elUpload(){
            this.elUploadDialog = true
        },
        //活动上传文件id字符串
        getAttachment(val){
            this.projectForm.attachmentId = val
        },
        //切换项目
        changeSelectProject(q){
            if( this.cloneProjectId  && this.model.tableData.length){
                this.$confirm(`您将更改项目名称，是否继续`, '确定', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.cloneProjectId = q
                    this.getPmName()
                }).catch((e) => {
                    this.projectForm.projectId = this.cloneProjectId
                    return
                });
            }else{
                this.cloneProjectId = this.projectForm.projectId
            }
             
        },
        //获得对应pmname
        getPmName(){
            let index = this.pursporadicProjectsList.findIndex(v=>v.id === this.projectForm.projectId)
            if(index>=0){
                let currentItem = this.pursporadicProjectsList[index]
                this.projectForm.projectManager = currentItem.pmName
            }
        },
        //获取零星采购添加项目名称
        _getPursporadicProjectsList(){
            console.log(this.menuId)
            getPursporadicProjectsList(this.menuId).then(res=>{
                if(res.status===0){
                    this.pursporadicProjectsList = res.results.proProjectDtos
                }
            })
        },
        ////修改零星采购 项目名称赋值
        _getPursporadicInf(){
            getPursporadicInf(this.id).then(res=>{
                if(res.status === 0){
                    this.dicInf = res.results
                    this.projectForm.projectId =  res.results.projectId
                    this.projectForm.projectManager =  res.results.projectManager
                    this.projectForm.docNo =  res.results.docNo
                    this.projectForm.sporadicAmount =  res.results.sporadicAmount
                    this.projectForm.sporadicReason =  res.results.sporadicReason
                    this.projectForm.attachmentId =  res.results.attachmentId
                    this.projectForm.remarks =  res.results.remarks
                    this.projectForm.inandoutTime =  formatYear(res.results.createTime)
                    this.cloneProjectId = res.results.projectId
                    // console.log(this.projectForm.createTime)
                    // formatYear(res.results.createTime)
                    this._getFilepathList()
                }
            })
        },
        ////修改零星采购 详情表格赋值
        _getPursporadicDetailList(){
            getPursporadicDetailList(this.id).then(res=>{
                if(res.status === 0){
                    let resultTableData = res.results
                    this.model.tableData = JSON.parse(JSON.stringify(resultTableData))
                }
            })
        },
        //获取上传文件
        _getFilepathList(){
            let fileIds = []
            fileIds.push(this.projectForm.attachmentId)
            let data = {
                fileIds:fileIds
            }
            getFilepathList(data).then(res=>{
                this.filepathList = res.results
            })
        },
        // 保存数据
        submitoProjectFrom(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!this.model.tableData.length){
                        this.$message.error('请选择添加明细');
                        return
                    }
                     this.$refs["tableDataFrom"].validate((valid,model)=>{
                        if(valid){
                            console.log(this.model.tableData)
                            // return
                            let index = this.pursporadicProjectsList.findIndex(v=>v.id === this.projectForm.projectId)
                            if(index>=0){
                                let currentItem = this.pursporadicProjectsList[index]
                                this.projectForm.orgId =  currentItem.orgId
                                this.projectForm.projectManager = currentItem.pmName
                                this.projectForm.projectName = currentItem.companyName
                            }
                            let purSporadicDetail = this.model.tableData
                            let data = {
                                ...this.projectForm,
                                purSporadicDetail
                            }
                            if(this.type === 'edit'){
                                data.flowStatus = this.dicInf.flowStatus
                                data.createName = this.dicInf.createName
                                data.projectCode = this.pursporadicProjectsList[index].proCode
                                data.taskId = this.dicInf.taskId
                                data.updateBy = this.dicInf.updateBy
                                data.updateTime = new Date().getTime()
                                data.id = this.dicInf.id
                            }
                            savePursporadicList(data).then(res=>{
                                let msg = '添加'
                                    if(this.type === 'edit'){
                                        msg = '编辑'
                                    }
                                    if(res.status === 0){
                                        this.$message({
                                            message: `${msg}成功`,
                                            type: 'success'
                                        });
                                        this.setRoute()
                                    }else{
                                        this.$message.error('添加失败');
                                    }
                            })
                        }else{
                            return
                        }
                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });



        },
        //取消保存
        cancelProjectFrom(){
            this.$confirm(`当前数据未保存，确定取消保存吗`, '确定', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.setRoute()
        }).catch((e) => {
           return
        });

        },
        //选择明细表格数据
        handleSelectionChange1(val) {
            this.selectTableList = val;
        },
        // 明细批量删除
        handleBatchDeletion1() {
            if (this.selectTableList.length === 0) {
                this.$message({
                message: '请选择所要删除数据',
                type: 'error'
                });
                return
            }
            this.$confirm(`该删除操作无法恢复数据, 是否删除?`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.selectTableList.forEach(item => {
                    console.log(item)
                this.model.tableData.splice(this.model.tableData.indexOf(item), 1)
                });
                this.$message({
                type: 'success',
                message: '删除成功'
                })
                this.$refs.tableDataFrom.clearSelection();
            }).catch((e) => {
                // console.log(e);
                // this.$message({
                // type: 'info',
                // message: '已取消删除'
                // });
            });
        },
        // 添加明细
        selectDetail(){
            if(!this.projectForm.projectId){
                 this.$message.error('请选择项目名称');
                 return
            }
            let obj = {
                brand: "",
                classifyCode: "",
                classifyName: "",
                docCodeFrom: "",
                docNameFrom: "",
                eId: 0,
                id: 0,
                materialCode: "",
                materialName: "",
                mode: "",
                purId: 0,
                remarks: "",
                sporadicAmount: "",
                sporadicNum: "",
                sporadicPrice: "",
                stands: "",
                unit: ""
            }
            this.model.tableData.push(obj)
        },
        //改变含税金额
        changeTaxableAmount(item) {
            console.log(item);
            item.sporadicAmount = item.sporadicNum * item.sporadicPrice;
            let sum = 0
            for(let i in this.model.tableData){
                let item = this.model.tableData[i]
                sum += item.sporadicAmount
            }
            this.projectForm.sporadicAmount = sum
        },
    }
}
</script>
<style lang="scss" scoped>
.sporadicPurchaseSet{
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    .top {
      height: 43px;
      padding: 0 10px;
      line-height: 43px;
      .titles {
        border-bottom: 1px #eee solid;
        overflow: hidden;
        padding-left: 20px;
        &::before {
          content: '';
          width: 3px;
          height: 25px;
          background: #3e75ff;
          position: absolute;
          top: 21px;
          left: 30px;
          bottom: 0px;
        }
        .title {
          margin-left: 5px;
        }
        button {
          float: right;
          margin-top: 5px;
        }
      }
    }
    .sporadicPurchaseSetCon {
      margin-top: 20px;
      .btn {
        text-align: right;
      }
    }
}
</style>
