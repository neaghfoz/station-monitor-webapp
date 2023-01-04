<template>
  <div class="app-container">
    <el-form ref="nodeForm" :model="selectedNode" label-width="120px">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item
            label="参数名称"
            prop="title"
            :rules="[ { required: true, message:'title不能为空', trigger:'change' } ]"
          >
            <el-input v-model="selectedNode.title" type="text" placeholder="title" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item
            label="表名"
            prop="tableName"
            :rules="[ { required: true, message:'tableName不能为空', trigger:'change' } ]"
          >
            <el-input v-model="selectedNode.tableName" type="text" placeholder="tableName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" @click="save">保存</el-button>
            <el-button type="warning" @click="rest">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { save } from '../nodeSetting'

export default {
  name: 'NodeSettingAddNodeView',
  components: {},
  data() {
    return {
      selectedNode: {},
      saveLoading: false
    }
  },
  watch: {

  },
  mounted() {
    this.$emit('done', 1)
  },
  created() {
    this.init()
  },
  methods: {
    init() {

    },
    async save() {
      this.$refs.nodeForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          save(this.selectedNode).then(res => {
            this.saveLoading = false
            this.$notify.success(res.message)
            this.$emit('done', 'save')
          },
          // eslint-disable-next-line handle-callback-err
          err => {
            this.saveLoading = false
          })
        }
      })
    },
    rest() {
      this.$refs.nodeForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
