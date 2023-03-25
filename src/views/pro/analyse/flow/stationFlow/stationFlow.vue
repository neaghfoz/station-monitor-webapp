<template>
  <div class="app-container" style="height: 100%">
    <div class="container-fluid">
      <el-tabs v-model="queryParams.activeName" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane label="路段" name="road"/>
        <el-tab-pane label="收费站" name="station"/> -->

       <el-tab-pane label="车型" name="vehicleType"/>
       <el-tab-pane label="车种" name="vehicleClass"/>
        <el-tab-pane label="车型趋势" name="vehicleTypeTrend"></el-tab-pane>
        <el-tab-pane label="车种趋势" name="vehicleClassTrend"></el-tab-pane>
<!--        <el-tab-pane label="时间" name="collectDate"/>-->
      </el-tabs>
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr_station" v-show="stationSysOrgFlag">
          <ti-sys-org ref="stationSysOrg" v-model="queryParams.sysOrgIdStr_station" default-first-value/>
        </el-form-item>
        <el-form-item label="机构" prop="sysOrgIdStr_road" v-show="roadSysOrgFlag">
          <ti-sys-org ref="roadSysOrg" v-model="queryParams.sysOrgIdStr_road" default-first-value show-level="2"/>
        </el-form-item>
<!--        <el-form-item label="时间范围" prop="dateStatisticType">-->
<!--          <ti-select v-model="queryParams.dateStatisticType"-->
<!--                     :clearable="false"-->
<!--                     dict-type="tibms_rpt_dateStatisticType"/>-->

<!--        </el-form-item>-->
        <el-form-item prop="dates" v-show="this.queryParams.activeName == 'vehicleType'||this.queryParams.activeName=='vehicleClass'">
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
<!--        <el-form-item label="统计值(纵轴)" v-show="valueXFlag" prop="valueX">-->
          <!--          <el-select v-model="queryParams.valueX" placeholder="全部">-->
          <!--            <el-option value="en" label="入口车流量"/>-->
          <!--            <el-option value="ex" label="出口车流量"/>-->
          <!--            <el-option value="all" label="总车流量"/>-->
          <!--          </el-select>-->

          <!-- <ti-select placeholder="全部" v-model="queryParams.valueX" :data-list="[{value:'en',name:'入口车流量'},{value:'ex',name:'出口车流量'},
                  {value:'all',name:'总车流量'}]" :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item> -->
        <el-form-item label="交易类型" v-show="transTypeFlag" prop="transType">
          <ti-select v-model="queryParams.transType" placeholder="全部"
                     dict-type="tibms_analyse_transType"/>
        </el-form-item>
        <el-form-item label="车型/车种" prop="vehicleFlagStr" v-show="vehicleFlag">
          <el-select v-model="queryParams.vehicleFlagStr">
            <el-option value="vehicleType" label="车型"/>
            <el-option value="vehicleClass" label="车种"/>
          </el-select>
          <el-form-item prop="vehicleTypeStr" v-show="queryParams.vehicleFlagStr === 'vehicleType'" style="margin-left: 10px">
            <ti-select v-model="queryParams.vehicleTypeStr" dict-type="tibms_com_vehicleType"
                       placeholder="全部"/>
          </el-form-item>
          <el-form-item prop="vehicleClassStr" v-show="queryParams.vehicleFlagStr === 'vehicleClass'" style="margin-left: 10px">
            <ti-select v-model="queryParams.vehicleClassStr" dict-type="tibms_com_vehicleClass"
                       placeholder="全部"/>
          </el-form-item>
        </el-form-item>


        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
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

    </div>
    <div class="container-fluid el-col-md-24">
      <!--      <div class="titleCss">{{title}}</div>-->
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
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import moment from "moment";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import tableOption from "@/views/pro/analyse/flow/stationFlow/tableOption";
  import chartOption from "@/views/pro/analyse/flow/stationFlow/chartOption";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: "analyse.flow.stationFlow.stationFlowView",
    mixins: [...mixin],
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    data() {
      return {
        title: '',
        valueXFlag: true,
        transTypeFlag: true,
        vehicleFlag: true,
        sysOrgFlag: false,
        roadSysOrgFlag:false,
        stationSysOrgFlag:false,
        queryParams: {
          activeName: 'road',
          showDefault: 'table',
          valueX: 'all',
          transType: '',
          sysOrgIdStr_station:'',
          sysOrgIdStr_road:'',
          sysOrg: {},
          vehicleFlagStr: 'vehicleType',
          vehicleTypeStr: '',
          vehicleClassStr: '',
          dateStatisticType: 'day',
          startDay: moment(new Date()).format('YYYY-MM-DD'),
          endDay: moment(new Date()).format('YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate: '',
          endDate: '',

        },
        // 表格配置
        table: {
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
        columns: [],
        viewData: []
      }
    },
    created() {
      this.queryParams.activeName = 'vehicleType';
      this.queryParams.showDefault = 'table';
      this.showChange();
      // this.columns = tableOption.getColumn(this.queryParams.activeName);
      // this.title = this.getTitleString(this.queryParams.showDefault);
      // this.$nextTick(async => {
      //     this.getData();
      //   }
      // );
    },
    mounted() {

    },
    computed: {},
    methods: {
      async getData() {
        this.columns = tableOption.getColumn(this.queryParams.activeName);
        this.title = this.getTitleString(this.queryParams.showDefault);
        let dateTrans = {};
        if (this.queryParams.dateStatisticType === 'day') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startDay, this.queryParams.endDay,
            this.queryParams.dateStatisticType);
        } else if (this.queryParams.dateStatisticType === 'month') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startMonth,
            this.queryParams.endMonth, this.queryParams.dateStatisticType);
        } else if (this.queryParams.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startYear,
            this.queryParams.endYear, this.queryParams.dateStatisticType);
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        if (this.queryParams.showDefault === 'table') {
          this.table.loading = true;
          this.table.datas = [];
        }
        let params = {};
        let type = this.queryParams.activeName;
        Object.assign(params, this.queryParams);
        if (type === 'road' ) {
          params.sysOrgIdStr = ''
        } else if(type === 'station'){
          params.sysOrgIdStr = params.sysOrgIdStr_road
        }else if (type === 'vehicleType' || type === 'vehicleClass') {
          params.sysOrgIdStr = params.sysOrgIdStr_station
          params.vehicleFlagStr = '';
          params.vehicleTypeStr = '';
          params.vehicleClassStr = '';
        }else{
          params.sysOrgIdStr = params.sysOrgIdStr_station
        }
        if(this.queryParams.vehicleFlagStr == 'vehicleType'){
          params.vehicleClassStr = '';
        }else if(this.queryParams.vehicleFlagStr == 'vehicleClass'){
          params.vehicleTypeStr = '';
        }
        if(this.queryParams.activeName =='vehicleClass' || this.queryParams.activeName =='vehicleClassTrend'){
          params.vehStatisticType='vehClass';
        }
        if(this.queryParams.activeName =='vehicleType' || this.queryParams.activeName =='vehicleTypeTrend'){
          params.vehStatisticType='vehType';
        }
        if(this.queryParams.activeName =='vehicleClassTrend' || this.queryParams.activeName =='vehicleTypeTrend'){
          params.trend='true';
        }else{
          params.trend='false';
        }
        // param.startDate = dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
        // param.endDate = dateUtil.getNextDate(new Date(), 'days', 0, 'YYYY-MM-DD')
        // params.startDate = "2022-09-01";
        // params.endDate = "2022-09-02";

        await tableOption.getData(type,
          {},
          params);
        if (this.queryParams.showDefault === 'table' && tableOption.returnData.data.records) {
          if(tableOption.returnData.data.activeName == "vehicleType") {
            for(let i=0;i<tableOption.returnData.data.records.length;i++){
              this.checkVehicleType(tableOption.returnData.data.records[i])
            }
            this.table.datas = tableOption.returnData.data.records
          }
          if(tableOption.returnData.data.activeName == "vehicleClass") {
            for(let i=0;i<tableOption.returnData.data.records.length;i++){
              this.checkVehicleClass(tableOption.returnData.data.records[i])
            }
            this.table.datas = tableOption.returnData.data.records
          }
          // 替换数据源
          //判断车型/车种/车型趋势/车种趋势
          if(tableOption.returnData.data.activeName =='vehicleClassTrend' || tableOption.returnData.data.activeName =='vehicleTypeTrend') {
            var xdata = []
            console.log(tableOption.returnData.data.records.length)
            for(let i=0;i<tableOption.returnData.data.records.length;i++){
              var todayData = tableOption.returnData.data.records[i]
              var yesterdayData = tableOption.returnData.data.records[i].yesterdayData
              console.log('i:' + i + '   ' +tableOption.returnData.data.records[i])
              var compareData = {}
              // if(!yesterdayData){
              //   yesterdayData = {}
              //    Object.assign(yesterdayData, todayData)
              // }
              yesterdayData['datePointText'] = todayData['datePointText']
              if(tableOption.returnData.data.activeName == "vehicleClassTrend"){
                this.checkVehicleClass(yesterdayData)
                this.checkVehicleClass(todayData)
              }else {
                this.checkVehicleType(yesterdayData)
                this.checkVehicleType(todayData)
              }
              Object.assign(compareData, yesterdayData)
              // 创建一个新的对象，里面的字段和yesterdayData一样，值是todayData的值除以yesterdayData的值的百分比
              for(var key in yesterdayData){
                if(key == 'naturalDate') {
                  compareData[key] = '对比'
                }
                if(key != 'delFlag' && key != 'authRoadCol' && key != 'authStationCol' && key != 'naturalDate' && key != 'roadNo' && key != 'roadName' && key != 'stationName' &&key!='flowType' &&key!='datePointText'){
                  if(yesterdayData[key] == 0){
                    compareData[key] = '0%'
                    continue
                  }
                  compareData[key] = (todayData[key] / yesterdayData[key] * 100).toFixed(2) + '%'
                }
              }
              todayData['naturalDate'] = '今天'
              yesterdayData['naturalDate'] = '昨天'
              if(yesterdayData) xdata.push(yesterdayData)
              xdata.push(todayData)
              xdata.push(compareData)
            }
            console.log(xdata)
            this.table.datas = xdata
          }
          // this.table.datas = tableOption.returnData.data.records;
          this.table.loading = false;
        }
        if (this.queryParams.showDefault === 'chart' && tableOption.returnData.data.viewData) {
          // 初始化图表
          this.$nextTick(()=>{
            chartOption.init(this.$refs['myChart'],tableOption.returnData.data.viewData, type);
          });
        }

      },
      // orgChange(param1, param2) {
      //   this.queryParams.sysOrg = param2;
      //   console.log("sysOrg:", this.queryParams.sysOrg);
      // },
      handleClick(tab, event) {
        this.showChange();
        // this.getData();
      },
      //检查是否没有该字段，没有则添加并设置为0
      checkField(data,field){
        if(!data.hasOwnProperty(field)){
          data[field] = 0
        }
      },
      //车型字段检查
      checkVehicleType(data){
        this.checkField(data,'vehType1')
        this.checkField(data,'vehType2')
        this.checkField(data,'vehType3')
        this.checkField(data,'vehType4')
        this.checkField(data,'vehType11')
        this.checkField(data,'vehType12')
        this.checkField(data,'vehType13')
        this.checkField(data,'vehType14')
        this.checkField(data,'vehType15')
        this.checkField(data,'vehType16')
        this.checkField(data,'vehType21')
        this.checkField(data,'vehType22')
        this.checkField(data,'vehType23')
        this.checkField(data,'vehType24')
        this.checkField(data,'vehType25')
        this.checkField(data,'vehType26')
        this.checkField(data,'vehType99')
      },
      //车种字段检查
      checkVehicleClass(data){
        this.checkField(data,'vehClass0')
        this.checkField(data,'vehClass8')
        this.checkField(data,'vehClass10')
        this.checkField(data,'vehClass14')
        this.checkField(data,'vehClass21')
        this.checkField(data,'vehClass22')
        this.checkField(data,'vehClass23')
        this.checkField(data,'vehClass24')
        this.checkField(data,'vehClass25')
        this.checkField(data,'vehClass26')
        this.checkField(data,'vehClass27')
        this.checkField(data,'vehClass28')
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      mergeRowMethod({row, rowIndex, column, data}) {
        const fields = this.queryParams.activeName == 'road' ? 'roadName' : ['roadName',
          'stationName']
        const cellValue = XEUtils.get(row, column.property)
        if (cellValue && fields.includes(column.property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
            return {rowspan: 0, colspan: 0}
          } else {
            let countRowspan = 1
            while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return {rowspan: countRowspan, colspan: 1}
            }
          }
        }
      },
      toolbarEvent({code}) {
        switch (code) {
          case 'excelExport':
            this.export()
            break
        }
      },
      export() {
        tableOption.export(this.$refs.appTable, '收费站车流量分析')
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr_station=this.$refs.stationSysOrg.getDefaultFirstValue();
        this.queryParams.sysOrgIdStr_road=this.$refs.roadSysOrg.getDefaultFirstValue();
      },
      showChange() {
        let showDefault = this.queryParams.showDefault;
        let activeName = this.queryParams.activeName;
        if (activeName === 'road') {
          this.stationSysOrgFlag = false;
          this.roadSysOrgFlag = false;
          this.valueXFlag = true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
          //this.queryParams.vehicleFlagStr = showDefault == 'table' ? '' : this.queryParams.vehicleFlagStr;
        } else if(activeName === 'station'){
          this.stationSysOrgFlag = false;
          this.roadSysOrgFlag = true;
          this.valueXFlag = true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
        } else if (activeName === 'vehicleType' || activeName === 'vehicleClass') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.valueXFlag = showDefault == 'table' ? false : true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = false;
          // this.queryParams.vehicleFlagStr = '';
        } else if (activeName === 'collectDate') {
          this.stationSysOrgFlag = true;
          this.roadSysOrgFlag = false;
          this.valueXFlag = showDefault == 'table' ? false : true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = true;
          // this.queryParams.vehicleFlagStr = 'vehicleType';
        }

        this.getData();
      },
      getSelectRoadName() {
        if (this.queryParams.sysOrg.roadName) {
          return this.queryParams.sysOrg.roadName;
        } else {
          return '全部路段';
        }
      },
      getSelectStationName() {
        if (this.queryParams.sysOrg.stationName) {
          return this.queryParams.sysOrg.stationName;
        } else {
          return '全部收费站';
        }
      },
      getTitleString(type) {
        var verticalName = "车流量", title = "";
        var roadName = this.getSelectRoadName(),
          stationName = this.getSelectStationName();

        if (type === 'table') {
          let beginDate = '', endDate = '';
          if (this.queryParams.dateStatisticType === 'day') {
            beginDate = this.queryParams.startDay;
            endDate = this.queryParams.endDay;
          } else if (this.queryParams.dateStatisticType === 'month') {
            beginDate = this.queryParams.startMonth;
            endDate = this.queryParams.endMonth;
          }

          if (this.queryParams.activeName === 'road') {
            title = "各路段" + verticalName + "统计" + "(" + beginDate + "至 " + endDate + ")";
          } else if (this.queryParams.activeName === 'station') {
            title = "各收费站" + verticalName + "统计" + "(" + beginDate + "至 " + endDate + ")";
          } else if (this.queryParams.activeName === 'vehicleType') {
            title = roadName + stationName + "各类车型车流量统计" + "(" + beginDate + "至 " + endDate + ")";
          } else if (this.queryParams.activeName === 'vehicleClass') {
            title = roadName + stationName + "各类车种车流量统计" + "(" + beginDate + "至 " + endDate + ")";
          } else if (this.queryParams.activeName === 'collectDate') {
            title = roadName + stationName + "车流量趋势统计" + "(" + beginDate + "至 " + endDate + ")";
          }
        } else if (type === 'chart') {
          if (this.queryParams.activeName === 'road') {
            title = verticalName + " 路段统计";
          } else if (this.queryParams.activeName === 'station') {
            title = verticalName + "收费站统计";
          } else if (this.queryParams.activeName === 'vehicleType') {
            title = roadName + stationName + "各类车型车流量分布统计";
          } else if (this.queryParams.activeName === 'vehicleClass') {
            title = roadName + stationName + "各类车种车流量分布统计";
          } else if (this.queryParams.activeName === 'collectDate') {
            title = roadName + stationName + "车流量趋势统计";
          }
        }
        return title;
      }
    }
  }
</script>

<style scoped>
  .titleCss {
    background-color: #fff;
    font-size: 20px;
    padding-top: 30px;
    font-weight: bold;
    color: #0089fd;
  }
</style>
