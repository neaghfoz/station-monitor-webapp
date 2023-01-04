<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
        <el-form-item label="日期" prop="dates">
          <el-col :span="30">
            <el-form-item v-show="queryParams.dateStatisticType==='year'">
              <el-form-item prop="startYear" v-show="false"/>
              <el-form-item prop="endYear" v-show="false"/>
              <!-- <ti-date-range-divide ref="year" :editable="true" v-model="queryParams"
                                    date-type="year"
                                    format="yyyy" value-format="yyyy" begin-key="startYear"
                                    end-key="endYear"/> -->
              <el-date-picker ref="year" type="year" :editable="true" format="yyyy" value-format="yyyy" v-model="queryParams.startYear">
              </el-date-picker>
            </el-form-item>
          </el-col>
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
    name: 'report.manage.rpt_manage_013',
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg,TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          freeVehicleClass:'',
          statType: 'subTotal',
          dateStatisticType: 'year',
          collectType: 'naturalDate',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate: '',
          endDate: '',
          collectDateStr: '',
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
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay,
            this.queryParams.endDay, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.startYear, this.queryParams.dateStatisticType);
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.collectDateStr = dateTrans.startDate + '至' + dateTrans.endDate;
        this.queryParams.diffDays =  moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days')+1;
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        this.queryParams.fileName = sysOrg.name + '-实际拆分年报-' + moment(new Date()).format('YYYY-MM-DD');

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        console.log("userAuth:",userAuth);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_013_01_实际拆分年报.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_005');



      }
    }
  }
</script>

<style scoped>

</style>
