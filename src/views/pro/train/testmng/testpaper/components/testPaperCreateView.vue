<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="75%"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="160px">
        <el-form-item
          label="试卷名称"
          prop="name"
          :rules="[
            {required: true, message:'试卷名称不能为空', trigger:'blur'},
            {max: 100, message:'试卷名称长度应在1-100字之间', trigger:'blur'}]"
        >
          <el-input
            v-model="formItem.name"
            type="text"
            placeholder="试卷名称"
          />
        </el-form-item>
        <el-form-item
          label="所属科目/章节/知识点"
          prop="selectParentIds"
          :rules="[{required: true, message:'所属科目/章节/知识点不能为空', trigger:'blur'}]"
        >
          <el-cascader
            :key="selectParentIdsKey"
            v-model="formItem.selectParentIds"
            placeholder="请选择"
            :options="parentTree"
            :props="{ checkStrictly: true }"
            clearable
            @change="changeParentIds"
          />
        </el-form-item>
        <el-form-item
          label="组卷模式"
          prop="combine"
          :rules="[{required: true, message:'组卷模式不能为空', trigger:'blur'}]"
        >
          <ti-select
            v-model="formItem.combine"
            placeholder="请选择"
            :disabled="edited"
            dict-type="tibms_train_test_combine"
            @change="changeCombine"
          />
        </el-form-item>
        <el-form-item
          label="考试时间"
          prop="examTime"
          :rules="[{required: true, message:'考试时间不能为空', trigger:'blur'}]"
        >
          <el-input-number
            v-model="formItem.examTime"
            :precision="0"
            :min="1"
            :max="1440"
            :step="1"
            placeholder="考试时间"
          />分钟
        </el-form-item>
        <el-form-item
          label="试卷总分"
        >
          <el-input-number
            v-model="calTotalPoint"
            :precision="0"
            :disabled="true"
            :min="0"
            placeholder="试卷总分"
          />分
        </el-form-item>
        <el-form-item
          label="及格分"
          prop="passPoint"
          :rules="[{required: true, message:'及格分不能为空', trigger:'blur'}]"
        >
          <el-input-number
            v-model="formItem.passPoint"
            :precision="0"
            :min="1"
            :step="1"
            placeholder="及格分"
          />分
        </el-form-item>
        <el-form-item
          label="题型分类"
          prop="type"
          :rules="[
            {required: true, message:'题型分类不能为空', trigger:'blur'}
          ]"
        >
          <ti-select
            v-model="formItem.type"
            disabled
            placeholder="请选择"
            dict-type="tibms_train_question_type"
          />
        </el-form-item>
        <el-form-item
          label="题型排序"
          prop="questionTypeSorts"
        >
          <el-table
            v-loading="sortLoading"
            :key="questionTypeKey"
            :data="questionTypeSorts"
            style="width: 60%"
          >
            <el-table-column
              prop="choiceText"
              label="题型名称"
              width="200"
            />
            <el-table-column
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="upClick(scope.row)">上移</el-button>
                <el-button type="text" size="small" @click="downClick(scope.row)">下移</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div v-loading="itemLoading" v-show="formItem.combine != '' && formItem.selectParentIds.length !== 0">
          <div v-for="(item,i) in formItem.manualQuestionTypeArr" v-show="formItem.combine === '2' && formItem.selectParentIds.length !== 0" :key="i">
            <label class="el-form-item__label" style="width: 160px;">{{ item.choiceText }}</label>
            <p layout="inline">共
              <el-input-number
                v-model="formItem.manualQuestionTypeArr[i].nums"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              /> 题
              <span v-show="formItem.selectParentIds[0] === '1'">每题</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '1'"
                v-model="formItem.manualQuestionTypeArr[i].points"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '1'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">每题操作分</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.manualQuestionTypeArr[i].operPoints"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">耗时分</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.manualQuestionTypeArr[i].timePoints"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">耗时</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.manualQuestionTypeArr[i].time"
                style="width:150px"
                :precision="0"
                :min="0"
                :max="86400"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">秒 </span>
              <el-button @click="selectQuestions(item.type, item.choice)">选择试题</el-button>
              已选 <span style="color:#0088cc;">{{ formItem.manualQuestionTypeArr[i].questionIds.length }}</span> 题
            </p>
          </div>
          <div v-for="(item,i) in formItem.randomQuestionTypeArr" v-show="formItem.combine === '1' && formItem.selectParentIds.length !== 0" :key="i">
            <label class="el-form-item__label" style="width: 160px;">{{ item.choiceText }}</label>
            <p layout="inline" style="margin-left:160px;">共
              <el-input-number
                v-model="formItem.randomQuestionTypeArr[i].nums"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />题
              <span v-show="formItem.selectParentIds[0] === '1'">每题</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '1'"
                v-model="formItem.randomQuestionTypeArr[i].points"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '1'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">每题操作分</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.randomQuestionTypeArr[i].operPoints"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">耗时分</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.randomQuestionTypeArr[i].timePoints"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">分 </span>
              <span v-show="formItem.selectParentIds[0] === '2'">耗时</span>
              <el-input-number
                v-show="formItem.selectParentIds[0] === '2'"
                v-model="formItem.randomQuestionTypeArr[i].time"
                style="width:150px"
                :precision="0"
                :min="0"
                :max="86400"
                :step="1"
              />
              <span v-show="formItem.selectParentIds[0] === '2'">秒 </span>
              <br />
              <br />
              易(<span style="color:#0088cc;">{{ formItem.randomQuestionTypeArr[i].easyNum }}题</span>)
              <el-input-number
                v-model="formItem.randomQuestionTypeArr[i].easy"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              /> 题
              中(<span style="color:#0088cc;">{{ formItem.randomQuestionTypeArr[i].mediumNum }}题</span>)
              <el-input-number
                v-model="formItem.randomQuestionTypeArr[i].medium"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              /> 题
              难(<span style="color:#0088cc;">{{ formItem.randomQuestionTypeArr[i].hardNum }}题</span>)
              <el-input-number
                v-model="formItem.randomQuestionTypeArr[i].hard"
                style="width:105px"
                :precision="0"
                :min="0"
                :max="100"
                :step="1"
              /> 题
            </p>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>

    <select-question ref="selectQuestionDialog" @refreshData="refleshSelectQuestion" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById, getParentTree, save, update } from '../testPaperViewApi'
import { getCount as getQuestionCount } from '../../question/questionViewApi'
import { list as questionTypeList } from '../../../design/questiontype/questionTypeViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import selectQuestion from '../../question/components/selectQuestionView'
import { cloneDeep } from 'ecip-web/utils'

export default {
  name: 'pro.train.testmng.testpaper.testPaperCreateView',
  components: { TiSelect, selectQuestion },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      edited: false,
      loading: false,
      sortLoading: false,
      itemLoading: false,
      saveLoading: false,
      parentTree: [],
      title: '',
      id: '',
      questionTypeSorts: [],
      questionTypeKey: 0,
      selectParentIdsKey: 0,
      formItem: {
        selectParentIds: [],
        name: '',
        subjectId: '',
        sectionId: '',
        knowledgeId: '',
        combine: '',
        examTime: 60,
        totalPoint: '',
        passPoint: '',
        type: '',
        questionTypeSort: '',
        manualQuestionTypeArr: [],
        randomQuestionTypeArr: [],
        questions: [],
        questionTypePoints: ''
      }
    }
  },
  computed: {
    calTotalPoint: {
      get: function() {
        let sumPoints = 0
        if (this.formItem.selectParentIds.length === 0) {
          return sumPoints
        }
        if (this.formItem.combine === '2') {
          for (const i in this.formItem.manualQuestionTypeArr) {
            const items = this.formItem.manualQuestionTypeArr[i]
            if (this.formItem.selectParentIds[0] === '1') {
              sumPoints += items.nums * items.points
            } else {
              sumPoints += items.nums * (items.operPoints + items.timePoints)
            }
          }
        } else {
          for (const i in this.formItem.randomQuestionTypeArr) {
            const items = this.formItem.randomQuestionTypeArr[i]
            if (this.formItem.selectParentIds[0] === '1') {
              sumPoints += items.nums * items.points
            } else {
              sumPoints += items.nums * (items.operPoints + items.timePoints)
            }
          }
        }
        return sumPoints
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, id) {
      this.visible = true
      this.id = ''
      if (id === '') {
        this.title = `新增试卷`
        this.edited = false
        this.$nextTick(async() => {
          try {
            this.loading = true
            this.render(tenantId, appId)

            this.questionTypeSorts = []
            this.questionTypeKey += 1
            const parentResult = await getParentTree({})
            this.parentTree = parentResult.data
            this.selectParentIdsKey += 1
          } finally {
            this.loading = false
          }
        })
      } else {
        this.id = id
        this.title = `修改试卷`
        this.edited = true
        this.loading = true

        this.$nextTick(async() => {
          try {
            const { data } = await getById(id)
            const parentResult = await getParentTree({ subjectId: data.subjectId })
            this.parentTree = parentResult.data
            this.selectParentIdsKey += 1
            this.render(tenantId, appId)

            // 当有数据时才去加载弹框
            cloneDeep(this.formItem, data)
            this.formItem.type = data.type + ''
            this.formItem.choice = data.choice + ''
            this.formItem.combine = data.combine + ''
            this.formItem.subjectId = data.subjectId + ''
            this.formItem.totalPoint = data.totalPoints / 100
            this.formItem.passPoint = data.passPoints / 100
            this.formItem.selectParentIds = []
            const selectParentIds = []
            selectParentIds.push(data.subjectId + '')
            if (data.sectionId) {
              selectParentIds.push(data.subjectId + '_' + data.sectionId)
            }

            if (data.knowledgeId) {
              selectParentIds.push(data.subjectId + '_' + data.sectionId + '_' + data.knowledgeId)
            }
            this.formItem.selectParentIds = selectParentIds

            const res = await questionTypeList(this.formItem.type)
            const querySorts = res.data
            const sort = data.questionTypeSort.split(',')

            const result = []
            // 按数据库的顺序排序
            for (const si in sort) {
              for (const qsi in querySorts) {
                if (sort[si] === querySorts[qsi].choice + '') {
                  result.push(querySorts[qsi])
                  break
                }
              }
            }
            this.questionTypeSorts = result

            // 按界面顺序排序
            const pointsTmp = this.formItem.questionTypePoints.split(',')
            for (const qsi in querySorts) {
              for (const si in sort) {
                if (sort[si] === querySorts[qsi].choice + '') {
                  const points = pointsTmp[si].split(':')

                  if (this.formItem.combine === '2') {
                    let questionIds = data.choiceQuestion[querySorts[qsi].type + '-' + querySorts[qsi].choice]
                    if (undefined === questionIds) {
                      questionIds = []
                    }

                    if (this.formItem.selectParentIds[0] === '1') {
                      this.formItem.manualQuestionTypeArr.push({
                        choice: querySorts[qsi].choice,
                        choiceText: querySorts[qsi].choiceText,
                        type: querySorts[qsi].type,
                        questionIds: questionIds,
                        nums: parseInt(points[0]),
                        points: parseInt(points[1]) / 100
                      })
                    } else {
                      const detailPoints = points[1].split(';')
                      this.formItem.manualQuestionTypeArr.push({
                        choice: querySorts[qsi].choice,
                        choiceText: querySorts[qsi].choiceText,
                        type: querySorts[qsi].type,
                        questionIds: questionIds,
                        nums: parseInt(points[0]),
                        operPoints: parseInt(detailPoints[0]) / 100,
                        timePoints: parseInt(detailPoints[1]) / 100,
                        time: parseInt(detailPoints[2])
                      })
                    }
                  } else {
                    const nums = points[0].split(';')
                    if (this.formItem.selectParentIds[0] === '1') {
                      this.formItem.randomQuestionTypeArr.push({
                        choice: querySorts[qsi].choice,
                        choiceText: querySorts[qsi].choiceText,
                        type: querySorts[qsi].type,
                        nums: parseInt(nums[0]) + parseInt(nums[1]) + parseInt(nums[2]),
                        points: parseInt(points[1]) / 100,
                        easy: parseInt(nums[0]),
                        easyNum: 0,
                        medium: parseInt(nums[1]),
                        mediumNum: 0,
                        hard: parseInt(nums[2]),
                        hardNum: 0
                      })
                    } else {
                      const detailPoints = points[1].split(';')
                      this.formItem.randomQuestionTypeArr.push({
                        choice: querySorts[qsi].choice,
                        choiceText: querySorts[qsi].choiceText,
                        type: querySorts[qsi].type,
                        nums: parseInt(nums[0]) + parseInt(nums[1]) + parseInt(nums[2]),
                        operPoints: parseInt(detailPoints[0]) / 100,
                        timePoints: parseInt(detailPoints[1]) / 100,
                        time: parseInt(detailPoints[2]),
                        easy: parseInt(nums[0]),
                        easyNum: 0,
                        medium: parseInt(nums[1]),
                        mediumNum: 0,
                        hard: parseInt(nums[2]),
                        hardNum: 0
                      })
                    }
                  }
                  break
                }
              }
            }

            await this.checkCount()
          } finally {
            this.loading = false
          }
        })
      }
    },
    getNewQuestionType: async function() {
      try {
        this.itemLoading = true
        this.sortLoading = true
        const res = await questionTypeList(this.formItem.type)
        this.questionTypeSorts = res.data
        for (const item in res.data) {
          this.formItem.manualQuestionTypeArr.push({
            choice: res.data[item].choice,
            choiceText: res.data[item].choiceText,
            type: res.data[item].type,
            questionIds: [],
            nums: 0,
            points: 0,
            operPoints: 0,
            timePoints: 0,
            time: 0
          })

          this.formItem.randomQuestionTypeArr.push({
            choice: res.data[item].choice,
            choiceText: res.data[item].choiceText,
            type: res.data[item].type,
            easy: 0,
            easyNum: 0,
            medium: 0,
            mediumNum: 0,
            hard: 0,
            hardNum: 0,
            nums: 0,
            points: 0,
            operPoints: 0,
            timePoints: 0,
            time: 0
          })
        }

        await this.checkCount()
      } finally {
        this.itemLoading = false
        this.sortLoading = false
      }
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$refs.form.clearValidate()
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    getData: function() {
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.calTotalPoint * 1 < this.formItem.passPoint * 1) {
            this.$notify.warning('总分不能小于及格线!')
            return
          }

          try {
            const sort = []
            const points = []
            this.formItem.questions = []
            let sumPoints = 0
            let totalTime = 0
            for (const s in this.questionTypeSorts) {
              sort.push(this.questionTypeSorts[s].choice)

              if (this.formItem.combine === '2') {
                for (const i in this.formItem.manualQuestionTypeArr) {
                  const items = this.formItem.manualQuestionTypeArr[i]
                  if (this.questionTypeSorts[s].choice === items.choice) {
                    if (items.nums * 1 !== items.questionIds.length) {
                      this.$notify.warning(items.choiceText + '已选择题型数和填写总数不一致')
                      return
                    }
                    if (items.nums * 1 > 100) {
                      this.$notify.warning(items.choiceText + '题数大于100')
                      return
                    }
                    if (this.formItem.selectParentIds[0] === '1') {
                      if (items.nums * 1 > 0 && (items.points * 1 <= 0 || items.points * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '分数必须在1-100之间')
                        return
                      }
                      points.push(items.nums + ':' + (items.points * 100))
                      sumPoints += items.nums * items.points
                    } else {
                      if (items.nums * 1 > 0 && (items.operPoints * 1 <= 0 || items.operPoints * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '操作分数必须在1-100之间')
                        return
                      }
                      if (items.nums * 1 > 0 && (items.timePoints * 1 <= 0 || items.timePoints * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '耗时分数必须在1-100之间')
                        return
                      }
                      if (items.nums * 1 > 0 && items.time * 1 <= 0) {
                        this.$notify.warning(items.choiceText + '耗时必须大于0')
                        return
                      }
                      points.push(items.nums + ':' + (items.operPoints * 100) + ';' + (items.timePoints * 100) + ';' + items.time)
                      totalTime += items.nums * items.time
                      sumPoints += items.nums * (items.operPoints + items.timePoints)
                    }

                    for (const j in items.questionIds) {
                      const item = items.questionIds[j]
                      this.formItem.questions.push({
                        questionId: item,
                        type: items.type,
                        choice: items.choice,
                        typeSorts: this.formItem.questionTypeSort
                      })
                    }
                  }
                }

                // 判断实操耗时和考试时间
                if (this.formItem.selectParentIds[0] === '2' && totalTime > this.formItem.examTime * 60) {
                  this.$notify.warning('总耗时大于考试时间')
                  return
                }
              } else {
                for (const i in this.formItem.randomQuestionTypeArr) {
                  const items = this.formItem.randomQuestionTypeArr[i]
                  if (this.questionTypeSorts[s].choice === items.choice) {
                    if (items.easy * 1 < 0 || items.medium * 1 < 0 || items.hard * 1 < 0) {
                      this.$notify.warning(items.choiceText + '已选择题型数小于0')
                      return
                    }
                    if (items.nums * 1 !== (items.easy * 1 + items.medium * 1 + items.hard * 1)) {
                      this.$notify.warning(items.choiceText + '已选择题型数和填写总数不一致')
                      return
                    }
                    if (items.nums * 1 > 100) {
                      this.$notify.warning(items.choiceText + '题数大于100')
                      return
                    }
                    if (this.formItem.selectParentIds[0] === '1') {
                      points.push(items.easy + ';' + items.medium + ';' + items.hard + ':' + (items.points * 100))
                      sumPoints += items.nums * items.points
                      if (items.nums * 1 > 0 && (items.points * 1 <= 0 || items.points * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '分数必须在1-100之间')
                        return
                      }
                    } else {
                      points.push(items.easy + ';' + items.medium + ';' + items.hard + ':' + (items.operPoints * 100) + ';' + (items.timePoints * 100) + ';' + items.time)
                      totalTime += items.nums * items.time
                      sumPoints += items.nums * (items.operPoints + items.timePoints)
                      if (items.nums * 1 > 0 && (items.operPoints * 1 <= 0 || items.operPoints * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '操作分数必须在1-100之间')
                        return
                      }
                      if (items.nums * 1 > 0 && (items.timePoints * 1 <= 0 || items.timePoints * 1 > 100)) {
                        this.$notify.warning(items.choiceText + '耗时分数必须在1-100之间')
                        return
                      }
                      if (items.nums * 1 > 0 && items.time * 1 <= 0) {
                        this.$notify.warning(items.choiceText + '耗时必须大于0')
                        return
                      }
                    }
                    if (items.easy * 1 > items.easyNum) {
                      this.$notify.warning(items.choiceText + '填写难度（易）题型数超过当前试题数')
                      return
                    }
                    if (items.medium * 1 > items.mediumNum) {
                      this.$notify.warning(items.choiceText + '填写难度（中）题型数超过当前试题数')
                      return
                    }
                    if (items.hard * 1 > items.hardNum) {
                      this.$notify.warning(items.choiceText + '填写难度（难）题型数超过当前试题数')
                      return
                    }
                  }
                }

                // 判断实操耗时和考试时间
                if (this.formItem.selectParentIds[0] === '2' && totalTime > this.formItem.examTime * 60) {
                  this.$notify.warning('总耗时大于考试时间')
                  return
                }
              }
            }

            let parentIds = []
            if (this.formItem.selectParentIds.length > 2) {
              parentIds = this.formItem.selectParentIds[2].split('_')
              this.formItem.knowledgeId = parentIds[2]
            } else {
              this.formItem.knowledgeId = ''
            }

            if (this.formItem.selectParentIds.length > 1) {
              parentIds = this.formItem.selectParentIds[1].split('_')
              this.formItem.sectionId = parentIds[1]
            } else {
              this.formItem.sectionId = ''
            }
            parentIds = this.formItem.selectParentIds[0].split('_')
            this.formItem.subjectId = parentIds[0]

            this.formItem.questionTypeSort = sort.join(',')
            this.formItem.questionTypePoints = points.join(',')
            this.formItem.totalPoints = this.calTotalPoint * 100
            this.formItem.passPoints = this.formItem.passPoint * 100

            this.saveLoading = true

            if (this.id === '') {
              await save(this.formItem)
              this.$notify.success('保存试卷成功')
            } else {
              await update(this.formItem)
              this.$notify.success('更新试卷成功')
            }

            this.$emit('refreshData')
            this.detailVisible = false
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    upClick(row) {
      const sorts = this.questionTypeSorts
      let i = 0
      for (i = 0; i < sorts.length; i++) {
        if (sorts[i].choice === row.choice) {
          break
        }
      }

      if (i === 0) {
        return
      } else {
        const tmp = sorts[i]
        sorts[i] = sorts[i - 1]
        sorts[i - 1] = tmp
      }
      this.questionTypeSorts = sorts
      this.questionTypeKey += 1
    },
    downClick(row) {
      const sorts = this.questionTypeSorts
      let i = 0
      for (i = 0; i < sorts.length; i++) {
        if (sorts[i].choice === row.choice) {
          break
        }
      }

      if (i === sorts.length - 1) {
        return
      } else {
        const tmp = sorts[i]
        sorts[i] = sorts[i + 1]
        sorts[i + 1] = tmp
      }
      this.questionTypeSorts = sorts
      this.questionTypeKey += 1
    },
    selectQuestions(type, choice) {
      let ids = []
      for (let i = 0; i < this.formItem.manualQuestionTypeArr.length; i++) {
        const item = this.formItem.manualQuestionTypeArr[i]
        if (item.type === type && item.choice === choice) {
          ids = [].concat(item.questionIds)
          break
        }
      }
      this.$refs.selectQuestionDialog.init(this.formItem.selectParentIds, type, choice, ids)
    },
    refleshSelectQuestion(type, choice, questionIds) {
      for (let i = 0; i < this.formItem.manualQuestionTypeArr.length; i++) {
        const item = this.formItem.manualQuestionTypeArr[i]
        if (item.type === type && item.choice === choice) {
          this.formItem.manualQuestionTypeArr[i].questionIds = questionIds
          break
        }
      }
    },
    async changeParentIds(val) {
      for (let i = 0; i < this.formItem.manualQuestionTypeArr.length; i++) {
        this.formItem.manualQuestionTypeArr[i].questionIds = []
      }

      const subjectId = this.formItem.selectParentIds[0]
      if (subjectId !== this.formItem.subjectId) {
        this.formItem.subjectId = subjectId
        this.formItem.randomQuestionTypeArr = []
        this.formItem.manualQuestionTypeArr = []
        if (subjectId === '1') {
          this.formItem.type = '1'
          this.getNewQuestionType()
        } else if (subjectId === '2') {
          this.formItem.type = '2'
          this.getNewQuestionType()
        } else {
          this.formItem.type = ''
        }
      } else {
        try {
          this.itemLoading = true
          await this.checkCount()
        } finally {
          this.itemLoading = false
        }
      }
    },
    async changeCombine(val) {
      try {
        this.itemLoading = true
        await this.checkCount()
      } finally {
        this.itemLoading = false
      }
    },
    async checkCount() {
      if (this.formItem.selectParentIds.length !== 0 && this.formItem.combine === '1') {
        const obj = {}
        obj.subjectId = this.formItem.selectParentIds[0]
        if (this.formItem.selectParentIds.length > 1) {
          obj.sectionId = this.formItem.selectParentIds[1].split('_')[1]
        }
        if (this.formItem.selectParentIds.length > 2) {
          obj.knowledgeId = this.formItem.selectParentIds[2].split('_')[2]
        }
        obj.type = this.formItem.type
        const res = await getQuestionCount(obj)
        const result = {}
        for (let j = 0; j < res.data.length; j++) {
          result[res.data[j].choice + '-' + res.data[j].level] = res.data[j].num
        }

        for (let i = 0; i < this.formItem.randomQuestionTypeArr.length; i++) {
          const item = this.formItem.randomQuestionTypeArr[i]
          const easy = undefined === result[item.choice + '-1'] ? 0 : result[item.choice + '-1']
          const medium = undefined === result[item.choice + '-2'] ? 0 : result[item.choice + '-2']
          const hard = undefined === result[item.choice + '-3'] ? 0 : result[item.choice + '-3']
          item.easyNum = easy
          item.mediumNum = medium
          item.hardNum = hard
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
