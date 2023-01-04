<template>
  <div class="app-container" >
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
    <el-form v-show="addShow" ref="form" v-loading="loading" :model="formItem" label-width="100px" >
      <el-row >
        <el-form-item
          label="卡单元类型"
          prop="unitType"
          :rules="[
            {required: true, message:'请选择卡单元类型', trigger:'blur'}
          ]"
        >
          <ti-select v-model="formItem.unitType"
                      placeholder="请选择"
                      dict-type="tibms_toll_cardUnitType"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="机构" prop="orgId" :rules="[{required: true, message:'机构不能为空', trigger:'blur'}]">
          <ti-sys-org  ref="sysOrg" v-model="formItem.orgId" default-first-value />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="经办人"
          prop="handlerNo"
          :rules="[
            {required: true, message:'请选择经办人', trigger:'blur'}
          ]"
        >
          <ti-select v-model="formItem.handlerNo"
                     placeholder="请选择"
                     url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}"
          />
        </el-form-item>
      </el-row>
      <el-row></el-row>
      <el-row style="width: 65%;text-align: center;line-height: 32px;background-color: #f5f5f5;">
        <el-col :span="18" style="border: 1px solid #cacaca;">卡单元编号</el-col>
        <el-col :span="6" style="border: 1px solid #cacaca;">
          <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addRow()"/>
        </el-col>

      </el-row>
      <el-row style="width: 65%;text-align: center;line-height: 32px;" v-for="(item,index) in formItem.unitNoList">
        <el-col :span="18" style="border: 1px solid #cacaca;">
          <el-input v-model="formItem.unitNoList[index]" maxlength="10" @input="changeVolumeInput(index)"></el-input>
        </el-col>
        <el-col :span="6" style="border: 1px solid #cacaca;">
          <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="delRow(index)"/>
        </el-col>

      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" style="margin-left: 110px;">
       <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" :loading="saveLoading" @click="save">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save } from '../cardUnitApi'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

export default {
  name: 'addCardUnitForm',
  components: { TiSelect, tiSysOrg },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      addShow: false,
      loading: false,
      saveLoading: false,
      method: '',
      title: '卡单元录入',
      formItem: {
        unitType: '',
        handlerNo:'',
        orgId: '',
        unitNos:'',
        unitNoList:[]
      }
    }
  },

  methods: {
    init(tenantId, appId) {
      this.visible = true;
      this.addShow = false;
      this.$nextTick(async() => {
        this.render(tenantId, appId);
      })
    },
    getData() {
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.addShow = true;
      this.$refs.form.clearValidate();
      Object.assign(this.$data.formItem, this.$options.data().formItem);
      this.formItem.tenanId = tenantId;
      this.formItem.appId = appId;
      console.log(appId);
    },

    addRow(){
      let that = this
      let num = 1
      for(let item of that.formItem.unitNoList){
        if(item == '' || item == undefined || item == null){
          that.$notify.error('第'+num+'行卡单元不能为空！')
          return
        }
        num++
      }
      this.formItem.unitNoList.push('');
    },
    delRow(index){
      this.formItem.unitNoList.splice(index,1);
    },
    changeVolumeInput: function(index) {
      // 控制最大容量的整型输入
      let pattern = /^([1-9]\d*)$/ // 正整数的正则表达式
      // 不符合正整数时
      if (!pattern.test(this.formItem.unitNoList[index])) {
        // input 框绑定的内容为空
        this.formItem.unitNoList[index] = ''
      }
    },
    checkBeforSubmit : function () {
      let that = this
      let cardUnitNum = this.formItem.unitNoList.length;
      if (cardUnitNum == 0) {
        that.$notify({message:"请至少添加一个卡单元编号！",type:"error"});
        return false
      }

      let arr = []
      let unitNo = ''
      let num = 1
      for(let item of that.formItem.unitNoList){
        if(item == '' || item == undefined || item == null){
          that.$notify.error('第'+num+'行卡单元不能为空！')
          return false
        }
        num++
        if (arr.indexOf(item) < 0) {
          arr.push(item);
        } else {
          unitNo = item;
          break
        }
      }

      if (unitNo != '') {
        that.$notify({message:unitNo + '的卡单元编号有重复，请检查重输!',type:"error"});
        return false
      }

      return true
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            if (!this.checkBeforSubmit()) {
              return;
            }
            this.saveLoading = true
            let sysOrg = this.$refs.sysOrg.getSysOrg();
            let cardUnitNum = this.formItem.unitNoList.length;
            let msg = '确认录入' + cardUnitNum + '个卡单元到' + sysOrg.fullName + '?';
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.formItem.unitNos = this.formItem.unitNoList.join(",");
              save(this.formItem).then((res) => {
                if(res.data.flag){
                  this.$notify.success(res.data.msg)
                  this.$emit('refreshData')
                  this.visible = false
                }else{
                  this.$notify.error(res.data.msg)
                }

              })
            })
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
