<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" :rules="rules" inline :label-width="'100px'">
        <div>
          <!--<el-form-item label="路段" prop="sectionId">-->
            <!--<ti-select ref="org"-->
                       <!--v-model="queryParams.sectionId"-->
                       <!--check-strictly-->
                       <!--url="api/v1/common/sysOrg/roadList"-->
                       <!--:props="{key:'id',value:'roadId',label:'name'}"-->
            <!--/>-->
          <!--</el-form-item>-->
          <el-form-item label="路段" prop="sysOrgIdStr">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value show-level="2" />
          </el-form-item>
          <el-form-item label="出站日期">
            <ti-date-range v-model="queryParams" date-type="daterange" begin-key="startDay" end-key="endDay"/>
          </el-form-item>
          <!--<el-radio v-model="queryParams.type" label="1">图表</el-radio>-->
          <!--<el-radio v-model="queryParams.type" label="2">报表</el-radio>-->
          <el-button type="primary" @click="submit">查询</el-button>
          <el-row>
            <el-form-item label="图表方式">
              <el-radio-group v-model="showDefault" size="mini">
                <el-radio label="table" border style="margin-right:0">表格</el-radio>
                <el-radio label="chart" border>图表</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>

    <vxe-grid v-show="showDefault=='table'"
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      :auto-resize="true"
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :span-method="mergeRowMethod"
    >
      <template v-slot:toolbar_buttons>
        <el-row>
          <el-col>
            <el-button v-permission="['feeRptStat:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
          </el-col>
        </el-row>
      </template>
    </vxe-grid>

    <div ref="myChart" style="height:500px;" v-show="showDefault=='chart'"></div>


  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'

  import {getFeeRptStat } from "./feeRptStatApi";;

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  import echarts from 'echarts'
  import chartOption from "@/views/pro/audit/report/feeRptStat/chartOption"

  export default {
    name: 'audit.report.feeRptStat.feeRptStatView',
    components: { TiSelectTree, TiSelect, TiDateRange, TiDate,tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          startDay: moment(new Date()).format('YYYY-MM-DD'),
          endDay: moment(new Date()).format('YYYY-MM-DD')
        },
        rules: {},
        dataSource:[],
        showDefault: 'table', // table chart
        // 表格配置
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
        loading: false,
        tableData: [],
        columns: [
          {
            field: "pathType",
            title: "通行路径类型",
            minWidth:160,
            merge:true,
            align:'center',
            slots: {
              default: ({row}, h) => {
                return this.getPathName(row.pathType);
              }
            }
          },
          {
            field: "mediaType",
            title: "通行介质",
            align:'center',
            slots: {
              default: ({row}, h) => {
                return this.getMediaTypeName(row.mediaType);
              }
            }
          },
          {
            title: '路段校核应收',
            children: [
              {
                field: "auditNum",
                title: "行程数量",
                align:'right'
              },
              {
                field: "auditFee",
                title: "金额[万元]",
                slots: {
                  default: ({row}, h) => {
                    return this.toYuan(this.blankToNum(row.auditFee));
                  }
                }
              }
              ]
          },
          {
            title: '省中心拆分路段收益',
            children: [
              {
                field: "settleNum",
                title: "条数",
                align:'right',
                slots: {
                  default: ({row}, h) => {
                    return row.settleNum||0;
                  }
                }
              },
              {
                field: "settleFee",
                title: "金额[万元]",
                slots: {
                  default: ({row}, h) => {
                    return this.toYuan(this.blankToNum(row.settleFee));
                  }
                },
                align:'right'
              }
            ]
          },
          {
            title: '行程平衡',
            children: [
              {
                field: "balanceNum",
                title: "条数",
                align:'right',
                slots: {
                  default: ({row}, h) => {
                    return row.balanceNum||0;
                  }
                }
              },
              {
                field: "balanceFee",
                title: "金额[万元]",
                slots: {
                  default: ({row}, h) => {
                    return this.toYuan(this.blankToNum(row.balanceFee));
                  }
                },
                align:'right'
              }
              ]
          },
          {
            title: '行程多拆',
            children: [
              {
                field: "moreNum",
                title: "条数",
                align:'right',
                slots: {
                  default: ({row}, h) => {
                    return row.moreNum||0;
                  }
                }
              },
              {
                field: "moreFee",
                title: "金额[万元]",
                slots: {
                  default: ({row}, h) => {
                    return this.toYuan(this.blankToNum(row.moreFee));
                  }
                },
                align:'right'
              }
              ]
          },
          {
            title: '争议拒付/坏账',
            children: [
              {
                field: "uncNum",
                title: "条数",
                align:'right',
                slots: {
                  default: ({row}, h) => {
                    return row.uncNum||0;
                  }
                }
              },
              {
                field: "uncFee",
                title: "金额[万元]",
                slots: {
                  default: ({row}, h) => {
                    return this.toYuan(this.blankToNum(row.uncFee));
                  }
                },
                align:'right'
              }
            ]
          }
          ]
      }
    },

    created() {
   //   this.submit();
    },
    watch: {
      showDefault(val) {
        this.reload(true)
      }
    },
    mounted(){
      // 初始化图表
      chartOption.init(this.$refs['myChart'])
      this.submit()
    },
    methods: {
      async reload(isCache){

        // 远程获取数据
        if(!isCache){
          const res = await getFeeRptStat (this.queryParams);
          if(res.code==200){
            this.dataSource = res.data
          }
        }
        if(this.showDefault=='table'){
          // 替换数据源
          this.tableData = this.dataSource.table
        }else{
          let datas = this.dataSource.chart
          this.$nextTick(() => {
            chartOption.show(datas)
          })
        //  chartOption.show( this.dataSource.chart)
        }
      },
      submit() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.reload()
          } else {
            return false;
          }
        })
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        //this.submit()
      },
      change(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      getPathName(pathType){
        // 通行路径类型 1 本路段进本路段出，2本路段进其它路段出，3其它路段进本路段出，4其它路段进其它路段出
        var pathName = '未知';
        if(pathType==1) pathName = '本路段进本路段出';
        else if(pathType==2) pathName = '本路段进其它路段出';
        else if(pathType==3) pathName = '其它路段进本路段出';
        else if(pathType==4) pathName = '其它路段进其它路段出';
        else pathName = '未知';
        return pathName;
      },
      getMediaTypeName(mediaType){
        var mediaName = 'CPC';
        if(mediaType==1) mediaName = 'OBU';
        else if(mediaType==2) mediaName = 'CPC';
        else if(mediaType==5) mediaName = '其它';
        else mediaName = '合计';
        return mediaName;
      },
      toYuan(num){
        // 转W元
        return (parseFloat(num)/1000000).toFixed(2);
      },
      blankToNum(v){
        return v||0;
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      mergeRowMethod ({ row, rowIndex, column, data }) {
        //只对通行路径类型列做合并
        if(column.property != 'pathType'){return}
        const fields = ['pathType']

        const cellValue = XEUtils.get(row, column.property)

          if (cellValue && fields.includes(column.property)) {
            const prevRow = data[rowIndex - 1]
            let nextRow = data[rowIndex + 1]
            if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
              return { rowspan: 0, colspan: 0 }
            } else {
              let countRowspan = 1
              while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
                nextRow = data[++countRowspan + rowIndex]
              }
              if (countRowspan > 1) {
                return { rowspan: countRowspan, colspan: 1 }
              }
            }
          }
      }
    }
  }
</script>

<style scoped>
  /*  .el-form-item /deep/ .el-range-editor {
      width: 518px !important;
    }*/
</style>
