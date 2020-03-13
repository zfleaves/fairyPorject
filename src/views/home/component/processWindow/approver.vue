<template>
  <div class="approver">
    <div class="treeCon">
      <componet-user
        v-bind="$attrs"
        v-on="$listeners">
      </componet-user>
    </div>
  </div>
</template>

<script>
  import {getOrgsList, getUserRoles} from 'api/warehouseManagement/straightForward/straightForward'
  import componetUser from './componetUser'

  export default {
    name: 'approver',
    components: {componetUser},
    data() {
      return {
        treeData: [],
        getOrgsLists: [],
        getUserRolesList: [],
        emptyText: '加载中...',
        roleFlag:false
      }
    },
    props: {},
    created() {
      // getOrgsList().then(res => {
      //   this.getOrgsLists = res.results
      //   console.log(this.getOrgsLists);
      //
      //   getUserRoles(this.getOrgsLists[0].id).then(res => {
      //     this.getUserRolesList = res.results
      //   })
      // })
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.getOrgsLists);
        } else {
          // 支出科目  parentId=-1
          // let newId = node.data.id === -2 ? -1 : node.data.id;
          // getProjectList(node.data.type, newId).then(res => {
          //     let ProjectList = res.results && res.results.length ? res.results : [];
          //     if (node.level === 3) {
          //     for (let i in ProjectList) {
          //         let item = ProjectList[i]
          //         item.leaf = true;
          //     }
          //     }
          //     resolve(ProjectList);
          // })

        }
      },
      //点击树形菜单
      nodeClick(event) {
        console.log(event);
      },
    }
  }
</script>
<style scoped lang="scss">
  .approver {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .name {
        flex: 1
      }
      .role {
        flex: 3
      }
    }
  }

</style>
