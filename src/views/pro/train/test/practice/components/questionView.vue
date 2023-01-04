<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="500"
    >
      <el-row v-loading="loading" class="knowledge-total">
        <el-col><div class="knowledge-name">{{ queryParams.knowledgeName }}</div></el-col>
        <el-col
          v-for="(item,index) in dataList"
          :key="index"
          :span="12"
        >
          <div class="knowledge-item">
            {{ item.choiceText }}（共{{ item.num }}题）
            <el-button v-permission="['train:question:findPage']" :disabled="item.num <= 0" type="primary" @click="toPractice(item)">练习</el-button>
          </div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">再看看其他的</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { getQuestionCount } from './../practiceViewApi'

export default {
  name: 'VueCheckQuestion',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '题型',
      queryParams: {},
      dataList: []
    }
  },
  methods: {
    init(item) {
      this.queryParams = item
      this.visible = true
      this.dataList = []
      this.getListData()
    },
    async getListData() {
      this.loading = true
      getQuestionCount({
        knowledgeId: this.queryParams.knowledgeId
      }).then(res => {
        // this.dataList = res.data
        const list = res.data
        const dataList = this.dataList
        list.map(v => {
          const item = dataList.find(j => { return j.choice === v.choice })
          if (item) {
            item.num += v.num
          } else {
            dataList.push(v)
          }
        })
        this.dataList = dataList
        this.loading = false
      })
      // examList({}, this.queryParams).then(res => {
      //   this.tableData.columnsDataList = res.data
      //   this.tableData.page.total = res.data.total || 1
      //   this.tableData.loading = false
      // })
    },
    // 练习
    toPractice(item) {
      if (item.num > 0) {
        this.visible = false
        if (item.type === 2) {
          // 实操
          this.$emit('refchooseExercises', item, this.queryParams)
        } else {
          // 理论
          this.$emit('refchoosePractice', item, this.queryParams, '')
        }

        // startPracticing(this.queryParams.knowledgeId).then(res => {
        //   let testId = res.data
        //   this.visible = false
        //   this.$emit('refchoosePractice',item,this.queryParams,testId)
        // })
      }
    }
  }
}
</script>

<style scoped>
.knowledge-total{
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  border-radius: 4px;
  overflow: hidden;
}
.knowledge-name{
  padding: 8px 10px;
  background-color: #dff0d8;
  border-bottom: 1px solid #EBEEF5;
}
.knowledge-item{
  padding: 8px 10px;
  min-height: 50px;
  line-height: 32px;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
}
.knowledge-item:nth-child(2){
  border-bottom: none;
}
.knowledge-item >>> .el-button{
  float: right;
}
</style>
