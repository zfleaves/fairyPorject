<template>
  <div class="buttonAndDetailComponents">
    <buttonComponent
      v-bind="$attrs"
      v-on="$listeners">
    </buttonComponent>
    <detailComponent v-bind="$attrs" v-on="$listeners">
    </detailComponent>
  </div>
</template>
<script>
  import detailComponent from 'components/detailComponent'
  import buttonComponent from 'components/buttonComponent'

  export default {
    components: {
      buttonComponent, detailComponent
    },
  }
</script>
<style scoped lang="scss">

</style>
