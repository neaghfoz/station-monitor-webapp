<template>
  <div class="app-container">
    <el-dialog
      id="testPaper"
      v-loading="loading"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <div v-if="isExamination && method != 'wrong'" class="scoreArea">{{ examInfo.totalScore }}</div>
      <div v-for="(val,key,index) in testPaper" :key="index">
        <div v-if="val.length > 0" class="question-type">{{ key }}</div>
        <el-card
          v-for="(item,idx) in val"
          :key="idx"
          shadow="never"
          class="subject-card"
        >
          <div slot="header" class="clearfix">
            <span class="serial-num">{{ idx + 1 }}</span>
            <el-button class="add-btn" @click="addWrongQuestions(item)">添加到错题集</el-button>
          </div>
          <div class="subject-title" v-html="formatterCont(item.mainContent)" />
          <el-divider />
          <div v-html="formatterCont(item.selectContent)" />

          <!-- <div v-if="isOnlyExam">
            <el-divider></el-divider>
            <div class="item-type">本题得分：{{formatterScore(item)}}分&nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="method != 'formalwrong'">做题时间：{{item.userTime | formatterDate}}</span></div>
          </div> -->
          <div>
            <el-divider />
            <div class="item-type">本题得分：{{ formatterScore(item) }}分&nbsp;&nbsp;&nbsp;&nbsp;
              <span>做题时间：{{ item.userTime | formatterDate }}</span></div>
          </div>

          <el-divider />
          <div class="analysis-info">
            <div class="item-type">正确答案：</div>
            <p class="item-cont">{{ item.answer }}</p>
          </div>
          <div class="analysis-info">
            <div class="item-type2">您的答案：</div>
            <p class="item-cont">{{ item.userAnswer }}</p>
          </div>
          <div class="analysis-info"><span class="item-type2">所在章：</span>{{ item.sectionName }} </div>
          <div class="analysis-info item-cont"><span class="item-type2">知识点：</span>{{ item.knowledgeName }} </div>
          <div>
            <div class="item-type2">答案解析</div>
            <div v-html="formatterCont(item.describe)" />
          </div>
          <div class="answer-result"><el-image :src="wrongJudgment(item.answer,item.userAnswer) ? iconYes : iconWrong" /></div>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { answerAnalysis } from './../practiceViewApi'
import { ExamAnswerAnalysis } from '@/views/pro/train/test/exam/mockExamViewApi'
import { favorSave } from './../practiceViewApi'
import iconWrong from '@/assets/img/train/icon_wrong.png'
import iconYes from '@/assets/img/train/icon_yes.png'

export default {
  name: 'VueAnswerAnalysisView',
  components: { },
  filters: {
    formatterDate(val) {
      const _date = val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '--'
      return _date
    }
  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '试题解析',
      queryParams: {
        id: ''
      },
      formItem: {
        type: 0 // 类型   0综合训练  1练习   2考核  3竞赛
      },
      dataList: [],
      testPaper: {},
      iconWrong,
      iconYes,
      isExamination: false, // 是否是考试答卷
      isOnlyExam: false, // 正式考试
      examInfo: {
        totalScore: 0.00
      }
    }
  },
  methods: {
    init(type, name, id, sourceType) {
      // sourceType考试类型  0 综合训练  1练习模式  2考核模式  3竞赛模式
      this.testPaper = {}
      this.method = type
      this.queryParams.id = id
      this.formItem.type = sourceType || 0
      this.isOnlyExam = false
      if (type === 'exam' || type === 'formalexam') {
        this.title = name ? '试题解析 - ' + name : '试题解析'
        this.isExamination = true
        if (type === 'formalexam') {
          this.isOnlyExam = true
        }
      } else if (type === 'wrong' || type === 'formalwrong') {
        this.title = name ? '查看错题 - ' + name : '查看错题'
        this.isExamination = false
      } else if (type === 'analysis') {
        this.title = name ? '试题解析 - ' + name : '试题解析'
        this.isExamination = true
      } else {
        this.title = name ? '试题解析 - ' + name : '试题解析'
        this.isExamination = false
      }

      this.getExamData()
      this.visible = true

      this.$nextTick(() => {
        const ele = document.getElementById('testPaper')
        ele.scrollTop = 0
      })
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      answerAnalysis(this.queryParams.id).then(res => {
        if (this.method === 'wrong' || this.method === 'formalwrong') {
          const lists = res.data
          const _obj = {}
          for (const item in lists) {
            const arr = lists[item].filter(j => {
              const isYes = this.wrongJudgment(j.answer, j.userAnswer)
              if (!isYes) {
                return j
              }
            })
            _obj[item] = arr
          }
          this.testPaper = _obj
        } else {
          this.testPaper = res.data
        }

        this.loading = false
      })
    },
    async getExamData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      ExamAnswerAnalysis(this.queryParams.id).then(res => {
        const lists = res.data
        this.examInfo.totalScore = (lists.score / 100).toFixed(2)
        const choiceArr = lists.choiceMapList
        const _obj = {}

        if (this.method === 'wrong' || this.method === 'formalwrong') {
          for (const item in choiceArr) {
            const choiceItem = choiceArr[item]
            if (choiceItem.choiceList) {
              _obj[choiceItem.choiceText] = choiceItem.choiceList
              const arr = choiceItem.choiceList.filter(j => {
                const isYes = this.wrongJudgment(j.answer, j.userAnswer)
                if (!isYes) {
                  return j
                }
              })
              _obj[choiceItem.choiceText] = arr
            }
          }
        } else {
          for (const item in choiceArr) {
            const choiceItem = choiceArr[item]
            if (choiceItem.choiceList) {
              _obj[choiceItem.choiceText] = choiceItem.choiceList
            }
          }
        }

        this.testPaper = _obj
        this.loading = false
      }).catch(() => {
        this.loading = false
        // this.$notify.error('网络异常，请重试')
      })
    },
    wrongJudgment(answer, userAnswer) {
      const _answer = answer.split(',').sort().join()
      if (_answer === userAnswer) {
        return true
      } else {
        return false
      }
    },
    // 添加到错题集
    addWrongQuestions(item) {
      favorSave(Object.assign({}, {
        subjectId: item.subjectId,
        questionId: item.questionId
      }, this.formItem)).then(res => {
        this.$notify.success('添加成功！')
      })
    },
    formatterScore(item) {
      const isyes = this.wrongJudgment(item.answer, item.userAnswer)
      const handleNum = isyes ? (item.points ? (item.points / 100).toFixed(2) : 0) : 0
      return handleNum
    },
    formatterNum(val) {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']
      const txt = val ? arr[val - 1] : ''
      return txt
    },
    formatterCont(txt) {
      var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
      if (txt) {
        return txt.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
          return arrEntities[t]
        })
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.question-type{
  margin-bottom: 30px;
  padding: 10px;
  color: #333;
  font-weight: bold;
  background-color: #f5f5f5;
}
.subject-card{
  margin-bottom: 20px;
}
.subject-card >>> .el-card__body{
  position: relative;
}
.add-btn{
  float: right;
  /* padding: 3px 0; */
}
.subject-card >>> .el-divider{
  background-color: #EBEEF5;
}
.serial-num{
  display: inline-block;
  padding: 0 9px;
  min-width: 3em;
  line-height: 2em;
  color: #fff;
  background-color: #3a87ad;
  border-radius: 9px;
  text-align: center;
}
.subject-title{
  color: #c09853;
}
.answer-result{
  position: absolute;
  top: 0;
  right: 10%;
  width: 200px;
  height: 200px;
}
.analysis-info{
  margin-bottom: 10px;
}
.item-cont{
  color: #468847;
}
.item-type{
  color: #b94a48;
}
.item-type2{
  color: #3a87ad;
}

.scoreArea {
  right: 80px;
  top: 0;
  position: absolute;
  z-index: 99;
  font-size: 120px;
  color: #FF0000;
  font-family: "MV Boli";
}
</style>
