<template>
  <div>
    <span v-if="readonly">{{ recordValue }}</span>
    <div v-else>
      <template>
        <slot :slotProps="slotProps">
          <el-input
            class="detail-grid-width"
            :value="recordValue"
            :placeholder="$t('policyFile.choisePicture')"
            type="text"
            readonly
            @focus="ivisible = true"
          >
            <el-button slot="append" icon="el-icon-upload" @click="ivisible = true" />
          </el-input>
        </slot>
      </template>

      <el-dialog
        ref="fileModal"
        v-el-drag-dialog
        v-loading="loading"
        :visible.sync="visible"
        :title="$t('policyFile.choisePicture')"
        width="70%"
        append-to-body
        @opened="init()"
        @close="close"
      >
        <!--      :http-request="uploadFile"-->
        <el-upload
          ref="fileUpload"
          :action="action"
          :headers="upHeaders"
          :data="data"
          :name="name"
          :multiple="multiple"
          :with-credentials="withCredentials"
          :show-file-list="false"
          :limit="limit"
          :accept="accept"
          :list-type="listType"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :on-exceed="onExceed"
          :on-progress="onProgress"
          :on-preview="onPreview"
          :on-change="onChange"
          :on-remove="onRemove"
        >
          <el-button slot="trigger" icon="ios-cloud-upload-outline">{{$t('policyFile.choisePicture')}}</el-button>
        </el-upload>
        <div style="margin: 10px 0 10px 0" />
        <vxe-grid
          ref="uploadFileGrid"
          class="vxe-table-element"
          max-height="400"
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          :loading="uploadLoading"
          :data="dataList"
          :columns="columns"
        >
          <template v-slot:fileName="{ row }">
              <img :src="row.url" width="100" height="100" @click="preview(row)">
          </template>
          <template v-slot:operation="{ row, rowIndex }">
            <div class="aclass">
              <el-button type="text" @click="clickDel(row, rowIndex)">删除</el-button>
            </div>
          </template>
        </vxe-grid>

        <div slot="footer">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button type="default" @click="close">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="previewVisible" title="预览">
        <img :src="previewPic && previewPic.url ? previewPic.url : ''" style="width: 100%">
      </el-dialog>
    </div>
  </div>

</template>

<script>

export default {
  name: 'ImageEcFileModal',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Object],
      required: false
    },
    action: { //  上传的地址
      type: String,
      default: '/api/v1/policyFile/uploadImage',
      required: false
    },
    headers: { //  设置上传的请求头部
      type: Object,
      required: false
    },
    multiple: { //  是否支持多选文件
      type: Boolean,
      default: false,
      required: false
    },
    data: { //  上传时附带的额外参数
      type: Object,
      required: false
    },
    name: { //  上传的文件字段名
      type: String,
      default: 'file',
      required: false
    },
    withCredentials: { //  支持发送 cookie 凭证信息
      type: Boolean,
      default: false,
      required: false
    },
    limit: {
      type: Number,
      default: 1000,
      required: false
    },
    drag: { //  是否启用拖拽上传
      type: Boolean,
      default: false,
      required: false
    },
    accept: { //  接受上传的文件类型（thumbnail-mode 模式下此参数无效）
      type: String,
      required: false
    },
    listType: { //  	文件列表的类型,text/picture/picture-card
      type: String,
      default: 'text',
      required: false
    },
    fileList: { //  上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      type: Array,
      required: false
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false
    },
    onProgress: {
      type: Function,
      required: false
    },
    onPreview: {
      type: Function,
      required: false
    },
    onRemove: {
      type: Function,
      required: false
    },
    onChange: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      loading: false,
      ivisible: false,
      uploadLoading: false,
      reloading: false,
      canUpload: false,
      uploadPercentage: '',
      file: { id: '', fileName: '' },
      recordValue: '',
      recordName: '',
      previewVisible: false,
      previewPic: {},
      slotProps: {
        visible: false
      },
      dataList: [],
      columns: [
        { title: '文件', minWith: 240, slots: { default: 'fileName' }, align: 'center'},
        { title: '操作', width: 180, fixed: 'right', align: 'center', slots: { default: 'operation' }}
      ]
    }
  },
  computed: {
    visible() {
      return this.ivisible || this.slotProps.visible
    },
    token() {
      return `&token=${this.$auth.getToken()}`
    },
    upHeaders() {
      return Object.assign({ token: this.$auth.getToken() }, this.headers)
    }
  },
  watch: {
    value: {
      handler(val) {
        this.recordValue = val
        if (val) {
          this.dataList = val.split(',').map(item => { return { url: item, status: 'uploaded' } })
        } else {
          this.dataList = []
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.loading = true
      this.uploadLoading = false
      this.reloading = false
      this.canUpload = false
      this.uploadPercentage = ''
      this.previewVisible = false
      this.previewPic = {}
      this.loading = false
    },
    beforeUpload(file, fileList) {
      const suffix = file.name.substring(file.name.lastIndexOf('.'))
      const acceptList = (this.accept && this.accept.Split(',')) || []
      if (!acceptList.includes(suffix)) {
        this.$notify({
          message: `上传文件只能是 ${this.accept} 格式!`,
          type: 'warning'
        })
        return false
      }

      return true
    },
    onSuccess(resp, file, filelist) {
      if (!resp.success) {
        this.onError(resp, file, filelist)
        return
      }
      const respFile = { status: 'success', url: resp.data.url }
      // data.status = 'success'
      // data._id = data.id
      this.dataList.push(respFile)
      this.$notify.success('文件上传成功!')
    },
    onError(e, file, filelist) {
      // file._id = guid()
      this.$notify.error('文件上传失败!')
    },
    onExceed(files, fileList) {
      this.$notify.warning(`限制选择 ${this.limit} 个文件`)
    },
    uploadFiles() { //  手动上传文件
      const files = this.$refs.fileUpload.uploadFiles
      const readyList = files.filter(item => item.status === 'ready')
      // const reuploadList = files.filter(item => item.status !== 'ready')
      if (readyList.length > 0) {
        this.uploadLoading = true
        this.$refs.fileUpload.submit()
      }
    },
    clickDel(row, rowIndex) {
      this.dataList.splice(rowIndex, 1)
    },
    confirm() {
      const result = this.dataList.map(item => item.url)
      this.recordValue = result.join()
      this.$emit('change', this.recordValue)
      this.ivisible = false
      this.slotProps.visible = false
      this.dataList = []
    },
    close() {
      this.dataList = []
      this.ivisible = false
      this.slotProps.visible = false
    },
    fileUploadStatus(status) {
      if (status === 'ready') {
        return '未上传'
      } else if (status === 'success') {
        return '上传成功'
      } else if (status === 'uploaded') {
        return '已上传'
      } else {
        return '上传失败'
      }
    },
    preview(row) {
      this.previewVisible = true
      this.previewPic = row
    }
  }
}
</script>
