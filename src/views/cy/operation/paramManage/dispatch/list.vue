<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row  >
          <el-form-item v-show="stationFlag" label="机构" prop="sysOrgIdStr">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" show-level="4" :multiple="true" default-first-value />
          </el-form-item>

          <el-form-item label="车道" prop="laneNo"  >
            <el-input
              v-model="queryParams.laneNo"
              type="text"
              placeholder="车道"
              maxlength="10"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </el-form-item>
          <el-form-item label="车道IP" prop="computerIP">
            <el-input
              v-model="queryParams.computerIP"
              type="text"
              placeholder="车道IP"
            />
          </el-form-item>

          <el-form-item label="状态" prop="mainStatus">
            <ti-select
              v-model="queryParams.mainStatus"
              placeholder="全部"
              dict-type="tibms_param_sendLaneStatus"
              :multiple="true"
            />
          </el-form-item>

          <el-form-item label="下发时间">
            <el-form-item v-show="false" prop="beginOpTime" />
            <el-form-item v-show="false" prop="endOpTime" />
            <ti-date-range
              v-model="queryParams"
              date-type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              begin-key="beginOpTime"
              end-key="endOpTime"
            />
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
            <el-button type="warning" @click="detail(row)"  v-permission="['exportDatatask:detail']">详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button   type="primary" @click="handleIssue"  v-permission="['sendRecordMain:create']">下发参数</el-button>
            <el-button   type="warning" @click="exportExcel.dialog = true" v-permission="['sendRecordMain:excel']">导出</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" ></ti-export-excel>
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { sendRecordMainList } from './dispatch'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'

export default {
  name: 'DispatchListView',
  components: { tiSysOrg, TiDateRange, TiSelect, TiExportExcel },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        sysOrgIdStr: '',
        laneNo: '',
        computerIP: '',
        mainStatus: '',
        beginOpTime: moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00',
        endOpTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '路段名称', field: 'roadName', minWidth: 150, showOverflow: true },
          { title: '收费站', field: 'stationName', minWidth: 150, showOverflow: true },
          { title: '车道', field: 'laneNo', minWidth: 100, showOverflow: true },
          { title: '车道IP', field: 'computerIP', minWidth: 100, showOverflow: true },
          { title: '状态', field: 'mainStatusText', minWidth: 80, showOverflow: true },
          { title: '下发时间', field: 'lastUpdateTimeStr', minWidth: 150, showOverflow: true },
          { title: '下发参数表数量', field: 'totalCount', minWidth: 50, showOverflow: true },
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
        url: '/api/v1/sendRecordMain/exportExcel',
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
      this.getData()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      this.tableData.loading = true
      sendRecordMainList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
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
      this.$refs.searchForm.resetFields()
      this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue()
    },
    detail(row) {
      this.$router.push({
        path: '/param/issue/details',
        query: { id: row.id }
      })
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
