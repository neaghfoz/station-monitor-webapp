<template>
  <div class="app-container">
    <el-form ref="appForm" :model="queryParams" :rules="rules"  inline :label-width="'110px'">


        <el-form-item label="版本号" prop="version">
          <ti-select v-model="queryParams.version" url="/api/v1/audit/list/smallestFee/getVersionList"
                     :props="{key:'version',value:'version',label:'version'}" />
        </el-form-item>

        <el-form-item  label="入口省份" prop="enProv">
          <ti-select :clearable="true" style="width: 200px" v-model="queryParams.enProv"
                     dict-type="tibms_com_province"/>
        </el-form-item>

        <el-form-item label="入口站" prop="enId">
          <ti-lazy-select style="width: 200px" v-model="queryParams.enId"
                     url="/api/v1/common/station/findAllCountryList" :props="{key:'stationId',value:'stationId',label:'stationName'}"
                     :watch-attr-fn="watchAttrFn" :watch-attr="queryParams.enProv" :disabled="queryParams.enStationIsAble"
                     :multiple="false" aria-placeholder="出口站"/>
        </el-form-item>

        <el-form-item label="出口站" prop="exId">
          <ti-select style="width: 200px" v-model="queryParams.exId" :clearable="true"
                     url="/api/v1/common/station/findListByAuth" :props="{key:'stationId',value:'stationId',label:'stationName'}"
                     :multiple="false" aria-placeholder="出口站"/>
        </el-form-item>

        <el-form-item label="车型" prop="vehType">
          <ti-select style="width: 200px" :clearable="true" v-model="queryParams.vehType"
                     dict-type="tibms_com_vehicleType"/>
        </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>


    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="650"
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
        <el-button v-permission="['smallestfee:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>
      <template v-slot:operation="{ row }">
        <el-button type="warning"  @click="detail(row)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'

  import {findPage} from "./smallestFeeApi";


  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  import Detail1 from './components/smallestFeeDetail'
  import TiLazySelect from "@/views/pro/common/tiElement/tiSelect/tiLazySelect";

  export default {
    name: 'audit.smallestFee.smallestFeeView',
    components: {TiLazySelect, TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiSysOrg,Detail1},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          version:'',
          enProv:'',
          enId:'',
          exId:'',
          exProv: '44',
          vehType:'',
          sysOrgIdStr: '',
          laneNoStr: '',
          entryExitType: '',
          laneTypeStr: '',
          beginHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          endHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          vehicleTypeStr: '',
          vehicleClassStr: '',
          enStationIsAble: true
        },
        exportExcel: {
          url: '/api/v1/audit/list/smallestFee/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        rules: {
           version: [{  required: true, message: '请选择版本号' }],
           enProv: [{  required: true, message: '请选择入口省份' }],
           enId: [{  required: true, message: '请选择入口站'  }],
           exId: [{  required: true, message: '请选择出口站'}]
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'search.list.breakPassRecord.breakPassRecordView-toolbar',
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
          pageSize: 20,
          align: 'left',
          pageSizes: [ 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [{
          title: '入口站名',
          field: 'enStationName',
          align:'left',
          minWidth:160
        },{
          title: '出口站名',
          field: 'exStationName',
          align:'left',
          minWidth:160
        },{
          title: '车型',
          field: 'vehTypeName',
          align:'center',
          minWidth:100,
        },{
          title: '里程(公里)',
          field: 'mileText',
          align:'right',
          minWidth:100
        },{
          title: '金额(元)',
          field: 'feeText',
          align:'right',
          minWidth:100
        },{
          title: '95折金额(元)',
          field: 'fee95Text',
          align:'right',
          minWidth:100
        },{
          title: '收费明细',
          field: 'smallestMoneyDetailStr',
          align:'center',
          minWidth:120,
          showOverflow: true

        },{
          title: '费率版本',
          field: 'version',
          align:'center',
          minWidth:120
        },
        {
          title: '操作',
          minWidth: 100,
          fixed: 'right',
          align: 'center',
          slots: {default: 'operation'}
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
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            Object.assign(this.$data.page, this.$options.data().page);
            this.getData()
          } else {
            return false;
          }
        })


        //this.getData();
      },
      async getData() {
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
        this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
        //this.getData()
      },
      detail(row) {
        //console.log("row", row);
        var timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/audit/smallestFee/detail/'+timestamp,
          query: {
            row: row
          }
        });
      },
      watchAttrFn(newVal, oldVal, selectData) {
        let selectDataShow = [];
        if (newVal) {
          selectData.forEach(x => {
            if (newVal == x.netRoadId) {
              selectDataShow.push(x)
            }
          });
          this.queryParams.enStationIsAble = false;
        } else {
          this.queryParams.enStationIsAble = true;
        }
        return selectDataShow;



      },
      handleReset() {
        this.$refs.appForm.resetFields();
        this.queryParams.enProv = '44'
        //Object.assign(this.$data.page, this.$options.data().page)
        // this.getData()
      },
    }
  }
</script>
<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
