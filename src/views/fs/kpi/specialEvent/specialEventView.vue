<template>
  <div class="app-container auditForm" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :show-message="false" :model="appForm"
             inline :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org clearable style="width: 150px;" ref="sysOrgIdStr" v-model="appForm.sysOrgIdStr"/>
      </el-form-item>

      <el-form-item label="事件类别" prop="eventType">
        <ti-select v-model="appForm.eventTypesStr" dict-type="tibms_com_eventType" :multiple="true" :clearable="true" />
      </el-form-item>

      <el-form-item label="事件编号" prop="eventNo">
        <el-input clearable style="width: 150px;" v-model="appForm.eventNo" type="text" placeholder="事件编号"
                  maxlength="20"/>
      </el-form-item>

      <el-form-item label="事件标题" prop="title">
        <el-input clearable style="width: 150px;" v-model="appForm.title" type="text" placeholder="事件标题"
                  maxlength="100"/>
      </el-form-item>

      <el-form-item prop="startTime" v-show="false"/>
      <el-form-item prop="endTime" v-show="false"/>
      <el-form-item label="工班日期">
        <ti-date-range clearable date-style="width:245px" v-model="appForm" date-type="daterange"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                       begin-key="startTime" start-placeholder="起始日期"
                       end-key="endTime" end-placeholder="结束日期"/>
      </el-form-item>

      <el-form-item prop="signStartTime" v-show="false"/>
      <el-form-item prop="signEndTime" v-show="false"/>
      <el-form-item label="登记时间" prop="dataRange">
        <ti-date-range clearable date-style="width:350px" v-model="appForm" date-type="datetimerange"
                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                       begin-key="signStartTime" start-placeholder="起始时间"
                       end-key="signEndTime" end-placeholder="结束时间"/>
      </el-form-item>
      <el-form-item label="车牌" prop="vehiclePlate">
        <el-input clearable style="width: 150px;" v-model="appForm.vehiclePlate" type="text" placeholder="车牌"
                  maxlength="20"/>
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
          <el-button v-permission="['specialEvent:save']" type="primary" @click="addEvent()">新增</el-button>
          <el-button v-permission="['specialEvent:exp']" type="primary" @click="expWork">导出</el-button>
        </template>
        <template #operate="{ row }">
          <el-button type="text" v-permission="['specialEvent:detail']" @click="getEventDetail(row)">详情</el-button>
          <el-button type="text" v-permission="['specialEvent:save']"  @click="addEvent(row.eventNo)">修改</el-button>
          <el-button type="text" v-if="isUserData(row.register)" v-permission="['specialEvent:delete']" @click="removeRowEvent(row)">删除</el-button>
          <el-button type="text" v-if="matchEventType(row)" @click="skipEvent(row)">流水记录</el-button>
        </template>
      </vxe-grid>
    </div>
    <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import { findList,deleteItem } from "@/views/fs/kpi/specialEvent/specialEventApi"
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import specialEventDetail from "./specialEventDetail"
import kpiUtil from "@/views/fs/kpi/common/kpiUtil";

export default {
  name: "kpi.specialEventView",
  components: { TiExportExcel,TiSelect,TiDateRange,tiSysOrg,specialEventDetail },
  mixins: [...mixin],
  data() {
    return {
      lastTick: null,
      activatedTimes: 0,
      appForm: {
        sysOrgIdStr: null,
        eventType:null,
        startTime: null,
        endTime: null,
        signStartTime: null,
        signEndTime: null,
        eventNo: null,
        title: null,
        eventTypesStr: null,
        vehiclePlate: null
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
          id: 'kpi.specialEventView.toolbar',
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
          { type: 'seq', title:'序号', width: 60, align: 'center' },
          { field: 'eventNo', title: '事件编号', minWidth: 150, align: 'center' },
          { field: 'eventTypeTxt', title: '事件类别', minWidth: 150, align: 'center' },
          { field: 'title', title: '事件标题', minWidth: 200, headerAlign:'center', align: 'left' },
          { field: 'eventDay', title: '工班日期', minWidth: 150, align: 'center' },
          { field: 'serviceOrgName', title: '管理中心', minWidth: 120, align: 'center' },
          { field: 'sectionName', title: '路段', minWidth: 120, align: 'center' },
          { field: 'stationName', title: '收费站', minWidth: 120, align: 'center' },
          { field: 'endStationName', title: '收费站(终点)', minWidth: 120, align: 'center', visible: false },
          { field: 'vehiclePlate', title: '车牌', minWidth: 120, align: 'center' },
          { field: 'dealerName', title: '检查/处理人', minWidth: 110, align: 'center' },
          { field: 'registerName', title: '登记人', minWidth: 110, align: 'center' },
          { field: 'registTime', title: '登记时间', minWidth: 150, align: 'center' },
          { title: '操作', width: 150, fixed: 'right', align: 'center', slots: { default: 'operate' } }
        ]
      },
      exportExcel: {
        url: 'api/v1/kpi/specialEvent/exp',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  created() {
    // 初始化tick参数，避免首次新增事件后返回未刷新重查询
    //this.$router.push({ query: Object.assign(this.$route.query, { tick: new Date().getTime() }) })
    if(!this.lastTick){
      this.lastTick = new Date().getTime()
    }
    console.log("created")
    this.exportExcel.queryParams = this.appForm
    this.$nextTick(()=>{
      this.submit();
    })
  },
  computed:{
    reflesh(){
      return this.$route.query.tick
    }

  },
  activated() {
    if(!this.lastTick && this.activatedTimes == 0){
      this.activatedTimes++;
      this.$nextTick(()=>{
        this.submit();
      })
    }
    //console.log("activated")
  },
  watch: {
    reflesh: {
      handler(newVal, oldVal) {
        if(oldVal){
          this.lastTick = oldVal
        }
        if(newVal && this.lastTick && newVal != this.lastTick)
          this.submit()
      },
      immediate: true
    }
  },
  methods: {
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
     // this.appForm.sysOrgIdStr = this.$refs.sysOrgIdStr.getDefaultFirstValue()
      this.appForm.eventType = null
      this.appForm.eventTypesStr = null
    },
    // 分页改变事件
    handlePageChange({currentPage, pageSize}) {
      this.table.page.currentPage = currentPage
      this.table.page.pageSize = pageSize
      this.reload()
    },
    expWork(){
      this.exportExcel.queryParams = this.appForm
      this.exportExcel.dialog = true
    },
    getEventDetail(row){
      this.$router.push({
        path: '/kpi/event/detail/',
        query: {
          eventNo:row.eventNo,
          issee: 1
        }
      });
    },
    addEvent(eventNo){
      // 先关闭已打开的tab
      /*const index = this.$store.state.tagsView.visitedViews.findIndex(item => item.path === '/kpi/event/detail/')
      if(index > -1){
        this.$store.state.tagsView.visitedViews.splice(index, 1)
        console.log('aaaa')
      }*/
      this.$router.push({
        path: '/kpi/event/detail/',
        query: {
          eventNo:eventNo,
          timestamp: (new Date()).getTime()
        }
      });
    },
    skipEvent(row){
      let url = '/search/laneEnList'
      console.log(row)
      if(row.entryExitType == '2'){
        url = '/search/laneExList'
      }
      if(row.eventType == '5'){
        url = '/search/breakPassRecord'
      }
      this.$router.push({
        path: url,
        query: {
          type: 'queryByEvent',
          stationOrgId: row.stationOrgId,
          eventDay: row.eventDay,
          vehiclePlate: row.vehiclePlate,
          entryExitType: row.entryExitType
        }
      });
    },
    // 删除特殊事件
    removeRowEvent(row) {
      const eventNo = row.eventNo
      this.$confirm('请确认是否删除该特殊事件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 刷新当前页面
        const res = await deleteItem(eventNo)
        if (res.code == 200) {
          this.$notify.success('删除特殊事件成功')
          await this.reload()
        } else {
          this.$notify.error('删除特殊事件失败')
        }
      })
    },
    matchEventType(row){
      // 仅事件类别为1、2、3、5、7、8、10、11、14 且登记事件中的工班日期及入出口类型、收费站、车牌同时有值时显示【关联流水记录】操作按钮
      if(row.eventDay && row.entryExitType && row.stationOrgId && row.vehiclePlate){
        return [1,2,3,5,7,8,10,11,14].includes(row.eventType*1)
      }
      return false
    },
    isUserData(register){
      const username = this.$store.getters.userInfo.username
      return (username == register)
    }
  }
}
</script>


