<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="所在机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
      </el-form-item>

      <el-form-item label="门架1" prop="gantryOne">
        <label slot="label"><span style="color:red">*</span>&nbsp;&nbsp;门架1</label>
        <ti-sys-gantry ref="gantryOne" :multiple="false" @change="getGantryOneLabel" :show-all="true" v-model="queryParams.temGantryIdStrOne"/>
      </el-form-item>

      <el-form-item label="门架2" prop="gantryTwo">
        <label slot="label"><span style="color:red">*</span>&nbsp;&nbsp;门架2</label>
        <ti-sys-gantry ref="gantryTwo" :multiple="false" @change="getGantryTwoLabel" :show-all="true" v-model="queryParams.temGantryIdStrTwo"/>
      </el-form-item>

      <el-form-item label="统计日期" prop="dates">
        <ti-date-range ref="dayRange" :editable="false" v-model="queryParams" date-type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay" end-key="endDay"/>
      </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getData()" :disabled="idDisabled">查询</el-button>
      </el-form-item>
      <iframe id="ifra" v-bind:src="reportUrl" frameborder=0 border="0" style="overflow:auto;width: 100%;height:100%;min-height: 850px"></iframe>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import fineReportUtil from "@/views/pro/common/fineReport/fineReportUtil";
  import TiDateRange from "@/views/cy/common/tiElement/tiDate/tiDateRange2";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment';
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiSysGantry from "@/views/pro/common/tiElement/tiSysGantry/tiSysGantry"

  export default {
    name: 'report.charge.rpt_charge_016',
    components: {TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg,TiSysGantry},
    mixins: [...mixin],
    data() {
      return {
        idDisabled: true,
        reportUrl: '',
        queryParams: {
          orgId: '',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 0, 'YYYY-MM-DD'),
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          sysOrgIdStr: '',
          gantryIdStrOne: '',
          gantryIdStrTwo: '',
          temGantryIdStrOne: '',
          temGantryIdStrTwo: '',
          orgNo: '',
          orgName: '',
          fileName: '',
          excelName: '',
          selectNum: 1
        }
      }
    },
    created() {
      this.queryParams.userName = store.getters.username;
      this.queryParams.realName = store.getters.name;
    },
    methods: {
      getGantryOneLabel(val) {
        this.queryParams.temGantryIdStrOne = val;
        if(this.queryParams.temGantryIdStrOne != '' && this.queryParams.temGantryIdStrTwo != '') {
          this.queryParams.gantryIdStrOne = this.queryParams.temGantryIdStrOne;
          this.queryParams.gantryIdStrTwo = this.queryParams.temGantryIdStrTwo;
          this.idDisabled = false;
        }

        this.$refs.gantryOne.selectDataShow.forEach(item=>{
          if(item.gantryId == val){
            this.queryParams.gantryOneLabel = item.gantryText;
          }
        })
      },
      getGantryTwoLabel(val) {
        this.queryParams.temGantryIdStrTwo = val;
        if(this.queryParams.temGantryIdStrOne != '' && this.queryParams.temGantryIdStrTwo != '') {
          this.queryParams.gantryIdStrOne = this.queryParams.temGantryIdStrOne;
          this.queryParams.gantryIdStrTwo = this.queryParams.temGantryIdStrTwo;
          this.idDisabled = false;
        }
        this.$refs.gantryTwo.selectDataShow.forEach(item=>{
          if(item.gantryId == val){
            this.queryParams.gantryTwoLabel = item.gantryText;
          }
        })
      },
      /*idDisabled() {
        if(this.queryParams.temGantryIdStrOne != '' && this.queryParams.temGantryIdStrTwo != '') {
          this.queryParams.gantryIdStrOne = this.queryParams.temGantryIdStrOne;
          this.queryParams.gantryIdStrTwo = this.queryParams.temGantryIdStrTwo;
          this.idDisabled = false;
        }
        if(!this.idDisabled) {
          this.queryParams.temGantryIdStrOne = '';
          this.queryParams.temGantryIdStrTwo = '';
        }
      },*/

      getData() {
        var dateTrans;
        //用户机构
        let sysOrg = this.$refs.sysOrg.getSysOrg();
        this.queryParams.orgNo = getOrgNo(sysOrg);
        this.queryParams.orgName = sysOrg.name;

        //用户level
       /* let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;*/

        //参数
        this.queryParams.fileName = '定向车流收入报表';
        var fileNameDate = moment(new Date).format('YYYYMMDD');
        this.queryParams.excelName = this.queryParams.fileName + fileNameDate;
        /*if (this.queryParams.gantryIdStrOne == '' || this.queryParams.gantryIdStrOne == undefined) {
          //document.getElementById("charge016Select").setAttribute("disabled", true);
          this.$notify.error('请选择门架1');
          return false;
        }
        if (this.queryParams.gantryIdStrTwo == '' || this.queryParams.gantryIdStrTwo == undefined) {
          //document.getElementById("charge016Select").setAttribute("disabled", true);
          this.$notify.error('请选择门架2');
          return false;
        }*/

        console.log("queryParams:", this.queryParams);
        this.reportUrl = fineReportUtil.getUrl('/ReportServer?reportlet=report/charge/rpt_charge_016_01_定向车流收入报表.cpt',this.queryParams);
        if(!this.idDisabled) {
          this.queryParams.temGantryIdStrOne = '';
          this.queryParams.temGantryIdStrTwo = '';
          this.idDisabled = true;
        }
        //this.isIframe();
      },
      /*isIframe() {
        debugger;
        console.log('测试')
        var iframe = document.createElement("ifra");
        iframe.src = this.reportUrl;
        if (!/!*@cc_on!@*!/0) { //如果不是IE，IE的条件注释
          iframe.onload = function(){
            console.log("不是IE");
          };
        } else {
          iframe.onreadystatechange = function(){ // IE下的节点都有onreadystatechange这个事件
            if (iframe.readyState == "complete"){
              console.log("是IE");
            }
          };
        }
        document.body.appendChild(iframe);
      }*/
    },
  }
</script>
