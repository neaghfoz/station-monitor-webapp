<template>
  <div class="app-container" style="height: 100%" v-loading="exportExcel.loading">
    <!-- <el-card>
         <div class="el-card__body" >-->
    <div style="padding: 10px;text-align: center;">
      <h2>{{title}}</h2>
    </div>
    <div class="el-header" style="text-align: right;padding:0 10px 10px 0;border-width:0px;color:#0b347d;">
      <!--              应收：<span>{{paySum}}</span> &nbsp;-->
      <!--              拆分：<span>{{feeSum}}</span> &nbsp;-->
      <!--              差额：<span>{{diffSum}}</span> &nbsp;-->
      <el-button type="primary" @click="exportEx">导出</el-button>
    </div>
    <vxe-grid
      ref="feeReason"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :spanMethod="mergeRowMethod"
      :cell-style="cellClassName"
      :loading="loading"
      :columns="columns"
      :data="tableData">
      >
      <template v-slot:operation="{ row }">
        <!--<el-button v-permission="['testOrder:edit']" type="warning" @click="edit(row.id)">编辑</el-button>-->
        <!--<el-button v-permission="['testOrder:remove']" type="danger" @click="remove(row.id)">删除</el-button>-->
        <el-button type="warning" @click="detail(row)">查看详情</el-button>
      </template>
    </vxe-grid>
    <!-- </div>

 </el-card>-->

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import {findDiffReason} from "@/views/pro/audit/feeAnalyse/components/feeReasonApi"
  import {dictMap} from "@/views/pro/common/tiApi/tiDict/tiDictApi";
  import {download} from 'ecip-web/utils'
  import {exportExcel} from "@/views/pro/common/util/dataUtil"
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";

  export default {
    name: "audit.feeAnalyse.components.feeReasonView",
    components: {exportExcel, TiExportExcel},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {},
        diffTypeMap: {},
        typeMap: {1: '行程关联', 2: '行程少拆', 3: '行程多拆', 4: '合计'},
        feeDiffMap: {
          1: '应收等于实收',
          2: '应收小于实收',
          3: '应收大于实收',
          4: '实收为零',
          5: '小计',
          6: '无拆分实收',
          7: '小计',
          8: '无拟合应收',
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
        exportExcel: {loading: false},
        title: '',
        paySum: '0.00',
        feeSum: '0.00',
        diffSum: '0.00',
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        columns: [
          {
            field: 'type', merge: true, title: '校核分类', align: 'center', minWidth: 75, showOverflow: true,
            slots: {
              default: ({row}, h) => {
                return this.typeMap[row.type];
              }
            }
          },
          {
            minWidth: 110, field: 'feeDiff', merge: ['type'], title: '差异类型', align: 'center', showOverflow: true,
            slots: {
              default: ({row}, h) => {
                return this.feeDiffMap[row.feeDiff];
              }
            }
          },
          {
            minWidth: 165, field: 'reasonType', merge: ['feeDiff'], title: '根因分类', align: 'center', showOverflow: true,
            slots: {
              default: ({row}, h) => {
                return this.reasonTypeMap[row.reasonType];
              }
            }
          },

          {
            field: '#', title: '理论应收', align: 'center', children: [
              {field: 'payNum', title: '行程数', align: 'center', minWidth: 70, showOverflow: true,},
              {
                field: 'payFee', title: '理论应收(万元)', align: 'center', minWidth: 120, showOverflow: true,
                // slots: {
                //   default: ({row}, h) => {
                //     return this.toWYuan(row.payFee) ;
                //   }
                // }
              }
            ]
          },
          {
            field: '#', title: '省中心拆分实收', align: 'center', children: [
              {field: 'feeNum', title: '行程数', align: 'center', minWidth: 70, showOverflow: true,},
              {
                field: 'fee', title: '省中心拆分实收(万元)', align: 'center', minWidth: 165, showOverflow: true,
                // slots: {
                //   default: ({row}, h) => {
                //     return this.toWYuan(row.fee) ;
                //   }
                // }
              }
            ]
          },
          {
            field: '#', title: '差异', align: 'center', children: [
              {field: 'diffNum', title: '行程数', align: 'center', minWidth: 70, showOverflow: true,},
              {
                field: 'diffFee', title: '差异金额(万元)', align: 'center', minWidth: 120, showOverflow: true,
                // slots: {
                //   default: ({row}, h) => {
                //     return this.toWYuan(row.payFee-row.fee) ;
                //   }
                // }
              },
              {field: 'diffRate', title: '占比', align: 'center', minWidth: 50, showOverflow: true,}
            ]
          },
          {title: "操作", align: "center", minWidth: 100, slots: {default: 'operation'}, fixed: 'right'},

        ],
        selections: [],
        tableData: []
      }
    },
    created() {
    },
    watch: {
      // 如果路由发生变化，再次执行该方法
      // '$route' (to, from) {
      //
      //  }
    },
    activated() {
      this.init();
    },
    methods: {
      init() {
        this.queryParams = this.$route.query;
        //console.log("queryParams:",this.queryParams);
        var day = '';
        if (this.$route.query.startDate == this.$route.query.endDate) {
          this.isDay = true;
          day = this.$route.query.startDate + '日';
        } else {
          this.isDay = false;
          day = this.$route.query.startDate.substr(0, 7) + '月';
        }
        this.title = this.$route.query.name + day + "校核分析明细"
        //数据
        this.loadList()

        // this.$nextTick(async => {
        //     //获取差异类型字典值
        //     this.getDiffMap();
        //
        //     this.getData();
        //   }
        // );
      },
      async getData() {
        this.loading = true;

        const {data} = await findDiffReason(
          null,
          this.$route.query
        );

        this.detailResult(data);
        this.loading = false

      },
      async getDiffMap() {
        const {data} = await dictMap('tibms_audit_diffType');
        this.diffTypeMap = data;

      },
      detail(row) {
        var type = row.type;
        var diffType = row.reasonType;
        var name = this.typeMap[type] + "-" + this.diffTypeMap[diffType].vname;
        var startDate = this.$route.query.startDate;

        if (type == 2) {
          diffType = null;
        }

        this.$router.push({
          path: '/audit/feeAnalyse/components/feePassList',
          query: {
            type: type,
            diffType: diffType == 'uncFee' ? 21 : diffType,
            startDate: this.queryParams.startDate,
            endDate: this.queryParams.endDate,
            tollRoadId: this.queryParams.sectionId,
            dateStatisticType: this.queryParams.dateStatisticType,
            name: name
          }
        });
      },
      async exportDetail(row) {
        let type = row.type;
        let diffType = row.reasonType;
        let params = {
          type: type,
          startDate: this.queryParams.startDate,
          endDate: this.queryParams.endDate,
          tollRoadId: this.queryParams.sectionId,
        };
        if (type == 1 || type == 3) {
          params.diffType = diffType == 'uncFee' ? 21 : diffType;
        }


        await download({
          url: "api/v1/audit/list/feeAnalyse/exportPassList",
          method: 'post',
          params: null,
          data: params
        });
      },
      toWYuan(num) {
        // 转W元
        return (parseFloat(num) / 1000000).toFixed(2);
      },
      detailResult(data) {
        console.log("data:", data);
        var payinfo = data.payinfo;
        var reasons = data.reasons;
        // type ：1行程平衡，2行程少拆，3行程多拆
        // feeDiff: 1费额无差异，2费额有差异，3争议拒付/坏账
        var statTmp = {
          related: {uncFee: {type: 1, feeDiff: 3, payFee: 0, payNum: 0, fee: 0, feeNum: 0}},
          splitMore: {uncFee: {type: 3, feeDiff: 3, payFee: 0, payNum: 0, fee: 0, feeNum: 0}},
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
              splitMore[exitFeeType] = {type: 3, feeDiff: 2, payFee: 0, payNum: 0, fee: 0, feeNum: 0};
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
              related[diffType] = {type: 1, feeDiff: 2, payFee: 0, payNum: 0, fee: 0, feeNum: 0};
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
        statTmp.lossSplit['other'] = {type: 2, feeDiff: 2, payFee: fee, payNum: num, fee: 0, feeNum: 0};

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
      loadList() {
        this.tableData = [
          {
            type: 1,
            feeDiff: 1,
            reasonType: 1,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 2,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 3,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 4,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 5,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 6,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 2,
            reasonType: 7,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 3,
            reasonType: 8,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 3,
            reasonType: 9,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 3,
            reasonType: 10,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 3,
            reasonType: 11,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 3,
            reasonType: 12,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 4,
            reasonType: 13,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 4,
            reasonType: 14,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 4,
            reasonType: 15,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 4,
            reasonType: 16,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 4,
            reasonType: 17,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 1,
            feeDiff: 5,
            reasonType: 0,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 2,
            feeDiff: 6,
            reasonType: 19,
            payFee: '',
            payNum: '',
            feeNum: '-',
            fee: '-',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 2,
            feeDiff: 6,
            reasonType: 20,
            payFee: '',
            payNum: '',
            feeNum: '-',
            fee: '-',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 2,
            feeDiff: 7,
            reasonType: 0,
            payFee: '',
            payNum: '',
            feeNum: '-',
            fee: '-',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 3,
            feeDiff: 8,
            reasonType: 22,
            payFee: '-',
            payNum: '-',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 3,
            feeDiff: 8,
            reasonType: 23,
            payFee: '-',
            payNum: '-',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 3,
            feeDiff: 9,
            reasonType: 0,
            payFee: '-',
            payNum: '-',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          },
          {
            type: 4,
            feeDiff: 0,
            reasonType: 0,
            payFee: '',
            payNum: '',
            feeNum: '',
            fee: '',
            diffNum: '',
            diffFee: '',
            diffRate: ''
          }]
      },
      mergeRowMethod({row, rowIndex, column, data, _rowIndex, _columnIndex}) {
        //console.log("rowIndex:"+rowIndex+";columnIndex:"+_columnIndex)
        //debugger;
        if (rowIndex == 17 && _columnIndex == 1) {
          return {rowspan: 1, colspan: 2}
        }
        if (rowIndex == 17 && _columnIndex == 2) {
          return {rowspan: 0, colspan: 0}
        }
        if (rowIndex == 20 && _columnIndex == 1) {
          return {rowspan: 1, colspan: 2}
        }
        if (rowIndex == 20 && _columnIndex == 2) {
          return {rowspan: 0, colspan: 0}
        }
        if (rowIndex == 23 && _columnIndex == 1) {
          return {rowspan: 1, colspan: 2}
        }
        if (rowIndex == 23 && _columnIndex == 2) {
          return {rowspan: 0, colspan: 0}
        }
        if (rowIndex == 24 && _columnIndex == 0) {
          return {rowspan: 1, colspan: 3}
        }
        if (rowIndex == 24 && _columnIndex == 1) {
          return {rowspan: 0, colspan: 0}
        }
        if (rowIndex == 24 && _columnIndex == 2) {
          return {rowspan: 0, colspan: 0}
        }
        const fields = ['type', 'feeDiff', 'reasonType']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return {rowspan: 0, colspan: 0}
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return {rowspan: countRowspan, colspan: 1}
            }
          }
        }
      },
      cellClassName({row, rowIndex, column, columnIndex}) {
        if (column.property === 'reasonType') {
          if ([7, 11, 12, 20].includes(row.reasonType)) {
            //return 'col-red'
            return 'background-color: #E6A23C;'
          }
        }
      },
      exportEx() {
        // exportExcel(this.$refs['feeReason'],this.title)
        let params = {
          name: this.title,
        };
        this.exportExcel.loading = true
        download({
          url: "api/v1/audit/list/feeAnalyse/exportFeeAnalyseDetail",
          method: 'post',
          params: null,
          data: params
        }).then((res) => {
          this.exportExcel.loading = false
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .col-red {
    background-color: #E6A23C;
  }
</style>
