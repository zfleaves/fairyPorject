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
            <el-select v-model="searchForm.orgId" placeholder="请选择所属公司">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据编号">
            <el-input v-model="searchForm.name" disabled placeholder="单据编号由系统自动生成"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司仓库" prop="orgWarehouseId">
            <el-select v-model="searchForm.orgWarehouseId" placeholder="请选择公司仓库">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称">
            <el-input v-model="searchForm.supplierName" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记日期" prop="createTime">
            <el-date-picker v-model="searchForm.createTime" type="date" placeholder="选择日期"></el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库描述" prop="incomingDescription">
            <el-input v-model="searchForm.incomingDescription" placeholder="请输入入库描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="上传附件">
            <span>上传</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注" v-model="searchForm.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:right;margin-bottom: 20px;">
      <el-button
        class="other"
        :disabled="!flowStatus"
        @click="successCancel"
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
      <el-table-column prop="classifyName" label="固定资产分类" width="80">
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
      <el-table-column prop="totalPrice" label="金额(元)" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column prop="manufacturer" label="生产厂家或品牌" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buyTime" label="购置日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="useYear" label="使用年限(年)" width="80"></el-table-column>
      <el-table-column prop="expireTime" label="使用到期日" width="80"></el-table-column>
      <el-table-column prop="personLiable" label="责任人" width="80"></el-table-column>
      <el-table-column prop="storageLocation" label="存放地点" width="80"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="80"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            style="color:3e75ff;"
            @click="handClickEdit(scope.row)"
            type="text"
            size="small"
          >修改</el-button>
          <el-button
            style="color:red;"
            @click="handClickDelet(scope.row)"
            type="text"
            size="small"
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
          <el-form-item label="单价(元)">
            <el-input
              @change="setMoney"
              prop="averagePrice"
              v-model="detail.averagePrice"
              placeholder="请输入单价(元)"
            ></el-input>
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
import {
  createOrgIncoming,
  checkMaterialCode
} from "api/fixedAssetsManagement";
import { formatTime } from "util";
export default {
  name: "",
  components: {
    TitleComponents,
    RightModal
  },
  data() {
    var checkMaterial = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入固定资产编码"));
      }
      setTimeout(() => {
        checkMaterialCode(value).then(res => {
          if (res.results !== 0) {
            callback(new Error("固定资产物资编码不能重复"));
          } else {
            callback();
          }
        });
      }, 1000);
    };
    var checkQuantityIn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入入库数量"));
      }
      setTimeout(() => {
        if (isNaN(value)) {
          this.detail.quantityIn = 0;
          return callback(new Error("入库数量必须大于0"));
        } else if (value <= 0) {
          this.detail.quantityIn = 0;
          return callback(new Error("入库数量必须大于0"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkAveragePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入单价(元)"));
      }
      setTimeout(() => {
        if (isNaN(value)) {
          this.detail.averagePrice = 0;
          return callback(new Error("单价必须大于0"));
        } else if (value <= 0) {
          this.detail.averagePrice = 0;
          return callback(new Error("单价必须大于0"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkUseYear = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入使用年限"));
      }
      setTimeout(() => {
        let year = this.detail.buyTime.slice(0, 4);
        let time = this.detail.buyTime.slice(4, 10);
        this.detail.expireTime =
          Number(year) + Number(this.detail.useYear) + time + " 00:00:00";
      }, 1000);
    };
    var checkBuyTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("选择购置日期"));
      }
      setTimeout(() => {
        let year = this.detail.buyTime.slice(0, 4);
        let time = this.detail.buyTime.slice(4, 10);
        this.detail.expireTime =
          Number(year) + Number(this.detail.useYear) + time + " 00:00:00";
      }, 1000);
    };

    return {
      flowStatus: true,
      searchForm: {
        appraiseStatus: "01",
        attachmentId: "",
        createTime: 1585277889052,
        incomingDescription: "入库描述",
        incomingTime: "2020-03-27 00:00:00",
        orgId: 378,
        orgWarehouseId: 43,
        remarks: "备注",
        supplierName: "金三角供应商"
      },
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
        buyTime: [
           { validator: checkBuyTime, trigger: "change" }
        ]
      },
      showRightModal: false
    };
  },
  methods: {
    //添加明细
    handleAddDetails() {
      this.showRightModal = true;
      this.detail.buyTime = formatTime(new Date());
    },
    _checkMaterialCode() {},
    //右侧弹窗确定
    submitRightModal(formName) {
      this.$refs[formName].validate(valid => {
          console.log(valid)
        if (valid) {
          this.details.push(this.detail);
          this.detail = {};
          this.showRightModal = false;
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
    },
    //取消
    successCancel() {},
    // 确认提交
    successSubmit() {},
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
