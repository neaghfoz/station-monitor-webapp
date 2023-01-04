<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
        <el-form-item label="日期" prop="dates">
          <el-form-item v-show="queryParams.dateStatisticType==='day'">
            <el-form-item prop="startDay" v-show="false"/>
            <el-form-item prop="endDay" v-show="false"/>
            <ti-date-range ref="dayRang" :editable="false" v-model="queryParams"
                           date-type="daterange"
                           format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                           end-key="endDay"/>
          </el-form-item>
        <el-form-item v-show="queryParams.dateStatisticType==='month'">
          <el-form-item prop="startMonth" v-show="false"/>
          <el-form-item prop="endMonth" v-show="false"/>
          <ti-date-range-divide ref="month" :editable="false" v-model="queryParams"
                          date-type="month"
                          format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                          end-key="endMonth"/>
           </el-form-item>
        </el-form-item>
      <el-form-item prop="dateStatisticType">
        <ti-select :clearable="false" v-model="queryParams.dateStatisticType"
                   dict-type="tibms_audit_dateStatisticType"/>
      </el-form-item>
        <el-form-item label="车种" prop="freeVehicleClass">
          <ti-select :clearable="false" v-model="queryParams.freeVehicleClass" dict-type="tibms_cy_rpt_freeVehicleClass"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <!-- <el-form-item label="统计类型" prop="dateStatisticType">
          <ti-select :clearable="false" v-model="queryParams.dateStatisticType"
                     dict-type="tibms_rpt_dateStatisticType"/>
        </el-form-item> -->

      <iframe v-bind:src="reportUrl" frameborder=0 border="0"
              style="overflow:auto;width: 100%;height:100%;min-height: 850px"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";
  import {updateRptSearchTimes} from '@/views/pro/report/common/rptSearchTimes';
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.manage.rpt_manage_007',
    components: {TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg,TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          statType: 'subTotal',
          dayStr: moment(new Date()).format('YYYY-MM-DD'),
          dateStatisticType: 'month',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 0, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate: '',
          endDate: '',
          collectDateStr: '',
          userName: '',
          realName: '',
          roadId: '',
          orgNo: '',
          orgName: '',
          freeVehicleClass:2,
          fileName:''
        }
      }
    },
    created() {
      this.queryParams.userName = store.getters.username;
      this.queryParams.realName = store.getters.name;
    },
    computed: {
    },
    methods: {
      async getData() {
        var dateTrans;
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay, this.queryParams.endDay, this.queryParams.collectType, 'day');
          this.queryParams.collectDateStr = '日期：'+ dateTrans.startDate + ' 至 ' + dateTrans.endDate;
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
            this.queryParams.collectDateStr = '日期：'+ this.queryParams.startMonth + ' 至 ' + this.queryParams.endMonth;
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
            this.queryParams.collectDateStr = '日期：'+ this.queryParams.startYear + ' 至 ' + this.queryParams.endYear;
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;

        this.queryParams.lastStartDate = dateUtil.getNextDate(dateTrans.startDate, 'years', 1, 'YYYY-MM-DD');
        this.queryParams.lastEndDate = dateUtil.getNextDate(dateTrans.endDate,'years', 1, 'YYYY-MM-DD');

        this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days') + 1;
        this.queryParams.lastdiffDays =  moment(this.queryParams.lastEndDate).diff(moment(this.queryParams.lastStartDate), 'days') + 1;

        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgName = sysOrg.name;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadId = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        console.log("queryParams:", this.queryParams);
        if (this.queryParams.dateStatisticType === 'month') {
          this.queryParams.fileName = sysOrg.name + '-按车种收费站免费车流与收入损失月报-' + moment(new Date()).format('YYYY-MM-DD');
        }else if (this.queryParams.dateStatisticType === 'day')
        {
          this.queryParams.fileName = sysOrg.name + '-按车种收费站免费车流与收入损失日报-' + moment(new Date()).format('YYYY-MM-DD');
        }

        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_009_按车种收费站免费车流与收入损失月报.cpt',
          this.queryParams);

        //更新查询统计次数
        // updateRptSearchTimes('rpt_manage_009');
      }
    }
  }
</script>

<style scoped>

</style>
