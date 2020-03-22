<template>
    <div class="upload">
        <div class="uploadTitle">
            <div class="title">
                <el-upload
                    :disabled="isClick"
                    class="upload-demo"
                    :action="httpUrls"
                    :headers='headers'
                    :data="fileName"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-error="handleError"
                    :on-success="handleSuccess"
                    multiple
                    :limit="10"
                    :on-exceed="handleExceed"
                    :before-upload="beforeAvatarUpload"
                    :file-list="imgUrlList">添加附件
                </el-upload>
                <i @click="handleClickCaret" :class="caretFlag ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
            </div>
            <div class="num">已成功上传<span>{{newfilepathList.length}}</span>个附件，共<span>{{totalSize}}</span></div>
        </div>
        <div v-if="!caretFlag" class="fileCon">
            <div v-for="item in newfilepathList" :key="item.id" class="fileList">
                <div class="imgCon">
                   <span class="icon iconfont" :class="setClass(item.fileName)"></span>
                </div>
                <div class="title">
                    <p>{{item.fileName}}</p>
                    <p>{{formatFileSize2(item.fileSize)}}</p>
                    <div class="suspension"></div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import httpUrl from 'util/config'
import Auth from 'util/auth'
export default {
    name:"upload",
    data(){
        return{
            httpUrls:httpUrl.fileUrl,
            imgUrlList:[],
            fileName: {fileName: ''},
            headers:{
                'Access-Token':Auth.hasToken() ? Auth.hasToken() : '',
                'resource':'P2',
                'userId':JSON.parse(Auth.hasUserInfo()) ? `${JSON.parse(Auth.hasUserInfo()).userId}` : ''
            },
            caretFlag:false,
            totalSize:0,
            newfilepathList:[]
        }
    },
    props:{
        filepathList:{
            type:Array,
            default:()=>[]
        },
        isClick:{
            type:Boolean,
            default:false
        },
    },
    created(){
        
    },
    mounted(){
        this.newfilepathList = JSON.parse(JSON.stringify(this.filepathList))
        this.total()
    },
    methods:{
        total(){
            let sum = 0;
            for(let i in this.newfilepathList){
                let item = this.newfilepathList[i]
                sum += item.fileSize
            }
            this.formatFileSize(sum)
        },
        formatFileSize(size) {
            let value = Number(size);
            if (size && !isNaN(value)) {
                const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
                let index = 0;
                let k = value;
                if (value >= 1024) {
                    while (k > 1024) {
                        k = k / 1024;
                        index++;
                    }
                }
                this.totalSize = `${(k).toFixed(2)}${units[index]}`
                return
            }
            this.totalSize = 0
            return
        },
         formatFileSize2(size) {
            let value = Number(size);
            if (size && !isNaN(value)) {
                const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
                let index = 0;
                let k = value;
                if (value >= 1024) {
                    while (k > 1024) {
                        k = k / 1024;
                        index++;
                    }
                }
                
                return `${(k).toFixed(2)}${units[index]}`
            }
            
            return '0'
        },
        //点击展开箭头
        handleClickCaret(){
            this.caretFlag = !this.caretFlag
        },
        //判断是什么类型的文件
        setClass(val){
            if(val){
                let filePath =val.split(".");
                let fileType =filePath[filePath.length - 1]
                fileType.toLowerCase()
                if(fileType === 'txt'){
                    return 'iconTXTtubiao'
                }else if(fileType === 'ppt'){
                    return 'iconppt'
                }else if(fileType === 'rar'){
                    return 'iconrar'
                }else if(fileType === 'doc' || fileType === 'docx'){
                    return 'iconword'
                }else if(fileType === 'xls' || fileType === 'xlsx'){
                    return 'iconexcel'
                }else{
                    return ''
                }
            } 
        },
        handleRemove(file, fileList) {
        console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
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
            // this.uploadTitle = '正在上传';
            return isLt2M;
        },
        //文件上传成功
        handleSuccess(response, file, fileList) {

            console.log(response);
            console.log(file);
             console.log(fileList);
            fileList.map(item => {
            if (item.response) {
                item.fileName = item.name;
                // item.filePath = item.url;
                item.fileSize = item.size;
                item.id = item.response.results
            }
            })
            
            this.newfilepathList = this.newfilepathList.concat(fileList).reverse();
            this.newfilepathList = [...new Set(this.newfilepathList)]
            
            let arr = this.newfilepathList.map(v => v.id);

            this.$emit('attachment', arr.join(','));
            this.$message.success('文件上传成功');
            this.total()
            // this.uploadTitle = '点击上传';
        },
        //文件上传失败
        handleError(err, file, fileList) {
            this.$message.error('文件上传失败');
            // this.uploadTitle = '点击上传';
        }
    }
}
</script>
<style lang="scss" scoped>
.upload{
    .uploadTitle{
        display: flex;
        line-height: 25px;
        .title{
            display: flex;
            height: 25px;
            border-right: 2px solid #ccc;
            i{
                margin: 3px 10px 0 10px;
            }
        }
        .num{
            margin-left: 30px;
        }
    }
    .fileCon{
        overflow: hidden;
        padding: 20px 0;
        .fileList{
            display: flex;
            width: 260px;
            float: left;
            overflow: hidden;
            margin-right: 10px;
            margin-bottom: 10px;
            &:last-child{
                margin-right: 0px;
            }
            .imgCon{
                width: 50px;
                span{
                    &.iconrar{
                        color: #969896;
                    }
                    &.iconppt{
                        color: #a71d5d;
                    }
                    &.iconword{
                        color: #0086b3;
                    }
                    &.iconexcel{
                        color: #63a35c;
                    }
                    &.iconTXTtubiao{
                        color: #333333;
                    }
                    font-size: 50px;
                }
            }
            .title{
                flex: 1;
                display: flex;
                flex-direction: column;
                padding-left: 10px;
                background: #fafafa;
                position: relative;
                
                .suspension{
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(1,1,1,.5);
                }

                p{
                    flex: 1;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    line-height: 25px;
                }
            }
        }
    }
}
</style>