<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <!--<ti-select-tree-->
            <!--v-model="queryParams.sysOrgIdStr"-->
            <!--check-strictly-->
            <!--url="api/v1/common/sysOrg/orgList"-->
            <!--:props="{value:'id',label:'fullName',children:'children'}"-->
            <!--@change="change"-->
          <!--/>-->
          <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
        </el-form-item>
        <el-form-item label="车道号" prop="laneNoStr">
          <el-input v-model="queryParams.laneNoStr" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="出入口类型" prop="entryExitType">
          <ti-select v-model="queryParams.entryExitType" dict-type="tibms_com_inOutType"/>
        </el-form-item>
        <el-form-item label="车道类型" prop="laneTypeStr">
          <ti-select v-model="queryParams.laneTypeStr" dict-type="tibms_com_laneType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="操作员" prop="operatorID">
          <ti-select
            v-model="queryParams.operatorID"
            url="/api/v1/common/sysUser/list"
            :props="{key:'id',value:'username',label:'fullName'}"
          />
        </el-form-item>
        <el-form-item label="工班" prop="squadNo">
          <ti-select
            v-model="queryParams.squadNo"
            url="api/v1/common/squad/list"
            :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
          />
        </el-form-item>
        <el-form-item label="工班日期">
          <el-form-item prop="beginSquadDate" v-show="false"/>
          <el-form-item prop="endSquadDate" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginSquadDate" end-key="endSquadDate"/>
        </el-form-item>
        <el-form-item label="发票号" prop="invStartID">
          <el-input v-model="queryParams.invStartID" maxlength="10" style="width: 179.39px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="至" prop="invEndID" label-width="20px">
          <el-input v-model="queryParams.invEndID" maxlength="10" style="width: 179.39px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
        <!--<el-button type="primary" @click="showSearch = !showSearch">{{showSearch?'隐藏':'展开'}}</el-button>-->

      </el-form>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="500"
      class="vxe-table-element"
      :auto-resize="true"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
    >
      <template v-slot:toolbar_buttons>
        <el-button v-permission="['laneShift:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

      <template v-slot:operation="{ row }">
        <el-button type="warning" @click="detail(row.hgSeq)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';

  import {findPage, exportExcel} from "./laneShiftApi";
  import moment from 'moment'

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import XEUtils from "xe-utils";

  export default {
    name: 'search.list.laneShift.laneShiftView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange,tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          laneNoStr: '',
          entryExitType: '',
          laneTypeStr: '',
          beginSquadDate: moment(new Date()).format('YYYY-MM-DD'),
          endSquadDate: moment(new Date()).format('YYYY-MM-DD'),
          squadNo: '',
          operatorID: '',
          invStartID: '',
          invEndID: ''
        },
        exportExcel: {
          url: 'api/v1/search/list/laneShift/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'search.list.laneShift.laneShiftView-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [
          {
            title: '路段',
            field: 'roadTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '收费站',
            field: 'stationTxt', minWidth: 150, showOverflow: true
          },
          {
            title: '车道类型',
            field: 'laneTypeName', minWidth: 80, showOverflow: true
          },
          {
            title: '车道号',
            field: 'laneNo', minWidth: 70, showOverflow: true
          },
          {
            title: '工班日期',
            field: 'squadDate', minWidth: 100, showOverflow: true
          },
          {
            title: '工班',
            field: 'squadTxt', minWidth: 80, showOverflow: true
          },
          {
            title: '上班时间',
            field: 'beginShiftTime', minWidth: 150, showOverflow: true
          },
          {
            title: '下班时间',
            field: 'endShiftTime', minWidth: 150, showOverflow: true
          },
          {
            title: '操作员',
            field: 'operatorTxt', minWidth: 100, showOverflow: true
          },
          {
            title: '发票起始编号',
            field: 'invStartID', minWidth: 110, showOverflow: true
          },
          {
            title: '发票结束编号',
            field: 'invEndID', minWidth: 110, showOverflow: true
          },
          {
            title: '发票起始编号2',
            field: 'invStartID2', minWidth: 120, showOverflow: true
          },
          {
            title: '发票结束编号2',
            field: 'invEndID2', minWidth: 120, showOverflow: true
          },
          {
            title: '发票打印总数',
            field: 'invPrintCnt', minWidth: 110, showOverflow: true
          },
          {
            title: '发票金额（元）',
            field: 'invPrintMnyTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '废票数',
            field: 'badInVoiceCnt', minWidth: 120, showOverflow: true
          },
          {
            title: '废票金额（元）',
            field: 'badInVoiceMnyTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '总车辆数',
            field: 'vehCnt', minWidth: 120, showOverflow: true
          },
          {
            title: '流水记录数',
            field: 'listCnt', minWidth: 120, showOverflow: true
          },
          {
            title: '总金额（元）',
            field: 'totalMoneyTxt', minWidth: 120, showOverflow: true
          },
          {title: '操作', width: 100, fixed: 'right', align: 'center', slots: {default: 'operation'}}
        ]
      }
    },
    // watch: {
    //   //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
    //   'queryParams.sysOrgIdStr'(newVal,oldVal) {
    //     if (!this.queryParams.firstFlag){
    //       this.getData();
    //       this.queryParams.firstFlag = true;
    //     }
    //   }
    // },
    created() {
      //    this.getData()
    },
    methods: {
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {
        // 每次查询初始化checkbox selections
        this.selections = []
        this.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.loading = false

        //保存导出的查询条件
        this.exportExcel.queryParams = XEUtils.clone(this.queryParams,true);
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.$refs.sysOrg.setDefaultFirstValue();
        //this.getData()
      },
      detail(id) {
        var timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/search/list/laneShift/detail/'+timestamp,
          query: {
            id: id
          }
        });
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
