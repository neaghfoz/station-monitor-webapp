<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :show-close="false"
      width="300"
    >
      <div v-if="method == 1" class="content-box">
        <div>本次{{ classify == 'exam' || classify == 'formalexam' ? '考试': '练习' }}场景共{{ totalNum }}个</div>
        <div>第一个场景：</div>
        <div>{{ sceneName }}</div>
      </div>
      <div v-if="method == 2" class="content-box">
        <div>{{ ClickLastOrNext ? '切换场景成功':'当前场景已完成！' }}</div>
        <div>{{ ClickLastOrNext ? '切换场景为':'下一个场景' }}：</div>
        <div>{{ sceneName }}</div>
      </div>
      <div v-if="method == 3" class="content-box">
        <div>本次练习已结束！</div>
        <div>完成练习场景：{{ totalNum }}个</div>
      </div>
      <div v-if="method == 5" class="content-box">
        <div>本次{{ classify == 'exam' || classify == 'formalexam' ? '考试': '练习' }}已结束！</div>
        <div>完成{{ classify == 'exam' || classify == 'formalexam' ? '考试': '练习' }}场景：{{ totalNum }}个</div>
        <div>完全正确操作场景：{{ resultObj.correctNum }}个</div>
        <div>存在错误操作场景：{{ resultObj.errorNum }}个</div>
        <div>操作得分：{{ resultObj.operationScore }}分</div>
        <div>总耗时：{{ resultObj.totalTime }}</div>
        <div>耗时得分：{{ resultObj.timeScore }}分</div>
        <div>总得分：{{ resultObj.totalScore }}分</div>
      </div>
      <div v-if="method == 4 || method == 8 || method == 9 || method == 10" class="content-box font20">{{ sceneName }}</div>
      <div v-if="method == 6" class="content-box">
        <div>当前场景操作错误，进入下一个场景！</div>
        <div>下一个场景：</div>
        <div>{{ sceneName }}</div>
      </div>
      <div v-if="method == 7" class="content-box">
        <div>本次{{ classify == 'exam' || classify == 'formalexam' ? '考试': '练习' }}场景共{{ totalNum }}个</div>
        <div>已完成场景{{ finishNum }}个</div>
        <div>当前场景为：</div>
        <div>{{ sceneName }}</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="method == 3" @click="comfireBtn">关闭</el-button>
        <el-button v-else-if="method == 4" class="comfire-btn" type="primary" @click="visible = false">确认</el-button>
        <el-button v-else-if="method == 8 || method == 9" class="comfire-btn" type="primary" @click="comfireBtn">{{ method == 8 ? '重新加载' : '重试' }}</el-button>
        <el-button v-else-if="method == 10" class="comfire-btn" type="primary" @click="comfireResult">提交成绩</el-button>
        <el-button v-else-if="method == 1 || method == 2 || method == 6 || method == 7" type="primary" @click="comfireBtn">好的</el-button>
        <el-button v-else-if="classify == 'formalexam'" type="primary" @click="comfireBtn">好的</el-button>

        <el-button v-if="(method == 5 && classify != 'formalexam') || method == 3" type="primary" @click="practiceAgain">重新练习</el-button>
        <el-button v-if="method == 5 && classify != 'formalexam'" type="primary" @click="comfireResult">提交成绩</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'VueOperationRemindView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      classify: '',
      title: '温馨提示',
      queryParams: {},
      formItem: {},
      remindTxt: '',
      totalNum: 0,
      sceneName: '',
      resultObj: {},
      ClickLastOrNext: null,
      finishNum: 0
    }
  },
  methods: {
    showView() {
      this.visible = true
    },
    init(type, name, totalNum, classify, testPaperList, ClickLastOrNext) {
      // type 1 第一个场景；  2 下一个场景；  3练习结束 4点击按键错误  5 已结束
      // 6 考试模式下，操作错误   7正式考试退出后再次加载   8重新加载
      // classify  formalexam 正式考试  ，exam为模拟考试  为空为综合训练
      // 10 提交成绩后重试
      this.totalNum = totalNum
      this.method = type
      this.sceneName = name
      this.classify = classify || ''
      this.ClickLastOrNext = ClickLastOrNext
      let correctNum = 0; let errorNum = 0; let totalTime = 0
      let operationScore = 0; let timeScore = 0

      if (testPaperList) {
        testPaperList.map(v => {
          operationScore += v.operationScore
          timeScore += v.timeScore
          if (v.correct === 1) {
            correctNum++
          } else {
            errorNum++
          }
          totalTime += v.time
        })
      }

      operationScore = operationScore / 100
      timeScore = timeScore / 100

      const totalScore = operationScore + timeScore
      totalTime = this.secondToDate(totalTime)

      this.resultObj = {
        correctNum, errorNum, totalTime,
        operationScore, timeScore,
        totalScore
      }

      this.visible = true
    },
    reinit(type, name, totalNum, classify, finishNum) {
      this.totalNum = totalNum
      this.method = type
      this.sceneName = name
      this.classify = classify || ''
      this.finishNum = finishNum

      this.visible = true
    },
    comfireBtn() {
      if (this.method === 2 || this.method === 6) {
        // 加载下一场景
        this.$emit('refLoadNextQut')
      } else if (this.method === 5) {
        // 考试的提交
        if (this.classify === 'formalexam') {
          this.$emit('refDialogClose')
        }
      } else if (this.method === 3) {
        // 关闭
        this.$emit('refDialogClose')
      } else if (this.method === 8) {
        // 重新加载
        this.$emit('refReLoad')
      } else if (this.method === 9) {
        // 数据请求失败
        this.$emit('refReSubmit')
      }
      this.visible = false
    },
    // 重新练习
    practiceAgain() {
      this.visible = false
      this.$emit('refPracticeAgain')
    },
    // 提交成绩
    comfireResult() {
      this.visible = false
      this.$emit('refComfireResult')
    },
    // 输出00:00:00  时分秒
    secondToDate(result, method) {
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      if (method === 2) {
        result = h + ':' + m + ':' + s
        return result
      } else {
        const txt = h ? h + '小时' : ''
        const sTxt = s ? s + '秒' : ''
        result = txt + m + '分钟' + sTxt
        return result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box{
  line-height: 2;
}
.font20{
  font-size: 20px;
}
.comfire-btn {
  font-size: 16px;
}
</style>
