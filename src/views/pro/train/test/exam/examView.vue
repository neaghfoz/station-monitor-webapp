<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card v-permission="['train:exam:realexam']" shadow="never" class="item-card">
          <el-image
            class="col-item-img"
            :src="testImg2"
            fit="contain"
          />
          <el-button class="card-btn" type="primary" @click="checkItemView(1)">正式考试</el-button>
        </el-card>
      </el-col>
    </el-row>

    <h4 class="modular-title">考试记录</h4>
    <div class="box">
      <div class="top-txt"><span class="hight-light-txt">注意：</span>您一共完成{{ tableData.page.total }}次考试。正式考试记录点击 [ 重做试卷 ] 将另存为模拟考试记录！</div>
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
          <el-button type="primary" @click="submit">刷新</el-button>
        </template>

        <template v-slot:checkWrong="{ row }">
          <el-button v-if="row.errorNums > 0 && row.questionType != 2" size="mini" type="warning" @click="checkWrongQuestion(row)">查看错题</el-button>
        </template>
        <template v-slot:analysis="{ row }">
          <el-button v-if="row.questionType != 2" size="mini" type="primary" @click="examAnalysis(row)">试题解析</el-button>
        </template>
        <template v-slot:redo="{ row }">
          <el-button size="mini" type="primary" @click="examRedo(row)">重做试卷</el-button>
        </template>
        <template v-slot:ranking="{ row }">
          <div v-if="row.ranking"><span class="highlight-txt">{{ row.ranking }}</span> / {{ row.totalPersonNum }}</div>
          <div v-else>-</div>
        </template>

      </vxe-grid>
    </div>

    <!-- 试卷 -->
    <TestPaper ref="saasTestPaperDialog" @handInThePapers="handPapers" />
    <!-- 成绩单 -->
    <SchoolReport ref="saasSchoolReportDialog" @refreshData="checkAnalysis" />
    <!-- 查看错题 或 试题解析 -->
    <Analysis ref="saasAnalysisDialog" />
    <!-- 实操试卷 -->
    <PracticalExercises ref="saasPracticalExercisesDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import testImg2 from '@/assets/img/train/test_2.png'
import testImg3 from '@/assets/img/train/test_3.png'
import TestPaper from '@/views/pro/train/test/practice/components/testPaperView'
import SchoolReport from './components/schoolReportView'
import Analysis from '@/views/pro/train/test/practice/components/analysisView'
import PracticalExercises from '@/views/pro/train/test/practice/components/practicalExercisesView'
import { practicingHistory } from '@/views/pro/train/test/practice/practiceViewApi'
import { SimulationexamStart, FindExamNum } from './mockExamViewApi'

export default {
  name: 'ProTrainTestExamExamView',
  components: { TestPaper, SchoolReport, Analysis, PracticalExercises },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      queryParams: {
        type: 2
      },
      dataList: [
        { 'type': 1, 'name': '正式考试', 'url': testImg2 },
        { 'type': 2, 'name': '考试记录', 'url': testImg3 }
      ],
      testImg2,
      testImg3,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '所属场次', field: 'examNumName', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '考试时间', field: 'startTime', minWidth: 100, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const time = moment(cellValue).format('YYYY-MM-DD')
            return time
          } },
          { title: '所属科目', field: 'subjectName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '用时', field: 'consumeTime', minWidth: 120, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
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
          { title: '总分', field: 'totalPoints', minWidth: 80, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const totalNum = cellValue ? (cellValue / 100).toFixed(2) : ''
            return totalNum
          } },
          { title: '及格分', field: 'passPoints', minWidth: 80, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const fraction = cellValue ? (cellValue / 100).toFixed(2) : 0.00
            return fraction
          } },
          { title: '得分', field: 'points', minWidth: 80, showOverflow: true, align: 'center', className: 'highlight-txt', formatter: ({ cellValue, row, column }) => {
            const errorNum = (cellValue / 100).toFixed(2)
            return errorNum
          } },
          { title: '操作分', field: 'operPoints', minWidth: 80, showOverflow: true, align: 'center', className: 'highlight-txt', formatter: ({ cellValue, row, column }) => {
            if (row.questionType !== 2) return '-'
            const fraction = cellValue ? (cellValue / 100).toFixed(2) : 0.00
            return fraction
          } },
          { title: '耗时分', field: 'timePoints', minWidth: 80, showOverflow: true, align: 'center', className: 'highlight-txt', formatter: ({ cellValue, row, column }) => {
            if (row.questionType !== 2) return '-'
            const fraction = cellValue ? (cellValue / 100).toFixed(2) : 0.00
            return fraction
          } },
          { title: '总题数', field: 'questionNum', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '错题数', field: 'errorNums', minWidth: 100, showOverflow: true, align: 'center', className: 'highlight-txt' },
          { title: '查看错题', width: 120, align: 'center', slots: { default: 'checkWrong' }},
          { title: '试题解析', width: 120, align: 'center', slots: { default: 'analysis' }},
          { title: '重做试卷', width: 120, align: 'center', slots: { default: 'redo' }},
          { title: '排名', width: 100, fixed: 'right', align: 'center', slots: { default: 'ranking' }}
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
      this.$refs.saasAnalysisDialog.init('formalwrong', row.examNumName, row.id, row.type)
    },
    // 试题解析
    examAnalysis(row) {
      this.$refs.saasAnalysisDialog.init('formalexam', row.examNumName, row.id, row.type)
    },
    // 重做试卷,将作为模拟考试
    examRedo(row) {
      FindExamNum(row.id).then(res => {
        const examNumId = res.data
        SimulationexamStart(examNumId, 1).then(res => {
          const lists = res.data
          this.$notify.success('试卷加载成功，正在转入试卷页面')
          if (row.questionType === 2) {
            // 实操
            this.$refs.saasPracticalExercisesDialog.examInit(examNumId, lists, 'exam', 1)
          } else {
            this.$refs.saasTestPaperDialog.init(examNumId, row.examNumName + '重做', lists, {}, 1, 'exam')
          }
        })
      })
    },
    // 交卷，展示结果
    handPapers(id, resultData, name, examInfo) {
      this.$refs.saasSchoolReportDialog.init(id, resultData, name, examInfo)
    },
    // 显示解析弹框
    checkAnalysis(id, name) {
      this.$refs.saasAnalysisDialog.init('exam', name, id, 1)
    },
    // 根据不同类型跳转做题
    checkItemView(type) {
      const query = {}
      let _path = ''
      if (type === 1) {
        _path = '/api/v1/train/test/exam/assessment'
      } else if (type === 2) {
        _path = '/api/v1/train/test/exam/record'
      }
      this.$router.push({
        path: _path,
        query: query
      })
    }
  }
}
</script>

<style scoped>
.modular-title{
  margin-top: 0;
  margin-bottom: 20px;
  padding-left: 15px;
  font-size: 18px;
  border-left: 5px solid #1890FF;
}
.item-card{
  margin-bottom: 20px;
  text-align: center;
}
.card-btn{
  margin-top: 10px;
}
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
.col-item-img{
  display: block;
  margin: 0 auto;
  width: 100px;
  height: 100px;
}
</style>
