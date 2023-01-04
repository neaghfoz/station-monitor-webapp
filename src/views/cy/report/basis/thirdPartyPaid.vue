<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
      </el-form-item>

      <el-form-item label="日期" prop="dates">
        <ti-date-range ref="dateRang" :editable="false" v-model="queryParams" date-type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" begin-key="startDate" end-key="endDate"/>
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
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment';
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"

  export default {
    name: 'report.basis.thirdPartyPaid',
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          startDate: new Date(),
          endDate: new Date(),
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: '',
          fileName: '',
          excelName: ''
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
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;

        this.queryParams.fileName = '第三方支付实收';
        if(this.queryParams.startDate == "") {
          this.queryParams.startDate = "";
        } else {
          this.queryParams.startDate = moment(this.queryParams.startDate).format('YYYY-MM-DD HH:mm:ss');
        }
        if(this.queryParams.endDate == "") {
          this.queryParams.endDate = "";
        } else {
          this.queryParams.endDate = moment(this.queryParams.endDate).format('YYYY-MM-DD HH:mm:ss');
        }
        if(this.queryParams.roadIdStr == '' || this.queryParams.roadIdStr == undefined) {
          this.queryParams.roadIdStr = '0';
        } else {
          this.queryParams.roadIdStr = this.queryParams.roadIdStr;
        }
        if(this.queryParams.stationIdStr == '' || this.queryParams.stationIdStr == undefined) {
          this.queryParams.stationIdStr = '0';
        } else {
          this.queryParams.stationIdStr = this.queryParams.stationIdStr;
        }
        var fileNameDate = moment(new Date).format('YYYYMMDD');
        this.queryParams.excelName = this.queryParams.fileName+fileNameDate;

        this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/basis/第三方支付实收.cpt',this.queryParams);
      }
    }
  }
</script>

<style scoped>

</style>
