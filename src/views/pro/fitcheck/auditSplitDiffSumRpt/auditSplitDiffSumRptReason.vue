<template>
  <div class="app-container" style="height: 100%" v-loading="exportExcel.loading">
    <div style="padding: 10px; text-align: center">
      <h2>{{ title }}</h2>
    </div>
    <div class="el-header" style="text-align: right; padding: 0 10px 10px 0; border-width: 0px; color: #0b347d">
      <!--              应收：<span>{{paySum}}</span> &nbsp;-->
      <!--              拆分：<span>{{feeSum}}</span> &nbsp;-->
      <!--              差额：<span>{{diffSum}}</span> &nbsp;-->
      <el-button v-permission="['split:reasonExp']" type="primary" @click="exportEx">导出</el-button>
    </div>
    <vxe-grid
      ref="auditSplitDiffSumRptReasonVxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="2500"
      class="vxe-table-element"
      :span-method="mergeRowMethod"
      :cell-style="cellClassName"
      :loading="loading"
      :columns="columns"
      :data="tableData"
    >
      >
      <!-- :spanMethod="mergeRowMethod" -->
      <template v-slot:operation="{ row }">
        <!--<el-button v-permission="['testOrder:edit']" type="warning" @click="edit(row.id)">编辑</el-button>-->
        <!--<el-button v-permission="['testOrder:remove']" type="danger" @click="remove(row.id)">删除</el-button>-->
        <el-button v-permission="['split:result']" v-if="!(row.noDetailFlag === 1)" type="warning" @click="detail(row)">流水详情</el-button>
      </template>

      <template #diffTypeDescHeader="{ row,column }">
        <el-link @click="toggleShowType(showType==1?2:1)">差异类型
        <i :class="[showType==1?'el-icon-caret-bottom':'el-icon-caret-top']" ></i> </el-link>
      </template>

      <template #diffReasonDescHeader="{ row,column }">
        <el-link @click="toggleShowType(showType==3?2:3)">根因分类
        <i :class="[showType==3?'el-icon-caret-top':'el-icon-caret-bottom']" ></i> </el-link>
      </template>

      <template #diffReasonDescContent="{ row,column }">
        <el-link v-if="row[column.property]=='小计'" @click="expandReason(row.splitType + '-' + row.diffType )">
          {{ row[column.property] }}
          <i :class="[expandReasonTypes[row.splitType + '-' + row.diffType]?'el-icon-caret-top':'el-icon-caret-bottom']"></i>
        </el-link>
        <span v-else>
          {{ row[column.property] }}
        </span>
      </template>
    </vxe-grid>
    <!-- </div>

 </el-card>-->
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { dictMap } from "@/views/pro/common/tiApi/tiDict/tiDictApi";
import { download } from 'ecip-web/utils'
import { exportExcel } from "@/views/pro/common/util/dataUtil"
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import { listReasonByDate } from "@/views/pro/fitcheck/auditSplitDiffSumRpt/api/auditSplitDiffSumRptApi"
import { systemName } from '@/settings'

export default {
  name: "fitcheck.auditSplitDiffSumRpt.auditSplitDiffSumRptReasonView",
  components: { exportExcel, TiExportExcel },
  mixins: [...mixin],
  data () {
    return {
      queryParams: {
        beginTransDay: null,
        endTransDay: null,
        sectionId: null,
        dateStatisticType: null,
        titleName: null
      },
      curParamsValue: '',
      diffTypeMap: {},
      typeMap: { 1: '行程关联', 2: '行程少拆', 3: '行程多拆', 4: '合计' },
      feeDiffMap: {
        1: (systemName && systemName === 'tibms_cy') ? '应得等于实得':'应收等于实收',
        2: (systemName && systemName === 'tibms_cy') ? '应得小于实得':'应收小于实收',
        3: (systemName && systemName === 'tibms_cy') ? '应得大于实得':'应收大于实收',
        4: (systemName && systemName === 'tibms_cy') ? '实得为零':'实收为零',
        5: '小计',
        6: (systemName && systemName === 'tibms_cy') ? '无拆分实得':'无拆分实收',
        7: '小计',
        8: (systemName && systemName === 'tibms_cy') ? '无拟合应得':'无拟合应收',
        9: '小计',
        10: '合计'
      },
      reasonTypeMap: {
        1: '金额无差异', 2: '按比例拆分', 3: '四舍五入长款承担', 4: '其他路段代收', 5: '出口兜底计费', 6: '出口特情在线计费', 7: '拆分方式异常',
        8: '四舍五入短款承担', 9: '出口兜底计费', 10: '出口特情在线计费', 11: '门架流水逾期', 12: '拆分方式异常', 13: '出口优免车辆', 14: '省内优惠车辆',
        15: '记账失败（判定异常）', 16: '异常结算（争议拒付）', 17: '异常结算（坏账）', 18: '小计', 19: '正常结算周期内', 20: '超出结算周期', 21: '小计',
        22: '省内出口', 23: '外省出口', 24: '小计', 25: '合计'
      },
      isDay: false,
      exportExcel: { loading: false },
      title: '',
      paySum: '0.00',
      feeSum: '0.00',
      diffSum: '0.00',
      loading: false,
      banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
      banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      columns: [
        {
          field: 'splitTypeDesc', merge: true, title: '校核分类', align: 'center', minWidth: 100,
          showOverflow: true
        },
        {
          minWidth: 124, field: 'diffTypeDesc', /* merge: ['typeDesc'], */ title: '差异类型', align: 'center',
          showOverflow: false,
          slots: { 'header':'diffTypeDescHeader'}
        },
        {
          minWidth: 165, field: 'diffReasonDesc', /* merge: ['diffTypeDesc'], */ title: '根因分类', align: 'center',
          showOverflow: true,
          slots: { 'header':'diffReasonDescHeader' ,'default':'diffReasonDescContent'}
        },

        {
          field: '#', title: (systemName && systemName === 'tibms_cy') ? '拟合应得':'拟合应收', align: 'center', children: [
            { field: 'roadTransNumStr', title: '行程数', align: 'center', minWidth: 120, showOverflow: true, },
            {
              field: 'roadTransFee4YuanStr', title: (systemName && systemName === 'tibms_cy') ? '拟合应得(元)':'拟合应收(元)', align: 'center', minWidth: 120, showOverflow: true,
            },
            {
              field: 'roadReasonRateStr', title: '金额占比(%)', align: 'center', minWidth: 100, showOverflow: true,
            }
          ]
        },
        {
          field: '#', title: (systemName && systemName === 'tibms_cy') ? '省中心拆分实得':'省中心拆分实收', align: 'center', children: [
            { field: 'splitTransNumStr', title: '行程数', align: 'center', minWidth: 120, showOverflow: true, },
            {
              field: 'splitTransFee4YuanStr', title: (systemName && systemName === 'tibms_cy') ? '省中心拆分实得(元)':'省中心拆分实收(元)', align: 'center', minWidth: 120, showOverflow: true,
            }
          ]
        },
        {
          field: '#', title: '差异', align: 'center', children: [
            { field: 'diffTransNumStr', title: '行程数', align: 'center', minWidth: 120, showOverflow: true, },
            {
              field: 'diffFee4YuanStr', title: '金额差异(元)', align: 'center', minWidth: 120, showOverflow: true,
            },
            {
              field: 'diffFeeRateStr', title: '差额比(%)', align: 'center', minWidth: 100, showOverflow: true,
            }
          ]
        },
        {
          title: "操作", align: "center", minWidth: 100,
          slots: {
            default: 'operation'
          }, fixed: 'right'
        },

      ],
      selections: [],
      tableData: [],
      showType: 1 , // 1 展开到合计，2 展开到小计， 3 展开到原因明细
      expandReasonTypes: {},
      tableOriData: []
    }
  },
  mounted () {
    this.parseParams(this.$route.query)
    //数据
    this.loadList()
  },
  watch: {
    paramsValue: function (newVal, oldVal) {
      if (newVal && this.curParamsValue != newVal) {
        this.parseParams(this.$route.query)
        this.curParamsValue = newVal
        this.loadList()
      }
    }
  },
  computed: {
    paramsValue: function () {
      if (this.$route.query.sectionId4Reason && this.$route.query.beginTransDay4Reason) {
        const tempParamsValue = (this.$route.query.sectionId4Reason + "_" + this.$route.query.beginTransDay4Reason + "_" + this.$route.query.endTransDay4Reason)
        return tempParamsValue
      }
      return ""
    }
  },
  methods: {
    expandReason(diffType){
      this.expandReasonTypes[diffType] = !this.expandReasonTypes[diffType]
      this.showType = 2
      this.filterData()
    },
    toggleShowType(showType){
      this.showType = showType
      if(this.showType == 3 ){
        this.tableOriData.forEach(x => {
          this.expandReasonTypes[x.splitType + '-' + x.diffType] = true
        })
      }else{
        this.expandReasonTypes = {}
      }
      this.filterData()
    },
    filterData(){
      if( this.showType==1 ){
        this.tableData = this.tableOriData.filter(x => { return x.diffReasonDesc == '合计'} )
      } else if( this.showType==2 ){
          this.tableData = this.tableOriData.filter(x => { return x.diffReasonDesc == '小计' || x.diffReasonDesc == '合计' || this.expandReasonTypes[x.splitType + '-' + x.diffType] } )
      }else {
          this.tableData = this.tableOriData
      }
    },
    parseParams (params) {
      this.queryParams.beginTransDay = params.beginTransDay4Reason
      this.queryParams.endTransDay = params.endTransDay4Reason
      this.queryParams.sectionId = params.sectionId4Reason
      this.queryParams.dateStatisticType = params.dateStatisticType4Reason

      var day = '';
      if (this.queryParams.beginTransDay == this.queryParams.endTransDay) {
        this.isDay = true;
        day = this.queryParams.beginTransDay + '日';
      } else {
        this.isDay = false;
        day = this.queryParams.beginTransDay.substr(0, 7) + '月';
      }
      this.title = params.sectionName4Reason + "的" + day + "校核分析明细"
    },
    async loadList () {
      this.loading = true;
      const { data } = await listReasonByDate(this.queryParams);

     // this.tableData = data
      this.tableOriData = data
      this.filterData()
      this.loading = false
    },
    async getDiffMap () {
      const { data } = await dictMap('tibms_audit_diffType');
      this.diffTypeMap = data;

    },
    detail (row) {
      var name = row.splitTypeDesc + "-" + row.diffTypeDesc
      //var startDate = this.$route.query.startDate;

      // if (type == 2) {
      //   diffType = null;
      // }

      this.$router.push({
        path: '/fitcheck/auditSplitDiffSumRpt/passSplitResultView',
        query: {
          splitType4PassList: row.splitType,
          diffType4PassList: row.diffType,// == 'uncFee' ? 21 : diffType,
          diffReason4PassList: row.diffReason,
          beginTransDay4PassList: this.queryParams.beginTransDay,
          endTransDay4PassList: this.queryParams.endTransDay,
          sectionCode4PassList: this.queryParams.sectionId,
          dateStatisticType4PassList: this.queryParams.dateStatisticType,
          name4PassList: name
        }
      });
    },
    toWYuan (num) {
      // 转W元
      return (parseFloat(num) / 1000000).toFixed(2);
    },
    detailResult (data) {
      var payinfo = data.payinfo;
      var reasons = data.reasons;
      // type ：1行程平衡，2行程少拆，3行程多拆
      // feeDiff: 1费额无差异，2费额有差异，3争议拒付/坏账
      var statTmp = {
        related: { uncFee: { type: 1, feeDiff: 3, payFee: 0, payNum: 0, fee: 0, feeNum: 0 } },
        splitMore: { uncFee: { type: 3, feeDiff: 3, payFee: 0, payNum: 0, fee: 0, feeNum: 0 } },
        lossSplit: {}
      }
      // 总差异金额
      var sectionFeeSum = 0; // 路段已关联确认记账
      var sectionUncFeeSum = 0;// 路段已关联拒付
      var sectionNum = 0;// 路段已关联条数
      var allFeeSum = 0;
      var allPaySum = payinfo.fee;
      for (var i = 0; i < reasons.length; i++) {
        var vo = reasons[i];
        var diffType = vo.diffType;
        var exitFeeType = vo.exitFeeType;
        if (!diffType) {
          vo.diffType = 'other';
        }
        allFeeSum += vo.fee + vo.moreFee + vo.uncFee + vo.moreUncFee;
        if (diffType == 31) {
          // 行程多拆,按计费类型进行累加
          var splitMore = statTmp.splitMore;
          if (!splitMore.hasOwnProperty(exitFeeType)) {
            splitMore[exitFeeType] = { type: 3, feeDiff: 2, payFee: 0, payNum: 0, fee: 0, feeNum: 0 };
          }
          // 多出的确认记账
          splitMore[exitFeeType].fee += vo.moreFee;
          splitMore[exitFeeType].feeNum += vo.moreNum;
          // 拒付/坏账，算一种原因
          splitMore['uncFee'].fee += vo.moreUncFee;
          splitMore['uncFee'].feeNum += vo.moreUncNum;
        } else {
          // 行程平衡，按差异类型统计原因
          var related = statTmp.related;
          if (!related.hasOwnProperty(diffType)) {
            related[diffType] = { type: 1, feeDiff: 2, payFee: 0, payNum: 0, fee: 0, feeNum: 0 };
          }
          if (diffType == 30) {
            related[diffType].feeDiff = 1; // 无差异
          }
          // 确认记账
          related[diffType].fee += vo.fee;
          related[diffType].feeNum += vo.totalNum;
          related[diffType].payFee += vo.payFee;
          related[diffType].payNum += vo.totalNum;
          // 拒付/坏账，算一种原因
          related['uncFee'].fee += vo.uncFee;
          related['uncFee'].feeNum += vo.uncNum;
          sectionFeeSum += vo.payFee;
          sectionUncFeeSum += vo.uncPayFee;
          sectionNum += vo.totalNum + vo.uncNum;
        }
      }
      // 行程少拆
      var fee = payinfo.fee - sectionFeeSum - sectionUncFeeSum;
      var num = payinfo.totalNum - sectionNum;
      statTmp.lossSplit['other'] = { type: 2, feeDiff: 2, payFee: fee, payNum: num, fee: 0, feeNum: 0 };

      var datas = [];
      for (var type in statTmp) {
        var stat = statTmp[type];
        for (var reasonType in stat) {
          var vo = stat[reasonType];
          vo['reasonType'] = reasonType;
          datas.push(vo);
        }
      }
      datas.sort(function (a, b) {
        return a.type != b.type ? a.type - b.type : (a.feeDiff - b.feeDiff)
      });
      this.tableData = datas;
      this.paySum = this.toWYuan(allPaySum);
      this.feeSum = this.toWYuan(allFeeSum);
      this.diffSum = this.toWYuan(allPaySum - allFeeSum);
    },

    cellClassName ({ row, rowIndex, column, columnIndex }) {
      if (column.property === 'reasonType') {
        if ([7, 11, 12, 20].includes(row.reasonType)) {
          //return 'col-red'
          return 'background-color: #E6A23C;'
        }
      }
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    mergeRowMethod ({ row, rowIndex, column, columnIndex, data }) {

      const fields = ['splitTypeDesc', 'diffTypeDesc', 'diffReasonDesc']
      const ignoreValues = ['合计', '小计']
      const cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        if (ignoreValues.includes(cellValue)) {
          if (column.property == 'diffTypeDesc') {
            const preCellValue = row['splitTypeDesc']
            if (preCellValue == cellValue) {
              return { rowspan: 0, colspan: 0 }
            }
            const nextCellValue = row['diffReasonDesc']
            if (nextCellValue == cellValue) {
              return { rowspan: 1, colspan: 2 }
            }
          } else if (column.property == 'diffReasonDesc') {
            const preCellValue = row['diffTypeDesc']
            if (preCellValue == cellValue) {
              return { rowspan: 0, colspan: 0 }
            }
          } else if (column.property == 'splitTypeDesc') {
            let countColspan = 1
            let fieldsIndex = 1
            while (fields[fieldsIndex] && row[fields[fieldsIndex]] === cellValue) {
              fieldsIndex++
              countColspan++
            }
            if (countColspan > 1) {
              return { rowspan: 1, colspan: countColspan }
            }
          }
        } else {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }

      }
    },
    exportEx () {
      // 导出excel
      this.exportExcel.loading = true
      this.queryParams.titleName = this.title
      let params = this.queryParams;
      download({
        url: "api/v1/fitcheck/feeAnalyse/auditSplitDiffSumRpt/exportAuditSplitDiffSumRptReasonByDate",
        method: 'post',
        params: null,
        data: params
      }).then((res) => {
        this.exportExcel.loading = false
      }).catch((err) => {
        console.info(err)
        this.exportExcel.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.col-red {
  background-color: #e6a23c;
}
</style>
