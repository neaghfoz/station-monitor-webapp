<template>
  <div class="app-container">
    <el-dialog
      title="发票核销"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-table
        :data="cancelData"
        height="250"
        style="width: 100%">
        <el-table-column
          prop="seq"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="stationOrgText"
          label="所属站"
          width="180">
        </el-table-column>
        <el-table-column
          prop="paperStartNo"
          label="纸券起始号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="paperEndNo"
          label="纸券终止号">
        </el-table-column>
        <el-table-column
          prop="paperCount"
          label="纸券数量">
        </el-table-column>
        <el-table-column
          prop="tagText"
          label="状态">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="paperCancel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { cancel } from '../paperApi'
import Long from '../long'

export default {
  name: 'PaperCancelForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      cancelData: [],
      ids: ''
    }
  },
  methods: {
    init: function(tenantId, appId, papers, ids) {
      this.visible = true

      this.$nextTick(async() => {
        this.render(tenantId, appId)

        // 填充数据
        const codes = []
        papers.map((item) => {
          if (codes.indexOf(item.paperCode) === -1) {
            codes.push(item.paperCode)
          }
        })

        let totalNum = Long.fromString('0')
        const shows = []
        for (let j = 0; j < codes.length; j++) {
          let count = 0
          const code = codes[j]
          let num = Long.fromString('0')
          for (let k = 0; k < papers.length; k++) {
            const item = papers[k]
            if (item.paperCode === code) {
              count++
              num = num.add(item.paperCount)
              totalNum = totalNum.add(item.paperCount)
              const paperCountLong = Long.fromString(item.paperCount)
              shows.push(this.createShowItem(count, code, item.stationOrgText, item.paperStartNo, item.paperEndNo, paperCountLong.toString(), item.tagText))
            }
          }

          shows.push(this.createShowItem('小计', code, '--', '--', '--', num.toString(), '--'))
        }

        shows.push(this.createShowItem('合计', '--', '--', '--', '--', totalNum.toString(), '--'))

        this.cancelData = shows
        console.log(this.cancelData)
        this.ids = ids.join(',')
      })
    },
    createShowItem: function(seq, paperCode, stationOrgText, paperStartNo, paperEndNo, paperCount, tagText) {
      return {
        seq: seq,
        paperCode: paperCode,
        stationOrgText: stationOrgText,
        paperStartNo: paperStartNo,
        paperEndNo: paperEndNo,
        paperCount: paperCount,
        tagText: tagText
      }
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.invoiceCancelData = []
    },
    getData: function() {
    },
    paperCancel: async function() {
      try {
        this.saveLoading = true
        await cancel(this.ids)
        this.$notify.success('纸券核销成功')
        this.$emit('refreshData')
        this.visible = false
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
