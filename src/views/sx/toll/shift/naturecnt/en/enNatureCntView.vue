<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="所在机构">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr"/>
          </el-form-item>
          <el-form-item label="统计日期">
            <ti-date-range
              v-model="queryParams"
              date-type="daterange"
              begin-key="beginCountDate"
              end-key="endCountDate"
              :clearable="true"
              start-placeholder="起始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['stationEnCount:findPage']" type="primary" @click="submit">查询</el-button>
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
            <el-button type="warning" @click="detailRow(row)" v-permission="['stationEnCount:detail']">详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button type="info" @click="exportExcel.dialog = true" v-permission="['stationEnCount:excel']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

    <detail-view ref="detailDialog" @refreshData="getData" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from './enNatureCntApi'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import detailView from './components/enNatureCntDetailView'

export default {
  name: 'EnNatureCntView',
  components: { TiDateRange, TiExportExcel, tiSysOrg, detailView },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      checkShowMoney: true,
      queryParams: {
        sysOrgIdStr: '',
        beginCountDate: '',
        endCountDate: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '合计数id', field: 'id', minWidth: 40, showOverflow: true, align: 'center', visible: false },
          { title: '路段', field: 'roadOrg.fullName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '统计日期', field: 'countDateText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '流水记录数', field: 'currentRecordCntText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: 'ETC成功处理数', field: 'etcSuccessCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: 'ETC失败处理数', field: 'etcFailCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: 'CPC发卡数', field: 'cpcCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '纸券发卡数', field: 'paperCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '无通行介质数', field: 'noMediaCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '闯关车数', field: 'breakPassCountText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '操作', minWidth: 80, slots: { default: 'operation' }, align: 'left' }
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
        url: '/api/v1/stationencount/exportExcel',
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
    async detailRow(row) {
      this.$refs.detailDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id)
    }
  }
}
</script>

<style scoped>

</style>
