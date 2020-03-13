<template>
  <div class="uploadFileWrap">
    <ul v-if="imgUrlList.length > 0">
      <li>
        <el-dropdown size="height:40px;">
          <p class="set" style=" white-space: nowrap;text-overflow: ellipsis;overflow:hidden;">
            {{imgUrlList[0].fileName | fileNameFilter}}</p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :key="item.id"
              v-for="(item,index) in imgUrlList">
              {{item.fileName | fileNameFilter}}
              <span @click="deleltImages(index)" style="float: right;margin-left: 6px;">
                <i class="el-icon-circle-close"></i>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <el-upload
      v-if="flowStatus"
      style=" vertical-align: middle;display: inline-block;height: 100%;"
      :action="fileUrl"
      :headers="myHeaders"
      :data="fileName"
      ref="upload"  multiple :limit="10"
      :file-list="imgUrlList"
      :on-error="handleError"
      :on-change="imgPreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload">
      <el-button
        class="uploadBtn"
        :disabeld="uploadTitle==='正在上传'"
        style="vertical-align: middle" type="text">{{uploadTitle}}
      </el-button>
    </el-upload>
    <el-button
      v-if="imgUrlList.length > 0"
      @click="handleGridData"
      class="uploadBtn findFiles"
      type="text">点击查看
    </el-button>
    <span v-if="imgUrlList.length===0 && !flowStatus">暂无附件</span>

    <!-- 附件弹框 -->
    <el-dialog
      class="el-dialog-auto" title="附件列表" append-to-body
      v-if="dialogGridData" :visible.sync="dialogGridData"
      width="70%">
      <attachmentList :gridData="gridData">
      </attachmentList>
    </el-dialog>
  </div>
</template>

<script>
  import Auth from 'util/auth'
  import config from 'util/config'
  import {getFilePath} from "../../api/home/home";
  import attachmentList from './attachmentList'

  export default {
    name: "upload-file",
    components: {attachmentList},
    data() {
      return {
        fileUrl: config.fileUrl,
        myHeaders: {
          "Access-Token": Auth.hasToken(),
          userId: JSON.parse(Auth.hasUserInfo()).userId,
          'resource': 'P2'
        },
        fileName: {fileName: ''},
        imgUrlList: [],
        gridData: [],
        uploadTitle: '点击上传',
        dialogGridData: false
      }
    },
    props: {
      flowStatus: {
        type: Boolean,
        default: true
      },
      attachment: {
        type: String,
        default: '',
      }
    },
    watch: {
      attachment() {
        this.getGridData();
      }
    },
    methods: {
      // 获取文件
      getGridData() {
        console.log(this.attachment);
        if (this.attachment) {
          let attachmentIdList = this.attachment.split(',');
          getFilePath(attachmentIdList).then(res => {
            this.imgUrlList = res.results;
            this.gridData = res.results;
          });
        }
      },
      // 点击查看文件
      handleGridData() {
        this.dialogGridData = true;
      },
      // 移除文件
      deleltImages(index) {
        console.log(this.imgUrlList);
        this.$confirm(`确定删除“${this.imgUrlList[index].fileName}”文件么, 是否删除?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.imgUrlList.splice(index, 1); //假设长度为3
          if (this.imgUrlList.length) {
            let attachment = this.imgUrlList.map(v => v.id).join(',');
            this.$emit('attachment', attachment);
          } else {
            this.$emit('attachment', '');
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 移除文件
      handleRemove(file, fileList) {

      },
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      imgPreview(file, fileList) {

      },
      // 文件上传之前
      beforeAvatarUpload(file) {
        console.log(file);
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        this.fileName.fileName = file.name;
        this.uploadTitle = '正在上传';
        return isLt2M;
      },
      //文件上传成功
      handleSuccess(response, file, fileList) {
        console.log(response);
        console.log(fileList);
        fileList.map(item => {
          if (item.response) {
            item.fileName = item.name;
            item.filePath = item.url;
            item.fileSize = item.size;
            item.id = item.response.results
          }
        })
        let imgUrlList = fileList.reverse();
        let arr = imgUrlList.map(v => v.id);
        this.$emit('attachment', arr.join(','));
        // getFilePath(arr).then(res => {
        //   this.imgUrlList = res.results;
        //   this.gridData = res.results;
        // });
        this.$message.success('文件上传成功');
        this.uploadTitle = '点击上传';
      },
      //文件上传失败
      handleError(err, file, fileList) {
        this.$message.error('文件上传失败');
        this.uploadTitle = '点击上传';
      }
    }
  }
</script>

<style scoped lang="scss">
  .uploadFileWrap {
    width: 100%;
    /*width: 300px;*/
    height: 40px;
    /*height: 100%;*/
    ul {
      width: calc(100% - 140px);
      max-width: calc(100% - 140px);
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      li {
        width: 100%;
        height: 100%;
        p {
          width: 100%;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
      }
    }
    /*.el-upload {*/
    /*vertical-align: middle;*/
    /*display: inline-block;*/
    /*height: 100%;*/
    /*}*/
    .uploadBtn {
      display: inline-block;
      vertical-align: middle;
      width: 60px;
      /*margin: 0 5px;*/
      &.findFiles {
        position: relative;
        top: 1.6px;
      }
    }
  }
</style>
