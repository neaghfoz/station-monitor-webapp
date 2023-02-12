<template>
  <div class="app-container" style="height: 100%">
    <el-card>
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" size="small">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
        </el-form-item>
        <el-form-item label="统计类型" prop="dateStatisticType">
          <ti-select :clearable="false" v-model="queryParams.dateStatisticType" dict-type="tibms_rpt_datetype"/>
        </el-form-item>
        <el-form-item label="工班日期" prop="dates">
          <el-form-item v-show="queryParams.dateStatisticType==='day'">
            <el-form-item prop="startDay" v-show="false"/>
            <el-form-item prop="endDay" v-show="false"/>
            <ti-date-range ref="dayRang" :editable="false" v-model="queryParams"
                          date-type="daterange"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                          end-key="endDay"/>
          </el-form-item>

          <el-form-item v-show="queryParams.dateStatisticType==='period'">
            <ti-date v-model="queryParams.periodMonth"
                    dateType="month"
                    format="yyyy-MM" value-format="yyyy-MM"/>
            <ti-select :clearable="false" v-model="queryParams.periodStr"
                      :data-list="[{value:'1',name:'上旬'},{value:'2',name:'中旬'},{value:'3',name:'下旬'}]"
                      :props="{key:'value',value:'value',label:'name'}"/>
          </el-form-item>
          <el-form-item v-show="queryParams.dateStatisticType==='month'">
            <ti-date v-model="queryParams.startMonth"
                    dateType="month"
                    format="yyyy-MM" value-format="yyyy-MM"/>
          </el-form-item>

          <el-form-item v-show="queryParams.dateStatisticType==='quarter'">
            <ti-date v-model="queryParams.quarterMonth"
                    dateType="year"
                    format="yyyy" value-format="yyyy"/>
            <ti-select :clearable="false" v-model="queryParams.quarterStr"
                      :data-list="[{value:'1',name:'第1季度'},{value:'2',name:'第2季度'},{value:'3',name:'第3季度'},{value:'4',name:'第4季度'}]"
                      :props="{key:'value',value:'value',label:'name'}"/>
          </el-form-item>

          <el-form-item v-show="queryParams.dateStatisticType==='year'">
            <el-form-item prop="startYear" v-show="false"/>
            <el-form-item prop="endYear" v-show="false"/>
            <ti-date-range-divide ref="year" :editable="false" v-model="queryParams"
                                  date-type="year"
                                  format="yyyy" value-format="yyyy" begin-key="startYear"
                                  end-key="endYear"/>
          </el-form-item>
        </el-form-item>

        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>

        <iframe v-bind:src="reportUrl" frameborder=0 border="0"
                style="overflow:auto;width: 100%;height:100%;min-height: 850px"></iframe>
      </el-form>
    </el-card>
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
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";

  export default {
    name: 'report.analyse.sx_rpt_analyse_003',
    components: {TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg, TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          dateStatisticType: 'day',
          statisticTypes:'',
          collectType: 'squadDate',
          periodMonth: moment(new Date()).format('YYYY-MM'),
          quarterMonth: moment(new Date()).format('YYYY'),
          quarterStartMonth: moment(new Date()).format('YYYY-MM'),
          quarterEndMonth: moment(new Date()).format('YYYY-MM'),
          periodStr: '1',
          quarterStr: '1',
          periodStartDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          periodEndDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
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
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay,
            this.queryParams.endDay, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.statisticTypes = '日报';
        } else if (this.queryParams.dateStatisticType === 'period') {
          if (this.queryParams.periodStr === '1') {
            this.queryParams.periodStartDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', 0, 'YYYY-MM-DD');
            this.queryParams.periodEndDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', -9, 'YYYY-MM-DD');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.periodStartDay,
              this.queryParams.periodEndDay, 'squadDate', 'day');

          } else if (this.queryParams.periodStr === '2') {
            this.queryParams.periodStartDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', -10, 'YYYY-MM-DD');
            this.queryParams.periodEndDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', -19, 'YYYY-MM-DD');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.periodStartDay,
              this.queryParams.periodEndDay, 'squadDate', 'day');
          } else if (this.queryParams.periodStr === '3') {
            let  mm = this.queryParams.periodMonth.split('-');
            let monthdays = new Date(mm[0],mm[1],0).getDate()-1;
            this.queryParams.periodStartDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', -20, 'YYYY-MM-DD');
            this.queryParams.periodEndDay = dateUtil.getNextDate(this.queryParams.periodMonth, 'days', -monthdays, 'YYYY-MM-DD');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.periodStartDay,
              this.queryParams.periodEndDay, 'squadDate', 'day');
          }
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.statisticTypes = '旬报';
        }else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.statisticTypes = '月报';
        } else if (this.queryParams.dateStatisticType === 'quarter') {
          if (this.queryParams.quarterStr === '1') {
            this.queryParams.quarterEndMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -2, 'YYYY-MM');
            this.queryParams.quarterStartMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', 0, 'YYYY-MM');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.quarterStartMonth,
              this.queryParams.quarterEndMonth, 'squadDate', 'month');

          } else if (this.queryParams.quarterStr === '2') {
            this.queryParams.quarterEndMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -5, 'YYYY-MM');
            this.queryParams.quarterStartMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -3, 'YYYY-MM');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.quarterStartMonth,
              this.queryParams.quarterEndMonth, 'squadDate', 'month');
          } else if (this.queryParams.quarterStr === '3') {
            this.queryParams.quarterEndMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -8, 'YYYY-MM');
            this.queryParams.quarterStartMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -6, 'YYYY-MM');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.quarterStartMonth,
              this.queryParams.quarterEndMonth, 'squadDate', 'month');
          } else if (this.queryParams.quarterStr === '4') {
            this.queryParams.quarterEndMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -11, 'YYYY-MM');
            this.queryParams.quarterStartMonth = dateUtil.getNextDate(this.queryParams.quarterMonth, 'months', -9, 'YYYY-MM');
            dateTrans = dateUtil.collectTypeCombination(this.queryParams.quarterStartMonth,
              this.queryParams.quarterEndMonth, 'squadDate', 'month');
          }
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.statisticTypes = '季报';
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.statisticTypes = '年报';
        }

        this.queryParams.collectDateStr = dateTrans.collectDateStr;
        this.queryParams.diffDays = moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days');
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        console.log("userAuth:", userAuth);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/analyse/sx_rpt_analyse_003_01_入口运营分析报表.cpt&__filename__=入口运营分析报表'+XEUtils.toDateString(new Date(), 'yyyyMMddmmddss'),
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_002');


      }
    }
  }

</script>

<style scoped>

</style>
