<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="收费单元" prop="intervalIdStr">
          <ti-select
            v-model="queryParams.intervalIdStr"
            check-strictly
            url="api/v1/common/interval/findListByAuth"
            :props="{key:'intervalId',value:'intervalId',label:'intervalTxt'}"
            multiple
            @change="change"
          />
        </el-form-item>
        <el-form-item label="门架" prop="gantryIdStr">
          <ti-sys-gantry @change="change" :multiple="true" :show-all="true" v-model="queryParams.gantryIdStr"/>
        </el-form-item>
        <el-form-item label="车型" prop="vehicleTypeStr">
          <ti-select v-model="queryParams.vehicleTypeStr" dict-type="tibms_com_vehicleType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="车种" prop="vehicleClassStr">
          <ti-select v-model="queryParams.vehicleClassStr" dict-type="tibms_com_vehicleClass" :multiple="true"/>
        </el-form-item>
        <el-form-item label="ETC卡号" prop="etcCardId">
          <el-input v-model="queryParams.etcCardId" type="text" placeholder="ETC卡号" maxlength="40" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="CPC卡号" prop="cpcCardId">
          <el-input v-model="queryParams.cpcCardId" type="text" placeholder="CPC卡号" maxlength="40" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="车牌号码" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号码" maxlength="10" style="width: 199px" />
        </el-form-item>
        <el-form-item label="通行介质类型" prop="mediaTypeStr">
          <ti-select v-model="queryParams.mediaTypeStr" dict-type="tibms_com_mediaType" :multiple="true"/>
        </el-form-item>
        <el-form-item label="通行标识ID" prop="passId">
          <el-input v-model="queryParams.passId" type="text" placeholder="通行标识ID" maxlength="40" style="width: 199px" />
        </el-form-item>
        <el-form-item label="特情类型" prop="specialTypeStr">
          <ti-select v-model="queryParams.specialTypeStr" dict-type="tibms_com_specialType_gantry" :multiple="true"/>
        </el-form-item>
        <el-form-item label="计费交易日期">
          <el-form-item prop="beginTransDate" v-show="false"/>
          <el-form-item prop="endTransDate" v-show="false"/>
          <ti-date-range v-model="queryParams" format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"
                         date-type="datetimerange" begin-key="beginTransDate" end-key="endTransDate" date-rule="oneMonth"/>
        </el-form-item>
        <el-form-item label="门架类型" prop="gantryTypeId">
          <ti-select v-model="queryParams.gantryTypeId" dict-type="tibms_com_transGantryType" />
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
        <el-button v-permission="['gantryTrans:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
<!--        <label style="padding-left: 20px">总记录数：{{page.realTotal}}</label>-->
      </template>
      <template v-slot:operation="{ row }">
        <el-button type="warning" @click="detail(row.tradeId, row.transTime)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';

  import {findPage} from "./gantryTransApi";
  import moment from 'moment'

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiSysGantry from "@/views/pro/common/tiElement/tiSysGantry/tiSysGantry"

  export default {
    name: 'search.list.gantryTrans.gantryTransView',
    components: {TiExportExcel, TiSelect, TiDateRange,TiSysGantry},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          intervalIdStr: '',
          gantryIdStr: '',
          vehicleTypeStr: '',
          vehicleClassStr: '',
          etcCardId: '',
          cpcCardId: '',
          vehiclePlate: '',
          mediaTypeStr: '',
          passId: '',
          specialTypeStr: '',
          beginTransDate: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00.000',
          endTransDate: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59.999',
          gantryTypeId: ''
        },
        exportExcel: {
          url: 'api/v1/search/list/gantryTrans/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'search.list.gantryTrans.gantryTransView-toolbar',
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
          realTotal: 0,
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
            title: '计费交易编号',
            field: 'tradeId', minWidth: 300, showOverflow: true
          },
          {
            title: '收费单元',
            field: 'intervalTxt', minWidth: 300, showOverflow: true
          },
          {
            title: '门架',
            field: 'gantryTxt', minWidth: 320, showOverflow: true
          },
          {
            title: '通行介质类型',
            field: 'mediaTypeName', minWidth: 110, showOverflow: true
          },
          {
            title: 'ETC/CPC号',
            field: 'cardId', minWidth: 180, showOverflow: true
          },
          {
            title: '车牌号码',
            field: 'vehiclePlate', minWidth: 150, showOverflow: true
          },
          {
            title: '车型',
            field: 'vehicleTypeTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '车种',
            field: 'vehicleClassTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '交易金额',
            field: 'feeTxt', minWidth: 120, showOverflow: true
          },
          {
            title: '优惠金额',
            field: 'discountFeeTxt', minWidth: 120, showOverflow: true
          },
          {
            title: 'OBU单/双片标识',
            field: 'obuSignName', minWidth: 150, showOverflow: true
          },
          {
            title: '计费交易时间',
            field: 'transTime', minWidth: 150, showOverflow: true
          },
          {
            title: '通行标识ID',
            field: 'passId', minWidth: 150, showOverflow: true
          },
          {title: '操作', width: 100, fixed: 'right', align: 'center', slots: {default: 'operation'}}
        ]
      }
    },
    created() {
  //    this.getData()
    },
    methods: {
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {
        try {
          // 每次查询初始化checkbox selections
          this.selections = []
          this.loading = true
          const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
          this.tableData = data.records
          this.page.total = data.total
          this.page.realTotal = data.realTotal;
        } finally {
          this.loading = false
        }


        //保存导出的查询条件
        this.exportExcel.queryParams = this.queryParams;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
       // this.getData()
      },
      detail(tradeId, transTime) {
        var timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/search/list/gantryTrans/detail/'+timestamp,
          query: {
            tradeId: tradeId,
            transTime: transTime
          }
        });
      },
      change(param1,param2) {
        this.queryParams.sysOrg = param2;
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>

