<template>
  <div class="app-container" id="shiftSettleTip">
    <el-dialog
      ref="tipDialog"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="500px"
      :modal-append-to-body='false'
      :z-index="zIndex"
    >
      <span slot="title" class="dialog-footer">
        <span class="el-dialog__title">{{title}}</span>
      </span>
      <el-form ref="form" v-loading="loading" :model="formItem" label-width="15px" id = "chargeManagementForm">
        <el-row v-if="wholeMsg!=''">
          <el-col :span="24" style="height: 30px;">
            <el-form-item>
              <span>{{wholeMsg}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="statusMsg!=''">
          <el-col :span="24" style="height: 30px;">
            <el-form-item>
              <span>{{statusMsg}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="tipMsg!=''" style="height: 30px;">
          <el-col :span="24">
            <el-form-item>
              <span>{{tipMsg}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="remarkShow"  style="height: 156px;">
          <el-col :span="24">
            <el-form-item
              label=" "
              prop="shiftSettleMarks"
              :rules="[{required: true, message:'备注为空', trigger:'blur'}]">
              <el-input
                v-model="formItem.shiftSettleMarks"
                type="textarea"
                :rows="5"
                maxlength="500"
              />
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
          <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import {save} from "../../chargeManagement/charge";
export default {
  name: 'shiftSettleTip',
  components: {  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      row: {},
      wholeMsg: '',
      statusMsg: '',
      tipMsg: '',
      remarkShow: true,
      collectDate: '',
      method: '',
      title: '',
      formItem: {
        shiftSettleMarks: ''
      },
      zIndex: 2000
    }
  },
  methods: {
    init(title, wholeMsg,statusMsg,tipMsg,remarkShow, zIndex) {
      this.formItem.shiftSettleMarks = ''
      this.zIndex = parseInt(zIndex) + 2001
      this.wholeMsg = wholeMsg
      this.statusMsg = statusMsg
      this.tipMsg = tipMsg
      this.remarkShow = remarkShow
      this.title = title
      this.visible = true
    },
    save() {
      if (this.remarkShow ) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            try {
              this.saveLoading = true
              this.$emit('confirm', this.formItem.shiftSettleMarks)
              this.visible = false
            } finally {
              this.saveLoading = false
            }
          }
        })
      } else {
        this.saveLoading = true
        this.$emit('confirm', '')
        this.saveLoading = false
        this.visible = false
      }

    },
  }
}
</script>

<style lang="scss">

  #shiftSettleTip .el-dialog__footer {
    text-align: right;
  }
  #shiftSettleTip .el-dialog__body {
    padding: 5px 20px;
  }
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 0px;
    }
  }
</style>
