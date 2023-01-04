<template>
  <div class="app-container">
    <el-dialog
      id="testPaper"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :show-close="false"
      destroy-on-close
      fullscreen
      class="dialog-box"
      width="100%"
      @close="beforeClose"
    >
      <el-form ref="form" v-loading="loading" class="form-box" status-icon :model="formItem">
        <el-form-item v-for="(val,key,index) in formItem.testPaper" :key="index" class="question-type-group">
          <div v-if="val.length > 0">
            <el-form-item class="question-type">
              {{ key }}
            </el-form-item>
            <!-- :prop="'testPaper.' + index + '.' + key  + '.' + idx + '.userAnswer'" -->
            <el-form-item
              v-for="(item,idx) in val"
              :key="`exam${index}.${idx}`"
              :rules="[
                {required: false, message: '请选择', trigger: 'change'},
                { validator: ((rule, value, callback) => { validateChange2(rule, value, callback,index,idx) }), trigger: 'change' }
              ]"
            >
              <el-card shadow="never" class="subject-card">
                <div slot="header" class="clearfix">
                  <span class="serial-num">{{ idx + 1 }}</span>
                  <!-- <el-button class="add-btn" @click="addordelTagging(item)">标注</el-button> -->
                </div>
                <div class="subject-title" v-html="formatterCont(item.mainContent)" />
                <el-divider />
                <div v-html="formatterCont(item.selectContent)" />

                <el-divider />
                <!-- 多选题 -->
                <el-checkbox-group v-if="item.type == 1 && item.choice == 2" v-model="item.userAnswer" @change="validateChange(key,index,idx)">
                  <el-checkbox v-for="o in item.selectNum" :key="o" :label="formatterNum(o)">{{ o | formatterNum }}</el-checkbox>
                </el-checkbox-group>
                <!-- 单选题 -->
                <el-radio-group v-else-if="item.type == 1 && (item.choice == 1 || item.choice == 3)" v-model="item.userAnswer" @change="validateChange(key,index,idx)">
                  <el-radio v-for="o in item.selectNum" :key="o" :label="formatterNum(o)">{{ o | formatterNum }}</el-radio>
                </el-radio-group>
              </el-card>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <div class="count-down"><i class="el-icon-time" /> {{ examInfo.timeText }}</div>
        <el-button class="test-list" type="text" @click="showTestQuestion"><i class="el-icon-document" />试题列表</el-button>
        <div class="answers-info">已做 {{ examInfo.doNum }} 题 共 {{ examInfo.totalNum }} 题 总分：{{ examInfo.totalScore }}分 合格分数线：{{ examInfo.qualifiedScore }}分 考试时间：{{ examInfo.examTime }}分钟</div>
        <el-button type="primary" @click="submitComfire">交卷</el-button>
        <el-button v-if="method !== 'formalexam'" @click="signOut">退出</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="交卷"
      :close-on-click-modal="false"
      :visible.sync="comfireVisible"
      width="300"
    >
      <div>共有试题{{ examInfo.totalNum }}题，已做{{ examInfo.doNum }}题。您确认要交卷吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="submit">确认交卷</el-button>
        <el-button @click="comfireVisible = false">再检查一下</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="交卷"
      :close-on-click-modal="false"
      :visible.sync="comfireSubmitVisible"
      :show-close="false"
      width="300"
    >
      <div>考试时间到，请交卷！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="submit">确认交卷</el-button>
      </span>
    </el-dialog>

    <!-- 试题列表 -->
    <TestQuestionList ref="saasTestQuestionListDialog" />
    <!-- 提示 -->
    <Remind
      ref="saasRemindDialog"
      @refReSubmit="requestReLoad"
    />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { ExamSubmitAnswer, ExamDrafts } from '@/views/pro/train/test/exam/mockExamViewApi'
import TestQuestionList from './testQuestionListView'
import Remind from '@/views/pro/train/test/exam/components/remindView'

export default {
  name: 'VueTestPaperView',
  components: { Remind, TestQuestionList },
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
      comfireVisible: false,
      comfireSubmitVisible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '综合训练',
      queryParams: {
        examInfo: {}
      },
      formItem: {
        dataList: [],
        answerResult: [],
        testPaper: {},
        testHistoryId: '',
        examHistoryId: '',
        examMode: 1, // 考试模式  1练习模式  2考核模式  3 竞赛模式
        examNumId: null
      },
      examInfo: {
        examTime: 0,
        timeText: '00:00:00',
        doNum: 0,
        totalNum: 0,
        totalScore: 100,
        qualifiedScore: 60,
        surplusTime: 0, // 剩余时间 s
        openTime: new Date(),
        endTime: null
      },
      times: null,
      answerTimes: null,
      fullscreen: false,
      dataObj: {}
    }
  },
  methods: {
    init(id, name, lists, examInfo, type, method) {
      // type考试类型  0综合训练  1练习模式  2考核模式  3竞赛模式
      // method用于区分来源  exam模拟考试   formalexam正式考试   为空是综合训练
      // window.addEventListener("keydown", this.KeyDown, true) // 监听按键事件
      // window.onresize = ()=> {
      //   if (this.visible) {
      //     this.fullscreen = false
      //     this.screen()
      //   }
      // }

      this.formItem.testPaper = {}
      this.method = method
      // 开始时间和结束时间都需要重置，避免遗漏上次时间，否则容易出现endtime<starttime
      this.examInfo.openTime = new Date()
      this.examInfo.endTime = null
      this.dataObj = lists
      this.formItem.examNumId = id || ''
      this.queryParams.examInfo = examInfo

      // 练习 - 模拟考试
      this.formItem.examHistoryId = lists.examSessionId
      this.formItem.examMode = type // (type == 2 || type == 3) ? type : 1
      this.setExamData(lists)

      // 设置全屏
      if (!this.fullscreen) {
        this.screen()
      }

      this.title = name || '综合训练'
      this.countDown()
      this.visible = true

      this.$nextTick(() => {
        const ele = document.getElementById('testPaper')
        ele.scrollTop = 0
      })
    },
    // 考试试题处理
    setExamData(lists) {
      this.examInfo.qualifiedScore = lists.passPoints ? lists.passPoints / 100 : 90
      this.examInfo.totalScore = lists.totalPoints / 100
      this.examInfo.examTime = lists.consumeTime / 1000 / 60
      this.examInfo.surplusTime = lists.consumeTime / 1000

      const choiceArr = lists.choiceMapList
      const _obj = {}
      let totalNum = 0
      const userAnswer = lists.userAnswer ? JSON.parse(lists.userAnswer) : []

      if (this.method === 'formalexam' && lists.startTime) {
        const curT = new Date()
        const startT = new Date(lists.startTime)

        const jgT = (curT.getTime() - startT.getTime()) / 1000
        this.examInfo.surplusTime = this.examInfo.examTime * 60 - jgT
      }

      let doNum = 0

      for (const item in choiceArr) {
        const choiceItem = choiceArr[item]
        if (choiceItem.choiceList) {
          _obj[choiceItem.choiceText] = choiceItem.choiceList
          const len = _obj[choiceItem.choiceText].length

          if (len > 0) {
            totalNum += len
            _obj[choiceItem.choiceText].map(j => {
              if (j.choice === 2) {
                //  多选题
                let answer = []
                if (this.method === 'formalexam') {
                  const hasAnswer = userAnswer.find((v, i) => { return v.questionId === j.id })
                  if (hasAnswer && hasAnswer.userAnswer) {
                    answer = hasAnswer.userAnswer.split(',')
                    j.userTime = hasAnswer.userTime
                    doNum++
                  }
                }
                j.userAnswer = answer
              } else {
                let answer = ''
                if (this.method === 'formalexam') {
                  const hasAnswer = userAnswer.find((v, i) => { return v.questionId === j.id })
                  if (hasAnswer && hasAnswer.userAnswer) {
                    answer = hasAnswer.userAnswer || ''
                    j.userTime = hasAnswer.userTime
                    doNum++
                  }
                }
                j.userAnswer = answer
              }
            })
          }
        }
      }
      this.examInfo.doNum = doNum
      this.examInfo.totalNum = totalNum
      this.formItem.testPaper = _obj
      const timeTxt = this.secondToDate(this.examInfo.surplusTime)
      this.examInfo.timeText = timeTxt
    },
    // 倒计时
    countDown() {
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }
      const openT = this.examInfo.openTime.getTime()
      const currentT = (new Date()).getTime()
      if (openT !== currentT && currentT - openT >= this.examInfo.examTime * 60000) {
        // 时间到
        this.examInfo.surplusTime = 0
        this.examInfo.timeText = '00:00:00'
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        this.examInfo.endTime = new Date()
        if (this.method === 'formalexam') {
          this.submit()
        } else {
          this.comfireSubmitVisible = true
        }
        return
      }
      if (this.examInfo.surplusTime === 0) {
        this.$notify.success('交卷时间到')
        this.examInfo.endTime = new Date()
        if (this.method === 'formalexam') {
          this.submit()
        } else {
          this.comfireSubmitVisible = true
        }
      } else {
        this.times = setTimeout((t) => {
          this.examInfo.surplusTime--
          const timeTxt = this.secondToDate(this.examInfo.surplusTime)
          this.examInfo.timeText = timeTxt
          this.countDown()
        }, 1000)
      }
    },
    // 交卷二次确认
    submitComfire() {
      this.comfireVisible = true
    },
    // 交卷
    submit() {
      try {
        this.saveLoading = true
        if (!this.examInfo.endTime) {
          this.examInfo.endTime = new Date()
        }

        const answerResult = []
        const lists = this.formItem.testPaper
        for (const item in lists) {
          lists[item].map(j => {
            let answer = j.userAnswer
            if (j.choice === 2) {
              answer = answer.length > 0 ? answer.sort().join() : ''
            }
            const _obj = {
              'questionId': j.id, // 试题id
              'userAnswer': answer, // 用户提交答案
              'userTime': j.userTime || '',
              'points': j.points,
              'sort': j.sort || ''
            }
            answerResult.push(_obj)
          })
        }
        this.examSubmit(answerResult)
      } catch {
        this.saveLoading = false
      }
    },
    async examSubmit(answerResult) {
      const { formItem, examInfo, dataObj, queryParams } = this
      const infoObj = {
        'examNumId': formItem.examNumId,
        'startTime': moment(examInfo.openTime).format('YYYY-MM-DD HH:mm:ss'),
        'endTime': moment(examInfo.endTime).format('YYYY-MM-DD HH:mm:ss'),
        'questionTypeSort': dataObj.questionTypeSort,
        'examSessionId': dataObj.examSessionId, // "真实考试填写：会话id"
        'subjectId': queryParams.examInfo.subjectId, // "综合训练填写：科目id",
        'sectionId': queryParams.examInfo.sectionId, // "综合训练填写：章节id",
        'knowledgeId': queryParams.examInfo.knowledgeId, // "综合训练填写：知识点id",
        'userAnswers': answerResult
      }
      // this.formItem.examHistoryId,
      await ExamSubmitAnswer(this.formItem.examMode, infoObj).then(res => {
        const resultData = res.data
        this.$notify.success('提交成功')
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        this.$emit('handInThePapers', resultData.examHistoryId, resultData, this.title, this.examInfo)
        this.saveLoading = false
        this.comfireVisible = false
        this.comfireSubmitVisible = false
        // window.removeEventListener('keydown', this.myKeyEvent)
        this.visible = false
      }).catch(err => {
        this.saveLoading = false
        this.$refs.saasRemindDialog.init(9, '网络异常，请重试')
      })
    },
    // 请求失败
    requestReLoad() {
      if (this.method === 'formalexam') {
        this.submit()
      }
    },
    // 选择答案
    validateChange(key, index, idx) {
      let doNum = 0
      const lists = this.formItem.testPaper
      const _date = new Date()
      for (const item in lists) {
        lists[item].map(j => {
          if (j.choice === 2) {
            //  多选题
            if (j.userAnswer.length > 0) doNum++
          } else {
            if (j.userAnswer !== '') doNum++
          }
        })
      }
      this.examInfo.doNum = doNum
      this.formItem.testPaper[key][idx].userTime = moment(_date).format('YYYY-MM-DD HH:mm:ss')

      if (this.method === 'formalexam') {
        // 每隔3s记录一下最新答案
        if (this.answerTimes) {
          clearTimeout(this.answerTimes)
          this.answerTimes = null
        }
        this.answerTimes = setTimeout((t) => {
          this.TemporaryData()
        }, 2000)
      }
    },
    validateChange2(rule, value, callback, index, idx) {},
    // 暂存
    TemporaryData() {
      const answerResult = []
      const lists = this.formItem.testPaper
      for (const item in lists) {
        lists[item].map(j => {
          let answer = j.userAnswer
          if (j.choice === 2) {
            answer = answer.length > 0 ? answer.sort().join() : ''
          }
          const _obj = {
            'questionId': j.id, // 试题id
            'userAnswer': answer, // 用户提交答案
            'userTime': j.userTime || ''
          }
          answerResult.push(_obj)
        })
      }
      ExamDrafts(this.formItem.examHistoryId, answerResult)
    },
    // 试题列表
    showTestQuestion() {
      this.$refs.saasTestQuestionListDialog.init(this.formItem.testPaper)
    },
    // 标注
    addordelTagging() {},
    // 弹框关闭监听
    beforeClose() {
      if (this.fullscreen) {
        this.screen()
      }
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }
    },
    // 退出
    signOut() {
      this.visible = false
    },
    // 设置全屏
    screen() {
      try {
        const element = document.documentElement
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen()
          }
        }
        this.fullscreen = !this.fullscreen
      } catch (error) {
      }
    },
    formatterNum(val) {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
      const txt = val ? arr[val - 1] : ''
      return txt
    },
    formatterCont(txt) {
      const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
      if (txt) {
        return txt.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
          return arrEntities[t]
        })
      } else {
        return ''
      }
    },
    // 输出00:00:00  时分秒
    secondToDate(result) {
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      result = h + ':' + m + ':' + s
      return result
    },
    KeyDown(event) {
      // 屏蔽 F11 、 F12
      if (event.keyCode === 122 || event.keyCode === 123) {
        event.returnValue = false
        event.cancelBubble = true
        return false
      }
    }
  }
}
</script>

<style scoped>
.form-box .question-type-group{
  margin-bottom: 0;
}
.question-type{
  margin-bottom: 30px;
  padding: 10px;
  color: #333;
  font-weight: bold;
  background-color: #f5f5f5;
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
.count-down{
  display: inline-block;
  min-width: 12%;
  font-size: 18px;
  line-height: 32px;
  text-align: left;
}
.answers-info{
  display: inline-block;
  width: 66%;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
}
.test-list{
  margin: 0 30px;
}
.dialog-box >>> .el-dialog__header{
  position:sticky;
  left: 0;
  right: 0;
  top: 0;
  background-color: #fff;
  z-index: 5;
}
.dialog-box >>> .el-dialog__footer{
  position:sticky;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
}

</style>
