<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="120px">
        <el-form-item
          label="所属科目/章节"
          prop="selectParentIds"
          :rules="[{required: true, message:'所属科目/章节不能为空', trigger:'blur'}]"
        >
          <el-cascader
            v-model="formItem.selectParentIds"
            :disabled="edited"
            placeholder="请选择"
            :options="parentTree"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="知识点名称"
          prop="name"
          :rules="[
            {required: true, message:'知识点名称不能为空', trigger:'blur'},
            {max: 100, message:'知识点名称长度应在1-100字之间', trigger:'blur'}]"
        >
          <el-input
            v-model="formItem.name"
            type="text"
            placeholder="知识点名称"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById, save, update, getParentTree } from '../knowledgeViewApi'

export default {
  name: 'pro.train.design.knowledge.knowledgeCreateView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      edited: false,
      loading: false,
      saveLoading: false,
      parentTree: [],
      title: '',
      id: '',
      formItem: {
        selectParentIds: [],
        name: '',
        subjectId: '',
        sectionId: ''
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, id) {
      this.visible = true
      this.id = ''
      if (id === '') {
        this.title = `新增知识点`
        this.edited = false
        this.$nextTick(async() => {
          try {
            this.loading = true
            this.render(tenantId, appId)

            const res = await getParentTree({})
            this.parentTree = res.data
          } finally {
            this.loading = false
          }
        })
      } else {
        this.id = id
        this.title = `修改知识点`
        this.edited = true

        this.$nextTick(async() => {
          try {
            this.loading = true
            this.formItem.selectParentIds = []
            const res = await getParentTree({})
            this.parentTree = res.data

            const { data } = await getById(id)
            this.render(tenantId, appId)

            // 当有数据时才去加载弹框
            this.formItem = data
            const selectParentIds = []
            selectParentIds.push(data.subjectId + '')
            selectParentIds.push(data.parentId)
            this.formItem.selectParentIds = selectParentIds
          } finally {
            this.loading = false
          }
        })
      }
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$refs.form.clearValidate()
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    getData: function() {
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            const parentIds = this.formItem.selectParentIds[1].split('_')
            this.formItem.subjectId = parentIds[0]
            this.formItem.sectionId = parentIds[1]

            if (this.id === '') {
              await save(this.formItem)
              this.$notify.success('保存知识点成功')
            } else {
              await update(this.formItem)
              this.$notify.success('更新知识点成功')
            }

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
