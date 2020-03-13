<template>
    <transition name="move">
        <div class="rightModal">
            <div class="rightModalHeader">
                <slot name="header"></slot>
            </div>
            <div class="rightModalCon">
                <div class="rightModalCon_fix" ref="scroll">
                    <slot name="body"></slot>
                </div>
            </div>
            <div class="rightModalFooter">
                <slot name="footer"></slot>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name:'rightModal',
    methods:{
        scroll(){
            if(this.$refs.scroll){
                this.$refs.scroll.scrollTop = 0;
            }
        }
    },
    watch:{
        showRightModal(){
            if(this.showRightModal){
                this.scroll()
            }
        }
    }

}
</script>
<style lang="scss" scoped>
    .rightModal{
        width: 480px;
        z-index: 1000;
        position: fixed;
        bottom: 0;
        right: 0;
        top: 95px;
        box-shadow: -2px 2px 6px 0 rgba(0,0,0,.18);
        background-color: #fff;
        .rightModalHeader{
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            font-weight: 700;
            border-bottom: 1px #eee solid;
            text-align: center
        }
        .rightModalCon{
            width: 100%;
            padding: 20px 20px 50px 20px;
            height: calc(100% - 50px);
            overflow: hidden;
            position: relative;
            .rightModalCon_fix{
                position: absolute;
                top:20px;
                bottom: 70px;
                left: 20px;
                right: 20px;
                overflow-y: auto;
                overflow-x: hidden;
                &::-webkit-scrollbar{
                    overflow: hidden;
                }
            }
        }
        .rightModalFooter{
            position: absolute;
            height: 50px;
            bottom: 0;
            width: 100%;
            border-top: 1px #eee solid;
            line-height: 50px;
            text-align: center;
        }

    }
</style>


