<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
      </el-form-item>
      <el-form-item label="工班日期" prop="dates">
        <ti-date v-model="queryParams.dayStr"
                 dateType="date" :clearable="false"
                 format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
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
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.common.sx_rpt_common_008',
    components: {TiSelectTree, TiSelect, TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          collectType: 'squadDate',
          dayStr: moment(new Date()).format('YYYY-MM-DD'),
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
    computed: {},
    methods: {
      async getData() {
        var dateTrans;
        dateTrans = dateUtil.collectTypeCombination(this.queryParams.dayStr,
          this.queryParams.dayStr, this.queryParams.collectType, 'day');
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.collectDateStr = "工班日期：" + this.queryParams.dayStr;
        this.queryParams.diffDays = moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days');
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        console.log("this.$store.getters.userInfo:", this.$store.getters.userInfo)
        console.log("queryParams:", this.queryParams)
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/common/sx_rpt_common_008_01_值班时长报表.cpt&__filename__=值班时长报表'+XEUtils.toDateString(new Date(), 'yyyyMMddmmddss'),
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('sx_rpt_common_008_01_值班时长报表');

      }
    }
  }

</script>

<style scoped>

</style>
