<template>
  <div class="app-container">
    <el-dialog
      title="出口站自然日合计数详情"
      :close-on-click-modal="false"
      :visible.sync="visible"
      ref="detailRef"
      width="90%"
    >
      总体详情：
      <el-table
        :data="detailData"
        v-loading="loading"
        :max-height="400"
        style="width: 100%;" border>
        <el-table-column
          prop="id"
          label="出口交易合计数编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="stationOrg.fullName"
          label="收费站"
          width="120">
        </el-table-column>
        <el-table-column
          prop="countDateText"
          label="统计日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="currentRecordCntText"
          label="流水记录数"
          align="right"
          width="60">
        </el-table-column>
        <el-table-column
          prop="etcSuccessCountText"
          label="ETC成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcSuccessFeeText"
          label="ETC成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcFailCountText"
          label="ETC失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcFailFeeText"
          label="ETC失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcSuccessCountText"
          label="CPC成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcSuccessFeeText"
          label="CPC成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcFailCountText"
          label="CPC失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcFailFeeText"
          label="ECPC失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperSuccessCountText"
          label="纸券成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperSuccessFeeText"
          label="纸券成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperFailCountText"
          label="纸券失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperFailFeeText"
          label="纸券失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="noMediaCountText"
          label="无通行介质数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="breakPassCountText"
          label="闯关车数"
          align="right">
        </el-table-column>
      </el-table>

      <br />
      <br />
      <el-table
        :data="classData"
        v-loading="loading"
        :max-height="400" border
        style="width: 100%;">
        <el-table-column
          prop="name"
          label=""
          width="150">
        </el-table-column>
        <el-table-column
          prop="class[0].str"
          label="普通"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[8].str"
          label="军车"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[10].str"
          label="紧急"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[14].str"
          label="车队"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[21].str"
          label="绿通"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[22].str"
          label="联合收割机"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[23].str"
          label="抢险救灾"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[24].str"
          label="集装箱"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[25].str"
          label="大件运输"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[26].str"
          label="应急车"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[27].str"
          label="货车列车或半挂汽车列车"
          align="right"
          width="120">
        </el-table-column>
        <el-table-column
          prop="class[28].str"
          label="J2集装箱"
          align="right"
          width="120">
        </el-table-column>
      </el-table>

      <br />
      <br />
      <el-table
        :data="typeData"
        v-loading="loading"
        :max-height="400" border
        style="width: 100%;">
        <el-table-column
          prop="name"
          label=""
          width="150">
        </el-table-column>
        <el-table-column
          label="客车" align="center">
          <el-table-column
            prop="type[1].str"
            label="一型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[2].str"
            label="二型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[3].str"
            label="三型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[4].str"
            label="四型"
            align="right"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="货车" align="center">
          <el-table-column
            prop="type[11].str"
            label="一型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[12].str"
            label="二型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[13].str"
            label="三型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[14].str"
            label="四型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[15].str"
            label="五型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[16].str"
            label="六型"
            align="right"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="专项作业车" align="center">
          <el-table-column
            prop="type[21].str"
            label="一型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[22].str"
            label="二型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[23].str"
            label="三型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[24].str"
            label="四型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[25].str"
            label="五型"
            align="right"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type[26].str"
            label="六型"
            align="right"
            width="120">
          </el-table-column>
        </el-table-column>
      </el-table>

      <br />
      <br />
      车道详情：
      <el-table
        :data="laneData"
        v-loading="loading"
        :max-height="400" border
        style="width: 100%;">
        <el-table-column
          prop="laneNo"
          label="车道"
          width="50">
        </el-table-column>
        <el-table-column
          prop="laneTypeText"
          label="车道类型"
          width="50">
        </el-table-column>
        <el-table-column
          prop="etcSuccessCountText"
          label="ETC成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcSuccessFeeText"
          label="ETC成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcFailCountText"
          label="ETC失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="etcFailFeeText"
          label="ETC失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcSuccessCountText"
          label="CPC成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcSuccessFeeText"
          label="CPC成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcFailCountText"
          label="CPC失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="cpcFailFeeText"
          label="ECPC失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperSuccessCountText"
          label="纸券成功交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperSuccessFeeText"
          label="纸券成功交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperFailCountText"
          label="纸券失败交易量"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="paperFailFeeText"
          label="纸券失败交易额"
          align="right"
          width="90">
        </el-table-column>
        <el-table-column
          prop="noMediaCountText"
          label="无通行介质数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="breakPassCountText"
          label="闯关车数"
          align="right">
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
import { getById } from '../exNatureCntApi'
import { cloneDeep } from '@ecip/ecip-web/src/utils'

export default {
  name: 'ExNatureCntDetailView',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      detailData: [],
      classData: [],
      typeData: [],
      laneData: []
    }
  },
  methods: {
    init: function(tenantId, appId, id) {
      this.visible = true

      this.$nextTick(async() => {
        try {
          this.loading = true
          this.render(tenantId, appId)
          const { data } = await getById(id)
          if (data == null) {
            this.$notify.error('数据不存在，无法打开详情')
            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData')
            this.visible = false
          } else {
            // 当有数据时才去加载弹框
            this.detailData.push(data)
            this.classData.push({
              name: 'ETC车种处理数',
              class: data.etcClassCountMap
            })
            this.classData.push({
              name: 'CPC车种处理数',
              class: data.cpcClassCountMap
            })
            this.typeData.push({
              name: 'ETC车型处理数',
              type: data.etcTypeCountMap
            })
            this.typeData.push({
              name: 'CPC车型处理数',
              type: data.cpcTypeCountMap
            })
            this.laneData = data.laneCounts
          }
        } finally {
          this.loading = false
        }
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.detailData = []
      this.$data.classData = []
      this.$data.typeData = []
      this.$data.laneData = []
    },
    getData: function() {
    }
  }
}
</script>

<style scoped>

</style>
