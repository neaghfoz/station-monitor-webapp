<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <!--<el-form-item label="路段" prop="roadNoStr">
          <ti-select
            v-model="queryParams.roadNoStr"
            url="api/v1/monitor/common/road/use"
            :props="{key:'roadId',value:'roadNo',label:'roadText'}"
            multiple
          />
        </el-form-item>
        <el-form-item label="收费站" prop="stationNoStr">
          <ti-select
            v-model="queryParams.stationNoStr"
            url="api/v1/monitor/common/station/use"
            :props="{key:'stationId',value:'stationNo',label:'stationText'}"
            :watch-attr="queryParams.roadNoStr"
            :watch-attr-fn="watchAttrFn"
            multiple
          />
        </el-form-item>-->
        <el-form-item label="机构" prop="sysOrgIdStr">
          <!--<ti-select-tree
            v-model="queryParams.sysOrgIdStr"
            check-strictly
            url="api/v1/common/sysOrg/orgList"
            :props="{value:'id',label:'fullName',children:'children'}"
          />-->
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
        </el-form-item>
        <el-form-item prop="beginCollectDate" v-show="false"/>
        <el-form-item prop="endCollectDate" v-show="false"/>
        <el-form-item label="通行交易日期">
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginCollectDate" end-key="endCollectDate"/>
        </el-form-item>
        <el-form-item label="传输链路" prop="collectType">
          <ti-select v-model="queryParams.collectType" dict-type="tibms_mo_collectType" :clearable="false"/>
        </el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>

      </el-form>
    </div>

    <vxe-grid
      ref="vex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      max-height="1000"
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
        <el-button v-permission="['uploadTimeliness:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'

  import {findPage} from './uploadTimelinessApi';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  /*
    import toFixedNumber from 'xe-utils/methods/number/toFixedNumber';
    import commafy from 'xe-utils/methods/number/commafy';
    import toDateString from 'xe-utils/methods/date/toDateString';*/

  export default {
    name: 'monitor.datamonitor.uploadTimeliness.uploadTimelinessView',
    components: {TiDateRange, TiSelect, TiExportExcel, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          collectType: 'pro',
          beginCollectDate: moment(new Date()).format('YYYY-MM-DD'),
          endCollectDate: moment(new Date()).format('YYYY-MM-DD'),
          // roadNoStr: '',
          // stationNoStr: '',
          sysOrgIdStr: '',
        },
        exportExcel: {
          url: 'api/v1/monitor/datamonitor/uploadTimeliness/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'monitor.datamonitor.uploadTimeliness.uploadTimelinessView-toolbar',
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
          {title: '路段名称', field: 'roadText', minWidth: 150, showOverflow: true},
          {title: '收费站', field: 'stationText', minWidth: 150, showOverflow: true},
          {title: '数据类型', field: 'listCodeName', minWidth: 100, showOverflow: true},
          {title: '通行交易日', field: 'collectDateText', minWidth: 100, showOverflow: true},
          {title: '流水总数', field: 'proSendCnt', minWidth: 80, showOverflow: true, align: 'right'},
          {
            title: 'T<=1(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt0_1', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer0_1Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '1<T<=5(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt1_5', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer1_5Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '5<T<=10(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt5_10', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer5_10Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '10<T<=15(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt10_15', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer10_15Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '15<T<=30(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt15_30', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer15_30Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '30<T<=60(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt30_60', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer30_60Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: '60<T<=120(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt60_120', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer60_120Text', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
          {
            title: 'T>120(分钟)',
            children: [
              {title: '数量', field: 'proSendCnt120_n', minWidth: 80, showOverflow: true, align: 'right'},
              {title: '占比', field: 'proSendPer120_nText', minWidth: 80, showOverflow: true, align: 'right'},
            ]
          },
        ]
      }
    },
    watch: {
      //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
      'queryParams.sysOrgIdStr'(newVal, oldVal) {
        if (!this.queryParams.firstFlag) {
          this.getData();
          this.queryParams.firstFlag = true;
        }
      }
    },
    created() {
      // this.getData();
    },
    methods: {
      searchData() {
        // Object.assign(this.$data.page, this.$options.data().page);
        this.$data.page.currentPage = 1
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
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
        // this.getData();
      },
      /*perFormatterFn(data) {
        return data.cellValue != null ? `${XEUtils.commafy(XEUtils.toNumber(data.cellValue * 100), {digits: 2})}%` : ''
      },*/
      /*watchAttrFn(newVal, oldVal, selectData) {
        let selectDataShow = [];
        //改变下拉列表
        if (newVal) {
          selectData.forEach(x => {
            if ((',' + newVal + ',').indexOf(',' + x.roadNo + ',') > -1) {
              selectDataShow.push(x)
            }
          });
        } else {
          selectDataShow = selectData;
        }
        return selectDataShow;
      }*/
    }
  }

</script>

<style scoped>

</style>
