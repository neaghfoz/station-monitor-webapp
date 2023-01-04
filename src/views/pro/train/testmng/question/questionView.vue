<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'150px'">
        <el-row>
          <el-form-item
            label="试题ID"
          >
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="试题ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
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
          <el-form-item label="试题题目" prop="mainContent">
            <el-input
              v-model="queryParams.mainContent"
              type="text"
              placeholder="试题题目"
              maxlength="500"
              style="width: 199px"
            />
          </el-form-item>
          <el-form-item
            label="题型分类"
          >
            <ti-select
              v-model="queryParams.type"
              placeholder="请选择"
              dict-type="tibms_train_question_type"
              @change="changeType"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 0"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 1"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              placeholder="请选择"
              dict-type="tibms_train_question_choice1"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 2"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              placeholder="请选择"
              dict-type="tibms_train_question_choice2"
            />
          </el-form-item>
          <el-form-item
            label="难度"
          >
            <ti-select
              v-model="queryParams.level"
              placeholder="请选择"
              dict-type="tibms_train_question_level"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:question:findPage']" type="primary" @click="submit">查询</el-button>
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
            <el-button v-show="row.subjectId === 1" v-permission="['train:question:update']" type="primary" @click="edit(row)">修改</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['train:question:create']" type="primary" @click="add()">新增</el-button>
            <el-button v-permission="['train:question:delete']" :disabled="selections.length === 0" type="danger" @click="del()">删除</el-button>
            <el-button v-permission="['train:question:import']" type="primary" @click="imports()">导入</el-button>
            <el-button v-permission="['train:question:excel']" type="info" @click="exportExcel.dialog = true">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <createView ref="createDialog" @refreshData="getData" />
    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" />

    <ti-import
      :upload-url="importUrl"
      :tpl-url="tplUrl"
      title="试题导入"
      :visible="importVisible"
      :upload-params="uploadParams"
      @onSuccess="importSuccess"
      @close="importVisible = false"
    />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, getParentTree, deleteByIds } from './questionViewApi'
import createView from './components/questionCreateView'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'

export default {
  name: 'pro.train.testmng.question.questionView',
  components: { createView, TiExportExcel, TiSelect, TiImport },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      importUrl: 'api/v1/train/question/import',
      tplUrl: 'api/v1/train/question/template',
      uploadParams: {},
      showSearchForm: true,
      showChoice: 0,
      parentTree: [],
      queryParams: {
        parentIds: [],
        subjectId: '',
        type: '',
        choice: '',
        level: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '试题ID', field: 'id', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属科目', field: 'subjectName', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '所属章节', field: 'sectionName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属知识点', field: 'knowledgeName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '题型分类', field: 'typeText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '题型', field: 'choiceText', minWidth: 70, showOverflow: true, align: 'center' },
          { title: '试题题目', field: 'mainContentText', minWidth: 260, showOverflow: true, align: 'left' },
          { title: '难度', field: 'levelText', minWidth: 50, showOverflow: true, align: 'center' },
          { title: '操作用户', field: 'lastModifyOperatorText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'lastModifyTimeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', fixed: 'right', align: 'center', minWidth: 100, slots: { default: 'operation' }}
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
        url: '/api/v1/train/question/exportExcel',
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
    async imports() {
      this.importVisible = true
    },
    importSuccess(resp, file, filelist) {
      if (resp.code === 200) {
        this.$notify.success('数据导入成功')
        this.submit()
      } else {
        this.$notify.error(resp.message)
      }
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
      this.$confirm(`是否删除试题ID(` + ids + `)`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(ids).then((res) => {
          this.$notify.success(res.data)
          this.submit()
        })
      })
    },
    changeType(val) {
      this.queryParams.choice = ''
      if (val === '') {
        this.showChoice = 0
      } else if (val === '1') {
        this.showChoice = 1
      } else {
        this.showChoice = 2
      }
    }
  }
}
</script>

<style scoped>

</style>
