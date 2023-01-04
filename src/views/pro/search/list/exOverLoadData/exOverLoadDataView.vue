<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams"  :rules="checkTimeRules"  inline :label-width="'100px'">
        <div>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <!--<ti-select-tree-->
              <!--v-model="queryParams.sysOrgIdStr"-->
              <!--check-strictly-->
              <!--url="api/v1/common/sysOrg/orgList"-->
              <!--:props="{value:'id',label:'fullName',children:'children'}"-->
              <!--@change="change"-->
            <!--/>-->
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
          </el-form-item>
          <el-form-item label="车牌号码" prop="vehiclePlate">
            <!--              oninput="value=value.replace(/[^\d]/g, '')"-->
            <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号码"
                      maxlength="10" style="width: 199px"/>
          </el-form-item>
          <el-form-item label="操作时间" prop="checkTimeRange">
            <ti-date-range v-model="queryParams.checkTimeRange" date-type="datetimerange"
                           format="yyyy-MM-dd HH:mm:ss" begin-key="beginCheckTimeStr"
                           end-key="endCheckTimeStr" :clearable="false"/>
<!--            <ti-date-range date-style="width:490px" ref="dateRang" date-type="datetimerange"-->
<!--                           format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                           date-rule="singleMonth"  v-model="queryParams.transDateRange" begin-key="beginDate"-->
<!--                           end-key="endDate"/>            -->
          </el-form-item>

          <el-form-item label="超载率(%)" prop="overRate">
            <el-input v-model="queryParams.startOverRate" type="text" maxlength="8" oninput="value=value.replace(/[^\d]/g, '')"
                      style="width: 92px"/>
            <span>至</span>
            <el-input v-model="queryParams.endOverRate" type="text" maxlength="8" oninput="value=value.replace(/[^\d]/g, '')"
                      style="width: 93px"/>
          </el-form-item>
          <el-form-item label="客货专类型" prop="vehFlagStr">
            <ti-select v-model="queryParams.vehFlagStr" dict-type="tibms_com_vehFlag"
                       :multiple="true"/>
          </el-form-item>

          <el-form-item class="searchItem" :label-width="'50px'">
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="450"
      class="vxe-table-element"
      :auto-resize="true"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
    >
      <template v-slot:toolbar_buttons>
        <el-button v-permission="['exOverLoadData:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['exOverLoadData:detail']" type="warning" @click="detail(row.hgSeq, row.enTolllaneId, row.checkTimeText)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {download} from 'ecip-web/utils';
  import {getToken} from '@/utils/auth';
  import moment from 'moment';

  import {findPage, exportExcel} from "./exOverLoadDataApi";


  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'search.list.exOverLoadData.exOverLoadDataView',
    components: { TiExportExcel, TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          vehiclePlate: '',
          checkTimeRange: {
            beginCheckTimeStr: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
            endCheckTimeStr: moment(new Date()).add(1,'days').format('YYYY-MM-DD') + ' 00:00:00',
            // beginCheckTimeStr: '2020-01-01' + ' 00:00:00',
            // endCheckTimeStr: '2020-11-01' + ' 23:59:59',
          },
          beginCheckTimeStr: '',
          endCheckTimeStr: '',
          startOverRate: '',
          endOverRate: '',
          vehFlagStr: ''
        },
        checkTimeRules:{
          checkTimeRange: [
            {type: 'array',
              required: true,
              message: '交易时间不能为空',
              fields: {
                beginCheckTimeStr: { type: 'string', required: true, message: '交易时间不能为空' },
                endCheckTimeStr: { type: 'string', required: true, message: '交易时间不能为空' }
              }
            }]
        },
        exportExcel: {
          url: 'api/v1/search/list/exOverLoadData/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        importUrl: 'api/v1/search/list/exOverLoadData/importExcel',
        tplUrl: 'api/v1/search/list/exOverLoadData/excelTemplate',
        exportUrl: 'api/v1/search/listexOverLoadData/exportExcel?token=${getToken()}',
        tableToolbar: {
          id: 'search.list.exOverLoadData.exOverLoadDataView-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [
          {
            title: '路段',
            field: 'roadText'
          },
          {
            title: '收费站',
            field: 'exStationText'
          },
          {
            title: '日期',
            field: 'checkTimeText'
          },
          {
            title: '车牌号',
            field: 'vehiclePlate',
          },
          {
            title: '车轴数',
            field: 'alexCount'
          },
          {
            title: '车辆超限认定标准(吨)',
            field: 'limitWeightText'
          },
          {
            title: '实际车货总重(吨)',
            field: 'weightText'
          },
          {
            title: '超载重量(吨)',
            field: 'overWeightText'
          },
          {
            title: '超载率(%)',
            field: 'overRateText'
          },
          { title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}
          }
        ]
      }
    },
    // watch: {
    //   //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
    //   'queryParams.sysOrgIdStr'(newVal,oldVal) {
    //     if (!this.queryParams.firstFlag){
    //       this.getData();
    //       this.queryParams.firstFlag = true;
    //     }
    //   }
    // },
    created() {
      //    this.getData()
    },
    methods: {
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.queryParams.beginCheckTimeStr = this.queryParams.checkTimeRange.beginCheckTimeStr;
            this.queryParams.endCheckTimeStr = this.queryParams.checkTimeRange.endCheckTimeStr;
          } else {
            return false;
          }
        })
        // 每次查询初始化checkbox selections
        this.selections = []
        this.loading = true
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
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
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.$refs.sysOrg.setDefaultFirstValue();
        //this.getData()
      },
      detail(hgSeq, enTolllaneId, checkTimeText) {
        console.log("hgSeq" + hgSeq +":enTolllaneId" + enTolllaneId +"checkTimeTextaa:" + checkTimeText );
        var timestamp = Date.parse(new Date());
        this.$router.push({
          path : '/search/list/exOverLoadData/detail/' + timestamp,
          query : {
            hgSeq : hgSeq,
            enTolllaneId : enTolllaneId,
            checkTimeText : checkTimeText
          }
        });
      }
    }
  }
</script>

<style>
  .el-form-item /deep/ .el-form-item__content {
    /*width: 60% !important;*/
  }
</style>
