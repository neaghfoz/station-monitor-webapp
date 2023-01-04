<template>
  <div class="app-container"  style="height: 100%">
    <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'  "  v-bind:style="{height: searchFormHeight}" >
<!--      <el-form-item label="机构" prop="sysOrgIdStr">-->
<!--        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2" />-->
<!--      </el-form-item>-->
      <el-form-item ref ="elRowAll" style="margin-bottom:0">
        <el-row>
            <el-form-item label="路段名称" prop="sectionId">
              <ti-select ref="sectionId" style="width: 177px" v-model="queryParams.sectionId"
                         url="/api/v1/common/road/findListByAuth"
                         :props="{key:'roadId',value:'roadId',label:'roadName'}"
                         default-first-value
                         :clearable="false"
                         :multiple="false" aria-placeholder="路段名称"/>
            </el-form-item>
          <el-form-item label="车类" label-width="80px" prop="vehFlag">
            <ti-select :clearable="false"  v-model="queryParams.vehFlag" dict-type="tibms_rpt_vehFlag"/>
          </el-form-item>
          <el-form-item label="通行类型" label-width="80px" prop="transType">
            <ti-select  v-model="queryParams.transType" dict-type="tibms_rpt_transType"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="通行交易日期"  prop="tansDates">
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
                <ti-date-range  date-style="width:470px"   ref="monthRang" :editable="false" v-model="queryParams" date-type="monthrange"
                               format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                               end-key="endMonth"/>
              </el-form-item>
              <el-form-item v-show="queryParams.dateStatisticType==='year'">
                <el-form-item prop="startYear" v-show="false"/>
                <el-form-item prop="endYear" v-show="false"/>
                <ti-date-range-divide date-style="width:217px" ref="year" :editable="false" v-model="queryParams"
                                      date-type="year"
                                      format="yyyy" value-format="yyyy" begin-key="startYear"
                                      end-key="endYear"/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="dateStatisticType">
            <ti-select :clearable="false" v-model="queryParams.dateStatisticType" dict-type="tibms_rpt_theory_dateStatisticType"/>
          </el-form-item>
          <el-form-item label="统计类型" label-width="80px" prop="isFree">
            <ti-select :clearable="false"  v-model="queryParams.isFree" dict-type="tibms_audit_isFree" :defaultFirstValue="true"/>
          </el-form-item>
          <el-form-item class="searchItem" :label-width="'50px'">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form-item>
      <iframe  v-bind:src="reportUrl"  frameborder=0 border="0"  style="overflow:auto;width: 100%;" v-bind:style="{height: iframeHeight}"></iframe>
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
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import {getOrgNo, getOrgTreeData,getRoadList} from "@/views/pro/common/util/dataUtil"
  import moment from "moment";
  import reportUtil from "@/views/pro/report/common/reportUtil";
  import TiDateRangeDivide from "@/views/pro/common/tiElement/tiDate/tiDateRangeDivide";

  export default {
    name: 'report.theory.rpt_theory_direct_003',
    components: {TiSelect,TiSelectTree,TiDateRange,tiSysOrg,TiDateRangeDivide},
    mixins: [...mixin],
    data() {
      return {
        reportUrl:'',
        queryParams: {
          vehFlag:'0',
          transType:'',
          dateStatisticType:'day',
          startDay:dateUtil.getNextDate(new Date(),'days',1,'YYYY-MM-DD'),
          endDay:dateUtil.getNextDate(new Date(),'days',1,'YYYY-MM-DD'),
          startMonth:moment(new Date()).format('YYYY-MM'),
          endMonth:moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate:'',
          endDate:'',
          startCompareDate:'',
          endCompareDate:'',
          startRingDate:'',
          endRingDate:'',
          diffDays:'',
          isSearch:'',
          collectDateStr:'',
          userName:'',
          realName:'',
          sysOrgIdStr:'',
          roadNo:'',
          roadName:'',
          orgNo:'',
          sectionId:'',
          __bypagesize__: false,
          isFree:'',
          __filename__:'理论应收折算车流量报表'
        },
        firstFlag:false,
        searchFormHeight: '100%',
        iframeHeight: '100%',
        //containerHeight: '100%',
      }
    },
    created() {
      this.queryParams.userName=store.getters.username;
      this.queryParams.realName=store.getters.name;
    },
    methods:{
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr)
        if(!this.queryParams.sectionId && seArr.length>0){
          this.queryParams.sectionId = seArr[0].roadId
          this.queryParams.orgNo = seArr[0].roadNo
          this.queryParams.roadName = seArr[0].name
          this.firstFlag = false;
          // // 获取到路段之后查询
          // this.getData()
        }
        return seArr
      },
      async getData() {
            // //用户机构
            // let sysOrg = this.$refs.sysOrg.getSysOrg();
            // this.queryParams.orgNo = getOrgNo(sysOrg);
            // this.queryParams.roadName = sysOrg.name;
            //
            // if(sysOrg.roadId != '0'){
            //   this.queryParams.sectionIds = sysOrg.roadId;
            // }else{
            //   let roadIds = [];
            //   getOrgTreeData(sysOrg.children,'roadId',roadIds,2);
            //   this.queryParams.sectionIds = roadIds.join(',');
            // }

        if(!this.queryParams.sectionId){
          this.queryParams.orgNo = 0;
          this.queryParams.roadName = '全部';
          this.queryParams.sectionId  = this.queryParams.sectionIds;
        }
        else if(this.$refs.sectionId.options.labelValue.roadNo != undefined){
          console.log("labelValue:",this.$refs.sectionId.options.labelValue);
          this.queryParams.orgNo = this.$refs.sectionId.options.labelValue.roadNo;
          this.queryParams.roadName = this.$refs.sectionId.options.labelValue.roadName;
        }else{
          let value = this.$refs.sectionId.getDefaultFirstValue();
          this.queryParams.orgNo =value.roadNo;
          this.queryParams.roadName = value.roadName;
        }
            var dateTrans;
            var compareTrans;
            var ringTrans;
            if(this.queryParams.dateStatisticType==='day')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
              compareTrans = dateUtil.dateCompare(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
              ringTrans = dateUtil.dateRing(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
            }
            else if(this.queryParams.dateStatisticType==='month')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
              compareTrans = dateUtil.dateCompare(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
              ringTrans = dateUtil.dateRing(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
            }else if (this.queryParams.dateStatisticType === 'year') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startYear, this.queryParams.endYear, this.queryParams.dateStatisticType);
              compareTrans = dateUtil.dateCompare(this.queryParams.startYear, this.queryParams.endYear, this.queryParams.dateStatisticType);
              ringTrans = dateUtil.dateRing(this.queryParams.startYear, this.queryParams.endYear, this.queryParams.dateStatisticType);
            }else if(this.queryParams.dateStatisticType==='days'){
              dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
              compareTrans = dateUtil.dateCompare(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
              ringTrans = dateUtil.dateRing(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
            }

            this.queryParams.startDate = dateTrans.startDate.replace(/\-/g,'');
            this.queryParams.endDate = dateTrans.endDate.replace(/\-/g,'');
            this.queryParams.collectDateStr = dateTrans.collectDateStr;
            this.queryParams.diffDays = moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days') +1 ;
            // console.log(compareTrans);

            this.queryParams.startCompareDate = compareTrans.startCompareTime.replace(/\-/g,'');
            this.queryParams.endCompareDate = compareTrans.endCompareTime.replace(/\-/g,'');
            this.queryParams.isSearch = compareTrans.isSearch;


            this.queryParams.startRingDate = ringTrans.startRingTime.replace(/\-/g,'');
            this.queryParams.endRingDate = ringTrans.endRingTime.replace(/\-/g,'');
            //console.log(this.queryParams);

            // this.queryParams.sectionId = this.queryParams.roadIdStr;
            //console.log("queryParams:",this.queryParams);

            //console.log("test");
            //console.log(this.queryParams.startDate == this.queryParams.endDate);
            //根据统计类别访问不同的报表cpt
            var statClass = this.queryParams.statClass;
            var rptUrl = "/ReportServer?reportlet=report/theory/";
            var rptLogType = "";
            rptUrl = rptUrl + "rpt_theory_direct_003_理论应收折算车流量报表.cpt";
            rptLogType = "rpt_theory_direct_003";

            this.queryParams.__filename__ = this.queryParams.roadName+"-"+"理论应收折算车流量报表-" +moment(new Date()).format('YYYYMMDD');

            this.reportUrl = fineReportUtil.getUrl(rptUrl,this.queryParams);

            //更新查询统计次数
            updateRptSearchTimes(rptLogType);

      }
    },mounted() {
      //获取显示高度
      const deviceHeight = document.documentElement.clientHeight;

      // 获取查询条件高度
      //let children = this.$refs.containerAll.$el.children;
      var elRowHeiht = this.$refs.elRowAll.$el.offsetHeight;

      // searchForm 减去标题高度
      this.searchFormHeight = (Number(deviceHeight)-125) + 'px'
      // iframe 还要减去查询条件高度
      this.iframeHeight = (Number(deviceHeight)-125 -elRowHeiht) + 'px';




    }
  }
</script>

<style scoped>

</style>
