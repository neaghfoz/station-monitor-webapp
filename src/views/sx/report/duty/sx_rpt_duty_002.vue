<template>
  <div class="app-container" style="height: 100%">
    <el-card>
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" size="small">
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
        <el-form-item label="操作员" prop="operatorId">
          <ti-select ref="operator" v-model="queryParams.operatorId" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>

        <iframe v-bind:src="reportUrl" frameborder=0 border="0" style="overflow:auto;width: 100%;height:100%;min-height: 850px"></iframe>
      </el-form>
    </el-card>
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
  name: 'report.duty.sx_rpt_duty_002',
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
        sysOrgIdStr: '',
        operatorId: '',
        operatorName: '',
        orgNo: '',
        orgName: '',
        laneId: ''
      }
    }
  },
  watch: {
    'queryParams.sysOrgIdStr': {
      handler(n, o) {
        this.selectOperatorId();
      },
      immediate: true
    }, 'queryParams.dayStr': {
      handler(n, o) {
        this.selectOperatorId();
      },
      immediate: true
    }, 'queryParams.shiftID': {
      handler(n, o) {
        this.selectOperatorId();
      },
      immediate: true
    }, 'queryParams.laneId': {
      handler(n, o) {
        this.selectOperatorId();
      },
      immediate: true
    }
  },
  created() {
    this.queryParams.userName = store.getters.username;
    this.queryParams.realName = store.getters.name;
  },
  computed: {},
  methods: {
    async getData() {
      this.$refs.searchForm.validate(async valid => {

        if (!valid) {
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
        if (this.$refs.operator.options.labelValue) {
          this.queryParams.operatorName = this.$refs.operator.options.labelValue.realName;
        } else {
          this.queryParams.operatorName = ''
        }
        this.queryParams.shiftNo = this.$refs.shift.selectDataShow[this.queryParams.shiftID - 1].squadNameText;
        //用户level
        let userAuth = await reportUtil.getUserAuth(sysOrg);
        this.queryParams.roadIdStr = userAuth.roadIdStr;
        this.queryParams.level = userAuth.level;
        this.queryParams.stationIdStr = userAuth.stationIdStr;
        this.reportUrl = fineReportUtil.getUrl(
          '/ReportServer?reportlet=report/duty/sx_rpt_duty_002_01_出口值班全表.cpt&__filename__=出口值班全表' + XEUtils.toDateString(new Date(), 'yyyyMMddmmddss'),
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

        if (x.entryExitType == 2) {
          stationList.forEach(station => {
              if (station.stationId == x.stationId) {
                laneJson[x.laneNo] = x;
              }
            }
          );
        }
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
    async selectOperatorId() {
      if (!this.$refs.sysOrg || !this.queryParams.dayStr || !this.queryParams.laneId) {
        return;
      }

      let org = this.$refs.sysOrg.getSysOrg();
      let {data} = await getByEntity(
        {
          roadId: org.roadId,
          stationId: org.stationId == 0 ? '' : org.stationId,
          squadDateStr: this.queryParams.dayStr,
          squadNo: this.queryParams.shiftID,
          laneNo: this.queryParams.laneId
        });
      this.$nextTick(() => {
        this.queryParams.operatorId = data.operatorID;
        this.$refs.operator.change(this.queryParams.operatorId);
      });
    },
  }
}

</script>

<style scoped>

</style>
