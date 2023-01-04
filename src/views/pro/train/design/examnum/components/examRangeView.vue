<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <!-- <div class="exam-title">{{examInfo.name}}</div> -->

      <el-row :gutter="15" class="info-box">
        <el-col :span="8"><div class="info-item">场次名称：{{ examInfo.name }}</div></el-col>
        <el-col :span="8"><div class="info-item">科目：{{ examInfo.subjectName }}</div></el-col>
        <el-col :span="8"><div class="info-item">考试模式：{{ examInfo.examTypeName }}</div></el-col>
      </el-row>

      <el-form ref="form" v-loading="loading" status-icon :model="formItem" label-width="200px">
        <!-- <el-form-item label="正式考试试题排序" prop="type" :rules="[{ required: true, message: '不能为空', trigger: 'blur'}]">
          <ec-radio-group v-model="formItem.type" :ec-data="[{ value: 0, label: '不打乱试题排序' }, { value: 1, label: '打乱试题排序' }]" />
        </el-form-item>  -->

        <el-form-item
          label="绑定考试试卷"
          prop="testPaperId"
          :rules="[
            {required: true, message:'试卷ID不能为空', trigger:'blur'}
          ]"
        >
          <el-tooltip class="bind-exam" effect="dark" :content="tips.componentTip" placement="bottom">
            <el-input v-model="testPaper" type="text" placeholder="试卷ID" disabled clearable />
          </el-tooltip>
          <el-button v-show="!this.oldTestPaperId && !examInfo.testPersonNum" type="primary" @click="showExam">试卷</el-button>
        </el-form-item>

        <el-form-item
          label="考试开启时间"
          prop="startTestTime"
          :rules="[
            {required: true, message:'请选择开启时间', trigger:'change'},
            { validator: ((rule, value, callback) => { validateChange(rule, value, callback) }), trigger: 'change' }
          ]"
        >
          <ec-date-range v-model="formItem" begin-key="startTestTime" end-key="endTestTime" format="yyyy-MM-dd HH:mm:ss" date-type="datetimerange" start-placeholder="起始时间" end-placeholder="结束时间" />
        </el-form-item>

        <!-- <el-form-item>
          <el-button v-permission="['train:exam:num:scope']" type="primary" :loading="saveLoading"  @click="save">提交</el-button>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-permission="['train:exam:num:scope']" type="primary" :loading="saveLoading" @click="save">提交</el-button>
      </span>
    </el-dialog>
    <ChooseExam ref="saasExamDialog" @refreshDataList="getData" @testPaperData="getTestPaperId" />
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
// import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import { getById, settingScope } from './../examnumViewApi'
import ChooseExam from './chooseExamView'

export default {
  name: 'VueExamnumExamRange',
  components: { ChooseExam },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '考试范围',
      queryParams: {},
      oldTestPaperId: '',
      formItem: {
        testPaperId: '',
        testPaperName: '',
        endTestTime: '',
        startTestTime: ''
      },
      examInfo: {
        name: '',
        subjectName: '',
        type: ''
      },
      tips: {
        componentTip: '请在试卷管理处查看试卷ID，选择试卷。留空时将无法进行该项考试。',
        componentTip2: '请在试卷管理处查看试卷ID，将数字ID填写在这里，多个请用英文逗号（,）隔开。留空或填0时将无法进行该项考试。'
      },
      examTime: 0
    }
  },
  computed: {
    testPaper(val) {
      const txt = this.formItem.testPaperId ? `[${this.formItem.testPaperId}] ${this.formItem.testPaperName}` : ''
      return txt
    }
  },
  methods: {
    init(item) {
      Object.assign(this.queryParams, { id: item.id })
      this.visible = true
      this.examTime = 0
      this.examInfo = {
        name: '',
        subjectName: '',
        type: ''
      }
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.formItem.testPaperId = item.testPaperId || ''
        this.oldTestPaperId = item.testPaperId || ''
        this.formItem.testPaperName = item.testPaperName || ''
        this.formItem.startTestTime = item.startTestTime ? moment(item.startTestTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formItem.endTestTime = item.endTestTime ? moment(item.endTestTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.getData()
      })
    },
    validateChange(rule, value, callback) {
      const { formItem, examTime, examInfo } = this
      if (formItem.endTestTime === formItem.startTestTime) {
        callback(new Error('考试起止时间不能一致'))
      } else if (examTime) {
        const startT = (new Date(formItem.startTestTime)).getTime()
        const endT = (new Date(formItem.endTestTime)).getTime()
        const totalTime = endT - startT
        if (totalTime < examTime * 60000) {
          callback(new Error(`考试时间范围必须大于试卷的考试时间,所选试卷考试时间为${examTime}分钟`))
        } else if (formItem.testPaperId && examInfo.testPersonNum) {
          // 当有绑定试卷，且已有人员参与考试，试卷固定不可修改
          const startString = moment(examInfo.startTestTime).format('YYYY-MM-DD HH:mm:ss')
          const endString = moment(examInfo.endTestTime).format('YYYY-MM-DD HH:mm:ss')
          if (formItem.startTestTime <= startString && formItem.endTestTime >= endString) {
            callback()
          } else {
            callback(new Error(`考试时间范围必须包含原考试时间范围（${startString} ~ ${endString}）在内`))
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    async getData() {
      this.loading = true
      try {
        const { data } = await getById(this.queryParams.id)
        Object.assign(this.examInfo, data)
        this.examTime = data.examTime || 0
      } finally {
        this.loading = false
      }
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            await settingScope(this.queryParams.id, this.formItem)
            this.$notify.success('保存成功')
            this.$emit('refreshData')
            this.visible = false
            this.examInfo = {
              name: '',
              subjectName: '',
              type: ''
            }
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    getTestPaperId(ids, name, radioItem) {
      if (ids !== '' && ids !== 0) {
        this.formItem.testPaperId = Number(ids)
        this.formItem.testPaperName = name
        this.examTime = radioItem.examTime
      }
    },
    // 打开试卷选择
    showExam() {
      this.$refs.saasExamDialog.init({ 'subjectId': this.examInfo.subjectId, 'testPaperId': this.formItem.testPaperId, 'name': this.formItem.testPaperName })
    }
  }
}
</script>

<style lang="scss" scoped>
  .exam-title{
    padding: 8px;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid #dddddd;
  }
  .info-box{
    margin-bottom: 20px;
  }
  .info-item{
    padding: 8px;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .bind-exam{
    margin-right: 15px;
    width: 400px;
  }
</style>
