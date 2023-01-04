<template>
  <div class="app-container auditForm" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :show-message="false" :model="appForm" inline :rules="rules" :label-width="'100px'">
      <el-form-item label="机构" prop="sysOrgIdStr">
        <ti-sys-org style="width: 150px;" @change="orgChange" v-model="appForm.sysOrgIdStr" default-first-value/>
      </el-form-item>

      <el-form-item label="流水类型" prop="listType">
        <!--<ti-select style="width: 150px;" v-model="appForm.listType"  dict-type="tibms_kpi_listType" :multiple="false"/>-->
        <ti-select style="width: 150px;" v-model="appForm.listType"
                   :data-list="[{value:'1',name:'冲减流水'},{value:'2',name:'出口免费流水'},{value:'3',name:'纸券'},
                   {value:'5',name:'出入口车型不符'},{value:'6',name:'粤A00000车牌'},{value:'7',name:'兜底费率'}]"
                   :props="{key:'value',value:'value',label:'name'}"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="出口车道号" prop="laneNo">
        <ti-sys-lane clearable style="width: 150px;" :show-all="true" v-model="appForm.laneNo"  :cache="true" :station-id="appForm.stationId"/>
      </el-form-item>
      <el-form-item label="出口车道类型" prop="laneTypes">
        <ti-select style="width: 150px;" v-model="appForm.laneTypes" dict-type="tibms_com_laneType"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="通行介质类型" prop="mediaTypes">
        <ti-select style="width: 150px;" v-model="appForm.mediaTypes" dict-type="tibms_com_mediaType"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="出口车型" prop="vehicleTypes">
        <ti-select style="width: 150px;" v-model="appForm.vehicleTypes" dict-type="tibms_com_vehicleType"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="出口车种" prop="vehicleClasses">
        <ti-select style="width: 150px;" v-model="appForm.vehicleClasses" dict-type="tibms_com_vehicleClass"
                   :multiple="true"/>
      </el-form-item>


      <el-form-item label="特情类型" prop="specialTypes">
        <ti-select style="width: 150px;" v-model="appForm.specialTypes"
                   url="/api/v1/common/dict/dictList/tibms_audit_exSpecialType"
                   :props="{key:'vkey',value:'vkey',label:'vname'}"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="交易支付方式" prop="transPayType">
        <ti-select style="width: 150px;" v-model="appForm.transPayType" dict-type="tibms_com_transPayType"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item label="计费方式" prop="exitFeeType">
        <ti-select style="width: 150px;" v-model="appForm.exitFeeType" dict-type="tibms_com_exitFeeType"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="出口操作员" prop="exOperatorId">
        <ti-sys-user clearable with-have-org-user filterable style="width: 150px;" v-model="appForm.exOperatorId" :org-id="appForm.sysOrgIdStr"/>
      </el-form-item>

      <el-form-item label="车牌号码" prop="vehiclePlate">
        <el-input style="width: 150px;" v-model="appForm.vehiclePlate" type="text" placeholder="车牌号码"
                  maxlength="16"/>
      </el-form-item>

      <el-form-item label="通行介质编码" prop="mediaNo">
        <el-input style="width: 150px" v-model="appForm.mediaNo" type="text"
                  placeholder="通行介质编码" maxlength="20"/>
      </el-form-item>


      <el-form-item label="收费部抽查结论" prop="spotCheckStatuses">
        <ti-select style="width: 150px;" v-model="appForm.spotCheckStatuses" dict-type="tibms_kpi_spotCheckResult"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="出口交易编号" prop="listNo">
        <el-input style="width: 150px" v-model="appForm.listNo" type="text"
                  placeholder="出口交易编号" maxlength="64"/>
      </el-form-item>

      <el-form-item label="通行标识ID" prop="passId">
        <el-input style="width: 150px" v-model="appForm.passId" type="text"
                  placeholder="通行标识ID" maxlength="64"/>
      </el-form-item>

      <el-form-item label="工单号" prop="workOrderId">
        <el-input style="width: 150px" v-model="appForm.workOrderId" type="text"
                  placeholder="工单号" maxlength="20"/>
      </el-form-item>

      <el-form-item label="入口时间" prop="enDataRange">
        <ti-date-range clearable date-style="width:380px" v-model="appForm.enDataRange" date-type="datetimerange"
                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                       begin-key="enBeginDate" start-placeholder="起始日期"
                       end-key="enEndDate" end-placeholder="结束日期"/>
      </el-form-item>

      <el-form-item label="出口时间" prop="dataRange">
        <ti-date-range date-style="width:380px" v-model="appForm.dataRange" date-type="datetimerange"
                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                       begin-key="startDay" start-placeholder="起始日期"
                       end-key="endDay" end-placeholder="结束日期"/>
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
        @page-change="handlePageChange"
        @cell-dblclick="currentChangeEvent">
        <template v-slot:tbars>
          <el-button v-permission="['relatedExlist:expSpot']" type="primary" @click="expWork">导出</el-button>
        </template>
      </vxe-grid>
    </div>
    <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
    <el-drawer
      :visible.sync="isShowAudit"
      :with-header="false"
      :show-close="true"
      direction="rtl"
      size="82%">
      <list-audit-panel ref="audit" @submit="auditSubmit" :is-en-list="false" style="margin-top: 10px;">
        <template slot="operation">
          <el-button size="mini" :loading = "lastLoading" type="primary" icon="el-icon-arrow-left" @click="lastOne()">上一条</el-button>
          <el-button size="mini" :loading = "nextLoading" type="primary" icon="el-icon-arrow-right" @click="nextOne()">下一条</el-button>
        </template>
      </list-audit-panel>
    </el-drawer>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import { findList } from "@/views/fs/kpi/exSpot/exSpotApi"
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
import ListAuditPanel from "@/views/fs/kpi/common/listAuditPanel/listAuditPanel"
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: "kpi.exSpotView",
  components: { TiSysLane,TiExportExcel,TiSelect,TiDateRange,ListAuditPanel,tiSysOrg,TiSysUser },
  mixins: [...mixin],
  data() {
    return {
      isShowAudit: false,
      selectRowIndex: 0,
      lastLoading: false,
      nextLoading: false,
      appForm: {
        sysOrgIdStr: null,
        stationId: null,
        listType: null,
        laneNo: null,
        laneTypes: null,
        mediaTypes: null,
        vehicleTypes: null,
        vehicleClasses: null,
        specialTypes: null,
        exOperatorId: null,
        vehiclePlate: null,
        mediaNo: null,
        spotCheckStatuses: null,
        listNo: null,
        passId: null,
        transPayType: null,
        exitFeeType: null,
        workOrderId: null,
        dataRange:{
          startDay:this.$moment().format('YYYY-MM-DD')+" 00:00:00",
          endDay:this.$moment().format('YYYY-MM-DD')+" 23:59:59"
        },
        enDataRange:{
          enBeginDate: null,
          enEndDate: null
        },
        enBeginDate: null,
        enEndDate:null,
        beginDate:this.$moment().format('YYYY-MM-DD')+" 00:00:00",
        endDate:this.$moment().format('YYYY-MM-DD')+" 23:59:59"
      },
      rules: {
        dataRange: [{
          type: 'array',
          required: true,
          message: '',
          fields: {
            startDay: { type: 'string', required: true, message: '' },
            endDay: { type: 'string', required: true, message: '' }
          }
        }]
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
          id: 'kpi.exSpotView.toolbar',
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
          { type: 'seq', title: '序号',width: 60, align: 'center' },
          { field: 'workOrderId', title: '关联工单', minWidth: 200, align: 'center' },
          { field: 'listNo', title: '出口交易编号', minWidth: 320, align: 'center' },
          { field: 'listTypeTxt', title: '流水类型', minWidth: 200, align: 'center' },
          { field: 'specialType', title: '特情类型', minWidth: 150, align: 'center' },
          { field: 'enTime', title: '入口时间', minWidth: 160, align: 'center' },
          { field: 'enStationName', title: '入口收费站', minWidth: 150, align: 'center' },
          { field: 'enTollLaneNo', title: '入口车道号', minWidth: 100, align: 'center' },
          { field: 'enVehicleTypeTxt', title: '入口车型', minWidth: 130, align: 'center' },
          { field: 'exVehiclePlateTxt', title: '车牌号码', minWidth: 150, align: 'center' },
          { field: 'vehicleTypeTxt', title: '出口车型', minWidth: 130, align: 'center' },
          { field: 'vehicleClassTxt', title: '出口车种', minWidth: 130, align: 'center' },
          { field: 'exTime', title: '出口时间', minWidth: 160, align: 'center' },
          { field: 'exStationName', title: '出口收费站', minWidth: 120, align: 'center' },
          { field: 'exTollLaneNo', title: '出口车道号', minWidth: 100, align: 'center' },
          { field: 'laneTypeTxt', title: '出口车道类型', minWidth: 150, align: 'center' },
          { field: 'exitFeeTypeTxt', title: '计费方式', minWidth: 200, align: 'center' },
          { field: 'transPayTypeTxt', title: '交易支付方式', minWidth: 110, align: 'center' },
          { field: 'feeTxt', title: '总交易金额(元)', minWidth: 130, align: 'center' },
          { field: 'mediaTypeTxt', title: '通行介质类型', minWidth: 120, align: 'center' },
          { field: 'operatorTxt', title: '操作员', minWidth: 100, align: 'center' },
          { field: 'auditResultTxt', title: '稽核结论', minWidth: 150, align: 'center' },
          { field: 'auditUserId', title: '稽核人员', minWidth: 100, align: 'center'},
          { field: 'auditTime', title: '稽核时间', minWidth: 160, align: 'center' },
          { field: 'checkResultTxt', title: '审核结论', minWidth: 150, align: 'center' },
          { field: 'checkUserName', title: '审核人员', minWidth: 100, align: 'center' },
          { field: 'checkTimeTxt', title: '审核时间', minWidth: 160, align: 'center' }
        ]
      },
      exportExcel: {
        url: 'api/v1/kpi/relatedExlist/expSpot',
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
  provide(){
    return{
      nextOne:this.nextOne
    }
  },
  methods: {
    orgChange(val,org){
      if(org){
        this.appForm.stationId = org.stationId
      }
    },
    auditSubmit(data){
      const row = this.$refs.table.getCurrentRecord()
      this.$set(row,'auditResultTxt',data.auditResultTxt)
      this.$set(row,'auditUserName',data.createrTxt)
      this.$set(row,'auditTime',data.createTime)
    },
    // 通用查询设置
    async reload(){
      this.table.loading = true
      const res = await findList({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.appForm);
      if(res.code==200){
        this.table.data = res.data.records
        this.table.page.total = res.data.total
        this.selectRowIndex = 0
        if(this.table.data.length>0){
          this.showAudit()
        }
      }else{
        this.table.data = []
        this.table.page.total = 0
      }
      this.table.loading = false
    },
    submit(){
      this.$refs.appForm.validate((valid) => {
        if (valid) {
          this.appForm.beginDate = this.appForm.dataRange.startDay
          this.appForm.endDate = this.appForm.dataRange.endDay
          this.appForm.enBeginDate = this.appForm.enDataRange.enBeginDate
          this.appForm.enEndDate = this.appForm.enDataRange.enEndDate
          this.table.page.currentPage = 1
          this.selectRowIndex = 0;
          this.reload()
        } else {
          return false;
        }
      })
    },
    reset() {
      this.$refs['appForm'].resetFields()
    },
    // 分页改变事件
    handlePageChange({currentPage, pageSize}) {
      this.table.page.currentPage = currentPage
      this.table.page.pageSize = pageSize
      this.reload()
    },
    currentChangeEvent({row , rowIndex}) {
      this.selectRowIndex = rowIndex
      this.showAudit(row)
    },
    showAudit(){
      this.isShowAudit = true
      const row =  this.table.data[this.selectRowIndex]
      this.$refs.table.setCurrentRow(row)
      this.$nextTick(()=>{
        this.$refs.audit.init(row.listId)
      })
    },
    nextOne(){
      if(this.table.data.length==0){
        this.$message.warning("没有数据!");
        return;
      }
      if (this.selectRowIndex === this.table.data.length - 1) {
        this.$message.warning("已经是最后条数据了!");
        return;
      }
      this.nextLoading = true
      this.selectRowIndex = this.selectRowIndex + 1
      this.showAudit()
      this.nextLoading = false
    },
    lastOne(){
      if(this.table.data.length==0){
        this.$message.warning("没有数据!");
        return;
      }
      if (this.selectRowIndex === 0) {
        this.$message.warning("已经是第一条数据!");
        return;
      }
      this.lastLoading = true
      this.selectRowIndex = this.selectRowIndex - 1
      this.showAudit()
      this.lastLoading = false
    },
    expWork(){
      this.exportExcel.queryParams = this.appForm
      this.exportExcel.dialog = true
    }
  }
}
</script>

