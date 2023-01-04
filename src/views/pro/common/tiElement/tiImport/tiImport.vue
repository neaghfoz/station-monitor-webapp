<template>
  <el-dialog
    :title="`${title}`"
    :visible.sync="show"
    :width="width"
    @opened="dialogOpened"
    @close="close"
  >
    <el-form label-width="180px">
      <el-row v-if="tplUrl">
        <el-form-item label="模板下载">
          <el-button :size="size" icon="el-icon-download" @click="downloadTpl">上传数据模板下载</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="数据上传">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :action="importUrl"
            :data="extraParams"
            :limit="limit"
            :accept="accept"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="(file, fileList) => { hasData = fileList.length > 0 }"
            :on-remove="(file, fileList) => { hasData = fileList.length > 0 }"
            :on-success="onSuccess"
            :on-error="onError"
            :on-exceed="onExceed"
          >
            <el-button slot="trigger" :size="size" type="primary">选取数据文件</el-button>
            <el-button style="margin-left: 10px;" type="success" :size="size" :disabled="!hasData" :loading="uploadLoading" @click="submitUpload">导入数据</el-button>
          </el-upload>
        </el-form-item>
        <template>
          <slot name="extra_params" :extra-params="extraParams" />
        </template>
      </el-row>
    </el-form>
  </el-dialog>

</template>

<script>

import { getToken } from '@/utils/auth'

export default {
  name: 'TiImport',
  props: {
    uploadUrl: { //  导入上传url
      type: String,
      required: false
    },
    tplUrl: { //  模板下载url
      type: String,
      required: false
    },
    title: { //  导入框主题
      type: String,
      default: '导入',
      required: false
    },
    limit: { // 同时上传最大文件数，默认1
      type: Number,
      default: 1,
      required: false
    },
    visible: { //  导入dialog是否可见
      type: Boolean,
      default: false,
      required: false
    },
    width: {
      type: String,
      default: '40%',
      required: false
    },
    size: {
      type: String,
      default: '',
      required: false
    },
    uploadParams: {
      type: Object,
      default: () => { return {} },
      required: false
    },
    accept: String
  },
  data() {
    return {
      show: this.visible,
      uploadLoading: false,
      hasData: false, // 判断是否有文件上传
      importUrl: !this.uploadUrl ? '' : `${this.uploadUrl}?token=${getToken()}`,
      extraParams: {}
    }
  },
  watch: {
    visible(val) {
      this.show = val || false
    },
    uploadParams: {
      handler(val) {
        if (val) {
          this.extraParams = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    dialogOpened() {
      this.extraParams = this.uploadParams
    },
    submitUpload() { //  手动上传
      // debugger
      this.uploadLoading = true
      this.$refs.uploadRef.submit()
    },
    downloadTpl() { // 下载模板
      window.open(`${this.tplUrl}?token=${getToken()}`)
    },
    beforeUpload(file) {
      // 校验限制类型的文件@20210625
      let result = true
      if(this.accept){
        const fileType = file.name.substring(file.name.lastIndexOf('.'))
        const extension = (this.accept.indexOf(fileType.toLowerCase()) != -1)
        if (!extension) {
          this.$message({
            message: '只允许上传[' + this.accept + ']类型文件',
            type: 'error'
          })
          result = false
          this.uploadLoading = false
        }
      }
      return result
      /*const promise = new Promise((resolve) => {
        this.$nextTick(function() {
          resolve(result)
        })
      })
      return promise // 通过返回一个promis对象解决*/
    },
    onExceed(files, fileList) { //  文件超出最多文件数限制时的提示
      this.$message.warning(`限制选择 ${this.limit} 个文件`)
    },
    onError(e, file, fileList) { // 上传失败处理
      this.uploadLoading = false
      this.$notify.error('导入失败')
    },
    onSuccess(resp, file, filelist) { // 上传成功处理
      console.log(resp, file, filelist)
      this.uploadLoading = false
      this.show = false
      this.$refs.uploadRef.clearFiles()
      this.$emit('onSuccess', resp, file, filelist)
      this.$emit('close', resp, file, filelist)
    },
    close() {
      this.show = false
      this.$emit('close')
    }
  }

}
</script>

<style scoped>

</style>
