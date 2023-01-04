<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
        <el-button type="primary" size="mini" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
      <div style="marginTop: 10px; color: #409EFF">{{ pageNum }} / {{ pageTotalNum }}</div>
      <pdf
        ref="pdf"
        :page="pageNum"
        :src="url"
        @progress="loadedRatio = $event"
        @num-pages="pageTotalNum=$event"
        v-loading="loading"
      ></pdf>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" @click="handleDialogClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import pdf from 'vue-pdf'
import request from '@ecip/ecip-web/src/utils/request'
import { studyHistorySave } from '@/views/pro/train/study/attach/attachViewApi'

export default {
  name: 'pro.train.study.attach.preView',
  components: { pdf },
  mixins: [],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      title: 'PDF附件预览',
      url: '',
      id: '',
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
      starttime: '', // 当前时间
      scale: 100, // 放大系数
      idx: -1
    }
  },
  mounted() {
    // 监听鼠标滚动事件
    window.addEventListener('mousewheel',this.rollPdf);
  },
  methods: {
    init: async function(id) {
      this.pageNum = 1
      this.visible = true
      this.getFileData(id)
      this.id = id
      this.starttime = new Date()
    },
    // 上一页
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },

    // 下一页
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },

    /**
     * 点击 X 关闭对话框的回调
     **/
    async handleDialogClose() {
      this.saveLoading = true
      const file_form = new FormData() // 获取上传表单（文件）
      file_form.append('startTime', this.starttime)
      file_form.append('attachId', this.id)
      await studyHistorySave(file_form)
      this.$emit('refreshData')
      this.saveLoading = false
      this.visible = false
    },
    getFileData(id) {
      this.loading = true
      const file_form = new FormData() // 获取上传表单（文件）
      file_form.append('id', id)
      request({
        method: 'post',
        url: '/api/v1/train/attach/downLoad',
        responseType: 'blob',
        data: { 'id': id }
      }).then(response => {
        const fileUrl = this.getObjectURL(response.data)
        this.url = fileUrl
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    // 将返回的流数据转换成url
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      } else if (window.URL !== undefined) { // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      }
      return url
    }
  }
}
</script>

