<template>
  <div class="app-container">
    <el-form ref="appForm" :model="queryParams" :rules="rules" inline :label-width="'110px'">

      <el-form-item label="入口节点" prop="enRoadNodeId">
        <ti-select url="/api/v1/audit/rate/findRoadNodeList"
                   :props="{key:'roadNodeId',value:'roadNodeId',label:'roadNodeName' }"
                   v-model="queryParams.enRoadNodeId"
        />
      </el-form-item>
      <el-form-item label="出口节点" prop="exRoadNodeId">
        <ti-select url="/api/v1/audit/rate/findRoadNodeList"
                   :props="{key:'roadNodeId',value:'roadNodeId',label:'roadNodeName' }"
                   v-model="queryParams.exRoadNodeId"
        />
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
        <el-button type="success" @click="exportExcel.dialog = true">导出</el-button>
      </el-form-item>

      <vxe-grid
        ref="appTable"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        max-height="1000"
        sync-resize
        auto-resize
        keep-source
        class="vxe-table-element"
        :loading="loading"
        :columns="columns"
        :data="tableData.records"
        :pager-config="pageConfig"
        :start-index="(tableData.current - 1) * tableData.size"
        @page-change="handlePageChange"
      />
    </el-form>
    <ti-export-excel :exportExcel="exportExcel" :page="pageConfig"></ti-export-excel>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSelectTree from '@/views/pro/common/tiElement/tiSelect/tiSelectTree'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import tiSysRoad from '@/views/pro/common/tiElement/tiSysRoad/tiSysRoad'
import { exportExcel } from '@/views/pro/common/util/dataUtil'
import { findNodeLinkList } from '@/views/pro/audit/rate/rateManage'

export default {
  name: 'AuditRateNodeLinkView',
  // eslint-disable-next-line vue/no-unused-components
  components: { TiExportExcel, TiSelectTree, TiSelect, tiSysOrg, tiSysRoad, findNodeLinkList },
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        enRoadNodeId: '',
        exRoadNodeId: '',
        version: this.paramVersion,
        loadData: this.loadData
      },
      props: {
        paramVersion: {
          type: String,
          required: true
        },
        loadData: {
          type: Boolean,
          required: false,
          default: false
        }
      },
      loading: false,
      rules: {
        // dataType: { type: 'string', required: true, message: '数据类型不能为空' }
      },
      pageConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      tableData: [],
      columns: [{ title: '版本号', field: 'version', align: 'center', minWidth: 160 },
        { title: '入口节点', field: 'enRoadNodeName', align: 'center', minWidth: 160 },
        { title: '出口节点', field: 'exRoadNodeName', align: 'center', minWidth: 160 },
        { title: '实际里程(米)', field: 'miles', align: 'center', minWidth: 160 },
        { title: '生效时间', field: 'validTime', align: 'center', minWidth: 200 }]
      ,
      exportExcel: {
        url: 'api/v1/audit/rate/nodeRelation/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  created() {
    //    this.getData()
    this.queryParams.version = this.$route.query.paramVersion
  },
  mounted() {
    this.submit()
  },
  methods: {
    submit() {
      this.getData()
    },
    async getData() {
      //alert(this.queryParams.version)
      this.loading = true
      const { data } = await findNodeLinkList(Object.assign({}, { size: this.pageConfig.pageSize,
        current: this.pageConfig.currentPage }), this.queryParams)
      this.tableData = data
      this.pageConfig.total = data.total
      this.loading = false
      //保存导出的查询条件
      this.exportExcel.queryParams = this.queryParams;
    },
    exportEx() {
      exportExcel(this.$refs['appTable'], '相邻节点参数')
    },
    handlePageChange({ currentPage, pageSize }) {
      this.pageConfig.currentPage = currentPage
      this.pageConfig.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs.appForm.resetFields()
    }
  }
}
</script>
<style scoped>
/*.el-form-item /deep/ .el-form-item__content {*/
/*width: 60% !important;*/
/*}*/
</style>
