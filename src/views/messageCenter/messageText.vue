<template>
  <div class="messageText">
    <div class="top">
      <span>消息正文</span>
      <el-button size="small" style="float:right;margin-top: 12px;" type="danger" plain>返回</el-button>
    </div>
    <div class="messageTextCon">
      <p class="conTitle">其他全部</p>
      <p class="time">2019-11-06 16：18：43</p>
      <div class="messageTextMain" v-html="content">
        <!--{{content}}-->
      </div>
    </div>
  </div>
</template>

<script>
  import {getMessageInfo} from '@/api/messageCenter'

  export default {
    name: 'messageText',
    data() {
      return {
        id: '',
        content:''
      }
    },
    created() {
      let params = this.$route.params;
      this.id = this.Base64.decode(params.id);
    },
    methods:{
      _getMessageInfo(){
        getMessageInfo(this.id).then(res=>{
          this.content = res.results.content;
          // console.log(res)
          // // content
        })
      }
    },
    mounted(){
      this._getMessageInfo();
    }
  }
</script>
<style scoped lang="scss">
  .messageText {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 10px;
    height: calc(100% - 20px);
    overflow: hidden;
    .top {
      height: 60px;
      line-height: 60px;
      padding-left: 40px;
      border-bottom: 1px #eee solid;
      &::before {
        content: '';
        width: 4px;
        height: 25px;
        top: 37px;
        left: 40px;
        background: #3e75ff;
        position: absolute;

      }
    }
    .messageTextCon {
      width: 100%;
      padding: 0 40px;
      height: calc(100% - 70px);
      overflow: hidden;
      border: 1px solid #ccc;
      margin-top: 10px;
      padding-top: 10px;
      .conTitle {
        line-height: 30px;
        font-size: 18px;
      }
      .time {
        color: #666;
        font-size: 14px;
        padding-bottom: 10px;
        border-bottom: 1px #ccc solid;
      }
      p {
        text-align: center;
      }
    }
  }
</style>
