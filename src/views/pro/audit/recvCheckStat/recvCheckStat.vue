<template>
  <div class="app-container">
    <el-form ref="searchForm" :rules="searchRules" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="路段名称" prop="roadIds">
          <ti-select ref="roads" style="width: 177px" v-model="queryParams.roadId" :clearable="true"
                     url="/api/v1/common/road/findListByAuth":props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" aria-placeholder="路段名称"/>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataTypes">
           <ti-select ref="dataTypes" v-model="queryParams.dataTypes" dict-type="tibms_audit_dataCheckStatType"
                      :multiple="true" />
        </el-form-item>
        <el-form-item label="通行交易日期" label-width="110px" prop="transDateRange">
          <el-form-item prop="beginDate" v-show="false"/>
          <el-form-item prop="endDate" v-show="false"/>
          <ti-date-range date-style="width:490px" ref="dateRang" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                         date-rule="oneYear"  v-model="queryParams.transDateRange" begin-key="beginDate"
                         end-key="endDate"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <el-button type="success"  v-permission="['recvCheckStat:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>

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
      <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
      <template v-slot:operation="{ row }">
        <el-button type="warning" v-if="row.diffCnt "  @click="detail(row)">详情</el-button>
      </template>
    </vxe-grid>

  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {findPage} from "@/views/pro/audit/recvCheckStat/recvCheckStat";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import moment from "moment";
  import { getRoadList } from "@/views/pro/common/util/dataUtil"
  import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";

  export default {
    name: 'audit.recvStat.recvCheckStat',
    mixins: [...mixin],
    components: {TiDateRange, TiSelectTree, TiSelect, TiExportExcel},
    data() {
      return {
        queryParams: {
          transDateRange:{
            beginDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().add(-1, 'day').format('YYYY-MM-DD')
          },
          beginDate:'',
          endDate:'',
          roadId: '',
          dataTypes: ''
        },
        recvCheckMaxNum: 1000,
        searchRules:{
          transDateRange: [
            {type: 'array',
            required: false,
            message: '数据接收时间不能为空',
            fields: {
              beginDate: { type: 'string', required: true, message: '数据接收开始时间不能为空' },
              endDate: { type: 'string', required: true, message: '数据接收结束时间不能为空' }
            }
          }]
        },
        exportExcel: {
          url: '/api/v1/audit/list/dataRecvCheckStat/exportExcel',
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
            field: "roadName",
            title: "路段名称",
            minWidth: 180,
            align: "center",
            showOverflow: true
          },
          {
            field: "transTypeName",
            title: "数据类型",
            minWidth: 180,
            showOverflow: true,
            align: "center",
          },
          {
            field: "transDateText",
            title: "交易时间",
            minWidth: 180,
            showOverflow: true,
            align: "center",
          },
          {
            field: "dayCntSum",
            title: "日合计数汇总",
            minWidth: 150,
            showOverflow: true,
            align: "center",
          },
          {
            field: "dayFeeSumText",
            title: "日合计数汇总金额（元）",
            minWidth: 180,
            showOverflow: true,
            align: "center",
          },
          {
            field: "recvCntCheckSum",
            title: "流水采集数",
            minWidth: 150,
            showOverflow: true,
            align: "center",
          },
          {
            field: "recvFeeCheckSumText",
            title: "流水采集汇总金额（元）",
            minWidth: 180,
            showOverflow: true,
            align: "center",
          },
          {
            field: "diffCnt",
            title: "差异数量",
            minWidth: 150,
            showOverflow: true,
            align: "center",
            slots: {
              default: ({row}, h) => {
                if (row.diffCnt != null && (row.diffCnt > this.recvCheckMaxNum || row.diffCnt< this.recvCheckMaxNum*-1)) {
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
                if (row.diffFeeSum != null && row.diffFeeSum != 0 && row.diffCnt != null
                  && (row.diffCnt > 1000 || row.diffCnt<-1000)) {
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
          },
          {
            title: '操作',
            minWidth: 180,
            fixed: 'right',
            align: 'center',
            slots: {default: 'operation'}
          }
        ]

      }
    },

    created() {

    },
    mounted() {
       let recvCheckMaxNum = dictUtils.getDictLabel("tibms_config", "recvCheckMaxNum");
       //console.log (recvCheckMaxNum)
       if( recvCheckMaxNum ) {
         this.recvCheckMaxNum = recvCheckMaxNum;
       }
    },
    methods: {
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr);
        this.selections = seArr;
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
         const {data} = await findPage(
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
      },detail (row) {
        //var timestamp = Date.parse(new Date());

        if (row.transType == 1 ) {
          this.$router.push({
            path: '/audit/recvCheckStat/components/recvCheckStatEnCountDetail',
            query: {
              roadId: row.roadId,
              beginDate: row.transDateText,
              endDate: row.transDateText,
              transType: row.transType,
              roadName: row.roadName,
            }
          });
        }  else if(row.transType == 2) {
          this.$router.push({
            path: '/audit/recvCheckStat/components/recvCheckStatExCountDetail',
            query: {
              roadId: row.roadId,
              beginDate: row.transDateText,
              endDate: row.transDateText,
              transType: row.transType,
              roadName: row.roadName,
            }
          });
        } else if(row.transType == 3) {
          this.$router.push({
            path: '/audit/recvCheckStat/components/recvCheckStatGantryTransSumDetail',
            query: {
              roadId: row.roadId,
              beginDate: row.transDateText,
              endDate: row.transDateText,
              transType: row.transType,
              roadName: row.roadName,
            }
          });
        }


      }

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
