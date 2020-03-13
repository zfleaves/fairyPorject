<template>
  <dir class="projectBudget">
    <div class="projectBudgetTablecon">
      <div class="projectBudgetAuthorization_fix">
        <div class="tableHeader">
          <div class="subjectTypes">科目类型/科目名称</div>
          <div class="purpose">属性或用途</div>
          <div class="CostType">成本类型</div>
          <div class="SubjectNumber">科目编号</div>
          <div class="state">状态</div>
          <div class="Remarks">备注</div>
        </div>
        <div class="table_tree">
          <el-tree
            :data="subjectTypes"
            :props="props"
            :empty-text="emptyText"
            node-key="id"
            lazy
            :load="loadNode"
            highlight-current
            @node-click="nodeClick">
            <div class="custom-tree-node" slot-scope="{node}">
              <el-tooltip effect="dark" :content="node.data.subjectName" placement="top-start">
                <span
                  :class="'level'+node.level"
                  class="subjectName">{{node.data.subjectName}}</span>
              </el-tooltip>


              <span style="flex: 1;display: flex;justify-content: center;">
                  {{node.data.attributeName}}
              </span>

              <span style="flex: 1;display: flex;justify-content: center;">
                  {{node.data.isMaterial | setIsMaterial}}
              </span>
              <span style="flex: 2;display: flex;justify-content: center;">
                  {{node.data.subjectCode}}
              </span>
              <span style="flex: 2;display: flex;justify-content: center;">
                  {{node.data.status |  setStatus}}
              </span>
              <span style="flex: 2;display: flex;justify-content: center;">
                  {{node.data.remarks}}
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
  </dir>
</template>
<script>
  import {getProjectList} from 'api/projectBudget/projectBudget'

  export default {
    name: '',
    data() {
      return {
        subjectTypes: [
          {
            id: -1,
            subjectName: '收入科目',
            type: 1,

          },
          {
            id: -2,
            subjectName: '支出科目',
            type: 2
          }
        ],
        treeOrgsList: [],
        props: {
          label: function (node) {
            return node;
          },
          children: 'children',
          isLeaf: 'leaf'
        },
        emptyText: '加载中...'
      }
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.subjectTypes);
        } else {
          // 支出科目  parentId=-1
          let newId = node.data.id === -2 ? -1 : node.data.id;
          getProjectList(node.data.type, newId).then(res => {
            let ProjectList = res.results && res.results.length ? res.results : [];
            if (node.level === 3) {
              for (let i in ProjectList) {
                let item = ProjectList[i]
                item.leaf = true;
              }
            }
            resolve(ProjectList);
          })

        }
      },
      //点击树形菜单
      nodeClick(event) {
        console.log(event);

      },
    },
    filters: {
      setStatus(val) {
        if (val === 0) {
          return '正常'
        } else if (val === 1) {
          return '停用'
        } else {
          return ''
        }
      },
      setIsMaterial(val) {
        let arr = ['', '人工', '材料', '机械', '其他'];
        return val ? arr[val] : ''
      }
    },
  }
</script>
<style scoped lang='scss'>
  .projectBudget {
    width: 100%;
    height: 100%;
    .projectBudgetTablecon {
      width: 100%;
      padding: 0px;
      box-sizing: border-box;
      position: relative;
      height: 100%;
      .projectBudgetAuthorization_fix {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        overflow-y: auto;
        height: 100%;
        padding: 10px;
        border: 1px #ccc solid;
        &::-webkit-scrollbar {
          display: none;
        }
        .tableHeader {
          width: 100%;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px #ddd solid;
          .subjectTypes {
            flex: 5;
            text-align: center;
          }
          .purpose {
            flex: 1;
            text-align: center;
          }
          .CostType {
            flex: 1;
            text-align: center;
          }
          .SubjectNumber {
            flex: 2;
            text-align: center;
          }
          .state {
            flex: 2;
            text-align: center;
          }
          .Remarks {
            flex: 2;
            text-align: center;
          }
        }
        .custom-tree-node {
          display: flex;
          width: 100%;
          .subjectName {
            text-indent: 0px;
            flex: 5;
            &.level2 {
              text-indent: 18px;
            }
            &.level3 {
              text-indent: 36px;
            }
            &.level4 {
              text-indent: 54px;
            }
          }
        }
      }
    }
  }
</style>

