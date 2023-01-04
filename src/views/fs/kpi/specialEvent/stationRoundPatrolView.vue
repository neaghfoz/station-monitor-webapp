<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="appForm" inline label-position="right" :label-width="'130px'">

      <el-form-item label="管理中心" prop="sysOrgIdStr">
        <mgr-select :clearable="true" style="width:160px" v-model="appForm.sysOrgIdStr"/>
      </el-form-item>
      <el-form-item label="工班日期" prop="appForm">
        <ti-date-range :clearable="true" date-style="width:280px" :editable="false" v-model="appForm"
                       date-type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                       end-key="endDay"/>
      </el-form-item>
      <el-form-item label="创建人" prop="creater">
        <ti-sys-user clearable filterable :cache="true"  with-have-org-user
                     :org-id="curOrg.id" :multiple="false" v-model="appForm.creater"/>
      </el-form-item>
      <el-form-item prop="signStartTime" v-show="false"/>
      <el-form-item prop="signEndTime" v-show="false"/>
      <el-form-item label="登记时间" prop="dataRange">
        <ti-date-range clearable date-style="width:350px" v-model="appForm" date-type="datetimerange"
                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                       begin-key="signStartTime" start-placeholder="起始时间"
                       end-key="signEndTime" end-placeholder="结束时间"/>
      </el-form-item>
      <el-form-item class="searchItem" >
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
        :editConfig="table.editConfig"
        @page-change="handlePageChange">
        >
        <template v-slot:tbars>
          <el-button v-permission="['stationRoundPatrol:save']" type="primary" @click="addItem">新增</el-button>
          <el-button v-permission="['stationRoundPatrol:exp']" type="primary" @click="expWork">导出</el-button>
        </template>

        <template #operate="{ row }">
          <div v-show="true">
            <div v-show="$refs.table.isActiveByRow(row)">
              <el-button type="text" v-permission="['stationRoundPatrol:save']" @click="saveRowEvent(row)">提交</el-button>
              <el-button type="text" @click="cancelRowEvent(row)">取消</el-button>
            </div>
            <div v-show="!$refs.table.isActiveByRow(row)">
              <!-- 待提交的数据，同个机构可以修改/删除 -->
              <div v-show="true">
                <el-button type="text" v-permission="['stationRoundPatrol:save']" @click="editRowEvent(row)">修改</el-button>
                <el-button type="text" v-if="isUserData(row.register)" v-permission="['stationRoundPatrol:delete']" @click="removeRowEvent(row)">删除</el-button>
              </div>
            </div>
          </div>
        </template>

        <template #orgEdit="{ row,column }">
          <mgr-select :disabled="curOrg.nodeLevel != 0" :clearable="false" v-model="row['serviceOrgId']" @change="orgChange"/>
        </template>
        <template #sectionEdit="{ row,column }">
          <ti-select ref="sectionIds" v-model="row['sectionId']"
                     url="/api/v1/common/road/findAllList"
                     :disabled="true"
                     :props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="true"/>
        </template>
        <template #stationEdit="{ row,column }">
          <ti-sys-org v-model="row['stationOrgId']" :data-list="orgDataListNew" :multiple="true" :cache="false" @change="stationChange" show-level="4"/>
        </template>
        <template #userEdit="{ row,column }">
          <ti-sys-user with-position with-have-org-user with-have-sys-org :cache="selUsers" :filterable="true" :org-id="curRow['serviceOrgId']" v-model="row['staffNo']" @change="staffChange"/>
        </template>
        <template #eventDayEdit="{ row,column }">
          <ti-date date-style="width:100%" v-model="row[column.property]"
                   dateType="date" :clearable="false" :futuredays="0" placeholder="选择工班日期"
                   format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
        </template>
        <template #eventTimeEdit="{ row,column }">
          <el-time-picker
            v-model="row['eventTimeRange']"
            is-range
            range-separator=","
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            @change="eventTimeChange"
          />
        </template>
        <template #shiftIdEdit="{ row,column }" >
          <ti-select v-model="row[column.property]" dict-type="tibms_kpi_squadType" :multiple="false"/>
        </template>
        <template #remarkEdit="{ row,column }">
          <el-input type="textarea" v-if="$refs.table.isActiveByRow(row)" v-model="row[column.property]" maxlength="200" show-word-limit/>
          <template v-else>{{ row[column.property] }}</template>
        </template>
        <template #eventDescEdit="{ row,column }">
          <el-input type="textarea" v-if="$refs.table.isActiveByRow(row)" v-model="row[column.property]" maxlength="500" show-word-limit/>
          <template v-else>{{ row[column.property] }}</template>
        </template>
      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import moment from 'moment'
  import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
  import { findList, saveItem,deleteItem } from "@/views/fs/kpi/specialEvent/stationRoundPatrolApi"
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";

  import MgrSelect from "@/views/fs/kpi/common/mgrSelect/mgrSelect"

  import kpiUtil from "@/views/fs/kpi/common/kpiUtil"
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi";
  import TiSysRoad from "@/views/pro/common/tiElement/tiSysRoad/tiSysRoad"

  export default {
    name: "kpi.event.stationRoundPatrolView",
    components: {TiDate, TiSelect,TiExportExcel,tiSysOrg,TiSysUser,TiDateRange,MgrSelect, tiSysOrgApi,TiSysRoad },
    mixins: [...mixin],
    data() {
      return {
        orgDataList:[],
        orgDataListNew:[],
        appForm: {
          sysOrgIdStr:null,
          startDay:null,
          endDay:null,
          creater: null,
          signStartTime: null,
          signEndTime: null
        },
        rules: {
          shiftId: [
            { required: true, message: '', trigger: 'change' }
          ],
          eventDay: [
            { required: true, message: '', trigger: 'change' }
          ]
        },
        userListCache: [],
        selUsers: [],
        rootId: null,
        curOrg: {},
        curRow:null,
        curOldRow: null,
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
            id: 'kpi.checkCivilView.toolbar',
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
          editConfig: {
            trigger: 'manual',
            mode: 'row',
            showStatus: true,
            showIcon: false,
            autoClear: false,
            immediate: true
          },
          columns: [
            { type: 'seq', title:'序号', width: 60, align: 'center' },
            { field: 'serviceOrgName', title: '管理中心', minWidth: 120, align: 'center',
              editRender: { }, slots: { edit: 'orgEdit' }},
            { field: 'eventDay', title: '工班日期', minWidth: 180, align: 'center',
              editRender: { }, slots: { edit: 'eventDayEdit' }
            },
            { field: 'shiftId', title: '工班', minWidth: 120, align: 'center',
              editRender: { }, slots: { edit: 'shiftIdEdit' },formatter: ({cellValue})=>this.dicFormat('tibms_kpi_squadType',cellValue)  },
            { field: 'eventTimeRange', title: '轮巡时段', minWidth: 200, align: 'center',
              editRender: { }, slots: { edit: 'eventTimeEdit' }
            },
            { field: 'sectionName', title: '轮巡路段', minWidth: 180, align: 'center',
              editRender: { }, slots: { edit: 'sectionEdit' }},
            { field: 'stationName', title: '轮巡站点', minWidth: 200, align: 'center',
              editRender: { }, slots: { edit: 'stationEdit' }  },
            { field: 'eventDesc', title: '特殊事件情况描述', minWidth: 220, align: 'left', headerAlign: 'center',
              editRender: { }, slots: { default: 'eventDescEdit', edit: 'eventDescEdit' }
            },
            { field: 'remark', title: '备注', minWidth: 220, align: 'left', headerAlign: 'center',
              editRender: { }, slots: { default: 'remarkEdit', edit: 'remarkEdit' }
            },
            { field: 'creater', title: '创建人', minWidth: 100, align: 'center', showOverflow: true },
            { field: 'createTime', title: '创建时间', minWidth: 160, align: 'center', showOverflow: true },
            { title: '操作', width: 120, fixed: 'right', align: 'center', slots: { default: 'operate' } }
          ]
        },
        exportExcel: {
          url: 'api/v1/kpi/stationRoundPatrol/exp',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },
    async created() {
      await kpiUtil.loadConfig(this.$store)
      this.curOrg = kpiUtil.curOrg
      if(!this.curOrg){
        // console.log(this.$store.getters.userInfo)
        // 由于尚未有获取根组织方法，目前暂时固定id@20210909
        this.curOrg = {id: '1376429660778266624'}
      }
      this.$nextTick(() => {
        this.submit()
      })
    },
    computed:{
      curOrgId(){
        if(!kpiUtil.curOrg){
          return ;
        }
        return kpiUtil.curOrg.id
      }
    },
    methods: {
      orgChange(val,node){
        if(node){
          this.curRow['serviceOrgId'] = node.id
          this.curRow['serviceOrgName'] = node.name
          this.rootId = node.parentId
        }
      },
      stationChange(val,node){
        if(node){
          let sectionIdArr = []
          let sectionNameArr = []
          let stationIdArr = []
          let stationNameArr = []
          node.forEach(station => {
            if(station.nodeLevel == 4){// 过滤只要收费站
              stationIdArr.push(station.stationId)
              stationNameArr.push(station.fullName)
              let existSid = false
              sectionIdArr.forEach(sid =>{
                if(station.roadId == sid){
                  existSid = true
                }
              })
              if(!existSid){
                sectionIdArr.push(station.roadId)
                sectionNameArr.push(station.roadName)
              }
            }
          })
          this.curRow['sectionId'] = sectionIdArr.join(',')
          this.curRow['sectionName'] = sectionNameArr.join(',')
          this.curRow['stationId'] = stationIdArr.join(',')
          this.curRow['stationName'] = stationNameArr.join(',')
        }else{
          this.curRow['stationName'] = null
          this.curRow['stationId'] = null
          this.curRow['sectionName'] = null
          this.curRow['sectionId'] = null
        }
      },
      eventTimeChange(time) {
        if(time){
          this.curRow['eventTimeRange'] = time
          this.curRow['eventStartTime'] = time[0]
          this.curRow['eventEndTime'] = time[1]
          // 自动选择对应工班
          const hour = time[0].substring(0,2)
          if(hour >= '00' && hour < '08'){
            this.curRow['shiftId'] = '1' //早班
          }else if(hour >= '08' && hour < '16'){
            this.curRow['shiftId'] = '2' //中班
          }else if(hour >= '16' && hour <= '23'){
            this.curRow['shiftId'] = '3' //晚班
          }
        }
      },
      dicFormat(type,value,dicItem){
        const dics = this.$dictUtils.getDictList(type)
        if(dicItem){
          dics.push(dicItem)
        }
        let result = ''
        dics.forEach(x=>{ if(x.value==value) { result = x.label ; return ;} })
        return result
      },
      // 新增
      async addItem(){
        if(!kpiUtil.curOrg){
          this.$notify.warning("当前用户没有分配机构，无法操作!")
          return ;
        }
        // 新增一个空的行
        var row = {
          serviceOrgId: this.curOrg.id,
          serviceOrgName: this.curOrg.name,
          stationOrgId: null,
          stationId: null,
          stationName: null,
          eventDay: null,
          shiftId: null,
          eventStartTime: null,
          eventEndTime: null,
          eventDesc: null,
          remark: null
        }
        this.table.data.splice(0,0, row)
        // 进入编辑
        await this.editRowEvent(row)
      },
      // 进入编辑状态
      async editRowEvent(row) {
        this.curRow = []
        this.curRow = row
        this.curOldRow = Object.assign({},row)
        await this.$refs.table.setActiveRow(row)
      },
      // 保存数据
      async saveData(row){
        this.table.loading = true
        try {
          /*if(!row['eventTimeRange'] || row['eventTimeRange'] == ''){
            row['eventTimeRange'] = []
          }*/
          const res = await saveItem(null,row);
          if(res.code==200){
            const id = row['eventNo']
            if(res.data!=null){
              kpiUtil.updateObj(res.data,row)
              this.$refs.table.clearActived()
              this.$notify.success('提交成功')
            }else{
              this.$notify.error('提交失败')
            }
          }else{
            this.table.data = []
            this.$notify.error('提交失败')
          }
        }finally {
          this.table.loading = false
        }
      },
      saveRowEvent(row) {
        this.saveData(row)
      },
      cancelRowEvent(row) {
        // 用旧值覆盖@20210924，避免编辑修改后取消，显示的是新值
        kpiUtil.updateObj(this.curOldRow,row)
        this.curRow = row
        if(this.$refs.table.isActiveByRow(row)){
          this.$refs.table.clearActived()
        }
        if(!row['eventNo']){
          this.$refs.table.remove(row)
          const idx = this.table.data.indexOf(row)
          if(idx>-1){
            this.table.data.splice(idx,1)
          }
          return  true;
        }
        return false;
      },
      // 删除事件
      removeRowEvent(row) {
        if(this.cancelRowEvent(row)) return;
        const eventNo = row.eventNo
        this.$confirm('请确认是否删除该记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 刷新当前页面
          const res = await deleteItem(eventNo);
          if(res.code==200){
            this.$notify.success('删除记录成功')
            this.reload()
          }else{
            this.$notify.error('删除记录失败')
          }
        })
      },
      expWork(){
        this.exportExcel.queryParams = this.appForm
        this.exportExcel.dialog = true
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
        this.$refs.appForm.validate((valid) => {
          if (valid) {
            this.table.page.currentPage = 1
            this.reload()
          } else {
            return false;
          }
        })
      },
      reset() {
        this.$refs['appForm'].resetFields()
        this.appForm.startDay = null
        this.appForm.endDay = null
      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      },
      isUserData(register){
        const username = this.$store.getters.userInfo.username
        return (username == register)
      }
    }
  }
</script>
