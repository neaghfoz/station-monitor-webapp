<template>
  <div class="app-container">
    <div class="box">
      <!-- <div class="top-txt">您一共完成了<span class="hight-light-txt">0</span>次考试， 平均分为：<span class="hight-light-txt">0</span>分 继续努力吧！</div> -->
      <div class="top-txt"><span class="hight-light-txt">注意：</span>正式考试的重做试卷将作为模拟考试！</div>
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

        <template v-slot:toolbar_buttons />

        <template v-slot:checkWrong="{ row }">
          <el-button v-if="row.errorNums > 0" size="mini" type="warning" @click="checkWrongQuestion(row)">查看错题</el-button>
        </template>
        <template v-slot:analysis="{ row }">
          <el-button size="mini" type="primary" @click="examAnalysis(row)">试题解析</el-button>
        </template>
        <template v-slot:redo="{ row }">
          <el-button size="mini" type="primary" @click="examRedo(row)">重做试卷</el-button>
        </template>

      </vxe-grid>
    </div>

    <!-- 试卷 -->
    <TestPaper ref="saasTestPaperDialog" @handInThePapers="handPapers" />
    <!-- 成绩单 -->
    <SchoolReport ref="saasSchoolReportDialog" @refreshData="checkAnalysis" />
    <!-- 查看错题 或 试题解析 -->
    <Analysis ref="saasAnalysisDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import TestPaper from '@/views/pro/train/test/practice/components/testPaperView'
import SchoolReport from './components/schoolReportView'
import Analysis from '@/views/pro/train/test/practice/components/analysisView'
import { practicingHistory } from '@/views/pro/train/test/practice/practiceViewApi'
import { SimulationexamStart } from './mockExamViewApi'

export default {
  name: 'ProTrainTestExamRecordView',
  components: { TestPaper, SchoolReport, Analysis },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      queryParams: {
        type: 2
      },
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '答题记录', field: 'examName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '答题时间', field: 'startTime', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const time = moment(cellValue).format('YYYY-MM-DD')
            return time
          } },
          { title: '用时', field: 'consumeTime', minWidth: 150, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            if (cellValue) {
              const result = cellValue / 1000
              const h = Math.floor(result / 3600)
              const m = Math.floor((result / 60 % 60))
              const s = Math.floor((result % 60))
              const txt = h ? h + '小时' : ''
              return txt + m + '分钟' + s + '秒'
            } else {
              return '0分钟0秒'
            }
          } },
          { title: '得分', field: 'points', minWidth: 100, showOverflow: true, align: 'center', className: 'highlight-txt', formatter: ({ cellValue, row, column }) => {
            const errorNum = (cellValue / 100).toFixed(2)
            return errorNum
          } },
          { title: '错题数', field: 'errorNums', minWidth: 100, showOverflow: true, align: 'center', className: 'highlight-txt' },
          { title: '查看错题', width: 150, align: 'center', slots: { default: 'checkWrong' }},
          { title: '试题解析', width: 150, align: 'center', slots: { default: 'analysis' }},
          { title: '重做试卷', width: 150, align: 'center', slots: { default: 'redo' }}
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
  activated() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      practicingHistory(Object.assign({}, {
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
    // 查看错题
    checkWrongQuestion(row) {
      this.$refs.saasAnalysisDialog.init('formalwrong', row.typeText, row.id, row.type)
    },
    // 试题解析
    examAnalysis(row) {
      this.$refs.saasAnalysisDialog.init('formalexam', row.typeText, row.id, row.type)
    },
    // 重做试卷,将作为模拟考试
    examRedo(row) {
      SimulationexamStart(row.id, 1).then(res => {
        const lists = res.data
        this.$notify.success('试卷加载成功，正在转入试卷页面')
        this.$refs.saasTestPaperDialog.init(row.id, row.typeText + '重做', lists, {}, 1, 'exam')
      })
    },
    // 交卷，展示结果
    handPapers(id, resultData, name, examInfo) {
      this.$refs.saasSchoolReportDialog.init(id, resultData, name + '重做', examInfo)
    },
    // 显示解析弹框
    checkAnalysis(id, name) {
      this.$refs.saasAnalysisDialog.init('exam', name + '重做', id, 1)
    }
  }
}
</script>

<style scoped>
.top-txt{
  font-size: 14px;
  line-height: 1.8;
}
.hight-light-txt{
  font-weight: bold;
  color: #c09853;
}
.box >>> .highlight-txt{
  color: #B50000;
}
</style>
