<template>
  <div class="app-container">
    <el-dialog
      title="定额发票入库"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-dialog
        width="50%"
        title="定额发票入库清单确认"
        :visible.sync="detailVisible"
        append-to-body
      >
        <el-row>
          <el-col>发票面额：{{ invMoneyStr }}</el-col>
          <el-col>发票段：{{ formItem.invStartNo }}-{{ formItem.invEndNo }}</el-col>
          <el-col>入库位置：{{ sysOrgName }}</el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="submitDetail">确 定</el-button>
        </div>
      </el-dialog>

      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px" :rules="rules">
        <el-form-item
          label="类型"
          prop="invType"
          :rules="[
            {required: true, message:'类型不能为空', trigger:'blur'}
          ]"
        >
          <ti-select
            v-model="formItem.invType"
            placeholder="请选择"
            dict-type="tibms_toll_rinvoiceType"
            @change="changeInputType"
          />
        </el-form-item>
        <el-form-item
          v-show="showInputMoney"
          label="发票面额"
          prop="invMoney"
        >
          <el-select
            v-model="formItem.invMoney"
            placeholder="请选择"
            @change="changeSelectMoney"
          >
            <el-option
              v-for="item in moneyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="发票起始号"
          prop="invStartNo"
        >
          <el-input
            type="text"
            v-model="formItem.invStartNo"
            maxlength="9"
            @input="changeInvStartNoInput"
            placeholder="发票起始号"
          />
        </el-form-item>
        <el-form-item
          label="发票终止号"
          prop="invEndNo"
        >
          <el-input
            type="text"
            v-model="formItem.invEndNo"
            maxlength="9"
            @input="changeInvEndNoInput"
            placeholder="发票终止号"
          />
        </el-form-item>
        <el-form-item
          label="入库位置"
          prop="sysOrg.id"
          :rules="[
            {required: true, message:'入库位置不能为空', trigger:'blur'}
          ]"
        >
          <ti-sys-org ref="sysOrg" v-model="formItem.sysOrg.id" @change="changeOrg"/>
        </el-form-item>
        <el-form-item
          label="经办人"
          prop="xoperatorNo"
          :rules="[
          {required: true, message: '经办人不能为空', trigger: 'blur'}
        ]"
        >
          <ti-select
            v-model="formItem.xoperatorNo"
            :data-list="sysUserDatas"
            :props="{key:'id',value:'username',label:'fullName'}"
            @change="changeUser"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="saveDetail">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { save } from '../rinvoiceApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import { getData } from '@/views/pro/common/tiElement/tiSelect/tiSelectApi'

export default {
  name: 'RinvoiceSaveDetailForm',
  components: {
    TiSelect,
    tiSysOrg
  },
  mixins: [...mixin],
  data() {
    var checkInvStartNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('定额发票起始号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('定额发票起始号必须大于0'))
        } else {
          if (this.formItem.invEndNo !== '') {
            const startInt = parseInt(this.formItem.invStartNo)
            const endInt = parseInt(this.formItem.invEndNo)

            if (startInt > endInt) {
              callback(new Error('定额发票终止号要大于或等于定额发票起始号'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    }
    var checkInvEndNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('定额发票终止号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('定额发票终止号必须大于0'))
        } else {
          if (this.formItem.invStartNo !== '') {
            const startInt = parseInt(this.formItem.invStartNo)
            const endInt = parseInt(this.formItem.invEndNo)

            if (startInt > endInt) {
              callback(new Error('定额发票终止号要大于或等于定额发票起始号'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    }
    var checkInvMoney = (rule, value, callback) => {
      if (!this.showInputMoney) {
        callback()
      } else {
        console.log(value)
        if (value === '') {
          callback(new Error('定额发票面额不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      detailVisible: false,
      loading: false,
      saveLoading: false,
      method: '',
      moneyOptions: [
        {
          value: '20',
          label: '20'
        },
        {
          value: '50',
          label: '50'
        },
        {
          value: '100',
          label: '100'
        }
      ],
      invMoneyStr: '',
      formItem: {
        invType: '',
        invStartNo: '',
        invEndNo: '',
        invMoney: '',
        sysOrg: {
          id: ''
        },
        xoperatorNo: '',
        invoiceItems: []
      },
      showInputMoney: false,
      sysOrgDatas: [],
      invCode: '',
      invSplitNum: '',
      invCount: '',
      sysOrgName: '',
      instoreDetailData: [],
      sysUserDatas: [],
      sysUserName: '',
      rules: {
        invStartNo: [
          {
            required: true,
            validator: checkInvStartNo,
            trigger: 'blur'
          }
        ],
        invEndNo: [
          {
            required: true,
            validator: checkInvEndNo,
            trigger: 'blur'
          }
        ],
        invMoney: [
          {
            required: true,
            validator: checkInvMoney,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init: async function(tenantId, appId, row) {
      this.renderOrgList((await getData('api/v1/common/sysOrg/orgList', null, null, false)).data)
      this.sysUserDatas = (await getData('/api/v1/common/sysUser/list', null, null, false)).data
      this.visible = true
      this.detailVisible = false
      this.$nextTick(async() => {
        this.render(tenantId, appId)
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$refs.form.clearValidate()
      Object.assign(this.$data.formItem, this.$options.data().formItem)
      this.formItem.tenanId = tenantId
      this.formItem.appId = appId
    },
    changeInvStartNoInput: function() {
      // 控制发票代码的整型输入
      this.formItem.invStartNo = this.formItem.invStartNo.replace(/[^\d]/g, '')
    },
    changeInvEndNoInput: function() {
      // 控制发票代码的整型输入
      this.formItem.invEndNo = this.formItem.invEndNo.replace(/[^\d]/g, '')
    },
    getData: function() {
    },
    changeSelectMoney: function(el) {
      this.invMoneyStr = el + ''
    },
    changeInputType: function(el) {
      if (el === '1') {
        // 显示定额发票面额输入
        this.showInputMoney = true
        this.invMoneyStr = el
      } else {
        // 默认面额1-10元
        this.showInputMoney = false
        this.invMoneyStr = '1-10'
      }
    },
    changeOrg: function(el) {
      for (let i = 0; i < this.sysOrgDatas.length; i++) {
        if (el === this.sysOrgDatas[i].id) {
          this.sysOrgName = this.sysOrgDatas[i].fullName
          break
        }
      }
    },
    changeUser: function(el) {
      for (let i = 0; i < this.sysUserDatas.length; i++) {
        if (el === this.sysUserDatas[i].username) {
          this.sysUserName = this.sysUserDatas[i].fullName
          break
        }
      }
    },
    renderOrgList: function(datas) {
      for (const index in datas) {
        this.renderOrg(datas[index])
      }
    },
    renderOrg: function(org) {
      if (org.children !== undefined) {
        for (const index in org.children) {
          this.renderOrg(org.children[index])
        }
      }

      this.sysOrgDatas.push(org)
    },
    submitDetail: async function() {
      try {
        this.saveLoading = true
        await save(this.formItem)
        this.$notify.success('保存成功')
        this.$emit('refreshData')
        this.detailVisible = false
        this.visible = false
      } finally {
        this.saveLoading = false
      }
    },
    saveDetail: function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.detailVisible = true
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
