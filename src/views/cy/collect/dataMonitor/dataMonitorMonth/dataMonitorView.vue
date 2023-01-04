<template>
  <div class="app-container"  style="height: 100%">
    <div class="container-fluid">
      <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr"
               default-first-value show-level="2" multiple/>
        </el-form-item>
        <el-form-item prop="dates" label="日期">
          <el-col :span="30">
            <el-form-item v-show="queryParams.showDefault === 'table'">
              <el-form-item prop="startMonth" v-show="false"/>
              <el-form-item prop="endMonth" v-show="false"/>
              <ti-date-range date-style="width:293px" ref="monthRang" :editable="false"
                             v-model="queryParams"
                             date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
            <el-form-item v-show="queryParams.showDefault === 'chart'" prop="collectYear">
              <ti-date v-model="queryParams.collectYear" dateType="year" format="yyyy" value-format="yyyy"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="getData">查询</el-button>
          <!--<el-button type="default" @click="handleReset">重置</el-button>-->
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
    <div v-show="queryParams.showDefault === 'chart'">
      <b>说明：</b>
      <span class="el-icon-plus" style="color:green" ></span>
      <span>待填报&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="el-icon-edit-outline" style="color:blue" ></span>
      <span>可编辑(已保存)&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="el-icon-success" style="color:green"></span>
      <!--<span>未更新&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
      <!--<span class="el-icon-refresh" style="color:blue" ></span>-->
      <!--<span>已更新&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
      <!--<span class="el-icon-success" style="color:green" ></span>-->
      <span>已提交&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="el-icon-circle-check"></span>
      <span>已提交(未按时)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div>
    <div class="container-fluid el-col-md-24">
      <vxe-grid ref="appTable"
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
      >
      </vxe-grid>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import moment from "moment";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate"
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import tableOption from "./tableOption";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import tiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"; 

  export default {
    name: "collect.dataMonitor.dataMonitorMonth.dataMonitorView",
    mixins: [...mixin],
    components: {TiSelectTree, TiSelect, TiDateRange, tiSysOrg,TiDate},
    data() {
      return {
        queryParams:{
          collectType:'month',
          roadId:'',
          startMonth: moment().startOf('year').format("YYYY-MM"),
          endMonth: moment(new Date()).format('YYYY-MM'),
          collectYear:moment(new Date()).format('YYYY'),
          startDate: '',
          endDate: '',
          showDefault:'chart',
          sysOrgIdStr:''
        },
        tableToolbar: {
          buttons: []
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
      this.queryParams.showDefault = 'chart';
      this.showChange();
    },
    mounted() {
    },
    methods:{
      async getData() {
        let dateTrans = {};
        if (this.queryParams.showDefault === 'table') {
          dateTrans = dateUtil.dateCombination(this.queryParams.startMonth, this.queryParams.endMonth, 'month');
        } else if (this.queryParams.showDefault === 'chart') {
          dateTrans = dateUtil.dateCombination(this.queryParams.collectYear,
            this.queryParams.collectYear, 'year');
        }
        this.queryParams.startDate = dateTrans.startDate;
        this.queryParams.endDate = dateTrans.endDate;
        this.table.loading = true;
        this.table.datas = [];
        let params = {};
        Object.assign(params, this.queryParams);

        await tableOption.getData({}, params);
        this.table.datas = tableOption.returnData.data.datas;

        this.columns = [];
        this.columns = tableOption.getColumn(tableOption.returnData.data.columns, this.queryParams);
        this.table.loading = false;
      },
      handleClick(tab, event) {
        this.showChange();
        // this.getData();
      },
      toolbarEvent({code}) {
        switch (code) {
          case 'excelExport':
            this.export()
            break
        }
      },
      export() {
        tableOption.export(this.$refs.appTable, '数据监视')
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
      },
      async showChange() {
        let data = await tiUserApi.getCurUserOrg();
        this.queryParams.sysOrgIdStr = data.data.id
        let showDefault = this.queryParams.showDefault;
        if (showDefault=='table') {
          this.tableToolbar.buttons = [{code: 'excelExport', icon: 'fa fa-download'}]
        } else {
          this.tableToolbar={}
        }
        this.getData();
      }
    }
  }
</script>

<style scoped>

</style>
