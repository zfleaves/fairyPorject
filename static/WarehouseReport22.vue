<template>
    <div class="tableWarehouse">
        <el-table
            id="tableDataList"
            :data="cloneTableData"
            :span-method="objectSpanMethod"
            border
            ref="tableData"
            max-height="500"
            v-loading="loadingShow"
            :row-style="setStyle"
            element-loading-text="努力加载中..."
            stripe>
            <template slot="empty">
              <img class="data-pic" src="static/images/no-data.png" alt="">
            </template>
            <el-table-column type="index" label="序号" key="2" width="50"></el-table-column>
            <el-table-column v-for="item in cloneTableDataFrom" :key="item.name"
                            :prop="item.value" :label="item.name" :min-width="item.width"
                            >
                <el-table-column
                v-for="val in item.children" :key="val.name"
                :prop="val.value" :label="val.name" :min-width="val.width" >
                  <el-table-column
                  v-for="unit in val.children" :key="unit.name"
                  :prop="unit.value" :label="unit.name" :min-width="unit.width" >
                    <template slot-scope="scope">
                      {{setValue(val.value, unit.value, scope.row)}}
                    </template>
                  </el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {format, toQfw, reseveQfw} from "util";
import { exportExcelMethod } from 'util/exportExcel'
import {getWarDetail, getRecUnit, getUsePlace, reportWarExport, unitPlaceExport,
getWarOutDetail, getInOutWarDetail, getOutDownDetail, getBorrowDetail, getPurCheckTotal,
getAllotionDetail, getBackDetail, getLossDetail,
getInDown, getInAllotion, getInBack, getInReturn
} from 'api/statisticalManagement/WarehouseReport'
import {getList} from 'api/statisticalManagement/WarehouseStatistics'
export default {
    data() {
        return {
            cloneTableDataFrom: [

            ],
            cloneTableData: [],
            cloneWarOutDetailList: [],
            pos: 0,
            posTwo: 0,
            spanArrAll: {},
            spanArr: [],
            spanArrTwo: [],
            recUnitList: [],
            usePlaceList: [],
            cloneTableData1: [],
            rows: true,
            loading: true,
            cloneSearchFormOut: {},
            loadingShow: false,
            isSetStyle: false,
        }
    },
    props: {
        tableData: {
            type:  Array,
            default: () => []
        },
        tableDataFrom: {
            type:  Array,
            default: () => []
        },
        code:  {
            type:  String,
            default: 'InventoryDetails'
        },
        projectId: {
            default: 0
        },
        purCheckTotalDtoList: {
            type:  Array,
            default: () => []
        },
        inventoryAnalysisDtoList: {
            type:  Array,
            default: () => []
        },
        warOutDetailList: {
          type:  Array,
          default: () => []
        },
        tableDataListAll: {
            type:  Object,
            default: () => {}
        },
        searchFormOut: {
            type:  Object,
            default: () => {}
        },
        usePlace: {
          type:  Array,
          default: () => []
        },
        recUnit: {
          type:  Array,
          default: () => []
        },
    },
    mounted() {
        this.loadingShow = true;
        this.cloneTableDataFrom1 = JSON.parse(JSON.stringify(this.tableDataFrom));
        this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
        this.cloneTableData1 = JSON.parse(JSON.stringify(this.tableData));
        this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
        this.isSetStyle = false;
        this.judgeFormCode(this.code);
    },
    watch: {
        code() {
            this.loadingShow = true;
            this.cloneTableDataFrom1 = JSON.parse(JSON.stringify(this.tableDataFrom));
            this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
            this.cloneTableData1 = JSON.parse(JSON.stringify(this.tableData));
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.isSetStyle = false;
            this.judgeFormCode(this.code);
        },
        tableData: {
          handler(){
            this.loadingShow = true;
            this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
            this.cloneTableData1 = JSON.parse(JSON.stringify(this.tableData));
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.isSetStyle = false;
            this.judgeFormCode(this.code);
          },
          deep: true
        },
        warOutDetailList: {
          handler(){
            this.loadingShow = true;
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.judgeFormCode(this.code);
          },
          deep: true
        },
        projectId() {
          this.loadingShow = true;
          this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
          this.judgeFormCode(this.code)
        },
        searchFormOut: {
          handler(){
            this.loadingShow = true;
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.judgeFormCode(this.code);
          },
          deep:true
        },
        usePlace: {
          handler(){
            this.usePlaceList = this.usePlace;
            this.cloneTableDataFrom1 = JSON.parse(JSON.stringify(this.tableDataFrom));
            this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
            this.cloneTableData1 = JSON.parse(JSON.stringify(this.tableData));
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.isSetStyle = false;
            this.judgeFormCode(this.code);
          },
          deep:true
        },
        recUnit: {
          handler(){
            this.recUnitList = this.recUnit;
            this.cloneTableDataFrom1 = JSON.parse(JSON.stringify(this.tableDataFrom));
            this.cloneTableData = JSON.parse(JSON.stringify(this.tableData));
            this.cloneTableData1 = JSON.parse(JSON.stringify(this.tableData));
            this.cloneSearchFormOut = JSON.parse(JSON.stringify(this.searchFormOut));
            this.isSetStyle = false;
            this.judgeFormCode(this.code);
          },
          deep:true
        },
    },
    methods: {
      judgeFormCode(formCode) {
        const FromCodeList = [
          {name: 'InventoryDetails', callback: '_geInventoryDetails'},
          {name: 'receiveSummary', callback: '_geReceiveSummary'},
          {name: 'receiveUnit', callback: '_geReceiveUnit'},
          {name: 'receivePlace', callback: '_geReceivePlace'},
          {name: 'arrivalDetailed', callback: '_geArrivalDetailed'},
          {name: 'InventoryDetailed', callback: '_geInventoryDetailed'},
          {name: 'inSummary', callback: '_geInSummary'},
          {name: 'inDetailed', callback: '_geInDetailed'},
          {name: 'inOutDetailed', callback: '_geInOutDetailed'},
          {name: 'inUnitReturn', callback: '_geInUnitReturn'},
          {name: 'transferInDetailed', callback: '_geTransferInDetailed'},
          {name: 'returnDetailed', callback: '_geReturnDetailed'},
          {name: 'outSummary', callback: '_geOutSummary'},
          {name: 'OutDetailed', callback: '_geOutDetailed'},
          {name: 'outUnitReturn', callback: '_geOutUnitReturn'},
          {name: 'lendDetailed', callback: '_geLendDetailed'},
          {name: 'callOutDetailed', callback: '_geCallOutDetailed'},
          {name: 'returnGoodsDetailed', callback: '_geReturnGoodsDetailed'},
          {name: 'reportLossDetailed', callback: '_geReportLossDetailed'},
        ];
        let index = FromCodeList.findIndex(v => v.name === formCode);
        if (index >= 0) {
          this[FromCodeList[index].callback]();
          this.loadingShow = false;
        }else {
          this.loadingShow = false;
        }
      },
      // 获取领料单位
      async _getRecUnitList() {
        let id = this.projectId ? this.projectId : 0;
        await getRecUnit(id).then(res => {
          if(res.results) {
            this.recUnitList = res.results;
          } else {
            this.recUnitList = [];
          }
        })
      },
      // 获取工程
      async _getUsePlace() {
        let id = this.projectId ? this.projectId : 0;
        await getUsePlace(id).then(res => {
          if(res.results) {
            this.usePlaceList = res.results;
          } else {
            this.usePlaceList = [];
          }
        })
      },
      // 对应数据
      setValue(id, value, val) {
        if(typeof parseInt(id) === 'number') {
          let num = 0;
          if(value === 'CumulativeOut'){
            num =  val.CumulativeOut
          }
          if(value === 'CumulativeOutAmount'){
            num =  reseveQfw(val.CumulativeOutAmount)
          }
          if(value === 'totalNum') {
            let useNum = val.warUsePlaceDto.map(v => v.useNum);
            if(useNum.length === 0) {
              num =  0
            } else {
              num =  useNum.reduce(function(prep,curr,idx,arr){
                return prep+curr;
              });
            }
          }
          if(value === 'totalAmount') {
            let useAmount = val.warUsePlaceDto.map(v => v.useAmount);
            if(useAmount.length === 0) {
              num =  0
            } else {
              num =  useAmount.reduce(function(prep,curr,idx,arr){
                return prep+curr;
              });
            }
          }
          if(value === 'totalRecNum') {
            let recNum = val.warRecUnitDto.map(v => v.recNum);
            if(recNum.length === 0) {
              num =  0
            } else {
              num =  recNum.reduce(function(prep,curr,idx,arr){
                return prep+curr;
              });
            }
          }
          if(value === 'totalRecAmount') {
            let recAmount = val.warRecUnitDto.map(v => v.recAmount);
            if(recAmount.length === 0) {
              num =  0
            } else {
              num =  recAmount.reduce(function(prep,curr,idx,arr){
                return prep+curr;
              });
            }
          }
          if(value === 'recNum') {
            let index = val.warRecUnitDto.findIndex(v => v.unitId === parseInt(id));
            if (index >= 0) {
              num = val.warRecUnitDto[index].recNum;
            }
            return num
          }
          if(value === 'recAmount') {
            let index = val.warRecUnitDto.findIndex(v => v.unitId === parseInt(id));
            if (index >= 0) {
              num = val.warRecUnitDto[index].recAmount
            }
            return num
          }
          if(value === 'useNum') {
            let index = val.warUsePlaceDto.findIndex(v => v.placeId === parseInt(id));
            if (index >= 0) {
              num = val.warUsePlaceDto[index].useNum
            }
            return num
          }
          if(value === 'useAmount') {
            let index = val.warUsePlaceDto.findIndex(v => v.placeId === parseInt(id));
            if (index >= 0) {
              num = val.warUsePlaceDto[index].useAmount
            }
            return num
          }
          return num
        }
      },
      // 仓库库存明细报表
      _geInventoryDetails() {
          this.rows = true;
          let fromList = [
            {name: '累计入库', value: 'in', width: '',
            children: [
                {name: '数量', value: 'CumulativeIn', width: '80'},
                {name: '金额(含税)', value: 'CumulativeInAmount', width: '100'},
            ]},
            {name: '累计出库', value: 'out', width: '',
            children: [
                {name: '数量', value: 'CumulativeOut', width: '80'},
                {name: '金额(含税)', value: 'CumulativeOutAmount', width: '100'},
            ]},
            {name: '库存余量', value: 'odd', width: '',
            children: [
                {name: '数量', value: 'SurplusNum', width: '80'},
                {name: '暂估平均价', value: 'warPrice', width: '100'},
                {name: '金额(含税)', value: 'SurplusAmount', width: '100'},
            ]},
          ];
          this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
          this.cloneTableData1.forEach(item => {
              item.CumulativeIn = item.inDirectNum + item.inGdNum + item.inReturnNum + item.inAllotNum + item.inBorrowNum;
              item.CumulativeInAmount = toQfw(item.CumulativeIn * item.warPrice);
              item.CumulativeOut = item.outDoNum + item.outReturnNum + item.outAllotNum + item.outBorrowNum + item.outLossNum + item.outDirectNum;
              item.CumulativeOutAmount = toQfw(item.CumulativeOut * item.warPrice);

              item.SurplusNum = item.CumulativeIn - item.CumulativeOut;
              item.SurplusAmount = toQfw(reseveQfw(item.CumulativeInAmount) - reseveQfw(item.CumulativeOutAmount));
          })
          this.cloneTableData = this.cloneTableData1;
          this.getSpanArr(this.cloneTableData)
      },
      // 收发存明细报表(汇总)
      _geReceiveSummary() {
        this.rows = true;
        let fromList = [
            {name: '期初库存', value: 'EarlyStage', width: '',
            children: [
                {name: '数量', value: 'warPreNum', width: '80'},
                {name: '暂估平均价', value: 'warPrePrice', width: '100'},
                {name: '金额(含税)', value: 'warPreAmount', width: '100'},
            ]},
            {name: '累计入库', value: 'in', width: '',
            children: [
                {name: '数量', value: 'CumulativeIn', width: '80'},
                {name: '金额(含税)', value: 'CumulativeInAmount', width: '100'},
            ]},
            {name: '累计出库', value: 'out', width: '',
            children: [
                {name: '数量', value: 'CumulativeOut', width: '80'},
                {name: '金额(含税)', value: 'CumulativeOutAmount', width: '100'},
            ]},
            {name: '期末库存', value: 'EndOfTerm', width: '',
            children: [
                {name: '数量', value: 'warNum', width: '80'},
                {name: '暂估平均价', value: 'warPrice', width: '100'},
                {name: '金额(含税)', value: 'warAmount', width: '100'},
            ]},
          ];
          this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
          this.cloneTableData1.forEach(item => {
              item.warPrePrice = item.warPrePrice ? item.warPrePrice: 0;
              item.CumulativeIn = item.inDirectNum + item.inGdNum + item.inReturnNum + item.inAllotNum + item.inBorrowNum;
              item.CumulativeInAmount = toQfw(item.CumulativeIn * item.warPrice);
              item.CumulativeOut = item.outDoNum + item.outReturnNum + item.outAllotNum + item.outBorrowNum + item.outLossNum + item.outDirectNum;
              item.CumulativeOutAmount = toQfw(item.CumulativeOut * item.warPrice);
              item.warPreAmount = toQfw(item.warPreNum * item.warPrice);
              item.warAmount = toQfw(item.warNum * item.warPrice);
          })
          this.cloneTableData = this.cloneTableData1;
          this.getSpanArr(this.cloneTableData)
      },
      // 收发存明细报表(按领料单位)
      _geReceiveUnit() {
        this.rows = true;
        let fromList = [
            {name: '期初库存', value: 'EarlyStage', width: '',
            children: [
                {name: '数量', value: 'warPreNum', width: '80'},
                {name: '暂估平均价', value: 'warPrePrice', width: '100'},
                {name: '金额(含税)', value: 'warPreAmount', width: '100'},
            ]},
            {name: '累计入库', value: 'in', width: '',
            children: [
                {name: '数量', value: 'CumulativeIn', width: '80'},
                {name: '金额(含税)', value: 'CumulativeInAmount', width: '100'},
            ]},
            {name: '累计出库', value: 'out', width: '', children: [
              // {name: '其他领料单位', value: 'Other',
              //   children: [
              //     {name: '数量', value: 'CumulativeOut', width: '80'},
              //     {name: '金额(含税)', value: 'CumulativeOutAmount', width: '100'},
              //   ]
              // },
              {name: '合计', value: 'total',
                children: [
                  {name: '数量', value: 'totalRecNum', width: '80'},
                  {name: '金额(含税)', value: 'totalRecAmount', width: '100'},
                ]
              },
            ]},
            {name: '期末库存', value: 'EndOfTerm', width: '',
            children: [
                {name: '数量', value: 'warNum', width: '80'},
                {name: '暂估平均价', value: 'warPrice', width: '100'},
                {name: '金额(含税)', value: 'warAmount', width: '100'},
            ]},
          ];
          let arr = [];
          fromList.forEach(item => {
            if(item.value === 'out'){
              this.recUnitList.forEach(val => {
                arr.push({name: val.unitName, value: val.unitId + '', width: '100', children: [
                  {name: '数量', value: 'recNum', width: '80'},
                  {name: '金额(含税)', value: 'recAmount', width: '100'},
                ]})
              })
              item.children = arr.concat(item.children);
            }
          })
          this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
          this.cloneTableData1.forEach(item => {
              item.warPrePrice = item.warPrePrice ? item.warPrePrice: 0;
              item.CumulativeIn = item.inDirectNum + item.inGdNum + item.inReturnNum + item.inAllotNum + item.inBorrowNum;
              item.CumulativeInAmount = toQfw(item.CumulativeIn * item.warPrice);
              // item.CumulativeOut = item.outDoNum + item.outReturnNum + item.outAllotNum + item.outBorrowNum + item.outLossNum + item.outDirectNum;
              // item.CumulativeOutAmount = toQfw(item.CumulativeOut * item.warPrice);
              item.warPreAmount = toQfw(item.warPreNum * item.warPrice);
              item.warAmount = toQfw(item.warNum * item.warPrice);
          })
          this.cloneTableData = this.cloneTableData1;
          this.getSpanArr(this.cloneTableData)
      },
      // 收发存明细报表(按使用部位)
      _geReceivePlace() {
        this.rows = true;
        let fromList = [
            {name: '期初库存', value: 'EarlyStage', width: '',
            children: [
                {name: '数量', value: 'warPreNum', width: '80'},
                {name: '暂估平均价', value: 'warPrePrice', width: '100'},
                {name: '金额(含税)', value: 'warPreAmount', width: '100'},
            ]},
            {name: '累计入库', value: 'in', width: '',
            children: [
                {name: '数量', value: 'CumulativeIn', width: '80'},
                {name: '金额(含税)', value: 'CumulativeInAmount', width: '100'},
            ]},
            {name: '累计出库', value: 'out', width: '', children: [
              // {name: '其他使用部位', value: 'Other',
              //   children: [
              //     {name: '数量', value: 'CumulativeOut', width: '80'},
              //     {name: '金额(含税)', value: 'CumulativeOutAmount', width: '100'},
              //   ]
              // },
              {name: '合计', value: 'total',
                children: [
                  {name: '数量', value: 'totalNum', width: '80'},
                  {name: '金额(含税)', value: 'totalAmount', width: '100'},
                ]
              },
            ]},
            {name: '期末库存', value: 'EndOfTerm', width: '',
            children: [
                {name: '数量', value: 'warNum', width: '80'},
                {name: '暂估平均价', value: 'warPrice', width: '100'},
                {name: '金额(含税)', value: 'warAmount', width: '100'},
            ]},
          ];
          let arr = []
          fromList.forEach(item => {
            if(item.value === 'out'){
              this.usePlaceList.forEach(val => {
                arr.push({name: val.placeName, value: val.placeId + '', width: '100', children: [
                  {name: '数量', value: 'useNum', width: '80'},
                  {name: '金额(含税)', value: 'useAmount', width: '100'},
                ]})
              })
              item.children = arr.concat(item.children);
            }
          })
          this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
          this.cloneTableData1.forEach(item => {
              item.warPrePrice = item.warPrePrice ? item.warPrePrice: 0;
              item.CumulativeIn = item.inDirectNum + item.inGdNum + item.inReturnNum + item.inAllotNum + item.inBorrowNum;
              item.CumulativeInAmount = toQfw(item.CumulativeIn * item.warPrice);
              // item.CumulativeOut = item.outDoNum + item.outReturnNum + item.outAllotNum + item.outBorrowNum + item.outLossNum + item.outDirectNum;
              // item.CumulativeOutAmount = toQfw(item.CumulativeOut * item.warPrice);
              item.warPreAmount = toQfw(item.warPreNum * item.warPrice);
              item.warAmount = toQfw(item.warNum * item.warPrice);
          })
          this.cloneTableData = this.cloneTableData1;
          this.getSpanArr(this.cloneTableData)
      },
      // 入库单累计汇总表
      _geInSummary() {
        this.rows = true;
        let fromList = [
            {name: '累计入库', value: 'in', width: '',
            children: [
                {name: '数量', value: 'CumulativeIn', width: '80'},
                {name: '暂估平均价', value: 'warPrice', width: '100'},
                {name: '金额(含税)', value: 'CumulativeInAmount', width: '100'},
            ]},
          ];
          this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
          
          let row = {
            orgName: '合计金额',
            CumulativeInAmount: 0,
          }
          this.cloneTableData1.forEach(item => {
              item.CumulativeIn = item.inDirectNum + item.inGdNum + item.inReturnNum + item.inAllotNum + item.inBorrowNum;
              item.CumulativeInAmount = toQfw(item.CumulativeIn * item.warPrice);
              row.CumulativeInAmount += reseveQfw(item.CumulativeInAmount);
          })
          if(this.cloneTableData1.length > 0) {
            row.CumulativeInAmount = toQfw(row.CumulativeInAmount);
            this.cloneTableData1.push(row);
          }
          this.isSetStyle = true;
          this.cloneTableData = this.cloneTableData1;
          this.getSpanArr(this.cloneTableData)
      },
      // 入库单明细表
      _geInDetailed() {
          this.rows = false;
          let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '供应商名称', value: 'supplierName', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '入库数量', value: 'warInNum', width: '80'},
            {name: '入库金额', value: 'totalAmount', width: '80'},
            {name: '发生日期', value: 'creatTime', width: '80'},
          ];
          this.cloneTableDataFrom = fromList;
          let in1 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            supplierName: this.cloneSearchFormOut.supplierName,
            warName: this.cloneSearchFormOut.warName,
            inDescript: "",
          }
          getInDown(in1).then(res => {
            if (res.results.length >= 1) {
              let row1 = {
                projectName: '合计金额',
                totalAmount: 0,
              }
              res.results.forEach(item => {
                row1.totalAmount += item.totalAmount;
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              res.results.push(row1);
              this.isSetStyle = true;
              this.getOutSpanArr(res.results);
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 直进直出单明细表
      _geInOutDetailed() {
        this.rows = false;
        // let fromList = [
        //   {name: '直进直出数量', value: 'inDirectNum', width: '120'}
        // ];
        // this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
        // this.cloneTableData = this.filterData('inDirectNum')
        // if(this.cloneTableData.length >= 1){
        //   this.getSpanArr(this.cloneTableData)
        // } else {
        //   this.cloneTableData = [];
        // }
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '供应商名称', value: 'supplierName', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '入库数量', value: 'warOutNum', width: '80'},
            {name: '入库金额', value: 'warTotalAmount', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '80'},
          ];
          this.cloneTableDataFrom = fromList;
          let inout = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            supplierName: this.cloneSearchFormOut.supplierName,
            uintId: this.cloneSearchFormOut.uintId,
            unitUserName: this.cloneSearchFormOut.unitUserName,
            usePlaceId: this.cloneSearchFormOut.usePlaceId,
            warName: this.cloneSearchFormOut.warName
          }
          getInOutWarDetail(inout).then(res => {
            if (res.results.length >= 1) {
              let row2 = {
                projectName: '合计金额',
                warTotalAmount: 0,
              }
              res.results.forEach(item => {
                row2.warTotalAmount += item.warTotalAmount;
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              res.results.push(row2);
              this.isSetStyle = true;
              this.getOutSpanArr(res.results);
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 领料返库明细报表
      _geInUnitReturn() {
        this.rows = false;
        let fromList = [
          {name: '项目名称', value: 'projectName', width: '150'},
          {name: '仓库名称', value: 'warName', width: '100'},
          {name: '物资分类', value: 'classifyName', width: '100'},
          {name: '物资编码', value: 'materialCode', width: '80'},
          {name: '物资名称', value: 'materialName', width: '100'},
          {name: '规格', value: 'standard', width: '60'},
          {name: '单位', value: 'unit', width: '50'},
          {name: '返库数量', value: 'warInNum', width: '80'},
          {name: '办理人', value: 'returnBy', width: '80'},
          {name: '返库原因', value: 'reReason', width: '100'},
          {name: '发生日期', value: 'creatTime', width: '80'},
        ];
        this.cloneTableDataFrom = fromList;
        let in3 = {
          classifyCode: this.cloneSearchFormOut.classifyCode,
          classifyLevels: this.cloneSearchFormOut.classifyLevels,
          classifyName: this.cloneSearchFormOut.classifyName,
          creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
          creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
          materialCode: this.cloneSearchFormOut.materialCode,
          materialName: this.cloneSearchFormOut.materialName,
          orgId: this.cloneSearchFormOut.orgId,
          pageNo: this.cloneSearchFormOut.pageNo,
          pageSize: this.cloneSearchFormOut.pageSize,
          projectId: this.cloneSearchFormOut.projectId,
          projectManager: this.cloneSearchFormOut.projectManager,
          warName: this.cloneSearchFormOut.warName,
          reReason: "",
          returnBy: "",

        }
        getInReturn(in3).then(res => {
          if (res.results.length >= 1) {
            res.results.forEach(item => {
              item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
            })
            this.getOutSpanArr(res.results)
          } else {
            this.cloneTableData = [];
          }
        })
      },
      // 调入明细报表
      _geTransferInDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '调入数量', value: 'warOutNum', width: '80'},
            {name: '调入金额', value: 'warTotalAmount', width: '100'},
            {name: '经办人', value: 'allotionName', width: '80'},
            {name: '调入原因', value: 'allotionReason', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '80'},
          ];
          this.cloneTableDataFrom = fromList;
          let in2 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            warName: this.cloneSearchFormOut.warName,
            allotionName: this.cloneSearchFormOut.allotionName,
            allotionReason: "",
            uintId: "",
            usePlaceId: "",
          }
          getInAllotion(in2).then(res => {
            if (res.results.length >= 1) {
              let row3 = {
                projectName: '合计金额',
                warTotalAmount: 0,
              }
              res.results.forEach(item => {
                row3.warTotalAmount += item.warTotalAmount;
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              res.results.push(row3);
              this.isSetStyle = true;
              this.getOutSpanArr(res.results);
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 归还明细报表
      _geReturnDetailed() {
        this.rows = false;
        let fromList = [
          {name: '项目名称', value: 'projectName', width: '150'},
          {name: '仓库名称', value: 'warName', width: '100'},
          {name: '物资分类', value: 'classifyName', width: '100'},
          {name: '物资编码', value: 'materialCode', width: '80'},
          {name: '物资名称', value: 'materialName', width: '100'},
          {name: '规格', value: 'standard', width: '60'},
          {name: '单位', value: 'unit', width: '60'},
          {name: '归还数量', value: 'warInNum', width: '80'},
          {name: '办理人', value: 'backBy', width: '80'},
          {name: '归还情况', value: 'backDescript', width: '100'},
          {name: '发生日期', value: 'creatTime', width: '80'},
        ];
        this.cloneTableDataFrom = fromList;
        let in3 = {
          classifyCode: this.cloneSearchFormOut.classifyCode,
          classifyLevels: this.cloneSearchFormOut.classifyLevels,
          classifyName: this.cloneSearchFormOut.classifyName,
          creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
          creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
          materialCode: this.cloneSearchFormOut.materialCode,
          materialName: this.cloneSearchFormOut.materialName,
          orgId: this.cloneSearchFormOut.orgId,
          pageNo: this.cloneSearchFormOut.pageNo,
          pageSize: this.cloneSearchFormOut.pageSize,
          projectId: this.cloneSearchFormOut.projectId,
          projectManager: this.cloneSearchFormOut.projectManager,
          warName: this.cloneSearchFormOut.warName,
          backBy: "",
          backDescript: "",
        }
        getInBack(in3).then(res => {
          if (res.results.length >= 1) {
            res.results.forEach(item => {
              item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
            })
            this.getOutSpanArr(res.results)
          } else {
            this.cloneTableData = [];
          }
        })
      },
      // 出库汇总
      _geOutSummary() {
        this.rows = true;
        let fromList = [
          {name: '累计出库数量', value: 'warTotalNum', width: '100'},
        ];
        this.cloneTableDataFrom = this.cloneTableDataFrom1.concat(fromList);
        getWarOutDetail(this.cloneSearchFormOut).then(res => {
          if (res.results.length >= 1) {
            this.getOutSpanArr(res.results)
          } else {
            this.cloneTableData = [];
          }
        })
      },
      // 直进直出明细报表
      _geOutDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '领用单位', value: 'uintName', width: '100'},
            {name: '领料人', value: 'unitUserName', width: '100'},
            {name: '使用部位/工程', value: 'usePlaceName', width: '120'},
            {name: '供应商名称', value: 'supplierName', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '出库数量', value: 'warOutNum', width: '100'},
            {name: '出库金额', value: 'warTotalAmount', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj1 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            supplierName: this.cloneSearchFormOut.supplierName,
            uintId: this.cloneSearchFormOut.uintId,
            unitUserName: this.cloneSearchFormOut.unitUserName,
            usePlaceId: this.cloneSearchFormOut.usePlaceId,
            warName: this.cloneSearchFormOut.warName
          }
          getInOutWarDetail(obj1).then(res => {
            if (res.results.length >= 1) {
              let row4 = {
                projectName: '合计金额',
                warTotalAmount: 0,
              }
              res.results.forEach(item => {
                row4.warTotalAmount += item.warTotalAmount;
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              res.results.push(row4);
              this.isSetStyle = true;
              
              this.getOutSpanArr(res.results);
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 领料出库明细报表
      _geOutUnitReturn() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '领用单位', value: 'uintName', width: '100'},
            {name: '领料人', value: 'unitUserName', width: '100'},
            {name: '使用部位/工程', value: 'usePlaceName', width: '120'},
            {name: '领用原因', value: 'recReason', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '领料出库数量', value: 'warOutNum', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj2 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            uintId: this.cloneSearchFormOut.uintId,
            unitUserName: this.cloneSearchFormOut.unitUserName,
            usePlaceId: this.cloneSearchFormOut.usePlaceId,
            warName: this.cloneSearchFormOut.warName,
            recReason: ""
          }
          getOutDownDetail(obj2).then(res => {
            if (res.results.length >= 1) {
              res.results.forEach(item => {
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              this.getOutSpanArr(res.results)
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 借出明细报表
      _geLendDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '领用单位', value: 'uintName', width: '100'},
            {name: '借用人', value: 'borrowName', width: '100'},
            {name: '借用原因', value: 'borrowReason', width: '120'},
            {name: '使用部位/工程', value: 'usePlaceName', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '借出数量', value: 'warOutNum', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj3 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            uintId: this.cloneSearchFormOut.uintId,
            usePlaceId: this.cloneSearchFormOut.usePlaceId,
            warName: this.cloneSearchFormOut.warName,
            borrowName: this.cloneSearchFormOut.borrowName,
            borrowReason: "",
          }
          getBorrowDetail(obj3).then(res => {
            if (res.results.length >= 1) {
              res.results.forEach(item => {
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              this.getOutSpanArr(res.results)
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 调出明细报表
      _geCallOutDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '调拨经办人', value: 'allotionName', width: '100'},
            {name: '调拨原因', value: 'allotionReason', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '调拨数量', value: 'warOutNum', width: '100'},
            {name: '调拨金额', value: 'warTotalAmount', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj4 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            warName: this.cloneSearchFormOut.warName,
            allotionName: this.cloneSearchFormOut.allotionName,
            allotionReason: "",
          }
          getAllotionDetail(obj4).then(res => {
            if (res.results.length >= 1) {
              let row5 = {
                projectName: '合计金额',
                warTotalAmount: 0,
              }
              res.results.forEach(item => {
                row5.warTotalAmount += item.warTotalAmount;
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              res.results.push(row5);
              this.isSetStyle = true;
              this.getOutSpanArr(res.results);
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 退货明细报表
      _geReturnGoodsDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '退货经办人', value: 'dealer', width: '100'},
            {name: '退货原因', value: 'reBackReason', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '退货数量', value: 'warOutNum', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj5 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            warName: this.cloneSearchFormOut.warName,
            dealer:  this.cloneSearchFormOut.dealer,
            reBackReason: "",
          }
          getBackDetail(obj5).then(res => {
            if (res.results.length >= 1) {
              res.results.forEach(item => {
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              this.getOutSpanArr(res.results)
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 报损明细报表
      _geReportLossDetailed() {
        this.rows = false;
        let fromList = [
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '报损人', value: 'lossUser', width: '100'},
            {name: '报损描述', value: 'lossDescript', width: '100'},
            {name: '物资分类', value: 'classifyName', width: '100'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '规格', value: 'standard', width: '60'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '报损数量', value: 'warOutNum', width: '100'},
            {name: '发生日期', value: 'creatTime', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj6 = {
            classifyCode: this.cloneSearchFormOut.classifyCode,
            classifyLevels: this.cloneSearchFormOut.classifyLevels,
            classifyName: this.cloneSearchFormOut.classifyName,
            creatTimeFrom: this.cloneSearchFormOut.creatTimeFrom,
            creatTimeTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            orgId: this.cloneSearchFormOut.orgId,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            warName: this.cloneSearchFormOut.warName,
            lossUser: this.cloneSearchFormOut.lossUser,
            lossDescript: "",
          }
          getLossDetail(obj6).then(res => {
            if (res.results.length >= 1) {
              res.results.forEach(item => {
                item.creatTime = item.creatTime ? item.creatTime.split(' ')[0] : ''
              })
              this.getOutSpanArr(res.results)
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 到货验收
      _geArrivalDetailed() {
        this.rows = false;
        let fromList = [
            {name: '公司名称', value: 'orgName', width: '120'},
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '物资名称', value: 'materialName', width: '100'},
            {name: '物资编号', value: 'materialCode', width: '80'},
            {name: '规格', value: 'standard', width: '100'},
            {name: '单位', value: 'unit', width: '50'},
            {name: '合同签订数量', value: 'signTotalNum', width: '120'},
            {name: '到货验收数量', value: 'checkTotalNum', width: '120'},
            {name: '已到货数量', value: 'arrivalTotalNum', width: '100'},
          ];
          let obj7 = {
            classfyCode: this.cloneSearchFormOut.classifyCode,
            classfyLevel: this.cloneSearchFormOut.classifyLevels,
            classfyName: this.cloneSearchFormOut.classifyName,
            dateFrom: this.cloneSearchFormOut.creatTimeFrom,
            dateTo: this.cloneSearchFormOut.creatTimeTo,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName: this.cloneSearchFormOut.materialName,
            operateBy: "",
            orgName: this.cloneSearchFormOut.orgName,
            pageNo: this.cloneSearchFormOut.pageNo,
            pageSize: this.cloneSearchFormOut.pageSize,
            placeName: "",
            projectId: this.cloneSearchFormOut.projectId,
            projectManager: this.cloneSearchFormOut.projectManager,
            projectName: this.cloneSearchFormOut.projectName,
            receiveBy: "",
            receiveUnit: "",
            supperName: "",
            warName: ""
          }
          this.cloneTableDataFrom = fromList;
          getPurCheckTotal(obj7).then(res => {
            if (res.results&&res.results.purCheckTotalDto) {
              this.getSpanArr(res.results.purCheckTotalDto)
            } else {
              this.cloneTableData = [];
            }
          })
      },
      // 盘点单
      _geInventoryDetailed() {
        this.rows = false;
        let fromList = [
            {name: '公司名称', value: 'orgName', width: '120'},
            {name: '项目名称', value: 'projectName', width: '150'},
            {name: '项目经理', value: 'projectManager', width: '100'},
            {name: '物资名称', value: 'materialName', width: '120'},
            {name: '物资编码', value: 'materialCode', width: '80'},
            {name: '仓库名称', value: 'warName', width: '100'},
            {name: '仓库管理员', value: 'warManager', width: '120'},
            {name: '盘点期别', value: 'period', width: '100'},
            {name: '盘点人', value: 'inventoryUser', width: '120'},
            {name: '账面应存', value: 'stock', width: '120'},
            {name: '盘点实存', value: 'reviewStock', width: '120'},
            {name: '盘亏', value: 'profitLoss', width: '120'},
            {name: '原因', value: 'reason', width: '120'},
            {name: '发生日期', value: 'createDate', width: '100'},
          ];
          this.cloneTableDataFrom = fromList;
          let obj = {
            inventoryUser: this.cloneSearchFormOut.inventoryUser,
            materialCode: this.cloneSearchFormOut.materialCode,
            materialName:  this.cloneSearchFormOut.materialName,
            orgName:  this.cloneSearchFormOut.orgName,
            pageNo:  this.cloneSearchFormOut.pageNo,
            pageSize:  this.cloneSearchFormOut.pageSize,
            period:  this.cloneSearchFormOut.period,
            projectManager:  this.cloneSearchFormOut.projectManager,
            projectName:  this.cloneSearchFormOut.projectName,
            startDateFrom:  this.cloneSearchFormOut.creatTimeFrom,
            startDateTo:  this.cloneSearchFormOut.creatTimeTo,
            warManager:  this.cloneSearchFormOut.warManager,
            warName:  this.cloneSearchFormOut.warName,
          }
          getList(obj).then(res => {
            if(res.results&&res.results.inventoryAnalysisDto) {
              let inventoryAnalysisDtoList = res.results.inventoryAnalysisDto;
              inventoryAnalysisDtoList.forEach(item => {
                item.createDate = item.createDate ? format(item.createDate).split(" ")[0] : '';
                item.stock = item.stock ? toQfw(item.stock) : 0;
                item.reviewStock = item.reviewStock ? toQfw(item.reviewStock) : 0;
                item.profitLoss = item.profitLoss ? toQfw(item.profitLoss) : 0;
              })
              this.getSpanArr(inventoryAnalysisDtoList)
            } else{
              this.cloneTableData = [];
            }
          })
      },
      // excel导出 文本
      exportExcel(formCode) {
        exportExcelMethod('tableDataList', formCode, 'sheet');
      },
      // excel导出
      exportExcelCode(formCode) {
        const FromCodeList = [
          {name: 'InventoryDetails', callback: '_geInventoryDetailsExport'},
          {name: 'receiveSummary', callback: '_geReceiveSummaryExport'},
          {name: 'receiveUnit', callback: '_geReceiveUnitExport'},
          {name: 'receivePlace', callback: '_geReceivePlaceExport'},
          {name: 'arrivalDetailed', callback: '_geArrivalDetailedExport'},
          {name: 'InventoryDetailed', callback: '_geInventoryDetailedExport'},
          {name: 'inSummary', callback: '_geInSummaryExport'},
          {name: 'inDetailed', callback: '_geInDetailedExport'},
          {name: 'inOutDetailed', callback: '_geInOutDetailedExport'},
          {name: 'inUnitReturn', callback: '_geInUnitReturnExport'},
          {name: 'transferInDetailed', callback: '_geTransferInDetailedExport'},
          {name: 'returnDetailed', callback: '_geReturnDetailedExport'},
          {name: 'outSummary', callback: '_geOutSummaryExport'},
          {name: 'OutDetailed', callback: '_geOutDetailedExport'},
          {name: 'outUnitReturn', callback: '_geOutUnitReturnExport'},
          {name: 'lendDetailed', callback: '_geLendDetailedExport'},
          {name: 'callOutDetailed', callback: '_geCallOutDetailedExport'},
          {name: 'returnGoodsDetailed', callback: '_geReturnGoodsDetailedExport'},
          {name: 'reportLossDetailed', callback: '_geReportLossDetailedExport'},
        ];
        let index = FromCodeList.findIndex(v => v.name === formCode);
        if (index >= 0) {
          this[FromCodeList[index].callback]();
        }
      },
      // 仓库库存明细报表导出
      _geInventoryDetailsExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'CumulativeIn', 'CumulativeInAmount', 'CumulativeOut', 'CumulativeOutAmount', 'SurplusNum', 'SurplusAmount']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 累计入库-数量, 累计入库-金额(含税), 累计出库-数量, 累计出库-金额(含税), 库存余量-数量, 库存余量-金额(含税)',
          commonColDto: [],
          flieName: '仓库库存明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 收发存明细报表(汇总)导出
      _geReceiveSummaryExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'warPreNum', 'warPreAmount','CumulativeIn', 'CumulativeInAmount', 'CumulativeOut', 'CumulativeOutAmount', 'SurplusNum', 'SurplusAmount', 'warNum', 'warAmount']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 期初库存-数量, 期初库存-金额(含税),累计入库-数量, 累计入库-金额(含税), 累计出库-数量, 累计出库-金额(含税), 库存余量-数量, 库存余量-金额(含税), 期末库存-数量, 期末库存-金额(含税)',
          commonColDto: [],
          flieName: '收发存明细报表(汇总)'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 入库明细汇总报表导出
      _geInSummaryExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'CumulativeIn', 'CumulativeInAmount']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 累计入库-数量, 累计入库-金额(含税)',
          commonColDto: [],
          flieName: '入库明细汇总报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 入库单明细报表导出
      _geInDetailedExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit','inGdNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 入库数量',
          commonColDto: [],
          flieName: '入库单明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 直进直出明细报表导出
      _geInOutDetailedExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit','inDirectNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 直进直出数量',
          commonColDto: [],
          flieName: '直进直出明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 领料返库明细报表导出
      _geInUnitReturnExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit','inReturnNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 返库数量',
          commonColDto: [],
          flieName: '领料返库明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 调入明细报表导出
      _geTransferInDetailedExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit','inAllotNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 调入数量',
          commonColDto: [],
          flieName: '调入明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 归还明细报表导出
      _geInUnitReturnExport () {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit','inBorrowNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 归还数量',
          commonColDto: [],
          flieName: '归还明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 出库明细汇总报表导出
      _geOutSummaryExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'CumulativeOut', 'CumulativeOutAmount']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 累计出库-数量, 累计出库-金额(含税)',
          commonColDto: [],
          flieName: '出库明细汇总报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 直进直出明细报表导出
      _geOutDetailedExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outDirectNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 直进直出数量',
          commonColDto: [],
          flieName: '直进直出明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 领料出库明细报表导出
      _geOutUnitReturnExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outDoNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 领料出库数量',
          commonColDto: [],
          flieName: '领料出库明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 借出明细报表导出
      _geLendDetailedExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outBorrowNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 借出数量',
          commonColDto: [],
          flieName: '借出明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 调出明细报表导出
      _geCallOutDetailedExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outAllotNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 调出数量',
          commonColDto: [],
          flieName: '调出明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 退货明细报表导出
      _geReturnGoodsDetailedExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outReturnNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 退货数量',
          commonColDto: [],
          flieName: '退货明细报表'
        }
        this.cloneTableData = this.cloneTableData1;
        this.setCommonColDto(value, data)
      },
      // 报损明细报表导出
      _geReportLossDetailedExport() {
        let value = ['orgName', 'projectName', 'warName', 'materialName', 'materialCode', 'standard', 'unit', 'outLossNum']
        let data = {
          colName: '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 报损数量',
          commonColDto: [],
          flieName: '报损明细报表'
        }
        this.cloneTableData = this.cloneTableData1
        this.setCommonColDto(value, data)
      },
      // 到货验收导出
      _geArrivalDetailedExport() {
        let value = ['orgName', 'projectName', 'materialName', 'materialCode', 'standard', 'unit', 'signTotalNum', 'checkTotalNum', 'arrivalTotalNum']
        let data = {
          colName: '公司名称, 项目名称, 物资名称, 物资编号, 规格, 单位, 合同签订数量, 到货验收数量, 已到货数量',
          commonColDto: [],
          flieName: '到货明细报表'
        }
        this.cloneTableData = this.purCheckTotalDtoList
        this.setCommonColDto(value, data)
      },
      // 盘点明细报表导出
      _geInventoryDetailedExport() {
        let value = ['orgName', 'projectName', 'projectManager', 'startDate',  'materialName', 'materialCode', 'warName', 'warManager', 'period', 'inventoryUser', 'stock', 'reviewStock', 'reviewStock', 'profitLoss', 'reason']
        let data = {
          colName: '公司名称, 项目名称, 项目经理, 物资名称, 物资编号, 仓库名称, 仓库管理员, 盘点期别, 盘点人, 账面应存, 盘点实存, 盘亏, 原因',
          commonColDto: [],
          flieName: '盘点明细报表'
        }
        this.cloneTableData = this.inventoryAnalysisDtoList
        this.setCommonColDto(value, data)
      },
      // 收发存明细报表(按领料单位)导出
      _geReceiveUnitExport() {
        let recUnitList = JSON.parse(JSON.stringify(this.recUnitList))
        let colName1 = '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 期初库存-数量, 期初库存-金额(含税),累计入库-数量, 累计入库-金额(含税)'
        let colName2 = []
        if(recUnitList.length > 0) {
          recUnitList.forEach(item => {
            colName2.push('累计出库' + item.unitName + '-数量|' + item.unitId, '累计出库' +item.unitName + '-金额(含税)|' + item.unitId)
          })
        }

        let colName3 = '累计出库-其他领料单位-数量, 累计出库-其他领料单-金额(含税), 合计-数量, 合计-金额(含税), 期末库存-数量, 期末库存-金额(含税)'
        let data = {
          colName: '',
          commonList : [],
          unitPlaceFlg: '01',
          flieName: '收发存明细报表(按领料单位)'
        }
        if(recUnitList.length > 0) {
          data.colName = colName1 + ',' + colName2.join(',') + ','  + colName3;
        } else {
          data.colName = colName1 + ',' + colName3;
        }

        data.commonList = this.tableDataListAll;
        this.setUnitCommonColDto(data)
      },
      // 收发存明细报表(按使用部位)导出
      _geReceivePlaceExport() {
        let usePlaceList = JSON.parse(JSON.stringify(this.usePlaceList))
        let colName1 = '公司名称, 项目名称, 仓库名称, 物资名称, 物资编号, 规格, 单位, 期初库存-数量, 期初库存-金额(含税),累计入库-数量, 累计入库-金额(含税)'
        let colName2 = []
        if(usePlaceList.length > 0) {
          usePlaceList.forEach(item => {
            colName2.push('累计出库' + item.placeName + '-数量|' + item.placeId, '累计出库' +item.placeName + '-金额(含税)|' + item.placeId)
          })
        }
        let colName3 = '累计出库-其他使用部位-数量, 累计出库-其他使用部位-金额(含税), 合计-数量, 合计-金额(含税), 期末库存-数量, 期末库存-金额(含税)'
        let data = {
          colName: '',
          commonList : [],
          unitPlaceFlg: '02',
          flieName: '收发存明细报表(按使用部位)'
        }
        if(usePlaceList.length > 0) {
          data.colName = colName1 + ',' + colName2.join(',') + ','  + colName3;
        } else {
          data.colName = colName1 + ',' + colName3;
        }
        data.commonList = this.tableDataListAll;
        this.setUnitCommonColDto(data)
      },
      // 领料单位/使用部位导出
      setUnitCommonColDto(data) {
        unitPlaceExport(data).then(res => {
          if (!res) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([res]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', `${data.flieName}.xls`)
            document.body.appendChild(link)
            link.click()
        })
      },
      setCommonColDto(value, data) {
        this.cloneTableData.forEach((item, key) => {
          let obj = {}
          value.forEach((val, index) => {
            let str = 'col'+index;
            obj[str] = this.cloneTableData[key][val]
          })
          data.commonColDto.push(obj)
        })
        this._reportWarExport(data)
      },
      // 导出
      _reportWarExport(data) {
        reportWarExport(data).then(res => {
          if (!res) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([res]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', `${data.flieName}.xls`)
            document.body.appendChild(link)
            link.click()
        })
      },
      // 筛选数据
      filterData(prop) {
        this.cloneTableData = this.cloneTableData1;
        let cloneTableData = JSON.parse(JSON.stringify(this.cloneTableData))
        cloneTableData = cloneTableData.filter(v => v[prop] && v[prop] > 0);
        return cloneTableData
      },
      // 出库筛选数据
      filterOutData(prop) {
        let cloneTableData = JSON.parse(JSON.stringify(this.warOutDetailList))
        cloneTableData = cloneTableData.filter(v => v[prop] && v[prop] > 0);
        return cloneTableData
      },
      // 设置换行
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          const _row = this.spanArrAll.one[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
        if (columnIndex === 2) {
          const _row1 = this.spanArrAll.two[rowIndex];
          const _col1 = _row1 > 0 ? 1 : 0;
          return {
            rowspan: _row1,
            colspan: _col1
          };
        }
        this.$refs.tableData.doLayout()
      },
      // 获取多少换行
      getSpanArr(data) {
        this.$refs.tableData.doLayout()
        this.cloneTableData = data;
        this.spanArr = []
        this.spanArrTwo = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.index = i;
          if (i === 0) {
            this.spanArr.push(1);
            this.spanArrTwo.push(1);
            this.pos = 0;
            this.posTwo = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            // orgName
            if (data[i].orgName === data[i - 1].orgName ) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            }else {
              this.spanArr.push(1);
              this.pos = i;
            }
            if (data[i].projectName === data[i - 1].projectName ) {
              this.spanArrTwo[this.posTwo] += 1;
              this.spanArrTwo.push(0);
            }else {
              this.spanArrTwo.push(1);
              this.posTwo = i;
            }
          }
        }
        this.spanArrAll = {
          one: this.spanArr,
          two: this.spanArrTwo
        }
      },
       // 获取多少换行
      getOutSpanArr(data) {
        this.$refs.tableData.doLayout()
        this.cloneTableData = data;
        this.spanArr = []
        this.spanArrTwo = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.index = i;
          if (i === 0) {
            this.spanArr.push(1);
            this.spanArrTwo.push(1);
            this.pos = 0;
            this.posTwo = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            // orgName
            if (data[i].projectName === data[i - 1].projectName ) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            }else {
              this.spanArr.push(1);
              this.pos = i;
            }
            if (data[i].warName === data[i - 1].warName ) {
              this.spanArrTwo[this.posTwo] += 1;
              this.spanArrTwo.push(0);
            }else {
              this.spanArrTwo.push(1);
              this.posTwo = i;
            }
          }
        }
        this.spanArrAll = {
          one: this.spanArr,
          two: this.spanArrTwo
        }
      },
      // 设置样式
      setStyle({row, rowIndex}) {
        if(this.isSetStyle){
          if((rowIndex + 1) === this.cloneTableData.length){
            return 'color: red;'
          }
        }
      },
    }
}
</script>
<style lang="scss" scoped>
  .tableWarehouse{
    left: 10px;
    right: 10px;
    position: absolute;
    font-size: 12px;
    overflow-y: auto;
    &::-webkit-scrollbar{
      display: none
    }
    .el-table{
      font-size: 12px !important;
    }
  }
</style>
