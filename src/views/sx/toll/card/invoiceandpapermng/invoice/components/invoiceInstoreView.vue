<template>
  <div class="app-container">
    <el-dialog
      title="机打发票入库"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-dialog
        width="50%"
        title="发票入库清单确认"
        :visible.sync="detailVisible"
        append-to-body>
        <el-row>
          <el-col>入库位置：{{sysOrgName}}</el-col>
          <el-col>经办人：{{sysUserName}}</el-col>
          <el-col>发票代码：{{invCode}}</el-col>
          <el-col>发票本数：{{invSplitNum}}</el-col>
          <el-col>发票总数：{{invCount}}</el-col>
        </el-row>
        <el-table
          :data="instoreDetailData"
          height="250"
          style="width: 100%">
          <el-table-column
            prop="seq"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="invStartNo"
            label="发票起始号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="invEndNo"
            label="发票终止号">
          </el-table-column>
          <el-table-column
            prop="invCount"
            label="发票数量">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="submitDetail">确 定</el-button>
        </div>
      </el-dialog>

      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px" :rules="rules">
        <el-form-item
          label="发票代码"
          prop="invCode"
          :rules="[{required: true, message:'发票代码不能为空', trigger:'blur'}]"
        >
          <ti-select
            v-model="formItem.invCode"
            placeholder="请选择"
            url="/api/v1/invoicecode/list"
            :isPost="true"
          />
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
            placeholder="发票起始号"/>
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
            placeholder="发票终止号"/>
        </el-form-item>
        <el-form-item
          label="入库位置"
          prop="sysOrg.id"
          :rules="[{required: true, message:'入库位置不能为空', trigger:'blur'}]"
        >
          <ti-sys-org ref="sysOrg" v-model="formItem.sysOrg.id" @change="changeOrg"/>
        </el-form-item>
        <el-form-item
          label="经办人"
          prop="xoperatorNo"
          :rules="[{required: true, message:'经办人不能为空', trigger:'blur'}]"
        >
          <ti-select
            v-model="formItem.xoperatorNo"
            :data-list="sysUserDatas"
            :props="{key:'id',value:'username',label:'fullName'}"
            @change="changeUser"/>
        </el-form-item>
        <el-form-item
          label="说明"
        >
          一本发票数为{{showConfig.invoiceSplit === '--' ? 3000 : showConfig.invoiceSplit}}张
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
import { save } from '../invoiceApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import dictUtils from 'ecip-web/utils/dictUtils'
import { getData } from '@/views/pro/common/tiElement/tiSelect/tiSelectApi'

export default {
  name: 'InvoiceSaveDetailForm',
  components: {
    TiSelect,
    tiSysOrg
  },
  mixins: [...mixin],
  data() {
    var checkInvStartNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('发票起始号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('发票起始号必须大于0'))
        } else {
          if (this.formItem.invEndNo !== '') {
            const startInt = parseInt(this.formItem.invStartNo)
            const endInt = parseInt(this.formItem.invEndNo)

            if (startInt > endInt) {
              callback(new Error('发票终止号要大于或等于发票起始号'))
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
        callback(new Error('发票终止号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('发票终止号必须大于0'))
        } else {
          if (this.formItem.invStartNo !== '') {
            const startInt = parseInt(this.formItem.invStartNo)
            const endInt = parseInt(this.formItem.invEndNo)

            if (startInt > endInt) {
              callback(new Error('发票终止号要大于或等于发票起始号'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    }
    return {
      visible: false,
      detailVisible: false,
      loading: false,
      saveLoading: false,
      method: '',
      formItem: {
        invCode: '',
        invStartNo: '',
        invEndNo: '',
        sysOrg: {
          id: ''
        },
        invoiceItems: []
      },
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
        ]
      }
    }
  },
  computed: {
    showConfig() {
      return {
        invoiceSplit: dictUtils.getDictLabel('tibms_config', 'toll_card_invoiceSplit'),
        invoiceMaxSplitNum: dictUtils.getDictLabel('tibms_config', 'toll_card_invoiceMaxSplitNum')
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
        this.formItem.invoiceItems = this.instoreDetailData
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
          const invStartNo = parseInt(this.formItem.invStartNo)
          const invEndNo = parseInt(this.formItem.invEndNo)
          const invCode = this.formItem.invCode

          // 发票本数
          const splitCondition = this.showConfig.invoiceSplit === '--' ? 3000 : parseInt(this.showConfig.invoiceSplit)
          const maxSplit = this.showConfig.invoiceMaxSplitNum === '--' ? 10 : parseInt(this.showConfig.invoiceMaxSplitNum)
          const splitNums = this.calSplitNum(invStartNo, invEndNo, splitCondition)
          if (splitNums > maxSplit) {
            this.$notify.error('拆分本数超过' + maxSplit + '本，禁止录入')
          } else {
            this.invCode = invCode
            this.invCount = invEndNo - invStartNo + 1
            this.invSplitNum = splitNums
            this.instoreDetailData = this.calInv(invCode, invStartNo, invEndNo, splitCondition, splitNums)
            this.detailVisible = true
          }
        }
      })
    },
    calSplitNum: function(invStartNo, invEndNo, splitCondition) {
      const totalCount = invEndNo - invStartNo + 1

      const mod = totalCount % splitCondition
      const div = parseInt(totalCount / splitCondition)
      let splitNums = 1
      if (mod !== 0) {
        splitNums = div + 1
      } else {
        splitNums = div
      }
      return splitNums
    },
    calInv: function(invCode, invStartNo, invEndNo, splitCondition, splitNums) {
      // 根据票段分本
      const invoiceItemList = []

      for (let i = 0; i < splitNums; i++) {
        const item = { }
        item.invCode = invCode
        item.seq = i + 1
        if (invStartNo + splitCondition - 1 >= invEndNo) {
          item.invStartNo = invStartNo
          item.invEndNo = invEndNo
          item.invCount = invEndNo - invStartNo + 1
          invoiceItemList.push(item)
          break
        } else {
          item.invStartNo = invStartNo
          item.invEndNo = invStartNo + splitCondition - 1
          item.invCount = splitCondition
          invoiceItemList.push(item)
        }

        invStartNo += splitCondition
      }

      return invoiceItemList
    }
  }
}
</script>

<style scoped>

</style>
