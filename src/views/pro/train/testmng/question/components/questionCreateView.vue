<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="90%"
    >
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="160px">
        <el-form-item
          label="所属科目/章节/知识点"
          prop="selectParentIds"
          :rules="[{required: true, message:'所属科目/章节/知识点不能为空', trigger:'blur'}]"
        >
          <el-cascader
            v-model="formItem.selectParentIds"
            placeholder="请选择"
            :options="parentTree"
            clearable
          />
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
          label="题型"
          prop="choice"
          :rules="[
            {required: true, message:'题型不能为空', trigger:'blur'}
          ]"
        >
          <ti-select
            v-model="formItem.choice"
            placeholder="请选择"
            :clearable="false"
            dict-type="tibms_train_question_choice1"
            @change="choiceChange"
          />
        </el-form-item>
        <el-form-item
          label="题目内容"
          prop="mainContent"
          :rules="[
            {required: true, message:'题目内容不能为空', trigger:'blur'}
          ]"
        >
          <Ti-Ec-Editor ref="editor1" v-model="formItem.mainContent" :key="editorKey"/>
        </el-form-item>
        <el-form-item
          label="备选答案"
          prop="selectContent"
          :rules="[
            {required: true, message:'备选答案不能为空', trigger:'blur'}
          ]"
        >
          <Ti-Ec-Editor ref="editor4" v-model="formItem.selectContent"  :key="editorKey"/>
        </el-form-item>
        <el-form-item
          label="备选项数量"
          prop="selectNum"
          :rules="[
            {required: true, message:'备选项数量不能为空', trigger:'blur'}
          ]"
        >
          <el-select v-model="formItem.selectNum" placeholder="请选择" @change="selectNumChange">
            <el-option
              v-for="item in selectNums"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="参考答案"
          prop="answers"
          :rules="[
            {required: true, message:'参考答案不能为空', trigger:'blur'}
          ]"
        >
          <el-select
            v-model="formItem.answers"
            placeholder="请选择"
            multiple
            :multiple-limit="answerMultiple"
          >
            <el-option
              v-for="item in answers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="习题解析"
          prop="describe"
        >
          <Ti-Ec-Editor ref="editor3" v-model="formItem.describe"  :key="editorKey"/>
        </el-form-item>
        <el-form-item
          label="难度"
          prop="level"
          :rules="[
            {required: true, message:'难度不能为空', trigger:'blur'}
          ]"
        >
          <ti-select
            v-model="formItem.level"
            placeholder="请选择"
            dict-type="tibms_train_question_level"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById, save, update, getParentTree } from '../questionViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { cloneDeep } from 'ecip-web/utils'
import TiEcEditor from '@/views/pro/common/tiEcEditor/tiEcEditor'

export default {
  name: 'pro.train.testmng.question.questionCreateView',
  components: { TiSelect, TiEcEditor },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      edited: false,
      loading: false,
      saveLoading: false,
      editorKey: 1,
      parentTree: [],
      title: '',
      id: '',
      selectNums: [],
      answers: [],
      copyAnswers: ['A', 'B', 'C', 'D', 'E', 'F'],
      answerMultiple: 1,
      formItem: {
        selectParentIds: [],
        name: '',
        subjectId: '',
        sectionId: '',
        knowledgeId: '',
        mainContent: '',
        selectContent: '',
        selectNum: '',
        answer: '',
        answers: [],
        describe: '',
        level: '',
        type: '',
        choice: ''
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, id) {
      this.visible = true
      this.id = ''
      this.editorKey += 1
      if (id === '') {
        this.title = `新增试题`
        this.edited = false
        this.$nextTick(async() => {
          try {
            this.loading = true
            this.render(tenantId, appId)

            const res = await getParentTree({ subjectId: 1 })
            this.parentTree = res.data
            this.formItem.type = '1'
            this.formItem.mainContent = ''
            this.formItem.selectContent = ''
            this.formItem.describe = ''
            this.selectNums = []
            this.answers = []
            this.formItem.answers = []
            this.formItem.selectNum = ''
          } finally {
            this.loading = false
          }
        })
      } else {
        this.id = id
        this.title = `修改试题`
        this.edited = true

        this.$nextTick(async() => {
          try {
            this.loading = true
            this.formItem.selectParentIds = []
            const res = await getParentTree({ subjectId: 1 })
            this.parentTree = res.data

            const { data } = await getById(id)
            this.render(tenantId, appId)

            // 当有数据时才去加载弹框
            this.choiceChange(data.choice + '')
            this.selectNumChange(data.selectNum + '')
            cloneDeep(this.formItem, data)
            this.formItem.answers = this.formItem.answer.split(',')
            this.formItem.type = data.type + ''
            this.formItem.choice = data.choice + ''
            this.formItem.level = data.level + ''
            const selectParentIds = []
            selectParentIds.push(data.subjectId + '')
            selectParentIds.push(data.subjectId + '_' + data.sectionId)
            selectParentIds.push(data.subjectId + '_' + data.sectionId + '_' + data.knowledgeId)
            this.formItem.selectParentIds = selectParentIds
          } finally {
            this.loading = false
          }
        })
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
    choiceChange(val) {
      this.selectNums = []
      this.answers = []
      // 重置选择数量信息
      this.formItem.selectNum = ''
      // 重置答案信息
      this.formItem.answers = []
      if (val !== '' || undefined !== val) {
        let n = 6
        if (val === '3') {
          n = 2
        }

        let i = 2
        while (i <= n) {
          this.selectNums.push({
            value: i,
            label: i
          })
          i++
        }

        this.answerMultiple = 1
        if (val === '2') {
          this.answerMultiple = n
        }
      }
    },
    selectNumChange(val) {
      // 重置答案信息，答案个数根据备选数量进行填充
      this.answers = []
      this.formItem.answers = []
      if (val !== '' || undefined !== val) {
        let j = 0
        while (j < val) {
          this.answers.push({
            value: this.copyAnswers[j],
            label: this.copyAnswers[j]
          })
          j++
        }
      }
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            const parentIds = this.formItem.selectParentIds[2].split('_')
            this.formItem.subjectId = parentIds[0]
            this.formItem.sectionId = parentIds[1]
            this.formItem.knowledgeId = parentIds[2]
            this.formItem.answer = this.formItem.answers.join(',')

            if (this.id === '') {
              await save(this.formItem)
              this.$notify.success('保存试题成功')
            } else {
              await update(this.formItem)
              this.$notify.success('更新试题成功')
            }

            this.$emit('refreshData')
            this.detailVisible = false
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
