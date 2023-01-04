<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card ref="paramTreeInput" shadow="never" :max-height="this.tableHeight">
          <div class="heardDiv" :style="{ height: '50px' }">
            <el-input
              v-if="paramTreeList.length > 0"
              v-model="deptFilterText"
              style="margin-bottom: 15px"
              clearable
              placeholder="输入名称进行过滤"
            />
          </div>
          <div class="comDIv" :style="{ height: (screenHeight * 0.6) + 'px' }">
            <el-tree
              ref="paramTree"
              :style="{ overflow:'auto',height: '100%'}"
              :props="{ label: 'title', children: 'children'} "
              :data="paramTreeList"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              node-key="id"
              highlight-current
              :loading="treeLoading"
              @node-click="paramTableClick"
            />
          </div>
        </el-card>
      </el-col>

      <el-col id="paramInfoId" :span="18">
        <el-card shadow="never" class="el-card-define">
          <div class="heardDiv" :style="{ height: '50px' }">
            <el-menu ref="elMenu" mode="horizontal" @select="selectItems">
              <el-menu-item v-show="false" index="firstPage" />
              <el-menu-item index="nodeDetails">详情</el-menu-item>
              <el-menu-item v-permission="['paramMain:create']" index="addNode">新增</el-menu-item>
              <el-menu-item v-permission="['paramMain:update']" index="editNode">编辑</el-menu-item>
              <el-menu-item><el-button type="danger" @click="del">删除</el-button></el-menu-item>
            </el-menu>
          </div>

          <div class="comDIv" :style="{ height: (screenHeight * 0.6) + 'px' }">
            <components :is="currentView" ref="childrenComp" @done="handleDone" />
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { filterNode } from 'ecip-web/utils/tableUtil'
import { delById, getList } from './nodeSetting'
import nodeDetails from './components/nodeDetails'
import addNode from './components/addNode'
import editNode from './components/editNode'
import firstPage from './components/tip'

export default {
  name: 'NodeSettingView',
  components: { nodeDetails, addNode, editNode, firstPage },
  mixins: [...mixin],
  data() {
    return {
      treeLoading: false,
      showSearch: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      deptFilterText: '', //  组织搜索过滤条件
      queryParams: {},
      selectedNode: {},
      nodeData: {},
      paramTreeList: [], //  系统组织树
      columnsDataList: [],
      qryDataList: [],
      tableHeight: null,
      currentView: 'firstPage',
      screenHeight: document.body.clientHeight
    }
  },
  watch: {
    selections(val) {
      this.banState1 = val.length !== 1
      this.banState2 = val.length === 0
    },
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    },
    screenHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          // 打印screenWidth变化的值
          console.log(that.screenHeight)
          that.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getParamTree()
    },
    async getParamTree() {
      this.treeLoading = true
      getList().then(res => {
        this.paramTreeList = res.data

        this.$nextTick(() => {
          if (this.paramTreeList.length > 0 && this.paramTreeList[0].children.length > 0) {
            if (JSON.stringify(this.selectedNode) !== '{}') {
              this.$refs.paramTree.setCurrentKey(this.selectedNode.id)
              this.$refs.childrenComp.init(this.selectedNode)
            }
          }
          this.treeLoading = false
        })
      })
    },
    paramTableClick(node, Node) {
      this.selectedNode = node
      if (!node.tableName) {
        this.currentView = 'firstPage'
        return
      }
      this.currentView = 'nodeDetails'
      this.queryParams.tableName = node.tableName
      this.queryParams.id = node.id

      if (this.$refs.childrenComp.init) {
        this.$refs.childrenComp.init(this.selectedNode)
      }
      this.$refs.elMenu.activeIndex = 'nodeDetails'
    },
    filterNode(value, data, node) {
      return filterNode(value, data, node, 'title')
    },
    async selectItems(index) {
      if (!this.selectedNode.tableName && (index !== 'addNode')) {
        this.currentView = 'firstPage'
        return
      }
      if (index) {
        this.currentView = index
      }
    },
    handleDone(value, event) {
      if (value === 'save') {
        this.getParamTree()
      } else {
        this.$refs.childrenComp.init(this.selectedNode)
      }
    },
    async del() {
      if (!this.selectedNode.tableName) {
        this.$notify.warning('请选择一个节点')
        return
      }
      this.$confirm(`是否执行`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = { 'id': this.selectedNode.id }
        delById(param).then(res => {
          this.$notify.success(res.message)
          this.currentView = 'firstPage'
          this.getParamTree()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
