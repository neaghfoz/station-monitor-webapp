<template>
  <div style="margin-bottom: 20px;" v-if="enabled" v-loading="loading" element-loading-background="rgb(114 121 127 / 40%)" class="el-card box-card bgColor">
    <div class="el-card__header" style="background-color: #f2f2f2;">
      <div class="clearfix">
        <span>{{ title }}</span>
        <el-button v-if="canAppeal" type="success"  size="mini" style="float:right" @click="appeal">申诉修改</el-button>
        <el-button v-permission="[isEnList?'kpiAuditLog:enCheck':'kpiAuditLog:exCheck']" :disabled="isSee" type="primary" size="mini" style="float:right;margin-right:10px;" @click="submit">提交</el-button>
      </div>
    </div>
    <div class="el-card__body" style="padding: 0px 10px;background-color: #fff">
      <el-form class="appAuditForm" ref="form" size="mini" :model="data" label-position="top" :show-message="false" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item style="width:100%" label="审核结论" prop="checkResult">
              <ti-select style="width:100%" v-model="data.checkResult"  dict-type="tibms_kpi_checkResult" :multiple="false" :disabled="isSee"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="申诉次数" prop="appealTimes">
              <el-input-number style="width:100%" v-model="appealTimes" disabled :controls="false" controls-position="right" :min="0" :max="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="width:100%" label="审核说明" prop="checkDesc">
              <el-input :disabled="isSee"
                style="width:100%"
                type="textarea"
                :rows="2" maxlength="200"
                @input="$forceUpdate()"
                v-model="data.checkDesc">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="流水业务类型" prop="listType">
              <ti-select style="width:100%" disabled v-model="data.listType"  dict-type="tibms_kpi_listType" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="稽核结论" prop="auditResult">
              <ti-select style="width:100%" v-model="data.auditResult"
                         :watch-attr="listType"
                         :watch-attr-fn="listTypeChange"
                         dict-type="tibms_kpi_auditResult" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="业务规范" prop="bizCriterion">
              <ti-select style="width:100%" v-model="data.bizCriterion" dict-type="tibms_kpi_bizStand" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="考核指标" prop="indiType">
              <ti-select style="width:100%" v-model="data.indiType" @change="indiTypeChange" dict-type="tibms_kpi_indiType" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="width:100%" label="考核细则" prop="indiId">
              <indi-select style="width:100%" v-model="data.indiId" @change="indicatorChange" :indi-type="data.indiType" :data-filter="dataFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="考核分值" prop="scoreVal">
              <el-input-number style="width:100%" :disabled="data.modState==0?true:false"  v-model="data.scoreVal" :controls="true" controls-position="right" :min="0" :max="data.maxScoreVal||100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="考核指标类型" prop="scoreType">
              <ti-select style="width:100%" v-model="data.scoreType" :disabled="true" dict-type="tibms_kpi_scoreType" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="连带第一责任人" prop="secondLeaderId">
              <ti-sys-user style="width:100%" with-have-org-user with-have-sys-org :clearable="true" :filterable="true" @change="secondLeaderChange" v-model="data.secondLeaderId" :org-id="orgId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="连带第二责任人" prop="mainLeaderId" >
              <ti-sys-user style="width:100%" with-have-org-user with-have-sys-org :clearable="true" :disabled="data['secondLeaderId'] == null" :filterable="true" @change="mainLeaderChange" v-model="data.mainLeaderId" :org-id="orgId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="连带第三责任人" prop="teamLeaderId" >
              <ti-sys-user style="width:100%" with-have-org-user with-have-sys-org :clearable="true" :disabled="data['mainLeaderId'] == null" :filterable="true" @change="teamLeaderChange" v-model="data.teamLeaderId" :org-id="orgId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="逃费嫌疑" prop="escapeSuspect" >
              <ti-select style="width:100%" v-model="data.escapeSuspect" :controls="false" dict-type="tibms_kpi_escapeSuspect" :clearable="false" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="逃费类型" prop="escapeTypeTotal" >
              <ti-select style="width:100%" v-model="data.escapeTypeTotal" dict-type="tibms_kpi_escapeTypeTotal" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="逃费金额(元)" prop="escapeMoneyStr" >
              <el-input-number style="width:100%" v-model="data.escapeMoneyStr" :precision="2" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="逃费行为" prop="escapeType" >
              <ti-select style="width:100%" v-model="data.escapeType"
                         :watch-attr="data.escapeTypeTotal"
                         :watch-attr-fn="escapeBigTypeChange"
                         dict-type="tibms_kpi_escapeType" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="width:100%" label="稽核说明" prop="auditDesc">
              <el-input style="width:100%"
                        type="textarea"
                        :rows="2" maxlength="200"
                        v-model="data.auditDesc">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import mixin from "@ecip/ecip-web/src/utils/common-mixin";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import IndiSelect from "@/views/fs/kpi/common/indiSelect/indiSelect"
import kpiUtil from "@/views/fs/kpi/common/kpiUtil";
import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import request from "@ecip/ecip-web/src/utils/request"
import {cloneDeep, deepClone} from '@ecip/ecip-web/src/utils'

export default {
  name: "CheckPanelView",
  components: { TiSelect,IndiSelect,TiSysOrg,TiSysUser },
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
      teamLeaderId: null,
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
      mainLeaderDis:true,
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
      flowStatus: null,
      isEnList: null,
      listInfo: null,
      indiTarget:'1',
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
        // secondLeaderId: [
        //   { validator:bizCriterionValidate, trigger: 'change' }
        // ],
        // mainLeaderId: [
        //   { validator:bizCriterionValidate, trigger: 'change' }
        // ],
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
        || this.flowStatus != 3
        || (this.listInfo.reportMonth != null && this.listInfo.reportMonth != '')
    },
    canAppeal(){
      return this.$store.getters.roles.indexOf(this.isEnList?'kpiAuditLog:enAppeal':'kpiAuditLog:exAppeal')>-1
        && this.flowStatus == 4 && (this.listInfo.reportMonth == null || this.listInfo.reportMonth == '')
    },
    mainLeaderDisabled(){
      console.log("this.data['secondLeaderId']111",this.data['secondLeaderId'])
      console.log("his.mainLeaderDis1111",this.mainLeaderDis)
      return this.mainLeaderDis;
    }
  },
  async created() {
    await kpiUtil.loadConfig(this.$store)
    this.config = kpiUtil.config
    this.default = deepClone(this.data)
  },
  inject:['nextList'],
  methods: {
    async getData(){
      this.loading = true
      try {
        console.log("this.auditType",this.auditType)
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
        this.mainLeaderDis = this.data.secondLeaderId ? false:true
        console.log("this.mainLeaderDis",this.mainLeaderDis)
      }finally {
        this.loading = false
      }
    },
    async saveData(){
      this.loading = true
      try {
        const url = `api/v1/kpi/kpiAuditLog/`+(this.isEnList?'enCheck':'exCheck')
        if(this.data.escapeMoneyStr){
          this.data.escapeMoney = parseInt(this.data.escapeMoneyStr * 100)
        }
        const res = await request({
          url: url,
          method: 'post',
          params: {},
          data: this.data
        });
        if(res.code==200){
          this.$message.success("审核成功")
          this.disabled = true
          if(res.data){
            this.data = res.data
            this.appealStatus =0
            this.checkStatus = 1
            this.checkResult = this.data.checkResult
            this.flowStatus = 4
          }
          this.$emit("submit",this.data)
          this.nextList();
        }
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
    // 申诉修改
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
          this.disabled = true
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
      if(node.parent) {
        this.teamLeaderChange(node.parent.username,node.parent)
      }else{
        this.teamLeaderChange(null, {})
      }
    },
    teamLeaderChange(val,node){
      if(!val || !this.data['teamLeaderId']){
        this.data['teamLeaderId'] = node.username
      }
    },
    init(listInfo){
      this.orgId = listInfo.serviceOrgId
      this.listId  = listInfo.listId
      this.workId  = listInfo.workOrderId
      this.listType = listInfo.listType
      this.appealTimes = listInfo.appealTimes
      this.appealStatus = listInfo.appealStatus
      this.spotCheckStatus = listInfo.spotCheckStatus
      this.flowStatus = listInfo.flowStatus
      this.checkStatus = listInfo.checkStatus
      this.checkResult = listInfo.checkResult
      this.auditStatus = listInfo.auditStatus
      this.disabled = false
      this.listInfo = listInfo
      if(this.enabled){
        this.getData()
      }
    },
    dataFilter(data){
      let resArr = [];
      if (!data || data.length == 0) {
        return resArr;
      }
      data.forEach(x => {
          if ((',' + x.indiTarget + ',').indexOf(',' + this.indiTarget + ',') > -1) {
            resArr.push(x)
          }
        }
      );
      return resArr;
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
