<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="60%"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px" id = "chargeManagementForm">
        <el-row>
          <el-col :span="24">
          <table class="table" id="invCodeTable" style = "width: 95%;margin-bottom: 20px;border-collapse: collapse;margin: auto;" cellspacing="0" cellpadding="0" border="0">
            <tr class="bg-gray">
              <th style="width:25%">发票类型</th>
              <th style="width:25%">发票代码</th>
              <th style="width:25%">发票号码</th>
              <th style="width:15%">
                    <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addInvCodeRecord()"/>
              </th>
            </tr>
            <tr  v-for="(item, index) in formItem.shiftChargeInvDetailsList">
              <td class="text-center " >
                <ti-select
                  :clearable="false"
                  v-model="item.invoiceType"
                  placeholder="请选择"
                  dict-type="tibms_toll_invoiceType"
                  @change="changeInvoiceType(index)"
                />
              </td>
              <td  class="text-center " >
                <el-input v-model="item.invCode"  style="width:100%"  placeholder="发票代码" @input ="checkInvCode(index)" maxlength="20"/>
              </td>
              <td  class="text-center">
                <el-input v-model="item.vno"  style="width:100%" placeholder="发票号码" @input ="checkVno(index)" maxlength="10"></el-input>
              </td>
              <td class="text-center">
                <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeInvCodeRecord(index)" v-show="formItem.shiftChargeInvDetailsList.length != 1" />
              </td>
            </tr>
          </table>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
<!--          <el-col :span="8">-->
<!--            <el-form-item-->
<!--              label="发票号码"-->
<!--              prop="vno"-->
<!--              :rules="[-->
<!--                {required: true, message:'发票号码为空', trigger:'blur'},-->
<!--                {pattern: /^([0-9]{1,10})$/, message: '最多10位数字', trigger: 'change'}-->
<!--              ]"-->
<!--            >-->
<!--              <el-input v-model="formItem.vno" type="text" placeholder="发票号码" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item
              label="出口站"
              prop="exStationId"
              :rules="[
                {required: true, message:'请选择出口站', trigger:'blur'}
              ]"
            >
              <ti-select
                v-model="formItem.exStationId"
                url="/api/v1/common/sysOrg/findByAuth?showLevel=4"
                :props="{key:'stationId',value:'stationId',label:'name'}"
                @change="changeExStationId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="enStationIdShow"
              label="入口站"
              prop="enStationId"
              :rules="[
              ]"
            >
              <ti-select
                v-model="formItem.enStationId"
                url="/api/v1/common/station/findAllList"
                :props="{key:'stationId',value:'stationId',label:'stationName'}"
                @change="changeEnStationId"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="交款类别"
              prop="opStatus"
              :rules="[
                {required: true, message:'交款类别为空', trigger:'blur'}
              ]"
            >
              <ti-select
                v-model="formItem.opStatus"
                dict-type="tibms_toll_shiftChargeOpType"
                @change="opStatusChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="工班日期"
              prop="squadDate"
              :rules="[{required: true, message:'请选择工班日期', trigger:'blur'}]"
            >
              <el-date-picker
                v-model="formItem.squadDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
              />

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="vehTypeNoShow"
              label="车型"
              prop="vehTypeNo"
              :rules="[{required: true, message:'请选择车型', trigger:'blur'}]"
            >
              <ti-select
                v-model="formItem.vehTypeNo"
                dict-type="tibms_com_vehicleType"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="金额（元）"
              prop="bTotalTollStr"
              :rules="[
                {required: true, message:'金额为空', trigger:'blur'},
                {pattern: /^(([1-9]{1}(\d{0,7}))|(0{1}))(\.\d{1,2})?$/, message: '整数部分限8位,小数部分限2位', trigger: 'change'}
              ]"
            >
              <el-input v-model="formItem.bTotalTollStr" type="text" placeholder="金额" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="工班"
              prop="squadNo"
              :rules="[{required: true, message:'请选择工班', trigger:'blur'}]"
            >
              <ti-select
                v-model="formItem.squadNo"
                url="api/v1/common/squad/list"
                :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="fullVehPlateShow"
              label="车牌号码"
              prop="fullVehPlate"
              :rules="[
                {required: true, message:'车牌号码为空', trigger:'blur'}
              ]"
            >
              <el-input v-model="formItem.fullVehPlate" type="text" placeholder="车牌号码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="操作员"
              prop="operatorNo"
              :rules="[
                {required: true, message:'请选择操作员', trigger:'blur'}
              ]"
            >
              <ti-select
                v-model="formItem.operatorNo"
                url="/api/v1/common/sysUser/list"
                :props="{key:'id',value:'username',label:'fullName'}"
                @change="changeOperatorNo"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="操作时间"
              prop="opTimeStr"
            >
              <el-input v-model="formItem.opTimeStr" type="text" v-show = "false"/>
              <span>{{formItem.opTimeStr}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            label="备注"
            prop="remarks"
          >
            <el-input
              v-model="formItem.remarks"
              type="textarea"
              :rows="3"
              maxlength="120"
            />
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer" style = "text-align: center">
         <el-button v-if="method === 'add'" type="primary" :loading="saveLoading" @click="save">保存</el-button>
         <el-button v-if="method === 'edit'" type="primary" :loading="saveLoading" @click="edit">修改</el-button>
        <el-button @click="close">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save, getById, update } from './charge'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Shanghai");
moment.tz.guess()

export default {
  name: 'SxTollShiftChargeManagementAdd',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      enStationIdShow: true,
      vehTypeNoShow: true,
      fullVehPlateShow: true,
      role: {},
      method: '',
      title: '',
      formItem: {
        vno: '',
        enRoadNo: '',
        exRoadNo: '',
        exStationId: '',
        enStationId: '',
        exStationNo: '',
        enStationNo: '',
        opStatus: '',
        squadDate: '',
        vehTypeNo: '',
        bTotalTollStr: '',
        squadNo: '',
        fullVehPlate: '',
        operatorNo: '',
        btotalTollText: '',
        opTimeStr: moment().format('YYYY-MM-DD HH:mm:ss'),
        remarks: '',
        shiftChargeInvDetailsList: [{invCode:'',vno:'',status:0,invoiceType:'0'}]
      }
    }
  },
  methods: {
    init(method, id) {

      this.formItem.opTimeStr = moment().format('YYYY-MM-DD HH:mm:ss')
      this.method = method
      this.title = `缴款信息--追缴`
      this.visible = true
      this.loading = false

      this.$nextTick(async() => {
        this.enStationIdShow = true
        this.vehTypeNoShow = true
        this.fullVehPlateShow = true
        // 清空初始化
        this.$refs.form.clearValidate()
        Object.assign(this.$data.formItem, this.$options.data().formItem)
        if (method === 'add') {
          this.formItem.opStatus = '2'
        }

        if (method === 'edit' || method === 'view') { // 修改或者查看
          try {
            this.loading = true
            const { data } = await getById(id)

            cloneDeep(this.formItem, data)
            if(this.formItem.shiftChargeInvDetailsList) {
              this.formItem.shiftChargeInvDetailsList.forEach(x => {
                 x.invoiceType = x.invoiceType + ''
              })
            }
            this.formItem.bTotalTollStr = this.formItem.btotalTollText.replace(/[,]/g, '')
            this.formItem.opTimeStr = moment().format('YYYY-MM-DD HH:mm:ss')
            this.opStatusChange(this.formItem.opStatus + '')
          } finally {
            this.loading = false
          }
        }
      })
    },
    getData() {
    },
    save() {

      let that = this
      let arr = []
      const result =  this.formItem.shiftChargeInvDetailsList.every((item, index) => {
        if(!item.invCode && item.invoiceType == 0) {
          that.$notify.warning("存在发票代码为空，请填写！");
          return false
        }
        if(!item.vno ) {
          that.$notify.warning("存在发票号码为空，请填写！");
          return false
        }

        var invoiceType = (item.invoiceType || '')
        var invCode = (item.invCode || '')
        var vno = (item.vno || '')
        var val = invoiceType + '_' + invCode + '_' + vno
        if (arr.indexOf(val) >= 0) {
          that.$notify.warning('存在发票代码：' + invCode +',发票号码：' + vno+  '的重复数据，请填写正确！');
          return false
        } else {
          arr.push(val)
        }
          return true;
      })


      this.$refs.form.validate(async valid => {
        if (valid && result) {
          try {
            this.formItem.shiftChargeInvDetailsList[ this.formItem.shiftChargeInvDetailsList.length -1].status = 1
            this.formItem.vno = this.formItem.shiftChargeInvDetailsList[ this.formItem.shiftChargeInvDetailsList.length -1].vno
            this.saveLoading = true
            await save(this.formItem).then(data =>{

              this.$notify.success(data.data)
              this.visible = false
              this.$emit('refreshData')
            },err =>{
              that.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: err.message,
                type: 'error',
                position: 'top-right',
                duration: 3000,
                customClass: 'chargeManagementNotify'
              })
            })

          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    edit() {
      let that = this
      let arr = []
      const result =  this.formItem.shiftChargeInvDetailsList.every((item, index) => {
        if(!item.invCode && item.invoiceType == 0) {
          that.$notify.warning("存在发票代码为空，请填写！");
          return false
        }
        if(!item.vno ) {
          that.$notify.warning("存在发票号码为空，请填写！");
          return false
        }

        var invoiceType = (item.invoiceType || '')
        var invCode = (item.invCode || '')
        var vno = (item.vno || '')
        var val = invoiceType + '_' + invCode + '_' + vno
        if (arr.indexOf(val) >= 0) {
          that.$notify.warning('存在发票代码：' + invCode +',发票号码为：' + vno+  '的重复数据，请填写正确！');
          return false
        } else {
          arr.push(val)
        }
        return true;
      })
      this.$refs.form.validate(async valid => {
        if (valid && result) {
          try {
            this.formItem.shiftChargeInvDetailsList[ this.formItem.shiftChargeInvDetailsList.length -1].status = 1
            this.formItem.vno = this.formItem.shiftChargeInvDetailsList[ this.formItem.shiftChargeInvDetailsList.length -1].vno
            this.saveLoading = true
            await update(this.formItem).then(data =>{
              this.$notify.success(data.data)
              this.visible = false
              this.$emit('refreshData')
            },err =>{
              that.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: err.message,
                type: 'error',
                position: 'top-right',
                duration: 3000,
                customClass: 'chargeManagementNotify'
              })
            })
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    opStatusChange(val) {
      switch (val) {
        case '2':
          this.enStationIdShow = true
          this.vehTypeNoShow = true
          this.fullVehPlateShow = true
          break
        case '3':
          this.enStationIdShow = false
          this.vehTypeNoShow = false
          this.fullVehPlateShow = false
          this.formItem.enStationId = ''
          this.formItem.enRoadNo = ''
          this.formItem.enStationNo = ''
          this.formItem.fullVehPlate = ''
          this.formItem.vehTypeNo = ''
          break
        case '4':
          this.enStationIdShow = false
          this.vehTypeNoShow = false
          this.fullVehPlateShow = true
          this.formItem.enStationId = ''
          this.formItem.enRoadNo = ''
          this.formItem.enStationNo = ''
          this.formItem.vehTypeNo = ''
          break
        default:
          this.enStationIdShow = true
          this.vehTypeNoShow = true
          this.fullVehPlateShow = true
      }
      this.title = `缴款信息--` + this.dicFormat('tibms_toll_shiftChargeOpType', val)
    },
    changeExStationId(val, resultObj) {
      this.formItem.exRoadNo = resultObj.roadNo
      this.formItem.exStationNo = resultObj.stationNo
    },
    changeEnStationId(val, resultObj) {
      this.formItem.enRoadNo = resultObj.roadNo
      this.formItem.enStationNo = resultObj.stationNo
    },
    changeOperatorNo(val, resultObj) {
      this.formItem.operatorName = resultObj.realName
    },
    dicFormat(type, value) {
      const dics = this.$dictUtils.getDictList(type)
      let result = value
      dics.forEach(x => { if (x.value === value) { result = x.label; return } })
      return result
    },
    close(){
      this.visible = false

    },
    addInvCodeRecord(){
      this.formItem.shiftChargeInvDetailsList.push({invCode:'',vno:'',status:0,invoiceType:'0'})
    },
    removeInvCodeRecord(index) {
      this.formItem.shiftChargeInvDetailsList.splice(index, 1)
    },
    checkInvCode(index) {
      let invCode = this.formItem.shiftChargeInvDetailsList[index].invCode
      this.formItem.shiftChargeInvDetailsList[index].invCode = invCode.replace(/[^\d]/g,'')
      if(invCode != undefined && invCode.length > 20){
        this.formItem.shiftChargeInvDetailsList[index].invCode = invCode.slice(0, 20)

      } else {
        this.$set(this.formItem.shiftChargeInvDetailsList, index, this.formItem.shiftChargeInvDetailsList[index])
      }
    },
    checkVno(index) {
      let vno = this.formItem.shiftChargeInvDetailsList[index].vno
      this.formItem.shiftChargeInvDetailsList[index].vno = vno.replace(/[^\d]/g,'')
      if(vno != undefined && vno.length > 10){
        this.formItem.shiftChargeInvDetailsList[index].vno = vno.slice(0, 10)

      } else {
        this.$set(this.formItem.shiftChargeInvDetailsList, index, this.formItem.shiftChargeInvDetailsList[index])
      }
    },
    changeInvoiceType(index) {
      this.$set(this.formItem.shiftChargeInvDetailsList,index,this.formItem.shiftChargeInvDetailsList[index])
    }
  }
}
</script>

<style>
  body .chargeManagementNotify {
    width: 350px!important;
  }
</style>

<style scoped>
  #chargeManagementForm .el-date-editor.el-input, #chargeManagementForm .el-date-editor.el-input__inner {
    width: 100%;
  }
  #chargeManagementForm .el-select {
    width: 100%!important;
  }
  #chargeManagementForm table, #chargeManagementForm table tr , #chargeManagementForm table th , #chargeManagementForm table td {
    border:1px solid #edeff1;
  }

  #chargeManagementForm  text-center {
    text-align: center;
  }


</style>
