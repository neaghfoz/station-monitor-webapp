<template>
  <div class="app-container">
    <el-form ref="searchItem" :model="queryParams" :rules="rules" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="数据类型" prop="dataType">
          <ti-select
            ref="dataType"
            v-model="queryParams.dataType"
            dict-type="tibms_audit_dataImportType"
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
            accept=".zip"
          >
            <el-button slot="trigger" type="primary" :disabled="!isAllowUpload">从本地选择</el-button>
            <el-button style="margin-left: 10px;" type="success" :disabled="!hasData" :loading="uploadLoading" @click="submitUpload">导入数据</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <div>
          <p style="font-size:14px;color: #D3D3D3;">
            注意：压缩包只能压一层，除【收益快报】可支持xls且压缩包内可包含多个数据文件外，其他类型的数据文件仅支持csv格式，请将文件压缩为zip格式后上传，压缩包内不可包含多个数据文件，压缩包不可大于200M；
            【导入文件名格式要求：数据接口名称+数据时间，示例入口通行数据 enPass20210418.zip】
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
        <template v-slot:default>
          <p>数据导入记录</p>
        </template>
        <template v-slot:toolbar_buttons>
          <el-button type="primary" size="small" @click="getData">刷新</el-button>
        </template>
        <template v-slot:operation="{ row }">
          <el-button v-show="showDownloadErrBnt(row)" type="primary" size="small" @click="downloadErrData(row)">下载错误明细</el-button>
        </template>
      </vxe-grid>
    </el-form>

  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'
import { findList } from './originalDataImportApi'
import TiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import { getToken } from '@/utils/auth'
import { download } from 'ecip-web/utils'

export default {
  name: 'audit.original.dataImportView',
  // eslint-disable-next-line vue/no-unused-components
  components: { TiSelect, TiExportExcel, TiImport, TiSysOrg, TiDateRange },
  mixins: [...mixin],
  data() {
    return {
      limit: 1,
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
      dataTypes: [
        { dataType: '1', interfaceName: 'vehIdInfo', interCname: '收费站车牌识别数据' },
        { dataType: '2', interfaceName: 'gantryVehIdInfo', interCname: 'ETC门架车牌识别数据' },
        { dataType: '3', interfaceName: 'enPass', interCname: '入口通行数据' },
        { dataType: '4', interfaceName: 'exPass', interCname: '出口ETC通行数据' },
        { dataType: '5', interfaceName: 'otherTrans', interCname: '出口其他交易数据' },
        { dataType: '6', interfaceName: 'gantryPassData', interCname: 'ETC门架计费扣费交易流水' },
        { dataType: '7', interfaceName: 'breakPassRecord', interCname: '闯关车流水' },
        { dataType: '8', interfaceName: 'otherTransvoid', interCname: '其他交易冲正流水' },
        { dataType: '9', interfaceName: 'earningsExpress', interCname: '收益快报' },
        { dataType: '10', interfaceName: 'passSplitProv', interCname: '省记账拆分明细' }
      ],
      uploadLoading: false,
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableToolbar: {
        id: 'audit.original.dataImport-toolbar',
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
        { field: 'fileSize', title: '文件大小(M)', align: 'center', minWidth: 80, showOverflow: true },
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
    this.tplUrl = '/api/v1/audit/dataImport/downloadTemple/'
    this.importUrl = '/api/v1/audit/dataImport/uploadFile/'
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
          this.tplUrl = '/api/v1/audit/dataImport/downloadTemple/' + this.queryParams.dataType
          await download({ url: this.tplUrl, method: 'get' })
        } else {
          return false
        }
      })
    },
    submitUpload() { //  手动上传
      this.hasData = false
      this.importUrl = '/api/v1/audit/dataImport/uploadFile/' + this.queryParams.dataType + '?token=' + getToken()
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
      const fileName = file.name.substring(0, file.name.lastIndexOf('.'))
      if (fileName.length < 8) {
        this.$message({
          message: '文件名格式不规范:文件名长度小于8',
          type: 'error'
        })
        return false
      }
      const interfaceName = fileName.substring(0, fileName.length - 8)
      const dataTypeFile = this.dataTypes.filter(item => item.interfaceName.toLowerCase() === interfaceName.toLowerCase())
      if (dataTypeFile.length <= 0) {
        this.$message({
          message: '文件名格式不规范:接口名称不正确[' + interfaceName + ']',
          type: 'error'
        })
        return false
      }
      const dataDate = fileName.substring(fileName.length - 8)
      const regex_yyyMMdd = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/
      if (!regex_yyyMMdd.test(dataDate)) {
        this.$message({
          message: '文件名格式不规范:数据时间不正确[' + dataDate + ']',
          type: 'error'
        })
        return false
      }
      if (dataTypeFile[0].dataType !== this.queryParams.dataType) {
        const dataTypeSel = this.dataTypes.filter(item => item.dataType === this.queryParams.dataType)
        this.$message({
          message: '选择的数据类型[' + dataTypeSel[0].interCname + ']与压缩文件对应的数据类型[' + dataTypeFile[0].interCname + ']不一致',
          type: 'error'
        })
        return false
      }

      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = fileType === 'zip'
      const isLt1024M = file.size / 1024 / 1024 <= 200
      if (!extension) {
        this.$message({
          message: '只允许上传zip压缩文件',
          type: 'error'
        })
        return false // 必须加上return false; 才能阻止
      }
      if (!isLt1024M) {
        this.$message({
          message: '压缩包大小不可大于200M',
          type: 'error'
        })
        return false
      }
      return extension || isLt1024M
    },
    afterSelDataType() {
      this.isAllowUpload = !!this.queryParams.dataType
    },
    async downloadErrData(row) {
      // window.open(`/api/v1/audit/dataImport/downloadErrData?id=${row.id}&token=${getToken()}`)
      /* this.$router.push({
          path: '/audit/dataImport/downloadErrData',
          query: {
            id: row.id,
            token: getToken(),
            timestamp: Date.parse(new Date())
          }
        });*/
      // alert(row.id)
      const downloadUrl = '/api/v1/audit/dataImport/downloadErrData?id=' + row.id
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
