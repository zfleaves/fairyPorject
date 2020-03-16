<template>
    <div class="selectRoles">
        <el-table
            border
            ref="multipleTable"
            @selection-change="handleSelectionChange"
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
            <el-button type="danger" plain @click="selectRolesCancel">取 消</el-button>
            <el-button type="primary" @click="selectRolesSubmit">确 定</el-button>
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
        selectRolesArr:{
            type:Array,
            default:()=>[]
        }
       
    },
    data(){
        return{

        }
    },
    mounted(){
        this.$nextTick(function () {
            for (var i = 0; i < this.selectRolesTableData.length; i++) {
                for (let j = 0; j < this.selectRolesArr.length; j++) {
                    if (this.selectRolesTableData[i].rolesName == this.selectRolesArr[j]) {
                        this.$refs.multipleTable.toggleRowSelection(this.selectRolesTableData[i]);
                    
                    }
                }
            }
            })
    },
    methods:{
        handleSelectionChange(val) {
            this.$emit('sendMultipleSelection',val)
        },
        //点击取 消
        selectRolesCancel(){
            this.$emit('selectRolesCancel')
        },
        //点击确 定
        selectRolesSubmit(){
            this.$emit('selectRolesSubmit')
        }
    }
    
}
</script>
<style lang="scss" scoped>

</style>