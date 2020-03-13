<template>
  <div class="scroll-container left" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left+'px'}">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  const padding = 10
  export default {
    data() {
      return {
        left: 0,
        wheelSpeed: 30
      }
    },
    computed: {},
    methods: {
      handleScroll(e){
          const eventDelta = e.wheelDelta || -e.deltaY * 3;
          const $container = this.$refs.scrollWrapper;
          const $containerWidth = $container.offsetWidth;
          const $wrapper = this.$refs.scrollWrapper;
          const $wrapperWidth = $wrapper.offsetWidth;

          if(eventDelta > 0){
              this.left = Math.min(0,this.left + eventDelta)
          }else{
              if($$containerWidth - padding < $wrapperWidth){
                  if(this.left < -($wrapperWidth - $containerWidth + padding)){
                      this.left = this.left
                  }else{
                      this.left = Math.max(this.left + eventDelta , $containerWidth - $wrapperWidth - padding)
                  }
              }else{
                  this.left = 0
              }
          }
      },
      scrollToCurTag() {
        let scrollContainerWidth = this.$refs.scrollContainer.offsetWidth;
        let scrollWrapper = this.$refs.scrollWrapper;
        let childMargin = scrollWrapper.children.length * 4;
        for (let i = 0; i < scrollWrapper.children.length; i++) {
          let child = scrollWrapper.children[i];
          childMargin += child.offsetWidth;
        }
        if (childMargin > scrollContainerWidth) {
          this.left = -(childMargin - scrollContainerWidth);
        } else {
          this.left = 0;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .scroll-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    .scroll-wrapper {
      height: 30px;
      width: 200%;
      position: absolute;
    }
  }
</style>


