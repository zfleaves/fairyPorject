<template>
  <div class="test">
    <el-form label-width="120px" :label-position="labelPosition" ref="form" :model="projectForm">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="流程状态">
            <el-select
              size="small" clearable
              placeholder="请选择流程状态"
              v-model="projectForm.flowStatus">
              <el-option v-for="(item,index) in flowStatusList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="季度需求">
            <el-select
              size="small" clearable
              placeholder="请选择季度需求"
              v-model="projectForm.seasonStatus">
              <el-option v-for="(item,index) in seasonStatusList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购供应方式">
            <el-select
              size="small" clearable
              placeholder="请选择采购供应方式"
              v-model="projectForm.curementStatus">
              <el-option v-for="(item,index) in curementStatusList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {dataDictionary} from 'mixins'

  export default {
    name: 'test',
    mixins: [dataDictionary],
    data() {
      return {
        projectForm: {
          flowStatus: '',
          seasonStatus: '',
          curementStatus: ''
        },
        arr: ['flowStatus', 'seasonStatus', 'curementStatus'],
        labelPosition: 'right',
      }
    },
    created() {
      console.log(this.arr)
      this._getDicdataList(this.arr);
      console.log(this.aa)

    }
  }
</script>
<style scoped lang="scss">

</style>
