<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form v-show="detailShow" ref="form" v-loading="loading" :model="formItem" label-width="100px">
        <el-form-item
          label="卡单元类型"
          prop="unitType"
          :rules="[
            {required: true, message:'卡单元类型不能为空', trigger:'blur'}
          ]"
        >
          <ti-select v-model="formItem.unitType"
            placeholder="请选择"
            dict-type="tibms_toll_cardUnitType"
          />
        </el-form-item>

        <el-form-item
          label="卡单元编号"
          prop="unitNo"
          :rules="[
            {required: true, message:'卡单元编号不能为空', trigger:'blur'}
          ]"
        >
          <el-input v-model="formItem.unitNo" maxlength="10" @input="changeVolumeInput()"></el-input>
        </el-form-item>

        <el-form-item
          label="入库位置"
          prop="orgNameText"
        >
          <el-input v-model="formItem.orgNameText" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="经办人"
          prop="handlerText"
        >
          <el-input v-model="formItem.handlerText" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import {update, getById } from '../cardUnitApi'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { Notification } from 'element-ui'

export default {
  name: 'editCardUnitForm',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      detailShow: false,
      title: '卡单元修改',
      oldUnitNo:'',
      formItem: {
        unitType: '',
        unitNo: '',
        orgNameText:'',
        handlerText:''
      }
    }
  },
  methods: {
    init: function(method, tenantId, appId, row) {
      this.visible = true;
      this.detailShow = false;
      this.oldUnitNo = row.unitNo;
      this.$nextTick(async() => {

        try {

          const { data } = await getById(row.unitNo);
          if (null == data) {
            Notification({
              message: '数据不存在或已被删除，无法修改',
              type: 'error',
              offset: 50,
              duration: 5 * 1000
            })

            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData');
            this.visible = false;
          } else {
            this.render(tenantId, appId);

            // 当有数据时才去加载弹框
            cloneDeep(this.formItem, data);
            this.formItem.unitType = data.unitType + '';
            this.formItem.unitNo = data.unitNo + '';
            // 同时设置cardUnitVolume不可编辑
          }
        } finally {
          //this.loading = false
        }
      })

    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.detailShow = true;
      this.$refs.form.clearValidate();
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    changeVolumeInput: function() {
      // 控制最大容量的整型输入
      var pattern = /^([1-9]\d*)$/ // 正整数的正则表达式
      // 不符合正整数时
      if (!pattern.test(this.formItem.unitNo)) {
        // input 框绑定的内容为空
        this.formItem.unitNo = ''
      }
    },
    getData: function() {
    },
    save: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.saveLoading = true
            if(this.oldUnitNo != this.formItem.unitNo){
              let msg = '本次修改将自动重置卡数量为0！请确定是否修改？';
              this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                update(this.oldUnitNo, this.formItem).then((res) => {
                  if(res.data.flag){
                    this.$notify.success(res.data.msg)
                    this.$emit('refreshData')
                    this.visible = false
                  }else{
                    this.$notify.error(res.data.msg)
                  }
                })
              })
            }else{
              await update(this.oldUnitNo, this.formItem)
              this.$notify.success('保存成功')
              this.$emit('refreshData')
              this.visible = false
            }

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
