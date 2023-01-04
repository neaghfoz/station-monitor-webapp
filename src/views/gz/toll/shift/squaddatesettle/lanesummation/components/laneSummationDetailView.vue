<template>
  <div class="app-container">
    <el-dialog
      title="工班日结算详情"
      :close-on-click-modal="false"
      :visible.sync="visible"
      ref="detailRef"
      width="90%"
    >
      <el-table
        :data="detailData"
        v-loading="loading"
        :max-height="400"
        style="width: 100%;">
        <el-table-column
          prop="roadOrg.fullName"
          label="路段"
          width="120">
        </el-table-column>
        <el-table-column
          prop="stationOrg.fullName"
          label="收费站"
          width="120">
        </el-table-column>
        <el-table-column
          prop="laneNo"
          label="车道号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="laneTypeText"
          label="车道类型"
          width="90">
        </el-table-column>
        <el-table-column
          prop="squadDateText"
          label="工班日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="squadText"
          label="工班"
          width="90">
        </el-table-column>
        <el-table-column
          prop="recordCntText"
          label="流水记录数"
          align="right">
        </el-table-column>
        <el-table-column
          v-if="checkShowMoney"
          prop="moneySummationText"
          label="总金额"
          align="right">
        </el-table-column>
        <el-table-column
          prop="operatorText"
          label="操作员">
        </el-table-column>
        <el-table-column
          prop="statTime"
          label="操作时间">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById } from '../laneSummationApi'
import { cloneDeep } from '@ecip/ecip-web/src/utils'
import dictUtils from '@ecip/ecip-web/src/utils/dictUtils'

export default {
  name: 'LaneSummationDetailView',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      detailData: [],
      ids: '',
      checkShowMoney: true
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
    init: function(tenantId, appId, orgCode, squadDate, squadNo) {
      this.visible = true

      this.$nextTick(async() => {
        try {
          if (this.showConfig.checkMoney === 'false') {
            this.checkShowMoney = false
          } else {
            this.checkShowMoney = true
          }
          this.loading = true
          this.render(tenantId, appId)
          const { data } = await getById(orgCode, squadDate, squadNo)
          if (data == null) {
            this.$notify.error('数据不存在，无法打开详情')
            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData')
            this.visible = false
          } else {
            // 当有数据时才去加载弹框
            cloneDeep(this.detailData, data)
          }
        } finally {
          this.loading = false
        }
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.detailData = []
    },
    getData: function() {
    }
  }
}
</script>

<style scoped>

</style>
