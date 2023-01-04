<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <vxe-grid
        ref="passSplitResultVxe"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        max-height="1000"
        class="vxe-table-element"
        :toolbar="tableToolbar"
        :loading="loading"
        :start-index="(page.currentPage - 1) * page.pageSize"
        :pager-config="page"
        :columns="columns"
        :data="tableData"
        @page-change="handlePageChange"
      >
        >

        <template v-slot:toolbar_buttons>
          <span style="position: absolute; left: 17px; top: 10px">{{ tableTitle }}</span>

          <div class="vxe-toolbar-self">
            <el-form-item label="记账标识">
              <ti-select v-model="queryParams.accountStatus" dict-type="tibms_audit_payState" style="width: 140px" />
            </el-form-item>
            <el-form-item label="通行类型">
              <el-select style="width: 100px" clearable placeholder="请选择" v-model="queryParams.passType">
                <el-option label="ETC" value="1"></el-option>
                <el-option label="MTC" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出口计费方式">
              <ti-select v-model="queryParams.exitFeeType" dict-type="tibms_com_exitFeeType" />
            </el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="success" @click="exportExcel.dialog = true">批量导出</el-button>
          </div>

          <pass-split-result-detail-dialog :params="detailParams" ref="detailDialog" />
        </template>

        <template v-slot:operation="{ row }">
          <el-button type="warning" @click="detail(row)">流水明细</el-button>
        </template>
      </vxe-grid>

      <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
    </el-form>
  </div>
</template>

<script>
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import mixin from 'ecip-web/utils/common-mixin';
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import { findPassList } from "@/views/pro/audit/feeAnalyse/components/feePassListApi";
import PassSplitResultDetailDialog from "@/views/pro/audit/auditSplitDiffSumRpt/components/passSplitResultDetailDialog";
import { download } from 'ecip-web/utils'
import { getData } from "@/views/pro/audit/auditSplitDiffSumRpt/api/passSplitResultApi"

export default {
  name: "audit.auditSplitDiffSumRpt.passSplitResultView",
  components: { TiSelect, TiExportExcel, PassSplitResultDetailDialog },
  mixins: [...mixin],
  data () {
    return {
      tableTitle: '',
      isDay: false,
      detailParams: {},
      routeQueryParams: {
        sectionCode: '',
        splitType: '',
        diffType: '',
        diffReason: '',
        beginTransDay: '',
        endTransDay: ''
      },
      queryParams: {
        accountStatus: '',
        passType: '',
        exitFeeType: '',
      },
      curParamsValue: '',
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableToolbar: {
        id: 'audit.auditSplitDiffSumRpt.components.passSplitResult-toolbar',
        custom: true,
        slots: {
          buttons: 'toolbar_buttons'
        },
        zoom: false, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
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
      columns: [
        {
          title: "序号",
          type: "seq",
          width: 50,
          align: "center"
        },
        { minWidth: 150, field: 'passId', title: '通行标识', align: 'center', showOverflow: true },
        {
          minWidth: 150, field: '#', title: '车牌', align: 'center', showOverflow: true,
          slots: {
            default: ({ row }, h) => {
              return row.vehiclePlate + "_" + row.vehiclePlateColorDesc;
            }
          }
        },
        { minWidth: 120, field: 'passTypeDesc', title: '通行方式', align: 'center', showOverflow: true },
        { minWidth: 120, field: 'exitFeeTypeDesc', title: '出口计费类型', align: 'center', showOverflow: true },
        { minWidth: 120, field: 'pathTypeDesc', title: '路径类型', align: 'center', showOverflow: true },
        { field: 'realPathFirstName', minWidth: 150, title: '入口站', align: 'center', showOverflow: true },
        { field: 'realPathLastName', minWidth: 150, title: '出口站', align: 'center', showOverflow: true },
        { field: 'accountStatusDesc', minWidth: 150, title: '记账标识', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'feeSumStr', title: '理论应收(元)', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'relatedSplitFeeStr', title: '省中心拆分实收(元)', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'diffSumStr', title: '差异金额', align: 'center', showOverflow: true },
        { title: "操作", fixed: 'right', align: "center", minWidth: 100, slots: { default: 'operation' } }
      ],
      selections: [],
      tableData: [],
      exportExcel: {
        url: '/api/v1/audit/feeAnalyse/passSplitResult/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  created () {
    this.parseParams(this.$route.query)
    this.searchData()
  },
  watch: {
    paramsValue (newVal, oldVal) {
      if (newVal && this.curParamsValue != newVal) {
        this.parseParams(this.$route.query)
        this.curParamsValue = newVal
        this.searchData()
      }
    }
  },
  computed: {
    paramsValue: function () {
      if (this.$route.query.splitType4PassList && this.$route.query.diffType4PassList
        && this.$route.query.diffReason4PassList && this.$route.query.beginTransDay4PassList
        && this.$route.query.endTransDay4PassList && this.$route.query.sectionCode4PassList) {
        const tempParamsValue = (this.$route.query.splitType4PassList + "_" + this.$route.query.diffType4PassList
          + "_" + this.$route.query.diffReason4PassList + "_" + this.$route.query.beginTransDay4PassList
          + "_" + this.$route.query.endTransDay4PassList + "_" + this.$route.query.sectionCode4PassList
          + "_" + this.$route.query.dateStatisticType4PassList + "_" + this.$route.query.name4PassList)
        return tempParamsValue
      }
      return ""
    }
  },
  methods: {
    parseParams (params) {
      console.log("params:", params);
      this.tableTitle = params.name4PassList;
      this.routeQueryParams.sectionCode = params.sectionCode4PassList
      this.routeQueryParams.splitType = params.splitType4PassList
      this.routeQueryParams.diffType = params.diffType4PassList
      this.routeQueryParams.diffReason = params.diffReason4PassList
      this.routeQueryParams.dateStatisticType = params.dateStatisticType4PassList
      this.routeQueryParams.beginTransDay = params.beginTransDay4PassList
      this.routeQueryParams.endTransDay = params.endTransDay4PassList

      if (this.routeQueryParams.beginTransDay == this.routeQueryParams.endTransDay) {
        this.isDay = true;
      } else {
        this.isDay = false;
      }
      console.log("routeQueryParams:", this.routeQueryParams);
      Object.assign(this.queryParams, this.routeQueryParams);
    },
    init () {
      this.routeQueryParams = this.$route.query;

      if (this.routeQueryParams.name) {
        this.tableTitle = this.routeQueryParams.name;
      }

      if (this.routeQueryParams.startDate == this.routeQueryParams.endDate) {
        this.isDay = true;
      } else {
        this.isDay = false;
      }
      console.log("routeQueryParams:", this.routeQueryParams);

      Object.assign(this.queryParams, this.routeQueryParams);
      this.$nextTick(async => {
        this.getData();
      }
      );
    },
    searchData () {
      Object.assign(this.$data.page, this.$options.data().page);
      this.getData();
    },
    async getData () {
      this.loading = true
      console.log("queryParams:", this.queryParams);
      const { data } = await getData(Object.assign({}, { size: this.page.pageSize, current: this.page.currentPage }),
        this.queryParams);

      this.tableData = data.records
      this.page.total = data.total
      this.loading = false

      //保存导出的查询条件
      this.exportExcel.queryParams = this.queryParams;
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.page.currentPage = currentPage
      this.page.pageSize = pageSize
      this.getData()
    },
    detail (row) {
      Object.assign(this.detailParams, row)
      /* Object.assign(this.detailParams, {
        passId: row.passId, sectionId: row.tollRoadId
        , enTime: row.enTime, type: this.queryParams.type, pathLastnTime: row.pathLastnTime
      }) */
      console.log("detailParams:", this.detailParams);

      this.$refs.detailDialog.dialogVisible = true;
    },
    async exportExcel () {
      let params = this.routeQueryParams;
      await download({
        url: "api/v1/audit/list/feeAnalyse/passSplitResult/exportExcel",
        method: 'post',
        params: null,
        data: params
      });
    }
  }
}
</script>

<style scoped>
.vxe-toolbar-self {
  position: absolute;
  right: 35px;
  top: 10px;
}
</style>
