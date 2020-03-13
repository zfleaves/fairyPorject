<template>
  <div class="suggestionCenterEdit">
    <title-message :titles="titless">
      <div class="btn" v-if="!flowStatus" slot="btn">
        <el-button @click="successCancel" icon="el-icon-circle-close" size="small" type="danger" plain>取消</el-button>
        <el-button @click="successSubmit('EditForm')" icon="el-icon-circle-check" size="small" type="primary">确认提交</el-button>
      </div>
    </title-message>
    <div class="mainCon">
      <div class="mainFrom">
        <el-form v-if="!flowStatus" :rules="rules" ref="EditForm" :model="EditForm" label-width="200px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="温馨提示">
                <p>提交建议的内容仅包括优化建议，系统缺陷，确认提交后，响应时间一般为1-2个工作日；</p>
                <p>如果您需要的是技术支持，系统故障，咨询服务，投诉建议，请联系在线客服或者拨打027-8788 8057向中建君联工程师寻求帮助。</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="18">
              <el-col :span="24">
                <el-form-item label="请选择建议类型">
                  <ul class="typeUL">
                    <li @click="handClickTypeUL(item,index)" :class="currentIndex === index ? 'active' : ''"
                        v-for="(item,index) in typeUL" :key="index">
                      <span>{{item.value}}</span>
                      <span class="smallIcon"><i class="el-icon-check"></i></span>
                    </li>
                  </ul>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="title" label="标题">
                  <el-input v-model="EditForm.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容">
                  <tinymce  ref="tinymce">

                  </tinymce>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传附件">
                  <uploadFile :attachment='projectForm.attachment' @attachment="handleBidWinningAttach"
                              :flowStatus="true">
                  </uploadFile>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="6">
              <el-col style="height:62px;" :span="24">
                <p style="font-size:14px;color:#3e75ff;">填写示例样式</p>
              </el-col>
              <el-col class="example" :span="24">

                <div>
                  <span class="biaoti">[标题]</span>
                  <p class="value">希望增加标签打印功能</p>
                  <span class="line"></span>
                  <span class="biaoti">[问题描述]</span>
                  <p class="value">实现材料一物一码，完成唯一标识</p>
                  <span class="biaoti">[解决方案]</span>
                  <p class="value">可以对材料明细进行二维码生成，支持打印不干胶标签。</p>
                  <p class="value">在供货订单/电子发货单/入库单时支持。</p>
                </div>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <el-form v-else :rules="rules" ref="EditForm" :model="EditForm" label-width="200px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="温馨提示">
                <p>提交建议的内容仅包括优化建议，系统缺陷，确认提交后，响应时间一般为1-2个工作日；</p>
                <p>如果您需要的是技术支持，系统故障，咨询服务，投诉建议，请联系在线客服或者拨打027-8788 8057向中建君联工程师寻求帮助。</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="18">
              <el-col :span="24">
                <el-form-item label="请选择建议类型">
                  <ul class="typeUL">
                    <li class="active">
                      <span>{{EditForm.typeName}}</span>
                      <span class="smallIcon"><i class="el-icon-check"></i></span>
                    </li>
                  </ul>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="title" label="标题">
                 <span>
                    {{EditForm.title}}
                 </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容">
                  <div style="border: 1px #ccc solid;padding: 0 20px;" v-html="EditForm.content">

                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传附件">
                  <uploadFile :attachment='EditForm.attachment' :index="0" @attachment="handleBidWinningAttach"
                              :flowStatus="false">
                  </uploadFile>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {createSuggest,suggestInfo} from 'api/messageCenter'
  import TitleMessage from 'components/titleComponent'
  import Tinymce from 'components/tinymce/tinymce'
  import UploadFile from 'components/upload/uploadFile'
  import {closeRoute} from 'mixins'

  export default {
    name: 'suggestionCenterEdit',
    mixins:[closeRoute],
    components: {
      TitleMessage, Tinymce, UploadFile
    },
    data() {
      return {
        titless: '建议中心',
        EditForm: {},
        typeUL: [
          {id: 1, value: '功能优化'},
          {id: 2, value: '系统缺陷'}
        ],
        content: '<p style="font-weight: bold;">[问题描述]:</p><p><br /><br /><br /><br /></p><p style="font-weight: bold;">[建议方案]:</p><p>&nbsp;</p>',
        projectForm: {
          attachment: '',
        },
        currentIndex: 0,
        isTinymceDialogTableVisible:false,
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ]
        },
        id:'',
        flowStatus:false
      }
    },
    created() {
      let params = this.$route.params;
      this.id = JSON.parse(Base64.decode(params.id));
      this.flowStatus = JSON.parse(Base64.decode(params.flowStatus));
      if (this.flowStatus) {
        this._getSuggestInfo();
      }
    },
    mounted() {
       if (!this.flowStatus) {
          let tinymce = this.$refs.tinymce;
          tinymce.setContent(this.content);
      }

    },
    methods: {
      handClickTypeUL(item, index) {
        this.currentIndex = index;

      },
      handleBidWinningAttach(ids) {
        console.log(ids);
        this.projectForm.attachment = ids;
      },
      successSubmit(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
                this.$confirm('在预审完成前不能修改和删除，确认提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log('111111');

              let data = {
                attachment:this.projectForm.attachment,
                content:this.$refs.tinymce.tinymceHtml,
                status:0,
                title:this.EditForm.title,
                typeName:this.currentIndex === 0 ? '功能优化' : '系统缺陷'
              }
              createSuggest(data).then(res=>{
                if(res.status === 0){
                    this.$alert('感谢您提交宝贵的建议\n预审一般在1-2个工作日内完成。', '', {
                    confirmButtonText: '我知道了',
                    callback: action => {
                      // this.$message({
                      //   type: 'info',
                      //   message: `action: ${ action }`
                      // });
                      this.setRoute()
                    }
                  });

                }
              })

            }).catch((e) => {
              console.log(e)
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          } else {

          }
        });
      },
      successCancel(){
         this.setRoute()
      },
      // 获取数据
      _getSuggestInfo() {
        suggestInfo(this.id).then(res => {
          this.EditForm = res.results;
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  .suggestionCenterEdit {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 10px;
    height: calc(100% - 20px);
    overflow: hidden;
    .mainCon {
      width: 100%;
      height: calc(100% - 60px);

      .mainFrom {
        overflow-y: auto;
        height: 100%;
        widows: 100%;
        .typeUL {
          li {
            padding: 5px 10px;
            border: 1px #eee solid;
            width: 130px;
            float: left;
            height: 35px;
            /* line-height: 40px; */
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 15px;
            position: relative;
            border-radius: 3px;
            i {
              display: none;
            }
            &.active {
              border: 1px #3e75ff solid;
              .smallIcon {
                position: absolute;
                right: 0;
                top: 0;
                width: 15px;
                height: 15px;
                display: inline-block;
                border: none;
                border-left: 1px #3e75ff solid;
                border-bottom: 1px #3e75ff solid;
                i {
                  display: inline-block;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%)
                }
              }
            }
          }

        }
        .example {
          border: 1px #3e75ff solid;
          padding: 10px;
          background: #deeeff;
          font-size: 14px;
          .biaoti {
            line-height: 40px;
            color: #999;
          }
          .value {
            line-height: 50px;
          }
          .line {
            width: 100%;
            height: 2px;
            display: inline-block;
            background: #3e75ff;
          }
        }
      }
    }
  }
</style>
