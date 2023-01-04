<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row >
          <el-form-item label="所在机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" multiple="true" />
          </el-form-item>

          <el-form-item label="工班日期">
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <ti-date-range v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                           begin-key="beginSquadDateStr" end-key="endSquadDateStr"
                           date-rule="oneMonth"/>
          </el-form-item>
          <el-form-item label="工班" prop="squadNoStr">
            <ti-select v-model="queryParams.squadNoStr" url="api/v1/common/squad/list"
                       :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" multiple/>
          </el-form-item>
          <el-form-item label="操作员" prop="laneOperatorNoStr">
            <ti-select v-model="queryParams.laneOperatorNoStr" url="/api/v1/common/sysUser/list"
                       :props="{key:'id',value:'username',label:'fullName'}" multiple/>
          </el-form-item>
          <el-form-item label="状态" prop="statusStr">
            <ti-select v-model="queryParams.statusStr" dict-type="tibms_toll_shiftSettleStatus" multiple/>
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
        :cell-style="cellStyle"
	      @page-change="handlePageChange"
	      @checkbox-all="({ selection }) => { tableData.selections = selection }"
	      @checkbox-change="({ selection }) => { tableData.selections = selection }"
	    >

        <template v-slot:toolbar_buttons>
          <el-button type="primary" :disabled="tableData.selections.length === 0" v-permission="['shiftSettle:settle']" @click="settleAll()">结算</el-button>
          <el-button type="info" v-permission="['shiftSettle:excel']" @click="exportExcel.dialog = true">导出</el-button>
        </template>
        <template v-slot:operation="{ row }">
          <el-button type="primary" v-permission="['shiftSettle:settle']" v-show="row.status != 1" @click="settle(row)">结算</el-button>
          <el-button type="primary" v-permission="['shiftSettle:cancelSettle']" style="margin-left: 0px;" v-show="row.status == 1" @click="cancelSettle(row)">取消结算</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>
  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'
  import api from './shiftSettleApi.js'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";


  export default {
    name: 'gz.toll.shift.squadDateSettle.shiftSettleView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiDateRange, TiExportExcel },
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
          url: 'api/v1/shift/shiftSettle/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          selections:[],
          columnsDataList: [],
          tableColumns: [
            { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
            { title: '路段', field: 'roadNameText', minWidth: 90, showOverflow: true, align: 'center' },
            { title: '收费站', field: 'stationNameText', minWidth: 120, showOverflow: true , align: 'center' },
            { title: '工班日期', field: 'squadDate', minWidth: 110, showOverflow: true, align: 'center'  },
            { title: '工班', field: 'squadNoText', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '车道号', field: 'laneNo', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '车道类型', field: 'laneTypeText', minWidth: 90, showOverflow: true, align: 'center'  },
            { title: '操作员', field: 'laneOperatorNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '流水统计金额', field: 'listMoneyText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '交班登记金额', field: 'shiftMoneyText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '流水统计机打票数', field: 'listInvCnt', minWidth: 140, showOverflow: true, align: 'center'  },
            { title: '交班登记机打票数', field: 'shiftInvCnt', minWidth: 140, showOverflow: true, align: 'center'  },
            { title: '上班时间', field: 'beginShiftTime', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '下班时间', field: 'endShiftTime', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '状态', field: 'statusText', minWidth: 90, showOverflow: true, align: 'center'  },
            { title: '操作', align: 'left', minWidth: 120, slots: { default: 'operation' }, fixed: 'right'}
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
        tableHeight: null
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
        /*this.$nextTick(async() => {
          let org = await api.getCurrentOrg()
          if(org.code == 200){
            this.queryParams.sysOrgIdStr = org.data.fullCode
          }

          this.getData()
        })*/
        this.getData()
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
      cellStyle(row, column, rowIndex, columnIndex) {
        if (row.row.status == 2) {//判断条件，如果想要改变其他行样式，就写那一行的下标
          return 'color: red !important;';
        }
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
      },
      settle(row){
        let settleData = []
        settleData.push(row)

        let num = 0
        for(let data of settleData){
          if(data.status == 2){
            num += 1
          }
        }

        let confMsg = ''
        if(num == 0){
          confMsg = '确认进行结算？'
        }else {
          confMsg = '数据不符，确认继续结算？'
        }

        this.$confirm(confMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.settle({shiftSettleList: settleData}).then(res =>{
            this.$alert(res.data)
            this.getData()
          })
        })


      },
      settleAll(){
        let that = this
        let num = 0
        let msg = ''
        if(that.tableData.selections.length > 0){
          const result = that.tableData.selections.every((x) => {
            if (x.status == 1) {
              msg = '含有[已结算]记录，不允许批量结算！'
              return false
            }

            if(x.status == 2){
              num += 1
            }
            return true
          })

          if(!result){
            that.$alert(msg)
            return false
          }
        }else{
          that.$alert('至少选择一条记录!')
          return
        }

        let confMsg = ''
        if(num == 0){
          confMsg = '确认进行结算？'
        }else {
          confMsg = '存在'+num+'条数据不符记录，确认进行结算？'
        }

        that.$confirm(confMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.settle({shiftSettleList: that.tableData.selections}).then(res =>{
            this.$alert(res.data)
            this.getData()
          })
        })

      },

      async cancelSettle(row){
        let resp = await api.checkLaneSumStatusStock(row)
        if(null == resp || resp.code != 200){
          this.$alert('校验工班日结失败！')
          return
        }

        if(!resp.data){
          let msg ='工班日期：'+moment(row.squadDate).format('YYYY-MM-DD')+'，工班：'+row.squadNoText+',已生成工班日结，无法取消结算！'
          this.$alert(msg)
          return
        }

        this.$confirm('确认取消结算？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.cancelSettle(row).then(res =>{
            this.$alert(res.data)
            this.getData()
          })
        })
      }

    }
  }
</script>

<style scoped>

</style>
