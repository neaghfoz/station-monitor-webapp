<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr_lane" v-show="queryParams.model=='lane'">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" v-show="queryParams.model=='lane'"/>
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
        <el-form-item label="启用" prop="monitorUse">
          <ti-select
            v-model="queryParams.monitorUse"
            :data-list="[{value:'1',name:'是'},{value:'0',name:'否'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="车道" name="lane">
        <lane-tab
          ref="laneTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
<!--      <el-tab-pane label="机构" name="mobile">-->
<!--        <org-tab-->
<!--          ref="orgTab"-->
<!--          :query-params="queryParams"-->
<!--        />-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import laneTab from "./components/laneTab";
  import orgTab from "@/views/pro/devops/remoteConfig/components/orgTab";

  export default {
    name: "param.downConfig.paramDownConfig",
    components:{tiSysOrg,TiSelect,TiDate,laneTab,orgTab},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          moduleType:'param',
          model: 'lane',
          sysOrgIdStr: '',
          sysOrgIdStr_lane:'',
          devopsUse:''
        },
        activeTab:''
      }
    },
    created() {
      this.activeTab = 'lane';
    },
    methods:{
      getData() {
        if (this.queryParams.model == 'lane') {
          this.queryParams.sysOrgIdStr = this.queryParams.sysOrgIdStr_lane;
          this.$refs.laneTab.searchData();
        }
        // else if (this.queryParams.model == 'mobile') {
        //   this.queryParams.sysOrgIdStr = '';
        //   this.$refs.orgTab.searchData();
        // }
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
