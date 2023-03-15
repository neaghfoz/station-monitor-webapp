<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
<!--      <el-form-item label="路段">-->
<!--        <ti-select-->
<!--          v-model="queryParams.roadNos"-->
<!--          url="api/v1/monitor/common/road/use"-->
<!--          :props="{key:'roadId',value:'roadNo',label:'roadText'}"-->
<!--          multiple-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="收费站">-->
<!--        <ti-select-->
<!--          v-model="queryParams.stationNos"-->
<!--          url="api/v1/monitor/common/station/use"-->
<!--          :props="{key:'stationId',value:'stationNo',label:'stationText'}"-->
<!--          :watch-attr="queryParams.roadNos"-->
<!--          :watch-attr-fn="watchAttrFn"-->
<!--          multiple-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
      </el-form-item>
      <el-form-item label="出入口类型" prop="inOutTypes">
        <ti-select v-model="queryParams.inOutTypes" dict-type="tibms_com_inOutType"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item label="车道类型" prop="laneTypes">
        <ti-select v-model="queryParams.laneTypes" dict-type="tibms_com_laneType" :multiple="true"/>
      </el-form-item>
      <el-form-item label="车道号" prop="laneNo">
        <el-input v-model="queryParams.laneNo" type="text" placeholder="车道号" maxlength="5"
                  oninput="value=value.replace(/[^\d]/g, '')"/>
      </el-form-item>
      <el-form-item label="通行交易日期">
        <el-col :span="12">
          <ec-date v-model="queryParams.transDate"/>
        </el-col>
      </el-form-item>
      <el-form-item label="数据类型" prop="listCodes">
        <ti-select v-model="queryParams.listCodes" dict-type="tibms_mo_listCode" :multiple="true"/>
      </el-form-item>
      <el-form-item label="车道滞留数" prop="laneRetainCnts">
        <ti-select v-model="queryParams.laneRetainCnts" dict-type="tibms_mo_retainCnt"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item label="站-部滞留数" prop="depRetainCnts">
        <ti-select v-model="queryParams.depRetainCnts" dict-type="tibms_mo_retainCnt"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item label="站-路滞留数" prop="roadRetainCnts" v-show="showRoadPro">
        <ti-select v-model="queryParams.roadRetainCnts" dict-type="tibms_mo_retainCnt"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item label="路-省滞留数" prop="roadSendProRetainCnts" v-show="showRoadPro">
        <ti-select v-model="queryParams.roadSendProRetainCnts" dict-type="tibms_mo_retainCnt"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item label="站-省滞留数" prop="stationSendProRetainCnts" v-show="showStationPro">
        <ti-select v-model="queryParams.stationSendProRetainCnts" dict-type="tibms_mo_retainCnt"
                   :multiple="true"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getUploadData">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-button type="success" v-permission="['dataUploadIntegrality:exportExcel']"
                     @click="exportExcel.dialog = true">导出
          </el-button>
          <el-tab-pane label="通行交易数据" v-model="transDataParams" name="transData">
            <trans-data-tab
              ref="transDataTab"
              :trans-data-query-params="transDataParams"
              :model-flag="queryParams.modelFlag"
              @pageChang="pageChang"
            />
          </el-tab-pane>
          <el-tab-pane label="其它数据" v-model="otherDataParams" name="otherData">
            <other-data-tab
              ref="otherDataTab"
              :other-data-query-params="otherDataParams"
              :model-flag="queryParams.modelFlag"
              @pageChang="pageChang"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <ti-export-excel v-model="exportExcel" :exportExcel="exportExcel"
                     :page="page"></ti-export-excel>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import otherDataTab from "./components/otherDataTab";
  import transDataTab from "./components/transDataTab";
  import toFixedNumber from 'xe-utils/methods/number/toFixedNumber';
  import commafy from 'xe-utils/methods/number/commafy';
  import toDateString from 'xe-utils/methods/date/toDateString';
  import dictUtils from 'ecip-web/utils/dictUtils';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";


  export default {
    name: 'systemRunningMonitor.datamonitor.dataUploadIntegrality.dataUploadIntegralityView',
    mixins: [...mixin],
    components: {TiSelect, TiExportExcel, otherDataTab, transDataTab,tiSysOrg},
    data() {
      return {
        showRoadPro: false,
        showStationPro: false,
        queryParams: {
          sysOrgIdStr:'',
          roadNos: '',
          stationNos: '',
          inOutTypes: '',
          laneTypes: '',
          laneNo: '',
          transDate: XEUtils.toDateString(new Date(), 'yyyy-MM-dd'),
          listCodes: '',
          laneRetainCnts: '',
          depRetainCnts: '',
          roadRetainCnts: '',
          roadSendProRetainCnts: '',
          stationSendProRetainCnts: '',
          modelFlag: '',
          searchDataType: ''
        },
        exportExcel: {
          url: '',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        activeName: 'transData',
        otherDataParams: {},
        transDataParams: {},
        uploadData: [],
        page: {},
      }

    },
    watch: {},
    created() {
      //获取当前系统传输模式
      this.queryParams.modelFlag = dictUtils.getDictLabel("tibms_config", "mo_dataMonitorModel")
      /*   console.log("modelFlag:",this.queryParams.modelFlag)*/
      if (this.queryParams.modelFlag === 'stationPro') {
        this.exportExcel.url = 'api/v1/monitor/dataUploadIntegrality/exportStationProExcel'
        this.showStationPro = true
        this.showRoadPro = false
      } else if (this.queryParams.modelFlag === 'roadPro') {
        this.exportExcel.url = 'api/v1/monitor/dataUploadIntegrality/exportRoadProExcel'
        this.showRoadPro = true
        this.showStationPro = false
      }
      this.activeName = "transData"
      this.queryParams.searchDataType = this.activeName
      this.transDataParams = this.queryParams
      this.exportExcel.queryParams = this.queryParams
    },
    methods: {
      handleClick(tab, event) {
        this.queryParams.searchDataType = tab.name
        if (tab.name === 'transData') {
          this.transDataParams = this.queryParams
          this.$refs.transDataTab.getTransData()
        } else if (tab.name === 'otherData') {
          this.otherDataParams = this.queryParams
          this.$refs.otherDataTab.getOtherData()
        }
        this.exportExcel.queryParams = this.queryParams
      },
      getUploadData() {
        if (this.queryParams.listCodes == 'STATIONENCOUNT' || this.queryParams.listCodes
          == 'STATIONEXCOUNT'
          || this.queryParams.listCodes == 'STATIONENCOUNT,STATIONEXCOUNT' ||
          this.queryParams.listCodes == 'STATIONEXCOUNT,STATIONENCOUNT') {
          this.activeName = "otherData"
          this.otherDataParams = this.queryParams
          this.$refs.otherDataTab.searchData();
        } else {
          this.activeName = "transData"
          this.otherDataParams = this.queryParams
          this.$refs.transDataTab.searchData();
        }
        this.queryParams.searchDataType = this.activeName
        this.exportExcel.queryParams = this.queryParams

      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        this.queryParams.transDate = XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
        //this.getUploadData()
      },
      pageChang(page) {
        console.log("page:", page)
        this.page = page
      },
      watchAttrFn(newVal, oldVal, selectData) {
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

      }
    }
  }
</script>

<style scoped>

</style>
