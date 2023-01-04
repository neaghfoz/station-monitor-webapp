<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      ref="checkRef"
      width="90%"
    >
      说明： 黑色行表示流水数据正常（{{successCount}}条）   <span style="color:red;">红色</span>行表示流水数与工班数不一致（{{errorCount}}条）   <span style="color:green;">绿色</span>行表示车道有补上传流水（{{repairCount}}条）   <span style="color:#2D70E8;">深蓝色</span>行表示车道流水为0（{{nocntCount}}条）
      <el-table
        :data="checkData.laneSummationCheckLists"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :max-height="400"
        style="width: 100%;">
        <el-table-column
          prop="stationOrg.fullName"
          label="收费站"
          width="120">
        </el-table-column>
        <el-table-column
          prop="laneNo"
          label="车道"
          width="60">
        </el-table-column>
        <el-table-column
          prop="squadDate"
          label="工班日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="squadText"
          label="工班"
          width="90">
        </el-table-column>
        <el-table-column
          prop="laneTypeText"
          label="车道类型"
          width="90">
        </el-table-column>
        <el-table-column
          prop="currentVehCntText"
          label="当前合计记录数"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="currentMoneyText"
          label="当前合计金额"
          align="right">
        </el-table-column>
        <el-table-column
          prop="laneTotalVehCntText"
          label="系统流水记录数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="shiftTotalVehCntText"
          label="工班流水记录数"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneTotalMoneyText"
          label="系统流水金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftTotalMoneyText"
          label="工班通行费"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneCashMoneyText"
          label="系统现金金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftCashMoneyText"
          label="工班现金金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneMobileMoneyText"
          label="系统移动支付金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftMobileMoneyText"
          label="工班移动支付金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneEtcSingleMoneyText"
          label="系统ETC刷卡金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftEtcSingleMoneyText"
          label="工班ETC刷卡金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneEtcPassMoneyText"
          label="系统ETC通行金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftEtcPassMoneyText"
          label="工班ETC通行金额"
          align="right">
        </el-table-column>
        <el-table-column
          prop="laneNoMediaTypeCntText"
          label="系统无通行介质"
          align="right">
        </el-table-column>
        <el-table-column
          prop="shiftNoMediaTypeCntText"
          label="工班无通行介质"
          align="right">
        </el-table-column>
        <el-table-column
          prop="laneRepairVehCntText"
          label="系统补上传流水记录数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="shiftRepairVehCntText"
          label="工班补上传流水记录数"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="laneRepairMoneyText"
          label="系统补上传金额"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="shiftRepairMoneyText"
          label="工班补上传金额"
          align="right">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="!canGen" @click="visible = false">关闭</el-button>
        <el-button v-if="canGen && checkData.checkStatus" type="primary" :loading="saveLoading" @click="gen">确认</el-button>
        <el-button v-if="canGen" @click="cancelGen" :loading="saveLoading" >取消</el-button>
        <el-button v-if="canGen" @click="cancelAllGen" :loading="saveLoading" >全部取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.el-table .error-row {
  color: red;
}

.el-table .success-row {
}

.el-table .repair-row {
  color: green;
}

.el-table .nocnt-row {
  color: #2D70E8;
}
</style>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { checkById, save, checkCharge } from '../laneSummationApi'
import dictUtils from '@ecip/ecip-web/src/utils/dictUtils'

export default {
  name: 'LaneSummationCheckView',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      checkShowMoney: true,
      canGen: false,
      type: '',
      title: '',
      genRows: [],
      genIndex: 0,
      successCount: 0,
      errorCount: 0,
      repairCount: 0,
      nocntCount: 0,
      checkData: {
        checkStatus: false
      },
      orgCode: '',
      squadDate: '',
      squadNo: ''
    }
  },
  computed: {
    showConfig() {
      return {
        checkMoney: dictUtils.getDictLabel('tibms_config', 'toll_shift_lanesummationcheckmoney')
      }
    }
  },
  methods: {
    checkInit: function(tenantId, appId, orgCode, squadDate, squadNo) {
      this.visible = true

      this.$nextTick(async() => {
        this.title = '工班日结算检查'
        this.canGen = false
        this.checkData.checkStatus = false
        try {
          if (this.showConfig.checkMoney === 'false') {
            this.checkShowMoney = false
          } else {
            this.checkShowMoney = true
          }
          this.loading = true
          this.render(tenantId, appId)
          const { data } = await checkById(orgCode, squadDate, squadNo, 2)
          if (data == null) {
            this.$notify.error('数据不存在，无法打开详情')
            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData')
            this.visible = false
          } else {
            // 当有数据时才去加载弹框
            this.checkData = data
            this.calHeader()
          }
        } finally {
          this.loading = false
        }
      })
    },
    genInit: function(tenantId, appId, rows, type) {
      this.visible = true

      this.$nextTick(async() => {
        this.title = '工班日结算生成'
        this.canGen = true
        this.checkData.checkStatus = true
        this.type = type
        try {
          if (this.showConfig.checkMoney === 'false') {
            this.checkShowMoney = false
          } else {
            this.checkShowMoney = true
          }
          this.loading = true
          this.render(tenantId, appId)
          this.genRows = rows
          this.genIndex = -1
          await this.nextShow()
        } finally {
          this.loading = false
        }
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.checkData = []
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (!row.check) {
        return 'error-row'
      } else if (row.currentStatTime !== undefined && (row.currentVehCnt !== row.laneTotalVehCnt || row.currentMoney !== row.laneTotalMoney)) {
        return 'repair-row'
      } else if (row.laneTotalVehCnt === 0) {
        return 'nocnt-row'
      }
      return 'success-row'
    },
    getData: function() {
    },
    nextShow: async function() {
      this.genIndex += 1
      if (this.genIndex === this.genRows.length) {
        this.visible = false
      } else {
        try {
          let progressText = ''
          if (this.type === 'batch') {
            const current = this.genIndex + 1
            progressText = '(' + current + '/' + this.genRows.length + ')'
          } else {
            progressText = ''
          }
          this.title = '工班日结算生成' + progressText
          const current = this.genRows[this.genIndex]
          this.loading = true
          const { data } = await checkById(current.orgCode, current.squadDate, current.squadNo, current.stationRepairStatus)
          // 当有数据时才去加载弹框
          this.checkData = data
          progressText = ''
          if (this.type === 'batch') {
            const current = this.genIndex + 1
            progressText = '(' + current + '/' + this.genRows.length + ')'
          } else {
            progressText = ''
          }
          if (!this.checkData.checkStatus) {
            this.title = '工班日结算生成（数据不一致，请查看）' + progressText
          } else {
            this.title = '工班日结算生成' + progressText
          }

          this.calHeader()
        } finally {
          this.loading = false
        }
      }
    },
    calHeader: function() {
      this.successCount = 0
      this.errorCount = 0
      this.repairCount = 0
      this.nocntCount = 0
      this.checkData.laneSummationCheckLists.map((item) => {
        if (!item.check) {
          this.errorCount += 1
        } else if (item.currentStatTime !== undefined && (item.currentVehCnt !== item.laneTotalVehCnt || item.currentMoney !== item.laneTotalMoney)) {
          this.repairCount += 1
        } else if (item.laneTotalVehCnt === 0) {
          this.nocntCount += 1
        } else {
          this.successCount += 1
        }
      })
    },
    gen: async function() {
      try {
        // 异步生成数据
        this.loading = true
        this.saveLoading = true
        const current = this.genRows[this.genIndex]

        const chargeResp = await checkCharge({
          status : '1',
          beginSquadDateStr : current.squadDate,
          endSquadDateStr : current.squadDate,
          squadNoStr : current.squadNo+''
        })

        if(null != chargeResp && null != chargeResp.data && !chargeResp.data.flag){
          const msg = '当前工班日('+current.squadDate+')存在未提交的缴费记录，请确认是否继续进行日结？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitGen(current)
          })
        }else{
          this.submitGen(current)
        }
      } finally {
        this.loading = false
        this.saveLoading = false
      }
    },
    submitGen : async function(current){
      save({
        orgCode: current.orgCode,
        squadDate: current.squadDate,
        squadNo: current.squadNo,
        recordCnt: this.checkData.shiftTotalVehCnt,
        moneySummation: this.checkData.shiftTotalMoney,
        opType: current.stationRepairStatus
      }).then(res => {
        if(res.data.code != 200) {
          this.$confirm(res.data.msg, '提示', {
            confirmButtonText: '确定',
            type: 'error',
            showCancelButton: false
          })
        } else {
          this.$notify.success(res.data.msg)
          this.$emit('refreshData')
          this.nextShow()
        }
      })
    },
    cancelAllGen: async function() {
      this.visible = false
    },
    cancelGen: async function() {
      this.nextShow()
    }
  }
}
</script>
