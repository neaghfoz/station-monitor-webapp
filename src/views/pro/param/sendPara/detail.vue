<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px">
        <el-form-item
          label="序号"
          prop="recNo"
          :rules="[
            {required: true, message:'序号不能为空', trigger:'blur'}
          ]"
        >
          <el-input type="text" v-model="formItem.recNo" placeholder="序号" />
        </el-form-item>
        <el-form-item
          label="参数表名"
          prop="tableName"
          :rules="[
            {required: true, message:'参数表名不能为空', trigger:'blur'}
          ]"
        >
          <el-input type="text" v-model="formItem.tableName" placeholder="参数表名" />
        </el-form-item>
        <el-form-item
          label="表中文名"
          prop="tableShowName"
          :rules="[
            {required: true, message:'表中文名不能为空', trigger:'blur'},
          ]"
        >
          <el-input v-model="formItem.tableShowName" type="text" placeholder="表中文名" />
        </el-form-item>
        <el-form-item
          label="文件名"
          prop="recvFileName"
          :rules="[
            {required: true, message:'文件名不能为空', trigger:'blur'}
          ]"
        >
          <el-input v-model="formItem.recvFileName" type="text" placeholder="文件名" />
        </el-form-item>
        <el-form-item
          label="参数表类型"
          prop="tableClass"
          :rules="[
          ]"
        >
          <ti-select
            v-model="formItem.tableClass"
            placeholder="请选择"
            dict-type="tibms_param_tableClass"
          />
        </el-form-item>

        <el-form-item
          label="使用状态"
          prop="isUsed"
          :rules="[
            {required: true, message:'使用状态不能为空', trigger:'blur'}
          ]"
        >
          <ec-radio-group v-model="formItem.isUsed" dict-type="tibms_sendpara_useStatus" />
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
import { save, getById, update } from './sendPara'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
export default {
  name: 'VueRoleSysrRoleForm',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      role: {},
      method: '',
      title: '',
      formItem: {
        recNo: '',
        tableName: '',
        tableShowName: '',
        recvFileName: '',
        tableClass: '',
        isUsed: '1'
      }
    }
  },
  methods: {
    init(method, tenantId, appId, row) {
      this.method = method
      this.role = row
      if (method === 'add') {
        this.title = `新增下发表设置`
      } else if (method === 'edit') {
        this.title = `编辑下发表设置`
      } else if (method === 'view') {
        this.title = `查看-${row.roleName}`
      }
      this.visible = true
      this.loading = false
      this.$nextTick(async() => {
        // 清空初始化
        this.$refs.form.clearValidate()
        Object.assign(this.$data.formItem, this.$options.data().formItem)
        this.formItem.tenanId = tenantId
        this.formItem.appId = appId
        if (method === 'edit' || method === 'view') { // 修改或者查看
          try {
            this.loading = true
            const { data } = await getById(row.id)
            cloneDeep(this.formItem, data)
            if (data.tableClass) {
              this.formItem.tableClass = data.tableClass + ''
            }
          } finally {
            this.loading = false
          }
        }
      })
    },
    getData() {
    },
    save() {
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
