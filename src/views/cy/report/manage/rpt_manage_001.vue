<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
      <el-form-item label="日期" prop="collectDateStr">
        <ti-date v-model="queryParams.collectDateStr"
                 dateType="month" :clearable="false"
                 format="yyyy-MM" value-format="yyyy-MM"/>
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
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import {updateRptSearchTimes} from '@/views/pro/report/common/rptSearchTimes';
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.manage.rpt_manage_001',
    components: {TiSelectTree, TiSelect, tiSysOrg,TiDate},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          freeVehicleClass:'2',
          startDate: '',
          endDate: '',
          maxYear: '',
          collectDateStr: moment(new Date()).format('YYYY-MM'),
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
        dateTrans = dateUtil.collectTypeCombination(this.queryParams.collectDateStr,
          this.queryParams.collectDateStr, 'naturalDate','month');
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.maxYear = this.queryParams.collectDateStr.slice(0,4);
       // this.queryParams.collectDateStr = dateTrans.collectDateStr;
      //  this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days');
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        this.queryParams.fileName = sysOrg.name + '-三年日收入对比表-' + moment(new Date()).format('YYYY-MM-DD');
        //用户levelya
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        this.queryParams['__bypagesize__'] = 'false';

        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_001_01_三年日收入对比表.cpt&op=write',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_001_01_三年日收入对比表')

      }
    }
  }
</script>

<style scoped>

</style>
