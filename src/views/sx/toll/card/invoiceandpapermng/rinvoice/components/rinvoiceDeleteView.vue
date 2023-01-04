<template>
  <div class="app-container">
    <el-dialog
      title="定额发票删除确认"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-table
        :data="invoiceDeleteData"
        height="250"
        style="width: 100%">
        <el-table-column
          prop="seq"
          label="序号"
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
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="invoiceDelete">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { deleteByIds } from '../rinvoiceApi'

export default {
  name: 'RinvoiceDeleteForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      invoiceDeleteData: [],
      ids: ''
    }
  },
  methods: {
    init: function(tenantId, appId, invoices, ids) {
      this.visible = true

      this.$nextTick(async() => {
        this.render(tenantId, appId)

        // 填充数据
        const shows = []
        for (let i = 0; i < invoices.length; i++) {
          const item = invoices[i]
          shows.push({
            seq: i + 1,
            invMoneyText: item.invMoneyText,
            invStartNo: item.invStartNo,
            invEndNo: item.invEndNo
          })
        }

        this.invoiceDeleteData = shows
        this.ids = ids.join(',')
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.invoiceDeleteData = []
    },
    getData: function() {
    },
    invoiceDelete: async function() {
      try {
        this.saveLoading = true
        await deleteByIds(this.ids)
        this.$notify.success('发票删除成功')
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
