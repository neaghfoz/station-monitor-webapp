<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="参数表名" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            type="text"
            placeholder="参数表名"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <ti-select
            v-model="queryParams.status"
            placeholder="全部"
            dict-type="tibms_param_sendParamStatus"
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
          :toolbar="tableData.tableToolbar"
          @checkbox-all="({ selection }) => { selections = selection }"
          @checkbox-change="({ selection }) => { selections = selection }"
        >
          <template v-slot:toolbar_buttons>
            <el-button v-permission="['exportDatatask:excel']" type="warning" @click="exportExcel.dialog = true">导出</el-button>
            <el-button v-permission="['exportDatatask:cancel']" :loading="cancelLoading" @click="cancel()">取消任务</el-button>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { issueDetails, cancel } from './dispatch'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
export default {
  name: 'DispatchIssueDetailsView',
  components: { TiSelect, TiExportExcel },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      cancelLoading: false,
      queryParams: {
        sysOrgIdStr: '',
        mainId: '',
        tableName: '',
        status: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '路段名称', field: 'roadName', minWidth: 150, showOverflow: true },
          { title: '收费站', field: 'stationName', minWidth: 150, showOverflow: true },
          { title: '车道', field: 'laneNo', minWidth: 100, showOverflow: true },
          { title: '车道IP', field: 'computerIP', minWidth: 100, showOverflow: true },
          { title: '参数表名', field: 'tableName', minWidth: 80, showOverflow: true },
          { title: '表中文名', field: 'fileName', minWidth: 80, showOverflow: true },
          { title: '状态', field: 'statusName', minWidth: 80, showOverflow: true },
          { title: '下发时间', field: 'taskStartTime', minWidth: 80, showOverflow: true },
          { title: '接收时间', field: 'taskEndTime', minWidth: 80, showOverflow: true }
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        tableToolbar: {
          id: 'modules.details',
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
        }},
      tableHeight: null,
      selections: [],
      exportExcel: {
        url: '/api/v1/exportDataTask/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  watch: {

  },
  mounted() {

  },
  created() {
    this.exportExcel.queryParams = this.queryParams
    this.queryParams.mainId = this.$route.query.id
    this.getData()
  },
  methods: {
    init() {
    },
    submit() {
      this.getData()
    },
    getData() {
      this.tableData.loading = true
      issueDetails(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
    },
    cancel() {
      if (this.selections.length === 0) {
        this.$notify.warning('请至少选择一条记录！')
        return
      }
      this.$confirm(`是否执行`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelLoading = true
        cancel(this.selections).then((res) => {
          this.cancelLoading = false
          this.$notify.success(res.data)
          this.getData()
        },
        // eslint-disable-next-line handle-callback-err
        err => {
          this.cancelLoading = false
        })
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
