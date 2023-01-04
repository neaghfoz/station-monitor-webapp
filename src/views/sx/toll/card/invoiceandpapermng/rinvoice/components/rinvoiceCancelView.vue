<template>
  <div class="app-container">
    <el-dialog
      title="定额发票核销"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-table
        :data="invoiceCancelData"
        height="250"
        style="width: 100%">
        <el-table-column
          prop="seq"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="invTypeText"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="invMoneyText"
          label="发票面额"
          width="180">
        </el-table-column>
        <el-table-column
          prop="invStartNo"
          label="发票起始号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="invEndNo"
          label="发票终止号">
        </el-table-column>
        <el-table-column
          prop="invCount"
          label="发票数量">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="invoiceCancel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { cancel } from '../rinvoiceApi'

export default {
  name: 'RinvoiceCancelForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      invoiceCancelData: [],
      ids: ''
    }
  },
  methods: {
    init: function(tenantId, appId, invoices, ids) {
      this.visible = true

      this.$nextTick(async() => {
        this.render(tenantId, appId)

        // 填充数据
        const invTypeTexts = []
        invoices.map((item) => {
          if (invTypeTexts.indexOf(item.invTypeText) === -1) {
            invTypeTexts.push(item.invTypeText)
          }
        })

        let totalNum = 0

        const shows = []
        for (let j = 0; j < invTypeTexts.length; j++) {
          let count = 0
          const invTypeText = invTypeTexts[j]
          let num = 0
          for (let k = 0; k < invoices.length; k++) {
            const item = invoices[k]
            if (item.invTypeText === invTypeText) {
              count++
              num += item.invCount
              totalNum += item.invCount

              shows.push(this.createShowItem(count, invTypeText, item.invMoneyText, item.invStartNo, item.invEndNo, item.invCount))
            }
          }

          shows.push(this.createShowItem('小计', invTypeText, '--', '--', '--', num))
        }

        shows.push(this.createShowItem('合计', '--', '--', '--', '--', totalNum))

        this.invoiceCancelData = shows
        this.ids = ids.join(',')
      })
    },
    createShowItem: function(seq, invTypeText, invMoneyText, invStartNo, invEndNo, invCount) {
      return {
        seq: seq,
        invTypeText: invTypeText,
        invMoneyText: invMoneyText,
        invStartNo: invStartNo,
        invEndNo: invEndNo,
        invCount: invCount
      }
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.invoiceCancelData = []
    },
    getData: function() {
    },
    invoiceCancel: async function() {
      try {
        this.saveLoading = true
        await cancel(this.ids)
        this.$notify.success('发票核销成功')
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
