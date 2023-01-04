<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <div style="padding: 20px">
          <span class="pull-left">
             <span>&nbsp;{{ plateTable.title }}</span>
          </span>
            <div style="clear: both;"></div>
          </div>
          <vxe-grid
            show-overflow
            ref="vxePlateTable"
            @cell-click="plateClick"
            :show-header="false"
            highlight-hover-row
            border
            resizable
            sync-resize
            :auto-resize="true"
            highlight-current-row
            class="vxe-table-element"
            min-height="400px"
            :columns="plateTable.columns"
            :data="plateTable.data"
            :loading="plateTable.ptLoading"
            :start-index="(plateTable.page.currentPage - 1) * plateTable.page.pageSize"
            :pager-config="plateTable.page"
            @page-change="handlePlateChange"
          >
          </vxe-grid>
        </el-col>

        <el-col :span="20">
          <el-row>
            <el-form ref="plateForm" :model="plateForm" inline :label-width="'100px'" style="">
              <el-col>
                <el-form-item label="车牌号码" :offset="1" style="background: rgb(160, 207, 255);">
                  <div style="background:  rgb(255, 255, 255)">{{ plateForm.vehiclePlateText }}</div>
                </el-form-item>
                <el-form-item label="信息库车型" :offset="1" style="background: rgb(160, 207, 255);">
                  <div style="background:  rgb(255, 255, 255)">{{ plateForm.vehInfoConfirmVehicleTypeText }}</div>
                </el-form-item>
                <el-button :disabled="this.plateForm.queryParams.vehiclePlate ? false : true" type="primary" @click="goToVehicleBaseView">查看车辆车型库信息</el-button>
              </el-col>

              <el-col>
                <el-form-item label="出口时间" prop="transDateRange">
<!--                  <ti-date date-style="width:200px"-->
<!--                           v-model="plateForm.queryParams.pathLastnTime"-->
<!--                           dateType="datetime"-->
<!--                           :clearable="true"-->
<!--                           placeholder="选择日期时间"-->
<!--                           format="yyyy-MM-dd HH:mm:ss"-->
<!--                           value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                           :futuredays="30"-->
<!--                  >-->
<!--                  </ti-date>-->
                    <el-form-item prop="beginDate" v-show="false"/>
                    <el-form-item prop="endDate" v-show="false"/>
                    <ti-date-range date-style="width:490px" ref="dateRang" date-type="daterange"
                                   format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                   :clearable="true"
                                   v-model="plateForm.queryParams.transDateRange" begin-key="beginDate"
                                   end-key="endDate"/>

                </el-form-item>
                <el-form-item label="稽核状态" prop="auditStatus">
                  <ti-select v-model="plateForm.queryParams.auditStatus" dict-type="tibms_audit_auditStatus" :multiple="false"/>
                </el-form-item>
                <el-form-item label="稽核结论" prop="auditResult">
                  <ti-select v-model="plateForm.queryParams.auditResult" dict-type="tibms_audit_auditErrorTravelResult" :multiple="false"/>
                </el-form-item>
                <el-form-item class="searchItem" :label-width="'50px'">
                  <el-button :disabled="this.plateForm.queryParams.vehiclePlate ? false : true" type="primary" @click="submit">查询</el-button>
                  <el-button type="default" @click="handleReset">重置</el-button>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="异常行程记录" :offset="1" style="background: rgb(160, 207, 255);"></el-form-item>
              </el-col>

            </el-form>
          </el-row>

          <vxe-grid
            show-overflow
            ref="vxePlateDetailTable"
            highlight-hover-row
            border
            resizable
            sync-resize
            :auto-resize="true"
            keep-source
            highlight-current-row
            min-height="300px"
            class="vxe-table-element"
            :loading="this.plateDetailTable.ptLoading"
            :start-index="(this.plateDetailTable.page.currentPage - 1) * this.plateDetailTable.page.pageSize"
            :pager-config="this.plateDetailTable.page"
            :columns="plateDetailTable.columns"
            :data="plateDetailTable.data"
            @page-change="handlePageChange"
          >
            <template v-slot:operation="{ row }">
              <el-button type="warning" @click="detail(row)">流水稽核</el-button>
            </template>
          </vxe-grid>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import moment from "moment";

import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";

import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"

import {findPlateList, findPlateDeailList} from "../errorTravel"

export default {
  name: 'audit.errorTravel.errorTravelDetail',
  components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiSysOrg, TiDetailCell, TiDate},
  props: {
    escapeType: {
      type: String,
      required: true,
    },
    vehiclePlate: {
      type: String,
      required: false
    },
    reSearch: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      plateTable: {
        title: "共有嫌疑车辆",
        data: [],
        ptLoading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'center',
          layouts: ['PrevPage', 'NextPage',],
          perfect: true
        },
        columns: [{
          field: 'vehiclePlateText',
          align: 'center',
          minWidth: 160
        }]
      },
      plateTableParams: {
        escapeType: this.escapeType,
        vehiclePlate: this.vehiclePlate,
      },
      plateDetailTable: {
        data: [],
        ptLoading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        columns: [
          {type: 'seq', title: '序号', align: 'center', minWidth: 50},
          {title: '车牌号', field: 'vehiclePlateText', align: 'left', minWidth: 150, showOverflow: true},
          {title: '通行类型', field: 'mediaTypeText', align: 'left', minWidth: 100, showOverflow: true},
          {title: '车型', field: 'vehicleTypeText', align: 'left', minWidth: 150, showOverflow: true},
          {title: '车种', field: 'vehicleClassText', align: 'left', minWidth: 150, showOverflow: true},
          {title: '入口站', field: 'pathFirsnName', align: 'left', minWidth: 170, showOverflow: true},
          {title: '入口时间', field: 'enTollTime', align: 'left', minWidth: 170, showOverflow: true},
          {title: '出口站', field: 'pathLastnName', align: 'left', minWidth: 150, showOverflow: true},
          {title: '出口时间', field: 'pathLastnTime', align: 'left', minWidth: 170, showOverflow: true},
          {title: '通行卡号', field: 'cardId', align: 'left', minWidth: 190, showOverflow: true},
          {title: 'OBU编码', field: 'obuId', align: 'left', minWidth: 190, showOverflow: true},
          {title: '稽核状态', field: 'auditStatusText', align: 'left', minWidth: 100, showOverflow: true},
          {title: '稽核结论', field: 'auditResultText', align: 'left', minWidth: 100, showOverflow: true},
          {
            title: '操作', minWidth: 110, fixed: 'right', align: 'center', slots: {default: 'operation'}
          }
        ]
      },
      plateForm: {
        vehicleTypeText: '',
        vehInfoConfirmVehicleTypeText: '',
        vehiclePlateText: '',
        queryParams: {
          transDateRange:{
            beginDate: '',
            endDate: '',
          },
          startTime: '',
          endTime: '',
          vehiclePlate: '',
          vehiclePlateColor: '',
          escapeType: '',
          pathLastnTime: '',
          auditStatus: '',
          auditResult: ''
        },
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      searchFormHeight: '100%',

      importVisible: false,
      showSearch: true,
      loading: false,
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
      dataSource: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 30,
          showOverflow: true,
          align: 'center'
        }, {
          title: '类型',
          field: 'type',
          align: 'left',
          minWidth: 30
        }, {
          title: '省份/路段',
          field: 'roadName',
          align: 'left',
          minWidth: 50
        }, {
          title: '门架/收费站',
          field: 'stationName',
          align: 'center',
          minWidth: 400,
        }, {
          title: '应收金额',
          field: 'payFeeText',
          align: 'right',
          minWidth: 30
        }

      ]
    }
  },
  mounted() {
    //获取显示高度
    //debugger;
    // const deviceHeight = document.documentElement.clientHeight;
    // this.searchFormHeight = (Number(deviceHeight)-270) + 'px'
    this.plateTableParams.vehiclePlate = this.vehiclePlate;
    if (this.reSearch == true) {
      this.getPlateList();

    }
  },
  created() {
    //console.log(this.reSearch);
  },
  activated() {
    //this.getPlateDe

    if (this.plateTable.data.length >= 1) {
      let data = this.plateTable.data[0];
      this.getPlateDetailList(data)
    }yarn
  },
  watch: {
    reSearch: {
      handler: function (newValue, oldValue) {
        //console.log("newParams:",newValue);
        //if (newValue == true) {
          this.getPlateList();
          //debugger;
          //let data = {vehcielPlate: this.vehiclePlate};
          //this.getPlateDetailList(data)
        //}
      },
      deep: true
    },
    vehiclePlate: {
      handler: function (newValue, oldValue) {
        this.plateTableParams.vehiclePlate = newValue;
        this.getPlateList();
      }
    }
  },
  methods: {
    getPlateList() {
      this.getPlateData();
    },
    async getPlateData() {
      this.plateTable.ptLoading = true;
      // 每次查询初始化checkbox selections
      const {data} = await findPlateList(Object.assign({}, {size: this.plateTable.page.pageSize, current: this.plateTable.page.currentPage}), this.plateTableParams)

      this.plateTable.data = data.records
      this.plateTable.page.total = data.total;
      this.plateTable.title = "共有嫌疑车辆" + (data.total >= 0 ? data.total : 0) + "辆"
      //this.plateTable.ptLoading = false;
      if (this.plateTable.data.length >= 1) {
        //let data = {vehiclePlate: this.plateTable.data};
        //this.getPlateDetailList(data)

        this.$refs.vxePlateTable.setCurrentRow(this.plateTable.data[0]);

        let data = this.plateTable.data[0];
        this.getPlateDetailList(data)
      }

      this.plateTable.ptLoading = false;
      //debugger;
      //保存导出的查询条件
      //this.exportExcel.queryParams = this.queryParams;
    },
    getPlateDetailList(params) {

      this.getPlateDetailData(params)
    },
    async getPlateDetailData(params) {
      this.plateDetailTable.ptLoading = true;
      //debugger;
      this.plateForm.queryParams.vehiclePlate = params.vehiclePlate;
      this.plateForm.queryParams.vehiclePlateColor = params.vehiclePlateColor;
      this.plateForm.queryParams.escapeType = params.escapeType;
      //this.plateForm.queryParams.vehicleType = params.vehicleType;
      this.plateForm.vehiclePlateText = params.vehiclePlateText;
      // 每次查询初始化checkbox selections
      const {data} = await findPlateDeailList(Object.assign({}, {size: this.plateDetailTable.page.pageSize, current: this.plateDetailTable.page.currentPage}), params)
      if (data.records.length >0) {
        this.plateForm.vehicleTypeText = data.records[0].vehicleTypeText;
        this.plateForm.vehInfoConfirmVehicleTypeText = data.records[0].vehInfoConfirmVehicleTypeText;
      }
      //debugger;
      this.plateDetailTable.data = data.records
      this.plateDetailTable.page.total = data.total;
      //this.plateTable.title = "共有嫌疑车辆" + (data.total>=0? data.total :0) + "辆"
      this.plateDetailTable.ptLoading = false;

    },
    handleReset() {
      // this.$refs.plateForm.resetFields();
      // this.plateForm.queryParams.pathLastnTime = ''
      this.plateForm.queryParams.auditStatus = ''
      this.plateForm.queryParams.auditResult = ''
      this.plateForm.queryParams.transDateRange.beginDate = ''
      this.plateForm.queryParams.transDateRange.endDate = ''
    },
    plateClick(row, clomn) {
      //console.log("row" +row + "clomn" + clomn);
      let data = row.row;
      this.getPlateDetailList(data)

    }, submit() {
      this.getDetailList();
    }, getDetailList() {
      this.getDetailData()
    },
    async getDetailData() {
      if(this.plateForm.queryParams.transDateRange.beginDate != '' && this.plateForm.queryParams.transDateRange.beginDate != undefined){
        this.plateForm.queryParams.startTime = this.plateForm.queryParams.transDateRange.beginDate + " 00:00:00";
      }else{
        this.plateForm.queryParams.startTime = '';
      }
      if(this.plateForm.queryParams.transDateRange.endDate != '' && this.plateForm.queryParams.transDateRange.endDate != undefined){
        this.plateForm.queryParams.endTime = this.plateForm.queryParams.transDateRange.endDate + " 23:59:59";
      }else{
        this.plateForm.queryParams.endTime = '';
      }
      this.plateDetailTable.ptLoading = true;
      // 每次查询初始化checkbox selections
      const {data} = await findPlateDeailList(Object.assign({}, {size: this.plateDetailTable.page.pageSize, current: this.plateDetailTable.page.currentPage}),
        this.plateForm.queryParams)
      //this.plateForm.vehiclePlateText = params.vehiclePlateText;
      //this.plateForm.vehicleTypeText = data.records[0].vehicleTypeText;
      //this.plateForm.queryParams.vehiclePlate = params.vehiclePlate;
      //this.plateForm.queryParams.vehiclePlateColor = params.vehiclePlateColor;

      this.plateDetailTable.data = data.records
      this.plateDetailTable.page.total = data.total;
      this.plateDetailTable.ptLoading = false;

    }, handlePageChange({currentPage, pageSize}) {
      this.plateDetailTable.page.currentPage = currentPage
      this.plateDetailTable.page.pageSize = pageSize
      this.getDetailData()
    }, detail(row) {
      //
      //var timestamp = Date.parse(new Date());
      var timestamp = '20210522';
      //debugger
      this.$router.push({
        path: '/audit/errorTravel/passDetail/' + timestamp,
        query: {
          row: row
        }
      });

    }, handlePlateChange({currentPage, pageSize}) {
      this.plateTable.page.currentPage = currentPage
      this.plateTable.page.pageSize = pageSize
      this.getPlateList()
    },
    goToVehicleBaseView() {
      this.$router.push({
        name: 'audit.vehicleBase.vehicleInfoBaseView',
        params: {vehicleBaseVehiclePlate: this.plateForm.queryParams.vehiclePlate, vehicleBaseVehicleColor: this.plateForm.queryParams.vehiclePlateColor}
      })
    }

  }
}
</script>

<style scoped>


.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
