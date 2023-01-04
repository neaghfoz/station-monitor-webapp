<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="60%">
      <el-form
        ref="form"
        v-loading="loading"
        class="form-full"
        :model="formItem"
        label-width="120px"
        label-suffix=" : "
      >
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="车牌" prop="vehiclePlate" :rules="[]">
              <el-input v-model="formItem.vehiclePlate" type="text" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌颜色" prop="vehicleColor" :rules="[]">
              <el-input v-model="formItem.vehicleColorDesc" type="text" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="流水车型" prop="vehicleType" :rules="[]">
              <el-input v-model="formItem.vehicleTypeDesc" type="text" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="精确车型"
              prop="confirmVehicleType"
              :rules="[{ required: true, message: '请选择', trigger: 'blur' }]"
            >
              <ti-select
                v-model="formItem.confirmVehicleType"
                dict-type="tibms_com_vehicleType"
                placeholder="选择精确车型"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { findByPrimaryKey, updateConfirmVehType } from "@/views/pro/audit/vehicleBase/api/vehicleInfoBaseApi";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";

export default {
  name: 'audit.vehiclebase.VehicleInfoBaseForm',
  components: { TiSelect },
  data () {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '',
      record: {},
      formItem: {
        confirmVehicleType: ''
      }
    }
  },
  methods: {
    async init (method, record) {
      Object.assign(this.$data, this.$options.data())

      this.method = method
      this.record = record
      if (method === 'add') {
        this.title = `新建`
      } else if (method === 'edit') {
        this.title = '确认精确车型'
      } else if (method === 'view') {
        this.title = '查看'
      }
      this.visible = true
      this.loading = false
      await this.$nextTick()
      this.$refs.form.clearValidate()
      if (method === 'edit' || method === 'view') { // 修改或者查看
        this.loading = true
        //const { data } = await findByPrimaryKey(record.hgSeq)
        this.formItem = Object.assign({}, this.formItem, record)
        this.loading = false
      }
    },
    save () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            this.saveLoading = true
            if (this.method === 'edit') {
              if (!this.record.hgSeq) {
                this.$message.error('请选择车辆信息')
                return
              }
              if (this.record.confirmVehicleType
                && this.record.confirmVehicleType === this.formItem.confirmVehicleType) {
                this.$message.error('精确车型未发生改变，无需保存')
                return
              }
              this.formItem.hgSeq = this.record.hgSeq
              const { data } = await updateConfirmVehType(this.formItem)
              this.$notify.success('保存成功')
              this.$emit('updateRowData', data)
            } else {
              await save(this.formItem)
              this.$notify.success('保存成功')
              this.$emit('refreshData')
            }

            this.visible = false
          } finally {
            this.saveLoading = false
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
