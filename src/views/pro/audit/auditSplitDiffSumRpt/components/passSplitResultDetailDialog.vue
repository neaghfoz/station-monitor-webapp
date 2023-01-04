<template>
  <el-dialog title="流水明细" :visible.sync="dialogVisible" :params="params" width="85%">
    <div class="app-container" id="detail">
      <el-card class="box-card" >
        <div slot="header" class="clearfix"><span style="color: #0088ff">基础信息</span></div>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="交易车牌" :value="baseData.vehiclePlate + '_' + baseData.vehiclePlateColorDesc"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车型" :value="baseData.vehicleTypeDesc"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车种" :value="baseData.vehicleClassDesc"/>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="入口站" :value="baseData.realPathFirstName"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="入口交易时间" :value="baseData.realPathFirstTime"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="通行介质" :value="baseData.mediaTypeDesc"/>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8"  >
            <ti-detail-cell label="出口站" :value="baseData.realPathLastName"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口交易时间" :value="baseData.realPathLastTime"/>
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口计费类型" :value="baseData.exitFeeTypeDesc"/>
          </el-col>
        </el-row>
      </el-card>

      <div>
        <vxe-grid
          ref="feePassDetailDialog"
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          keep-source
          highlight-current-row
          max-height="600"
          class="vxe-table-element"
          :toolbar="tableToolbar"
          :loading="loading"
          :columns="columns"
          :data="tableData"
        >

          <template v-slot:toolbar_buttons>
            <span style="position: absolute; left: 17px; top: 10px">通行路径明细</span>
          </template>
        </vxe-grid>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import { findPathInfo } from "@/views/pro/audit/auditSplitDiffSumRpt/api/passSplitResultApi"

export default {
  name: "audit.auditSplitDiffSumRpt.components.passSplitResultDetailDialog",
  components: { TiDetailCell },
  mixins: [...mixin],
  props: {
    value: {
      type: [String, Number, Object]
    },
    params: {
      type: [String, Number, Object],
      required: true
    },

  },
  data () {
    return {
      dialogVisible: false,
      baseData: {},
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      tableToolbar: {
        id: 'audit.auditSplitDiffSumRpt.components.passSplitResultDetailDialog-toolbar',
        custom: true,
        slots: {
          buttons: 'toolbar_buttons'
        },
        zoom: false, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      columns: [
        {
          title: "序号",
          type: "seq",
          width: 50,
          align: "center"
        },
        {
          minWidth: 150, field: 'tollIntervalName', title: '收费单元', align: 'center', showOverflow: true,
          slots: {
            default: ({ row }, h) => {
              return row.tollIntervalName ? '[' + row.tollIntervalId + ']' + row.tollIntervalName : '[' + row.tollIntervalId + ']' + '未知'
            }
          }
        },
        { minWidth: 150, field: 'tradeTime', title: '交易时间', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'payFeeStr', title: '应收金额(元)', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'feeStr', title: '交易金额(元)', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'discountFeeStr', title: '优惠金额(元)', align: 'center', showOverflow: true },
        { minWidth: 150, field: 'splitFeeStr', title: '拆分金额(元)', align: 'center', showOverflow: true }
      ],
      tableData: []
    }
  },
  watch: {
    dialogVisible (v) {
      if (v) {
        this.init();
      }
    }
  },
  methods: {
    init () {
      this.baseData = this.params
      this.$nextTick(async => {
        this.getData();
      }
      );
    },
    async getData () {
      // console.log("params:",params);
      console.log("params:", this.params);
      let param = {
        sectionCode:this.params.sectionCode,
        passId:this.params.passId,
        pathLastTime:this.params.pathLastTime
      };
      // param = {
      //   sectionCode:'G0015440060',
      //   passId:'020000330101610084138320210604210612',
      //   pathLastTime:'2021-03-20 08:10:14',
      // };

      this.loading = true;
      const { data } = await findPathInfo({},param);
      this.baseData = data.result;
      this.tableData = data.pathInfo;
      this.loading = false;
    }
  }
}
</script>

<style scoped>
/*.roadnet {*/
/*  padding: 15px 30px;*/
/*}*/

/*.roadnet .blue_title {*/
/*  color: #0088ff;*/
/*  margin-bottom: 10px;*/
/*}*/

/*.roadnet .jc_box {*/
/*  display: flex;*/
/*  display: -webkit-flex;*/
/*  margin-bottom: 30px;*/
/*}*/

/*.roadnet .jc_box > div {*/
/*  flex: 1;*/
/*}*/

/*.roadnet .jc_box > div > div {*/
/*  position: relative;*/
/*  color: #333;*/
/*  padding-left: 100px;*/
/*  margin-bottom: 5px;*/
/*  !*padding-top:30px*!*/
/*  min-height: 18px;*/
/*}*/

/*.roadnet .jc_box > div > div p {*/
/*  position: absolute;*/
/*  left: 0;*/
/*  top: 0;*/
/*  color: #999;*/
/*}*/
</style>
