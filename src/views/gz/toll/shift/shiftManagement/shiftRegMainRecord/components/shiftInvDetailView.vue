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
    :data="shiftRegMainRecord.shiftInvDetailList"
    :toolbar="table.tableToolbar"
    :editConfig="table.editConfig"
  >
    <template v-slot:tbars>
      <el-button type="primary" icon="el-icon-plus" @click="addInvCodeRecord()"/>
      <el-button type="primary" @click="selectInvCodeInList(false)">流水查找</el-button>
    </template>

    <template #operate="{ row }">
      <el-button type="primary" icon="el-icon-minus" @click="removeInvCodeRecord(row)"/>
    </template>

    <template #invCodeEdit="{ row,column }" >
      <ti-select
        v-model="row.invCode"
        placeholder="请选择"
        url="/api/v1/invoicecode/list"
        :isPost="true"
      />
    </template>

    <template #invStartNoEdit="{ row,column }" >
      <el-input type="text" @input="sumShiftInvDetailInvCount(row)" oninput="value=value.replace(/[^\d]/g, '')"
                @blur="confirmInvCount(row)" v-model="row.invStartNo" maxlength="8"></el-input>
    </template>

    <template #invEndNoEdit="{ row,column }" >
      <el-input type="text" @input="sumShiftInvDetailInvCount(row)" oninput="value=value.replace(/[^\d]/g, '')"
                @blur="confirmInvCount(row)" v-model="row.invEndNo" maxlength="8"></el-input>
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
  name: 'toll-shift-shiftInvDetailView',
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
      table:{
        loading: false,
        tableToolbar: {
          id: 'gz.shift.shiftInvDetail.toolbar',
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
          { field: 'invCode', title: '使用机打发票代码', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invCodeEdit' }  },
          { field: 'invStartNo', title: '使用机打发票起始号', minWidth: 130, align: 'center' ,
            editRender: { }, slots: { edit: 'invStartNoEdit' } },
          { field: 'invEndNo', title: '使用机打发票终止号', minWidth: 130, align: 'center' ,
            editRender: { }, slots: { edit: 'invEndNoEdit' }  },
          { field: 'invCount', title: '使用数量', minWidth: 80, align: 'center' },
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'operate' } }
        ]
      }
    }
  },
  watch: {},
  methods: {
    // 机打发票##########################################################################################################
    addInvCodeRecord(){
      let that = this
      if(that.shiftRegMainRecord.shiftInvDetailList == null || that.shiftRegMainRecord.shiftInvDetailList == undefined){
        that.$set(that.shiftRegMainRecord,'shiftInvDetailList',[])
      }

      let canAdd = shiftRulesUtil.checkInvoiceCodeTr(that.shiftRegMainRecord, that)
      if(!canAdd){
        return
      }

      let list = that.shiftRegMainRecord.shiftInvDetailList
      let row ={
        invCode: list.length == 0 ? '' : list[list.length - 1].invCode,
        invStartNo: "",
        invEndNo: "",
        invCount: ""
      }
      this.shiftRegMainRecord.shiftInvDetailList.push(row);
      this.$refs.table.setActiveRow(row)
    },
    async selectInvCodeInList(isInit){
      let that = this
      if (that.shiftRegMainRecord.userMarkNo == ''
        || that.shiftRegMainRecord.stationNo == ''
        || that.shiftRegMainRecord.roadNo == ''
        || that.shiftRegMainRecord.laneNo == ''
        || that.shiftRegMainRecord.squadDateStr == ''
        || that.shiftRegMainRecord.squadNo == ''
        || that.shiftRegMainRecord.laneOperatorNo == '') {
        that.$alert("请填写基础信息后再次点击！")
        return
      }

      // 下班才进行查询
      if (parseInt(that.shiftRegMainRecord.userMarkNo) == 1) {
        return
      }

      if(that.shiftRegMainRecord.shiftInvDetailList.length > 0){
        that.$confirm('当前操作将会清空目前所登记数据，重新从流水中关联机打发票号段，是否继续？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(async () => {
          that.shiftRegMainRecord.shiftInvDetailList = []
          await that.findInvCodeInList()
        })
      }else{
        await that.findInvCodeInList()
      }
    },

    async findInvCodeInList(){
      let that = this
      let selectInvCodeInListResp = await api.selectInvCodeInList({
        roadNo: that.shiftRegMainRecord.roadNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        laneOperatorNo: that.shiftRegMainRecord.laneOperatorNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo
      })


      if (null != selectInvCodeInListResp && selectInvCodeInListResp.data.length != 0) {
        for(let data of selectInvCodeInListResp.data){
          let invStartID = parseInt(data.invCodeStart)
          let invEndID = parseInt(data.invCodeEnd)
          if (invStartID > invEndID) {
            that.$alert("从工班日志查出的机打发票票段起始号大于终止号，请手工录入！")
            return false
          }

          // 判断是否存在相同的记录
          /*if (null != that.shiftRegMainRecord.shiftInvDetailList && that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
            let isHaveSameValue = false
            for(let data1 of that.shiftRegMainRecord.shiftInvDetailList){
              if (invStartID == parseInt(data1.invStartNo) && invEndID == parseInt(data1.invEndNo)) {
                isHaveSameValue = true
                return false
              }
            }

            if (isHaveSameValue) {
              return
            }
          }*/

          let tempObj = {
            invCode: "",
            invStartNo: invStartID,
            invEndNo: invEndID
          };

          // 获取发票代码
          let selectInvCodeResp = await api.selectInvCodeByList({
            invStartNo: invStartID,
            invEndNo: invEndID,
            stationNo: that.shiftRegMainRecord.stationNo
          });

          if (null != selectInvCodeResp && selectInvCodeResp.data.flag) {
            tempObj.invCode = selectInvCodeResp.data.invCode;
          }

          that.shiftRegMainRecord.shiftInvDetailList.push(tempObj);
          that.sumShiftInvDetailInvCount(that.shiftRegMainRecord.shiftInvDetailList.length - 1);
        }

        that.$alert("请检查从流水中获取的机打发票信息！",'提示',{
          confirmButtonText: "确定",
          callback: action => {
            that.selectBadInvInList();
          }
        })

      } else {
        if(!isInit){
          that.$alert("流水中无相关机打发票信息！")
        }
      }
    },

    removeInvCodeRecord(row) {
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

      // 清除废票
      if (that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invStartNo != ''
        && that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invEndNo != ''
        && that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invCode != '') {
        let invStartNo = parseInt(that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invStartNo)
        let invEndNo = parseInt(that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invEndNo)
        let invCode = that.shiftRegMainRecord.shiftInvDetailList[deleteIndex].invCode
        if (that.shiftRegMainRecord.shiftSquadInvalidInvList.length > 0) {
          let i = that.shiftRegMainRecord.shiftSquadInvalidInvList.length
          while (i--) {
            let badInvCode = that.shiftRegMainRecord.shiftSquadInvalidInvList[i].invCode
            let badInvID = parseInt(that.shiftRegMainRecord.shiftSquadInvalidInvList[i].badInvID)
            if (that.shiftRegMainRecord.shiftSquadInvalidInvList[i].invCode != ''
              && that.shiftRegMainRecord.shiftSquadInvalidInvList[i].badInvID != '') {
              if (invCode == badInvCode && badInvID >= invStartNo && badInvID <= invEndNo) {
                that.shiftRegMainRecord.shiftSquadInvalidInvList.splice(i, 1);
                this.$set(this.shiftRegMainRecord,'badInvCount',that.shiftRegMainRecord.shiftSquadInvalidInvList.length)
              }
            }
          }
        }
      }

      this.shiftRegMainRecord.shiftInvDetailList.splice(deleteIndex, 1);
      this.sumShiftInvDetailInvCount(null);
    },
    sumShiftInvDetailInvCount(row){
      if(null != row){
        let index = null
        this.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, i) {
          if(data._XID === row._XID){
            index = i
            return
          }
        })

        let invStartNo = this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo
        if(invStartNo != '' && invStartNo.length > 9){
          invStartNo = invStartNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invStartNo',invStartNo)
        }
        let invEndNo = this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo
        if(invEndNo != '' && invEndNo.length > 9){
          invEndNo = invEndNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invEndNo',invEndNo)
        }
        let invCount = 0
        if (invStartNo != '' && invEndNo != ''){
          invCount =  parseInt(invEndNo) - parseInt(invStartNo) + 1;
        }

        this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invCount',invCount)
      }
      let invCount = api.sumInvCount(this.shiftRegMainRecord.shiftInvDetailList)
      this.$set(this.shiftRegMainRecord,'invCount',invCount)
    },
    confirmInvCount(row) {
      let index = null
      this.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, i) {
        if(data._XID === row._XID){
          index = i
          return
        }
      })

      let invStartNo = this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo
      let invEndNo = this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo
      if (invStartNo != '' && invEndNo != ''
        && parseInt(invStartNo) >= 0 && parseInt(invEndNo) >= parseInt(invStartNo)
        && parseInt(invEndNo) - parseInt(invStartNo) >= 2000) {
        this.$notify.warning("本次登记使用发票超过2000张，请确认是否误填！");
      }
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
