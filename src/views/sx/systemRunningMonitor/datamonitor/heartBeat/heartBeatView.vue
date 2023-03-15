<template>
  <div class="app-container">
    <el-card>
    <el-row v-show="showConfig.lane=='true'">
      <vxe-grid
        ref="lane"
        highlight-hover-row
        border
        stripe
        round
        size="small"
        resizable
        sync-resize
        auto-resize
        max-height="1000"
        class="vxe-table-element"
        :loading="laneData.loading"
        :start-index="(laneData.page.currentPage - 1) * laneData.page.pageSize"
        :pager-config="laneData.page"
        :columns="laneData.columns"
        :data="laneData.tableData"
        :toolbar="laneData.tableToolbar"
        @page-change="lane_handlePageChange"
        @checkbox-all="({ selection }) => { laneData.selections = selection }"
        @checkbox-change="({ selection }) => { laneData.selections = selection }"
      >
        <template v-slot:toolbar_buttons>
          <span style="font-weight: bold;font-size: 16px">车道——连通性监视 <span :class="laneData.normalData==0?'green':'red'">{{laneData.normalData}}</span>/{{laneData.page.total}}</span>
          <el-button style="margin-left: 20px" @click="lane_search" size="small">刷新</el-button>
        </template>

      </vxe-grid>
    </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
    <el-row v-show="showConfig.station=='true'">
      <vxe-grid
        ref="station"
        highlight-hover-row
        border
        stripe
        round
        size="small"
        resizable
        sync-resize
        auto-resize
        max-height="1000"
        class="vxe-table-element"
        :loading="stationData.loading"
        :start-index="(stationData.page.currentPage - 1) * stationData.page.pageSize"
        :pager-config="stationData.page"
        :columns="stationData.columns"
        :data="stationData.tableData"
        :toolbar="stationData.tableToolbar"
        @page-change="station_handlePageChange"
        @checkbox-all="({ selection }) => { stationData.selections = selection }"
        @checkbox-change="({ selection }) => { stationData.selections = selection }"
      >

        <template v-slot:toolbar_buttons>
          <span style="font-weight: bold;font-size: 16px">收费站——连通性监视 <span :class="stationData.normalData==0?'green':'red'">{{stationData.normalData}}</span>/{{stationData.page.total}}</span>
          <el-button style="margin-left: 20px" @click="station_search" size="small">刷新</el-button>
        </template>

      </vxe-grid>
    </el-row>
    </el-card>

    <el-row v-show="showConfig.road=='true'">
      <vxe-grid
        ref="road"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        max-height="1000"
        class="vxe-table-element"
        :loading="roadData.loading"
        :start-index="(roadData.page.currentPage - 1) * roadData.page.pageSize"
        :pager-config="roadData.page"
        :columns="roadData.columns"
        :data="roadData.tableData"
        :toolbar="roadData.tableToolbar"
        @page-change="station_handlePageChange"
        @checkbox-all="({ selection }) => { roadData.selections = selection }"
        @checkbox-change="({ selection }) => { roadData.selections = selection }"
      >
        <template v-slot:toolbar_buttons>
          <span style="font-weight: bold;font-size: 18px">路段——连通性监视 <span :class="roadData.normalData==0?'green':'red'">{{roadData.normalData}}</span>/{{roadData.page.total}}</span>
          <el-button style="margin-left: 20px" @click="road_search">刷新</el-button>
        </template>

      </vxe-grid>
    </el-row>


    <el-row v-show="showConfig.mobile=='true'">
      <vxe-grid
        ref="mobile"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        max-height="1000"
        class="vxe-table-element"
        :loading="mobileData.loading"
        :start-index="(mobileData.page.currentPage - 1) * mobileData.page.pageSize"
        :pager-config="mobileData.page"
        :columns="mobileData.columns"
        :data="mobileData.tableData"
        :toolbar="mobileData.tableToolbar"
        @page-change="mobile_handlePageChange"
        @checkbox-all="({ selection }) => { mobileData.selections = selection }"
        @checkbox-change="({ selection }) => { mobileData.selections = selection }"
      >
        <template v-slot:toolbar_buttons>
          <span style="font-weight: bold;font-size: 18px">手持机——连通性监视 <span :class="mobileData.normalData==0?'green':'red'">{{mobileData.normalData}}</span>/{{mobileData.page.total}}</span>
          <el-button style="margin-left: 20px" @click="mobile_search">刷新</el-button>
        </template>

      </vxe-grid>
    </el-row>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import {getToken} from '@/utils/auth'
  import {countUse, findPage} from './heartBeatApi'
  import dictUtils from 'ecip-web/utils/dictUtils'

  export default {
    name: 'systemRunningMonitor.datamonitor.heartBeat.heartBeatView',
    components: {},
    mixins: [...mixin],
    data() {
      return {
        laneData: {
          queryParams: {
            model: 'lane'
          },
          global: {
            count: 0
          },
          importVisible: false,
          showSearch: false,
          loading: false,
          banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
          banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
          exportUrl: `api/v1/test_order/testOrder/exportExcel?token=${getToken()}`,
          tableToolbar: {
            id: 'systemRunningMonitor.datamonitor.heartBeat.heartBeatView-toolbar',
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
            pageSize: 5,
            align: 'left',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          },
          normalData: 0,
          selections: [],
          tableData: [],
          columns: [
            {
              title: '路段名称',
              field: 'roadText'
            },
            {
              title: '收费站',
              field: 'stationText'
            },
            {
              title: '车道号',
              field: 'laneNo'
            },
            {
              title: '车道ip',
              field: 'serverIp'
            },
            {
              title: '连通性',
              field: 'statusText',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('el-tag', {style: {color: '#f56c6c', background: '#fef0f0', borderColor: '#fde2e2'}}, row.statusText)]
                  } else {
                    //return row.statusText;
                    return [h('el-tag', {style: {color: '#67c23a', background: '#f0f9eb', borderColor: '#e1f3d8'}}, row.statusText)]
                  }
                }
              }
            },
            {
              title: '最近一次采集时间',
              field: 'hgCreateTime'
            },
            {
              title: '间隔时长（分钟）',
              field: 'periodMin',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'red'}}, row.periodMin)]
                  } else {
                    return row.periodMin;
                  }
                }
              }
            }
          ]
        },
        stationData: {
          queryParams: {
            model: 'station'
          },
          global: {
            count: 0
          },
          showSearch: false,
          loading: false,
          tableToolbar: {
            id: 'systemRunningMonitor.datamonitor.heartBeat.heartBeatView-toolbar',
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
            },
          },
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 5,
            align: 'left',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          },
          selections: [],
          tableData: [],
          columns: [
            {
              title: '路段名称',
              field: 'roadText'
            },
            {
              title: '收费站',
              field: 'stationText'
            },
            {
              title: '站级服务器ip',
              field: 'serverIp'
            },
            {
              title: '站级服务器',
              field: 'serverName'
            },
            {
              title: '连通性',
              field: 'statusText',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('el-tag', {style: {color: '#f56c6c', background: '#fef0f0', borderColor: '#fde2e2'}}, row.statusText)]
                  } else {
                    //return row.statusText;
                    return [h('el-tag', {style: {color: '#67c23a', background: '#f0f9eb', borderColor: '#e1f3d8'}}, row.statusText)]
                  }
                }
              }
            },
            {
              title: '最近一次采集时间',
              field: 'hgCreateTime'
            },
            {
              title: '间隔时长（分钟）',
              field: 'periodMin',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'red'}}, row.periodMin)]
                  } else {
                    return row.periodMin;
                  }
                }
              }
            }
          ],
        },
        roadData: {
          queryParams: {
            model: 'road'
          },
          global: {
            count: 0
          },
          importVisible: false,
          showSearch: false,
          loading: false,
          banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
          banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
          tableToolbar: {
            id: 'systemRunningMonitor.datamonitor.heartBeat.heartBeatView-toolbar',
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
            pageSize: 5,
            align: 'left',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          },
          normalData: 0,
          selections: [],
          tableData: [],
          columns: [
            {
              title: '路段名称',
              field: 'roadText'
            },
            {
              title: '路段服务器ip',
              field: 'serverIp'
            },
            {
              title: '路段服务器',
              field: 'serverName'
            },
            {
              title: '连通性',
              field: 'statusText',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'white', background: 'red'}}, row.statusText)]
                  } else {
                    return row.statusText;
                  }
                }
              }
            },
            {
              title: '最近一次采集时间',
              field: 'hgCreateTime'
            },
            {
              title: '间隔时长（分钟）',
              field: 'periodMin',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'red'}}, row.periodMin)]
                  } else {
                    return row.periodMin;
                  }
                }
              }
            }
          ],
        },
        mobileData: {
          queryParams: {
            model: 'mobile'
          },
          global: {
            count: 0
          },
          importVisible: false,
          showSearch: false,
          loading: false,
          banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
          banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
          tableToolbar: {
            id: 'systemRunningMonitor.datamonitor.heartBeat.heartBeatView-toolbar',
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
            pageSize: 5,
            align: 'left',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          },
          normalData: 0,
          selections: [],
          tableData: [],
          columns: [
            {
              title: '机构名称',
              field: 'orgNameText'
            },
            {
              title: '服务器ip',
              field: 'serverIp'
            },
            {
              title: '服务器',
              field: 'serverName'
            },
            {
              title: '连通性',
              field: 'statusText',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'white', background: 'red'}}, row.statusText)]
                  } else {
                    return row.statusText;
                  }
                }
              }
            },
            {
              title: '最近一次采集时间',
              field: 'hgCreateTime'
            },
            {
              title: '间隔时长（分钟）',
              field: 'periodMin',
              slots: {
                default: ({row}, h) => {
                  if (row.status == 'abnormal') {
                    return [h('span', {style: {color: 'red'}}, row.periodMin)]
                  } else {
                    return row.periodMin;
                  }
                }
              }
            }
          ],
        }
      }
    },
    computed: {
      showConfig() {
        return {
          lane: dictUtils.getDictLabel("tibms_config", "mo_haveLaneHeartBeat"),
          station: dictUtils.getDictLabel("tibms_config", "mo_haveStationHeartBeat"),
          road: dictUtils.getDictLabel("tibms_config", "mo_haveRoadHeartBeat"),
          mobile: dictUtils.getDictLabel("tibms_config", "mo_haveMobileHeartBeat"),
        }
      }
    },
    created() {

      if (this.showConfig.lane) {
        this.lane_search();
      }

      if (this.showConfig.station) {
        this.station_search();
      }

      if (this.showConfig.road) {
        this.road_search();
      }

      if (this.showConfig.mobile) {
        this.mobile_search();
      }

    },
    methods: {
      //--lane
      lane_search() {
        // Object.assign(this.$data.laneData.page, this.$options.data().laneData.page);
        this.$data.laneData.page.currentPage = 1
        this.lane_getData();
      },
      async lane_getData() {
        // 每次查询初始化checkbox selections
        this.laneData.selections = []
        this.laneData.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.laneData.page.pageSize, current: this.laneData.page.currentPage}), this.laneData.queryParams)
        this.laneData.tableData = data.page.records
        this.laneData.page.total = data.page.total
        this.laneData.normalData = data.normalData

        this.laneData.loading = false
      },
      lane_handlePageChange({currentPage, pageSize}) {
        this.laneData.page.currentPage = currentPage
        this.laneData.page.pageSize = pageSize
        this.lane_getData()
      },
      lane_exportExcel() {
        window.open(this.laneData.exportUrl)
      },
      lane_handleReset() {
        //this.lane_getData();
      },
      //--station
      station_search() {
        // Object.assign(this.$data.stationData.page, this.$options.data().stationData.page);
        this.$data.stationData.page.currentPage = 1
        this.station_getData();
      },
      async station_getData() {
        // 每次查询初始化checkbox selections
        this.stationData.selections = []
        this.stationData.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.stationData.page.pageSize, current: this.stationData.page.currentPage}), this.stationData.queryParams)
        this.stationData.tableData = data.page.records
        this.stationData.page.total = data.page.total
        this.stationData.normalData = data.normalData

        this.stationData.loading = false
      },
      station_handlePageChange({currentPage, pageSize}) {
        this.stationData.page.currentPage = currentPage
        this.stationData.page.pageSize = pageSize
        this.station_getData()
      },
      staion_exportExcel() {
        window.open(this.stationData.exportUrl)
      },
      station_handleReset() {
        //this.station_getData();
      },
      //--road
      road_search() {
        // Object.assign(this.$data.roadData.page, this.$options.data().roadData.page);
        this.$data.roadData.page.currentPage = 1
        this.road_getData();
      },
      async road_getData() {
        // 每次查询初始化checkbox selections
        this.roadData.selections = []
        this.roadData.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.roadData.page.pageSize, current: this.roadData.page.currentPage}), this.roadData.queryParams)
        this.roadData.tableData = data.page.records
        this.roadData.page.total = data.page.total
        this.roadData.normalData = data.normalData

        this.roadData.loading = false
      },
      road_handlePageChange({currentPage, pageSize}) {
        this.roadData.page.currentPage = currentPage
        this.roadData.page.pageSize = pageSize
        this.road_getData()
      },
      road_exportExcel() {
        window.open(this.roadData.exportUrl)
      },
      road_handleReset() {
        //this.road_getData();
      },

      //--mobile
      mobile_search() {
        // Object.assign(this.$data.mobileData.page, this.$options.data().mobileData.page);
        this.$data.mobileData.page.currentPage = 1
        this.mobile_getData();
      },
      async mobile_getData() {
        // 每次查询初始化checkbox selections
        this.mobileData.selections = []
        this.mobileData.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.mobileData.page.pageSize, current: this.mobileData.page.currentPage}), this.mobileData.queryParams)
        this.mobileData.tableData = data.page.records
        this.mobileData.page.total = data.page.total
        this.mobileData.normalData = data.normalData

        this.mobileData.loading = false
      },
      mobile_handlePageChange({currentPage, pageSize}) {
        this.mobileData.page.currentPage = currentPage
        this.mobileData.page.pageSize = pageSize
        this.mobile_getData()
      },
      mobile_exportExcel() {
        window.open(this.mobileData.exportUrl)
      },
      mobile_handleReset() {
        //this.mobile_getData();
      },
    }
  }

</script>

<style scoped>
  .red {
    color: red;
  }

  .green {
    color: green;
  }
</style>
