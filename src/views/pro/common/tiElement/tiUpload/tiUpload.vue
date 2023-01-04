<!--
 * 文件上传选择框，常见配置
 * action 上传路径
 * bizId 业务数据ID
 * bizModule 业务模块类型，自定义，bizId+bizModule 唯一
 * maxSize 上传文件大小限制，默认是200 单位是M
 * @complete 回调事件

 * listType 展现方式，默认 'text'   // text/picture/picture-card
 -->
<template>
  <div :class="action?'':'tiNotUpload'">
    <el-upload
      ref="upload"
      :action="action"
      :multiple="true"
      :headers = "upHeaders"
      :http-request="appendFile"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :data="data"
      :file-list="fileList"
      :list-type="listType"
      :disabled="disabled"
      :accept="accept"
      :auto-upload="false">
      <el-button v-show="isUploadFileShow" slot="trigger" size="small" type="success">上传文件</el-button>
      <div slot="tip" class="el-upload__tip">{{ tipMsg }}</div>
    </el-upload>
  </div>

</template>
<script>
import request from "@ecip/ecip-web/src/utils/request"

export default {
  name: 'TiUpload',
  props: {
    isUploadFileShow:{
      type:[Boolean],
      default:true,
      required:false
    },
    action: {
      type: [String],
      required: false
    },
    bizId: {
      type: [String],
      required: false
    },
    bizModule: {
      type: [String],
      required: false
    },
    maxSize: {
      type: [Number],
      required: false,
      default: 200
    },
    listType: {
      type: [String],
      required: false,
      default: 'text'   // text/picture/picture-card
    },
    accept: {
      type: [String],
      required: false
    },
    tipMsg: {
      type: [String],
      required: false
    },
    disabled: {
      type: [Boolean],
      required: false,
      default: false
    }
  },
  computed: {
    upHeaders() {
      return { token: this.$auth.getToken(),'content-Type':'multipart/form-data' }
    }
  },
  data() {
    return {
      formData: null,
      data: {},
      fileList: [],
      uploadFiles: [],
      deleteAttachIds: []
    };
  },
  watch: {
    bizId: {
      handler(val,oldVal){
        this.getData()
      },
      immediate: true
    }
  },
  methods: {
    // 获取已上传文件列表
    async getData(){
      this.deleteAttachIds= []
      this.fileList = []
      this.uploadFiles = []
      if(this.bizId){
        let fileList = (await request({
          url: `api/v1/common/attach/${this.bizModule}/${this.bizId}`,
          method: 'get',
          params: {},
          data: {}
        })).data;
        if(!fileList){
          return
        }
        fileList.forEach(x=>{
          x.name = x.fileName
          x.url = x.dowloadUrl + `?preview=true&token=${this.$auth.getToken()}`
        })
        this.fileList = fileList
      }
    },
    // 提交数据
    submit(data){
      this.formData = new FormData()
      this.data = data
      this.uploadFile()
    },
    // 移除文件
    onRemove(file) {
      if(file.id){
        this.deleteAttachIds.push(file.id)
      }
      this.uploadFiles.splice( this.uploadFiles.indexOf(file), 1)
    },
    // 预览文件
    onPreview(file) {
      window.open(file.url)
    },
    // 追加文件
    appendFile(file) {
      this.uploadFiles.push(file)
    },
    // 文件上传
    uploadFile() {
      // 其它表单数据
      if (this.data && Object.keys(this.data).length > 0) {
        Object.keys(this.data).forEach(key => {
          if( this.data[key] || this.data[key] =='0')
          this.formData.append(key, this.data[key])
        })
      }
      // 要删除的附件
      if (this.deleteAttachIds && this.deleteAttachIds.length > 0) {
        this.formData.append('deleteAttachIds', this.deleteAttachIds)
      }

      this.$refs.upload.submit()

      // 校验
      if( this.uploadFiles &&  this.uploadFiles.length>0 ){
        const result = this.uploadFiles.every(file => this.beforeUpload(file.file))
        if(!result){
          this.$emit("complete",false,'校验不通过')
          return
        }
        // 追击上传到文件
        this.uploadFiles.forEach(x=>{
          this.formData.append('files',x.file);
        })
      }


      const httpOption = {
        url: this.action,
        headers: this.upHeaders,
        method: 'post',
        data: this.formData
      }
      if(this.uploadFiles){
        httpOption.onUploadProgress =  (progressEvent) => {
          if(this.uploadFiles){
            this.uploadFiles.forEach(file=>{
              const num = file.loaded / progressEvent.total * 100 | 0 // 百分比
              file.onProgress({ percent: num }) // 进度条
            })
          }
        }
      }
      this.$http(httpOption).then(data => {
        if(data.code == 200){
          this.deleteAttachIds= []
          if(this.uploadFiles && data.data.attaches && data.data.attaches.length>0 ){
            this.uploadFiles.forEach(file=>{
              file.onSuccess(file) // 上传成功(打钩的小图标)
            })
            this.uploadFiles = []
          }
        }
        this.$emit("complete",true,data)
      }).catch(err=>{
        this.$emit("complete",false,err)
      })
    },
    beforeUpload(file) {
      const suffix = file.name.substring(file.name.lastIndexOf('.'))
      const acceptList = (this.accept && this.accept.Split(',')) || []
      if (this.accept && !acceptList.includes(suffix)) {
        this.$notify.warning(`上传文件只能是 ${this.accept} 格式!`)
        return false
      }
      // 大小限制
      if(this.maxSize){
        const isLt100M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt100M) {
          this.$notify.warning(`上传文件不能超过${this.maxSize}MB`)
          return false
        }
      }
      return true
    }
  }
}
</script>
<style>
  .tiNotUpload .el-upload, .tiNotUpload .el-upload__tip{
    display: none !important;
  }
  .tiNotUpload .el-upload-list__item-delete{
    display: none !important;
  }
  .tiNotUpload . el-icon-close-tip{
    display: none !important;
  }
</style>
