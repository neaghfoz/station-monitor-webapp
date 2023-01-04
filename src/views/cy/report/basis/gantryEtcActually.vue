<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="门架" prop="gantryIdStr">
        <ti-sys-gantry @change="change" :multiple="true" :show-all="true" v-model="queryParams.gantryIdStr"/>
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
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import {getOrgNo, getOrgTreeData} from "@/views/pro/common/util/dataUtil";
  import moment from "moment";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";
  import TiSysGantry from "@/views/cy/common/tiSysGantry/tiSysGantry"

  export default {
    name: 'report.basis.gantryEtcActually',
    components: {TiSelect,TiSelectTree,TiDateRange,tiSysOrg,TiDateRangeDivide,TiSysGantry},
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
          gantryIdStr: '',
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
      roadChange(val,road){
        this.queryParams.roadNo = road.roadNo
        this.queryParams.orgName = road.roadName
        this.queryParams.orgNo = road.roadNo
      },

      async getData() {
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            if(this.queryParams.roadNo == '' || this.queryParams.roadNo == undefined){
              this.queryParams.orgNo = 0;
              this.queryParams.orgName = '全部';
            }

            this.queryParams.fileName = '门架ETC实得';
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
            if(this.queryParams.gantryIdStr == '' || this.queryParams.gantryIdStr == undefined) {
              this.queryParams.gantryIdStrArray = '0';
            } else {
              this.queryParams.gantryIdStrArray = this.queryParams.gantryIdStr;
            }
            var fileNameDate = moment(new Date).format('YYYYMMDD');
            this.queryParams.excelName = this.queryParams.fileName+fileNameDate;

            this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/basis/门架ETC实得.cpt',this.queryParams);
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
