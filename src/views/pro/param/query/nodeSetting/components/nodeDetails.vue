<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="selectedNode">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="参数名称：" prop="name">
            {{ selectedNode.title }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="表名：" prop="value">
            {{ selectedNode.tableName }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { getById } from '../nodeSetting'

export default {
  name: 'NodeSettingNodeDetailsView',
  components: {},
  data() {
    return {
      selectedNode: {},
      isInit: false
    }
  },
  watch: {

  },
  mounted() {
    if (!this.isInit) {
      this.isInit = false
      this.$emit('done', 'init')
    }
  },
  created() {

  },
  methods: {
    async init(e) {
      if (e && e.id) {
        this.isInit = true
        var param = { 'id': e.id }
        const { data } = await getById(param)
        this.selectedNode = data
      }
    }
  }
}
</script>

<style scoped>

</style>
