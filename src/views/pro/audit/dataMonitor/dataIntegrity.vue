<template>
  <div class="app-container">
    <el-form ref="searchForm"  :model="queryParams" inline
             :label-width="'100px'">
      <el-row>
        <el-form-item label="路段名称" prop="roadIds">
          <ti-select ref="roads" style="width: 177px" v-model="queryParams.roadId" :clearable="true"
                     url="/api/v1/common/road/findListByAuth"
                     :props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" aria-placeholder="路段名称"/>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataTypes">
          <ti-select ref="dataTypes" v-model="queryParams.dataTypes"
                     dict-type="tibms_audit_dataType"
                     :multiple="true"/>
        </el-form-item>
        <el-form-item label="数据接收时间" label-width="110px" prop="transDateRange">
          <el-form-item prop="beginDate" v-show="false"/>
          <el-form-item prop="endDate" v-show="false"/>
          <ti-date-range date-style="width:490px" ref="dateRang" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                         date-rule="oneYear" v-model="queryParams.transDateRange"
                         begin-key="beginDate"
                         end-key="endDate"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <el-button type="success" v-permission="['dataIntegrity:exportExcel']"
                     @click="exportExcel.dialog = true">导出
          </el-button>
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
      <template v-slot:bottom>
        注意:目前深圳外环日合计数尚未调整，只统计流水接收情况
      </template>
    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {findPage, exportExcel} from "@/views/pro/audit/dataMonitor/dataIntegrity";
  import tiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import moment from "moment";
  import {getRoadList} from "@/views/pro/common/util/dataUtil"

  export default {
    name: 'audit.dataMonitor.dataIntegrityView',
    mixins: [...mixin],
    components: {TiDateRange, TiSelectTree, TiSelect, TiExportExcel},
    data() {
      return {
        queryParams: {
          transDateRange: {
            beginDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().add(-1, 'day').format('YYYY-MM-DD')
          },
          beginDate: '',
          endDate: '',
          roadId: '',
          dataTypes: ''
        },
        // searchRules: {
        //   transDateRange: [
        //     {
        //       type: 'array',
        //       required: false,
        //       message: '数据接收时间不能为空',
        //       fields: {
        //         beginDate: {type: 'string', required: true, message: '数据接收开始时间不能为空'},
        //         endDate: {type: 'string', required: true, message: '数据接收结束时间不能为空'}
        //       }
        //     }]
        // },
        exportExcel: {
          url: 'api/v1/audit/list/dataIntegrity/exportExcel',
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
            width: 50,
            align: "center"
          },
          {
            field: "roadName",
            title: "路段名称",
            hide: true,
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "dataTypeName",
            title: "数据类型",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "dataRecvTime",
            title: "数据接收时间",
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "dayStatCnt",
            title: "日合计汇总数",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "dayStatFeeSum",
            title: "日合计汇总金额(元)",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "recvCnt",
            title: "流水采集数",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "recvFeeSum",
            title: "流水采集汇总金额（元）",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "diffCnt",
            title: "差异数量",
            minWidth: 150,
            showOverflow: true,
            slots: {
              default: ({row}, h) => {
                if (row.diffCnt != null && (row.diffCnt > 1000 || row.diffCnt<-1000)) {
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
            field: "diffFeeSum",
            title: "差异金额（元）",
            minWidth: 160,
            showOverflow: true,
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
                  }, row.diffFeeSum)]
                } else {
                  return row.diffFeeSum;
                }
              }
            }
          }
        ]

      }
    },
    created() {
      this.getData();
    },
    mounted() {

    },
    methods: {
      // 默认路段设置
      sectionFilter(datas) {
        const seArr = []
        getRoadList(datas, seArr);
        this.selections = seArr;
        //if(!this.queryParams.roadId && seArr.length>0){
        //  this.queryParams.roadId = seArr[0].roadId;
        // 获取到路段之后查询
        //  this.submit()
        //}
        return seArr
      },
      submit() {
        this.$data.page.currentPage = 1
        this.getData();
      },
      async getData() {
        this.loading = true;
        this.queryParams.beginDate = this.queryParams.transDateRange.beginDate;
        this.queryParams.endDate = this.queryParams.transDateRange.endDate;
        console.log("this.queryParams:", this.queryParams);
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
        this.queryParams.roadId = '';
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
