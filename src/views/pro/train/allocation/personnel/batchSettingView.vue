<template>
  <div class="app-container">
    <el-form ref="form" status-icon :model="formItem" label-width="200px">
      <el-form-item label="用户ID" prop="operatorNos" :rules="[{required: true, message:'用户ID不能为空', trigger:'blur'}]">
        <el-input
          v-model="formItem.operatorNos"
          type="textarea"
          :rows="4"
          :disabled="true"
        />
        <el-button @click="chooseUser">选择用户</el-button>
      </el-form-item>

      <el-form-item label="场次ID" prop="examNumIds" :rules="[{required: true, message:'场次ID不能为空', trigger:'blur'}]">
        <el-input
          v-model="formItem.examNumIds"
          type="textarea"
          :rows="4"
          :disabled="true"
        />
        <el-button @click="chooseExamnum">选择场次</el-button>
      </el-form-item>

      <el-form-item label="到期时间" prop="day" :rules="[{required: true, message:'到期时间不能为空', trigger:'blur'}]">
        <el-input
          v-model="formItem.day"
          type="text"
          placeholder="到期时间"
          maxlength="5"
          oninput="value=value.replace(/[^\d]/g, '')"
        />天
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="saveLoading" @click="save">提交</el-button>
      </el-form-item>
    </el-form>

    <UserList ref="saasUserDialog" @refreshDataList="setOperatorNos" />
    <ExamnumList ref="saasExamnumDialog" @refreshDataList="setExamnumIds" />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { batchSettingOperator } from './personnelViewApi'
import UserList from './components/userListView'
import ExamnumList from './components/examnumListView'

export default {
  name: 'ProTrainAllocationPersonnelBatchSettingView',
  components: { UserList, ExamnumList },
  mixins: [...mixin],
  data() {
    return {
      saveLoading: false, //  保存加载
      formItem: {
        examNumIds: '',
        operatorNos: '',
        day: 30
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            await batchSettingOperator(this.formItem)
            this.$notify.success('保存成功')
            this.$refs['form'].resetFields()
            this.close()
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    setOperatorNos(operatorNos) {
      this.formItem.operatorNos = operatorNos
    },
    setExamnumIds(examNumIds) {
      this.formItem.examNumIds = examNumIds
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    // 选择用户
    chooseUser() {
      this.$refs.saasUserDialog.init(this.formItem.operatorNos)
    },
    // 选择场次
    chooseExamnum() {
      this.$refs.saasExamnumDialog.init(this.formItem.examNumIds)
    }
  }
}
</script>

<style scoped>
  .el-textarea{
    display: block;
    margin-bottom: 5px;
    width: 450px;
  }
  .el-input{
    margin-right: 10px;
    width: 450px;
  }
</style>
