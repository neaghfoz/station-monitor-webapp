<template>
  <vxe-virtual-tree
    ref="transDataVxe"
    highlight-hover-row
    border
    resizable
    :loading="transDataLoading"
    sync-resize
    auto-resize
    class="vxe-table-element"
    max-height="1000"
    :columns="resourceColumns"
    :start-index="(page.currentPage - 1) * page.pageSize"
    :pager-config="page"
    :data="transData"
    :header-cell-class-name="headerCellClassName"
    :cell-class-name="cellClassName"
    @page-change="handlePageChange"
  >
  </vxe-virtual-tree>

</template>

<script>
  import {getRoadProTransData, getStationProTransData} from "../dataUploadIntegralityApi";
  import permissionMixin from 'ecip-web/utils/permission-mixin'

  export default {
    name: "transDataTab",
    props:
      {
        transDataQueryParams: {
          type: Object,
          required: false
        },
        modelFlag: {
          type: String,
          required: false
        }
      },
    components: {},
    mixins: [permissionMixin],
    data() {
      return {
        expand: false,
        transDataLoading: false,
        transData: [],
        // transDataTableToolbar: {
        //   id: 'monitor.datamonitor.dataUploadIntegrality.transData-toolbar',
        //   slots: {
        //     buttons: 'transData_buttons'
        //   },
        //   // 列宽操作记录
        //   resizable: {
        //     storage: true
        //   },
        //   // 列操作记录
        //   setting: {
        //     storage: true
        //   }
        // },
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
        resourceColumns: [],
      }
    },
    watch: {
      transDataQueryParams: {
        handler(val) {
          if (val) {
            this.getTransData()
          }

        },
        immediate: true
      },
      modelFlag: {
        handler(val) {
          if (val) {
            if (val === 'stationPro') {
              this.resourceColumns = [
                {title: '路段名称', field: 'roadText', minWidth: 180, fixed: 'left', showOverflow: true},
                {title: '收费站', field: 'stationText', minWidth: 150, fixed: 'left', showOverflow: true},
                {title: '出入口类型', field: 'inOutTypeName', minWidth: 100, fixed: 'left', showOverflow: true},
                {title: '车道号', field: 'laneNo', minWidth: 80, fixed: 'left', showOverflow: true},
                {title: '车道类型', field: 'laneTypeName', minWidth: 100, fixed: 'left', showOverflow: true},
                {title: '数据类型', field: 'listCodeName', minWidth: 100, fixed: 'left', showOverflow: true},
                {title: '通行交易日期', field: 'collectDate', minWidth: 150, showOverflow: true},
                {title: '车道', prop: 'lane', align: 'center', children: [
                    {title: '生成流水数', field: 'laneListCnt', minWidth: 100, showOverflow: true},
                    {title: '滞留流水数', field: 'laneRetainListCnt', minWidth: 100, showOverflow: true}
                    ]
                },
                {title: '收费站', prop: 'station', align: 'center', children: [
                    {title: '接收流水数', field: 'stationRecvSuccessCnt', minWidth: 100, showOverflow: true},
                    {title: '入库失败数', field: 'stationRecvFailCnt', minWidth: 100, showOverflow: true},
                    {title: '站-部发送成功数', field: 'depSendSuccessCnt', minWidth: 130, showOverflow: true},
                    {title: '站-部发送失败数', field: 'depSendFailCnt', minWidth: 130, showOverflow: true},
                    {title: '站-部滞留流水数', field: 'depSendRetainCnt', minWidth: 130, showOverflow: true},
                    {title: '站-省发送成功数', field: 'stationProSendSuccessCnt', minWidth: 130, showOverflow: true},
                    {title: '站-省发送失败数', field: 'stationProSendFailCnt', minWidth: 130, showOverflow: true},
                    {title: '站-省滞留流水数', field: 'stationProSendRetainCnt', minWidth: 130, showOverflow: true},
                  ]
                },

              ]
            }
          }

        },
        immediate: true
      },
    },
    methods: {
      searchData(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getTransData();
      },
      async getTransData() {
        this.transDataLoading = true
        if (this.transDataQueryParams.modelFlag === 'stationPro') {
          const {data} = await getStationProTransData(
            Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.transDataQueryParams)
          this.transData = data.records
          this.page.total = data.total
        } else if (this.transDataQueryParams.modelFlag === 'roadPro') {
          const {data} = await getRoadProTransData(
            Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.transDataQueryParams)
          this.transData = data.records
          this.page.total = data.total
        }
        this.transDataLoading = false
        this.$emit('pageChang', this.page)
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getTransData(this.transDataQueryParams)
        this.$emit('pageChang', this.page)
      },
      headerCellClassName({column, columnIndex}) {
        if (column.property === 'lane' || column.property === 'station' || column.property
          === 'road') {
          return 'col-blue'
        }

      },
      cellClassName({row, rowIndex, column, columnIndex}) {
        if (column.property === 'laneRetainListCnt') {
          if (row.laneRetainListCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'stationRecvFailCnt') {
          if (row.stationRecvFailCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'depSendFailCnt') {
          if (row.depSendFailCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'depSendRetainCnt') {
          if (row.depSendRetainCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'stationProSendRetainCnt') {
          if (row.stationProSendRetainCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'roadSendRetainCnt') {
          if (row.roadSendRetainCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'roadProSendFailCnt') {
          if (row.roadProSendFailCnt > 0) {
            return 'col-red'
          }
        } else if (column.property === 'roadProSendRetainCnt') {
          if (row.roadProSendRetainCnt > 0) {
            return 'col-red'
          }
        }
      }
    }
  }
</script>

<style>
  .col-red {
    background-color: red !important;
    color: #fff !important;
  }

  .col-blue {
    background-color: #2db7f5 !important;
    color: #fff !important;
  }
</style>
