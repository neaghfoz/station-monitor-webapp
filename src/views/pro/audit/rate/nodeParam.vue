<template>
  <div class="app-container">
    <el-form ref="nodeParamForm" :model="nodeParams" :rules="rules" inline :label-width="'110px'">
      <el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="路网节点参数">
          <nodeCode_detail :paramVersion="nodeParams.paramVersion" :loadData="true" />
        </el-tab-pane>
        <el-tab-pane label="相邻节点参数">
          <nodeLink_detail :paramVersion="nodeParams.paramVersion" :loadData="false" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

import nodeCode_detail from './components/nodeCodeDetail'
import nodeLink_detail from './components/nodeLinkDetail'

import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSelectTree from '@/views/pro/common/tiElement/tiSelect/tiSelectTree'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'AuditRateNodeParamView',
  // eslint-disable-next-line vue/no-unused-components
  components: { TiExportExcel, TiSelectTree, TiSelect, nodeCode_detail, nodeLink_detail },
  mixins: [...mixin],
  data() {
    return {
      tabActiveName: '0',
      nodeParams: {
        paramVersion: '',
        paramType: '',
        firstLoading: false
      },
      rules: {

      }
    }
  },
  created() {
    this.nodeParams.paramVersion = this.$route.query.paramVersion
    this.nodeParams.paramType = this.$route.query.paramType
    this.nodeParams.firstLoading = true
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab)
      this.nodeParams.firstLoading = false
    }
  }
}
</script>
<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
