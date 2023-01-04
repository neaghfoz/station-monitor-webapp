<template>
  <vxe-grid
    ref="badTable"
    border
    resizable
    sync-resize
    auto-resize
    keep-source
    class="vxe-table-element"
    :loading="badTable.loading"
    :columns="badTable.columns"
    :data="shiftRegMainRecord.shiftSquadInvalidInvList"
    :toolbar="badTable.tableToolbar"
    :editConfig="badTable.editConfig"
  >
    <template v-slot:badtbars>
      <el-button type="primary" icon="el-icon-plus" @click="addBadInvCodeRecord()"/>
      <el-button type="primary" @click="selectBadInvInList()">流水查找</el-button>
    </template>

    <template #badOperate="{ row }">
      <el-button type="primary" icon="el-icon-minus" @click="removeBadInvCodeRecord(row)"/>
    </template>

    <template #badInvCodeEdit="{ row,column }" >
      <ti-select
        v-model="row.invCode"
        placeholder="请选择"
        url="/api/v1/invoicecode/list"
        :isPost="true"
      />
    </template>

    <template #badInvIDEdit="{ row,column }" >
      <el-input type="text" oninput="value=value.replace(/[^\d]/g, '')" maxlength="8" v-model="row.badInvID"></el-input>
    </template>
  </vxe-grid>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import shiftRulesUtil from '../shiftRulesUtil.js'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import api from '../shiftRegMainRecordApi.js'
import moment from 'moment';

export default {
  name: 'toll-shift-shiftSquadInvalidInv',
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
      badTable:{
        loading: false,
        tableToolbar: {
          id: 'gz.shift.shiftSquadInvalidInv.toolbar',
          custom: false,
          slots: {
            buttons: 'badtbars'
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
          { field: 'invCode', title: '作废机打发票代码', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'badInvCodeEdit' }  },
          { field: 'badInvID', title: '作废机打发票号码', minWidth: 130, align: 'center' ,
            editRender: { }, slots: { edit: 'badInvIDEdit' } },
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'badOperate' } }
        ]
      }
    }
  },
  watch: {},
  methods: {
    //机打废票###########################################################################################################
    addBadInvCodeRecord() {
      // 校验废票
      let canAdd = true
      let that = this
      // 判断机打发票段是否存在记录
      if (that.shiftRegMainRecord.shiftInvDetailList.length == 0) {
        that.$notify.warning("请先登记使用的机打发票票段，再登记废票号！")
        return
      }

      if(that.shiftRegMainRecord.shiftSquadInvalidInvList == null || that.shiftRegMainRecord.shiftSquadInvalidInvList == undefined){
        that.$set(that.shiftRegMainRecord,'shiftSquadInvalidInvList',[])
      }

      canAdd = shiftRulesUtil.checkBadInvoiceCodeTr(that.shiftRegMainRecord, that)
      console.log(canAdd)

      if (canAdd) {
        const list = that.shiftRegMainRecord.shiftSquadInvalidInvList

        let row ={
          invCode: list.length == 0 ? '' : list[list.length - 1].invCode,
          badInvID: "",
          money: "",
          showMoney:0,
          invCount: 1
        }
        that.shiftRegMainRecord.shiftSquadInvalidInvList.push(row);
        that.$set(this.shiftRegMainRecord,'badInvCount',list.length)
        that.$refs.badTable.setActiveRow(row)
      }
    },
    removeBadInvCodeRecord(row) {
      let that = this
      const $grid = that.$refs.badTable
      $grid.remove(row)
      let deleteIndex = null
      $grid.data.forEach(function (data, index) {
        if(data._XID === row._XID){
          deleteIndex = index
          return
        }
      })
      this.shiftRegMainRecord.shiftSquadInvalidInvList.splice(deleteIndex, 1);
      this.$set(this.shiftRegMainRecord,'badInvCount',this.shiftRegMainRecord.shiftSquadInvalidInvList.length)
    },
    async selectBadInvInList(){
      let that = this
      if (null == that.shiftRegMainRecord.shiftInvDetailList || that.shiftRegMainRecord.shiftInvDetailList.length == 0) {
        that.$alert("请先填写机打发票信息！")
        return
      }

      if (that.shiftRegMainRecord.userMarkNo == ''
        || that.shiftRegMainRecord.stationNo == ''
        || that.shiftRegMainRecord.roadNo == ''
        || that.shiftRegMainRecord.laneNo == ''
        || that.shiftRegMainRecord.squadDateStr == ''
        || that.shiftRegMainRecord.squadNo == ''
        || that.shiftRegMainRecord.laneOperatorID == '') {
        that.$alert("请填写基础信息后再次点击！")
        return
      }

      // 下班才进行查询
      if (parseInt(that.shiftRegMainRecord.userMarkNo) == 1) {
        return
      }

      let selectBadInvInListResp = await api.selectBadInvInList({
        roadNo: that.shiftRegMainRecord.roadNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        laneOperatorNo: that.shiftRegMainRecord.laneOperatorNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo
      })

      if (null != selectBadInvInListResp && selectBadInvInListResp.data.length != 0) {
        for(let data of selectBadInvInListResp.data){
          let badInvID = parseInt(data.badInvID)
          let money = parseFloat(data.money / 100.0)

          // 判断是否存在相同的记录
          if (null != that.shiftRegMainRecord.shiftSquadInvalidInvList && that.shiftRegMainRecord.shiftSquadInvalidInvList.length > 0) {
            let isHaveSameValue = false
            for(let data1 of that.shiftRegMainRecord.shiftSquadInvalidInvList){
              if (badInvID == parseInt(data1.badInvID)) {
                isHaveSameValue = true
                return false
              }
            }

            if (isHaveSameValue) {
              return
            }
          }

          let tempObj = {
            invCode: "",
            badInvID: badInvID,
            invCount: 1,
            money: money,
            showMoney:money
          }

          that.shiftRegMainRecord.shiftSquadInvalidInvList.push(tempObj)
        }

        that.$alert("请检查从流水中获取的废票信息！")
        this.$set(that.shiftRegMainRecord,'badInvCount',this.shiftRegMainRecord.shiftSquadInvalidInvList.length)
      } else {
        that.$alert("流水中无相关废票信息！")
      }
    }
  }
}
</script>

<style scoped>

</style>
