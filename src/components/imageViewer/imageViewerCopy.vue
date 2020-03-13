<template>
   <div v-if="visible" @click="hideImage">
      <div class="see-image" :style="{backgroundColor:background}">
        <img v-drag="greet" id="drag" class="image"  
        :src="currentImg" ref="user_image"
         @mousewheel="wheel" alt="">
      </div>
      <div class="rotate" @click.stop="rotateImage"
        v-show="rotateButtonVisible"
      >
        <i class="el-icon-refresh-left"></i>
      </div>
   </div>
</template>
<script>
const config = {
  canClickModalHide:true,
  closeButtonvisible:true,
  modalOpacity:0.3,
  rotateButtonVisible:true
}
const {modalOpacity,canClickModalHide,rotateButtonVisible,closeButtonvisible} = config;
export default {
  data(){
    return {
      background: modalOpacity >1 || modalOpacity<= 0 || typeof modalOpacity !=="number" ? null : 'rgba(0,0,0,'+modalOpacity+')',
      rotateButtonVisible,
      closeButtonvisible
    }
  },
  props:{
    visible:{
      type: Boolean,
      default:false
    },
    currentImg:{
      type:String,
      default:''
    }
  },
  methods:{
    close(){
      this.clearImg()
    },
    greet(val){
      this.val = val;
    },
    hideImage(e){
      if(!this.visible || (!canClickModalHide && closeButtonvisible)) return;
      document.addEventListener('click',(e) =>{
        if(e.target.nodeName !== 'IMG' && e.target.nodeName !=='BUTTON'){
          this.clearImg();
        }
      })
    },
    rotateImage(e){
      let fromRotateDeg = this.$refs.user_image.style.transform.split(' ');
      switch (fromRotateDeg[0]){
        case 'rotate(0deg)':
          fromRotateDeg[0] = 'rotate(90deg)';
          break;
        case 'rotate(90deg)':
        fromRotateDeg[0] = 'rotate(180deg)';
        break;
        case 'rotate(180deg)':
        fromRotateDeg[0] = 'rotate(270deg)';
        break;
        case 'rotate(270deg)':
        fromRotateDeg[0] = 'rotate(360deg)';
        break;
        default:
        fromRotateDeg[0] = 'rotate(90deg)';
        break;
      }
      this.$refs.user_image.style.transform = fromRotateDeg.join(' ');
     },
     wheel(e) {
       if(e.wheelDelta){
         if(e.wheelDelta > 0){
           this.$refs.user_image.style.transform = this.$refs.user_image.style.transform = 'scale(0.9)';
         }
         if(e.wheelDelta < 0){
           this.$refs.user_image.style.transform = this.$refs.user_image.style.transform = 'scale(1.1)';
         }
       }else if(e.detail){
           if(e.detail > 0){
            this.$refs.user_image.style.transform = this.$refs.user_image.style.transform = 'scale(0.9)';
            }
            if(e.detail < 0){
              this.$refs.user_image.style.transform = this.$refs.user_image.style.transform = 'scale(1.1)';
            }
        }
     },
     clearImg(){
       this.$emit('clearImg');
       document.removeEventListener('click',null);
       setTimeout(()=>{
         if(this.$refs.user_image) {
           this.$refs.user_image.style.transform = 'rotate(0deg)';
           this.$refs.user_image.style.left = "";
           this.$refs.user_image.style.top = "";
         }
       })
     }
  }
}
</script>