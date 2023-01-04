<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="50%"
      style="padding: 0px;"
    >
      <el-tabs tab-position="left" style="height: 300px;">
        <el-tab-pane label="连通检测">
          ping {{ ip }} &nbsp; &nbsp;
          <el-button @click="pingCheck" type="primary">检测</el-button>
          <el-divider/>
          <div v-loading="pingLoading">
            <div v-show="pingResult.cmdStr && !pingLoading">
              模拟命令: {{ pingResult.cmdStr }}
              <br/> <br/>
              检测结果:
              <br/> <br/>
              <el-alert v-if="pingResult.result"
                title="连通到目标主机"
                type="success"
                center
                show-icon>
              </el-alert>
              <el-alert v-else
                :title="pingResult.error"
                type="error"
                center
                show-icon>
              </el-alert>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="端口检测">
          <el-tag size="medium" style="margin-right:10px;margin-bottom:10px;cursor: pointer;padding:0 20px;" closable
                  :disable-transitions="false"

                  @click="portClick(p)"
                  @close="tabClose(p)" v-for="p in ports">{{ p }}</el-tag>
          <el-input-number style="width: 100px;margin-right:10px;margin-bottom:10px;"  v-model="port" :controls="false" placeholder="其它端口" minlength="5" :max="65535"/>
          <el-button @click="portCheck" type="primary">检测</el-button>
          <el-divider/>
          <div v-loading="telnetLoading">
            <div v-show="telnetResult.cmdStr && !telnetLoading">
              模拟命令: {{ telnetResult.cmdStr }}
              <br/> <br/>
              检测结果:
              <br/> <br/>
              <el-alert v-if="telnetResult.result"
                        title="该端口开放"
                        type="success"
                        center
                        show-icon>
              </el-alert>
              <el-alert v-else
                        :title="telnetResult.error"
                        type="error"
                        center
                        show-icon>
              </el-alert>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import { exeCmd } from "../remoteConfigApi"
  import storage from "@/views/pro/common/util/storage"

  export default {
    name: 'devops.remoteConfig.components.cmdDialogView',
    mixins: [...mixin],
    data() {
      return {
        ports: storage.get("TELNET_PORTS") || [21,135,9008],
        port: '',
        ip:'',
        pingLoading: false,
        pingResult: {
          cmdStr:'',
          result:false,
          error:''
        },
        telnetLoading: false,
        telnetResult: {
          cmdStr:'',
          result:false,
          error: ''
        },
        visible: false,
        title: '网络检测',
        loading: false, // 页面加载遮罩
        saveLoading: false //  保存加载
      }
    },
    methods: {
      init({ serverIp }) {
        this.visible = true
        if(serverIp == this.ip){
          return
        }
        this.title = '网络检测['+serverIp+']'
        this.ip = serverIp
        this.port= ''
        this.pingLoading= false
        this.pingResult= {
          cmdStr:'',
          result:false,
          error:''
        },
        this.telnetLoading= false
        this.telnetResult={
          cmdStr:'',
          result:false,
          error: ''
        }
      },
      tabClose(port){
        this.ports.splice(this.ports.indexOf(port), 1);
        // 保存
        storage.set("TELNET_PORTS",this.ports)
      },
      portClick(port){
        this.telnetPort(port)
      },
      portCheck(){
        if(!this.port){
          this.$alert("该端口无效，请输入正确端口！");
          return;
        }
        if(this.ports.indexOf(this.port)>-1){
          this.telnetPort(this.port)
        }else{
          this.ports.push(this.port)
        }
        this.telnetPort(this.port)
        // 保存
        storage.set("TELNET_PORTS",this.ports)
      },
      async telnetPort(port){
        if(this.telnetLoading){
          return;
        }
        this.port = port
        this.telnetLoading = true
        try {
          const resp = await exeCmd({
            "cmd":"telnet",
            "cmdArgs": this.ip+" "+this.port
          })
          if(resp.success){
            const data = resp.data
            this.telnetResult.cmdStr = data.cmdStr
            this.telnetResult.result = data.result
            if(!data.result){
              this.telnetResult.error = '无法连接到该端口，检测的端口可能已关闭'
            }
          }
        }finally {
          this.telnetLoading = false
        }
      },
      async pingCheck(){
        if(this.pingLoading){
          return;
        }
        this.pingLoading = true
        try {
          const resp = await exeCmd({
            "cmd":"ping",
            "cmdArgs":this.ip
          })
          if(resp.success){
            const data = resp.data
            this.pingResult.cmdStr = data.cmdStr
            this.pingResult.result = data.result
            if(!data.result){
              this.pingResult.error = '无法ping通目标服务器'
            }
          }
        }finally {
          this.pingLoading = false
        }
      }
    }
  }
</script>
