<template>
  <div class="app-container">
    <div class="search-form">
      <el-card>
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'" size="small">
        <div>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <!--<ti-select-tree
              v-model="queryParams.sysOrgIdStr"
              check-strictly
              url="api/v1/common/sysOrg/orgList"
              :props="{value:'id',label:'fullName',children:'children'}"
              @change="change"
            />-->
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" :default-first-value="defaultFirstOrg"/>
          </el-form-item>
          <el-form-item label="入口车道号" prop="enTollLaneNo">
            <el-input v-model="queryParams.enTollLaneNo" maxlength="5" style="width: 199px"
              @blur="queryParams.enTollLaneNo=$event.target.value"
              oninput="value=value.replace(/[^\d]/g, '')"/>
          </el-form-item>
          <el-form-item label="入口车道类型" prop="enTollLaneTypeStr">
            <ti-select v-model="queryParams.enTollLaneTypeStr" dict-type="tibms_com_laneType" multiple/>
          </el-form-item>
          <el-form-item label="操作员" prop="enOperatorNoStr">
            <ti-select v-model="queryParams.enOperatorNoStr" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}" multiple/>
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
              format="yyyy-MM-dd HH:mm:ss"
              begin-key="beginNaturalDateStr"
              end-key="endNaturalDateStr"
              :clearable="false" date-rule="oneMonth"/>
          </el-form-item>
          <el-form-item label="工班" prop="enShiftIdStr">
            <ti-select v-model="queryParams.enShiftIdStr" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}" multiple/>
          </el-form-item>
          <el-form-item label="车型" prop="enVehicleTypeStr">
            <ti-select v-model="queryParams.enVehicleTypeStr" dict-type="tibms_com_vehicleType" multiple/>
          </el-form-item>
          <el-form-item label="车种" prop="enVehicleClassStr">
            <ti-select v-model="queryParams.enVehicleClassStr" dict-type="tibms_com_vehicleClass" multiple/>
          </el-form-item>
          <el-form-item label="车牌号码" prop="enVehiclePlate">
            <el-input v-model="queryParams.enVehiclePlate" type="text" maxlength="16" style="width: 199px"/>
          </el-form-item>
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <el-button type="primary" @click="showSearch = !showSearch">{{showSearch?'隐藏':'展开'}}</el-button>
        </div>

        <div v-show="showSearch">
          <el-form-item label="入口流水号" prop="id">
            <el-input v-model="queryParams.id" type="text" maxlength="37" style="width: 199px"/>
          </el-form-item>
          <el-form-item label="通行标识ID" prop="passId">
            <el-input v-model="queryParams.passId" type="text" maxlength="40" style="width: 199px"/>
          </el-form-item>
          <el-form-item label="通行介质类型" prop="mediaTypeStr">
            <ti-select v-model="queryParams.mediaTypeStr" dict-type="tibms_com_mediaType" multiple/>
          </el-form-item>
          <el-form-item label="cpc/etc卡号" prop="cardId">
            <el-input v-model="queryParams.cardId" maxlength="20" style="width: 199px"/>
          </el-form-item>
          <el-form-item label="收费特情类型" prop="specialTypeStr">
            <ti-select v-model="queryParams.specialTypeStr" dict-type="tibms_com_specialType_lane" multiple/>
          </el-form-item>
        </div>

      </el-form>
      </el-card>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      stripe
      round
      size="small"
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
            <el-button v-permission="['laneEnList:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
            <el-button v-permission="['laneEnList:exportExcel']" @click="colSettingFn">列配置</el-button>
<!--            <label style="padding-left: 20px">总记录数：{{page.realTotal}}</label>-->
          </el-col>
        </el-row>
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['laneEnList:exportExcel']" type="warning" @click="detail(row)">详情</el-button>
      </template>
    </vxe-grid>

    <!--导出-->
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'

  import {findPage} from "./laneEnListApi";
  import {findUseList} from "@/views/pro/common/colSetting/colSettingApi";

  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'search.list.laneEnList.laneEnListView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange, TiDate,tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        defaultFirstOrg: true,
        queryParams: {
          sysOrgIdStr: '',
          enTollLaneNo: '',
          enOperatorNoStr: '',
          enVehiclePlate: '',
          enVehicleTypeStr: '',
          enVehicleClassStr: '',
          enShiftIdStr: '',
          enTollLaneTypeStr: '',
          mediaTypeStr: '',
          cardId: '',
          specialTypeStr: '',
          id: '',
          passId: '',
          timeType: 'squadDate',
          beginSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
          endSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
          beginNaturalDateStr: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00.000',
          endNaturalDateStr: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59.999',
          squadDateStr: moment(new Date()).format('YYYY-MM-DD'),
          naturalDateStr: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
        colSetting: {
          belongModule: 'laneEnList'
        },
        exportExcel: {
          url: 'api/v1/search/list/laneEnList/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showSearch: false,
        loading: false,
        tableToolbar: {
          id: 'search.list.laneEnList.laneEnListView-toolbar',
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
      // this.getData();
      if(this.$route.query.type == 'queryByEvent'){
        this.defaultFirstOrg = false // 跳转查询不默认第一个组织机构
        this.queryParams.sysOrgIdStr = this.$route.query.stationOrgId
        this.queryParams.beginSquadDateStr = this.$route.query.eventDay
        this.queryParams.endSquadDateStr = this.$route.query.eventDay
        this.queryParams.enVehiclePlate = this.$route.query.vehiclePlate
        this.queryParams.beginNaturalDateStr = null
        this.queryParams.endNaturalDateStr = null
        this.queryParams.squadDateStr = null
        this.queryParams.naturalDateStr = null
        this.submit()
      }
    },
    methods: {
      submit(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {

        if (this.queryParams.timeType !='squadDate' && (this.queryParams.endNaturalDateStr == '' || this.queryParams.beginNaturalDateStr == '')) {
          this.$notify({message:"自然日不能为空"});
          return;
        };

        if(this.queryParams.timeType != 'squadDate'){
          this.queryParams.beginNaturalDateStr = this.queryParams.beginNaturalDateStr.substring(0,19) + '.000';
          this.queryParams.endNaturalDateStr = this.queryParams.endNaturalDateStr.substring(0,19) + '.999';
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
          this.exportExcel.queryParams = XEUtils.clone(this.queryParams,true);
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
       // this.getData()
      },
      change(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      detail(row) {
        let pre = 'id';
        let idJson = {};
        this.tableData.forEach((x, i) => {
          idJson[pre + XEUtils.toString((this.page.currentPage - 1) * this.page.pageSize + i)] = {id: x.id, enTime: x.enTime}
        })
        let curIndex = pre + '0';
        for(var key in idJson) {
          if (row.id == idJson[key].id && row.enTime == idJson[key].enTime) {
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
            enTime: row.enTime
          }
        })

        this.$router.push({
          path: '/search/list/laneEnList/detail/' + timestamp,
          query: {
            id: row.id,
            enTime: row.enTime,
            detailId: detailId
          }
        });
      },
      colSettingFn() {
        this.$router.push({
          path: '/search/list/laneEnList/colSetting',
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
