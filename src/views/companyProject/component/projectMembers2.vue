<template>
    <div class="projectMembers2">
        <el-table
        border
        close-on-click-modal="false"
        :data="multipleSelection5"
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

          prop="roles"
          label="选择岗位">
          <template slot-scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.rolesArr"
              closable
              :disable-transitions="false"
              @close="handleCloseTag5(scope.row,tag)">
              {{tag}}
            </el-tag>
            <el-button size="small" @click="selectRoles5(scope.$index,scope.row.rolesArr)"
                       icon="el-icon-plus">
            </el-button>
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
        <el-table-column
          v-if="isFlag"
          width="200"
          prop=""
          label="操作">
          <template slot-scope="scope">
            <span style="color:red" @click="handelClickDelet5(scope.$index,scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="selectRolesCancel5">取 消</el-button>
        <el-button type="primary" @click="selectRolesSubmit5">确 定</el-button>
      </div>
    </div>
</template>
<script>
export default {
    name:"",
    props:{
      multipleSelection5:{
        type:Array,
        default:()=>[]
      },
      isFlag:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      handleCloseTag5(row, item) {
        // console.log(arr)
        let index = row.rolesArr.findIndex(v => v === item)
        if (index >= 0) {
          row.rolesArr.splice(index, 1)
        }
        let userName = row.userName
        row.userName = "123"
        row.userName = userName
        // console.log(arr)

      },
      selectRolesCancel5(){
        this.$emit('selectRolesCancel5')
      },
      //选择岗位
      selectRoles5(index, arr) {
        // console.log(index)
        // console.log(arr)
        let data = {
          index,arr
        }
        this.$emit('sendSelectRoles5',data)
       
      
        
        // this.$refs.multipleTable.clearSelection();


      },
      selectRolesSubmit5(){
        this.$emit('selectRolesSubmit5')
      },
      //成员选择岗位删除
      handelClickDelet5(index, item) {
        this.$emit('handelClickDelet5',index)
      
      },
    }
}
</script>
<style lang="scss" scoped>

</style>