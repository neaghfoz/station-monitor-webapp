<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.activeName" type="card"  @tab-click="handleClick">
      <el-tab-pane label="路段" name="road"></el-tab-pane>
      <el-tab-pane label="收费站" name="station"></el-tab-pane>
      <el-tab-pane label="特情类型" name="special"></el-tab-pane>
      <el-tab-pane label="时间" name="time"></el-tab-pane>
    </el-tabs>
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="是否复核" label-width="100px" prop="recheck" v-show = "tabSelObj.roadFlag || tabSelObj.stationFlag || tabSelObj.timeFlag ">
          <ti-select :clearable="false" style="width: 177px" v-model="queryParams.recheck"
                     dict-type="tibms_audit_recheck"/>
        </el-form-item>
        <el-form-item label="特情类型" prop="specialTypeSelect" v-show = "tabSelObj.roadFlag || tabSelObj.stationFlag || tabSelObj.timeFlag">
          <ti-select style="width: 177px" v-model="queryParams.specialTypeSelect"
                     url="/api/v1/common/dict/dictList/tibms_audit_exSpecialType"
                     :props="{key:'vkey',value:'vkey',label:'vname'}"
                     :watch-attr="queryParams.recheck"
                     :watch-attr-fn="watchAttrFn"/>
        </el-form-item>

        <el-form-item label="机构" prop="sysOrgIdStr" v-show="tabSelObj.stationFlag" >
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2"/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr" v-show="tabSelObj.timeFlag || tabSelObj.specialTypeFlag" >
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="4"/>
        </el-form-item>

        <el-form-item label="出入口类型" prop="inOutType"  >
          <ti-select v-model="queryParams.inOutType" dict-type="tibms_com_inOutType" :clearable="false"/>
        </el-form-item>
        <el-form-item label="时间范围" prop="dateStatisticType">
          <ti-select v-model="queryParams.dateStatisticType"
                     :clearable = "false"
                     dict-type="tibms_rpt_dateStatisticType"/>

        </el-form-item>
        <el-form-item prop="dates">
          <el-col :span="30">
            <el-form-item v-show="queryParams.dateStatisticType==='day'">
              <el-form-item prop="startDay" v-show="false"/>
              <el-form-item prop="endDay" v-show="false"/>
              <ti-date-range date-style="width:293px" ref="dayRang" :editable="false"
                             dateRule="oneMonth"
                             v-model="queryParams"
                             date-type="daterange"
                             format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                             end-key="endDay"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='month'">
              <el-form-item prop="startMonth" v-show="false"/>
              <el-form-item prop="endMonth" v-show="false"/>
              <ti-date-range ref="monthRang" date-style="width:293px" :editable="false"
                             dateRule="oneYear"
                             v-model="queryParams"
                             date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
            <el-form-item v-show="queryParams.dateStatisticType==='year'">
              <el-form-item prop="startYear" v-show="false"/>
              <el-form-item prop="endYear" v-show="false"/>
              <ti-date-range ref="yearRang" date-style="width:293px" :editable="false"
                             v-model="queryParams"
                             date-type="yearRang"
                             format="yyyy" value-format="yyyy" begin-key="startYear"
                             end-key="endYear"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="统计类型" prop="specialAnalyseType" v-show="this.queryParams.showDefault == 'chart' || tabSelObj.roadFlag == true || tabSelObj.stationFlag == true" >
          <ti-select v-model="queryParams.specialAnalyseType"  dict-type="tibms_analyse_specialAnalyseType"   :clearable="false"   />
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>

        <el-row>
          <el-form-item label="图表方式">
            <el-radio-group v-model="queryParams.showDefault" size="mini" @change="showChange">
              <el-radio label="table" border style="margin-right:10px;line-height:0px!important">表格</el-radio>
              <el-radio label="chart" border style="margin-right:10px;line-height:0px!important">图表</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>

      <!-- 数据表格 -->
      <vxe-grid v-show="queryParams.showDefault=='table'"
                ref="appTable"
                highlight-hover-row
                border
                resizable
                sync-resize
                auto-resize
                keep-source
                highlight-current-row
                max-height="500"
                class="vxe-table-element"
                :export-config="{}"
                :toolbar="tableToolbar"
                @toolbar-button-click="toolbarEvent"
                :loading="table.loading"
                :columns="table.columns"
                :data="table.datas"
      >
      </vxe-grid>
      <div ref="myChart" style="height:500px;" v-show="queryParams.showDefault=='chart'"></div>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import tableOption from "@/views/pro/analyse/special/station/tableOption"
  import {getData} from "./stationSpecialApi"
  import moment from "moment"
  import chartOption from "@/views/pro/analyse/special/station/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import dictUtils from 'ecip-web/utils/dictUtils';

  export default {
    name: "analyse.special.station.stationSpecialView.vue",
    mixins: [...mixin],
    components: {TiSelect,TiDateRange,TiSelectTree,tiSysOrg},
    data() {
      return {
        tableToolbar: {
          buttons: [
            { code: 'excelExport', icon: 'fa fa-download'}
          ]
        },
        //tab 选择对象封装
        tabSelObj: {
          //切换标识，与tab 对应
          roadFlag: true,
          stationFlag: false,
          specialTypeFlag: false,
          timeFlag: false,
          //重置方法
          reset :function(){
            this.roadFlag = false;
            this.stationFlag = false;
            this.specialTypeFlag = false;
            this.timeFlag = false ;
          }
        },
        vehicleFlag: false,
        transTypeFlag: false,
        //切换标识，与tab 对应
        roadFlag: true,
        stationFlag: false,
        specialTypeFlag: false,
        timeFlag: false,
        specialAnalyseType: '',
        inOutType: '',
        queryParams:{
          showDefault: 'table', // table chart
          activeName: 'road',
          sysOrgIdStr: '',
          dateStatisticType: 'day',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          recheck: '1',
          specialTypes: '',
          specialTypeSelect: '',
          specialAnalyseType:'',
          inOutType: '',
        },
        rules: {
          sysOrgIdStr: { type: 'string', required: true, message: '' }
        },
        dataSource:[],
        gantryId: '', // 按门架统计标记
        gantryMap:{}, // 门架键值对
        // 表格配置
        table:{
          loading: false,
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'left',
            pageSizes: [10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
              'Total'],
            perfect: true
          },
          datas: [],
          columns:[]
        },
        tableToolbar: {
          buttons: [
            {code: 'excelExport', icon: 'fa fa-download'}
          ]
        },
      }
    },
    created() {
      //默认显示
      this.queryParams.activeName = 'road';
      this.queryParams.showDefault = 'table';
      this.queryParams.specialAnalyseType = '1';
      this.queryParams.inOutType = '2';
      this.showChange();
    },
    computed:{
      // columns(){
      //
      //   return tableOption.getColums(this.queryParams.activeName, this.table.specialColumns);
      // }
    },
    mounted(){
      //调试使用，用于控制台输出
      //window.vue = this;
      // 初始化图表
      chartOption.init(this.$refs['myChart'])
      this.submit()
    },
    methods: {
      handleClick(tab, event) {
        this.showChange();
      },
      showChange(){
        /**
         * 切换tab
         * 1.
         * @type {string}
         */

        let showDefault = this.queryParams.showDefault;
        let activeName = this.queryParams.activeName;
        //重置
        this.tabSelObj.reset();
        switch (activeName) {
          case 'road':
            this.tabSelObj.roadFlag = true;
            break;
          case 'station':
            this.tabSelObj.stationFlag = true;
            break;
          case 'special':
            this.tabSelObj.specialTypeFlag = true;
            break;
          case 'time':
            this.tabSelObj.timeFlag = true;
            break;
          default:
        }
        //图表切换
        this.queryParams.specialTypeSelect = '';

        this.reload();
      },
      async reload(isCache){
        let dateTrans = {};
        if(this.queryParams.dateStatisticType==='day')
        {
          dateTrans = dateUtil.dateCombination(this.queryParams.startDay,this.queryParams.endDay,this.queryParams.dateStatisticType);
        } else if(this.queryParams.dateStatisticType==='month')
        {
          dateTrans = dateUtil.dateCombination(this.queryParams.startMonth,this.queryParams.endMonth,this.queryParams.dateStatisticType);
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        //console.log("dateTrans" + JSON.stringify(dateTrans));

        console.log("specialTypeSelect" ,this.queryParams.specialTypeSelect);
        console.log("specialTypes" ,this.queryParams.specialTypes);

        //多选特情

        this.queryParams.specialTypes = '';
        if (this.queryParams.activeName === 'road'  || this.queryParams.activeName === 'station' || this.queryParams.activeName === 'time'  ) {
          this.queryParams.specialTypes = this.queryParams.specialTypeSelect;
        }


        this.table.datas = []
        // 远程获取数据
        if(!isCache){
          this.table.loading = true
          //console.log("this.queryParams.activeName:",this.queryParams.activeName)

          let param = {};
          Object.assign(param,this.queryParams);
          if(this.queryParams.activeName === 'road' ){
            param.sysOrgIdStr='';
          }
          const res = await getData (param);
          if(res.code==200){
            this.dataSource = res.data
          }
          this.table.loading = false
        }
        if(this.queryParams.showDefault=='table'){
          // 替换数据源

          //this.table.datas = tableOption.getTableDatas(this.table.datas);
          this.table.columns = this.dataSource.columns;
          this.table.columns = tableOption.getColums(this.queryParams.activeName, this.queryParams.specialAnalyseType, this.table.columns );
          this.table.datas = this.dataSource.datas

        }else{
          //console.log("datas",this.dataSource.datas);
          chartOption.show(this.dataSource.datas, this.queryParams.activeName, this.queryParams.specialAnalyseType);




          // let datas = this.dataSource.chart
          // let kpiTypeList = dictUtils.getDictList("tibms_analyse_station_kpiType");
          // //图表显示seriname
          // let kpiTypeName ;
          // for(var i=0 ; i < kpiTypeList.length ; i++ ){
          //   if (kpiTypeList[i].value == this.queryParams.kpiType ) {
          //     kpiTypeName = kpiTypeList[i].label;
          //     break;
          //   }
          // }
          // this.$nextTick(() => {
          //   chartOption.show(datas,this.queryParams.activeName,kpiTypeName)
          //
          // })
          //  chartOption.show( this.dataSource.chart)
        }
      },
      submit() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.reload()
          } else {
            return false;
          }
        })
      },
      toolbarEvent({code}) {
        switch (code) {
          case 'excelExport':
            this.export()
            break
        }
      },
      export() {
        tableOption.export(this.$refs.appTable, '收费站特情分析')
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        this.submit()
      },
      orgChange(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      reset() {
        this.$refs['search-form'].resetFields()
      },
      watchAttrFn(newVal, oldVal, selectData) {
        let selectDataShow = [];
        let specalTypes = [];
        //改变下拉列表
        if (newVal) {
          selectData.forEach(x => {
            if ((',' + newVal + ',').indexOf(',' + x.extra + ',') > -1) {
              selectDataShow.push(x)
              specalTypes.push(x.vkey);
            }
          });
        } else {
          selectDataShow = selectData;
          selectData.forEach(x => {
            specalTypes.push(x.vkey);
          });
        }
        this.queryParams.specialTypes = specalTypes.join(',');
        return selectDataShow;
      }
    }
  }
</script>

<style scoped>
  /*  .el-form-item /deep/ .el-range-editor {
      width: 518px !important;
    }*/
</style>
