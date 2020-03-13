<template>
  <div class="back">
    <!--<xxx v-if="formCode===''">-->
    <!--</xxx>-->
    <!--<xxx2 v>-->
    <!--</xxx2>-->
  </div>
</template>

<script>
  // import xxx from 'xxx.vue'
  // import xxx2 from 'xxx.vue'
  // import xxx3 from 'xxx.vue'
  // import xxx4 from 'xxx.vue'


  export default {
    name: 'back',
    data(){
      return {
        formCode:'',
      }
    },
    created(){
      this.formCode = this.$route.params.formCode;
    }
  }
</script>
<style scoped lang="scss">

</style>
