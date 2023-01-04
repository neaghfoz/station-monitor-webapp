<template>
  <div class="app-container" style="height: 100%">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <vxe-grid
        ref="feePassList"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        max-height="1000"
        class="vxe-table-element"
        :toolbar="tableToolbar"
        :loading="loading"
        :start-index="(page.currentPage - 1) * page.pageSize"
        :pager-config="page"
        :columns="columns"
        :data="tableData"
        @page-change="handlePageChange">
        >

        <template v-slot:toolbar_buttons>
          <span style="position: absolute;left: 17px;top: 10px;">{{tableTitle}}</span>

          <div class="vxe-toolbar-self">
            <el-form-item label="记账状态">
              <ti-select v-model="queryParams.payState"
                         dict-type="tibms_audit_payState"/>
            </el-form-item>
            <el-form-item v-show="routeQueryParams.type==1 || routeQueryParams.type==2" label="通行介质">
              <el-select clearable placeholder="请选择" v-model="queryParams.mediaType">
                <el-option label="OBU" value="1"></el-option>
                <el-option label="CPC" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="routeQueryParams.type==1 || routeQueryParams.type==2" label="出口计费类型">
              <ti-select v-model="queryParams.exitFeeType"
                         dict-type="tibms_com_exitFeeType"/>
            </el-form-item>
            <el-button v-show="isDay" type="success" @click="exportExcel">批量导出</el-button>
          </div>

<!--          <fee-pass-detail-dialog :params="detailParams" ref="detailDialog"/>-->
        </template>

        <template v-slot:operation="{ row }">
          <el-button type="warning" @click="detail(row)">查看详情</el-button>
        </template>


      </vxe-grid>
    </el-form>
  </div>
</template>

<script>
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import mixin from 'ecip-web/utils/common-mixin';
  // import {findPassList} from "@/views/pro/test/feeAnalyse/components/feePassListApi";
  // import FeePassDetailDialog from "@/views/pro/test/feeAnalyse/components/feePassDetailDialog";
  import {download} from 'ecip-web/utils'

  export default {
    name: "audit.feeAnalyse.components.feePassListView",
    components: {TiSelect, FeePassDetailDialog},
    mixins: [...mixin],
    data() {
      return {
        tableTitle: '',
        isDay: false,
        detailParams: {},
        routeQueryParams: {
          type: ''
        },
        queryParams: {
          payState: '',
          mediaType: '',
          exitFeeType: '',
          // dateStatisticType:'',
          // diffType:'',
          // endDate:'',
          // name:'',
          // tollRoadId:'',
          // startDate:'',
          // type:''
        },
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.feeAnalyse.components.feePassList-toolbar',
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
        columns: [
          {
            title: "序号",
            type: "seq",
            width: 50,
            align: "center"
          },
          {minWidth: 150, field: 'vehiclePlateStr', title: '车牌', align: 'center', showOverflow: true},
          {minWidth: 120, field: 'exitFeeTypeStr', title: '出口计费类型', align: 'center', showOverflow: true},
          {field: 'pathFirsnName', minWidth: 150, title: '入口站', align: 'center', showOverflow: true},
          {field: 'pathLastnName', minWidth: 150, title: '出口站', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'feeSumTxt', title: '校核应收(元)', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'splitFeeTxt', title: '记账拆分(元)', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'diffFeeTxt', title: '差异金额', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'payStateStr', title: '记账状态', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'pathTypeStr', title: '路径类型', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'mediaTypeStr', title: '通行介质', align: 'center', showOverflow: true,},
          {minWidth: 150, field: 'passId', title: '通行标识', align: 'center', showOverflow: true},
          {title: "操作", fixed: 'right', align: "center", minWidth: 100, slots: {default: 'operation'}}
        ],
        selections: [],
        tableData: [],

      }
    },
    created() {
      // this.init();
    },
    watch: {
      'queryParams.payState'(v) {
        this.searchData();
      },
      'queryParams.mediaType'(v) {
        this.searchData();
      },
      'queryParams.exitFeeType'(v) {
        this.searchData();
      },
      // 如果路由发生变化，再次执行该方法
      // "$route": "init"
    },
    activated() {
      this.init();
    },
    methods: {
      init() {
        this.routeQueryParams = this.$route.query;

        if (this.routeQueryParams.name) {
          this.tableTitle = this.routeQueryParams.name;
        }

        if (this.routeQueryParams.startDate == this.routeQueryParams.endDate) {
          this.isDay = true;
        } else {
          this.isDay = false;
        }
        console.log("routeQueryParams:", this.routeQueryParams);

        Object.assign(this.queryParams, this.routeQueryParams);
        this.$nextTick(async => {
            this.getData();
          }
        );
      },
      searchData() {
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {
        // this.loading = true
        // console.log("queryParams:", this.queryParams);
        // const {data} = await findPassList(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
        //   this.queryParams);
        //
        // this.tableData = data.records
        // this.page.total = data.total
        // this.loading = false
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      detail(row) {
        Object.assign(this.detailParams, {
          passId: row.passId, sectionId: row.tollRoadId
          , enTime: row.enTime, type: this.queryParams.type, pathLastnTime: row.pathLastnTime
        })
        console.log("detailParams:", this.detailParams);

        this.$refs.detailDialog.dialogVisible = true;
      },
      async exportExcel() {
        let params = {
          type: this.queryParams.type,
          startDate: this.queryParams.startDate,
          endDate: this.queryParams.endDate,
          tollRoadId: this.queryParams.tollRoadId,
        };

        await download({
          url: "api/v1/audit/list/feeAnalyse/exportPassList",
          method: 'post',
          params: null,
          data: params
        });
      }
    }
  }
</script>

<style scoped>
  .vxe-toolbar-self {
    position: absolute;
    right: 35px;
    top: 10px;
  }
</style>
