
<template>
    <div class="MaterialModal">
        <div class="MaterialModalInner">
            <div class="top">
                <slot name="title"></slot>
            </div>
            <div class="MaterialModalInnerCon">
                <div class="detailList">
                    <div class="detailList_fix">
                        <slot name="detailListInner"></slot>
                    </div>
                </div>
                <div class="selectList">
                     <slot name="selectListInner"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'MaterialModal'
    }
</script>
<style scoped lang="scss">
    .MaterialModal{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        .MaterialModalInner{
            width: 90%;
            height: 600px;
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%,-50%);
            display: flex;
            flex-direction: column;
            .top{
                height: 50px;
                width: 100%;
                background: #0079e8;
                text-align: center;
                color: #fff;
                overflow: hidden;
                line-height: 50px;
                font-size: 20px;

            }
            .MaterialModalInnerCon{
                flex: 1;
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                background: #fff;
                overflow: hidden;
                .detailList{
                    flex: 1;
                    position: relative;
                    .detailList_fix{
                        position: absolute;
                        top: 0px;
                        left: 0;
                        right: 10px;
                        bottom: 0;
                        overflow-y: auto;
                        &::-webkit-scrollbar{
                            display: none;
                        }
                    }
                }
                .selectList{
                    flex: 1;
                }
            }
        }
    }

    .detailListTableHeader{
        display: flex !important;
        .MaterialClassification{
            flex: 3!important;
        }
        .MaterialCoding{
            flex: 1!important;
        }
        .MaterialName{
            flex: 1!important;
        }
        .MaterialUnit{
            flex: 1!important;
        }
        .Specifications{
            flex: 1!important;
        }
        
    }



</style>
