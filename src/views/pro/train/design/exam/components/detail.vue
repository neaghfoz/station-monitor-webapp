<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" status-icon :model="formItem" label-width="120px">
        <el-form-item
          label="考试名称"
          prop="name"
          :rules="[
            {required: true, message:'考试名称不能为空', trigger:'blur'},
            {max: 100, message:'考试名称长度应在1-100字之间', trigger:'blur'}
          ]"
        >
          <el-input v-model="formItem.name" type="text" placeholder="考试名称" />
        </el-form-item>

        <el-form-item v-if="method != 'edit'" label="考试模式" prop="type" :rules="[{required: true, message:'请选择', trigger:'change'}]">
          <ec-radio-group v-model="formItem.type" dict-type="tibms_train_exam_mode" />
        </el-form-item>

        <el-form-item v-if="method != 'edit'" label="考试缩略图" prop="thumb">
          <TiEcImgModal
            action="/api/v1/train/richtext/uploadImage"
            :show-file-list="false"
            :multiple="false"
            accept=".jpg,.jpeg,.png"
            :data="{'belongs': 'version'}"
            :value-field="formItem.thumb"
            :file-list="fileList"
            :on-remove="uploadFileRemove"
            @onSuccess="uploadSuccess"
            @beforeUpload="beforeUpload"
          />
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
import { getById, save, update } from './../examViewApi'
import TiEcImgModal from '@/views/pro/common/tiElement/tiEcImgModal/TiEcImgModal'

export default {
  name: 'VueExamSaasTenantForm',
  components: { TiEcImgModal },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '',
      tenant: {},
      formItem: {
        name: '',
        type: '1',
        thumb: ''
      },
      fileList: [],
      uploadingFileList: []
    }
  },
  methods: {
    init(method, row) {
      this.method = method
      this.tenant = row
      if (method === 'add') {
        this.title = `新增考试`
      } else if (method === 'edit') {
        this.title = `修改考试-${row.name}-信息`
      } else if (method === 'view') {
        this.title = `查看考试-${row.name}-信息`
      }
      this.visible = true
      this.loading = false
      this.$nextTick(async() => {
        this.$refs.form.clearValidate()
        Object.assign(this.$data.formItem, this.$options.data().formItem)
        if (method === 'edit' || method === 'view') { // 修改或者查看
          try {
            this.loading = true
            const { data } = await getById(row.id)
            Object.assign(this.formItem, data)
          } finally {
            this.loading = false
          }
        }
      })
    },
    // async validateName(rule, value, callback) {
    //   const { data } = await checkTenantName((this.tenant && this.tenant.id) || '', value)
    //   if (data.valid) {
    //     callback()
    //   } else {
    //     callback(new Error('场次已存在'))
    //   }
    // },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            if (this.method === 'edit') {
              await update(this.formItem.id, this.formItem)
            } else {
              await save(this.formItem)
            }
            this.$notify.success('保存成功')
            this.$emit('refreshDataList')
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    uploadSuccess(resp, file, filelist) {
      console.log(resp, file, filelist)
      if (resp.code === 200) {
        this.formItem.thumb = resp.data.url
      }

      this.fileList = filelist
      this.uploadingFileList = this.uploadingFileList.filter((item) => {
        return item.uid !== file.uid
      })
    },
    uploadFileRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file, fileList) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传考试缩略图只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      this.uploadingFileList.push(file)
    }
  }
}
</script>

