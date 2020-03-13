<template>
  <div class="alertCons">
    <div class="detailListInner">
      <div style="height: 40px;line-height: 40px;">
        <span style="color:#65c6ec;">物资编码库</span>
      </div>
      <div class="detailListTable">
        <el-table
          class="ListTableLeft"
          max-height="360"
          ref="inventoryDetailsdata"
          :data="inventoryDetailsdata"
          tooltip-effect="dark"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :header-cell-style="{'background-color': '#fafafa'}"
          stripe border>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="物资分类" prop="classifyName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="物资编码" prop="materialCode" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="materialName" label="物资名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="standards" label="规格">
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="55">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="selectListInner">
      <div style="height: 40px;line-height: 40px;">
        <span style="color:#65c6ec;">已选择物资</span>
      </div>
      <div class="selectListTable">
        <el-table
          class="ListTable"
          max-height="360"
          ref="selectListTable"
          :data="rightSelectListTable"
          tooltip-effect="dark"
          :header-cell-style="{'background-color': '#fafafa'}"
          stripe border>
          <el-table-column type="index" label="序号" width="55">
          </el-table-column>
          <el-table-column label="物资分类" prop="classifyName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="物资名称" prop="materialName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="materialCode" label="物资编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="standards" label="规格">
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="55">
          </el-table-column>
        </el-table>
        <div class="Tablebtn">
          <el-button size="small" @click="cancelModal" style="margin-right:10px;" type="danger"
                     icon="el-icon-circle-check" plain>取消
          </el-button>
          <el-button
            @click="submitModal"
            size="small" type="primary" icon="el-icon-circle-check">确定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getOutboundSetMaterialList} from 'api/warehouseManagement/outbound'
  import Auth from 'util/auth'

  export default {
    name: "outboundSetMaterial",
    data() {
      return {
        inventoryDetailsdata: [],
        rightSelectListTable: [],
        leftselectTableList: []
      }
    },
    props: {
      tableSele: {
        type: Array,
        // default: []
        default: () => []
      },
      warehouseId: {
        type: Number,
        default: -1
      }
    },
    mounted() {
      this._getOutboundSetMaterialList();
      this.rightSelectListTable = JSON.parse(JSON.stringify(this.tableSele));
    },
    methods: {
      //获得物资编码表
      _getOutboundSetMaterialList() {
        getOutboundSetMaterialList(this.warehouseId).then(res => {
          this.inventoryDetailsdata = res.results;
          this.$nextTick(()=>{   // dom 节点加载完毕后执行
            for (let i in this.tableSele) {
              let item = this.tableSele[i];
              let index = this.inventoryDetailsdata.findIndex(v => v.materialCode === item.materialCode);
              if (index >= 0) {
                console.log(this.inventoryDetailsdata[index]);
                this.$refs.inventoryDetailsdata.toggleRowSelection(this.inventoryDetailsdata[index]);
              }
            }
          })
        })
      },
      // 确定提交
      submitModal() {
        let checkTableData = JSON.parse(JSON.stringify(this.rightSelectListTable));
        console.log(checkTableData);
        let tableDataSele = [];
        for (let i in checkTableData) {
          let item = checkTableData[i];
          let index = this.tableSele.findIndex(v => v.materialCode === item.materialCode);
          if (index >= 0) {
            tableDataSele.push(this.tableSele[index]);
          } else {
            tableDataSele.push(item);
          }
        }
        for (let i in tableDataSele) {
          let item = tableDataSele[i];
          item.eId = item.eId || item.id;
          item.docCodeFrom = item.docCodeFrom || '';
          item.quantityOut = item.quantityOut || 0;
          item.remarks = item.remarks || "";
          item.purpose = item.purpose || '';
        }
        console.log(tableDataSele);
        this.$emit('tableData', tableDataSele);
        this.cancelModal();
      },
      // 关闭弹窗
      cancelModal() {
        this.$emit('cancelModal');
      },
      //选择物资
      handleSelectionChange(val) {
        this.rightSelectListTable = val;
      },
      rowClick(row) {
        this.$refs.inventoryDetailsdata.toggleRowSelection(row);
      }
    }
  }
</script>

<style scoped lang='scss'>
  .alertCons {
    width: 100%;
    /*height: auto;*/
    height: 460px;
    display: flex;
    .selectListInner {
      height: 100%;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      .selectListTable {
        flex: 1;
        /*display: flex;*/
        /*flex-direction: column;*/
        overflow: hidden;
        .ListTable {
          flex: 1;
          height: 360px;
          /*max-height: calc(100% - 60px);*/
        }
        .Tablebtn {
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
    .detailListInner {
      height: 100%;
      width: 100%;
      flex: 1;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      .detailListTable {
        flex: 1;
        overflow: hidden;
        .ListTableLeft {
          height: calc(100% - 60px);
        }

      }
    }
  }
</style>
