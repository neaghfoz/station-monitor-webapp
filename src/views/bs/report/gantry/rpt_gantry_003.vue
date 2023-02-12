<template>
  <div class="app-container" style="height: 100%">
    <el-card>
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" v-bind:style="{height: searchFormHeight}" size="small">
      <el-form-item ref="elRowAll" style="margin-bottom:0">
        <el-row>
          <el-form-item label="门架名称" label-width="120px">
            <ti-select style="width:180px" :clearable="true" url="api/v1/common/gantry/findListByAuth" :props="{key:'gantryId',value:'gantryId',label:'gantryText'}" :multiple="true" v-model="queryParams.gantryIds"/>
          </el-form-item>
          <el-form-item label="门架类型" label-width="80px" prop="virGantryFlag">
            <ti-select style="width:180px" v-model="queryParams.virGantryFlag" dict-type="tibms_bs_report_virGantryFlag"/>
          </el-form-item>
          <el-form-item label="承载门架类型" label-width="120px" prop="enExFlag">
            <ti-select style="width:180px" v-model="queryParams.enExFlag" dict-type="tibms_bs_report_enExFlag"/>
          </el-form-item>
          <el-form-item label="通行介质" label-width="80px" prop="mediaType">
            <ti-select style="width:180px" v-model="queryParams.mediaType" dict-type="tibms_bs_report_mediaType"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客货专类型" label-width="120px" prop="vehFlag">
            <ti-select style="width:180px" v-model="queryParams.vehFlag" dict-type="tibms_bs_report_vehFlag"/>
          </el-form-item>
          <el-form-item label="打印样式" label-width="80px" prop="statType">
            <ti-select style="width:180px" :clearable="false" v-model="queryParams.statType" dict-type="tibms_bs_report_statType"/>
          </el-form-item>
          <el-form-item label="统计日期" prop="tansDates" label-width="120px">
            <el-col :span="25">
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
            <ti-select style="width:100px" :clearable="false" v-model="queryParams.dateStatisticType" dict-type="tibms_bs_report_dateStatisticType"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="交易结果" label-width="80px" prop="tradeResult">
            <ti-select style="width:180px" v-model="queryParams.tradeResult" dict-type="tibms_bs_report_tradeResult"/>
          </el-form-item>
          <el-form-item class="searchItem" :label-width="'50px'">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form-item>

      <iframe v-bind:src="reportUrl" frameborder=0 border="0" style="overflow:auto;width: 100%;" v-bind:style="{height: iframeHeight}"></iframe>
    </el-form>
  </el-card>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import store from '@/store'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from "moment";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";
  import TiSysGantry from "@/views/pro/common/tiElement/tiSysGantry/tiSysGantry"

  export default {
    name: 'bs.report.gantry.rpt_gantry_003',
    components: {TiSelect, TiSelectTree, TiDateRange, tiSysOrg, TiDateRangeDivide, TiSysGantry},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        urlprefix: '/webroot/decision/view/report?viewlet=gantry/rpt_gantry_003_01_门架24小时车流量报表.cpt',
        queryParams: {
          reportCode: 'gantry_003',
          statType: 'subTotal',
          dateStatisticType: 'day',
          virGantryFlag: '',
          mediaType: '',
          vehFlag: '',
          tradeResult: '',
          startDay:  moment(new Date()).add(-1,'days').format('YYYY-MM-DD'),
          endDay:  moment(new Date()).add(-1,'days').format('YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          beginTime: '',
          endTime: '',
          collectDateStr: '',
          userName: store.getters.username,
          realName: store.getters.name,
          gantryIds: '',
          sysOrgIdStr: '',
          orgName: '',
          orgNo: '',
          _filename_: ''
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

        var filename;
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            if (this.queryParams.roadNo == '' || this.queryParams.roadNo == undefined) {
              this.queryParams.orgNo = 0;
              this.queryParams.orgName = '全部';
            }
            var dateTrans;
            if (this.queryParams.dateStatisticType === 'day') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startDay, this.queryParams.endDay, this.queryParams.dateStatisticType);
              filename = "门架24小时车流量报表日报表(拆分前)";
            } else if (this.queryParams.dateStatisticType === 'month') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startMonth, this.queryParams.endMonth, this.queryParams.dateStatisticType);
              filename = "门架24小时车流量报表月报表(拆分前)";
            } else if (this.queryParams.dateStatisticType === 'year') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
                this.queryParams.endYear, this.queryParams.dateStatisticType);
              filename = "门架24小时车流量报表年报表(拆分前)";
            }
            this.queryParams.beginTime = dateTrans.startDate;
            this.queryParams.endTime = dateTrans.endDate;
            this.queryParams.collectDateStr = dateTrans.collectDateStr;
            this.queryParams._filename_ = filename;


            // this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/gantry/rpt_gantry_001_01_分门架分车型车流量报表.cpt',this.queryParams);
            delete this.queryParams.params;
            this.reportUrl = fineReportUtil.getUrl(this.urlprefix, Object.assign(this.queryParams, {params: XEUtils.toJSONString(this.queryParams)}))
            console.log("queryParams:", this.queryParams);
            //更新查询统计次数
            // updateRptSearchTimes('rpt_gantry_001');
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      }
    }
  }
</script>

<style scoped>

</style>
