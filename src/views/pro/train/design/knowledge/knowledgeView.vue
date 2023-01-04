<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item
            label="所属科目/章节"
          >
            <el-cascader
              v-model="queryParams.parentIds"
              placeholder="请选择"
              :options="parentTree"
              :props="{ checkStrictly: true }"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:knowledge:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="tableHeight">
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
          :max-height="600"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          @page-change="handlePageChange"
          @checkbox-all="({ selection }) => { selections = selection }"
          @checkbox-change="({ selection }) => { selections = selection }"
        >

          <template v-slot:operation="{ row }">
            <el-button v-permission="['train:knowledge:update']" type="primary" @click="edit(row)">修改</el-button>
            <el-button v-permission="['train:question:excel']" size="mini" type="primary" @click="downQuestion(row)">导出试题</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['train:knowledge:create']" type="primary" @click="add()">新增</el-button>
            <el-button v-permission="['train:knowledge:delete']" :disabled="selections.length === 0" type="danger" @click="del()">删除</el-button>
            <el-button v-permission="['train:knowledge:excel']" type="info" @click="exportExcel.dialog = true">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <createView ref="createDialog" @refreshData="getData" />
    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, getParentTree, deleteByIds } from './knowledgeViewApi'
import { download } from 'ecip-web/utils'
import createView from './components/knowledgeCreateView'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'

export default {
  name: 'pro.train.design.knowledge.knowledgeView',
  components: { createView, TiExportExcel },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      parentTree: [],
      queryParams: {
        parentIds: []
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '知识点ID', field: 'id', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '所属科目', field: 'subjectName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属章节', field: 'sectionName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '知识点名称', field: 'name', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作用户', field: 'operatorText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTimeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', fixed: 'right', align: 'center', minWidth: 200, slots: { default: 'operation' }}
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }
      },
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
      tableHeight: null,
      selections: [],
      exportExcel: {
        url: '/api/v1/train/knowledge/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
  },
  created() {
  },
  activated() {
    Object.assign(this.queryParams, this.$route.query)
    this.$nextTick(() => {
      this.init()
      this.exportExcel.queryParams = this.queryParams
    })
  },
  methods: {
    init() {
      getParentTree({}).then(res => {
        this.parentTree = res.data
        this.getData()
      })
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      this.selections = []
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
    },
    async add() {
      this.$refs.createDialog.init(this.queryParams.tenantId, this.queryParams.appId, '')
    },
    async edit(row) {
      this.$refs.createDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id)
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      const ids = this.selections.map((x) => x.id).join(',')
      const names = this.selections.map((x) => x.name).join(',')

      this.$confirm(`是否删除知识点:` + names, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(ids).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      })
    },
    downQuestion(row) {
      download({ url: '/api/v1/train/question/exportExcel', method: 'post', params: { exportType: 'total' }, data: { subjectId: row.subjectId, sectionId: row.sectionId, knowledgeId: row.id }})
    }
  }
}
</script>

<style scoped>

</style>
