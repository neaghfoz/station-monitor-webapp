<template>
  <div class="app-container">
    <el-dialog
      title="机打发票详情"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="90%"
    >
      <el-row>
        <el-col>发票代码：{{invCode}}&nbsp;&nbsp;发票起始号：{{invStartNo}}&nbsp;&nbsp;发票终止号：{{invEndNo}}&nbsp;&nbsp;发票数量：{{invCount}}</el-col>
      </el-row>
      <el-table
        :data="invoiceDetailData"
        height="300"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="seq"
          label="序号"
          width="50">
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
        <el-table-column
          prop="locationText"
          label="当前位置">
        </el-table-column>
        <el-table-column
          prop="sysOrg.fullName"
          label="所在机构">
        </el-table-column>
        <el-table-column
          prop="laneNo"
          label="车道">
        </el-table-column>
        <el-table-column
          prop="xoperatorText"
          label="经办人">
        </el-table-column>
        <el-table-column
          prop="tagText"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="opTime"
          label="操作时间">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
       <!-- <el-button v-show="showCancel" v-permission="['invoice:cancel']" type="primary" :loading="saveLoading" @click="cancel">发票核销</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById, cancel } from '../invoiceApi'
import { cloneDeep } from 'ecip-web/utils'

export default {
  name: 'InvoiceCancelForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      invCode: '',
      invStartNo: '',
      invEndNo: '',
      invCount: '',
      invoiceDetailData: [],
      id: '',
      showCancel: false
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
            this.$notify.error('数据不存在或已被删除，无法修改')
            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData')
            this.visible = false
          } else {
            const detailsShow = []
            this.invCode = data.invCode
            this.invStartNo = data.invStartNo
            this.invEndNo = data.invEndNo
            this.invCount = data.invCount
            this.id = data.id
            if (data.tagNo === 1) {
              this.showCancel = true
            } else {
              this.showCancel = false
            }
            data.invoiceSaves.map((item, index) => {
              detailsShow.push(Object.assign({}, item, { seq: index + 1 }))
            })
            // 当有数据时才去加载弹框
            cloneDeep(this.invoiceDetailData, detailsShow)
          }
        } finally {
          this.loading = false
        }
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.invoiceDetailData = []
    },
    getData: function() {
    },
    async cancel() {
      const msg = '确认核销发票，发票代码' + this.invCode + '，发票段' + this.invStartNo + '-' + this.invEndNo + '？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          this.saveLoading = true
          await cancel(this.id)
          this.$notify.success('发票核销成功')
          this.$emit('refreshData')
          this.visible = false
        } finally {
          this.saveLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
