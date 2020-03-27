import Vue from 'vue'
import Router from 'vue-router'
import NProgress from "nprogress";
import HelloWorld from '@/components/HelloWorld'

const _import = require('router/_import_' + process.env.NODE_ENV);//获取组件的方法
Vue.use(Router)

NProgress.configure({showSpinner: false});

export const constantRouterMap = [
  {
    path: '',
    // name: 'login',
    component: () => import('views/login/login'),//路由懒加载
    redirect: '/home'
  },
  {
    path: '/error',
    component: () => import('views/error/index'),
    children: [
      {
        path: '401',
        component: () => import('views/error/401')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('views/home/test'),//路由懒加载
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login/login'),
  },
  {
    path: '',
    name: 'lyout',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('views/home/home'),
      },
      {
        path: 'backlog/:id/:sid/:isDisable/:formCode/:formStatusCode/:currentProcessNodeCode',
        component: () => import('views/home/backlog'),
        name: 'backlog',
        meta: {title: '待办事项', name: '待办事项'}
      },
      {
        path: 'printDesign/:formCode/:taskId/:id',
        component: () => import('views/printDesign/printDesign'),
        name: 'printDesign',
        meta: {title: '打印预览', name: '打印预览', lastRouterName: 'printTemplate'}
      },
      {
        path: 'messageCenter',
        component: () => import('views/messageCenter/messageCenter'),
        name: 'messageCenter',
        meta: {title: '消息中心', name: '消息中心'}
      },
      {
        path: 'messageText/:id',
        component: () => import('views/messageCenter/messageText'),
        name: 'messageText',
        meta: {title: '消息正文', name: '消息正文'}
      },
      {
        path: 'suggestionCenter',
        component: () => import('views/messageCenter/suggestionCenter'),
        name: 'suggestionCenter',
        meta: {title: '建议中心', name: '建议中心'}
      },
      {
        path: 'suggestionCenterEdit/:id/:flowStatus',
        component: () => import('views/messageCenter/suggestionCenterEdit'),
        name: 'suggestionCenterEdit',
        meta: {title: '提交建议', name: '提交建议'}
      },
    ]
  },
  //物资管理
  {
    path: '',
    name: 'materialManagement',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'contractRegister',
        name: 'contractRegister',
        component: () => import('views/materialManagement/contractRegister/contractRegister'),
        meta: {title: "项目合同登记", name: "项目合同登记", isCached: 0}
      },
      {
        path: 'yearAgreement',
        name: 'yearAgreement',
        component: () => import('views/materialManagement/yearAgreement/yearAgreement'),
        meta: {title: "年度协议登记", name: "年度协议登记", isCached: 0}
      },
      {
        path: 'materialAcceptance',
        name: 'materialAcceptance',
        component: () => import('views/materialManagement/materialAcceptance/materialAcceptance'),
        meta: {title: "料具验收单", name: "料具验收单", isCached: 0}
      },
      {
        path: 'materialRequisition',
        name: 'materialRequisition',
        component: () => import('views/materialManagement/materialRequisition/materialRequisition'),
        meta: {title: "领料单", name: "领料单", isCached: 0}
      },
      {
        path: 'materialPlanning',
        name: 'materialPlanning',
        component: () => import('views/materialManagement/materialPlanning/materialPlanning'),
        meta: {title: "材料计划单", name: "材料计划单", isCached: 0}
      },
      {
        path: 'materialSporadic',
        name: 'materialSporadic',
        component: () => import('views/materialManagement/materialSporadic/materialSporadic'),
        meta: {title: "零星/安全材料计划表", name: "零星/安全材料计划表", isCached: 0}
      },
      {
        path: 'limitedCollateral',
        name: 'limitedCollateral',
        component: () => import('views/materialManagement/limitedCollateral/limitedCollateral'),
        meta: {title: "限额领料单", name: "限额领料单", isCached: 0}
      },
      {
        path: 'consumeMonthSurface',
        name: 'consumeMonthSurface',
        component: () => import('views/materialManagement/consumeMonthSurface/consumeMonthSurface'),
        meta: {title: "材料累计消耗月报表", name: "材料累计消耗月报表", isCached: 0}
      },
      {
        path: 'receiveMonthSuface',
        name: 'receiveMonthSuface',
        component: () => import('views/materialManagement/receiveMonthSuface/receiveMonthSuface'),
        meta: {title: "材料收发存月报", name: "材料收发存月报", isCached: 0}
      }
    ]
  },

  // 组织机构管理
  {
    path: '',
    name: 'organizationalManagement',
    component: () => import('views/lyout/index'),
    children: [

      // {
      //   path: 'companyPersonnelAnth',
      //   name: 'companyPersonnelAnth',
      //   meta: {title: '公司人员授权', name: '公司人员授权'},
      //   component: () => import('views/organization/companyPersonnelAnth/companyPersonnelAnth'),
      // },
      // {
      // {
      //   path: 'companyPostSet',
      //   name: 'companyPostSet',
      //   component: () => import('views/organization/companyPostSet/companyPostSet'),
      //   meta: {title: "公司岗位设置", name: "公司岗位设置", isCached: 0}
      // }
    ]
  },
  //项目设置
  //  {
  //   path: '',
  //   name: 'companyProject',
  //   component: () => import('views/lyout/index'),
  //   children: [
  //     {
  //       path: 'subcontractorSet',
  //       name: 'subcontractorSet',
  //       component: () => import('views/companyProject/subcontractorSet/subcontractorSet'),
  //       meta: {title: "分包商设置", name: "分包商设置", isCached: 0}
  //     },
  //     {
  //       path: 'projectAdd',
  //       name: 'projectAdd',
  //       component: () => import('views/companyProject/projectAdd/projectAdd'),
  //       meta: {title: "添加项目", name: "添加项目", isCached: 1}
  //     },
  //     {
  //       path: 'projectMembers',
  //       name: 'projectMembers',
  //       component: () => import('views/companyProject/projectMembers/projectMembers'),
  //       meta: {title: "项目成员设置", name: "项目成员设置", isCached: 0}
  //     },
  //     {
  //       path: 'receiveMasterUnit',
  //       name: 'receiveMasterUnit',
  //       component: () => import('views/companyProject/receiveMasterUnit/receiveMasterUnit'),
  //       meta: {title: "领料单位设置", name: "领料单位设置", isCached: 0}
  //     },
  //     {
  //       path: 'subproject',
  //       name: 'subproject',
  //       component: () => import('views/companyProject/subproject/subproject'),
  //       meta: {title: "子工程设置", name: "子工程设置", isCached: 0}
  //     },
  //     {
  //       path: 'projectPost',
  //       name: 'projectPost',
  //       component: () => import('views/companyProject/projectPost/projectPost'),
  //       meta: {title: "项目岗位设置", name: "项目岗位设置", isCached: 0}
  //     },
  //     {
  //       path: 'management',
  //       name: 'management',
  //       component: () => import('views/management/management'),
  //       meta: {title: "项目状态管理", name: "项目状态管理", isCached: 1}
  //     },
  //   ]
  // },
  //财务配置
  // {
  //   path: '',
  //   name: 'financialAllocation',
  //   component: () => import('views/lyout/index'),
  //   children: [
  //     {
  //       path: 'projectBudget',
  //       name: 'projectBudget',
  //       component: () => import('views/financialAllocation/projectBudget/projectBudget'),
  //       meta: {title: "项目收支科目", name: "项目收支科目", isCached: 0}
  //     },
  //     {
  //       path: 'companyRevenue',
  //       name: 'companyRevenue',
  //       component: () => import('views/financialAllocation/companyRevenue/companyRevenue'),
  //       meta: {title: "公司收支科目", name: "公司收支科目", isCached: 0}
  //     },
  //     {
  //       path: 'corporateAccounts',
  //       name: 'corporateAccounts',
  //       component: () => import('views/financialAllocation/corporateAccounts/corporateAccounts'),
  //       meta: {title: "公司账户登记", name: "公司账户登记", isCached: 0}
  //     },
  //     {
  //       path: 'standbyFund',
  //       name: 'standbyFund',
  //       component: () => import('views/financialAllocation/standbyFund/standbyFund'),
  //       meta: {title: "备用金指标管理", name: "备用金指标管理", isCached: 0}
  //     }
  //   ]
  // },
  //流程管理
  {
    path: '',
    name: 'process',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'processCompanyEdit/:statusCode/:type',
        // component: _import('processDefinition/processEdit'),
        component: () => import('views/processDefinition/processCompanyEdit'),
        name: 'processCompanyEdit',
        meta: {title: '企业表单编辑', name: '企业表单编辑', isCached: true, lastRouterName: 'processCompanyMenu'}
      },
      //     {
      //       path: 'companyDesign',
      //       name: 'companyDesign',
      //       component: () => import('views/processDefinition/companyDesign'),
      //       meta: {title: "企业流程定义", name: "企业流程定义", isCached: 1}
      //     },
      {
        path: 'processCompanyDesign/:formCode/:processCode/:processName',
        name: 'processCompanyDesign',
        component: () => import('views/processDefinition/processCompanyDesign'),
        meta: {title: "企业流程表单设计", name: "企业流程表单设计", isCached: 1}
      },
      //     {
      //       path: 'publish',
      //       name: 'publish',
      //       component: () => import('views/publish/publish'),
      //       meta: {title: "企业流程发布", name: "企业流程发布", isCached: 1}
      //     },
      //     {
      //       path: 'processCompanyMenu',
      //       name: 'processCompanyMenu',
      //       component: () => import('views/processDefinition/processMenu'),
      //       meta: {title: "流程表单维护", name: "流程表单维护", isCached: 1}
      //     },
      //     {
      //       path: 'Monitor',
      //       name: 'Monitor',
      //       component: () => import('views/Monitor/Monitor'),
      //       meta: {title: "流程监控", name: "流程监控", isCached: 1}
      //
      //     },
      //     {
      //       path: 'processQuery',
      //       name: 'processQuery',
      //       component: () => import('views/Monitor/processQuery'),
      //       meta: {title: "流程查询", name: "流程查询", isCached: 1}
      //     },
      //     {
      //       path: 'needToBeDealtWith',
      //       name: 'needToBeDealtWith',
      //       component: () => import('views/process/needToBeDealtWith'),
      //       meta: {title: "我的待办", name: "我的待办", isCached: 0}
      //     },
      //     {
      //       path: 'toDeRead',
      //       name: 'toDeRead',
      //       component: () => import('views/process/toDeRead'),
      //       meta: {title: "我的待阅", name: "我的待阅", isCached: 0}
      //     },
      //     {
      //       path: 'Apply',
      //       name: 'Apply',
      //       component: () => import('views/process/Apply'),
      //       meta: {title: "我的申请", name: "我的申请", isCached: 0}
      //     },
      //     {
      //       path: 'Read',
      //       name: 'Read',
      //       component: () => import('views/process/Read'),
      //       meta: {title: "我的已阅", name: "我的已阅", isCached: 0}
      //     },
      //     {
      //       path: 'alreadyDone',
      //       name: 'alreadyDone',
      //       component: () => import('views/process/alreadyDone'),
      //       meta: {title: "我的已办", name: "我的已办", isCached: 0}
      //     }
      //
    ]
  },
  //配置管理
  // {
  //   path: '',
  //   name: 'systemSet',
  //   component: () => import('views/lyout/index'),
  //   children: [
  //     {
  //       path: 'conmaterial',
  //       name: 'conmaterial',
  //       component: () => import('views/conmaterial/conmaterial'),
  //       meta: {title: "企业编码库", name: "企业编码库", isCached: 1}
  //     },
  //     {
  //       path: 'companyDataDictionary',
  //       name: 'companyDataDictionary',
  //       component: () => import('views/companyDataDictionary/companyDataDictionary'),
  //       meta: {title: "数据字典维护", name: "数据字典维护", isCached: 1}
  //     },
  //     {
  //       path: 'printTemplate',
  //       name: 'printTemplate',
  //       component: () => import('views/printDesign/printTemplate'),
  //       meta: {title: "打印模版配置", name: "打印模版配置", isCached: 0}
  //     },
  //     {
  //       path: 'companyShortMessage',
  //       name: 'companyShortMessage',
  //       component: () => import('views/companyShortMessage/companyShortMessage'),
  //       meta: {title: "短信发送记录", name: "短信发送记录", isCached: 1}
  //     }
  //
  //   ]
  // },
  //供应商管理
  {
    path: '',
    name: 'supplierManagement',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'assessmentSet/:type/:id',
        // component: _import('supplierManagement/assessmentSet'),
        component: () => import('views/supplierManagement/assessmentSet'),
        name: 'assessmentSet',
        meta: {title: '供应商考核添加', name: '供应商考核添加', isCached: true, lastRouterName: 'assessment'}
      },
      // {
      //   path: 'assessmentEdit/:id',
      //   // component: _import('supplierManagement/assessmentEdit'),
      //   component: () => import('views/supplierManagement/assessmentEdit'),
      //   name: 'assessmentEdit',
      //   meta: {title: '供应商考核修改', name: '供应商考核修改', isCached: true, lastRouterName: 'assessment'}
      // },
      // {
      //   path: 'assessmentInfo/:id',
      //   // component: _import('supplierManagement/assessmentInfo'),
      //   component: () => import('views/supplierManagement/assessmentInfo'),
      //   name: 'assessmentInfo',
      //   meta: {title: '供应商考核查看', name: '供应商考核查看'}
      // },
      // {
      //   path: 'supplierPerformance',
      //   name: 'supplierPerformance',
      //   component: () => import('views/supplierManagement/supplierPerformance/supplierPerformance'),
      //   meta: {title: "供应商履约评价表", name: "供应商履约评价表", isCached: 0}
      // },
      // {
      //   path: 'supplierInclusion',
      //   name: 'supplierInclusion',
      //   component: () => import('views/supplierManagement/supplierInclusion'),
      //   meta: {title: "供应商收录", name: "供应商收录", isCached: 1}
      // },
      // {
      //   path: 'assessment',
      //   name: 'assessment',
      //   component: () => import('views/supplierManagement/assessment'),
      //   meta: {title: "供应商考核", name: "供应商考核", isCached: 1}
      // },
      // {
      //   path: 'evaluate',
      //   name: 'evaluate',
      //   component: () => import('views/supplierManagement/evaluate'),
      //   meta: {title: "供应商评价", name: "供应商评价", isCached: 1}
      // },
      // {
      //   path: 'supplier',
      //   name: 'supplier',
      //   component: () => import('views/supplierManagement/supplier'),
      //   meta: {title: "供应商一览表", name: "供应商一览表", isCached: 1}
      // }
    ]
  },
  //需求计划
  {
    path: '',
    name: 'demMasterMangment',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'budget',
      //   name: 'budget',
      //   component: () => import('views/budget/budget'),
      //   meta: {title: "投标预算维护", name: "投标预算维护", isCached: 1}
      // },
      // {
      //   path: 'demMasterPlan',
      //   name: 'demMasterPlan',
      //   component: () => import('views/demMasterPlan/demMasterPlan'),
      //   meta: {title: "施工总预算维护", name: "施工总预算维护", isCached: 1}
      // },
      // {
      //   path: 'yearMasterPlan',
      //   name: 'yearMasterPlan',
      //   component: () => import('views/demMasterPlan/yearMasterPlan/yearMasterPlan'),
      //   meta: {title: "年度需求计划", name: "年度需求计划", isCached: 1}
      // },
      // {
      //   path: 'seasonMasterPlan',
      //   name: 'seasonMasterPlan',
      //   component: () => import('views/demMasterPlan/seasonMasterPlan/seasonMasterPlan'),
      //   meta: {title: "季度需求计划", name: "季度需求计划", isCached: 1}
      // },
      // {
      //   path: 'monthMasterPlan',
      //   name: 'monthMasterPlan',
      //   component: () => import('views/demMasterPlan/monthMasterPlan/monthMasterPlan'),
      //   meta: {title: "月度需求计划", name: "月度需求计划", isCached: 1}
      // },
      // {
      //   path: 'temporaryMasterPlan',
      //   name: 'temporaryMasterPlan',
      //   component: () => import('views/demMasterPlan/temporaryMasterPlan/temporaryMasterPlan'),
      //   meta: {title: "临时需求计划", name: "临时需求计划", isCached: 1}
      // }

    ]
  },
  //采购管理
  {
    path: '',
    name: 'procurement',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'sporadicPurchaseSet/:type/:id',
        name: 'sporadicPurchaseSet',
        component: () => import('views/procurementPlan/sporadicPurchase/sporadicPurchaseSet'),
        meta: {title: "零星采购添加", name: "零星采购添加", isCached: 1, lastRouteName: 'procurement'}
      }
      // {
      //   path: 'procurementPlan',
      //   name: 'procurementPlan',
      //   component: () => import('views/procurementPlan/procurementPlan'),
      //   meta: {title: "采购计划", name: "采购计划", isCached: 1}
      // },
      // {
      //   path: 'inquiry',
      //   name: 'inquiry',
      //   component: () => import('views/procurementPlan/inquiry/inquiry'),
      //   meta: {title: "询价比价单", name: "询价比价单", isCached: 0}
      // },
      // {
      //   path: 'tendering',
      //   name: 'tendering',
      //   component: () => import('views/procurementPlan/tendering/tendering'),
      //   meta: {title: "招标/开标登记", name: "招标/开标登记", isCached: 1}
      // },
      // {
      //   path: 'letterOfAcceptance',
      //   name: 'letterOfAcceptance',
      //   component: () => import('views/procurementPlan/letterOfAcceptance/letterOfAcceptance'),
      //   meta: {title: "中标通知书登记", name: "中标通知书登记", isCached: 1}
      // },
      // {
      //   path: 'contract',
      //   name: 'contract',
      //   component: () => import('views/contractAndOrder/contract'),
      //   meta: {title: "合同评审与签订", name: "合同评审与签订", isCached: 1}
      // },
      // {
      //   path: 'order',
      //   name: 'order',
      //   component: () => import('views/contractAndOrder/order'),
      //   meta: {title: "供货订单", name: "供货订单", isCached: 1}
      // },
      // {
      //   path: 'checkAndAccept',
      //   name: 'checkAndAccept',
      //   component: () => import('views/checkAndAccept/checkAndAccept'),
      //   meta: {title: "到货验收", name: "到货验收", isCached: 1}
      // },
      // {
      //   path: 'returnGoods',
      //   name: 'returnGoods',
      //   component: () => import('views/procurementPlan/returnGoods/returnGoods'),
      //   meta: {title: "退货单", name: "退货单", isCached: 1}
      // },
      // {
      //   path: 'invoice',
      //   name: 'invoice',
      //   component: () => import('views/procurementPlan/invoice/invoice'),
      //   meta: {title: "发票登记", name: "发票登记", isCached: 1}
      // },
      // {
      //   path: 'payContract',
      //   name: 'payContract',
      //   component: () => import('views/procurementPlan/payContract/payContract'),
      //   meta: {title: "合同支付", name: "合同支付", isCached: 1}
      // },
      // {
      //   path: 'contractsettle',
      //   name: 'contractsettle',
      //   component: () => import('views/procurementPlan/contractsettle/contractsettle'),
      //   meta: {title: "合同结算", name: "合同结算", isCached: 1}
      // },
      // {
      //   path: 'sporadicPurchase',
      //   name: 'sporadicPurchase',
      //   component: () => import('views/procurementPlan/sporadicPurchase/sporadicPurchase'),
      //   meta: {title: "零星采购申请", name: "零星采购申请", isCached: 0}
      // },
      // {
      //   path: 'reimbursement',
      //   name: 'reimbursement',
      //   component: () => import('views/procurementPlan/reimbursement/reimbursement'),
      //   meta: {title: "报销登记", name: "报销登记", isCached: 0}
      // }

    ]
  },
  //项目仓库管理
  {
    path: '',
    name: 'warehouseManagement',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'straightForwardSet/:type/:id',
        name: 'straightForwardSet',
        component: () => import('views/warehouseManagement/straightForward/straightForwardSet'),
        meta: {title: "直进直出单添加", name: "直进直出单添加", isCached: 1, lastRouteName: 'straightForward'}
      },
      {
        path: 'warehousingSet',
        name: 'warehousingSet',
        component: () => import('views/warehouseManagement/warehousing/warehousingSet'),
        meta: {title: "入库单添加", name: "入库单添加", isCached: 1, lastRouteName: 'warehousing'}
      },
      {
        path: 'warehousingAgain',
        name: 'warehousingAgain',
        component: () => import('views/warehouseManagement/warehousing/warehousingAgain'),
        meta: {title: "入库单", name: "入库单", isCached: 1}
      },
      {
        path: 'warehousingAgainSet/:type/:id',
        name: 'warehousingAgainSet',
        component: () => import('views/warehouseManagement/warehousing/warehousingAgainSet'),
        meta: {title: "入库单添加1", name: "入库单添加1", isCached: 1, lastRouteName: 'warehousingAgain'}
      },
      {
        path: 'outboundSet/:type/:id',
        name: 'outboundSet',
        component: () => import('views/warehouseManagement/outbound/outboundSet'),
        meta: {title: "出库单添加", name: "出库单添加", isCached: 1, lastRouteName: 'outbound'}
      },
      // {
      //   path: 'maintain',
      //   name: 'maintain',
      //   component: () => import('views/warehouseManagement/maintain'),
      //   meta: {title: "仓库创建维护", name: "仓库创建维护", isCached: 1}
      // },
      // {
      //   path: 'straightForward',
      //   name: 'straightForward',
      //   component: () => import('views/warehouseManagement/straightForward/straightForward'),
      //   meta: {title: "直进直出单", name: "直进直出单", isCached: 1}
      // },

      // {
      //   path: 'outbound',
      //   name: 'outbound',
      //   component: () => import('views/warehouseManagement/outbound/outbound'),
      //   meta: {title: "出库单", name: "出库单", isCached: 1}
      // },
      // {
      //   path: 'return',
      //   name: 'return',
      //   component: () => import('views/warehouseManagement/return/return'),
      //   meta: {title: "退库单", name: "退库单", isCached: 1}
      // },
      // {
      //   path: 'warReturnGoods',
      //   name: 'warReturnGoods',
      //   component: () => import('views/procurementPlan/returnGoods/returnGoods'),
      //   meta: {title: "仓库退货单", name: "仓库退货单", isCached: 1}
      // },
      // {
      //   path: 'borrow',
      //   name: 'borrow',
      //   component: () => import('views/warehouseManagement/borrow/borrow'),
      //   meta: {title: "借用单", name: "借用单", isCached: 1}
      // },
      // {
      //   path: 'back',
      //   name: 'back',
      //   component: () => import('views/warehouseManagement/back/back'),
      //   meta: {title: "归还单", name: "归还单", isCached: 1}
      // },
      // {
      //   path: 'inventory',
      //   name: 'inventory',
      //   component: () => import('views/warehouseManagement/inventory/inventory'),
      //   meta: {title: "盘点单", name: "盘点单", isCached: 1}
      // },
      // {
      //   path: 'allocation',
      //   name: 'allocation',
      //   component: () => import('views/warehouseManagement/allocation/allocation'),
      //   meta: {title: "调拨单", name: "调拨单", isCached: 1}
      // },
      // {
      //   path: 'reportloss',
      //   name: 'reportloss',
      //   component: () => import('views/warehouseManagement/reportloss/reportloss'),
      //   meta: {title: "报损单", name: "报损单", isCached: 1}
      // }

    ]
  },
  //采购管理
  {
    path: '',
    name: 'machineryLeasing',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'budLease',
      //   name: 'budLease',
      //   component: () => import('views/lease/budLease/budLease'),
      //   meta: {title: "投标预算登记", name: "投标预算登记", isCached: 1}
      // },
      // {
      //   path: 'demmasterLease',
      //   name: 'demmasterLease',
      //   component: () => import('views/lease/demmasterLease/demmasterLease'),
      //   meta: {title: "施工总预算登记", name: "施工总预算登记", isCached: 1}
      // },
      // {
      //   path: 'monthLease',
      //   name: 'monthLease',
      //   component: () => import('views/lease/monthLease/monthLease'),
      //   meta: {title: "月度需求计划", name: "月度需求计划", isCached: 1}
      // },
      // {
      //   path: 'temporaryLease',
      //   name: 'temporaryLease',
      //   component: () => import('views/lease/temporaryLease/temporaryLease'),
      //   meta: {title: "临时需求计划", name: "临时需求计划", isCached: 1}
      // },
      // {
      //   path: 'procurementLease',
      //   name: 'procurementLease',
      //   component: () => import('views/lease/procurementLease/procurementLease'),
      //   meta: {title: "机械租赁计划", name: "机械租赁计划", isCached: 1}
      // },
      // {
      //   path: 'inquiryLease',
      //   name: 'inquiryLease',
      //   component: () => import('views/lease/inquiryLease/inquiryLease'),
      //   meta: {title: "租赁询价单", name: "租赁询价单", isCached: 1}
      // },
      // {
      //   path: 'contractLease',
      //   name: 'contractLease',
      //   component: () => import('views/lease/contractLease/contractLease'),
      //   meta: {title: "租赁合同签订", name: "租赁合同签订", isCached: 1}
      // },
      // {
      //   path: 'leaallocationLease',
      //   name: 'leaallocationLease',
      //   component: () => import('views/lease/leaallocationLease/leaallocationLease'),
      //   meta: {title: "内部调拨申请", name: "内部调拨申请", isCached: 1}
      // },
      // {
      //   path: 'approachLease',
      //   name: 'approachLease',
      //   component: () => import('views/lease/approachLease/approachLease'),
      //   meta: {title: "进场登记", name: "进场登记", isCached: 1}
      // },
      // {
      //   path: 'installLease',
      //   name: 'installLease',
      //   component: () => import('views/lease/installLease/installLease'),
      //   meta: {title: "安装验收", name: "安装验收", isCached: 1}
      // },
      // {
      //   path: 'operationRegistration',
      //   name: 'operationRegistration',
      //   component: () => import('views/lease/operationRegistration/operationRegistration'),
      //   meta: {title: "运行登记单", name: "运行登记单", isCached: 1}
      // },
      // {
      //   path: 'maintenanceLease',
      //   name: 'maintenanceLease',
      //   component: () => import('views/lease/maintenanceLease/maintenanceLease'),
      //   meta: {title: "维修登记单", name: "维修登记单", isCached: 1}
      // },
      // {
      //   path: 'maintainLease',
      //   name: 'maintainLease',
      //   component: () => import('views/lease/maintainLease/maintainLease'),
      //   meta: {title: "保养登记单", name: "保养登记单", isCached: 1}
      // },
      // {
      //   path: 'exitRegistrationLease',
      //   name: 'exitRegistrationLease',
      //   component: () => import('views/lease/exitRegistrationLease/exitRegistrationLease'),
      //   meta: {title: "退场登记", name: "退场登记", isCached: 1}
      // },
      // {
      //   path: 'payContractLease',
      //   name: 'payContractLease',
      //   component: () => import('views/lease/payContractLease/payContractLease'),
      //   meta: {title: "合同支付", name: "合同支付", isCached: 1}
      // },
      // {
      //   path: 'invoiceLease',
      //   name: 'invoiceLease',
      //   component: () => import('views/lease/invoiceLease/invoiceLease'),
      //   meta: {title: "发票登记", name: "发票登记", isCached: 1}
      // },
      // {
      //   path: 'contractsettleLease',
      //   name: 'contractsettleLease',
      //   component: () => import('views/lease/contractsettleLease/contractsettleLease'),
      //   meta: {title: "租赁结算单", name: "租赁结算单", isCached: 1}
      // },
      // {
      //   path: 'specialWorkLease',
      //   name: 'specialWorkLease',
      //   component: () => import('views/lease/specialWorkLease/specialWorkLease'),
      //   meta: {title: "特种作业人员登记单", name: "特种作业人员登记单", isCached: 1}
      // },
      // {
      //   path: 'otherLease',
      //   name: 'otherLease',
      //   component: () => import('views/lease/otherLease/otherLease'),
      //   meta: {title: "其它过程资料件提交", name: "其它过程资料件提交", isCached: 1}
      // },
      // {
      //   path: 'ledgerLease',
      //   name: 'ledgerLease',
      //   component: () => import('views/lease/ledgerLease/ledgerLease'),
      //   meta: {title: "项目机械设备台账", name: "项目机械设备台账", isCached: 0}
      // }
    ]
  },
  //甲供物资管理
  {
    path: '',
    name: 'nailSupply',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'budSupply',
      //   name: 'budSupply',
      //   component: () => import('views/nailSupply/budSupply/budSupply'),
      //   meta: {title: "甲供物资总预算", name: "甲供物资总预算", isCached: 1}
      // },
      // {
      //   path: 'demmasterSupply',
      //   name: 'demmasterSupply',
      //   component: () => import('views/nailSupply/demmasterSupply/demmasterSupply'),
      //   meta: {title: "甲供需求计划", name: "甲供需求计划", isCached: 1}
      // },
      // {
      //   path: 'checkAndAcceptSupply',
      //   name: 'checkAndAcceptSupply',
      //   component: () => import('views/nailSupply/checkAndAcceptSupply/checkAndAcceptSupply'),
      //   meta: {title: "到货验收", name: "到货验收", isCached: 1}
      // },
      // {
      //   path: 'contractsettleSupply',
      //   name: 'contractsettleSupply',
      //   component: () => import('views/nailSupply/contractsettleSupply/contractsettleSupply'),
      //   meta: {title: "甲供物资结算", name: "甲供物资结算", isCached: 1}
      // }

    ]
  },
  //物资材料过程管理
  {
    path: '',
    name: 'processManagement',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'InstallationAndCommissioning',
      //   name: 'InstallationAndCommissioning',
      //   component: () => import('views/processManagement/InstallationAndCommissioning/InstallationAndCommissioning'),
      //   meta: {title: "设备安装调试", name: "设备安装调试", isCached: 1}
      // },
      // {
      //   path: 'materialTesting',
      //   name: 'materialTesting',
      //   component: () => import('views/processManagement/materialTesting/materialTesting'),
      //   meta: {title: "材料检测", name: "材料检测", isCached: 1}
      // },
      // {
      //   path: 'reprocessing',
      //   name: 'reprocessing',
      //   component: () => import('views/processManagement/reprocessing/reprocessing'),
      //   meta: {title: "再加工管理", name: "再加工管理", isCached: 1}
      // },
      // {
      //   path: 'surplusRecovery',
      //   name: 'surplusRecovery',
      //   component: () => import('views/processManagement/surplusRecovery/surplusRecovery'),
      //   meta: {title: "余料回收处理", name: "余料回收处理", isCached: 1}
      // },
      // {
      //   path: 'weighbridge',
      //   name: 'weighbridge',
      //   component: () => import('views/processManagement/weighbridge/weighbridge'),
      //   meta: {title: "地磅管理", name: "地磅管理", isCached: 1}
      // },

    ]
  },
  //固定资产管理
  {
    path: '',
    name: 'fixedAssetsManagement',
    component: () => import('views/lyout/index'),
    children: [
      {
        path: 'orgIncomingSet/:type/:id',
        // component: _import('supplierManagement/assessmentSet'),
        component: () => import('views/fixedAssetsManagement/orgIncoming/orgIncomingSet'),
        name: 'orgIncomingSet',
        meta: {title: '固定资产入库单添加', name: '固定资产入库单添加', isCached: true, lastRouterName: 'orgIncoming'}
      },
      // {
      //   path: 'companyWarehouse',
      //   name: 'companyWarehouse',
      //   component: () => import('views/fixedAssetsManagement/companyWarehouse'),
      //   meta: {title: "公司仓库维护", name: "公司仓库维护", isCached: 1}
      // },
      // {
      //   path: 'orgIncoming',
      //   name: 'orgIncoming',
      //   component: () => import('views/fixedAssetsManagement/orgIncoming/orgIncoming'),
      //   meta: {title: "固定资产入库", name: "固定资产入库", isCached: 1}
      // },
      // {
      //   path: 'orgOutbound',
      //   name: 'orgOutbound',
      //   component: () => import('views/fixedAssetsManagement/orgOutbound/orgOutbound'),
      //   meta: {title: "固定资产出库", name: "固定资产出库", isCached: 1}
      // },
      // {
      //   path: 'orgBorrow',
      //   name: 'orgBorrow',
      //   component: () => import('views/fixedAssetsManagement/orgBorrow/orgBorrow'),
      //   meta: {title: "固定资产借用", name: "固定资产借用", isCached: 1}
      // },
      // {
      //   path: 'orgBack',
      //   name: 'orgBack',
      //   component: () => import('views/fixedAssetsManagement/orgBack/orgBack'),
      //   meta: {title: "固定资产归还", name: "固定资产归还", isCached: 1}
      // },
      // {
      //   path: 'orgReportloss',
      //   name: 'orgReportloss',
      //   component: () => import('views/fixedAssetsManagement/orgReportloss/orgReportloss'),
      //   meta: {title: "固定资产报损", name: "固定资产报损", isCached: 1}
      // },
      // {
      //   path: 'orgReturn',
      //   name: 'orgReturn',
      //   component: () => import('views/fixedAssetsManagement/orgReturn/orgReturn'),
      //   meta: {title: "固定资产退库", name: "固定资产退库", isCached: 1}
      // },
      // {
      //   path: 'orgAllocation',
      //   name: 'orgAllocation',
      //   component: () => import('views/fixedAssetsManagement/orgAllocation/orgAllocation'),
      //   meta: {title: "固定资产调出", name: "固定资产调出", isCached: 1}
      // },
      // {
      //   path: 'orgAllocationIn',
      //   name: 'orgAllocationIn',
      //   component: () => import('views/fixedAssetsManagement/orgAllocationIn/orgAllocationIn'),
      //   meta: {title: "固定资产调入", name: "固定资产调入", isCached: 1}
      // },
      // {
      //   path: 'orgInventory',
      //   name: 'orgInventory',
      //   component: () => import('views/fixedAssetsManagement/orgInventory/orgInventory'),
      //   meta: {title: "固定资产盘点", name: "固定资产盘点", isCached: 1}
      // },
      // {
      //   path: 'orgWarehouse',
      //   name: 'orgWarehouse',
      //   component: () => import('views/fixedAssetsManagement/orgWarehouse/orgWarehouse'),
      //   meta: {title: "固定资产台账", name: "固定资产台账", isCached: 1}
      // },
      // {
      //   path: 'orgMaintain',
      //   name: 'orgMaintain',
      //   component: () => import('views/fixedAssetsManagement/orgMaintain/orgMaintain'),
      //   meta: {title: "固定资产保养", name: "固定资产保养", isCached: 0}
      // },
      // {
      //   path: 'repair',
      //   name: 'repair',
      //   component: () => import('views/fixedAssetsManagement/repair/repair'),
      //   meta: {title: "固定资产维修", name: "固定资产维修", isCached: 0}
      // }

    ]
  },
  //统计管理
  {
    path: '',
    name: 'statisticalManagement',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'budgetOverview',
      //   name: 'budgetOverview',
      //   component: () => import('views/statisticalManagement/budgetOverview'),
      //   meta: {title: "物资成本核算", name: "物资成本核算", isCached: 1}
      // },
      // {
      //   path: 'budgetDetailed',
      //   name: 'budgetDetailed',
      //   component: () => import('views/statisticalManagement/budgetDetailed'),
      //   meta: {title: "物资成本核算明细", name: "物资成本核算明细", isCached: 1}
      // },
      // {
      //   path: 'ContractOrderStatistics',
      //   name: 'ContractOrderStatistics',
      //   component: () => import('views/statisticalManagement/ContractOrderStatistics'),
      //   meta: {title: "合同/订单统计", name: "合同/订单统计", isCached: 1}
      // },
      // {
      //   path: 'InventoryStatistics',
      //   name: 'InventoryStatistics',
      //   component: () => import('views/statisticalManagement/InventoryStatistics'),
      //   meta: {title: "库存统计", name: "库存统计", isCached: 1}
      // },
      // {
      //   path: 'WarehouseStatistics',
      //   name: 'WarehouseStatistics',
      //   component: () => import('views/statisticalManagement/WarehouseStatistics'),
      //   meta: {title: "仓库盘点统计", name: "仓库盘点统计", isCached: 1}
      // },
      // {
      //   path: 'WarehouseReport',
      //   name: 'WarehouseReport',
      //   component: () => import('views/statisticalManagement/WarehouseReport'),
      //   meta: {title: "仓库报表", name: "仓库报表", isCached: 0}
      // },
      // {
      //   path: 'SupplierStatistics',
      //   name: 'SupplierStatistics',
      //   component: () => import('views/statisticalManagement/SupplierStatistics'),
      //   meta: {title: "供应商一览", name: "供应商一览", isCached: 1}
      // },
      // {
      //   path: 'SupplierCurrentAccount',
      //   name: 'SupplierCurrentAccount',
      //   component: () => import('views/statisticalManagement/SupplierCurrentAccount'),
      //   meta: {title: "供应商账款", name: "供应商账款", isCached: 1}
      // }
    ]
  },
  {
    path: '',
    name: 'receivable',
    component: () => import('views/lyout/index'),
    children: [
      // {
      //   path: 'InvoiceRegistration',
      //   name: 'InvoiceRegistration',
      //   component: () => import('views/receivable/InvoiceRegistration/InvoiceRegistration'),
      //   meta: {title: "项目开票登记", name: "项目开票登记", isCached: 0}
      // },
      // {
      //   path: 'InvoiceRegistrationEdit',
      //   name: 'InvoiceRegistrationEdit',
      //   component: () => import('views/receivable/InvoiceRegistrationEdit/InvoiceRegistrationEdit'),
      // }
    ]
  },
]

// const router = new Router({
//   routes: constantRouterMap
// })

export default new Router({
  routes: constantRouterMap
  // routes: [
  //   {
  //     path: '',
  //     // name: 'login',
  //     component: () => import('views/login/login'),//路由懒加载
  //     redirect: '/home'
  //   },
  //   {
  //     path: '/error',
  //     component: () => import('views/error/index'),
  //     children: [
  //       {
  //         path: '401',
  //         component: () => import('views/error/401')
  //       }
  //     ]
  //   },
  //   {
  //     path: '/test',
  //     name: 'test',
  //     component: () => import('views/home/test'),//路由懒加载
  //   },
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: () => import('views/login/login'),
  //   },
  //   {
  //     path: '',
  //     name: 'lyout',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       {
  //         path: 'home',
  //         name: 'home',
  //         component: () => import('views/home/home'),
  //       },
  //       {
  //         path: 'backlog/:id/:sid/:isDisable/:formCode/:formStatusCode/:currentProcessNodeCode',
  //         component: () => import('views/home/backlog'),
  //         name: 'backlog',
  //         meta: {title: '待办事项', name: '待办事项'}
  //       },
  //       {
  //         path: 'printDesign/:formCode/:taskId/:id',
  //         component: () => import('views/printDesign/printDesign'),
  //         name: 'printDesign',
  //         meta: {title: '打印预览', name: '打印预览', lastRouterName: 'printTemplate'}
  //       },
  //       {
  //         path: 'messageCenter',
  //         component: () => import('views/messageCenter'),
  //         name: 'messageCenter',
  //         meta: {title: '消息中心', name: '消息中心'}
  //       },
  //     ]
  //   },
  //   //物资管理
  //   {
  //     path: '',
  //     name: 'materialManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       {
  //         path: 'contractRegister',
  //         name: 'contractRegister',
  //         component: () => import('views/materialManagement/contractRegister/contractRegister'),
  //         meta: {title: "项目合同登记", name: "项目合同登记", isCached: 0}
  //       },
  //       {
  //         path: 'yearAgreement',
  //         name: 'yearAgreement',
  //         component: () => import('views/materialManagement/yearAgreement/yearAgreement'),
  //         meta: {title: "年度协议登记", name: "年度协议登记", isCached: 0}
  //       },
  //       {
  //         path: 'materialAcceptance',
  //         name: 'materialAcceptance',
  //         component: () => import('views/materialManagement/materialAcceptance/materialAcceptance'),
  //         meta: {title: "料具验收单", name: "料具验收单", isCached: 0}
  //       },
  //       {
  //         path: 'materialRequisition',
  //         name: 'materialRequisition',
  //         component: () => import('views/materialManagement/materialRequisition/materialRequisition'),
  //         meta: {title: "领料单", name: "领料单", isCached: 0}
  //       },
  //       {
  //         path: 'materialPlanning',
  //         name: 'materialPlanning',
  //         component: () => import('views/materialManagement/materialPlanning/materialPlanning'),
  //         meta: {title: "材料计划单", name: "材料计划单", isCached: 0}
  //       },
  //       {
  //         path: 'materialSporadic',
  //         name: 'materialSporadic',
  //         component: () => import('views/materialManagement/materialSporadic/materialSporadic'),
  //         meta: {title: "零星/安全材料计划表", name: "零星/安全材料计划表", isCached: 0}
  //       },
  //       {
  //         path: 'limitedCollateral',
  //         name: 'limitedCollateral',
  //         component: () => import('views/materialManagement/limitedCollateral/limitedCollateral'),
  //         meta: {title: "限额领料单", name: "限额领料单", isCached: 0}
  //       },
  //       {
  //         path: 'consumeMonthSurface',
  //         name: 'consumeMonthSurface',
  //         component: () => import('views/materialManagement/consumeMonthSurface/consumeMonthSurface'),
  //         meta: {title: "材料累计消耗月报表", name: "材料累计消耗月报表", isCached: 0}
  //       },
  //       {
  //         path: 'receiveMonthSuface',
  //         name: 'receiveMonthSuface',
  //         component: () => import('views/materialManagement/receiveMonthSuface/receiveMonthSuface'),
  //         meta: {title: "材料收发存月报", name: "材料收发存月报", isCached: 0}
  //       }
  //     ]
  //   },
  //
  //   // 组织机构管理
  //   {
  //     path: '',
  //     name: 'organizationalManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //
  //       // {
  //       //   path: 'companyPersonnelAnth',
  //       //   name: 'companyPersonnelAnth',
  //       //   meta: {title: '公司人员授权', name: '公司人员授权'},
  //       //   component: () => import('views/organization/companyPersonnelAnth/companyPersonnelAnth'),
  //       // },
  //       // {
  //       // {
  //       //   path: 'companyPostSet',
  //       //   name: 'companyPostSet',
  //       //   component: () => import('views/organization/companyPostSet/companyPostSet'),
  //       //   meta: {title: "公司岗位设置", name: "公司岗位设置", isCached: 0}
  //       // }
  //     ]
  //   },
  //   //项目设置
  //   //  {
  //   //   path: '',
  //   //   name: 'companyProject',
  //   //   component: () => import('views/lyout/index'),
  //   //   children: [
  //   //     {
  //   //       path: 'subcontractorSet',
  //   //       name: 'subcontractorSet',
  //   //       component: () => import('views/companyProject/subcontractorSet/subcontractorSet'),
  //   //       meta: {title: "分包商设置", name: "分包商设置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'projectAdd',
  //   //       name: 'projectAdd',
  //   //       component: () => import('views/companyProject/projectAdd/projectAdd'),
  //   //       meta: {title: "添加项目", name: "添加项目", isCached: 1}
  //   //     },
  //   //     {
  //   //       path: 'projectMembers',
  //   //       name: 'projectMembers',
  //   //       component: () => import('views/companyProject/projectMembers/projectMembers'),
  //   //       meta: {title: "项目成员设置", name: "项目成员设置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'receiveMasterUnit',
  //   //       name: 'receiveMasterUnit',
  //   //       component: () => import('views/companyProject/receiveMasterUnit/receiveMasterUnit'),
  //   //       meta: {title: "领料单位设置", name: "领料单位设置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'subproject',
  //   //       name: 'subproject',
  //   //       component: () => import('views/companyProject/subproject/subproject'),
  //   //       meta: {title: "子工程设置", name: "子工程设置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'projectPost',
  //   //       name: 'projectPost',
  //   //       component: () => import('views/companyProject/projectPost/projectPost'),
  //   //       meta: {title: "项目岗位设置", name: "项目岗位设置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'management',
  //   //       name: 'management',
  //   //       component: () => import('views/management/management'),
  //   //       meta: {title: "项目状态管理", name: "项目状态管理", isCached: 1}
  //   //     },
  //   //   ]
  //   // },
  //   //财务配置
  //   // {
  //   //   path: '',
  //   //   name: 'financialAllocation',
  //   //   component: () => import('views/lyout/index'),
  //   //   children: [
  //   //     {
  //   //       path: 'projectBudget',
  //   //       name: 'projectBudget',
  //   //       component: () => import('views/financialAllocation/projectBudget/projectBudget'),
  //   //       meta: {title: "项目收支科目", name: "项目收支科目", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'companyRevenue',
  //   //       name: 'companyRevenue',
  //   //       component: () => import('views/financialAllocation/companyRevenue/companyRevenue'),
  //   //       meta: {title: "公司收支科目", name: "公司收支科目", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'corporateAccounts',
  //   //       name: 'corporateAccounts',
  //   //       component: () => import('views/financialAllocation/corporateAccounts/corporateAccounts'),
  //   //       meta: {title: "公司账户登记", name: "公司账户登记", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'standbyFund',
  //   //       name: 'standbyFund',
  //   //       component: () => import('views/financialAllocation/standbyFund/standbyFund'),
  //   //       meta: {title: "备用金指标管理", name: "备用金指标管理", isCached: 0}
  //   //     }
  //   //   ]
  //   // },
  //   //流程管理
  //   {
  //     path: '',
  //     name: 'process',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       {
  //         path: 'processCompanyEdit/:statusCode/:type',
  //         // component: _import('processDefinition/processEdit'),
  //         component: () => import('views/processDefinition/processCompanyEdit'),
  //         name: 'processCompanyEdit',
  //         meta: {title: '企业表单编辑', name: '企业表单编辑', isCached: true, lastRouterName: 'processCompanyMenu'}
  //       },
  //       //     {
  //       //       path: 'companyDesign',
  //       //       name: 'companyDesign',
  //       //       component: () => import('views/processDefinition/companyDesign'),
  //       //       meta: {title: "企业流程定义", name: "企业流程定义", isCached: 1}
  //       //     },
  //       //     {
  //       //       path: 'publish',
  //       //       name: 'publish',
  //       //       component: () => import('views/publish/publish'),
  //       //       meta: {title: "企业流程发布", name: "企业流程发布", isCached: 1}
  //       //     },
  //       //     {
  //       //       path: 'processCompanyMenu',
  //       //       name: 'processCompanyMenu',
  //       //       component: () => import('views/processDefinition/processMenu'),
  //       //       meta: {title: "流程表单维护", name: "流程表单维护", isCached: 1}
  //       //     },
  //       //     {
  //       //       path: 'Monitor',
  //       //       name: 'Monitor',
  //       //       component: () => import('views/Monitor/Monitor'),
  //       //       meta: {title: "流程监控", name: "流程监控", isCached: 1}
  //       //
  //       //     },
  //       //     {
  //       //       path: 'processQuery',
  //       //       name: 'processQuery',
  //       //       component: () => import('views/Monitor/processQuery'),
  //       //       meta: {title: "流程查询", name: "流程查询", isCached: 1}
  //       //     },
  //       //     {
  //       //       path: 'needToBeDealtWith',
  //       //       name: 'needToBeDealtWith',
  //       //       component: () => import('views/process/needToBeDealtWith'),
  //       //       meta: {title: "我的待办", name: "我的待办", isCached: 0}
  //       //     },
  //       //     {
  //       //       path: 'toDeRead',
  //       //       name: 'toDeRead',
  //       //       component: () => import('views/process/toDeRead'),
  //       //       meta: {title: "我的待阅", name: "我的待阅", isCached: 0}
  //       //     },
  //       //     {
  //       //       path: 'Apply',
  //       //       name: 'Apply',
  //       //       component: () => import('views/process/Apply'),
  //       //       meta: {title: "我的申请", name: "我的申请", isCached: 0}
  //       //     },
  //       //     {
  //       //       path: 'Read',
  //       //       name: 'Read',
  //       //       component: () => import('views/process/Read'),
  //       //       meta: {title: "我的已阅", name: "我的已阅", isCached: 0}
  //       //     },
  //       //     {
  //       //       path: 'alreadyDone',
  //       //       name: 'alreadyDone',
  //       //       component: () => import('views/process/alreadyDone'),
  //       //       meta: {title: "我的已办", name: "我的已办", isCached: 0}
  //       //     }
  //       //
  //     ]
  //   },
  //   //配置管理
  //   // {
  //   //   path: '',
  //   //   name: 'systemSet',
  //   //   component: () => import('views/lyout/index'),
  //   //   children: [
  //   //     {
  //   //       path: 'conmaterial',
  //   //       name: 'conmaterial',
  //   //       component: () => import('views/conmaterial/conmaterial'),
  //   //       meta: {title: "企业编码库", name: "企业编码库", isCached: 1}
  //   //     },
  //   //     {
  //   //       path: 'companyDataDictionary',
  //   //       name: 'companyDataDictionary',
  //   //       component: () => import('views/companyDataDictionary/companyDataDictionary'),
  //   //       meta: {title: "数据字典维护", name: "数据字典维护", isCached: 1}
  //   //     },
  //   //     {
  //   //       path: 'printTemplate',
  //   //       name: 'printTemplate',
  //   //       component: () => import('views/printDesign/printTemplate'),
  //   //       meta: {title: "打印模版配置", name: "打印模版配置", isCached: 0}
  //   //     },
  //   //     {
  //   //       path: 'companyShortMessage',
  //   //       name: 'companyShortMessage',
  //   //       component: () => import('views/companyShortMessage/companyShortMessage'),
  //   //       meta: {title: "短信发送记录", name: "短信发送记录", isCached: 1}
  //   //     }
  //   //
  //   //   ]
  //   // },
  //   //供应商管理
  //   {
  //     path: '',
  //     name: 'supplierManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'supplierPerformance',
  //       //   name: 'supplierPerformance',
  //       //   component: () => import('views/supplierManagement/supplierPerformance/supplierPerformance'),
  //       //   meta: {title: "供应商履约评价表", name: "供应商履约评价表", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'supplierInclusion',
  //       //   name: 'supplierInclusion',
  //       //   component: () => import('views/supplierManagement/supplierInclusion'),
  //       //   meta: {title: "供应商收录", name: "供应商收录", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'assessment',
  //       //   name: 'assessment',
  //       //   component: () => import('views/supplierManagement/assessment'),
  //       //   meta: {title: "供应商考核", name: "供应商考核", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'evaluate',
  //       //   name: 'evaluate',
  //       //   component: () => import('views/supplierManagement/evaluate'),
  //       //   meta: {title: "供应商评价", name: "供应商评价", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'supplier',
  //       //   name: 'supplier',
  //       //   component: () => import('views/supplierManagement/supplier'),
  //       //   meta: {title: "供应商一览表", name: "供应商一览表", isCached: 1}
  //       // }
  //     ]
  //   },
  //   //需求计划
  //   {
  //     path: '',
  //     name: 'demMasterMangment',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'budget',
  //       //   name: 'budget',
  //       //   component: () => import('views/budget/budget'),
  //       //   meta: {title: "投标预算维护", name: "投标预算维护", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'demMasterPlan',
  //       //   name: 'demMasterPlan',
  //       //   component: () => import('views/demMasterPlan/demMasterPlan'),
  //       //   meta: {title: "施工总预算维护", name: "施工总预算维护", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'yearMasterPlan',
  //       //   name: 'yearMasterPlan',
  //       //   component: () => import('views/demMasterPlan/yearMasterPlan/yearMasterPlan'),
  //       //   meta: {title: "年度需求计划", name: "年度需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'seasonMasterPlan',
  //       //   name: 'seasonMasterPlan',
  //       //   component: () => import('views/demMasterPlan/seasonMasterPlan/seasonMasterPlan'),
  //       //   meta: {title: "季度需求计划", name: "季度需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'monthMasterPlan',
  //       //   name: 'monthMasterPlan',
  //       //   component: () => import('views/demMasterPlan/monthMasterPlan/monthMasterPlan'),
  //       //   meta: {title: "月度需求计划", name: "月度需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'temporaryMasterPlan',
  //       //   name: 'temporaryMasterPlan',
  //       //   component: () => import('views/demMasterPlan/temporaryMasterPlan/temporaryMasterPlan'),
  //       //   meta: {title: "临时需求计划", name: "临时需求计划", isCached: 1}
  //       // }
  //
  //     ]
  //   },
  //   //采购管理
  //   {
  //     path: '',
  //     name: 'procurement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'procurementPlan',
  //       //   name: 'procurementPlan',
  //       //   component: () => import('views/procurementPlan/procurementPlan'),
  //       //   meta: {title: "采购计划", name: "采购计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'inquiry',
  //       //   name: 'inquiry',
  //       //   component: () => import('views/procurementPlan/inquiry/inquiry'),
  //       //   meta: {title: "询价比价单", name: "询价比价单", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'tendering',
  //       //   name: 'tendering',
  //       //   component: () => import('views/procurementPlan/tendering/tendering'),
  //       //   meta: {title: "招标/开标登记", name: "招标/开标登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'letterOfAcceptance',
  //       //   name: 'letterOfAcceptance',
  //       //   component: () => import('views/procurementPlan/letterOfAcceptance/letterOfAcceptance'),
  //       //   meta: {title: "中标通知书登记", name: "中标通知书登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'contract',
  //       //   name: 'contract',
  //       //   component: () => import('views/contractAndOrder/contract'),
  //       //   meta: {title: "合同评审与签订", name: "合同评审与签订", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'order',
  //       //   name: 'order',
  //       //   component: () => import('views/contractAndOrder/order'),
  //       //   meta: {title: "供货订单", name: "供货订单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'checkAndAccept',
  //       //   name: 'checkAndAccept',
  //       //   component: () => import('views/checkAndAccept/checkAndAccept'),
  //       //   meta: {title: "到货验收", name: "到货验收", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'returnGoods',
  //       //   name: 'returnGoods',
  //       //   component: () => import('views/procurementPlan/returnGoods/returnGoods'),
  //       //   meta: {title: "退货单", name: "退货单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'invoice',
  //       //   name: 'invoice',
  //       //   component: () => import('views/procurementPlan/invoice/invoice'),
  //       //   meta: {title: "发票登记", name: "发票登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'payContract',
  //       //   name: 'payContract',
  //       //   component: () => import('views/procurementPlan/payContract/payContract'),
  //       //   meta: {title: "合同支付", name: "合同支付", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'contractsettle',
  //       //   name: 'contractsettle',
  //       //   component: () => import('views/procurementPlan/contractsettle/contractsettle'),
  //       //   meta: {title: "合同结算", name: "合同结算", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'sporadicPurchase',
  //       //   name: 'sporadicPurchase',
  //       //   component: () => import('views/procurementPlan/sporadicPurchase/sporadicPurchase'),
  //       //   meta: {title: "零星采购申请", name: "零星采购申请", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'reimbursement',
  //       //   name: 'reimbursement',
  //       //   component: () => import('views/procurementPlan/reimbursement/reimbursement'),
  //       //   meta: {title: "报销登记", name: "报销登记", isCached: 0}
  //       // }
  //
  //     ]
  //   },
  //   //项目仓库管理
  //   {
  //     path: '',
  //     name: 'warehouseManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       {
  //         path: 'straightForwardSet/:type/:id',
  //         name: 'straightForwardSet',
  //         component: () => import('views/warehouseManagement/straightForward/straightForwardSet'),
  //         meta: {title: "直进直出单添加", name: "直进直出单添加", isCached: 1, lastRouteName: 'straightForward'}
  //       },
  //       {
  //         path: 'warehousingSet',
  //         name: 'warehousingSet',
  //         component: () => import('views/warehouseManagement/warehousing/warehousingSet'),
  //         meta: {title: "入库单添加", name: "入库单添加", isCached: 1, lastRouteName: 'warehousing'}
  //       },
  //       {
  //         path: 'warehousingAgain',
  //         name: 'warehousingAgain',
  //         component: () => import('views/warehouseManagement/warehousing/warehousingAgain'),
  //         meta: {title: "入库单", name: "入库单", isCached: 1}
  //       },
  //       {
  //         path: 'warehousingAgainSet/:type/:id',
  //         name: 'warehousingAgainSet',
  //         component: () => import('views/warehouseManagement/warehousing/warehousingAgainSet'),
  //         meta: {title: "入库单添加1", name: "入库单添加1", isCached: 1, lastRouteName: 'warehousingAgain'}
  //       },
  //       {
  //         path: 'outboundSet/:type/:id',
  //         name: 'outboundSet',
  //         component: () => import('views/warehouseManagement/outbound/outboundSet'),
  //         meta: {title: "出库单添加", name: "出库单添加", isCached: 1, lastRouteName: 'outbound'}
  //       },
  //       // {
  //       //   path: 'maintain',
  //       //   name: 'maintain',
  //       //   component: () => import('views/warehouseManagement/maintain'),
  //       //   meta: {title: "仓库创建维护", name: "仓库创建维护", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'straightForward',
  //       //   name: 'straightForward',
  //       //   component: () => import('views/warehouseManagement/straightForward/straightForward'),
  //       //   meta: {title: "直进直出单", name: "直进直出单", isCached: 1}
  //       // },
  //
  //       // {
  //       //   path: 'outbound',
  //       //   name: 'outbound',
  //       //   component: () => import('views/warehouseManagement/outbound/outbound'),
  //       //   meta: {title: "出库单", name: "出库单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'return',
  //       //   name: 'return',
  //       //   component: () => import('views/warehouseManagement/return/return'),
  //       //   meta: {title: "退库单", name: "退库单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'warReturnGoods',
  //       //   name: 'warReturnGoods',
  //       //   component: () => import('views/procurementPlan/returnGoods/returnGoods'),
  //       //   meta: {title: "仓库退货单", name: "仓库退货单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'borrow',
  //       //   name: 'borrow',
  //       //   component: () => import('views/warehouseManagement/borrow/borrow'),
  //       //   meta: {title: "借用单", name: "借用单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'back',
  //       //   name: 'back',
  //       //   component: () => import('views/warehouseManagement/back/back'),
  //       //   meta: {title: "归还单", name: "归还单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'inventory',
  //       //   name: 'inventory',
  //       //   component: () => import('views/warehouseManagement/inventory/inventory'),
  //       //   meta: {title: "盘点单", name: "盘点单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'allocation',
  //       //   name: 'allocation',
  //       //   component: () => import('views/warehouseManagement/allocation/allocation'),
  //       //   meta: {title: "调拨单", name: "调拨单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'reportloss',
  //       //   name: 'reportloss',
  //       //   component: () => import('views/warehouseManagement/reportloss/reportloss'),
  //       //   meta: {title: "报损单", name: "报损单", isCached: 1}
  //       // }
  //
  //     ]
  //   },
  //   //采购管理
  //   {
  //     path: '',
  //     name: 'machineryLeasing',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'budLease',
  //       //   name: 'budLease',
  //       //   component: () => import('views/lease/budLease/budLease'),
  //       //   meta: {title: "投标预算登记", name: "投标预算登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'demmasterLease',
  //       //   name: 'demmasterLease',
  //       //   component: () => import('views/lease/demmasterLease/demmasterLease'),
  //       //   meta: {title: "施工总预算登记", name: "施工总预算登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'monthLease',
  //       //   name: 'monthLease',
  //       //   component: () => import('views/lease/monthLease/monthLease'),
  //       //   meta: {title: "月度需求计划", name: "月度需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'temporaryLease',
  //       //   name: 'temporaryLease',
  //       //   component: () => import('views/lease/temporaryLease/temporaryLease'),
  //       //   meta: {title: "临时需求计划", name: "临时需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'procurementLease',
  //       //   name: 'procurementLease',
  //       //   component: () => import('views/lease/procurementLease/procurementLease'),
  //       //   meta: {title: "机械租赁计划", name: "机械租赁计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'inquiryLease',
  //       //   name: 'inquiryLease',
  //       //   component: () => import('views/lease/inquiryLease/inquiryLease'),
  //       //   meta: {title: "租赁询价单", name: "租赁询价单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'contractLease',
  //       //   name: 'contractLease',
  //       //   component: () => import('views/lease/contractLease/contractLease'),
  //       //   meta: {title: "租赁合同签订", name: "租赁合同签订", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'leaallocationLease',
  //       //   name: 'leaallocationLease',
  //       //   component: () => import('views/lease/leaallocationLease/leaallocationLease'),
  //       //   meta: {title: "内部调拨申请", name: "内部调拨申请", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'approachLease',
  //       //   name: 'approachLease',
  //       //   component: () => import('views/lease/approachLease/approachLease'),
  //       //   meta: {title: "进场登记", name: "进场登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'installLease',
  //       //   name: 'installLease',
  //       //   component: () => import('views/lease/installLease/installLease'),
  //       //   meta: {title: "安装验收", name: "安装验收", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'operationRegistration',
  //       //   name: 'operationRegistration',
  //       //   component: () => import('views/lease/operationRegistration/operationRegistration'),
  //       //   meta: {title: "运行登记单", name: "运行登记单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'maintenanceLease',
  //       //   name: 'maintenanceLease',
  //       //   component: () => import('views/lease/maintenanceLease/maintenanceLease'),
  //       //   meta: {title: "维修登记单", name: "维修登记单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'maintainLease',
  //       //   name: 'maintainLease',
  //       //   component: () => import('views/lease/maintainLease/maintainLease'),
  //       //   meta: {title: "保养登记单", name: "保养登记单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'exitRegistrationLease',
  //       //   name: 'exitRegistrationLease',
  //       //   component: () => import('views/lease/exitRegistrationLease/exitRegistrationLease'),
  //       //   meta: {title: "退场登记", name: "退场登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'payContractLease',
  //       //   name: 'payContractLease',
  //       //   component: () => import('views/lease/payContractLease/payContractLease'),
  //       //   meta: {title: "合同支付", name: "合同支付", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'invoiceLease',
  //       //   name: 'invoiceLease',
  //       //   component: () => import('views/lease/invoiceLease/invoiceLease'),
  //       //   meta: {title: "发票登记", name: "发票登记", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'contractsettleLease',
  //       //   name: 'contractsettleLease',
  //       //   component: () => import('views/lease/contractsettleLease/contractsettleLease'),
  //       //   meta: {title: "租赁结算单", name: "租赁结算单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'specialWorkLease',
  //       //   name: 'specialWorkLease',
  //       //   component: () => import('views/lease/specialWorkLease/specialWorkLease'),
  //       //   meta: {title: "特种作业人员登记单", name: "特种作业人员登记单", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'otherLease',
  //       //   name: 'otherLease',
  //       //   component: () => import('views/lease/otherLease/otherLease'),
  //       //   meta: {title: "其它过程资料件提交", name: "其它过程资料件提交", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'ledgerLease',
  //       //   name: 'ledgerLease',
  //       //   component: () => import('views/lease/ledgerLease/ledgerLease'),
  //       //   meta: {title: "项目机械设备台账", name: "项目机械设备台账", isCached: 0}
  //       // }
  //     ]
  //   },
  //   //甲供物资管理
  //   {
  //     path: '',
  //     name: 'nailSupply',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'budSupply',
  //       //   name: 'budSupply',
  //       //   component: () => import('views/nailSupply/budSupply/budSupply'),
  //       //   meta: {title: "甲供物资总预算", name: "甲供物资总预算", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'demmasterSupply',
  //       //   name: 'demmasterSupply',
  //       //   component: () => import('views/nailSupply/demmasterSupply/demmasterSupply'),
  //       //   meta: {title: "甲供需求计划", name: "甲供需求计划", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'checkAndAcceptSupply',
  //       //   name: 'checkAndAcceptSupply',
  //       //   component: () => import('views/nailSupply/checkAndAcceptSupply/checkAndAcceptSupply'),
  //       //   meta: {title: "到货验收", name: "到货验收", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'contractsettleSupply',
  //       //   name: 'contractsettleSupply',
  //       //   component: () => import('views/nailSupply/contractsettleSupply/contractsettleSupply'),
  //       //   meta: {title: "甲供物资结算", name: "甲供物资结算", isCached: 1}
  //       // }
  //
  //     ]
  //   },
  //   //物资材料过程管理
  //   {
  //     path: '',
  //     name: 'processManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'InstallationAndCommissioning',
  //       //   name: 'InstallationAndCommissioning',
  //       //   component: () => import('views/processManagement/InstallationAndCommissioning/InstallationAndCommissioning'),
  //       //   meta: {title: "设备安装调试", name: "设备安装调试", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'materialTesting',
  //       //   name: 'materialTesting',
  //       //   component: () => import('views/processManagement/materialTesting/materialTesting'),
  //       //   meta: {title: "材料检测", name: "材料检测", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'reprocessing',
  //       //   name: 'reprocessing',
  //       //   component: () => import('views/processManagement/reprocessing/reprocessing'),
  //       //   meta: {title: "再加工管理", name: "再加工管理", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'surplusRecovery',
  //       //   name: 'surplusRecovery',
  //       //   component: () => import('views/processManagement/surplusRecovery/surplusRecovery'),
  //       //   meta: {title: "余料回收处理", name: "余料回收处理", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'weighbridge',
  //       //   name: 'weighbridge',
  //       //   component: () => import('views/processManagement/weighbridge/weighbridge'),
  //       //   meta: {title: "地磅管理", name: "地磅管理", isCached: 1}
  //       // },
  //
  //     ]
  //   },
  //   //固定资产管理
  //   {
  //     path: '',
  //     name: 'fixedAssetsManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'companyWarehouse',
  //       //   name: 'companyWarehouse',
  //       //   component: () => import('views/fixedAssetsManagement/companyWarehouse'),
  //       //   meta: {title: "公司仓库维护", name: "公司仓库维护", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgIncoming',
  //       //   name: 'orgIncoming',
  //       //   component: () => import('views/fixedAssetsManagement/orgIncoming/orgIncoming'),
  //       //   meta: {title: "固定资产入库", name: "固定资产入库", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgOutbound',
  //       //   name: 'orgOutbound',
  //       //   component: () => import('views/fixedAssetsManagement/orgOutbound/orgOutbound'),
  //       //   meta: {title: "固定资产出库", name: "固定资产出库", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgBorrow',
  //       //   name: 'orgBorrow',
  //       //   component: () => import('views/fixedAssetsManagement/orgBorrow/orgBorrow'),
  //       //   meta: {title: "固定资产借用", name: "固定资产借用", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgBack',
  //       //   name: 'orgBack',
  //       //   component: () => import('views/fixedAssetsManagement/orgBack/orgBack'),
  //       //   meta: {title: "固定资产归还", name: "固定资产归还", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgReportloss',
  //       //   name: 'orgReportloss',
  //       //   component: () => import('views/fixedAssetsManagement/orgReportloss/orgReportloss'),
  //       //   meta: {title: "固定资产报损", name: "固定资产报损", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgReturn',
  //       //   name: 'orgReturn',
  //       //   component: () => import('views/fixedAssetsManagement/orgReturn/orgReturn'),
  //       //   meta: {title: "固定资产退库", name: "固定资产退库", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgAllocation',
  //       //   name: 'orgAllocation',
  //       //   component: () => import('views/fixedAssetsManagement/orgAllocation/orgAllocation'),
  //       //   meta: {title: "固定资产调出", name: "固定资产调出", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgAllocationIn',
  //       //   name: 'orgAllocationIn',
  //       //   component: () => import('views/fixedAssetsManagement/orgAllocationIn/orgAllocationIn'),
  //       //   meta: {title: "固定资产调入", name: "固定资产调入", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgInventory',
  //       //   name: 'orgInventory',
  //       //   component: () => import('views/fixedAssetsManagement/orgInventory/orgInventory'),
  //       //   meta: {title: "固定资产盘点", name: "固定资产盘点", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgWarehouse',
  //       //   name: 'orgWarehouse',
  //       //   component: () => import('views/fixedAssetsManagement/orgWarehouse/orgWarehouse'),
  //       //   meta: {title: "固定资产台账", name: "固定资产台账", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'orgMaintain',
  //       //   name: 'orgMaintain',
  //       //   component: () => import('views/fixedAssetsManagement/orgMaintain/orgMaintain'),
  //       //   meta: {title: "固定资产保养", name: "固定资产保养", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'repair',
  //       //   name: 'repair',
  //       //   component: () => import('views/fixedAssetsManagement/repair/repair'),
  //       //   meta: {title: "固定资产维修", name: "固定资产维修", isCached: 0}
  //       // }
  //
  //     ]
  //   },
  //   //统计管理
  //   {
  //     path: '',
  //     name: 'statisticalManagement',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'budgetOverview',
  //       //   name: 'budgetOverview',
  //       //   component: () => import('views/statisticalManagement/budgetOverview'),
  //       //   meta: {title: "物资成本核算", name: "物资成本核算", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'budgetDetailed',
  //       //   name: 'budgetDetailed',
  //       //   component: () => import('views/statisticalManagement/budgetDetailed'),
  //       //   meta: {title: "物资成本核算明细", name: "物资成本核算明细", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'ContractOrderStatistics',
  //       //   name: 'ContractOrderStatistics',
  //       //   component: () => import('views/statisticalManagement/ContractOrderStatistics'),
  //       //   meta: {title: "合同/订单统计", name: "合同/订单统计", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'InventoryStatistics',
  //       //   name: 'InventoryStatistics',
  //       //   component: () => import('views/statisticalManagement/InventoryStatistics'),
  //       //   meta: {title: "库存统计", name: "库存统计", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'WarehouseStatistics',
  //       //   name: 'WarehouseStatistics',
  //       //   component: () => import('views/statisticalManagement/WarehouseStatistics'),
  //       //   meta: {title: "仓库盘点统计", name: "仓库盘点统计", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'WarehouseReport',
  //       //   name: 'WarehouseReport',
  //       //   component: () => import('views/statisticalManagement/WarehouseReport'),
  //       //   meta: {title: "仓库报表", name: "仓库报表", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'SupplierStatistics',
  //       //   name: 'SupplierStatistics',
  //       //   component: () => import('views/statisticalManagement/SupplierStatistics'),
  //       //   meta: {title: "供应商一览", name: "供应商一览", isCached: 1}
  //       // },
  //       // {
  //       //   path: 'SupplierCurrentAccount',
  //       //   name: 'SupplierCurrentAccount',
  //       //   component: () => import('views/statisticalManagement/SupplierCurrentAccount'),
  //       //   meta: {title: "供应商账款", name: "供应商账款", isCached: 1}
  //       // }
  //     ]
  //   },
  //   {
  //     path: '',
  //     name: 'receivable',
  //     component: () => import('views/lyout/index'),
  //     children: [
  //       // {
  //       //   path: 'InvoiceRegistration',
  //       //   name: 'InvoiceRegistration',
  //       //   component: () => import('views/receivable/InvoiceRegistration/InvoiceRegistration'),
  //       //   meta: {title: "项目开票登记", name: "项目开票登记", isCached: 0}
  //       // },
  //       // {
  //       //   path: 'InvoiceRegistrationEdit',
  //       //   name: 'InvoiceRegistrationEdit',
  //       //   component: () => import('views/receivable/InvoiceRegistrationEdit/InvoiceRegistrationEdit'),
  //       // }
  //     ]
  //   },
  // ]
})
