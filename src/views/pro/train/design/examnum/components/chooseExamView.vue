<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <div class="search-form">
        <el-form ref="searchForm" :model="queryParams" inline :label-width="'150px'">
          <el-row>
            <el-form-item label="试卷名称" prop="name">
              <el-input
                v-model="queryParams.name"
                type="text"
                placeholder="试卷名称"
                maxlength="50"
                style="width: 199px"
              />
            </el-form-item>
            <el-form-item
              label="组卷模式"
            >
              <ti-select
                v-model="queryParams.combine"
                placeholder="请选择"
                dict-type="tibms_train_test_combine"
              />
            </el-form-item>
            <el-form-item>
              <el-button v-permission="['train:testpaper:findPage']" type="primary" @click="submit">查询</el-button>
              <el-button type="default" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!-- <el-card shadow="never" :max-height="this.tableHeight"> -->
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
          row-id="id"
          class="vxe-table-element"
          :max-height="400"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          :radio-config="radioConfig"
          @page-change="handlePageChange"
          @radio-change="handleRadioChange"
        >

          <template v-slot:toolbar_buttons />
        </vxe-grid>
      </div>
      <!-- </el-card> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from '@/views/pro/train/testmng/testpaper/testPaperViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'VueExamnumChooseExam',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '试卷列表',
      initSubject: null,
      queryParams: {
        name: ''
      },
      formItem: {
        ids: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '', type: 'radio', field: 'id', width: 40, fixed: 'left', align: 'center' },
          { title: '试卷ID', field: 'id', minWidth: 80, align: 'center' },
          { title: '试卷名称', field: 'name', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '组卷模式', field: 'combineText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '组卷用户', field: 'lastModifyOperatorText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '组卷时间', field: 'lastModifyTimeText', minWidth: 150, showOverflow: true, align: 'center' }
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
          storage: false
        },
        slots: {
          buttons: 'toolbar_buttons'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      radioConfig: {
        reserve: true
      },
      tableHeight: null,
      selections: [],
      radioItem: {},
      selectionsRadio: '',
      selectionsExamName: ''
    }
  },
  methods: {
    init(subject) {
      this.initSubject = subject
      Object.assign(this.queryParams, this.initSubject)
      this.selectionsRadio = (this.initSubject.testPaperId).toString()
      this.selectionsExamName = this.initSubject.name
      this.visible = true
      this.submit()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getListData()
    },
    async getListData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false

        const _item = this.tableData.columnsDataList.find(item => this.selectionsRadio === item.id)
        if (_item) {
          this.$refs.xTable.setRadioRow(_item)
        } else {
          this.$refs.xTable.clearRadioRow()
          this.$refs.xTable.clearRadioReserve()
        }
      })
    },
    save() {
      this.$emit('testPaperData', this.selectionsRadio, this.selectionsExamName, this.radioItem)
      this.visible = false
    },
    handleRadioChange({ row }) {
      this.selectionsRadio = row.id
      this.selectionsExamName = row.name
      this.radioItem = row
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getListData()
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
      this.queryParams.subjectId = this.initSubject.subjectId
    }
  }
}
</script>

<style scoped>

</style>
