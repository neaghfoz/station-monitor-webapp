<template>
  <div class="app-container" style="height: 100%" v-loading="exportExcel.loading">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <!--      <el-form-item label="路段" prop="sysOrg">
              <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2" />
      &lt;!&ndash;        <ti-select ref="sectionId"&ndash;&gt;
      &lt;!&ndash;                   v-model="queryParams.sectionId"&ndash;&gt;
      &lt;!&ndash;                   check-strictly&ndash;&gt;
      &lt;!&ndash;                   url="api/v1/common/sysOrg/roadList"&ndash;&gt;
      &lt;!&ndash;                   :props="{key:'id',value:'roadId',label:'name'}"&ndash;&gt;
      &lt;!&ndash;        />&ndash;&gt;
            </el-form-item>-->
      <el-form-item label="路段" prop="sectionId">
        <ti-select
          style="width: 177px"
          v-model="queryParams.sectionId"
          :clearable="true"
          url="/api/v1/common/road/findListByAuth"
          :props="{ key: 'roadId', value: 'roadId', label: 'roadName' }"
          :multiple="false"
          aria-placeholder="路段"
        />
      </el-form-item>
      <el-form-item label="统计维度" prop="dateStatisticType">
        <ti-select
          v-model="queryParams.dateStatisticType"
          :clearable="false"
          dict-type="tibms_audit_dateStatisticType"
        />
      </el-form-item>

      <el-form-item label="通行时间" prop="tansDateRange">
        <el-col :span="30">
          <el-form-item v-show="queryParams.dateStatisticType === 'day'">
            <ti-date-range
              ref="dayRang"
              v-model="queryParams"
              date-type="daterange"
              format="yyyy-MM-dd"
              :editable="false"
              value-format="yyyy-MM-dd"
              begin-key="startDay"
              end-key="endDay"
            />
          </el-form-item>
          <el-form-item v-show="queryParams.dateStatisticType === 'month'">
            <ti-date-range
              ref="monthRang"
              v-model="queryParams"
              date-type="monthrange"
              format="yyyy-MM"
              :editable="false"
              value-format="yyyy-MM"
              begin-key="startMonth"
              end-key="endMonth"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="primary" @click="exportEx">导出</el-button>
      </el-form-item>
    </el-form>

    <vxe-grid
      ref="feeAnalyse"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @page-change="handlePageChange"
    >
      >
      <template v-slot:operation="{ row }">
        <!--<el-button v-permission="['testOrder:edit']" type="warning" @click="edit(row.id)">编辑</el-button>-->
        <!--<el-button v-permission="['testOrder:remove']" type="danger" @click="remove(row.id)">删除</el-button>-->
        <el-button type="warning" v-permission="['feeAnalyse:feeReason']" @click="analyse(row)">校核分析</el-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import moment from "moment";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import dateUtil from "@/views/pro/common/util/dateUtil";
import { findPage } from "@/views/pro/audit/feeAnalyse/feeAnalyseApi";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import { setTimeout } from 'timers';
import { exportExcel } from "@/views/pro/common/util/dataUtil"
import { download } from 'ecip-web/utils'
import TiSysRoad from "@/views/pro/common/tiElement/tiSysRoad/tiSysRoad"

export default {
  name: "audit.feeAnalyse.feeAnalyseView",
  components: { TiSelect, TiDateRange, tiSysOrg, TiSysRoad },
  mixins: [...mixin],
  data () {
    return {
      initFlag: true,
      exportExcel: { loading: false },
      sectionMap: {},
      queryParams: {
        sysOrg: '',
        sysOrgIdStr: '',
        sectionId: '',
        dateStatisticType: 'day',
        startDay: dateUtil.getNextDate(new Date(), 'days', 10, 'YYYY-MM-DD'),
        endDay: moment(new Date()).format('YYYY-MM-DD'),
        startMonth: moment(new Date()).format('YYYY-MM'),
        endMonth: moment(new Date()).format('YYYY-MM'),
        startDate: '',
        endDate: '',
        name: "通行费校核分析"
      },
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
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
        { field: 'transDay', title: '日期', align: 'center', minWidth: 120, showOverflow: true },
        {
          field: 'sectionId', title: '路段', align: 'center', minWidth: 150, showOverflow: true,
          slots: {
            default: ({ row }, h) => {
              //return this.sectionMap[row.sectionId];
              return row.sectionName;
            }
          }
        },
        {
          field: '#', title: '理论应收', align: 'center', children: [
            { field: 'moreNum', title: '行程数', align: 'center', minWidth: 100, showOverflow: true, },
            {
              field: '#', title: '理论应收(元)', align: 'center', minWidth: 100, showOverflow: true,
              slots: {
                default: ({ row }, h) => {
                  //return this.toYuan(row.payFee) ;
                  return row.theoryFeeStr;
                }
              }
            }
          ]
        },
        {
          field: '#', title: '收益快报', align: 'center', children: [
            { field: 'totalNum', title: '行程数', align: 'center', minWidth: 100, showOverflow: true, },
            {
              field: '#', title: '收益快报(元)', align: 'center', minWidth: 100, showOverflow: true,
              slots: {
                default: ({ row }, h) => {
                  //return this.toYuan(row.fee) ;
                  return row.feeStr;
                }
              }
            }
          ]
        },
        {
          field: '#', title: '校核差异', align: 'center', children: [
            {
              field: '#', title: '行程数', align: 'center', minWidth: 100, showOverflow: true,
              slots: {
                default: ({ row }, h) => {
                  //return (row.moreNum-row.totalNum) ;
                  return row.diffNum;
                }
              }
            },
            {
              field: '#', title: '差异金额(元)', align: 'center', minWidth: 100, showOverflow: true,
              slots: {
                default: ({ row }, h) => {
                  //return this.toYuan(row.payFee-row.fee) ;
                  return row.diffFeeStr;
                }
              }
            },
            {
              field: '#', title: '差额比(%)', align: 'center', minWidth: 100, showOverflow: true,
              slots: {
                default: ({ row }, h) => {
                  return row.diffRate;
                  // if(row.payFee==0){
                  //   return "0.00%";
                  // }else{
                  //   return ((row.payFee - row.fee)/row.payFee*100).toFixed(2)+"%";
                  // }
                }
              }
            }
          ]
        },
        { title: "操作", align: "center", width: 100, slots: { default: 'operation' }, fixed: 'right' }
      ],
      selections: [],
      tableData: [],
    }
  },
  created () {
    this.$nextTick(() => {
      this.getData();
    });
  },
  watch: {
    'queryParams.sysOrgIdStr': function (newVal, oldVal) {
      // if(newVal && this.initFlag)
      // {
      //   this.getData();
      //   this.initFlag = false;
      // }
    }
  },
  methods: {
    submit () {
      Object.assign(this.$data.page, this.$options.data().page);
      this.getData();
    },
    async getData () {
      let dateTrans;
      if (this.queryParams.dateStatisticType === 'day') {
        dateTrans = dateUtil.dateCombination(this.queryParams.startDay, this.queryParams.endDay, this.queryParams.dateStatisticType);
      } else if (this.queryParams.dateStatisticType === 'month') {
        dateTrans = dateUtil.dateCombination(this.queryParams.startMonth, this.queryParams.endMonth, this.queryParams.dateStatisticType);
      }
      this.queryParams.startDate = dateTrans.startDate;
      this.queryParams.endDate = dateTrans.endDate;
      // this.queryParams.sysOrgIdStr = this.queryParams.sysOrg.id;
      console.log("queryParams:", this.queryParams);

      this.loading = true;
      const { data } = await findPage(Object.assign({}, { size: this.page.pageSize, current: this.page.currentPage }),
        this.queryParams);

      this.tableData = data.records
      this.page.total = data.total
      this.loading = false
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.page.currentPage = currentPage
      this.page.pageSize = pageSize
      this.getData()
    },
    analyse (row) {
      console.log("row:", row);
      var transDay = row.transDay;
      var sectionId = row.sectionId;
      var startDate = transDay;
      var endDate = transDay;
      var dateStatisticType = 'day'
      if (transDay.length == 6) {
        dateStatisticType = 'month'
        var days = new Date(transDay.substr(0, 4), transDay.substr(4, 2), 0).getDate();
        startDate = transDay.substr(0, 4) + "-" + transDay.substr(4, 2) + "-01";
        endDate = transDay.substr(0, 4) + "-" + transDay.substr(4, 2) + "-" + days;
      } else {
        startDate = transDay.substr(0, 4) + "-" + transDay.substr(4, 2) + "-" + transDay.substr(6, 2);
        endDate = startDate;
      }
      var name = sectionId ? row.sectionName : null;
      this.$router.push({
        path: '/audit/auditSplitDiffSumRpt/auditSplitDiffSumRptReasonView',
        query: {
          beginTransDay4Reason: startDate,
          endTransDay4Reason: endDate,
          sectionId4Reason: sectionId,
          dateStatisticType4Reason: dateStatisticType,
          sectionName4Reason: name
        }
      })
    },
    toWYuan (num) {
      // 转W元
      return (parseFloat(num) / 1000000).toFixed(2);
    },
    toYuan (num) {
      // 转元
      return (parseFloat(num) / 100).toFixed(2);
    },
    exportEx () {
      //exportExcel(this.$refs['feeAnalyse'],'通行费校核分析')
      let dateTrans;
      if (this.queryParams.dateStatisticType === 'day') {
        dateTrans = dateUtil.dateCombination(this.queryParams.startDay, this.queryParams.endDay, this.queryParams.dateStatisticType);
      } else if (this.queryParams.dateStatisticType === 'month') {
        dateTrans = dateUtil.dateCombination(this.queryParams.startMonth, this.queryParams.endMonth, this.queryParams.dateStatisticType);
      }
      this.queryParams.startDate = dateTrans.startDate;
      this.queryParams.endDate = dateTrans.endDate;

      this.exportExcel.loading = true
      let params = this.queryParams;
      download({
        url: "api/v1/audit/list/feeAnalyse/exportFeeAnalyse",
        method: 'post',
        params: null,
        data: params
      }).then((res) => {
        this.exportExcel.loading = false
      });
      ;
    }
  }
}
</script>

<style scoped>
</style>
