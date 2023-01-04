<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'80px'">
        <el-row>
          <el-form-item label="场次ID" prop="id">
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="场次ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
              style="min-width: 208px"
            />
          </el-form-item>
          <el-form-item label="场次名称" prop="name">
            <el-input
              v-model="queryParams.name"
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
            <!-- ref="choiceExam" -->
          </el-form-item>

          <el-form-item label="所属科目" prop="subjectId">
            <ti-select
              v-model="queryParams.subjectId"
              placeholder="请选择"
              url="/api/v1/train/subject/list"
              :is-post="true"
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
            <el-button v-permission="['train:exam:num:findPage']" type="primary" @click="submit">查询</el-button>
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

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['train:exam:num:save']" type="primary" @click="add()">新增</el-button>
            <el-button v-permission="['train:exam:num:delete']" type="danger" :disabled="!oneMore" @click="remove()">删除</el-button>
          </template>

          <template v-slot:operation="{ row }">
            <el-button v-permission="['train:exam:num:scope']" size="mini" type="primary" @click="examRange(row)">考试范围</el-button>
            <el-button v-permission="['train:exam:num:modify']" size="mini" type="warning" @click="edit(row)">修改</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <Detail ref="saasExamnumDialog" @refreshDataList="getData" />
    <EamRange ref="saasExamnumRangeDialog" @refreshData="getData" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { findPage, deleteByIds } from './examnumViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import Detail from './components/detail'
import EamRange from './components/examRangeView'

export default {
  name: 'ProTrainDesignExamnumExamnumView',
  components: { TiSelect, Detail, EamRange },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
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
          { title: '场次ID', field: 'id', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '场次名称', field: 'name', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '所属考试', field: 'examName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '所属科目', field: 'subjectName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '所属试卷', field: 'testPaperName', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const txt = cellValue || '-'
            return txt
          } },
          { title: '考试时间', field: 'startTestTime', minWidth: 300, showOverflow: false, align: 'center', formatter: ({ cellValue, row, column }) => {
            let timeRange = '-'
            if (cellValue) {
              const starttime = moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
              const endtime = moment(row.endTestTime).format('YYYY-MM-DD HH:mm:ss')
              timeRange = `${starttime} - ${endtime}`
            }
            return timeRange
          } },
          { title: '状态', field: 'statusName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作用户', field: 'operatorNo', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const txt = cellValue ? `[${row.operatorNo}]${row.operatorName}` : ''
            return txt
          } },
          { title: '操作时间', field: 'opTime', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const time = cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
            return time
          } },
          { title: '操作', width: 210, fixed: 'right', align: 'center', slots: { default: 'operation' }}
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
    // $route(to,from){
    //   if(to.path === '/api/v1/train/examnum/findPage') {
    //     Object.assign(this.queryParams, this.$route.query)
    //     this.$nextTick(() => {
    //       this.init()
    //     })
    //   }
    // }
  },
  mounted() {
    this.$watch(this.$refs.xTable.getCheckboxRecords, (newValue, oldValue) => {
      this.selections = newValue
      this.oneMore = this.selections.length > 0
    })
  },
  created() {
    Object.assign(this.queryParams, this.$route.query)
    this.$nextTick(() => {
      this.queryParams.examId = (this.queryParams.examId).toString()
      this.init()
      // this.$refs.choiceExam.init()
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
    examRange(row) {
      // this.$router.push({
      //   path: '/api/v1/train/examnum/settingScope',
      //   query: { id: row.id }
      // })
      this.$refs.saasExamnumRangeDialog.init(row)
    },
    add() {
      this.$refs.saasExamnumDialog.init('add')
    },
    edit(item) {
      const row = item || this.selections[0]
      this.$refs.saasExamnumDialog.init('edit', row)
    },
    remove(id) {
      this.$confirm(`是否删除${id ? '此条记录' : '选中记录'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let deleteIds = []
        if (id) {
          deleteIds.push(id)
        } else {
          deleteIds = this.selections.map(item => item.id)
        }
        await deleteByIds(deleteIds)
        await this.getData()
        this.$notify.success('删除成功')
      }).catch(() => {

      })
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
