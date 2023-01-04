<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading">
        <el-upload
          ref="upload"
          accept=".pdf,.mp4,.flv,.swf"
          action
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="filelist"
          :http-request="UploadSubmit"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf/mp4/flv/swf文件，且不超过200m</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :loading="saveLoading" @click="submitUpload">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'pro.train.study.attach.uploadView',
  components: {},
  mixins: [],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '',
      filelist: [],
      filelist_temp: [] // 仅为判断是否已经上传文件使用
    }
  },
  methods: {
    init: async function() {
      this.title = `附件上传`
      this.visible = true
      this.loading = false
      this.filelist = []
      this.filelist_temp = []
    },
    // 附件移除
    handleRemove(file, filelist) {
      filelist.splice(0, 1)
      this.filelist_temp = filelist
      this.$forceUpdate()
    },
    // 附件变更、上传成功，上传失败
    handleChange(file, filelist) {
      if (file.status === 'ready') {
        // 附件变更
        if (filelist.length > 1) {
          filelist.splice(0, 1)
        }
        this.filelist_temp = filelist
        this.$forceUpdate()
      }
    },
    UploadSubmit(param) {
      this.saveLoading = true
      const file = param.file

      const FileExt = file.name.replace(/.+\./, '')
      const isLt2M = file.size / 1024 / 1024 < 200
      if (['pdf', 'mp4', 'flv', 'swf'].indexOf(FileExt.toLowerCase()) === -1) {
        this.saveLoading = false
        this.$message.error('上传附件只能是 PDF/mp4/flv/swf 格式!')
      } else if (!isLt2M) {
        this.saveLoading = false
        this.$message.error('上传附件大小不能超过 200MB!')
      } else {
        const file_form = new FormData() // 获取上传表单（文件）
        file_form.append('file', file)
        axios({
          url: '/api/v1/train/attach/fileUpload',
          method: 'post',
          headers: {
            token: getToken()
          },
          data: file_form
        }).then((res) => {
          this.saveLoading = false
          if (res.data.code !== 200) {
            this.$message.error(res.data.message)
          } else {
            this.$message.success('附件上传成功！')
            this.$emit('refreshData')
            this.detailVisible = false
            this.visible = false
          }
        }).catch(e => {
          this.saveLoading = false
          this.$message.error('附件上传失败！')
        })
      }
    },
    // 上传到服务器
    submitUpload() {
      if (this.filelist_temp.length > 0) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          type: 'info',
          message: '请先上传附件！'
        })
      }
    }
  }
}
</script>

