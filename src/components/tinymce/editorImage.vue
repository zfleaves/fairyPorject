<template>
  <div class="imgDialog">
    <el-button @click="imgDialogTableVisible=true" type="primary" size="mini">上传图片</el-button>

    <el-dialog title="上传图片" :visible.sync="imgDialogTableVisible"
       width="60%"
       center
    >
        <el-upload
          :action="fileUrl"
          list-type="picture-card"
          ref="upload"
          :data="fileName"
          multiple
          :on-error="handleError"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :headers="myHeaders"
          :file-list="imgUrlList"
          :auto-upload="true">
            <i slot="default" class="el-icon-plus"></i>
        </el-upload>
        <div class="btn" style="margin-top: 20px;">
            <el-button @click="imgDialogTableVisible=false" icon="el-icon-circle-close" size="small" type="danger" plain>取消</el-button>
            <el-button icon="el-icon-circle-check" size="small" type="primary" @click="handleSubmit">确认提交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getFilepath} from "api/messageCenter";
  import config from 'util/config'
  import Auth from 'util/auth'
  export default {
    name: "editor-image",
    data(){
      return{
        imgDialogTableVisible:false,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList: [
          {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ],
        fileUrl: config.fileUrl,
        fileCmsUrl: config.fileCmsUrl,
        myHeaders: {
          "Access-Token": Auth.hasToken(),
          userId: JSON.parse(Auth.hasUserInfo()).userId,
          'resource': 'P2'
        },
        fileName: {
          fileName: ''
        },
        imgUrlList:[]
        
      }
    },
    methods:{
      handleRemove(file) {
        console.log(file);
      },
       handleError(error, file, fileList) {
      this.$message.error("文件上传失败");
    },
    handleSuccess(response, file, fileList) {
      fileList.map(item => {
        if (item.response) {
          item.id = item.response.results;
        }
      })
      let imgUrlList = fileList.slice();
        let attachment = JSON.parse(JSON.stringify(imgUrlList));
        attachment = attachment.map(item => item.id)
        this.$message({
          message: "文件上传成功",
          type: "success"
        });
        getFilepath(attachment).then(res => {
          this.imgUrlList = res.results;
          for (let i in this.imgUrlList) {
            this.imgUrlList[i].name = this.imgUrlList[i].fileName;
            this.imgUrlList[i].url = this.fileCmsUrl + this.imgUrlList[i].filePath;
          }
        })
    },
    beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        }
        this.fileName.fileName = file.name;
        // this.uploadTitle = '上传中';
        return isLt5M;
      },
      handleClickCancel(){
       this.imgDialogTableVisible = false
      },
      handleSubmit(){
        let imagePathList = this.imgUrlList.map(v => v.url);
        this.$emit('successCBK', imagePathList);
        this.$refs.upload.clearFiles();
        this.imgUrlList = [];
        this.imgDialogTableVisible = false;

      }
    // props:{
    //    imgDialogTableVisible:{
    //     type:Boolean,
    //     default:false
    //   }
    // }
  }
    }
   
</script>

<style scoped>

</style>
