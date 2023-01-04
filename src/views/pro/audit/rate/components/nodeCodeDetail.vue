<template>
  <div class="app-container">
    <el-form ref="appForm" :model="queryParams" :rules="rules" inline :label-width="'110px'">
      <el-form-item label="收费路段" prop="sectionId">
        <!--<ti-sys-road ref="sectionIds" v-model="queryParams.sectionId" :clearable="true" @change="changeRoadNodeIdsBySection"/>-->
        <ti-select ref="sectionIds" style="width: 177px" v-model="queryParams.sectionId"
                   url="/api/v1/common/road/findAllList"
                   :props="{key:'roadId',value:'roadId',label:'roadText'}"
                   :clearable="true" @change="changeRoadNodeIdsBySection"
                   :multiple="false" aria-placeholder="收费路段"/>
      </el-form-item>
      <el-form-item label="路网节点名称" prop="roadNodeId">
        <ti-select ref="roadNodeIds" url="/api/v1/audit/rate/findRoadNodeList"
                   :props="{key:'roadNodeId',value:'roadNodeId',label:'roadNodeName' }"
                   v-model="queryParams.roadNodeId" :clearable="false" :multiple="false"
        />
      </el-form-item>
      <el-form-item label="节点类型" prop="roadNodeType">
        <ti-select
          ref="roadNodeTypes"
          v-model="queryParams.roadNodeType"
          dict-type="tibms_audit_rate_roadNodeType"
          :multiple="false"
          @change="changeRoadNodeIdsByType"
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
import { findNodeCodeList } from '@/views/pro/audit/rate/rateManage'

export default {
  name: 'AuditRateNodeCodeView',
  // eslint-disable-next-line vue/no-unused-components
  components: { TiExportExcel, TiSelectTree, TiSelect, tiSysOrg, tiSysRoad, findNodeCodeList },
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        sectionId: '',
        roadNodeId: '',
        roadNodeType: '',
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
      columns: [{
        title: '版本号',
        field: 'version',
        align: 'center',
        minWidth: 160
      }, {
        title: '收费公路',
        field: 'tollRoadName',
        align: 'center',
        minWidth: 160
      }, {
        title: '收费路段',
        field: 'sectionName',
        align: 'center',
        minWidth: 160
      }, {
        title: '路网节点',
        field: 'roadNodeName',
        align: 'center',
        minWidth: 160
      }, {
        title: '路网节点类型',
        field: 'roadNodeTypeName',
        align: 'center',
        minWidth: 160
      }, {
        title: '反向收费单元',
        field: 'oppositeName',
        align: 'center',
        minWidth: 160
      }, {
        title: '收费门架',
        field: 'gantrysName',
        align: 'center',
        minWidth: 160
      }, {
        title: '经度坐标',
        field: 'xcodeStr',
        align: 'center',
        minWidth: 160
      }, {
        title: '纬度坐标',
        field: 'ycodeStr',
        align: 'center',
        minWidth: 160
      }, {
        title: '生效时间',
        field: 'validTime',
        align: 'center',
        minWidth: 200
      }]
      ,
      exportExcel: {
        url: 'api/v1/audit/rate/nodeCode/exportExcel',
          dialog: false,
          queryParams: {},
        type: 'curpage'
      }
    }
  },
  created() {
    //this.queryParams.version = this.paramVersion;
    this.queryParams.version = this.$route.query.paramVersion
  },
  mounted() {
    this.submit()
  },
  watch:{
    loadData: {
      handler: function(newParams, oldParams) {
        //alert(newParams)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submit() {
      this.getData()
    },
    async getData() {
      //alert(this.queryParams.version)
      this.loading = true
      const { data } = await findNodeCodeList(Object.assign({}, { size: this.pageConfig.pageSize,
        current: this.pageConfig.currentPage }), this.queryParams)
      this.tableData = data
      this.pageConfig.total = data.total
      this.loading = false
      //保存导出的查询条件
      this.exportExcel.queryParams = this.queryParams;
    },
    exportEx() {
      exportExcel(this.$refs['appTable'], '路网节点参数')
    },
    handlePageChange({ currentPage, pageSize }) {
      this.pageConfig.currentPage = currentPage
      this.pageConfig.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs['roadNodeIds'].selectDataShow = this.$refs['roadNodeIds'].selectData
      this.$refs['appForm'].resetFields()
    },
    filterRoadNodeIds(sectionId, roadNodeType){
      let selectData = this.$refs['roadNodeIds'].selectData
      let resultDataShow = []
      selectData.forEach(item => {
        const match1 = !sectionId || (sectionId && item.sectionId == sectionId)
        const match2 = !roadNodeType || (roadNodeType && item.roadNodeType == roadNodeType)
        if (match1 && match2) {
          resultDataShow.push(item)
        }
      })
      return resultDataShow
    },
    changeRoadNodeIdsByType(selVal,selValObj){
      this.$refs['roadNodeIds'].selectDataShow = this.filterRoadNodeIds(this.$refs['sectionIds'].roadId, selVal);
    },
    changeRoadNodeIdsBySection(selVal,selValObj){
      this.$refs['roadNodeIds'].selectDataShow = this.filterRoadNodeIds(selVal,this.$refs['roadNodeTypes'].selected);
    }
  }
}
</script>
<style scoped>
/*.el-form-item /deep/ .el-form-item__content {*/
/*width: 60% !important;*/
/*}*/
</style>
