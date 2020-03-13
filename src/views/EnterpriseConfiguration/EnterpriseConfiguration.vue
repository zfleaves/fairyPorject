<template>
  <div class="EnterpriseConfiguration">
    <ul class="top">
      <li v-for="(item,index) in tabBarList"
          @click="handleChangeTabBar(index)"
          :class="currentIndex===index?'active':''" :key="index">
        {{item.title}}
      </li>
    </ul>
    <div class="main" ref="main">
      <ul class="left">
        <li style="height: 50px;line-height: 50px;">企业关键路径</li>
        <li
          :style="{height:checkBoxHeight,lineHeight:checkBoxHeight}"
          v-for="(item,index) in tableData" :key="index">
          <div class="checkBox">
            <el-checkbox
              :disabled="item.disabled"
              :value="item.defaultChecked === 0"
              @change="val => {
                      $set(item,'defaultChecked',val ? 0 : 1)}">
            </el-checkbox>
          </div>
          <div class="modelName" v-html="item.modelName">

          </div>
        </li>
      </ul>
      <div class="right">
        <div class="title">
          <span class="tit">业务模型图解</span>
          <el-button type="primary" size="small" icon="el-icon-search">保存</el-button>
        </div>
        <div class="one" ref="rightContent">
          <div class="checkBoxCons" :style="{left:secondLeft/2+'px'}">
            <ul class="firstCheck">
              <li v-for="(item,index) in checkModelList1" :key="index">
                <p>{{item.modelName}}</p>
                <img class="last" v-if="index===checkModelList1.length-1 && checkModelList2.length"
                     src="../../../static/images/left.png" alt="">
                <img v-if="index!==checkModelList1.length-1" src="static/images/next.png" alt="">
              </li>
            </ul>
            <ul class="secondCheck" :style="{right:secondLeft+'px'}">
              <li v-for="(item,index) in checkModelList2" :key="index">
                <p>{{item.modelName}}</p>
                <img class="last" v-if="index===checkModelList2.length-1 && checkModelList3.length"
                     src="../../../static/images/left.png" alt="">
                <img v-if="index!==checkModelList2.length-1" src="../../../static/images/prev.png" alt="">
              </li>
            </ul>
            <ul class="firstCheck" :style="{right:secondLeft+'px'}">
              <li v-for="(item,index) in checkModelList3" :key="index">
                <p>{{item.modelName}}</p>
                <img class="last" v-if="index===checkModelList3.length-1 && checkModelList4.length"
                     src="../../../static/images/left.png" alt="">
                <img v-if="index!==checkModelList3.length-1" src="../../../static/images/next.png" alt="">
              </li>
            </ul>
            <ul class="secondCheck">
              <li v-for="(item,index) in checkModelList4" :key="index">
                <p>{{item.modelName}}</p>
                <img class="last" v-if="index===checkModelList4.length-1" src="../../../static/images/left.png" alt="">
                <img v-if="index!==checkModelList4.length-1" src="../../../static/images/prev.png" alt="">
              </li>
            </ul>
          </div>
        </div>
        <div class="two">
          <p><span>概述：</span><span>系统默认提供了一套企业通用业务标准，用于约束业务之间的数据引用规则与控制依据，保证物资管理工作的有序、规范、可控。</span></p>
          <p><span>应用：</span><span>您可以根据自己企业的制度特点来对系统使用的业务标准进行自定义设置。您不能取消系统默认必须选择的关键业务点，这是物资管理应该具备的最低管理要求。</span></p>
          <p><span>区别：</span><span>业务配置是对业务数据逻辑引用源进行控制，而不会对功能菜单权限进行控制，功能菜单权限由岗位授权决定。</span></p>
          <p><span>生效：</span><span>配置的业务标准在项目创建时初始化给项目并生效，您修改业务配置对已经启动的项目无效，对后续创建的项目有效。</span></p>
          <p><span>示例：</span><span>如果您的企业不需要项目填到采购申请，则不勾选采购申请。那么采购合同明细的数据来源不再从采购申请中选，而是从采购合同的前一步被勾选业务明细中选择。</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPassportCfgCompanyServices, getPassportCfgCompanyFlagCanupdate} from 'api/EnterpriseConfiguration'

  export default {
    name: 'EnterpriseConfiguration',
    data() {
      return {
        currentIndex: 0,
        tabBarList: [
          {title: '设备材料业务配置', id: 1},
          {title: '机械租赁业务配置', id: 2},
        ],
        tableData: [],
        checkBoxLength: 14,
        checkBoxHeight: '30px',
        rightContentWidth: '200px',
        checkModelLength: 5,
        secondLeft: 100,
        page: '',
        pageIndex: 3,
        checkList: [],
        checkModelList1: [],
        checkModelList2: [],
        checkModelList3: [],
        checkModelList4: [],
      }
    },
    watch: {
      tableData: {
        deep: true,
        handler() {
          this.checkList = this.tableData.filter(v => v.defaultChecked === 0 && !v.defineFlag);

          this.setCheckList();
        }
      },
      menubarShowOrHide() {
        this.setCheckList();
      }
    },
    computed: {
      menubarShowOrHide() {
        return this.$store.state.menubar.menubarShowOrHide
      }
    },
    created() {
      this._getPassportCfgCompanyServices();
    },
    mounted() {
      window.addEventListener('resize', this.setCheckList);
    },
    methods: {
      _getPassportCfgCompanyServices() {
        getPassportCfgCompanyServices().then(res => {
          this.setBusinessData(res.results);
          this.tableData = res.results.filter(v => v.isDataResource === 0);
          this._getServiceFlag();
        })
      },
      setBusinessData(arr) {
        for (let i in arr) {
          let item = arr[i];
          item.disabled = item.flag === 0;
          item.defineFlag = false;
        }
      },
      // 获取企业规定是否允许取消选择
      _getServiceFlag() {
        getPassportCfgCompanyFlagCanupdate().then(res => {
          let flag = res.results === 1 ? 0 : 1;
          let item = {
            defineFlag: true,
            defaultChecked: flag,
            flag: flag,
            modelName: "<span style='font-weight: bold'>不允许项目自定义配置</span>",
            isDataResource: 0,
            remark: '建议此功能按照默认设置勾选。如果您去掉勾选将如下效果：项目经理可以对业务进行配置，他可以增加或者减少物资管理业务功能点，如减少则会造成业务管理简单，不利于对项目物资管理的监控，失去管理意义。' +
            '如果您保持默认勾选，则项目的再次自定义项目业务配置按钮将禁用，项目会按照您设置的公司管理制度进行数据维护工作，有利于公司统一标准物资管理业务制度。',
          };
          this.tableData.push(item);
          this.setCheckBoxHeight();
          // this.flag = res.results === 1 ? true : false
        })
      },
      // 设置行高
      setCheckBoxHeight() {
        if (!this.$refs.main) return;
        this.$nextTick(() => {
          this.checkBoxLength = this.tableData.length;
          let setConsHeight = this.$refs.main.offsetHeight - 50;
          this.checkBoxHeight = (setConsHeight / this.checkBoxLength).toFixed(2) + 'px';
          // this.checkBoxHeight = Math.floor(setConsHeight / this.checkBoxLength) + 'px';
        })
      },
      // 设置一行多少个
      setCheckList() {
        this.$nextTick(() => {
          this.checkModelList1 = [];
          this.checkModelList2 = [];
          this.checkModelList3 = [];
          this.checkModelList4 = [];
          if (this.$refs.rightContent) {
            this.rightContentWidth = this.$refs.rightContent.offsetWidth - 40;
            this.checkModelLength = Math.floor(this.rightContentWidth / 150); // 一行多少个
            this.secondLeft = this.rightContentWidth - this.checkModelLength * 150 - 2; // 整体盒子偏移量
            let page = this.checkModelLength;  //4  this.checkList.length = 7
            let pageIndex = Math.ceil(this.checkList.length / page);  //2
            this.pageIndex = pageIndex;
            for (let i = 0; i < pageIndex; i++) {
              let num = i + 1;
              this['checkModelList' + num] = this.checkList.slice(i * page, (i + 1) * page);
              // this['checkModelList1'] = this.checkList.slice(0 * 4, (0 + 1) * 4);
              // this['checkModelList2'] = this.checkList.slice(1 * 4, (1 + 1) * 4);
            }
          }
        })
        // checkList: [],
        //   checkModelList1: [],
      },
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setCheckList)
    }
  }
</script>
<style scoped lang="scss">
  .EnterpriseConfiguration {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 10px;
    height: calc(100% - 20px);
    overflow: hidden;
    .top {
      width: 100%;
      height: 50px;
      // padding: 10px 0 0 20px;
      li {
        padding: 0px 10px;
        border-right: 2px solid #d1d1d1;
        color: #666;
        float: left;
        &.active {
          color: #3e75ff;
        }
      }
      &:last-child {
        border-right: none;
      }
    }
    .main {
      display: flex;
      height: calc(100% - 60px);
      border: 1px #d1d1d1 solid;
      .left {
        width: 220px;
        height: 100%;
        border-top: 1px #d1d1d1 solid;
        // &li:nth-child(1){

        // }
        li {
          border: 1px #d1d1d1 solid;
          border-top: none;
          height: 40px;
          line-height: 40px;
          text-align: center;
          .checkBox {
            float: left;
            height: 100%;
            width: 50px;
            text-align: center;
            border-right: 1px solid #D1D1D1;
          }
        }

      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        .title {
          height: 50px;
          border: 1px #d1d1d1 solid;
          line-height: 50px;
          font-size: 18px;
          font-weight: 600;
          padding: 0 20px;
          text-align: center;
          .tit {

          }
          button {
            float: right;
            margin-top: 8px;
          }
        }
        .one {
          /*min-height: 200px;*/
          flex: 1;
          /*overflow-y: auto;*/
          max-height: 52%;
        }
        .two {
          flex: 1;
          padding: 20px;
        }
      }
    }

    .checkBoxCons {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 20px;
      .firstCheck {
        width: 100%;
        height: 50px;
        /*overflow: hidden;*/
        margin-bottom: 50px;
        li {
          width: 150px;
          position: relative;
          float: left;
          height: 50px;
          &:last-child {
            width: 149px;
          }
          p {
            width: 100px;
            display: flex;
            font-size: 14px;
            color: #333333;
            height: 50px;
            align-items: center;
            background: #fdc136;
            justify-content: center;
            text-align: center;
          }
          img {
            position: absolute;
            width: 42px;
            height: 12px;
            left: 106px;
            top: 20px;
            &.last {
              height: 42px;
              width: 12px;
              top: 54px;
              left: 42px;
            }
          }
        }
      }

      .secondCheck {
        width: 100%;
        height: 50px;
        position: relative;
        right: 96px;
        /*overflow: hidden;*/
        margin-bottom: 50px;
        li {
          width: 150px;
          position: relative;
          float: right;
          height: 50px;
          &:last-child {
            width: 149px;
          }
          p {
            width: 100px;
            display: flex;
            font-size: 14px;
            color: #333333;
            height: 50px;
            align-items: center;
            background: #fdc136;
            justify-content: center;
            text-align: center;
          }
          img {
            position: absolute;
            width: 42px;
            height: 12px;
            left: -46px;
            top: 20px;
            &.last {
              height: 42px;
              width: 12px;
              top: 54px;
              left: 42px;
            }
          }
        }
      }
    }
  }

</style>
