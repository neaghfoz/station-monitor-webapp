<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form :model="appForm" ref="appForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-row>
        <el-form-item label="途径路段" prop="sectionId">
          <ti-select style="width: 177px" v-model="appForm.sectionId" :clearable="false"
                     url="/api/v1/common/road/findListByAuth":props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" default-first-value aria-placeholder="途径路段"/>
        </el-form-item>
        <el-form-item label="出站日期" prop="dataRange">
          <ti-date-range date-style="width:260px" v-model="appForm.dataRange" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd" date-rule="singleMonth"
                         begin-key="startDay" start-placeholder="起始日期"
                         end-key="endDay" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="收费门架" size="mini">
          <ti-select
              ref="gantry"
              v-model="gantryId"
              url="api/v1/common/gantry/gantry"
              :props="{key:'gantryId',value:'gantryId',label:'gantryText'}"
              :watch-attr="appForm.sectionId"
              :watch-attr-fn="filterGantrys"
              @change="gantryIdChange"
          />
        </el-form-item>
        <el-form-item label="图表方式">
          <el-radio-group v-model="showDefault" size="mini">
            <el-radio label="table" border style="margin-right:0">表格</el-radio>
            <el-radio label="chart" border>图表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="统计方式" v-show="showDefault=='table'" style="margin-right: 0">
          <el-radio-group v-model="table.showDefault" size="mini">
            <el-radio label="vt" border style="margin-right:0">按车型</el-radio>
            <el-radio label="vc" border style="margin-right:10px">按车种</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <vxe-grid v-show="showDefault=='table'"
            ref="appTable"
            highlight-hover-row
            border
            resizable
            sync-resize
            auto-resize
            keep-source
            highlight-current-row
            max-height="500"
            class="vxe-table-element"
            :export-config="{}"
            :toolbar="tableToolbar"
            @toolbar-button-click="toolbarEvent"
            :loading="table.loading"
            :columns="columns"
            :data="table.datas"
            :span-method="mergeRowMethod"
            @cell-click="cellClickEvent"
            :scroll-x="{ enabled: false, gt: -1 }"
            :scroll-y="{ enabled: false, gt: -1 }"
           >
    </vxe-grid>
    <div ref="myChart" style="height:500px;" v-show="showDefault=='chart'"></div>
    </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import tableOption from "@/views/pro/audit/traffic/gantry/tableOption"
  import {reqData} from "@/views/pro/audit/traffic/gantry/gantryTrafficApi"
  import moment from "moment"
  import chartOption from "@/views/pro/audit/traffic/gantry/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import { getRoadList } from "@/views/pro/common/util/dataUtil"

  export default {
    name: 'audit.traffic.gantry.gantryTrafficView',
    mixins: [...mixin],
    components: {TiSelect,TiDateRange,tiSysOrg},
    data() {
      return {
        tableToolbar: {
          buttons: [
            { code: 'excelExport', icon: 'fa fa-download'}
          ]
        },
        appForm:{
          sectionId:null,
          startDay: null,
          endDay: null,
          dataRange:{
            startDay:moment().add(-30, 'day').format('YYYY-MM-DD'),
            endDay:moment().format('YYYY-MM-DD')
          }
        },
        rules: {
          sectionId: { type: 'string', required: true, message: '' },
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
        dataSource:[],
        showDefault: 'table', // table chart
        gantryId: '', // 按门架统计标记
        gantryMap:{}, // 门架键值对
        // 表格配置
        table:{
          loading: false,
          showDefault: 'vc',
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
          datas: []
        },
      }
    },
    watch: {
      showDefault(val) {
        this.reload(true)
      }
    },
    computed:{
      columns(){
        return this.table.showDefault=='vc' ? tableOption.vcColumns(this.gantryId) : tableOption.vtColumns(this.gantryId)
      }
    },
    mounted(){
      // 初始化图表
      chartOption.init(this.$refs['myChart'])
    },
    methods: {
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr)
        if(!this.appForm.sectionId && seArr.length>0){
          this.appForm.sectionId = seArr[0].roadId
          // 获取到路段之后查询
          this.submit()
        }
        return seArr
      },
      // 表格单击
      cellClickEvent ({ row,column }) {
        if(column.property=='gantryName'){
          let tollGantryName = XEUtils.get(row, column.property)
          if(tollGantryName){
            this.gantryId = XEUtils.get(row, 'tollGantryId')
            this.reload(true)
          }
        }
      },
      // 门架变更
      gantryIdChange(val){
        this.gantryId = val
        this.reload(true)
      },
      // 路段变更，过滤门架
      filterGantrys(newVal,oldVal,gantryList){
        let arr =  gantryList.filter((x)=>{return x.roadId == newVal})
        arr.forEach((x)=>{
          this.gantryMap[x.gantryId] = x.gantryName
        })
        return arr
      },
      toolbarEvent ({ code }) {
        switch (code) {
          case 'excelExport':
            this.export()
            break
        }
      },
      export () {
        tableOption.export(this.$refs.appTable,'断面车流量统计')
      },
      async reload(isCache){
        this.table.loading = true
        // 远程获取数据
        if(!isCache){
          const res = await reqData(this.appForm);
          if(res.code==200){
            this.dataSource = res.data
          }
        }
        if(this.showDefault=='table'){
          let datas = tableOption.dataFormat(this.dataSource,this.gantryId,this.gantryMap)
          // 替换数据源
          this.table.datas = datas
        }else{
          let datas = chartOption.dataFormat(this.dataSource,this.gantryId,this.gantryMap)
          this.$nextTick(() => {
            chartOption.show(datas,this.gantryId,this.chartClick,this.gantryMap)
          })
        }
        this.table.loading = false
      },
      chartClick(gantryId){
        this.gantryId = gantryId
        this.reload(true)
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      mergeRowMethod ({ row, rowIndex, column, data }) {
        const fields = this.gantryId?['transDay']:['gantryName','tollGantryId']
        const cellValue = XEUtils.get(row, column.property)
        if (fields.includes(column.property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },

      submit() {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            this.appForm.startDay = this.appForm.dataRange.startDay
            this.appForm.endDay = this.appForm.dataRange.endDay
            this.gantryId = ''
            this.reload()
          } else {
            return false;
          }
        })
      },
      reset() {
        this.$refs['appForm'].resetFields()
      },

      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
