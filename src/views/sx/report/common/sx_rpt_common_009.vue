<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
      </el-form-item>
      <el-form-item label="工班日期" prop="dates">
        <ti-date v-model="queryParams.dayStr"
                 dateType="date" :clearable="false"
                 format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item label="工班" prop="shiftID" :label-width="'50px'">
        <ti-select ref="shift" v-model="queryParams.shiftID" :clearable="false" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"/>
      </el-form-item>
      <el-form-item label="车道号" prop="laneId" :rules="[ {required: true, message:'车道号必选', trigger:'change'} ]">
        <ti-select
          ref="laneId"
          :clearable="false"
          v-model="queryParams.laneId"
          url="/api/v1/common/lane/listWithUserAuth"
          :props="{key:'laneNo',value:'laneNo',label:'laneNo'}"
          :watch-attr="queryParams.sysOrgIdStr"
          :watch-attr-fn="watchAttrFn"/>
      </el-form-item>
      <el-form-item label="授权类型" prop="opResultStatus" label-width="'50px'">
        <ti-select :clearable="true" v-model="queryParams.opResultStatus" dict-type="toll_laneMonitor_opresultstatues"/>
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
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import store from '@/store';
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from 'moment'
  import {getOrgNo} from "@/views/pro/common/util/dataUtil";
  import reportUtil from "@/views/pro/report/common/reportUtil"
  import $ from 'jquery'
  import {getByEntity} from "@/views/pro/search/list/laneShift/laneShiftApi";

  export default {
    name: 'report.common.sx_rpt_common_009',
    components: {TiSelectTree, TiSelect, TiDate, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reportUrl: '',
        queryParams: {
          orgId: '',
          collectType: 'squadDate',
          dayStr: moment(new Date()).format('YYYY-MM-DD'),
          collectDateStr: '',
          userName: '',
          realName: '',
          roadIdStr: '',
          stationIdStr: '',
          shiftID: '1',
          shiftNo: '',
          opResultStatus: '',
          sysOrgIdStr: '',
          orgNo: '',
          orgName: '',
          laneId: ''
        }
      }
    },
    watch: {

    },
    created() {
      this.queryParams.userName = store.getters.username;
      this.queryParams.realName = store.getters.name;
    },
    computed: {},
    methods: {
      async getData() {
        this.$refs.searchForm.validate(async valid => {

          if (!valid){
            return
          }

          var dateTrans;
          dateTrans = dateUtil.collectTypeCombination(this.queryParams.dayStr,
            this.queryParams.dayStr, this.queryParams.collectType, 'day');
          this.queryParams.startDate = dateTrans.startDate;
          this.queryParams.endDate = dateTrans.endDate;
          this.queryParams.collectDateStr = "工班日期：" + this.queryParams.dayStr;
          this.queryParams.diffDays = moment(this.queryParams.endDate).diff(moment(this.queryParams.startDate), 'days');
          //用户机构
          let sysOrg = this.$refs.sysOrg.getSysOrg();
          this.queryParams.orgNo = getOrgNo(sysOrg);
          this.queryParams.orgName = sysOrg.name;
          this.queryParams.shiftNo = this.$refs.shift.selectDataShow[this.queryParams.shiftID - 1].squadNameText;
          //用户level
          let userAuth = await reportUtil.getUserAuth(sysOrg);
          this.queryParams.roadIdStr = userAuth.roadIdStr;
          this.queryParams.level = userAuth.level;
          this.queryParams.stationIdStr = userAuth.stationIdStr;
          this.reportUrl = fineReportUtil.getUrl(
            '/ReportServer?reportlet=report/common/sx_rpt_common_009_01_特情回控报表.cpt&__filename__=特情回控报表'+XEUtils.toDateString(new Date(), 'yyyyMMddmmddss'),
            this.queryParams);

          //更新查询统计次数
          //updateRptSearchTimes('rpt_manage_002');

        });
      },
      watchAttrFn(newVal, oldVal, selectData) {
        let stationList = [];
        this.$refs.sysOrg.initStationOrgList(stationList);

        //json是为了去重（不能laneNo重复，不然下拉列表太多）
        let laneJson = {}
        selectData.forEach(x => {
          stationList.forEach(station => {
              if (station.stationId == x.stationId) {
                laneJson[x.laneNo] = x;
              }
            }
          );
        })

        //变回数组
        let laneList = [];
        $.each(laneJson, function (k, v) {
          laneList.push(v);
        })

        //排序（顺序）
        laneList.sort(function (x, y) {
          return x.laneNo - y.laneNo;
        });
        return laneList;
      },
    }
  }

</script>

<style scoped>

</style>
