<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form v-show="detailShow" ref="form" v-loading="loading" :model="formItem" label-width="100px">
        <el-form-item
          label="发票代码"
          prop="invCode"
          :rules="[
            {required: true, message:'发票代码不能为空', trigger:'blur'}
          ]"
        >
          <el-input
            type="text"
            v-model="formItem.invCode"
            maxlength="20"
            @input="changeInvCodeInput"
            placeholder="发票代码"/>
        </el-form-item>
        <el-form-item
          label="面额（元）"
          prop="invMoney"
          :rules="[
            {required: true, message:'面额不能为空', trigger:'blur'}
          ]"
        >
          <ti-select v-model="formItem.invMoney" dict-type="tibms_toll_rationInvoiceMoney"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save, update } from '../rationInvoiceCodeViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'gz.toll.card.setting.rationInvoiceCode.rationInvoiceCodeDetailForm',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      cardUnitTypeDisabled: false,
      detailShow: false,
      method: '',
      title: '',
      formItem: {
        invCode: '',
        invMoney:''
      }
    }
  },
  methods: {
    init: function(method, tenantId, appId, row) {
      this.method = method
      this.visible = true
      this.detailShow = false
      if (method === 'add') {
        this.title = `新增定额发票代码`
        this.$nextTick(async() => {
          this.render(tenantId, appId)
        })
      }
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.detailShow = true
      this.$refs.form.clearValidate()
      this.$data.cardUnitTypeDisabled = false
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    changeInvCodeInput: function() {
      // 控制发票代码的整型输入
      this.formItem.invCode = this.formItem.invCode.replace(/[^\d]/g, '')
    },
    getData: function() {
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            await save(this.formItem)

            this.$notify.success('保存成功')
            this.$emit('refreshData')
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
