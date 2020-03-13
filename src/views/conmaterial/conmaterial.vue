<template>
  <div class="conmaterial OrganizationTree">
    <buttonComponent3>
    </buttonComponent3>
    <el-form ref="searchFrom" :model="searchFrom" label-width="80px">
      <el-row :gutter="20">
        <el-col :offset="9" :span="6">
          <el-form-item label="物资名称">
            <el-input placeholder="请输入物资名称" v-model="searchFrom.materialName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物资规格">
            <el-input v-model="searchFrom.standard" placeholder="请输入物资规格"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="padding-top: 4px;" :span="3">
          <el-button type="warning" size="small" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="conmaterialMain">
      <el-col style="height:100%" :span="12">
        <div class="treeInner">
          <div class="top">
            <p class="title">此标准编码库数据来源于《GB/T 50851-2013 建设工程人工材料设备机械数据标准》</p>
            <el-button @click="addCategory('')" class="absolutBtn" size="small" type="primary" icon="el-icon-search">
              添加分类
            </el-button>
          </div>
          <ul class="treeHeader">
            <li class="materialClassification">物资分类</li>
            <li class="classificationNumber">分类编号</li>
            <li class="dataSources">数据来源</li>
            <li class="operating">操作</li>
          </ul>
          <el-tree :data="conmaterialTree" :props="defaultProps"
                   :current-node-key="treeId" node-key="id" ref="tree"
                   @node-click="handleNodeClick" highlight-current>
            <div class="custom-tree-node" :class="'levels'+data.levels"
                 slot-scope="{ node, data }">
              <span class="name1">
                <tooltips :value="data.name">
                </tooltips>
                <!--{{ data.name }}-->
              </span>
              <span class="classifyCode">{{ data.classifyCode }}</span>
              <span class="dataSources">{{ data.dataSources  | dataSourcesFilter}}</span>
              <span class="btn">
                  <el-button type="text" size="mini" @click.stop="addCategory(data)" v-if="data.levels === 1">
                    添加下级
                  </el-button>
                  <el-button type="text" size="mini" @click.stop="editTreeData(data)">
                    修改
                  </el-button>
                  <el-button class="danger" style='color: red;' type="text" size="mini"
                             @click.stop="deleteTreeData(data)">
                    删除
                  </el-button>
                </span>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col style="height:100%" :span="12">
        <div class="tableInner">
          <userTitle
            v-if="excelAddmenuNext"
            :is-add="false"
            :IsImportant="false"
            :IsPrint="false"
            :IsProcess="false"
            :IsMonitor="false">
            <el-button type="primary" v-has="'createMaterialDetail'" icon="el-icon-plus" size="small"
                       @click="handleAddMenuNext">添加明细
            </el-button>
          </userTitle>
          <el-table
            border :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <ul class="tableUL">
                  <li>
                    <span class="title">状态：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">费用类型：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">型号：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">品牌：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">材质：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">指导价：</span><span>{{props.row.createName}}</span>
                  </li>
                  <li>
                    <span class="title">创建人：</span><span>{{props.row.createName}}</span>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              label="物资编码" width="120"
              prop="materialCode" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="物资名称"
              show-overflow-tooltip
              prop="materialName">
            </el-table-column>
            <el-table-column
              label="规格" width="80"
              prop="standard" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="单位" width="80"
              prop="unit" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                 <span
                   style="margin-right:10px;color:#3e75ff"
                   @click.stop="handleUpdateMenuNext(scope.row)"
                   type="text"
                   size="small">
                  修改
                </span>
                <span
                  style="margin-right:10px;color:#3e75ff"
                  @click.stop="handleDeletMenuNext(scope.row)"
                  type="text"
                  size="small">
                  删除
                </span>
                <span
                  style="color:#3e75ff"
                  @click.stop="handClickViewRow(scope.row)"
                  type="text"
                  size="small">
                  查看
                </span>
                <!-- <el-button
                  style="margin-right:10px;color:#3e75ff"
                  @click.native.prevent="handleUpdateMenuNext(scope.row)"
                  type="text"
                  size="small">
                  修改明细
                </el-button>
                <el-button
                  style="margin-right:10px;color:#3e75ff"
                  @click.native.prevent="handleDeletMenuNext(scope.row)"
                  type="text"
                  size="small">
                  删除明细
                </el-button>
                <el-button
                  style="color:#3e75ff"
                  @click.native.prevent="handClickViewRow(scope.row)"
                  type="text"
                  size="small">
                  查看
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <Pagination ref="page" :pageSize="pageSize" :total="total" @sentPages="sentPages"></Pagination>
        </div>
      </el-col>
    </el-row>

    <!--弹窗-->
    <rightModal v-if="isRightModal">
      <div slot="header">
        添加物资分类
      </div>
      <div slot="body">
        <el-form ref="form" :model="classifyFrom" label-width="80px">
          <el-form-item label="物资类别" v-if="parentName">
            <el-input v-model="parentName" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="物资类别">
            <el-input v-model="classifyFrom.classifyName"></el-input>
          </el-form-item>
          <el-form-item label="费用类型">
            <el-select v-model="classifyFrom.costType" placeholder="请选择活动区域">
              <el-option v-for="(item,index) in costTypeList" :key="index" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类说明">
            <el-input v-model="classifyFrom.classifyDiscription"></el-input>
          </el-form-item>
          <el-form-item label="同级排序">
            <el-input v-model="classifyFrom.sorts"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleClickCancel" type="primary" icon="el-icon-search">取消</el-button>
        <el-button type="primary" @click="handleClickSubmit" icon="el-icon-search">保存</el-button>
      </div>
    </rightModal>

    <rightModal v-if="isRightDetailModal">
      <div slot="header">
        添加物资明细
      </div>
      <div slot="body">
        <el-form
          :model="classifyDetailFrom"
          :rules="classifyDetailFromRules"
          ref="classifyDetailFrom"
          style="margin-bottom: 60px" :disabled="isView"
          label-width="120px"
          class="demo-ruleForm">
          <el-form-item label="所属物资分类：" prop="parentClassifyName">
            <el-input v-model="parentClassifyName" clearable disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="费用类型：" prop="costType">
            <el-select
              v-model="classifyDetailFrom.costType"
              clearable size="small"
              placeholder="请选择费用类型">
              <el-option v-for="item in costTypeList" :key="item.dataValue" :label="item.dataName"
                         :value="item.dataValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="明细编号：" prop="materialCode">
            <div style="display: flex;align-items: center;">
              <el-input style="flex:2;" v-if="!isEditMaterialCode" v-model.trim="materialCodeBefore"
                        disabled>
              </el-input>
              <span v-if="!isEditMaterialCode" style="margin: 0 5px;">-</span>
              <el-input style="flex:3;" size="small" :disabled="isEditMaterialCode"
                        v-model.trim="classifyDetailFrom.materialCode" clearable>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="物资名称：" prop="materialName">
            <el-input v-model.trim="classifyDetailFrom.materialName" clearable></el-input>
          </el-form-item>
          <el-form-item label="计量单位:" prop="unit">
            <el-input v-model.trim="classifyDetailFrom.unit" clearable></el-input>
          </el-form-item>
          <el-form-item label="规格:" prop="standards">
            <el-input v-model.trim="classifyDetailFrom.standards" clearable></el-input>
          </el-form-item>
          <el-form-item label="型号:">
            <el-input v-model.trim="classifyDetailFrom.models" clearable></el-input>
          </el-form-item>
          <el-form-item label="品牌:">
            <el-input v-model.trim="classifyDetailFrom.brand" clearable></el-input>
          </el-form-item>
          <el-form-item label="材质:">
            <el-input v-model.trim="classifyDetailFrom.materials" clearable></el-input>
          </el-form-item>
          <el-form-item label="图片:">
            <div class="conmaterial-imgUrlList" style="vertical-align: middle">
              <!-- <el-upload
                v-if="classifyDetailFrom.attachment"
                :action="fileUrl"
                :headers="myHeaders"
                :data="fileName"
                ref="upload"
                multiple
                :limit="5"
                :file-list="imgUrlList"
                :on-error="handleError"
                :on-change="imgPreview"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                  <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                </div>
              </el-upload> -->
              <UploadFile @attachment="getAttachment"

                          :flowStatus="true" :attachment="classifyDetailFrom.attachment"></UploadFile>
              <!-- <img v-else style="width:80px" class="data-pic" src="static/images/no-data.png" alt> -->
            </div>
          </el-form-item>
          <el-form-item label="同级排序:">
            <el-input type="number" v-model.number="classifyDetailFrom.sorts" clearable></el-input>
          </el-form-item>
          <el-form-item label="市场指导价:">
            <el-number
              style="width:100%"
              :maxlength="12"
              :min="0"
              :max="999999999999"
              :precision="2"
              controls-position="right"
              size="small"
              v-model="classifyDetailFrom.guidePrice"
              clearable>
            </el-number>
          </el-form-item>
          <el-form-item label="备注说明:">
            <el-input
              type="textarea" maxlength="250"
              :autosize="{ minRows: 1, maxRows: 1}"
              v-model.trim="classifyDetailFrom.remarks"
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleClickDetailCancel" type="primary" icon="el-icon-search">取消</el-button>
        <el-button type="primary" @click="handleClickDetailSubmit" icon="el-icon-search">保存</el-button>
      </div>
    </rightModal>

  </div>
</template>

<script>
  import ButtonComponent3 from 'components/buttonComponent/buttonComponent3';

  import {
    getconmaterialTree,
    getconmaterialDetailList,
    saveConmaterial,
    editConmaterialInf,
    updateConmaterial,
    saveConmaterialDetail,
    deleteConmaterialDetail,
    updateConmaterialDetail,
    getDefultDetailCode,
    chkStartProject,
    deleteConmaterial,
    getCheckMaterialCode,
    getConmaterialDetailInfo
  } from 'api/conmaterial'
  import {dataDictionary} from 'mixins'
  import rightModal from 'components/rightModal/rightModal'
  import userTitle from 'components/titleComponent/userTitle'
  import Auth from 'util/auth'
  import {Message} from "element-ui";
  import Pagination from 'components/Pagination/Pagination'
  import UploadFile from '../../components/upload/uploadFile'

  export default {
    name: 'conmaterial1',
    mixins: [dataDictionary],
    components: {
      ButtonComponent3, rightModal, userTitle, Pagination, UploadFile
    },
    filters: {
      dataSourcesFilter(val) {
        switch (Number(val)) {
          case 0:
            return "初始库";
          case 1:
            return "自定义";
          default:
            break;
        }
      },
    },
    data() {
      let materialCodeRules = (rule, value, callback) => {
        console.log(2222);
        if (!this.isEditMaterialCode) { // 判断是否修改
          if (value) {
            if (!/^\d{4}$/.test(value)) {
              callback(new Error('请输入四位数字，或不输入为空'));
            } else {
              getCheckMaterialCode(this.materialCodeBefore + value).then(res => {
                if (res.results) {
                  callback(new Error('该编号已存在，请自修改编号'));
                } else {
                  callback()
                }
              })
            }
          } else {
            console.log(1111);
            callback()
          }
        } else {
          callback()
        }
      };
      return {
        searchFrom: {
          materialName: '',
          standard: ''
        },
        conmaterialTree: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        flowStatus: false,
        pageNo: 1,
        pageSize: 9,
        total: 0,
        treeId: '',
        tableData: [],
        classifyFrom: {
          classifyCode: "",
          classifyDiscription: "",
          classifyName: "",
          companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
          costType: "",
          createBy: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '',
          createTime: "",
          dataSources: "1",
          levels: 1,
          parentId: 0,
          sorts: '',
          status: "0",
          updateBy: "",
          updateTime: ""
        },
        classifyDetailFrom: {
          attachment: "",
          averagePrice: '',
          brand: "",
          classifyId: '',
          companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
          costType: "",
          createBy: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '',
          dataSources: "0",
          guidePrice: '',
          id: 0,
          materialCode: "",
          materialName: "",
          materials: "",
          models: "",
          ralationCode: "",
          remarks: "",
          sorts: 0,
          standards: "",
          status: "",
          unit: "",
        },
        parentName: '',
        classifyFromClone: {},
        classifyDetailFromClone: {},
        selectArr: ['costType'],
        isRightModal: false,
        isRightDetailModal: false,
        isEdit: false,
        excelAddmenuNext: false,
        classifyDetailFromRules: {
          classifyName: [
            {required: true, message: "物资类别不能为空", trigger: "blur"}
          ],
          costType: [
            {required: true, message: "费用类型不能为空", trigger: "change"},
          ],
          materialCode: [
            {validator: materialCodeRules, trigger: "blur"},
          ],
          materialName: [
            {required: true, message: "物资名称不能为空", trigger: "blur"}
          ],
          unit: [
            {required: true, message: "计量单位如: 个/件/套/m/kg/㎡/m³等", trigger: "blur"}
          ],
          standards: [
            {required: true, message: "规格不能为空", trigger: "blur"}
          ]
        },
        isEditMaterialCode: true,
        treeClickId: '',
        nodeEvent: '',
        parentClassifyName: '',
        materialCodeBefore: '',
        isView: false
      }
    },
    created() {
      this.classifyFromClone = JSON.parse(JSON.stringify(this.classifyFrom));
      this.classifyDetailFromClone = JSON.parse(JSON.stringify(this.classifyDetailFrom))
    },
    mounted() {
      this._getconmaterialTree();
      this._getDicdataList(this.selectArr)
    },
    methods: {
      getAttachment(ids) {
        this.classifyDetailFrom.attachment = ids;
      },
      //条件树物资分类查询
      _getconmaterialTree() {
        let data = {
          materialName: ''
        }
        getconmaterialTree(data).then(res => {
          // let arr = [];
          // for(let i in res.results){
          //     let item = res.results[i]
          //     let child = item.children
          //     arr.push({
          //         label:item.name,
          //         children:
          //     })
          // }
          this.conmaterialTree = res.results;
          if (this.conmaterialTree.length) {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.conmaterialTree[0].id);
            })
            this.handleNodeClick(this.conmaterialTree[0]);
          } else {
            this.excelAddmenuNext = false
          }
        })
      },
      handleNodeClick(data) {
        console.log(data);
        this.excelAddmenuNext = true;
        this.treeId = data.id;
        if (data.levels === 1) {
          this.materialCodeBefore = data.classifyCode + '00';
        } else {
          this.materialCodeBefore = data.classifyCode;
        }
        this.classifyDetailFrom.classifyId = data.id;
        this.parentClassifyName = data.name;
        this.$refs.page.setCurrentPage()
        this._getconmaterialDetailList();
      },
      //分页查询物资明细记录
      _getconmaterialDetailList() {
        let data = {
          ...this.searchFrom,
          classifyName: "",
          companyId: Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '',
          id: this.treeId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getconmaterialDetailList(data).then(res => {
          let conmaterialDetailList = res.results;
          this.tableData = conmaterialDetailList.conMaterialDetailDto;
          this.total = conmaterialDetailList.total;
        })
      },
      //查看
      handClickViewRow() {

      },
      // 添加分类
      addCategory(data) {
        console.log(data)
        //添加下级
        if (data) {
          this.classifyFrom.levels = Number(data.levels) + 1;
          this.classifyFrom.parentId = data.id;
          this.parentName = data.name;
          console.log(this.name);
        } else {
          this.classifyFrom.levels = 1;
          this.classifyFrom.parentId = 0;
          this.parentName = '';
        }
        this.isEdit = false;
        this.isRightModal = true;
      },
      // 修改
      editTreeData(data) {
        console.log(data);
        this.nodeEvent = data;
        editConmaterialInf(data.id).then(res => {
          this.classifyFrom = res.results;
          delete this.classifyFrom.children;
          console.log(this.classifyFrom);
          this.isRightModal = true;
          this.isEdit = true;
          this.treeClickId = data.id
        })
      },
      //删除分类
      deleteTreeData(row) {
        console.log(row)
        chkStartProject(this.classifyFrom.companyId).then(res => {
          // if (res.results) {
          //   Message({
          //     message: "已存在启动项目, 不允许删除分类",
          //     type: "error"
          //   });
          //   return
          // }
          this.$confirm(`您确定删除${row.name}吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "放弃"
          }).then(() => {
            deleteConmaterial(row.id, this.classifyFrom.createBy).then(ret => {
              if (ret.status === 0) {
                this.$message.success('物资分类删除成功');
                if (this.treeId === row.id) {
                  this.tableData = [];
                }
                this.$refs.tree.remove(row);
              } else {
                this.$message.error(ret.errorMessage);
              }
            })
          }).catch((e) => {
          });
        })
      },
      //保存物资分类
      handleClickSubmit() {
        let submitFun = this.isEdit ? updateConmaterial : saveConmaterial;
        let msg = this.isEdit ? '修改' : '添加';
        submitFun(this.classifyFrom).then(res => {
          if (res.status === 0) {
            if (this.isEdit) {
              this._updateKeyChildren(this.classifyFrom)
            } else {
              this._getconmaterialTree();
            }
            this.$message.success(msg + '分类成功');
          } else {
            this.$message.error(res.errorMessage);
          }
          this.handleClickCancel();
        })
        // if (this.isEdit) {
        //   updateConmaterial(this.classifyFrom).then(res => {
        //     if (res.status === 0) {
        //       this._getconmaterialTree();
        //       this.handleClickCancel();
        //     }
        //   })
        // } else {
        //   saveConmaterial(this.classifyFrom).then(res => {
        //     if (res.status === 0) {
        //       this._getconmaterialTree();
        //       this.handleClickCancel();
        //     }
        //   })
        // }
      },
      _updateKeyChildren(form) {
        console.log(form);
        this.$set(this.nodeEvent, 'name', form.classifyName);
        this.$set(this.nodeEvent, 'costType', form.costType);
        this.$set(this.nodeEvent, 'classifyDiscription', form.classifyDiscription);
        this.$set(this.nodeEvent, 'sorts', form.sorts);
        // this.$refs.tree.updateKeyChildren(id, form)
      },
      // 保存物资明细
      handleClickDetailSubmit() {
        let submitFun = this.isEditMaterialCode ? updateConmaterialDetail : saveConmaterialDetail;
        let msg = this.isEditMaterialCode ? '修改' : '添加';
        let classifyDetailFrom = JSON.parse(JSON.stringify(this.classifyDetailFrom));
        if (!this.isEditMaterialCode) {
          classifyDetailFrom.materialCode = this.materialCodeBefore + this.classifyDetailFrom.materialCode;
        }
        submitFun(classifyDetailFrom).then(res => {
          if (res.status === 0) {
            this.$message.success(msg + '物资明细成功');
            this._getconmaterialDetailList();
          } else {
            this.$message.error(res.errorMessage);
          }
          this.handleClickDetailCancel();
        })
      },
      //取消物资分类
      handleClickCancel() {
        this.isRightModal = false;
        this.classifyFrom = JSON.parse(JSON.stringify(this.classifyFromClone))
      },
      //取消物资明细
      handleClickDetailCancel() {
        this.isRightDetailModal = false;
        this.classifyDetailFrom = JSON.parse(JSON.stringify(this.classifyDetailFromClone));
        this.isView = false;
      },
      // 添加物资明细
      handleAddMenuNext() {
        getDefultDetailCode(this.treeId).then(res => {
          this.isEditMaterialCode = false;
          // this.imgUrlList = [];
          this.isRightDetailModal = true;
          // this.isEdittButtonMenu = false;
          this.classifyDetailFrom.materialCode = res.results;
        })
      },
      // 修改明细
      handleUpdateMenuNext(row) {
        getConmaterialDetailInfo(row.id).then(res => {
          if (res.status === 0) {
            this.isEditMaterialCode = true;
            this.isRightDetailModal = true;
            this.classifyDetailFrom = JSON.parse(JSON.stringify(res.results));
          } else {
            this.$message.error(res.errorMessage);
          }
        })
        //       let data = {
        //           "attachment": "string",
        // "averagePrice": 0,
        // "brand": "string",
        // "classifyId": 0,
        // "companyId": 0,
        // "costType": "string",
        // "createBy": 0,
        // "createTime": "2020-01-07T03:26:40.487Z",
        // "dataSources": "string",
        // "guidePrice": 0,
        // "id": 0,
        // "materialCode": "string",
        // "materialName": "string",
        // "materials": "string",
        // "models": "string",
        // "ralationCode": "string",
        // "remarks": "string",
        // "sorts": 0,
        // "standards": "string",
        // "status": "string",
        // "unit": "string",
        // "updateBy": 0,
        // "updateTime": "2020-01-07T03:26:40.487Z"
        //       }
      },
      // 删除明细
      handleDeletMenuNext(row) {
        this.$confirm(`您确定删除${row.materialName}吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "放弃"
        }).then(() => {
          deleteConmaterialDetail(row.id, this.classifyDetailFrom.createBy).then(res => {
            if (res.status === 0) {
              this._getconmaterialDetailList()
              //  let index = this.tableData.findIndex(v=>v.id === row.id)
              //  if(index>=0){
              //      this.tableData.splice(index,1)
              this.$message.success('物资明细删除成功');
              //  }
            } else {
              this.$message.error(res.errorMessage);
            }
          })
        }).catch((e) => {
        });

      },
      // 查看
      handClickViewRow(row) {
        getConmaterialDetailInfo(row.id).then(res => {
          if (res.status === 0) {
            this.isEditMaterialCode = true;
            this.isView = true;
            this.isRightDetailModal = true;
            this.classifyDetailFrom = JSON.parse(JSON.stringify(res.results));
          } else {
            this.$message.error(res.errorMessage);
          }
        })
      },
      sentPages(val) {
        this.pageNo = val;
        this._getconmaterialDetailList()
      }
    }
  }
</script>
<style scoped lang="scss">
  .conmaterial {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    .conmaterialMain {
      flex: 1;
      overflow: hidden;
      .el-tree-node__content {
        width: 100%;
      }
      .treeInner {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 0 10px;
        font-size: 14px;
        .top {
          display: flex;
          margin-bottom: 10px;
          .title {
            flex: 1
          }
          .absolutBtn {
            width: 100px
          }
        }
        .treeHeader {
          width: 100%;
          border-top: 1px #eee solid;
          border-right: 1px #eee solid;
          border-bottom: 1px #eee solid;
          height: 40px;
          line-height: 40px;
          background: #fafafa;
          li {
            text-align: center;
            // line-height: 30px;
            // height: 30px;
            float: left;
            border-left: 1px #eee solid;
            border-bottom: 1px #eee solid;
          }
          .materialClassification {
            width: calc(100% - 320px);
          }
          .classificationNumber {
            width: 100px;
          }
          .dataSources {
            width: 100px
          }
          .operating {
            width: 120px;
          }
        }
        .custom-tree-node {
          width: 100%;
          line-height: 28px;
          .name1 {
            width: calc(100% - 322px) !important;
            max-width: calc(100% - 322px) !important;
            /*background: pink;*/
          }
          .classifyCode {
            width: 100px !important;
            text-align: center;
          }
          .dataSources {
            width: 100px !important;
            text-align: center;
          }
          .btn {
            width: 120px !important;
            text-align: right;
          }
        }
      }
      .tableInner {
        width: 100%;
        height: 100%;
        /*overflow-y: auto;*/
      }
    }
  }
</style>
