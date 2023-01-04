<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row >
          <el-form-item label="所在机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value multiple="true" />
          </el-form-item>
          <el-form-item label="缴款方式" prop="payType">
            <ti-select v-model="queryParams.payType" dict-type="tibms_toll_payTypes"/>
          </el-form-item>
          <el-form-item label="工班日期">
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <ti-date-range v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                           begin-key="beginSquadDateStr" end-key="endSquadDateStr"
                           date-rule="oneMonth"/>
          </el-form-item>
          <el-form-item label="操作员" prop="operatorNos">
            <ti-select v-model="queryParams.operatorNos" url="/api/v1/common/sysUser/list"
                       :props="{key:'id',value:'username',label:'fullName'}" multiple/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
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
	      @checkbox-all="({ selection }) => { tableData.selections = selection }"
	      @checkbox-change="({ selection }) => { tableData.selections = selection }"
	    >

        <template v-slot:toolbar_buttons>
          <el-button type="primary" v-permission="['bankPaymentRecord:create']" @click="add()">添加</el-button>
          <el-button type="info" v-permission="['bankPaymentRecord:excel']" @click="exportExcel.dialog = true">导出</el-button>
        </template>
        <template v-slot:operation="{ row }">
          <el-button type="primary" v-permission="['bankPaymentRecord:edit']" @click="edit(row)">修改</el-button>
          <el-button type="danger" v-permission="['bankPaymentRecord:delete']" @click="del(row)">删除</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>
    <add-view ref="addDialog" @refreshData="getData" />
  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'
  import api from './bankPaymentRecordApi.js'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import addView from './components/addBankPaymentRecordView.vue'


  export default {
    name: 'gz.toll.shift.bankPayment.bankPaymentRecordView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiDateRange, TiExportExcel, addView },
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        queryParams: {
          sysOrgIdStr:'',
          beginSquadDateStr: moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'),
          endSquadDateStr:moment(new Date()).format('YYYY-MM-DD'),
          squadNoStr:'',
          laneOperatorNoStr: '',
          statusStr:''
        },
        exportExcel: {
          url: 'api/v1/shift/bankPaymentRecord/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { title: '收费站', field: 'stationNameText', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '缴款方式', field: 'payTypeText', minWidth: 90, showOverflow: true , align: 'center' },
            { title: '工班日期', field: 'squadDateText', minWidth: 110, showOverflow: true, align: 'center'  },
            { title: '应收金额', field: 'listMoneyText', minWidth: 80, showOverflow: true, align: 'center'  },
            { title: '实收金额', field: 'shiftMoneyText', minWidth: 80, showOverflow: true, align: 'center'  },
            { title: '银行缴款金额', field: 'totalMoneyText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '操作时间', field: 'opTimeText', minWidth: 140, showOverflow: true, align: 'center'  },
            { title: '备注', field: 'remark', minWidth: 150, showOverflow: true, align: 'center'  },
            { title: '操作', align: 'left', minWidth: 130, slots: { default: 'operation' }, fixed: 'right'}
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
    },
    mounted() {
    },
    activated() {
      this.tableData.selections = []
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
          this.tableData.selections = []

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
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.defaultValue
      },
      async add(){
        let orgData = await api.getCurrentOrg();
        if(orgData == null || orgData.data == null || orgData.data == undefined){
          this.$notify.warning("当前用户没有分配机构，无法操作!")
          return
        }
        this.$refs.addDialog.init(this.queryParams.tenantId, this.queryParams.appId, null, orgData)
      },
      async edit(row){
        let orgData = await api.getCurrentOrg();
        if(orgData == null || orgData.data == null || orgData.data == undefined){
          this.$notify.warning("当前用户没有分配机构，无法操作!")
          return
        }
        this.$refs.addDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id, orgData)
      },
      async del(row){
        let that = this
        this.$confirm('是否删除银行缴款记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delRecord(row.id).then(res =>{
            if(res.data.flag){
              that.$notify.success(res.data.msg);
              that.getData()
            }else{
              that.$notify.error(res.data.msg);
            }
          })

        })

      }
    }
  }
</script>

<style scoped>

</style>
