<template>
  <div class="app-container">
    <el-form ref="searchForm" :rules="searchRules" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="路段名称" prop="sectionIds">
          <ti-select ref="sections" style="width: 177px" v-model="queryParams.sectionId"
                     url="/api/v1/common/road/findListByAuth":props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" default-first-value aria-placeholder="路段名称"/>
        </el-form-item>

        <el-form-item label="出口交易时间" label-width="110px" prop="transDateRange">
          <el-form-item prop="startDay" v-show="false"/>
          <el-form-item prop="endDay" v-show="false"/>
          <ti-date-range date-style="width:490px" ref="dateRang" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                         date-rule="oneYear"  v-model="queryParams.transDateRange" begin-key="startDay"
                         end-key="endDay"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <el-button type="success"  v-permission="['fitTrafficStat:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <vxe-grid
      ref="vex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @page-change="handlePageChange"
      @current-change="currentChangeEvent">
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
      >
    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

    <vxe-grid
          ref="vex1"
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          keep-source
          highlight-current-row
          max-height="1000"
          class="vxe-table-element"
          :loading="loading2"
          :columns="columns2"
          :data="tableData2"
          >
    </vxe-grid>
  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {fitStatByTransDay,fitStatByPathType, exportExcel} from "@/views/pro/audit/traffic/fit/fitTrafficStat";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import moment from "moment";
  import { getRoadList } from "@/views/pro/common/util/dataUtil"

  export default {
    name: 'audit.traffic.fitTrafficStatView',
    mixins: [...mixin],
    components: {TiDateRange, TiSelectTree, TiSelect, TiExportExcel},
    data() {
      return {
        queryParams: {
          transDateRange:{
            startDay: moment(new Date()).format('YYYY-MM-DD'),
            endDay: moment(new Date()).format('YYYY-MM-DD')
          },
          startDay:'',
          endDay:'',
          sectionId: ''
        },
        searchRules:{
          transDateRange: [
            {type: 'array',
            required: false,
            message: '出口交易时间不能为空',
            fields: {
              startDay: { type: 'string', required: true, message: '出口交易开始时间不能为空' },
              endDay: { type: 'string', required: true, message: '出口交易结束时间不能为空' }
            }
          }]
        },
        exportExcel: {
          url: 'api/v1/audit/traffic/fit/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        loading: false,
        loading2: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.traffic.fit.fitTrafficStat-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: false, // 最大化按钮
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
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
            'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        tableData2: [],
        selectRowIndex: 0,
        selectRow: {},
        columns: [
          		{
		        	field: "transDay",
		            title: "出口交易时间",
            		showOverflow: true,
            		slots:{
            		  	default: ({row},h) => {
            				return row.transDay.substring(0,4) + "-" + row.transDay.substring(4,6) + "-" + row.transDay.substring(6,8);
            			}
            		}
		        },
		        {
		            field: "totalNum" ,
		            title: "总还原路径",
            		showOverflow: true
		        },
		        {
		            field: "completeNum" ,
		            title: "完整路径",
            		showOverflow: true
		        },
		        {
		            field: "completePercent" ,
		            title: "完整路径占比",
            		showOverflow: true,
            		slots:
            		{
	              		default: ({row}, h) => {
	                		return row.completePercent + "%";
	              		}
	            	}
		        },
		        {
		            field: "addNum" ,
		            title: "补点路径",
            		showOverflow: true
		        },
		        {
		            field: "addPercent" ,
		            title: "补点路径占比",
            		showOverflow: true,
            		slots:
            		{
	              		default: ({row}, h) => {
	                		return row.addPercent + "%";
	              		}
	            	}
		        },
		        {
		            field: "fee" ,
		            title: "原始流水应收(万元)"
		        },
		        {
		            field: "addFee" ,
		            title: "补点应收(万元)"
		        },
		        {
		            field: "fitFee" ,
		            title: "拟合应收(万元)"
		        }
        ],
        columns2:[
        	{
            	title: '出口交易时间', align: 'center',
            	children: [
              		{title: '通行路径类型', field: 'pathType', minWidth: 80, showOverflow: true, align: 'right',
              		 slots:{default:({row},h) => {
              		 	if(row.pathType=='1'){
              		 		return '本路段进本路段出';
              		 	}else if(row.pathType=='2'){
              		 		return '本路段进其它路段出';
              		 	}else if(row.pathType=='3'){
              		 		return '其它路段进本路段出';
              		 	}else if(row.pathType=='4'){
              		 		return '其它路段进其它路段出';
              		 	}else{
              		 		return '未知';
              		 	}
              		 }}
              		},
              		{title: '路径数量', field: 'totalNum', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '拟合应收(万元)', field: 'fitFee', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '占比', field: 'totalPercent', minWidth: 80, showOverflow: true, align: 'right',
            		slots:
            		{
	              		default: ({row}, h) => {
	                		return row.totalPercent + "%";
	              		}
	            	}},
           	 	]
          	},
        	{
            	title: '行程数量', align: 'center',
            	children: [
              		{title: '完整路径', field: 'completeNum', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '补点路径', field: 'addNum', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '补点占比', field: 'addPercent', minWidth: 80, showOverflow: true, align: 'right',
            		slots:
            		{
	              		default: ({row}, h) => {
	                		return row.addPercent + "%";
	              		}
	            	}},
           	 	]
          	},
        	{
            	title: '通行费', align: 'center',
            	children: [
              		{title: '原始流水应收(万元)', field: 'fee', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '补点应收(万元)', field: 'addFee', minWidth: 80, showOverflow: true, align: 'right'},
              		{title: '补点占比', field: 'addFeePercent', minWidth: 80, showOverflow: true, align: 'right',
            		slots:
            		{
	              		default: ({row}, h) => {
	                		return row.addFeePercent + "%";
	              		}
	            	}},
           	 	]
          	}
          ]
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr)
        if(!this.queryParams.sectionId && seArr.length>0){
          this.queryParams.sectionId = seArr[0].sectionId
          // 获取到路段之后查询
          this.submit()
        }
        return seArr
      },
      submit()
      {
        Object.assign(this.$data.page, this.$options.data().page)
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
              this.queryParams.startDay =  this.queryParams.transDateRange.startDay;
              this.queryParams.endDay =  this.queryParams.transDateRange.endDay;
              this.getData();
          }else {
            return false;
          }
        });
      },
      async getData() {
         this.loading = true;
         console.log("this.queryParams:", this.queryParams);
         const {data} = await fitStatByTransDay(
         Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
            this.queryParams)
         this.tableData = data.records
         this.page.total = data.total
         this.loading = false

		 if (this.tableData.length > 0) {
            this.$nextTick(() => {
              this.$refs.vex.setCurrentRow(this.$refs.vex.data[0]);
              this.selectRow = this.$refs.vex.getCurrentRecord();
           	  this.getTable2(this.selectRow.transDay);
            });
         }

         //保存导出的查询条件
         this.exportExcel.queryParams = this.queryParams;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData();
      },
      currentChangeEvent({row}) {
        this.selectRowIndex = this.$refs.vex.getRowIndex(row);
        this.selectRow = this.$refs.vex.getCurrentRecord();
        this.getTable2(row.transDay);
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sectionId='';
        this.$refs.sections.placeholder = '请选择';
        //this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
        // Object.assign(this.$data.page, this.$options.data().page)
        // this.getData()
      },
      async getTable2(startDay){
      	this.loading2 = true;
        var params = {};
        params['sectionId'] = this.queryParams.sectionId;
        params['startDay'] = startDay;
      	const res = await fitStatByPathType(params);
      	//console.log(JSON.stringify(res));
        if(res.code==200){
           this.tableData2 = res.data;
        }
      	this.loading2 = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .imgBox {
    margin: 5px;
  }

  .audit-table {
    /*border-collapse:collapse;*/
    /*border-spacing:0px;*/
    width: 100%;
    background-color: #fff;
    color: #666;
  }


  .audit-table td, .audit-table th {
    border-width: 1px;
    /*border-style:solid;*/
    /*border-color:#e6e6e6;*/
    position: relative;
    padding: 0px 0px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
  }

  .audit-table td .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }


  .audit-table td .el-input--small {
    width: 50%;
  }

  .audit-table td .el-input__inner {
    height: 32px;
    line-height: 32px;
    width: 50%;
  }

  .detail-table {
    border-collapse: collapse;
    border-spacing: 0px;
    border-color: #fff;
    color: #666;
    table-layout: fixed;
    width: 100%;
    margin: 1px;
  }

  .detail-table th, .detail-table td {
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
    padding: 5px 0px;
  }

  .detail-table th {
    font-weight: 400;
    width: 33.33%;
    text-align: center;
    background-color: #f2f2f2;
  }

  .detail-table td {
    word-wrap: break-word;
    width: auto;
    height: 35px;
  }

  /*.el-form-item .el-range-editor*/
  /*{*/
  /*  width: 300px !important;*/
  /*}*/

  /*.vxe-table  .vxe-body--row.row--current {*/
  /*  background-color: yellow !important;*/
  /*}*/

  /*.el-col-md-8{*/
  /*  height: 100%;*/
  /*  background-color:#f3f4f9;*/
  /*}*/
</style>
