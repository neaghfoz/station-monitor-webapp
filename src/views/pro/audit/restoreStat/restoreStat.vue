<template>
  <div class="app-container" style="display: flex; height: calc(100vh - 91px); flex-direction: column;">
    <!-- 搜索条件 -->
    <el-form :model="appForm" ref="appForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-row>
        <el-form-item label="通行日期" prop="dataRange">
          <ti-date-range date-style="width:260px" v-model="appForm.dataRange" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd" date-rule="singleMonth"
                         begin-key="startDay" start-placeholder="起始日期"
                         end-key="endDay" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="路段" prop="sectionId">
          <ti-select style="width: 177px" v-model="appForm.sectionId" :clearable="true"
                     url="/api/v1/common/road/findListByAuth":props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" aria-placeholder="路段"/>
        </el-form-item>
        <el-form-item label="收费门架" prop="sectionId">
          <ti-select :clearable="true"
            ref="gantry"
            v-model="appForm.gantryId"
            url="api/v1/common/gantry/gantry"
            :props="{key:'gantryId',value:'gantryId',label:'gantryText'}"
            :dataFilter="gantryFilter"
            :watch-attr="appForm.sectionId"
            :watch-attr-fn="filterGantrys"
            @change="gantryIdChange"
          />
        </el-form-item>

        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
<!--          <el-button type="success" @click="exportEx">导出</el-button>-->
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <div style="flex: 1">
      <vxe-grid ref="appTable"
                highlight-hover-row
                border
                resizable
                sync-resize
                auto-resize
                keep-source
                highlight-current-row
                height="auto"
                class="vxe-table-element"
                :export-config="{}"
                :loading="table.loading"
                :columns="table.columns"
                :data="table.datas"
                :toolbar="tableToolbar"
                :start-index="(table.page.currentPage - 1) * table.page.pageSize"
                :pager-config="table.page"
                @sort-change="sortTable"
                @page-change="handlePageChange">
      >
        <template v-slot:toolbar_buttons>
          <el-button  @click="exportExcel.dialog = true">导出</el-button>
        </template>
      </vxe-grid>
        <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
      </div>
    </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import { getData } from '@/views/pro/audit/restoreStat/restoreStatApi'
  import moment from "moment"
  import { getRoadList,exportExcel } from "@/views/pro/common/util/dataUtil"
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";

  export default {
    name: 'audit.restoreStat.restoreStatView',
    mixins: [...mixin],
    components: { TiSelect,TiDateRange,TiExportExcel },
    data() {
      return {
        tableToolbar: {
          id: 'audit.restoreStat.restoreStatView-toolbar',
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
        exportExcel: {
          url: 'api/v1/audit/list/reptStat/restoreStatExportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        appForm:{
          sectionId:null,
          startDay: null,
          endDay: null,
          gantryId: null,
          orderByName:'',
          orderBy:'',
          dataRange:{
            startDay:moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDay:moment().add(-1, 'day').format('YYYY-MM-DD')
          }
        },
        gantryMap:{}, // 门架键值对
        sectionMap:{}, // 路段键值对
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
          columns: [{
            title: '路段名称',
            field: 'sectionName',
            align:'center',
            showOverflow: true,
            minWidth:140
          },{
            title: '门架编码',
            field: 'tollGantryId',
            align:'center',
            showOverflow: true,
            minWidth:160
          },{
            title: '门架名称',
            field: 'tollGantryName',
            align:'left',
            showOverflow: true,
            minWidth:200
          },{
            title: '交易日期',
            field: 'transDay',
            align:'center',
            showOverflow: true,
            minWidth:120
          },{
            title: '流水总数',
            field: 'oriNum',
            align:'right',
            showOverflow: true,
            minWidth:100,
          },{
            title: '有效交易数量',
            field: 'effectiveNum',
            align:'right',
            showOverflow: true,
            minWidth:100,
          },{
            title: '占比',
            field: 'effectiveRate',
            sortable:true,
            align:'center',
            showOverflow: true,
            minWidth:100,
          },{
            title: '反向交易数量',
            field: 'revertNum',
            showOverflow: true,
            align:'right',
            minWidth:100,
          },{
            title: '占比',
            field: 'revertRate',
            sortable:true,
            align:'center',
            showOverflow: true,
            minWidth:100,
          },{
            title: '标签交易失败次数',
            field: 'obufailNum',
            align:'right',
            showOverflow: true,
            minWidth:100,
          },{
            title: '占比',
            field: 'obufailRate',
            sortable:true,
            align:'center',
            showOverflow: true,
            minWidth:100,
          },{
            title: 'CPC交易失败数量',
            field: 'cpcfailNum',
            align:'right',
            showOverflow: true,
            minWidth:100,
          },,{
            title: '占比',
            field: 'cpcfailRate',
            sortable:true,
            align:'center',
            showOverflow: true,
            minWidth:100,
          },{
            title: '漏计漏扣数量',
            field: 'addNum',
            align:'right',
            showOverflow: true,
            minWidth:100,
          },{
            title: '占比',
            field: 'addRate',
            sortable:true,
            align:'center',
            showOverflow: true,
            minWidth:100,
          },{
            title: '漏计漏扣金额(元)',
            field: 'addMoneyTxt',
            align:'right',
            showOverflow: true,
            minWidth:100,
          }]
        },
      }
    },
    mounted() {

    },
    methods: {
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr)
        seArr.forEach((x)=>{
          this.sectionMap[x.roadId] = x.name||x.roadId
        })
        return seArr
      },
      // 门架变更
      gantryIdChange(val){
        this.appForm.gantryId = val
      },
      gantryFilter(datas){
        datas.forEach((x)=>{
          this.gantryMap[x.gantryId] = x.gantryName||x.gantryId
        })
        setTimeout(()=>this.submit(),100)
        return datas
      },
      // 路段变更，过滤门架
      filterGantrys(newVal,oldVal,gantryList){
        let arr =  gantryList.filter((x)=>{return x.roadId == newVal})
        return arr
      },
      // formatData(datas){
      //   datas.forEach(vo=>{
      //     vo['sectionName'] = this.sectionMap[vo.sectionId]
      //     vo['gantryName'] = this.gantryMap[vo.tollGantryId]
      //     if(vo.oriNum>0){
      //       const oriNum = vo.oriNum
      //       vo['failRate'] = (vo.failNum/oriNum*100.0).toFixed(2)+'%'
      //       vo['revertRate'] = (vo.revertNum/oriNum*100.0).toFixed(2)+'%'
      //       vo['addRate'] = (vo.addNum/oriNum*100).toFixed(2)+'%'
      //       vo['addMoneyScale'] = (vo.addMoney/100.0).toFixed(2)+'%'
      //     }else{
      //       vo['failRate'] = '-'
      //       vo['revertRate'] = '-'
      //       vo['addRate'] = '-'
      //       vo['addMoneyScale'] = '-'
      //     }
      //   })
      //   return datas
      // },
      async reload(isCache){
        this.table.loading = true
        const res = await getData({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.appForm);
        if(res.code==200){
          // this.table.datas = this.formatData(res.data.records)
          this.table.datas = res.data.records
          this.table.page.total = res.data.total
        }
        this.exportExcel.queryParams = this.appForm
        this.table.loading = false
      },
      submit() {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            this.appForm.orderByName = '';
            this.appForm.orderBy = '';
            this.appForm.startDay = this.appForm.dataRange.startDay
            this.appForm.endDay = this.appForm.dataRange.endDay
            this.table.page.currentPage = 1
            this.reload()
          } else {
            return false;
          }
        })
      },
      reset() {
        this.$refs['appForm'].resetFields()
      },
      exportEx(){
        exportExcel(this.$refs['appTable'],'门架错扣漏扣统计')
      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      },
      sortTable(column,prop,order){
        if (this.$refs.appTable)
          this.$refs.appTable.clearSort()
        this.appForm.orderByName = column.field;
        this.appForm.orderBy = column.order;
        this.reload();
      }
    }
  }
</script>
<style scoped>
  /deep/ .vxe-icon--caret-top:before, /deep/ .vxe-icon--caret-bottom:before{
    bottom: .4em;
  }
  /deep/ .vxe-icon--caret-bottom:before, /deep/ .vxe-icon--caret-left:before, /deep/ .vxe-icon--caret-right:before, /deep/ .vxe-icon--caret-top:before{
    border-width: .5em
  }
</style>
