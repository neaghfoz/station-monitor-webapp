<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :key="key"
                     :playsinline="true"
                     :options="playerOptions"
                     v-loading = "loading"
      ></video-player>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" @click="handleDialogClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { studyHistorySave } from '@/views/pro/train/study/attach/attachViewApi'
import request from '@ecip/ecip-web/src/utils/request'

export default {
  name: 'pro.train.study.attach.videoView',
  components: { videoPlayer },
  mixins: [],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      title: '视频附件预览',
      starttime: '', // 当前时间
      key: 0,
      url: '',
      id: '',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: '',
            type: 'video/mp4'
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  methods: {
    init: async function(fileName, id) {
      this.visible = true
      // key刷新，即组件刷新，避免旧数据影响
      this.key += 1
      this.playerOptions.sources[0].type = 'video/mp4'
      this.playerOptions.sources[0].src = ''
      this.getFileData(fileName, id)
      this.starttime = new Date()
      this.id = id
    },
    async handleDialogClose() {
      this.saveLoading = true
      const myPlayer = this.$refs.videoPlayer.player
      // 存在错误时，不保存学习记录，而且也无法暂停选项
      if (myPlayer.error_) {
        this.saveLoading = false
        this.visible = false
        return
      }
      // 停止播放
      myPlayer.pause()
      const file_form = new FormData()
      file_form.append('startTime', this.starttime)
      file_form.append('attachId', this.id)
      await studyHistorySave(file_form)
      this.$emit('refreshData')
      this.saveLoading = false
      this.visible = false
    },
    getFileData(fileName, id) {
      this.loading = true
      request({
        method: 'post',
        url: '/api/v1/train/attach/downLoad',
        responseType: 'blob',
        data: {
          'id': id
        }
      }).then(response => {
        const index = fileName.lastIndexOf('.')
        const ext = 'video/' + fileName.substr(index + 1)
        this.playerOptions.sources[0].type = ext
        const fileUrl = this.getObjectURL(response.data)
        this.playerOptions.sources[0].src = fileUrl
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

