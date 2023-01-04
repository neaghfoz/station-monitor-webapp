<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>

        <el-form-item label="所属系统" prop="systemIds">
          <el-select v-model="queryParams.systemIds" placeholder="全部">
            <el-option v-for="(item,index) in systemInfoList" :key="index" :label="item.systemName" :value="item.systemId" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="versionIds">
          <el-input
            v-model="queryParams.versionIds"
            type="text"
            placeholder="版本号"
          />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-form-item v-show="false" prop="createStartTime" />
          <el-form-item v-show="false" prop="createEndTime" />
          <ti-date-range
            v-model="queryParams"
            date-type="daterange"
            format="yyyy-MM-dd"
            begin-key="createStartTime"
            end-key="createEndTime"
            clearable="true"
          />
        </el-form-item>

        <el-form-item label="创建人" prop="creatorIds">
          <ti-select v-model="queryParams.creatorIds" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'id',label:'fullName'}" multiple />
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
            <el-button v-permission="['version:details']" type="warning" @click="detail(row)">查看详情</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['version:create']" type="primary" @click="add">新增</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />
    <add ref="addDialog" @refreshDataList="getData" />
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { versionList, allSystems } from './version'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import add from './components/add'

export default {
  name: 'AutoUpdationListView',
  components: { tiSysOrg, TiDateRange, TiSelect, TiExportExcel, add },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        systemIds: '',
        versionIds: '',
        creatorIds: '',
        createStartTime: '',//moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
        createEndTime: '',//moment(new Date()).add(0, 'days').format('YYYY-MM-DD'),
        lastUpdateStartTime: moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
        lastUpdateEndTime: moment(new Date()).add(0, 'days').format('YYYY-MM-DD')
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '所属系统', field: 'systemName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '版本号', field: 'mainVersionId', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '创建时间', field: 'createTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '创建人', field: 'creatorName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '下发车道数', field: 'laneCount', minWidth: 100, showOverflow: true, align: 'center', formatter: ({ cellValue }) => { return cellValue || 0 } },
          { title: '最近更新时间', field: 'sendTimeText', minWidth: 150, showOverflow: true, align: 'center' },
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
      },
      systemInfoList: []
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
      allSystems().then(res => {
        this.systemInfoList = res.data
      })
      this.getData()
      this.exportExcel.queryParams = this.queryParams
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      this.tableData.loading = true
      versionList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
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
        path: '/autoUpdation/version/details',
        query: { versionId: row.versionId }
      })
    },
    add() {
      this.$refs.addDialog.init('add')
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
