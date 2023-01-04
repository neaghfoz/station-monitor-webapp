<template>
  <div class="app-container" id="tip">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="450px"
    >
      <span slot="title" class="dialog-footer">
        <span class="el-dialog__title">手动请求（最新版本）</span>
      </span>
       <el-row style="text-align: center">
         <el-col :span="24">
            <div>{{tipContent}}</div>
         </el-col>
       </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="confirm()" :loading="confirmLoading" >确认</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import {reqDownLastest} from "../paramVersionApi";
import {deepClone} from "@ecip/ecip-web/src/utils";
export default {
  name: 'VueRoleSysrRoleForm',
  components: {  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      collectDate: '',
      method: '',
      tipContent: '',
      bsParamName: '',
      identifier: ''
    }
  },
  methods: {
    init(tipContent, bsParamName, identifier) {
      this.tipContent = tipContent
      this.bsParamName = bsParamName
      this.identifier = identifier
      this.visible = true
      this.loading = false
    },
    getData() {
    },
    confirm() {
        this.confirmLoading = true
        reqDownLastest(this.bsParamName,{identifier: this.identifier}).then(res => {
          if (res.code === 200) {
            this.$notify.success("参数版本更新中，请稍候刷新查看")
          } else {
            this.$notify.error(data.message)
          }
          this.confirmLoading = false
          this.$emit('refreshData')
          this.visible = false
        }).catch(e => {
          console.log('异常信息:' + e);
        }).finally(x=>{
          this.confirmLoading = false;
        })
    }
  }
}
</script>

<style lang="scss">
  #tip .el-dialog__footer {
    text-align: center;
  }
  #tip .el-dialog__body {
    padding: 20px 20px;
  }
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 0px;
    }
  }
</style>
