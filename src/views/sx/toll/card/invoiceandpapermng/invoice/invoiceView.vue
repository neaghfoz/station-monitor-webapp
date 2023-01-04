<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item
            label="当前位置"
          >
            <ti-select
              v-model="queryParams.locationNoStr"
              placeholder="请选择"
              multiple
              dict-type="tibms_toll_invoiceLocation"
            />
          </el-form-item>
          <el-form-item label="所在机构">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr"/>
          </el-form-item>

          <el-form-item
            label="状态"
          >
            <ti-select
              v-model="queryParams.tagNoStr"
              placeholder="请选择"
              multiple
              dict-type="tibms_toll_invoiceStatus"
            />
          </el-form-item>
          <el-form-item
            label="发票代码"
          >
            <ti-select
              v-model="queryParams.invCode"
              placeholder="请选择"
              url="/api/v1/invoicecode/list"
              :isPost="true"
            />
          </el-form-item>

          <el-form-item
            label="发票号码"
          >
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.invStartNo" maxlength="9" placeholder="" @input="changeInvStartNoInput"/>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center;">~</el-col>
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.invEndNo" maxlength="9" placeholder="" @input="changeInvEndNoInput"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['invoice:findPage']" type="primary" @click="getData">查询</el-button>
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
          @checkbox-all="({ selection }) => { tableData.selections = selection }"
          @checkbox-change="({ selection }) => { tableData.selections = selection }"
        >
          <template v-slot:operation="{ row }">
            <el-button type="warning" @click="detail(row)" v-permission="['invoice:detail']">详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button type="primary" @click="instore()" v-permission="['invoice:create']">发票入库</el-button>
            <el-button type="primary" @click="cancel()" v-permission="['invoice:cancel']">发票核销</el-button>
            <el-button type="danger" @click="del()" v-permission="['invoice:delete']">删除</el-button>
            <el-button type="info" @click="exportExcel.dialog = true" v-permission="['invoice:excel']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

    <instore-view ref="instoreDialog" @refreshData="getData"/>
    <cancel-view ref="cancelDialog" @refreshData="getData"/>
    <deleteView ref="deleteDialog" @refreshData="getData"/>
    <detailView ref="detailDialog" @refreshData="getData"/>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from './invoiceApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import instoreView from './components/invoiceInstoreView'
import cancelView from './components/invoiceCancelView'
import deleteView from './components/invoiceDeleteView'
import detailView from './components/invoiceDetailView'

export default {
  name: 'InvoiceSaveListView',
  components: { TiExportExcel, TiSelect, tiSysOrg, instoreView, cancelView, deleteView, detailView },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        locationNoStr: '',
        sysOrgIdStr: '',
        tagNoStr: '',
        invCode: '',
        invStartNo: '',
        invEndNo: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '发票记录id', field: 'id', minWidth: 40, showOverflow: true, align: 'center', visible: false },
          { title: '发票代码', field: 'invCode', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发票起始号', field: 'invStartNo', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发票终止号', field: 'invEndNo', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '发票数量', field: 'invCount', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '当前位置', field: 'locationText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '所在机构', field: 'sysOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '经办人', field: 'xoperatorText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作员', field: 'operatorText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '状态', field: 'tagText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', align: 'center', minWidth: 135, slots: { default: 'operation' }}
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
        url: '/api/v1/invoice/exportExcel',
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
  activated() {
    this.tableData.selections = []
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.exportExcel.queryParams = this.queryParams
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
        this.tableData.selections = []
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
    changeInvStartNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.invStartNo = this.queryParams.invStartNo.replace(/[^\d]/g, '')
    },
    changeInvEndNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.invEndNo = this.queryParams.invEndNo.replace(/[^\d]/g, '')
    },
    async detail(row) {
      this.$refs.detailDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id)
    },
    async instore() {
      this.$refs.instoreDialog.init(this.queryParams.tenantId, this.queryParams.appId)
    },
    async cancel() {
      if (this.tableData.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.tableData.selections.every((x) => {
        if (x.tagNo === 7 || x.tagNo === 0) {
          msg = '有部分发票未被使用，不允许进行核销'
          return false
        }

        if (x.tagNo === 2) {
          msg = '有部分发票已核销，不允许重复核销'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      const ids = this.tableData.selections.map((x) => x.id)

      this.$refs.cancelDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.tableData.selections, ids)
    },
    async del() {
      if (this.tableData.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.tableData.selections.every((x) => {
        if (x.tagNo !== 0) {
          msg = '选择记录必须为在库存状态才允许删除'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      const ids = this.tableData.selections.map((x) => x.id)
      this.$refs.deleteDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.tableData.selections, ids)
    }
  }
}
</script>

<style scoped>

</style>
