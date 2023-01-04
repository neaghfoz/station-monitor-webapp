<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="90%"
    >
      <p v-for="(selects, si) in choices" :key="si">
        <span class="choice-title">{{ selects.choiceText }}</span>
        <el-card v-for="(item,index) in selects.questions" :key="index" shadow="never" class="subject-card">
          <div slot="header" class="clearfix">
            <span class="serial-num">{{ index + 1 }}</span>
          </div>
          <div class="subject-title" v-html="formatterCont(item.mainContent)" />
          <div v-show="item.subjectId === 1"><el-divider /></div>
          <div v-show="item.subjectId === 1" v-html="formatterCont(item.selectContent)" />

          <div v-show="item.subjectId === 1"><el-divider /></div>
          <div v-show="item.subjectId === 1">
            <h5>答案</h5>
            <p>{{ item.answer }}</p>
          </div>
          <el-divider />
          <div>
            <h5>解析</h5>
            <div v-html="formatterCont(item.describe)" />
          </div>
        </el-card>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { getQuestionById } from '../testPaperViewApi'

export default {
  name: 'pro.train.testmng.testpaper.components.testPaperQuestionView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      title: '',
      testPaperId: '',
      testPaperName: '',
      choices: []
    }
  },
  methods: {
    init(row) {
      this.title = '试卷（' + row.name + '）试题'
      this.visible = true
      this.choices = []
      this.getData(row.id)
    },
    async getData(testPaperId) {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      getQuestionById(testPaperId).then(res => {
        this.questions = res.data
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i]
          let qarr = []
          if (this.choices.length === 0 || this.choices[this.choices.length - 1].choice !== item.choice) {
            this.choices.push(
              {
                choice: item.choice,
                choiceText: item.choiceText,
                questions: qarr
              }
            )
          } else {
            qarr = this.choices[this.choices.length - 1].questions
          }
          qarr.push(item)
        }
        this.loading = false
      })
    },
    formatterCont(txt) {
      if (txt) {
        const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
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
.choice-title {
  font-size: 18px;
}
.subject-card {
  margin-top: 10px;
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
</style>
