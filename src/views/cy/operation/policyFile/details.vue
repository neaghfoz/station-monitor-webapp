<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="正文" name="content">
        <contents-tab
          ref="contentsTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
      <el-tab-pane label="附件" name="file">
        <file-tab
          ref="fileTab"
          :query-params="queryParams"
        />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save } from './policyFile'
import contentsTab from './components/contentsTab'
import fileTab from './components/fileTab'

export default {
  name: 'OperationPolicyFileDetails',
  components: { contentsTab, fileTab },
  mixins: [...mixin],
  data() {
    return {
      activeTab: 'content',
      queryParams: {
        model: 'content'
      }
    }
  },
  created() {
  },
  methods: {
    init() {

    },
    getData() {
      if (this.queryParams.model === 'content') {
        this.$refs.contentsTab.init()
      } else if (this.queryParams.model === 'file') {
        this.$refs.fileTab.init()
      }
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    tabClick(tab, event) {
      this.queryParams.model = tab.name;

      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
