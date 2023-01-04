<template>
  <div style="margin-bottom: 20px;" v-if="enabled" v-loading="loading" element-loading-background="rgb(114 121 127 / 40%)" class="el-card box-card bgColor">
     <el-col class="el-col-8" style="height: 100%;background-color:#f3f4f9; ">
        <el-form :model="stationAudit" :rules="stationRules" ref="stationAuditForm"
                  :disabled="stationDisabled" style="padding-top:3px;">
          <el-form-item>
            <div class="el-card__header" style="padding: 1px">
              站级稽查
              <div style="float:right">
                <el-button type="success" @click="stationAuditSubmit">提交</el-button>
              </div>
            </div>
            <table class="audit-table" style="width: 100%">
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核结论" prop="auditStatus">
                    <ti-select :clearable="false" v-model="stationAudit.auditStatusStation"
                                dict-type="tibms_audit_auditResult"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核车牌" prop="auditVehiclePlateStation">
                    <el-input style="width: 50%"
                              v-model="stationAudit.auditVehiclePlateStation" type="text"
                              placeholder="车牌号码" maxlength="8"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车型" prop="auditVehicleTypeStation">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="stationAudit.auditVehicleTypeStation"
                                dict-type="tibms_com_vehicleType"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核轴数" prop="auditAxleCountStation">
                    <el-input style="width: 50%" v-model="stationAudit.auditAxleCountStation"
                              type="text" placeholder="稽核轴数"
                              oninput="value=value.replace(/[^\d]/g, '')"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车种" prop="auditVehicleClassStation">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="stationAudit.auditVehicleClassStation"
                                dict-type="tibms_com_vehicleClass"/>
                  </el-form-item>
                </td>
              </tr>
             <tr v-if="isExList || isBreakPass">
              <td>
                <el-form-item label="稽核金额" prop="auditFeeStationStr">
                  <el-input style="width: 50%" v-model="stationAudit.auditFeeStationStr"
                            type="text" placeholder="稽核金额"
                            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"/>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="责任主体" prop="auditResponserStation">
                  <ti-select style="width: 50%" v-model="stationAudit.auditResponserStation"
                              dict-type="tibms_audit_responser"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td v-if="isExList || isBreakPass">
                <el-form-item label="欠费金额" prop="auditArrearageStationStr">
                  <el-input style="width: 50%"
                            v-model="stationAudit.auditArrearageStationStr"
                            type="text" placeholder="欠费金额"
                            :readonly="!isBreakPass"
                            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"/>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="证据文件" prop="auditFileStation">
                  <el-button type="warning"
                              style="display: inline-block;width: 20%;border-radius: 0px;"
                              @click="addEvidence('station')">+
                  </el-button>
                  <ti-evidence ref="evidenceStation" :params="evidenceParams"
                                :upload-flag="true" :init-flag="true"
                                @evidenceFileInfo="evidenceFileInfoStation"></ti-evidence>
                </el-form-item>
              </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核说明" prop="auditDescriptionStation">
                    <el-input style="width: 80%" type="text"
                              v-model="stationAudit.auditDescriptionStation" maxlength="100"/>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="el-col-8" style="height: 100%;background-color:#f3f4f9; ">
        <el-form :model="roadAudit" :rules="roadRules" ref="roadAuditForm"
                  :disabled="roadDisabled" style="padding-top:3px;">
          <el-form-item>
            <div class="el-card__header" style="padding: 1px">
               路段稽查
              <div style="float:right">
                <el-button type="success" @click="roadAuditSubmit">提交</el-button>
              </div>
            </div>
            <table class="audit-table" style="width: 100%">
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核结论" prop="auditStatus">
                    <ti-select :clearable="false" v-model="roadAudit.auditStatusRoad"
                                dict-type="tibms_audit_auditResult"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核车牌" prop="auditVehiclePlateRoad">
                    <el-input style="width: 50%"
                              v-model="roadAudit.auditVehiclePlateRoad" type="text"
                              placeholder="车牌号码" maxlength="8"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车型" prop="auditVehicleTypeRoad">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="roadAudit.auditVehicleTypeRoad"
                                dict-type="tibms_com_vehicleType"/>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="稽核轴数" prop="auditAxleCountRoad">
                    <el-input style="width: 50%" v-model="roadAudit.auditAxleCountRoad"
                              type="text" placeholder="稽核轴数"
                              oninput="value=value.replace(/[^\d]/g, '')"/>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="稽核车种" prop="auditVehicleClassRoad">
                    <ti-select :clearable="false" style="width: 50%"
                                v-model="roadAudit.auditVehicleClassRoad"
                                dict-type="tibms_com_vehicleClass"/>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="isExList || isBreakPass">
              <td>
                <el-form-item label="稽核金额" prop="auditFeeRoadStr">
                  <el-input style="width: 50%" v-model="roadAudit.auditFeeRoadStr"
                            type="text" placeholder="稽核金额"
                            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"/>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="责任主体" prop="auditResponserRoad">
                  <ti-select style="width: 50%" v-model="roadAudit.auditResponserRoad"
                              dict-type="tibms_audit_responser"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td v-if="isExList || isBreakPass">
                <el-form-item label="欠费金额" prop="auditArrearageRoadStr">
                  <el-input style="width: 50%"
                            v-model="roadAudit.auditArrearageRoadStr"
                            type="text" placeholder="欠费金额"
                            :readonly="!isBreakPass"
                            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"/>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="证据文件" prop="auditFileRoad">
                  <el-button type="warning"
                              style="display: inline-block;width: 20%;border-radius: 0px;"
                              @click="addEvidence('road')">+
                  </el-button>
                  <ti-evidence ref="evidenceRoad" :params="evidenceParams"
                                :upload-flag="true" :init-flag="true"
                                @evidenceFileInfo="evidenceFileInfoRoad"></ti-evidence>
                </el-form-item>
              </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="稽核说明" prop="auditDescriptionRoad">
                    <el-input style="width: 80%" type="text"
                              v-model="roadAudit.auditDescriptionRoad" maxlength="100"/>
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
import tiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import request from "@ecip/ecip-web/src/utils/request"
import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"
import {cloneDeep, deepClone} from '@ecip/ecip-web/src/utils'
import {auditEx} from "@/views/pro/audit/special/exListSpecial/exListSpecialApi";
import {auditEn} from "@/views/pro/audit/special/enListSpecial/enListSpecialApi";
import {auditBr} from "@/views/pro/audit/special/breakPassRecord/breakPassApi";

export default {
  name: "AuditPanelView",
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
    },
    isExList:{
      type: [Boolean],
      required: true,
      default: false
    },
    isEnList:{
      type: [Boolean],
      required: true,
      default: false
    },
    isBreakPass:{
      type: [Boolean],
      required: true,
      default: false
    },
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
    const checkAuditStatusStation = (rule, value, callback) => {
      if ((this.stationAudit['auditStatusStation']=='2') && !value) {
        callback(new Error('稽核结论为异常时，稽核说明必填'));
      } else{
        callback();
      }
    };
    const checkAuditStatusRoad = (rule, value, callback) => {
      if ((this.roadAudit['auditStatusRoad']=='2') && !value) {
        callback(new Error('稽核结论为异常时，稽核说明必填'));
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
      evidenceParams:{
      },
      id:'',
      stationAudit:{
        auditStatusStation:'',
        auditVehiclePlateStation:'',
        auditVehicleTypeStation:'',
        auditFeeStationStr:'',
        auditAxleCountStation:'',
        auditVehicleClassStation:'',
        auditFileStation:'',
        auditDescriptionStation:'',
        auditFeeStationStr:'',
        auditArrearageStationStr:'0.00',
        auditResponserStation:'',
        feeStr:'0.00'
      },
      roadAudit:{
        auditStatusRoad:'',
        auditVehiclePlateRoad:'',
        auditFeeRoadStr:'',
        auditVehicleTypeRoad:'',
        auditAxleCountRoad:'',
        auditVehicleClassRoad:'',
        auditFileRoad:'',
        auditDescriptionRoad:'',
        auditFeeRoadnStr:'',
        auditArrearageRoadStr:'0.00',
        auditResponserRoad:'',
        feeStr:'0.00'
      },
      userNodeLevel:'2',
      stationDisabled:true,
      roadDisabled:true,
      disabled: false,
      loading: false,
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
      stationRules: {
        auditStatusStation: {required: true, message: '稽核结论不能为空', trigger: 'change'},
        auditVehiclePlateStation: {required: true, message: '稽核车牌不能为空', trigger: 'change'},
        auditVehicleTypeStation: {required: true, message: '稽核车型不能为空', trigger: 'change'},
        auditVehicleClassStation: {required: true, message: '稽核车种不能为空', trigger: 'change'},
        auditFee: {required: true, message: '稽核金额不能为空', trigger: 'change'},
        auditArrearage: {required: true, message: '稽核欠费金额不能为空', trigger: 'change'},
        auditDescriptionStation: [{ validator: checkAuditStatusStation, trigger: 'change' }]
      },
      roadRules: {
        auditStatusRoad: {required: true, message: '稽核结论不能为空', trigger: 'change'},
        auditVehiclePlateRoad: {required: true, message: '稽核车牌不能为空', trigger: 'change'},
        auditVehicleTypeRoad: {required: true, message: '稽核车型不能为空', trigger: 'change'},
        auditVehicleClassRoad: {required: true, message: '稽核车种不能为空', trigger: 'change'},
        auditFee: {required: true, message: '稽核金额不能为空', trigger: 'change'},
        auditArrearage: {required: true, message: '稽核欠费金额不能为空', trigger: 'change'},
        auditDescriptionRoad: [{ validator: checkAuditStatusRoad, trigger: 'change' }]
      },
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
    },
    'stationAudit.auditFeeStationStr':{
      handler(v) {
        if (v) {
          if(!this.isBreakPass){
            this.stationAudit.auditArrearageStationStr = parseFloat(
            v - this.stationAudit.feeStr).toFixed(2);
          }
        }
      },
      immediate: true
    },
    'roadAudit.auditFeeRoadStr':{
        handler(v) {
          if (v) {
            if(!this.isBreakPass){
              this.roadAudit.auditArrearageRoadStr = parseFloat(
                v - this.roadAudit.feeStr).toFixed(
                2);
            }
          }
          //else
          // {
          //   this.roadAudit.auditFee = parseFloat(this.roadAudit.feeStr).toFixed(2);
          // }
        },
        immediate: true
    }
  },
  mounted() {
    this.getUserLevel();
    this.roadAuditTmp = this.roadAudit;
    this.stationAuditTmp = this.stationAudit;
  },
  computed:{
    enabled(){
      return true;
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
    this.default = deepClone(this.data)
  },
  methods: {
    async getUserLevel() {
        let {data} = await tiUserApi.getCurUserOrg();
        if (!data) {
          data = {}
        }
        if (data.fullName === '超级管理员') {
          data.nodeLevel = 2;
        }
        this.userNodeLevel = data.nodeLevel;
        this.userOrgName = data.fullName;
        if (this.userNodeLevel != null) {
          if (Number(this.userNodeLevel) <= 2) {
            this.roadDisabled = false;
          } else {
            if(!this.roadAudit.auditStatusRoad || this.roadAudit.auditStatusRoad < 1){
              this.stationDisabled = false;
            }
          }
        }
      },
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
     stationAuditSubmit() {
          this.$refs.stationAuditForm.validate((valid) => {
          if (valid) {
            this.stationAudit.userNodeLevel = this.userNodeLevel;
            this.stationAudit.userOrgName = this.userOrgName;
            if(this.isExList || this.isBreakPass){
              this.stationAudit.auditFeeStation = this.stationAudit.auditFeeStationStr * 100;
              this.stationAudit.auditArrearageStation = this.stationAudit.auditArrearageStationStr * 100;
            }
            //证据id
            //稽核
           if(this.isExList){
              this.audit(this.stationAudit,'auditEx');
            }else if(this.isEnList){
              this.audit(this.stationAudit,'auditEn');
            }else if(this.isBreakPass ){
              this.audit(this.stationAudit,'auditBr');
            }
            return true;
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      roadAuditSubmit() {
        this.$refs.roadAuditForm.validate((valid) => {
          if (valid) {
            //证据id
            this.roadAudit.userNodeLevel = this.userNodeLevel;
            this.roadAudit.userOrgName = this.userOrgName;
            if(this.isExList || this.isBreakPass){
              this.roadAudit.auditFeeRoad = this.roadAudit.auditFeeRoadStr * 100;
              this.roadAudit.auditArrearageRoad = this.roadAudit.auditArrearageRoadStr * 100;
            }
            //稽核
           if(this.isExList){
              this.audit(this.roadAudit,'auditEx');
            }else if(this.isEnList){
              this.audit(this.roadAudit,'auditEn');
            }else if(this.isBreakPass ){
              this.audit(this.roadAudit,'auditBr');
            }
            return true;
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },
       async audit(params,type) {
         var data;
         if(type == 'auditEx'){
           data = await auditEx(params);
         }else if(type == 'auditEn'){
           data = await auditEn(params);
         }else if(type == 'auditBr'){
           data = await auditBr(params);
         }
        this.$nextTick(() => {
          if (data.data[0]) {
            this.$message({
              message: '稽核成功!',
              type: 'success'
            });
          } else {
            this.$message.error('稽核失败!');
          }
        });
      },
    async saveData(){
      this.loading = true
      try {
        this.$emit("submit",this.data)
      } finally {
        this.loading = false
      }
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
    evidenceFileInfoStation()
    {
      let evidenceResult = this.$refs.evidenceStation.evidenceResult;
      this.stationAudit.evidenceIdStation = evidenceResult.evidenceId;
      this.stationAudit.evidenceId = evidenceResult.evidenceId;
      this.stationAudit.evidenceFileName = evidenceResult.fileName;
      this.stationAudit.evidencePath = evidenceResult.fileUrl;
    },
    evidenceFileInfoRoad()
    {
        let evidenceResult = this.$refs.evidenceRoad.evidenceResult;
        this.roadAudit.evidenceIdRoad = evidenceResult.evidenceId;
        this.roadAudit.evidenceId = evidenceResult.evidenceId;
        this.roadAudit.evidenceFileName = evidenceResult.fileName;
        this.roadAudit.evidencePath = evidenceResult.fileUrl;
        console.log("evidenceResult1:",evidenceResult);
    },
    setObj(data) {
      this.copyValue(data);
    },
    async copyValue(value) {
        this.roadAudit.id = value.id;
        this.stationAudit.id = value.id;

        if(value.feeTxt){
          this.stationAudit.feeStr = value.feeTxt;
          this.roadAudit.feeStr = value.feeTxt;
        }
        if(this.isExList){
          this.roadAudit.auditVehiclePlateColor = value.exVehiclePlateColor;
          this.roadAudit.exTime = value.exTime;
          this.stationAudit.auditVehiclePlateColor = value.exVehiclePlateColor;
          this.stationAudit.exTime = value.exTime;
          this.evidenceParams.transTime = value.exTime;
        }else if(this.isEnList){
          this.roadAudit.auditVehiclePlateColor = value.enVehiclePlateColor;
          this.roadAudit.enTime = value.enTime;
          this.stationAudit.auditVehiclePlateColor = value.enVehiclePlateColor;
          this.stationAudit.enTime = value.enTime;
          this.evidenceParams.transTime = value.enTime;
        }else if(this.isBreakPass){
           this.roadAudit.tollLaneId = value.exTollLaneId;
           this.roadAudit.handleTime = value.exTime;
           this.roadAudit.vehiclePlate = value.exVehiclePlate;
           this.roadAudit.vehiclePlateColor = value.exVehiclePlateColor;
           this.evidenceParams.transTime = value.exTime;
           this.roadAudit.auditVehiclePlate = value.exVehiclePlate;
           this.roadAudit.auditVehiclePlateColor = value.exVehiclePlateColor;
           this.stationAudit.tollLaneId = value.exTollLaneId;
           this.stationAudit.handleTime = value.exTime;
           this.stationAudit.vehiclePlate = value.exVehiclePlate;
           this.stationAudit.vehiclePlateColor = value.exVehiclePlateColor;
           this.stationAudit.auditVehiclePlate = value.exVehiclePlate;
           this.stationAudit.auditVehiclePlateColor = value.exVehiclePlateColor;
        }
        if (value.auditStatusStation && value.auditStatusStation > 0) {
            this.stationAudit.auditStatusStation = value.auditStatusStation.toString();
            this.stationAudit.auditFeeStationStr = value.auditFeeStationTxt;
            this.stationAudit.auditArrearageStationStr = value.auditArrearageStationTxt;
            this.stationAudit.auditResponserStation = value.auditResponser;
            this.stationAudit.auditVehiclePlateStation = value.auditVehiclePlateStation;
            this.stationAudit.auditVehicleTypeStation = value.auditVehicleTypeStation.toString();
            this.stationAudit.auditVehicleClassStation = value.auditVehicleClassStation.toString();
            this.stationAudit.auditAxleCountStation = value.auditAxleCountStation.toString();
        } else {
          this.stationAudit.auditStatusStation = '1';
          this.stationAudit.auditFeeStationStr = value.feeTxt;
          this.stationAudit.auditArrearageStationStr = '0.00';
          this.stationAudit.auditVehiclePlateStation = this.isEnList? value.enVehiclePlate:value.exVehiclePlate;
          this.stationAudit.auditVehicleTypeStation = this.isEnList? value.enVehicleType.toString():value.exVehicleType.toString();
          this.stationAudit.auditVehicleClassStation = this.isEnList? value.enVehicleClass.toString():value.exVehicleClass.toString();
          this.stationAudit.auditAxleCountStation = value.enAxleCount;
        }
        if (value.auditStatusRoad && value.auditStatusRoad > 0) {
          this.roadAudit.auditFeeRoadStr = value.auditFeeRoadTxt;
          this.roadAudit.auditArrearageRoadStr = value.auditArrearageRoadTxt;
          this.roadAudit.auditResponserRoad = value.auditResponser;
          this.roadAudit.auditVehiclePlateRoad = value.auditVehiclePlateRoad;
          this.roadAudit.auditVehicleTypeRoad = value.auditVehicleTypeRoad.toString();
          this.roadAudit.auditVehicleClassRoad = value.auditVehicleClassRoad.toString();
          this.roadAudit.auditStatusRoad = value.auditStatusRoad.toString();
          this.roadAudit.auditAxleCountRoad = value.auditAxleCountRoad;
          this.stationDisabled = true;
        } else {
          this.roadAudit.auditStatusRoad = '1';
          this.roadAudit.auditFeeRoadStr = value.feeTxt;
          this.roadAudit.auditArrearageRoadStr = '0.00';
          this.roadAudit.auditVehiclePlateRoad = this.isEnList? value.enVehiclePlate:value.exVehiclePlate;
          this.roadAudit.auditVehicleTypeRoad = this.isEnList? value.enVehicleType.toString():value.exVehicleType.toString();
          this.roadAudit.auditVehicleClassRoad = this.isEnList? value.enVehicleClass.toString():value.exVehicleClass.toString();
          this.roadAudit.auditAxleCountRoad = value.enAxleCount;
          let {data} = await tiUserApi.getCurUserOrg();
          if (!data) {
            data = {}
          }
          if (data.fullName === '超级管理员') {
            data.nodeLevel = 2;
          }
          this.userNodeLevel = data.nodeLevel;
          this.userOrgName = data.fullName;
          if (Number(this.userNodeLevel) > 2) {
            this.stationDisabled = false;
          }
        }
        this.stationAudit.auditDescriptionStation = '';
        this.roadAudit.auditDescriptionRoad = '';
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
    },
    addEvidence(v) {
      if (v == 'road') {
        var param = {
          'serialNo':this.roadAudit.id
        }
        if(this.isBreakPass){
          param.serialNo = this.roadAudit.tollLaneId + this.roadAudit.handleTime;
        }
        this.$refs.evidenceRoad.dialogVisible = true;
        this.$refs.evidenceRoad.initParams(param);
      } else if (v == 'station') {
        var param = {
          'serialNo':this.stationAudit.id
        }
        if(this.isBreakPass){
          param.serialNo = this.stationAudit.tollLaneId + this.stationAudit.handleTime;
        }
        this.$refs.evidenceStation.dialogVisible = true;
        this.$refs.evidenceStation.initParams(param);
      }
      this.evidenceParams.serialNo = this.roadAudit.id;
      if(this.isBreakPass){
        this.evidenceParams.serialNo = this.roadAudit.tollLaneId + this.roadAudit.handleTime;
      }
    },
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
