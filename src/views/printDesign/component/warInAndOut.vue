<template>
  <div class="warInAndOut">
    <div class="BTN">
      <el-button @click="Preservation" size="small" icon="el-icon-check" type="primary">保存</el-button>
    </div>
    <div class="warInAndOutCon">
      <div class="left">
        <div class="leftTop">
          <span class="title">打印字段设置</span>
          <el-button style="margin-top: 4px;" class="btn" size="small" icon="el-icon-check" type="primary">恢复默认
          </el-button>
        </div>
        <div class="leftMain">
          <p class="biaoti">表头</p>
          <div>
            <el-table :data="printMainList" stripe border style="width: 100%">
              <el-table-column
                prop="taskName"
                width="50"
                label="选中">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.flag">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column type="index" label="排序" width="80">
              </el-table-column>
              <el-table-column prop="columnName" label="名称">
              </el-table-column>
              <el-table-column prop="status" label="属性">
                <template slot-scope="scope">
                  <span>{{scope.row.status | setStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="columnValue" label="值">
              </el-table-column>
            </el-table>
          </div>
          <p class="biaoti">主数据<span>(保存后可拖拽排序)</span></p>
          <div>
            <el-table class="printHeadTable" :data="processList" stripe border style="width: 100%">
              <el-table-column
                prop="taskName"
                width="50"
                label="选中">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.flag">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                type="index" label="排序" width="80"></el-table-column>
              <el-table-column show-overflow-tooltip prop="columnName" label="名称">
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="scope">
                  <span>{{scope.row.status | setStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnValue" label="值">
              </el-table-column>
            </el-table>
          </div>
          <p class="biaoti">明细数据<span>(保存后可拖拽排序)</span></p>
          <div>
            <el-table class="printListTable" :data="list" stripe border style="width: 100%">
              <el-table-column
                prop="taskName"
                width="50"
                label="选中">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.flag">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column type="index" label="排序" width="80">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnName" label="名称">
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="scope">
                  <span>{{scope.row.status | setStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnValue" label="值">
              </el-table-column>
            </el-table>
          </div>
          <p class="biaoti">表尾<span>(保存后可拖拽排序)</span><span class="icons" @click="addBottomTable"><i
            class="el-icon-plus"></i></span><span @click="deletBottomTable" class="icons"><i class="el-icon-delete"></i></span>
          </p>
          <div>
            <el-table @row-click='handleChangeRole'
                      :row-class-name="tableRowClassName" class="printBottomTable" :data="printBottomList" stripe border
                      style="width: 100%">
              <el-table-column
                prop="taskName"
                width="50"
                label="选中">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.flag" @change="handleSetFlag(scope.row,$event)">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column type="index" label="排序" width="80">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnName" label="名称">
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="scope">
                  <span>{{scope.row.status | setStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnValue" label="值">
              </el-table-column>
            </el-table>
          </div>
          <p class="biaoti">底部<span>(保存后可拖拽排序)</span></p>
          <div>
            <el-table class="printFooterTable" :data="printFooterList" stripe border style="width: 100%">
              <el-table-column
                prop="taskName"
                width="50"
                label="选中">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.flag">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column type="index" label="排序" width="80">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnName" label="名称">
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="scope">
                  <span>{{scope.row.status | setStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="columnValue" label="值">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="rightTop">
          <span class="title">效果预览</span>
        </div>
        <div class="print-content">
          <h4
            v-show="item.flag"
            :style="h4Style" style="line-height: 32px;"
            v-for="(item,index) in printMainList" :key="index">
            {{item.columnValue}}
          </h4>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col
              style="margin: 5px 0;"
              v-show="item.flag" :span="item.width"
              v-for="(item,index) in processList" :key="index">
              <p :style="pStyle">{{item.columnName}}： <span style="font-size: 14px;font-weight: normal;">{{item.columnValue}}</span>
              </p>
            </el-col>
          </el-row>

          <div class="tableCons">
            <table border=0 cellSpacing=0 cellPadding=0 width="100%"
                   style="border-collapse:collapse;">
              <thead>
              <tr>
                <td :style="tableTdStyle" style="width: 5%;">序号</td>
                <!--:style="width: 10%"-->
                <td
                  :style="{width: item.width}"
                  v-show="item.flag" style="padding: 10px 0;text-align: center;border: 1px solid rgb(51, 51, 51);"
                  v-for="(item,index) in list" :key="index">
                  {{item.columnName}}
                </td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(row,i) in tableData" :key="i">
                <td :style="tableTdStyle">{{i+1}}</td>
                <td
                  v-show="item.flag" :style="tableTdStyle"
                  v-for="(item,index) in list" :key="index">
                  {{row[item.columnCode]}}
                </td>
              </tr>
              </tbody>
              <tfoot class="table-footer" :style="tableConsStyle" style="padding: 0 30px;border: 0 !important;">
              <tr>
                <th :style="tableTdStyle1" :colspan="list.length+1">
                  <h3
                    v-show="item.flag"
                    :style="h3Style1"
                    v-for="(item,index) in printBottomList" :key="index">
                    {{item.columnName}}：
                    <img :src="item.url" :style="signPicStyle" v-if="item.url">
                    <!-- <span
                      style="font-size: 14px;font-weight: normal;font-family: 宋体">{{item.columnValue}}</span> -->
                  </h3>
                </th>
              </tr>
              <tr>
                <th :style="tableTdStyle1" :colspan="list.length+1">
                  <h3
                    v-show="item.flag"
                    :style="h3Style2"
                    v-for="(item,index) in printFooterList" :key="index">
                        <span
                          v-if="item.columnCode==='page'"
                          style="font-size: 14px;font-weight: normal;">
                          <span tdata="pageNO">第#页</span>
                          <span>/</span>
                          <span tdata="pageCount">总#页</span>
                        </span>
                    <span v-else
                          style="font-size: 14px;font-weight: normal;">{{item.columnName}}：{{item.columnValue}}
                        </span>
                  </h3>
                </th>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog width="400px" title="添加表尾字段" :visible.sync="dialogFormVisibleFoot">
      <FootComponent @Determines="Determine" @cancelFoot="cancelFoot"></FootComponent>
    </el-dialog>
  </div>
</template>

<script>
  import Auth from 'util/auth'
  import {printTemplate} from 'mixins'
  import {
    getInandoutInfo,
    getProjectWarehouseList
  } from 'api/warehouseManagement/straightForward/straightForwardSet'

  export default {
    name: 'warInAndOut',
    mixins: [printTemplate],
    data() {
      return {
        printMainList: [
          {
            flag: true,
            defaultFlag: true,
            columnName: "公司名称",
            columnCode: "companyFullName",
            columnValue: Auth.hasUserInfo().companyFullName,
            status: 0
          },
          {
            flag: true,
            defaultFlag: true,
            columnName: "单据标题",
            columnCode: "title",
            columnValue: '直进直出单',
            status: 0
          },
        ],
        processList: [
          {
            id: 1,
            flag: true,
            defaultFlag: true,
            columnName: "项目名称",
            columnCode: "projectName",
            columnValue: '<项目名称>',
            status: 0,
            width: 24
          },
          {
            id: 2,
            flag: false,
            defaultFlag: false,
            columnName: "项目经理",
            columnCode: "pmName",
            columnValue: '<项目经理>',
            status: 0,
            width: 8
          },
          {
            id: 3,
            flag: false,
            defaultFlag: false,
            columnName: "项目编号",
            columnCode: "pmCode",
            columnValue: '<项目编号>',
            status: 0,
            width: 8
          },
          {
            id: 4,
            defaultFlag: true,
            flag: true,
            columnName: "仓库",
            columnCode: "warehouseId",
            columnValue: '<仓库>',
            status: 0,
            width: 8,
            type: 'select'
          },
          {
            id: 5,
            defaultFlag: true,
            flag: true,
            columnName: "供应商名称",
            columnCode: "supplierName",
            columnValue: '<供应商名称>',
            status: 0,
            width: 8
          },
          {
            id: 6,
            defaultFlag: true,
            flag: true,
            columnName: "登记日期",
            columnCode: "inandoutTime",
            columnValue: '<登记日期>',
            status: 0,
            width: 8,
            type: 'time'
          },
          {
            id: 7,
            defaultFlag: true,
            flag: true,
            columnName: "申请人",
            columnCode: "createByName",
            columnValue: '<申请人>',
            status: 0,
            width: 8
          },
          {
            id: 8,
            defaultFlag: false,
            flag: false,
            columnName: "备注",
            columnCode: "remarks",
            columnValue: '<备注>',
            status: 0,
            width: 24
          },
        ],
        list: [
          // {
          //   id: 1,
          //   flag: true,
          //   defaultFlag: true,
          //   columnName: "物资分类",
          //   columnCode: "classifyName",
          //   columnValue: '<物资分类>',
          //   status: 0,
          //   width: '10%'
          // },
          {
            id: 2,
            flag: true,
            defaultFlag: true,
            columnName: "物资名称",
            columnCode: "materialName",
            columnValue: '<物资名称>',
            status: 0,
            width: '10%'
          },
          {
            id: 3,
            flag: true,
            defaultFlag: true,
            columnName: "物资编号",
            columnCode: "materialCode",
            columnValue: '<物资编号>',
            status: 0,
            width: '10%'
          },
          {
            id: 4,
            defaultFlag: true,
            flag: true,
            columnName: "规格",
            columnCode: "standards",
            columnValue: '<规格>',
            status: 0,
            width: '10%'
          },
          {
            id: 5,
            defaultFlag: true,
            flag: true,
            columnName: "单位",
            columnCode: "unit",
            columnValue: '<单位>',
            status: 0,
            width: '5%'
          },
          {
            id: 6,
            flag: true,
            defaultFlag: true,
            columnName: "已入库数量",
            columnCode: "quantityInNum",
            columnValue: '<已入库数量>',
            status: 0,
            width: '5%'
          },
          {
            id: 7,
            flag: true,
            defaultFlag: true,
            columnName: "到货验收/供货订单数量",
            columnCode: "checkNum",
            columnValue: '<到货验收/供货订单数量>',
            status: 0,
            width: '10%'
          },
          {
            id: 8,
            defaultFlag: true,
            flag: true,
            columnName: "直进直出数量",
            columnCode: "quantityIn",
            columnValue: '<直进直出数量>',
            status: 0,
            width: '10%'
          },
          {
            id: 9,
            defaultFlag: true,
            flag: true,
            columnName: "单价(元)",
            columnCode: "averagePrice",
            columnValue: '<单价(元)>',
            status: 0,
            width: '5%',
            type: 'money'
          },
          {
            id: 10,
            defaultFlag: true,
            flag: true, columnName: "金额(元)", columnCode: "totalPrice",
            columnValue: '<金额(元)>', status: 0, width: '10%', type: 'money'
          },
          {
            id: 11,
            defaultFlag: true,
            flag: true, columnName: "税率(%)", columnCode: "taxRate",
            columnValue: '<税率(%)>', status: 0, width: '5%', type: 'taxRate'
          },
          {
            id: 12,
            defaultFlag: true,
            flag: true, columnName: "税额（元）", columnCode: "ratePrice",
            columnValue: '<税额（元）>', status: 0, width: '5%'
          },
          {
            id: 13,
            defaultFlag: false,
            flag: false, columnName: "生产厂家或品牌", columnCode: "manufacturer",
            columnValue: '<生产厂家或品牌>', status: 0, width: '10%'
          },
          {
            id: 14,
            defaultFlag: false,
            flag: false, columnName: "备注", columnCode: "remarks", columnValue: '<备注>', status: 0, width: '10%'
          },
        ],
        printBottomList: [],
      }
    },

    methods: {
      _getInandoutInfo() {
        getInandoutInfo(this.id).then(res => {
          let results = res.results;
          this.setMainInfo(results);
          this.setDetailList(results.details);
          let projectId = res.results.projectId;
          this._getProjectWarehouseList(projectId)
          // this.processList =
          // results.
        });
      },
      //获取仓库名称
      _getProjectWarehouseList(val) {
        getProjectWarehouseList(val).then(res => {
          console.log(res.results);
          this.warehouseList = res.results;
          console.log(this.warehouseList)
          console.log(this.processList)
          for (let i in this.processList) {
            let item = this.processList[i];
            if (item.columnCode === 'warehouseId') {
              let id = item.columnValue ; //136
              item.columnValue = this.setWarehouseItem(this.warehouseList, id);
            }
          }
        })
      },
      setWarehouseItem(arr, id) {
        for (let i in arr) {
          let item = arr[i];
          if (item.id === id) {
            return item.warehouseName
          }
        }
      }


    }

  }
</script>
<style scoped lang="scss">
  .warInAndOut {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 10px;
    .BTN {
      text-align: right;
    }
    .warInAndOutCon {
      display: flex;
      height: calc(100% - 40px);
      overflow: hidden;
      .left {
        width: 450px;
        border: 1px #eee solid;
        padding: 0 5px;
        height: 100%;
        .leftTop {
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px #eee solid;
          padding: 0 2px;
          .title {
            float: left;
          }
          .btn {
            float: right;
          }
        }
        .leftMain {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          ::-webkit-scrollbar {
            display: none;
          }
          .biaoti {
            font-size: 18px;
            font-weight: 600;
            padding: 5px 0;
            span {
              margin-left: 10px;
              font-weight: 400;
              font-size: 16px;
              color: #aaa;
            }
            .icons {
              width: 15px;
              height: 15px;
              background-color: #3e75ff;
              display: inline-block;
              border-radius: 50%;
              color: #fff;
              position: relative;
              i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 10px;
                color: #fff;
              }
            }
          }
        }

      }
      .right {
        flex: 1;
        border: 1px #eee solid;
        padding: 0 5px;
        height: 100%;
        margin-left: 10px;
        .rightTop {
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px #eee solid;
          padding: 0 2px;
          .title {
            float: left;
          }
        }
      }
    }
  }
</style>
