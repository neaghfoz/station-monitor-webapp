<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
       
        <el-form-item label="日期" prop="dates"> 
          <el-date-picker v-model="queryParams.startDate"
                    dateType="date" :clearable="false" 
                    format="yyyy-MM-dd" value-format="yyyy-MM-dd"/> 
        </el-form-item>  
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item> 

      <iframe v-bind:src="reportUrl" frameborder=0 border="0"
              style="overflow:auto;width: 100%;height:100%;min-height: 550px"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";  
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment' 

  export default {
    name: 'report.manage.rpt_manage_002',
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: { 
          startDate: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDate: dateUtil.getNextDate(new Date(), 'days', 0, 'YYYY-MM-DD'),
          spiterTable:'',
          fileName:''
        },
        expireTimeOption: {
          disabledDate(date) {
          return date.getTime() > Date.now(); 
          } 
        },
      }
    },
    created() {
      
    },
    computed: {
    },
    methods: {
      async getData() { 
        this.queryParams.spiterTable = '_'+this.queryParams.startDate.substring(0,4) + this.queryParams.startDate.substring(5,7);
        var std = new Date(this.queryParams.startDate);
        std.setDate(std.getDate()+1);
        this.queryParams.endDate = new moment(std).format("YYYY-MM-DD");
        this.queryParams.fileName = '门架自然日交易额汇总数据-' +  this.queryParams.startDate.split("-").join("");
        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/lujin/rpt_lujing_004_门架自然日交易额汇总数据.cpt',
          this.queryParams);  
      }
    }
  }
</script>

<style scoped>

</style>
