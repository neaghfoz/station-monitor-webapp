<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="95%"
    >
      <el-form v-show="formShow" ref="form" :rules="rules" v-loading="loading" :model="shiftRegMainRecord" label-width="120px">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>基础信息</span></div>
          <el-row >
            <el-col :span="6">
              <el-form-item label="出入口类型"  prop="userMarkNo"
                            :rules="[{required: true, message:'请选择出入口类型', trigger:'blur'}]">
                <ti-select v-model="shiftRegMainRecord.userMarkNo" dict-type="tibms_toll_userMarkNo"
                           :disabled="shiftRegMainRecord.id != ''" @change="refreshBasics()"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收费站"  prop="orgCode"
                            :rules="[{required: true, message:'请选择收费站', trigger:'blur'}]">
                <ti-select v-model="shiftRegMainRecord.orgCode" url="/api/v1/common/sysOrg/findByAuth?showLevel=4"
                           :props="{key:'fullCode',value:'fullCode',label:'fullName'}" @change="refreshBasics()"
                           :disabled="shiftRegMainRecord.id != ''"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工班日期"  prop="squadDateStr"
                            :rules="[{required: true, message:'请选择工班日期', trigger:'blur'}]">
                <el-date-picker type="date" placeholder="选择日期" v-model="shiftRegMainRecord.squadDateStr"
                                :disabled="shiftRegMainRecord.id != ''" :picker-options="pickerBeginDateBefore"
                                format="yyyy-MM-dd" @change="initModal(true, true)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工班"  prop="squadNo"
                            :rules="[{required: true, message:'请选择工班', trigger:'blur'}]">
                <ti-select v-model="shiftRegMainRecord.squadNo" url="api/v1/common/squad/list"
                           :props="{key:'squadNo',value:'squadNo',label:'squadName'}"
                           :disabled="shiftRegMainRecord.id != ''"
                           @change="initModal(true, true)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="6">
              <el-form-item label="车道号"  prop="laneNo"
                            :rules="[{required: true, message:'请选择车道号', trigger:'blur'}]">
                <el-select v-model="shiftRegMainRecord.laneNo" filterable  placeholder="请选择"
                           :disabled="shiftRegMainRecord.id != ''" @change="initModal(true, true)">
                  <el-option
                    v-for="item in laneList"
                    :key="item.laneNo"
                    :label="item.laneNo"
                    :value="item.laneNo">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发卡/收费员"  prop="laneOperatorNo"
                            :rules="[{required: true, message:'请选择操作员', trigger:'blur'}]">
                <el-select v-model="shiftRegMainRecord.laneOperatorNo"  filterable  placeholder="请选择"
                           :disabled="shiftRegMainRecord.id != ''" @change="initModal(false, true)">
                  <el-option
                    v-for="item in selectUserList"
                    :key="item.id"
                    :label="item.fullName"
                    :value="item.username">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="登记人"  >
                <div class="el-form-item__content" style="padding-left: 12px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
                  [{{shiftRegMainRecord.registerOperatorNo}}]{{shiftRegMainRecord.registerOperatorName}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="登记人机构"  >
                <div class="el-form-item__content" style="padding-left: 12px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;" v-text="shiftRegMainRecord.registerOrgName"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="box-card" v-show="(shiftRegMainRecord.userMarkNo != ''
                								&& shiftRegMainRecord.stationNo != ''
                								&& shiftRegMainRecord.laneNo != ''
                								&& shiftRegMainRecord.squadDateStr != ''
                								&& shiftRegMainRecord.squadNo != ''
                								&& shiftRegMainRecord.laneOperatorNo != ''
                							  && shiftRegMainRecord.userMarkNo == 2)">
          <div slot="header" class="clearfix">
            <span>金额</span>
            <span style="color: red;padding-left: 10px;">总额：{{shiftRegMainRecord.totalMoney | numFilter}}元</span>
          </div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="机打票缴款金额" prop="invMoney">
                <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.invMoney" @input="checkTotalMoney()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="补缴金额" prop="bujiaoMoney">
                <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.bujiaoMoney" @input="checkTotalMoney()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="定额票缴款金额" prop="rationInvMoney">
                <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.rationInvMoney" @input="checkTotalMoney()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="追缴金额" prop="zhuiJiaoMoney">
                <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.zhuiJiaoMoney" @input="checkTotalMoney()"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  maxlength="120"
                  v-model="shiftRegMainRecord.remark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!--入口纸券-->
        <el-row :gutter="5" v-show="(shiftRegMainRecord.userMarkNo != ''
                								&& shiftRegMainRecord.stationNo != ''
                								&& shiftRegMainRecord.laneNo != ''
                								&& shiftRegMainRecord.squadDateStr != ''
                								&& shiftRegMainRecord.squadNo != ''
                								&& shiftRegMainRecord.laneOperatorNo != ''
                							  && shiftRegMainRecord.userMarkNo == 1)">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>纸券</span>
                <span style="color: red;padding-left: 10px;">总数：{{shiftRegMainRecord.paperCount}}张</span>
              </div>
              <!--纸券-->
              <shift-squad-paper ref="shiftSquadPaperView" :shift-reg-main-record="shiftRegMainRecord"></shift-squad-paper>
            </el-card>
          </el-col>
        </el-row>

        <!--出口纸券-->
        <el-card class="box-card" v-show="(shiftRegMainRecord.userMarkNo != ''
                								&& shiftRegMainRecord.stationNo != ''
                								&& shiftRegMainRecord.laneNo != ''
                								&& shiftRegMainRecord.squadDateStr != ''
                								&& shiftRegMainRecord.squadNo != ''
                								&& shiftRegMainRecord.laneOperatorNo != ''
                							  && shiftRegMainRecord.userMarkNo == 2)">
          <div slot="header" class="clearfix">
            <span>纸券</span>
            <span style="color: red;padding-left: 10px;">总数：{{shiftRegMainRecord.paperCount}}张</span>
          </div>
          <el-row :gutter="8">
            <el-col :span="6">
              <el-form-item label="回收数量" prop="paperCount">
                <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.paperCount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" class="tableButton" @click="selectPaperList(false)">流水查找</el-button>
            </el-col>
          </el-row>
        </el-card>

        <!--出口机打发票、机打废票、定额发票-->
        <el-row :gutter="5" v-show="(shiftRegMainRecord.userMarkNo != ''
                								&& shiftRegMainRecord.stationNo != ''
                								&& shiftRegMainRecord.laneNo != ''
                								&& shiftRegMainRecord.squadDateStr != ''
                								&& shiftRegMainRecord.squadNo != ''
                								&& shiftRegMainRecord.laneOperatorNo != ''
                							  && shiftRegMainRecord.userMarkNo == 2)">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>机打发票</span>
                <span style="color: red;padding-left: 10px;">使用：{{shiftRegMainRecord.invCount}}张</span>
                <span style="color: red;padding-left: 10px;">作废：{{shiftRegMainRecord.badInvCount}}张</span>
              </div>
              <!--机打发票-->
              <shift-inv-detail ref="shiftInvDetailView" :shift-reg-main-record="shiftRegMainRecord"></shift-inv-detail>
              <!--机打废票-->
              <shift-squad-invalid-inv ref="shiftSquadInvalidInvView" :shift-reg-main-record="shiftRegMainRecord"></shift-squad-invalid-inv>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>定额发票</span>
                  <span style="color: red;padding-left: 10px;">使用：{{shiftRegMainRecord.rationInvCount}}张</span>
                  <span style="color: red;padding-left: 10px;">总面额：{{shiftRegMainRecord.rationInvTotalMoney | invMoneyFilter}}元</span>
                </div>
                <!--定额发票-->
                <shift-ration-invoice ref="shiftRationInvoiceView" :shift-reg-main-record="shiftRegMainRecord"></shift-ration-invoice>
              </el-card>
            </el-card>
          </el-col>
        </el-row>
      </el-form>

      <el-row style="text-align: center; padding-top: 20px;">
        <el-button type="primary" :loading="saveLoading" @click="save_1()">保存</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </el-row>
      <invoice-code-stock ref="invoiceCodeStockDialog" :showData="shiftRegMainRecord.invoiceCodeStockCheckList"></invoice-code-stock>
      <manual-stock ref="manualStockDialog" :showData="shiftRegMainRecord.manualStockCheckList"></manual-stock>
      <paper-code-stock ref="paperCodeStockDialog" :showData="shiftRegMainRecord.paperCodeStockCheckList"></paper-code-stock>
    </el-dialog>
  </div>
</template>


<script>

import mixin from 'ecip-web/utils/common-mixin'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import dictUtils from 'ecip-web/utils/dictUtils';
import api from '../shiftRegMainRecordApi.js'
import shiftRulesUtil from '../shiftRulesUtil.js'
import shiftInvDetail from './shiftInvDetailView.vue';
import shiftSquadInvalidInv from './shiftSquadInvalidInvView.vue';
import shiftRationInvoice from './shiftRationInvoiceView.vue';
import shiftSquadPaper from './shiftSquadPaperView.vue';
import invoiceCodeStock from './invoiceCodeStockDialog.vue';
import manualStock from './manualStockDialog.vue';
import paperCodeStock from './paperCodeStockDialog.vue';
import moment from 'moment';
import sysOrgConstant from "@/views/pro/common/constant/sysOrgConstant.js";

export default {
  name: 'addShiftRegMainRecordForm',
  components: { TiSelect, tiSysOrg, shiftInvDetail, shiftSquadInvalidInv, shiftRationInvoice, shiftSquadPaper,
    invoiceCodeStock, manualStock, paperCodeStock},
  mixins: [...mixin],
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      title:"",
      visible:false,
      formShow:false,
      loading: false,
      saveLoading:false,
      allLaneList:[],   //所有车道
      laneList:[],
      selectUserList:[],   //操作员(下拉框)
      allUserList:[],
      orgMap:{},
      operatorMap:{},
      saveConfirmMsg:'',
      shiftRegMainRecord:{
        id:'',
        userMarkNo:'',
        roadNo:'',
        stationNo:'',
        orgCode:'',
        laneNo:'',
        squadDateStr:'',
        squadNo:'',
        laneOperatorNo:'',
        registerOperatorNo:'',
        registerOperatorName:'',
        registerOrgName:'',
        operationType:'',
        remark:'',
        registerOrgCode:'',

        totalMoney:'',
        invMoney:'',
        bujiaoMoney:'',
        rationInvMoney:'',
        zhuiJiaoMoney:'',

        paperCount:'',
        invCount:'',
        badInvCount:'',
        rationInvCount:'',
        rationInvTotalMoney:'',

        shiftInvDetailList:[],
        shiftSquadInvalidInvList:[],
        shiftSquadRationInvoiceList: [],
        shiftSquadPaperList:[],

        oldShiftInvDetailList:[],
        oldShiftSquadInvalidInvList:[],
        oldShiftSquadRationInvoiceList:[],
        oldShiftSquadPaperList:[],

        invoiceCodeStockCheckList: [],
        manualStockCheckList:[],
        paperCodeStockCheckList: [],
      },
      rules:{
        invMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        bujiaoMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        rationInvMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        zhuiJiaoMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        paperCount: [{validator: shiftRulesUtil.checkDigits, trigger: 'blur'}]
      }

    }
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      if(value){
        let realVal = parseFloat(value).toFixed(4)
        return realVal
      }else{
        return 0.0000
      }
    },
    invMoneyFilter (value) {
      // 截取当前数据到小数点后两位
      if(value){
        let realVal = parseFloat(value).toFixed(2)
        return realVal
      }else{
        return 0.00
      }
    }
  },
  methods: {
    async init(tenantId, appId, id, orgData) {
      this.visible = true
      this.formShow = true
      this.render(tenantId, appId)

      this.$nextTick(async() => {
        let that = this


        let laneData = await api.laneListWithUserAuth()
        that.allLaneList = laneData.data

        let allOrgData = await api.findOrgByAuth({"showLevel":4})
        if(allOrgData.code == 200){
          allOrgData.data.forEach(function (data , index) {
            that.orgMap[data.fullCode] = data
          })
        }

        const sysUserData = await api.getSysUser();
        that.allUserList = sysUserData.data;
        that.allUserList.forEach(function (data, index) {
          that.operatorMap[data.username] = data.realName
        })

        //新增逻辑
        if(id == null || id == ""){
          that.title = '新增交班登记表'
          that.shiftRegMainRecord.registerOperatorName = that.$store.getters.userInfo.realName
          that.shiftRegMainRecord.registerOperatorNo = that.$store.getters.userInfo.username
          that.shiftRegMainRecord.userMarkNo = '2'
          that.shiftRegMainRecord.operationType = 1

          let checkRegSubmitTimeResp = await api.getLastSquad()
          if(checkRegSubmitTimeResp != null && checkRegSubmitTimeResp.code == 200){
            if(parseInt(checkRegSubmitTimeResp.data.SquadNo) == 1){

            }else{

            }
            that.$set(this.shiftRegMainRecord,'squadDateStr', moment(checkRegSubmitTimeResp.data.squaddate).format('YYYY-MM-DD'))
            that.$set(this.shiftRegMainRecord,'squadNo', checkRegSubmitTimeResp.data.SquadNo + '')
          }

          that.shiftRegMainRecord.registerOrgName = orgData.data.fullName
          that.shiftRegMainRecord.registerOrgCode = orgData.data.fullCode
          //只有登录用户所属机构为收费站时，才初始化基础数据
          if(orgData.data.nodeLevel == sysOrgConstant.NodeLevel.station){
            that.shiftRegMainRecord.orgCode = orgData.data.fullCode
            that.refreshBasics()
          }

        }else{//修改逻辑
          that.title = '修改交班登记表'
          let detailResp = await api.detail(id)
          if (null == detailResp || null == detailResp.data) {
            that.$alert("获取交班登记失败，请检查！")
            that.$emit('refreshData')
            that.visible = false
            return
          }
          that.selectUserList = that.allUserList
          cloneDeep(that.shiftRegMainRecord, detailResp.data)
          that.shiftRegMainRecord.squadNo = that.shiftRegMainRecord.squadNo + ''
          that.shiftRegMainRecord.laneOperatorNo = that.shiftRegMainRecord.laneOperatorNo + ''
          that.shiftRegMainRecord.operationType = 2

          that.shiftRegMainRecord.totalMoney = 0 == parseInt(detailResp.data.totalMoney) ? "" : parseInt(detailResp.data.totalMoney) / 10000.0
          that.shiftRegMainRecord.invMoney = 0 == parseInt(detailResp.data.invMoney) ? "" : parseInt(detailResp.data.invMoney) / 10000.0
          that.shiftRegMainRecord.bujiaoMoney = 0 == parseInt(detailResp.data.bujiaoMoney) ? "" : parseInt(detailResp.data.bujiaoMoney) / 10000.0
          that.shiftRegMainRecord.rationInvMoney = 0 == parseInt(detailResp.data.rationInvMoney) ? "" : parseInt(detailResp.data.rationInvMoney) / 10000.0
          that.shiftRegMainRecord.zhuiJiaoMoney = 0 == parseInt(detailResp.data.zhuiJiaoMoney) ? "" : parseInt(detailResp.data.zhuiJiaoMoney) / 10000.0

          that.shiftRegMainRecord.rationInvTotalMoney = 0 == parseInt(detailResp.data.rationInvTotalMoney) ? "" : parseInt(detailResp.data.rationInvTotalMoney) / 100.0

          that.$set(that.shiftRegMainRecord,'shiftInvDetailList',detailResp.data.shiftInvDetailList)
          that.$set(that.shiftRegMainRecord,'shiftSquadInvalidInvList',detailResp.data.shiftSquadInvalidInvList)
          that.$set(that.shiftRegMainRecord,'shiftSquadRationInvoiceList',detailResp.data.shiftSquadRationInvoiceList)
          that.$set(that.shiftRegMainRecord,'shiftSquadPaperList',detailResp.data.shiftSquadPaperList)

          if (null != that.shiftRegMainRecord.shiftSquadInvalidInvList && that.shiftRegMainRecord.shiftSquadInvalidInvList.length > 0) {
            for(let tmp of that.shiftRegMainRecord.shiftSquadInvalidInvList){
              tmp.money = parseFloat(tmp.money / 100.0)
              that.$set(tmp,'showMoney',tmp.money)
              tmp.invCount = 1
            }
          }

          if (null != that.shiftRegMainRecord.shiftSquadRationInvoiceList && that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
            for(let tmp of that.shiftRegMainRecord.shiftSquadRationInvoiceList){
              let invRationMoney = parseFloat(tmp.invRationMoney / 100.0)
              that.$set(tmp,'invRationMoney',invRationMoney)
            }
          }
        }
      })
    },
    async getData() {

    },

    render: function(tenantId, appId) {
      this.saveLoading = false
      this.loading = false
      this.allLaneList = []   //所有车道
      this.laneList = []
      this.selectUserList = []   //操作员(下拉框)
      this.allUserList = []
      this.orgMap = {}
      this.operatorMap = {}
      this.saveConfirmMsg = ''
      this.shiftRegMainRecord = {
        id:'',
        userMarkNo:'',
        roadNo:'',
        stationNo:'',
        orgCode:'',
        laneNo:'',
        squadDateStr:'',
        squadNo:'',
        laneOperatorNo:'',
        registerOperatorNo:'',
        registerOperatorName:'',
        registerOrgName:'',
        remark:'',
        invoiceCodeStockCheckList: [],
        manualStockCheckList:[],
        paperCodeStockCheckList: [],
      }
      // 清空初始化
     this.initModal(false, false)
    },
    // 基础信息########################################################################################################
    initModal(isRefreshOperator, isInitData){
      // 金额
      this.shiftRegMainRecord.totalMoney = 0
      console.log(this.shiftRegMainRecord.orgCode)
      this.$set(this.shiftRegMainRecord,'invMoney','')
      this.$set(this.shiftRegMainRecord,'bujiaoMoney','')
      this.$set(this.shiftRegMainRecord,'rationInvMoney','')
      this.$set(this.shiftRegMainRecord,'zhuiJiaoMoney','')
      this.$set(this.shiftRegMainRecord,'invCount','')
      this.$set(this.shiftRegMainRecord,'badInvCount','')
      this.$set(this.shiftRegMainRecord,'paperCount','')
      this.$set(this.shiftRegMainRecord,'rationInvCount','')
      this.$set(this.shiftRegMainRecord,'rationInvTotalMoney',0)
      this.$set(this.shiftRegMainRecord,'shiftInvDetailList',[])
      this.$set(this.shiftRegMainRecord,'shiftSquadInvalidInvList',[])
      this.$set(this.shiftRegMainRecord,'shiftSquadRationInvoiceList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftInvDetailList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadInvalidInvList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadRationInvoiceList',[])
      this.$set(this.shiftRegMainRecord,'shiftSquadPaperList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadPaperList',[])

      if(isRefreshOperator){
        this.refreshOperatorSelect()
      }

      if(!isRefreshOperator && isInitData){
        this.loadBasicData()
      }

    },
    refreshBasics(){
      let that = this;
      that.initModal(true, true);

      let org = that.orgMap[that.shiftRegMainRecord.orgCode]
      that.shiftRegMainRecord.roadNo = org.roadNo
      that.shiftRegMainRecord.stationNo = org.stationNo

      // 初始化
      that.laneList = []

      if (that.shiftRegMainRecord.stationNo == '') {
        return that.laneList
      }

      if (that.shiftRegMainRecord.stationNo) {
        let roadNo = that.shiftRegMainRecord.roadNo
        let stationNo = that.shiftRegMainRecord.stationNo
        switch (that.shiftRegMainRecord.userMarkNo) {
          case "":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo){
                that.laneList.push(data)
              }
            })
            break;
          case "1":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo && data.entryExitType == 1){
                that.laneList.push(data)
              }
            })
            break;
          case "2":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo && data.entryExitType == 2){
                that.laneList.push(data)
              }
            })
            break;
        }
      }

      that.laneList.sort(function (a, b) {
        if(parseInt(a.laneNo) > parseInt(b.laneNo)){
          return 1
        }else {
          return -1
        }
      })
      that.$set(this.shiftRegMainRecord,'laneNo','')
    },
    loadBasicData(){
      if (this.shiftRegMainRecord.userMarkNo == ''
        || this.shiftRegMainRecord.stationNo == ''
        || this.shiftRegMainRecord.roadNo == ''
        || this.shiftRegMainRecord.laneNo == ''
        || this.shiftRegMainRecord.squadDateStr == ''
        || this.shiftRegMainRecord.squadNo == ''
        || this.shiftRegMainRecord.laneOperatorNo == '') {
        return
      }

      this.$refs.shiftInvDetailView.selectInvCodeInList(true)

      this.selectPaperList(true)
    },
    async refreshOperatorSelect(){
      let that = this
      that.selectUserList = []
      if(that.shiftRegMainRecord.roadNo
          && that.shiftRegMainRecord.stationNo
          && that.shiftRegMainRecord.squadDateStr
          && that.shiftRegMainRecord.squadNo
          && that.shiftRegMainRecord.laneNo){
        let findUserOfLaneShiftResp = await api.findUserOfLaneShift({
          roadNo: that.shiftRegMainRecord.roadNo,
          stationNo: that.shiftRegMainRecord.stationNo,
          laneNo: that.shiftRegMainRecord.laneNo,
          squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
          squadNo: that.shiftRegMainRecord.squadNo
        })

        if (null != findUserOfLaneShiftResp && findUserOfLaneShiftResp.data.length != 0) {
          that.selectUserList = findUserOfLaneShiftResp.data
          let laneOperatorNo = that.selectUserList[0].username
          that.$set(that.shiftRegMainRecord,'laneOperatorNo',laneOperatorNo)
          that.loadBasicData()
        }else{
          that.selectUserList = that.allUserList
        }
      }else{
        that.selectUserList = that.allUserList
      }

    },

    //金额########################################################################################################
    checkTotalMoney () {
      this.$set(this.shiftRegMainRecord,'totalMoney',0.00)
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) { // 出口
        if (this.shiftRegMainRecord.invMoney) {
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.invMoney)
        }

        if(this.shiftRegMainRecord.bujiaoMoney){
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.bujiaoMoney)
        }

        if(this.shiftRegMainRecord.rationInvMoney){
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.rationInvMoney)
        }

        if(this.shiftRegMainRecord.zhuiJiaoMoney){
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.zhuiJiaoMoney)
        }
      }
    },

    //纸券######################################################################################################
    async selectPaperList(isInit){
      if (this.shiftRegMainRecord.userMarkNo == ''
        || this.shiftRegMainRecord.stationNo == ''
        || this.shiftRegMainRecord.roadNo == ''
        || this.shiftRegMainRecord.laneNo == ''
        || this.shiftRegMainRecord.squadDateStr == ''
        || this.shiftRegMainRecord.squadNo == ''
        || this.shiftRegMainRecord.laneOperatorNo == '') {
        if(!isInit){
          this.$alert("请填写基础信息后再次点击！")
        }
        return
      }

      let findPaperCountOfListResp = await api.findPaperCountOfList({
        roadNo: this.shiftRegMainRecord.roadNo,
        stationNo: this.shiftRegMainRecord.stationNo,
        laneNo: this.shiftRegMainRecord.laneNo,
        laneOperatorNo: this.shiftRegMainRecord.laneOperatorNo,
        squadDateStr:  moment(this.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: this.shiftRegMainRecord.squadNo
      })

      // 下班才进行查询
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 1) {
        return
      }

      if (null != findPaperCountOfListResp && findPaperCountOfListResp.data == 0) {
        if(!isInit){
          this.$alert("流水中无相关纸券信息！")
        }
        return
      }

      this.$set(this.shiftRegMainRecord,'paperCount',findPaperCountOfListResp.data)
    },

    //保存##############################################################################################################
    async save_1(){
      let that = this
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          this.loading = true
          // 基础校验
          if (!that.lastBaseCheck()) {
            this.saveLoading = false
            this.loading = false
            return
          }

          let canSubmit = true
          if(parseInt(this.shiftRegMainRecord.userMarkNo) == 2){
            //校验机打发票
            canSubmit = shiftRulesUtil.checkInvoiceCodeTr(that.shiftRegMainRecord, that)
            if(!canSubmit){
              this.saveLoading = false
              this.loading = false
              return
            }

            //校验机打废票
            canSubmit = shiftRulesUtil.checkBadInvoiceCodeTr(that.shiftRegMainRecord, that)
            if(!canSubmit){
              this.saveLoading = false
              this.loading = false
              return
            }

            //校验定额发票
            canSubmit = shiftRulesUtil.checkManualInvoiceCodeTr(that.shiftRegMainRecord, that)
            if(!canSubmit){
              this.saveLoading = false
              this.loading = false
              return
            }

          }else{
            //校验纸券
            canSubmit = shiftRulesUtil.checkPaperCodeTr(that.shiftRegMainRecord, that)
            if(!canSubmit){
              this.saveLoading = false
              this.loading = false
              return
            }
          }


          //工班结算校验
          let settleDataResp = await api.checkShiftSettleStock({
            stationNo: that.shiftRegMainRecord.stationNo,
            laneNo: that.shiftRegMainRecord.laneNo,
            squadDateStr: that.shiftRegMainRecord.squadDateStr,
            squadNo: that.shiftRegMainRecord.squadNo,
            laneOperatorNo: that.shiftRegMainRecord.laneOperatorNo
          })

          if(null == settleDataResp){
            that.$notify.error("检查工班结算状态异常，请检查!")
            this.saveLoading = false
            this.loading = false
            return
          }

          if(!settleDataResp.data){
            that.$notify.error("工班已结算，不能进行交班登记!")
            this.saveLoading = false
            this.loading = false
            return
          }

          that.save_2_invoice()
        }
      })
    },
    //保存校验机打发票
    async save_2_invoice(){
      // 发票库存
      this.saveConfirmMsg = ''
      this.shiftRegMainRecord.invoiceCodeStockCheckList = []
      if (! await this.lastCheckInvoiceCodeTable()) {
        this.saveLoading = false
        this.loading = false
        return
      }

      if(this.saveConfirmMsg == ''){
        this.save_2_rationInvoice()
      }else{
        let msg = this.saveConfirmMsg.substring(0, this.saveConfirmMsg.length - 1)
        this.$confirm('当前机打发票（'+msg+'）未领用，请确认是否继续保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.save_2_rationInvoice()
        }).catch((err) => {
          this.loading = false
          this.saveLoading = false
        })
      }
    },
    //保存校验定额发票
    async save_2_rationInvoice(){
      // 定额发票库存
      this.saveConfirmMsg = ''
      this.shiftRegMainRecord.manualStockCheckList = [];
      if (! await this.lastCheckManualTable()) {
        this.saveLoading = false
        this.loading = false
        return
      }

      if(this.saveConfirmMsg == ''){
        this.save_2_paper()
      }else{
        let msg = this.saveConfirmMsg.substring(0, this.saveConfirmMsg.length - 1)
        this.$confirm('当前定额发票（'+msg+'）未领用，请确认是否继续保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.save_2_paper()
        }).catch((err) => {
          this.loading = false
          this.saveLoading = false
        })
      }
    },
    //保存校验纸券
    async save_2_paper(){
      // 纸券库存
      this.saveConfirmMsg = ''
      if(parseInt(this.shiftRegMainRecord.userMarkNo) == 1){//入口
        this.shiftRegMainRecord.paperCodeStockCheckList = [];
        if (! await this.lastCheckPaperCodeTable()) {
          this.saveLoading = false
          this.loading = false
          return
        }
      }else if(parseInt(this.shiftRegMainRecord.userMarkNo) == 2){//出口
        let positiveInteger = /^\d*$/;
        let paperCount = this.shiftRegMainRecord.paperCount
        if (null != paperCount && typeof paperCount != "undefined" && paperCount != '') {
          // 2、校验类型
          if (!positiveInteger.test(paperCount)) {
            this.$notify.error("请输入正确的纸券数量！")
            this.saveLoading = false
            this.loading = false
            return false
          }
          if (parseInt(paperCount) <= 0 || parseInt(paperCount) > 999999999999999) {
            this.$notify.error("请输入正确的纸券数量！")
            this.saveLoading = false
            this.loading = false
            return false
          }

          this.shiftRegMainRecord.shiftSquadPaperList = []
          this.shiftRegMainRecord.shiftSquadPaperList.push({
            paperStart: 1,
            paperEnd: paperCount,
            paperCount: paperCount
          })
        }
      }

      if(this.saveConfirmMsg == ''){
        this.save_3()
      }else{
        let msg = this.saveConfirmMsg.substring(0, this.saveConfirmMsg.length - 1)
        this.$confirm('当前纸券（'+msg+'）未领用，请确认是否继续保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.save_3()
        }).catch((err) => {
          this.loading = false
          this.saveLoading = false
        })
      }
    },
    async save_3(){
      let that = this
      let saveShiftRegMainRecord = {
        id: that.shiftRegMainRecord.id,
        userMarkNo: that.shiftRegMainRecord.userMarkNo,
        roadNo: that.shiftRegMainRecord.roadNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        orgCode: that.shiftRegMainRecord.orgCode,
        laneNo: that.shiftRegMainRecord.laneNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo,
        laneOperatorNo: that.shiftRegMainRecord.laneOperatorNo,
        laneOperatorName: that.operatorMap[that.shiftRegMainRecord.laneOperatorNo],
        registerOperatorNo: that.shiftRegMainRecord.registerOperatorNo,
        registerOperatorName: that.shiftRegMainRecord.registerOperatorName,
        remark: that.shiftRegMainRecord.remark,
        operationType: that.shiftRegMainRecord.operationType,
        registerOrgCode: that.shiftRegMainRecord.registerOrgCode,
        status: 1,

        totalMoney: shiftRulesUtil.accMul(that.shiftRegMainRecord.totalMoney,10000),
        invMoney: shiftRulesUtil.accMul(that.shiftRegMainRecord.invMoney,10000),
        bujiaoMoney: shiftRulesUtil.accMul(that.shiftRegMainRecord.bujiaoMoney,10000),
        rationInvMoney:shiftRulesUtil.accMul(that.shiftRegMainRecord.rationInvMoney,10000),
        zhuiJiaoMoney: shiftRulesUtil.accMul(that.shiftRegMainRecord.zhuiJiaoMoney,10000),

        paperCount:that.shiftRegMainRecord.paperCount == null ? 0 : that.shiftRegMainRecord.paperCount,
        invCount:that.shiftRegMainRecord.invCount == null ? 0 : that.shiftRegMainRecord.invCount,
        badInvCount:that.shiftRegMainRecord.badInvCount == null ? 0 : that.shiftRegMainRecord.badInvCount,
        rationInvCount:that.shiftRegMainRecord.rationInvCount == null ? 0 : that.shiftRegMainRecord.rationInvCount,
        rationInvTotalMoney: shiftRulesUtil.accMul(that.shiftRegMainRecord.rationInvTotalMoney,100),

        // 新的
        shiftInvDetailList: that.shiftRegMainRecord.shiftInvDetailList,
        shiftSquadInvalidInvList: that.shiftRegMainRecord.shiftSquadInvalidInvList,
        shiftSquadPaperList: that.shiftRegMainRecord.shiftSquadPaperList,
        shiftSquadRationInvoiceList: that.shiftRegMainRecord.shiftSquadRationInvoiceList,

        // 旧的
        oldShiftInvDetailList: that.shiftRegMainRecord.oldShiftInvDetailList,
        oldShiftSquadInvalidInvList: that.shiftRegMainRecord.oldShiftSquadInvalidInvList,
        oldShiftSquadPaperList: that.shiftRegMainRecord.oldShiftSquadPaperList,
        oldShiftSquadRationInvoiceList: that.shiftRegMainRecord.oldShiftSquadRationInvoiceList,
      }
      // 发票、定额发票、纸券数量回写
      shiftRulesUtil.makeInvCount(saveShiftRegMainRecord)

      // 废票金额转换
      shiftRulesUtil.makeBadInvMoney(saveShiftRegMainRecord);

      // 定额发票金额转换
      shiftRulesUtil.makeRationInvMoney(saveShiftRegMainRecord);

      if(parseInt(saveShiftRegMainRecord.userMarkNo) == 1){
        that.save_4(saveShiftRegMainRecord)
      }else{
        api.findPaperCount({
          userMarkNo: saveShiftRegMainRecord.userMarkNo,
          stationNo: saveShiftRegMainRecord.stationNo,
          laneNo: saveShiftRegMainRecord.laneNo,
          squadDateStr:  saveShiftRegMainRecord.squadDateStr,
          squadNo: saveShiftRegMainRecord.squadNo,
          laneOperatorNo: saveShiftRegMainRecord.laneOperatorNo
        }).then(res => {
          let paperCount = res.data;
          if(paperCount > 0){
            const msg = "收费员：" + saveShiftRegMainRecord.laneOperatorName + "，工班日期："+
              saveShiftRegMainRecord.squadDateStr+"，工班："+saveShiftRegMainRecord.squadNo+"，已登记的纸券数量为"+paperCount+"，确认继续登记？"
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.save_4(saveShiftRegMainRecord)
            }).catch((err) => {
              that.loading = false
              that.saveLoading = false
            })
          }else{
            that.save_4(saveShiftRegMainRecord)
          }
        })
      }

    },

    async save_4(saveShiftRegMainRecord){
      let saveShiftReg = await api.saveShiftReg(saveShiftRegMainRecord)
      if (saveShiftReg.code != 200){
        this.$notify.error("保存失败！")
        this.saveLoading = false
        this.loading = false
        return
      }

      if(saveShiftReg.data.flag){
        this.$notify.success("保存成功！")
        this.$emit('refreshData')
        this.visible = false
      }else{
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: saveShiftReg.data.message,
          type: 'error',
          position: 'top-right',
          duration: 0
        })
        this.saveLoading = false
        this.loading = false
      }

    },

    lastBaseCheck(){
      // 下班登记至少登记一项信息
      if (!this.lastCheckOffWorkRequiredValue()) {
        this.$notify.error("请至少填写一项信息！")
        return false
      }

      return true
    },
    lastCheckOffWorkRequiredValue(){
      // 金额
      let moneyBoolean = true;
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) { // 出口
        if ((!this.shiftRegMainRecord.invMoney)
          && (!this.shiftRegMainRecord.bujiaoMoney)
          && (!this.shiftRegMainRecord.rationInvMoney)
          && (!this.shiftRegMainRecord.zhuiJiaoMoney)
          && (!this.shiftRegMainRecord.paperCount)){
          moneyBoolean = false
        }
      }

      // 发票
      let invCodeBoolean = true;
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2
        && this.shiftRegMainRecord.shiftInvDetailList.length == 0
        && this.shiftRegMainRecord.shiftSquadInvalidInvList.length == 0) {
        invCodeBoolean = false;
      }

      // 定额发票
      let manualInvBoolean = true;
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2
        && this.shiftRegMainRecord.shiftSquadRationInvoiceList.length == 0) {
        manualInvBoolean = false;
      }

      // 纸券
      let paperBoolean = true;
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 1
        && this.shiftRegMainRecord.shiftSquadPaperList.length == 0) {
        paperBoolean = false;
      }

      return parseInt(this.shiftRegMainRecord.userMarkNo) == 1 ?
        paperBoolean :
        moneyBoolean | invCodeBoolean | manualInvBoolean
    },

    async lastCheckInvoiceCodeTable(){
      let canAdd = true
      let message = ''
      let inv_chk = []
      let that = this
      if (that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
        for(let data of that.shiftRegMainRecord.shiftInvDetailList){
          inv_chk = []
          let szInvCode = data.invCode
          let tStartNo = parseInt(data.invStartNo)
          let tEndNo = parseInt(data.invEndNo)

          if (parseInt(that.shiftRegMainRecord.operationType) == 2 && that.shiftRegMainRecord.oldShiftInvDetailList.length > 0) { // 修改的逻辑
            for(let oldData of that.shiftRegMainRecord.oldShiftInvDetailList){
              if (parseInt(szInvCode) != parseInt(oldData.invCode)) {
                continue
              }

              if (parseInt(tStartNo) < parseInt(oldData.invStartNo)) {
                let iEndNo_in = parseInt(oldData.invStartNo) - 1 < parseInt(tEndNo) ? parseInt(oldData.invStartNo) - 1 : parseInt(tEndNo);
                inv_chk.push({
                  invCode: szInvCode,
                  invStartNo: tStartNo,
                  invEndNo: iEndNo_in
                })
              }

              tStartNo = parseInt(oldData.invEndNo) + 1 > tStartNo ? parseInt(oldData.invEndNo) + 1 : tStartNo;
              if (parseInt(tEndNo) < parseInt(tStartNo)) {
                break
              }
            }
          }

          if (tEndNo >= tStartNo) {
            inv_chk.push({
              invCode: szInvCode,
              invStartNo: tStartNo,
              invEndNo: tEndNo
            })
          }

          if (inv_chk.length > 0) {
            for(let newData of inv_chk){
              let szInvCode_chk = newData.invCode;
              let iStartNo_chk = parseInt(newData.invStartNo);
              let iEndNo_chk = parseInt(newData.invEndNo);

              let checkInvCodeStockResp = await api.checkInvCodeStock({
                invCode: szInvCode_chk,
                invStartNo: iStartNo_chk,
                invEndNo: iEndNo_chk,
                stationNo: that.shiftRegMainRecord.stationNo
              })

              if (null == checkInvCodeStockResp || checkInvCodeStockResp.code != 200) {
                message = "检查机打发票库存异常，请检查!";
                canAdd = false
                return false
              }

              if (checkInvCodeStockResp.data.length > 0) {
                let checkInvList = checkInvCodeStockResp.data
                checkInvList.sort(function (a, b) {
                  if(parseInt(a.invStartNo) > parseInt(b.invStartNo)){
                    return 1
                  }else {
                    return -1
                  }
                })
                let iStartNo_old;
                let iEndNo_old;
                let iTagNo_old;
                checkInvList.forEach(function (data1, index1) {
                  let iTagNo_part = data1.tagNo;
                  let iStartNo_part = parseInt(data1.invStartNo);
                  let iEndNo_part = parseInt(data1.invEndNo);

                  if(iTagNo_part == 0){
                    let startNo_msg = iStartNo_chk >= iStartNo_part ? iStartNo_chk : iStartNo_part
                    let endNo_msg = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                    that.saveConfirmMsg += startNo_msg + '~' + endNo_msg + '，'
                  }

                  let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                  let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                  if (iStartNo_chk < iStartNo_in) {
                    that.shiftRegMainRecord.invoiceCodeStockCheckList.push({
                      invCode: szInvCode_chk,
                      invStartNo: tStartNo,
                      invEndNo: tEndNo,
                      notInInvStartNo: iStartNo_chk,
                      notInInvEndNo: iStartNo_in - 1,
                      stationNo: that.shiftRegMainRecord.stationNo,
                      stationName: that.orgMap[that.shiftRegMainRecord.orgCode].fullName
                    })
                    canAdd = false
                  }

                  iStartNo_chk = iEndNo_in + 1
                  if (iStartNo_chk > iEndNo_chk) {
                    return false
                  }
                  iStartNo_old = iStartNo_part
                  iEndNo_old = iEndNo_part
                  iTagNo_old = iTagNo_part
                })
              }

              if (iStartNo_chk <= iEndNo_chk) {
                that.shiftRegMainRecord.invoiceCodeStockCheckList.push({
                  invCode: szInvCode_chk,
                  invStartNo: tStartNo,
                  invEndNo: tEndNo,
                  notInInvStartNo: iStartNo_chk,
                  notInInvEndNo: iEndNo_chk,
                  stationNo: that.shiftRegMainRecord.stationNo,
                  stationName: that.orgMap[that.shiftRegMainRecord.orgCode].fullName
                });
                canAdd = false;
              }
            }
          }
        }

        if (!canAdd && message != '') {
          that.$notify.error(message)
          return false
        } else if (!canAdd && message == '') {
          that.$refs.invoiceCodeStockDialog.init()
          return false
        }
      }

      return true
    },
    async lastCheckManualTable(){
      let that = this
      let canAdd = true
      let message = ''
      let inv_chk = []
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
        for(let data of that.shiftRegMainRecord.shiftSquadRationInvoiceList){
          let invCode_rem = data.invCode
          let iInvStart_rem = parseInt(data.invStartNo)
          let iInvEnd_rem = parseInt(data.invEndNo)
          let manualInvMoney = data.invRationMoney // 用来显示错误信息的
          if (parseInt(that.shiftRegMainRecord.operationType) == 2 && that.shiftRegMainRecord.oldShiftSquadRationInvoiceList.length > 0) {
            for(let oldData of that.shiftRegMainRecord.oldShiftSquadRationInvoiceList){
              if (invCode_rem != parseInt(oldData.invCode)) {
                continue
              }

              if (iInvStart_rem < parseInt(oldData.invStartNo)) {
                let iInvEnd_in = parseInt(oldData.invStartNo) - 1 < iInvEnd_rem ? parseInt(oldData.invStartNo) - 1 : iInvEnd_rem
                inv_chk.push({
                  invCode: invCode_rem,
                  invStartNo: iInvStart_rem,
                  invEndNo: iInvEnd_in,
                  invRationMoney: manualInvMoney
                })
              }

              iInvStart_rem = parseInt(oldData.invEndNo) + 1 > iInvStart_rem ? parseInt(oldData.invEndNo) + 1 : iInvStart_rem
              if (iInvEnd_rem < iInvStart_rem) {
                break
              }
            }
          }

          if (iInvEnd_rem >= iInvStart_rem) {
            inv_chk.push({
              invCode: invCode_rem,
              invStartNo: iInvStart_rem,
              invEndNo: iInvEnd_rem,
              invRationMoney: manualInvMoney
            })
          }

          if (inv_chk.length > 0) {
            for(let newData of inv_chk){
              let invCode_chk = newData.invCode
              let iStartNo_chk = parseInt(newData.invStartNo)
              let iEndNo_chk = parseInt(newData.invEndNo)
              let manualMoney_chk = newData.invRationMoney // 其他在库存表里面的钱为0，因为一开始领用的时候不知道是多少钱

              let checkManualInvStockResp = await api.checkManualInvStock({
                stationNo: that.shiftRegMainRecord.stationNo,
                invCode: invCode_chk,
                invStartNo: iStartNo_chk,
                invEndNo: iEndNo_chk,
                invMoney: manualMoney_chk
              })

              if (null == checkManualInvStockResp || checkManualInvStockResp.code != 200) {
                message = "检查定额发票库存异常，请检查!"
                canAdd = false
                break
              }

              if (checkManualInvStockResp.data.length > 0) {
                let checkManualInvList = checkManualInvStockResp.data
                checkManualInvList.sort(function (a, b) {
                  if(parseInt(a.invStartNo) > parseInt(b.invStartNo)){
                    return 1
                  }else {
                    return -1
                  }
                })
                let iStartNo_old
                let iEndNo_old
                let iTagNo_old
                checkManualInvStockResp.data.forEach(function (data1, index1) {
                  let iTagNo_part = data1.tagNo;
                  let iStartNo_part = parseInt(data1.invStartNo);
                  let iEndNo_part = parseInt(data1.invEndNo);

                  if(iTagNo_part == 0){
                    let startNo_msg = iStartNo_chk >= iStartNo_part ? iStartNo_chk : iStartNo_part
                    let endNo_msg = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                    that.saveConfirmMsg += startNo_msg + '~' + endNo_msg + '，'
                  }

                  let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                  let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                  if (iStartNo_chk < iStartNo_in) {
                    that.shiftRegMainRecord.manualStockCheckList.push({
                      stationNo: that.shiftRegMainRecord.stationNo,
                      stationName: that.orgMap[that.shiftRegMainRecord.orgCode].fullName,
                      invCode: invCode_chk,
                      invRationMoney: manualInvMoney,
                      invStartNo: iInvStart_rem,
                      invEndNo: iInvEnd_rem,
                      notInInvStartNo: iStartNo_chk,
                      notInInvEndNo: iStartNo_in - 1
                    })
                    canAdd = false
                  }

                  iStartNo_chk = iEndNo_in + 1
                  if (iStartNo_chk > iEndNo_chk) {
                    return false
                  }
                  iStartNo_old = iStartNo_part
                  iEndNo_old = iEndNo_part
                  iTagNo_old = iTagNo_part
                })
              }
              if (iStartNo_chk <= iEndNo_chk) {
                that.shiftRegMainRecord.manualStockCheckList.push({
                  stationNo: that.shiftRegMainRecord.stationNo,
                  stationName: that.orgMap[that.shiftRegMainRecord.orgCode].fullName,
                  invCode: invCode_chk,
                  invRationMoney: manualInvMoney,
                  invStartNo: iInvStart_rem,
                  invEndNo: iInvEnd_rem,
                  notInInvStartNo: iStartNo_chk,
                  notInInvEndNo: iEndNo_chk
                })
                canAdd = false;
              }
            }
          }
        }

        if (!canAdd && message != '') {
          that.$notify.error(message)
          return false
        } else if (!canAdd && message == '') {
          that.$refs.manualStockDialog.init()
          return false
        }
      }

      return true
    },

    //纸券保存校验
    async lastCheckPaperCodeTable(){
      let that = this
      if (parseInt(that.shiftRegMainRecord.userMarkNo) == 1) {
        let canAdd = true
        let message = ''
        let paper_chk = []
        if (that.shiftRegMainRecord.shiftSquadPaperList.length > 0) {
          for(let data of that.shiftRegMainRecord.shiftSquadPaperList){
            let iPaperStart_rem = parseInt(data.paperStart)
            let iPaperEnd_rem = parseInt(data.paperEnd)

            if (parseInt(that.shiftRegMainRecord.operationType) == 2 && that.shiftRegMainRecord.oldShiftSquadPaperList.length > 0) {
              for(let oldData of that.shiftRegMainRecord.oldShiftSquadPaperList){
                if (parseInt(iPaperStart_rem) < parseInt(oldData.paperStart)) {
                  let iPaperEnd_in = parseInt(oldData.paperStart) - 1 < parseInt(iPaperEnd_rem) ? parseInt(oldData.paperStart) - 1 : parseInt(iPaperEnd_rem)
                  paper_chk.push({
                    paperStart: iPaperStart_rem,
                    paperEnd: iPaperEnd_in
                  })
                }

                iPaperStart_rem = parseInt(oldData.paperEnd) + 1 > parseInt(iPaperStart_rem) ? parseInt(oldData.paperEnd) + 1 : iPaperStart_rem
                if (parseInt(iPaperEnd_rem) < parseInt(iPaperStart_rem)) {
                  break
                }
              }
            }

            if (iPaperEnd_rem >= iPaperStart_rem) {
              paper_chk.push({
                paperStart: iPaperStart_rem,
                paperEnd: iPaperEnd_rem
              });
            }

            if (paper_chk.length > 0) {
              for(let newData of paper_chk){
                let iStartNo_chk = parseInt(newData.paperStart);
                let iEndNo_chk = parseInt(newData.paperEnd);

                let checkPaperStockResp = await api.checkPaperStock({
                  stationNo: that.shiftRegMainRecord.stationNo,
                  paperStartNo: iStartNo_chk,
                  paperEndNo: iEndNo_chk
                });
                if (null == checkPaperStockResp || checkPaperStockResp.code != 200) {
                  message = "校验纸券库存异常，请检查！"
                  canAdd = false
                  return false
                }

                if (checkPaperStockResp.data.length > 0) {
                  let checkPaperList = checkPaperStockResp.data
                  checkPaperList.sort(function (a, b) {
                    if(parseInt(a.paperStartNo) > parseInt(b.paperStartNo)){
                      return 1
                    }else {
                      return -1
                    }
                  })
                  let iStartNo_old
                  let iEndNo_old
                  let iTagNo_old
                  checkPaperList.forEach(function (data1, index1) {
                    let iStartNo_part = parseInt(data1.paperStartNo)
                    let iEndNo_part = parseInt(data1.paperEndNo)
                    let iTagNo_part = parseInt(data1.tagNo)
                    if(iTagNo_part == 0){
                      let startNo_msg = iStartNo_chk >= iStartNo_part ? iStartNo_chk : iStartNo_part
                      let endNo_msg = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                      that.saveConfirmMsg += startNo_msg + '~' + endNo_msg + '，'
                    }

                    let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                    let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                    if (iStartNo_chk < iStartNo_in) {
                      that.shiftRegMainRecord.paperCodeStockCheckList.push({
                        stationNo: that.shiftRegMainRecord.stationNo,
                        stationName: tthat.orgMap[that.shiftRegMainRecord.orgCode].fullName,
                        paperStart: iPaperStart_rem,
                        paperEnd: iPaperEnd_rem,
                        notInPaperStart: iStartNo_chk,
                        notInPaperEnd: iStartNo_in - 1
                      })
                      canAdd = false;
                    }

                    iStartNo_chk = iEndNo_in + 1
                    if (iStartNo_chk > iEndNo_chk) {
                      return false
                    }
                    iStartNo_old = iStartNo_part
                    iEndNo_old = iEndNo_part
                    iTagNo_old = iTagNo_part
                    index1 ++
                  })
                }

                if (iStartNo_chk <= iEndNo_chk) {
                  that.shiftRegMainRecord.paperCodeStockCheckList.push({
                    stationNo: that.shiftRegMainRecord.stationNo,
                    stationName: that.orgMap[that.shiftRegMainRecord.orgCode].fullName,
                    paperStart: iPaperStart_rem,
                    paperEnd: iPaperEnd_rem,
                    notInPaperStart: iStartNo_chk,
                    notInPaperEnd: iEndNo_chk
                  })
                  canAdd = false
                }
              }
            }
          }

          if (!canAdd && message != '') {
            that.$notify.error(message)
            return false
          } else if (!canAdd && message == '') {
            that.$refs.paperCodeStockDialog.init()
            return false
          }
        }
      }

      return true

    },


  }
}
</script>

<style scoped>


</style>
