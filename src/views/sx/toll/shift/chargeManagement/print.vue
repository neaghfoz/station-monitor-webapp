<template>
  <div class="app-container"       v-show="false">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      style="position: absolute;left: 50px;top:0px;"
    >
      <div id = 'print' style="width: 336px;height: 300px;position: absolute;left:0px;top:88px;color:black">
        <el-form ref="form" v-loading="loading" :model="formItem"   style="width: 336px;height: 300px">
        <el-row style="padding-top: 30px;height: 30px;margin-left: 48px">
          <el-col style="width:111px;transform: scale(0.89);">
            {{formItem.vehTypeNoText}}
          </el-col>
          <el-col style ="margin-left: 37px;width:70px;transform: scale(0.89);">

          </el-col>
        </el-row>
          <el-row style="padding-top: 30px;height: 30px;margin-left: 48px">
            <el-col  style="width:111px;transform: scale(0.89);">
              {{formItem.fullVehPlate}}
            </el-col>
            <el-col style ="margin-left: 37px;width:70px;transform: scale(0.89);">

            </el-col>
          </el-row>
          <el-row style="padding-top: 30px;height: 30px;margin-left: 48px">
            <el-col  style="width:111px;transform: scale(0.89);">
              {{formItem.operatorNo}}
            </el-col>
            <el-col style ="margin-left: 37px;width:70px;transform: scale(0.89);">
              {{formItem.btotalTollText}}
            </el-col>
          </el-row>
          <el-row style="padding-top: 30px;height: 30px;margin-left: 48px">
            <el-col  style="width:111px;transform: scale(0.89);">
               补缴
            </el-col>
            <el-col style ="margin-left: 5px;width:111px;transform: scale(0.89);">
              {{formItem.exStationName||''}}
            </el-col>
          </el-row>
          <el-row style="padding-top: 30px;height: 30px;margin-left: 48px">
            <el-col  style="width:220px;transform: scale(0.89);">
              {{formItem.opTimeText}}
            </el-col>
            <el-col style ="margin-left: 37px;width:70px;transform: scale(0.89);">

            </el-col>
          </el-row>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import {getById, updatePrintCount } from './charge'
import { cloneDeep } from 'ecip-web/utils'
import moment from 'moment'
moment.tz.setDefault("Asia/Shanghai")
export default {
  name: 'SxTollShiftChargeManagementPrint',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      enStationIdShow: true,
      vehTypeNoShow: true,
      fullVehPlateShow: true,
      closeBtn: true,
      role: {},
      method: '',
      title: '',
      printObj: {
        id: 'print',
        popTitle: ''
      },
      formItem: {
        id: '',
        vno: '',
        enRoadNo: '',
        exRoadNo: '',
        exStationId: '',
        enStationId: '',
        exStationNo: '',
        enStationNo: '',
        opStatus: '',
        squadDate: '',
        vehTypeNo: '',
        bTotalTollStr: '',
        squadNo: '',
        fullVehPlate: '',
        operatorNo: '',
        btotalTollText: '',
        opTimeStr: moment().format('YYYY-MM-DD HH:mm:ss'),
        remarks: ''
      }
    }
  },
  methods: {
    init(method, id) {
      this.formItem.opTimeStr = moment().format('YYYY-MM-DD HH:mm:ss')
      this.method = method
      this.title = `发票打印`
      this.visible = true
      this.loading = false
      this.$nextTick(async() => {
        // 清空初始化
        this.$refs.form.clearValidate()
        Object.assign(this.$data.formItem, this.$options.data().formItem)
        try {
          this.loading = false
          const { data } = await getById(id)

          cloneDeep(this.formItem, data)
          this.formItem.bTotalTollStr = this.formItem.btotalTollText.replace(',', '')
          this.formItem.opTimeStr = moment().format('YYYY-MM-DD HH:mm:ss')

          setTimeout(() => {
            if (this.closeBtn) {
              this.closeBtn = false
              var that = this
              new this.Print({
                ids: '#print', // * 局部打印必传入id
                endCallback() {
                  // 调用打印之后的回调事件
                  that.closeBtn = true
                },
                onafterprint() {
                  that.$confirm(`确认是否已打印？`, '提示', {
                    confirmButtonText: '已打印',
                    cancelButtonText: '未打印',
                    type: 'warning'
                  }).then(() => {
                    updatePrintCount(that.formItem.id).then(res => {
                      if (res.code === 200) {
                        that.$notify.success(res.data)
                        that.$emit('refreshData')
                      } else {
                        that.$notify.error(res.message)
                      }
                    })
                  })
                }
              })
            }
          }, 500)

        } finally {
          this.loading = false
          this.visible = false
        }
      })
    },
    getData() {
    }
  }
}
</script>

<style scoped>
  @page{
    margin-top: 1mm;
    margin-bottom: 1mm;
  }

  .el-dialog {
    height: 500px;
    position: absolute;
    left: 0px;
  }
  .el-dialog__wrapper {
    position: absolute;
    left: 0px;
  }
</style>
