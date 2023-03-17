<template>
  <div class="app-container">
    <h3>收费站监测</h3>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <div class="text item">
              在线车道数：{{dataSource.onlineLaneNum}}
            </div>
            <div class="text item">
              离线车道数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              车道总数：{{dataSource.laneNum}}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>当日数据</span>
            </div>
            <div class="text item">
              入口流水数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              出口流水数：{{dataSource.offlineLaneNum}}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>报警信息</span>
            </div>
            <div class="text item">
              当日报警：{{dataSource.offlineLaneNum}}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    

    
    <h3>门架监测</h3>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <div class="text item">
              在线门架数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              离线门架数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              门架总数：{{dataSource.offlineLaneNum}}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>当日数据</span>
            </div>
            <div class="text item">
              计费流水数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              牌识流水数：{{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
              滞留流水数：{{dataSource.offlineLaneNum}}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>报警信息</span>
            </div>
            <div class="text item">
              当日报警： {{dataSource.offlineLaneNum}}
            </div>
            <div class="text item">
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>



  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import tableOption from "@/views/sx/systemRunningMonitor/summarymonitor/tableOption"
  import {getData} from "./summaryMonitorApi"
  import moment from "moment"
  import chartOption from "@/views/sx/systemRunningMonitor/summarymonitor/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import dictUtils from 'ecip-web/utils/dictUtils';

  export default {
    name: "systemRunningMonitor.summaryMonitor.vue",
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
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  /* .box-card {
    width: 480px;
  } */

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  @media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
