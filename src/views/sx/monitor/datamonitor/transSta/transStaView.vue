<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr_lane" v-show="queryParams.model=='lane'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_lane" />
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_station" v-show="queryParams.model=='station'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_station" />
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_gantry" v-show="queryParams.model=='gantry'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr_gantry"  show-level="2"/>
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
        <el-form-item label="通行交易日期" prop="collectDateStr">
          <ti-date v-model="queryParams.collectDateStr"/>
        </el-form-item>
        <el-form-item label="数据类型" prop="listCodeStr">
          <ti-select v-model="queryParams.listCodeStr" dict-type="tibms_mo_listCode" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车道是否滞留" prop="laneRetainFlag" v-show="this.queryParams.model=='lane'">
          <ti-select
            v-model="queryParams.laneRetainFlag"
            :data-list="[{value:'true',name:'是'},{value:'false',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-form-item label="站省是否滞留" prop="spRetainFlag">
          <ti-select
            v-model="queryParams.spRetainFlag"
            :data-list="[{value:'true',name:'是'},{value:'false',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-form-item label="站部是否滞留" prop="sdRetainFlag">
          <ti-select
            v-model="queryParams.sdRetainFlag"
            :data-list="[{value:'true',name:'是'},{value:'false',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
       <!-- <el-form-item label="站路是否滞留" prop="srRetainFlag">
          <ti-select
            v-model="queryParams.srRetainFlag"
            :data-list="[{value:'true',name:'是'},{value:'false',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>-->
        <!--<el-form-item label="路省是否滞留" prop="rpRetainFlag">
          <ti-select
            v-model="queryParams.rpRetainFlag"
            :data-list="[{value:'true',name:'是'},{value:'false',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>-->
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>

      </el-form>
    </div>


    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="车道相关数据" name="lane">
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
      <el-tab-pane label="工班结算数据" name="station">
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
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";

  import laneTab from "./components/laneTab";
  import stationTab from "./components/stationTab";
  import gantryTab from "./components/gantryTab";
  import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'monitor.datamonitor.transSta.transStaView',
    components: {TiSysOrg, TiDate, TiSelect, laneTab, stationTab, gantryTab},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          model: 'lane',  // lane/gantry/station
          collectDateStr: moment(new Date()).format('YYYY-MM-DD'),
          sysOrgIdStr: '',
          sysOrgIdStr_gantry: '',
          sysOrgIdStr_lane: '',
          sysOrgIdStr_station: '',
          inOutTypeStr: '',
          laneTypeStr: '',
          laneNo: '',
          listCodeStr: '',
          laneRetainFlag: '',
          spRetainFlag: '',
          sdRetainFlag: '',
          srRetainFlag: '',
          rpRetainFlag: '',
        },
        activeTab: 'lane',
      }
    },
    methods: {
      getData() {
        if (this.queryParams.model == 'lane') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_lane;
          this.$refs.laneTab.searchData();
        } else if (this.queryParams.model == 'station') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_station;
          this.$refs.stationTab.searchData();
        } else if (this.queryParams.model == 'gantry') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_gantry;
          this.$refs.gantryTab.searchData();
        }
      },
      tabClick(tab, event) {
        this.queryParams.model = tab.name;
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr = this.queryParams.initSysOrgId;
        this.getData();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        //this.getData();
      },

      /*watchAttrFn(newVal, oldVal, selectData) {
        let selectDataShow = [];
        //改变下拉列表
        if (newVal) {
          selectData.forEach(x => {
            if ((',' + newVal + ',').indexOf(',' + x.roadNo + ',') > -1) {
              selectDataShow.push(x)
            }
          });
        } else {
          selectDataShow = selectData;
        }
        return selectDataShow;
      }*/
    }
  }

</script>

<style scoped>

</style>
