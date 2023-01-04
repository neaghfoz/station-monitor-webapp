<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm"   :model="queryParams" inline :label-width="'100px'" v-bind:style="{height: searchFormHeight}">
      <el-form-item ref ="elRowAll" style="margin-bottom:0">
        <el-row>
          <el-form-item label="路段" prop="sysOrgIdStr">
            <ti-sys-road style="width:180px" default-first-value  @change="roadChange" v-model="queryParams.roadIdStr"/>
          </el-form-item>
          <el-form-item label="门架名称">
            <ti-sys-gantry style="width:180px" :clearable="true" :section-id="queryParams.roadIdStr" v-model="queryParams.gantryIdStr"/>
          </el-form-item>
    <!--      <el-form-item label="门架名称" label-width="80px" prop="gantryIdStr">-->
    <!--        <ec-rpt-gantry   v-model="queryParams.gantryIdStr" :road-no="queryParams.roadNo"  :filterable="true"  :multiple="true"/>-->
    <!--      </el-form-item>-->
          <el-form-item label="门架类型" label-width="80px" prop="gantryType">
            <ti-select style="width:180px"   v-model="queryParams.gantryType" dict-type="tibms_com_gantryType"/>
          </el-form-item>
          <el-form-item label="统计类型" label-width="80px" prop="statType">
            <ti-select style="width:180px"   v-model="queryParams.statType" dict-type="tibms_rpt_statType"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="通行交易日期"  prop="transDates">
            <el-col :span="30">
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
<!--              <el-form-item v-show="queryParams.dateStatisticType==='year'">-->
<!--                <el-form-item prop="startYear" v-show="false"/>-->
<!--                <el-form-item prop="endYear" v-show="false"/>-->
<!--                <ti-date-range ref="yearRang" :editable="false"-->
<!--                               v-model="queryParams"-->
<!--                               date-type="yearRang"-->
<!--                               format="yyyy" value-format="yyyy" begin-key="startYear"-->
<!--                               end-key="endYear"/>-->
<!--              </el-form-item>-->
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
            <ti-select style="width:180px" :clearable="false" v-model="queryParams.dateStatisticType" dict-type="tibms_rpt_dateStatisticType"/>
          </el-form-item>
          <el-form-item class="searchItem" :label-width="'50px'">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form-item>

      <iframe  v-bind:src="reportUrl"  frameborder=0 border="0" style="overflow:auto;width: 100%;" v-bind:style="{height: iframeHeight}"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import store from '@/store'
  import {updateRptSearchTimes} from "@/views/pro/report/common/rptSearchTimes";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import moment from "moment";
  import {getOrgNo, getOrgTreeData} from "@/views/pro/common/util/dataUtil";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";
  import TiSysRoad from "@/views/pro/common/tiElement/tiSysRoad/tiSysRoad"
  import TiSysGantry from "@/views/pro/common/tiElement/tiSysGantry/tiSysGantry"

  export default {
    name: 'report.gantry.rpt_gantry_002',
    components: {TiSelect,TiSelectTree,TiDateRange,tiSysOrg,TiDateRangeDivide,TiSysRoad,TiSysGantry},
    mixins: [...mixin],
    data() {
      return {
        reportUrl:'',
        queryParams: {
          statType:'subTotal',
          dateStatisticType:'day',
          gantryType:'',
          startDay:dateUtil.getNextDate(new Date(),'days',1,'YYYY-MM-DD'),
          endDay:dateUtil.getNextDate(new Date(),'days',1,'YYYY-MM-DD'),
          startMonth:moment(new Date()).format('YYYY-MM'),
          endMonth:moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate:'',
          endDate:'',
          collectDateStr:'',
          userName:'',
          realName:'',
          gantryIdStr:'',
          sysOrgIdStr:'',
          roadIdStr:'',
          roadNo:'',
          orgName:'',
          orgNo:'',
          _filename_:''
        },
        searchFormHeight: '100%',
        iframeHeight: '100%',
      }
    },
    created() {
      this.queryParams.userName=store.getters.username;
      this.queryParams.realName=store.getters.name;
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
    methods:{
      roadChange(val,road){
        this.queryParams.roadNo = road.roadNo
        this.queryParams.orgName = road.roadName
        this.queryParams.orgNo = road.roadNo
      },
      getData() {
        var filename;
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            if(this.queryParams.roadNo=='' || this.queryParams.roadNo == undefined){
              this.queryParams.orgNo = 0;
              this.queryParams.orgName = '全部';
            }
            var dateTrans;
            if(this.queryParams.dateStatisticType==='day')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
              filename = "分门架分车种车流量日报表";
            }
            else if(this.queryParams.dateStatisticType==='month')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
              filename = "分门架分车种车流量月报表";
            }else if (this.queryParams.dateStatisticType === 'year') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
              this.queryParams.endYear, this.queryParams.dateStatisticType);
              filename = "分门架分车种车流量年报表";
            }
            this.queryParams.startDate = dateTrans.startDate;
            this.queryParams.endDate = dateTrans.endDate;
            this.queryParams.collectDateStr = dateTrans.collectDateStr;
            this.queryParams._filename_ = filename;

            console.log("queryParams:",this.queryParams);
            this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/gantry/rpt_gantry_002_01_分门架分车种车流量报表.cpt',this.queryParams);

            //更新查询统计次数
            updateRptSearchTimes('rpt_gantry_002');

          }else {
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
