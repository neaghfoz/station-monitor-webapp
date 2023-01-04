<template>

  <el-dialog  width="60%"
              ref = "failListDialog"
             :modal-append-to-body='false'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             :close-on-click-modal=false
             :visible="failListShow">
      <span slot="title" class="dialog-footer">
        <span style="margin-left: 10px;">{{title}}</span>
        <span v-show = "showTitleFlag">(<span style="color: red">{{tableData.page.total}}</span>)</span>
      </span>
      <el-card shadow="never">

        <div class="box">

          <vxe-grid
            ref="xTable2"
            highlight-hover-row
            border
            resizable
            sync-resize
            auto-resize
            max-height="1000"
            class="vxe-table-element"
            :loading="tableData.loading"
            :data="tableData.columnsDataList"
            :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
            :pager-config="tableData.page"
            :toolbar="tableToolbar"
            :columns="tableData.tableColumns"
            @page-change="handlePageChange"
            @checkbox-all="({ selection }) => { selections = selection }"
            @checkbox-change="({ selection }) => { selections = selection }"
            @current-change="currentChangeEvent"
          >
            <template v-slot:toolbar_buttons>
              <el-button   type="primary" @click="getData"  v-permission="['transSta:findSendFailDetail']">刷新</el-button>
              <el-button   type="warning" @click="exportBtn" v-permission="['transSta:sendFailDetailexportExcel']">导出</el-button>
            </template>
          </vxe-grid>

          <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" :zIndex = "zIndex"></ti-export-excel>
        </div>
      </el-card>

  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import { findSendFailDetail } from '../transStaApi';
  import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
  import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
  import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
  export default {
    name: 'failListView',
    components: {TiSelect,TiSysLane, tiSysOrg, TiExportExcel},
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        failListShow: false,
        showTitleFlag: false,
        saveLoading: false,
        dailyMarks: [],
        zIndex: 20001,
        title: '',
        queryParams: {
          laneId: '',
          collectDateStr: '',
          linkType: '',
          listCode: ''
        },
        appForm: {
          stationId: ''
        },
        pRow:{},
        checkSyn: [],
        selectRow: {},
        reqData:{
          mark:''
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { title: '流水号', field: 'serialNumber', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '失败原因', field: 'sendFailReaSon', minWidth: 100, showOverflow: true, align: 'center'  }
          ],
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'right',
            pageSizes: [10, 20, 50],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          }
        },
        tableToolbar: {
          id: 'modules.paramQuery',
          custom: true,
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          slots: {
            buttons: 'toolbar_buttons'
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        tableHeight: null,
        selections: [],
        exportExcel: {
          url: '/api/v1/monitor/datamonitor/transSta/sendFailDetail/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },
    watch: {

    },
    mounted() {
    },
    created() {

    },
    activated() {
    },
    methods: {
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.failListShow = false;
      },
      close(){
        this.failListShow = false;
      },
      init(title, row, linkType) {
        this.title = title
        this.failListShow = true;
        this.queryParams.laneId = row.laneId
        this.queryParams.collectDateStr = row.collectDateText
        this.queryParams.linkType = linkType
        this.queryParams.listCode = row.listCode
        // 加载遮挡
        this.tableData.loading = true;
        this.getData()
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      async getData() {
        var data = this.queryParams
        this.showTitleFlag = false
        this.selectRow = {}
        // 加载遮挡
        this.tableData.loading = true;
        // 加载数据
        findSendFailDetail(Object.assign({}, {
          size: this.tableData.page.pageSize,
          current: this.tableData.page.currentPage,
        }), data).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false
          this.showTitleFlag = true
        });
        this.exportExcel.queryParams = this.queryParams


      },
      exportBtn() {
          this.exportExcel.dialog = true
          this.zIndex = this.$refs.failListDialog.$el.style.zIndex
      }
    }
  }
</script>

