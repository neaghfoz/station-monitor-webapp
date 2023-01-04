<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="文件类型" prop="fileType">
            <ti-select
              v-model="queryParams.fileType"
              placeholder="请选择"
              dict-type="tibms_train_attach_type"
            />
          </el-form-item>
          <el-form-item label="文件名称" prop="fileName">
            <el-input
              v-model="queryParams.fileName"
              type="text"
              placeholder="文件名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:attach:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="this.tableHeight">

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
            <el-button type="warning" @click="preview(row)" size="mini" v-permission="['train:attach:preview']">预览</el-button>
            <el-button type="primary" @click="downLoad(row)" size="mini" v-permission="['train:attach:downLoad']">下载</el-button>
          </template>

          <template v-slot:toolbar_buttons>
            <el-button type="primary" @click="upload()" v-permission="['train:attach:upload']">附件上传</el-button>
            <el-button :disabled="selections.length == 0" type="danger" @click="del()" v-permission="['train:attach:delete']">删除</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <uploadView ref="createDialog" @refreshData="getData"/>
    <preView ref="preDialog" />
    <videoView ref="videoDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, deleteByIds } from './attachViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import uploadView from './components/uploadView'
import { download } from 'ecip-web/utils'
import preView from './components/preView'
import videoView from './components/videoView'

export default {
  name: 'pro.train.study.attach.attachView',
  components: { TiSelect, uploadView, preView, videoView },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
        fileType: '',
        fileName: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '文件名称', field: 'fileName', minWidth: 300, showOverflow: true, align: 'center' },
          { title: '文件类型', field: 'fileTypeText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '上传用户', field: 'operatorText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '上传时间', field: 'createTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', width: 160, fixed: 'right', align: 'center', slots: { default: 'operation' }}
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }
      },
      tableToolbar: {
        id: 'modules.paramQuery',
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
      tableHeight: null,
      selections: []
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.getData()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      this.selections = []
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
    },
    async downLoad(row) {
      this.downLoading = true
      await download({ url: '/api/v1/train/attach/downLoad', method: 'post', data: row })
      this.downLoading = false
    },
    async preview(row) {
      if (row.fileType === 4) {
        this.$refs.preDialog.init(row.id)
      } else if (row.fileType === 3) {
        this.$refs.videoDialog.init(row.fileName, row.id)
      }
    },
    async upload() {
      this.$refs.createDialog.init()
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      const ids = this.selections.map((x) => x.id).join(',')
      const names = this.selections.map((x) => x.fileName).join(',')

      this.$confirm(`是否删除附件:` + names, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(ids).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
