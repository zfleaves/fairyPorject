
<template>
  <div class="WarehouseReport">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="treeCon">
          <p class="firstLevel">报表分类</p>
          <div v-for="(item,index) in reportClassification" :key="index">
                <p class="twoLevel">{{item.name}}</p>
                <ul class="threeLevel">
                    <li @click="handClickLi(child.id)" :class="child.id === curenIndex ? 'active' : ''" v-for="(child,j) in item.children" :key="j">{{child.name}}</li>
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
                    @change="_getReportWarWarDetail()"
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
                    @change="_getReportWarWarDetail()"
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
                <el-button @click="_getReportWarWarDetail()" type="warning">生成报表</el-button>
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
          <el-table :data="reportWarWarDetail" id="tableId" style="width: 100%">
            <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
            <el-table-column v-for="item in fixedHeaderTitle" :key="item.id" :prop="item.prop" :label="item.label" show-overflow-tooltip></el-table-column>
            <el-table-column v-for="childs in dynamicHeaderTitle" :key="childs.id" :label="childs.label">
              <el-table-column   v-for="child in childs.children" :key="child.id"  :width="child.width" :prop="child.prop" :label="child.label">
                    <!-- <template slot-scope="scope">
                        <span>{{setRow(scope.row,child.prop)}}</span>
                    </template> -->
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
  getReportWarWarDetail
} from "api/statisticalManagement";
import {toQfw} from 'util'
export default {
  name: "WarehouseReport",
  data() {
    return {
      moreSearch: "更多条件",
      companyProject: [],
      permissionOrgs: [],
      startDate: [],
      reportWarWarDetail: [],
      curenIndex:11,
      reportClassification:[
          {
              id:1,
              name:'库存查询',
              children:[
                  {id:11,name:"仓库库存明细报表"},
                  {id:12,name:"收发存明细报表(汇总)"},
                  {id:13,name:"收发存明细报表(按领料单位)"},
                  {id:14,name:"收发存明细报表(按使用部位)"},
              ]
          },
          {
              id:2,
              name:'入库查询',
              children:[
                  {id:21,name:"入库明细汇总报表"},
                  {id:22,name:"入库单明细报表"},
                  {id:23,name:"直进直出明细报表"},
                  {id:24,name:"领料返库明细报表"},
                  {id:25,name:"调入明细报表"},
                  {id:26,name:"归还明细报表"},
              ]
          },
          {
              id:3,
              name:'出库查询',
              children:[
                  {id:31,name:"出库明细汇总报表"},
                  {id:32,name:"直进直出明细报表"},
                  {id:33,name:"领料出库明细报表"},
                  {id:34,name:"借出明细报表"},
                  {id:32,name:"调出明细报表"},
                  {id:33,name:"退货明细报表"},
                  {id:34,name:"报损明细报表"},
              ]
          },
          {
              id:4,
              name:'其他查询',
              children:[
                  {id:41,name:"到货明细报表"},
                  {id:42,name:"盘点明细报表"},
              ]
          }
      ],
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
      fixedHeaderTitle:[
          {id:1,label:'公司名称',prop:"orgName"},
          {id:2,label:'项目名称',prop:"projectName"},
          {id:3,label:'仓库名称',prop:"warName"},
          {id:4,label:'物资名称',prop:"materialName"},
          {id:5,label:'物资编号',prop:"materialCode"},
          {id:6,label:'规格',prop:"standard"},
          {id:7,label:'单位',prop:"unit"}
      ],
      dynamicHeaderTitle:[],
    //   仓库库存明细表
      dynamicHeaderTitle1:[
          {
              id:8,
              label:'累计入库',
              prop:"aa",
              children:[
                 {id:81,label:'数量',prop:"cumulativeStorageNum",width:'100'},
                 {id:82,label:'金额(含税)',prop:"cumulativeStorageAmount",width:'100'},
              ]
          },
          {
              id:9,
              label:'累计出库',
              prop:"bb",
              children:[
                 {id:91,label:'数量',prop:"cumulativeOutboundNum",width:'100'},
                 {id:92,label:'金额(含税)',prop:"cumulativeOutboundAmount",width:'100'},
              ]
          },{
              id:10,
              label:'库存余量',
              prop:"bb",
              children:[
                 {id:101,label:'数量',prop:"inventoryBalanceNum",width:'100'},
                 {id:102,label:'暂估平均价',prop:"inventoryBalanceAverage",width:'100'},
                 {id:103,label:'金额(含税)',prop:"inventoryBalanceNumAmount",width:'100'},
              ]
          }
      ],
      dynamicHeaderTitle2:[
          {
              id:8,
              label:'期初库存',
              prop:"bb",
              children:[
                 {id:81,label:'数量',prop:"inventoryBalanceNum",width:'100'},
                 {id:82,label:'暂估平均价',prop:"inventoryBalanceAverage",width:'100'},
                 {id:83,label:'金额(含税)',prop:"inventoryBalanceNumAmount",width:'100'},
              ]
          },
          {
              id:9,
              label:'累计入库',
              prop:"aa",
              children:[
                 {id:91,label:'数量',prop:"cumulativeStorageNum",width:'100'},
                 {id:92,label:'金额(含税)',prop:"cumulativeStorageAmount",width:'100'},
              ]
          },
          {
              id:10,
              label:'累计出库',
              prop:"cc",
              children:[
                 {id:101,label:'数量',prop:"cumulativeOutboundNum",width:'100'},
                 {id:102,label:'金额(含税)',prop:"cumulativeOutboundAmount",width:'100'},
              ]
          },
      ],
    };
  },
  created() {
    this._getPermissionOrgs();
    this._getCompanyProject();
    // this.HeaderTitle = this.fixedHeaderTitle.concat(this.dynamicHeaderTitle)
  },
  methods: {
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
    //生成报表
    _getReportWarWarDetail() {
      let data = {
        ...this.searchForm
      };
      let index = this.permissionOrgs.findIndex(
        v => v.id === this.searchForm.orgId
      );
      if (index >= 0) {
        this.searchForm.orgName = this.permissionOrgs[index].orgName;
      }
      if (this.startDate && this.startDate.length) {
        this.dateFrom = this.startDate[0] || null;
        this.dateTo = this.startDate[1] || null;
      }
      getReportWarWarDetail(data).then(res => {
        this.WarehouseDetails = JSON.parse(JSON.stringify(res.results.warCommonDto))
        this.handClickLi(this.curenIndex)
        // this.getWarehouseDetails()
        // this.getWarehouseDetails()
        
      });
    },
    // 导出
    handleExport() {},
    handClickLi(index){
        this.curenIndex = index
        if(this.curenIndex === 11){
            // this.dynamicHeaderTitle = this.dynamicHeaderTitle1
            this.getWarehouseDetails1()
        }else if(this.curenIndex === 12){
            //  this.dynamicHeaderTitle = this.dynamicHeaderTitle2
             this.getWarehouseDetails2()
        }
    },
    // 仓库库存明细报表
    getWarehouseDetails1(){
        this.dynamicHeaderTitle = this.dynamicHeaderTitle1
        this.WarehouseDetails.forEach(v=>{
            v.cumulativeStorageNum =  v.inAllotNum + v.inBorrowNum + v.inDirectNum + v.inGdNum + v.inReturnNum
            v.cumulativeStorageAmount =  toQfw(v.cumulativeStorageNum * v.warPrice)
            v.cumulativeOutboundNum =  v.outAllotNum + v.outBorrowNum + v.outDirectNum + v.outDoNum + v.outLossNum + v.outReturnNum
            v.cumulativeOutboundAmount =  toQfw(v.cumulativeOutboundNum * v.warPrice)
            v.inventoryBalanceNum =  v.cumulativeStorageNum - v.cumulativeOutboundNum
            v.inventoryBalanceAverage =  v.warPrice
            v.inventoryBalanceNumAmount = toQfw(v.cumulativeStorageNum * v.warPrice - v.cumulativeOutboundNum * v.warPrice)
        })
        this.reportWarWarDetail = this.WarehouseDetails
    },
    // 收发存明细报表(汇总)
    getWarehouseDetails2(){
        this.dynamicHeaderTitle = this.dynamicHeaderTitle2
        this.WarehouseDetails.forEach(v=>{
            v.cumulativeStorageNum =  v.inAllotNum + v.inBorrowNum + v.inDirectNum + v.inGdNum + v.inReturnNum
            v.cumulativeStorageAmount =  toQfw(v.cumulativeStorageNum * v.warPrice)

            v.cumulativeOutboundNum =  v.outAllotNum + v.outBorrowNum + v.outDirectNum + v.outDoNum + v.outLossNum + v.outReturnNum
            v.cumulativeOutboundAmount =  toQfw(v.cumulativeOutboundNum * v.warPrice)

            v.inventoryBalanceNum =  v.warPreNum
            v.inventoryBalanceAverage =  v.warPrePrice ? v.warPrePrice : 0
            v.inventoryBalanceNumAmount = toQfw(v.warPreNum * v.warPrice)
            
        })
        this.reportWarWarDetail = this.WarehouseDetails
    },
    
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
  .rightCon{
    padding: 20px 10px;
    border: 1px #ddd solid;
  }
}
</style>