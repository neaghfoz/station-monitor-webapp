<template>
  <div class="app-container">
    <div class="search-form">
      <el-card>
        <el-form ref="searchForm" :model="queryParams"  :rules="checkTimeRules"  inline :label-width="'100px'" size="small">
          <div>
            <el-form-item label="入口机构" prop="sysOrgIdStr">
              <!--<ti-select-tree-->
                <!--v-model="queryParams.sysOrgIdStr"-->
                <!--check-strictly-->
                <!--url="api/v1/common/sysOrg/orgList"-->
                <!--:props="{value:'id',label:'fullName',children:'children'}"-->
                <!--@change="change"-->
              <!--/>-->
              <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" @change="orgChange" show-level="4" default-first-value/>
            </el-form-item>

            <el-form-item label="入口车道号" prop="laneNoStr">
              <ti-sys-lane clearable v-model="queryParams.laneNoStr"  :cache="true" :station-id="appForm.stationId" :multiple="true" :entryExitType="1"/>
            </el-form-item>

            <el-form-item label="工班日期" >
              <ti-date-range
                v-model="queryParams"
                date-type="daterange"
                begin-key="beginSquadDateStr"
                end-key="endSquadDateStr"
                :clearable="true"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                date-rule="oneMonth"
              />
            </el-form-item>
            <el-form-item label="工班" prop="shiftIdStr" >
              <ti-select v-model="queryParams.shiftIdStr" url="api/v1/common/squad/list"
                        :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" multiple />
            </el-form-item>
            <el-form-item label="操作员" prop="operatorStr">
              <ti-select
                v-model="queryParams.operatorStr"
                url="/api/v1/common/sysUser/list"
                :props="{key:'id',value:'username',label:'fullName'}"
                :multiple="true"
                clearable
              />
            </el-form-item>
            <el-form-item label="按键类型" prop="exceptionalTypeStr" >
              <ti-select v-model="queryParams.exceptionalTypeStr" dict-type="tibms_com_exceptionalType" :multiple="true" clearable/>
            </el-form-item>

            <el-form-item label="车牌号码" prop="vehiclePlate">
              <!--              oninput="value=value.replace(/[^\d]/g, '')"-->
              <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号码"
                        maxlength="10" style="width: 199px"/>
            </el-form-item>

            <el-form-item class="searchItem" :label-width="'50px'">
              <el-button type="primary" @click="submit">查询</el-button>
              <el-button type="default" @click="handleReset">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="500"
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
        <el-button   @click="exportExcel.dialog = true" v-permission="['laneEnOperateList:exportExcel']">导出</el-button>
      </template>

    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {getToken} from '@/utils/auth';
  import moment from 'moment';
  import {findPage, exportExcel} from "./laneEnOperateListApi";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

  export default {
    name: 'search.list.laneEnOperateList.laneEnOperateListView',
    components: { TiExportExcel, TiSelect, TiDateRange, tiSysOrg, TiSysLane },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          laneNoStr: '',
          beginSquadDateStr: moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'),
          endSquadDateStr:moment(new Date()).format('YYYY-MM-DD'),
          shiftIdStr: '',
          operatorStr: '',
          exceptionalTypeStr: '',
          vehiclePlate: ''
        },
        appForm: {
          stationId: ''
        },
        exportExcel: {
          url: 'api/v1/search/list/laneEnOperateList/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        importUrl: 'api/v1/search/list/laneEnOperateList/importExcel',
        tplUrl: 'api/v1/search/list/laneEnOperateList/excelTemplate',
        exportUrl: 'api/v1/search/listlaneEnOperateList/exportExcel?token=${getToken()}',
        tableToolbar: {
          id: 'search.list.laneEnOperateList.laneEnOperateListView-toolbar',
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
            title: '入口路段',
            field: 'enRoadText',
            minWidth: 110, showOverflow: true
          },
          {
            title: '入口收费站',
            field: 'enStationText',
            minWidth: 110, showOverflow: true
          },
          {
            title: '车道编号',
            field: 'enLaneNo',
            minWidth: 80, showOverflow: true
          },
          {
            title: '工班日期',
            field: 'squadDateText',
            minWidth: 120, showOverflow: true
          },
          {
            title: '工班',
            field: 'shiftText',
            minWidth: 80, showOverflow: true
          },
          {
            title: '操作员',
            field: 'operatorName',
            minWidth: 110, showOverflow: true
          },
          {
            title: '按键类型',
            field: 'exceptionalTypeText',
            minWidth: 120, showOverflow: true
          },
          {
            title: '按键操作时间',
            field: 'operateTimeText',
            minWidth: 150, showOverflow: true
          },
          {
            title: '通行介质类型',
            field: 'mediaTypeText',
            minWidth: 120, showOverflow: true
          },
          {
            title: '介质编码',
            field: 'mediaNo',
            minWidth: 120, showOverflow: true
          },
          {
            title: '实际车辆号码',
            field: 'vehiclePlate',
            minWidth: 120, showOverflow: true
          },
          {
            title: '实际车辆颜色',
            field: 'vehiclePlateColorText',
            minWidth: 120, showOverflow: true
          },
          {
            title: '识别车辆号码',
            field: 'identifyVehiclePlate',
            minWidth: 120, showOverflow: true
          },
          {
            title: '识别车辆颜色',
            field: 'identifyVehicleColorText',
            minWidth: 120, showOverflow: true
          },
          {
            title: '收费车型',
            field: 'vehicleTypeText',
            minWidth: 100, showOverflow: true
          },
          {
            title: '车种',
            field: 'vehicleClassText',
            minWidth: 100, showOverflow: true
          },
          {
            title: '通行标识',
            field: 'passId',
            minWidth: 200, showOverflow: true
          }
        ]
      }
    },
    created() {
    },
    methods: {
      orgChange(val,org){
        if(org){
          this.appForm.stationId = org.stationId
        }
      },
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {

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
        Object.assign(this.$data.queryParams, this.$options.data().queryParams);
        this.$refs.sysOrg.setDefaultFirstValue();
        //this.getData()
      }
    }
  }
</script>

<style scoped>
  .el-form-item /deep/ .el-form-item__content {
    /*width: 60% !important;*/
  }

</style>
