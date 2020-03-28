<template>
  <div class="orgIncomingSet">
    <title-components titles="固定资产入库单">
      <div class="btn" slot="btn">
        <el-button
          :disabled="!flowStatus"
          @click="successCancel"
          icon="el-icon-circle-close"
          size="small"
          type="danger"
          plain
        >取消</el-button>
        <el-button
          :disabled="!flowStatus"
          @click="successSubmit('searchForm')"
          icon="el-icon-circle-check"
          size="small"
          type="primary"
        >确认提交</el-button>
      </div>
    </title-components>

    <el-form :rules="rules" ref="searchForm" :model="searchForm" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属公司">
            <el-select
              :disabled="!flowStatus"
              @change="changeManagerOrgs"
              v-model="searchForm.orgId"
              placeholder="请选择所属公司"
            >
              <el-option
                v-for="item in managerOrgs"
                :key="item.id"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据编号">
            <el-input v-model="docNos" disabled placeholder="单据编号由系统自动生成"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司仓库" prop="orgWarehouseId">
            <el-select
              :disabled="!flowStatus"
              v-model="searchForm.orgWarehouseId"
              placeholder="请选择公司仓库"
            >
              <el-option
                v-for="item in warehouseListAll"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称">
            <!-- <el-input v-model="searchForm.supplierName" placeholder="请输入供应商名称"></el-input> -->
            <el-select
              :disabled="!flowStatus"
              v-model="searchForm.supplierName"
              placeholder="请选择公司仓库"
            >
              <el-option
                v-for="item in supplierListAll"
                :key="item.id"
                :label="item.supplierFullName"
                :value="item.supplierFullName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记日期" prop="createTime">
            <el-date-picker
              :disabled="!flowStatus"
              v-model="searchForm.createTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库描述" prop="incomingDescription">
            <el-input
              :disabled="!flowStatus"
              v-model="searchForm.incomingDescription"
              placeholder="请输入入库描述"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input
              :disabled="!flowStatus"
              type="textarea"
              placeholder="请输入备注"
              v-model="searchForm.remarks"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上传附件">
             <upload :isClick="!flowStatus" @attachment="getAttachment" :filepathList="filepathList"></upload>
          </el-form-item>
        </el-col>
      </el-row>
    
      
    </el-form>
    <div style="text-align:right;margin-bottom: 20px;">
      <el-button
        class="other"
        :disabled="!flowStatus"
        @click="handleDownTemplate"
        icon="el-icon-circle-close"
        size="small"
        type="primary"
      >下载模版</el-button>
      <el-button
        :disabled="!flowStatus"
        @click="successCancel"
        icon="el-icon-circle-close"
        size="small"
        type="primary"
        plain
        class="more"
      >模版导入</el-button>
      <el-button
        :disabled="!flowStatus"
        @click="handleAddDetails"
        icon="el-icon-circle-close"
        size="small"
        type="primary"
      >添加明细</el-button>
    </div>
    <el-table
      :data="details"
      border
      class="maintainConTable"
      ref="maintainConTable"
      style="width: 100%"
      >
      <el-table-column fixed type="index" label="序号" width="60"></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="classifyName" label="固定资产分类" show-overflow-tooltip width="80">
        <!-- <template slot-scope="scope">
                    <span>{{scope.row.flowStatus | setFlowStatus}}</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="materialName" label="固定资产名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="固定资产编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="standards" label="固定资产规格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unit" label="固定资产单位" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
                    <span style="color:#3e75ff" @click="handClickInfo(scope.row)">{{scope.row.docNo}}</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="quantityIn" label="入库数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="averagePrice" label="单价(元)" width="100"></el-table-column>
      <el-table-column prop="totalPrice" label="金额(元)" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="manufacturer" label="生产厂家或品牌" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buyTime" label="购置日期" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.buyTime | setYear}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useYear" label="使用年限(年)" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expireTime" label="使用到期日" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.expireTime | setYear}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personLiable" label="责任人" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storageLocation" label="存放地点" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remarks" label="备注" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            style="color:3e75ff;"
            @click="handClickEdit(scope.row)"
            type="text"
            size="small"
            :disabled="!flowStatus"
          >修改</el-button>
          <el-button
            style="color:red;"
            @click="handClickDelet(scope.row)"
            type="text"
            size="small"
            :disabled="!flowStatus"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <rightModal v-if="showRightModal">
      <div slot="header">
        <span>添加入库单明细</span>
      </div>
      <div slot="body">
        <el-form :rules="rightModalRules" ref="rightModalForm" :model="detail" label-width="120px">
          <el-form-item label="固定资产分类" prop="classifyName">
            <el-input v-model="detail.classifyName" placeholder="请填写固定资产分类"></el-input>
          </el-form-item>
          <el-form-item label="固定资产名称" prop="materialName">
            <el-input v-model="detail.materialName" placeholder="请输入固定资产名称"></el-input>
          </el-form-item>
          <el-form-item label="固定资产编码" prop="materialCode">
            <el-input v-model="detail.materialCode" placeholder="请输入固定资产编码"></el-input>
          </el-form-item>
          <el-form-item label="固定资产规格" prop="standards">
            <el-input v-model="detail.standards" placeholder="请输入固定资产规格"></el-input>
          </el-form-item>
          <el-form-item label="固定资产单位" prop="unit">
            <el-input v-model="detail.unit" placeholder="请输入固定资产单位"></el-input>
          </el-form-item>
          <el-form-item label="入库数量" prop="quantityIn">
            <el-input @change="setMoney" v-model="detail.quantityIn" placeholder="请输入入库数量"></el-input>
          </el-form-item>
          <el-form-item label="单价(元)" prop="averagePrice">
            <el-input @change="setMoney" v-model="detail.averagePrice" placeholder="请输入单价(元)"></el-input>
          </el-form-item>
          <el-form-item label="金额(元)">
            <el-input v-model="detail.totalPrice" disabled placeholder="请输入金额(元)"></el-input>
          </el-form-item>
          <el-form-item label="生产厂家">
            <el-input v-model="detail.manufacturer" placeholder="请输入生产厂家"></el-input>
          </el-form-item>
          <el-form-item label="购置日期" prop="buyTime">
            <el-date-picker
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="detail.buyTime"
              type="date"
              placeholder="选择购置日期"
            ></el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
          <el-form-item label="使用年限" prop="useYear">
            <el-input v-model="detail.useYear" placeholder="请输入使用年限"></el-input>
          </el-form-item>
          <el-form-item label="使用到期日">
            <el-date-picker
              value-format="yyyy-MM-dd 00:00:00"
              v-model="detail.expireTime"
              type="date"
              placeholder="选择使用到期日"
            ></el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
          <el-form-item label="责任人">
            <el-input v-model="detail.personLiable" placeholder="请输入责任人"></el-input>
          </el-form-item>
          <el-form-item label="存放地点">
            <el-input v-model="detail.storageLocation" placeholder="请输入存放地点"></el-input>
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input type="textarea" placeholder="请输入备注说明" v-model="detail.remarks"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary"
          @click="submitRightModal('rightModalForm')"
        >保存</el-button>
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary"
          plain
          @click="cancelRightModal"
          class="urgent"
        >取消</el-button>
      </div>
    </rightModal>
  </div>
</template>
<script>
import TitleComponents from "components/titleComponent";
import RightModal from "components/rightModal/rightModal";
import { closeRoute } from "mixins";
import Upload from 'components/upload/upload2'

import {
  createOrgIncoming,
  checkMaterialCode,
  getManagerOrgs,
  getSupplierListAll,
  getWarehouseListAll,
  getIncomingInfo,
  downTemplate,
  updateOrgIncoming,
  getFilepathList
} from "api/fixedAssetsManagement";
import { formatTime } from "util";
export default {
  name: "",
  mixins: [closeRoute],
  components: {
    TitleComponents,
    RightModal,
    Upload
  },
  data() {
    var checkMaterial = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入固定资产编码"));
      } else {
        checkMaterialCode(value).then(res => {
          if (res.results !== 0) {
            callback(new Error("固定资产物资编码不能重复"));
          } else {
            callback();
          }
        });
      }
    };
    var checkQuantityIn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入入库数量"));
      } else {
        if (isNaN(value)) {
          this.detail.quantityIn = 0;
          return callback(new Error("入库数量必须大于0"));
        } else if (value <= 0) {
          this.detail.quantityIn = 0;
          return callback(new Error("入库数量必须大于0"));
        } else {
          callback();
        }
      }
    };
    var checkAveragePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入单价(元)"));
      } else {
        if (isNaN(value)) {
          this.detail.averagePrice = 0;
          return callback(new Error("单价必须大于0"));
        } else if (value <= 0) {
          this.detail.averagePrice = 0;
          return callback(new Error("单价必须大于0"));
        } else {
          callback();
        }
      }
    };
    var checkUseYear = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入使用年限"));
      } else if (isNaN(value)) {
        this.detail.useYear = 0;
        return callback(new Error("年限必须大于或等于0"));
      } else if (value <= 0) {
        this.detail.useYear = 0;
        return callback(new Error("年限必须大于或等于0"));
      } else {
        let year = this.detail.buyTime.slice(0, 4);
        let time = this.detail.buyTime.slice(4, 10);
        let t = new Date(
          Number(year) + Number(this.detail.useYear) + time + " 00:00:00"
        );
        this.detail.expireTime = t.getTime();

        callback();
      }
    };
    var checkBuyTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("选择购置日期"));
      } else {
        let year = this.detail.buyTime.slice(0, 4);
        let time = this.detail.buyTime.slice(4, 10);

        let t = new Date(
          Number(year) + Number(this.detail.useYear) + time + " 00:00:00"
        );
        this.detail.expireTime = t.getTime();

        callback();
      }
    };

    return {
      flowStatus: false,
      searchForm: {
        appraiseStatus: "01",
        attachmentId: "",
        createTime: new Date(),
        incomingDescription: "",
        incomingTime: "",
        orgId: "",
        orgWarehouseId: "",
        remarks: "",
        supplierName: ""
      },
      docNos: "",
      details: [],
      detail: {
        averagePrice: "",
        buyTime: "",
        classifyName: "",
        expireTime: "",
        manufacturer: "",
        materialCode: "",
        materialName: "",
        model: "",
        personLiable: "",
        quality: "",
        quantityIn: "",
        remarks: "",
        standards: "",
        storageLocation: "",
        totalPrice: "",
        unit: "",
        useYear: ""
      },
      rules: {
        orgWarehouseId: [
          { required: true, message: "请选择公司仓库", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "请选择登记日期", trigger: "change" }
        ],
        incomingDescription: [
          { required: true, message: "请输入入库描述", trigger: "blur" }
        ]
      },
      rightModalRules: {
        classifyName: [
          { required: true, message: "请填写固定资产分类", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "请输入固定资产名称", trigger: "blur" }
        ],
        materialCode: [{ validator: checkMaterial, trigger: "blur" }],
        standards: [
          { required: true, message: "请输入固定资产规格", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "请输入固定资产单位", trigger: "blur" }
        ],
        quantityIn: [{ validator: checkQuantityIn, trigger: "blur" }],
        averagePrice: [{ validator: checkAveragePrice, trigger: "blur" }],
        useYear: [
          {
            validator: checkUseYear,
            trigger: "blur"
          }
        ],
        buyTime: [{ validator: checkBuyTime, trigger: "change" }]
      },
      showRightModal: false,
      supplierListAll: [],
      warehouseListAll: [],
      managerOrgs: [],
      eventEditRow: {},
      isModelEdit: false,
      id: "",
      type: "",
      filepathList:[]
    };
  },
  created() {
    this._getManagerOrgs();
    this._getSupplierListAll();
    let params = this.$route.params;
    this.id = this.Base64.decode(params.id);
    this.type = this.Base64.decode(params.type);
    if (this.id >= 0) {
      this._getIncomingInfo();
    }
    this.flowStatus = this.type !== "info";
  },
  methods: {
    //获取所属公司
    _getManagerOrgs() {
      getManagerOrgs().then(res => {
        this.managerOrgs = res.results;
      });
    },
    //获取供应商名称
    _getSupplierListAll() {
      getSupplierListAll().then(res => {
        this.supplierListAll = res.results;
      });
    },
    //获取公司仓库
    changeManagerOrgs() {
      getWarehouseListAll(this.searchForm.orgId).then(res => {
        this.warehouseListAll = res.results;
      });
    },
    //添加明细
    handleAddDetails() {
      if (!this.searchForm.orgId) {
        this.$message({
          message: "请选择公司",
          type: "warning"
        });
        return;
      }
      if (!this.searchForm.orgWarehouseId) {
        this.$message({
          message: "请选择仓库",
          type: "warning"
        });
        return;
      }
      this.showRightModal = true;
      this.detail.buyTime = formatTime(new Date());
    },
    //修改明细
    handClickEdit(row) {
      this.isModelEdit = true;
      this.showRightModal = true;
      //保存一份当前修改的数据
      this.eventEditRow = JSON.parse(JSON.stringify(row));
      this.detail = JSON.parse(JSON.stringify(row));
    },
    //删除明细
    handClickDelet(row) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.details.splice(this.details.indexOf(row), 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$message.error("已取消删除");
        });
    },
    _checkMaterialCode() {},
    //右侧弹窗确定
    submitRightModal(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.isModelEdit) {
            //是编辑状态
            this.details.splice(this.details.indexOf(this.eventEditRow), 1);
            this.details.push(this.detail);
            this.detail = {};
            this.showRightModal = false;
            this.eventEditRow = {};
            this.isModelEdit = false;
          } else {
            this.details.push(this.detail);
            this.detail = {};
            this.$confirm("是否继续添加?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.showRightModal = false;
                this.showRightModal = true;
              })
              .catch(() => {
                this.showRightModal = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //右侧弹窗取消
    cancelRightModal() {
      this.detail = {};
      this.showRightModal = false;
      this.eventEditRow = {};
      this.isModelEdit = false;
    },
    //取消
    successCancel() {
      this.setRoute();
    },
    // 确认提交
    successSubmit(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid)
        if (valid) {
          let data = {
            ...this.searchForm
          };

          data.details = this.details;
          if (this.type === "add") {
            createOrgIncoming(data).then(res => {
              if (res.status === 0) {
                this.$message({
                  message: "固定资产入库添加成功",
                  type: "success"
                });
                this.setRoute();
              } else {
                this.$message.error(res.errorMessage);
              }
            });
          } else {
            data.id = this.id;
            updateOrgIncoming(data).then(res => {
              if (res.status === 0) {
                this.$message({
                  message: "固定资产入库修改成功",
                  type: "success"
                });
                this.setRoute();
              } else {
                this.$message.error(res.errorMessage);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取修改数据
    _getIncomingInfo() {
      getIncomingInfo(this.id).then(res => {
        if (res.status === 0) {
          let result = res.results;
          this.searchForm.orgId = result.orgId;
          this.docNos = result.docNo;
          this.searchForm.orgWarehouseId = result.orgWarehouseId;
          this.searchForm.supplierName = result.supplierName;
          this.searchForm.createTime = result.createTime;
          this.searchForm.incomingDescription = result.incomingDescription;
          this.searchForm.remarks = result.remarks;
          this.searchForm.attachmentId = result.attachmentId;
          this.details = result.details;
          this._getFilepathList()
        }
      });
    },
    //下载模版
    handleDownTemplate() {
      downTemplate().then(res => {
        if (res.status === 0) {
          let url = window.URL.createObjectURL(new Blob([res]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          let fileName = res.results.split("/")[1];
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          console.log("success");
        }
      });
    },
    //活动上传文件id字符串
        getAttachment(val){
            this.searchForm.attachmentId = val
            // this.length = val.split(',').length
        },
    //获取上传文件
        _getFilepathList(){
           
            let fileIds = this.searchForm.attachmentId.split(',')
            let data = {
                fileIds:fileIds
            }
            getFilepathList(data).then(res=>{
            
                this.filepathList = res.results
                  console.log(this.filepathList)
                
            })
        },
    setMoney() {
      this.detail.totalPrice =
        this.detail.quantityIn * this.detail.averagePrice;
    }
  }
};
</script>
<style lang="scss" scoped>
.orgIncomingSet {
  background: #fff;
  padding: 20px;
}
</style>
