<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level = "2"/>
      </el-form-item>
      <el-form-item label="开始日期" prop="years">
        <el-col :span="30">
          <el-form-item>
            <el-date-picker
              v-model="queryParams.beginDate"
              size="mini"
              format="yyyy-MM"
              :picker-options="pickerOptionsStart"
              type="month"
              @change='changeBeginTime'
            ></el-date-picker>
            <ti-select :clearable="false" v-model="queryParams.weekStr"
                       :data-list="[{value:'1',name:'第1周'},{value:'2',name:'第2周'},{value:'3',name:'第3周'},{value:'4',name:'第4周'}]"
                       :props="{key:'value',value:'value',label:'name'}"/>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="结束日期" prop="years">
        <el-col :span="30">
          <el-form-item>
            <el-date-picker
              v-model="queryParams.endDates"
              size="mini"
              format="yyyy-MM"
              :picker-options="pickerOptionsEnd"
              type="month"
              @change='changeEndTime'
            ></el-date-picker>
            <ti-select :clearable="false" v-model="queryParams.weekStr1"
                       :data-list="[{value:'1',name:'第1周'},{value:'2',name:'第2周'},{value:'3',name:'第3周'},{value:'4',name:'第4周'}]"
                       :props="{key:'value',value:'value',label:'name'}"/>
          </el-form-item>
        </el-col>
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
    name: 'report.manage.rpt_manage_011',
    components: {TiSelectTree, TiSelect, TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        pickerOptionsStart:{},
        pickerOptionsEnd:{},
        queryParams: {
          orgId: '',
          yearStr: moment(new Date()).format('YYYY'),
          startDate: '',
          startMonth:'',
          endMonth:'',
          endDate: '',
          beginDate:moment(new Date()).startOf("year").format("YYYY-MM"),
          endDates:moment(new Date()).format("YYYY-MM"),
          weekStr:'1',
          weekStr1:Math.ceil(new Date().getDate()/7)>4?'4':Math.ceil(new Date().getDate()/7).toString(),
          collectDateStr: '',
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: '',
          fileName:''
        }
      }
    },
    created() {
      this.queryParams.userName = store.getters.username;
      this.queryParams.realName = store.getters.name;
      this.pickerOptionsStart= {
        disabledDate: time => {
          if (this.queryParams.endDates) {
            return(
              time > new Date(this.queryParams.endDates)||time.getFullYear()!=new Date(this.queryParams.endDates).getFullYear()


            )
          }
        }
      };
      this.pickerOptionsEnd= {
        disabledDate: time => {
          if (this.queryParams.beginDate) {
            return time < new Date(this.queryParams.beginDate)
              ||time.getFullYear()!=new Date(this.queryParams.beginDate).getFullYear()
          }
        }
      };
    },
    computed: {
    },
    methods: {
      async getData() {
        var dateTrans;
        dateTrans = dateUtil.collectTypeCombination(moment(new Date(this.queryParams.beginDate)).format("yyyy"),
          moment(new Date(this.queryParams.beginDate)).format("yyyy"), 'naturalDate','year');
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.queryParams.startMonth = (new Date(this.queryParams.beginDate).getMonth()+1).toString();
        this.queryParams.endMonth = (new Date(this.queryParams.endDates).getMonth()+1).toString();
        //
        let startWeek = (this.queryParams.weekStr-1)*7;
        let endWeek = (this.queryParams.weekStr1)*7-1;
        if(this.queryParams.weekStr1 === '4'&&this.queryParams.endMonth !='2')
        {
          this.queryParams.collectDateStr = dateUtil.getNextDate(this.queryParams.beginDate, 'days', -startWeek, 'YYYY-MM-DD') + '至' +moment(moment(this.queryParams.endDates)).endOf("month").format("YYYY-MM-DD");
        }
        else {
          this.queryParams.collectDateStr = dateUtil.getNextDate(this.queryParams.beginDate, 'days', -startWeek, 'YYYY-MM-DD') + '至' +
            dateUtil.getNextDate(this.queryParams.endDates, 'days', -endWeek, 'YYYY-MM-DD');
        }
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.yearStr = moment(new Date(this.queryParams.beginDate)).format("yyyy");
        this.queryParams.orgName = sysOrg.name;
        this.queryParams.fileName = sysOrg.name + '-每周车流收入对比汇总表-' + moment(new Date()).format('YYYY-MM-DD');

        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        console.log('queryParams',this.queryParams)
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/manage/rpt_manage_011_01_每周车流收入对比汇总表.cpt&op=write',
          this.queryParams);

        //更新查询统计次数
        //updateRptSearchTimes('rpt_manage_011');



      }
    }
  }
</script>

<style scoped>

</style>
