<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'"  v-bind:style="{height: searchFormHeight}">
      <el-form-item ref ="elRowAll" style="margin-bottom:0">
        <el-row>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <ti-sys-org style="width:180px" ref="sysOrg" v-model="queryParams.sysOrgIdStr"
                        url="api/v1/common/sysOrg/roadAndStationTree" default-first-value/>
          </el-form-item>
          <el-form-item label="统计类型" prop="statType">
            <ti-select style="width:180px" :clearable="false" v-model="queryParams.statType" dict-type="tibms_rpt_statType"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="日期" prop="dates">
            <el-col :span="30">
              <el-form-item v-show="queryParams.dateStatisticType==='day'">
                <el-form-item prop="startDay" v-show="false"/>
                <el-form-item prop="endDay" v-show="false"/>
                <ti-date-range date-style="width:470px" ref="dayRang" :editable="false" v-model="queryParams" date-type="daterange"
                               format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                               end-key="endDay"/>
              </el-form-item>
              <el-form-item v-show="queryParams.dateStatisticType==='month'">
                <el-form-item prop="startMonth" v-show="false"/>
                <el-form-item prop="endMonth" v-show="false"/>
                <ti-date-range date-style="width:470px" ref="monthRang" :editable="false" v-model="queryParams" date-type="monthrange"
                               format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                               end-key="endMonth"/>
              </el-form-item>
              <!--              <el-form-item v-show="queryParams.dateStatisticType==='year'">-->
              <!--                <el-form-item prop="startYear" v-show="false"/>-->
              <!--                <el-form-item prop="endYear" v-show="false"/>-->
              <!--                <ti-date-range ref="yearRang" :editable="false"-->
              <!--                               v-model="queryParams"-->
              <!--                               date-type="yearRang"-->
              <!--                               format="yyyy" value-format="yyyy" begin-key="startYear"-->
              <!--                               end-key="endYear"/>-->
              <!--              </el-form-item>-->
              <el-form-item v-show="queryParams.dateStatisticType==='year'">
                <el-form-item prop="startYear" v-show="false"/>
                <el-form-item prop="endYear" v-show="false"/>
                <ti-date-range-divide date-style="width:200px" ref="year" :editable="false" v-model="queryParams"
                                      date-type="year"
                                      format="yyyy" value-format="yyyy" begin-key="startYear"
                                      end-key="endYear"/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="dateStatisticType">
            <ti-select style="width:180px" :clearable="false" v-model="queryParams.dateStatisticType"
                       dict-type="tibms_rpt_dateStatisticType"/>
          </el-form-item>
          <el-form-item prop="dateType">
            <ti-select style="width:180px" :clearable="false" v-model="queryParams.collectType" dict-type="tibms_rpt_collectType"/>
          </el-form-item>
          <el-form-item class="searchItem" :label-width="'50px'">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form-item>
      <iframe v-bind:src="reportUrl" frameborder=0 border="0"
              style="overflow:auto;width: 100%;" v-bind:style="{height: iframeHeight}"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import store from '@/store'
  import {updateRptSearchTimes} from "@/views/pro/report/common/rptSearchTimes";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import moment from "moment";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";


  export default {
    name: 'report.special.rpt_special_003',
    components: {TiSelect, TiSelectTree, TiDateRange,tiSysOrg,TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          statType: 'subTotal',
          dateStatisticType: 'day',
          collectType: 'squadDate',
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
          _filename_:''
        },
        searchFormHeight: '100%',
        iframeHeight: '100%',
      }
    },
    created() {
      this.queryParams.userName = store.getters.username;
      this.queryParams.realName = store.getters.name;
    },
    mounted() {
      //获取显示高度
      const deviceHeight = document.documentElement.clientHeight;

      // 获取查询条件高度
      //let children = this.$refs.containerAll.$el.children;
      var elRowHeiht = this.$refs.elRowAll.$el.offsetHeight;

      // searchForm 减去标题高度
      this.searchFormHeight = (Number(deviceHeight)-125) + 'px'
      // iframe 还要减去查询条件高度
      this.iframeHeight = (Number(deviceHeight)-125 -elRowHeiht) + 'px';
    },
    methods: {
      async getData() {
        var dateTrans;
        var filename;
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startDay,
            this.queryParams.endDay, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          filename = "节假日入口车流量日报表";
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.collectType,
            this.queryParams.dateStatisticType);
          filename = "节假日入口车流量月报表";
        }else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
          filename = "节假日入口车流量年报表";
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.collectDateStr = dateTrans.collectDateStr;

        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        console.log("userAuth:",userAuth);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        this.queryParams._filename_ = filename;

        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/special/rpt_special_003_01_节假日入口车流量报表.cpt',
          this.queryParams);

        //更新查询统计次数
        updateRptSearchTimes('rpt_special_003');


      }
    }
  }
</script>

<style scoped>

</style>
