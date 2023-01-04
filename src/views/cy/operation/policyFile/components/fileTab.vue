<template>
  <div class="app-container">

    <div class="box">
      <vxe-grid
        ref="xTable"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        sync-resize
        auto-resize
        class="vxe-table-element"
        :max-height="600"
        :loading="tableData.loading"
        :columns="tableData.tableColumns"
        :data="tableData.columnsDataList"
        :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
        :pager-config="tableData.page"
        :toolbar="tableToolbar"
        @page-change="handlePageChange"
        @checkbox-all="({ selection }) => { selections = selection }"
        @checkbox-change="({ selection }) => { selections = selection }"
      >
        <template v-slot:operation="{ row }">
           <el-button size="mini" type="text"  :loading="true"  v-show="row.showPreview">转换中</el-button>
           <el-button size="mini" type="text" @click="preView(row)" v-permission="['policyFileMain:preview']" v-show=" !row.showPreview " v-if="row.canPreview">预览</el-button>
          <el-button v-permission="['policyFile:download']" size="mini" type="text" @click="down(row)" >下载</el-button>
        </template>

        <template v-slot:toolbar_buttons>
          <el-button v-permission="['policyFile:download']" type="primary" @click="batchDown()">批量下载</el-button>
        </template>
      </vxe-grid>
    </div>
  </div>

</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { policyFileList, getPreViewUrl } from '../policyFile'
import { getToken } from '@/utils/auth'
export default {
  name: 'OperationPolicyFileDetailsFile',
  components:  { },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      saveLoading: false,
      fileTypeRequired: false,
      fileTypeDisabled: true,
      publishTimeDisabled: true,
      startTimeRequired: false,
      previewLoading: false,
      role: {},
      method: '',
      title: '',
      formItem: {
        title: '',
        fileCatgory: '',
        fileType: '',
        publishStatus: '',
        publisherName: '',
        attriBute: '',
        content: '',
        startTime: '',
        endTime: '',
        policyFileInfoList: []
      },
      fileList: [],
      fileListTemp: [],
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '序号', type: 'index', minWidth: 50, showOverflow: true, align: 'center' },
          { title: '附件名称', field: 'fileName', minWidth: 150, showOverflow: true, align: 'left' },
          { title: '上传时间', field: 'lastUpdateTimeText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作', fixed: 'right', align: 'center', minWidth: 160, slots: { default: 'operation' }}
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }},
      tableToolbar: {
        id: 'modules.policyFile',
        custom: true,
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        slots: {
          buttons: 'toolbar_buttons'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      selections: [],
      downUrl: '/api/v1/policyFile/download',
      batchDownUrl: '/api/v1/policyFile/batchDownload',
      previewUrl: null

    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  watch: {
    // 新窗口打开页面，解决浏览器拦截问题
    jumpUrl() {
        if (this.jumpUrl) {
          window.open(this.jumpUrl, '_blank')
        }
        this.jumpUrl = null
       }
  },
  methods: {
    init() {
      policyFileList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), {mainId: this.$route.query.id}).then(res => {
        res.data.records.forEach((item, index) => {
          item.showPreview = false
        })
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    batchDown() {
      if (this.selections.length === 0) {
        this.$notify.warning('请至少选择一条记录！')
        return
      }

      var ids = ''
      this.selections.forEach((item, index) => {
        if (index === 0) {
          ids = item.id
        } else {
          ids += ',' + item.id
        }
      })
      window.open(this.batchDownUrl + '?token=' + getToken() + '&ids=' + ids + '&mainId=' + this.$route.query.id)
    },
    down(row) {
      window.open(this.downUrl + '?token=' + getToken() + '&id=' + row.id)
    },
    preView(row) {

      row.showPreview = true
      var newWindow = window.open('/js/pdfjs/web/loading.html')
      getPreViewUrl(row.id).then((res) => {
        row.showPreview = false
        this.previewUrl = null
        this.previewUrl = res.data.url
        this.previewLoading = true
        if (res.code === 200) {
          newWindow.location.href = this.previewUrl
        }
        this.previewUrl = null
      })
    }
  }
}
</script>

<style scoped>

</style>
