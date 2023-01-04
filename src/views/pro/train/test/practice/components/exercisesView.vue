<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <el-card v-for="(item,index) in dataList" :key="index" v-loading="loading" shadow="never" class="subject-card">
        <div slot="header" class="clearfix">
          <span class="serial-num">{{ page.currentPage }}</span>
          <el-button class="add-btn" @click="addWrongQuestions(item)">添加到错题集</el-button>
        </div>
        <div class="subject-title" v-html="formatterCont(item.mainContent)" />
        <el-divider />
        <div v-html="formatterCont(item.selectContent)" />

        <div v-show="!isAnswer">
          <el-divider />
          <!-- 多选题 -->
          <el-checkbox-group v-if="item.type == 1 && item.choice == 2" v-model="checkList">
            <el-checkbox v-for="o in item.selectNum" :key="o" :label="formatterNum(o)" />
          </el-checkbox-group>
          <!-- 单选题 或 判断题 -->
          <el-radio-group v-else-if="item.type == 1 && (item.choice == 1 || item.choice == 3)" v-model="answerRadio">
            <el-radio v-for="o in item.selectNum" :key="o" :label="formatterNum(o)">{{ o | formatterNum }}</el-radio>
          </el-radio-group>
          <el-divider />
        </div>
        <div v-show="isAnswer">
          <div :class="isCorrect ? 'answer-correct' : 'answer-error'">{{ answerResult }}</div>
        </div>

        <div>
          <el-button v-if="!showAnswer" class="check-answer" type="primary" @click="checkAnswer">查看答案</el-button>
          <el-button v-if="page.currentPage != 1" type="primary" @click="switchTopics(1)">上一题</el-button>
          <el-button v-if="page.currentPage != page.total" type="primary" @click="switchTopics(2)">下一题</el-button>
        </div>
        <div v-if="showAnswer">
          <el-divider />
          <div>
            <h5>答案</h5>
            <p>{{ item.answer }}</p>
          </div>
          <el-divider />
          <div>
            <h5>解析</h5>
            <div v-html="formatterCont(item.describe)" />
          </div>
        </div>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">结束练习</el-button>
      </span>
    </el-dialog>

    <!-- 提示 -->
    <Remind
      ref="saasRemindDialog"
      @refReSubmit="requestReLoad"
    />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from '@/views/pro/train/testmng/question/questionViewApi'
import { save, favorSave } from './../practiceViewApi'
import Remind from '@/views/pro/train/test/exam/components/remindView'

export default {
  name: 'VueTestQuestion',
  components: { Remind },
  filters: {
    formatterNum(val) {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
      const txt = val ? arr[val - 1] : ''
      return txt
    }
  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '题型',
      queryParams: {},
      formItem: {
        type: 0 // 类型   0综合训练  1练习   2考核  3竞赛
      },
      dataList: [],
      exercisesInfo: {}, // 试题信息
      answerRadio: '',
      checkList: [],
      showAnswer: false, // 展示答案
      isAnswer: false, // 是否点击答题
      isCorrect: false, // 答题是否正确
      answerResult: '',
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 1,
        align: 'right',
        pageSizes: [5, 10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      testHistoryId: '',
      isClickLastOrNext: null
    }
  },
  methods: {
    init(txObj, knowledObj, testId) {
      Object.assign(this.exercisesInfo, txObj, knowledObj)
      Object.assign(this.queryParams, {
        choice: txObj.choice,
        knowledgeId: knowledObj.knowledgeId
      })
      this.page.currentPage = 1
      this.testHistoryId = testId
      this.title = this.exercisesInfo.knowledgeName + '（' + this.exercisesInfo.choiceText + '）'
      this.visible = true
      this.handleReset()
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      findPage(Object.assign({}, {
        size: this.page.pageSize,
        current: this.page.currentPage
      }), this.queryParams).then(res => {
        this.handleReset()
        this.dataList = res.data.records
        this.page.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$refs.saasRemindDialog.init(9, '网络异常，请重试')
      })
    },
    requestReLoad() {
      if (this.page.currentPage === 1) {
        this.getData()
      } else {
        // 请求下一题/上一题数据失败，设置归位
        if (this.isClickLastOrNext === 1) {
          this.page.currentPage++
        } else if (this.isClickLastOrNext === 2) {
          this.page.currentPage--
        }
      }
    },
    // 切换题目
    switchTopics(type) {
      if (type === 1) this.page.currentPage--
      else this.page.currentPage++
      this.isClickLastOrNext = type

      // this.submitAnswers()
      this.getData()
    },
    submitAnswers() {
      const _data = this.dataList[0]
      let userAnswer = ''
      if (this.dataList[0].type === 1) {
        // 客观题
        if (this.dataList[0].choice === 2) {
          // 多选题，在点击上下题时，把答案进行提交
          userAnswer = this.checkList.sort().join('')
        } else {
          userAnswer = this.answerRadio
        }
      }

      save(Object.assign({}, {
        testHistoryId: this.testHistoryId,
        subjectId: _data.subjectId,
        sectionId: _data.sectionId,
        knowledgeId: _data.knowledgeId,
        questionId: _data.id,
        userAnswer: userAnswer
      }))
    },
    // 添加到错题集
    addWrongQuestions(item) {
      favorSave(Object.assign({}, {
        subjectId: item.subjectId,
        questionId: item.id
      }, this.formItem)).then(res => {
        this.$notify.success('添加成功！')
      })
    },
    // 查看答案
    checkAnswer() {
      this.showAnswer = true
      this.isAnswer = true

      const { answer } = this.dataList[0]
      const _answer = answer.split(',').sort().join(',')

      let userAnswer = ''
      if (this.dataList[0].type === 1) {
        // 客观题
        if (this.dataList[0].choice === 2) {
          // 多选题，在点击上下题时，把答案进行提交
          userAnswer = this.checkList.sort().join(',')
        } else {
          userAnswer = this.answerRadio
        }
      }
      if (_answer === userAnswer) {
        this.isCorrect = true // 答题是否正确
        this.answerResult = '恭喜您回答正确！'
      } else {
        this.isCorrect = false
        this.answerResult = `回答错误，正确答案为：${_answer}，您选择的答案是：${userAnswer}`
      }
    },
    handleReset() {
      this.answerRadio = ''
      this.checkList = []
      this.showAnswer = false
      this.isAnswer = false
    },
    formatterNum(val) {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
      const txt = val ? arr[val - 1] : ''
      return txt
    },
    formatterCont(txt) {
      // let cont = txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
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
.answer-correct,.answer-error{
  margin: 24px 0;
  padding: 8px 35px 8px 14px;
  border-top: 1px solid #EBEEF5;
  border-radius: 4px;
  text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 5%);
}
.answer-correct{
  color: #468847;
  background-color: #dff0d8;
}
.answer-error{
  color: #b94a48;
  background-color: #f2dede;
}
</style>
