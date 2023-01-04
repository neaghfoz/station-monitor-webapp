<template>
  <div class="app-container" id="fillLaneShift">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
        </el-form-item>
        <el-form-item label="工班日期">
          <el-form-item prop="beginSquadDate" v-show="false"/>
          <el-form-item prop="endSquadDate" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="daterange" begin-key="beginSquadDate" end-key="endSquadDate"/>
        </el-form-item>
        <el-form-item label="工班" prop="squadNo">
          <ti-select
            v-model="queryParams.squadNo"
            url="api/v1/common/squad/list"
            :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
          />
        </el-form-item>
        <el-form-item label="车道号" prop="laneNoStr">
          <ti-select
            ref="laneId"
            v-model="queryParams.laneNoStr"
            url="/api/v1/common/lane/listWithUserAuth"
            :props="{key:'laneNo',value:'laneNo',label:'laneNo'}"
            :watch-attr="queryParams.sysOrgIdStr"
            :watch-attr-fn="watchAttrFn"/>
        </el-form-item>
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
        <!--<el-button type="primary" @click="showSearch = !showSearch">{{showSearch?'隐藏':'展开'}}</el-button>-->

      </el-form>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="1000"
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
        <el-button v-permission="['fillLaneShift:fill']" @click="fillShow()">填平</el-button>
        <el-button v-permission="['fillLaneShift:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

    <el-dialog
      v-loading="fill.loading"
      title="填平工班流水"
      :visible.sync="fill.dialog"
      width="400px"
      :modal-append-to-body="true"
      append-to-body
      ref="fillDialog"
    >
      <el-form ref="fillForm" :model="fill" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr" :rules="[{required: true, message:'机构必填', trigger:'change'}]">
          <ti-sys-org ref="sysOrg" v-model="fill.sysOrgIdStr" default-first-value/>
        </el-form-item>
        <el-form-item label="工班日期" :rules="[{required: true, message:'工班日期必填', trigger:'blur'}]">
          <ti-date ref="fillSquadDate" v-model="fill.squadDateStr" :clearable="false"/>
<!--          <el-date-picker v-model="fill.squadDateStr" type="date" placeholder="选择日期" :clearable="false">-->
<!--          </el-date-picker>-->
        </el-form-item>
        <el-form-item label="工班" prop="shiftID" :rules="[{required: true, message:'工班必填', trigger:'change'}]">
          <ti-select
            ref="fillSquadNo"
            v-model="fill.shiftID"
            url="api/v1/common/squad/list"
            :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="车道号" prop="laneNo" :rules="[{required: true, message:'车道号必填', trigger:'change'}]">
          <ti-select
            ref="fillLaneNo"
            v-model="fill.laneNo"
            url="/api/v1/common/lane/listWithUserAuth"
            :props="{key:'laneNo',value:'laneNo',label:'laneNo'}"
            :watch-attr="fill.sysOrgIdStr"
            :watch-attr-fn="watchAttrFn"
            :clearable="false"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fill.dialog = false">取 消</el-button>
        <el-button type="primary" @click="fillFn()" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';

import {findPage, fill} from "./fillLaneShiftApi";
import moment from 'moment'

import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import tiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import $ from 'jquery'
import {Loading} from 'element-ui';

export default {
  name: 'fillLaneShiftView',
  components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiDate, tiSysOrg},
  mixins: [...mixin],
  data() {
    return {
      queryParams: {
        sysOrgIdStr: '',
        laneNoStr: '',
        entryExitType: '',
        laneTypeStr: '',
        beginSquadDate: moment(new Date()).add(-1,'days').format('YYYY-MM-DD'),
        endSquadDate: moment(new Date()).format('YYYY-MM-DD'),
        squadNo: '',
        operatorID: '',
        invStartID: '',
        invEndID: ''
      },
      exportExcel: {
        url: 'api/v1/search/list/laneShift/fillLaneShift/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      fill: {
        dialog: false,
        sysOrgIdStr: '',
        squadDateStr: '',
        shiftID: '',
        laneNo: '',
      },
      showSearch: true,
      loading: false,
      tableToolbar: {
        id: 'search.list.laneShift.fillLaneShiftView-toolbar',
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
          field: 'roadTxt', minWidth: 120, showOverflow: true
        },
        {
          title: '收费站',
          field: 'stationTxt', minWidth: 150, showOverflow: true
        },
        {
          title: '车道类型',
          field: 'laneTypeName', minWidth: 80, showOverflow: true
        },
        {
          title: '车道号',
          field: 'laneNo', minWidth: 70, showOverflow: true
        },
        {
          title: '工班日期',
          field: 'squadDate', minWidth: 100, showOverflow: true
        },
        {
          title: '工班',
          field: 'squadTxt', minWidth: 80, showOverflow: true
        },
        {
          title: '流水记录数',
          field: 'listCnt', minWidth: 120, showOverflow: true
        },
        {
          title: '总车辆数',
          field: 'vehCnt', minWidth: 120, showOverflow: true
        },
        {
          title: '总金额（元）',
          field: 'totalMoneyTxt', minWidth: 120, showOverflow: true
        },
        {
          title: '无通行介质过车数',
          field: 'noMediaCnt', minWidth: 120, showOverflow: true
        },
        {
          title: '闯关车数量',
          field: 'breakPassCnt', minWidth: 120, showOverflow: true
        },
        {
          title: '生成时间',
          field: 'hgInsertTableTime', minWidth: 120, showOverflow: true
        },
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
    submit() {
      Object.assign(this.$data.page, this.$options.data().page);
      this.getData();
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
      this.$refs.sysOrg.setDefaultFirstValue();
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
    },
    fillShow() {
      this.fill.dialog = true
      this.fill.sysOrgIdStr = this.queryParams.sysOrgIdStr
      if (!this.fill.squadDateStr) {
        this.fill.squadDateStr = moment(new Date()).add(-1,'days').format('YYYY-MM-DD')
      }
      /*
      if (!this.fill.squadNo) {
        this.$refs.fillSquadNo.setDdefaultFirstValue();
      }
      if (!this.fill.laneNoStr) {
        this.$refs.fillLaneNo.setDdefaultFirstValue();
      }*/
    },
    fillFn() {

      this.$refs.fillForm.validate(async valid => {

        if (!valid) {
          return
        }

        let loadingInstance = Loading.service({target: "#fillLaneShift"})
        let _this = this
        fill(this.fill).then(function (res) {
          _this.$notify.success(res.data)
          _this.getData();
          _this.fill.dialog = false;
        }).catch(function (res) {
          console.log(res);
        }).finally(function () {
          loadingInstance.close();
        })

      })
    }
  }
}
</script>

<style scoped>
</style>
