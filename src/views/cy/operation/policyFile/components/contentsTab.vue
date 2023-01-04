<template>
  <div class="app-container">
    <div class="main container">
      <div class="news_details">
        <h2 style="text-align: center; font-family: 'Microsoft YaHei'; color: rgb(0, 0, 0); font-size: 24px; line-height: 1.5em;">
          <span class="title">{{this.formItem.fileCtagoryText}}</span>
          <span class="title">{{this.speration}}</span>
          <span class="title">{{this.formItem.title}}</span>
        </h2>
        <p style="text-align: center;color:#555555">
          <span class="title-bottom">{{this.formItem.attriButeText}}</span>
          <span class="title-bottom">{{this.formItem.fileTypeText}}</span>
          <span class="title-bottom">{{this.formItem.startTimeText}}</span>
        </p>
        <div style="border-bottom: rgb(216,216,216) 1px solid; line-height: 1px; height: 1px; font-size: 0px; border-top: rgb(191,191,191) 1px solid"></div>
          <div class="news_content" >
          <p v-html="this.formItem.content"></p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export const escape2Html = (str) => {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
    return arrEntities[t]
  })
}
import mixin from 'ecip-web/utils/common-mixin'
import { update, getDtailsById } from '../policyFile'
export default {
  name: 'OperationPolicyFileDetailsContents',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      saveLoading: false,
      fileTypeRequired: false,
      fileTypeDisabled: true,
      publishTimeDisabled: true,
      startTimeRequired: false,
      role: {},
      method: '',
      title: '',
      formItem: {
        title: '',
        fileCatgory: '',
        fileType: '',
        publishStatus: '',
        publisherName: '',
        attriBute: '',
        content: '',
        startTime: '',
        endTime: '',
        fileCtagoryText: '',
        fileTypeText: '',
        startTimeText: '',
        policyFileInfoList: []
      },
      speration: '',
      fileList: [],
      fileListTemp: []

    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      getDtailsById(this.$route.query.id).then(res => {
        res.data.content = escape2Html(res.data.content)
        console.log(res.data)

        if (res.data.attriButeText) {
          res.data.attriButeText = '发布单位：【' + res.data.attriButeText + '】'+ res.data.publisherName
        }
        if (res.data.startTimeText) {
          res.data.startTimeText = '发布时间：' + res.data.startTimeText
        }
        else {
          res.data.startTimeText = '发布时间：' + res.data.publishTimeText
        }

        if (res.data.fileTypeText) {
          res.data.fileTypeText = '文件类型：' + res.data.fileTypeText
        }

        if (res.data.fileCtagoryText) {
          this.speration = '|'
        }
        this.formItem = res.data
      })
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            this.formItem.policyFileInfoList = []
            this.fileList.forEach((item, index) => {
              if (!item.response) {
                this.formItem.policyFileInfoList.push(item)
              } if (item.response && item.response.code === 200) {
                this.formItem.policyFileInfoList.push(item.response.data)
              }
            })
            await update(this.formItem)
            this.$notify.success('保存成功')
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    uploadSuccess(resp, file, fileList) {
      this.fileList = fileList
    },
    handlefileCatgoryChange(result) {
      if (result === 'policyFile') {
        this.fileTypeRequired = true
        this.fileTypeDisabled = false
      } else {
        this.formItem.fileType = ''
        this.fileTypeRequired = false
        this.fileTypeDisabled = true
      }
    },
    publishStatusChange(val) {
      if (val === 'publish') {
        this.publishTimeDisabled = false
        this.startTimeRequired = true
      } else {
        this.formItem.startTime = ''
        this.formItem.endTime = ''
        this.publishTimeDisabled = true
        this.startTimeRequired = false
      }
    },
    uploadFileRemove(file, fileList) {
      this.fileList = fileList
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .title-bottom {
    margin: 0 25px 0 0;
  }
  .title {
    margin: 0 10px 0 0;
  }
</style>
