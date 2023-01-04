<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="所在机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
      </el-form-item>

      <el-form-item label="统计日期" prop="dates">
        <ti-date ref="month" v-model="queryParams.monthValue" dateType="month" :clearable="false" format="yyyy-MM" value-format="yyyy-MM"/>
      </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
      <iframe v-bind:src="reportUrl" frameborder=0 border="0" style="overflow:auto;width: 100%;height:100%;min-height: 850px"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment';
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import {getMonthFirstDay} from "@/views/cy/common/datePrecision/datePrecision";
  import {getMonthLastDay} from "@/views/cy/common/datePrecision/datePrecision";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.station.rpt_station_010',
    components: {TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          monthValue: moment(new Date()).format('YYYY-MM'),
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: '',
          fileName: '',
          excelName: ''
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
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;

        //参数
        this.queryParams.fileName = '长益高速收费站车流量情况月报表';
        var fileNameDate = moment(new Date).format('YYYYMMDD');
        this.queryParams.excelName = this.queryParams.fileName + fileNameDate;
        if(this.queryParams.roadIdStr == '' || this.queryParams.roadIdStr == undefined) {
          this.queryParams.roadIdStr = '0';
        } else {
          this.queryParams.roadIdStr = this.queryParams.roadIdStr;
        }
        if(this.queryParams.stationIdStr == '' || this.queryParams.stationIdStr == undefined || this.queryParams.stationIdStr.length > 14) {
          this.queryParams.stationIdStr = '0';
        } else {
          this.queryParams.stationIdStr = this.queryParams.stationIdStr;
        }
        this.queryParams.startMonth = getMonthFirstDay(this.queryParams.monthValue);
        this.queryParams.endMonth = getMonthLastDay(this.queryParams.monthValue);
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/station/rpt_station_010_01_长益高速收费站车流量情况月报表.cpt',this.queryParams);
      }
    }
  }
</script>
