<template>
  <div class="app-container">
    <el-dialog
      width="80%"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="150px">
        <el-row :gutter="15">

          <el-col :span="10">
            <el-form-item
              label="批次号"
              prop="versionId"
              :rules="[{ required: true, message:'批次号不能为空', trigger:'change' }]"
            >
              <el-input v-model="formItem.versionId" type="text" placeholder="批次号" class="inputReadOnly" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="更新说明"
              prop="remark"
            >
              <el-input v-model="formItem.releaseNote" type="textarea" :autosize="{minRows: 5, maxRows: 10}"  />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="附件" prop="fileList" :rules="[{required: true, validator: ((rule, value, callback) => { fileListVailtor(rule, value, callback) }), trigger: 'change' }]">
              <TiEcFileModal
                action="/api/v1/version/upload"
                :show-file-list="true"
                :multiple="false"
                accept=".zip,.upd"
                :data="{'belongs': 'config'}"
                :fileList="fileList"
                @onSuccess="uploadSuccess"
                :onRemove="uploadFileRemove"
                @beforeUpload="beforeUpload"
                :on-change="handleChange"
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

import mixin from 'ecip-web/utils/common-mixin'
import TiEcFileModal from '@/views/pro/common/tiElement/TiEcFileModal/TiEcFileModal'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { save } from '../config'
export default {
  name: 'autoUpdation.config.create',
  components: { TiEcFileModal, TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      method: '',
      title: '',
      appId: '',
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      formItem: {
        terminalType: '',
        terminalTypeName: '',
        systemId: '',
        systemName: '',
        versionId: '',
        releaseNote: ''
      },
      fileList: [],
      uploadingFileList: []
    }
  },
  methods: {
    init(method, id) {

      this.method = method
      this.appId = id
      if (method === 'add') {
        this.title = `配置包新增`
      }
      this.formItem = {
        terminalType: '',
        terminalTypeName: '',
        systemId: '',
        systemName: '',
        versionId: '',
        releaseNote: ''
      }
      this.fileList = []
      this.visible = true
      // 清空初始化
      this.$nextTick(async() => {
        this.$refs.form.clearValidate()
      })
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          try {

            save(this.formItem).then(res => {
              this.visible = false
              if (res.code === 200) {
                this.$notify.success(res.message)
              } else {
                this.$notify.error(res.message)
                return
              }
              this.$emit('refreshDataList', this.formItem.versionId)
            })

          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    uploadSuccess(resp, file, filelist) {
      if (resp.code === 200) {
        this.formItem= resp.data
      }

      this.fileList = filelist
      this.$refs.form.validate(async valid => {})
      this.uploadingFileList = this.uploadingFileList.filter((item) => {
        return item.uid !== file.uid;
      })
    },
    uploadFileRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file, fileList) {
      this.uploadingFileList.push(file)
    },
    handleChange(file, fileList) {
      // 当多余一个的时候替换文件
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    fileListVailtor(rule, value, callback) {
      if(this.fileList  && this.fileList .length > 0) {
        callback()
      } else {
        callback(new Error('附件不能为空'))
      }

    }
  }
}
</script>

<style scoped>
  .inputReadOnly>>>.el-input__inner {
    background-color: #dcdfe67a !important;
  }

</style>
