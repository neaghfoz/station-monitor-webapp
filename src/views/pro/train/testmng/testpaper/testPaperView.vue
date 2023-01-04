<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'150px'">
        <el-row>
          <el-form-item
            label="试卷ID"
          >
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="试卷ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
              style="width: 199px"
            />
          </el-form-item>
          <el-form-item label="试卷名称" prop="name">
            <el-input
              v-model="queryParams.name"
              type="text"
              placeholder="试卷名称"
              maxlength="100"
              style="width: 199px"
            />
          </el-form-item>
          <el-form-item
            label="所属科目/章节/知识点"
          >
            <el-cascader
              v-model="queryParams.parentIds"
              placeholder="请选择"
              :options="parentTree"
              :props="{ checkStrictly: true }"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="组卷模式"
          >
            <ti-select
              v-model="queryParams.combine"
              placeholder="请选择"
              dict-type="tibms_train_test_combine"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:testpaper:findPage']" type="primary" @click="submit">查询</el-button>
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
            <el-button v-if="row.combine === 2" v-permission="['train:testpaper:question']" type="primary" @click="showQuestions(row)">查看试题</el-button>
            <el-button v-permission="['train:testpaper:update']" type="primary" @click="edit(row)">修改</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['train:testpaper:create']" type="primary" @click="add()">新增</el-button>
            <el-button v-permission="['train:testpaper:delete']" :disabled="selections.length === 0" type="danger" @click="del()">删除</el-button>
            <el-button v-permission="['train:testpaper:excel']" type="info" @click="exportExcel.dialog = true">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <createView ref="createDialog" @refreshData="getData" />
    <questionView ref="questionDialog" @refreshData="getData" />
    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, getParentTree, deleteByIds } from './testPaperViewApi'
import createView from './components/testPaperCreateView'
import questionView from './components/testPaperQuestionView'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'pro.train.testmng.testpaper.testPaperView',
  components: { createView, questionView, TiExportExcel, TiSelect },
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
          { title: '试卷ID', field: 'id', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '试卷名称', field: 'name', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '所属科目/章节/知识点', field: 'belongName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '组卷模式', field: 'combineText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '组卷用户', field: 'lastModifyOperatorText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '组卷时间', field: 'lastModifyTimeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', fixed: 'right', align: 'left', minWidth: 200, slots: { default: 'operation' }}
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
        url: '/api/v1/train/testpaper/exportExcel',
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

      this.$confirm(`是否删除试卷:` + names, '提示', {
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
    showQuestions(row) {
      this.$refs.questionDialog.init(row)
    }
  }
}
</script>

<style scoped>

</style>
