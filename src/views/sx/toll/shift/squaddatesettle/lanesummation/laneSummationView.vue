<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="所在机构">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr"/>
          </el-form-item>
          <el-form-item label="工班日期">
            <ti-date-range
              v-model="queryParams"
              date-type="daterange"
              begin-key="beginSquadDate"
              end-key="endSquadDate"
              :clearable="true"
              start-placeholder="起始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="工班" prop="squadNo">
            <ti-select v-model="queryParams.squadNo" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"/>
          </el-form-item>
          <el-form-item
            label="状态"
          >
            <ti-select
              @change="changeQuerySumStatus"
              v-model="queryParams.sumStatus"
              placeholder="请选择"
              dict-type="tibms_toll_shiftSummationType"
            />
          </el-form-item>
          <el-form-item
            v-show="queryParams.showRepair"
            label="是否待补结算"
          >
            <ti-select
              v-model="queryParams.stationRepairStatus"
              placeholder="请选择"
              :data-list="repairSelect"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['lanesummation:findPage']" type="primary" @click="submit">查询</el-button>
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
            <el-button v-if="row.sumStatus == 0" type="primary" @click="checkRow(row)" v-permission="['lanesummation:check']">检查</el-button>
            <el-button v-if="row.sumStatus == 0 && row.stationRepairStatus == 1" type="primary" @click="genRow(row)" v-permission="['lanesummation:create']">补结算</el-button>
            <el-button v-if="row.sumStatus == 0 && row.stationRepairStatus == 0" type="primary" @click="genRow(row)" v-permission="['lanesummation:create']">结算</el-button>
            <el-button v-if="row.sumStatus == 1" type="warning" @click="detailRow(row)" v-permission="['lanesummation:detail']">详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button type="primary" @click="gen()" v-permission="['lanesummation:create']">结算</el-button>
            <el-button type="info" @click="exportExcel.dialog = true" v-permission="['lanesummation:excel']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

    <detail-view ref="detailDialog" @refreshData="getData" />
    <check-view ref="checkDialog" @refreshData="getData" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from './laneSummationApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import detailView from './components/laneSummationDetailView'
import checkView from './components/laneSummationCheckAndGenView'
import dictUtils from '@ecip/ecip-web/src/utils/dictUtils'

export default {
  name: 'LaneSummationView',
  components: { TiDateRange, TiExportExcel, TiSelect, tiSysOrg, detailView, checkView },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      checkShowMoney: true,
      queryParams: {
        sysOrgIdStr: '',
        squadNo: '',
        beginSquadDate: '',
        endSquadDate: '',
        sumStatus: '0',
        showRepair: true,
        stationRepairStatus: ''
      },
      repairSelect: [{
        value: '0',
        label: '否',
        key: '0'
      }, {
        value: '1',
        label: '是',
        key: '1'
      }],
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '路段', field: 'roadOrg.fullName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班日期', field: 'squadDateText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班', field: 'squadText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '流水记录数', field: 'recordCntText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '总金额', field: 'moneySummationText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'statTimeText', minWidth: 180, showOverflow: true, align: 'center' },
          { title: '状态', field: 'sumStatusText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作', minWidth: 160, slots: { default: 'operation' }, align: 'left' }
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
        url: '/api/v1/lanesummation/exportExcel',
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
  computed: {
    showConfig() {
      return {
        checkMoney: dictUtils.getDictLabel('tibms_config', 'toll_shift_lanesummationcheckmoney')
      }
    }
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
      if (this.showConfig.checkMoney === 'false') {
        this.checkShowMoney = false
        this.tableData.tableColumns = [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '路段', field: 'roadOrg.fullName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班日期', field: 'squadDateText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班', field: 'squadText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '流水记录数', field: 'recordCntText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'statTimeText', minWidth: 180, showOverflow: true, align: 'center' },
          { title: '状态', field: 'sumStatusText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作', minWidth: 160, slots: { default: 'operation' }, align: 'left', fixed: 'right' }
        ]
      } else {
        this.checkShowMoney = true
        this.tableData.tableColumns = [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '路段', field: 'roadOrg.fullName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班日期', field: 'squadDateText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '工班', field: 'squadText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '流水记录数', field: 'recordCntText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '总金额', field: 'moneySummationText', minWidth: 120, showOverflow: true, align: 'right' },
          { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'statTimeText', minWidth: 180, showOverflow: true, align: 'center' },
          { title: '状态', field: 'sumStatusText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作', minWidth: 160, slots: { default: 'operation' }, align: 'left', fixed: 'right' }
        ]
      }
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
    async changeQuerySumStatus(val) {
      if (val === '0') {
        this.queryParams.showRepair = true
      } else {
        this.queryParams.showRepair = false
        this.queryParams.stationRepairStatus = ''
      }
    },
    async detailRow(row) {
      this.$refs.detailDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.orgCode, row.squadDate, row.squadNo)
    },
    async checkRow(row) {
      this.$refs.checkDialog.checkInit(this.queryParams.tenantId, this.queryParams.appId, row.orgCode, row.squadDate, row.squadNo)
    },
    async check() {
      this.$refs.detailDialog.init(this.queryParams.tenantId, this.queryParams.appId)
    },
    async gen() {
      if (this.tableData.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.tableData.selections.every((x) => {
        if (x.sumStatus !== 0) {
          msg = '选择记录必须为待结算状态'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$refs.checkDialog.genInit(this.queryParams.tenantId, this.queryParams.appId, this.tableData.selections, 'batch')
    },
    async genRow(row) {
      const arr = []
      arr.push(row)
      this.$refs.checkDialog.genInit(this.queryParams.tenantId, this.queryParams.appId, arr, 'single')
    }
  }
}
</script>

<style scoped>

</style>
