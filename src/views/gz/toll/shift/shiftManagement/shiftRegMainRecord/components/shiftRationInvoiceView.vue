<template>
  <vxe-grid
    ref="table"
    border
    resizable
    sync-resize
    auto-resize
    keep-source
    class="vxe-table-element"
    :loading="table.loading"
    :columns="table.columns"
    :data="shiftRegMainRecord.shiftSquadRationInvoiceList"
    :toolbar="table.tableToolbar"
    :editConfig="table.editConfig"
  >
    <template v-slot:tbars>
      <el-button type="primary" icon="el-icon-plus" @click="addManualInvRecord()"/>
    </template>

    <template #operate="{ row }">
      <el-button type="primary" icon="el-icon-minus" @click="removeManualInvRecord(row)"/>
    </template>

    <template #invCodeEdit="{ row,column }" >
      <ti-select
        v-model="row.invCode"
        placeholder="请选择"
        url="/api/v1/rationInvoiceCode/list"
        @change="invCodeChange(row)"
        :isPost="true"
      />
    </template>

    <template #invStartNoEdit="{ row,column }" >
      <el-input type="text"  v-model="row.invStartNo" maxlength="9"
                oninput="value=value.replace(/[^\d]/g, '')" @input="sumManualInvCount(row)"></el-input>
    </template>

    <template #invEndNoEdit="{ row,column }" >
      <el-input type="text"  v-model="row.invEndNo" maxlength="9"
                oninput="value=value.replace(/[^\d]/g, '')" @input="sumManualInvCount(row)"></el-input>
    </template>
  </vxe-grid>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import shiftRulesUtil from '../shiftRulesUtil.js'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import api from '../shiftRegMainRecordApi.js'

export default {
  name: 'toll-shift-shiftRationInvoice',
  components: {TiSelect },
  mixins: [...mixin],
  props: {
    shiftRegMainRecord: {
      type: Object,
      default: null,
      require: true
    }
  },
  data() {
    return {
      rationCodeMap:{},
      table:{
        loading: false,
        tableToolbar: {
          id: 'gz.shift.shiftRationInvoice.toolbar',
          custom: false,
          slots: {
            buttons: 'tbars'
          },
          zoom: false // 最大化按钮
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true,
          showIcon: false,
          autoClear: false
        },
        columns: [
          { field: 'invCode', title: '使用定额发票代码', minWidth: 110, align: 'center',
            editRender: { }, slots: { edit: 'invCodeEdit' }  },
          { field: 'invStartNo', title: '使用定额发票起始号', minWidth: 130, align: 'center' ,
            editRender: { }, slots: { edit: 'invStartNoEdit' } },
          { field: 'invEndNo', title: '使用定额发票终止号', minWidth: 130, align: 'center' ,
            editRender: { }, slots: { edit: 'invEndNoEdit' } },
          { field: 'invCount', title: '使用数量', minWidth: 70, align: 'center' },
          { field: 'invRationMoney', title: '面额', minWidth: 70, align: 'center' },
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'operate' } }
        ]
      }
    }
  },
  watch: {},
  created() {
    this.$nextTick(() => {
      this.initCode()
    })
  },
  methods: {
    async initCode(){
      let that = this
      let codeResp = await api.getRationInvoiceCodeList(null)
      if(codeResp.code == 200 && codeResp.data.length > 0){
        codeResp.data.forEach(function (data, index) {
          that.rationCodeMap[data.invCode] = data.invMoney
        })
      }
    },
    invCodeChange(row){
      let index = null
      this.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, i) {
        if(data._XID === row._XID){
          index = i
          return
        }
      })

      let invCode = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invCode
      let invRationMoney = this.rationCodeMap[invCode]
      this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoney',invRationMoney)

      this.sumInvMoney()
    },
    addManualInvRecord() {

      let that = this
      let canAdd = shiftRulesUtil.checkManualInvoiceCodeTr(that.shiftRegMainRecord, that)
      if(!canAdd){
        return
      }

      if (canAdd) {
        let row ={
          invType: "",
          invCode: "",
          invRationMoney: "",
          invStartNo: "",
          invEndNo: "",
          invCount: 0
        }

        that.shiftRegMainRecord.shiftSquadRationInvoiceList.push(row)
        this.$refs.table.setActiveRow(row)
      }
    },
    sumManualInvCount(row){
      if(null != row){
        let index = null
        this.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, i) {
          if(data._XID === row._XID){
            index = i
            return
          }
        })

        let invStartNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invStartNo
        if(invStartNo != '' && invStartNo.length > 9){
          invStartNo = invStartNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invStartNo',invStartNo)
        }
        let invEndNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invEndNo
        if(invEndNo != '' && invEndNo.length > 9){
          invEndNo = invEndNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invEndNo',invEndNo)
        }
        let invCount = 0
        if (invStartNo != '' && invEndNo != ''){
          invCount =  parseInt(invEndNo) - parseInt(invStartNo) + 1;
        }

        this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invCount',invCount)
      }

      let totalManualInvCount = api.sumInvCount(this.shiftRegMainRecord.shiftSquadRationInvoiceList)
      this.$set(this.shiftRegMainRecord,'rationInvCount',totalManualInvCount)
      this.sumInvMoney()
    },
    removeManualInvRecord(row) {
      let that = this
      const $grid = that.$refs.table
      $grid.remove(row)
      let deleteIndex = null
      $grid.data.forEach(function (data, index) {
        if(data._XID === row._XID){
          deleteIndex = index
          return
        }
      })

      that.shiftRegMainRecord.shiftSquadRationInvoiceList.splice(deleteIndex, 1)
      that.sumManualInvCount(null)
      that.sumInvMoney()
    },
    sumInvMoney(){
      let rationInvTotalMoney = 0
      this.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, i) {
        let invCount = data.invCount
        let invRationMoney = data.invRationMoney
        if(invCount && invRationMoney){
          rationInvTotalMoney += (invRationMoney * invCount)
        }
      })

      this.$set(this.shiftRegMainRecord,'rationInvTotalMoney',rationInvTotalMoney)
    }
  }
}
</script>

<style scoped>

</style>
