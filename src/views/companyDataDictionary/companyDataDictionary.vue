<template>
  <div class="companyDataDictionary">
    <div class="searchCon">
      <el-form :label-position="labelPosition" ref="searchFormObj" :model="searchFormObj" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="字段类别">
              <el-select clearable @change="handleSearch" size="small" v-model="searchFormObj.dicType" placeholder="请选择所属字段类别">
                <el-option label="可扩展字段" value="02"></el-option>
                <el-option label="系统字段" value="01"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字段名称">
              <el-input  clearable size="small" v-model="searchFormObj.dicName"
                         @keyup.enter.native="handleSearch"
                         placeholder="请输入字段名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="6" :span="2" style="margin-top: 5px;">
            <el-button @click="handleSearch" size="small" type="warning" icon="el-icon-search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="resultCon">
      <div class="resultConLeft">
        <el-table
          :data="sysDataDictionaryList"
          :row-class-name="tableRowClassName"
          border
          @row-click="rowClick"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            label="字段类别">
            <template slot-scope="scope">
              <span>{{scope.row.dicType | setDicType }}</span>
            </template>

          </el-table-column>
          <el-table-column
            prop="dicName"
            label="字段名称">
          </el-table-column>
          <el-table-column
            prop="dicBusiness"
            label="所属业务功能">
            <template slot-scope="scope">
              <span>{{scope.row.dicBusiness | setDicBusiness }}</span>
            </template>

          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="resultConRight">
        <el-row style="padding-right:7%;height:70px;line-height:70px;">
          <el-col style="margin-top: 5px;" :offset="22" :span="2">
            <el-button size="small" @click="addDataItems" type="primary" icon="el-icon-plus">添加</el-button>
          </el-col>
        </el-row>

        <el-table
          :data="DetailListArr"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="dataName"
            label="数据项"
            width="180">
          </el-table-column>
          <el-table-column
            prop="dataCode"
            label="数据项编号">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注">
            <template slot-scope="scope">
              <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClickEditer(scope.row)" type="text" size="small" style="color:#66beff;">修改
              </el-button>
              <el-button type="text" size="small" style="color:red;">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <rigth-modal v-if="rightModalShow" class="rightModal">
      <div slot="header">添加数据项</div>
      <div slot="body">
        <el-form :rules="rules" :label-position="labelPosition" ref="rightModalObj" :model="rightModalObj"
                 label-width="100px">
          <el-form-item label="所属字段">
            <el-input size="small" v-model="rightModalObj.dicId" placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item label="数据项名称" prop="dataName">
            <el-input size="small" v-model="rightModalObj.dataName" placeholder="请输入数据项名称"></el-input>
          </el-form-item>
          <el-form-item label="数据项编号" prop="dataCode">
            <el-input size="small" v-model="rightModalObj.dataCode" placeholder="请输入数据项编号"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number size="small" placeholder="sss" v-model="rightModalObj.sorts" controls-position="right"
                             @change="handleChange" :min="1" :max="10"></el-input-number>

          </el-form-item>
          <el-form-item label="备注信息">
            <el-input size="small" type="textarea" v-model="rightModalObj.remarks" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" type="danger" @click="cancel" plain icon="el-icon-circle-check">取消</el-button>
        <el-button size="small" @click="Preservation('rightModalObj')" type="primary" icon="el-icon-circle-check">保存
        </el-button>
      </div>
    </rigth-modal>
  </div>
</template>
<script>

  import {
    getSysdatadicList,
    getCondatadicDetailList,
    saveCondatadicDetail
  } from 'api/companyDataDictionary/companyDataDictionary'
  import RigthModal from 'components/rightModal/rightModal'

  export default {
    name: "companyDataDictionary",
    components: {
      RigthModal
    },
    data() {
      return {
        labelPosition: 'right',
        searchFormObj: {
          dataCode: "",
          dataName: "",
          dicBusiness: "",
          dicName: "",
          dicType: ""
        },
        pageNo: 1,
        pageSize: 8,
        total: 0,
        sysDataDictionaryList: [],
        DetailListArr: [],
        rightModalShow: false,
        rightModalObj: {
          sorts: 1,
          remarks: '',
          dataCode: '',
          dataName: '',
          // companyId: 297
          // createBy: 485
          // dicId: 12
          // updateBy: 485

        },
        rules: {
          dataName: [
            {required: true, message: '请输入数据项名称', trigger: 'blur'},
          ],
          dataCode: [
            {required: true, message: '请输入数据项编号', trigger: 'blur'}
          ],
        },
        currentIndex:''


      }
    },
    created() {
      this._getSysdatadicList();
    },
    methods: {
      //条件分页查询数据字典记录
      _getSysdatadicList() {
        let data = {
          ...this.searchFormObj,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getSysdatadicList(data).then(res => {
          this.total = res.results.total;
          this.sysDataDictionaryList = res.results.sysDataDictionaryList;
          if (this.sysDataDictionaryList && this.sysDataDictionaryList.length > 0) {
            let id = this.sysDataDictionaryList[0].id;
            this.currentIndex = id;
            this._getCondatadicDetailList(id);
          }

        })
      },
      //字典主键关联查询数据项记录
      _getCondatadicDetailList(id) {
        getCondatadicDetailList(id).then(res => {
          this.DetailListArr = res.results;
        })
      },
      //点击表格每一行
      rowClick(row) {
        console.log(row);
        this._getCondatadicDetailList(row.id);
        this.currentIndex = row.id;
      },
      //行高亮显示
      tableRowClassName({row, rowIndex}) {
        if (row.id === this.currentIndex) {
          return 'active';
        } else {
          return '';
        }
      },
      //搜索
      handleSearch() {
        this._getSysdatadicList();
      },
      //修改
      handleClickEditer() {

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      //添加
      addDataItems() {
        this.rightModalShow = true;
      },
      //保存
      Preservation(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._saveCondatadicDetail()
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //取消
      cancel() {
        this.rightModalShow = false;
      },
      //新增数据项记录
      _saveCondatadicDetail() {
        let data = {
          ...this.rightModalObj

        }
        saveCondatadicDetail(data).then(res => {
          if (res.results === 1) {
            this._getCondatadicDetailList()
          }
        })
      },
      //切换弹窗排序时
      handleChange() {

      },


    },
    filters: {
      setDicType(val) {
        let arr = ['', '系统字段', '可扩展字段'];
        return val ? arr[Number(val)] : '';
      },
      setDicBusiness(val) {
        let arr = ['系统管理', '企业管理', '业务管理'];
        return val ? arr[Number(val) - 1] : '';
      }
    }
  }
</script>
<style scoped lang="scss">
  .companyDataDictionary {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 10px 20px;
    .searchCon {
      height: 80px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      margin-bottom: 10px;
      .el-row {
        padding: 15px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .resultCon {
      flex: 1;
      display: flex;
      .resultConLeft {
        flex: 1;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        margin-right: 5px;
        padding: 0 10px;
        padding-top: 70px;

        .pagination {
          padding: 20px;
          text-align: center;
        }

      }
      .resultConRight {
        flex: 1.5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        margin-left: 5px;
        padding: 0 10px;
      }
    }
    .rightModal {
      .el-input-number {
        width: 100%;
      }
    }
  }
</style>


