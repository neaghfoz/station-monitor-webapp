<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'80px'">
        <el-row>
          <el-form-item label="考试ID" prop="id">
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="考试ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </el-form-item>
          <el-form-item label="考试名称" prop="name">
            <el-input
              v-model="queryParams.name"
              type="text"
              placeholder="考试名称"
              maxlength="100"
            />
          </el-form-item>

          <el-form-item label="状态" prop="opened">
            <ti-select
              v-model="queryParams.opened"
              placeholder="不限"
              dict-type="tibms_train_exam_examStatus"
            />
          </el-form-item>
          <el-form-item label="考试模式" prop="type">
            <ti-select
              v-model="queryParams.type"
              placeholder="不限"
              dict-type="tibms_train_exam_mode"
              style="width: 193px"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:exam:findPage']" type="primary" @click="submit">查询</el-button>
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

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['train:exam:save']" type="primary" @click="add()">新增</el-button>
            <el-button v-permission="['train:exam:delete']" type="danger" :disabled="!oneMore" @click="remove()">删除</el-button>
          </template>

          <template v-slot:operation="{ row }">
            <el-button v-permission="['train:exam:num:findPage']" size="mini" type="primary" @click="examnum(row)">场次列表</el-button>
            <el-button v-permission="['train:exam:modify']" size="mini" type="warning" @click="edit(row)">修改</el-button>
          </template>
        </vxe-grid>
      </div>
    </el-card>

    <Detail ref="saasExamDialog" @refreshDataList="getData" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, deleteByIds } from './examViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import Detail from './components/detail'
import moment from 'moment'

export default {
  name: 'ProTrainDesignExamExamView',
  components: { TiSelect, Detail },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
        id: '',
        name: '',
        opened: '',
        type: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '考试ID', field: 'id', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '考试名称', field: 'name', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '考试模式', field: 'typeName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '状态', field: 'openedName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作用户', field: 'operatorNo', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const txt = cellValue ? `[${row.operatorNo}]${row.operatorName}` : ''
            return txt
          } },
          { title: '操作时间', field: 'opTime', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const time = cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
            return time
          } },
          { title: '操作', width: 210, fixed: 'right', align: 'center', slots: { default: 'operation' }}
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
    this.$watch(this.$refs.xTable.getCheckboxRecords, (newValue, oldValue) => {
      this.selections = newValue
      this.oneMore = this.selections.length > 0
    })
  },
  activated() {
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
    add() {
      this.$refs.saasExamDialog.init('add')
    },
    edit(item) {
      const row = item || this.selections[0]
      this.$refs.saasExamDialog.init('edit', row)
    },
    remove(id) {
      this.$confirm(`是否删除${id ? '此条记录' : '选中记录'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let deleteIds = []
        if (id) {
          deleteIds.push(id)
        } else {
          deleteIds = this.selections.map(item => item.id)
        }
        await deleteByIds(deleteIds)
        await this.getData()
        this.$notify.success('删除成功')
      }).catch(() => {

      })
    },
    examnum(item) {
      const row = item || this.selections[0]
      this.$router.push({
        path: '/api/v1/train/examnum/findPage',
        query: { examId: row.id }
      })
      // this.$refs.saasExamnumDialog.init('edit', row)
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.queryParams = this.$options.data().queryParams
    }
  }
}
</script>

<style scoped>

</style>
