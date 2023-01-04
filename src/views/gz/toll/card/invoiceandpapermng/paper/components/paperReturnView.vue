<template>
  <div class="app-container">
    <el-dialog
      title="归还"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px" :rules="rules">
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

          <template #paperStartNoShowEdit="{ row }" >
            {{ row.paperStartShowNo }}
          </template>

          <template #paperEndNoShowEdit="{ row }" >
            {{ row.paperEndShowNo }}
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
import { returns, checkPaper } from '../paperApi'

export default {
  name: 'paperoiceReturnForm',
  components: {
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
        results: []
      },
      table: {
        loading: false,
        tableToolbar: {
          id: 'gz.paperoice.toolbar',
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
          { field: 'paperStartShowNo', title: '领用纸券起始号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'paperStartNoShowEdit' }},
          { field: 'paperEndShowNo', title: '领用纸券终止号', minWidth: 130, align: 'center',
            editRender: { }, slots: { edit: 'paperEndNoShowEdit' }},
          { field: 'paperStartNo', title: '归还纸券起始号', minWidth: 150, align: 'center',
            editRender: { }, slots: { edit: 'paperStartNoEdit' }},
          { field: 'paperEndNo', title: '归还纸券终止号', minWidth: 150, align: 'center',
            editRender: { }, slots: { edit: 'paperEndNoEdit' }},
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
        // 由于纸券号码长度最大14位，未超过JS精度范围，且后台存储为long，转前端为字符串，需parseInt后交给el-input-number
        formRows.push({
          'paperStartShowNo': parseInt(item.paperStartNo),
          'paperEndShowNo': parseInt(item.paperEndNo),
          // 默认起止范围
          'paperStartNo': parseInt(item.paperStartNo),
          'paperEndNo': parseInt(item.paperEndNo)
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
          if (this.formItem.results.length === 0) {
            this.$notify.error('至少归还一条纸券号段记录')
            return
          }
          for (let i = 0; i < this.formItem.results.length; i++) {
            const item = this.formItem.results[i]
            const msg = checkPaper(item.paperStartNo, item.paperEndNo, item)
            if (msg !== '') {
              this.$notify.error(msg)
              return
            }
          }
          try {
            this.saveLoading = true
            await returns(this.formItem)
            this.$notify.success('归还成功')
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
