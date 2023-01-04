<template>
  <div class="app-container">
    <el-form ref="searchForm" :rules="searchRules" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
        </el-form-item>
        <el-form-item label="入口车道号" prop="laneNo">
          <el-input v-model="queryParams.laneNo" type="text" placeholder="入口车道号" maxlength="5"
                    oninput="value=value.replace(/[^\d]/g, '')"/>
        </el-form-item>
        <el-form-item label="入口车道类型" prop="laneTypes">
          <ti-select v-model="queryParams.laneTypes" dict-type="tibms_com_laneType"
                     :multiple="true"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="入口处理时间" label-width="110px" prop="transDateRange">
          <el-form-item prop="beginDate" v-show="false"/>
          <el-form-item prop="endDate" v-show="false"/>
          <ti-date-range date-style="width:490px" ref="dateRang" date-type="datetimerange"
                         format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                         date-rule="singleMonth" v-model="queryParams.transDateRange" begin-key="beginDate"
                          end-key="endDate"/>
        </el-form-item>
        <el-form-item label="车牌号码" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号码"
                    maxlength="16"/>
        </el-form-item>
        <el-form-item label="通行介质类型" prop="mediaTypes">
          <ti-select v-model="queryParams.mediaTypes" dict-type="tibms_com_mediaType"
                     :multiple="true"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="通行介质编码" prop="mediaNo">
          <el-input style="width: 192px" v-model="queryParams.mediaNo" type="text"
                    placeholder="通行介质编码" maxlength="20"/>
        </el-form-item>
        <el-form-item label="车型" prop="vehicleTypes">
          <ti-select v-model="queryParams.vehicleTypes" dict-type="tibms_com_vehicleType"
                     :multiple="true"/>
        </el-form-item>
        <el-form-item label="车种" prop="vehicleClasses">
          <ti-select v-model="queryParams.vehicleClasses" dict-type="tibms_com_vehicleClass"
                     :multiple="true"/>
        </el-form-item>
        <el-form-item label="复核来源" label-width="100px" prop="recheck">
           <el-select v-model="queryParams.recheck" placeholder="请选择">
            <el-option
              v-for="item in auditRechecks"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </el-row>
        <el-row>
        <el-form-item label="特情类型" prop="specialTypeSelect">
          <ti-select v-model="queryParams.specialTypeSelect"
                     url="/api/v1/common/dict/dictList/tibms_audit_enSpecialType"
                     :props="{key:'vkey',value:'vkey',label:'vname'}"
                     :watch-attr="queryParams.recheck"
                     :watch-attr-fn="watchAttrFn"
                     :multiple="true"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <!--          <el-button type="success"  v-permission="['enListSpecial:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>-->
          <el-button type="default" v-show="!showAuditSearch" @click="expand">展开</el-button>
          <el-button type="default" v-show="showAuditSearch" @click="expand">收起</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <div v-show="showAuditSearch" class="search-form">
          <el-row>
            <el-form-item label="站级稽核状态" prop="auditStatusStation">
              <ti-select v-model="queryParams.auditStatusStation"
                         dict-type="tibms_audit_auditStatus"/>
            </el-form-item>
            <el-form-item label="站级稽核结论" prop="auditResultStation"
             :disabled="queryParams.auditResultStation == '0'">
              <ti-select v-model="queryParams.auditResultStation"
                         dict-type="tibms_audit_auditResult"/>
            </el-form-item>
            <el-form-item label="车牌状态" prop="plateStatus" >
              <el-checkbox-group v-model="queryParams.plateStatus" @change="bindCheckBox">
                <el-checkbox label="plate1">识别车牌与稽核车牌不一致</el-checkbox>
                <el-checkbox label="plate2">识别车牌与OBU车牌不一致</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="路段稽核状态" prop="auditStatusRoad">
              <ti-select v-model="queryParams.auditStatusRoad" dict-type="tibms_audit_auditStatus"/>
            </el-form-item>
            <el-form-item label="路段稽核结论" prop="auditResultRoad">
              <ti-select v-model="queryParams.auditResultRoad" dict-type="tibms_audit_auditResult"/>
            </el-form-item>
            <el-form-item label="结论状态" prop="auditResultStatus">
              <el-checkbox v-model="queryParams.auditResultStatus">站级稽核结论与路段不一致</el-checkbox>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="入口处理编号" prop="serialNo">
              <el-input v-model="queryParams.serialNo" type="text" placeholder="入口处理编号"
                        maxlength="38"/>
            </el-form-item>
            <el-form-item label="通行标识ID" prop="passId">
              <el-input v-model="queryParams.passId" type="text" placeholder="通行标识ID"
                        maxlength="38"/>
            </el-form-item>
            <el-form-item label="入口收费员" prop="operator">
              <el-input v-model="queryParams.enOperatorId" type="text" placeholder="入口收费员ID"
                        maxlength="21"/>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="稽核时间">
              <el-form-item prop="beginAuditDate" v-show="false"/>
              <el-form-item prop="endAuditDate" v-show="false"/>
              <ti-date-range date-type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                             value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams"
                             begin-key="beginAuditDate"
                             end-key="endAuditDate"/>
            </el-form-item>
          </el-row>
        </div>
      </el-row>
    </el-form>

    <vxe-grid
      ref="table"
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
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @cell-dblclick="currentChangeEvent"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
      >

      <template v-slot:toolbar_buttons>
        <el-button v-permission="['enListSpecial:exportExcel']" @click="exportExcel.dialog = true">
          导出
        </el-button>
      </template>

    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>

   <el-drawer
      :visible.sync="isShowAudit"
      :with-header="false"
      :show-close="true"
      direction="rtl"
      size="82%">
      <ti-audit-panel ref="audit" :is-en-list="true" :log-columns="logColumns" style="margin-top: 10px;">
        <template slot="operation">
          <el-button size="mini" :loading = "lastLoading" type="primary" icon="el-icon-arrow-left" @click="lastOne()">上一条</el-button>
          <el-button size="mini" :loading = "nextLoading" type="primary" icon="el-icon-arrow-right" @click="nextOne()">下一条</el-button>
        </template>
      </ti-audit-panel>
    </el-drawer>
  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {auditEn, findPageEn} from "@/views/pro/audit/special/enListSpecial/enListSpecialApi";
  import tiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
  import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import SpecialAuditLog from "@/views/pro/audit/special/comm/specialAuditLog"
  import moment from "moment";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";
  import {getImgBase64, getSxImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
  import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";
  import TiAuditPanel from "@/views/pro/common/tiAuditPanel/tiAuditPanel"

  export default {
    name: 'audit.special.enListSpecial.enListSpecialView',
    mixins: [...mixin],
    components: {SpecialAuditLog, TiDateRange, TiSelectTree, TiSelect, TiExportExcel, TiEvidence, tiSysOrg,TiAuditPanel},
    data() {
      return {
        imageUrl: '',
        isShowAudit: false,
        auditRechecks:[
          {
            value: '1',
            label: '部中心推荐复核特情'
          },
          {
            value: '',
            label: '全部特情'
          },
        ],
        queryParams: {
          transDateRange: {
            beginDate: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
            endDate: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
          },
          beginDate: '',
          endDate: '',
          vehiclePlate: '',
          vehicleTypes: '',
          vehicleClasses: '',
          roadNo: '',
          laneNo: '',
          laneTypes: '',
          mediaTypes: '',
          mediaNo: '',
          recheck: '1',
          specialTypes: '',
          specialTypeSelect: '',
          sysOrgIdStr: '',
          sysOrg: {},
          auditStatusStation: '',
          auditResultStation: '',
          serialNo: '',
          plateStatus: [],
          plate1: false,
          plate2: false,
          auditStatusRoad: '',
          auditResultRoad: '',
          auditResultStatus: false,
          passId: '',
          beginAuditDate: '',
          endAuditDate: ''
        },
        searchRules: {
          transDateRange: [
            {
              type: 'array',
              required: true,
              message: '交易时间不能为空',
              fields: {
                beginDate: {type: 'string', required: true, message: '交易时间不能为空'},
                endDate: {type: 'string', required: true, message: '交易时间不能为空'}
              }
            }]
        },
        stationRules: {
          auditStatusStation: {required: true, message: '稽核结论不能为空', trigger: 'change'},
          auditVehiclePlateStation: {required: true, message: '稽核车牌不能为空', trigger: 'change'},
          auditVehicleTypeStation: {required: true, message: '稽核车型不能为空', trigger: 'change'},
          auditVehicleClassStation: {required: true, message: '稽核车种不能为空', trigger: 'change'},
        },
        roadRules: {
          auditStatusRoad: {required: true, message: '稽核结论不能为空', trigger: 'change'},
          auditVehiclePlateRoad: {required: true, message: '稽核车牌不能为空', trigger: 'change'},
          auditVehicleTypeRoad: {required: true, message: '稽核车型不能为空', trigger: 'change'},
          auditVehicleClassRoad: {required: true, message: '稽核车种不能为空', trigger: 'change'}
        },
        exportExcel: {
          url: 'api/v1/audit/list/enListSpecial/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        showAuditSearch: false,
        detailShow: false,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.special.enListSpecial.enListSpecial-toolbar',
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
        activeName: 'auditDetail',
        detailData: {
          id: ''
        },
        selectRowIndex: 0,
        selectRow: {},
        roadDisabled: true,
        stationDisabled: true,
        roadAudit: {
          auditStatusRoad: '',
          auditVehiclePlateRoad: '',
          auditVehicleTypeRoad: '',
          auditVehicleClassRoad: '',
          auditAxleCountRoad: '',
          auditDescriptionRoad: '',
          auditVehiclePlateColor: '',
          id: '',
          enTime: '',
          userNodeLevel: '',
          userOrgName: '',
          evidenceIdRoad: '',
          evidenceId: '',
          evidenceFileName: '',
          evidencePath: ''
        },
        stationAudit: {
          auditStatusStation: '',
          auditVehiclePlateStation: '',
          auditVehicleTypeStation: '',
          auditVehicleClassStation: '',
          auditAxleCountStation: '',
          auditDescriptionStation: '',
          auditVehiclePlateColor: '',
          id: '',
          enTime: '',
          userNodeLevel: '',
          userOrgName: '',
          evidenceIdStation: '',
          evidenceId: '',
          evidenceFileName: '',
          evidencePath: ''
        },
        roadAuditTmp: {},
        stationAuditTmp: {},
        evidenceParams: {},
        userOrgName: '',
        userNodeLevel: '',
        initSpecial:[],
        logColumns: [
          {
            field: "auditAuthStr",
            title: "稽核权限",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "auditTime",
            title: "稽核时间",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "auditUserRealName",
            title: "稽核人员",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "auditVehiclePlate",
            title: "稽核车牌",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "auditVehicleTypeStr",
            title: "稽核车型",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "auditVehicleClassStr",
            title: "稽核车种",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "auditAxleCount",
            title: "稽核轴数",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "auditStatusStr",
            title: "稽核结论",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "auditDescription",
            title: "稽核说明",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "evidenceName",
            title: "证据文件",
            minWidth: 150,
            fixed: 'right',
            align: 'center',
            slots: {default: 'operation'}
          }
        ],
        columns: [
          {
            title: "序号",
            type: "seq",
            minWidth: 50,
            align: "center"
          },
          {
            field: "id",
            title: "入口处理编号",
            hide: true,
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "passId",
            title: "通行标识ID",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "specialType",
            title: "特情类型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "enVehiclePlateStr",
            title: "车牌号码",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "vehicleTypeStr",
            title: "车型",
            minWidth: 110,
            showOverflow: true
          },
          {
            field: "vehicleClassStr",
            title: "车种",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "enTime",
            title: "入口时间",
            minWidth: 160,
            showOverflow: true
          },
          {
            field: "enStationName",
            title: "入口收费站",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "enTollLaneNo",
            title: "入口车道号",
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "laneTypeStr",
            title: "入口车道类型",
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "mediaTypeStr",
            title: "通行介质类型",
            minWidth: 120,
            showOverflow: true
          },
          {
            field: "mediaNo",
            title: "通行介质编码",
            minWidth: 160,
            showOverflow: true
          },
          {
            field: "auditTimeStation",
            title: "站级稽核时间",
            minWidth: 160,
            showOverflow: true
          },
          {
            field: "auditUserRealNameStation",
            title: "站级稽核人员",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "auditStatusStationStr",
            title: "站级稽核结论",
            minWidth: 150,
            showOverflow: true,
            slots: {
              default: ({row}, h) => {
                if (row.auditStatusStationStr == null || row.auditStatusStationStr == '') {
                  return [h('span', {style: {color: 'white', background: 'red'}}, '未稽核')]
                } else {
                  return row.auditStatusStationStr;
                }
              }
            }
          },
          {
            field: "auditTimeRoad",
            title: "路段稽核时间",
            minWidth: 160,
            showOverflow: true
          },
          {
            field: "auditUserRealNameRoad",
            title: "路段稽核人员",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "auditStatusRoadStr",
            title: "路段稽核结论",
            minWidth: 150,
            showOverflow: true,
            slots: {
              default: ({row}, h) => {
                if (row.auditStatusRoadStr == null || row.auditStatusRoadStr == '') {
                  return [h('span', {style: {color: 'white', background: 'red'}}, '未稽核')]
                } else {
                  return row.auditStatusRoadStr;
                }
              }
            }
          }
        ]

      }
    },
    created() {

    },
    watch: {
    'queryParams.auditStatusStation':{
      handler(v) {
          if (v && v.auditResultStation == '0') {
            this.queryParams.auditStatusStation = ''
          }
        },
        immediate: true
      },
    },
    mounted() {
      //获取用户level
      this.getUserLevel();
      this.roadAuditTmp = this.roadAudit;
      this.stationAuditTmp = this.stationAudit;
    },
    methods: {
      async getUserLevel() {
        let {data} = await tiUserApi.getUserNodeLevel();
        if(!data) {
          data = {}
        }
        if (data.fullName === '超级管理员') {
          data.nodeLevel = 2;
        }
        this.userNodeLevel = data.nodeLevel;
        this.userOrgName = data.fullName;

        if (this.userNodeLevel != null) {

          if (Number(this.userNodeLevel) <= 2) {
            this.roadDisabled = false;
          } else {
            this.stationDisabled = false;
          }
        }
      },
      submit() {
        Object.assign(this.$data.page, this.$options.data().page)
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            this.queryParams.beginDate = this.queryParams.transDateRange.beginDate;
            this.queryParams.endDate = this.queryParams.transDateRange.endDate;
            this.getData();
          } else {
            return false;
          }
        });
      },
      async getData() {
        this.loading = true;
        let plateStatus = this.queryParams.plateStatus;
        this.queryParams.plate1 = false;
        this.queryParams.plate2 = false;
        if (plateStatus.length > 0) {
          for(let i = 0; i < plateStatus.length; i++) {
            if (plateStatus[i] == "plate1") {
              this.queryParams.plate1 = true;
            } else if (plateStatus[i] == "plate2") {
              this.queryParams.plate2 = true;
            }
          }
        }

        // if (this.queryParams.specialTypeSelect) {
        //   this.queryParams.specialTypes = this.queryParams.specialTypeSelect;
        // }else{
        //   this.queryParams.specialTypes = this.initSpecial;
        // }
        this.queryParams.specialTypes = this.queryParams.specialTypeSelect;
        this.queryParams.roadSpecialTypes = this.queryParams.roadSpecialTypeSelect;
        console.log("this.queryParams:", this.queryParams);
        const {data} = await findPageEn(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          this.queryParams)
        this.tableData = data.records
        this.page.total = data.total

        //默认第一行高亮
        if (this.tableData.length > 0) {
          this.detailShow = true;
          this.activeName = 'auditDetail',
            this.$nextTick(() => {
              this.$refs.table.setCurrentRow(this.$refs.table[0]);
              this.detailData = this.$refs.table[0];
              // this.getImg(this.detailData);
              // this.copyValue(this.detailData);
            })
        }
        this.loading = false

        //保存导出的查询条件
        this.exportExcel.queryParams = this.queryParams;

      },
      async getImg(detail) {
        let proId = dictUtils.getDictLabel('tibms_config', 'local_province', '44');
        if (proId == 14) {
          this.imageUrl = 'data:image/jpg;base64,' + (await getSxImgBase64(
              {roadId: detail.enSectionId, stationId: detail.enStationId}
              , {picId: detail.id, picTime: detail.enTime ? detail.enTime.replace(' ', 'T') : null, vehiclePlate: null, gantryId: null, imgType: "1"})
          ).data;
        } else {
          this.imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(detail.enSectionId, detail.enStationId, detail.id + '_' + ImgConstant.gdImgFix.frontPic)).data;
        }
      },
      bindCheckBox(){
        if(this.queryParams.plateStatus.length > 1){
            this.queryParams.plateStatus.splice(0,1)
        }
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      currentChangeEvent({row}) {
        this.selectRowIndex = this.$refs.table.getRowIndex(row);
        this.detailData = this.$refs.table.getCurrentRecord();
        // this.getImg(this.detailData);
        // this.copyValue(this.detailData);
        this.showAudit();
        this.activeName = 'auditDetail';
      },
      nextOne(){
        if(this.tableData.length==0){
          this.$message.warning("没有数据!");
          return;
        }
        if (this.selectRowIndex === this.tableData.length - 1) {
          this.$message.warning("已经是最后条数据了!");
          return;
        }
        this.nextLoading = true
        this.selectRowIndex = this.selectRowIndex + 1
        this.showAudit()
        this.nextLoading = false
      },
      lastOne(){
        if(this.tableData.length==0){
          this.$message.warning("没有数据!");
          return;
        }
        if (this.selectRowIndex === 0) {
          this.$message.warning("已经是第一条数据!");
          return;
        }
        this.lastLoading = true
        this.selectRowIndex = this.selectRowIndex - 1
        this.showAudit()
        this.lastLoading = false
      },
      showAudit(){
        this.isShowAudit = true
        const row =  this.tableData[this.selectRowIndex]
        this.$refs.table.setCurrentRow(row)
        this.$nextTick(()=>{
          this.$refs.audit.init(row)
        })
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.defaultValue;
        // Object.assign(this.$data.page, this.$options.data().page)
        // this.getData()
      },
      // change(param1, param2) {
      //   this.queryParams.sysOrg = param2;
      // },
      expand() {
        this.showAuditSearch = !this.showAuditSearch;
      },
      addEvidence(v) {
        if (v == 'road') {
          this.$refs.evidenceRoad.dialogVisible = true;
        } else if (v == 'station') {
          this.$refs.evidenceStation.dialogVisible = true;
        }
      },
      async audit(params) {
        const {data} = await audit(params);
        this.$nextTick(() => {
          let auditData = {};
          if (data[0]) {
            this.$message({
              message: '稽核成功!',
              type: 'success'
            });
            auditData = data[0];
            this.$refs.table.reloadRow(this.detailData, auditData);
            this.selectRowIndex = this.selectRowIndex + 1;
            this.detailData = this.$refs.table[this.selectRowIndex];
            // this.getImg(this.detailData);
            // this.copyValue(this.detailData);

          } else {
            this.$message.error('稽核失败!');
          }
        });
      },
      stationAuditSubmit(data) {
          this.$refs.stationAuditForm.validate((valid) => {
          if (valid) {
            this.stationAudit.auditVehiclePlateColor = this.detailData.enVehiclePlateColor;
            this.stationAudit.exTime = this.detailData.exTime;
            this.stationAudit.id = this.detailData.id;

            this.stationAudit.userNodeLevel = this.userNodeLevel;
            this.stationAudit.userOrgName = this.userOrgName;

            this.stationAudit.auditFeeStation = this.stationAudit.auditFeeStationStr * 100;
            this.stationAudit.auditArrearageStation = this.stationAudit.auditArrearageStationStr
              * 100;
            //证据id

            //稽核
            let data = this.audit(this.stationAudit);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      roadAuditSubmit() {
        this.$refs.roadAuditForm.validate((valid) => {
          if (valid) {
            this.roadAudit.auditVehiclePlateColor = this.detailData.enVehiclePlateColor;
            this.roadAudit.enTime = this.detailData.enTime;
            this.roadAudit.id = this.detailData.id;
            this.roadAudit.userNodeLevel = this.userNodeLevel;
            this.roadAudit.userOrgName = this.userOrgName;
            console.log("roadAudit:", this.roadAudit);
            //证据id

            //稽核
            let data = this.audit(this.roadAudit);

          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },
      watchAttrFn(newVal, oldVal, selectData) {
        let selectDataShow = [];
        let specalTypes = [];
        //改变下拉列表
        if (newVal) {
          selectData.forEach(x => {
            if ((',' + newVal + ',').indexOf(',' + x.extra + ',') > -1) {
              selectDataShow.push(x)
              specalTypes.push(x.vkey);
            }
          });
        } else {
          selectDataShow = selectData;
          selectData.forEach(x => {
            specalTypes.push(x.vkey);
          });
        }
        this.queryParams.specialTypes = specalTypes.join(',');
        this.initSpecial = specalTypes.join(',');
        return selectDataShow;
      },
      onRadioChange(e) {
      // 当点击已经选中的把 activeModel 置空，就是取消选中，并返回
        if (this.activeModel === e) {
          this.activeModel = ''
          return
        }
      // 不是选中，选中当前点击 Radio
        this.activeModel = e
      // 选中操作
      },
      copyValue(value) {
        this.roadAudit = this.roadAuditTmp;
        this.stationAudit = this.stationAuditTmp;
        this.evidenceParams.serialNo = value.id;
        // this.evidenceParams.transTime = value.enTime;
        if (value.auditStatusRoad && value.auditStatusRoad > 0) {
          this.roadAudit = value;
          this.roadAudit.auditVehicleTypeRoad = value.auditVehicleTypeRoad.toString();
          this.roadAudit.auditVehicleClassRoad = value.auditVehicleClassRoad.toString();
          this.roadAudit.auditStatusRoad = value.auditStatusRoad.toString();
        } else {
          this.roadAudit.auditStatusRoad = '1';
          this.roadAudit.auditVehiclePlateRoad = value.enVehiclePlate;
          this.roadAudit.auditVehicleTypeRoad = value.enVehicleType.toString();
          this.roadAudit.auditVehicleClassRoad = value.enVehicleClass.toString();
          this.roadAudit.auditAxleCountRoad = value.enAxleCount;
          this.roadAudit.auditDescriptionRoad = '';
        }

        if (value.auditStatusStation && value.auditStatusStation > 0) {
          this.stationAudit = value;
          this.stationAudit.auditVehicleTypeStation = value.auditVehicleTypeStation.toString();
          this.stationAudit.auditVehicleClassStation = value.auditVehicleClassStation.toString();
          this.stationAudit.auditStatusStation = value.auditStatusStation.toString();
        } else {
          this.stationAudit.auditStatusStation = '1';
          this.stationAudit.auditVehiclePlateStation = value.enVehiclePlate;
          this.stationAudit.auditVehicleTypeStation = value.enVehicleType.toString();
          this.stationAudit.auditVehicleClassStation = value.enVehicleClass.toString();
          this.stationAudit.auditAxleCountStation = value.enAxleCount;
          this.stationAudit.auditDescriptionStation = '';
        }

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
