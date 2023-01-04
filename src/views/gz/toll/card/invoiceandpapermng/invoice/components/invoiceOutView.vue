<template>
  <div class="app-container">
    <el-dialog
      title="调出"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" :rules="rules">
        <el-form-item
          label="目的地"
          prop="outSysOrg.id"
        >
          <ti-sys-org url="api/v1/common/sysOrg/orgListAll" :clearable="true" ref="sysOrg" v-model="formItem.outSysOrg.id"/>
        </el-form-item>
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
          :data="formItem.results"
          :toolbar="table.tableToolbar"
          :editConfig="table.editConfig"
        >

          <template #operate="{ row }">
            <el-button type="primary" icon="el-icon-minus" @click="removeRecord(row)"/>
          </template>

          <template #invStartNoShowEdit="{ row }" >
            {{ row.invStartShowNo }}
          </template>

          <template #invEndNoShowEdit="{ row }" >
            {{ row.invEndShowNo }}
          </template>

          <template #invCodeEdit="{ row }" >
            {{ row.invCode }}
          </template>

          <template #invStartNoEdit="{ row }" >
            <el-input
              v-model="row.invStartNo"
              maxlength="8"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </template>

          <template #invEndNoEdit="{ row }" >
            <el-input
              v-model="row.invEndNo"
              maxlength="8"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </template>
        </vxe-grid>
      </el-form>
      <el-row style="text-align: center; padding-top: 20px;">
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="submit">提交</el-button>
        <el-button @click="visible = false">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { out, checkExistsInv } from '../invoiceApi'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'

export default {
  name: 'InvoiceUseForm',
  components: {
    tiSysOrg
  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      detailVisible: false,
      loading: false,
      saveLoading: false,
      method: '',
      formItem: {
        results: [],
        outSysOrg: {
          id: ''
        }
      },
      table: {
        loading: false,
        tableToolbar: {
          id: 'gz.invoice.toolbar',
          custom: false,
          slots: {
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
          { field: 'invCode', title: '发票代码', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invCodeEdit' }},
          { field: 'invStartShowNo', title: '库存发票起始号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invStartNoShowEdit' }},
          { field: 'invEndShowNo', title: '库存发票终止号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invEndNoShowEdit' }},
          { field: 'invStartNo', title: '调出发票起始号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invStartNoEdit' }},
          { field: 'invEndNo', title: '调出发票终止号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'invEndNoEdit' }},
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'operate' }}
        ]
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, rows) {
      this.visible = true
      this.detailVisible = false
      this.$nextTick(async() => {
        this.render(tenantId, appId, rows)
      })
    },
    render: function(tenantId, appId, rows) {
      // 清空初始化
      this.$refs.form.clearValidate()
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId

      const formRows = []
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i]
        formRows.push({
          'invStartShowNo': item.invStartNo,
          'invEndShowNo': item.invEndNo,
          'invCode': item.invCode,
          // 默认起止范围
          'invStartNo': item.invStartNo,
          'invEndNo': item.invEndNo
        })
      }
      this.formItem.results = formRows
    },
    removeRecord(row) {
      const that = this
      if (that.formItem.results.length === 1) {
        this.$notify.error('最后一条记录不可删除')
        return
      }
      const $grid = that.$refs.table
      $grid.remove(row)
      let deleteIndex = null
      $grid.data.forEach(function(data, index) {
        if (data._XID === row._XID) {
          deleteIndex = index
          return
        }
      })

      that.formItem.results.splice(deleteIndex, 1)
    },
    getData: function() {
    },
    submit: async function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.formItem.outSysOrg.id === '') {
            this.$notify.error('请选择目的地')
            return
          }
          if (this.formItem.results.length === 0) {
            this.$notify.error('至少领用一条发票号段记录')
            return
          }
          for (let i = 0; i < this.formItem.results.length; i++) {
            const item = this.formItem.results[i]
            const msg = checkExistsInv(item.invStartNo, item.invEndNo, item)
            if (msg !== '') {
              this.$notify.error(msg)
              return
            }
          }
          try {
            this.saveLoading = true
            await out(this.formItem)
            this.$notify.success('调出成功')
            this.$emit('refreshData')
            this.detailVisible = false
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
