
<template>
  <div class="WarehouseReport">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="treeCon">
          <p class="firstLevel">报表分类</p>
          <div v-for="(item,index) in reportClassification" :key="index">
            <p class="twoLevel">{{item.name}}</p>
            <ul class="threeLevel">
              <li
                @click="handClickLi(child.id)"
                :class="child.id === curenIndex ? 'active' : ''"
                v-for="(child,j) in item.children"
                :key="j"
              >{{child.name}}</li>
            </ul>
          </div>
        </div>
      </el-col>

      <el-col :span="20">
        <div class="rightCon">
          <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="公司名称">
                  <el-select
                    clearable
                    placeholder="请选择公司名称"
                    @change="changeHandelSearch()"
                    v-model="searchForm.orgId"
                  >
                    <el-option
                      v-for="item in permissionOrgs"
                      :key="item.id"
                      :label="item.orgName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="项目名称">
                  <el-select
                    clearable
                    placeholder="请选择项目名称"
                    @change="changeHandelSearch()"
                    v-model="searchForm.projectId"
                  >
                    <el-option
                      v-for="item in companyProject"
                      :key="item.id"
                      :label="item.proName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="仓库名称">
                  <el-input clearable placeholder="请输入仓库名称" v-model="searchForm.warName"></el-input>
                </el-form-item>
              </el-col>
              <el-col style="text-align:right;" :span="9">
                <el-button @click="changeHandelSearch()" type="warning">生成报表</el-button>
                <el-button
                  @click="handleMoreSearch"
                  type="primary"
                  plain
                >{{moreSearch? '收起条件':'更多条件'}}</el-button>
                <el-button @click="handleExport" type="primary" plain>导出</el-button>
              </el-col>
            </el-row>
            <el-row v-if="moreSearch">
              <el-col :span="5">
                <el-form-item label="项目经理">
                  <el-input clearable placeholder="请输入项目经理" v-model="searchForm.projectManager"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="发生日期">
                  <el-date-picker
                    @change="changeHandelSearch()"
                    clearable
                    v-model="startDate"
                    type="daterange"
                    value-format="yyyy-MM-dd 00:00:00"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="moreSearch">
              <el-col :span="5">
                <el-form-item label="物资编码">
                  <el-input placeholder="请输入物资编码" clearable v-model="searchForm.materialCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="物资名称">
                  <el-input placeholder="请输入物资名称" clearable v-model="searchForm.materialName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            v-if="summariesFlag"
            :span-method="objectSpanMethod"
            :summary-method="getSummaries"
            :show-summary="reportWarWarDetail.length>=0"
            :data="reportWarWarDetail"
            id="tableId"
            style="width: 100%"
            >
            <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
            <el-table-column
              v-for="item in fixedHeaderTitleClone"
              :key="item.id"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              v-for="childs in dynamicHeaderTitle"
              :key="childs.id"
              :label="childs.label"
              :prop="childs.prop"
              show-overflow-tooltip
            >
              <el-table-column
                v-for="child in childs.children"
                :key="child.id"
                :width="child.width"
                :prop="child.prop"
                :label="child.label"
                show-overflow-tooltip
              >
                <!-- <template slot-scope="scope">
                        <span>{{setRow(scope.row,child.prop)}}</span>
                </template>-->
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-table
            v-else

            :data="reportWarWarDetail"
            id="tableId"
            style="width: 100%"
            >
            <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
            <el-table-column
              v-for="item in fixedHeaderTitleClone"
              :key="item.id"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              v-for="childs in dynamicHeaderTitle"
              :key="childs.id"
              :label="childs.label"
              :prop="childs.prop"
              show-overflow-tooltip
            >
              <el-table-column
                v-for="child in childs.children"
                :key="child.id"
                :width="child.width"
                :prop="child.prop"
                :label="child.label"
                show-overflow-tooltip
              >
                <!-- <template slot-scope="scope">
                        <span>{{setRow(scope.row,child.prop)}}</span>
                </template>-->
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getCompanyProject,
  getPermissionOrgs,
  getReportWarWarDetail,
  getReportWarInDown,
  getReportWarWarOutDetail
} from "api/statisticalManagement";
import { toQfw, formatYear } from "util";
export default {
  name: "WarehouseReport",
  data() {
    return {
      moreSearch: "更多条件",
      companyProject: [],
      permissionOrgs: [],
      startDate: [],
      reportWarWarDetail: [],
      curenIndex: 11,
      summariesFlag: false,
      reportClassification: [
        {
          id: 1,
          name: "库存查询",
          children: [
            { id: 11, name: "仓库库存明细报表" },
            { id: 12, name: "收发存明细报表(汇总)" },
            { id: 13, name: "收发存明细报表(按领料单位)" },
            { id: 14, name: "收发存明细报表(按使用部位)" }
          ]
        },
        {
          id: 2,
          name: "入库查询",
          children: [
            { id: 21, name: "入库明细汇总报表" },
            { id: 22, name: "入库单明细报表" },
            { id: 23, name: "直进直出明细报表" },
            { id: 24, name: "领料返库明细报表" },
            { id: 25, name: "调入明细报表" },
            { id: 26, name: "归还明细报表" }
          ]
        },
        {
          id: 3,
          name: "出库查询",
          children: [
            { id: 31, name: "出库明细汇总报表" },
            { id: 32, name: "直进直出明细报表" },
            { id: 33, name: "领料出库明细报表" },
            { id: 34, name: "借出明细报表" },
            { id: 35, name: "调出明细报表" },
            { id: 36, name: "退货明细报表" },
            { id: 37, name: "报损明细报表" }
          ]
        },
        {
          id: 4,
          name: "其他查询",
          children: [
            { id: 41, name: "到货明细报表" },
            { id: 42, name: "盘点明细报表" }
          ]
        }
      ],
      reportWarInDown: [],
      reportWarWarOutDetail: [],
      //   HeaderTitle:[],
      searchForm: {
        allotionName: "",
        borrowName: "",
        classfyCode: "",
        classfyLevel: "",
        classfyName: "",
        dateFrom: null,
        dateTo: null,
        dealer: "",
        inventoryUser: "",
        lossUser: "",
        materialCode: "",
        materialName: "",
        operateBy: "",
        orgId: "",
        orgName: "",
        pageNo: 0,
        pageSize: 0,
        period: "",
        placeName: "",
        projectId: "",
        projectManager: "",
        projectName: "",
        receiveBy: "",
        receiveUnit: "",
        supperName: "",
        uintId: "",
        usePlaceId: "",
        warManager: "",
        warName: ""
      },
      fixedHeaderTitle: [
        { id: 1, label: "公司名称", prop: "orgName" },
        { id: 2, label: "项目名称", prop: "projectName" },
        { id: 3, label: "仓库名称", prop: "warName" },
        { id: 4, label: "物资名称", prop: "materialName" },
        { id: 5, label: "物资编号", prop: "materialCode" },
        { id: 6, label: "规格", prop: "standard" },
        { id: 7, label: "单位", prop: "unit" }
      ],
      fixedHeaderTitleClone: [],
      dynamicHeaderTitle: [],
      //   仓库库存明细表
      dynamicHeaderTitle1: [
        {
          id: 8,
          label: "累计入库",
          prop: "aa",
          children: [
            {
              id: 81,
              label: "数量",
              prop: "cumulativeStorageNum",
              width: "100"
            },
            {
              id: 82,
              label: "金额(含税)",
              prop: "cumulativeStorageAmount",
              width: "100"
            }
          ]
        },
        {
          id: 9,
          label: "累计出库",
          prop: "bb",
          children: [
            {
              id: 91,
              label: "数量",
              prop: "cumulativeOutboundNum",
              width: "100"
            },
            {
              id: 92,
              label: "金额(含税)",
              prop: "cumulativeOutboundAmount",
              width: "100"
            }
          ]
        },
        {
          id: 10,
          label: "库存余量",
          prop: "bb",
          children: [
            {
              id: 101,
              label: "数量",
              prop: "inventoryBalanceNum",
              width: "100"
            },
            {
              id: 102,
              label: "暂估平均价",
              prop: "inventoryBalanceAverage",
              width: "100"
            },
            {
              id: 103,
              label: "金额(含税)",
              prop: "inventoryBalanceNumAmount",
              width: "100"
            }
          ]
        }
      ],
      dynamicHeaderTitle2: [
        {
          id: 8,
          label: "期初库存",
          prop: "bb",
          children: [
            {
              id: 81,
              label: "数量",
              prop: "inventoryBalanceNum",
              width: "100"
            },
            {
              id: 82,
              label: "暂估平均价",
              prop: "inventoryBalanceAverage",
              width: "100"
            },
            {
              id: 83,
              label: "金额(含税)",
              prop: "inventoryBalanceNumAmount",
              width: "100"
            }
          ]
        },
        {
          id: 9,
          label: "累计入库",
          prop: "aa",
          children: [
            {
              id: 91,
              label: "数量",
              prop: "cumulativeStorageNum",
              width: "100"
            },
            {
              id: 92,
              label: "金额(含税)",
              prop: "cumulativeStorageAmount",
              width: "100"
            }
          ]
        },
        {
          id: 10,
          label: "累计出库",
          prop: "cc",
          children: [
            {
              id: 101,
              label: "数量",
              prop: "cumulativeOutboundNum",
              width: "100"
            },
            {
              id: 102,
              label: "金额(含税)",
              prop: "cumulativeOutboundAmount",
              width: "100"
            }
          ]
        }
      ],
      dynamicHeaderTitle3: [
        {
          id: 1,
          label: "项目名称",
          prop: "projectName"
        },
        {
          id: 2,
          label: "物资名称",
          prop: "materialName"
        },
        {
          id: 3,
          label: "供应商名称",
          prop: "supplierName"
        },
        {
          id: 4,
          label: "物资分类",
          prop: "classifyName"
        },
        {
          id: 5,
          label: "物资编码",
          prop: "materialCode"
        },
        {
          id: 6,
          label: "仓库名称",
          prop: "warName"
        },
        {
          id: 7,
          label: "规格",
          prop: "standard"
        },
        {
          id: 8,
          label: "单位",
          prop: "unit"
        },
        {
          id: 9,
          label: "入库数量",
          prop: "warInNum"
        },
        {
          id: 10,
          label: "入库金额",
          prop: "totalAmount"
        },

        {
          id: 11,
          label: "发生日期",
          prop: "creatTime"
        }
      ],
      dynamicHeaderTitle4: [
        {
          id: 8,
          label: "累计出库数量",
          prop: "outReturnNumAll"
        }
      ]
    };
  },
  created() {
    this._getPermissionOrgs();
    this._getCompanyProject();
    this._getReportWarWarDetail(this.getWarehouseDetails1)
    // this.HeaderTitle = this.fixedHeaderTitle.concat(this.dynamicHeaderTitle)
  },
  methods: {
    //切换搜索条件
    changeHandelSearch(){
        if (this.curenIndex === 11) {
          this._getReportWarWarDetail(this.getWarehouseDetails1)

        } else if (this.curenIndex === 12) {
          this._getReportWarWarDetail(this.getWarehouseDetails2)
        } else if (this.curenIndex === 22) {
          this._getReportWarInDown();
        } else if (this.curenIndex === 31) {
          this._getReportWarWarOutDetail();
        }
    },
    //获取项目名称
    _getCompanyProject() {
      getCompanyProject().then(res => {
        this.companyProject = res.results;
      });
    },
    //公司名称
    _getPermissionOrgs() {
      getPermissionOrgs().then(res => {
        this.permissionOrgs = res.results;
      });
    },
    //搜索更多
    handleMoreSearch() {
      this.moreSearch = !this.moreSearch;
    },
    //仓库库存明细报表生成报表
    _getReportWarWarDetail(callback) {

      let index = this.permissionOrgs.findIndex(
        v => v.id === this.searchForm.orgId
      );
      if (index >= 0) {
        this.searchForm.orgName = this.permissionOrgs[index].orgName;
      }
      if (this.startDate && this.startDate.length) {
        this.searchForm.dateFrom = this.startDate[0] || null;
        this.searchForm.dateTo = this.startDate[1] || null;
      }else{
         this.searchForm.dateFrom =  null;
        this.searchForm.dateTo =  null;
      }
       let data = {
        ...this.searchForm
      };
      getReportWarWarDetail(data).then(res => {
        this.WarehouseDetails = JSON.parse(
          JSON.stringify(res.results.warCommonDto)
        );

        callback()
        // this.handClickLi(this.curenIndex);
        // this.getWarehouseDetails()
        // this.getWarehouseDetails()
      });
    },
    //生成入库单明细报表
    _getReportWarInDown() {
      if (this.startDate && this.startDate.length) {
        this.searchForm.dateFrom = this.startDate[0] || null;
        this.searchForm.dateTo = this.startDate[1] || null;
      }else{
         this.searchForm.dateFrom =  null;
        this.searchForm.dateTo =  null;
      }
      let data = {
        classifyCode: "",
        classifyLevels: 0,
        classifyName: "",
        creatTimeFrom: this.searchForm.dateFrom,
        creatTimeTo: this.searchForm.dateTo,
        inDescript: "",
        materialCode: this.searchForm.materialCode,
        materialName: this.searchForm.materialName,
        orgId: this.searchForm.orgId,
        pageNo: 0,
        pageSize: 0,
        projectId: this.searchForm.projectId,
        projectManager: this.searchForm.projectManager,
        supplierName: "",
        warName: this.searchForm.warName
      };
      getReportWarInDown(data).then(res => {
        this.reportWarInDown = JSON.parse(JSON.stringify(res.results));
        // this.handClickLi(this.curenIndex)
        this.getWarehouseDetails3();
      });
    },
    //出库明细汇总表
    _getReportWarWarOutDetail() {
      if (this.startDate && this.startDate.length) {
        this.searchForm.dateFrom = this.startDate[0] || null;
        this.searchForm.dateTo = this.startDate[1] || null;
      }else{
        this.searchForm.dateFrom =  null;
        this.searchForm.dateTo =  null;
      }
      let data = {
        allotionName: "",
        borrowName: "",
        classifyCode: "",
        classifyLevels: 0,
        classifyName: "",
        creatTimeFrom: this.searchForm.dateFrom,
        creatTimeTo: this.searchForm.dateTo,
        dealer: "",
        inventoryUser: "",
        lossUser: "",
        materialCode: this.searchForm.materialCode,
        materialName: this.searchForm.materialName,
        orgId: this.searchForm.orgId,
        pageNo: 0,
        pageSize: 0,
        period: "",
        projectId: this.searchForm.projectId,
        projectManager: this.searchForm.projectManager,
        supplierName: "",
        uintId: 0,
        unitUserName: "",
        usePlaceId: 0,
        warManager: "",
        warName: this.searchForm.warName
      };
      getReportWarWarOutDetail(data).then(res => {
        this.reportWarWarOutDetail = res.results;
        this.getWarehouseDetails4();
      });
    },
    // 导出
    handleExport() {},
    //点击左侧书结构
    handClickLi(index) {
      this.curenIndex = index;
      if (this.curenIndex === 11) {
        this._getReportWarWarDetail(this.getWarehouseDetails1)

      } else if (this.curenIndex === 12) {
        this._getReportWarWarDetail(this.getWarehouseDetails2)
      } else if (this.curenIndex === 22) {
        this._getReportWarInDown();
      } else if (this.curenIndex === 31) {
        this._getReportWarWarOutDetail();
      }
    },
    // 仓库库存明细报表
    getWarehouseDetails1() {
      this.fixedHeaderTitleClone = JSON.parse(
        JSON.stringify(this.fixedHeaderTitle)
      );
      this.dynamicHeaderTitle = this.dynamicHeaderTitle1;
      this.WarehouseDetails.forEach(v => {
        v.cumulativeStorageNum =
          v.inAllotNum +
          v.inBorrowNum +
          v.inDirectNum +
          v.inGdNum +
          v.inReturnNum;
        v.cumulativeStorageAmount = toQfw(v.cumulativeStorageNum * v.warPrice);
        v.cumulativeOutboundNum =
          v.outAllotNum +
          v.outBorrowNum +
          v.outDirectNum +
          v.outDoNum +
          v.outLossNum +
          v.outReturnNum;
        v.cumulativeOutboundAmount = toQfw(
          v.cumulativeOutboundNum * v.warPrice
        );
        v.inventoryBalanceNum =
          v.cumulativeStorageNum - v.cumulativeOutboundNum;
        v.inventoryBalanceAverage = v.warPrice;
        v.inventoryBalanceNumAmount = toQfw(
          v.cumulativeStorageNum * v.warPrice -
            v.cumulativeOutboundNum * v.warPrice
        );
      });
      this.reportWarWarDetail = this.WarehouseDetails;
      // this.getSpanArr()
      this.summariesFlag = false;
    },
    // 收发存明细报表(汇总)
    getWarehouseDetails2() {
      this.fixedHeaderTitleClone = JSON.parse(
        JSON.stringify(this.fixedHeaderTitle)
      );
      this.dynamicHeaderTitle = this.dynamicHeaderTitle2;
      this.WarehouseDetails.forEach(v => {
        v.cumulativeStorageNum =
          v.inAllotNum +
          v.inBorrowNum +
          v.inDirectNum +
          v.inGdNum +
          v.inReturnNum;
        v.cumulativeStorageAmount = toQfw(v.cumulativeStorageNum * v.warPrice);

        v.cumulativeOutboundNum =
          v.outAllotNum +
          v.outBorrowNum +
          v.outDirectNum +
          v.outDoNum +
          v.outLossNum +
          v.outReturnNum;
        v.cumulativeOutboundAmount = toQfw(
          v.cumulativeOutboundNum * v.warPrice
        );

        v.inventoryBalanceNum = v.warPreNum;
        v.inventoryBalanceAverage = v.warPrePrice ? v.warPrePrice : 0;
        v.inventoryBalanceNumAmount = toQfw(v.warPreNum * v.warPrice);
      });
      this.reportWarWarDetail = this.WarehouseDetails;
      this.summariesFlag = false;
    },
    // 入库单明细报表
    getWarehouseDetails3() {
      this.fixedHeaderTitleClone = [];
      this.dynamicHeaderTitle = this.dynamicHeaderTitle3;
      console.log(this.dynamicHeaderTitle)
      this.reportWarInDown.forEach(v => {
        v.creatTime = formatYear(v.creatTime);
      });
      this.reportWarWarDetail = this.reportWarInDown;
      this.getSpanArr(this.reportWarWarDetail, "projectName");
      this.getSpanArr(this.reportWarWarDetail, "materialName");
      this.summariesFlag = true;
    },
    // //出库明细汇总表
    getWarehouseDetails4() {
      this.fixedHeaderTitleClone = this.fixedHeaderTitle;
      this.dynamicHeaderTitle = this.dynamicHeaderTitle4;
      this.reportWarWarOutDetail.forEach(v => {
        v.outReturnNumAll =
          v.outAllotNum +
          v.outBorrowNum +
          v.outDirectNum +
          v.outDoNum +
          v.outLossNum +
          v.outReturnNum;
      });
      this.reportWarWarDetail = this.reportWarWarOutDetail;
      this.getSpanArr(this.reportWarWarDetail, "projectName");
      this.getSpanArr(this.reportWarWarDetail, "materialName");
      this.summariesFlag = false;
    },
    // 获取多少换行
    getSpanArr(data, key, target) {
      this.pos = 0;
      this.spanArr = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i][key] === data[i - 1][key]) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      } else if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    //表尾合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = data.length+1;
          return;
        }
        if (index === 1) {
          sums[index] = "合计金额";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        console.log(column.property);
        if (column.property === "totalAmount") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getSummariesClone(param) {
      return;
    }
  }
};
</script>
<style scoped lang="scss">
.WarehouseReport {
  padding: 20px 10px;
  background: #fff;
  .treeCon {
    padding: 10px 0 10px 10px;
    font-size: 14px;
    border: 1px #ddd solid;
    .firstLevel {
      color: #333;
      font-weight: 600;
    }
    .twoLevel {
      color: #333;
      padding-left: 10px;
      font-weight: 600;
      margin: 10px 0;
    }
    .threeLevel {
      padding-left: 25px;
      li {
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.active {
          background-color: #409eff;
          color: #eee;
        }
      }
    }
  }
  .rightCon {
    padding: 20px 10px;
    border: 1px #ddd solid;
  }
}
</style>
