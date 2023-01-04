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
          <el-col :span="7">
            <el-form-item
              label="下发终端类型"
              prop="terminalType"
              :rules="[
                { required: true, message:'下发终端类型不能为空', trigger:'change' }
              ]"
            >
              <el-input v-model="formItem.terminalTypeName" type="text"  class="inputReadOnly" readonly/>
              <el-input v-model="formItem.terminalType" type="text" v-show="false"/>
            </el-form-item>
          </el-col>

          <el-col :span="7">
          <el-form-item
            label="所属系统"
            prop="systemId"
            :rules="[
                { required: true, message:'所属系统不能为空', trigger:'change' }
              ]"
          >
            <el-input v-model="formItem.systemName" type="text" class="inputReadOnly" readonly/>
            <el-input v-model="formItem.systemId" type="text" v-show="false"/>
          </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="版本号"
              prop="mainVersionId"
              :rules="[
              ]"
            >
              <el-input v-model="formItem.mainVersionId" type="text" placeholder="版本号" class="inputReadOnly" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="更新说明"
              prop="remark"
              :rules="[
              ]"
            >
              <el-input v-model="formItem.releaseNote" type="textarea" :autosize="{minRows: 5, maxRows: 10}"  readonly/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="附件">
              <TiEcFileModal
                action="/api/v1/version/upload"
                :show-file-list="true"
                :multiple="false"
                accept=".zip,.upd"
                :data="{'belongs': 'version'}"
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
import { allSystems, save } from '../version'
export default {
  name: 'AutoUpdationAddView',
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
        mainVersionId: '',
        releaseNote: ''
      },
      fileList: [],
      uploadingFileList: [],
      systemInfoList: []
    }
  },
  methods: {
    init(method, id) {
      this.method = method
      this.appId = id
      if (method === 'add') {
        this.title = `版本新增`
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
      allSystems().then(res => {
        this.systemInfoList = res.data
      })

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
              this.$emit('refreshDataList')
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
    }
  }
}
</script>

<style scoped>
  .inputReadOnly>>>.el-input__inner {
    background-color: #DCDFE6 !important;
  }
</style>
