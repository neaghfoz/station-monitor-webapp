<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="所在机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
          </el-form-item>
          <el-form-item label="车道号" prop="laneNo">
            <el-input v-model="queryParams.laneNo" maxlength="5" style="width: 199px" oninput="value=value.replace(/[^\d]/g, '')"/>
          </el-form-item>

          <el-form-item label="工班日期">
            <el-form-item prop="beginSquadDateStr" v-show="false"/>
            <el-form-item prop="endSquadDateStr" v-show="false"/>
            <ti-date-range v-model="queryParams" :selectfuture="true" date-type="daterange" format="yyyy-MM-dd" begin-key="beginSquadDateStr" end-key="endSquadDateStr"/>
          </el-form-item>
          <el-form-item label="工班" prop="squadNo">
            <ti-select v-model="queryParams.squadNo" url="api/v1/common/squad/list" :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"/>
          </el-form-item>
          <el-form-item label="车道操作员" prop="laneOperatorID">
            <ti-select v-model="queryParams.laneOperatorID" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}"/>
          </el-form-item>
          <el-form-item label="操作员" prop="operatorID">
            <ti-select v-model="queryParams.operatorID" url="/api/v1/common/sysUser/list" :props="{key:'id',value:'username',label:'fullName'}"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
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

        </template>
        <template v-slot:operation="{ row }">
          <el-button v-permission="['shiftRegMainRecord:detail']" type="warning" @click="detail(row)">详情</el-button>
          <el-button v-permission="['shiftRegMainRecord:delete']" type="warning" @click="del(row)">删除</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>


  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import api from './shiftProcessLinkApi.js'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";


  export default {
    name: 'shiftProcessLinkView',
    components: { TiSelectTree, TiSelect, tiSysOrg, TiDateRange },
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        dropData:{
          linkId: '',
          netRoadID: '',
          roadNo: '',
          stationNo: '',
          laneNo: '',
          squadDate: '',
          squadNo: '',
          laneOperatorID: '',
          operatorID: '',
          regTime: ''
        },
        queryParams: {
          sysOrgIdStr:'',
          laneNo:'',
          beginSquadDateStr: '',
          endSquadDateStr:'',
          squadNo:'',
          laneOperatorID:'',
          userMarkNo:''
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { title: '路段', field: 'roadNameText', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '收费站', field: 'stationNameText', minWidth: 120, showOverflow: true , align: 'center' },
            { title: '车道号', field: 'laneNo', minWidth: 70, showOverflow: true, align: 'center'  },
            { title: '工班日期', field: 'squadDate', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '工班', field: 'squadNoText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '车道操作员', field: 'laneOperatorNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '操作员', field: 'operatorNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '登记时间', field: 'regTime', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '状态', field: 'shiftWorkFlowNodeText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '操作', align: 'left', minWidth: 150, slots: { default: 'operation' }, fixed: 'right'}
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
          // 列宽操作记录
          resizable: {
            storage: true
          },
          slots: {
            buttons: 'toolbar_buttons'
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {
    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {
        this.init(this.$route.query);
      })
    },
    methods: {
      init(query) {
        if(query.sysOrgIdStr){
          this.$set(this.queryParams,'sysOrgIdStr',query.sysOrgIdStr+'')
          this.queryParams.laneNo = query.laneNo
          this.queryParams.beginSquadDateStr = query.squadDate
          this.queryParams.endSquadDateStr = query.squadDate
          this.$set(this.queryParams,'squadNo',query.squadNo+'')
          this.queryParams.laneOperatorID = query.laneOperatorID+''
        }

        this.getData();
      },
      submit() {
        this.tableData.page.currentPage = 1
        this.getData()
      },
      async getData() {
        // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
        this.tableData.loading = true
        api.findPage(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false;
        })
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
      },

      async detail(row) {
        let timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/toll/shift/shiftManagement/shiftRegMainRecord/detail/'+timestamp,
          query:{
            id: row.id
          }
        });
      },

      async del(row){
        let that = this
        that.dropData = {
          linkId: row.id,
          netRoadID: row.netRoadID,
          roadNo: row.roadNo,
          stationNo: row.stationNo,
          laneNo: row.laneNo,
          squadDate: row.squadDate,
          squadNo: row.squadNo,
          laneOperatorID: row.laneOperatorID,
          operatorID: row.operatorID,
          regTime: row.regTime
        }

        //工班结算校验
        let settleDataResp = await api.checkShiftSettleStock({
          roadNo: that.dropData.roadNo,
          stationNo: that.dropData.stationNo,
          laneNo: that.dropData.laneNo,
          squadDateStr: that.dropData.squadDate,
          squadNo: that.dropData.squadNo,
          laneOperatorNo: that.dropData.laneOperatorID
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
        if (!that.lastCheckRegOperatorID()) {
          return
        }

        // 校验卡单元完整性
        let canDelete = true
        let selectShiftProcessRegCardUnitNoResp = await api.selectShiftProcessRegCardUnitNo({
          id: that.dropData.linkId
        })

        if (null != selectShiftProcessRegCardUnitNoResp && selectShiftProcessRegCardUnitNoResp.data.length > 0) {
          for(let data of selectShiftProcessRegCardUnitNoResp.data){
            // 校验卡单元后期有没有被使用
            let selectLastShiftPassCardDetailRecordResp = await api.selectLastShiftPassCardDetailRecord({
              cardUnitNo: data
            });
            if (null == selectLastShiftPassCardDetailRecordResp || null == selectLastShiftPassCardDetailRecordResp.data) {
              that.$notify.error("获取删除交班流程卡单元最后登记记录失败，请检查！")
              canDelete = false
              return false
            }

            let respSquadDate = moment(moment(selectLastShiftPassCardDetailRecordResp.data.squadDate)).valueOf()
            let respSquadNo = parseInt(selectLastShiftPassCardDetailRecordResp.data.squadNo)
            let respRegTime = moment(moment(selectLastShiftPassCardDetailRecordResp.data.regTime)).valueOf()
            let respOperatorID = selectLastShiftPassCardDetailRecordResp.data.laneOperatorID
            let respOperatorName = selectLastShiftPassCardDetailRecordResp.data.laneOperatorName

            let depsSquadDate = moment(moment(that.dropData.squadDate + " 00:00:00")).valueOf()
            let depsSquadNo = parseInt(that.dropData.squadNo)
            let depsRegTime = moment(moment(that.dropData.regTime)).valueOf()

            if (respSquadDate > depsSquadDate
              || (respSquadDate == depsSquadDate && respSquadNo > depsSquadNo)
              || (respSquadDate == depsSquadDate && respSquadNo == depsSquadNo && respRegTime > depsRegTime)) {
              let msg = "卡单元:" + data
                + "<br/>已经在后期（" + moment(selectLastShiftPassCardDetailRecordResp.data.squadDate).format("YYYY-MM-DD") + " " + respSquadNo + "号班）"
                + "<br/>被操作员（[" + respOperatorID + "]" + respOperatorName + "）使用,不能删除该记录！"
              that.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: msg,
                type: 'error',
                position: 'top-right',
                duration: 3000
              })
              canDelete = false
              return false
            }
          }
        }
        if (canDelete) {
          that.$confirm('是否删除交接班记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            api.deleteByIds(that.dropData.linkId).then(res =>{
              if(res.data.flag){
                that.$notify.success(res.data.msg);
                that.getData()
              }else{
                that.$notify.error(res.data.msg);
              }
            })
          })
        }

      },

      lastCheckRegOperatorID(){
        let powerSMG0100 = true
        if (!powerSMG0100) {
          var registerOperatorID = this.dropData.operatorID
          var loginOperator = this.$store.getters.userInfo.username;
          if (registerOperatorID != loginOperator) {
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
