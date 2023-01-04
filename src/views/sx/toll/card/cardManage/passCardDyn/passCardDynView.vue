<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="当前位置" prop="locationNoStr">
            <ti-select v-model="queryParams.locationNoStr" dict-type="tibms_toll_CardLocation" multiple/>
          </el-form-item>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
          </el-form-item>
          <el-form-item label="卡单元编号" prop="cardUnitNoStr">
            <el-input v-model="queryParams.cardUnitNoStr" maxlength="10" style="width: 199px" />
          </el-form-item>
          <el-form-item label="通行卡卡号" prop="passCardNoStr">
            <el-input v-model="queryParams.passCardNoStr" maxlength="18" style="width: 199px" />
          </el-form-item>
          <el-form-item label="操作类型" prop="cardOpTypeNoStr">
            <ti-select v-model="queryParams.cardOpTypeNoStr" dict-type="tibms_toll_CardOpType" multiple/>
          </el-form-item>
          <el-form-item label="卡状态" prop="cardStatusNoStr">
            <ti-select v-model="queryParams.cardStatusNoStr" dict-type="tibms_toll_CardStatus" multiple/>
          </el-form-item>
          <el-form-item label="车道号" prop="laneNo">
            <ti-select
              ref="laneNo"
              v-model="queryParams.laneNo"
              url="/api/v1/common/lane/listWithUserAuth"
              :props="{key:'laneNo',value:'laneNo',label:'laneNo'}"
              :watch-attr="queryParams.sysOrgIdStr"
              :watch-attr-fn="watchAttrFn"/>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-form-item prop="startTime" v-show="false"/>
            <el-form-item prop="endTime" v-show="false"/>
            <ti-date-range v-model="queryParams" date-type="daterange" format="yyyy-MM-dd HH:mm:ss" begin-key="startTime" end-key="endTime"/>
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['cardUnit:findPage']" type="primary" @click="getData">查询</el-button>
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
          <el-button type="info" v-permission="['passCardDyn:excel']" @click="exportExcel.dialog = true">导出</el-button>
        </template>


	    </vxe-grid>
	  </div>
	</el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import { findPage} from './passCardDynApi'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import moment from 'moment'
  import $ from "jquery";

  export default {
    name: 'passCardDynView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiExportExcel, TiDateRange },
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        queryParams: {
          locationNoStr:'',
          sysOrgIdStr:'',
          cardUnitNoStr:'',
          passCardNoStr:'',
          cardOpTypeNoStr:'',
          cardStatusNoStr:'',
          laneNo:'',
          startTime:moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
          endTime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        exportExcel: {
          url: 'api/v1/toll/passCardDyn/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
			      { title: '通行卡卡号', field: 'passCardNo', minWidth: 150, showOverflow: true, align: 'center' },
            { title: '当前位置', field: 'locationText', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '所在机构', field: 'orgText', minWidth: 120, showOverflow: true , align: 'center' },
            { title: '车道', field: 'laneNo', minWidth: 60, showOverflow: true, align: 'center'  },
            { title: '状态', field: 'cardStatusText', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '卡单元编号', field: 'cardUnitNo', minWidth: 110, showOverflow: true, align: 'center'  },
            { title: '工班日期', field: 'squadDate', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '工班', field: 'squadText', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '刷卡时间', field: 'opTimeText', minWidth: 160, showOverflow: true, align: 'center'  },
            { title: '操作员', field: 'userNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '操作类型', field: 'cardOpTypeText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '车牌号', field: 'vehiclePlate', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '车型', field: 'vehicleTypeText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '车种', field: 'vehicleClassText', minWidth: 100, showOverflow: true, align: 'center'  }
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
        this.init()
      })
    },
    methods: {
      init() {
        this.getData()
      },
      submit() {
        this.tableData.page.currentPage = 1
        this.getData()
      },
      async getData() {
        // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
        this.tableData.loading = true
        findPage(Object.assign({}, {
          size: this.tableData.page.pageSize,
          current: this.tableData.page.currentPage
        }), this.queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false

          //保存导出的查询条件
          this.exportExcel.queryParams = this.queryParams;
        })
      },
      handlePageChange({currentPage, pageSize}) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
      },
      watchAttrFn(newVal, oldVal, selectData) {
        let stationList = [];
        this.$refs.sysOrg.initStationOrgList(stationList);

        //json是为了去重（不能laneNo重复，不然下拉列表太多）
        let laneJson = {}
        selectData.forEach(x => {
          stationList.forEach(station => {
              if (station.stationId == x.stationId) {
                laneJson[x.laneNo] = x;
              }
            }
          );
        })

        //变回数组
        let laneList = [];
        $.each(laneJson, function (k, v) {
          laneList.push(v);
        })

        //排序（顺序）
        laneList.sort(function (x, y) {
          return x.laneNo - y.laneNo;
        });
        return laneList;
      }
    }
  }
</script>

<style scoped>

</style>
