<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    //在父组件注册一个全局方法，子组件可以使用
    provide() {
      return {
        reload: this.reload,
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    created() {
      this.client = '小仙女';
    },
    methods: {
      reload() {
        this.isRouterAlive = false;

        //dom节点更新完之后显示页面
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
</style>
