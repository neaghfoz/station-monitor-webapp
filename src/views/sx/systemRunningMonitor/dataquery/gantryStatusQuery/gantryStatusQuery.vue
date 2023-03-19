<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.activeName" type="card"  @tab-click="handleClick">
      <!-- <el-tab-pane label="路段" name="road"></el-tab-pane> -->
      <el-tab-pane label="收费站" name="station"></el-tab-pane>
      <!-- <el-tab-pane label="时间" name="time"></el-tab-pane> -->
    </el-tabs>
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr" v-show="stationFlag" >
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2"/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr" v-show="timeFlag" >
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="4"/>
        </el-form-item>

        <!-- <el-form-item label="时间范围" prop="dateStatisticType">
          <ti-select v-model="queryParams.dateStatisticType"
                     :clearable = "false"
                     dict-type="tibms_rpt_dateStatisticType"/>

        </el-form-item> -->
        <!-- <el-form-item prop="dates">
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
        </el-form-item> -->

        <!-- <el-form-item label="统计类型" prop="kpiType" v-show="kpiTypeFlag" >
          <ti-select v-model="queryParams.kpiType"  dict-type="tibms_analyse_station_kpiType" placeholder="全部"  :clearable="false"   />
        </el-form-item> -->
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>

        <!-- <el-row>
          <el-form-item label="图表方式">
            <el-radio-group v-model="queryParams.showDefault" size="mini" @change="showChange">
              <el-radio label="table" border style="margin-right:10px;line-height:0px!important">表格</el-radio>
              <el-radio label="chart" border style="margin-right:10px;line-height:0px!important">图表</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row> -->
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
                @page-change="handlePageChange"
                :start-index="(table.page.currentPage - 1) * table.page.pageSize"
                :pager-config="table.page"
                :loading="table.loading"
                :columns="columns"
                :data="table.datas"
                :span-method="mergeRowMethod"
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
  import tableOption from "@/views/sx/systemRunningMonitor/dataquery/gantryStatusQuery/tableOption"
  import {getData, findPage} from "./gantryStatusQueryApi"
  import moment from "moment"
  import chartOption from "@/views/sx/systemRunningMonitor/dataquery/gantryStatusQuery/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import dictUtils from 'ecip-web/utils/dictUtils';

  export default {
    name: "systemRunningMonitor.dataquery.gantryStatusQuery.vue",
    mixins: [...mixin],
    components: {TiSelect,TiDateRange,TiSelectTree,tiSysOrg},
    data() {
      return {
        tableToolbar: {
          buttons: [
            { code: 'excelExport', icon: 'fa fa-download'}
          ]
        },
        vehicleFlag: false,
        transTypeFlag: false,
        sysOrgFlag: false,
        stationFlag: false,
        kpiTypeFlag: true,
        vehicleFlagTmp: 'vehicleType',
        roadFlag: false,
        timeFlag: false,
        queryParams:{
          showDefault: 'table', // table chart
          activeName: 'road',
          sysOrgIdStr: '',
          dateStatisticType: 'day',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          kpiType:''
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
          datas: []
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
      this.queryParams.activeName = 'station';
      this.queryParams.showDefault = 'table';
      this.queryParams.kpiType = '1';
      this.showChange();
    },
    computed:{
      columns(){
        return tableOption.getColums(this.queryParams.activeName);
      }
    },
    mounted(){
      // 初始化图表
      chartOption.init(this.$refs['myChart'])
      this.submit()
    },
    methods: {
      handleClick(tab, event) {
        this.showChange();
      },
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.queryParams.current = currentPage
        this.queryParams.size = pageSize
        this.getPageData()
      },
      async getPageData(){
        this.table.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.table.page.pageSize, current: this.table.page.currentPage}), this.queryParams)
        this.table.datas= data.records
        this.table.total = data.total
        this.table.loading = false
      },
      showChange(){
        let showDefault = this.queryParams.showDefault;
        let activeName = this.queryParams.activeName;
        if (activeName === 'road' ) {
          this.stationFlag= false;
          this.timeFlag= false;
          this.sysOrgFlag = false;
          //this.queryParams.sysOrgIdStr = '';
        } else if (activeName === 'station' ) {
          this.stationFlag= true;
          this.timeFlag= false;
        } else if (activeName === 'time') {
          this.sysOrgFlag = true;
          this.stationFlag= false;
          this.timeFlag= true;
        }

        if (showDefault == 'chart') {
          this.kpiTypeFlag =true;
        } else {
          this.kpiTypeFlag =false;
        }


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
          console.log(res)
          if(res.code==200){
            this.dataSource = res.data
            this.table.page.total = res.data.total
          }
          this.table.loading = false
        }
        if(this.queryParams.showDefault=='table'){
          for(var i=0;i<this.dataSource.records.length;i++){
            var item = this.dataSource.records[i];
            if(item.laneSign == 1){ //入口
              item['enCount'] = item.vehCount;
              item['enListRate'] = (item.successCount / item.vehCount * 100).toFixed(2) + "%";
              item['enPlateRate'] = (item.vehPlateCount / item.vehCount * 100).toFixed(2) + "%";
              item['exCount'] = 0;
              item['exListRate'] = "0%";
              item['exPlateRate'] = "0%";
            } else {
              item['exCount'] = item.vehCount;
              item['exListRate'] = (item.successCount / item.vehCount * 100).toFixed(2) + "%";
              item['exPlateRate'] = (item.vehPlateCount / item.vehCount * 100).toFixed(2) + "%";
              item['enCount'] = 0;
              item['enListRate'] = "0%";
              item['enPlateRate'] = "0%";
            }
          }
          // 替换数据源
          this.table.datas = this.dataSource.records
        }else{
          let datas = this.dataSource.chart
          let kpiTypeList = dictUtils.getDictList("tibms_analyse_station_kpiType");
          //图表显示seriname
          let kpiTypeName ;
          for(var i=0 ; i < kpiTypeList.length ; i++ ){
            if (kpiTypeList[i].value == this.queryParams.kpiType ) {
              kpiTypeName = kpiTypeList[i].label;
              break;
            }
          }
          this.$nextTick(() => {
            chartOption.show(datas,this.queryParams.activeName,kpiTypeName)

          })
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
        tableOption.export(this.$refs.appTable, '收费站性能指标统计')
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        //this.submit()
      },
      orgChange(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      reset() {
        this.$refs['search-form'].resetFields();
        this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      mergeRowMethod ({ row, rowIndex, column, data }) {
        //对路段和收费站列做合并
      //  if(column.property != 'roadName'){return}
        const fields = this.queryParams.activeName == 'road' ? 'roadName' : ['roadName','stationName']

        const cellValue = XEUtils.get(row, column.property)

        if (cellValue && fields.includes(column.property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  /*  .el-form-item /deep/ .el-range-editor {
      width: 518px !important;
    }*/
</style>
