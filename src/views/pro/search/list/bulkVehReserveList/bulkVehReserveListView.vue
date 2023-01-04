<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="牵引车车牌号码" prop="tractorVehiclePlate" label-width="120px">
          <el-input v-model="queryParams.tractorVehiclePlate" type="text" maxlength="16"  style="width: 179px" />
        </el-form-item>
        <el-form-item label="牵引车车牌颜色" prop="tractorVehicleColor" label-width="120px">
          <ti-select v-model="queryParams.tractorVehicleColor" dict-type="tibms_com_vehicleColor" style="width: 179px"/>
        </el-form-item>
        <el-form-item label="挂车车牌号码" prop="trailerVehiclePlate">
          <el-input v-model="queryParams.trailerVehiclePlate" type="text" maxlength="16" style="width: 199px" />
        </el-form-item>
        <el-form-item label="挂车车牌颜色" prop="trailerVehicleColor">
          <ti-select v-model="queryParams.trailerVehicleColor" dict-type="tibms_com_vehicleColor"/>
        </el-form-item>
        <el-form-item label="许可证号" prop="certNo" label-width="120px">
          <el-input v-model="queryParams.certNo" type="text" maxlength="32" style="width: 179px" />
        </el-form-item>
        <el-form-item label="发证单位" prop="orgUnit" label-width="120px">
          <el-input v-model="queryParams.orgUnit" type="text" maxlength="16" style="width: 179px" />
        </el-form-item>
        <el-form-item prop="beginStartPassDate" v-show="false"/>
        <el-form-item prop="endStartPassDate" v-show="false"/>
        <el-form-item label="起始通行日期">
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginStartPassDate" end-key="endStartPassDate"/>
        </el-form-item>
        <el-form-item label="结束通行日期">
          <el-form-item prop="beginEndPassDate" v-show="false"/>
          <el-form-item prop="endEndPassDate" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginEndPassDate" end-key="endEndPassDate" />
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
      :auto-resize="true"
      max-height="450"
      class="vxe-table-element"
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
        <el-button v-permission="['bulkVehReserveList:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>
      <template v-slot:operation="{ row }">
        <el-button type="warning" @click="detail(row.certNo)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

    <!--    <router-view></router-view>-->
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {getToken} from '@/utils/auth'

  import {findPage} from "./bulkVehReserveListApi";

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import moment from 'moment' 

  export default {
    name: 'search.list.bulkVehReserveList.bulkVehReserveListView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          tractorVehiclePlate: '',
          tractorVehicleColor: '',
          trailerVehiclePlate: '',
          trailerVehicleColor: '',
          certNo: '',
          orgUnit: '',
          beginStartPassDate: '',
          endStartPassDate:  '',
          beginEndPassDate: '',
          endEndPassDate: ''
        },
        exportExcel: {
          url: 'api/v1/search/list/bulkVehReserveList/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用true
        exportUrl: `api/v1/bulkVehReserveList/bulkVehReserveList/exportExcel?token=${getToken()}`,
        tableToolbar: {
          id: 'search.list.bulkVehReserveList.bulkVehReserveListView-toolbar',
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
          {title: '大件运输许可证', field: 'certNo', minWidth: 200, showOverflow: true},
          {title: '牵引车车牌号', field: 'tractorVehiclePlateTxt', minWidth: 150, showOverflow: true},
          {title: '挂车车牌号', field: 'trailerVehiclePlateTxt', minWidth: 150, showOverflow: true},
          {title: '途径省份', field: 'provinceTxt', minWidth: 150, showOverflow: true},
          {title: '入口收费站', field: 'enStationTxt', minWidth: 220, showOverflow: true},
          {title: '出口收费站', field: 'exStationTxt', minWidth: 220, showOverflow: true},
          {title: '起始通行日期', field: 'startPassDate', minWidth: 150, showOverflow: true},
          {title: '结束通行日期', field: 'endPassDate', minWidth: 150, showOverflow: true},
          {title: '通行路线', field: 'roads', minWidth: 400, showOverflow: true},
          {title: '通行次数', field: 'passCount', minWidth: 80, showOverflow: true},
          {title: '操作', width: 80, fixed: 'right', align: 'center', slots: {default: 'operation'}}
        ]
      }
    },
    created() {
      // this.getData();
    },
    watch: {},
    methods: {
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {

        this.loading = true

        // 每次查询初始化checkbox selections
        this.selections = []
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total

        //保存导出的查询条件
        this.exportExcel.queryParams = this.queryParams;

        this.loading = false
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        //this.getData()
      },
      change(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      detail(id) {
        var timestamp = Date.parse(new Date());
        this.$router.push({
          path : '/search/list/bulkVehReserveList/detail/' + timestamp,
          query : {
            id : id
          }
        });
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item /deep/ .el-form-item__content{*/
    /*width: 60% !important;*/
  /*}*/

</style>
