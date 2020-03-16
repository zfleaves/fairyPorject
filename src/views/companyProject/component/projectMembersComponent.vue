<template>
    <div class="projectMembers">
         <el-table
            border
            :data="projectMembersTableData"
            style="width: 100%">
            <el-table-column
            type="index"
            label="序号"
            width="50">
            </el-table-column>
            <el-table-column
            prop="userName"
            label="姓名"
            show-overflow-tooltip
            width="80">
            </el-table-column>
            <el-table-column
            prop="userCode"
            width="100"
            show-overflow-tooltip
            label="电话">
            </el-table-column>
            <el-table-column

            prop="rolesNames"
            label="选择岗位">
            <template slot-scope="scope">

                <el-tag
                v-if="scope.row.rolesNames.length"
                :key="tag"
                v-for="tag in scope.row.rolesNames"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(scope.row.rolesNames,tag)">
                {{tag}}
                </el-tag>
                <el-button size="small" @click="selectRoles(scope.row.rolesNames)" icon="el-icon-plus"></el-button>
            </template>
            </el-table-column>
            <el-table-column
            width="200"
            prop="remarks"
            label="备注">
            <template slot-scope="scope">
                <el-input
                style="height:40px;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="scope.row.remarks">
                </el-input>
            </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" plain @click="projectMembersVisibleCancel">取 消</el-button>
            <el-button type="primary" @click="projectMembersVisibleSubmit">确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"",
    props:{
        projectMembersTableData:{
            type:Array,
            default:()=>[]
        },
        selectRolesTableData:{
            type:Array,
            default:()=>[]
        }
    },
    methods:{
        //选择岗位
        selectRoles(arr) {
            this.$emit('selectRoles',arr)
        },
        //删除
        handleCloseTag(arr, item) {
            // console.log(arr)
            let index = arr.findIndex(v => v === item)
            if (index >= 0) {
                arr.splice(index, 1)
            }

        },
        //点击取 消
        projectMembersVisibleCancel(){
            this.$emit('projectMembersVisibleCancel')
        },
        //点击确 定
        projectMembersVisibleSubmit(){
            this.$emit('projectMembersVisibleSubmit')
        }
    }
}
</script>
<style lang="scss" scoped>

</style>