<template>
  <div class="app-container">
    <el-form ref="appForm" :model="queryParams" :rules="rules" inline :label-width="'110px'">
      <el-form-item label="参数类型" prop="paramType">
        <ti-select v-model="queryParams.paramType" dict-type="tibms_audit_rate_paramType"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item label="版本号" prop="paramVersion">
        <el-input v-model="queryParams.paramVersion" type="text" maxlength="100"/>
      </el-form-item>
      <el-form-item label="生效时间" prop="validTime">
        <ti-date-range date-style="width:300px" ref="validTimeRange" date-type="daterange"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                       date-rule="oneYear" v-model="queryParams.validTimeRange"
                       begin-key="beginDate"
                       end-key="endDate" :clearable="true"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
        <router-link v-show="false" tag="a" :to="{name:'/audit/originalDataImport'}" href="#/audit/originalDataImport" target="_blank">aaaa</router-link>
      </el-form-item>

      <vxe-grid
        ref="vxe"
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
      >
        <template v-slot:operation="{ row }">
          <el-button type="primary" size="small" @click="paramDetailView(row)">参数详情</el-button>
<!--          <el-button type="primary" size="small" @click="deleteParam(row)">删除</el-button>-->
        </template>
      </vxe-grid>
    </el-form>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSelectTree from '@/views/pro/common/tiElement/tiSelect/tiSelectTree'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import {deleteByVersion, findParamList} from '@/views/pro/audit/rate/rateManage';
import moment from "moment";

export default {
  name: 'auditRateManageView',
  // eslint-disable-next-line vue/no-unused-components
  components: { TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiSysOrg, findParamList},
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        paramType: null,
        paramVersion: null,
        validTimeRange: {
          beginDate: null,
          endDate: null
        },
        beginDate: '',
        endDate: '',
      },
      loading: false,
      rules: {
        //paramType: { type: 'string', required: true, message: '参数类型不能为空' }
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
      tableToolbar: {
        id: 'audit.rate.manage-toolbar',
        custom: true,
        slots: {
          buttons: 'toolbar_buttons'
        },
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      tableData: [],
      columns: [{
        title: '参数类型',
        field: 'paramTypeName',
        align: 'center',
        minWidth: 160
      }, {
        title: '版本号',
        field: 'paramVersion',
        align: 'center',
        minWidth: 160
      }, {
        title: '生效时间',
        field: 'validTime',
        align: 'center',
        minWidth: 160
      }, {
        title: '操作',
        minWidth: 200,
        fixed: 'right',
        align: 'center',
        slots: { default: 'operation' }
      }
      ]
    }
  },
  created() {
    //    this.getData()
  },
  mounted() {
    this.submit()
  },
  methods: {
    submit() {
      this.getData()
    },
    async getData() {
      this.loading = true
      this.queryParams.beginDate = this.queryParams.validTimeRange.beginDate;
      this.queryParams.endDate = this.queryParams.validTimeRange.endDate;
      const { data } = await findParamList(Object.assign({}, { size: this.pageConfig.pageSize,
        current: this.pageConfig.currentPage }), this.queryParams)
      this.tableData = data
      this.pageConfig.total = data.total
      this.loading = false
    },
    handlePageChange({ currentPage, pageSize }) {
      this.pageConfig.currentPage = currentPage
      this.pageConfig.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs.appForm.resetFields()
      this.queryParams.validTimeRange.beginDate = null
      this.queryParams.validTimeRange.endDate = null
    },
    paramDetailView(row) {
      if (row.paramType == 1) {// 省内计费参数
        this.$router.push({
          path: '/audit/rate/provPriceParam',
          query: {
            paramVersion: row.paramVersion,
            paramType: row.paramType,
            timestamp: Date.parse(new Date())
          }
        })
      } else if (row.paramType == 2) {// 路径参数
        this.$router.push({
          path: '/audit/rate/nodeParam',
          query: {
            paramVersion: row.paramVersion,
            paramType: row.paramType,
            timestamp: Date.parse(new Date())
          }
        })
      }
    },
    deleteParam(row) {
      //alert(row.paramType + '==' + row.paramVersion)
      this.$confirm(`是否删除该版本参数:\r\n` + row.paramVersion, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByVersion({paramType:row.paramType,paramVersion: row.paramVersion}).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      })
    }
  }
}
</script>
<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
