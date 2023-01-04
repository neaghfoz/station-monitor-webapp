<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'167px'">
      <el-row>

          <el-form-item label="机构" prop="sysOrgIdStr" >
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" @change="orgChange" show-level="4" default-first-value />
          </el-form-item>
          <el-form-item label="车道号" prop="laneNoStr">
            <ti-sys-lane clearable  v-model="queryParams.laneNoStr"  :cache="true" :station-id="appForm.stationId" :multiple="true" />
          </el-form-item>

          <el-form-item label="车道类型" prop="terminalTypes">
            <ti-select
              v-model="queryParams.terminalTypes"
              placeholder="全部"
              dict-type="tibms_auto_terminalType"
            />
          </el-form-item>

          <el-form-item label="出入口类型" prop="enexTypes" >
            <ti-select
              v-model="queryParams.enexTypes"
              placeholder="全部"
              dict-type="tibms_auto_enexType"
            />
          </el-form-item>
          <el-form-item label="在用批次号" prop="usingVer"  >
            <el-input
              v-model="queryParams.usingVer"
              type="text"
              placeholder="在用批次号"
            />
          </el-form-item>

          <el-form-item label="最新批次号" prop="latestVer" >
            <el-input
              v-model="queryParams.latestVer"
              type="text"
              placeholder="最新批次号"
            />
          </el-form-item>

          <el-form-item label="最新配置包状态变化时间"  >
            <el-form-item v-show="false" prop="startTime" />
            <el-form-item v-show="false" prop="endTime" />
            <ti-date-range
              v-model="queryParams"
              date-type="daterange"
              format="yyyy-MM-dd"
              begin-key="startTime"
              end-key="endTime"
              dateStyle="width:576px"
            />
          </el-form-item>

          <el-form-item label="最新配置包更新状态" prop="statusStr">
            <ti-select :multiple="true"
              v-model="queryParams.statusStr"
              placeholder="全部"
              dict-type="tibms_auto_terminalUpdateStatus"
            />
          </el-form-item>

          <el-form-item class="searchItem" style="float: right;padding-right:20px">
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>


      </el-row>

    </el-form>
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
        >
          <template v-slot:operation="{ row }">
            <el-button v-permission="['configUpdateStatus:details']" type="warning" @click="detail(row)" >详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button   type="warning" @click="exportExcel.dialog = true" v-permission="['configUpdateStatus:export']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />

  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { updateStatusList, allSystems } from './configUpdateStatus'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: 'AutoUpdationConfigUpdateStatusListView',
  components: { tiSysOrg, TiDateRange, TiSelect, TiExportExcel,TiSysLane },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      appForm: {
        stationId: '',
      },
      queryParams: {
        systemIds: '',
        terminalTypes: '',
        enexTypes: '',
        laneNo: '',
        laneNoStr: '',
        latestVer: '',
        usingVer: '',
        status: '',
        statusStr: '',
        startTime: moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
        endTime: moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '路段', field: 'roadName', minWidth: 90, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '车道', field: 'laneNo', minWidth: 50, showOverflow: true, align: 'center' },
          { title: '车道类型', field: 'terminalTypeText', minWidth: 95, showOverflow: true, align: 'center' },
          { title: '出入口类型', field: 'enexTypeText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '目标网址', field: 'ipAddress', minWidth: 110, showOverflow: true, align: 'center' },
          { title: '在用批次号', field: 'usingVer', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '在用更新时间', field: 'usingVerTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '最新批次号', field: 'latestVer', minWidth: 150, showOverflow: true, align: 'center'},
          { title: '最新配置包状态变化时间', field: 'latestVerTime', minWidth: 180, showOverflow: true, align: 'center' },
          { title: '最新配置包更新状态', field: 'statusText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', align: 'center', fixed: 'right', minWidth: 100, slots: { default: 'operation' }}
        ],
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
      tableHeight: null,
      exportExcel: {
        url: '/api/v1/config/updateStatus/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      systemInfoList: []
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    },
    queryParams(newVal) {
      this.exportExcel.queryParams = newVal
    }
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    orgChange(val,org){
      if(org){
        this.appForm.stationId = org.stationId
      }
    },
    init() {
      allSystems().then(res => {
        this.systemInfoList = res.data
      })
      this.getData()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      this.tableData.loading = true
      updateStatusList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })

      this.exportExcel.queryParams = this.queryParams
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.$refs.sysOrg.setDefaultFirstValue();
    },
    detail(row) {
      this.$router.push({
        path: '/autoUpdation/config/updateStatus/details',
        query: { id: row.id }
      })
    },
    add() {
      this.$refs.addDialog.init('add')
    }
  }

}
</script>

<style scoped>

</style>
