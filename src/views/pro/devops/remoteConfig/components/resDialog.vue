<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="50%"
      style="padding: 0px;"
    >
      <div>
        <el-form :inline="true" ref="accForm" :model="accInfo" :rules="rules">
          <el-form-item label="登录用户" prop="account">
            <el-input v-model="accInfo.account" placeholder="登录用户" style="width:100px;"></el-input>
          </el-form-item>
          <el-form-item label="登录凭证" prop="pwd">
            <el-input type="password" v-model="accInfo.pwd" autocomplete="off" placeholder="登录凭证" style="width:100px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onCheck">检测</el-button>
          </el-form-item>
        </el-form>
        <el-divider/>
        <span style="font-weight: bold;">CPU</span><br/><br/>
        <div v-loading="cpuLoading">
          <template v-if="cpuData.length">
            <el-row v-for="vo in cpuData">
              <el-col :span="12" style="text-align: left;">{{ vo.Name }}</el-col>
              <el-col :span="12" style="text-align: center;">{{ vo.LoadPercentage }}%</el-col>
            </el-row>
          </template>
          <template v-else>
            <div style="text-align: center;padding: 5px;">{{ cpuError }}</div>
          </template>
        </div>
        <el-divider/>
        <span style="font-weight: bold;">内存</span><br/><br/>
        <div v-loading="memLoading">
          <template v-if="memData.length">
            <el-row v-for="vo in memData">
              <el-col :span="8" style="text-align: left;">总内存: {{ (vo.TotalVisibleMemorySize/1024/1024).toFixed(2) }} &nbsp;GB</el-col>
              <el-col :span="8" style="text-align: center;">空闲：{{ (vo.FreePhysicalMemory/1024/1024).toFixed(2) }} &nbsp;GB</el-col>
              <el-col :span="8" style="text-align: right;">使用率：{{ ((vo.TotalVisibleMemorySize-vo.FreePhysicalMemory)/vo.TotalVisibleMemorySize*100).toFixed(2) }}%</el-col>
            </el-row>
          </template>
          <template v-else>
            <div style="text-align: center;padding: 5px;">{{ memError }}</div>
          </template>
        </div>

        <el-divider/>
        <span style="font-weight: bold;">磁盘</span><br/><br/>
        <div v-loading="diskLoading">
          <template v-if="diskData.length">
            <vxe-table
              border
              show-header-overflow
              show-overflow
              highlight-hover-row
              :data="diskData">
              <vxe-table-column field="Name" title="盘符"></vxe-table-column>
              <vxe-table-column field="Capacity" align="center" title="总容量[GB]" :formatter="toGB"></vxe-table-column>
              <vxe-table-column field="FreeSpace"  align="center" title="空闲[GB]" :formatter="toGB"></vxe-table-column>
              <vxe-table-column field="_"  align="center" title="使用率" :formatter="diskUseRate"></vxe-table-column>
            </vxe-table>
          </template>
          <template v-else>
            <div style="text-align: center;padding: 5px;">{{ diskError }}</div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import { resGet } from "../remoteConfigApi"


  export default {
    name: 'devops.remoteConfig.components.resDialogView',
    mixins: [...mixin],
    data() {
      return {
        ip:null,
        accInfo:{
          account:null,
          pwd:null,
        },
        rules: {
          account: [{required: true, message: ' ', trigger: 'blur'}],
          pwd: [{required: true, message: ' ', trigger: 'blur'}]
        },
        cpuLoading: false,
        cpuData: [],
        cpuError:'',
        memLoading: false,
        memData: [],
        memError:'',
        diskLoading: false,
        diskData:[],
        diskError:'',
        visible: false,
        title: '资源检测',
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
        this.accInfo={
          account:null,
          pwd:null,
        }
        this.title = '资源检测['+serverIp+']'
        this.ip = serverIp
        this.cpuLoading= false
        this.cpuData= []
        this.cpuError=''
        this.memLoading= false
        this.memData= []
        this.memError=''
        this.diskLoading= false
        this.diskData=[]
        this.diskError=''
      },
      onCheck(){
        this.$refs.accForm.validate((valid) => {
          if (valid) {
            this.getCpu()
            this.getMem()
            this.getDisk()
          } else {
            return false;
          }
        })
      },
      async getCpu(){
        this.cpuLoading = true
        try {
          const resp =  await this.getApi(1)
          if(resp.success){
            this.cpuData = resp.data
          }
        }catch (e){
          this.cpuError = '无法获取到CPU使用情况'
        }
        this.cpuLoading = false
      },
      async getMem(){
        this.memLoading = true
        try {
          const resp =  await this.getApi(2)
          if(resp.success){
            this.memData = resp.data
          }
        }catch (e){
          this.memError = '无法获取到内存使用情况'
        }
        this.memLoading = false
      },
      async getDisk(){
        this.diskLoading = true
        try {
          const resp =  await this.getApi(3)
          if(resp.success){
            this.diskData = resp.data
          }
        }catch (e){
          this.diskError = '无法获取到磁盘使用情况'
        }
        this.diskLoading = false
      },
      getApi(type){
        return resGet({
          "ip":this.ip,
          "account":this.accInfo.account,
          "pwd":this.accInfo.pwd,
          "action":type  // 1 cpu 信息，2 内存信息 3 磁盘信息
        })
        /*
        return resGet({
          "ip": '10.173.234.82',
          "account": 'administrator',
          "pwd":'Hgyb3tz@',
          "action":type  // 1 cpu 信息，2 内存信息 3 磁盘信息
        })

         */
      },

      toGB({ cellValue }){
        return XEUtils.commafy(XEUtils.toNumber(cellValue)/1024/1024/1024, { digits: 2 })
      },
      diskUseRate( { row }){
        const rate = (row.Capacity - row.FreeSpace)/row.Capacity*100
        return XEUtils.commafy(rate, { digits: 2 })+'%'
      }
    }
  }
</script>
