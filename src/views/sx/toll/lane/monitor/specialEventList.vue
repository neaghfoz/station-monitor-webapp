<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row  >
        <el-form-item label="出入口类型" prop="entryExitType" >
          <ti-select v-model="queryParams.entryExitType" dict-type="tibms_com_inOutType" />
        </el-form-item>

        <el-form-item label="工班日期">
          <el-form-item prop="beginSquadDateStr" v-show="false"/>
          <el-form-item prop="endSquadDateStr" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginSquadDateStr" end-key="endSquadDateStr"/>
        </el-form-item>

        <el-form-item label="车道号" prop="laneNoStr">
          <ti-sys-lane clearable :show-all="true" v-model="queryParams.laneNoStr"  :cache="true" :station-id="''" multiple/>
        </el-form-item>

        <el-form-item label="工班" prop="shift">
          <ti-select v-model="queryParams.shift" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" />
        </el-form-item>

        <el-form-item label="收费员" prop="laneOperatorStr">
          <ti-select v-model="queryParams.laneOperatorStr" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}" multiple/>
        </el-form-item>

        <el-form-item label="收费特情类型" prop="spEventNoStr" v-show="false">
          <ti-select v-model="queryParams.spEventNoStr" dict-type="toll_laneMonitor_spEvent" multiple/>
        </el-form-item>

        <el-form-item label="授权类型" prop="opResultStatus" >
          <ti-select v-model="queryParams.opResultStatus" dict-type="toll_laneMonitor_opresultstatues" />
        </el-form-item>

        <el-form-item label="特殊事件" prop="spEvent">
          <el-input v-model="queryParams.spEvent" />
        </el-form-item>

        <el-form-item label="备注" prop="mark">
          <el-input v-model="queryParams.mark" />
        </el-form-item>


          <el-form-item class="searchItem"  style="float: right;padding-right:20px">
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
            <el-button   type="primary" @click="register"  v-permission="['spMonitorRecord:registerMark']">登记</el-button>
            <el-button   type="warning" @click="exportExcel.dialog = true" v-permission="['spMonitorRecord:exportExcel']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" ></ti-export-excel>
    <laneSpEventMark ref="laneSpEventMarkDialog" @refreshData="getData"/>
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { spfindPage } from './laneMonitorApi'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
import {statusChange} from "../../../../pro/param/sendPara/sendPara";
import laneSpEventMark from './laneSpEventMark'

export default {
  name: 'monitorSpecialEventList',
  components: { tiSysOrg, TiDateRange, TiSelect, TiExportExcel, TiSysLane, laneSpEventMark },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      selections: [],
      queryParams: {
        sysOrgIdStr: '',
        entryExitType: '',
        laneNoStr: '',
        shift: '',
        laneOperatorStr: '',
        spEventNoStr: '',
        beginSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        endSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        opResultStatus: '',
        spEvent: '',
        mark: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '授权类型', field: 'opResultStatusText', minWidth: 150, showOverflow: true ,align: 'center'},
          { title: '操作时间', field: 'reqTimeText', minWidth: 150, showOverflow: true ,align: 'center'},
          { title: '特殊事件', field: 'spEvent', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '车牌号码', field: 'vehiclePlate', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '备注', field: 'mark', minWidth: 100, showOverflow: true ,align: 'center' },
          { title: '入口站', field: 'enStationName', minWidth: 120, showOverflow: true ,align: 'center' },
          { title: '入口车型', field: 'enVehTypeText', minWidth: 80, showOverflow: true ,align: 'center' },
          { title: '入口车种', field: 'vehClassText', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '车道号', field: 'laneNo', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '收费员', field: 'laneOperatorText', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '车型', field: 'exVehTypeText', minWidth: 150, showOverflow: true ,align: 'center' },
          { title: '车种', field: 'vehClassText', minWidth: 150, showOverflow: true ,align: 'center' },
          //{ title: '收费金额', field: 'feeText', minWidth: 80, showOverflow: true ,align: 'center' },
          //{ title: '应收金额', field: 'payFeeText', minWidth: 80, showOverflow: true ,align: 'center' }
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
        url: '/api/v1/toll/lane/spMonitor/exportExcel',
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
      this.tableData.loading = true
      spfindPage(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
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
    },
    register() {
      if (this.selections.length === 0) {
        this.$notify.warning('请选择操作记录！')
        return
      }
      this.$refs.laneSpEventMarkDialog.init(this.selections)
    },
    handleIssue() {
      this.$router.push({
        path: '/param/issue',
        query: {}
      })
    }
  }

}
</script>

<style scoped>
  .el-card{
    margin-bottom:20px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__body{
    padding: 5px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__header{
    padding: 10px;
  }

</style>
