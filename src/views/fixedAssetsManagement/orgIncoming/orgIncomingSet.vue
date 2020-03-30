<template>
  <div class="orgIncomingSet">
    <title-components titles="固定资产入库单">
      <div class="btn" slot="btn">
        <el-button
          :disabled="!flowStatus"
          @click="successCancel"
          icon="el-icon-circle-close"
          size="small" type="danger"
          plain>取消
        </el-button>
        <el-button
          :disabled="!flowStatus"
          @click="successSubmit('searchForm')"
          icon="el-icon-circle-check"
          size="small" type="primary">确认提交
        </el-button>
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
              placeholder="请选择所属公司">
              <el-option
                v-for="item in managerOrgs"
                :key="item.id"
                :label="item.orgName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据编号">
            <el-input v-model="docNos" disabled placeholder="单据编号由系统自动生成">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司仓库" prop="orgWarehouseId">
            <el-select
              :disabled="!flowStatus"
              v-model="searchForm.orgWarehouseId"
              placeholder="请选择公司仓库">
              <el-option
                v-for="item in warehouseListAll"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id">
              </el-option>
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
              placeholder="请选择公司仓库">
              <el-option
                v-for="item in supplierListAll"
                :key="item.id"
                :label="item.supplierFullName"
                :value="item.supplierFullName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记日期" prop="createTime">
            <el-date-picker
              :disabled="!flowStatus"
              v-model="searchForm.createTime"
              type="date" placeholder="选择日期">
            </el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库描述" prop="incomingDescription">
            <el-input
              :disabled="!flowStatus"
              v-model="searchForm.incomingDescription"
              placeholder="请输入入库描述">
            </el-input>
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
              v-model="searchForm.remarks">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上传附件">
            <upload :isClick="!flowStatus" @attachment="getAttachment" :filepathList="filepathList">
            </upload>
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
        size="small" type="primary">下载模版
      </el-button>

      <el-button
        @click="handleImportIncomingDetail"
        icon="el-icon-circle-close"
        size="small"
        type="primary"
        plain class="more" style="height: 32px;">
        <el-upload
          class="upload-demo"
          :headers="headers"
          :action="httpUrls"
          :data="fileName"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-error="handleError"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          multiple :limit="10"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :file-list="newfilepathList">模版导入
        </el-upload>
      </el-button>

      <el-button
        :disabled="!flowStatus"
        @click="handleAddDetails"
        icon="el-icon-circle-close"
        size="small" type="primary">添加明细
      </el-button>
    </div>
    <el-table
      :data="details"
      border class="maintainConTable" ref="maintainConTable" style="width: 100%">
      <el-table-column fixed type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="classifyName" label="固定资产分类" show-overflow-tooltip width="80">
        <!-- <template slot-scope="scope">
                    <span>{{scope.row.flowStatus | setFlowStatus}}</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="materialName" label="固定资产名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="固定资产编码" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="standards" label="固定资产规格" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unit" label="固定资产单位" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
                    <span style="color:#3e75ff" @click="handClickInfo(scope.row)">{{scope.row.docNo}}</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="quantityIn" label="入库数量" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="averagePrice" label="单价(元)" width="100">
      </el-table-column>
      <el-table-column prop="totalPrice" label="金额(元)" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="manufacturer" label="生产厂家或品牌" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="buyTime" label="购置日期" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.buyTime | setYear}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useYear" label="使用年限(年)" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="expireTime" label="使用到期日" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.expireTime | setYear}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personLiable" label="责任人" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="storageLocation" label="存放地点" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            style="color:#3e75ff;"
            @click="handClickEdit(scope.row)"
            type="text" size="small" :disabled="!flowStatus">修改
          </el-button>
          <el-button
            style="color:red;"
            @click="handClickDelet(scope.row)"
            type="text" size="small" :disabled="!flowStatus">删除
          </el-button>
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
            <el-input v-model="detail.classifyName" placeholder="请填写固定资产分类">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产名称" prop="materialName">
            <el-input v-model="detail.materialName" placeholder="请输入固定资产名称">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编码" prop="materialCode">
            <el-input v-model="detail.materialCode" placeholder="请输入固定资产编码">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产规格" prop="standards">
            <el-input v-model="detail.standards" placeholder="请输入固定资产规格">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产单位" prop="unit">
            <el-input v-model="detail.unit" placeholder="请输入固定资产单位">
            </el-input>
          </el-form-item>
          <el-form-item label="入库数量" prop="quantityIn">
            <el-input @change="setMoney" v-model="detail.quantityIn" placeholder="请输入入库数量">
            </el-input>
          </el-form-item>
          <el-form-item label="单价(元)" prop="averagePrice">
            <el-input @change="setMoney" v-model="detail.averagePrice" placeholder="请输入单价(元)">
            </el-input>
          </el-form-item>
          <el-form-item label="金额(元)">
            <el-input v-model="detail.totalPrice" disabled placeholder="请输入金额(元)">
            </el-input>
          </el-form-item>
          <el-form-item label="生产厂家">
            <el-input v-model="detail.manufacturer" placeholder="请输入生产厂家">
            </el-input>
          </el-form-item>
          <el-form-item label="购置日期" prop="buyTime">
            <el-date-picker
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="detail.buyTime"
              type="date" placeholder="选择购置日期">
            </el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
          <el-form-item label="使用年限" prop="useYear">
            <el-input v-model="detail.useYear" placeholder="请输入使用年限">
            </el-input>
          </el-form-item>
          <el-form-item label="使用到期日">
            <el-date-picker
              value-format="yyyy-MM-dd 00:00:00"
              v-model="detail.expireTime"
              type="date" placeholder="选择使用到期日">
            </el-date-picker>
            <!-- <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input> -->
          </el-form-item>
          <el-form-item label="责任人">
            <el-input v-model="detail.personLiable" placeholder="请输入责任人">
            </el-input>
          </el-form-item>
          <el-form-item label="存放地点">
            <el-input v-model="detail.storageLocation" placeholder="请输入存放地点">
            </el-input>
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input type="textarea" placeholder="请输入备注说明" v-model="detail.remarks">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary"
          @click="submitRightModal('rightModalForm')">保存
        </el-button>
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary"
          plain @click="cancelRightModal" class="urgent">取消
        </el-button>
      </div>
    </rightModal>
    <el-dialog
      center
      width="80%"
      title="导入固定资产入库明细"
      :visible.sync="importantVisible" v-if="importantVisible">
      <el-form :rules="model.rules" :model="model" ref="ImportanTableDataFrom">
        <el-table
          :data="model.newfilepathList"
          border
          class="ImportanTableDataFrom"
          ref="ImportanTableDataFrom"
          style="width: 100%">
          <el-table-column fixed type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="classifyName" label="固定资产分类" show-overflow-tooltip width="80">
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].classifyName'"
                :rules="model.rules.classifyName">
                <el-input placeholder="请填写固定资产分类" v-model="scope.row.classifyName">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="materialName" label="固定资产名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].materialName'"
                :rules="model.rules.materialName">
                <el-input placeholder="请填写固定资产名称" v-model="scope.row.materialName">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="materialCode" label="固定资产编码" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].materialCode'"
                :rules="model.rules.materialCode">
                <el-input placeholder="请填写固定资产编码" v-model="scope.row.materialCode">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="standards" label="固定资产规格" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].standards'"
                :rules="model.rules.standards">
                <el-input placeholder="请填写固定资产规格" v-model="scope.row.standards">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="固定资产单位" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].unit'"
                :rules="model.rules.unit">
                <el-input placeholder="请填写固定资产单位" v-model="scope.row.unit">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="quantityIn" label="入库数量" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].quantityIn'"
                :rules="model.rules.quantityIn">
                <el-input @change="changeQuantityIn(scope.row)" placeholder="请填写入库数量" v-model="scope.row.quantityIn">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="averagePrice" label="单价(元)" width="100">
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].averagePrice'"
                :rules="model.rules.averagePrice">
                <el-input @change="changeAveragePrice(scope.row)"
                          placeholder="请填写单价(元)" v-model="scope.row.averagePrice">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="金额(元)" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span @click="a(scope.row)">{{scope.row.totalPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家或品牌" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item label>
                <el-input placeholder="请填写生产厂家或品牌" v-model="scope.row.manufacturer">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="buyTime" width="200" label="购置日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].buyTime'"
                :rules="model.rules.buyTime">
                <el-date-picker
                  @change="changeBuyTime(scope.row)"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  v-model="scope.row.buyTime"
                  type="date"
                  placeholder="选择购置日期"
                ></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="useYear" label="使用年限(年)" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item
                :prop="'newfilepathList[' + scope.$index + '].useYear'"
                :rules="model.rules.useYear">
                <el-input @change="changeUseYear(scope.row)" placeholder="请填写使用年限(年)" v-model="scope.row.useYear">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="expireTime" width="200" label="使用到期日" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item>
                <el-date-picker
                @change="handleExpireTime(scope.row)"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  v-model="scope.row.expireTime"
                  type="date" placeholder="选择使用到期日">
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="personLiable" label="责任人" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item label>
                <el-input placeholder="请填写责任人" v-model="scope.row.personLiable">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="storageLocation" label="存放地点" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item label>
                <el-input placeholder="请填写存放地点" v-model="scope.row.storageLocation">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item label>
                <el-input placeholder="请填写备注" v-model="scope.row.remarks">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="text-align:center;">
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary"
          plain @click="cancelImportanModal" class="urgent">取消
        </el-button>
        <el-button
          icon="el-icon-circle-close"
          size="small"
          type="primary" @click="submitImportanModal('ImportanTableDataFrom')">确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import TitleComponents from "components/titleComponent";
  import RightModal from "components/rightModal/rightModal";
  import {closeRoute} from "mixins";
  import Upload from "components/upload/upload2";

  import {
    createOrgIncoming,
    checkMaterialCode,
    getManagerOrgs,
    getSupplierListAll,
    getWarehouseListAll,
    getIncomingInfo,
    downTemplate,
    updateOrgIncoming,
    getFilepathList,
    importIncomingDetail
  } from "api/fixedAssetsManagement";
  import {formatTime} from "util";
  import httpUrl from "util/config";
  import Auth from "util/auth";

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
      var ModalcheckMaterial = (rule, value, callback) => {
        if (!value) {
          callback(new Error());
        } else {
          checkMaterialCode(value).then(res => {
            if (res.results !== 0) {
              callback(new Error());
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
      var ModalcheckQuantityIn = (rule, value, callback) => {
        if (!value) {
          return callback(new Error());
        } else {
          if (isNaN(value)) {

            return callback(new Error());
          } else if (value <= 0) {

            return callback(new Error());
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
      var ModalcheckAveragePrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error());
        } else {
          if (isNaN(value)) {

            return callback(new Error());
          } else if (value <= 0) {

            return callback(new Error());
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
      var ModalcheckUseYear = (rule, value, callback) => {
        if (!value) {
          return callback(new Error());
        } else if (isNaN(value)) {

          return callback(new Error());
        } else if (value <= 0) {

          return callback(new Error());
        } else {
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
      var ModalcheckBuyTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error());
        } else {
          callback();
        }
      };
      return {
        flowStatus: false,
        httpUrls: httpUrl.mubanUrl,
        headers: {
          "Access-Token": Auth.hasToken() ? Auth.hasToken() : "",
          resource: "P2",
          userId: JSON.parse(Auth.hasUserInfo())
            ? `${JSON.parse(Auth.hasUserInfo()).userId}`
            : ""
        },
        importantVisible: false,
        fileName: {
          fileName: "",
          companyId: Auth.hasUserInfo()
            ? JSON.parse(Auth.hasUserInfo()).companyId
            : ""
        },
        cloneorgId:"",
        newfilepathList: [],
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
            {required: true, message: "请选择公司仓库", trigger: "change"}
          ],
          createTime: [
            {required: true, message: "请选择登记日期", trigger: "change"}
          ],
          incomingDescription: [
            {required: true, message: "请输入入库描述", trigger: "blur"}
          ]
        },
        model: {
          rules: {
            classifyName: [
              {required: true, message: "", trigger: "blur"}
            ],
            materialName: [
              {required: true, message: "", trigger: "blur"}
            ],
            materialCode: [{validator: ModalcheckMaterial, trigger: "blur"}],
            standards: [
              {required: true, message: "", trigger: "blur"}
            ],
            unit: [
              {required: true, message: "", trigger: "blur"}
            ],
            quantityIn: [{validator: ModalcheckQuantityIn, trigger: "blur"}],
            averagePrice: [{validator: ModalcheckAveragePrice, trigger: "blur"}],
            useYear: [
              {
                validator: ModalcheckUseYear,
                trigger: "blur"
              }
            ],
            buyTime: [{validator: ModalcheckBuyTime, trigger: "change"}]
          },
          newfilepathList: []
        },
        rightModalRules: {
          classifyName: [
            {required: true, message: "请填写固定资产分类", trigger: "blur"}
          ],
          materialName: [
            {required: true, message: "请输入固定资产名称", trigger: "blur"}
          ],
          materialCode: [{validator: checkMaterial, trigger: "blur"}],
          standards: [
            {required: true, message: "请输入固定资产规格", trigger: "blur"}
          ],
          unit: [
            {required: true, message: "请输入固定资产单位", trigger: "blur"}
          ],
          quantityIn: [{validator: checkQuantityIn, trigger: "blur"}],
          averagePrice: [{validator: checkAveragePrice, trigger: "blur"}],
          useYear: [
            {
              validator: checkUseYear,
              trigger: "blur"
            }
          ],
          buyTime: [{validator: checkBuyTime, trigger: "change"}]
        },
        showRightModal: false,
        supplierListAll: [],
        warehouseListAll: [],
        managerOrgs: [],
        eventEditRow: {},
        isModelEdit: false,
        id: "",
        type: "",
        filepathList: []
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
      changeManagerOrgs(q) {
         if( this.cloneorgId  && this.details.length){
                  this.$confirm(`切换公司后，之前保存的明细会被删除哦?`, '确定', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      this.cloneorgId = q
                      this.details = []
                      getWarehouseListAll(this.searchForm.orgId).then(res => {
                        this.warehouseListAll = res.results;
                      });
                  }).catch((e) => {
                      this.searchForm.orgId = this.cloneorgId
                      return
                  });
              }else{
                  this.cloneorgId = this.searchForm.orgId
                  getWarehouseListAll(this.searchForm.orgId).then(res => {
                    this.warehouseListAll = res.results;
                  });
              }
        
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
        if (!isNaN(row.buyTime)) {
          this.detail.buyTime = formatTime(row.buyTime);
        }
        if (!isNaN(row.expireTime)) {
          this.detail.expireTime = formatTime(row.expireTime);
        }
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
      _checkMaterialCode() {
      },
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
             let arr1 = this.model.newfilepathList.map(v=>v.materialCode)
          let arr2 = Array.from(new Set(arr1))
          if(arr1.length !== arr2.length){
             this.$message.error("固定资产物资编码不能重复");
                  return
          }
    
     



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
            this._getFilepathList();
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
      getAttachment(val) {
        this.searchForm.attachmentId = val;
        // this.length = val.split(',').length
      },
      //获取上传文件
      _getFilepathList() {
        let fileIds = this.searchForm.attachmentId.split(",");
        let data = {
          fileIds: fileIds
        };
        getFilepathList(data).then(res => {
          this.filepathList = res.results;
          console.log(this.filepathList);
        });
      },
      //模板导入
      handleImportIncomingDetail() {
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      // 文件上传之前
      beforeAvatarUpload(file) {
        this.model.newfilepathList = []
        // this.newfilepathList = []
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 5MB!");
        } else {
          this.importantVisible = true;
        }
        this.fileName.fileName = file.name;
        // this.uploadTitle = '正在上传';
        return isLt2M;
      },
      handleProgress(event, file, fileList) {
        console.log(111);
      },
      //文件上传成功
      handleSuccess(response, file, fileList) {
        if(response.status !== 0){
           this.$message.error("该文件不符合Excel导入标准，请获取Excel导入模板导入");
           return
        }
        console.log(response);
        console.log(file);
        console.log(fileList);
        // fileList.map(item => {
        //   if (item.response) {
        //     item.dataArr = item.response.results.data;
        //   }
        // });                     [{dataArr:[]}]
        // this.newfilepathList = fileList.map(v => v.dataArr)
        this.newfilepathList = fileList[0].response.results.data
        this.model.newfilepathList = JSON.parse(JSON.stringify(this.newfilepathList))
        console.log(this.model.newfilepathList)
        // this.model.newfilepathList.map(v=>{
        //   v.
        // })
        this.$message.success("文件上传成功");
        this.newfilepathList = []
        // fileList = []
      },
      //文件上传失败
      handleError(err, file, fileList) {
        this.$message.error("文件上传失败");
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${
            files.length
            } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      //取消模版弹窗
      cancelImportanModal() {
        this.importantVisible = false;
      },
      //保存模版弹窗
      submitImportanModal(formName) {
        // this.$refs[formName].validate(valid => {
        //   console.log(valid);
        //   if (valid) {
         
         
            let arr = JSON.parse(JSON.stringify(this.model.newfilepathList))
            arr.forEach(v => {
              v.buyTime = v.buyTime ? new Date(v.buyTime).getTime() : ''
              v.expireTime = v.expireTime ? new Date(v.expireTime).getTime() : ''
            });
           this.details =  this.details.concat(arr)
            console.log(this.details)
            this.importantVisible = false;
        //   } else {
        //     console.log("error submit!!");
        //     return false;
        //   }
        // });

      },
      changeAveragePrice(row) {
        if (!row.averagePrice) {

        } else {
          if (isNaN(row.averagePrice)) {
            row.averagePrice = 0;

          } else if (row.averagePrice <= 0) {
            row.averagePrice = 0;

          } else {
             row.totalPrice = Number(row.quantityIn) * Number(row.averagePrice)
          }
        }

      },
      changeQuantityIn(row) {
        if (!row.quantityIn) {

        } else {
          if (isNaN(row.quantityIn)) {
            row.quantityIn = 0;
          } else if (row.quantityIn <= 0) {
            row.quantityIn = 0;

          } else {
             row.totalPrice = Number(row.quantityIn) * Number(row.averagePrice)
            // row.totalPrice = row.quantityIn * row.averagePrice
          }
        }

      },
      changeUseYear(row) {
        if (!row.useYear) {

        } else if (isNaN(row.useYear)) {
          row.useYear = 0

        } else if (row.useYear <= 0) {
          row.useYear = 0

        } else {
          let year = row.buyTime.slice(0, 4);
          let time = row.buyTime.slice(4, 10);
          row.expireTime = Number(year) + Number(row.useYear) + time + " 00:00:00"
          // let t = new Date(
          //   Number(year) + Number(row.useYear) + time + " 00:00:00"
          // );
          // row.expireTime = t.getTime();
          console.log(row.expireTime)
        }

      },
      changeBuyTime(row) {
        if (!row.buyTime) {
        } else {
          let year = row.buyTime.slice(0, 4);
          let time = row.buyTime.slice(4, 10);

          // let t = new Date(
          //   Number(year) + Number(row.useYear) + time + " 00:00:00"
          // );
          row.expireTime =  Number(year) + Number(row.useYear) + time + " 00:00:00" 
          // t.getTime();
          console.log(row.expireTime)
        }
      },
       handleExpireTime(row){
          console.log(row)
         row.expireTime = row.expireTime
          //  let t = new Date(row.expireTime);
          // row[0].expireTime = t.getTime();
          // console.log(row.expireTime)
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
