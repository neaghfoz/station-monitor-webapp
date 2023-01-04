<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr_lane" v-show="queryParams.model=='lane'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_lane" v-show="queryParams.model=='lane'"/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_station" v-show="queryParams.model=='station'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_station" v-show="queryParams.model=='station'"/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_road" v-show="queryParams.model=='road'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_road" show-level="2" v-show="queryParams.model=='road'"/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_gantry" v-show="queryParams.model=='gantry'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_gantry" show-level="2" v-show="queryParams.model=='gantry'"/>
        </el-form-item>
        <el-form-item label="门架编码" prop="gantryId" v-show="this.queryParams.model=='gantry'">
          <el-input v-model="queryParams.gantryId" type="text" placeholder="门架编码" maxlength="19" style="width: 199px"/>
        </el-form-item>
        <el-form-item label="出入口类型" prop="inOutTypeStr" v-show="this.queryParams.model=='lane'">
          <ti-select v-model="queryParams.inOutTypeStr" dict-type="tibms_com_inOutType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车道类型" prop="laneTypeStr" v-show="this.queryParams.model=='lane'">
          <ti-select v-model="queryParams.laneTypeStr" dict-type="tibms_com_laneType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车道号" prop="laneNo" v-show="this.queryParams.model=='lane'">
          <el-input v-model="queryParams.laneNo" type="text" placeholder="车道号" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="传输监视启用" prop="monitorUse">
          <ti-select
            v-model="queryParams.monitorUse"
            :data-list="[{value:'1',name:'是'},{value:'0',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-form-item label="车道监控启用" prop="laneMonitorUse" v-show="laneMonitorUseShow">
          <ti-select
            v-model="queryParams.laneMonitorUse"
            :data-list="[{value:'1',name:'是'},{value:'0',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>

      </el-form>
    </div>


    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <!--<el-tab-pane label="路段" name="road">
        <road-tab
          ref="roadTab"
          :query-params="queryParams"
        />
      </el-tab-pane>-->
      <el-tab-pane label="收费站" name="station">
        <station-tab
          ref="stationTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
      <el-tab-pane label="车道" name="lane">
        <lane-tab
          ref="laneTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
      <!--
      <el-tab-pane label="门架" name="gantry">
        <gantry-tab
          ref="gantryTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
      -->
      <!--<el-tab-pane label="手持机" name="mobile">
        <mobile-tab
          ref="mobileTab"
          :query-params="queryParams"
        />
      </el-tab-pane>-->
    </el-tabs>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  // import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import tiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  import roadTab from "./components/roadTab";
  import stationTab from "./components/stationTab";
  import laneTab from "./components/laneTab";
  import gantryTab from "./components/gantryTab";
  import mobileTab from "./components/mobileTab";

  export default {
    name: 'monitor.com.orgUse.orgUseView',
    components: {TiDate, TiSelect, tiSelectTree, laneTab, stationTab, gantryTab, roadTab, mobileTab, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          moduleType:'monitor',
          model: 'station',  // road/station/lane/gantry
          sysOrgIdStr: '',
          sysOrgIdStr_lane: '',
          sysOrgIdStr_station: '',
          sysOrgIdStr_road: '',
      //    sysOrgIdStr_gantry: '',
          inOutTypeStr: '',
          laneTypeStr: '',
          laneNo: '',
          monitorUse: '',
          laneMonitorUse: '',
        },
        laneMonitorUseShow: false,
        activeTab: 'station',
      }
    },
    methods: {
      getData() {
        this.laneMonitorUseShow = false
        if (this.queryParams.model == 'road') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_road;
          this.$refs.roadTab.searchData();
        } else if (this.queryParams.model == 'station') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_station;
          this.$refs.stationTab.searchData();
        } else if (this.queryParams.model == 'lane') {
          this.laneMonitorUseShow = true
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_lane;
          this.$refs.laneTab.searchData();
        } else if (this.queryParams.model == 'gantry') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_gantry;
          this.$refs.gantryTab.searchData();
        } else if (this.queryParams.model == 'mobile') {
          this.queryParams.sysOrgIdStr = '';
          this.$refs.mobileTab.searchData();
        }
      },
      tabClick(tab, event) {
        this.queryParams.model = tab.name;
        this.$refs.searchForm.resetFields();
        this.getData();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
       // this.getData();
      },
    }
  }

</script>

<style scoped>

</style>
