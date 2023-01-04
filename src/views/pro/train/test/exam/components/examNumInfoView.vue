<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <div class="tips-box">
        <div class="tips-title"><b>提示：</b></div>
        <div v-if="examNumInfo.testPaperId">本考场开启时间 {{ examNumInfo.startTestTime }} - {{ examNumInfo.endTestTime }} ；
          考试次数：{{ method == 2 ? '1次' : '无限' }} ； 抽卷规则：{{ examNumInfo.combineText }}。</div>
        <div v-else>该场次没有试卷，请通知管理员</div>
      </div>
      <el-row class="remind-txt">
        <el-col><b>1、</b>点击开始考试按钮进入答题界面，考试开始计时。</el-col>
        <el-col><b>2、</b>在考试过程中，您可以通过{{ examNumInfo.questionType == 2 ? '右上角': '底部' }}的考试时间来掌握自己的做题时间。</el-col>
        <el-col v-if="examNumInfo.questionType != 2"><b>3、</b>提交试卷后，可以通过“查看答案和解析”功能进行总结学习。</el-col>
        <el-col><b>{{ examNumInfo.questionType == 2 ? '3': '4' }}、</b>系统自动记录{{ method == 2 ? '正式考试' : '模拟考试' }}的考试记录，学员考试结束后可以进入“{{ method == 2 ? '考试记录' : '练习记录' }}”功能进行查看。</el-col>
      </el-row>
      <div v-if="examNumInfo.testPaperId && !showExamBtn && remindTxt" class="tips-bottom">{{ remindTxt }}</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="showExamBtn" :loading="saveLoading" type="primary" @click="startExam">开始考试</el-button>
        <el-button v-if="showExamResBtn" :loading="saveLoading" type="primary" @click="checkExamResult">您已经考过试了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { SimulationexamStart, historyCount, ResultByExamNum } from './../mockExamViewApi'

export default {
  name: 'VueOperationExamNumInfoView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '', // 1模拟考试   2正式考试
      title: '模拟考试',
      queryParams: {},
      formItem: {
        type: 1 // 考试类型 0综合训练 1模拟考试 2正式考试
      },
      examNumInfo: {},
      showExamBtn: false,
      showExamResBtn: false,
      remindTxt: ''
    }
  },
  methods: {
    init(item, type) {
      this.method = type
      item.startTestTime = moment(item.startTestTime).format('YYYY-MM-DD HH:mm:ss')
      item.endTestTime = moment(item.endTestTime).format('YYYY-MM-DD HH:mm:ss')
      this.examNumInfo = item
      const isStart = this.contrastTime(item.startTestTime)
      const isEnd = this.contrastTime(item.endTestTime)
      this.showExamBtn = false
      this.showExamResBtn = false
      if (type === 2) {
        this.formItem.type = 2
      }
      if (!isStart) {
        this.remindTxt = `本场次开放考试时间为：${item.startTestTime} - ${item.endTestTime}，目前不是考试时间，请在规定时间内前来考试哦。`
      } else if (isEnd) {
        this.remindTxt = '本场次考试时间已经结束。'
      } else if (item.testPaperId) {
        if (type === 2) {
          this.getCount()
        } else {
          this.remindTxt = ''
          this.showExamBtn = true
        }
      }
      this.visible = true
      if (type === 1) {
        this.title = '模拟考试 - ' + item.name
      } else if (type === 2) {
        this.title = '正式考试 - ' + item.name
      }
    },
    async getCount() {
      historyCount(this.examNumInfo.id, this.method).then(res => {
        const count = res.data
        if (count > 0) {
          this.showExamResBtn = true
        } else {
          this.remindTxt = ''
          this.showExamBtn = true
        }
      })
    },
    // 已经考过试，查看结果
    checkExamResult() {
      this.saveLoading = true
      ResultByExamNum(this.examNumInfo.id).then(res => {
        const lists = res.data
        this.$emit('checkResult', lists.examHistoryId, lists, this.examNumInfo.name, this.examNumInfo.questionType)
        this.saveLoading = false
        this.visible = false
      }).catch(() => {
        this.saveLoading = false
      })
    },
    // 开始考试
    startExam() {
      this.saveLoading = true
      SimulationexamStart(this.examNumInfo.id, this.formItem.type).then(res => {
        const lists = res.data
        if (this.method === 2) {
          this.$notify.success('加载试题成功，正在转入试卷页面')
        } else {
          this.$notify.success('抽取试题成功，正在转入试卷页面')
        }

        this.$emit('refreshData', this.examNumInfo, lists)
        this.saveLoading = false
        this.visible = false
      }).catch(() => {
        this.saveLoading = false
      })
    },
    contrastTime(time) {
      var nowD = new Date() // 当前时间
      var endD = new Date(time) // 对比时间
      if (nowD.getTime() > endD.getTime()) { // getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
        // '当前时间大于对比时间'
        return true
      } else {
        // '当前时间小于对比时间'
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-box{
  padding: 12px 35px 12px 18px;
  margin-bottom: 20px;
  color: #3a87ad;
  background-color: #d9edf7;
  border-color: #bce8f1;
  border-radius: 4px;
}
.tips-title{
  margin-bottom: 10px;
}
.remind-txt{
  margin-bottom: 30px;
  color: #333;
  font-size: 14px;
  line-height: 2;
}
.tips-bottom{
  padding: 12px 35px 12px 18px;
  color: #c09853;
  background-color: #fcf8e3;
  border: 1px solid #fbeed5;
  border-radius: 4px;
  text-align: center;
}
</style>
