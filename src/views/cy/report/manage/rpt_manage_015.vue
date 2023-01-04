<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
      <el-form-item label="日期" prop="dates">
        <ti-date-range ref="dayRang" :editable="false" v-model="queryParams"
                       date-type="daterange"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                       end-key="endDay"/>
      </el-form-item>
      <el-form-item label="车种" prop="freeVehicleClass">
        <ti-select :clearable="false" v-model="queryParams.freeVehicleClass" dict-type="tibms_cy_rpt_freeVehicleClass"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>

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
  import {updateRptSearchTimes} from '@/views/pro/report/common/rptSearchTimes';
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.manage.rpt_manage_015',
    components: {TiSelectTree, TiSelect, tiSysOrg,TiDateRange},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          freeVehicleClass:'2',
          startDate: '',
          endDate: '',
          lastStartDate: '',
          lastEndDate: '',
          collectDateStr: '',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: '',
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
        dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay,
          this.queryParams.endDay, 'naturalDate','day');
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.lastStartDate = dateUtil.getNextDate(dateTrans.startDate, 'years', 1, 'YYYY-MM-DD');
        this.queryParams.lastEndDate = dateUtil.getNextDate(dateTrans.endDate,'years', 1, 'YYYY-MM-DD');
        //this.queryParams.maxYear = this.queryParams.collectDateStr.slice(0,4);
         this.queryParams.collectDateStr = this.queryParams.startDate + '至' + this.queryParams.endDate;

        //  this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days');

        this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days') + 1;
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        //用户levelya



        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.fileName = sysOrg.name + '-断面车流量收入明细表日报-' + moment(new Date()).format('YYYY-MM-DD');
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_015_01_断面车流量收入明细表日报.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_004_01_断面车流量收入明细表')

      }
    }
  }
</script>

<style scoped>

</style>
