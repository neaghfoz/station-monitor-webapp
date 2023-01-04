<template>
  <div>
    <vxe-grid
      ref="stationVex"
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
        <el-button v-permission="['transSta:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
  </div>

</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';

  import {findPage} from '../transStaApi';

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";

  export default {
    name: "stationTab",
    props:
      {
        queryParams: {
          type: Object,
          required: false
        },
      },
    components: {TiExportExcel},
    mixins: [...mixin],
    data() {
      return {
        exportExcel: {
          url: 'api/v1/monitor/datamonitor/transSta/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'monitor.datamonitor.transSta.transStaView-toolbar',
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
          {title: '路段', field: 'roadText', minWidth: 150, showOverflow: true},
          {title: '收费站', field: 'stationText', minWidth: 150, showOverflow: true},
          /* {title: '出入口类型', field: 'entryExitTypeText', minWidth: 150, showOverflow: true},
           {title: '车道号', field: 'laneNo', minWidth: 100, showOverflow: true},
           {title: '车道类型', field: 'laneTypeText', minWidth: 150, showOverflow: true},*/
          {title: '数据类型', field: 'listCodeText', minWidth: 150, showOverflow: true},
          {title: '通行交易日', field: 'collectDateText', minWidth: 100, showOverflow: true},
          /*{
            title: '车道', align: 'center',
            children: [
              {title: '生成流水数', field: 'listCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '滞留流水数', field: 'retainListCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.retainListCnt > 100) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.retainListCnt)]
                    } else {
                      return row.retainListCnt;
                    }
                  }
                }
              },
            ]
          },*/
          {
            title: '收费站', align: 'center',
            children: [
              {title: '收费站接收流水数', field: 'recvSuccessCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '收费站入库失败数', field: 'recvFailCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.recvFailCnt > 0) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.recvFailCnt)]
                    } else {
                      return row.recvFailCnt;
                    }
                  }
                }
              },
              {title: '站省发送成功数', field: 'spSendSuccessCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '站省发送失败数', field: 'spSendFailCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.spSendFailCnt > 0) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.spSendFailCnt)]
                    } else {
                      return row.spSendFailCnt;
                    }
                  }
                }
              },
              {
                title: '站省滞留数', field: 'spSendRetainCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.spSendRetainCnt > 100) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.spSendRetainCnt)]
                    } else {
                      return row.spSendRetainCnt;
                    }
                  }
                }
              },
              {title: '站部发送成功数', field: 'sdSendSuccessCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '站部发送失败数', field: 'sdSendFailCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.sdSendFailCnt > 0) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.sdSendFailCnt)]
                    } else {
                      return row.sdSendFailCnt;
                    }
                  }
                }
              },
              {
                title: '站部滞留数', field: 'sdSendRetainCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.sdSendRetainCnt > 100) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.sdSendRetainCnt)]
                    } else {
                      return row.sdSendRetainCnt;
                    }
                  }
                }
              },
              /*{title: '站路发送成功数', field: 'srSendSuccessCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '站路发送失败数', field: 'srSendFailCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.srSendFailCnt > 0) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.srSendFailCnt)]
                    } else {
                      return row.srSendFailCnt;
                    }
                  }
                }
              },
              {
                title: '站路滞留数', field: 'srSendRetainCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.srSendRetainCnt > 100) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.srSendRetainCnt)]
                    } else {
                      return row.srSendRetainCnt;
                    }
                  }
                }
              },*/
              /*{title: '路省发送成功数', field: 'rpSendSuccessCnt', minWidth: 80, showOverflow: true, align: 'right'},
              {
                title: '路省发送失败数', field: 'rpSendFailCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.rpSendFailCnt > 0) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.rpSendFailCnt)]
                    } else {
                      return row.rpSendFailCnt;
                    }
                  }
                }
              },
              {
                title: '路省滞留数', field: 'rpSendRetainCnt', minWidth: 80, showOverflow: true, align: 'right', slots: {
                  default: ({row}, h) => {
                    if (row.rpSendRetainCnt > 100) {
                      return [h('span', {style: {color: 'white', background: 'red'}}, row.rpSendRetainCnt)]
                    } else {
                      return row.rpSendRetainCnt;
                    }
                  }
                }
              },*/
            ]
          },
        ]
      }
    },
    created() {
      // if (this.queryParams.model == 'station'){
      //   this.getData();
      // }
    },
    methods: {
      searchData(){
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

        //设置导出列
        this.exportExcel.queryParams.exportColumns = [];
        this.columns.forEach(x=>{
          if (x.field){
            this.exportExcel.queryParams.exportColumns.push(x.field);
          }else{
            x.children.forEach(y=>this.exportExcel.queryParams.exportColumns.push(y.field));
          }
        });

        this.loading = false
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
    }
  }

</script>

<style scoped>

</style>
