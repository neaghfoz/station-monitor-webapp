<template>
  <div class="app-container"  style="height: 100%">
    <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2" />
      </el-form-item>
      <el-form-item label="收费单元">
        <ti-select
          ref="interval"
          v-model="queryParams.tollIntervalIdStr"
          check-strictly
          url="api/v1/common/interval/interval"
          :props="{key:'intervalId',value:'intervalId',label:'intervalTxt'}"
          :watch-attr="queryParams.sysOrgIdStr"
          :watch-attr-fn="watchAttrFn"
          :multiple="true"
        />
      </el-form-item>
      <el-form-item label="统计类型" label-width="80px" prop="statType">
        <ti-select :clearable="false"   v-model="queryParams.statType" dict-type="tibms_rpt_statType"/>
      </el-form-item>
      <el-row>
        <el-form-item label="通行交易日期"  prop="tansDates">
          <el-col :span="30">
            <el-form-item v-show="queryParams.dateStatisticType==='day'">
              <el-form-item prop="startDay" v-show="false"/>
              <el-form-item prop="endDay" v-show="false"/>
              <ti-date-range ref="dayRang" :editable="false" v-model="queryParams" date-type="daterange"
                             format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                             end-key="endDay"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='month'">
              <el-form-item prop="startMonth" v-show="false"/>
              <el-form-item prop="endMonth" v-show="false"/>
              <ti-date-range ref="monthRang" :editable="false" v-model="queryParams" date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='year'">
              <el-form-item prop="startYear" v-show="false"/>
              <el-form-item prop="endYear" v-show="false"/>
              <ti-date-range ref="yearRang" :editable="false"
                             v-model="queryParams"
                             date-type="yearRang"
                             format="yyyy" value-format="yyyy" begin-key="startYear"
                             end-key="endYear"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="dateStatisticType">
          <ti-select :clearable="false" v-model="queryParams.dateStatisticType" dict-type="tibms_rpt_dateStatisticType"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-row>

      <iframe  v-bind:src="reportUrl"  frameborder=0 border="0"  style="overflow:auto;width: 100%;height:100%;min-height: 1000px"></iframe>
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
  import {getOrgNo, getOrgTreeData} from "@/views/pro/common/util/dataUtil"
  import moment from "moment";
  import reportUtil from "@/views/pro/report/common/reportUtil";

  export default {
    name: 'report.theoryFee.rpt_theoryFee_002',
    components: {TiSelect,TiSelectTree,TiDateRange,tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl:'',
        queryParams: {
          statType:'subTotal',
          dateStatisticType:'day',
          tollIntervalIdStr:'',
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
          sysOrgIdStr:'',
          roadIdStr:'',
          roadNo:'',
          orgName:'',
          orgNo:'',
        },
      }
    },
    created() {
      this.queryParams.userName=store.getters.username;
      this.queryParams.realName=store.getters.name;
    },
    methods:{
      getData() {

        this.$refs.searchForm.validate((valid) => {
          if (valid) {

            //用户机构
            let sysOrg = this.$refs.sysOrg.getSysOrg();
            this.queryParams.orgNo = getOrgNo(sysOrg);
            this.queryParams.orgName = sysOrg.name;



            var dateTrans;
            if(this.queryParams.dateStatisticType==='day')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
            }
            else if(this.queryParams.dateStatisticType==='month')
            {
              dateTrans = dateUtil.dateCombination(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
            }else if (this.queryParams.dateStatisticType === 'year') {
              dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
                this.queryParams.endYear, this.queryParams.dateStatisticType);
            }
            this.queryParams.startDate = dateTrans.startDate;
            this.queryParams.endDate = dateTrans.endDate;
            this.queryParams.collectDateStr = dateTrans.collectDateStr;
            console.log("queryParams:",this.queryParams);
            this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/theoryFee/rpt_theoryFee_002_01_分收费单元分车种通行费报表.cpt',this.queryParams);

            //更新查询统计次数
            updateRptSearchTimes('rpt_theoryFee_002');
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      watchAttrFn(newVal,oldVal,selectData){
        let selectDataShow = [];
        let roadIdList = [];
        let sysOrgList = [];

        let sysOrg = this.$refs.sysOrg.getSysOrg();
        if(sysOrg){
          sysOrgList.push(sysOrg);
          getOrgTreeData(sysOrgList,'roadId',roadIdList,2);
        }

        //改变下拉列表
        if (roadIdList) {
          this.queryParams.roadIdStr = roadIdList.join(',');
          selectData.forEach(x => {
            roadIdList.forEach(roadId =>{
                if ((',' + roadId + ',').indexOf(',' + x.roadId + ',') > -1) {
                  selectDataShow.push(x)
                }
              }
            );

          });
        }else{
          selectDataShow = selectData;
        }

        return selectDataShow;
      }
    }
  }
</script>

<style scoped>

</style>
