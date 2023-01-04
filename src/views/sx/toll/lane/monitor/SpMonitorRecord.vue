<template>

  <el-dialog title="特情登记" width="75%"
             :modal-append-to-body='false'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             :close-on-click-modal=false
             append-to-body="true"
             :visible="spShow"
             :z-index="zIndex"
  >

    <div class="app-container">
      <div class="search-form">
        <el-form ref="searchForm" :model="queryParams" inline :label-width="'85px'">
          <el-row>

            <el-form-item label="机构" prop="sysOrgIdStr">
              <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" @change="orgChange" show-level="4"  />
            </el-form-item>
             <el-form-item label="车牌号码" prop="vehiclePlate">
               <el-input v-model="queryParams.vehiclePlate" type="text" maxlength="18" style="width: 180px" />
             </el-form-item>

              <el-form-item label="出入口类型" prop="entryExitType" >
                <ti-select v-model="queryParams.entryExitType" dict-type="tibms_com_inOutType"/>
              </el-form-item>

              <el-form-item label="车道号" prop="laneNo">
                <ti-sys-lane clearable  v-model="queryParams.laneNo"  :cache="true" :station-id="appForm.stationId"/>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="getData()">查询</el-button>
                <el-button type="default" @click="handleReset">重置</el-button>
              </el-form-item>


          </el-row>
        </el-form>
      </div>

      <el-card shadow="never">

        <div class="box">

          <vxe-grid
            ref="xTable2"
            keep-source
            highlight-hover-row
            highlight-current-row
            border
            show-header-overflow
            sync-resize
            auto-resize
            class="vxe-table-element"
            :max-height="600"
            :loading="tableData.loading"
            :data="tableData.columnsDataList"
            :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
            :pager-config="tableData.page"
            :toolbar="tableToolbar"
            :columns="tableData.tableColumns"
            @page-change="handlePageChange"
            @checkbox-all="({ selection }) => { selections = selection }"
            @checkbox-change="({ selection }) => { selections = selection }"
            @current-change="currentChangeEvent"
          >
          </vxe-grid>
        </div>
      </el-card>

      <div style="padding: 10px 0px 10px 0px;">
        <el-form ref="form" label-width="100px">
          <el-row>
            <table class="table" id="invCodeTable" style="width: 100%;">
              <tr class="bg-gray">
                <td style="width:75px;"><div style="width:70px;">特殊事件：</div></td>
                <td>
                  <div style="min-width:110px">{{selectRow.spEvent}}</div>
                </td>
                <td style="width: 50px;">车牌：</td>
                <td v-if="selectRow.spEvent=='纸券确认'||selectRow.spEvent=='修改操作确认' " style="min-width:100px">
                  <el-input
                    style="width: 50%"
                    type="text"
                    v-model="reqData.vehiclePlate">
                  </el-input>
                </td>
                <td v-else style="min-width:100px"><div>{{selectRow.vehiclePlate}}</div></td>
                <td style="width: 100px;">出入口类型：</td>
                <td><div style="min-width:100px">{{selectRow.entryExitTypeText}}</div></td>
                <td>
                  <el-checkbox-group v-model="checkSyn"  >
                      <el-checkbox :key="1" :label="1" @change="checked=>handleCheckSynChange(checked, 1)"> 同步更新</el-checkbox>
                  </el-checkbox-group>
                </td>
              </tr>
              <tr class="bg-gray">
                <td><div style="width:70px;">备注：</div></td>
                <td colspan="6">
                  <el-select :clearable="false" v-model="queryParams.dailyMark" style="width:100%" @change="dailyMarkChange">
                    <el-option
                      v-for="item in dailyMarks"
                      :key="item.content"
                      :label="item.content"
                      :value="item.content">
                    </el-option>
                  </el-select>
                </td>
                <td style="width: 120px"><a  style="text-decoration-line: underline;color: #1890FF;" @click="dailyMark()"   v-permission="['spMonitorRecord:dailyMarkUpdate']"  >点击维护常用备注</a></td>
              </tr>
              <tr class="bg-gray">
                <td></td>
                <td colspan="6">

                  <el-input
                    style="width:100%"
                    type="textarea"
                    :rows="2"
                    maxlength="2000"
                    v-model="reqData.mark">
                  </el-input>
                </td>
              </tr>
            </table>
          </el-row>
          <el-row style="text-align: center;margin-top: 10px;">
            <el-button type="primary" :loading="saveLoading" @click="save()">保存</el-button>
            <el-button @click="close()">取消</el-button>
          </el-row>
        </el-form>
      </div>
      <dailyMark ref="dailyMarkDialog" @refreshData="getDailyMark"/>
    </div>

  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import {spfindPage, registerMark, synUpdate} from './laneMonitorApi';
  import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
  import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
  import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi";
  import dailyMarkApi from "./dailyMarkApi";
  import dailyMark from "./dailyMark";

  export default {
    name: 'spMonitorRecordView',
    components: {TiSelect,TiSysLane, tiSysOrg, dailyMark},
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        spShow: false,
        initFlag: false,
        saveLoading: false,
        dailyMarks: [],
        index: '',
        zIndex: 2000,
        queryParams: {
          sysOrgIdStr: '',
          vehiclePlate: '',
          entryExitType: '',
          laneNo: '',
          opType: 'register',
          status:  0
        },
        appForm: {
          stationId: ''
        },
        pRow:{},
        checkSyn: [],
        selectRow: {},
        reqData:{
          mark:'',
          vehiclePlate:''
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { title: '车种', field: 'vehClassText', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '车牌', field: 'vehiclePlate', minWidth: 60, showOverflow: true, align: 'center'  },
            { title: '入口站', field: 'enStationName', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '出口站', field: 'exStationName', minWidth: 100, showOverflow: true, align: 'center'  },
            // { title: '收费金额', field: 'feeText', minWidth: 40, showOverflow: true, align: 'center'  },
            { title: '支付方式', field: 'payCardTypeText', minWidth: 40, showOverflow: true, align: 'center'  },
            { title: '收费时间', field: 'transTime', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '特殊事件', field: 'spEvent', minWidth: 180, showOverflow: true, align: 'center'  }
          ],
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 5,
            align: 'right',
            pageSizes: [5, 10, 20],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          }
        },
        tableToolbar: {
          id: 'modules.paramQuery',
          custom: true,
          zoom: true, // 最大化按钮
          slots: {
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
    },
    methods: {
      orgChange(val,org){
        if(org){
          this.appForm.stationId = org.stationId
        }
      },
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.spShow = false;
      },
      close(){
        this.spShow = false;
      },
      handleReset() {
        this.queryParams.vehiclePlate = ''
        this.queryParams.entryExitType = ''
        this.queryParams.sysOrgIdStr = ''
        this.queryParams.laneNo = ''
      },
      getDailyMark(){
        dailyMarkApi.findList({}).then((res) => {
          if(res.code == 200) {
            this.dailyMarks = res.data
          } else {
            this.$notify.error(res.message)
            return
          }
        })
      },
      dailyMarkChange(e) {
        this.reqData.mark =  (this.reqData.mark || '')  + '' + e
      },
      init(row,index, zIndex) {
        this.zIndex = parseInt(zIndex) + 2001
        this.index = index
        this.appForm.stationId = row.stationId
        this.queryParams.dailyMark = ''
        this.getDailyMark()
        this.checkSyn = []
        this.spShow = true;

        // 加载遮挡
        this.tableData.loading = true;
        tiSysOrgApi.findByEntity({stationId:  row.stationId}).then((res) => {
          this.initFlag = true
          this.pRow = row
          this.queryParams.laneNo = row.laneNo;
          this.queryParams.vehiclePlate = ''
          this.queryParams.entryExitType = ''
          this.queryParams.sysOrgIdStr = res.data[0].id
          this.getData();
        });
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      async getData(val) {
        this.selectRow = {}
        // 加载遮挡
        this.tableData.loading = true;
        // 加载数据
        spfindPage(Object.assign({}, {
          size: this.tableData.page.pageSize,
          current: this.tableData.page.currentPage
        }), this.queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false

            this.$nextTick(() => {
              if(this.$refs.xTable2.data.length > 0) {
                this.$refs.xTable2.setCurrentRow(this.$refs.xTable2.data[0]);
                this.selectRow = this.$refs.xTable2.data[0] || {}
              }
            });

          if(val){
              if(this.tableData.page.total <= 0) {
                this.spShow = false
              }
          }


        });
      },
      save(){

          if(this.checkSyn.length > 0 && this.selectRow && this.selectRow.laneNo) {
            if(!this.reqData.mark){
              this.$notify.warning('备注信息不能为空！')
              return;
            }
            var ids = ''
            this.tableData.columnsDataList.forEach((item, index) => {
              if (index === 0) {
                ids = item.id
              } else {
                ids += ',' + item.id
              }
            })
            this.saveLoading = true;
            synUpdate({ids:ids ,vehiclePlate:this.reqData.vehiclePlate ,mark:this.reqData.mark}).then((res) => {
              if (res.code === 200) {
                this.$notify.success(res.message)
              } else {
                this.$notify.error(res.message)
                return
              }
              // 刷新数据
              this.reqData.mark = "";
              this.queryParams.dailyMark = ''
              this.selectRow = {}
              this.saveLoading = false
              this.getData(true);
            }, err => {
              this.saveLoading = false
            })
            return;
          }

          if(this.selectRow == null || (!this.selectRow.id)){
            this.$notify.warning('请点击选择一条记录！')
            return;
          }

          if(!this.reqData.mark){
            this.$notify.warning('备注信息不能为空！')
            return;
          }
          this.saveLoading = true;

          if(this.selectRow.spEvent!='纸券确认'&&this.selectRow.spEvent!='修改操作确认' ){
            this.reqData.vehiclePlate = this.selectRow.vehiclePlate
          }
          registerMark({ids:this.selectRow.id ,vehiclePlate:this.reqData.vehiclePlate ,mark:this.reqData.mark}).then((res) => {
            if (res.code === 200) {
              this.$notify.success(res.message)
            } else {
              this.$notify.error(res.message)
              return
            }
            // 刷新数据
            this.reqData.mark = "";
            this.reqData.vehiclePlate = "";
            this.queryParams.dailyMark = ''
            this.selectRow = {}
            this.saveLoading = false
            this.getData(true);
          }, err => {
            this.saveLoading = false
          })

      },
      currentChangeEvent({row}) {
        this.selectRow = row || {};
      },
      handleCheckSynChange(checked, value) {
        console.log(checked, value, this.checkSyn)
      },
      dailyMark(){
        this.$refs.dailyMarkDialog.init()
      }
    }
  }
</script>

