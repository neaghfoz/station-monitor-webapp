<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form :model="appForm" ref="appForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-row>
        <!-- <el-form-item  label="通行介质" prop="mediaType">
          <ti-select style="width: 177px"
                     v-model="appForm.mediaType"
                     :data-list="[{value:'1',name:'OBU'},{value:'2',name:'CPC'}]"
                     :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item> -->
        <el-form-item label="车牌号" prop="vehiclePlate">
          <el-input style="width: 177px" v-model="appForm.vehiclePlate" type="text" placeholder="车牌号"
                    maxlength="16"/>
        </el-form-item>
        <!-- <el-form-item label="车牌颜色" prop="vehicleColor">
          <ti-select style="width: 177px"
           v-model="appForm.vehicleColor"
           dict-type="tibms_com_vehicleColor"/>
        </el-form-item>
        <el-form-item label="OBU编号" prop="obuId">
          <el-input style="width: 177px" v-model="appForm.obuId" type="text" placeholder="OBU编号"
                    maxlength="30"/>
        </el-form-item>
        <el-form-item label="卡号" prop="cardId">
          <el-input style="width: 177px" v-model="appForm.cardId" type="text" placeholder="CPC卡号"
                    maxlength="30"/>
        </el-form-item>
        <el-form-item label="通行标识" prop="passId">
          <el-input style="width: 177px" v-model="appForm.passId" type="text" placeholder="通行标识"
                    maxlength="64"/>
        </el-form-item> -->
        <el-form-item label="入口时间" prop="dataRange">
          <ti-date-range date-style="width:260px" v-model="appForm.dataRange" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd" date-rule="singleMonth"
                         begin-key="startDay" start-placeholder="起始日期"
                         end-key="endDay" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <!-- <el-button type="default" @click="reset">重置</el-button>
          <el-button type="success" @click="exportExcel.dialog = true">导出</el-button> -->
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <vxe-grid ref="appTable"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              keep-source
              highlight-current-row
              height="400px"
              class="vxe-table-element"
              :export-config="{}"
              :loading="table.loading"
              :columns="table.columns"
              :data="table.datas"
              :start-index="(table.page.currentPage - 1) * table.page.pageSize"
              :pager-config="table.page"
              @current-change="currentChangeEvent"
              @page-change="handlePageChange">
      >
    </vxe-grid>
    <!--导出-->
    <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>

    <div style="margin-top:20px;"  v-show="table.datas.length>0">
      <ti-road-net ref="roadNet" :path-info-list="pathList" :image-show="true" :check-show="false">
        <template slot="operation">
          <el-button type="primary" icon="el-icon-arrow-left"  @click="lastOne">上一条</el-button>
          <el-button type="primary" icon="el-icon-arrow-right" @click="nextOne">下一条</el-button>
        </template>
      </ti-road-net>
    </div>

    </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import { getData,getPathList } from '@/views/pro/audit/passResult/passDirectApi'
  import moment from "moment"
  //import { exportExcel } from "@/views/pro/common/util/dataUtil"
  import TiRoadNet from "@/views/pro/audit/comm/tiRoadNet/tiRoadNet";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";

  export default {
    name: 'audit.passResult.passDirectView',
    mixins: [...mixin],
    components: { TiSelect,TiDateRange,TiRoadNet, TiExportExcel },
    data() {
      return {
        tableToolbar: {
          buttons: [
            { code: 'excelExport', icon: 'fa fa-download'}
          ]
        },
        pathList: [],
        selectRowIndex: 0,
        appForm:{
          startTime: null,
          endTime: null,
          mediaType: null,
          vehiclePlate: null,
          vehicleColor: null,
          obuId: null,
          cardId: null,
          passId: null,
          dataRange:{
            startDay:moment().add(-30, 'day').format('YYYY-MM-DD'),
            endDay:moment().format('YYYY-MM-DD')
          }
        },
        exportExcel: {
          url: '/api/v1/audit/passResultExportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },

        rules: {
          dataRange: [{
              type: 'array',
              required: true,
              message: '',
              fields: {
                startDay: { type: 'string', required: true, message: '' },
                endDay: { type: 'string', required: true, message: '' }
              }
          }]
        },
        // 表格配置
        table:{
          loading: false,
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'left',
            pageSizes: [10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
              'Total'],
            perfect: true
          },
          datas: [],
          columns: [
            {
              field: "enVehiclePlate",
              title: "车牌号码",
              minWidth: 150,
              showOverflow: true
            },
            {
              field: "enVehiclePlateColor",
              title: "车牌颜色",
              minWidth: 150,
              showOverflow: true
            },
            {
              field: "enStationName",
              title: "入口站",
              minWidth: 150,
              showOverflow: true
            },
            {
              field: "enTime",
              title: "入口时间",
              minWidth: 180,
              showOverflow: true
            },
            {
              field: "splitProvinceText",
              title: "收费单元列表",
              minWidth: 180,
              showOverflow: true
            },
            {
              field: "exStationName",
              title: "出口站",
              minWidth: 150,
              showOverflow: true
            },
            {
              field: "exTime",
              title: "出口时间",
              minWidth: 180,
              showOverflow: true
            }]
        }
      }
    },
    mounted() {
      this.appForm.vehiclePlate = this.$route.params.passResultVehiclePlate
      const vehicleColor = this.$route.params.passResultVehicleColor
      this.appForm.vehicleColor = (vehicleColor === 0 ? '0' : vehicleColor)
      this.submit()
    },
    watch: {
      fullVehiclePlate: function (newVal) {
        const curFullVehiclePlate = (this.appForm.vehiclePlate + "_" + this.appForm.vehicleColor)
        if (newVal && newVal != curFullVehiclePlate) {
          Object.assign(this.$data.appForm, this.$options.data().appForm)
          this.appForm.vehiclePlate = this.$route.params.passResultVehiclePlate
          this.appForm.vehicleColor = this.$route.params.passResultVehicleColor
          if (this.appForm.vehicleColor === 0) {
            this.appForm.vehicleColor = '0'
          }
          this.submit()
        }
      }
    },
    computed: {
      fullVehiclePlate: function () {
        if (this.$route.params.passResultVehiclePlate) {
          return this.$route.params.passResultVehiclePlate + "_" + this.$route.params.passResultVehicleColor
        }
        return ""
      }
    },
    methods: {

      // 获取路径明细列表
      async getPathDetail({ passId,enTime }){
        const params = {
          passId: passId,
          enTime: enTime
        }
        const { data } = await getPathList({},params);
        this.pathList = data.pathInfos;
      },
      currentChangeEvent({ row }) {
        this.selectRowIndex = this.$refs.appTable.getRowIndex(row);
        this.getPathDetail(this.$refs.appTable.getCurrentRecord());
      },
      lastOne(){
        if( this.selectRowIndex === 0){
          this.$notify.warning("已经是第一条数据!");
          return;
        }
        this.selectRowIndex = this.selectRowIndex - 1;
        this.$refs.appTable.setCurrentRow(this.$refs.appTable.data[this.selectRowIndex]);
        this.getPathDetail(this.$refs.appTable.data[this.selectRowIndex]);
      },
      nextOne(){
        if( this.selectRowIndex === this.table.datas.length - 1){
          this.$notify.warning("已经是最后条数据了!");
          return;
        }
        this.selectRowIndex = this.selectRowIndex + 1;
        this.$refs.appTable.setCurrentRow(this.$refs.appTable.data[this.selectRowIndex]);
        this.getPathDetail(this.$refs.appTable.data[this.selectRowIndex]);
      },

      async reload(isCache){
        this.table.loading = true
        const res = await getData({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.appForm);
        if(res.code==200){
          this.table.datas = res.data.records
          this.table.page.total = res.data.total

          //默认第一行高亮
          if ( this.table.datas.length > 0) {
            this.$nextTick(() => {
              this.$refs.appTable.setCurrentRow(this.$refs.appTable.data[0]);
              this.getPathDetail(this.$refs.appTable.data[0]);
            })
          }
        }
        this.table.loading = false
      },
      submit() {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            this.appForm.startTime = this.appForm.dataRange.startDay+" 00:00:00"
            this.appForm.endTime = this.appForm.dataRange.endDay+" 23:59:59"
            this.table.page.currentPage = 1
            this.selectRowIndex = 0;
            this.reload()
            //保存查询条件
            this.exportExcel.queryParams = this.appForm;
          } else {
            return false;
          }
        })
      },
      reset() {
        this.$refs['appForm'].resetFields()
      },
      exportEx(){
        //
        //exportExcel(this.$refs['appTable'],'行驶路径列表')

      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
