<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="发票代码" prop="invCode">
            <el-input
              v-model="queryParams.invCode"
              type="text"
              placeholder="发票代码"
              maxlength="12"
              @input="changeInvCodeInput"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['invoiceCode:findPage']" type="primary" @click="getData">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="this.tableHeight">

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
            <el-button type="primary" @click="add()" v-permission="['invoiceCode:create']">添加</el-button>
            <el-button type="danger" :disabled="selections.length === 0" @click="del()" v-permission="['invoiceCode:delete']">删除</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <detail ref="invoiceCodeDetailDialog" @refreshData="getData"/>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, deleteByIds } from './invoiceCodeViewApi'
import detail from './components/invoiceCodeDetailView'

export default {
  name: 'gz.toll.card.setting.invoiceCode.invoiceCodeView',
  components: { detail },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        invCode: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '发票代码', field: 'invCode', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTime', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作员', field: 'operatorText', minWidth: 100, showOverflow: true, align: 'center' }
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
  activated() {
    this.selections = []
  },
  created() {
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
      this.selections = []
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
    },
    changeInvCodeInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.invCode = this.queryParams.invCode.replace(/[^\d]/g, '')
    },
    async detail(row) {
      this.$router.push({
        path: '/api/v1/invoicecode/' + row.invCode
      })
    },
    async add() {
      this.$refs.invoiceCodeDetailDialog.init('add', this.queryParams.tenantId, this.queryParams.appId)
    },
    async edit(row) {
      this.$refs.invoiceCodeDetailDialog.init('edit', this.queryParams.tenantId, this.queryParams.appId, row)
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      const invCodes = this.selections.map((x) => x.invCode)

      this.$confirm(`是否删除发票代码:\r\n` + invCodes.join('\r\n'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(invCodes.join(',')).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
