<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "4"/>
      </el-form-item>
        <el-form-item label="日期" prop="dates">
          <el-col :span="30">
            <el-form-item>
              <el-form-item prop="countDate" v-show="false"/>
              <ti-date v-model="countDate" :clearable="false"
               dateType="year" format="yyyy" value-format="yyyy"/>
              </el-form-item>
          </el-col>
        </el-form-item> 
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      <iframe v-bind:src="reportUrl" frameborder=0 border="0"
              style="overflow:auto;width: 100%;height:100%;min-height: 450px"></iframe>
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
    name: 'report.manage.rpt_station_002',
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
          fileName:'',
          stationId:''
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

        if(sysOrg.nodeLevel = '4' && sysOrg.stationId!='0'){
          this.queryParams.stationId = sysOrg.stationId
        }else{
          this.queryParams.stationId = '';
        }

        this.queryParams.fileName =  '长益高速收费站通行费收入月报表';
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/station/rpt_station_002_01_长益高速收费站通行费收入月报表.cpt&__bypagesize__=false',
          this.queryParams);


        //更新查询统计次数
        // updateRptSearchTimes('rpt_manage_006_01');
      }
    }
  }
</script>

<style scoped>

</style>
