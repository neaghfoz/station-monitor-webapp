<template>
  <div class="app-container">
    <div style="padding: 10px; text-align: center">
      <h2>{{ title }}</h2>
    </div>

    <vxe-grid
      ref="vex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @page-change="handlePageChange"
      @current-change="currentChangeEvent">
      >

      <template v-slot:bottom>
        1、自然日合计数= ∑ 门架交易流水批次内总数；<br>
        2、自然日合计金额=ETC成功交易额+CPC成功交易额，站省ETC门架小时批次汇总数接口无统计ETC失败交易额及CPC失败交易额；<br>
        3、差异数量=自然日合计数-流水采集数；差异金额=自然日合计金额-流水汇总金额（不含ETC交易失败、CPC交易失败金额）
      </template>
    </vxe-grid>

  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {findGantryTransSumPage} from "@/views/pro/audit/recvCheckStat/components/recvCheckStatDetail";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import moment from "moment";
  import { getRoadList } from "@/views/pro/common/util/dataUtil"
  import {listReasonByDate} from "@/views/pro/audit/auditSplitDiffSumRpt/api/auditSplitDiffSumRptApi";
  import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";

  export default {
    name: 'audit.recvCheckStat.components.recvCheckStatEnListDetail',
    mixins: [...mixin],
    components: {TiDateRange, TiSelectTree, TiSelect, TiExportExcel},
    data() {
      return {
        queryParams: {
          roadId: '',
          beginDate:'',
          endDate:'',
          transType:'',
        },
        curParamsValue: '',
        title:'',
        recvCheckGaMaxNum: 1000,
        exportExcel: {
          url: 'api/v1/audit/list/recvstat/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        loading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
            'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        selectRowIndex: 0,
        selectRow: {},
        columns: [
          {
            title: "序号",
            type: "seq",
            minWidth: 50,
            align: "center"
          },
          {
            field: "gantryTypeName",
            title: "门架类型",
            hide: true,
            minWidth: 100,
            showOverflow: true,
            align: "center"
          },
          {
            field: "collectName",
            title: "门架名称",
            hide: true,
            minWidth: 300,
            showOverflow: true,
            align: "center"
          },
          {
            field: "transDateText",
            title: "统计日期",
            minWidth: 100,
            showOverflow: true,
            align: "center"
          },
          {
            field: "dayCntSum",
            title: "自然日合计数",
            minWidth: 180,
            showOverflow: true,
            align: "center"
          },
          {
            field: "dayFeeSumText",
            title: "自然日合计金额（元）",
            minWidth: 180,
            showOverflow: true,
            align: "center"
          },
          {
            field: "recvCntCheckSum",
            title: "流水采集数",
            minWidth: 180,
            showOverflow: true,
            align: "center"
          },
          {
            field: "recvFeeCheckSumText",
            title: "流水汇总金额（元）(不含ETC交易失败，CPC交易失败金额)",
            minWidth: 180,
            showOverflow: true,
            align: "center"
          },
          {
            field: "recvFeeSumText",
            title: "流水汇总金额（元）(含ETC交易失败，CPC交易失败金额)",
            minWidth: 180,
            showOverflow: true,
            align: "center"
          },
          {
            field: "diffCnt",
            title: "差异数量",
            minWidth: 150,
            showOverflow: true,
            align: "center",
            slots: {
              default: ({row}, h) => {
                if (row.diffCnt != null && (row.diffCnt > this.recvCheckGaMaxNum || row.diffCnt< this.recvCheckGaMaxNum*-1)) {
                  return [h('span', {
                    style: {
                      color: 'white',
                      background: 'red',
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }
                  }, row.diffCnt)]
                } else {
                  return row.diffCnt;
                }
              }
            }
          },
          {
            field: "diffFeeSumText",
            title: "差异金额（元）",
            minWidth: 180,
            showOverflow: true,
            align: "center",
            slots: {
              default: ({row}, h) => {
                if (row.diffFeeSumText != null && row.diffFeeSumText != 0 && row.diffCnt != null
                  && (row.diffCnt > this.recvCheckGaMaxNum || row.diffCnt< this.recvCheckGaMaxNum * -1)) {
                  return [h('span', {
                    style: {
                      color: 'white',
                      background: 'red',
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }
                  }, row.diffFeeSumText)]
                } else {
                  return row.diffFeeSumText;
                }
              }
            }
          }
        ]

      }
    },
    created() {

    },
    mounted() {
      let recvCheckGaMaxNum = dictUtils.getDictLabel("tibms_config", "recvCheckGaMaxNum");
      console.log("recvCheckGaMaxNum:" + recvCheckGaMaxNum);
      if( recvCheckGaMaxNum ) {
        this.recvCheckGaMaxNum = recvCheckGaMaxNum;
      }
      this.parseParams(this.$route.query)
      this.loadList();
    },
    watch: {
      paramsValue: function (newVal, oldVal) {
        console.log(newVal );
        console.log(this.curParamsValue );
        if (newVal && this.curParamsValue != newVal) {
          this.parseParams(this.$route.query)
          this.curParamsValue = newVal
          this.loadList()
        }
      }
    },
    computed: {
      paramsValue: function () {
        if (this.$route.query.roadId && this.$route.query.beginDate) {
          const tempParamsValue = (this.$route.query.roadId + "_" + this.$route.query.beginDate + "_" + this.$route.query.transType)
          return tempParamsValue
        }
        return ""
      }
    },
    methods: {
      parseParams (params) {
        this.queryParams.roadId = params.roadId;
        this.queryParams.beginDate = params.beginDate;
        this.queryParams.endDate = params.endDate;
        this.queryParams.transType = params.transType;
        this.title = params.roadName + '的' + params.beginDate +'日ETC门架交易汇总数'
        //console.log("queryParams:", this.queryParams);
      },
      async loadList () {
        this.loading = true;
        const { data } = await findGantryTransSumPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams);
        this.tableData = data.records
        this.page.total = data.total
        this.loading = false
      },
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr);
        this.selections = seArr;
        //if(!this.queryParams.roadId && seArr.length>0){
        //  this.queryParams.roadId = seArr[0].roadId;
          // 获取到路段之后查询
        //  this.submit()
        //}
        return seArr
      },
      submit()
      {
        Object.assign(this.$data.page, this.$options.data().page)
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
              this.queryParams.beginDate =  this.queryParams.transDateRange.beginDate;
              this.queryParams.endDate =  this.queryParams.transDateRange.endDate;
              this.getData();
          }else {
            return false;
          }
        });
      },
      async getData() {

         this.loading = true;
         //console.log("this.queryParams:", this.queryParams);
         const {data} = await findGantryTransSumPage(
         Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.queryParams)
         this.tableData = data.records
         this.page.total = data.total
         this.loading = false

         //保存导出的查询条件
         this.exportExcel.queryParams = this.queryParams;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      currentChangeEvent({row}) {
        this.selectRowIndex = this.$refs.vex.getRowIndex(row);
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.roadId='';
        this.$refs.roads.placeholder = '请选择';
        //this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
        // Object.assign(this.$data.page, this.$options.data().page)
        // this.getData()
      },
      // change(param1, param2) {
      //   this.queryParams.sysOrg = param2;
      // }
    }
  }
</script>

<style scoped lang="scss">
  .imgBox {
    margin: 5px;
  }

  .audit-table {
    /*border-collapse:collapse;*/
    /*border-spacing:0px;*/
    width: 100%;
    background-color: #fff;
    color: #666;
  }


  .audit-table td, .audit-table th {
    border-width: 1px;
    /*border-style:solid;*/
    /*border-color:#e6e6e6;*/
    position: relative;
    padding: 0px 0px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
  }

  .audit-table td .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }


  .audit-table td .el-input--small {
    width: 50%;
  }

  .audit-table td .el-input__inner {
    height: 32px;
    line-height: 32px;
    width: 50%;
  }

  .detail-table {
    border-collapse: collapse;
    border-spacing: 0px;
    border-color: #fff;
    color: #666;
    table-layout: fixed;
    width: 100%;
    margin: 1px;
  }

  .detail-table th, .detail-table td {
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
    padding: 5px 0px;
  }

  .detail-table th {
    font-weight: 400;
    width: 33.33%;
    text-align: center;
    background-color: #f2f2f2;
  }

  .detail-table td {
    word-wrap: break-word;
    width: auto;
    height: 35px;
  }

  /*.el-form-item .el-range-editor*/
  /*{*/
  /*  width: 300px !important;*/
  /*}*/

  /*.vxe-table  .vxe-body--row.row--current {*/
  /*  background-color: yellow !important;*/
  /*}*/

  /*.el-col-md-8{*/
  /*  height: 100%;*/
  /*  background-color:#f3f4f9;*/
  /*}*/
</style>
