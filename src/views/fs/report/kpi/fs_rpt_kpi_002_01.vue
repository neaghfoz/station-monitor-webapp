<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" v-bind:style="{height: searchFormHeight}">
      <el-form-item ref ="elRowAll" style="margin-bottom:0">
        <el-form-item label="管理中心" prop="serviceOrgId">
          <mgr-select :clearable="false" style="width:160px" ref="serviceOrgId" v-model="queryParams.serviceOrgId"  :defaultFirstValue="true" :required="true"/>
        </el-form-item>
        <el-form-item label="年份" prop="dates">
          <ti-date v-model="queryParams.yearStr" :required="true"
                   dateType="year" :clearable="false"
                   format="yyyy" value-format="yyyy"/>
          <ti-select :clearable="false" v-model="queryParams.quarterStr" ref="quarterStr"
                     :data-list="[{value:'1',name:'第一季度'},{value:'2',name:'第二季度'},{value:'3',name:'第三季度'},{value:'4',name:'第四季度'}]"
                     :props="{key:'value',value:'value',label:'name'}"/>
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
    name: 'report.kpi.fs_rpt_kpi_002_01',
    components: {TiSelect, TiSelectTree,MgrSelect,tiSysOrg,TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          serviceOrgId: '',
          yearStr: moment(new Date()).format('YYYY'),
          quarterStr: '1',
          startMonth: '',
          endMonth: '',
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

        console.log("quarterStr.getObj:", this.$refs.quarterStr.getObj());

        if (this.queryParams.quarterStr === '1') {
          this.queryParams.startMonth = this.queryParams.yearStr+'-01-01';
          this.queryParams.endMonth = this.queryParams.yearStr+'-03-01';
        } else if (this.queryParams.quarterStr === '2') {
          this.queryParams.startMonth = this.queryParams.yearStr+'-04-01';
          this.queryParams.endMonth = this.queryParams.yearStr+'-06-01';
        } else if (this.queryParams.quarterStr === '3') {
          this.queryParams.startMonth = this.queryParams.yearStr+'-07-01';
          this.queryParams.endMonth = this.queryParams.yearStr+'-09-01';
        } else if (this.queryParams.quarterStr === '4') {
          this.queryParams.startMonth = this.queryParams.yearStr+'-10-01';
          this.queryParams.endMonth = this.queryParams.yearStr+'-12-01';
        }

        this.queryParams.serviceOrgName = this.$refs.serviceOrgId.getObj().centerName;
        this.queryParams._filename_ = "季度考核报表";
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/kpi/fs_rpt_kpi_002_01_季度考核报表.cpt',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('fs_rpt_kpi_002_01_季度考核报表');


      }
    }
  }
</script>

<style scoped>

</style>
