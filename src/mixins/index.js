import axios from 'axios'
import Auth from 'util/auth'
import {toQfw, formatYear, formatTime} from "util";
import QuickWarehouse from '../util/quickWarhouseDeatil'
import {getDicdataList} from 'api/dataDictionary'
import Page from 'components/Pagination/page'
import {downloadFile} from 'api/home/home'
import {getProjectListHouse} from 'api/warehouseManagement/warehousing'
import processWindow from '../components/processWindow/processWindow'
import processWindow_detail from '../components/processWindow/processWindow_detail'
import processWindow2 from '../views/home/component/processWindow/processWindow'
import processWindow_detail2 from '../views/home/component/processWindow/processWindow_detail'
import FootComponent from 'components/footComponent'
//
import {
  getContractInandoutInfo,
  getWorkflowFormStatus,
  returnWorkflowFormTask,
  returnStartWorkflowFormTask,
  deleteProcessNode,
  deleteProcessNodeAndData
} from 'api/home/home'
//打印
import {
  createPrintModel,
  resetPrintModel,
  getPrintModelShowList,
  getPrintModelProcessList,
  getPrintModelSortList,
  getPrintModelFootList,
  getPrintModelTaskIdFootList
} from 'api/printDesign'
import Sortable from 'sortablejs'



// 关闭页面回到查询页面
export const closeRoute = {
  data() {
    return {
      menusList: [],
      lastRouteName: '',
      selectTableList: [],

      // 仓库模块  切换前确认
      oldProjectId: '',
      oldWarehouseId: ''
    }
  },
  computed: {
    menuId() {
      let name = this.$route.name;
      let index = this.menusList.findIndex(v => name.indexOf(v.name) >= 0);
      // console.log(index);
      // console.log(this.menusList);
      return index >= 0 ? this.menusList[index].id : 0;
    },
    tagNavList() {
      return this.$store.state.tagNav.cachedPageList
    }
  },
  created() {
    this.getMenusLis();
  },
  methods: {
    getMenusLis() {
      this.menusList = [];
      let menusArr = Auth.getObjArr();
      for (let i in menusArr) {
        let item = menusArr[i];
        if (item.children && item.children.length) {
          for (let j in item.children) {
            let child = item.children[j];
            this.menusList.push(child);
          }
        }
      }
    },
    // 关闭当前页面
    setRoute() {
      let index = this.tagNavList.findIndex(v => v.name === this.$route.name);
      let item = this.tagNavList[index];
      this.lastRouteName = this.$route.meta.lastRouteName;
      if (this.tagNavList.some(v => v.name === this.lastRouteName)) {
        let timestamp = new Date();
        let freshRouterObj = {
          timestamp,
          lastRouteName: this.lastRouteName
        };
        this.$store.commit('tagNav/setFreshRouterObj', freshRouterObj);
      }
      this.closeTheTag(item, index);
    },
    closeTheTag(item, index) {
      this.$store.commit('tagNav/removeTagNav', item);
      if (item.path === this.$route.path) {
        this.$router.push(this.tagNavList[index - 1].path);
      }
    },
    //取消保存
    cancelProjectFrom() {
      this.setRoute();
    },
    // 获取仓库数据
    getQuickWarehouseDetail(item, method) {
      // return this// => new QuickWarehouse
      // console.log(new QuickWarehouse(item, method));
      return new QuickWarehouse(item, method)
    },
    // 获取附件
    getAttachment(val) {
      this.projectForm.attachmentId = val;
    },
    //选择明细表格数据
    handleSelectionChange(val) {
      this.selectTableList = val;
    },
    //// 仓库模块数据

    // 获取仓库数据
    _getProjectListHouse() {
      if (!this.projectForm.projectId) return;
      getProjectListHouse(this.projectForm.projectId).then(res => {
        this.warehouseList = res.results;
      })
    },
    // 设置项目经理和获取orgId
    setProjectData(val) {
      let index = this.ProjectsList.findIndex(v => v.id === val);
      if (index >= 0) {
        this.oldProjectId = val;
        this.pmName = this.ProjectsList[index].pmName;
        this.projectForm.orgId = this.ProjectsList[index].orgId;
      }
    },
    //切换仓库
    changeWarehouse(val) {
      let flag = this.oldWarehouseId && this.tableData.length;
      if (!flag) {
        this.oldWarehouseId = val;
        return;
      }
      this.$confirm(`切换仓库将会删除明细数据,保存后生效`, '切换仓库', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData = [];
        this.oldWarehouseId = val;
      }).catch((e) => {
        this.projectForm.warehouseId = this.oldWarehouseId;
      });
    },
    // 明细批量删除
    handleBatchDeletion() {
      if (this.selectTableList.length === 0) {
        this.$message({
          message: '请选择所要删除数据',
          type: 'error'
        });
        return
      }
      this.$confirm(`此操作将永久删除明细数据, 是否删除?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectTableList.forEach(item => {
          this.tableData.splice(this.tableData.indexOf(item), 1)
        });
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.$refs.tableData.clearSelection();
      }).catch((e) => {
        // console.log(e);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //选择明细
    selectDetail() {
      if (!this.projectForm.projectId || !this.projectForm.warehouseId) {
        this.$message({
          message: '请选择项目名称 和仓库名称',
          type: 'warning'
        });
        return
      }
      this.tableSele = JSON.parse(JSON.stringify(this.tableData));
      this.modalFlag = true;
    },
    //取消弹窗
    getCancelModal() {
      this.modalFlag = false;
    },

  }
}


// 刷新 已缓存的页面
export const freshRouter = {
  inject: ['reload'],
  data() {
    return {
      menusList: [],
      selectionList: [],
      selectionAgainList: [],
    }
  },
  components: {
    Page
  },
  computed: {
    freshRouterObj() {
      // console.log(this.$store.state.tagNav.freshRouterObj);
      // return this.$store.state.tagNav.cachedPageList
      return this.$store.state.tagNav.freshRouterObj;
    },
    menuId() {
      let name = this.$route.name;
      let index = this.menusList.findIndex(v => name.indexOf(v.name) >= 0);
      // console.log(index);
      // console.log(this.menusList);
      return index >= 0 ? this.menusList[index].id : 0;
    },
  },
  watch: {
    freshRouterObj: {
      handler() {
        if (!this.freshRouterObj) return;
        if (this.freshRouterObj.lastRouteName === this.$route.name) {
          this.reload();
        }
      },
      deep: true
    }
  },
  created() {
    this.getMenusLis();
  },
  methods: {
    // 获取menu数组
    getMenusLis() {
      this.menusList = [];
      let menusArr = Auth.getObjArr();
      for (let i in menusArr) {
        let item = menusArr[i];
        if (item.children && item.children.length) {
          for (let j in item.children) {
            let child = item.children[j];
            this.menusList.push(child);
          }
        }
      }
    },
    // 判断是否本人
    judgeIsOneself(row) {
      let userId = JSON.parse(Auth.hasUserInfo()).userId;
      return userId === row.createBy;
    },
    editErrorTips(errorTips) {
      this.$message.error('不是本人创建的数据，不能' + errorTips);
    },
    // 跳转页面
    changeRouter(id, type, name) {
      let titleObj = {add: '添加', edit: '修改', info: '查看'};
      let title = titleObj[type];
      id = this.Base64.encode(id);
      type = this.Base64.encode(type);
      let RouteTitle = {name: name, title: this.$route.meta.title + title};
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitle));
      this.$router.push(`/${name}/${type}/${id}`);
    },
    // 删除数据
    deleteData(row, deletefun, callback) {
      if (!this.judgeIsOneself(row)) {
        this.editErrorTips('删除');
        return
      }
      this.$confirm(`此操作将永久删除${this.$route.meta.title}数据, 是否删除?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletefun(row.id).then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: this.$route.meta.title + '删除成功'
            })
            callback();
           
          }
        })
      }).catch((e) => {
        // console.log(e);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 删除数据
    deleteData2(row, deletefun, callback) {
      if (!this.judgeIsOneself(row)) {
        this.editErrorTips('删除');
        return
      }
      this.$confirm(`此操作将永久删除此条数据, 是否删除?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletefun(row.id).then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            callback();
          }
        })
      }).catch((e) => {
        // console.log(e);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //点击单选框
    handleSelectionChange(selection) {
      // console.log(selection);
      if (selection.length > 1) {
        this.$refs.maintainConTable.clearSelection();
        this.$refs.maintainConTable.toggleRowSelection(selection[selection.length - 1], true);
        this.selectionList = [selection[selection.length - 1]];
      } else {
        this.selectionList = selection;
      }
      // console.log(selection);
      // console.log(row)
      // this.$refs.maintainConTable.clearSelection();
      // if (selection.length === 0) { // 判断selection是否有值存在
      //   return;
      // }
      // // console.log('点击', selection, row);
      // this.$refs.maintainConTable.toggleRowSelection(row, true);
      // this.selectionList.push(row);
      // console.log(this.selectionList)
    },
    // 点击整行
    rowClick(row) {
      this.$refs.maintainConTable.clearSelection();
      this.$refs.maintainConTable.toggleRowSelection(row, true);
    }


  }
}

export const dataDictionary = {
  data() {
    return {
      aa: '',
      DicdataList: [
        {id: 14, name: '流程状态', flg: 0, code: 'flowStatus'},
        {id: 15, name: '季度需求', flg: 0, code: 'seasonStatus'},
        {id: 16, name: '采购供应方式', flg: 0, code: 'curementStatus'},
        {id: 35, name: '税率', flg: 1, code: 'taxRate'},
        {flg: 1, name: '供应商类型', id: 22, code: 'property'},
        {flg: 1, name: '供应商等级', id: 23, code: 'level'},
        {flg: 0, name: '是否合格', id: 24, code: 'appraiseStatus'},
        {flg: 1, name: '评价等级', id: 25, code: 'appraiseLevels'},
        {flg: 0, name: '费用类型', id: 39, code: 'costType'},
      ],
      flowStatusList: [],//流程状态
      seasonStatusList: [],//季度需求
      curementStatusList: [],//采购供应方式
      taxRateList: [],//税率
      propertyList: [],//供应商类型
      levelList: [],//供应商等级
      appraiseStatusList: [],//是否合格
      appraiseLevelsList: [],//评价等级
      costTypeList: [],//费用类型
      

    }
  },
  created() {
    // this._getDicdataList()
  },
  computed: {
    companyId() {
      return Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : ''
    }
  },
  methods: {
    //获取下拉框数据
    async _getDicdataList(arr) {
      // console.log(arr)
      for (let i in arr) {
        let arrCode = arr[i];
        let index = this.DicdataList.findIndex(v => v.code === arrCode);
        if (index >= 0) {
          let item = this.DicdataList[index];
          await getDicdataList(item.id, this.companyId, item.flg).then(res => {
            this[item.code + 'List'] = res.results;
          })
        }
      }
    },
    // 下载图片资源
    downFilePath(row) {
      let fileName = row.fileName;
      downloadFile(row.id).then(res => {
        let url = window.URL.createObjectURL(new Blob([res]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click()
      }).catch(e => {
        // console.log(e)
      })
    },
    judgeDataList(id, str) {
      // console.log(this[str + 'List'])
      let index = this[str + 'List'].findIndex(v => v.dataValue === id);
      if (index < 0) return;
      return this[str + 'List'][index].dataName;
    },

  }
}

export const processMix = {
  components: {
    processWindow_detail, processWindow
  },
  data() {
    return {
      processName: 'processWindow_detail',
      dialogVisible: false, // 流程显示弹窗控制
      processObj: '',
      processTitle: '',
      processWidth: '80%',
      processTop: '10vh',
    }
  },
  methods: {
    getIsCancle() {
      this.dialogVisible = false;
    },
    setProcess() {
      if (this.selectionList.length === 0) {
        this.$message.error('请您先选中想要提交流程的一行数据');
        return
      }
      if (this.selectionList[0].flowStatus === '01') {
        this.$message.error("本流程在审批中");
        return
      }
      if (this.selectionList[0].flowStatus === '02') {
        this.$message.error({
          message: "本流程在已审批中",
          type: "info"
        });
        return
      }
      getStartNodeAssigneeUsers().then(res => {
        let results = res.results;

      })
    },
    //流程监控
    handleMoniter() {
      if (this.selectionList.length === 0) {
        this.$message.error('请您先选中想要流程监控的一行数据');
        return
      }
      if (!this.selectionList[0].taskId) {
        this.$message.error('该行数据还没有提交流程');
        return
      }
      this.$store.commit('user/setTaskId', this.selectionList[0].taskId);
    },
    // 打印
    handlePrint() {
      if (this.selectionList.length === 0) {
        this.$message.error('请您先选中想要打印一行数据');
        return
      }
      if (!this.selectionList[0].taskId) {
        this.$message.error('该行数据还没有提交流程');
        return
      }
      let printModelCode = Base64.encode('warInAndOut');
      let taskId = Base64.encode(this.selectionList[0].taskId);  // 模板
      let id = Base64.encode(this.selectionList[0].id);
      this.$router.push(`printDesign/${printModelCode}/${taskId}/${id}`)
    }
  }
}

export const processMix2 = {
  components: {
    processWindow_detail2, processWindow2
  },
  data() {
    return {
      processName: 'processWindow_detail2',
      dialogVisible: false, // 流程显示弹窗控制
      processObj: '',
      processTitle: '',
      processWidth: '80%',
      processTop: '10vh',
    }
  },
  methods: {
    getIsCancle() {
      this.dialogVisible = false;
    },
    setProcess() {
      getStartNodeAssigneeUsers().then(res => {
        let results = res.results;

      })
    },
    //流程监控
    handleMoniter() {
      if (this.selectionList.length === 0) {
        this.$message.error('请您先选中想要流程监控的一行数据');
        return
      }
      if (!this.selectionList[0].taskId) {
        this.$message.error('该行数据还没有提交流程');
        return
      }
      this.$store.commit('user/setTaskId', this.selectionList[0].taskId)
    }
  }
}

export const printTemplate = {
  components: {
    FootComponent
  },
  data() {
    return {
      h4Style: 'color: red;text-align: center;font-size: 18px;',
      h4StylePay: 'color: red;font-size: 18px;display: inline-block;font-weight: bold;',
      h4StylePayTitle: 'color: red;text-align: left;padding-left: 10px;font-size: 18px;font-weight: bold;border-right: 1px solid #000;',
      h3Style: 'width: 33%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;',
      h3Style1: 'width: 31.5%;text-align: left;padding-left: 5px;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;vertical-align: middle;',
      h3Style2: 'width: 100%;text-align: center;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;',
      pStyle: "font-weight: bold;padding-left: 15px;text-align: left;font-size: 14px; color: #333333;",
      tableTdStyle: 'padding: 5px 0;text-align: center;border: 1px solid #333333;font-size: 14px;',
      tableTdStyle1: 'padding: 5px 0;text-align: center;font-size: 14px;vertical-align: middle;',
      tableConsStyle: "width: 100%;padding: 0 1%;margin: 0px 0 20px 0;font-size: 14px;color: #606266;",
      tableConsStyle1: "width: 100%;padding: 0;margin: 0px 0 20px 0;font-size: 14px;color: #606266;",
      printContentStyle: "width: 100%;padding: 0px 1%;margin: 10px 0;border: 1px solid #ebeef5;",
      tablePstyle: 'font-weight: bold;width: 100%;text-indent: 5px;border: 1px solid #333333;border-bottom: 0;',
      footStyle3: 'width: 33%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      footStyle2: 'width: 50%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      footStyle1: 'width: 100%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      customTable1: 'width: 100%;display:block;float: left;border-top: 1px solid #333333;border-bottom: 1px solid #333333;margin-top: -1px;',
      customTable2: 'width: 50%;display:block;float: left;border-top: 1px solid #333333;border-bottom: 1px solid #333333;margin-top: -1px;',
      customTableList: 'width:50%;border-right:1px solid #333333;padding: 5px 0;font-size: 14px;word-wrap : break-word ;',
      customTableSupList: 'width:25%;border-right:1px solid #333333;padding: 5px 0;font-size: 14px;word-wrap : break-word ;',
      signPicStyle: "height: 50px;position: absolute;top:0;vertical-align: middle;",
      printFooterList: [
        {
          id: 1,
          defaultFlag: false,
          flag: false,
          columnName: "打印人",
          columnValue: JSON.parse(Auth.hasUserInfo()).userName,
          columnCode: 'printName',
          status: 0
        },
        {
          id: 2,
          defaultFlag: true,
          flag: true, columnName: "页码", columnValue: '第x页/共x页', columnCode: 'page', status: 0
        },
        {
          id: 3,
          defaultFlag: false,
          flag: false,
          columnName: "打印时间",
          columnValue: '',
          columnCode: 'printTime',
          status: 0
        },
      ],
      formCode: '',
      taskId: '',
      id: '',
      printBottomList: [],
      sortable: null,
      isPrint: false,
      formLabelWidth: '100',
      dialogFormVisibleFoot: false,
      footForm: {},
      footFormClone: {},
      rules: {
        columnName: [
          {required: true, message: '表尾字段名称不能为空', trigger: 'blur'}
        ],
      },
      currentIndex: '',
      lastRouteName: '',
      tableData: [],
      warehouseList:[]
    }
  },
  computed: {
    tagNavList() {
      return this.$store.state.tagNav.cachedPageList
    }
  },
  // props: {
  //   isPrint: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  created() {
    let params = this.$route.params;
    this.formCode = Base64.decode(params.formCode);
    this.taskId = Base64.decode(params.taskId);
    this.id = Base64.decode(params.id);

    if (this.taskId === 'template') {
      this._getPrintModelFootList();
      this.isPrint = false;
    } else {
      this._getPrintModelTaskIdFootList();
      this.isPrint = true;
    }
  },
  methods: {
    //获取打印模版的foot字段
    _getPrintModelFootList() {
      getPrintModelFootList(this.formCode).then(res => {
        this.printBottomList = this.setFooterList(res.results);
        this._getPrintModelShowList();
      })
    },
    // 获取审批打印模版的foot字段
    _getPrintModelTaskIdFootList() {
      getPrintModelTaskIdFootList(this.taskId).then(res => {
        this.printBottomList = this.setFooterList(res.results);
        this._getPrintModelShowList();
      })
    },
    _getPrintModelShowList() {
      getPrintModelShowList(this.formCode).then(ret => {
        let results = ret.results;
        let addList = results.filter(v => v.isAdd === 0);//新增
        for (let i in addList) {
          let item = addList[i];
          let index = results.findIndex(v => v.columnCode === item.columnCode);
          if (index >= 0) {
            item.flag = results[index].isShow === 0;
            item.columnValue = item.columnValue ? item.columnValue : results[index].columnDefaultValue;
            this.printBottomList.push(item);
          }
        }
        // this.printBottomList = this.printBottomList.push(...addList);
        this.setShowList(results, this.printMainList);
        this.setShowList(results, this.list);
        this.setShowList(results, this.processList);
        this.setShowList(results, this.printBottomList);
        // console.log(this.printBottomList);
        this.setShowList(results, this.printFooterList);
        this._getPrintModelSortList();
      })
    },
    _getPrintModelSortList() {
      getPrintModelSortList(this.formCode).then(res => {
        let results = res.results;
        this.setSortList(results, this.processList, 'head');
        this.setSortList(results, this.list, 'body');
        this.setSortList(results, this.printBottomList, 'foot');
        this.setSortList(results, this.printFooterList, 'body');
        if (this.isPrint) {
          this._getInandoutInfo();

          return;
        }
        this.handleSortTable();
      })
    },
    // 打印页面时 获取主表数据
    setMainInfo(results) {
      for (let key in results) {
        let index = this.processList.findIndex(v => v.columnCode === key);
        if (index >= 0) {
          this.processList[index].columnValue = results[key];
          if (this.processList[index].type === 'time') {
            this.processList[index].columnValue = formatYear(results[key]);
          }
          if (this.processList[index].type === 'money') {
            this.processList[index].columnValue = toQfw(results[key]);
          }
          if (this.processList[index].type === 'taxRate') {
            this.processList[index].columnValue = results[key] * 100;
          }
          // if (this.processList[index].columnCode === 'warehouseId') {
          //   this.processList[index].columnValue = this._getProjectWarehouseList(results[key]);
          // }
        }
      }
      // console.log(this.processList)
      
    },
    // 打印页面时 获取明细数据
    setDetailList(arr) {
      for (let i in arr) {
        let item = arr[i];
        let obj = {};
        for (let j in this.list) {
          let child = this.list[j];
          if (child.flag && !obj[child.columnCode]) { //projectName
            obj[child.columnCode] = item[child.columnCode] !== null ? toQfw(item[child.columnCode]) : '';
            if (child.type === 'time') {
              obj[child.columnCode] = formatYear(item[child.columnCode]);
            }
            if (child.type === 'money') {
              obj[child.columnCode] = toQfw(item[child.columnCode]);
            }
            if (child.type === 'taxRate') {
              obj[child.columnCode] = item[child.columnCode] * 100 ;
            }
          }
        }
        this.tableData.push(obj);
      }
    },
    //设置底部数组
    setFooterList(arr) {
      for (let i in arr) {
        let item = arr[i];
        item.flag = true;
        item.flag = true;
        item.columnValue = ``;
        item.status = 0;
        item.isAdd = 1; //不是新增
      }
      return arr
    },
    //判断是否显示
    setShowList(arr, setArr) {
      for (let i in  setArr) {
        let item = setArr[i];
        let index = arr.findIndex(v => v.columnCode === item.columnCode);
        if (index >= 0) {
          item.flag = arr[index].isShow === 0;
          item.columnValue = item.columnValue ? item.columnValue : item.columnDefaultValue;
        }
      }
    },
    // 设置选中
    handleSetFlag(item, flag) {
      // console.log(item)
      // console.log(flag)
      this.$set(item, 'flag', flag);
    },
    //排序
    setSortList(arr, setArr, part) {
      let list = arr.filter(v => v.printModelPartCode === part);
      for (let i in setArr) {
        let item = setArr[i];
        let index = list.findIndex(v => v.columnCode === item.columnCode);
        if (index >= 0) {
          item.sort = arr[index].sort;
        }
      }
      setArr = setArr.sort(this.compare);
    },
    //排序比较
    compare(pre, next) {
      let preSort = pre.sort;
      let nextSort = next.sort;
      if (preSort > nextSort) {
        return 1;
      } else if (preSort < nextSort) {
        return -1;
      } else {
        return 0;
      }
    },
    // 拖拽排序
    handleSortTable() {
      this.$nextTick(() => {
        // this.rowDrop('printHeadTable', this.processList);
        // this.rowDrop('printListTable', this.list);
        // this.rowDrop('printBottomTable', this.printBottomList);
        // this.rowDrop('printFooterTable', this.printFooterList);
        this.setSort('printHeadTable', 'processList');
        this.setSort('printListTable', 'list');
        this.setSort('printBottomTable', 'printBottomList');
        this.setSort('printFooterTable', 'printFooterList');
      });
      // this.rowDrop();
    },
    setSort(className, getArr) {
      const el = document.querySelectorAll(`.${className}>.el-table__body-wrapper > table > tbody`)[0];
      // console.log(el);
      if (!el) return;
      // Sortable.create(el, {
      //   ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
      //   setData: function (dataTransfer) {
      //     dataTransfer.setData('Text', '')
      //     // to avoid Firefox bug
      //     // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      //   },
      //   onEnd({newIndex, oldIndex}) {
      //     const currRow = arr.splice(oldIndex, 1)[0];
      //     arr.splice(newIndex, 0, currRow);
      //   }
      // })
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this[getArr].splice(evt.oldIndex, 1)[0];
          this[getArr].splice(evt.newIndex, 0, targetRow);
          // console.log(this[getArr]);
          // this.$forceUpdate();
        }
      })

    },
    Preservation() {
      let printModelDetailShowCreateDtos = [];
      let printModelSortCreateDtos = [];
      this.saveDataArr(this.printMainList, printModelSortCreateDtos, printModelDetailShowCreateDtos, 'title')
      this.saveDataArr(this.list, printModelSortCreateDtos, printModelDetailShowCreateDtos, 'body')
      this.saveDataArr(this.processList, printModelSortCreateDtos, printModelDetailShowCreateDtos, 'head')
      for (let i in this.printBottomList) {
        let item = this.printBottomList[i];
        printModelSortCreateDtos.push({
          printColumnCode: item.columnCode,
          sortPart: 'foot'
        })
        if (!item.flag && item.status === 0) {
          printModelDetailShowCreateDtos.push({
            columnCode: item.columnCode,
            columnName: '',
            columnValue: '',
            isAdd: 1,
            isShow: 1
          })
        }
        if (item.status === 1) {
          printModelDetailShowCreateDtos.push({
            columnCode: item.columnCode,
            columnName: item.columnName,
            columnValue: item.columnValue,
            isAdd: 0,
            isShow: item.flag ? 0 : 1
          })
        }


      }
      this.saveDataArr(this.printFooterList, printModelSortCreateDtos, printModelDetailShowCreateDtos, 'body');
      let data = {
        printModelCode: this.formCode,
        printModelDetailShowCreateDtos,
        printModelSortCreateDtos
      }
      createPrintModel(data).then(res => {
        // console.log(res);
        if (res.status === 0) {
          this.$message({
            message: "打印模板配置保存成功",
            type: "success"
          });
          this.setRoute();
        }
      })
    },
    saveDataArr(arr, getArr1, getArr2, sortPart) {
      for (let i in arr) {
        let item = arr[i];
        getArr1.push({
          printColumnCode: item.columnCode,
          sortPart
        });
        if (!item.flag || !item.defaultFlag) {
          getArr2.push({
            columnCode: item.columnCode,
            columnName: '',
            columnValue: '',
            isAdd: 1,
            isShow: item.flag ? 0 : 1
          })
        }
      }
    },
    //添加表尾
    addBottomTable() {
      this.dialogFormVisibleFoot = true;
    },
    // 点击换行
    handleChangeRole(row) {
      this.currentIndex = row.columnCode;
      // console.log(this.currentIndex)
    },
    tableRowClassName({row, rowIndex}) {
      if (row.columnCode === this.currentIndex) {
        // console.log(111)
        return 'active';
      } else {
        return ''
      }
    },
    //删除表尾
    deletBottomTable() {
      if (!this.currentIndex) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error'
        })
        return
      }
      let index = this.printBottomList.findIndex(v => v.columnCode === this.currentIndex);
      if (this.printBottomList[index].isAdd === 1) {
        this.$message({
          message: '系统字段不能删除',
          type: 'error'
        })
        return
      }
      this.$confirm(`您确定删除${this.printBottomList[index].columnName}该自定义字段吗`, {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '放弃'
      }).then(() => {
        this.printBottomList.splice(index, 1);
      })
    },
    //添加表尾确定
    Determine(val) {
      // console.log(val);
      val.columnCode = 'P' + (new Date()).getTime();
      this.printBottomList.push(val);
      this.cancelFoot()
    },
    //取消表尾添加
    cancelFoot() {
      this.dialogFormVisibleFoot = false;
    },
    // 关闭当前页面
    setRoute() {
      let index = this.tagNavList.findIndex(v => v.name === this.$route.name);
      let item = this.tagNavList[index];
      this.lastRouteName = this.$route.meta.lastRouteName;
      if (this.tagNavList.some(v => v.name === this.lastRouteName)) {
        let timestamp = new Date();
        let freshRouterObj = {
          timestamp,
          lastRouteName: this.lastRouteName
        };
        this.$store.commit('tagNav/setFreshRouterObj', freshRouterObj);
      }
      this.closeTheTag(item, index);
    },
    closeTheTag(item, index) {
      this.$store.commit('tagNav/removeTagNav', item);
      if (item.path === this.$route.path) {
        this.$router.push(this.tagNavList[index - 1].path);
      }
    },

  }
}

export const backlogProcess = {
  data() {
    return {
      isBeginNode: false,
      id: '',
      sid: '',
      formCode: '',
      ShowDeleteProcess: false,
      isDisable: 0,
      formStatusCode: '',
      multitonColumns: [],
      singletonColumns: [],
      projectFromStatus: {},
      tableFromStatus: {},
      currentProcessNodeCode: '',
      step: 0,
    }
  },
  created() {
    let params = this.$route.params;
    this.id = params.id;
    this.sid = params.sid;
    this.formCode = params.formCode;
    this.formStatusCode = params.formStatusCode;
    this.isDisable = params.isDisable;
    this.currentProcessNodeCode = params.currentProcessNodeCode;
    this.isBeginNode = localStorage.getItem('nodeCode') === 'BEGIN';
    // console.log(this.isBeginNode);
    // nodeCode
  },
  methods: {
    //获取表单状态字段
    _getWorkflowFormStatus(callback) {
      getWorkflowFormStatus(this.formStatusCode, this.isDisable).then(res => {
        // console.log(res.results)
        this.singletonColumns = res.results.singletonColumns;
        if (res.results.multitonColumns && res.results.multitonColumns.length) {
          this.multitonColumns = res.results.multitonColumns[0].multitonColumns;
        }
        callback();
      })
    },
    //判断主表字段状态
    judgeSingleForm(from) {
      let obj = {}
      for (let key in from) {
        let index = this.singletonColumns.findIndex(v => v.columnCode === key);
        if (index > 0) {
          obj[key] = this.singletonColumns[index].columnStatusCollectCode
        } else {
          obj[key] = "DISABLED";
        }
      }
      this.projectFromStatus = obj;
    },
    //判断明细表字段状态
    judgeTableFrom(from) {
      let obj = {};
      if (from.length === 0) return;
      for (let key in from[0]) {
        let index = this.multitonColumns.findIndex(v => v.columnCode === key);
        if (index > 0) {
          obj[key] = this.multitonColumns[index].columnStatusCollectCode
        } else {
          obj[key] = 'DISABLED'
        }
      }
      this.tableFromStatus = obj;
    },
    // 获取下一步节点信息
    getNexNodeInfo(getNextNode) {
      this.sid = this.projectForm.id;
      this.projectId = this.projectForm.projectId;
      getNextNode(this.sid, this.currentProcessNodeCode, this.projectId, this.id).then(res => {
        let results = res.results;
        results.step = this.step;
        this.$emit('showDialog', results);
      })
    },
    // 点击退回上一步
    getHandleStepBack() {
      this.step = 1;
      this.nextStep();
    },
    //提交退回上一步
    handleStepBack(val) {
      val.companyId = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '';
      val.createBy = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '';
      val.sendUsers = val.sendTo;
      returnWorkflowFormTask(val).then(res => {
        if (res.status === 0) {
          this.setRoute();
          this.$message.success('退回上一步成功');
        } else {
          this.$message.error(res.errorMessage);
        }
      })
    },
    // 点击退回发起人
    getHandleReturningOriginator() {
      this.step = 2;
      this.nextStep();
    },
    //提交退回发起人信息
    handleReturningOriginator(val) {
      // console.log(val);
      // console.log(Auth.hasUserInfo())
      val.companyId = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).companyId : '';
      val.createBy = Auth.hasUserInfo() ? JSON.parse(Auth.hasUserInfo()).userId : '';
      val.sendUsers = val.sendTo;
      returnStartWorkflowFormTask(val).then(res => {
        if (res.status === 0) {
          this.setRoute();
          this.$message.success('退回发起人成功');
        } else {
          this.$message.error(res.errorMessage);
        }
      })
    },
    //提交流程监控
    getHandleProcessMonitoring() {
      // this.$emit('showDialog');
      this.$store.commit('user/setTaskId', Number(this.id));
    },
    //删除流程
    getHandleDeleteProcess() {
      this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formCode = this.$route.params.formCode;
        let delteList = [
          // 仓库模块
          {formCode: "warInAndOut", url: '/contract/inandout/delete', key: "inAndOutId", method: 'get'}
        ]
        let index = delteList.findIndex(v => v.formCode === formCode);

        let obj = {};
        if (index >= 0) {
          deleteProcessNode(this.id).then(res => {
            if (res.status === 0) {
              obj = delteList[index];
              deleteProcessNodeAndData(obj.url, obj.key, this.sid, obj.method).then(ret => {
                if (ret.status === 0) {
                  this.$message.success('删除流程成功');
                  this.setRoute();
                }
              })
            }
          })

        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
  }
}
