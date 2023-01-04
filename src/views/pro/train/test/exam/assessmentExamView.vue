<template>
  <div class="app-container">
    <div v-if="dataList.length == 0" class="not-yet-data">
      <div><el-image :src="icon_notdata" style="width: 160px;" /></div>
      暂无场次考试
    </div>
    <el-row v-loading="loading" class="exam-num-lists" :gutter="20">
      <el-col v-for="(item,index) in dataList" :key="index" :span="5">
        <el-card shadow="never" class="item-card">
          <el-image
            style="width: 100px; height: 100px"
            :src="item.thumb ? item.thumb : testImg"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <el-image
                style="width: 100px; height: 100px"
                :src="testImg"
                fit="contain"
              />
            </div>
          </el-image>
          <br>
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
            <el-button class="card-btn" type="primary" @click="checkItemView(item)">{{ item.name }}</el-button>
          </el-tooltip>
        </el-card>
      </el-col>
    </el-row>

    <!-- 试卷 -->
    <TestPaper ref="saasTestPaperDialog" @handInThePapers="handPapers" />
    <!-- 成绩单 -->
    <SchoolReport ref="saasSchoolReportDialog" @refreshData="checkAnalysis" />
    <!-- 查看答案和解析 -->
    <Analysis ref="saasAnalysisDialog" />
    <!-- 选中场次后 -->
    <ExamNumInfo ref="saasExamNumInfoDialog" @refreshData="startExam" @checkResult="checkResult" />
    <!-- 实操试卷 -->
    <PracticalExercises ref="saasPracticalExercisesDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import testImg from '@/assets/img/train/test_5.png'
import icon_notdata from '@/assets/img/train/icon_notdata.png'
import TestPaper from '@/views/pro/train/test/practice/components/testPaperView'
import SchoolReport from './components/schoolReportView'
import Analysis from '@/views/pro/train/test/practice/components/analysisView'
import ExamNumInfo from './components/examNumInfoView'
import PracticalExercises from '@/views/pro/train/test/practice/components/practicalExercisesView'
import { getSimulationexam } from './mockExamViewApi'

export default {
  name: 'ProTrainTestExamAssessmentExamView',
  components: { TestPaper, SchoolReport, Analysis, ExamNumInfo, PracticalExercises },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      queryParams: {
        type: 2 // 考试模式，0综合训练   1练习模式 2考核模式 3竞赛模式
      },
      formItem: {},
      dataList: [
        // {"type": 1,"name": "理论随机模拟试卷","url": testImg2}
      ],
      testImg,
      icon_notdata
    }
  },
  activated() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.getData()
    },
    async getData() {
      this.loading = true
      getSimulationexam(this.queryParams.type).then(res => {
        this.dataList = res.data
        this.loading = false
      }).catch(() => {
        this.loading = true
      })
    },
    checkItemView(item) {
      this.$refs.saasExamNumInfoDialog.init(item, 2)
    },
    // 已经考过试，查看结果
    checkResult(id, resultData, name, questionType) {
      if (questionType !== 2) {
        const examInfo = {
          qualifiedScore: resultData.passScore / 100,
          totalScore: resultData.totalScore / 100
        }
        this.$refs.saasSchoolReportDialog.init(id, resultData, name, examInfo)
      }
    },
    // 开始考试
    startExam(examNumInfo, lists) {
      if (examNumInfo.questionType === 2) {
        // 实操
        this.$refs.saasPracticalExercisesDialog.examInit(examNumInfo.id, lists, 'formalexam', 2)
      } else {
        this.$refs.saasTestPaperDialog.init(examNumInfo.id, examNumInfo.name, lists, {}, 2, 'formalexam')
      }
    },
    // 交卷，展示结果
    handPapers(id, resultData, name, examInfo) {
      this.$refs.saasSchoolReportDialog.init(id, resultData, name, examInfo)
    },
    // 显示解析弹框
    checkAnalysis(id, name) {
      this.$refs.saasAnalysisDialog.init('formalexam', name, id, 2)
    }
  }
}
</script>

<style scoped>
.remind-txt{
  margin-bottom: 30px;
  color: #333;
  font-size: 14px;
}
.item-card{
  text-align: center;
}
.card-btn{
  margin-top: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.exam-num-lists >>> .el-col{
  margin-bottom: 15px;
}
.not-yet-data{
  padding: 2em;
  color: #bfbfbf;
  text-align: center;
}
</style>
