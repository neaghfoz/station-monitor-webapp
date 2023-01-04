<template>

  <el-dialog title="常用备注管理" width="400px"
             :modal-append-to-body='true'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             class="dialogClass"
             :close-on-click-modal=false
             :visible="daliyShow"
             append-to-body style="padding: 0px 20px">

    <div class="app-container" style="padding:0px">
      <div style="padding: 10px 0px 10px 0px;">
        <el-form ref="form" label-width="100px">
          <el-row>
            <el-col span="24" style="text-align: center">
              输入常用选项值(每行一个)
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col span="24" style="text-align: center">
              <el-input
                style="width:300px"
                type="textarea"
                :rows="12"
                maxlength="4000"
                v-model="reqData.content">
              </el-input>
            </el-col>

          </el-row>
          <el-row style="text-align: center;margin-top: 10px; margin-bottom: 20px">
            <el-button type="primary" :loading="saveLoading" @click="save()">保存</el-button>
            <el-button @click="close()">取消</el-button>
          </el-row>
        </el-form>
      </div>
    </div>

  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
  import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
  import dailyMarkApi from "./dailyMarkApi";

  export default {
    name: 'dailyMark',
    components: {TiSelect,TiSysLane, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        daliyShow: false,
        saveLoading: false,
        reqData:{
          content:''
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {

    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {

      });
    },
    methods: {
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.daliyShow = false;
      },
      close(){
        this.daliyShow = false;
      },
      init() {
        this.getDailyMark()
        this.daliyShow = true;
      },
      save(){
        this.saveLoading = true,
        dailyMarkApi.update({content:this.reqData.content}).then((res) => {
          this.saveLoading = false
            if (res.code === 200) {
              this.$notify.success(res.message)
            } else {
              this.$notify.error(res.message)
              return
            }

            // 刷新数据
            this.reqData.content = "";
            this.daliyShow = false;
            this.$emit('refreshData')
          })

      },
      getDailyMark(){
        dailyMarkApi.getAllContent({}).then((res) => {
          if(res.code == 200) {
            this.reqData.content = res.data
          } else {
            this.$notify.error(res.message)
            return
          }
        })
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


