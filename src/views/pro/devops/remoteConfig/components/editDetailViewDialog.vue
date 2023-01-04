<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="dialogForm" v-loading="loading" :model="formItem" label-width="120px">
        <el-row  :gutter="16">
<!--          <el-col :span="24">-->
<!--            <el-form-item :label="formItem.serverName">-->
<!--              <span>{{formItem.roadText}}_{{formItem.stationText}}_{{formItem.laneNo}}</span>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="服务器Ip" prop="serverIp"
                          :rules="[
                { required: true, message:'服务器Ip不能为空', trigger:'change' }
              ]"
            >
              <el-input  v-model="formItem.serverIp" type="text" placeholder="服务器Ip" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务器端口"  prop="serverPort"
                          :rules="[
                { required: true, message:'服务器端口不能为空', trigger:'change' }
              ]"
            >
              <el-input v-model="formItem.serverPort" type="text" placeholder="服务端口" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ftp端口" prop="ftpPort"
                          :rules="[
                { required: true, message:'ftp端口不能为空', trigger:'change' }
              ]"
            >
              <el-input  v-model="formItem.ftpPort" type="text" placeholder="ftp端口" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ftp日志路径" prop="ftpLogPath">
              <el-input  v-model="formItem.ftpLogPath" type="text" placeholder="ftp日志路径" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button  type="primary"  @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import {update} from '../remoteConfigApi'

  export default {
    name: "devops.remoteConfig.components.laneEditView",
    components: {},
    mixins: [...mixin],
    data() {
      return {
        visible: false,
        method: '编辑',
        title: '',
        loading: false, // 页面加载遮罩
        saveLoading: false, //  保存加载
        formItem: {
          serverIp:'',
          serverPort:'',
          ftpLogPath:'',
          ftpPort:'',
          model:''
        }
      }
    },
    created() {
    },
    methods: {
      init(val,model){
        this.visible = true
        Object.assign(this.formItem,val);
        this.formItem.model = model;
      },
      async save() {
        let validFlag
        this.$refs.dialogForm.validate(valid => { validFlag = valid });
        if (!validFlag) {
          return
        }
        let params = {
          model: this.formItem.model,
          id:this.formItem.id || '',
          moduleType:'devops',
          useId:this.formItem.useId || '',
          serverIp:this.formItem.serverIp,
          serverPort:this.formItem.serverPort,
          ftpLogPath:this.formItem.ftpLogPath,
          ftpPort:this.formItem.ftpPort
        }
        await update({}, params)
        this.$notify.success('保存成功')
        this.$emit('refreshDataList')
        this.visible = false
      }
    }
  }
</script>

<style scoped>

</style>
