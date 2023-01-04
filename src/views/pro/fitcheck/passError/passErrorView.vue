<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form :model="queryParams" ref="searchForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-form-item label="路段" prop="sectionId">
        <ti-select
          style="width: 177px"
          v-model="queryParams.tollRoadId"
          :clearable="true"
          url="/api/v1/common/road/findListByAuth"
          :props="{ key: 'roadId', value: 'roadId', label: 'roadName' }"
          :multiple="false"
          aria-placeholder="路段"
        />
      </el-form-item>
      <el-form-item  label="通行介质" prop="mediaType">
        <ti-select style="width: 177px" clearable
                   v-model="queryParams.mediaType"
                   :data-list="[{value:'1',name:'ETC'},{value:'2',name:'非ETC'}]"
                   :props="{key:'value',value:'value',label:'name'}"/>
      </el-form-item>
      <el-form-item label="车牌号" prop="vehiclePlate">
        <el-input style="width: 177px;" clearable v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号"
                  maxlength="16"/>
      </el-form-item>
      <el-form-item label="流水类型" prop="allSerialType">
        <ti-select  style="width: 177px;" clearable v-model="queryParams.allSerialType" dict-type="tibms_audit_serialType"/>
      </el-form-item>
      <el-form-item label="流水号" prop="serialNo">
        <el-input style="width: 177px;" clearable v-model="queryParams.serialNo" type="text" placeholder="流水号"
                  maxlength="39"/>
      </el-form-item>
      <el-form-item label="通行标识" prop="passId">
        <el-input style="width: 177px;" clearable v-model="queryParams.passId" type="text" placeholder="通行标识"
                  maxlength="40"/>
      </el-form-item>
      <el-form-item  label="异常类型" prop="errorCode">
        <ti-select style="width: 177px;" clearable
                   v-model="queryParams.errorCode"
                   check-strictly
                   url="api/v1/fitcheck/passError/errorCode"
                   :props="{key:'code',value:'code',label:'desc'}"
        />
      </el-form-item>
      <el-form-item label="OBU编号" prop="obuId">
        <el-input style="width: 177px;" clearable v-model="queryParams.obuId" type="text" placeholder="OBU编号"
                  maxlength="20"/>
      </el-form-item>
      <el-form-item label="卡号" prop="cardId">
        <el-input style="width: 177px;" clearable v-model="queryParams.cardId" type="text" placeholder="卡号"
                  maxlength="20"/>
      </el-form-item>
      <el-form-item label="入口时间" prop="dataRange">
        <ti-date-range date-style="width:260px" v-model="queryParams.dataRange" date-type="daterange"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd" date-rule="singleMonth"
                       begin-key="startDay" start-placeholder="起始日期"
                       end-key="endDay" end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="flex:1;min-height: 400px;">
      <vxe-grid
        ref="vex"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        height="auto"
        class="vxe-table-element"
        :loading="loading"
        :start-index="(page.currentPage - 1) * page.pageSize"
        :pager-config="page"
        :columns="columns"
        :data="tableData"
        @page-change="handlePageChange"
      >
        <template v-slot:toolbar_buttons>
          <el-button v-permission="['passError:exp']" @click="exportExcel.dialog = true">
            导出
          </el-button>
        </template>
      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import moment from 'moment'
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import {findPage} from "@/views/pro/fitcheck/passError/passErrorApi";

export default {
  name: "fitcheck.passError.passErrorView",
  components: {TiSelect,TiDateRange,TiExportExcel},
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        dataRange: {
          startDay: moment().add(-1, 'day').format('YYYY-MM-DD'),
          endDay: moment().add(-1, 'day').format('YYYY-MM-DD')
        },
        startTime: '',
        endTime: '',
        vehiclePlate: '',
        allSerialType: '',
        serialNo: '',
        passId: '',
        obuId: '',
        cardId: '',
        tollRoadId: null,
        mediaType: null
      },
      rules: {
        dataRange: [{
          type: 'array',
          required: true,
          message: '',
          fields: {
            startDay: {type: 'string', required: true, message: ''},
            endDay: {type: 'string', required: true, message: ''}
          }
        }]
      },
      exportExcel: {
        url: 'api/v1/fitcheck/passError/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableToolbar: {
        id: 'fitcheck.passError.passErrorView.toolbar',
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
          align: 'left',
          headerAlign: 'center',
          minWidth: 180,
          showOverflow: true
        },
        {
          field: "tollRoadName",
          title: "路段名称",
          minWidth: 210,
          align: 'left',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          field: "serialNo",
          title: "流水号",
          minWidth: 150,
          align: 'left',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          field: "allSerialTypeStr",
          title: "流水类型",
          minWidth: 150,
          align: 'center',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          field: "errorDesc",
          title: "异常类型",
          minWidth: 250,
          align: 'center',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'left',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "gantryName",
          title: "门架名称",
          align: 'left',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "transTime",
          title: "通行交易时间",
          align: 'center',
          headerAlign: 'center',
          minWidth: 180,
          showOverflow: true
        },
        {
          field: "feeTxt",
          title: "交易金额(元)",
          align: 'right',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "createTime",
          title: "清洗时间",
          minWidth: 180,
          align: 'center',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          minWidth: 120,
          field: "vehiclePlate",
          title: "车牌号码",
          align: 'center',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          minWidth: 100,
          field: "vehiclePlateColorStr",
          title: "车牌颜色",
          align: 'center',
          headerAlign: 'center',
          showOverflow: true
        },
        {
          field: "specialTypeStr",
          title: "特情类型",
          align: 'left',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "enTollTime",
          title: "入口时间",
          align: 'center',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "vehicleTypeStr",
          title: "车型",
          align: 'center',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "vehicleClassStr",
          title: "车种",
          align: 'center',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "mediaTypeStr",
          title: "通行介质",
          align: 'center',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "obuId",
          title: "OBU编号",
          align: 'left',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        },
        {
          field: "cardId",
          title: "卡号",
          align: 'left',
          headerAlign: 'center',
          minWidth: 150,
          showOverflow: true
        }
      ]
    }
  },
  mounted() {
     this.submit()
  },
  methods: {
    submit() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.page.currentPage = 1
          this.getData()
        } else {
          return false
        }
      })
    },
    async getData(){
      if(this.queryParams.allSerialType == ''){
        this.queryParams.allSerialType = 0;
      }
      this.queryParams.startTime = this.queryParams.dataRange.startDay + " 00:00:00";
      this.queryParams.endTime = this.queryParams.dataRange.endDay + " 23:59:59";
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
