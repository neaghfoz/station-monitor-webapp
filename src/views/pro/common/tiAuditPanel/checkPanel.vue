<template>
  <div style="margin-bottom: 20px;" v-if="enabled" v-loading="loading" element-loading-background="rgb(114 121 127 / 40%)" class="el-card box-card bgColor">
     <el-col class="el-col-md-8" style="height: 100%;background-color:#f3f4f9; ">
        <el-form :model="auditData" :rules="stationRules" ref="auditDataForm"
                  :disabled="stationDisabled" style="padding-top:3px;">
          <el-form-item>
            <div class="el-card__header" style="padding: 1px">
              {{ title }}
              <div style="float:right">
                <el-button type="success" @click="submit">提交</el-button>
              </div>
            </div>
            <table class="audit-table" style="width: 100%">
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核结论" prop="auditStatusStation">
                    <ti-select :clearable="false" v-model="auditData.auditStatusStation"
                                dict-type="tibms_audit_auditResult"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核车牌" prop="auditVehiclePlateStation">
                    <el-input style="width: 50%"
                              v-model="auditData.auditVehiclePlateStation" type="text"
                              placeholder="车牌号码" maxlength="16"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车型" prop="auditVehicleTypeStation">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="auditData.auditVehicleTypeStation"
                                dict-type="tibms_com_vehicleType"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核轴数" prop="auditAxleCountStation">
                    <el-input style="width: 50%" v-model="auditData.auditAxleCountStation"
                              type="text" placeholder="稽核轴数"
                              oninput="value=value.replace(/[^\d]/g, '')"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车种" prop="auditVehicleClassStation">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="auditData.auditVehicleClassStation"
                                dict-type="tibms_com_vehicleClass"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="证据文件" prop="auditFileStation">
                    <!--                            <el-input style="width: auto" v-model="auditData.auditFileStation" type="file"/>-->
                    <el-button type="warning"
                                style="display: inline-block;width: 20%;border-radius: 0px;"
                                @click="addEvidence('station')">+
                    </el-button>
                    <ti-evidence ref="evidenceStation" :params="evidenceParams"
                                  :upload-flag="true" @evidenceFileInfo="evidenceFileInfoStation"></ti-evidence>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核说明" prop="auditDescriptionStation">
                    <el-input style="width: 80%" type="text"
                              v-model="auditData.auditDescriptionStation"/>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form-item>
        </el-form>
      </el-col>
  </div>
</template>
<script>
import mixin from "@ecip/ecip-web/src/utils/common-mixin";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import request from "@ecip/ecip-web/src/utils/request"
import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"
import {cloneDeep, deepClone} from '@ecip/ecip-web/src/utils'

export default {
  name: "CheckPanelView",
  components: { TiSelect,TiSysOrg,TiSysUser,TiEvidence },
  mixins: [...mixin],
   props: {
    title: {
      type: [Boolean],
      required: true
    },
    auditType: {
      type: [Number],
      required: true
    },
    getOperater: {
      type: [Object],
      required: true
    }
  },
  data() {
    const escapeValidate = (rule, value, callback) => {
      if ((this.data['escapeSuspect']=='2' || this.data['escapeSuspect']=='3') && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    };
    const escapeMoney = (rule, value, callback) => {
      if ((this.data['escapeSuspect']=='2' || this.data['escapeSuspect']=='3') && value<1) {
        callback(new Error(''));
      } else{
        callback();
      }
    };
    const bizCriterionValidate = (rule, value, callback) => {
      if ((this.data['bizCriterion']=='2') && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    };
    const checkDescValidate = (rule, value, callback) => {
      if ((this.data['checkResult']=='2') && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    };
    const formData = {
      listType: null,
      auditResult: null,
      bizCriterion: null,
      indiType: 'YWJN',
      indiId: null,
      scoreType: null,
      scoreVal: null,
      secondLeaderId: null,
      mainLeaderId: null,
      indiDesc: null,
      maxScoreVal: null,
      modState: null,
      escapeSuspect: 1,
      escapeTypeTotal: null,
      escapeMoneyStr: 0,
      escapeMoney: 0,
      escapeType: null,
      checkResult: null,
      checkDesc: null
    }
    return {
      disabled: false,
      loading: false,
      config: kpiUtil.config,
      data: deepClone(formData) ,
      default: deepClone(formData),
      orgId: null,
      listId:null,
      workId:null,
      checkResult: null,
      listType: null,
      appealTimes:0,
      appealStatus:null,
      checkStatus:null,
      spotCheckStatus:null,
      auditStatus: null,
      isEnList: null,
      listInfo: null,
      rules:{
        checkResult: [
          { required: true, message: '', trigger: 'change' }
        ],
        listType: [
          { required: true, message: '', trigger: 'change' }
        ],
        auditResult: [
          { required: true, message: '', trigger: 'change' }
        ],
        bizCriterion: [
          { validator:bizCriterionValidate, message: '', trigger: 'change' }
        ],
        indiType: [
          { validator:bizCriterionValidate, message: '', trigger: 'change' }
        ],
        indiId: [
          { validator:bizCriterionValidate, message: '', trigger: 'change' }
        ],
        scoreType: [
          { validator:bizCriterionValidate, message: '', trigger: 'change' }
        ],
        scoreVal: [
          { validator:bizCriterionValidate, message: '', trigger: 'change' }
        ],
        secondLeaderId: [
          { validator:bizCriterionValidate, trigger: 'change' }
        ],
        mainLeaderId: [
          { validator:bizCriterionValidate, trigger: 'change' }
        ],
        escapeSuspect: [
          { required: true, message: '', trigger: 'change' }
        ],
        escapeTypeTotal: [
          { validator:escapeValidate, trigger: 'change' }
        ],
        escapeType: [
          { validator:escapeValidate, trigger: 'change' }
        ],
        escapeMoney: [
          { validator:escapeMoney, trigger: 'change' }
        ],
        checkDesc: [
          { validator:checkDescValidate, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.staffChange()
      },
      deep: true
    }
  },
  computed:{
    secondLeaderRole(){
      return kpiUtil.config?[kpiUtil.config.secondLeaderPosition, kpiUtil.config.tmpLeaderPosition]:[]
    },
    mainLeaderRole(){
      return kpiUtil.config?[kpiUtil.config.mainLeaderPosition]:[]
    },
    operaterRole(){
      return kpiUtil.config?[kpiUtil.config.operaterPosition]:[]
    },
    enabled(){
      return ((this.config.enableSectionCheck && this.auditType == 3)
      ||(this.config.enableMgrCenterCheck && this.auditType == 5))
    },
    isSee(){
      return this.$store.getters.roles.indexOf(this.isEnList?'kpiAuditLog:enCheck':'kpiAuditLog:exCheck')==-1
        ||this.disabled
        || !this.auditStatus
          // 没有申诉、没有抽查不合格，没有待审核
        || (this.data.auditType == this.auditType && this.appealStatus ==0 && this.spotCheckStatus !=2 && this.checkStatus == 1)
    },
    canAppeal(){
      return this.$store.getters.roles.indexOf(this.isEnList?'kpiAuditLog:enAppeal':'kpiAuditLog:exAppeal')>-1 && (this.data.auditType == this.auditType && this.appealStatus ==0 && this.spotCheckStatus !=2 && this.checkStatus == 1 && this.checkResult == 1 )
    }
  },
  async created() {
    await kpiUtil.loadConfig(this.$store)
    this.default = deepClone(this.data)
  },
  methods: {
    async getData(){
      this.loading = true
      try {
        const url = `api/v1/kpi/kpiAuditLog/lastItem/${this.listId}/${this.workId}/${this.auditType}`
        const res = await request({
          url: url,
          method: 'get',
          params: {},
          data: {}
        });
        if(res.code==200){
          if(res.data){
            this.data = res.data
            if(this.checkStatus==0){
              this.data.checkResult = null
              this.data.checkDesc = null
            }
            if(this.data.escapeMoney){
              this.data.escapeMoneyStr = (parseFloat(this.data.escapeMoney)/100).toFixed(2)
            }
          }else{
            this.data = deepClone(this.default)
            this.data.listType = this.listType
            this.disabled = false
          }
        }else{
          this.data = deepClone(this.default)
          this.data.listType = this.listType
        }
      }finally {
        this.loading = false
      }
    },
    async saveData(){
      this.loading = true
      try { 
        this.$emit("submit",this.data)
      } finally {
        this.loading = false
      }
    },
    submit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.data['auditType'] = this.auditType
          this.data['listId'] = this.listId
          this.data['workOrderId'] = this.workId
          this.saveData()
        }
      })
    },
    // 申诉
    async appeal(){
      this.loading = true
      try {
        // 稽核类型：1 站级稽核，2路段稽核，3路段审核，4管理中心稽核，5管理中心审核，6路段申诉，7管理中心申诉，8收费部抽查
        this.data['auditType'] = this.auditType==5?7:6
        this.data['listId'] = this.listId
        this.data['workOrderId'] = this.workId
        const url = `api/v1/kpi/kpiAuditLog/`+(this.isEnList?'enAppeal':'exAppeal')
        const res = await request({
          url: url,
          method: 'post',
          params: {},
          data: this.data
        });
        if(res.code==200){
          this.$message.success("申诉成功")
          this.appealTimes++
          this.listInfo.appealTimes++
          this.appealStatus =1
          this.checkStatus = 0
          this.disabled = false
          if(res.data){
            this.data = res.data
          }
          this.$emit("submit",this.data)
        }
      }finally {
        this.loading = false
      }
    },
    listTypeChange(newVal,oldVal,selectData){
      if(!newVal) return []
      const dicDatas = selectData.filter(x=>x.value.startsWith(newVal+'-'))
      return dicDatas
    },
    escapeBigTypeChange(newVal,oldVal,selectData){
      if(!newVal) return []
      const dicDatas = selectData.filter(x=>x.value.startsWith(newVal+'-'))
      return dicDatas
    },

    indiTypeChange(val){
      this.data['indiId'] = null
      this.data['indiDesc'] = null
      this.data['scoreType'] = null
      this.data['scoreVal'] = null
      this.data['maxScoreVal'] = null
    },
    indicatorChange(val,node){
      this.$nextTick(()=>{
        this.data['indiDesc'] = node.indiDesc
        this.data['scoreType'] = node.scoreType
        this.data['scoreVal'] = node.scoreVal
        this.data['maxScoreVal'] = node.maxScoreVal
        this.data['modState'] = node.modState
      })
    },

    staffChange(){
      const staffUser = this.getOperater()
      if(staffUser && !this.data['secondLeaderId']) {
        this.secondLeaderChange(staffUser.username,staffUser.parent)
      }
    },
    secondLeaderChange(val,node){
      if(!val || !this.data['secondLeaderId']){
        this.data['secondLeaderId'] = node.username
      }
      if(node.parent) {
        this.mainLeaderChange(node.parent.username,node.parent)
      }else{
        this.mainLeaderChange(null, {})
      }
    },
    mainLeaderChange(val,node){
      if(!val || !this.data['mainLeaderId']){
        this.data['mainLeaderId'] = node.username
      }
    },
    evidenceFileInfoStation() {
      let evidenceResult = this.$refs.evidenceStation.evidenceResult;
      this.auditData.evidenceIdStation = evidenceResult.evidenceId;
      this.auditData.evidenceId = evidenceResult.evidenceId;
      this.auditData.evidenceFileName = evidenceResult.fileName;
      this.auditData.evidencePath = evidenceResult.fileUrl;
    },
    init(listInfo){
      this.orgId = listInfo.stationOrgId
      this.listId  = listInfo.listId
      this.workId  = listInfo.workOrderId
      this.listType = listInfo.listType
      this.appealTimes = listInfo.appealTimes
      this.appealStatus = listInfo.appealStatus
      this.spotCheckStatus = listInfo.spotCheckStatus
      this.checkStatus = listInfo.checkStatus
      this.checkResult = listInfo.checkResult
      this.auditStatus = listInfo.auditStatus
      this.disabled = false
      this.listInfo = listInfo
      if(this.enabled){
        this.getData()
      }
    }
  }
}
</script>
<style>
.appAuditForm label{
  padding:0px !important;
}
.appAuditForm .el-form-item{
  margin-bottom: 5px;
}
</style>
