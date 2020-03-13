<template>
  <div class="tinymce">
    <editor id='tinymce' v-model='tinymceHtml' placeholder="请输入内容" :init='init'>
    </editor>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK">
      </editorImage>
    </div>
    <div class="preview">
      <el-button type="primary" size="mini" @click="previewClikc">预览</el-button>
    </div>
    <el-dialog title="富文本内容预览" :visible.sync="tinymceDialogTableVisible"
               width="80%">
      <div class="tinymceMsg" v-html="tinymceHtml"></div>
    </el-dialog>

  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  // import editorImage from 'components/Tinymce/eidtorImage'
  import 'tinymce/themes/modern/theme'
  // import 'tinymce/themes/silver/theme'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import editorImage from './editorImage'

  export default {
    name: "tinymce",
    components: {Editor, editorImage},

    data() {
      return {
        tinymceId: '#tinymce',
        tinymceHtml: '',
        init: {
          language_url: '/static/tinymce/zh_CN.js',
          language: 'zh_CN',
          selector: `#${this.tinymceId}`,
          skin_url: '/static/tinymce/skins/lightgray',
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        previewHeight: 400,
        tinymceDialogTableVisible: false
      }
    },
    mounted() {
      tinymce.init({});
      this.tinymceId = '#tinymce';
    },
    methods: {
      destroyTinymce() {
        if (tinymce.get(this.tinymceId)) {
          tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(value) {
        this.tinymceHtml = value;
        // Editor.get(this.tinymceId).setContent(value)
      },
      getContent() {
        return this.tinymceHtml;
        // return tinymce.get(this.tinymceId).getContent()
      },
      //上传图片成功
      imageSuccessCBK(arr) {
        const _this = this;
        arr.forEach(v => {
          this.tinymceHtml += `<img style="max-width: 500px" class="wscnph" src="${v}" >`;
          // tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v}" >`)
        })
      },
      // 预览
      previewClikc() {
        this.tinymceDialogTableVisible = true
        // this.$emit('isShowDialog',true)
      }
    }
  }
</script>

<style scoped lang="scss">
  .tinymce {
    width: 100%;
    position: relative;
    .editor-custom-btn-container {
      position: absolute;
      width: 100px;
      right: 0px;
      top: -3px
    }
    .preview {
      position: absolute;
      width: 100px;
      right: 110px;
      top: -3px
    }
    .preview-cons {
      position: absolute;
      width: 100%;
      right: 0px;
      background: white;
      border: 1px solid #606266;
      z-index: 999;
      height: 600px;
      top: -105px;
      .preview-cons-fix {
        position: absolute;
        width: 100%;
        top: 0px;
        bottom: 0px;
        overflow-y: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        .cons {
          padding: 30px 20px 20px 20px;
          width: 100%;
          height: 100%;
          /*background: pink;*/
        }
      }
    }
    .wscnph {
      width: 50px;
    }
  }
</style>
