<template>
    <div class="viewPermissions">
        <div class="tableHeader">
            <div class="functionMenu">功能菜单</div>
            <div class="operationButton">操作按钮</div>
        </div>
        <div class="tableMain" v-loading="loading">

            <ul>
            <li v-for="item in UserMenus" :key="item.id" class="height40">
                <div class="firstLi">
                <div class="left">
                    <i @click="handleExpand(item)" :class="item.flag ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>{{item.resName}}
                </div>
                <div class="right">
                    <el-checkbox :disabled="item.disabled" v-model="item.checked">所有</el-checkbox>
                </div>
                </div>
                <ul class="secondUL" :class="item.flag ? 'active' : ''">
                <li v-for="child in item.children" :key="child.id" class="secondLi">
                    <div class="left">
                    <el-checkbox :disabled="item.disabled" v-model="child.checked">{{child.resName}}</el-checkbox>
                    </div>
                    <div class="right">
                    <ul>
                        <li v-for="threeChild in child.children" :key="threeChild.id">
                        <el-checkbox :disabled="item.disabled" v-model="threeChild.checked">{{threeChild.resName}}
                        </el-checkbox>
                        </li>

                    </ul>
                    </div>
                </li>
                </ul>

            </li>

            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name:'',
    props:{
        UserMenus:{
            type:Array,
            default:()=>[]
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handleExpand(item) {
            item.flag = !item.flag
        }
    }
}
</script>
<style lang="scss" scoped>
.viewPermissions{
     .tableHeader {
      display: flex;
      height: 50px;
      line-height: 50px;
      background: #f8f8f9;
      .functionMenu {
        text-align: center;
        flex: 1;
        border-left: 1px #eee solid;
        border-bottom: 1px #eee solid;
        border-top: 1px #eee solid;
      }
      .operationButton {
        text-align: center;
        flex: 1.3;
        border-left: 1px #eee solid;
        border-bottom: 1px #eee solid;
        border-top: 1px #eee solid;
      }
    }
    .tableMain {
      .height40 {

        .firstLi {
          display: flex;
          // padding-left: 10px;
          border-left: 1px #eee solid;
          border-bottom: 1px #eee solid;
          height: 40px;
          line-height: 40px;
          .left {
            flex: 1;
            // padding-left: 10px;
            border-right: 1px #eee solid;
            i {
              margin-right: 10px;
              padding-left: 10px;
            }
          }
          .right {
            flex: 1.3;
            label {
              padding-left: 20px;
            }
          }
        }
      }
      .secondUL {
        width: 100%;
        display: none;
        // padding-left: 10px;
        .secondLi {
          display: flex;
          border-left: 1px #eee solid;
          border-bottom: 1px #eee solid;
          //  height: 40px;
          // line-height: 40px;
          .left {
            flex: 1;
            border-right: 1px #eee solid;
            padding: 10px 0;
            label {
              margin-left: 25px;
            }
          }
          .right {
            flex: 1.3;
            overflow: hidden;
            li {
              label {
                padding-left: 10px;
              }
              display: inline-block;
              float: left;
              padding: 10px;
            }
          }
        }
        &.active {
          display: block;
        }
      }
    }
}
    
</style>