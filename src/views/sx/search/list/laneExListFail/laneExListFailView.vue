<template>
  <div class="app-container">
    <div class="search-form">
      <el-card>
        <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" size="small">
          <div>
            <el-form-item label="机构" prop="sysOrgIdStr">
              <!--<ti-select-tree-->
              <!--v-model="queryParams.sysOrgIdStr"-->
              <!--check-strictly-->
              <!--url="api/v1/common/sysOrg/orgList"-->
              <!--:props="{value:'id',label:'fullName',children:'children'}"-->
              <!--@change="change"-->
              <!--/>-->
              <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" :default-first-value="defaultFirstOrg"/>
            </el-form-item>
            <el-form-item label="出口车道号" prop="exTollLaneNo">
              <el-input v-model="queryParams.exTollLaneNo" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
            </el-form-item>
            <el-form-item label="出口车道类型" prop="exTollLaneTypeStr">
              <ti-select v-model="queryParams.exTollLaneTypeStr" dict-type="tibms_com_laneType" multiple/>
            </el-form-item>
            <el-form-item label="操作员" prop="exOperatorIdStr">
              <ti-select v-model="queryParams.exOperatorIdStr" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}" multiple/>
            </el-form-item>
            <el-form-item label="时间类型" prop="timeType">
              <ti-select v-model="queryParams.timeType" dict-type="tibms_search_list_timeType" :clearable="false"/>
            </el-form-item>
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <el-form-item label="工班日" v-if="queryParams.timeType=='squadDate'">
              <ti-date-range
                v-model="queryParams"
                date-type="daterange"
                begin-key="beginSquadDateStr"
                end-key="endSquadDateStr"
                :clearable="false" date-rule="oneMonth"/>
            </el-form-item>
            <el-form-item label="自然日" v-else-if="queryParams.timeType=='naturalDate'">
              <ti-date-range
                v-model="queryParams"
                date-type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss.SSS"
                begin-key="beginNaturalDateStr"
                end-key="endNaturalDateStr"
                :clearable="false" date-rule="oneMonth"/>
            </el-form-item>
            <el-form-item label="工班" prop="exShiftIdStr">
              <ti-select v-model="queryParams.exShiftIdStr" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" multiple/>
            </el-form-item>
            <el-form-item label="车型" prop="exVehicleTypeStr">
              <ti-select v-model="queryParams.exVehicleTypeStr" dict-type="tibms_com_vehicleType" multiple/>
            </el-form-item>
            <el-form-item label="车种" prop="exVehicleClassStr">
              <ti-select v-model="queryParams.exVehicleClassStr" dict-type="tibms_com_vehicleClass" multiple/>
            </el-form-item>
            <el-form-item label="车牌号码" prop="exVehiclePlate">
              <el-input v-model="queryParams.exVehiclePlate" type="text" maxlength="16" style="width: 199px"/>
            </el-form-item>

            <el-form-item label="车辆状态标识" prop="vehicleSignStr">
              <ti-select v-model="queryParams.vehicleSignStr" dict-type="tibms_com_vehicleSign" multiple/>
            </el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="showSearch = !showSearch">{{ showSearch ? '隐藏' : '展开' }}</el-button>
          </div>

          <div v-show="showSearch">
            <el-form-item label="出口流水号" prop="id">
              <el-input v-model="queryParams.id" type="text" maxlength="37" style="width: 199px"/>
            </el-form-item>
            <el-form-item label="通行标识ID" prop="passId">
              <el-input v-model="queryParams.passId" type="text" maxlength="40" style="width: 199px"/>
            </el-form-item>
            <el-form-item label="通行介质类型" prop="mediaTypeStr">
              <ti-select v-model="queryParams.mediaTypeStr" dict-type="tibms_com_mediaType" multiple/>
            </el-form-item>
            <el-form-item label="通行介质编码" prop="mediaNo">
              <el-input v-model="queryParams.mediaNo" maxlength="20" style="width: 199px"/>
            </el-form-item>
            <el-form-item label="etc卡号" prop="cardId">
              <el-input v-model="queryParams.cardId" maxlength="20" style="width: 199px"/>
            </el-form-item>
            <el-form-item label="入口站名称" prop="enTollStationName">
              <el-input v-model="queryParams.enTollStationName" type="text" maxlength="16" style="width: 199px"/>
            </el-form-item>
            <el-form-item label="本地特情类型" prop="roadSpecialTypeStr">
              <ti-select v-model="queryParams.roadSpecialTypeStr" dict-type="tibms_com_specialType_local" multiple/>
            </el-form-item>
            <el-form-item label="收费特情类型" prop="specialTypeStr">
              <ti-select v-model="queryParams.specialTypeStr" dict-type="tibms_com_specialType_lane" multiple/>
            </el-form-item>
            <el-form-item label="计费方式" prop="exitFeeTypeStr">
              <ti-select v-model="queryParams.exitFeeTypeStr" dict-type="tibms_com_exitFeeType" multiple/>
            </el-form-item>
            <el-form-item label="流水范围" prop="ownProvinceFlagStr">
              <ti-select v-model="queryParams.ownProvinceFlagStr" dict-type="tibms_search_list_ownProvinceFlag"/>
            </el-form-item>
            <el-form-item label="是否冲减" prop="otherTransvoidFlagStr">
              <ti-select v-model="queryParams.otherTransvoidFlagStr" dict-type="tibms_search_list_otherTransvoidFlag"/>
            </el-form-item>
            <el-form-item label="发票号" prop="invStartID">
              <el-input v-model="queryParams.beginInvoiceId" maxlength="10" style="width: 89px" oninput="value=value.replace(/[^\d]/g, '')"/>
              至
              <el-input v-model="queryParams.endInvoiceId" maxlength="10" style="width: 89px" oninput="value=value.replace(/[^\d]/g, '')"/>
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
      :auto-resize="true"
      max-height="450"
      class="vxe-table-element"
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
        <el-row>
          <el-col>
            <el-button v-permission="['laneExListFail:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
            <el-button v-permission="['laneExListFail:exportExcel']" @click="colSettingFn">列配置</el-button>
            <!--            <label style="padding-left: 20px">总记录数：{{ page.realTotal }}</label>-->
          </el-col>
        </el-row>
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['laneExListFail:exportExcel']" type="warning" @click="detail(row)">详情</el-button>
      </template>
    </vxe-grid>

    <!--导出-->
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import moment from 'moment'

import {findPage} from "./laneExListFailApi";
import {findUseList} from "@/views/pro/common/colSetting/colSettingApi";

import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

export default {
  name: 'search.list.laneExListFail.laneExListFailView',
  components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg},
  mixins: [...mixin],
  data() {
    return {
      defaultFirstOrg: true,
      queryParams: {
        sysOrgIdStr: '',
        enTollStationName: '',
        exTollLaneNo: '',
        exOperatorIdStr: '',
        exVehiclePlate: '',
        exVehicleTypeStr: '',
        exVehicleClassStr: '',
        exShiftIdStr: '',
        exTollLaneTypeStr: '',
        vehicleSignStr: '',
        id: '',
        passId: '',
        mediaTypeStr: '',
        mediaNo: '',
        cardId: '',
        roadSpecialTypeStr: '',
        specialTypeStr: '',
        exitFeeTypeStr: '',
        ownProvinceFlagStr: '',
        otherTransvoidFlagStr: '',
        beginInvoiceId: '',
        endInvoiceId: '',
        timeType: 'squadDate',
        beginSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        endSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        beginNaturalDateStr: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00.000',
        endNaturalDateStr: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59.999',
        squadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        naturalDateStr: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      },
      colSetting: {
        belongModule: 'laneExListFail'
      },
      exportExcel: {
        url: 'api/v1/search/list/laneExListFail/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      showSearch: false,
      loading: false,
      tableToolbar: {
        id: 'search.list.laneExListFail.laneExListFailView-toolbar',
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
        realTotal: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      selections: [],
      tableData: [],
      columns: []
    }
  },
  created() {
    //    this.getData();
    if (this.$route.query.type == 'queryByEvent') {
      this.defaultFirstOrg = false // 跳转查询不默认第一个组织机构
      this.queryParams.sysOrgIdStr = this.$route.query.stationOrgId
      this.queryParams.beginSquadDateStr = this.$route.query.eventDay
      this.queryParams.endSquadDateStr = this.$route.query.eventDay
      this.queryParams.exVehiclePlate = this.$route.query.vehiclePlate
      this.queryParams.beginNaturalDateStr = null
      this.queryParams.endNaturalDateStr = null
      this.queryParams.squadDateStr = null
      this.queryParams.naturalDateStr = null
      this.submit()
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
  methods: {
    submit() {
      Object.assign(this.$data.page, this.$options.data().page);
      this.getData();
    },
    async getData() {

      if (this.queryParams.timeType != 'squadDate' && (this.queryParams.endNaturalDateStr == '' || this.queryParams.beginNaturalDateStr == '')) {
        this.$notify({message: "自然日不能为空"});
        return;
      }

      try {
        this.loading = true

        // 每次查询初始化checkbox selections
        this.selections = []
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.page.realTotal = data.realTotal;

        this.columns = [];
        const colSettings = await findUseList({belongModule: this.colSetting.belongModule});
        colSettings.data.forEach(item => {
          this.columns.push(Object.assign({title: item.name, field: item.code}, JSON.parse(item.attrJson)));
        });
        this.columns.push({title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}});

        //保存导出的查询条件
        this.exportExcel.queryParams = XEUtils.clone(this.queryParams,true)
      } finally {
        this.loading = false
      }

    },
    handlePageChange({currentPage, pageSize}) {
      this.page.currentPage = currentPage
      this.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.$refs.sysOrg.setDefaultFirstValue();
      // this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
      //this.getData()
    },
    // change(param1, param2) {
    //   this.queryParams.sysOrg = param2;
    // },
    detail(row) {
      let pre = 'id';
      let idJson = {};
      this.tableData.forEach((x, i) => {
        idJson[pre + XEUtils.toString((this.page.currentPage - 1) * this.page.pageSize + i)] = {id: x.id, exTime: x.exTime}
      })
      let curIndex = pre + '0';
      for(var key in idJson) {
        if (row.id == idJson[key].id && row.exTime == idJson[key].exTime) {
          curIndex = key;
          break;
        }
      }

      let timestamp = Date.parse(new Date());
      let detailId = 'listdetail' + timestamp;
      // var timestamp = '1635581947000';
      this.$store.commit('cache/addTempdata',{
        key:detailId,
        data:{
          queryParams: XEUtils.clone(this.queryParams,true),
          curIndex: curIndex,
          idJson: idJson,
          id: row.id,
          exTime: row.exTime,
        }
      })
      // console.log(this.$store.getters['cache/getTempdata'])
      // console.log(this.$store.getters['cache/getTempdataItem'](detailId))

      this.$router.push({
        path: '/search/list/laneExListFail/detail/' + timestamp,
        query: {
          id: row.id,
          exTime: row.exTime,
          detailId: detailId
        }
      });
    },
    colSettingFn() {
      this.$router.push({
        path: '/search/list/laneExListFail/colSetting',
        query: {
          belongModule: this.colSetting.belongModule
        }
      });
    }
  }
}
</script>

<style scoped>
/*  .el-form-item /deep/ .el-range-editor {
    width: 518px !important;
  }*/
</style>
