<template>
  <div>
    <el-table :data="gridData" border stripe max-height="400">
      <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.fileName | fileNameFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSuffix" label="附件类型" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.fileSize}}KB</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div class="popover-img">
            <el-button
              @click="handleImageViewer(scope.row)"
              :disabled="scope.row.fileSuffix | filterFile" type="text" size="small">查看
            </el-button>
            <!--<el-popover-->
            <!--placement="left"-->
            <!--trigger="click">-->
            <!--<img :src="fileCmsUrl + scope.row.filePath">-->
            <!--<el-button slot="reference" :disabled="scope.row.fileSuffix | filterFile" type="text" size="small">查看-->
            <!--</el-button>-->
            <!--</el-popover>-->
            <a href="javascript:void(0)" @click="downFilePath(scope.row)">
              <el-button type="text" size="small">下载</el-button>
            </a>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <ImageViewer
      @clearImg="getClearImg" :current-img="currentImg" :visible="visible">
    </ImageViewer>
  </div>
</template>

<script>
  import config from "util/config";
  import {dataDictionary} from 'mixins/index'
  import ImageViewer from '../imageViewer/imageViewer'

  export default {
    name: "attachment",
    mixins: [dataDictionary],
    data() {
      return {
        fileCmsUrl: config.fileCmsUrl,
        viewerShow: false,
        maskBtn: false,
        currentImg: '',
        visible: false
      }
    },
    components: {ImageViewer},
    props: ['gridData'],
    filters: {
      filterFile(val) {
        if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(val)) {
          return false
        } else {
          return true
        }
      },
      fileNameFilter(val) {
        return val ? val.substr(0, val.lastIndexOf('_')) : ''
      },
    },
    methods: {
      handleClickGridData(row) {
        this.viewerShow = true
      },
      handleImageViewer(row) {
        this.currentImg = this.fileCmsUrl + row.filePath;
        this.visible = true;
      },
      getClearImg() {
        this.visible = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .popover-img {
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      margin: 0 auto;
    }

    .img-show-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3000;
      background: rgba(0, 0, 0, .5);
    }

    .img-show-mask .bigImg {
      width: 500px;
      height: 280px;
      position: absolute;
      z-index: 3100;
      top: 0;
      left: 0;
      margin: auto;
    }
  }
</style>
