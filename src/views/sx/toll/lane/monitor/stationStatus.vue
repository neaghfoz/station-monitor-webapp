<template>

  <el-dialog title="确认离岗" width="500px"
             :modal-append-to-body='true'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             class="dialogClass"
             :close-on-click-modal=false
             :visible="stationStatusShow"
             :z-index="zIndex"
             append-to-body style="padding: 0px 20px">

    <div class="app-container" style="padding:0px">
      <div style="padding: 10px 0px 10px 0px;">
        <el-form ref="form" label-width="100px">
          <el-row style="margin-top: 40px;">
            <el-col span="24" style="text-align: center">
              监控离岗后，将不再接收车道的特情回控请求，是否确认离岗？
            </el-col>
          </el-row>
          <el-row style="text-align: center;margin-top: 50px; margin-bottom: 20px">
            <el-button type="primary"  @click="confirm()">确认</el-button>
            <el-button @click="close()">取消</el-button>
          </el-row>
        </el-form>
      </div>
    </div>

  </el-dialog>
</template>

<script>

  export default {
    name: 'stationStatusView',
    components: {},
    data() {
      return {
        stationStatusShow: false,
        zIndex: 2000
      }
    },
    watch: {

    },
    mounted() {
    },
    created() {
    },
    methods: {
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.close()
      },
      close(){
        this.stationStatusShow = false;
        this.$emit('refreshData', false)
      },
      init(zIndex) {
        this.zIndex = zIndex + 2001
        this.stationStatusShow = true;
      },
      confirm(){
        this.stationStatusShow = false;
        this.$emit('refreshData', true)
      }
    }
  }
</script>
<style>

  .dialogClass .el-dialog__body {
    padding: 0px 20px 20px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>


