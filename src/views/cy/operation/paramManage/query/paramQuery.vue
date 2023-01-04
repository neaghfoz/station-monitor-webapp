<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card ref="paramTreeInput" shadow="never"   class="el-card-define" :loading = "treeLoading">
          <div   :style="{ height: '50px' }">
            <el-input
              v-if="paramTreeList.length > 0"
              v-model="deptFilterText"
              style="margin-bottom: 15px"
              clearable
              placeholder="输入名称进行过滤"
            />
          </div>

          <div   :style="{ height: (screenHeight * 0.6) + 'px' }" :loading = "treeLoading">
            <el-tree
              :style="{ overflow:'auto',height: '100%'}"
              ref="paramTree"
              :props="{ label: 'title', children: 'children'} "
              :data="paramTreeList"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              node-key="id"
              highlight-current
              @node-click="paramTableClick"
            />
          </div>
        </el-card>
      </el-col>

      <el-col id="paramInfoId" :span="18">
        <el-row style="padding-right:30px">
        <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
          <el-form-item
            v-for="(domain) in nodeData.qryColumns"
            :key="domain.columnName"
            :label="domain.label"
          >
            <el-input v-model="queryParams[domain.columnName]" />
          </el-form-item>
          <el-button type="primary" @click="submit" v-if = "showQuery" style = "float:right">查询</el-button>
        </el-form>
        </el-row>
        <el-card shadow="never"    class="el-card-define">

          <div slot="header" class="clearfix">
            <span>{{ selectedNode.tableName }}</span>
          </div>
          <div class="box">
            <vxe-grid
              ref="xTable"
              highlight-hover-row
              border
              show-overflow
              show-header-overflow
              resizable
              sync-resize
              auto-resize
              class="vxe-table-element"
              :max-height="550"
              :loading="nodeData.loading"
              :columns="nodeData.tableColumns"
              :data="nodeData.columnsDataList"
              :start-index="(nodeData.page.currentPage - 1) * nodeData.page.pageSize"
              :pager-config="nodeData.page"
              :toolbar="tableToolbar"
              @page-change="handlePageChange"
            >
              <template v-slot:toolbar_buttons>

                <el-button v-permission="['param:importExcel']" type="primary" @click="handleImport">导入</el-button>
                &nbsp; &nbsp; &nbsp; &nbsp; <span  style="color:red">*注意：需要手动点击查询按钮进行查询</span>
              </template>
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
      </el-col>
      <ti-import
        :upload-url="importUrl"
        :tpl-url="tplUrl"
        title="参数导入"
        :visible="importVisible"
        :upload-params="uploadParams"
        @onSuccess="importSuccess"
        @close="importVisible = false"
      />
    </el-row>
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { filterNode } from 'ecip-web/utils/tableUtil'
import { getList, paramList, paramData, checkTBName } from './paramQuery'
import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'
export default {
  name: 'ParamQueryView',
  mixins: [...mixin],
  components: { TiImport },
  data() {
    return {
      importVisible: false,
      showHandleReset: false,
      showQuery: false,
      treeLoading: false,
      uploadParams: {},
      deptFilterText: '', //  组织搜索过滤条件
      importUrl: 'api/v1/param/importExcel',
      tplUrl: 'api/v1/param/excelTemplate',
      tempParams: {},
      queryParams: {},
      selectedNode: {},
      paramData: {},
      exist: false,
      nodeData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [],
        qryColumns: [],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }},
      tableToolbar: {
        id: 'modules.paramQuery',
        custom: true,
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        slots: {
          buttons: 'toolbar_buttons'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      paramTreeList: [], //  系统组织树
      qryDataList: [],
      tableHeight: null,
      screenHeight: document.body.clientHeight
    }
  },
  watch: {
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
      this.getParamData()
    },
    async getParamTree() {
      this.treeLoading = true
      getList().then(res => {
        this.paramTreeList = res.data
        this.treeLoading = false
      })
    },
    submit() {
      Object.assign(this.$data.nodeData.page, this.$options.data().nodeData.page);
      this.getData()
    },
    async getData() {
      if (this.tempParams.id) {
        this.nodeData.loading = true
        if (this.paramData[this.selectedNode.tableName].queryList.length > 0) {
          this.showHandleReset = true
        }
        this.paramData[this.selectedNode.tableName].queryList.forEach((item, index) => {
          item['value'] = this.queryParams[item['columnName']]
        })
        paramList(Object.assign({}, { size: this.nodeData.page.pageSize, current: this.nodeData.page.currentPage }), this.paramData[this.selectedNode.tableName]).then(res => {
          this.nodeData.columnsDataList = res.data.records
          this.nodeData.page.total = res.data.total
          this.nodeData.loading = false
        })
      }
    },
    async paramTableClick(node, Node) {
      this.showHandleReset = false
      this.showQuery = false
      this.nodeData.tableColumns = []
      this.nodeData.qryColumns = []
      this.nodeData.columnsDataList = []
      this.nodeData.page.total = 0
      this.tempParams.tableName = node.tableName
      this.tempParams.id = node.id
      this.selectedNode = node
      if (!node.tableName) {
        return
      }
      const { data } = await checkTBName({ 'tableName': this.tempParams.tableName }, {})
      if (!data.exist) {
        this.$notify.error('表不存在')
        this.exist = false
        return
      }
      this.exist = true
      this.showQuery = true
      if (this.paramData[this.selectedNode.tableName].queryList.length > 0) {
        this.showHandleReset = true
      }
      if (Node.level && Node.level !== 1) {
        this.nodeData.tableColumns = []
        this.paramData[node.tableName].columns.forEach((item, index) => {
          this.nodeData.tableColumns.push({
            title: item['sTitle'],
            field: item['dataName'],
            minWidth: 150,
            showOverflow: true
          })
        })
        this.nodeData.qryColumns = []
        this.paramData[node.tableName].queryList.forEach((item, index) => {
          this.nodeData.qryColumns.push({
            columnName: item['columnName'],
            label: item['label'],
            minWidth: 150,
            showOverflow: true
          })
        })
      }
    },
    filterNode(value, data, node) {
      return filterNode(value, data, node, 'title')
    },
    async getParamData() {
      paramData({}).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            this.paramData[item.tableName] = item
          })
        }
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.nodeData.page.currentPage = currentPage
      this.nodeData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.paramData[this.selectedNode.tableName].queryList.forEach((item, index) => {
        this.queryParams[item['columnName']] = null
      })
    },
    handleImport() {
      if (!this.selectedNode.tableName) {
        this.$notify.error('请选择参数')
        return
      }

      if (!this.exist) {
        this.$notify.error('表不存在，不能操作导入')
        return
      }
      this.tplUrl = 'api/v1/param/excelTemplate/' + this.tempParams.tableName
      this.uploadParams = { tableName: this.tempParams.tableName }
      this.importVisible = true
    },
    importSuccess(resp, file, filelist) {
      if (resp.code === 200) {
        this.$notify.success('数据导入成功')
      } else {
        this.$notify.error(resp.message)
      }
      this.getData()
    }
  }

}
</script>

<style scoped>
  .el-card{
    margin-bottom:20px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__body{
    padding: 5px;
  }

  /deep/ #paramInfoId>.el-card>.el-card__header{
    padding: 10px;
  }
</style>
