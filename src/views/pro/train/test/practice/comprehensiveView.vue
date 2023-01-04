<template>
  <div class="app-container">
    <el-row class="remind-txt">
      <el-col><b>1、</b>点击开始训练按钮进入答题界面，考试开始计时。</el-col>
      <el-col><b>2、</b>在随机考试过程中，您可以通过底部的考试时间来掌握自己的做题时间。</el-col>
      <el-col><b>3、</b>提交试卷后，可以通过“查看答案和解析”功能进行总结学习。</el-col>
    </el-row>
    <h5 class="modular-title">配卷规则</h5>

    <el-form ref="form" v-loading="loading" class="form-box" status-icon :model="formItem" :rules="rules" label-width="180px">
      <el-form-item
        label="做题时间:"
        prop="examTime"
        inline-message
      >
        <el-input v-model.number="formItem.examTime" class="input-time no-margin-left" placeholder="做题时间" />分钟， 请填写本题练习的时长
      </el-form-item>
      <el-form-item
        label="所属科目/章节/知识点:"
        prop="parentIds"
      >
        <el-cascader
          v-model="formItem.parentIds"
          placeholder="请选择"
          :options="parentTree"
          :props="{ checkStrictly: true }"
          class="knowledge-change"
          clearable
          @change="changeType"
        />
      </el-form-item>
      <el-form-item
        label="题    型:"
        required
      >
        <el-form-item prop="totalNum">
          如果您不希望做某种题型，请在选题数值框内填 0
          <el-input v-show="false" v-model="formItem.totalNum" />
        </el-form-item>
        <div v-if="formItem.choiseSetting.length == 0" class="not-yet-subject">暂无题库，无法训练</div>
        <div v-else>
          <el-form-item
            v-for="(item,index) in formItem.choiseSetting"
            :key="index"
            class="questions-config"
            :prop="`choiseSetting.${index}.num`"
            :rules="[
              { type: 'number', message: '必须为数字值' },
              { validator: ((rule, value, callback) => { validateNum(rule, value, callback,index) }), trigger: 'blur' }
            ]"
            inline-message
          >
            {{ index + 1 }}.{{ item.choiceText }}（共<span class="question-num">{{ item.totalNum }}</span>题），选<el-input v-model.number="item.num" class="input-time" />题
            <el-form-item
              v-if="item.type == 2"
              :prop="`choiseSetting.${index}.time`"
              :rules="[
                { type: 'number', message: '耗时必须为数字值' },
                { validator: ((rule, value, callback) => { valiTimeNum(rule, value, callback,index) }), trigger: 'blur' }
              ]"
              class="time-consuming"
            >
              <div class="time-consuming">，耗时<el-input v-model.number="item.time" class="input-time" />秒</div>
            </el-form-item>
          </el-form-item>
        </div>
        <!-- <el-form-item class="questions-config" prop="dx" inline-message>
          1.单选题（共0题），选<el-input class="input-time" type="dx" v-model.number="formItem.dx" placeholder="单选题" />题
        </el-form-item>
        <el-form-item class="questions-config" prop="dxt" inline-message>
          2.多选题（共0题），选<el-input class="input-time" type="dxt" v-model.number="formItem.dxt" placeholder="多选题" />题
        </el-form-item>
        <el-form-item class="questions-config" prop="pd" inline-message>
          3.判断题（共0题），选<el-input class="input-time" type="pd" v-model.number="formItem.pd" placeholder="判断题" />题
        </el-form-item> -->
      </el-form-item>
    </el-form>
    <div class="operation-btns">
      <el-button v-if="formItem.choiseSetting.length > 0" type="primary" :loading="saveLoading" @click="startTraining">开始训练</el-button>
    </div>

    <!-- 试卷 -->
    <TestPaper ref="saasTestPaperDialog" @handInThePapers="handPapers" />
    <!-- 成绩单 -->
    <SchoolReport ref="saasSchoolReportDialog" @refreshData="checkAnalysis" />
    <!-- 查看答案和解析 -->
    <Analysis ref="saasAnalysisDialog" />
    <!-- 实操试卷 -->
    <PracticalExercises ref="saasPracticalExercisesDialog" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getQuestionCount, comStartPracticing } from './practiceViewApi'
import { getParentTree } from '@/views/pro/train/testmng/question/questionViewApi'
import TestPaper from './components/testPaperView'
import SchoolReport from './components/schoolReportView'
import Analysis from './components/analysisView'
import PracticalExercises from './components/practicalExercisesView'

export default {
  name: 'ProTrainTestPracticeComprehensiveView',
  components: { TestPaper, SchoolReport, Analysis, PracticalExercises },
  mixins: [...mixin],
  data() {
    const validateTime = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请填写做题时间'))
      } else {
        let timeNum = 0; let isPractice = false
        this.formItem.choiseSetting.map(item => {
          if (item.type === 2) isPractice = true
          if (item.num && item.type === 2) {
            timeNum += item.num * item.time
          }
        })
        if (value === 0) {
          callback(new Error('请填写做题时间'))
        } else if (isPractice && value * 60 < timeNum) {
          callback(new Error('做题时间需要大于等于总题数的所有耗时'))
        } else {
          callback()
        }
      }
    }
    const validateNum2 = (rule, value, callback) => {
      let tNum = 0
      this.formItem.choiseSetting.map(item => { tNum += item.num })
      if (!Number.isInteger(tNum) || tNum === 0) {
        callback(new Error('请至少选择一道题'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      saveLoading: false,
      queryParams: {},
      rules: {
        examTime: [
          { required: true, message: '请填写做题时间', trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        parentIds: [
          { type: 'array', required: true, message: '请选择', trigger: 'change' }
        ],
        totalNum: [
          { validator: validateNum2, trigger: 'blur' }
        ]
      },
      formItem: {
        examTime: 60,
        choiseSetting: [],
        totalNum: 0,
        // entry: 2, // 综合训练
        type: 1, // 客观题
        parentIds: []
      },
      parentTree: [],
      dataList: [],
      times: null
    }
  },
  activated: function() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      getParentTree({}).then(res => {
        this.parentTree = res.data
        this.getData()
      })
    },
    validateNum(rule, value, callback, index) {
      const totalNum = this.formItem.choiseSetting[index].totalNum
      let tNum = 0
      this.formItem.choiseSetting.map(item => { tNum += item.num })
      this.formItem.totalNum = tNum
      if (value > totalNum) {
        callback(new Error('选择的题数不能超过' + totalNum))
      } else if (value > 100) {
        callback(new Error('该选项选择的题数最多100题'))
      } else if (value < 0) {
        callback(new Error('该选项选择的题数不能小于0'))
      } else {
        callback()
      }
    },
    valiTimeNum(rule, value, callback, index) {
      const num = this.formItem.choiseSetting[index].num
      if (num > 0 && !value && this.formItem.choiseSetting[index].type === 2) {
        callback(new Error('请输入耗时，最低为1秒  '))
      } else if (value < 1) {
        callback(new Error('耗时最低为1秒'))
      } else {
        callback()
      }
    },
    async getData() {
      this.loading = true
      const { parentIds } = this.formItem
      let subid = ''; let sid = ''; let kid = ''
      if (parentIds.length > 0) {
        const ids = parentIds[parentIds.length - 1]
        const splitId = ids.split('_')
        subid = splitId[0]
        sid = splitId[1] ? splitId[1] : ''
        kid = splitId[2] ? splitId[2] : ''

        getQuestionCount({
          subjectId: subid,
          sectionId: sid,
          knowledgeId: kid
        }).then(res => {
          this.dataList = res.data
          const list = res.data
          const choiseSetting = []
          list.map(v => {
            const item = choiseSetting.find(j => { return j.choice === v.choice })
            if (item) {
              item.totalNum += v.num
            } else {
              v.totalNum = v.num
              v.num = 0
              v.time = 0
              const { level, ...params } = v
              choiseSetting.push(params)
            }
          })
          this.formItem.choiseSetting = choiseSetting
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.formItem.choiseSetting = []
        this.loading = false
      }
    },
    changeType(val) {
      // console.log(val,this.formItem.parentIds)
      if (this.times) {
        clearTimeout(this.times)
      }
      this.times = setTimeout(() => {
        this.getData()
      }, 500)
    },
    // 开始训练
    startTraining() {
      const { parentIds } = this.formItem
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            const { totalNum, ...params } = this.formItem
            const ids = parentIds[parentIds.length - 1]
            const splitId = ids.split('_')
            const obj = {
              subjectId: splitId[0],
              sectionId: splitId[1] ? splitId[1] : '',
              knowledgeId: splitId[2] ? splitId[2] : ''
            }
            Object.assign(params, obj)
            await comStartPracticing(params).then(res => {
              const lists = res.data
              if (splitId[0] === '2') {
                // 实操
                this.$refs.saasPracticalExercisesDialog.examInit('', lists, 'train', 0, params)
              } else {
                this.$notify.success('抽取试题成功，正在转入试卷页面')
                this.$refs.saasTestPaperDialog.init('', '综合训练', lists, params, 0)
              }
            }).catch(err => {
              console.log(err)
              this.saveLoading = false
            })
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    // 交卷，展示结果
    handPapers(id, resultData) {
      this.$refs.saasSchoolReportDialog.init(id, resultData)
    },
    // 显示解析弹框
    checkAnalysis(id) {
      this.$refs.saasAnalysisDialog.init('train', '综合训练', id, 0)
    }
  }
}
</script>

<style scoped>
.remind-txt{
  color: #333;
  font-size: 14px;
}
.modular-title{
  margin-bottom: 20px;
  padding-left: 15px;
  font-size: 18px;
  border-left: 5px solid #eee;
}
.input-time{
  margin: 0 15px;
  width: 100px;
}
.no-margin-left{
  margin-left: 0;
}
.knowledge-change{
  width: 350px;
}
.questions-config{
  margin: 15px 0;
}
.operation-btns{
  padding-left: 180px;
}

.form-box >>> .el-form-item--small .el-form-item__error{
  position: static;
  display: inline-block;
}
.not-yet-subject{
  padding: 2em 8em;
  color: #bfbfbf;
}
.question-num{
  display: inline-block;
  min-width: 40px;
  text-align: center;
}
.time-consuming{
  display: inline-block;
}
</style>
