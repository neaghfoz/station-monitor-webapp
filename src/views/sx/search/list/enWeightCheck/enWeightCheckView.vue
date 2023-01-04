<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams"  :rules="searchFormRules"  inline :label-width="'100px'">
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
                      maxlength="10"  />
          </el-form-item>
          <el-form-item label="车型"  prop="vehicleTypeStr">
            <ti-select style="width:180px" v-model="queryParams.vehicleTypeStr" dict-type="tibms_com_vehicleType" multiple/>
          </el-form-item>
          <el-form-item label="轴数" prop="axleSum">
            <el-input v-model="queryParams.axleSum" maxlength="5"  oninput="value=value.replace(/[^\d]/g, '')"/>
          </el-form-item>
          <el-form-item label="是否大件运输车" prop="isBulkVehicle" :label-width="'120px'">
            <ti-select
              v-model="queryParams.isBulkVehicle"
              :data-list="[{value:'1',name:'是'},{value:'2',name:'否'}]"
              :props="{key:'value',value:'value',label:'name'}"/>
          </el-form-item>
          <el-form-item label="特殊事件"  prop="spEventStr">
            <ti-select style="width:180px" v-model="queryParams.spEventStr" dict-type="tb_search_weightcheckSpEvent" multiple/>
          </el-form-item>
          <el-form-item label="治超时间" >
            <ti-date-range v-model="queryParams" date-type="datetimerange"
                           format="yyyy-MM-dd HH:mm:ss" begin-key="beginHspTimeStr"
                           end-key="endHspTimeStr" date-rule="oneYear" :clearable="false"  />
          </el-form-item>

          <el-form-item label="超载率(%)" prop="overRate" >
            <el-input v-model="queryParams.startOverRateStr" type="text"  maxlength="8" style="width: 83px" />
            <span>至</span>
            <el-input v-model="queryParams.endOverRateStr" type="text" maxlength="8" style="width: 83px"/>
          </el-form-item>


          <el-form-item class="searchItem" style="float: right;padding-right:20px">
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
      show-header-overflow
      resizable
      sync-resize
      auto-resize
      header-align="center"
      max-height="500"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @sort-change="sortChangeEvent"
      @page-change="handlePageChange"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
    >
      <template v-slot:toolbar_buttons>
        <el-button v-permission="['enWeightCheck:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['enWeightCheck:detail']" type="warning" @click="detail(row.listNo, row.hspTimeText)">详情</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import XEUtils from 'xe-utils'
  import moment from 'moment';

  import {findPage, exportExcel} from "./enWeightCheckApi";


  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

  export default {
    name: 'search.list.enWeightCheck.enWeightCheckView',
    components: { TiExportExcel, TiSelectTree, TiSelect, TiDateRange, TiDate, tiSysOrg },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          vehiclePlate: '',
          beginHspTimeStr: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
          endHspTimeStr:  moment(new Date()).add(1,'days').format('YYYY-MM-DD') + ' 00:00:00',
          startOverRateStr: '',
          endOverRateStr: '',
          startOverRate: '',
          endOverRate: '',
          vehicleTypeStr: '',
          axleSum: '',
          vehicleType: '',
          spEventStr:'',
          isBulkVehicle:'',
          orderByName:'',
          orderBy:''
        },
        searchFormRules:{
          overRate: [
            {
              required: false,
              validator: (rules, value, cb) => {


                if(this.queryParams.startOverRateStr &&  !/^(([1-9]{1}(\d{0,8}))|(0{1}))(\.\d{1,2})?$/.test(this.queryParams.startOverRateStr)) {
                  return cb(new Error("整数限8位,小数限2位"));
                }

                if(this.queryParams.endOverRateStr && !/^(([1-9]{1}(\d{0,8}))|(0{1}))(\.\d{1,2})?$/.test(this.queryParams.endOverRateStr)) {
                  return cb(new Error("整数限8位,小数限2位"));
                }
                return cb();
              },
              trigger: "change"
            }
          ],

        },
        exportExcel: {
          url: 'api/v1/search/list/enWeightCheck/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        importUrl: 'api/v1/search/list/enWeightCheck/importExcel',
        tplUrl: 'api/v1/search/list/enWeightCheck/excelTemplate',
        exportUrl: 'api/v1/search/list/enWeightCheck/exportExcel?token=${getToken()}',
        tableToolbar: {
          id: 'search.list.enWeightCheck.enWeightCheckView-toolbar',
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
            minWidth: 90,
            field: 'roadText',
            align: 'center'
          },
          {
            title: '收费站',
            minWidth: 135,
            field: 'stationText',
            align: 'center'
          },
          {
            title: '治超时间',
            minWidth: 150,
            field: 'hspTimeText',
            align: 'center'
          },
          {
            title: '车牌号码',
            minWidth: 140,
            field: 'vehicleIdText',
            align: 'center'
          },
          {
            title: '车型',
            minWidth: 100,
            field: 'vehicleTypeText',
            align: 'center'
          },
          {
            title: '轴型',
            minWidth: 80,
            field: 'axleType',
            align: 'center'
          },
          {
            title: '轴数',
            minWidth: 50,
            field: 'axleSum',
            align: 'center'
          },
          {
            title: '总重(kg)',
            field: 'totalWeight',
            minWidth: 100,
            sortable:true,
            align: 'center'
          },
          {
            title: '限重(kg)',
            minWidth: 100,
            field: 'overLimited',
            align: 'center'
          },
          {
            title: '超限量(kg)',
            minWidth: 100,
            field: 'overWeight',
            align: 'center'
          },
          {
            title: '超载率(%)',
            field: 'overRateText',
            minWidth: 115,
            sortable:true,
            align: 'center'
          },
          {
            title: '是否大件运输车',
            minWidth: 150,
            field: 'isBulkVehicleText',
            align: 'center'
          },
          {
            title: '大件运输许可证',
            minWidth: 150,
            field: 'certNo',
            align: 'center'
          },
          {
            title: '是否黑名单',
            minWidth: 100,
            field: 'isBlackvehicleText',
            align: 'center'
          },
          {
            title: '是否允许通行',
            minWidth: 115,
            field: 'allowPassText',
            align: 'center'
          },
          {
            title: '特殊事件',
            minWidth: 120,
            field: 'spEventText',
            align: 'center'
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
        this.queryParams.orderByName = '';
        this.queryParams.orderBy = '';
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getData() {
        this.$refs['searchForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
        })
        // 每次查询初始化checkbox selections
        this.selections = []
        if(this.queryParams.startOverRateStr &&  !/^(([1-9]{1}(\d{0,8}))|(0{1}))(\.\d{1,2})?$/.test(this.queryParams.startOverRateStr)) {
          return false;
        }

        if(this.queryParams.endOverRateStr && !/^(([1-9]{1}(\d{0,8}))|(0{1}))(\.\d{1,2})?$/.test(this.queryParams.endOverRateStr)) {
          return false;
        }
        this.loading = true
        if ( this.queryParams.startOverRateStr) {

          this.queryParams.startOverRate =XEUtils.divide(this.queryParams.startOverRateStr , 100)
        } else {
          this.queryParams.startOverRate = ''
        }

        if ( this.queryParams.endOverRateStr) {
          this.queryParams.endOverRate = XEUtils.divide(this.queryParams.endOverRateStr, 100)
        } else {
          this.queryParams.endOverRate = ''
        }
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.loading = false

        //保存导出的查询条件
        //保存导出的查询条件
        this.exportExcel.queryParams = XEUtils.clone(this.queryParams,true);
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.$refs.sysOrg.setDefaultFirstValue();
        this.queryParams.startOverRate = ''
        this.queryParams.endOverRate = ''
        this.queryParams.startOverRateStr = ''
        this.queryParams.endOverRateStr = ''
        this.queryParams.beginHspTimeStr = moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
        this.queryParams.endHspTimeStr =  moment(new Date()).add(1,'days').format('YYYY-MM-DD') + ' 00:00:00'
      },
      detail(listNo, hspTimeText) {

        let pre = 'id';
        let idJson = {};
        this.tableData.forEach((x, i) => {
          idJson[pre + XEUtils.toString((this.page.currentPage - 1) * this.page.pageSize + i)] = {id: x.listNo, time: x.hspTimeText}
        })
        let curIndex = pre + '0';
        for(var key in idJson) {
          if (listNo == idJson[key].id && hspTimeText == idJson[key].time) {
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
            id: listNo,
            hspTime: hspTimeText
          }
        })

        this.$router.push({
          path: '/search/list/enWeightCheck/detail/' + timestamp,
          query : {
            listNo : listNo,
            hspTime : hspTimeText,
            detailId: detailId
          }
        });
      },
      sortChangeEvent (column, property, order) {
        if (this.$refs.vxe){
          this.$refs.vxe.clearSort()
        }
        var orderByName = column.field
        if (orderByName == 'overRateText') {
          orderByName = 'overRate'
        }
        this.queryParams.orderByName =orderByName;
        this.queryParams.orderBy = column.order;
        this.getData();
      }
    }
  }
</script>

<style scoped>
  .el-form-item /deep/ .el-form-item__content {
    /*width: 60% !important;*/
  }
</style>
