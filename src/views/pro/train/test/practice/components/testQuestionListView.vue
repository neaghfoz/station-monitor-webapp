<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="300"
    >
      <el-row>
        <el-col v-for="(val,key,index) in dataObj" :key="index">
          <div v-if="key != 'testHistoryId' && val.length > 0">
            <div class="type-name">{{ key }}</div>
            <div>
              <span
                v-for="(item,idx) in val"
                :key="`exam${index}.${idx}`"
                :class="`serial-num ${(item.choice == 2 ? item.userAnswer.length > 0 : item.userAnswer) ? 'has-answer' : ''}`"
              >{{ idx + 1 }}</span>
            </div>
          </div>
        </el-col>
        <!-- <el-col>
          <div>2、多选题</div>
          <div>
            <span class="serial-num">1</span>
            <span class="serial-num">2</span>
            <span class="serial-num">3</span>
          </div>
        </el-col> -->
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'VueTestQuestionListView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '试题列表',
      queryParams: {},
      dataObj: {}
    }
  },
  methods: {
    init(obj) {
      this.dataObj = obj
      this.visible = true
      // this.getListData()
    },
    async getListData() {

    }
  }
}
</script>

<style scoped>
.type-name{
  padding: 8px 0;
  color: #333;
}
.serial-num{
  display: inline-block;
  margin: 0 8px 15px 0;
  padding: 0 9px;
  min-width: 3em;
  line-height: 2em;
  color: #fff;
  background-color: #bbb;
  border-radius: 9px;
  text-align: center;
}
.has-answer{
  background-color: #3a87ad;
}
</style>
