<template>
  <div class="app-container">
    <div class="floatOp">
      <el-row>
        <el-col>
          <el-button v-permission="['paramMain:genTable']" type="primary" :loading="saveLoading" @click="save">保存</el-button>
          <el-button v-permission="['paramMain:compareAndGenTable']" type="warning" :loading="compareGenLoading" @click="compareAndGenTable">对比初始化</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card ref="paramTreeInput" shadow="never" :max-height="this.tableHeight" class="el-card-define">
          <div :style="{ height: '50px' }">
            <el-input
              v-if="paramTreeList.length > 0"
              v-model="deptFilterText"
              style="margin-bottom: 15px"
              clearable
              placeholder="输入名称进行过滤"
            />
          </div>
          <div :style="{ height: (screenHeight * 0.6) + 'px' }">
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
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-form ref="searchForm" :model="selectedNode">
            <el-row>
              <el-col v-if="showTip" :span="8">
                <div ng-show="!selectNode.show" class="alert alert-warning margin-top-10" role="alert">
                  <span style="color:red"><strong>温馨提示</strong>&nbsp;请选择一个节点</span>
                </div>
              </el-col>
              <el-col v-if="showTableName" :span="8">                <el-form-item label="表名：" prop="tableName">
                {{ selectedNode.tableName }}
              </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <el-card shadow="never" :max-height="this.tableHeight">
          <div slot="header" class="clearfix">
            <span>表字段列表</span>
          </div>
          <div class="box">
            <vxe-grid
              ref="xTable"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              :max-height="300"
              :loading="loading"
              class="vxe-table-element"
              :columns="tableColumns"
              :data="columnsDataList"
            >
              <template v-slot:status_operation="{ row }">
                <el-switch v-model="row.status" active-color="#13ce66" active-value="1" inactive-value="0" />
              </template>

              <template v-slot:sort_operation="{ row }">
                <el-input-number v-model="row.sortNum" @change="updateSort(row)" />
              </template>

              <template v-slot:columnTitle_operation="{ row }">
                <el-input v-model="row.sTitle" @change="updateSort1(row)" />
              </template>
            </vxe-grid>
          </div>
        </el-card>

        <el-card shadow="never" :max-height="250">
          <div slot="header" class="clearfix">
            <span>查询字段列表</span>
          </div>
          <div class="box">
            <vxe-grid
              ref="xTableQry"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              :max-height="300"
              class="vxe-table-element"
              :columns="qryColumns"
              :data="qryDataList"
            >

              <template v-slot:qry_status_operation="{ row }">
                <el-switch v-model="row.status" active-color="#13ce66" active-value="1" inactive-value="0" @change="updateStatus(row, 'status')" />
              </template>

              <template v-slot:qry_dim_operation="{ row }">
                <el-switch v-model="row.dim" active-color="#13ce66" active-value="1" inactive-value="0" @change="updateStatus(row, 'dim')" />
              </template>

              <template v-slot:qry_columnTitle_operation="{ row }">
                <el-input v-model="row.label" @change="updateSort1(row)" />
              </template>

              <template v-slot:qry_sort_operation="{ row }">
                <el-input-number v-model="row.sortNum" />
              </template>
            </vxe-grid>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { filterNode } from 'ecip-web/utils/tableUtil'
import { getList, compareAndGenTable, selectById, saveParamSet } from './paramSetting'
export default {
  name: 'ParamSettingView',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      treeLoading: false,
      saveLoading: false,
      compareGenLoading: false,
      showSearch: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      showTip: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      showTableName: false, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      deptFilterText: '', //  组织搜索过滤条件
      queryParams: {},
      selectedNode: {},
      nodeData: {},
      paramTreeList: [], //  系统组织树
      columnsDataList: [],
      qryDataList: [],
      tableHeight: null,
      tableColumns: [
        { title: '列名', field: 'dataName', minWidth: 150, showOverflow: true },
        { title: '列标题', field: 'sTitle', minWidth: 150, showOverflow: true, slots: { default: 'columnTitle_operation' }},
        { title: '启用状态', field: 'status', minWidth: 180, showOverflow: true, slots: { default: 'status_operation' }},
        { title: '排序', field: 'sortNum', width: 200, showOverflow: true, slots: { default: 'sort_operation' }}
      ],
      qryColumns: [
        { title: '列名', field: 'columnName', minWidth: 150, showOverflow: true },
        { title: '列标题', field: 'label', minWidth: 150, showOverflow: true, slots: { default: 'qry_columnTitle_operation' }},
        { title: '启用状态', field: 'status', minWidth: 150, showOverflow: true, slots: { default: 'qry_status_operation' }},
        { title: '是否模糊查询', field: 'dim', minWidth: 150, showOverflow: true, slots: { default: 'qry_dim_operation' }},
        { title: '排序', field: 'sortNum', width: 150, showOverflow: true, slots: { default: 'qry_sort_operation' }}
      ],
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
      this.getData()
      this.getParamTree()
    },
    async getParamTree() {
      this.treeLoading = true
      getList().then(res => {
        this.paramTreeList = res.data
        this.treeLoading = true
      })
    },
    async getData() {
      this.columnsDataList = []
      this.qryDataList = []

      if (this.queryParams.id) {
        this.loading = true
        selectById(this.queryParams).then(res => {
          this.nodeData = res
          this.qryDataList = this.nodeData.data.querys
          this.columnsDataList = this.nodeData.data.columns
          this.loading = false
        })
      }
    },
    paramTableClick(node, Node) {
      this.columnsDataList = []
      this.qryDataList = []
      this.queryParams.tableName = node.tableName
      this.queryParams.id = node.id
      this.selectedNode = node
      if (node.tableName) {
        this.showTableName = true
        this.showTip = false
      } else {
        this.showTableName = false
        this.showTip = true
      }
      if (Node.level && Node.level !== 1) {
        this.getData()
      }
    },
    filterNode(value, data, node) {
      return filterNode(value, data, node, 'title')
    },
    async save() {
      this.$confirm(`是否执行`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        saveParamSet(this.nodeData.data).then(res => {
          this.saveLoading = false
          this.getData()
          this.$notify.success(res.message)
        },
        // eslint-disable-next-line handle-callback-err
        err => {
          this.saveLoading = false
        })
      })
    },
    async compareAndGenTable() {
      this.$confirm(`是否执行`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.compareGenLoading = true
        compareAndGenTable(this.nodeData.data).then(res => {
          this.compareGenLoading = false
          this.getData()
          this.$notify.success(res.message)
        },
        // eslint-disable-next-line handle-callback-err
        err => {
          this.compareGenLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-bottom: 20px;
  }

  /deep/ #paramInfoId>.el-card>.el-card__body{
    padding: 5px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__header{
    padding: 10px;
  }

  /deep/ .elFormItemEnter {
    width:30%;
  }

  .floatOp {
    position: fixed;
    float: right;
    z-index: 4;
    right: 0px;
  }

</style>
