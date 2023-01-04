<template>
  <div class="app-container">
    <el-dialog
      title="调入"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" :rules="rules">
        <el-form-item
          label="来源地"
          prop="inSysOrg.id"
        >
          <ti-sys-org url="api/v1/common/sysOrg/orgListAll" :clearable="true" ref="sysOrg" v-model="formItem.inSysOrg.id"/>
          <span style="margin-left: 20px;color:red;">*</span>无来源地时则不用填
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
          <template v-slot:tbars>
            <el-button type="primary" icon="el-icon-plus" @click="addRecord()"/>
          </template>

          <template #operate="{ row }">
            <el-button type="primary" icon="el-icon-minus" @click="removeRecord(row)"/>
          </template>

          <template #paperStartNoEdit="{ row }" >
            <el-input
              v-model="row.paperStartNo"
              maxlength="14"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </template>

          <template #paperEndNoEdit="{ row }" >
            <el-input
              v-model="row.paperEndNo"
              maxlength="14"
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
import { save, checkPaper } from '../paperApi'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'

export default {
  name: 'paperoiceSaveDetailForm',
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
        inSysOrg: {
          id: ''
        },
        results: []
      },
      table: {
        loading: false,
        tableToolbar: {
          id: 'gz.paperoice.toolbar',
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
          { field: 'paperStartNo', title: '调入纸券起始号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'paperStartNoEdit' }},
          { field: 'paperEndNo', title: '调入纸券终止号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'paperEndNoEdit' }},
          { title: '操作', width: 60, fixed: 'right', align: 'center', slots: { default: 'operate' }}
        ]
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, row) {
      this.visible = true
      this.detailVisible = false
      this.$nextTick(async() => {
        this.render(tenantId, appId)
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$refs.form.clearValidate()
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    addRecord() {
      const that = this
      const list = that.formItem.results
      if (list.length === 500) {
        this.$notify.error('调入纪录数不能超过500条')
        return
      }
      const row = {
        paperStartNo: '',
        paperEndNo: '',
        paperCode: '2000-01',
        paperVehType: '0'
      }

      list.push(row)
      this.$refs.table.setActiveRow(row)
    },
    removeRecord(row) {
      const that = this
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
          if (this.formItem.results.length === 0) {
            this.$notify.error('至少调入一条纸券号段记录')
            return
          }
          for (let i = 0; i < this.formItem.results.length; i++) {
            const item = this.formItem.results[i]
            const msg = checkPaper(item.paperStartNo, item.paperEndNo)
            if (msg !== '') {
              this.$notify.error(msg)
              return
            }
          }
          try {
            this.saveLoading = true
            await save(this.formItem)
            this.$notify.success('调入成功')
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
