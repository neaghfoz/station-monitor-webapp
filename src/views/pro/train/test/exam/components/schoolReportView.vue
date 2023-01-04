<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <el-row>
        <el-col :span="8">
          <div class="board-score">
            <h1>{{ examInfo.score }}分</h1>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="subhead">考试详情：</div>
          <div class="answer-time">
            总分：<span class="hight-light-txt">{{ examInfo.totalScore }}</span>分&nbsp;&nbsp;
            合格分数线：<span class="hight-light-txt">{{ examInfo.qualifiedScore }}</span>分&nbsp;&nbsp;
            答卷耗时：
            <span v-if="timesInfo.h > 0"><span class="hight-light-txt">{{ timesInfo.h }}</span>小时</span>
            <span class="hight-light-txt">{{ timesInfo.m }}</span>分钟
            <span class="hight-light-txt">{{ timesInfo.s }}</span>秒
          </div>

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
            :loading="tableData.loading"
            :columns="tableData.tableColumns"
            :data="tableData.columnsDataList"
          >
            <template v-slot:bottom>
              <div class="statistics-info">
                本次考试共<span class="hight-light-txt">{{ examInfo.totalNum }}</span>道题，
                总分<span class="hight-light-txt">{{ examInfo.totalScore }}</span>分，
                您做对<span class="hight-light-txt">{{ examInfo.totalCorrect }}</span>道题，
                得到<span class="hight-light-txt">{{ examInfo.score }}</span>分</div>
            </template>

          </vxe-grid>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="answersAndAnalysis">查看答案和解析</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
// import { findPage } from './../practiceViewApi'

export default {
  name: 'VueExamSchoolReportView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '成绩单',
      queryParams: {
        examHistoryId: ''
      },
      formItem: {
        name: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '题型', field: 'choiceText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '总题数', field: 'num', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '答对题数', field: 'correct', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '总分', field: 'totalScore', minWidth: 80, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const newVal = (cellValue / 100).toFixed(2)
            return newVal
          } },
          { title: '得分', field: 'score', minWidth: 80, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const newVal = (cellValue / 100).toFixed(2)
            return newVal
          } }
        ]
      },
      timesInfo: {
        h: 0,
        m: 0,
        s: 0
      },
      examInfo: {
        totalNum: 0, // 题数
        totalScore: 100, // 总分
        qualifiedScore: 60, // 及格分
        score: 0, // 得分
        totalCorrect: 0 // 答对题数
      }
    }
  },
  methods: {
    init(id, resultData, name, examInfo) {
      this.queryParams.examHistoryId = id
      this.tableData.columnsDataList = resultData.consultList
      this.formItem.name = name
      this.title = '成绩单 - ' + name
      if (examInfo) {
        this.examInfo.totalScore = examInfo.totalScore
        this.examInfo.qualifiedScore = examInfo.qualifiedScore
      }
      this.visible = true
      this.secondToDate(resultData.consumeTime / 1000)
      this.computedNum()
    },
    // 统计
    computedNum() {
      let num = 0; let score = 0; let correct = 0
      this.tableData.columnsDataList.map(item => {
        num += item.num
        score += item.score
        correct += item.correct
      })
      score = (score / 100).toFixed(2)

      this.examInfo.totalNum = num
      this.examInfo.score = score
      this.examInfo.totalCorrect = correct
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      // findPage(Object.assign({}, {
      //   size: this.page.pageSize,
      //   current: this.page.currentPage
      // }), this.queryParams).then(res => {
      //   this.dataList = res.data.records
      //   this.page.total = res.data.total
      //   this.loading = false
      // })
    },
    answersAndAnalysis() {
      this.visible = false
      this.$emit('refreshData', this.queryParams.examHistoryId, this.formItem.name)
    },
    // 时分秒
    secondToDate(result) {
      const h = Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60))
      const s = Math.floor((result % 60))

      this.timesInfo = {
        h, m, s
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.board-score{
  padding-top: 50px;
  width: 296px;
  height: 193px;
  color: #fff;
  background: url('~@/assets/img/train/board.png') no-repeat center;
  background-size: cover;
  text-align: center;
  h1{
    font-size: 3em;
    margin: 0;
  }
}
.hight-light-txt{
  font-weight: bold;
  color: #c09853;
}
.subhead{
  font-weight: bold;
  color: #3a87ad;
}
.answer-time{
  margin: 10px 0;
}
.statistics-info{
  padding: 15px;
  border: 1px solid #e8eaec;
  border-top: none;
}
</style>
