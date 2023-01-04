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
            <h1>{{ totalScore }}分</h1>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="subhead">练习情况：</div>
          <div class="answer-time">答卷耗时：
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
              <div class="statistics-info">本次考试共<span class="hight-light-txt">{{ totalNum }}</span>道题</div>
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

export default {
  name: 'VueTestPaperSchoolReportView',
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
        testHistoryId: ''
      },
      formItem: {

      },
      timesInfo: {
        h: 0,
        m: 0,
        s: 0
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '题型', field: 'choiceText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '总题数', field: 'num', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '答对题数', field: 'correct', minWidth: 150, showOverflow: true, align: 'center' }
        ]
      }
    }
  },
  computed: {
    totalNum() {
      let num = 0
      this.tableData.columnsDataList.map(item => { num += item.num })
      return num
    },
    totalScore() {
      let score = 0
      this.tableData.columnsDataList.map(item => { score += item.score })
      score = (score / 100).toFixed(2)
      return score
    }
  },
  methods: {
    init(id, resultData) {
      this.queryParams.testHistoryId = id
      this.tableData.columnsDataList = resultData.consultList
      this.title = '成绩单 - 综合训练'
      this.visible = true
      this.secondToDate(resultData.consumeTime / 1000)
    },
    answersAndAnalysis() {
      this.visible = false
      this.$emit('refreshData', this.queryParams.testHistoryId, '综合训练')
    },
    // 时分秒
    secondToDate(result) {
      const h = Math.floor(result / 3600) // < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
      const m = Math.floor((result / 60 % 60)) // < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      const s = Math.floor((result % 60)) // < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

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
