<template>
  <el-dialog :close-on-press-escape="false" title="流水明细" :visible.sync="dialogVisible" :params="params" width="85%">
    <div >
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span style="color: #0088ff">基础信息</span></div>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="交易车牌" :value="baseData.vehiclePlate + '_' + baseData.vehiclePlateColorDesc" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车型" :value="baseData.vehicleTypeDesc" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车种" :value="baseData.vehicleClassDesc" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="入口站" :value="baseData.realPathFirstName" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="入口交易时间" :value="baseData.realPathFirstTime" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="通行介质" :value="baseData.mediaTypeDesc" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="出口站" :value="baseData.realPathLastName" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口交易时间" :value="baseData.realPathLastTime" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口计费类型" :value="baseData.exitFeeTypeDesc" />
          </el-col>
        </el-row>
      </el-card>

      <road-map ref="roadMap" :show-map="showMap" :check-show="false">
        <template slot="content">
          <vxe-grid
            ref="feePassDetailDialog"
            highlight-hover-row
            border
            resizable
            sync-resize
            auto-resize
            keep-source
            highlight-current-row
            show-footer
            max-height="600"
            class="vxe-table-element"
            :loading="loading"
            :columns="columns"
            :data="tableData"
            :footer-method="footerMethod"
          >
          </vxe-grid>
          <br/>
          <div style="color: red;">* &nbsp;只显示经过本路段的收费单元</div>
        </template>
      </road-map>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  import { findPathInfo } from "@/views/pro/fitcheck/auditSplitDiffSumRpt/api/passSplitResultApi"
  import RoadMap from "@/views/pro/fitcheck/common/roadMap/roadMap.vue"
  import { tibms } from '@/settings'

  export default {
    name: "fitcheck.auditSplitDiffSumRpt.components.passSplitResultDetailDialog",
    components: { TiDetailCell,RoadMap },
    mixins: [...mixin],
    props: {
      value: {
        type: [String, Number, Object]
      },
      params: {
        type: [String, Number, Object],
        required: true
      }
    },
    data () {
      return {
        showType: (tibms && tibms.fitcheck && tibms.fitcheck.mapEnabled) ? 'direct' : 'list',
        dialogVisible: false,
        showMap: true,
        baseData: {},
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        columns: [
          {
            title: "序号",
            type: "seq",
            width: 50,
            align: "center"
          },
          {
            minWidth: 400, field: 'tollIntervalName', title: '收费单元', align: 'left', headAlign: 'center', showOverflow: true,
            slots: {
              default: ({ row }, h) => {
                return row.tollIntervalName ? '[' + row.tollIntervalId + ']' + row.tollIntervalName : '[' + row.tollIntervalId + ']' + '未知'
              }
            }
          },
          { minWidth: 120, field: 'tradeTime', title: '交易时间', align: 'center', showOverflow: true },
          { minWidth: 100, field: 'payFeeStr', title: '应收金额(元)', align: 'right', headerAlign: 'center',showOverflow: true },
          { minWidth: 100, field: 'feeStr', title: '交易金额(元)', align: 'right', headerAlign: 'center', showOverflow: true },
          { minWidth: 100, field: 'discountFeeStr', title: '优惠金额(元)', align: 'right', headerAlign: 'center', showOverflow: true },
          { minWidth: 100, field: 'splitFeeStr', title: '拆分金额(元)', align: 'right', headerAlign: 'center', showOverflow: true }
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
        if (this.params && this.params.resultType === 3){
          this.showMap = false
        } else {
          this.showMap = true
        }

        this.$nextTick(async => {
            this.getData();
            this.getPathDetail();
          }
        );
      },
      async getData () {
        let param = {
          sectionCode: this.params.sectionCode,
          passId: this.params.passId,
          pathLastTime: this.params.pathLastTime
        };
        this.loading = true;
        const { data } = await findPathInfo({}, param);
        this.baseData = data.result;
        this.tableData = data.pathInfo;
        this.loading = false;
      },
      // 获取路径明细列表
      async getPathDetail(){
        this.$refs.roadMap.initData({
          passId: this.params.passId,
          enTime: this.params.enTime
        })
      },
      sumFee(list, field){
        let sumFeeTotal = 0
        list.forEach(item => {
          if(item[field] && item[field] != '-'){
            sumFeeTotal += Number(item[field])
          }
        })
        return sumFeeTotal
      },
      footerMethod({ columns, data }) {
        const sums = [];
        columns.forEach((column, columnIndex) => {
          if(columnIndex === 0){
            sums.push("合计")
          }else{
            let payFeeSum = null
            let feeSum = null
            let discountFeeSum = null
            let splitFeeSum = null
            switch (column.property){
              case 'payFeeStr':
                payFeeSum = this.sumFee(data,column.property).toFixed(2)
                sums.push(payFeeSum)
                break
              case 'feeStr':
                feeSum = this.sumFee(data,column.property).toFixed(2)
                sums.push(feeSum)
                break
              case 'discountFeeStr':
                discountFeeSum = this.sumFee(data,column.property).toFixed(2)
                sums.push(discountFeeSum)
                break
              case 'splitFeeStr':
                splitFeeSum = this.sumFee(data,column.property).toFixed(2)
                sums.push(splitFeeSum)
                break
              default:
                sums.push('-');
            }
          }
        })

          console.log("sums:",sums);
          return [sums]
        }
    }
  }
</script>
