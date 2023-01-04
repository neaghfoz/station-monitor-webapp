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
    :data="shiftRegMainRecord.shiftSquadPaperList"
    :toolbar="table.tableToolbar"
    :editConfig="table.editConfig"
  >
    <template v-slot:tbars>
      <el-button type="primary" icon="el-icon-plus" @click="addPaperRecord()"/>
    </template>

    <template #operate="{ row }">
      <el-button type="primary" icon="el-icon-minus" @click="removePaperRecord(row)"/>
    </template>

    <template #paperStartEdit="{ row,column }" >
      <el-input type="text" name="paperStart" @input="sumPaperCount(row)" oninput="value=value.replace(/[^\d]/g, '')"
                v-model="row.paperStart" min="1" maxlength="14"/>
    </template>

    <template #paperEndEdit="{ row,column }" >
      <el-input type="text" name="paperStart" @input="sumPaperCount(row)" oninput="value=value.replace(/[^\d]/g, '')"
                v-model="row.paperEnd" min="1" maxlength="14"/>
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
  name: 'toll-shift-shiftSquadPaper',
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
          id: 'gz.shift.shiftSquadPaper.toolbar',
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
          { field: 'paperStart', title: '使用纸券起始号', minWidth: 120, align: 'center' ,
            editRender: { }, slots: { edit: 'paperStartEdit' } },
          { field: 'paperEnd', title: '使用纸券终止号', minWidth: 120, align: 'center' ,
            editRender: { }, slots: { edit: 'paperEndEdit' } },
          { field: 'paperCount', title: '使用数量', minWidth: 80, align: 'center' },
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'operate' } }
        ]
      }
    }
  },
  watch: {},
  methods: {
    addPaperRecord(){
      let that = this
      let canAdd = shiftRulesUtil.checkPaperCodeTr(that.shiftRegMainRecord, that)
      if(!canAdd){
        return
      }

      if (canAdd) {
        let row = {
          paperStart: "",
          paperEnd: "",
          paperCount: 0
        }

        that.shiftRegMainRecord.shiftSquadPaperList.push(row)
        this.$refs.table.setActiveRow(row)
      }
    },
    sumPaperCount(row){
      if(null != row){
        let index = null
        this.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, i) {
          if(data._XID === row._XID){
            index = i
            return
          }
        })

        let paperStart = this.shiftRegMainRecord.shiftSquadPaperList[index].paperStart
        let paperEnd = this.shiftRegMainRecord.shiftSquadPaperList[index].paperEnd
        let paperCount = 0
        if (paperStart != '' && paperEnd != ''){
          paperCount =  parseInt(paperEnd) - parseInt(paperStart) + 1;
        }

        this.$set(this.shiftRegMainRecord.shiftSquadPaperList[index],'paperCount',paperCount)
      }

      let totalPaperCount = 0
      this.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, i) {
        totalPaperCount += parseInt(data.paperCount)
      })
      this.$set(this.shiftRegMainRecord,'paperCount',totalPaperCount)
    },

    removePaperRecord(row){
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

      this.shiftRegMainRecord.shiftSquadPaperList.splice(deleteIndex, 1)

      this.sumPaperCount(null)
    }
  }
}
</script>

<style scoped>

</style>
