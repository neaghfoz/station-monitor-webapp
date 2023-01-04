<template>
  <div style="margin-bottom: 20px;" v-if="enabled" v-loading="loading" element-loading-background="rgb(114 121 127 / 40%)" class="el-card box-card bgColor">
    <div class="el-card__header" style="background-color: #f2f2f2;">
      <div class="clearfix">
        <span>{{ title }}</span>
        <el-button v-permission="[isEnList?'kpiAuditLog:enSpotCheck':'kpiAuditLog:exSpotCheck']" :disabled="isSee" type="primary" size="mini" style="float:right;margin-right:10px;" @click="submit">提交</el-button>
      </div>
    </div>
    <div class="el-card__body" style="padding: 0px 10px;background-color: #fff">
      <el-form class="appAuditForm" ref="form" size="mini" :model="data" label-position="top"  :show-message="false" :rules="rules" :disabled="isSee">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item style="width:100%" label="审核结论" prop="checkResult">
              <ti-select style="width:100%" v-model="data.checkResult"  dict-type="tibms_kpi_spotCheckResult" :multiple="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%" label="抽查次数" prop="spotCheckNum">
              <el-input-number style="width:100%" v-model="spotCheckNum" disabled :controls="false" controls-position="right" :min="0" :max="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="width:100%" label="审核说明" prop="checkDesc">
              <el-input
                style="width:100%"
                @input="$forceUpdate()"
                type="textarea"
                :rows="2" maxlength="200"
                v-model="data.checkDesc">
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
import {deepClone} from '@ecip/ecip-web/src/utils'

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
      listType: null,
      spotCheckNum:0,
      spotCheckStatus:null,
      checkStatus:null,
      checkResult:null,
      isEnList: null,
      listInfo: null,
      rules:{
        checkResult: [
          { required: true, message: '', trigger: 'change' }
        ],
        checkDesc: [
          { validator:checkDescValidate, trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    enabled(){
      return this.config.enableSpotCheck && this.auditType == 8 && (this.$store.getters.roles.indexOf(this.isEnList?'kpiAuditLog:enSpotCheck':'kpiAuditLog:exSpotCheck')>-1 || this.spotCheckStatus !=0)
    },
    isSee(){
      return this.$store.getters.roles.indexOf(this.isEnList?'kpiAuditLog:enSpotCheck':'kpiAuditLog:exSpotCheck')==-1
        ||this.disabled
        // 抽查中、管理中心没有审核、审核没有通过
        || !this.checkStatus || this.checkResult !=1
        || (this.data.auditType == this.auditType  && this.spotCheckStatus ==1 )
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
            if(this.spotCheckStatus==0){
              this.data.checkResult = null
              this.data.checkDesc = null
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
        const url = `api/v1/kpi/kpiAuditLog/`+(this.isEnList?'enSpotCheck':'exSpotCheck')
        const res = await request({
          url: url,
          method: 'post',
          params: {},
          data: this.data
        });
        if(res.code==200){
          this.$message.success("审核成功")
          this.disabled = true
          this.spotCheckNum++
          this.listInfo.spotCheckNum++
          if(res.data){
            this.data = res.data
          }
          this.$emit("submit",this.data)
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
    init(listInfo){
      this.orgId = listInfo.stationOrgId
      this.listId  = listInfo.listId
      this.workId  = listInfo.workOrderId
      this.listType = listInfo.listType
      this.spotCheckNum = listInfo.spotCheckNum
      this.spotCheckStatus = listInfo.spotCheckStatus
      this.checkStatus = listInfo.checkStatus
      this.checkResult = listInfo.checkResult
      this.listInfo = listInfo
      this.disabled = false
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
