<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item
            label="所属科目"
          >
            <ti-select
              v-model="queryParams.subjectId"
              placeholder="请选择"
              url="/api/v1/train/subject/list"
              :isPost="true"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:section:findPage']" type="primary" @click="getData">查询</el-button>
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
            <el-button v-permission="['train:knowledge:findPage']" size="mini" type="primary" @click="jumpKnowledge(row)">知识点信息</el-button>
            <el-button v-permission="['train:question:excel']" size="mini" type="primary" @click="downQuestion(row)">导出试题</el-button>
          </template>
          <template v-slot:toolbar_buttons />
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from './sectionViewApi'
import { download } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'pro.train.design.section.sectionView',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        subjectId: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '章节ID', field: 'id', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '所属科目', field: 'subjectName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '章节名称', field: 'name', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '操作', width: 250, fixed: 'right', align: 'left', slots: { default: 'operation' }}
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
      selections: []
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
    })
  },
  methods: {
    init() {
      this.getData()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    jumpKnowledge(row) {
      this.$router.push({
        path: '/api/v1/train/knowledge/findPage',
        query: { parentIds: [row.parentId, row.uniqueId] }
      })
    },
    downQuestion(row) {
      download({ url: '/api/v1/train/question/exportExcel', method: 'post', params: { exportType: 'total' }, data: { subjectId: row.subjectId, sectionId: row.id }})
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
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
    }
  }
}
</script>

<style scoped>

</style>
