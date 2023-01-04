<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row >
          <el-form-item label="参数表名" prop="tableName">
            <el-input
              v-model="queryParams.tableName"
              type="text"
              placeholder="参数表名"
            />
          </el-form-item>
          <el-form-item label="表中文名" prop="tableShowName">
            <el-input
              v-model="queryParams.tableShowName"
              type="text"
              placeholder="表中文名"
            />
          </el-form-item>
          <el-form-item label="文件名" prop="recvFileName">
            <el-input
              v-model="queryParams.recvFileName"
              type="text"
              placeholder="文件名"
            />
          </el-form-item>
          <el-form-item label="使用状态" prop="isUsedStr">
            <ti-select
              v-model="queryParams.isUsedStr"
              placeholder="全部"
              dict-type="tibms_sendpara_useStatus"
            />
          </el-form-item>
          <el-form-item label="参数表归类" prop="tableClassStr">
            <ti-select
              v-model="queryParams.tableClassStr"
              placeholder="全部"
              dict-type="tibms_param_tableClass"
              :multiple="true"
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
          @checkbox-all="({ selection }) => { selections = selection }"
          @checkbox-change="({ selection }) => { selections = selection }"
        >
          <template v-slot:operation="{ row }">
            <el-button type="primary" @click="edit(row)" v-permission="['sendpara:update']">修改</el-button>
            <el-button type="danger" @click="del(row)" v-permission="['sendpara:delete']">删除</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button type="primary" @click="add()" v-permission="['sendpara:create']">新增</el-button>
            <el-button type="warning" @click="exportExcel.dialog = true" v-permission="['sendpara:excel']">导出</el-button>
            <el-button type="success" @click="updateBatch('1')" v-permission="['sendpara:statusChange']">启用</el-button>
            <el-button @click="updateBatch('0')" v-permission="['sendpara:statusChange']">禁用</el-button>

          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />

    <detail ref="roleEditDialog" @refreshData="getData" />
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { sendParaList, deleteById, statusChange } from './sendPara'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import detail from './detail'

export default {
  name: 'SendParaListView',
  components: { TiSelect, TiExportExcel, detail },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        tableName: '',
        tableShowName: '',
        recvFileName: '',
        isUsedStr: '',
        tableClassStr: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '序号', field: 'recNo', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '参数表名', field: 'tableName', minWidth: 150, showOverflow: true },
          { title: '表中文名', field: 'tableShowName', minWidth: 100, showOverflow: true },
          { title: '文件名', field: 'recvFileName', minWidth: 100, showOverflow: true },
          { title: '使用状态', field: 'isUsedText', minWidth: 80, showOverflow: true },
          { title: '参数表归类', field: 'tableClassText', minWidth: 80, showOverflow: true },
          { title: '操作时间', field: 'opTime', minWidth: 80, showOverflow: true },
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
        url: '/api/v1/sendpara/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
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
      console.log(this.selections)
      this.tableData.loading = true
      sendParaList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
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
    },
    add() {
      this.$refs.roleEditDialog.init('add', this.queryParams.tenantId, this.queryParams.appId)
    },
    edit(row) {
      this.$refs.roleEditDialog.init('edit', this.queryParams.tenantId, this.queryParams.appId, row)
    },
    del(row) {
      this.$confirm(`是否删除下发表:` + row.tableName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      })
    },
    updateBatch(status) {
      if (this.selections.length === 0) {
        this.$notify.warning('请至少选择一条记录！')
        return
      }
      this.$confirm(`是否执行`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = ''
        this.selections.forEach((item, index) => {
          if (index === 0) {
            ids = item.id
          } else {
            ids += ',' + item.id
          }
        })
        statusChange({ ids: ids, status: status }, {}).then((res) => {
          this.$notify.success(res.data)
          this.getData()
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
