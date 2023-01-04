<template>
  <div class="app-container">
    <div v-show="showSearch" class="search-form">
      <el-form ref="searchForm"  :model="queryParams" inline :label-width="'100px'">
        <el-form-item label="机构" prop="sysOrgIdStr" :rules="[{required:true,message:'机构必选', trigger:'change'}]">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" :default-first-value="$route.query.sysOrgIdStr==undefined"/>
        </el-form-item>
<!--        <el-form-item label="车道号" prop="laneNo">-->
<!--          <el-input v-model="queryParams.laneNo" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>-->
<!--        </el-form-item>-->

        <el-form-item label="车道号" prop="laneNo" :rules="[ {required: true, message:'车道号必选', trigger:'change'} ]">
          <ti-select
            ref="laneId"
            :clearable="false"
            v-model="queryParams.laneNo"
            url="/api/v1/common/lane/listWithUserAuth"
            :props="{key:'laneId',value:'laneNo',label:'laneNo'}"
            :watch-attr="queryParams.sysOrgIdStr"
            :watch-attr-fn="watchAttrFn"
          />
        </el-form-item>
        <el-form-item label="操作员" prop="operatorId">
          <ti-select
            v-model="queryParams.operatorId"
            url="/api/v1/common/sysUser/list"
            :props="{key:'id',value:'username',label:'fullName'}"
          />
        </el-form-item>
        <el-form-item label="日志关键字" prop="keyword">
          <el-input v-model="queryParams.keyword" maxlength="20" style="width: 199px"/>
        </el-form-item>
        <el-form-item label="操作时间" label-width="120px">
          <el-form-item prop="beginOpTime" v-show="false"/>
          <el-form-item prop="endOpTime" v-show="false"/>
          <ti-date-range v-model="queryParams" date-type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                         date-rule="singleDay" :clearable="false" begin-key="beginOpTime" end-key="endOpTime"/>
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
        <el-button v-permission="['vehNotes:exportExcel']"  @click="exportExcel.dialog = true">导出</el-button>
        <span style="margin-left: 20px;color: red">*只能查询一天</span>
      </template>

      <template v-slot:operation="{ row }">
        <el-button type="warning" @click="detail(row)">查看前后信息</el-button>
      </template>
    </vxe-grid>

    <ti-export-excel :exportExcel="exportExcel"
    :modal-append-to-body='false' :is-veh-notes="true" :page="page"></ti-export-excel>
    <Detail1 ref="vehNotesDetailDialog" @refreshDataList="getData"/>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';

import {findPage} from "./vehNotesApi";
import moment from 'moment'

import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";

import Detail1 from './components/vehNotesDetail'
import $ from "jquery";

export default {
    name: 'search.list.vehNotes.vehNotesView',
    components: {TiExportExcel, TiSelectTree, TiSelect, TiDateRange,Detail1, tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        reset:false,
        initFlag:false,
        queryParams: {
          sysOrgIdStr: '',
          sysOrg: '',
          laneNo: '',
          operatorId: '',
          keyword: '',
          beginOpTime: moment(new Date()).format('YYYY-MM-DD')+' 00:00:00',
          endOpTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        //  laneComputerIP: '10.173.211.92',
        //  currentPage: '',
         // pageSize: '',
          endTime: ''
        },
        // rules: {
        //   laneNo: { type: 'string', required: true, message: '车道号不能为空' },
        // },
        exportExcel: {
          url: 'api/v1/search/list/vehNotes/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'search.list.vehNotes.vehNotesView-toolbar',
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
        },
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 25,
          align: 'left',
          pageSizes: [10, 25, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [
          {
            title: '操作时间',
            field: 'time', width: 180, showOverflow: true
          },
          {
            title: '操作员',
            field: 'operatorTxt', width: 180, showOverflow: true
          },
          {
            title: '日志内容',
            field: 'log', minWidth: 400, showOverflow: true
          },
          {title: '操作',  field: 'hasKey', width: 120, fixed: 'right', align: 'center', slots: {default: 'operation'} }
        ]
      }
    },
    created() {
      //    this.getData()
      this.$nextTick(()=> {
        this.columns = this.$refs.vxe.getColumns()
      });

      //从流水详情页面跳转
      console.log(this.$route.query)
      if (this.$route.query){
        this.queryParams.sysOrgIdStr=this.$route.query.sysOrgIdStr;
        this.queryParams.laneNo = this.$route.query.laneNo;
        this.queryParams.beginOpTime=moment(this.$route.query.opTime).add(-3,'minute').format("YYYY-MM-DD HH:mm:ss");
        this.queryParams.endOpTime=moment(this.$route.query.opTime).add(3,'minute').format("YYYY-MM-DD HH:mm:ss");
      }
    },
    methods: {
      watchAttrFn(newVal, oldVal, selectData) {
        // let stationList = [];
        // this.$refs.sysOrg.initStationOrgList(stationList);

        if(this.reset){
          this.reset = false;
          return []
        }
        //获取当前机构id的stationId
        let stationId = '';
        if(newVal){
          let selectOrg = this.$refs.sysOrg.getSysOrg();
          stationId = selectOrg.stationId;
        }

        //json是为了去重（不能laneNo重复，不然下拉列表太多）
        let laneJson = {}
        selectData.forEach(x => {
          if (stationId == x.stationId) {
            laneJson[x.laneNo] = x;
          }
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
      setSysOrgDisable(sysOrg,level){
        for (let i = 0; i < sysOrg.length; i++) {
          if(sysOrg[i].nodeLevel != level && !sysOrg[i].disabled){
            sysOrg[i].disabled = true;
          }
          console.log("sysOrg:",sysOrg[i]);
          const setDisable = (children,level) =>{
            if(!children){
              return
            }
            for(let i = 0; i < children.length; i++){
              const item = children[i];
                if(item.nodeLevel != level && !item.disabled){
                  item.disabled = true;
                console.log(" item:", item);
              }
              setDisable(item.children,level);
            }
          }
          setDisable(sysOrg[i].children,level);
          console.log("newSys:",sysOrg);
        }
      },
      sysOrgFilter(data){
           this.setSysOrgDisable(data,4)
          console.log("sysOrg:",data)

          return data
      },
      submit(){
        // Object.assign(this.$data.page, this.$options.data().page);
        this.$data.page.currentPage=1;
        this.$refs['searchForm'].validate((valid) => {
            if (valid) {
              this.getData();
            }else {
              return false;
            }
        });

      },
      async getData() {
        // 每次查询初始化checkbox selections
        this.selections = []
        this.loading = true
        if(!this.initFlag){
          let sysOrg = this.$refs.sysOrg.getSysOrg();
          this.queryParams.roadNo =sysOrg.roadNo
          this.queryParams.stationNo = sysOrg.stationNo
        }
        this.queryParams.currentPage = this.page.currentPage
        this.queryParams.pageSize = this.page.pageSize

        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)


        if (data && data.status &&  data.status=== "00000") {
          if(data.data.object && data.data.object.length>0 && JSON.stringify(data.data.object[0]) != "{}"){
            this.tableData = data.data.object
          }else{
            this.tableData = [];
          }

          for(let data1 of this.tableData){
            let operatorTxt = '['+data1.operatorId+']'+data1.operatorName
            this.$set(data1,'operatorTxt',operatorTxt)
          }
          this.page.total = data.data.cusPageInfo.totalSize
          this.$nextTick(()=> {
            // 查询条件有关键字显示操作列，无关键字则隐藏
            if (this.queryParams.keyword != null && this.queryParams.keyword != ''){
              this.columns[3].visible = true
            //console.log( "===this.columns[3].true===",this.columns)
            }else{
              this.columns[3].visible = false
            //console.log( "===this.columns[3].false===",this.columns)
            }
            this.$refs.vxe.refreshColumn()

          })
          //保存导出的查询条件
          this.$set(this.exportExcel.queryParams,'start',data.data.cusPageInfo.currentPage)
          this.$set(this.exportExcel.queryParams,'length',data.data.cusPageInfo.pageSize)

        } else {
          this.tableData = []
          if(data && data.message && data.message!=""){
            this.$notify.error({message:data.message});
          }

        }
        //保存导出的查询条件
        this.exportExcel.queryParams = this.queryParams;
        this.exportExcel.queryParams['dataRows'] = this.page.total
        this.loading = false

      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.$refs.sysOrg.setDefaultFirstValue();
        this.reset = true;
       // this.getData()
      },
      detail(row) {
        this.queryParams.currentIndex =  row.currentPage
        this.$refs.vehNotesDetailDialog.init(this.queryParams)
      },
      initQuery(param){
        this.queryParams.sysOrgIdStr = param.sysOrgIdStr;
        this.queryParams.laneNo = param.laneNo
        this.queryParams.operatorId = param.operator;
        this.queryParams.stationNo = param.stationNo
        this.queryParams.roadNo = param.roadNo;
        this.queryParams.beginOpTime = moment(param.tranTime).add(-3,'minute').format("YYYY-MM-DD HH:mm:ss");
        this.queryParams.endOpTime = moment(param.tranTime).add(3,'minute').format("YYYY-MM-DD HH:mm:ss");
        this.initFlag = true;
        this.getData();
        this.initFlag = false;
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
