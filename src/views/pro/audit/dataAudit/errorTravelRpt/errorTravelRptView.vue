<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="queryParams" inline
             label-position="right" :label-width="'130px'">
      <el-form-item prop="beginDate" v-show="false"/>
      <el-form-item prop="endDate" v-show="false"/>
      <el-form-item label="统计日期" >
        <ti-date-range date-style="width: 240px;" v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                       begin-key="beginDate" end-key="endDate" :clearable="false" :selectfuture="false"/>
      </el-form-item>
      <el-form-item class="searchItem">
        <el-button type="primary" v-permission="['errorTravelRpt:list']" @click="submit">查询</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="flex:1;min-height: 400px;">
      <vxe-grid
        ref="table"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        height="auto"
        class="vxe-table-element"
        :loading="table.loading"
        :start-index="(table.page.currentPage - 1) * table.page.pageSize"
        :pager-config="table.page"
        :columns="table.columns"
        :data="table.data"
        :toolbar="table.tableToolbar"
        :editConfig="table.editConfig"
        @page-change="handlePageChange">
        >
        <template v-slot:tbars>
          <el-button v-permission="['errorTravelRpt:exp']"type="primary" @click="expWork">导出</el-button>
        </template>

      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>

    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
  import api from "@/views/pro/audit/dataAudit/errorTravelRpt/errorTravelRptApi"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import dateUtil from "@/views/pro/common/util/dateUtil";

  export default {
    name: "pro.audit.dataAudit.errorTravelRpt.errorTravelRptView",
    components: { TiExportExcel,TiDateRange,TiDate },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          beginDate:dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDate:dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          beginDateStr:null,
          endDateStr:null
        },
        userListCache: [],
        curRow:null,
        table:{
          loading: false,
          data:[],
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'left',
            pageSizes: [10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
              'Total'],
            perfect: true
          },
          tableToolbar: {
            id: 'audit.errorTravelRptView.toolbar',
            custom: true,
            slots: {
              buttons: 'tbars'
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
          editConfig: {
            trigger: 'manual',
            mode: 'row',
            showStatus: true,
            showIcon: false,
            autoClear: false,
            immediate: true
          },
          columns: [
            {title: '统计日期', field: 'statDay', minWidth: 80, align: 'center',showOverflow: true},
            {title: '异常车辆数量', field: 'vehicleCnt', minWidth: 80, align: 'center',showOverflow: true},
            {title: '异常行程数量', field: 'pathCnt', minWidth: 80, align: 'center',showOverflow: true},
            {title: '异常行程类型', field: '#',  align: 'center',
              children: [
                {field: 'pathCnt1', title: '屏蔽标签', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt2', title: '一车多卡（签）', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt3', title: '大车小标', align: 'center', minWidth: 80, showOverflow: true},
                // {field: 'pathCnt4', title: '一车多车型', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt5', title: '节假日八九座客车逃费', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt6', title: '超时车', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt7', title: '入口超载车', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt8', title: '高频最小费额车', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt9', title: '车型不符', align: 'center', minWidth: 80, showOverflow: true},
                {field: 'pathCnt10', title: '轴型不符', align: 'center', minWidth: 80, showOverflow: true}

              ]
            },
            {title: '已稽核数量', field: 'auditCnt', minWidth: 80, align: 'center',showOverflow: true},
            {title: '确认逃费行程数', field: 'auditEscapeCnt', minWidth: 80, align: 'center', showOverflow: true},
            {title: '确认逃费金额（元）', field: 'auditEscapeFeeText', minWidth: 80, align: 'center', showOverflow: true}
          ]
        },
        exportExcel: {
          url: 'api/v1/audit/comm/errorTravelRpt/exp',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },

    created() {
      // this.$nextTick(() => {
      //   this.submit()
      // })
    },
    methods: {
      // 通用查询设置
      async reload(){
        if (this.queryParams.beginDate == null) {
          this.queryParams.beginDateStr = null
        } else{
          this.queryParams.beginDateStr = this.queryParams.beginDate
        }
        if (this.queryParams.endDate == null) {
          this.queryParams.endDateStr = null
        } else{
          this.queryParams.endDateStr = dateUtil.getNextDate(this.queryParams.endDate, 'days', -1, 'YYYY-MM-DD')
        }
        this.table.loading = true
        const res = await api.findReport({current: this.table.page.currentPage, size: this.table.page.pageSize}, this.queryParams);
        if (res.code == 200) {
          this.table.data = res.data.records
          this.table.page.total = res.data.total
        } else {
          this.table.data = []
          this.table.page.total = 0
        }
        this.table.loading = false
      },
      submit() {
        this.$refs.appForm.validate((valid) => {
          if (valid) {
            this.table.page.currentPage = 1
            this.reload()
          } else {
            return false;
          }
        })
      },
      expWork(){
        this.exportExcel.queryParams = this.queryParams
        this.exportExcel.dialog = true
      },
      reset() {
        this.$refs['appForm'].resetFields()
        this.queryParams.beginDateStr=this.queryParams.beginDate
        this.queryParams.endDateStr=this.queryParams.endDate
        console.log("this.queryParams",this.queryParams)
      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      }
    }
  }
</script>
