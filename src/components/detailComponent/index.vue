<template>
    <div class="detailComponent">
        <div class="top">
            <div class="titles">
                <span class="title">直进直出单</span>
                <el-button :disabled="!flowStatus" size="small"
                        @click="submitoProjectFrom('projectForm')"
                        type="primary" icon="el-icon-circle-check">
                保存数据
                </el-button>
                <el-button :disabled="!flowStatus" size="small"
                        style="margin-right:20px;" @click="cancelProjectFrom" type="danger"
                        icon="el-icon-circle-check" plain>取消保存
                </el-button>
            </div>
        </div>
        
    </div>
</template>
<script>
  
  
export default {
    
    props:{
        flowStatus:{
            type:Boolean,
            default:false
        },
        // projectForm:{
        //     type:Object,
        //     default:()=>{}
        // },
    },
    data(){
        return{
            // ProjectsList:[],
            // UnitList:[],
            // ChildrenAllList:[],
            // warehouseList:[],
            // dataDictionaryArr: ['taxRate'],
            // changeProjectName:[],
            // tableData:[]
        }
    },
    // watch: {
    //   'projectForm.projectId': {
    //     handler() {
    //         if(this.projectForm.projectId){
    //             this.projectForm.inandoutTime = formatTime(this.projectForm.inandoutTime)
    //             this.tableData = this.projectForm.details
    //             this.getSelectList(this.projectForm.projectId)
    //         }
    //     },
    //     immediate:true
           
    //   }
    // },
    created(){
        // this._getDicdataList(this.dataDictionaryArr);
        // this._getProjectsList();
       
    },
    methods:{
        // 保存数据
        submitoProjectFrom(submitFrom){
           this.$emit('toHandleSubmitoProjectFrom')
        },
        //取消保存
        cancelProjectFrom(){
           this.$emit('toHandleCancelProjectFrom')
        },
       
       // 切换领用单位
        changeUnit(){

        },
        //切换使用部门
        changeProjectChildId(){

        },
        // 切换仓库
        changeWarehouse(){
            
        },
        //上传附件
        getAttachment(){

        },
        //批量删除
        handleBatchDeletion(){

        },
        //选择明细
        selectDetail(){

        },
        handleSelectionChange(){

        },
        changeTaxableAmount(){

        },
        getTableData(){

        },
        getCancelModal(){

        },
        getHandleSubmission(){

        },
        getHandleStepBack(){

        },
        getHandleReturningOriginator(){

        },
        getHandleProcessMonitoring(){

        },
        getHandleDeleteProcess(){

        }
        
    }
}
</script>
<style scoped lang='scss'>
 .detailComponent {
    // width: 100%;
    // height: 100%;
    // padding: 10px;
    // background: #fff;
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
          top: 50px;
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
    .straightForwardSetCon {
      margin-top: 20px;
      .btn {
        text-align: right;
      }
    }
    .selectListInner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .selectListTable {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .ListTable {
          flex: 1;
          overflow-y: auto;
        }
        .Tablebtn {
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
    .detailListInner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .detailListTable {
        flex: 1;
        .detailListTableHeader {
          display: flex !important;
          .MaterialClassification {
            flex: 3 !important;
          }
          .MaterialCoding {
            flex: 1 !important;
          }
          .MaterialName {
            flex: 1 !important;
          }
          .MaterialUnit {
            flex: 1 !important;
          }
          .Specifications {
            flex: 1 !important;
          }

        }
      }
    }
  }
</style>