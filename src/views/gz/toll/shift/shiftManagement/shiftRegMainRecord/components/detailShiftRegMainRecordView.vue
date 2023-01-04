<template>
  <div class="app-container">

    <el-dialog
      title="交班登记详情"
      :close-on-click-modal="false"
      :visible.sync="visible"
      ref="detailRef"
      width="90%"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基础信息</span></div>
        <el-row>
          <el-col :span="6"><ti-detail-cell label="出入口类型" :value="shiftRegMainRecord.userMarkNoText"/></el-col>
          <el-col :span="6"><ti-detail-cell label="收费站" :value="shiftRegMainRecord.stationNameText"/></el-col>
          <el-col :span="6"><ti-detail-cell label="工班日期" :value="shiftRegMainRecord.squadDateText"/></el-col>
          <el-col :span="6"><ti-detail-cell label="工班" :value="shiftRegMainRecord.squadNoText"/></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><ti-detail-cell label="车道号" :value="shiftRegMainRecord.laneNo"/></el-col>
          <el-col :span="6"><ti-detail-cell label="发卡/收费员" :value="shiftRegMainRecord.operatorNameText"/></el-col>
          <el-col :span="6"><ti-detail-cell label="登记人" :value="shiftRegMainRecord.registerOperatorText"/></el-col>
          <el-col :span="6"><ti-detail-cell label="登记人机构" :value="shiftRegMainRecord.registerOrgName"/></el-col>
        </el-row>

        <div v-show="shiftRegMainRecord.userMarkNo == 1">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>纸券</span>
                  <span style="color: red;padding-left: 10px;">总数：{{shiftRegMainRecord.paperCount}}张</span>
                </div>
                <template>
                  <el-table
                    border
                    :data="shiftRegMainRecord.shiftSquadPaperList"
                    :header-cell-style="headerStyle"
                    style="width: 100%">
                    <el-table-column
                      prop="paperStart"
                      label="使用纸券起始号"
                      width="200">
                    </el-table-column>
                    <el-table-column
                      prop="paperEnd"
                      label="使用纸券终止号"
                      width="200">
                    </el-table-column>
                    <el-table-column
                      prop="paperCount"
                      label="使用数量"
                      width="200">
                    </el-table-column>
                  </el-table>
                </template>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-show="shiftRegMainRecord.userMarkNo == 2">
          <div slot="header" class="clearfix"><span>金额 &nbsp;&nbsp;&nbsp;</span><span style="color: red;">总额：{{shiftRegMainRecord.totalMoneyText}}元</span></div>
          <el-row>
            <el-col :span="6"><ti-detail-cell label="机打票缴款金额" :value="shiftRegMainRecord.invMoneyText"/></el-col>
            <el-col :span="6"><ti-detail-cell label="补缴金额" :value="shiftRegMainRecord.bujiaoMoneyText"/></el-col>
            <el-col :span="6"><ti-detail-cell label="定额票缴款金额" :value="shiftRegMainRecord.rationInvMoneyText"/></el-col>
            <el-col :span="6"><ti-detail-cell label="追缴金额" :value="shiftRegMainRecord.zhuiJiaoMoneyText"/></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><ti-detail-cell label-widh-per="10.3333" label="备注" :value="shiftRegMainRecord.remark"/></el-col>
          </el-row>
        </div>

        <div v-show="shiftRegMainRecord.userMarkNo == 2">
          <div slot="header" class="clearfix"><span>纸券</span><span style="color: red;padding-left: 10px;">总数：{{shiftRegMainRecord.paperCount}}张</span></div>
          <el-row>
            <el-col :span="6"><ti-detail-cell label="回收数量" :value="shiftRegMainRecord.paperCount"/></el-col>
          </el-row>
        </div>

        <div v-show="shiftRegMainRecord.userMarkNo == 2">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>机打发票</span>
                  <span style="color: red;padding-left: 10px;">使用：{{shiftRegMainRecord.invCount}}张</span>
                  <span style="color: red;padding-left: 10px;">作废：{{shiftRegMainRecord.badInvCount}}张</span>
                </div>
                <template>
                  <el-table
                    border
                    :data="shiftRegMainRecord.shiftInvDetailList"
                    :header-cell-style="headerStyle"
                    style="width: 100%">
                    <el-table-column
                      prop="invCode"
                      label="使用机打发票代码"
                      width="150">
                    </el-table-column>
                    <el-table-column
                      prop="invStartNo"
                      label="使用机打发票起始号"
                      width="160">
                    </el-table-column>
                    <el-table-column
                      prop="invEndNo"
                      label="使用机打发票终止号"
                      width="160">
                    </el-table-column>
                    <el-table-column
                      prop="invCount"
                      label="使用数量"
                      width="130">
                    </el-table-column>
                  </el-table>
                </template>
                <template>
                  <el-table
                    border
                    :data="shiftRegMainRecord.shiftSquadInvalidInvList"
                    :header-cell-style="headerStyle"
                    style="width: 100%;margin-top: 10px;">
                    <el-table-column
                      prop="invCode"
                      label="作废机打发票代码"
                      width="300">
                    </el-table-column>
                    <el-table-column
                      prop="badInvID"
                      label="作废机打发票号码"
                      width="300">
                    </el-table-column>
                  </el-table>
                </template>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>定额发票</span>
                    <span style="color: red;padding-left: 10px;">使用：{{shiftRegMainRecord.rationInvCount}}张</span>
                    <span style="color: red;padding-left: 10px;">总面额：{{shiftRegMainRecord.rationInvTotalMoneyText}}元</span>
                  </div>
                  <template>
                    <el-table
                      border
                      :data="shiftRegMainRecord.shiftSquadRationInvoiceList"
                      :header-cell-style="headerStyle"
                      style="width: 100%">
                      <el-table-column
                        prop="invCode"
                        label="使用定额发票代码"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        prop="invStartNo"
                        label="使用定额发票起始号"
                        width="144">
                      </el-table-column>
                      <el-table-column
                        prop="invEndNo"
                        label="使用定额发票终止号"
                        width="144">
                      </el-table-column>
                      <el-table-column
                        prop="invCount"
                        label="使用数量"
                        width="80">
                      </el-table-column>
                      <el-table-column
                        label="面额"
                        width="70">
                        <template slot-scope="scope">
                          {{scope.row.invRationMoney / 100.0}}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-card>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-row style="text-align: center;padding-top: 20px;">
        <el-button @click="visible = false">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>


<script>

import mixin from 'ecip-web/utils/common-mixin'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import api from '../shiftRegMainRecordApi.js'
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"

export default {
  name: 'detailShiftRegMainRecordForm',
  components: { TiSelect, tiSysOrg, TiDetailCell},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      shiftRegMainRecord: {},
    }
  },
  methods: {
    detail(tenantId, appId, id) {
      this.visible = true
      this.$nextTick(async() => {
        let that = this
        that.render(tenantId, appId)
        api.detail(id).then(data => {
          if (null == data || null == data.data) {
            that.$alert("获取交班登记详情失败，请检查！")
            that.$emit('refreshData')
            that.visible = false
            return
          }

          that.shiftRegMainRecord = data.data
          //cloneDeep(that.shiftRegMainRecord, data.data)

        })
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.shiftRegMainRecord = []
    },
    getData: function() {
    },
    headerStyle({ row, rowIndex}){
      return 'text-align: center !important;'
    }
  }
}
</script>

<style scoped>


</style>
