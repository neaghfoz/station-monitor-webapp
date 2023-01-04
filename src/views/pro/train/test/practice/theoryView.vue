<template>
  <div v-loading="loading" class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="getData">刷新</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <el-card v-for="(item,index) in dataList" :key="index" shadow="never" class="card-box">
      <div slot="header" class="clearfix card-title-box">
        <span>{{ item.subjectName }} - {{ item.sectionName }}</span>
      </div>
      <el-row v-if="item">
        <el-col
          v-for="vos in item.knowledgeVOs"
          :key="vos.knowledgeId"
          :span="4"
        >
          <div class="cont-item"><span @click="checkQuestion(vos)">{{ vos.knowledgeName }}</span></div>
        </el-col>
      </el-row>
    </el-card>

    <Question ref="saasQuestionDialog" @refchoosePractice="choosePractice" @refchooseExercises="chooseExercises" />
    <Exercises ref="saasTestQuestionDialog" />
    <!-- 试卷 -->
    <PracticalExercises ref="saasPracticalExercisesDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getTheoriestrain } from './practiceViewApi'
import Question from './components/questionView'
import Exercises from './components/exercisesView'
import PracticalExercises from './components/practicalExercisesView'

export default {
  name: 'ProTrainTestPracticeTheoryView',
  components: { Question, Exercises, PracticalExercises },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      queryParams: {
        subjectId: 1
      },
      dataList: []
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
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      this.loading = true
      this.queryParams.subjectId
      getTheoriestrain().then(res => {
        this.dataList = res.data
        this.loading = false
      })
    },
    // 查看题型
    checkQuestion(item) {
      this.$refs.saasQuestionDialog.init(item)
    },
    // 选择题型后打开试题练习
    choosePractice(infoObj, knowledObj, testId) {
      this.$refs.saasTestQuestionDialog.init(infoObj, knowledObj, testId)
    },
    // 实操
    chooseExercises(infoObj, knowledObj, testId) {
      // this.$refs.saasTestQuestionDialog.init(infoObj,knowledObj,testId)
      this.$refs.saasPracticalExercisesDialog.init(infoObj, knowledObj)
    }
  }
}
</script>

<style scoped>
.card-box{
  margin-bottom: 30px;
}
.card-box >>> .el-card__header{
  padding: 8px 10px;
  background-color: #d9edf7;
}
.card-box >>> .el-card__body{
  padding: 0;
}
.card-title-box{
  font-size: 14px;
  background-color: #d9edf7;
}
.cont-item{
  padding: 8px 10px;
  font-size: 14px;
  /* color: #606266; */
  color: #1890ff;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
}
.cont-item span{
  display: inline-block;
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.cont-item span:hover{
  color: #005580;
}
</style>
