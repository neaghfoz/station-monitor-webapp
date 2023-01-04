<template>
  <div>
    <div> <!--      :http-request="uploadFile"-->
      <el-upload
        ref="fileUpload"
        :action="action"
        :headers="upHeaders"
        :data="data"
        :name="name"
        :multiple="multiple"
        :with-credentials="withCredentials"
        :show-file-list="true"
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
        <el-button slot="trigger" icon="ios-cloud-upload-outline">上传附件</el-button>
      </el-upload>
      <div style="margin: 10px 0 10px 0" />

    </div>
  </div>

</template>

<script>

export default {
  name: 'EcFileModal',
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
      default: 'api/v1/system/uploadFile',
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
    /*,
    attrName: {
      type: String,
      default: 'url',
      required: false
    },
    valueField: {
      type: String,
      default: 'url',
      required: false
    }*/
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
        { title: '文件名', minWith: 240, slots: { default: 'fileName' }},
        // { title: '文件大小', field: 'size', minWith: 120, showOverflow: true, slots: { default: 'size' }},
        { title: '状态', field: 'status', minWith: 120, showOverflow: true, slots: { default: 'status' }},
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
        if (this.accept) {
          this.$notify({
            message: `上传文件只能是 ${this.accept} 格式!`,
            type: 'warning'
          })
          return false
        }
      }
      this.$emit('beforeUpload', file, fileList)
      return true
    },
    onSuccess(resp, file, filelist) {
      if (!resp.success) {
        this.onError(resp, file, filelist)
        return
      }
      const data = resp.data
      const respFile = { status: 'success', fileName: data.fileName, url: data.url }
      this.dataList.push(respFile)
      this.$emit('onSuccess', resp, file, filelist)
      this.$notify.success('文件上传成功!')
    },
    onError(resp, file, filelist) {
      this.$notify.error('文件上传失败! ' + resp.message)
    },
    onExceed(files, fileList) {
      console.log(this.accept)
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
    clickDownLoad(row) { // todo
      this.$utils.download({ url: row.url, params: { download: true }})
    },
    preview(row) {
      this.previewVisible = true
      this.previewPic = row
    },
    clickDel(row, rowIndex) {
      // this.dataList = this.dataList.filter(item => item._id !== row._id)
      this.dataList.splice(rowIndex, 1)
    },
    sizeTransferToText(size) {
      if (typeof size === 'number') {
        return size + 'B'
      } else {
        return size
      }
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
    getImgUrl(url) {
      if (url.indexOf('?') > -1) {
        return `${url}&download=true${this.token}`
      }
      return `${url}?download=true${this.token}`
    },
    isPicture(url) {
      if (!url) {
        return false
      }
      const suffix = url.split('?type=').length > 1 && url.split('?type=')[1]
      return suffix === 'jpg' || suffix === 'jpeg' || suffix === 'png'
    },
    confirm() {
      const result = this.dataList.map(item => item.url)
      this.recordValue = result.join()
      // const fileId = result.map(item => item.id).join()
      // const fileName = result.map(item => item.name).join()

      // this.file = { id: fileId, fileName: fileName }

      this.$emit('change', this.recordValue)
      this.ivisible = false
      this.slotProps.visible = false
    },
    close() {
      this.dataList = []
      this.ivisible = false
      this.slotProps.visible = false
    }
  }
}
</script>
