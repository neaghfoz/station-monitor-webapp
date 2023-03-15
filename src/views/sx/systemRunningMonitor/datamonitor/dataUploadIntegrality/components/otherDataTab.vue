<template>
  <vxe-virtual-tree
    ref="otherDataVxe"
    highlight-hover-row
    border
    resizable
    sync-resize
    auto-resize
    class="vxe-table-element"
    max-height="1000"
    :loading="otherDataLoading"
    :columns="resourceColumns"
    :start-index="(page.currentPage - 1) * page.pageSize"
    :pager-config="page"
    :data="otherData"
    :header-cell-class-name="headerCellClassName"
    :cell-class-name="cellClassName"
    @page-change="handlePageChange"
  >
  </vxe-virtual-tree>
</template>

<script>
  import {
    getRoadProOtherData,
    getRoadProTransData,
    getStationProOtherData,
    getStationProTransData
  } from "../dataUploadIntegralityApi";
  import permissionMixin from 'ecip-web/utils/permission-mixin'

  export default {
    name: "systemRunningMonitor.otherDataTab",
    props:
      {
        otherDataQueryParams: {
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
        otherDataLoading: false,
        otherData: [],
        // resourceTableToolbar: {
        //   id: 'monitor.datamonitor.dataUploadIntegrality.otherData-toolbar',
        //   slots: {
        //     buttons: 'otherData_buttons'
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
        resourceColumns: []
      }
    },
    watch: {
      otherDataQueryParams: {
        handler(val) {
          if (val) {
            this.getOtherData(val)
          }
        },
        immediate: true
      },
      modelFlag: {
        handler(val) {
          if (val) {
            if (val === 'stationPro') {
              this.resourceColumns = [
                {
                  title: '路段名称',
                  field: 'roadText',
                  minWidth: 180,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '收费站',
                  field: 'stationText',
                  minWidth: 150,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '出入口类型',
                  field: 'inOutTypeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {title: '车道号', field: 'laneNo', minWidth: 80, fixed: 'left', showOverflow: true},
                {
                  title: '车道类型',
                  field: 'laneTypeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '数据类型',
                  field: 'listCodeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {title: '通行交易日期', field: 'collectDate', minWidth: 150, showOverflow: true},
                {
                  title: '车道',
                  prop: 'lane',
                  align: 'center',
                  children: [{
                    title: '生成流水数',
                    field: 'laneListCnt',
                    minWidth: 100,
                    showOverflow: true
                  },
                    {
                      title: '滞留流水数', field: 'laneRetainListCnt', minWidth: 100, showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.laneRetainListCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.laneRetainListCnt)]
                      //     } else {
                      //       return row.laneRetainListCnt;
                      //     }
                      //   }
                      // }
                    }]
                },
                {
                  title: '收费站',
                  prop: 'station',
                  align: 'center',
                  children: [{
                    title: '接收流水数',
                    field: 'stationRecvSuccessCnt',
                    minWidth: 100,
                    showOverflow: true
                  },
                    {
                      title: '入库失败数',
                      field: 'stationRecvFailCnt',
                      minWidth: 100,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.stationRecvFailCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.stationRecvFailCnt)]
                      //     } else {
                      //       return row.stationRecvFailCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-部发送成功数',
                      field: 'depSendSuccessCnt',
                      minWidth: 130,
                      showOverflow: true
                    },
                    {
                      title: '站-部发送失败数', field: 'depSendFailCnt', minWidth: 130, showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.depSendFailCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.depSendFailCnt)]
                      //     } else {
                      //       return row.depSendFailCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-部滞留流水数',
                      field: 'depSendRetainCnt',
                      minWidth: 130,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.depSendRetainCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.depSendRetainCnt)]
                      //     } else {
                      //       return row.depSendRetainCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-省发送成功数',
                      field: 'stationProSendSuccessCnt',
                      minWidth: 130,
                      showOverflow: true
                    },
                    {
                      title: '站-省发送失败数',
                      field: 'stationProSendFailCnt',
                      minWidth: 130,
                      showOverflow: true
                    },
                    {
                      title: '站-省滞留流水数',
                      field: 'stationProSendRetainCnt',
                      minWidth: 130,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.stationProSendRetainCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.stationProSendRetainCnt)]
                      //     } else {
                      //       return row.stationProSendRetainCnt;
                      //     }
                      //   }}
                    },
                  ]
                },

              ]
            } else if (val === 'roadPro') {
              this.resourceColumns = [
                {
                  title: '路段名称',
                  field: 'roadText',
                  minWidth: 180,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '收费站',
                  field: 'stationText',
                  minWidth: 150,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '出入口类型',
                  field: 'inOutTypeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {title: '车道号', field: 'laneNo', minWidth: 80, fixed: 'left', showOverflow: true},
                {
                  title: '车道类型',
                  field: 'laneTypeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {
                  title: '数据类型',
                  field: 'listCodeName',
                  minWidth: 100,
                  fixed: 'left',
                  showOverflow: true
                },
                {title: '通行交易日期', field: 'collectDate', minWidth: 150, showOverflow: true},
                {
                  title: '车道',
                  prop: 'lane',
                  align: 'center',
                  children: [{
                    title: '生成流水数',
                    field: 'laneListCnt',
                    minWidth: 100,
                    showOverflow: true
                  },
                    {
                      title: '滞留流水数', field: 'laneRetainListCnt', minWidth: 100, showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.laneRetainListCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.laneRetainListCnt)]
                      //     } else {
                      //       return row.laneRetainListCnt;
                      //     }
                      //   }}
                    }]
                },
                {
                  title: '收费站',
                  prop: 'station',
                  align: 'center',
                  children: [{
                    title: '接收流水数',
                    field: 'stationRecvSuccessCnt',
                    minWidth: 100,
                    showOverflow: true
                  },
                    {
                      title: '入库失败数',
                      field: 'stationRecvFailCnt',
                      minWidth: 100,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.stationRecvFailCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.stationRecvFailCnt)]
                      //     } else {
                      //       return row.stationRecvFailCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-部发送成功数',
                      field: 'depSendSuccessCnt',
                      minWidth: 130,
                      showOverflow: true
                    },
                    {
                      title: '站-部发送失败数', field: 'depSendFailCnt', minWidth: 130, showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.depSendFailCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.depSendFailCnt)]
                      //     } else {
                      //       return row.depSendFailCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-部滞留流水数',
                      field: 'depSendRetainCnt',
                      minWidth: 130,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.depSendRetainCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.depSendRetainCnt)]
                      //     } else {
                      //       return row.depSendRetainCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '站-路发送失败数',
                      field: 'roadSendFailCnt',
                      minWidth: 130,
                      showOverflow: true
                    },
                    {
                      title: '站-路滞留流水数',
                      field: 'roadSendRetainCnt',
                      minWidth: 130,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.roadSendRetainCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.roadSendRetainCnt)]
                      //     } else {
                      //       return row.roadSendRetainCnt;
                      //     }
                      //   }}
                    }]
                },
                {
                  title: '路段中心',
                  prop: 'road',
                  align: 'center',
                  children: [{
                    title: '接收流水数',
                    field: 'roadRecvSuccessCnt',
                    minWidth: 100,
                    showOverflow: true
                  },
                    {title: '入库失败数', field: 'roadRecvFailCnt', minWidth: 100, showOverflow: true},
                    {
                      title: '路段-省上传成功数',
                      field: 'roadProSendSuccessCnt',
                      minWidth: 140,
                      showOverflow: true
                    },
                    {
                      title: '路段-省上传失败数',
                      field: 'roadProSendFailCnt',
                      minWidth: 140,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.roadProSendFailCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.roadProSendFailCnt)]
                      //     } else {
                      //       return row.roadProSendFailCnt;
                      //     }
                      //   }}
                    },
                    {
                      title: '路段-省上传滞留数',
                      field: 'roadProSendRetainCnt',
                      width: 140,
                      showOverflow: true,
                      // slots: {
                      //   default: ({row}, h) => {
                      //     if (row.roadProSendRetainCnt > 0) {
                      //       return [h('span', {style: {color: 'white', background: 'red'}}, row.roadProSendRetainCnt)]
                      //     } else {
                      //       return row.roadProSendRetainCnt;
                      //     }
                      //   }}
                    }]
                }
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
        this.getOtherData();
      },
      async getOtherData() {
        this.otherDataLoading = true
        if (this.otherDataQueryParams.modelFlag === 'stationPro') {
          const {data} = await getStationProOtherData(
            Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.otherDataQueryParams)
          this.otherData = data.records
          this.page.total = data.total
        } else if (this.otherDataQueryParams.modelFlag === 'roadPro') {
          const {data} = await getRoadProOtherData(
            Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.otherDataQueryParams)
          this.otherData = data.records
          this.page.total = data.total
        }
        this.otherDataLoading = false
        this.$emit('pageChang', this.page)
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getOtherData()
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

