<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="所在机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
          </el-form-item>
          <el-form-item label="车道号" prop="laneNo">
            <el-input v-model="queryParams.laneNo" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
          </el-form-item>

          <el-form-item label="操作时间">
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <ti-date-range v-model="queryParams" :selectfuture="true" date-type="daterange" format="yyyy-MM-dd" begin-key="beginSquadDateStr" end-key="endSquadDateStr"/>
          </el-form-item>
          <el-form-item label="工班" prop="squadNo">
            <ti-select v-model="queryParams.squadNo" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"/>
          </el-form-item>
          <el-form-item label="操作员" prop="laneOperatorID">
            <ti-select v-model="queryParams.laneOperatorID" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}"/>
          </el-form-item>
          <el-form-item label="登记类型" prop="userMarkNo">
            <ti-select v-model="queryParams.userMarkNo" dict-type="tibms_toll_userMarkNo"/>
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['shiftRegMainRecord:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
	<el-card shadow="never" :max-height="this.tableHeight">

	  <div class="box">
	    <vxe-grid
	      ref="xTable"
	      highlight-hover-row
	      border
	      show-overflow
	      show-header-overflow
	      resizable
	      sync-resize
	      auto-resize
	      class="vxe-table-element"
	      :max-height="600"
	      :loading="tableData.loading"
	      :columns="tableData.tableColumns"
	      :data="tableData.columnsDataList"
	      :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
	      :pager-config="tableData.page"
	      :toolbar="tableToolbar"
	      @page-change="handlePageChange"
	      @checkbox-all="({ selection }) => { selections = selection }"
	      @checkbox-change="({ selection }) => { selections = selection }"
	    >

        <template v-slot:toolbar_buttons>
          <el-button type="primary" v-permission="['shiftRegMainRecord:create']" @click="add()">添加</el-button>
          <el-button type="info" v-permission="['shiftRegMainRecord:excel']" @click="exportExcel.dialog = true">导出</el-button>

        </template>

        <template v-slot:operation="{ row }">
          <el-button v-permission="['shiftRegMainRecord:edit']" v-show="row.used == 0" type="warning" @click="edit(row)">修改</el-button>
          <el-button  type="warning" @click="processLink(row)">详情</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>


    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment';
  import api from './shiftRegMainRecordApi.js'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";

  import dictUtils from 'ecip-web/utils/dictUtils';


  export default {
    name: 'shiftRegMainRecordView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiExportExcel, TiDateRange },
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        isHaveSpareMoney:false,
        isHaveSpareMoneyForWork:false,
        queryParams: {
          sysOrgIdStr:'',
          laneNo:'',
          beginSquadDateStr:moment(new Date()).subtract(1, "days").format('YYYY-MM-DD'),
          endSquadDateStr:moment(new Date()).format('YYYY-MM-DD'),
          squadNo:'',
          laneOperatorID:'',
          userMarkNo:''
        },
        exportExcel: {
          url: 'api/v1/shift/shiftRegMainRecord/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
			      { title: '登记类型', field: 'userMarkNoText', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '路段', field: 'roadNameText', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '收费站', field: 'stationNameText', minWidth: 120, showOverflow: true , align: 'center' },
            { title: '车道号', field: 'laneNo', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '工班日期', field: 'squadDate', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '工班', field: 'squadNoText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '操作员', field: 'operatorNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '现金总额', field: 'totalMoneyText', minWidth: 80, showOverflow: true, align: 'center'  },
            { title: '通行费', field: 'txMoneyText', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '机打发票数', field: 'invCount', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '领用卡单元', field: 'cardUnitNoForWork', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '领用卡单元数', field: 'cardUnitNoCntForWork', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '上缴卡单元', field: 'cardUnitNoOffWork', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '上缴卡单元数', field: 'cardUnitNoCntOffWork', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '卡数', field: 'cardCountForWorkText', minWidth: 150, showOverflow: true, align: 'center' },
            { title: '还卡数', field: 'returnCardCnt', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '操作', minWidth: 120, slots: { default: 'operation' }, align: 'left', fixed: 'right'}
          ],

          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'right',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          }},
        tableToolbar: {
          id: 'modules.paramQuery',
          custom: true,
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          slots: {
            buttons: 'toolbar_buttons'
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {
      deptFilterText(val) {
        this.$refs.paramTree.filter(val)
      }
    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {
        this.init();
      })
    },
    methods: {
      init() {
        this.getData();
      },
      numFilter(value) {
        const realVal = (parseInt(value)/100.0).toFixed(2);
        return realVal;
      },
      submit() {
        this.tableData.page.currentPage = 1
        this.getData()
      },
      async getData() {
		 // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
        this.tableData.loading = true
        api.findPage(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false;

          //保存导出的查询条件
          this.exportExcel.queryParams = this.queryParams;
        })
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
      },

      async add() {
        let timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/toll/shift/shiftManagement/shiftRegMainRecord/init/'+timestamp
        });
      },

      async processLink(row){
        console.log(row)
        let timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/toll/shift/shiftManagement/shiftProcessLink/'+timestamp,
          query:{
            sysOrgIdStr: row.orgId,
            laneNo: row.laneNo,
            squadDate: row.squadDate,
            squadNo: row.squadNo,
            laneOperatorID: row.laneOperatorID
          }
        });
      }


    }
  }
</script>

<style scoped>

</style>
