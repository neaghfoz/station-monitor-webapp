<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'80px'">
        <el-row>
          <el-form-item label="场次名称" prop="name">
            <el-input
              v-model="queryParams.examNumName"
              type="text"
              placeholder="场次名称"
              maxlength="100"
              style="min-width: 208px"
            />
          </el-form-item>

          <el-form-item label="所属考试" prop="examId">
            <ti-select
              v-model="queryParams.examId"
              placeholder="请选择"
              url="/api/v1/train/exam/list"
              :is-post="true"
              :props="{key:'id',value:'id',label:'name'}"
            />
          </el-form-item>

          <el-form-item label="科目" prop="subjectId">
            <ti-select
              v-model="queryParams.subjectId"
              placeholder="请选择"
              url="/api/v1/train/subject/list"
              :is-post="true"
            />
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['train:examnum:user:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="tableHeight">

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
          <template v-slot:endDate="{ row }">
            <div>{{ row.isjoin == 1 ? handleDate(row.endDate) : '未开启' }}</div>
          </template>
          <template v-slot:toolbar_buttons />

          <template v-slot:operation="{ row }">
            <el-button v-if="row.isjoin == 1" v-permission="['train:examnum:user:delete']" size="mini" type="warning" @click="closeExamnum(row.examNumId)">关闭场次</el-button>
            <el-button v-else v-permission="['train:examnum:user:setting']" size="mini" type="primary" @click="openExamnum(row.examNumId)">开启场次</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { findSettingNumPage, settingOperator, deleteByIds } from './personnelViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'ProTrainAllocationPersonnelExamnumView',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
        operatorNo: '',
        name: '',
        examId: '',
        subjectId: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '场次ID', field: 'examNumId', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '场次名称', field: 'examNumName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '所属考试', field: 'examName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '考试科目', field: 'subjectName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '到期时间', field: 'endDate', minWidth: 200, showOverflow: true, align: 'center', slots: { default: 'endDate' }},
          { title: '操作', width: 120, fixed: 'right', align: 'center', slots: { default: 'operation' }}
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
  activated: function() {
    Object.assign(this.queryParams, this.$route.query)
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
      findSettingNumPage(Object.assign({}, {
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
    // 开启场次
    openExamnum(id) {
      settingOperator(Object.assign({}, {
        operatorNo: this.queryParams.operatorNo,
        examNumId: id
      })).then(async(res) => {
        await this.getData()
        this.$notify.success('开启场次成功')
      })
    },
    // 关闭场次
    async closeExamnum(id) {
      await deleteByIds(this.queryParams.operatorNo, id)
      await this.getData()
      this.$notify.success('关闭场次成功')
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
      this.queryParams.operatorNo = this.$route.query.operatorNo
      this.getData()
    },
    handleDate(date) {
      const time = moment(date).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style scoped>

</style>
