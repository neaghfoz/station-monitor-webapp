<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
        <el-form-item label="日期" prop="dates">
          <el-col :span="30">
            <el-form-item prop="dateStatisticType">
              <!--<ti-select :clearable="false" v-model="queryParams.dateStatisticType"-->
              <!--dict-type="tibms_rpt_dateStatisticType"/>-->
              <ti-select :clearable="false" v-model="queryParams.dateStatisticType"
                         :data-list="[{value:'day',name:'日'},{value:'week',name:'周'},{value:'month',name:'月'}]"
                         :props="{key:'value',value:'value',label:'name'}"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='day'">
              <ti-date v-model="queryParams.dayStr"
                       dateType="date" :clearable="false"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='week'">
              <ti-date v-model="queryParams.weekMonth"
                       dateType="month"
                       format="yyyy-MM" value-format="yyyy-MM"/>
              <ti-select :clearable="false" v-model="queryParams.weekStr"
                         :data-list="[{value:'1',name:'第1周'},{value:'2',name:'第2周'},{value:'3',name:'第3周'},{value:'4',name:'第4周'}]"
                         :props="{key:'value',value:'value',label:'name'}"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='month'">
              <ti-date v-model="queryParams.monthStr"
                       dateType="month" :clearable="false"
                       format="yyyy-MM" value-format="yyyy-MM"/>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-row>
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
    name: 'report.manage.rpt_manage_014',
    components: {TiSelectTree, TiSelect, TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          freeVehicleClass:'2',
          dateStatisticType: 'day',
          dayStr: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          weekMonth: moment(new Date()).format('YYYY-MM'),
          weekStr: '1',
          monthStr: moment(new Date()).format('YYYY-MM'),
          startDate: '',
          endDate: '',
          collectDateStr: '',
          totalDays:'',
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
       //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.dayStr,
            this.queryParams.dayStr, 'naturalDate',this.queryParams.dateStatisticType);
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.fileName = sysOrg.name + '-车流量收入日报-' + moment(new Date()).format('YYYY-MM-DD');

        } else if (this.queryParams.dateStatisticType === 'week') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.weekMonth,
            this.queryParams.weekMonth, 'naturalDate','month');
          let startWeek = (this.queryParams.weekStr-1)*7;
          this.queryParams.startDate =  dateUtil.getNextDate(dateTrans.startDate, 'days', -startWeek, 'YYYY-MM-DD');
          if(this.queryParams.weekStr === '4'){
            this.queryParams.endDate = dateTrans.endDate;
          } else {
            let endWeek = (this.queryParams.weekStr)*7-1;
            this.queryParams.endDate = dateUtil.getNextDate(dateTrans.startDate, 'days', -endWeek, 'YYYY-MM-DD');
          }
          this.queryParams.fileName = sysOrg.name + '-车流量收入周报-' + moment(new Date()).format('YYYY-MM-DD');
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.monthStr,
            this.queryParams.monthStr, 'naturalDate',this.queryParams.dateStatisticType);
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.fileName = sysOrg.name + '-车流量收入月报-' + moment(new Date()).format('YYYY-MM-DD');
        }
        this.queryParams.collectDateStr = this.queryParams.startDate + '至' + this.queryParams.endDate;
        this.queryParams.totalDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days')+1;

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_014_01_车流量收入周-月报.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_014');



      }
    }
  }
</script>

<style scoped>

</style>
