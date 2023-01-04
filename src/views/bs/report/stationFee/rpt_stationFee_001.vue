<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'"
             v-bind:style="{height: searchFormHeight}">
      <el-form-item ref="elRowAll" style="margin-bottom:0">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org style="width:180px" ref="sysOrg" v-model="queryParams.sysOrgIdStr"
                      url="api/v1/common/sysOrg/roadAndStationTree" default-first-value/>
        </el-form-item>
        <el-form-item label="出入口类型" prop="inOutType">
          <ti-select style="width:180px" v-model="queryParams.inOutType" dict-type="tibms_bs_report_inOutType"/>
        </el-form-item>
        <el-form-item label="车道类型" prop="laneTypeStr">
          <ti-select style="width:180px" v-model="queryParams.laneTypeStr" dict-type="tibms_bs_report_laneTypeStr" multiple/>
        </el-form-item>
        <el-form-item label="统计类型" prop="statType">
          <ti-select style="width:180px" v-model="queryParams.statType" dict-type="tibms_bs_report_statType"/>
        </el-form-item>
        <el-form-item label="工班" prop="shiftIdStr" >
          <ti-select v-model="queryParams.shiftIdStr" url="api/v1/common/squad/list" :disabled="queryParams.collectType !='squadDate'"
                     :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" multiple />
        </el-form-item>
        <el-form-item label="统计日期" prop="tansDates">
          <el-col :span="25">
            <el-form-item v-show="queryParams.dateStatisticType==='day'">
              <el-form-item prop="startDay" v-show="false"/>
              <el-form-item prop="endDay" v-show="false"/>
              <ti-date-range date-style="width:470px" ref="dayRang" :editable="false" v-model="queryParams"
                             date-type="daterange"
                             format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                             end-key="endDay"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='month'">
              <el-form-item prop="startMonth" v-show="false"/>
              <el-form-item prop="endMonth" v-show="false"/>
              <ti-date-range date-style="width:470px" ref="monthRang" :editable="false" v-model="queryParams"
                             date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='year'">
              <el-form-item prop="startYear" v-show="false"/>
              <el-form-item prop="endYear" v-show="false"/>
              <ti-date-range-divide date-style="width:235px" ref="year" :editable="false" v-model="queryParams"
                                    date-type="year"
                                    format="yyyy" value-format="yyyy" begin-key="startYear"
                                    end-key="endYear"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="dateStatisticType">
          <ti-select style="width:100px" :clearable="false" v-model="queryParams.dateStatisticType"
                     dict-type="tibms_bs_report_dateStatisticType"/>
        </el-form-item>

        <el-form-item prop="collectType">
          <ti-select style="width:180px" :clearable="false" v-model="queryParams.collectType"
                     dict-type="tibms_bs_report_collectType"/>
        </el-form-item>
        <el-form-item label="通行类型" prop="listType">
          <ti-select style="width:180px" v-model="queryParams.listType"
                     dict-type="tibms_bs_report_listType"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form-item>

      <iframe v-bind:src="reportUrl" frameborder=0 border="0" style="overflow:auto;width: 100%;"
              v-bind:style="{height: iframeHeight}"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import store from '@/store'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from "moment";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";

  export default {
    name: 'bs.report.stationFee.rpt_stationFee_001',
    components: {TiSelect, TiDateRange, tiSysOrg, TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        urlprefix: '/webroot/decision/view/report?viewlet=stationFee/rpt_stationFee_001_01_分站分车型通行费报表(拆分前).cpt',
        queryParams: {
          reportCode: 'stationFee_001',
          inOutType: '2',
          statType: 'subTotal',
          dateStatisticType: 'day',
          collectType: 'squadDate',
          listType: '',
          shiftIdStr: '',
          laneType: '',
          startDay: moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'),
          endDay: moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          beginTime: '',
          endTime: '',
          userName: store.getters.username,
          realName: store.getters.name,
          sysOrgIdStr: '',
          orgName: '',
          orgNo: '',
          _filename_: '',
        },
        searchFormHeight: '100%',
        iframeHeight: '100%',
      }

    },
    created() {

    },
    mounted() {
      //获取显示高度
      const deviceHeight = document.documentElement.clientHeight;

      // 获取查询条件高度
      //let children = this.$refs.containerAll.$el.children;
      var elRowHeiht = this.$refs.elRowAll.$el.offsetHeight;

      // searchForm 减去标题高度
      this.searchFormHeight = (Number(deviceHeight) - 125) + 'px'
      // iframe 还要减去查询条件高度
      this.iframeHeight = (Number(deviceHeight) - 125 - elRowHeiht) + 'px';
    },
    methods: {
      getData() {
        let dateTrans;
        let filename;
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startDay, this.queryParams.endDay, this.queryParams.dateStatisticType);
          filename = "分站分车型通行费日报表(拆分前)";
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startMonth, this.queryParams.endMonth, this.queryParams.dateStatisticType);
          filename = "分站分车型通行费月报表(拆分前)";
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
          filename = "分站分车型通行费年报表(拆分前)";
        }
        this.queryParams.beginTime = dateTrans.startDate;
        this.queryParams.endTime = dateTrans.endDate;
        this.queryParams.collectDateStr = dateTrans.collectDateStr;
        this.queryParams._filename_ = filename;

        delete this.queryParams.params;
        this.reportUrl = fineReportUtil.getUrl(this.urlprefix, Object.assign(this.queryParams, {params: XEUtils.toJSONString(this.queryParams)}))
      }
    }
  }
</script>

<style scoped>

</style>
