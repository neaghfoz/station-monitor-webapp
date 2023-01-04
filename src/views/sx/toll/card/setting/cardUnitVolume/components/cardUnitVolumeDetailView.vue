<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form v-show="detailShow" ref="form" v-loading="loading" :model="formItem" label-width="100px">
        <el-form-item
          label="卡单元类型"
          prop="cardUnitType"
          :rules="[
            {required: true, message:'卡单元类型不能为空', trigger:'blur'}
          ]"
        >
          <ti-select
            v-bind:disabled="cardUnitTypeDisabled"
            v-model="formItem.cardUnitType"
            placeholder="请选择"
            dict-type="tibms_toll_cardUnitType"
          />
        </el-form-item>

        <el-form-item
          label="最大容量"
          prop="volume"
          :rules="[
            {required: true, message:'最大容量不能为空', trigger:'blur'}
          ]"
        >
          <el-input type="text" v-model="formItem.volume" maxlength="9" @input="changeVolumeInput" placeholder="最大容量"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save, update, getById } from '../cardUnitVolumeViewApi'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'CardUnitVolumeDetailForm',
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
        cardUnitType: '',
        volume: ''
      }
    }
  },
  methods: {
    init: function(method, tenantId, appId, row) {
      this.method = method
      this.visible = true
      this.detailShow = false
      if (method === 'add') {
        this.title = `新增卡单元容量设置`
        this.$nextTick(async() => {
          this.render(tenantId, appId)
        })
      } else if (method === 'edit') {
        this.title = `编辑卡单元容量设置`

        this.$nextTick(async() => {
          try {
            const { data } = await getById(row.cardUnitType)
            if (data == null) {
              this.$notify.error('数据不存在或已被删除，无法修改')
              // 找不到数据的情况下，自动重新加载列表
              this.$emit('refreshData')
              this.visible = false
            } else {
              this.render(tenantId, appId)

              // 当有数据时才去加载弹框
              cloneDeep(this.formItem, data)
              this.formItem.cardUnitType = data.cardUnitType + ''
              // 同时设置cardUnitVolume不可编辑
              this.$data.cardUnitTypeDisabled = true
            }
          } finally {
            // this.loading = false
          }
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
    changeVolumeInput: function() {
      // 控制最大容量的整型输入
      const pattern = /^[1-9][0-9]*$/ // 正整数的正则表达式
      // 不符合正整数时
      if (!pattern.test(this.formItem.volume)) {
        // input 框绑定的内容为空
        this.formItem.volume = ''
      }
    },
    getData: function() {
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            // eslint-disable-next-line no-empty
            if (this.method === 'edit') {
              await update(this.formItem)
            } else {
              await save(this.formItem)
            }

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
