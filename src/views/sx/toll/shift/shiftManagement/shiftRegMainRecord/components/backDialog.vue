<template>
  <div class="app-container" >
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
    <el-form v-show="backFormShow" ref="form" v-loading="loading" :model="backForm" label-width="100px" >
      <el-row >
        <el-form-item
          label="节点"
          prop="backStatus"
          :rules="[
            {required: true, message:'节点', trigger:'blur'}
          ]"
        >
          <el-select v-model="backForm.backStatus"  filterable  placeholder="请选择" >
            <el-option
              v-for="item in backStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="意见" prop="approvalOpinion">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="120"
            v-model="backForm.approvalOpinion">
          </el-input>
          <el-input
            type="text"
            v-show="false"
            maxlength="120"
            v-model="backForm.id">
          </el-input>
        </el-form-item>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer" style="margin-left: 110px;">
       <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import api from '../shiftRegMainRecordApi.js'
export default {
  name: 'backShiftRegMainRecordForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      backFormShow: false,
      loading: false,
      saveLoading: false,
      method: '',
      title: '回退',
      backForm: {
        id: '',
        backStatus: '',
        approvalOpinion:''
      },
      backStatusList:[]
    }
  },

  methods: {
    init(tenantId, appId, process, status, linkId) {
      this.visible = true;
      this.backFormShow = false;
      this.backForm.id = linkId

      this.$nextTick(async() => {
        this.render(tenantId, appId)
        this.backForm.id = linkId
        this.backStatusList=[]
        if(status === 4){
          this.backStatusList.push({value:'1', name:'上班登记'})
          this.backStatusList.push({value:'2', name:'下班登记'})
        }else {
          this.backStatusList.push({value:'1', name:'上班登记'})
        }
      })
    },
    getData() {
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.backFormShow = true;
      this.$refs.form.clearValidate();
      Object.assign(this.$data.backForm, this.$options.data().backForm);
      this.backForm.tenanId = tenantId;
      this.backForm.appId = appId;
    },
    save() {
      console.log(this.backForm)
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            api.goBack(this.backForm).then(res => {
              this.$notify.success("回退成功！")
              this.$emit('refreshData')
              this.visible = false
            })
          } finally {
            this.saveLoading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
