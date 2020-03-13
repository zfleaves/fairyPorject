<template>
  <div>
    401:没有操作权限
    <span class="midFont set" @click="back">返回上一页</span>
  </div>
</template>


<script>

  export default {
    name: 'app',
    data() {
      return {
        value: '',
        showEmoji: false,
        data: []
      }
    },
    methods: {
      back(){
        this.$router.go(-1);
      }
    },
  }
</script>

<style lang="scss">

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  #app1 {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 60px auto;
    width: 500px;
    .icon {
      position: relative;
      margin-top: 20px;
      .iconfont {
        cursor: pointer;
        color: #F7BA2A;
      }
      .emoji-box {
        position: absolute;
        z-index: 10;
        left: -10px;
        top: 24px;
        box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
        background: white;
        .el-button {
          position: absolute;
          border: none;
          color: #FF4949;
          right: 12px;
          top: 12px;
          z-index: 10;
        }
        .arrow {
          left: 10px;
        }
      }
      .submit {
        float: right;
      }
    }
    .comment {
      margin-top: 20px;
      .item {
        margin-top: 20px;
        padding: 10px;
        margin: 0;
        border-top: 1px solid #bfcbd9;
      }
    }
  }

  .clearfix {
    &:after {
      content: '';
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .fade-move {
    transition: transform .4s;
  }

  .list-enter-active, .list-leave-active {
    transition: all .5s;
  }

  .list-enter, .list-leave-active {
    opacity: 0;
    transform: translateX(30px);
  }

  .list-leave-active {
    position: absolute !important;
  }

  .list-move {
    transition: all .5s;
  }
</style>

