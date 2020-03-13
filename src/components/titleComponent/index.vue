<template>
  <div class="title">
    <span class="line"></span>
    <span class="name">{{titles}}</span>
    <slot class="btn" name="btn">
    </slot>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      titles: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style scoped lang="scss">
  .title {
    padding: 10px 0;
    line-height: 32px;
    position: relative;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    .name {
      color: #333;
    }
    .line {
      width: 4px;
      margin-left: 10px;
      height: 25px;
      background: #3e75ff;
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
    }
    .btn {
      display: inline-block;
      float: right;
    }
  }
</style>
