<template>
  <div class="app-container auditForm" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :show-message="false" :model="appForm"
             inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org clearable style="width:150px" ref="sysOrg" @change="orgChange" v-model="appForm.sysOrgIdStr"/>
      </el-form-item>


      <el-form-item label="车道号" prop="laneNoStr">
        <ti-sys-lane  clearable filterable multiple :show-all="true" v-model="appForm.laneNoStr"  :cache="true" :station-id="appForm.sysOrgIdStr"/>
      </el-form-item>

      <el-form-item label="车道类型" prop="laneTypeStr">
        <ti-select style="width:150px"  v-model="appForm.laneTypeStr" dict-type="tibms_com_laneType" :multiple="true"/>
      </el-form-item>

      <el-form-item label="车道标识" prop="laneSign">
        <ti-select style="width:150px"  v-model="appForm.laneSign" dict-type="tibms_com_inOutType"/>
      </el-form-item>


      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="flex:1;min-height: 400px;">
      <vxe-grid
        ref="table"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        height="auto"
        class="vxe-table-element"
        :loading="table.loading"
        :start-index="(table.page.currentPage - 1) * table.page.pageSize"
        :pager-config="table.page"
        :columns="table.columns"
        :data="table.data"
        :toolbar="table.tableToolbar"
        @page-change="handlePageChange">
        <template v-slot:tbars>
          <el-button v-permission="['laneParam:exp']" type="primary" @click="expWork">导出</el-button>
        </template>
      </vxe-grid>
    </div>
    <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import { findList } from "@/views/pro/monitor/datamonitor/laneParam/laneParamApi"
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: "datamonitor.laneParamView",
  components: { TiSysLane,TiExportExcel,TiSelect,TiDateRange,tiSysOrg },
  mixins: [...mixin],
  data() {
    return {
      appForm: {
        sysOrgIdStr: null,
        org: null,
        laneNo: null,
        laneSign: null,
        laneTypeStr: null,
        laneNoStr: null
      },
      table:{
        loading: false,
        data:[],
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
        tableToolbar: {
          id: 'datamonitor.laneParamView.toolbar',
          custom: true,
          slots: {
            buttons: 'tbars'
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
        columns: [
          { field: 'roadName', title: '路段', minWidth: 120, align: 'center' },
          { field: 'stationName', title: '收费站', minWidth: 180, align: 'center' },
          { field: 'laneNo', title: '车道号', minWidth: 100, align: 'center' },
          { field: 'ip', title: 'IP', minWidth: 120, align: 'center' },
          { field: 'laneSignText', title: '车道标识', minWidth: 110, align: 'center' },
          { field: 'laneTypeText', title: '车道类型', minWidth: 110, align: 'center' },
          { field: 'laneStatusText', title: '车道状态', minWidth: 110, align: 'center',slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'connectStatus', title: '网络/通信连接状态', minWidth: 150, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else if(cellValue == '异常'){
                  return [<div style="background-color: red;color: #ffffff;">异常</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'opsVer', title: '软件版本', minWidth: 150, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'spcRateVersion', title: '在用最小费额版本号', minWidth: 150, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'notenableSpcRateVersion', title: '待启用最小费额版本号', minWidth: 160, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'cpuBlackListVersionall', title: '最新全量用户卡黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'cpuBlackListVersionadd', title: '最新增量用户卡黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'cpuBlackListrectime', title: '用户卡黑名单增量表最新接收时间', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                }else if(this.$moment(cellValue).format('YYYY-MM-DD') != this.$moment().format('YYYY-MM-DD')){
                  return [h('span', {
                    style: {
                      color: 'white',
                      background: 'red',
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }
                  }, cellValue)]
                }else {
                  return cellValue
                }
              }
            }
          },
          { field: 'cpuBlackListaddcountTxt', title: '用户卡黑名单增量表当日接收次数', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },

          { field: 'obuBlackListVersionall', title: '最新全量OBU黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'obuBlackListVersionadd', title: '最新增量OBU黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'obuBlackListrectime', title: 'OBU黑名单增量表最新接收时间', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                }else if(this.$moment(cellValue).format('YYYY-MM-DD') != this.$moment().format('YYYY-MM-DD')){
                  return [h('span', {
                    style: {
                      color: 'white',
                      background: 'red',
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }
                  }, cellValue)]
                }else {
                  return cellValue
                }
              }
            }
          },
          { field: 'obuBlackListaddcountTxt', title: 'OBU黑名单增量表当日接收次数', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },

          { field: 'vehicleBlackListVersionall', title: '最新全量稽核黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'vehicleBlackListVersionadd', title: '最新增量稽核黑名单版本号', minWidth: 210, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          },
          { field: 'vehicleBlackListrectime', title: '稽核黑名单增量表最新接收时间', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                }else if(this.$moment(cellValue).format('YYYY-MM-DD') != this.$moment().format('YYYY-MM-DD')){
                  return [h('span', {
                    style: {
                      color: 'white',
                      background: 'red',
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }
                  }, cellValue)]
                }else {
                  return cellValue
                }
              }
            }
          },
          { field: 'vehicleBlackListaddcountTxt', title: '稽核黑名单增量表当日接收次数', minWidth: 230, align: 'center' ,slots: {
              default: ({ row,column }) => {
                const cellValue =  row[column.property]
                if (cellValue == '未更新') {
                  return [<div style="background-color: red;color: #ffffff;">未更新</div>]
                } else {
                  return cellValue
                }
              }
            }
          }
        ]
      },
      exportExcel: {
        url: 'api/v1/laneParam/exp',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  created() {
    this.$nextTick(()=>{
      this.submit();
    })
  },
  methods: {
    orgChange(val,org){
      if (org){
        this.appForm.org = { nodeLevel: org.nodeLevel,roadId: org.roadId ,stationId: org.stationId  }
      }
    },
    // 通用查询设置
    async reload(){
      this.table.loading = true
      const res = await findList({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.appForm);
      if(res.code==200){
        this.table.data = res.data.records
        this.table.page.total = res.data.total
      }else{
        this.table.data = []
        this.table.page.total = 0
      }
      this.table.loading = false
    },
    submit(){
      this.table.page.currentPage = 1
      this.reload()
    },
    reset() {
      this.$refs['appForm'].resetFields()
      this.appForm.org = null
    },
    // 分页改变事件
    handlePageChange({currentPage, pageSize}) {
      this.table.page.currentPage = currentPage
      this.table.page.pageSize = pageSize
      this.reload()
    },
    expWork(){
     this.exportExcel.queryParams = this.appForm
      // this.exportExcel.queryParams = {}
      this.exportExcel.dialog = true
    }
  }
}
</script>


