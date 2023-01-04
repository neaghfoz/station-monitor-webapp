<template>
  <div class="app-container">
    <el-form ref="form" v-loading="loading" :model="formItem" label-width="180px" >
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="路段"
            prop="roadName"
          >
            <el-input v-model="formItem.roadName" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="收费站"
            prop="stationName"
          >
            <el-input v-model="formItem.stationName" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="车道号"
            prop="laneNo"
          >
            <el-input v-model="formItem.laneNo" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="车道类型"
            prop="terminalTypeText"
          >
            <el-input v-model="formItem.terminalTypeText" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="出入口类型"
            prop="enexTypeText"
          >
            <el-input v-model="formItem.enexTypeText" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="IP地址"
            prop="ipAddress"
          >
            <el-input v-model="formItem.ipAddress" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="在用批次号"
            prop="usingVer"
          >
            <el-input v-model="formItem.usingVer" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="在用更新时间"
            prop="usingVerTime"
          >
            <el-input v-model="formItem.usingVerTime" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="最新批次号"
            prop="latestVer"
          >
            <el-input v-model="formItem.latestVer" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="最新配置包状态变化时间"
            prop="latestVerTime"
          >
            <el-input v-model="formItem.latestVerTime" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            label="最新配置包更新状态"
            prop="statusText"
          >
            <el-input v-model="formItem.statusText" type="text" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="异常原因"
            prop="detail"
          >
            <el-input v-model="formItem.detail" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item
            label="在用更新配置包更新说明"
            prop="usingReleaseNote"
          >
            <el-input v-model="formItem.usingReleaseNote" type="textarea" :autosize="{minRows: 5, maxRows: 10}" readonly />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item
            label="最新更新配置包更新说明"
            prop="latestReleaseNote"
          >
            <el-input v-model="formItem.latestReleaseNote" type="textarea" :autosize="{minRows: 5, maxRows: 10}" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center">
      <el-button @click="close()">关闭</el-button>
    </div>

  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { detail } from '../configUpdateStatus'
export default {
  name: 'AutoUpdationConfigUpdateStatusDetailsView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      method: '',
      title: '',
      appId: '',
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      formItem: {
        systemName: '',
        stationName: '',
        laneNo: '',
        terminalTypeText: '',
        enexTypeText: '',
        ipAddress: '',
        usingVer: '',
        usingVerTime: '',
        latestVer: '',
        latestVerTime: '',
        statusText: '',
        detail: '',
        usingReleaseNote: '',
        latestReleaseNote: ''

      },
      systemInfoList: [],
      queryParams: {
        id: ''
      }
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
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.queryParams.id = this.$route.query.id
      detail(this.queryParams.id).then(res => {
        this.formItem = res.data
      })
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
