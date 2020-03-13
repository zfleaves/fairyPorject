<template>
    <div class="processCompanyEdit">
        <el-form :label-position="labelPosition"  ref="processCompanyEditForm" :model="processCompanyEditForm" label-width="100px">
             <el-row style="padding-top: 20px;">
                <el-col :span="8" style="padding-left:20px">
                    <el-form-item label="表单状态名">
                        <el-input clearable size="small" v-model="formStatusName" placeholder="请输入表单状态名"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row style="padding-top: 20px;">
                <el-col v-for="(item,i) in singletonColumnsList" :key="i" :span="6" style="padding-left:20px">
                    <el-form-item :label="item.columnName">
                        <el-select v-model="item.columnStatusCollectCode">
                            <el-option v-for="(child,j) in collectArr" :key="j"  :label="child.statusName" :value="child.columnStatusCollectCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="processCompanyEdit_con">
            <div class="Edit_conHeader">{{title}}</div>
            <ul>
                <li v-for="(child,index) in multitonColumnsList" :key="index">
                    <p>{{child.columnName}}</p>
                    <el-select v-model="child.columnStatusCollectCode">
                        <el-option v-for="(coll,a) in collectArr" :key="a"  :label="coll.statusName" :value="coll.columnStatusCollectCode"></el-option>
                    </el-select>
                </li>

            </ul>
        </div>
        <div class="btns">
            <el-button size="small"
                    style="margin-right:20px;" @click="cancel" type="danger"
                    icon="el-icon-circle-check" plain>取消保存
            </el-button>
             <el-button  size="small"
                   @click="submit"
                   type="primary" icon="el-icon-circle-check">
            保存数据
            </el-button>
            
        </div>
        
    </div>
</template>

<script>
    const Base64 = require('js-base64').Base64;
    import {getWorkflowFormStatusList,getWorkflowColumnStatusCollect,getWorkflowFormColumnsList,getWorkflowFormStatusBuild,getWorkflowFormColumnStatus} from 'api/processDefinition/processMenu.js'
    import {closeRoute} from 'mixins/index'
    
    export default {
        name:'processCompanyEdit',
        mixins: [closeRoute],
        data(){
            return{
                labelPosition:'right',
                collectArr:[],
                singletonColumnsList:[],
                multitonColumnsList:[],
                processCompanyEditForm:{

                },
                statusCode:'',
                type:'',
                formStatusName:'',
                workflowFormDpmColumnStatusCreateDtosArr:[],
                formCode:'',
                companyId:"",
                title:''
            }
        },
        created(){
            let params = this.$route.params;
            this.statusCode = Base64.decode(params.statusCode);
            this.type = Base64.decode(params.type);
            if (this.statusCode) {
            //    this._getWorkflowFormColumnsList()
               this._getWorkflowColumnStatusCollect();
            }
             if (this.type === 'edit') {
                   this._getWorkflowFormColumnStatus()
             }else{
                 this._getWorkflowFormColumnsList()
             }
          
        },
        methods:{
            _getWorkflowColumnStatusCollect(){
                getWorkflowColumnStatusCollect().then(res=>{
                    this.collectArr = res.results
                })
            },
            _getWorkflowFormColumnsList(){
                getWorkflowFormColumnsList(this.statusCode).then(res=>{
                   this.formCode = res.results.formCode;
                   this.singletonColumnsList =  this.setCheckList(res.results.singletonColumns);
                    if (res.results.multitonColumns.length) {
                        this.title = res.results.multitonColumns[0].multitonName;
                        this.multitonColumnsList = this.setCheckList(res.results.multitonColumns[0].multitonColumns);
                    }
                  
                   
                })
            },
            _getWorkflowFormColumnStatus(){
                getWorkflowFormColumnStatus(this.statusCode,0).then(res=>{
                    this.formStatusName = res.results.formStatusName;
                    this.formCode = res.results.formCode;
                    this.companyId = res.results.companyId;
                    this.formStatusCode = res.results.formStatusCode;
                    this.singletonColumnsList = this.setCheckList(res.results.singletonColumns);
                    if (res.results.multitonColumns.length) {
                        this.title = res.results.multitonColumns[0].multitonName;
                        this.multitonColumnsList = this.setCheckList(res.results.multitonColumns[0].multitonColumns);
                    }
                })
            },
            // 设置勾选字段
            setCheckList(arr) {
                for (let i in arr) {
                let item = arr[i];
                if (!item.columnStatusCollectCode) {
                    item.columnStatusCollectCode = 'HIDE';
                }
                }
                return arr;
            },
            //保存数据
            submit(){
                if(!this.formStatusName){
                     this.$message({
                        message: '表单状态名必填',
                        type: 'error'
                        });
                    return;
                }
                    for(let i in this.singletonColumnsList){
                        let item = this.singletonColumnsList[i];
                        this.workflowFormDpmColumnStatusCreateDtosArr.push({
                            columnCode:item.columnCode,
                            columnStatusCollectCode:item.columnStatusCollectCode
                        })
                    }
                    for(let i in this.multitonColumnsList){
                        let item = this.multitonColumnsList[i];
                        this.workflowFormDpmColumnStatusCreateDtosArr.push({
                            columnCode:item.columnCode,
                            columnStatusCollectCode:item.columnStatusCollectCode
                        })
                    }
                let data = {
                    formCode:this.formCode,
                    formStatusName:this.formStatusName,
                    workflowFormDpmColumnStatusCreateDtos:this.workflowFormDpmColumnStatusCreateDtosArr
                }
                getWorkflowFormStatusBuild(data).then(res=>{
                    this.$message({
                        message: '操作企业表单字段成功',
                        type: 'success'
                    })
                    this.setRoute();
                })
            },
            //取消保存
            cancel(){
                 this.setRoute();
            }
        }
    }
</script>
<style scoped lang="scss">
    .processCompanyEdit{
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding:  0 20px;
        .processCompanyEdit_con{
            padding-left: 30px;
            text-align: center;
            font-size: 14px;
            .Edit_conHeader{
                background-color: #ebeff3;
                line-height: 36px;
                font-size: 18px;
                font-weight: 400;
               
            }
             ul{
                    overflow: hidden;
                    border: 1px #ddd solid;
                    padding: 20px;
                    li{
                        display: inline-block;
                        float: left;
                        width: 125px;
                        margin-right: 20px;
                        line-height: 40px;
                        margin-bottom: 15px;
                    }
                }
        }
        .btns{
                text-align: center;
                margin-top: 50px;
        }
    }
</style>