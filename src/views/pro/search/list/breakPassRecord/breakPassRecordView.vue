<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" :default-first-value="defaultFirstOrg" />
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
        <el-form-item label="车型" prop="vehicleTypeStr">
          <ti-select v-model="queryParams.vehicleTypeStr" dict-type="tibms_com_vehicleType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车种" prop="vehicleClassStr">
          <ti-select v-model="queryParams.vehicleClassStr" dict-type="tibms_com_vehicleClass" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车牌号码" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" maxlength="16" style="width: 199px"/>
        </el-form-item>
        <el-form-item label="闯关时间">
          <el-form-item prop="beginHandleTime" v-show="false"/>
          <el-form-item prop="endHandleTime" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="datetimerange"
                         format="yyyy-MM-dd HH:mm:ss" begin-key="beginHandleTime" end-key="endHandleTime"/>
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
      max-height="450"
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
        <el-button v-permission="['breakPassRecord:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
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
  import moment from 'moment'

  import {findPage, exportExcel} from "./breakPassRecordApi";
  // import Detail from './components/breakPassRecordDetail'

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'search.list.breakPassRecord.breakPassRecordView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        defaultFirstOrg: true,
        queryParams: {
          sysOrgIdStr: '',
          laneNoStr: '',
          entryExitType: '',
          laneTypeStr: '',
          beginHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          endHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          vehicleTypeStr: '',
          vehicleClassStr: '',
          vehiclePlate:'',
        },
        exportExcel: {
          url: 'api/v1/search/list/breakPassRecord/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'search.list.breakPassRecord.breakPassRecordView-toolbar',
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
            field: 'stationTxt', minWidth: 180, showOverflow: true
          },
          {
            title: '车道类型',
            field: 'laneTypeName', minWidth: 80, showOverflow: true
          },
          {
            title: '车道号',
            field: 'tollLaneNo', minWidth: 70, showOverflow: true
          },
          {
            title: '车牌号码',
            field: 'vehiclePlateTxt', minWidth: 150, showOverflow: true
          },
          {
            title: '车型',
            field: 'vehicleTypeTxt', minWidth: 100, showOverflow: true
          },
          {
            title: '车种',
            field: 'vehicleClassTxt', minWidth: 150, showOverflow: true
          },
          {
            title: '特情类型',
            field: 'specialTypeTxt', minWidth: 150, showOverflow: true
          },
          {
            title: '闯关时间',
            field: 'handleTime', minWidth: 150, showOverflow: true
          },
          { title: '操作', width: 100, fixed: 'right', align: 'center', slots: {default: 'operation'}
          }
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
      if(this.$route.query.type == 'queryByEvent'){
        this.defaultFirstOrg = false // 跳转查询不默认第一个组织机构
        this.queryParams.sysOrgIdStr = this.$route.query.stationOrgId
        this.queryParams.beginHandleTime = this.$route.query.eventDay + ' 00:00:00'
        this.queryParams.endHandleTime = this.$route.query.eventDay + ' 23:59:59'
        this.queryParams.entryExitType = this.$route.query.entryExitType
        this.queryParams.vehiclePlate = this.$route.query.vehiclePlate
        this.submit()
      }
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
        this.exportExcel.queryParams = this.queryParams;
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
          path : '/search/list/breakPassRecord/detail/' + timestamp,
          query : {
            id : id
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
