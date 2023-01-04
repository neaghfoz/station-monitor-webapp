<template>
  <el-form ref="searchItem" :model="queryParams" :rules="rules" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="数据类型" prop="dataType">
          <ti-select
            ref="dataType"
            v-model="queryParams.dataType"
            dict-type="tibms_com_upload_dataType"
            :multiple="false"
            placeholder="请选择数据类型"
            @change="afterSelDataType"
          />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button icon="el-icon-download" @click="downloadTpl">数据导入模板下载</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="选择文件">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :disabled="!isAllowUpload"
            :action="importUrl"
            :limit="limit"
            :auto-upload="false"
            :on-change="(file, fileList) => { hasData = fileList.length > 0 }"
            :on-remove="(file, fileList) => { hasData = fileList.length > 0 }"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :on-exceed="onExceed"
            :accept="accept"
          >
            <el-button slot="trigger" type="primary" :disabled="!isAllowUpload">从本地选择</el-button>
            <el-button style="margin-left: 10px;" type="success" :disabled="!hasData" :loading="uploadLoading" @click="submitUpload">导入数据</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <div>
          <p style="font-size:14px;color: #D3D3D3;" >
            <template>
              <slot name="remark"></slot>
            </template>
          </p>
        </div>
      </el-row>
      <vxe-grid
        ref="vxe"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        max-height="1000"
        sync-resize
        auto-resize
        keep-source
        class="vxe-table-element"
        :loading="loading"
        :columns="columns"
        :data="tableData.records"
        :toolbar="tableToolbar"
        :pager-config="pageConfig"
        :seq-config="{seqMethod}"
        :start-index="(tableData.current - 1) * tableData.size"
        @page-change="handlePageChange"
      >
        <template v-slot:toolbar_buttons>
          <el-button type="primary" size="small" @click="getData">刷新</el-button>
        </template>
        <template v-slot:operation="{ row }">
          <el-button v-show="showDownloadErrBnt(row)" type="primary" size="small" @click="downloadErrData(row)">下载错误明细</el-button>
        </template>
      </vxe-grid>
  </el-form>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { findList } from './tiUploadNotifyApi'
import { getToken } from '@/utils/auth'
import { download } from 'ecip-web/utils'

export default {
  name: 'TiUploadNotify',
  components: { TiSelect },
  mixins: [...mixin],
  props: {
    maxSize: {
      type: [Number],
      required: false,
      default: 200
    },
    accept: {
      type: [String],
      required: false
    },
    limit: {
      type: [Number],
      required: false,
      default: 1
    }
  },
  data() {
    return {
      saveLoading: false,
      submitLoading: false,
      hasData: false, // 判断是否有文件上传
      isAllowUpload: false, // 判断是否允许上传
      tplUrl: '',
      errorTpl: '',
      importUrl: '',
      queryParams: {
        dataType: ''
      },
      rules: {
        dataType: { type: 'string', required: true, message: '数据类型不能为空' }
      },
      uploadLoading: false,
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableToolbar: {
        id: 'TiUploadNotify-Toolbar',
        custom: true,
        slots: {
          buttons: 'toolbar_buttons'
        },
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      tableData: [],
      logData: [],
      initTableData: [],
      columns: [
        { title: '序号', type: 'seq', align: 'center', showOverflow: true },
        { field: 'dataTypeName', title: '数据类型', align: 'center', minWidth: 100, showOverflow: true },
        { field: 'fileName', title: '文件名称', align: 'center', minWidth: 150, showOverflow: true },
        { field: 'fileSize', title: '文件大小(MB)', align: 'center', minWidth: 80, showOverflow: true },
        { field: 'createDate', title: '文件上传时间', align: 'center', minWidth: 120, showOverflow: true },
        { field: 'createBy.realName', title: '操作人', align: 'center', minWidth: 60, showOverflow: true },
        { field: 'totalRecord', title: '文件记录数', align: 'center', minWidth: 80, showOverflow: true },
        { field: 'successRecord', title: '导入成功记录数', align: 'center', minWidth: 80, showOverflow: true },
        { field: 'failRecord', title: '导入失败记录数', align: 'center', minWidth: 80, showOverflow: true },
        { field: 'failFilePath', title: '操作', align: 'center', minWidth: 80, showOverflow: true, slots: { default: 'operation' }}
      ],
      pageConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'right',
        pageSizes: [5, 10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      userOrg: {

      },
      dialogLoading: false,
      columnMap: {}
    }
  },
  watch: {

  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      const { data } = await findList(Object.assign({}, { size: this.pageConfig.pageSize,
        current: this.pageConfig.currentPage }), this.queryParams)
      this.tableData = data
      this.pageConfig.total = data.total
      this.loading = false
    },
    downloadTpl() { // 下载模板
      this.$refs['searchItem'].validate(async(valid) => {
        if (valid) {
          this.tplUrl = '/api/v1/audit/uploadNotify/downloadTemple/' + this.queryParams.dataType
          await download({ url: this.tplUrl, method: 'get' })
        } else {
          return false
        }
      })
    },
    submitUpload() { //  手动上传
      this.hasData = false
      this.importUrl = '/api/v1/audit/uploadNotify/uploadFile/' + this.queryParams.dataType + '?token=' + getToken()
      const that = this
      setTimeout(function() { that.$refs.uploadRef.submit() }, 200)
    },
    onSuccess(resp, file, filelist) {
      if (!resp.success) {
        this.onError(resp, file, filelist)
        return
      }
      const data = resp.data
      // eslint-disable-next-line no-unused-vars
      const respFile = { status: 'success', url: data }
      this.$notify.success('文件上传成功!')
      this.uploadLoading = false
      this.$refs.uploadRef.clearFiles()
      this.getData()
    },
    onError(e, file, filelist) {
      this.$notify.error(e.message)
      this.$refs.uploadRef.clearFiles()
      this.uploadLoading = false
    },
    handlePageChange({ currentPage, pageSize }) {
      this.pageConfig.currentPage = currentPage
      this.pageConfig.pageSize = pageSize
      this.getData()
    },
    onExceed(files, fileList) {
      this.$notify.warning(`限制选择 ${this.limit} 个文件`)
    },
    seqMethod({ rowIndex }) {
      return `${rowIndex + 1}`
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
        const isOutLimit = file.size / 1024 / 1024 < this.maxSize;
        if (!isOutLimit) {
          this.$notify.warning(`上传文件不能超过${this.maxSize}MB`)
          return false
        }
      }
      return true
    },
    afterSelDataType() {
      this.isAllowUpload = !!this.queryParams.dataType
    },
    async downloadErrData(row) {
      const downloadUrl = '/api/v1/audit/uploadNotify/downloadErrData?id=' + row.id
      await download({ url: downloadUrl, method: 'post' })
    },
    showDownloadErrBnt(row) {
      if (row.failFileName) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>
