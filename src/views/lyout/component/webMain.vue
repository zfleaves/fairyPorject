<template>
  <transition name="fade-transform" mode="out-in">
    <!--include  只缓存 里面的数组 -->
    <!--exclude  不包含里面的数组  都缓存-->
    <keep-alive :include="cachedPageName">
      <router-view :key="key">
      </router-view>
    </keep-alive>
  </transition>
</template>

<script>
  export default {
    name: "web-main",
    computed:{
      cachedPageName(){
        return this.$store.state.tagNav.cachedPageName
      },
      key(){
       return this.$route.path
      }
    }
  }
</script>

<style scoped>

</style>
