<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
      <el-row>
        <el-form-item label="统计日期" prop="dates">
          <el-col :span="30">
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
              <ti-date-range ref="monthRang" :editable="false" v-model="queryParams"
                             date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="dateStatisticType">
          <ti-select :clearable="false" v-model="queryParams.dateStatisticType"
                     dict-type="tibms_audit_dateStatisticType"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-row>

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
    name: 'report.manage.rpt_manage_016',
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          dateStatisticType: 'month',
          collectType: 'naturalDate',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startDate: '',
          endDate: '',
          collectDateStr: '',
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: ''

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
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay,
            this.queryParams.endDay, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          this.queryParams.fileName = sysOrg.name + '-门架流量表日报-' + moment(new Date()).format('YYYY-MM-DD');


        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          this.queryParams.fileName = sysOrg.name + '-门架流量表月报-' + moment(new Date()).format('YYYY-MM-DD');
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.collectDateStr = dateTrans.collectDateStr;

        this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days') + 1;

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        console.log("userAuth:",userAuth);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_016_01_门架标准流量表.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_002');



      }
    }
  }
</script>

<style scoped>

</style>
