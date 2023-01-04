<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "4"/>
      </el-form-item>

      <el-form-item label="日期" prop="dateStatisticType">
        <ti-select v-model="queryParams.dateStatisticType"
                   :clearable="false"
                   dict-type="tibms_rpt_dateStatisticType"/>

      </el-form-item>
      <el-form-item prop="dates">
        <el-col :span="30">
          <el-form-item v-show="queryParams.dateStatisticType==='day'">
            <el-form-item prop="startDay" v-show="false"/>
            <el-form-item prop="endDay" v-show="false"/>
            <ti-date-range date-style="width:293px" ref="dayRang" :editable="false"
                           dateRule="oneMonth"
                           v-model="queryParams"
                           date-type="daterange"
                           format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                           end-key="endDay"/>
          </el-form-item>
          <el-form-item v-show="queryParams.dateStatisticType==='month'">
            <ti-date v-model="queryParams.collectDateStr"
                     dateType="month" :clearable="false"
                     format="yyyy-MM" value-format="yyyy-MM"/>
          </el-form-item>
          <el-form-item v-show="queryParams.dateStatisticType==='year'">
            <ti-date v-model="queryParams.yearDateStr"
                     dateType="year" :clearable="false"
                     format="yyyy" value-format="yyyy"/>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>

      <iframe v-bind:src="reportUrl" frameborder=0 border="0"
              style="overflow:auto;width: 100%;height:100%;min-height: 450px"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import {updateRptSearchTimes} from '@/views/pro/report/common/rptSearchTimes';
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";



  export default {
    name: 'report.charge.rpt_charge_015',
    components: {TiSelectTree, TiSelect, tiSysOrg,TiDate,TiDateRange},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          freeVehicleClass:'2',
          dateStatisticType:'day',
          startDay:'',
          endDay:'',
          startDate: '',
          endDate: '',
          curYearDate: '',
          collectDateStr: moment(new Date()).format('YYYY-MM'),
          yearDateStr: moment(new Date()).format('YYYY'),
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
        if(this.queryParams.dateStatisticType==='day') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
        }else if(this.queryParams.dateStatisticType==='month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.collectDateStr, this.queryParams.collectDateStr, 'naturalDate',this.queryParams.dateStatisticType);
        }else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.yearDateStr, this.queryParams.yearDateStr, 'naturalDate',this.queryParams.dateStatisticType);
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.collectDateStr = dateTrans.collectDateStr;
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        console.log("queryParams:",this.queryParams.startDate,this.queryParams.endDate);
        this.queryParams.fileName = '湖南省高速公路通行费收入分项统计表';
        //用户levelya
        if(sysOrg.nodeLevel = '4' && sysOrg.stationId!='0'){
          this.queryParams.stationId = sysOrg.stationId
        }else{
          this.queryParams.stationId = '0';
        }
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/charge/rpt_charge_015_01_湖南省高速公路通行费收入分项统计表.cpt&__bypagesize__=false',
          this.queryParams);

      }
    }
  }
</script>

<style scoped>

</style>
