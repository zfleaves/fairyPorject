<template>
    <div class="sporadicPurchaseSet">
        <div class="top">
            <div class="titles">
                <span class="title">零星采购</span>
                <el-button  size="small"
                        @click="submitoProjectFrom('projectForm')"
                        type="primary" icon="el-icon-circle-check">
                保存数据
                </el-button>
                <el-button size="small"
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
                            @change="getPmName"
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
                            <el-input clearable size="small" disabled
                                        placeholder="单据编号由系统自动生成">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin: 15px 0px 0 0;">
                    <el-col :span="8">
                        <el-form-item label="费用总金额(元)">
                            <el-input clearable size="small" disabled v-model="projectForm.sporadicAmount"
                                        placeholder="采购明细计算自动计算赋值">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购事由或原因">
                            <el-input
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
                        <el-button  type="text" size="small">上传</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin: 15px 0px 0 0;">
                    <el-col :span="8">
                        <el-form-item label="备注">
                        <el-input
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
                <el-button  size="small" style="margin-right:10px;"
                        type="danger" @click="handleBatchDeletion" icon="el-icon-circle-check" plain>批量删除
                </el-button>
                <el-button  size="small" @click="selectDetail"
                        type="primary" icon="el-icon-circle-check">添加明细
                </el-button>
            </div>
            <div class="table" style="margin-top: 10px;">
                <el-table
                ref="tableData"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{'background-color': '#fafafa'}"
                stripe border
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="55">
                </el-table-column>
                <el-table-column label="物资名称" prop="materialName" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <el-number
                        size="small" placeholder="请输入物资名称"
                        v-model="scope.row.materialName"
                       >
                    </el-number>
                    </template>
                </el-table-column>
                <el-table-column prop="stands" label="规格" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <el-number
                        size="small" placeholder="请输入规格"
                        v-model="scope.row.stands"
                       >
                    </el-number>
                    </template>
                </el-table-column>
                <el-table-column prop="mode" label="型号" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <el-number
                        size="small" placeholder="请输入型号"
                        v-model="scope.row.mode"
                       >
                    </el-number>
                    </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="80">
                    <template slot-scope="scope">
                    <el-number
                        size="small" placeholder="请输入单位"
                        v-model="scope.row.unit"
                       >
                    </el-number>
                    </template>
                </el-table-column>
                <el-table-column prop="sporadicNum"  :show-overflow-tooltip="!flowStatus" label="数量">
                    <template slot-scope="scope">
                    <el-number
                      
                        @change="changeTaxableAmount(scope.row)"
                        size="small" placeholder="请输入数量"
                        v-model="scope.row.sporadicNum"
                        controls-position="right" :min="0">
                    </el-number>
                    <!-- <span v-else>{{scope.row.quantityIn}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="sporadicPrice" label="单价(元)">
                    <template slot-scope="scope">
                    <el-number
        
                        @change="changeTaxableAmount(scope.row)"
                        :precision="2"
                        size="small" placeholder="请输入单价(元)"
                        v-model="scope.row.sporadicPrice"
                        controls-position="right" :min="0">
                    </el-number>
                    <!-- <span v-else>{{scope.row.averagePrice | setMoney}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column label="金额(元)" :show-overflow-tooltip="!flowStatus" >
                    <template slot-scope="scope">
                    <span>{{scope.row.sporadicAmount | setMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="brand" width="150" label="品牌" :show-overflow-tooltip="!flowStatus">
                    <template slot-scope="scope">
                    <el-input clearable size="small" v-model="scope.row.brand"
                                placeholder="请输入生产厂家或品牌">
                    </el-input>
                    <!-- <span v-else>{{scope.row.brand}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" width="150" label="备注" :show-overflow-tooltip="!flowStatus">
                    <template slot-scope="scope">
                    <el-input  autosize type="textarea" v-model="scope.row.remarks">
                    </el-input>
                    <!-- <span v-else>{{scope.row.remarks}}</span> -->
                    </template>
                </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import {getPursporadicProjectsList,savePursporadicList} from 'api/procurementPlan'
import {dataDictionary,closeRoute,freshRouter} from 'mixins'
import Auth from 'util/auth'
export default {
    name:'sporadicPurchaseSet',
    data(){
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
            },
            rules: {
                projectId: [
                    {required: true, message: '请选择项目名称', trigger: 'change'}
                ]
            },
            pursporadicProjectsList:[],
            tableData:[],
            flowStatus:false

        }
    },
    created(){
            
    },
    mounted(){
        this._getPursporadicProjectsList()
    },
    methods:{
        //切换项目
        getPmName(){
            let index = this.pursporadicProjectsList.findIndex(v=>v.id === this.projectForm.projectId)
            if(index>=0){
                let currentItem = this.pursporadicProjectsList[index]
                this.projectForm.projectManager = currentItem.pmName
            }
        },
        //获取零星采购添加项目名称
        _getPursporadicProjectsList(){
            getPursporadicProjectsList(this.menuId).then(res=>{
                if(res.status===0){
                    this.pursporadicProjectsList = res.results.proProjectDtos
                }
            })
        },
        //表格勾选
        handleSelectionChange(){

        },
        // 保存数据
        submitoProjectFrom(){
          let index = this.pursporadicProjectsList.findIndex(v=>v.id === this.projectForm.projectId)
          if(index>=0){
             let currentItem = this.pursporadicProjectsList[index]
             this.projectForm.orgId =  currentItem.orgId
             this.projectForm.projectManager = currentItem.pmName
             this.projectForm.projectName = currentItem.companyName
          }
          let purSporadicDetail = this.tableData
          let data = {
              ...this.projectForm,
              purSporadicDetail
          }
         savePursporadicList(data).then(res=>{
                if(res.status === 0){
                     this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                }else{
                     this.$message.error('添加失败');
                }
         })
         
        },
        //取消保存
        cancelProjectFrom(){

        },
        //批量删除
        handleBatchDeletion(){

        },
        // 添加明细
        selectDetail(){
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
            this.tableData.push(obj)
        },
        //改变含税金额
        changeTaxableAmount(item) {
            console.log(item);
            item.sporadicAmount = item.sporadicNum * item.sporadicPrice;
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