<template>
    <div class="jurisdiction list2">
        <div class="list2_fixed">
            <ul class="role-table">
                <li class="header">
                    <div class="left">功能菜单</div>
                    <div class="right">操作按钮</div>
                </li>
                <div class="vertical-line"></div>
                <li v-for="(item,index) in adminData" :key="index">
                    <div class="left h40" @click="fold(item)">
                        <i :class="{'el-icon-caret-bottom':item.folded,'el-icon-caret-right':!item.folded}"
                        v-if="item.children"
                        class="item-icon"
                        ></i>
                            <span class="midFont" v-if="item.children">{{item.resName}}</span>
                    </div>
                    <div class="right h40">
                        <el-checkbox v-if="item.children.length"
                                :indeterminate="item.isIndeterminate" v-model="item.firstCheckAll"
                                ref="checkboxAll"
                                :label="item.id"
                                :disabled="isDisabledList.length?isDisabledList[index].menu:false"
                                @change="checkSecondALL(item,index)"
                                >所有
                            </el-checkbox>
                    </div>
                        <div class="line"></div>
                        <ul v-show="item.children.length&&item.folded">
                            <li class="h40" v-for="(second,cur) in item.children" :key="second.id">
                                <div class="left" style="text-indent:5px">
                                    <!-- :isIndeterminate="second.isIndeterminate" -->
                                    <el-checkbox 
                                    :indeterminate="second.isIndeterminate"
                                    v-model="second.checkAll" :label="second.id"
                                    @change="handleCheckAllChange($event,item,second)"
                                    :disabled="isDisabledList.length?isDisabledList[index].button[cur].menu:false">
                                        {{second.resName}}
                                    </el-checkbox>
                                </div>
                                <div class="right">
                                    <el-checkbox-group v-model="second.checkedList" @change="handleCheckedCitiesChange(item,second)">
                                        <el-checkbox 
                                        :disabled="isDisabledList.length?isDisabledList[index].button[cur].menu:false"
                                        v-for="p in second.buttonList" :label="p.id" :key="p.id">{{p.resName}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div class="line"></div>
                            </li>
                        </ul>
                    
                </li>
            </ul>
       </div>
    </div>
</template>

<script>
    export default {
        name:'jurisdiction',
        data(){
            return{

            }
        },
        props:{
            adminData:{
                type:Array,
                default:()=> []
            },
            isDisabledList:{
                type:Array,
                default:()=> []
            }
        },
        methods:{
            fold(item){
                item.folded = !item.folded;      
            },
            //点击勾选所有
            checkSecondALL(item,index){
                console.log(item)
                if(typeof item.firstCheckAll === 'undefined'){
                    this.$set(item,'firstCheckAll',true);
                }
                for(let a = 0 ;a<item.children.length;a++){
                    this.checkItemAll(item.firstCheckAll,item.children[a]);
                }
                item.isIndeterminate = false;
            },
            // 设置子项左边勾选
            checkItemAll(flag,child){
                // let arr = [];
                // for(let i in child.buttonList){
                //     arr.push(child.buttonList[i].id);
                // }
                let arr = child.buttonList.map(v=>v.id)
                if(typeof child.isIndeterminate === 'undefined'){
                    this.$set(child,'isIndeterminate',false);
                }
                if(typeof child.checkedList === 'undefined'){
                    this.$set(child,'checkedList',arr);
                }
                if(typeof child.checkAll === 'undefined'){
                    this.$set(child,'checkAll',true);
                }
                child.checkedList = flag ? arr :[];
                child.checkAll = flag;
                child.isIndeterminate = false;
            },
            // 点击左边子菜单
            handleCheckAllChange(event,item,second){
                console.log(event)
                console.log(item)
                console.log(second)
                if(typeof item.isIndeterminate === 'undefined'){
                    this.$set(item,'isIndeterminate',false);
                }
                if(typeof item.firstCheckAll === 'undefined'){
                    this.$set(item,'firstCheckAll',true);
                }
                if(typeof second.isIndeterminate === 'undefined'){
                    this.$set(second,'isIndeterminate',false);
                }
                if(typeof second.checkedList === 'undefined'){
                    this.$set(second,'checkedList',[]);
                }
                if(typeof second.checkAll === 'undefined'){
                    this.$set(second,'checkAll',true);
                }
                let arr = second.buttonList.map(v=>v.id);
                second.checkedList = event ? arr : [] ;
                second.checkAll = event;
                second.isIndeterminate  = false;
                let secondCheckList = item.children.filter(v=>v.checkAll);
                console.log(secondCheckList);
                // if(secondCheckList.length === item.children.length){
                //      item.firstCheckAll = true;
                // }else{
                //       item.firstCheckAll = false;
                // }
                item.firstCheckAll =  secondCheckList.length === item.children.length;
                item.isIndeterminate =  secondCheckList.length < item.children.length &&  secondCheckList.length>0;
                // if(secondCheckList.length === 3)

                
            },
            // 点击按钮 单选
            handleCheckedCitiesChange(item,second){
                // console.log(second);
                // let arr = second.checkedList.map(v=>v.id);
                if(typeof item.isIndeterminate === 'undefined'){
                    this.$set(item,'isIndeterminate',false);
                }
                if(typeof item.firstCheckAll === 'undefined'){
                    this.$set(item,'firstCheckAll',true);
                }
                if(typeof second.isIndeterminate === 'undefined'){
                    this.$set(second,'isIndeterminate',false);
                }
                if(typeof second.checkedList === 'undefined'){
                    this.$set(second,'checkedList',[]);
                }
                if(typeof second.checkAll === 'undefined'){
                    this.$set(second,'checkAll',true);
                }
                // second.checkedList = arr;
                let buttonCheckListLength = second.checkedList.length;  // 小按钮勾选的长度
                second.checkAll = second.buttonList.length === buttonCheckListLength;
                // console.log(buttonCheckListLength ,second.buttonList.length);
                second.isIndeterminate  = buttonCheckListLength > 0 && second.buttonList.length > buttonCheckListLength;
                // console.log(second);
                // // 判断所有勾选 或者  半选
                // let secondCheckList = item.children.filter(v=>v.checkAll);  //子类勾选
                // let secondIsIndeterminate = item.children.some(v=>v.isIndeterminate);  //子类半选
                // // console.log(secondCheckList);
                // item.firstCheckAll =  secondCheckList.length === item.children.length;  
                // console.log(secondCheckList<item.children.length)
                // console.log(secondCheckList.length,item.children.length);
                // let flag = secondCheckList.length < item.children.length && secondCheckList.length>0;
                // item.isIndeterminate =  secondIsIndeterminate || flag;
                // 所有勾选子按钮的长度
                let checkLList = item.children.map(v=>v.checkedList.length);   
                let checkLListLength = checkLList.reduce((preValue, curValue) => 
                    preValue + curValue
                )
                // 所有子按钮的长度
                let buttonList = item.children.map(v=>v.buttonList.length); 
                let buttonListLentgh = buttonList.reduce((preValue, curValue) => 
                    preValue + curValue
                ) 
                // 判断所有勾选
                item.firstCheckAll = checkLListLength === buttonListLentgh;
                item.isIndeterminate  = checkLListLength>0 && checkLListLength<buttonListLentgh
            }
            
        }
    }
</script>
<style scoped lang="scss">
.list2{
//   min-height: 300px;
  height: 100%;
  width: 100%;
  position: relative;
    .list2_fixed{
        width: 100%;
        position:absolute;
        top: 0;
        bottom: 0;   
        overflow-y: auto;
        &::-webkit-scrollbar{
            display:none;
        }
    }
}

.role-table {
  border: 1px solid #e0e0e0;
  border-bottom: none;
  padding: 0;
  position: relative;
}

.header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e7e7e7;
  background: #F8F8F9;
  text-align: center;
}

.vertical-line {
  width: 1px;
  height: 100%;
  background: #ddd;
  position: absolute;
  left: 40%;
  top: 0
}

.left {
  width: 40%;
  float: left;
  padding-left: 10px;
  user-select: none;
  cursor: pointer;
}

.one {
  padding-left: 20px;
}

.right {
  width: 60%;
  float: left;
  padding-left: 10px;
}

.item-icon {
  margin-left: -5px;
  padding: 5px;
}

.line {
  clear: both;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}

.h40 {
  /*height: 43px;*/
  line-height: 39px;
}

[v-cloak] {
  display: none;
}
</style>