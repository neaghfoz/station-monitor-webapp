<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.activeName" type="card"  @tab-click="handleClick">
      <el-tab-pane label="收费站报警信息" name="station"></el-tab-pane>
      <el-tab-pane label="门架报警信息" name="gantry"></el-tab-pane>
      <!-- <el-tab-pane label="车型趋势" name="vehicleTypeTrend"></el-tab-pane>
      <el-tab-pane label="车种趋势" name="vehicleClassTrend"></el-tab-pane> -->
      <!-- <el-tab-pane label="路段" name="road"></el-tab-pane>
      <el-tab-pane label="收费站" name="station"></el-tab-pane> -->

<!--      <el-tab-pane label="时间" name="time"></el-tab-pane>-->
    </el-tabs>
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
<!--        <el-form-item label="机构" prop="sysOrgIdStr" v-show="sysOrgFlag">-->
<!--          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>-->
<!--        </el-form-item>-->
        <el-form-item label="机构" prop="sysOrgIdStr_station" v-show="stationSysOrgFlag">
          <ti-sys-org ref="stationSysOrg" v-model="queryParams.sysOrgIdStr_station" default-first-value/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_road" v-show="roadSysOrgFlag">
          <ti-sys-org ref="roadSysOrg" v-model="queryParams.sysOrgIdStr_road" default-first-value show-level="2"/>
        </el-form-item>
<!--        <el-form-item label="时间范围" prop="dateStatisticType">-->
<!--          <ti-select v-model="queryParams.dateStatisticType"-->
<!--                     :clearable = "false"-->
<!--                     dict-type="tibms_rpt_dateStatisticType"/>-->

<!--        </el-form-item>-->
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
        <!-- <el-form-item label="车型/车种" prop="vehicleFlag" v-show="vehicleFlag" >
          <el-select v-model="queryParams.vehicleFlagStr">
            <el-option value="vehicleType" label="车型"/>
            <el-option value="vehicleClass" label="车种"/>
          </el-select>
          <el-form-item prop="vehicleType" v-show="queryParams.vehicleFlagStr === 'vehicleType'">
            <ti-select v-model="queryParams.vehicleTypeStr" dict-type="tibms_com_vehicleType"
                       placeholder="全部"/>
          </el-form-item>
          <el-form-item prop="vehicleClass"  v-show="queryParams.vehicleFlagStr === 'vehicleClass'">
            <ti-select v-model="queryParams.vehicleClassStr" dict-type="tibms_com_vehicleClass"
                       placeholder="全部"/>
          </el-form-item>
        </el-form-item> -->

        <el-form-item label="交易类型" prop="transType" v-show="transTypeFlag" >
          <ti-select v-model="queryParams.transType" dict-type="tibms_analyse_transType" placeholder="全部" />
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
<!--        <el-row>-->
<!--          <el-form-item label="图表方式">-->
<!--            <el-radio-group v-model="queryParams.showDefault" size="mini" @change="showChange">-->
<!--              <el-radio label="table" border style="margin-right:10px;line-height:0px!important">表格</el-radio>-->
<!--              <el-radio label="chart" border style="margin-right:10px;line-height:0px!important">图表</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
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
  import tableOption from "@/views/sx/systemRunningMonitor/alarmmanage/tollGantry/tableOption"
  import {getData} from "./tollGantryApi"
  import moment from "moment"
  import chartOption from "@/views/sx/systemRunningMonitor/alarmmanage/tollGantry/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
// import { forEach } from 'mock/user';

  export default {
    name: "systemRunningMonitor.alarmmanage.tollGantryView.vue",
    mixins: [...mixin],
    components: {TiSelect,TiDateRange,TiSelectTree,tiSysOrg},
    data() {
      return {
        vehicleFlag: false,
        transTypeFlag: false,
        // sysOrgFlag: false,
        stationSysOrgFlag:false,
        roadSysOrgFlag:false,
        vehicleFlagTmp: 'vehicleType',
        queryParams:{
          showDefault: 'table', // table chart
          activeName: 'road',
          // sysOrgIdStr: '',
          dateStatisticType: 'day',
          startDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endDay: dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          vehicleFlagStr:'',
          vehicleTypeStr:'',
          vehicleClassStr:'',
          transType:''
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
      this.queryParams.activeName = 'station';
      this.queryParams.showDefault = 'table';
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
        if (activeName === 'road') {
          this.stationSysOrgFlag = false;
          this.roadSysOrgFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
          if (this.queryParams.vehicleFlagStr != '') {this.vehicleFlagTmp = this.queryParams.vehicleFlagStr;}
          this.queryParams.vehicleFlagStr = showDefault == 'table' ? '' : this.vehicleFlagTmp;
        }else if(activeName === 'station'){
          this.stationSysOrgFlag = false;
          this.roadSysOrgFlag = true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
          if (this.queryParams.vehicleFlagStr != '') {this.vehicleFlagTmp = this.queryParams.vehicleFlagStr;}
          this.queryParams.vehicleFlagStr = showDefault == 'table' ? '' : this.vehicleFlagTmp;
        } else if (activeName === 'vehicleType' || activeName === 'vehicleClass') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = false;
          if (this.queryParams.vehicleFlagStr != '') {this.vehicleFlagTmp = this.queryParams.vehicleFlagStr;}
          this.queryParams.vehicleFlagStr = '';
        } else if (activeName === 'time') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = true;
          this.queryParams.vehicleFlagStr = this.vehicleFlagTmp;
        } else if (activeName === 'vehicleClassTrend') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = true;
          this.queryParams.vehicleFlagStr = this.vehicleFlagTmp;
        } else if (activeName === 'vehicleTypeTrend') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = true;
          this.queryParams.vehicleFlagStr = this.vehicleFlagTmp;
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

        this.table.datas = []
        // 远程获取数据
        if(!isCache){
          this.table.loading = true
          console.log("this.queryParams.activeName:",this.queryParams.activeName)

          let param = {};
          Object.assign(param,this.queryParams);
          if(this.queryParams.activeName === 'road'){
            param.sysOrgIdStr='';
          }else if(this.queryParams.activeName === 'station'){
            param.sysOrgIdStr = param.sysOrgIdStr_road
          }else{
            param.sysOrgIdStr=param.sysOrgIdStr_station;
          }
          if(param.vehicleFlagStr !='vehicleType'){
            param.vehicleTypeStr='';
          }
          if(param.vehicleFlagStr !='vehicleClass'){
            param.vehicleClassStr='';
          }
          if(this.queryParams.activeName =='vehicleClass' || this.queryParams.activeName =='vehicleClassTrend'){
            param.vehStatisticType='vehClass';
          }
          if(this.queryParams.activeName =='vehicleType' || this.queryParams.activeName =='vehicleTypeTrend'){
            param.vehStatisticType='vehType';
          }
          if(this.queryParams.activeName =='vehicleClassTrend' || this.queryParams.activeName =='vehicleTypeTrend'){
            param.trend='true';
            // param.startDate = dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
            // param.endDate = dateUtil.getNextDate(new Date(), 'days', 0, 'YYYY-MM-DD')
            this.queryParams.startDate = "2022-09-01";
            this.queryParams.endDate = "2022-09-02";
          }else {
            param.trend ='false';
          }
          
          console.log("param:",param)
          return;
          const res = await getData (param);
          if(res.code==200){
            
            this.dataSource = res.data

          }
          this.table.loading = false
        }
        if(this.queryParams.showDefault=='table'){
          if(this.dataSource.activeName == "vehicleType") {
            for(let i=0;i<this.dataSource.records.length;i++){
              this.checkVehicleType(this.dataSource.records[i])
            }
            this.table.datas = this.dataSource.records
          }
          if(this.dataSource.activeName == "vehicleClass") {
            for(let i=0;i<this.dataSource.records.length;i++){
              this.checkVehicleClass(this.dataSource.records[i])
            }
            this.table.datas = this.dataSource.records
          }
          // 替换数据源
          //判断车型/车种/车型趋势/车种趋势
          if(this.dataSource.activeName =='vehicleClassTrend' || this.dataSource.activeName =='vehicleTypeTrend') {
            var xdata = []
            for(let i=0; i<this.dataSource.records.length; i++) {
              var todayData = this.dataSource.records[i]
              var yesterdayData = this.dataSource.records[i].yesterdayData
              var compareData = {}
              if(this.dataSource.activeName == "vehicleClassTrend"){
                this.checkVehicleClass(yesterdayData)
                this.checkVehicleClass(todayData)
                this.checkVehicleClass(compareData)
              }else {
                this.checkVehicleType(yesterdayData)
                this.checkVehicleType(todayData)
                this.checkVehicleType(compareData)
              }
              
              Object.assign(compareData,yesterdayData);
              // 创建一个新的对象，里面的字段和yesterdayData一样，值是todayData的值除以yesterdayData的值的百分比
              for(var key in yesterdayData){
                if(key == 'naturalDate') {
                  compareData[key] = '对比'
                }
                if(key != 'delFlag' && key != 'authRoadCol' && key != 'authStationCol' && key != 'naturalDate' && key != 'roadNo' && key != 'roadName' && key != 'stationName'){
                  if(yesterdayData[key] == 0){
                    compareData[key] = '0%'
                    continue
                  }
                  compareData[key] = (todayData[key] / yesterdayData[key] * 100).toFixed(2) + '%'
                }
              }
              todayData['naturalDate'] = '今天'
              yesterdayData['naturalDate'] = '昨天'
              
              xdata.push(yesterdayData)
              xdata.push(todayData)
              xdata.push(compareData)
            }
            this.table.datas = xdata
          }
        }else{
          let datas = this.dataSource.chart
          this.$nextTick(() => {
            chartOption.show(datas,this.queryParams.activeName)
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
      //检查是否没有该字段，没有则添加并设置为0
      checkField(data,field){
        if(!data.hasOwnProperty(field)){
          data[field] = 0
        }
      },
      //车型字段检查
      checkVehicleType(data){
        this.checkField(data,'tollFeeType1')
        this.checkField(data,'tollFeeType2')
        this.checkField(data,'tollFeeType3')
        this.checkField(data,'tollFeeType4')
        this.checkField(data,'tollFeeType11')
        this.checkField(data,'tollFeeType12')
        this.checkField(data,'tollFeeType13')
        this.checkField(data,'tollFeeType14')
        this.checkField(data,'tollFeeType15')
        this.checkField(data,'tollFeeType16')
        this.checkField(data,'tollFeeType21')
        this.checkField(data,'tollFeeType22')
        this.checkField(data,'tollFeeType23')
        this.checkField(data,'tollFeeType24')
        this.checkField(data,'tollFeeType25')
        this.checkField(data,'tollFeeType26')
        this.checkField(data,'tollFeeType99')
      },
      //车种字段检查
      checkVehicleClass(data){
        this.checkField(data,'tollFeeClass0')
        this.checkField(data,'tollFeeClass8')
        this.checkField(data,'tollFeeClass10')
        this.checkField(data,'tollFeeClass14')
        this.checkField(data,'tollFeeClass21')
        this.checkField(data,'tollFeeClass22')
        this.checkField(data,'tollFeeClass23')
        this.checkField(data,'tollFeeClass24')
        this.checkField(data,'tollFeeClass25')
        this.checkField(data,'tollFeeClass26')
        this.checkField(data,'tollFeeClass27')
        this.checkField(data,'tollFeeClass28')
      },

      toolbarEvent({code}) {
        switch (code) {
          case 'excelExport':
            this.export()
            break
        }
      },
      export() {
        tableOption.export(this.$refs.appTable, '路段通行费统计')
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        //this.submit()
      },
      orgChange(param1, param2) {
        this.queryParams.sysOrg = param2;
        console.log("param2:",param2)
        console.log("sysOrg:", this.queryParams.sysOrg);
      },
      reset() {
        this.$refs['search-form'].resetFields();
        this.queryParams.sysOrgIdStr_station=this.$refs.stationSysOrg.getDefaultFirstValue();
        this.queryParams.sysOrgIdStr_road=this.$refs.roadSysOrg.getDefaultFirstValue();
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
