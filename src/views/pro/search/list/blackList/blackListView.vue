<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="ETC卡卡号" prop="passCardNo">
          <el-input v-model="queryParams.passCardNo" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="车牌" prop="vehPlate">
          <el-input v-model="queryParams.vehPlate" type="text" maxlength="16"/>
        </el-form-item>
        <el-form-item label="车牌颜色" prop="vehPlateColor">
          <ti-select v-model="queryParams.vehPlateColor" dict-type="tibms_com_vehicleColor"/>
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
        <el-button v-permission="['blackList:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

    <!--    <router-view></router-view>-->
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {getToken} from '@/utils/auth'

  import {findPage} from "./blackListApi";

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import moment from 'moment'

  export default {
    name: 'search.list.blackList.blackListView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          passCardNo: '',
          vehPlate: '',
          vehPlateColor: ''
        },
        exportExcel: {
          url: 'api/v1/search/list/blackList/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        exportUrl: `api/v1/blackList/blackList/exportExcel?token=${getToken()}`,
        tableToolbar: {
          id: 'search.list.blackList.blackListView-toolbar',
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
          {title: 'ETC卡卡号', field: 'passCardNo', minWidth: 150, showOverflow: true},
          {title: '车牌号码', field: 'vehPlate', minWidth: 120, showOverflow: true},
          {title: '车牌颜色', field: 'vehPlateColorName', minWidth: 150, showOverflow: true},
          {title: '黑名单类型', field: 'darkType0Name', minWidth: 120, showOverflow: true},
          {title: '黑名单版本', field: 'darkVer0', minWidth: 120, showOverflow: true},
          {title: '黑名单状态', field: 'darkStatusName', minWidth: 120, showOverflow: true},
          {title: '描述', field: 'darkDesc0', minWidth: 300, showOverflow: true}
        ]
      }
    },
    created() {
      //  this.getData();
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
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item /deep/ .el-range-editor {*/
  /*width: 518px !important;*/
  /*}*/
</style>
