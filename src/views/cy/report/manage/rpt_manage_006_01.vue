<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
        <el-form-item label="日期" prop="dates">
          <el-col :span="30">
            <el-form-item>
              <el-form-item prop="countDate" v-show="false"/>
              <ti-date v-model="countDate" dateType="year" format="yyyy" value-format="yyyy"/>
              </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="车种" prop="freeVehicleClass">
          <ti-select :clearable="false" v-model="queryParams.freeVehicleClass":data-list="[{value:'1',name:'其它车种'}]"
                     :props="{key:'value',value:'value',label:'name'}"/>
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
    name: 'report.manage.rpt_manage_007',
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg,TiDate},
    mixins: [...mixin],
    data() {
      return {
        reportUrl:'',
        countDate:moment(new Date()).format('YYYY'),
        queryParams: {
          orgId: '',
          statType: 'subTotal',
          dateStatisticType: 'day',
          countDate: '',
          countYear:'',
          endDate: '',
          collectDateStr: moment(new Date()).format('YYYY-MM'),
          userName: '',
          realName: '',
          roadId: '',
          orgNo: '',
          orgName: '',
          sysOrgIdStr:'',
          freeVehicleClass:'1',
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
        this.queryParams.countYear = this.countDate;
        this.queryParams.countDate = this.countDate + '-01-01'

        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgName = sysOrg.name;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadId = userAuth.roadIdStr;
        this.queryParams.roadName = sysOrg.name;
        //this.queryParams.fileName = sysOrg.name + '-门架车流收入预算表-' + moment(new Date()).format('YYYY-MM-DD');
        this.queryParams.level = userAuth.level;
        this.queryParams.fileName =  '2021年预算表-' + moment(new Date()).format('YYYY-MM-DD');
        console.log("queryParams:", this.queryParams);
        // if(this.queryParams.roadId ==='S0060140430')
        // {
        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_1.cpt&op=write',
        //     this.queryParams);
        // }else if(this.queryParams.roadId ==='S0022340020')
        // {
        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_2.cpt&op=write',
        //     this.queryParams);
        // }else if(this.queryParams.roadId ==='G0018130020')
        // {
        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_3.cpt&op=write',
        //     this.queryParams);
        // }else if(this.queryParams.roadId ==='G0025130060'||this.queryParams.roadId ==='S0105130010')
        // {
        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_4.cpt&op=write',
        //     this.queryParams);
        // }else if(this.queryParams.roadId ==='G5513430010')
        // {
        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_5.cpt&op=write',
        //     this.queryParams);
        // }else if(this.queryParams.level === 0)
        // {

        //   this.reportUrl = fineReportUtil.getUrl(
        //     '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表_6.cpt&op=write',
        //     this.queryParams);
        // }

        this.reportUrl = fineReportUtil.getUrl(
            '/ReportServer?reportlet=report/manage/rpt_manage_006_01_门架车流收入预算表.cpt',
            this.queryParams);

        //更新查询统计次数
        // updateRptSearchTimes('rpt_manage_006_01');
      }
    }
  }
</script>

<style scoped>

</style>
