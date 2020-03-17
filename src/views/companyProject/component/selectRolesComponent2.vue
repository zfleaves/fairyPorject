<template>
    <div class="selectRolesComponent2">
         <el-table
            border
            ref="multipleTable6"
            @selection-change="handleSelectionChange6"
            :data="selectRolesTableData"
            style="width: 100%">
            <el-table-column
            type="index"
            label="序号"
            width="60">
            </el-table-column>
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="rolesName"
            show-overflow-tooltip
            label="岗位名称">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" plain @click="selectRolesCancel6">取 消</el-button>
            <el-button type="primary" @click="selectRolesSubmit6">确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'',
    props:{
        selectRolesTableData:{
            type:Array,
            default:()=>[]
        },
        selectArr:{
            type:Array,
            default:()=>[]
        },
    },
    mounted(){
        this.$nextTick(function () {
          for (var i = 0; i < this.selectRolesTableData.length; i++) {
            for (let j = 0; j < this.selectArr.length; j++) {
              if (this.selectRolesTableData[i].rolesName === this.selectArr[j]) {
                this.$refs.multipleTable6.toggleRowSelection(this.selectRolesTableData[i]);
               
              }
            }
          }
        })
    },
    methods:{
        handleSelectionChange6(val){
            this.$emit('handleSelectionChange6',val)
        },
        selectRolesCancel6(){
            this.$emit('selectRolesCancel6')
        },
        selectRolesSubmit6(){
            this.$emit('selectRolesSubmit6')
        }
    }
}
</script>
<style lang="scss" scoped>

</style>