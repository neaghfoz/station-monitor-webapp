<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" v-bind:style="{height: searchFormHeight}">
      <el-form-item ref ="elRowAll" style="margin-bottom:0">
        <el-form-item label="管理中心" prop="serviceOrgId">
          <mgr-select :clearable="false" style="width:160px" ref="serviceOrgId"  v-model="queryParams.serviceOrgId" :defaultFirstValue="true" :required="true"/>
        </el-form-item>
        <el-form-item label="月份" prop="monthStr">
          <ti-date v-model="queryParams.monthStr" :required="true"
                   dateType="month" :clearable="false"
                   format="yyyy-MM" value-format="yyyy-MM"/>
        </el-form-item>
        <el-form-item label="绩效类型" prop="scoreType">
          <ti-select style="width: 150px;" v-model="queryParams.scoreType"
                     :data-list="[{value:'1',name:'加分'},{value:'2',name:'扣分'}]"
                     :props="{key:'value',value:'value',label:'name'}"
                     :multiple="false"
                     :clearable="false"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
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
  import store from '@/store'
  import {updateRptSearchTimes} from "@/views/pro/report/common/rptSearchTimes";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import moment from "moment";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import reportUtil from "@/views/pro/report/common/reportUtil"
  import MgrSelect from "@/views/fs/kpi/common/mgrSelect/mgrSelect"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'report.kpi.fs_rpt_kpi_004_01',
    components: {TiSelect, TiSelectTree,MgrSelect,tiSysOrg,TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          serviceOrgId: '',
          monthStr: moment(new Date()).format('YYYY-MM'),
          startMonth: '',
          endMonth: '',
          scoreType:'1',
          userName: '',
          realName: '',
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

        this.queryParams.startMonth = this.queryParams.monthStr+'-01';
        this.queryParams.endMonth = this.queryParams.monthStr+'-01';

        this.queryParams.serviceOrgName = this.$refs.serviceOrgId.getObj().centerName;
        this.queryParams._filename_ = "绩效考核汇总明细表";
        console.log("getDefaultFirstValue:", this.$refs.serviceOrgId.getDefaultFirstValue().id);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/kpi/fs_rpt_kpi_004_01_绩效考核汇总明细表.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('fs_rpt_kpi_004_01_绩效考核汇总明细表');


      }
    }
  }
</script>

<style scoped>

</style>
