<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="出入口类型" prop="userMarkNo">
            <ti-select v-model="queryParams.userMarkNo" dict-type="tibms_toll_userMarkNo"/>
          </el-form-item>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value multiple @change="orgChange()"/>
          </el-form-item>

          <el-form-item label="车道号" prop="laneNoStr" >
            <!--<ti-select
              ref="laneId"
              :clearable="false"
              v-model="queryParams.laneNoStr"
              :dataList="selectLaneList"
              :props="{key:'laneId',value:'laneNo',label:'laneNo'}"
              :multiple="true"
            />-->
            <el-select v-model="queryParams.laneNoStr"  filterable  multiple>
              <el-option
                v-for="item in selectLaneList"
                :key="item.laneId"
                :label="item.laneNo"
                :value="item.laneNo">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工班" prop="squadNoStr">
            <ti-select v-model="queryParams.squadNoStr" url="api/v1/common/squad/list"
                       :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
                        multiple="true"/>
          </el-form-item>
          <el-form-item label="工班日期">
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <ti-date-range v-model="queryParams" :selectfuture="true" date-type="daterange" format="yyyy-MM-dd" begin-key="beginSquadDateStr" end-key="endSquadDateStr"/>
          </el-form-item>

          <el-form-item label="发卡/收费员" prop="laneOperatorNoStr">
            <ti-select v-model="queryParams.laneOperatorNoStr" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}" multiple/>
          </el-form-item>
          <el-form-item label="状态" prop="statusStr">
            <ti-select v-model="queryParams.statusStr" dict-type="tibms_toll_ShiftWorkFlowNode" multiple="true"/>
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['shiftRegMainRecord:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
	<el-card shadow="never" :max-height="this.tableHeight">

	  <div class="box">
	    <vxe-grid
	      ref="xTable"
	      highlight-hover-row
	      border
	      show-overflow
	      show-header-overflow
	      resizable
	      sync-resize
	      auto-resize
	      class="vxe-table-element"
	      :max-height="600"
	      :loading="tableData.loading"
	      :columns="tableData.tableColumns"
	      :data="tableData.columnsDataList"
	      :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
	      :pager-config="tableData.page"
	      :toolbar="tableToolbar"
	      @page-change="handlePageChange"
	      @checkbox-all="({ selection }) => { selections = selection }"
	      @checkbox-change="({ selection }) => { selections = selection }"
	    >

        <template v-slot:toolbar_buttons>
          <el-button type="primary" v-permission="['shiftRegMainRecord:create']" @click="add()">添加</el-button>
          <el-button type="info" v-permission="['shiftRegMainRecord:excel']" @click="exportExcel.dialog = true">导出</el-button>

        </template>

        <template v-slot:operation="{ row }">
          <el-button v-permission="['shiftRegMainRecord:detail']" type="info" @click="detail(row)">详情</el-button>
          <el-button v-permission="['shiftRegMainRecord:edit']" type="primary" @click="edit(row)">修改</el-button>
          <el-button v-permission="['shiftRegMainRecord:delete']" type="danger" @click="del(row)">删除</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>


    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>
    <detail-view ref="detailDialog" @refreshData="getData" />
    <add-view ref="addDialog" @refreshData="getData" />

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment';
  import api from './shiftRegMainRecordApi.js'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import detailView from './components/detailShiftRegMainRecordView'
  import addView from './components/addShiftRegMainRecordView'
  import $ from "jquery";
  import {cloneDeep} from '@ecip/ecip-web/src/utils'


  export default {
    name: 'shiftRegMainRecordView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiExportExcel, TiDateRange, detailView, addView },
    mixins: [...mixin],
    data() {
      return {
        reset:false,
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        isHaveSpareMoney:false,
        isHaveSpareMoneyForWork:false,
        allLaneList:[],
        selectLaneList:[],
        orgMap:{},
        queryParams: {
          sysOrgIdStr:'',
          laneNo:'',
          beginSquadDateStr:moment(new Date()).subtract(1, "days").format('YYYY-MM-DD'),
          endSquadDateStr:moment(new Date()).format('YYYY-MM-DD'),
          squadNo:'',
          laneOperatorID:'',
          userMarkNo:''
        },
        dropData:{
          id: '',
          netRoadID: '',
          roadNo: '',
          stationNo: '',
          laneNo: '',
          squadDate: '',
          squadNo: '',
          laneOperatorNo: '',
          operatorNo: '',
          regTime: ''
        },
        exportExcel: {
          url: 'api/v1/shift/shiftRegMainRecord/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
			      { title: '出入口类型', field: 'userMarkNoText', minWidth: 105, showOverflow: true, align: 'center' },
            { title: '路段', field: 'roadNameText', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '收费站', field: 'stationNameText', minWidth: 120, showOverflow: true , align: 'center' },
            { title: '车道号', field: 'laneNo', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '工班日期', field: 'squadDate', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '工班', field: 'squadNoText', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '发卡/收费员', field: 'operatorNameText', minWidth: 130, showOverflow: true, align: 'center'  },
            { title: '总金额', field: 'totalMoneyText', minWidth: 80, showOverflow: true, align: 'center'  },
            { title: '登记员', field: 'registerOperatorText', minWidth: 120, showOverflow: true, align: 'center' },
            { title: '登记时间', field: 'regTimeText', minWidth: 150, showOverflow: true, align: 'center'  },
            { title: '状态', field: 'statusText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '操作', minWidth: 220, slots: { default: 'operation' }, align: 'center', fixed: 'right'}
          ],

          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'right',
            pageSizes: [5, 10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          }},
        tableToolbar: {
          id: 'modules.paramQuery',
          custom: true,
          zoom: true, // 最大化按钮

          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {
      deptFilterText(val) {
        this.$refs.paramTree.filter(val)
      }
    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {
        this.init();
      })
    },
    methods: {
      init() {
        this.getData();
        this.$nextTick(async() => {
          let that = this
          let laneResp = await api.laneListWithUserAuth()
          that.allLaneList = laneResp.data

          let allOrgData = await api.findOrgByAuth()
          if(allOrgData.code == 200){
            allOrgData.data.forEach(function (data , index) {
              that.orgMap[data.id] = data
            })
          }

          that.orgChange()
        })
      },
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
      numFilter(value) {
        const realVal = (parseInt(value)/100.0).toFixed(2);
        return realVal;
      },
      submit() {
        this.tableData.page.currentPage = 1
        this.getData()
      },
      async getData() {
		 // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
        let queryParams = {}
        cloneDeep(queryParams, this.queryParams)
        queryParams.laneNoStr = queryParams.laneNoStr.join(',')
        this.tableData.loading = true
        api.findPage(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false;

          //保存导出的查询条件
          this.exportExcel.queryParams = queryParams;
        })
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.defaultValue;
        this.reset = true;
      },

      orgChange(){
        let that = this
        // 初始化
        that.selectLaneList = []
        let laneList = []
        let tempLaneList = []
        if(that.queryParams.sysOrgIdStr){
          let sysOrgIdArr = that.queryParams.sysOrgIdStr.split(',')
          for(let data of sysOrgIdArr){
            let org = that.orgMap[data]
            if(org != null){
              let roadNo = org.roadNo
              let stationNo = org.stationNo
              for (let data1 of that.allLaneList) {
                if(data1.roadNo == roadNo && data1.stationNo == stationNo){
                  if(laneList.indexOf(data1.laneNo) == -1){
                    tempLaneList.push(data1)
                    laneList.push(data1.laneNo)
                  }
                }
              }
            }
          }
        }

        tempLaneList.sort(function (a, b) {
          if(parseInt(a.laneNo) > parseInt(b.laneNo)){
            return 1
          }else {
            return -1
          }
        })
        cloneDeep(that.selectLaneList, tempLaneList)
      },

      async add() {
        let orgData = await api.getCurrentOrg();
        if(orgData == null || orgData.data == null || orgData.data == undefined){
          this.$notify.warning("当前用户没有分配机构，无法操作!")
          return
        }
        this.$refs.addDialog.init(this.queryParams.tenantId, this.queryParams.appId, null, orgData)
      },

      async edit(row) {
        let that = this
        if(row.status == 2){
          that.$notify.error("工班已结算，不能修改")
          return
        }

        //工班结算校验
        let settleDataResp = await api.checkShiftSettleStock({
          roadNo: row.roadNo,
          stationNo: row.stationNo,
          laneNo: row.laneNo,
          squadDateStr: row.squadDate,
          squadNo: row.squadNo,
          laneOperatorNo: row.laneOperatorNo
        })

        if(null == settleDataResp){
          that.$notify.error("检查工班结算状态异常，请检查!")
          return
        }

        if(!settleDataResp.data){
          that.$notify.error("工班已结算，不能修改!")
          return
        }

        this.$refs.addDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id, null)
      },

      async detail(row) {
        this.$refs.detailDialog.detail(this.queryParams.tenantId, this.queryParams.appId, row.id)
      },

      async del(row){
        let that = this
        that.dropData = {
          id: row.id,
          netRoadID: row.netRoadID,
          roadNo: row.roadNo,
          stationNo: row.stationNo,
          laneNo: row.laneNo,
          squadDate: row.squadDate,
          squadNo: row.squadNo,
          laneOperatorNo: row.laneOperatorNo,
          operatorNo: row.operatorNo,
          regTime: row.regTime
        }

        if(row.status == 2){
          that.$notify.error("工班已结算，不能删除!")
          return
        }

        //工班结算校验
        let settleDataResp = await api.checkShiftSettleStock({
          roadNo: that.dropData.roadNo,
          stationNo: that.dropData.stationNo,
          laneNo: that.dropData.laneNo,
          squadDateStr: that.dropData.squadDate,
          squadNo: that.dropData.squadNo,
          laneOperatorNo: that.dropData.laneOperatorNo
        })

        if(null == settleDataResp){
          that.$notify.error("检查工班结算状态异常，请检查!")
          return
        }

        if(!settleDataResp.data){
          that.$notify.error("工班已结算，不能删除!")
          return
        }

        // 校验本人或者交接班管理员登记
        if (!that.lastCheckRegOperatorNo()) {
          return
        }

        that.$confirm('是否删除交接班记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteByIds(that.dropData.id).then(res =>{
            if(res.data.flag){
              that.$notify.success(res.data.msg);
              that.getData()
            }else{
              that.$notify.error(res.data.msg);
            }
          })
        })

      },

      lastCheckRegOperatorNo(){
        let powerSMG0100 = true
        if (!powerSMG0100) {
          let registerOperatorNo = this.dropData.operatorNo
          let loginOperator = this.$store.getters.userInfo.username;
          if (registerOperatorNo != loginOperator) {
            this.$notify.error("该交班记录不是本人登记，无法删除交接班记录！")
            return false
          }
        }

        return true
      }


    }
  }
</script>

<style scoped>

</style>
