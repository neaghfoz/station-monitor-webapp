<template>
  <div class="app-container">
    <div class="exam-title">{{ examInfo.name }}</div>

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
        label="绑定正式考试试卷"
        prop="testPaperId"
        :rules="[
          {required: true, message:'试卷ID不能为空', trigger:'blur'}
        ]"
      >
        <el-tooltip class="bind-exam" effect="dark" :content="tips.componentTip" placement="bottom">
          <el-input v-model="formItem.testPaperId" type="text" placeholder="试卷ID" />
        </el-tooltip>
        <el-button type="primary" @click="showExam">试卷</el-button>
      </el-form-item>

      <el-form-item
        label="正式考试开启时间"
        prop="startTestTime"
        :rules="[
          {required: true, message:'请选择开启时间', trigger:'change'},
          { validator: ((rule, value, callback) => { validateChange(rule, value, callback) }), trigger: 'change' }
        ]"
      >
        <ec-date-range v-model="formItem" begin-key="startTestTime" end-key="endTestTime" format="yyyy-MM-dd HH:mm:ss" date-type="datetimerange" start-placeholder="起始时间" end-placeholder="结束时间" />
      </el-form-item>

      <el-form-item>
        <el-button v-permission="['train:exam:num:scope']" type="primary" :loading="saveLoading" @click="save">提交</el-button>
      </el-form-item>
    </el-form>

    <ChooseExam ref="saasExamDialog" @refreshDataList="getData" @testPaperData="getTestPaperId" />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
// import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
// import moment from 'moment'
import { getById, settingScope } from './examnumViewApi'
import ChooseExam from './components/chooseExamView'

export default {
  name: 'TrianDesignExamnumExamRangeView',
  components: { ChooseExam },
  mixins: [...mixin],
  data() {
    return {
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      formItem: {
        id: '',
        testPaperId: '',
        endTestTime: '',
        startTestTime: ''
      },
      examInfo: {
        name: '',
        subjectName: '',
        type: ''
      },
      tips: {
        componentTip: '请在试卷管理处查看试卷ID，将数字ID填写在这里，多个请用英文逗号（,）隔开。留空或填0时将无法进行该项考试。'
      }
    }
  },
  activated: function() {
    Object.assign(this.formItem, this.$route.query)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.$refs['form'].resetFields()
      this.getData()
    },
    async getData() {
      this.loading = false
      try {
        this.loading = true
        const { data } = await getById(this.formItem.id)
        Object.assign(this.examInfo, data)
      } finally {
        this.loading = false
      }
    },
    validateChange(rule, value, callback) {
      if (this.formItem.endTestTime === this.formItem.startTestTime) {
        callback(new Error('考试起止时间不能一致'))
      } else {
        callback()
      }
    },
    save() {
      this.$refs.form.validate(async valid => {
        console.log(valid)
        if (valid) {
          try {
            this.saveLoading = true
            const { id, ...params } = this.formItem
            await settingScope(this.formItem.id, params)
            this.$notify.success('保存成功')
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    getTestPaperId(ids) {
      this.formItem.testPaperId = Number(ids)
    },
    // 打开试卷选择
    showExam() {
      this.$refs.saasExamDialog.init({ 'subjectId': this.examInfo.subjectId })
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
