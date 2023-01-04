<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="车牌号" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号"
                    maxlength="16"/>
        </el-form-item>
        <el-form-item label="流水类型" prop="allSerialType">
          <ti-select v-model="queryParams.allSerialType" dict-type="tibms_audit_serialType"/>
        </el-form-item>
        <el-form-item label="流水号" prop="serialNo">
          <el-input v-model="queryParams.serialNo" type="text" placeholder="流水号"
                    maxlength="39"/>
        </el-form-item>
        <el-form-item label="通行标识" prop="passId">
          <el-input v-model="queryParams.passId" type="text" placeholder="通行标识"
                    maxlength="40"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item  label="异常类型" prop="errorCode">
          <ti-select
            v-model="queryParams.errorCode"
            check-strictly
            url="api/v1/audit/list/errorData/errorCode"
            :props="{key:'code',value:'code',label:'desc'}"
          />
        </el-form-item>
        <el-form-item label="OBU编号" prop="obuId">
          <el-input v-model="queryParams.obuId" type="text" placeholder="OBU编号"
                    maxlength="20"/>
        </el-form-item>
        <el-form-item label="卡号" prop="cardId">
          <el-input v-model="queryParams.cardId" type="text" placeholder="卡号"
                    maxlength="20"/>
        </el-form-item>
        <el-form-item label="入口时间"  prop="transDateRange">
          <el-form-item prop="beginDate" v-show="false"/>
          <el-form-item prop="endDate" v-show="false"/>
          <ti-date-range date-style="width:230px" ref="dateRang" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                         :clearable="false"
                         v-model="queryParams.transDateRange" begin-key="beginDate"
                         end-key="endDate"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-row>
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
      height="650"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      >
      <template v-slot:toolbar_buttons>
        <el-button v-permission="['errorData:exportExcel']" @click="exportExcel.dialog = true">
          导出
        </el-button>
      </template>
    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {findPage} from "@/views/pro/audit/dataAudit/errorData/errorDataApi";

  export default {
    name: "pro.audit.dataAudit.errorData.errorDataView",
    components: {TiSelect,TiDateRange,TiExportExcel},
    mixins: [...mixin],
    data() {
      return {
        queryParams:{
          transDateRange: {
            beginDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().add(-1, 'day').format('YYYY-MM-DD')
          },
          startTime: '',
          endTime: '',
          vehiclePlate:'',
          allSerialType:'',
          serialNo:'',
          passId:'',
          obuId:'',
          cardId:''
        },
        exportExcel: {
          url: 'api/v1/audit/list/errorData/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.special.enListSpecial.enListSpecial-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: false, // 最大化按钮
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
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
            'Total'],
          perfect: true
        },
        tableData: [],
        columns: [
          {
            title: "序号",
            type: "seq",
            minWidth: 50,
            align: "center"
          },
          {
            field: "passId",
            title: "通行标识",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "serialNo",
            title: "流水号",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "allSerialTypeStr",
            title: "流水类型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "errorDesc",
            title: "异常类型",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "createTime",
            title: "清洗时间",
            minWidth: 180,
            showOverflow: true
          },
          {
            minWidth: 120,
            field: "vehiclePlate",
            title: "车牌号码",
            showOverflow: true
          },
          {
            minWidth: 100,
            field: "vehiclePlateColorStr",
            title: "车牌颜色",
            showOverflow: true
          },
          {
            field: "specialTypeStr",
            title: "特情类型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "enTollTime",
            title: "入口时间",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "vehicleTypeStr",
            title: "车型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "vehicleClassStr",
            title: "车种",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "mediaTypeStr",
            title: "通行介质",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "obuId",
            title: "OBU编号",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "cardId",
            title: "卡号",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "stationName",
            title: "收费站名称",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "gantryName",
            title: "门架名称",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "transTime",
            title: "通行交易时间",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "feeTxt",
            title: "交易金额(元)",
            minWidth: 150,
            showOverflow: true
          },
        ]
      }
    },
    created() {
      this.getData();
    },
    methods:{
      submit(){
        this.$data.page.currentPage = 1
        this.getData();
      },
      async getData(){
        if(this.queryParams.allSerialType == ''){
          this.queryParams.allSerialType = 0;
        }
        this.queryParams.startTime = this.queryParams.transDateRange.beginDate + " 00:00:00";
        this.queryParams.endTime = this.queryParams.transDateRange.endDate + " 23:59:59";
        this.loading = true;
        const {data} = await findPage(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          this.queryParams);
        this.tableData = data.records;
        this.page.total = data.total
        this.exportExcel.queryParams = this.queryParams
        this.loading = false;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
      },
    }
  }
</script>

<style scoped>

</style>
