<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="700px"
      @close="close"
    >
      <div class="search-form">
        <el-form ref="searchForm" :model="queryParams" inline label-width="80px">
          <el-row>
            <el-form-item label="所属考试" prop="examId">
              <ti-select
                v-model="queryParams.examId"
                placeholder="请选择"
                url="/api/v1/train/exam/list"
                :is-post="true"
                :props="{key:'id',value:'id',label:'name'}"
              />
            </el-form-item>
            <el-form-item label="ID" prop="id">
              <el-input
                v-model="queryParams.id"
                type="text"
                placeholder="ID"
                maxlength="11"
                oninput="value=value.replace(/[^\d]/g, '')"
                style="width: 160px"
              />
            </el-form-item>
            <el-form-item label="所属科目" prop="subjectId">
              <ti-select
                v-model="queryParams.subjectId"
                placeholder="请选择"
                url="/api/v1/train/subject/list"
                :is-post="true"
              />
            </el-form-item>
            <el-form-item label="场次名称" prop="name">
              <el-input
                v-model="queryParams.name"
                type="text"
                placeholder="场次名称"
                maxlength="60"
                style="width: 160px"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ti-select
                v-model="queryParams.status"
                placeholder="不限"
                dict-type="tibms_train_exam_examStatus"
              />
            </el-form-item>

            <el-form-item>
              <el-button v-permission="['user:view']" type="primary" @click="submit">查询</el-button>
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
          class="vxe-table-element"
          row-id="id"
          :max-height="400"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          @page-change="handlePageChange"
          @checkbox-all="({ selection }) => {
              selections = selection
              selectChange()
            }"
          @checkbox-change="({ selection }) => {
              selections = selection
              selectChange()
            }"
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
import { findPage } from '@/views/pro/train/design/examnum/examnumViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'VueExamnumChoose',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '场次列表',
      queryParams: {},
      selectExamnumIds: [],
      formItem: {
        id: '',
        name: '',
        examId: '',
        subjectId: '',
        status: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: 'ID', field: 'id', minWidth: 70, showOverflow: true, align: 'center' },
          { title: '场次名称', field: 'name', minWidth: 180, showOverflow: true, align: 'center' },
          { title: '考试科目', field: 'subjectName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属考试', field: 'examName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '状态', field: 'statusName', minWidth: 70, showOverflow: true, align: 'center' }
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
      tableHeight: null,
      selections: []
    }
  },
  mounted() {
  },
  methods: {
    init(examNumIds) {
      if (examNumIds) {
        this.selectExamnumIds = examNumIds.split(',')
      } else {
        this.selectExamnumIds = []
      }
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

        // 根据已选择的用户账号列表和当前查询的列表进行反选
        for (const i in this.tableData.columnsDataList) {
          const item = this.tableData.columnsDataList[i]
          if (this.selectExamnumIds.indexOf(item.id) > -1) {
            this.$refs.xTable.setCheckboxRow([item], true)
          }
        }
      })
    },
    selectChange() {
      for (let i = 0; i < this.tableData.columnsDataList.length; i++) {
        // 反选该页的选择
        const index = this.selectExamnumIds.indexOf(this.tableData.columnsDataList[i].id)
        if (index > -1) {
          this.selectExamnumIds.splice(index, 1)
        }
      }
      for (let i = 0; i < this.selections.length; i++) {
        // 赋值选中的用户账号
        if (this.selectExamnumIds.indexOf(this.selections[i].id) === -1) {
          this.selectExamnumIds.push(this.selections[i].id)
        }
      }
    },
    save() {
      this.$emit('refreshDataList', this.selectExamnumIds.join(','))
      this.visible = false
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getListData()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.queryParams = this.$options.data().queryParams
      this.submit()
    },
    close() {
      this.handleReset()
    }
  }
}
</script>

<style scoped>

</style>
