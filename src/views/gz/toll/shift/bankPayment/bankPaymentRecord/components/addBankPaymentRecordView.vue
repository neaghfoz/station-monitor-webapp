<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="50%"
    >
      <el-form v-show="formShow" ref="form" :rules="rules" v-loading="loading" :model="bankPaymentRecord" label-width="120px">
        <el-form-item label="缴款方式" prop="payType" :rules="[{required: true, message:'请选择缴款方式', trigger:'blur'}]">
          <el-radio-group v-model="bankPaymentRecord.payType">
            <el-radio :label="1">投包机缴款</el-radio>
            <el-radio :label="2">银行缴款</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="收费站"  prop="orgCode"
                      :rules="[{required: true, message:'请选择收费站', trigger:'blur'}]">
          <ti-select v-model="bankPaymentRecord.orgCode" url="/api/v1/common/sysOrg/findByAuth?showLevel=4"
                     :props="{key:'fullCode',value:'fullCode',label:'fullName'}" @change="stationChange"
                      :disabled="bankPaymentRecord.id != ''"/>
        </el-form-item>

        <el-form-item label="工班日期" :rules="[{required: true, message:'工班日期不能为空', trigger:'blur'}]">
          <el-form-item prop="beginSquadDateStr" v-show="false"/>
          <el-form-item prop="endSquadDateStr" v-show="false"/>
          <ti-date-range v-model="bankPaymentRecord" date-type="daterange" format="yyyy-MM-dd"
                         begin-key="beginSquadDateStr" end-key="endSquadDateStr" @change="loadDetail"
                         date-rule="oneMonth" :disabled="bankPaymentRecord.id != ''"/>
        </el-form-item>

        <el-form-item
        label-width="50px">
          <el-table
            :data="bankPaymentRecord.bankPaymentRecordDetailList"
            border
            show-summary
            :summary-method="getSummaries"
            max-height="220"
            :header-cell-style="headerStyle"
            :cell-style="headerStyle"
            style="width: 100%;">
            <el-table-column
              prop="squadDate"
              label="工班日期"
              width="160">
            </el-table-column>
            <el-table-column
              prop="squadNoText"
              label="工班"
              width="150">
            </el-table-column>
            <el-table-column
              prop="money"
              label="金额（元）">
              <template slot-scope="scope">
                <el-form-item style="width: 100%;margin-bottom: 0px;">
                  <el-input-number :precision="4" :step="1" :min="0" :max="1000000000" v-model="scope.row.money" style="width: 100%;"/>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="bankPaymentRecord.remark" maxlength="200"></el-input>
        </el-form-item>

        <el-form-item label-width="0px" style="text-align: center;">
          <el-button type="primary" :loading="saveLoading" @click="save()">提交</el-button>
          <el-button @click="visible = false">关闭</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>


<script>

import mixin from 'ecip-web/utils/common-mixin'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import api from '../bankPaymentRecordApi.js'
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import moment from 'moment'
import rulesUtil from "@/views/gz/toll/shift/bankPayment/bankPaymentRecord/rulesUtil";

export default {
  name: 'gz.toll.shift.bankPayment.add',
  components: { TiSelect, tiSysOrg, TiDateRange},
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
      orgMap:{},
      bankPaymentRecord:{
        id:'',
        roadNo:'',
        stationNo:'',
        orgCode:'',
        squadDate:'',
        beginSquadDateStr:'',
        endSquadDateStr:'',
        operationType:'',
        remark:'',
        totalMoney:'',
        payType:'',

        bankPaymentRecordDetailList:[]
      },
      rules:{
        money: [{validator: rulesUtil.checkMoney, trigger: 'blur'}]
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
    }
  },
  methods: {
    async init(tenantId, appId, id, orgData) {
      this.visible = true
      this.formShow = true
      this.render(tenantId, appId)

      this.$nextTick(async() => {
        let that = this

        let allOrgData = await api.findOrgByAuth({"showLevel":4})
        if(allOrgData.code == 200){
          allOrgData.data.forEach(function (data , index) {
            that.orgMap[data.fullCode] = data
          })
        }

        //新增逻辑
        if(id == null || id == ""){
          that.title = '新增'
          let date = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
          that.$set(that.bankPaymentRecord,'beginSquadDateStr',date)
          that.$set(that.bankPaymentRecord,'endSquadDateStr',date)
          that.$set(that.bankPaymentRecord,'payType',2)
          let orgData = await api.getCurrentOrg();
          if(orgData != null && orgData.data != null){
            that.$set(that.bankPaymentRecord,'orgCode',orgData.data.fullCode)
            let org = that.orgMap[orgData.data.fullCode]
            that.bankPaymentRecord.roadNo = org.roadNo
            that.bankPaymentRecord.stationNo = org.stationNo
            that.loadDetail()
          }
        }else{//修改逻辑
          that.title = '修改'
          let detailResp = await api.detail(id)
          if(detailResp.code != 200){
            that.visible = false
            that.formShow = false
            that.$notify.error("获取缴款记录失败，请检查！")
            that.$emit('refreshData')
            return
          }

          that.bankPaymentRecord = detailResp.data

          that.$set(that.bankPaymentRecord,'beginSquadDateStr',detailResp.data.squadDateText)
          that.$set(that.bankPaymentRecord,'endSquadDateStr',detailResp.data.squadDateText)

          if (null != that.bankPaymentRecord.bankPaymentRecordDetailList && that.bankPaymentRecord.bankPaymentRecordDetailList.length > 0) {
            for(let tmp of that.bankPaymentRecord.bankPaymentRecordDetailList){
              let money = parseFloat(tmp.money / 10000.0).toFixed(4)
              that.$set(tmp,'money',money)
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
      this.orgMap = {}
      this.bankPaymentRecord = {
        id:'',
        roadNo:'',
        stationNo:'',
        orgCode:'',
        squadDate:'',
        beginSquadDateStr:'',
        endSquadDateStr:'',
        operationType:'',
        remark:'',
        totalMoney:'',
        payType:'',

        bankPaymentRecordDetailList:[]
      }
    },
    headerStyle({ row, rowIndex}){
      return 'text-align: center !important;'
    },
    getSummaries(param){
      const { columns, data } = param
      const sums = [];
      if(data == undefined || data.length == 0){
        return sums
      }

      sums[0] = '银行缴款总计'
      sums[1] = ''
      let totalMoney = 0
      data.forEach(function (data) {
        let money = data['money']
        totalMoney += rulesUtil.accMul(money,10000)
      })
      sums[2] = parseFloat(totalMoney / 10000.0).toFixed(4)

      return sums
    },
    stationChange(){
      let that = this
      let org = that.orgMap[that.bankPaymentRecord.orgCode]
      that.bankPaymentRecord.roadNo = org.roadNo
      that.bankPaymentRecord.stationNo = org.stationNo

      that.loadDetail()
    },
    async loadDetail(){
      let that = this;
      if (that.bankPaymentRecord.roadNo == ''
        || that.bankPaymentRecord.stationNo == ''
        || that.bankPaymentRecord.beginSquadDateStr == ''
        || that.bankPaymentRecord.endSquadDateStr == '') {
        return
      }

      let detailListResp = await api.findDetailList({
        beginSquadDateStr:that.bankPaymentRecord.beginSquadDateStr,
        endSquadDateStr: that.bankPaymentRecord.endSquadDateStr,
        roadNo: that.bankPaymentRecord.roadNo,
        stationNo: that.bankPaymentRecord.stationNo
      })

      if(detailListResp.code == 200 && detailListResp.data.length > 0){
        let detailList = detailListResp.data
        detailList.forEach(function (detail) {
          that.$set(detail,'money',parseFloat(detail.money / 10000.0).toFixed(4))
        })
        that.$set(that.bankPaymentRecord,'bankPaymentRecordDetailList',detailListResp.data)
      }
    },
    async save(){
      let that = this
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          this.loading = true

          if(!this.checkData()){
            this.saveLoading = false
            this.loading = false
            return
          }

          let saveBankPaymentRecord = JSON.parse(JSON.stringify(this.bankPaymentRecord))
          if (null != saveBankPaymentRecord.bankPaymentRecordDetailList && saveBankPaymentRecord.bankPaymentRecordDetailList.length > 0) {
            saveBankPaymentRecord.bankPaymentRecordDetailList.forEach(function (tmp, index) {
              tmp.money = rulesUtil.accMul(tmp.money, 10000)
            })
          }

          let saveResp = await api.save(saveBankPaymentRecord)
          if (saveResp.code != 200){
            this.$notify.error("保存失败！")
            this.saveLoading = false
            this.loading = false
            return
          }

          if(saveResp.data.flag){
            this.$notify.success("保存成功！")
            this.$emit('refreshData')
            this.visible = false
          }else{
            this.$notify.error(saveResp.data.message)
            this.saveLoading = false
            this.loading = false
          }
        }
      })

    },
    checkData(){
      let canSubmit = true
      let that = this
      if(that.bankPaymentRecord.bankPaymentRecordDetailList == undefined
        || that.bankPaymentRecord.bankPaymentRecordDetailList.length == 0){
        that.$notify.error("缴款金额不能为空！")
        canSubmit = false
        return canSubmit
      }

      /*let reg = /^(([0-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/
      that.bankPaymentRecord.bankPaymentRecordDetailList.forEach(function (data, index) {
        let money = data.money
        if (!reg.test(money)) {
          that.$notify.error('请输入正确[0，99999.9999]的金额')
          canSubmit = false
          return false
        }

        if(money > 99999.9999){
          that.$notify.error('请输入正确[0，99999.9999]的金额')
          canSubmit = false
          return false
        }
      })*/

      return canSubmit
    }



  }
}
</script>

<style scoped>


</style>
