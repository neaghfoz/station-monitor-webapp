<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="30%"
    >
      <el-form ref="dialogForm" :model="ftpItem" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="ftp用户名:" prop="ftpUser"
                          :rules="[ { required: true, message:'ftp用户名不能为空', trigger:'change' } ]">
              <el-input  v-model="ftpItem.ftpUser" maxlength="32" type="text" placeholder="ftp用户名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="密码:" prop="ftpPwd"
                          :rules="[ { required: true, message:'密码不能为空', trigger:'change' } ]">
              <el-input type="password"  v-model="ftpItem.ftpPwd" maxlength="16"  placeholder="密码"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <ftp-down-load  ref="ftpDownDialog"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button  type="primary"  @click="save">确定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import FtpDownLoad from "./ftpDownLogDialog"

  export default {
    name: "devops.remoteConfig.components.ftpUserPwdDialog",
    components: {FtpDownLoad},
    mixins: [...mixin],
    data() {
      return {
        visible: false,
        title: '用户信息',
        ftpItem: {
          ftpUser:'',
          ftpPwd:'',
        }
      }
    },
    created() {
    },
    methods: {
      init(val){
        this.visible = true;
        Object.assign(this.ftpItem,val);
      },
      save(){
        let validFlag
        this.$refs.dialogForm.validate(valid => { validFlag = valid });
        if (!validFlag) {
          return
        }
        this.$refs.ftpDownDialog.init(this.ftpItem);
        this.visible = false
      }
    }
  }
</script>

<style scoped>

</style>
