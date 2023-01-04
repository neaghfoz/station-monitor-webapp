<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
      </el-form-item>
      <el-form-item label="车道号" prop="laneNo">
        <el-input v-model="queryParams.laneNo" type="text" placeholder="车道号" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
      </el-form-item>
      <el-form-item label="车道类型" prop="laneTypeStr">
        <ti-select v-model="queryParams.laneTypeStr" dict-type="tibms_com_laneType" :multiple="true"/>
      </el-form-item>
      <el-form-item label="数据日期"  prop="heatVersion">
        <ti-date v-model="queryParams.heatVersion" dateType="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <vxe-grid
      ref="vex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      height="600"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @sort-change="sortTable"
      @page-change="handlePageChange"
    >
      <template v-slot:operation="{ row }">
        <el-button type="warning"  @click="detail(row)">详情</el-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import {findPage} from "./laneLogAnalysisApi"

  export default {
    name: "pro.audit.laneLogAnalysis.laneLogAnalysisView",
    components: {TiSelect,TiDate,TiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        queryParams:{
          sysOrgIdStr:'',
          laneNo:'',
          laneTypeStr:'',
          heatVersion:moment().add(-1, 'day').format('YYYY-MM-DD'),
          orderByName:'',
          orderBy:''
        },
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
        tableData: [],
        columns: [
          {
            title: "序号",
            type: "seq",
            width: 50,
            align: "center"
          },
          {
            field: "roadName",
            title: "路段",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "stationName",
            title: "收费站",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "laneNo",
            title: "车道号",
            minWidth: 80,
            showOverflow: true
          },
          {
            field: "laneTypeName",
            title: "车道类型",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "enterLaneVehNum",
            title: "进入车道车辆数",
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "obuReadSucRate",
            title: "读标签成功率",
            sortable:true,
            minWidth: 130,
            showOverflow: true
          },
          {
            field: "cardReadSucRate",
            title: "读卡成功率",
            sortable:true,
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "tradeSucRate",
            title: "交易成功率",
            sortable:true,
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "onceTradeSucRate",
            title: "一次交易成功率",
            sortable:true,
            minWidth: 140,
            showOverflow: true
          },
          {
            field: "plateIdentifySucRate",
            title: "牌识准确率",
            sortable:true,
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "avgSpeed",
            title: "平均车速",
            minWidth: 90,
            showOverflow: true
          },
          {
            field: "laneId",
            title: "车道Id",
            minWidth: 90,
            showOverflow: true
          },
          {
            title: "操作",
            fixed:'right',
            align: "center",
            minWidth: 100,
            slots: {default: 'operation'}}
        ],

      }
    },
    created() {
      this.getData();
    },
    methods:{
      submit(){
        this.queryParams.orderByName='';
        this.queryParams.orderBy='';
        this.$data.page.currentPage = 1
        this.getData();
      },
      async getData(){
        this.loading = true;
        const {data} = await findPage(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          this.queryParams);
        this.tableData = data.records;
        this.page.total = data.total
        this.loading = false;
      },
      detail(row) {

        console.log("row", row);
         this.$router.push({
           path: '/audit/laneLogAnalysis/detail',
           query: {
             row: row
           }
         });
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
      },
      sortTable(column,prop,order){
        if (this.$refs.vex)
          this.$refs.vex.clearSort()
        this.queryParams.orderByName = column.field;
        this.queryParams.orderBy = column.order;
        this.getData();
      }
    },
    mounted() {
      window.vue =  this;
    }
  }
</script>

<style scoped>

  /deep/ .vxe-icon--caret-top:before, /deep/ .vxe-icon--caret-bottom:before{
    bottom: .4em;
  }
  /deep/ .vxe-icon--caret-bottom:before, /deep/ .vxe-icon--caret-left:before, /deep/ .vxe-icon--caret-right:before, /deep/ .vxe-icon--caret-top:before{
    border-width: .5em
  }
</style>
