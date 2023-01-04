<template>
  <div class="app-container"  style="height: 100%">
    <div class="container-fluid">
      <el-tabs v-model="queryParams.activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="路段" name="road"/>
        <el-tab-pane label="门架" name="gantry"/>
        <el-tab-pane label="车型" name="vehicleType"/>
        <el-tab-pane label="车种" name="vehicleClass"/>
        <el-tab-pane label="时间" name="transDate"/>
      </el-tabs>
      <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" v-show="roadFlag" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2" />
        </el-form-item>
        <el-form-item label="门架名称" v-show="gantryFlag" prop="gantryIdStr">
          <ti-select
            ref="gantry"
            v-model="queryParams.gantryIdStr"
            url="api/v1/common/gantry/gantry"
            placeholder="全部"
            :props="{key:'gantryId',value:'gantryId',label:'gantryText'}"
            :watch-attr="queryParams.sysOrgIdStr"
            :watch-attr-fn="watchAttrFn"
          />
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
        <el-row>
          <el-form-item label="图表方式">
            <el-radio-group v-model="queryParams.showDefault" size="mini" @change="showChange">
              <el-radio label="table" border style="margin-right:10px;line-height:0px!important">表格</el-radio>
              <el-radio label="chart" border style="margin-right:10px;line-height:0px!important">图表</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
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
  import tableOption from "@/views/pro/analyse/flow/gantryFlow/tableOption";
  import chartOption from "@/views/pro/analyse/flow/gantryFlow/chartOption";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import {getOrgTreeData} from "@/views/pro/common/util/dataUtil"

  export default {
    name: "analyse.flow.gantryFlow.gantryFlowView",
    mixins: [...mixin],
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    data() {
      return {
        vehicleFlag:true,
        roadFlag:true,
        gantryFlag:true,
        transTypeFlag:true,
        queryParams:{
          dataType:'flow',
          activeName:'road',
          sysOrgIdStr:'',
          roadId:'',
          gantryIdStr:'',
          dateStatisticType:'day',
          startDay: moment(new Date()).format('YYYY-MM-DD'),
          endDay: moment(new Date()).format('YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          startDate: '',
          endDate: '',
          vehicleFlagStr:'vehicleType',
          vehicleTypeStr:'',
          vehicleClassStr:'',
          showDefault:'table',
          transType:''

        },
        tableToolbar: {
          buttons: [
            {code: 'excelExport', icon: 'fa fa-download'}
          ]
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
        columns: [],
        viewData: []
      }
    },
    created() {
      this.queryParams.activeName = 'road';
      this.queryParams.showDefault = 'table';
      this.showChange();
      //this.columns = tableOption.getColumn(this.queryParams.activeName);
      // this.title = this.getTitleString(this.queryParams.showDefault);
      // this.$nextTick(async => {
      //     this.getData();
      //   }
      //);
    },
    mounted() {


    },
    methods:{
      async getData() {
        this.columns = tableOption.getColumn(this.queryParams.activeName);
        //this.title = this.getTitleString(this.queryParams.showDefault);
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
        console.log("queryParams:", this.queryParams);

        let params = {};
        let type = this.queryParams.activeName;
        Object.assign(params, this.queryParams);
        if (type === 'road') {
          params.sysOrgIdStr = '';
          params.gantryIdStr = '';
        } else if(type === 'gantry'){
          params.gantryIdStr = '';
        }else if (type === 'vehicleType' || type === 'vehicleClass') {
          params.vehicleFlagStr = '';
          params.vehicleTypeStr = '';
          params.vehicleClassStr = '';
        }

        if(this.queryParams.vehicleFlagStr === 'vehicleType'){
          params.vehicleClassStr = '';
        }else if(this.queryParams.vehicleFlagStr === 'vehicleClass'){
          params.vehicleTypeStr = '';
        }

        // if(params.sysOrgIdStr){
        //   params.sysOrgIdStr = params.sysOrgIdStr.id;
        //   console.log("sysOrgIdStr:", params.sysOrgIdStr);
        // }


        await tableOption.getData({}, params);
        if (this.queryParams.showDefault === 'table') {
          this.table.datas = tableOption.returnData.data.table;
          this.table.loading = false;
        }
        if (this.queryParams.showDefault === 'chart') {
          // 初始化图表
          this.$nextTick(()=>{
            chartOption.init(this.$refs['myChart'],tableOption.returnData.data.chart, type);
          });

        }
      },
      handleClick(tab, event) {
        this.showChange();
        // this.getData();
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      mergeRowMethod({row, rowIndex, column, data}) {
        // const fields = this.queryParams.activeName === 'road' ? 'roadName' : ['roadName',
        //   'gantryName']
        const fields = this.queryParams.activeName  == 'road' ? 'roadName':''
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
        tableOption.export(this.$refs.appTable, '门架车流量分析')
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
      },
      showChange() {
        let showDefault = this.queryParams.showDefault;
        let activeName = this.queryParams.activeName;
        if (activeName === 'road') {
          this.roadFlag = false;
          this.gantryFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
        }else if(activeName === 'gantry'){
          this.roadFlag = true;
          this.gantryFlag = false;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = showDefault == 'table' ? false : true;
        } else if (activeName === 'vehicleType' || activeName === 'vehicleClass') {
          this.roadFlag = true;
          this.gantryFlag = true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = false;
        } else if (activeName === 'transDate') {
          this.roadFlag = true;
          this.gantryFlag = true;
          this.transTypeFlag = showDefault == 'table' ? false : true;
          this.vehicleFlag = true;
        }

        this.getData();
      },
      // getTreeRoads(data,roadIds){
      //   if(data)
      //   {
      //     data.forEach(item => {
      //         if(item.roadId != '0'){
      //           roadIds.push(item.roadId);
      //         }
      //         if(item.children)
      //         {
      //           this.getTreeRoads(item.children,roadIds);
      //         }
      //       }
      //     );
      //   }
      // },
      watchAttrFn(newVal,oldVal,selectData){
        let selectDataShow = [];
        let roadIdList = [];
        let sysOrgList = [];

        let sysOrg = this.$refs.sysOrg.getSysOrg();
        if(sysOrg){
          sysOrgList.push(sysOrg);
          getOrgTreeData(sysOrgList,'roadId',roadIdList,2);
        }

        //改变下拉列表
        if (roadIdList) {
          selectData.forEach(x => {
            roadIdList.forEach(roadId =>{
                if ((',' + roadId + ',').indexOf(',' + x.roadId + ',') > -1) {
                  selectDataShow.push(x)
                }
              }
            );

          });
        }else{
          selectDataShow = selectData;
        }

        return selectDataShow;
      }
    }
  }
</script>

<style scoped>

</style>
