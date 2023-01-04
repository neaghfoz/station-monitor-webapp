<template>
  <div class="app-container">
    <el-dialog
      title="纸券入库"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-dialog
        width="50%"
        title="纸券入库清单确认"
        :visible.sync="detailVisible"
        append-to-body>
        <el-row>
          <el-col>入库位置：{{selectOrg.name}}</el-col>
          <el-col>经办人：{{sysUserName}}</el-col>
          <el-col>纸券本数：{{paperSplitNum}}</el-col>
          <el-col>纸券总数：{{paperCount}}</el-col>
          <el-col>所属站：{{selectStationOrg.name}}</el-col>
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
            prop="paperStartNo"
            label="纸券起始号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="paperEndNo"
            label="纸券终止号">
          </el-table-column>
          <el-table-column
            prop="paperCount"
            label="纸券数量">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="submitDetail">确 定</el-button>
        </div>
      </el-dialog>

      <el-form ref="form" v-loading="loading" :model="formItem" label-width="100px" :rules="rules">
        <el-form-item
          label="入库位置"
          prop="sysOrg.id"
          :rules="[{required: true, message:'入库位置不能为空', trigger:'blur'}]"
        >
          <ti-sys-org ref="sysOrg" v-model="formItem.sysOrg.id" @change="changeOrg"/>
        </el-form-item>
        <el-form-item
          label="所属站"
          prop="stationOrg.id"
        >
          <ti-sys-org ref="sysOrg" v-model="formItem.stationOrg.id" @change="changeStationOrg"/>
        </el-form-item>
        <el-form-item
          label="纸券起始号"
          prop="paperStartNo"
        >
          <el-input
            type="text"
            v-model="formItem.paperStartNo"
            maxlength="14"
            @input="changePaperStartNoInput"
            placeholder="纸券起始号"/>
        </el-form-item>
        <el-form-item
          label="纸券终止号"
          prop="paperEndNo"
        >
          <el-input
            type="text"
            v-model="formItem.paperEndNo"
            maxlength="14"
            @input="changePaperEndNoInput"
            placeholder="纸券终止号"/>
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
          一本纸券数为{{showConfig.paperSplit === '--' ? 100 : showConfig.paperSplit}}张
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
import { save } from '../paperApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import dictUtils from 'ecip-web/utils/dictUtils'
import { getData } from '@/views/pro/common/tiElement/tiSelect/tiSelectApi'

export default {
  name: 'PaperSaveDetailForm',
  components: {
    TiSelect,
    tiSysOrg
  },
  mixins: [...mixin],
  data() {
    var checkPaperStartNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('纸券起始号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('纸券起始号必须大于0'))
        } else {
          if (this.formItem.paperEndNo !== '') {
            const startInt = parseInt(this.formItem.paperStartNo)
            const endInt = parseInt(this.formItem.paperEndNo)

            if (startInt > endInt) {
              callback(new Error('纸券终止号要大于或等于纸券起始号'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    }
    var checkPaperEndNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('纸券终止号不能为空'))
      } else {
        const parseIntValue = parseInt(value)
        if (parseIntValue <= 0) {
          callback(new Error('纸券终止号必须大于0'))
        } else {
          if (this.formItem.paperStartNo !== '') {
            const startInt = parseInt(this.formItem.paperStartNo)
            const endInt = parseInt(this.formItem.paperEndNo)

            if (startInt > endInt) {
              callback(new Error('纸券终止号要大于或等于纸券起始号'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    }
    var checkStationOrg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('所属站不能为空'))
      } else {
        if (this.selectStationOrg.level !== '4') {
          callback(new Error('所属站必须选择收费站机构'))
        } else if (this.selectOrg.fullCode !== '' && this.selectStationOrg.fullCode !== this.selectOrg.fullCode && this.selectStationOrg.fullCode.indexOf(this.selectOrg.fullCode + '_') !== 0) {
          callback(new Error('所属站并不是入库位置或入库位置的下级机构'))
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
      formItem: {
        paperCode: '2000-01',
        paperStartNo: '',
        paperEndNo: '',
        paperVehType: '0',
        xoperatorNo: '',
        sysOrg: {
          id: ''
        },
        stationOrg: {
          id: ''
        },
        paperItems: []
      },
      sysOrgDatas: [],
      paperSplitNum: '',
      paperCount: '',
      selectOrg: {
        name: '',
        level: '',
        fullCode: ''
      },
      selectStationOrg: {
        name: '',
        level: '',
        fullCode: ''
      },
      instoreDetailData: [],
      sysUserDatas: [],
      sysUserName: '',
      rules: {
        paperStartNo: [
          {
            required: true,
            validator: checkPaperStartNo,
            trigger: 'blur'
          }
        ],
        paperEndNo: [
          {
            required: true,
            validator: checkPaperEndNo,
            trigger: 'blur'
          }
        ],
        stationOrg: {
          id: [
            {
              required: true,
              validator: checkStationOrg,
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  computed: {
    showConfig() {
      return {
        paperSplit: dictUtils.getDictLabel('tibms_config', 'toll_card_paperSplit'),
        paperMaxSplitNum: dictUtils.getDictLabel('tibms_config', 'toll_card_paperMaxSplitNum')
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
    changePaperStartNoInput: function() {
      // 控制发票代码的整型输入
      this.formItem.paperStartNo = this.formItem.paperStartNo.replace(/[^\d]/g, '')
    },
    changePaperEndNoInput: function() {
      // 控制发票代码的整型输入
      this.formItem.paperEndNo = this.formItem.paperEndNo.replace(/[^\d]/g, '')
    },
    getData: function() {
    },
    changeOrg: function(el) {
      for (let i = 0; i < this.sysOrgDatas.length; i++) {
        if (el === this.sysOrgDatas[i].id) {
          this.selectOrg.name = this.sysOrgDatas[i].fullName
          this.selectOrg.level = this.sysOrgDatas[i].nodeLevel
          this.selectOrg.fullCode = this.sysOrgDatas[i].fullCode
          break
        }
      }
    },
    changeStationOrg: function(el) {
      for (let i = 0; i < this.sysOrgDatas.length; i++) {
        if (el === this.sysOrgDatas[i].id) {
          this.selectStationOrg.name = this.sysOrgDatas[i].fullName
          this.selectStationOrg.level = this.sysOrgDatas[i].nodeLevel
          this.selectStationOrg.fullCode = this.sysOrgDatas[i].fullCode
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
        this.formItem.paperItems = this.instoreDetailData
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
          const paperStartNo = parseInt(this.formItem.paperStartNo)
          const paperEndNo = parseInt(this.formItem.paperEndNo)

          // 发票本数
          const splitCondition = this.showConfig.paperSplit === '--' ? 100 : parseInt(this.showConfig.paperSplit)
          const maxSplit = this.showConfig.paperMaxSplitNum === '--' ? 100 : parseInt(this.showConfig.paperMaxSplitNum)
          const splitNums = this.calSplitNum(paperStartNo, paperEndNo, splitCondition)
          if (splitNums > maxSplit) {
            this.$notify.error('拆分本数超过' + maxSplit + '本，禁止录入')
          } else {
            this.paperCount = paperEndNo - paperStartNo + 1
            this.paperSplitNum = splitNums
            this.instoreDetailData = this.calInv(paperStartNo, paperEndNo, splitCondition, splitNums)
            this.detailVisible = true
          }
        }
      })
    },
    calSplitNum: function(paperStartNo, paperEndNo, splitCondition) {
      const totalCount = paperEndNo - paperStartNo + 1

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
    calInv: function(paperStartNo, paperEndNo, splitCondition, splitNums) {
      // 根据票段分本
      const paperItemList = []

      for (let i = 0; i < splitNums; i++) {
        const item = { }
        item.seq = i + 1
        if (paperStartNo + splitCondition - 1 >= paperEndNo) {
          item.paperStartNo = paperStartNo
          item.paperEndNo = paperEndNo
          item.paperCount = paperEndNo - paperStartNo + 1
          paperItemList.push(item)
          break
        } else {
          item.paperStartNo = paperStartNo
          item.paperEndNo = paperStartNo + splitCondition - 1
          item.paperCount = splitCondition
          paperItemList.push(item)
        }

        paperStartNo += splitCondition
      }

      return paperItemList
    }
  }
}
</script>

<style scoped>

</style>
