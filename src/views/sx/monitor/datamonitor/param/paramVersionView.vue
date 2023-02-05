<template>
  <div class="app-container">
    <div class="search-form">
      <el-card>
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" size="small">
        <div>
          <el-form-item label="机构" prop="sysOrgIdStr_lane" v-show="queryParams.model=='lane'">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_lane" @change="orgChange" show-level="4"/>
          </el-form-item>
          <el-form-item label="机构" prop="sysOrgIdStr_station" v-show="queryParams.model=='station'">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_station" :multiple="true"/>
          </el-form-item>
          <el-form-item label="出入口类型" prop="entryExitType" v-show="queryParams.model=='lane'">
            <ti-select v-model="queryParams.entryExitType" dict-type="tibms_com_inOutType"/>
          </el-form-item>
          <el-form-item label="车道类型" prop="laneTypeStr" v-show="queryParams.model=='lane'">
            <ti-select v-model="queryParams.laneTypeStr" dict-type="tibms_com_laneType" :multiple="true"/>
          </el-form-item>
          <el-form-item label="车道号" prop="laneNoStr" v-show="queryParams.model=='lane'">
            <ti-sys-lane clearable v-model="queryParams.laneNoStr"  :cache="true" :station-id="stationId" :multiple="true"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>

        </div>

      </el-form>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" @tab-click="tabClick" type="border-card" style="margin-top: 10px">
      <el-tab-pane label="车道参数版本" name="lane">
        <lane-tab
          ref="laneTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
      <!--<el-tab-pane label="ETC门架数据" name="gantry">
        <gantry-tab
          ref="gantryTab"
          :query-params="queryParams"
        />
      </el-tab-pane>-->
      <el-tab-pane label="站级参数版本" name="station">
        <station-tab
          ref="stationTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import moment from 'moment'


import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import laneTab from "./components/laneTab";
import stationTab from "./components/stationTab";
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: 'monitor.datamonitor.param.versionView',
  components: {TiExportExcel, TiSysLane, TiSelect, TiDateRange, TiDate, tiSysOrg, laneTab, stationTab },
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        sysOrgIdStr: '',
        sysOrgIdStr_lane: '',
        sysOrgIdStr_station: '',
        entryExitType: '',
        laneTypeStr: '',
        laneNoStr: '',
        model: 'lane'
      },
      stationId: '',
      showSearch: false,
      loading: false,
      activeTab: 'lane'
    }
  },
  activated() {
  },
  created() {
  },
  methods: {
    orgChange(val,org){
      if(org){
        this.stationId = org.stationId
      }
    },
    getData() {
      if (this.queryParams.model == 'lane') {
        this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_lane;
        this.$refs.laneTab.init();
      } else if (this.queryParams.model == 'station') {
        this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_station;
        this.$refs.stationTab.init();
      }

    },
    handleReset() {
      this.$refs.searchForm.resetFields();
    },
    tabClick(tab, event) {
      console.log(this.activeTab)
      this.queryParams.model = tab.name
      this.$refs.searchForm.resetFields();
      this.queryParams.sysOrgIdStr = '';
      this.getData();
    },
  }
}
</script>

<style scoped>
/*  .el-form-item /deep/ .el-range-editor {
    width: 518px !important;
  }*/
</style>
