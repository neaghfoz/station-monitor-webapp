<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="queryParams" inline
             label-position="right" :label-width="'130px'">
      <el-form-item label="管理中心" prop="sysOrgIdStr">
        <mgr-select :clearable="true" style="width:160px" v-model="queryParams.sysOrgIdStr"/>
      </el-form-item>

      <el-form-item label="工单状态" prop="workStates">
        <ti-select v-model="queryParams.workStates" dict-type="tibms_kpi_workState" style="width:120px;"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="收费部审核结论" prop="auditResult">
        <ti-select v-model="queryParams.auditResult" dict-type="tibms_kpi_checkResult" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item label="管理中心确认结果" prop="checkResult">
        <ti-select v-model="queryParams.checkResult" dict-type="tibms_kpi_checkResult" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item label="考核日期" prop="queryParams">
        <ti-date-range :clearable="true" date-style="width:280px" :editable="false" v-model="queryParams"
                       date-type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                       format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="checkStartDay"
                       end-key="checkEndDay"/>
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
          <el-button v-permission="['checkMoney:save']" type="primary" @click="addItem">新增工单</el-button>
          <el-button v-permission="['checkMoney:audit']" type="primary" @click="bachCheck(false)">批量审核</el-button>
          <el-button v-permission="['checkMoney:check']" type="primary" @click="bachCheck(true)">批量确认</el-button>
          <el-button type="primary" @click="checkLog">操作记录</el-button>
          <el-button v-permission="['checkMoney:imp']" type="primary" @click="impWork">导入工单</el-button>
          <el-button v-permission="['checkMoney:exp']" type="primary" @click="expWork">导出工单</el-button>
        </template>

        <template #operate="{ row }">
          <div v-show="row.workState==0">
            <div v-show="$refs.table.isActiveByRow(row)">
              <el-button type="text" v-permission="['checkMoney:save']" @click="saveRowEvent(row)">提交</el-button>
              <el-button type="text" @click="cancelRowEvent(row)">取消</el-button>
            </div>
            <div v-show="!$refs.table.isActiveByRow(row)">
              <!-- 待提交的数据，同个机构可以修改/删除 -->
              <div v-show="curOrgId==row.dataReferOrgId || !row['id']">
                <el-button type="text" v-permission="['checkMoney:save']" @click="editRowEvent(row)">修改</el-button>
                <el-button type="text" v-permission="['checkMoney:delete']" @click="removeRowEvent(row)">删除</el-button>
              </div>
            </div>
          </div>
          <div v-show="row.workState!=0">
            <el-button v-permission="['checkMoney:audit']" v-if="row.workState==1&&!$refs.table.isActiveByRow(row)" type="text" @click="auditData(row)">审核</el-button>
            <el-button v-permission="['checkMoney:check']" v-show="row.workState==2&&!$refs.table.isActiveByRow(row)" type="text" @click="checkData(row)">确认</el-button>
            <el-button type="text" v-permission="['checkMoney:save']" v-show="(row.workState==2||row.workState==1)&&!$refs.table.isActiveByRow(row)" @click="editRowEvent(row)">修改</el-button>
            <!-- 编辑时显示提示和取消 -->
            <el-button type="text" v-permission="['checkMoney:save']" v-show="$refs.table.isActiveByRow(row)" @click="saveRowEvent(row)">提交</el-button>
            <el-button type="text" v-show="$refs.table.isActiveByRow(row)" @click="cancelRowEvent(row)">取消</el-button>
          </div>
        </template>

        <template #orgEdit="{ row,column }">
          <mgr-select :disabled="row.id?true:false" :clearable="false" v-model="row['serviceOrgId']" @change="orgChange"/>
        </template>
        <template #stationEdit="{ row,column }">
          <ti-sys-org :data-list="orgDataListNew" :disabled="row.id?true:false" v-model="row['stationOrgId']" :cache="true"   @change="stationChange" show-level="4"/>
        </template>
        <template #laneNoEdit="{ row,column }">
          <ti-sys-lane :disabled="row.id?true:false" v-model="row[column.property]" :cache="true" :station-id="curRow.stationId"/>
        </template>
        <template #userEdit="{ row,column }">
          <ti-sys-user :disabled="row.id?true:false"  with-position with-have-sys-org with-have-org-user :filterable="true" :cache="selUsers" v-model="row['staffNo']"  @change="staffChange" :org-id="curRow['serviceOrgId']"/>
        </template>
        <template #checkDateEdit="{ row,column }">
          <ti-date :disabled="row.id?true:false" date-style="width:100%" v-model="row[column.property]"
                   dateType="date" :clearable="false"
                   format="yyyy-MM-dd" @change="checkDateChange" value-format="yyyy-MM-dd"/>
        </template>
        <template #secondLeaderEdit="{ row,column }">
          <ti-sys-user v-model="row['secondLeaderId']" :clearable="true" :filterable="true" :cache="userListCache" :org-id="rootId" @change="secondLeaderChange" />
        </template>
        <template #mainLeaderEdit="{ row,column }">
          <ti-sys-user v-model="row['mainLeaderId']" :disabled="curRow['secondLeaderId'] == null" :cache="userListCache" :clearable="true" :filterable="true" :org-id="rootId" @change="mainLeaderChange" />
        </template>
        <template #teamLeaderEdit="{ row,column }">
          <ti-sys-user v-model="row['teamLeaderId']" :disabled="curRow['mainLeaderId'] == null" :cache="userListCache" :clearable="true" :filterable="true" :org-id="rootId" @change="teamLeaderChange" />
        </template>
        <template #squadTypeEdit="{ row,column }" >
          <ti-select v-model="row[column.property]" dict-type="tibms_kpi_squadType" :multiple="false"/>
        </template>

        <template #payFeeEdit="{ row,column }">
          <el-input-number v-model="row['payFeeTxt']" @change="moneyChange(row)" :precision="2"  controls-position="right" :min="0"/>
        </template>
        <template #feeEdit="{ row,column }">
          <el-input-number v-model="row['feeTxt']" @change="moneyChange(row)" :precision="2" controls-position="right" :min="0"/>
        </template>

        <template #longFeeEdit="{ row,column }">
          <el-input-number v-model="row['longFeeTxt']" @change="moneyChange(row)" :precision="2"  controls-position="right" :min="0"/>
        </template>
        <template #shortFeeEdit="{ row,column }">
          <el-input-number v-model="row['shortFeeTxt']" @change="moneyChange(row)" :precision="2" controls-position="right" :min="0"/>
        </template>


        <template #scoreTypeEdit="{ row,column }" >
          <ti-select disabled v-model="row[column.property]" dict-type="tibms_kpi_scoreType" :clearable="false" :multiple="false"/>
        </template>
        <template #auditResultEdit="{ row,column }" >
          <ti-select v-if="$store.getters.roles.indexOf('checkMoney:audit')>-1 && row['workState']==1" v-model="row[column.property]" dict-type="tibms_kpi_checkResult" :multiple="false"/>
          <template v-else>{{ row['auditResultTxt'] }}</template>
        </template>
        <template #checkResultEdit="{ row,column }">
          <ti-select v-if="$store.getters.roles.indexOf('checkMoney:check')>-1 && row['workState']==2" v-model="row[column.property]" dict-type="tibms_kpi_checkResult" :multiple="false"/>
          <template v-else>{{ row['checkResultTxt'] }}</template>
        </template>
        <template #checkRemarkEdit="{ row,column }">
          <el-input v-if="(($store.getters.roles.indexOf('checkMoney:audit')>-1 && row['workState'] ==1) || ($store.getters.roles.indexOf('checkMoney:check')>-1 && row['workState'] ==2) || ($store.getters.roles.indexOf('checkMoney:save')>-1) && $refs.table.isActiveByRow(row) )" v-model="row[column.property]" maxlength="200"/>
          <template v-else>{{ row[column.property] }}</template>
        </template>

      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
      <ti-import
        :upload-url="imp.uploadUrl"
        :tpl-url="imp.tplUrl"
        :title="imp.title"
        :visible="imp.visible"
        accept=".xls,.xlsx"
        @onSuccess="importFinish"
        @close="imp.visible = false"
      />
      <ti-imp-error ref="impError"/>

      <!-- 批量操作 -->
      <el-dialog :title="batchForm.isMgr?'批量确认':'批量审核'" :visible.sync="batchWin" :rules="batchForm.isMgr?batchCheckRule:batchAuditRule" :width="'450px'">
        <el-form ref="batchForm" :rules="batchForm.isMgr?batchCheckRule:batchAuditRule" :model="batchForm" :label-width="'140px'">
          <template v-if="batchForm.isMgr">
            <el-form-item label="管理中心确认结果" prop="checkResult">
              <ti-select v-model="batchForm.checkResult" style="width:140px" dict-type="tibms_kpi_checkResult" :multiple="false"/>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="收费部审核结果" prop="auditResult">
              <ti-select v-model="batchForm.auditResult"  style="width:140px" dict-type="tibms_kpi_checkResult" :multiple="false"/>
            </el-form-item>
          </template>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="batchForm.checkRemark" style="width:200px" :autosize="{ minRows: 2}" maxlength="1000"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="batchWin = false">取 消</el-button>
          <el-button type="primary" @click="batchConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <check-log-win ref="log"/>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import { findList, saveItem, checkItem,auditItem,deleteItem } from "@/views/fs/kpi/checkMoney/checkMoneyApi"
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate"

import MgrSelect from "@/views/fs/kpi/common/mgrSelect/mgrSelect"
import CheckLogWin from "@/views/fs/kpi/common/checkLogWin/checkLogWin"

import kpiUtil from "@/views/fs/kpi/common/kpiUtil"
import TiImpError from "@/views/pro/common/tiElement/tiImpError/tiImpError";
import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'
import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi";

export default {
  name: "kpi.checkMoneyView",
  components: { TiDate,TiSelect,TiExportExcel,tiSysOrg,TiSysLane,TiSysUser,TiDateRange,MgrSelect,CheckLogWin,TiImpError,TiImport,tiSysOrgApi },
  mixins: [...mixin],
  data() {
    return {
      orgDataList:[],
      orgDataListNew:[],
      imp: {
        uploadUrl: 'api/v1/kpi/checkMoney/imp',
        tplUrl: 'api/v1/kpi/checkMoney/impTpl',
        title: '长短款考核工单导入',
        visible: false
      },
      queryParams: {
        sysOrgIdStr:null,
        auditResult:null,
        checkResult:null,
        checkStartDay:null,
        checkEndDay:null,
        workStates:null
      },
      batchWin: false,
      batchForm: {
        checkResult: null,
        auditResult: null,
        isMgr: false,
        checkRemark: null
      },
      batchAuditRule: {
        auditResult: [
          { required: true, message: '收费部审核结论不能为空', trigger: 'change' },
          { min: 1, message: '收费部审核结论不能为空', trigger: 'change' }
        ]
      },
      batchCheckRule: {
        checkResult: [
          { required: true, message: '管理中心确认结果不能为空', trigger: 'change' },
          { min: 1, message: '管理中心确认结果不能为空', trigger: 'change' }
        ]
      },
      userListCache: [],
      selUsers: [],
      rootId: null,
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
          id: 'kpi.checkMoneyView.toolbar',
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
          { type: 'checkbox', align:'center', width: 60 },
          { field: 'serviceOrgName', title: '管理中心', minWidth: 120, align: 'center',
            editRender: { }, slots: { edit: 'orgEdit' }
          },
          { field: 'stationName', title: '收费站', minWidth: 120, align: 'center',
            editRender: { }, slots: { edit: 'stationEdit' }  },
          { field: 'laneNo', title: '车道', minWidth: 110, align: 'center' ,
            editRender: { }, slots: { edit: 'laneNoEdit' } },
          { field: 'staffName', title: '姓名', minWidth: 120, align: 'center' ,
            editRender: { }, slots: { edit: 'userEdit' }  },
          { field: 'staffNo', title: '工号', minWidth: 110, align: 'center' },
          { field: 'staffRole', title: '岗位', minWidth: 100, align: 'center' },
          { field: 'secondLeaderName', title: '连带第一责任人', minWidth: 120, align: 'center',
            editRender: {}, slots: { edit: 'secondLeaderEdit' }
          },
          { field: 'mainLeaderName', title: '连带第二责任人', minWidth: 120, align: 'center',
            editRender: {}, slots: { edit: 'mainLeaderEdit' } },
          { field: 'teamLeaderName', title: '连带第三责任人', minWidth: 120, align: 'center',
            editRender: {}, slots: { edit: 'teamLeaderEdit' } },

          { field: 'squadType', title: '工班', minWidth: 120, align: 'center',
            editRender: { }, slots: { edit: 'squadTypeEdit' },formatter: ({cellValue})=>this.dicFormat('tibms_kpi_squadType',cellValue)  },

          { field: 'checkDay', title: '考核日期', minWidth: 180, align: 'center',
            editRender: { }, slots: { edit: 'checkDateEdit' }
          },

          { field: 'payFee', title: '应收通行费（元）', minWidth: 150, align: 'center',formatter: ({cellValue})=>this.fenToYuan(cellValue),
            editRender: { }, slots: { edit: 'payFeeEdit' }
          },
          { field: 'fee', title: '实收通行费（元）', minWidth: 150, align: 'center',formatter: ({cellValue})=>this.fenToYuan(cellValue),
            editRender: { }, slots: { edit: 'feeEdit' }
          },

          { field: 'longFee', title: '长款', minWidth: 150, align: 'center',formatter: ({cellValue})=>this.fenToYuan(cellValue) ,
            editRender: { }, slots: { edit: 'longFeeEdit' } },
          { field: 'shortFee', title: '短款', minWidth: 150, align: 'center',formatter: ({cellValue})=>this.fenToYuan(cellValue) ,
            editRender: { }, slots: { edit: 'shortFeeEdit' }},

          { field: 'scoreType', title: '绩效类型', minWidth: 120, align: 'center',
            editRender: { }, slots: { edit: 'scoreTypeEdit' },formatter: ({cellValue})=>this.dicFormat('tibms_kpi_scoreType',cellValue)  },
          { field: 'scoreVal', title: '绩效分值', minWidth: 110, align: 'center', showOverflow: true,formatter: ({cellValue})=>{return parseFloat(cellValue).toFixed(2)}},
          { field: 'auditResult', title: '收费部审核结论', minWidth: 130, align: 'center',
            editRender: { }, slots: { default: 'auditResultEdit', edit: 'auditResultEdit' }
          },
          { field: 'checkResult', title: '管理中心确认结果', minWidth: 140, align: 'center',
            editRender: { }, slots: { default: 'checkResultEdit', edit: 'checkResultEdit' }
          },
          { field: 'checkRemark', title: '备注', minWidth: 200, align: 'left', headerAlign: 'center',
            editRender: { }, slots: { default: 'checkRemarkEdit', edit: 'checkRemarkEdit' }
          },
          { field: 'workState', title: '工单状态', minWidth: 100, align: 'center', showOverflow: true,formatter: ({cellValue})=>this.dicFormat('tibms_kpi_workState',cellValue) },
          { field: 'creater', title: '创建人', minWidth: 100, align: 'center', showOverflow: true },
          { field: 'createTime', title: '创建时间', minWidth: 180, align: 'center', showOverflow: true },
          { title: '操作', width: 150, fixed: 'right', align: 'center', slots: { default: 'operate' } }
        ]
      },
      exportExcel: {
        url: 'api/v1/kpi/checkMoney/exp',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },

  async created() {
    this.queryParams.workStates = this.$route.query.workState
    await kpiUtil.loadConfig(this.$store)
    this.orgDataList = (await tiSysOrgApi.findTree()).data
    //新赋值给新变量，而不是引用地址，保证orgDataList的数组值不变
    this.orgDataList.forEach(x=>{
      const org = {};
      Object.assign(org,x)
      this.orgDataListNew.push(org);
    })
    this.$nextTick(() => {
      this.submit()
    })
  },
  computed:{
    secondLeaderRole(){
      return [kpiUtil.config.secondLeaderPosition, kpiUtil.config.tmpLeaderPosition]
    },
    mainLeaderRole(){
      return [kpiUtil.config.mainLeaderPosition]
    },
    teamLeaderRole(){
      return [kpiUtil.config.teamLeaderPosition]
    },
    operaterRole(){
      return [kpiUtil.config.operaterPosition]
    },
    curOrgId(){
      if(!kpiUtil.curOrg){
        return ;
      }
      return kpiUtil.curOrg.id
    }
  },
  methods: {
    orgChange(val,node){
      this.clearRelatedForm(null,null)
      this.curRow['stationName'] = null
      this.curRow['stationOrgId'] = null
      // 重新过滤收费站
      let centerArr
      if(!node){
        centerArr = this.orgDataList[0].children.filter(x=>x.nodeLevel = 4)
        this.curRow['serviceOrgId'] = null
        this.curRow['serviceOrgName'] = null
      }else{
        centerArr = this.orgDataList[0].children.filter(x=>x.centerName == node.centerName)
        this.curRow['serviceOrgId'] = node.id
        this.curRow['serviceOrgName'] = node.name
        this.rootId = node.parentId
      }
      // console.log(centerArr)
      this.orgDataListNew[0].children = centerArr
    },
    clearRelatedForm(orgId,stationNode){
      this.curRow['laneNo'] = null
      if(stationNode && stationNode.parentId != orgId){
        this.curRow['staffName'] = null
        this.curRow['staffNo'] = null
        this.curRow['staffRole'] = null
        this.curRow['mainLeaderId'] = null
        this.curRow['mainLeaderName'] = null
        this.curRow['secondLeaderId'] = null
        this.curRow['secondLeaderName'] = null
        this.curRow['teamLeaderId'] = null
        this.curRow['teamLeaderName'] = null
      }
    },
    stationChange(val,node){
      // 机构改变，将重置关联的表单
      this.clearRelatedForm(this.curRow['serviceOrgId'],node)
      if(node){
        this.curRow['stationName'] = node.name
        this.curRow['stationId'] = node.stationId
        // 设置管理中心机构
        const centerOrg = kpiUtil.getCenterOrg(node)
        if(centerOrg){
          this.curRow['serviceOrgName'] = centerOrg.name
          this.curRow['serviceOrgId'] = centerOrg.id
          this.rootId = centerOrg.parentId
        }else{
          this.curRow['serviceOrgName'] = null
          this.curRow['serviceOrgId'] = null
          this.rootId = null
        }
      }else{
        this.curRow['laneNo'] = null
        this.curRow['stationName'] = null
        this.curRow['stationId'] = null
      }
    },
    staffChange(val,node){
      if(node){
        this.curRow['staffName'] = node.realName
        this.curRow['staffRole'] = node.firstPositionName
        if(node.parent) {
          this.secondLeaderChange(node.parent.username,node.parent)
        }else{
          this.secondLeaderChange(null, {})
        }
      }
    },
    secondLeaderChange(val,node){
      if(node){
        this.curRow['secondLeaderName'] = node.realName
        if(!val || !this.curRow['secondLeaderId']){
          this.curRow['secondLeaderId'] = node.username
        }
        if(node.parent) {
          this.mainLeaderChange(node.parent.username,node.parent)
        }else{
          this.mainLeaderChange(null, {})
        }
      }
    },
    mainLeaderChange(val,node){
      if(node){
        this.curRow['mainLeaderName'] = node.realName
        if(!val || !this.curRow['mainLeaderId']){
          this.curRow['mainLeaderId'] = node.username
        }
        if(node.parent) {
          this.teamLeaderChange(node.parent.username,node.parent)
        }else{
          this.teamLeaderChange(null, {})
        }
      }
    },
    teamLeaderChange(val,node){
      if(node){
        this.curRow['teamLeaderName'] = node.realName
        if(!val || !this.curRow['teamLeaderId']){
          this.curRow['teamLeaderId'] = node.username
        }
      }
    },
    checkDateChange(time){
      //this.curRow['checkEndDay'] = time.substr(0,10)+' 23:59:59'
    },
    moneyChange(row){
      row.payFee = (row.payFeeTxt * 100).toFixed(0)
      row.fee = (row.feeTxt * 100).toFixed(0)
      row.longFee= row.longFeeTxt * 100
      row.shortFee= row.shortFeeTxt * 100
      const sum = row.longFee + row.shortFee
      row.longFee=  row.longFee.toFixed(0)
      row.shortFee= row.shortFee.toFixed(0)
      let score = 0
      // 【0，100）扣1分，【100，200）扣两分，依次类推往后每增100增扣1分，10分封顶
      if(sum>0){
        if(sum%10000 == 0){
          score = sum/10000+1
        }else{
          score = Math.ceil(sum/10000)
        }
        score = score>10?10:score
      }else{
        score = 0
      }
      row.scoreVal = score
      // 根据长短款修改绩效类型为默认，当长短款=0时默认为加分，当长短款!=0时默认为扣分@20210923
      if(row.longFee != 0 || row.shortFee != 0){
        row.scoreType = 2
      }else{
        row.scoreType = 1
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

    checkLog(){
      const rows = this.$refs.table.getCheckboxRecords()
      if(rows.length==0){
        this.$notify.warning(`请选择要查看日志的工单`)
        return
      }
      const ids = []
      rows.forEach(x=>{
        if(x.id){
          ids.push(x.id)
        }
      })
      this.$refs.log.show('money',ids)
    },
    bachCheck(isMgr){
      this.batchForm.isMgr = isMgr
      this.batchForm.checkResult = null
      this.batchForm.auditResult = null
      this.batchForm.checkRemark = null
      const rows = this.$refs.table.getCheckboxRecords()
      let title = isMgr?'确认':'审核'
      if(rows.length==0){
        this.$notify.warning(`请选择要批量${title}的工单`)
        return
      }
      let isGoging = true
      const workState = isMgr?2:1
      rows.forEach(x=>{
        if(x.workState != workState){
          isGoging = false
          return
        }
      })
      if(!isGoging){
        this.$notify.warning(`请选择待${title}的数据`)
        return
      }
      this.batchWin = true
    },
    // 批量审核、确认提交
    batchConfirm(){
      this.$refs.batchForm.validate((valid) => {
        if (valid) {
          if(this.batchForm.isMgr){
            this.checkData()
          }else{
            this.auditData()
          }
        }
      })
    },
    // 审核工单
    async auditData(row){
      const ids = []
      let entity = row
      if(row){
        ids.push(row.id)
      }else{
        const rows = this.$refs.table.getCheckboxRecords()
        entity = rows[0]
        rows.forEach(x=>{
          ids.push(x.id)
        })
        if(ids.length==1){
          row = entity
        }
      }
      entity['ids'] = ids.join(',')
      if(this.batchWin){
        entity.auditResult = this.batchForm.auditResult
        entity.checkRemark = this.batchForm.checkRemark
      }
      try {
        this.table.loading = true
        const res = await auditItem(null,entity);
        if(res.code==200) {
          if (res.data) {
            // 更新一条记录情况
            kpiUtil.updateObj(res.data, row)
          }else{
            this.reload()
          }
          if(this.batchWin){
            this.batchWin = false
          }
          this.$notify.success(res.message)
        }else {
          this.$notify.error(res.message)
        }
      }finally {
        this.table.loading = false
      }
    },

    // 确认工单
    async checkData(row){
      const ids = []
      let entity = row
      if(row){
        ids.push(row.id)
      }else{
        const rows = this.$refs.table.getCheckboxRecords()
        entity = rows[0]
        rows.forEach(x=>{
          ids.push(x.id)
        })
        if(ids.length==1){
          row = entity
        }
      }
      entity['ids'] = ids.join(',')
      if(this.batchWin){
        entity.checkResult = this.batchForm.checkResult
        entity.checkRemark = this.batchForm.checkRemark
      }
      try {
        this.table.loading = true
        const res = await checkItem(null,entity);
        if(res.code==200) {
          if (res.data) {
            // 更新一条记录情况
            kpiUtil.updateObj(res.data, row)
          }else{
            this.reload()
          }
          if(this.batchWin){
            this.batchWin = false
          }
          this.$notify.success(res.message)
        }else {
          this.$notify.error(res.message)
        }
      } finally {
        this.table.loading = false
      }
    },
    // 新增
    addItem(){
      if(!kpiUtil.curOrg){
        this.$notify.warning("当前用户没有分配机构，无法操作!")
        return ;
      }
      // 新增一个空的行
      var row = {
        serviceOrgId: null,
        serviceOrgName: null,
        stationOrgId: null,
        stationId: null,
        stationName: null,
        laneNo: null,
        staffNo: null,
        staffName: null,
        staffRole: null,
        squadType: null,
        scoreType:1,
        scoreVal: 0,
        checkDay: null,
        auditResult: null,
        checkResult: null,
        checkRemark: null,
        secondLeaderName: null,
        secondLeaderId: null,
        mainLeaderName: null,
        mainLeaderId: null,
        teamLeaderName: null,
        teamLeaderId: null,
        workState: 0,

        payFee: 0,
        fee: 0,
        longFee: 0,
        shortFee: 0,
        payFeeTxt: 0,
        feeTxt: 0,
        longFeeTxt: 0,
        shortFeeTxt: 0
      }
      this.table.data.splice(0,0, row)
      // 进入编辑
      this.editRowEvent(row)
    },
    // 进入编辑状态
    editRowEvent(row) {
      this.curRow = row
      this.curOldRow = Object.assign({}, row)
      this.$refs.table.setActiveRow(row)
    },

    // 保存数据
    async saveDate(row){
      this.table.loading = true
      try {
        const res = await saveItem(null,row);
        if(res.code==200){
          const id = row['id']
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
      this.saveDate(row)
    },
    cancelRowEvent(row) {
      //row = Object.assign({},this.curOldRow)
      kpiUtil.updateObj(this.curOldRow,row) // 用旧值覆盖@20210924，避免编辑修改后取消，显示的是新值
      this.curRow = row
      if(this.$refs.table.isActiveByRow(row)){
        this.$refs.table.clearActived()
      }
      if(!row['id']){
        this.$refs.table.remove(row)
        const idx = this.table.data.indexOf(row)
        if(idx>-1){
          this.table.data.splice(idx,1)
        }
        return  true;
      }
      return false;
    },
    // 删除指标
    removeRowEvent(row) {
      if(this.cancelRowEvent(row)) return;
      const ids = [row.id]
      this.$confirm('请确认是否删除该考核工单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 刷新当前页面
        const res = await deleteItem(ids.join(','));
        if(res.code==200){
          this.$notify.success('删除考核工单成功')
          this.reload()
        }else{
          this.$notify.error('删除考核工单失败')
        }
      });
    },


    impWork(){
      this.imp.visible = true
    },
    expWork(){
      this.exportExcel.queryParams = this.queryParams
      this.exportExcel.dialog = true
    },
    importFinish(resp, file, filelist) {
      if(resp.message){
        this.$alert(resp.message);
      }
      if(resp.code == 200 ){
        if(resp.data){
          this.$refs.impError.show(resp.data)
        }else{
          if(!resp.message){
            this.$alert('数据导入成功')
          }
          this.reload()
        }
      }else{
        if(!resp.message){
          this.$alert('导入发生异常，请检查文件内容格式稍后重试！')
        }
      }
    },

    // 通用查询设置
    async reload(){
      this.table.loading = true
      const res = await findList({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.queryParams);
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
      this.queryParams.checkStartDay = null
      this.queryParams.checkEndDay = null
    },
    // 分页改变事件
    handlePageChange({currentPage, pageSize}) {
      this.table.page.currentPage = currentPage
      this.table.page.pageSize = pageSize
      this.reload()
    },
    fenToYuan(value){
      return (parseFloat(value)/100.00).toFixed(2)
    }
  }
}
</script>
