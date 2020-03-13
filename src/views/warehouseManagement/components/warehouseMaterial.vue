<template>
  <div class="alertCons">
    <div class="detailListInner">
      <div style="height: 40px;line-height: 40px;">
        <span style="color:#65c6ec;">物资编码库</span>
        <el-button style="float:right;margin-top:5px;" size="small" type="warning" icon="el-icon-search">查询
        </el-button>
      </div>
      <div class="detailListTable">
        <div class="detailListTable_fix">
          <div class="detailListTableHeader">
            <span class="MaterialClassification">物资分类</span>
            <span class="MaterialCoding">物资编码</span>
            <span class="MaterialName">物资名称</span>
            <span class="MaterialUnit">单位</span>
            <span class="Specifications">规格</span>
          </div>
          <el-tree
            ref="tree"
            :props="props"
            :load="loadNode"
            :empty-text="emptyText"
            highlight-current
            node-key="id"
            @node-click="nodeClick"
            :default-checked-keys="[defaultCheckId]"
            :default-expanded-keys="[defaultCheckId]"
            @check-change="checkClick"
            :data="treeData" lazy
            show-checkbox>
            <div style="display:flex;"
                 class="custom-tree-node" slot-scope="{node}">
              <el-tooltip style="flex:3" effect="dark" :content="node.data.name || node.data.classifyName"
                          placement="top">
              <span class="tree-heater" :style="node.data.levels == 2 ? 'padding-left: 18px': ''">
                  {{node.data.name || node.data.classifyName}}
              </span>
              </el-tooltip>
              <span v-if="node.levels !== 1" class="MaterialCoding">{{node.data.materialCode}}</span>
              <span v-if="node.levels !== 1" class="MaterialName">{{node.data.materialName}}</span>
              <span v-if="node.levels !== 1" class="MaterialUnit">{{node.data.unit}}</span>
              <span v-if="node.levels !== 1" class="Specifications">{{node.data.standard}}</span>
            </div>
          </el-tree>
        </div>
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
          :data="selectListTables"
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
          <el-table-column prop="standard" label="规格">
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="55">
          </el-table-column>
          <el-table-column prop="dataSources" label="已申请">
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
  import {getMaterialList, getDetailList} from '../../../api/warehouseManagement/straightForward/straightForwardSet'
  import Auth from 'util/auth'

  export default {
    name: "warehouseMaterial",
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        emptyText: '努力加载中...',
        treeData: [],
        selectListTables: [],
        defaultCheckId: '',
        judgeList: [],
      }
    },
    props: {
      tableSele: {
        type: Array,
        // default: []
        default: () => []
      },
    },
    created() {
      this._getMaterialList();
    },
    mounted() {
      this.selectListTables = JSON.parse(JSON.stringify(this.tableSele));
    },
    methods: {
      _getMaterialList() {
        getMaterialList().then(res => {
          // console.log(res.results);
          this.treeData = res.results;
          // console.log(this.treeData)
        })
      },
      //点击树形菜单
      nodeClick(event) {
        // console.log(event);
        this.nodeEvent = event;
        // console.log(this.nodeEvent)
      },
      //节点懒加载
      loadNode(node, resolve) {
        if (node.level === 0) {
          // console.log(JSON.stringify(node) )
          // console.log(this.treeData)
          return resolve(this.treeData);
        } else {
          let children = node.data.children && node.data.children.length ? node.data.children : [];
          let data = {
            classifyName: "",
            companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
            id: node.data.id,
            materialName: "",
            pageNo: 0,
            pageSize: 0,
            standards: ""
          }
          getDetailList(data).then(res => {
            // console.log(res)
            this.treeChildrenList = res.results.conMaterialDetailDto;
            if (this.treeChildrenList.length > 0) {
              this.treeChildrenList.forEach(item => {
                item.leaf = true;
              })
              this.selectListTables.forEach(item => {
                this.treeChildrenList.forEach(val => {
                  if (val.materialCode === item.materialCode) {
                    let tag = {id: val.id, label: val};
                    this.judgeList.push(tag);
                  }
                });
              });
              this.$nextTick(() => {
                if (this.judgeList.length > 0) {
                  this.$refs.tree.setCheckedNodes(this.judgeList);
                }
              })
              this.treeChildrenList = this.treeChildrenList.concat(children);
              return resolve(this.treeChildrenList);
            } else {
              return resolve(children);
            }
          })
        }
      },
      checkClick(event, flag) {
        if (event.levels !== 1 && event.levels !== 2) {
          // console.log(event);
          if (flag) {
            let index = this.selectListTables.findIndex(v => v.materialCode === event.materialCode);
            if (index < 0) {
              this.selectListTables.push(event)
            }
          } else {
            let index = this.selectListTables.findIndex(v => v.materialCode === event.materialCode);
            if (index >= 0) {
              this.selectListTables.splice(index, 1)
            }
          }

        }
      },
      // 确定提交
      submitModal() {
        let checkTableData = JSON.parse(JSON.stringify(this.selectListTables));
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
        tableDataSele.forEach(item => {
          item.averagePrice = item.averagePrice || 0;
          item.checkNum = item.checkNum || 0;
          item.demType = item.demType || '';
          item.docCodeFrom = item.docCodeFrom || '';
          item.eId = item.eId ? item.eId : item.id;
          item.inCount = item.inCount || 0;
          item.manufacturer = item.manufacturer || "";
          item.model = item.model || "";
          item.quality = item.quality || "";
          item.quantityIn = item.quantityIn || 0;
          item.ratePrice = item.ratePrice || 0;
          item.remarks = item.remarks || "";
          item.taxRate = item.taxRate || 0;
          item.totalPrice = item.totalPrice || 0;
        })
        console.log(tableDataSele);
        this.$emit('tableData', tableDataSele);
        this.cancelModal();
      },
      // 关闭弹窗
      cancelModal() {
        this.$emit('cancelModal');
      },
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
        position: relative;
        z-index: 9999999;
        overflow: hidden;
        .detailListTable_fix {
          position: absolute;
          top: 0;
          width: 100%;
          bottom: 0;
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .detailListTableHeader {
          display: flex !important;
          .MaterialClassification {
            flex: 3 !important;
          }
          .MaterialCoding {
            flex: 1 !important;
          }
          .MaterialName {
            flex: 1 !important;
          }
          .MaterialUnit {
            flex: 1 !important;
          }
          .Specifications {
            flex: 1 !important;
          }

        }
      }
    }
  }
</style>
