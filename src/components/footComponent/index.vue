<template>
  <div class="footComponent">
    <el-form ref="footForm" :rules="rules" :model="footForm" label-width="100px">
      <el-form-item label="表尾名称" prop="columnName">
        <el-input v-model="footForm.columnName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="表尾值" prop="columnValue">
        <el-input v-model="footForm.columnValue" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="cancelFoot">取 消</el-button>
      <el-button type="danger" size="medium" plain @click="Determine('footForm')">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'footComponent',
    data() {
      return {
        rules: {
          columnName: [
            {required: true, message: '表尾字段名称不能为空', trigger: 'blur'}
          ],
        },
        footForm: {
          columnName: "",
          columnValue: '',
          status: 1,
          flag: true,
          columnCode: '',
          isAdd: 0,
        },
        footFormClone: {},
      }
    },

    created() {
      this.footFormClone = JSON.parse(JSON.stringify(this.footForm));
    },
    methods: {
      Determine(val) {
        this.$refs[val].validate((valid) => {
          if (valid) {
            this.$emit('Determines', this.footForm);
            this.footForm = JSON.parse(JSON.stringify(this.footFormClone));
          }
        })
      },
      cancelFoot() {
        this.footForm = JSON.parse(JSON.stringify(this.footFormClone));
        this.$emit('cancelFoot')
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
