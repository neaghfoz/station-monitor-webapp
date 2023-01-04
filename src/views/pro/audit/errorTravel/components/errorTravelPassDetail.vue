<template>
  <div class="app-container">
    <!-- 搜索条件 -->


        <div style="margin-top:20px; ">
                <ti-road-net ref="roadNet" :path-info-list="pathList" :image-show="true" :check-show="false">

                </ti-road-net>
        </div>

    <!-- 数据表格 -->
    <vxe-grid ref="appTable"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              keep-source
              highlight-current-row
              max-height="450px"
              class="vxe-table-element"
              :export-config="{}"
              :loading="table.loading"
              :columns="table.columns"
              :data="table.datas"
              :start-index="(table.page.currentPage - 1) * table.page.pageSize"
              :pager-config="table.page"

              @page-change="handlePageChange">
      >
    </vxe-grid>

    <br/>
    <el-form class="event_form" ref="ruleForm" size="mini" :model="ruleForm" :rules="rules" inline :show-message="false" label-position="right" :label-width="'120px'">

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="clearfix">
            <span style="font-size: 18px">路段稽核</span>
            <el-button type="primary" style="float:right" @click="exportFile">导出证据文件</el-button>
            <el-button type="primary" style="float:right;margin-right: 10px" @click="submit" v-prevent-re-click>提交</el-button>
          </div>
        </div>

        <el-row :gutter="10">

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="稽核结论" prop="auditResult">
              <ti-select v-model="ruleForm.auditResult" dict-type="tibms_audit_auditErrorTravelResult"
                         :multiple="false" :placeholder="'请选择稽核结论'" pstyle="100%" size="large" @change="auditResultChange"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="实际车牌" prop="auditVehiclePlate">
              <el-input clearable v-model="ruleForm.auditVehiclePlate" type="text" maxlength="10" show-word-limit size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="实际车型" prop="auditVehicleType">
              <ti-select v-model="ruleForm.auditVehicleType" dict-type="tibms_com_vehicleType" :multiple="false" pstyle="100%" size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="实际车种" prop="auditVehicleClass">
              <ti-select v-model="ruleForm.auditVehicleClass" dict-type="tibms_com_vehicleClass" :multiple="false" pstyle="100%" size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="实际轴数" prop="auditAxleCount">
              <el-input-number clearable v-model="ruleForm.auditAxleCount" controls-position="right" controls="false" style="width: 100%" :min="0" :max="255" size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="责任主体" prop="auditResponser" :required="auditResultErrorSel">
              <ti-select v-model="ruleForm.auditResponser" dict-type="tibms_audit_errorTravelResponser" :disabled="!auditResultErrorSel" :multiple="false" pstyle="100%"
                         size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="证据是否充足" prop="auditEvidenceExists" :required="auditResultErrorSel">
              <ti-select v-model="ruleForm.auditEvidenceExists" dict-type="tibms_audit_errorTravelEvidenceExists" :disabled="!auditResultErrorSel" :multiple="false" pstyle="100%"
                         size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="是否欠费" prop="auditIsArrearage" :required="auditResultErrorSel">
              <ti-select v-model="ruleForm.auditIsArrearage" dict-type="tibms_audit_errorTravelIsArrearage" :multiple="false" pstyle="100%"
                         @change="auditIsArrearageChange" size="large" :disabled="!auditResultErrorSel"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="确认逃费行为" prop="auditEnsureEscapeType" :required="auditArrearageSel">
              <ti-select v-model="ruleForm.auditEnsureEscapeType" dict-type="tibms_audit_errorTravelEnsureEsacpeType" :multiple="false" pstyle="100%"
                         size="large" :disabled="!auditArrearageSel"/>
            </el-form-item>
          </el-col>



          <el-col :span="8">
            <el-form-item class="event_input_panel" label="实际费用(元)" prop="auditFeeText" :required="auditArrearageSel">
              <el-input-number clearable style="width:100%" v-model="ruleForm.auditFeeText" precision="2" controls-position="right" :disabled="!auditArrearageSel" :min="0"
                               :max="9999999.99" size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="欠费金额(元)" prop="auditArrearageText" :required="auditArrearageSel">
              <el-input-number clearable style="width:100%" v-model="ruleForm.auditArrearageText" precision="2" controls-position="right" :disabled="!auditArrearageSel" :min="0"
                               :max="9999999.99" size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item class="event_input_panel" label="欠费金额类型" prop="auditArrearageType" :required="auditArrearageSel">
              <ti-select v-model="ruleForm.auditArrearageType" dict-type="tibms_audit_errorTravelArrearageType" :disabled="!auditArrearageSel" :multiple="false" pstyle="100%"
                         size="large"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item class="event_input_panel auditDesc" label="稽核说明" prop="auditDesc">
              <el-input type="textarea" v-model="ruleForm.auditDesc" style="width: 100%" maxlength="250" :rows="2" show-word-limit size="large"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="证据文件" prop="auditEvidenceId">
              <el-button type="warning" @click="addEvidence()"> +</el-button>
              <ti-evidence ref="evidenceFile" :params="evidenceParams" :upload-flag="true" @evidenceFileInfo="evidenceFileInfo"></ti-evidence>
            </el-form-item>
          </el-col>

        </el-row>

      </el-card>


      <!--      <el-tabs v-model="activeName">
              <el-tab-pane label="稽核操作" style="margin-bottom: 50px">
                <div class="el-card__header" style="background-color: #f2f2f2; margin-bottom: 50px">
                  <div class="clearfix">
                    <span style="font-size: 15px">路段稽核</span>
                    <el-button type="primary" style="float:right" @click="exportFile">导出证据文件</el-button>
                    <el-button type="primary" style="float:right;margin-right: 10px" @click="submit">提交</el-button>
                  </div>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                  <el-col>
                    <el-col :span="6">
                      <el-form-item label="稽核结论" prop="auditResult">
                        <ti-select v-model="ruleForm.auditResult" dict-type="tibms_audit_auditErrorTravelResult" :multiple="false" :placeholder="'请选择稽核结论'"/>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col>
                    <el-col :span="6">
                      <el-form-item label="实际车牌" prop="auditVehiclePlate">
                        <el-input v-model="ruleForm.auditVehiclePlate"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="实际车型" prop="auditVehicleType">
                        <ti-select v-model="ruleForm.auditVehicleType" dict-type="tibms_com_vehicleType" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="实际车种" prop="auditVehicleClass">
                        <ti-select v-model="ruleForm.auditVehicleClass" dict-type="tibms_com_vehicleClass" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="实际轴数" prop="auditAxleCount">
                        <el-input v-model="ruleForm.auditAxleCount"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col>
                    <el-col :span="6">
                      <el-form-item label="责任主体" prop="auditResponser" :required="auditResultErrorSel">
                        <ti-select v-model="ruleForm.auditResponser" dict-type="tibms_audit_errorTravelResponser"
                                   :watch-attr-fn="watchAttrAuditResult" :watch-attr="ruleForm.auditResult" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="证据是否充足" prop="auditEvidenceExists" :required="auditResultErrorSel">
                        <ti-select v-model="ruleForm.auditEvidenceExists" dict-type="tibms_audit_errorTravelEvidenceExists" data-filter="auditStatusFilter" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="确认逃费行为" prop="auditEnsureEscapeType" :required="auditArrearageSel">
                        <ti-select v-model="ruleForm.auditEnsureEscapeType" dict-type="tibms_audit_errorTravelEnsureEsacpeType" data-filter="auditStatusFilter" :multiple="true"
                                   :watch-attr-fn="watchAttrAuditArrearage" :watch-attr="ruleForm.auditIsArrearage"/>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col>
                    <el-col :span="6">
                      <el-form-item label="是否欠费" prop="auditIsArrearage" :required="auditResultErrorSel">
                        <ti-select v-model="ruleForm.auditIsArrearage" dict-type="tibms_audit_errorTravelIsArrearage" data-filter="auditStatusFilter" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="实际费用(元)" prop="auditFeeText" :required="auditArrearageSel">
                        <el-input v-model="ruleForm.auditFeeText" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="欠费金额(元)" prop="auditArrearageText" :required="auditArrearageSel">
                        <el-input v-model="ruleForm.auditArrearageText" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="欠费金额类型" prop="auditArrearageType" :required="auditArrearageSel">
                        <ti-select v-model="ruleForm.auditArrearageType" dict-type="tibms_audit_errorTravelArrearageType" data-filter="auditStatusFilter" :multiple="false"/>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col>
                    <el-col :span="24">

                      <el-form-item label="证据文件" prop="auditEvidenceId" :required="auditArrearageSel" v-model="ruleForm.auditEvidenceId">

                        <el-button type="warning"
                                   @click="addEvidence()"> +
                        </el-button>
                        <ti-evidence ref="evidenceFile" :params="evidenceParams"
                                     :upload-flag="true"
                                     @evidenceFileInfo="evidenceFileInfo"></ti-evidence>
                      </el-form-item>
                    </el-col>


                  </el-col>

                  <el-col>
                    <el-col :span="24">
                      <el-form-item label="稽核说明" prop="auditDesc">
                        <el-input type="textarea" v-model="ruleForm.auditDesc" style="width: 100%"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>

                </el-form>

              </el-tab-pane>

            </el-tabs>-->
    </el-form>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
import moment from "moment"
// import { exportExcel } from "@/views/pro/common/util/dataUtil"
import TiRoadNet from "@/views/pro/audit/comm/tiRoadNet/tiRoadNet";
import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"

import {audit, getLastLog} from "../errorTravel"
import {count} from "@/views/pro/audit/comm/evidence/tiEvidenceApi";
import {download} from "ecip-web/utils"
import request from "@ecip/ecip-web/src/utils/request";
import {Message} from "element-ui";

export default {
  name: 'audit.errorTravel.errorTravelPassDetail',
  mixins: [...mixin],
  components: {TiSelect, TiDateRange, TiRoadNet, TiEvidence},
  data() {
    return {
      rules: {
        /*auditFeeText : [
          { required: true, message: '请输入实际费用', trigger: 'blur' },
        ]*/
        // auditEvidenceExists: [
        //   {  required:this.auditResultErrorSel, message: "哈哈哈", trigger: 'blur' },
        // ]
      },
      evidenceParams: {
        serialNo: '',
      },
      auditResultErrorSel: false,
      auditArrearageSel: false,
      ruleForm: {
        serialNo: '',
        vehiclePlate: '',
        vehiclePlateColor: '',
        escapeType: '',
        passId: '',
        auditStatus: '',
        auditVehiclePlate: '',
        auditVehicleType: '',
        auditVehicleClass: '',
        auditAxleCount: '2',
        auditResponser: '',
        auditEvidenceExists: '',
        auditEnsureEscapeType: '',
        auditIsArrearage: 2,
        auditFee: 0,
        auditFeeText: '0',
        auditArrearage: 0,
        auditArrearageText: '0',
        auditArrearageType: '',
        auditEvidenceId: '',
        auditDesc: '',
        evidenceIdRoad: '',
        evidenceFileName: '',
        evidencePath: '',
      },
      listType: '',
      tableToolbar: {
        buttons: [
          {code: 'excelExport', icon: 'fa fa-download'}
        ]
      },
      activeName: '',
      pathList: [],
      selectRowIndex: 0,
      appForm: {
        startTime: null,
        endTime: null,
        mediaType: null,
        vehiclePlate: null,
        obuId: null,
        cardId: null,
        passId: null,
        dataRange: {
          startDay: moment().add(-10, 'day').format('YYYY-MM-DD'),
          endDay: moment().format('YYYY-MM-DD')
        }
      },

      // 表格配置
      table: {
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
          {field: "serialNo", title: "计费交易编号", minWidth: 120, showOverflow: true},
          {field: "passId", title: "PASSID", minWidth: 120, showOverflow: true},
          {field: "serialTypeText", title: "流水类型", minWidth: 80, showOverflow: true},
          {field: "tradeResultText", title: "交易状态", minWidth: 80, showOverflow: true},
          {field: "transTime", title: "交易时间", minWidth: 120, showOverflow: true},
          {field: "name", title: "站名称", minWidth: 120, showOverflow: true},
          {field: "vehiclePlateText", title: "车牌", minWidth: 80, showOverflow: true},
          {field: "payFeeTxt", title: "交易金额", minWidth: 50, showOverflow: true},
          {field: "feeTxt", title: "实收金额", minWidth: 50, showOverflow: true},
          {field: "discountFeeTxt", title: "优惠金额", minWidth: 50, showOverflow: true},
          {field: "vehicleTypeText", title: "计费车型", minWidth: 80, showOverflow: true},
          {field: "vehicleClassText", title: "车种", minWidth: 80, showOverflow: true},
          {field: "axleCount", title: "轴数", minWidth: 50, showOverflow: true},
          {field: "mediaTypeText", title: "通行介质", minWidth: 50, showOverflow: true},
          /*{field: "mediaNo", title: "介质编码", minWidth: 120, showOverflow: true},*/
          {field: "cardId", title: "通行卡号", minWidth: 80, showOverflow: true},
          {field: "obuId", title: "obu编码", minWidth: 80, showOverflow: true},
          {field: "specialTypeText", title: "特情类型", minWidth: 120, showOverflow: true}
        ]
      }
    }
  },
  mounted() {
    //this.submit()
  },
  activated() {
    this.detail(this.$route.query.row);
  },
  watch: {
    'ruleForm.auditFeeText': {
      handler(v) {
        if (v) {
          this.ruleForm.auditFee = v * 100;
        }
      },
      immediate: true
    },
    'ruleForm.auditArrearageText': {
      handler(v) {
        if (v) {
          this.ruleForm.auditArrearage = v * 100;
        }
      },
      immediate: true
    },
    /*'ruleForm.auditResult': {
      handler(v) {
        console.log(v);
        if (v == 2) {
          this.auditResultErrorSel = true;
        } else {
          this.auditResultErrorSel = false;
          this.ruleForm.auditIsArrearage = '2'
          this.ruleForm.auditEvidenceExists = ''
          this.ruleForm.auditResponser = ''
        }
      },
      immediate: true
    },
    'ruleForm.auditIsArrearage': {
      handler(v) {
        console.log(v);
        if (v == 1) {
          this.auditArrearageSel = true;
        } else {
          this.auditArrearageSel = false;
          this.ruleForm.auditEnsureEscapeType = ''
          this.ruleForm.auditFee = 0
          this.ruleForm.auditFeeText = '0'
          this.ruleForm.auditArrearage = 0
          this.ruleForm.auditArrearageText = '0'
          this.ruleForm.auditArrearageType = ''
        }
      },
      immediate: true
    },*/
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        this.check(valid)
      })
    },
    async check(valid) {
      if (valid) {
        if (this.auditArrearageSel) {
          let {data} = await count({serialNo: this.ruleForm.serialNo});
          if (!data) {
            this.$notify.warning('证据文件必填');
            return false;
          }
        }

        this.audit(this.ruleForm);
      } else {
        return false;
      }
    },
    reset() {
      this.$refs['appForm'].resetFields()
    },
    exportEx() {
      exportExcel(this.$refs['appTable'], '行驶路径列表')
    },
    addEvidence() {
      this.$refs.evidenceFile.serialNo = this.ruleForm.serialNo;
      this.$refs.evidenceFile.dialogVisible = true;
    },
    async detail(row) {
      this.pathList = row.passPathInfos;
      //this.reload(row.pathInfos);
      this.table.loading = true;
      let tmpdatas = row.pathInfos;
      let serialNo = row.passId + "_" + row.escapeType;
      this.evidenceParams.serialNo = serialNo;
      this.ruleForm.serialNo = serialNo;
      this.ruleForm.vehiclePlate = row.vehiclePlate;
      this.ruleForm.vehiclePlateColor = row.vehiclePlateColor;
      this.ruleForm.vehiclePlateText = row.vehiclePlateText;
      this.ruleForm.passId = row.passId;
      this.ruleForm.escapeType = row.escapeType;
      this.table.datas = tmpdatas;
      this.table.page.total = tmpdatas.length
      this.table.page.pageSize = tmpdatas.length
      this.table.page.pageSizes = new Array(tmpdatas.length);
      this.table.loading = false;
      await this.getLastLogData(this.ruleForm);
      this.auditResultChange(this.ruleForm.auditResult)
    },
    /*changeAuditIsArrearage() {
      if (this.ruleForm.auditIsArrearage == 0) {
        this.ruleForm.auditEnsureEscapeType = ''
        this.ruleForm.auditFee = 0
        this.ruleForm.auditFeeText = '0'
        this.ruleForm.auditArrearage = 0
        this.ruleForm.auditArrearageText = '0'
        console.log(1,this.ruleForm)
      }
      console.log(2,this.ruleForm)
    },*/
    auditResultChange(val) {
      // 选择异常稽核结论 调整rules
      if (val == 2) {
        this.auditResultErrorSel = true;
      } else {
        this.auditResultErrorSel = false;
        this.ruleForm.auditIsArrearage = '2'
        this.ruleForm.auditEvidenceExists = ''
        this.ruleForm.auditResponser = ''
      }

      this.auditIsArrearageChange(this.ruleForm.auditIsArrearage);

    },
    auditIsArrearageChange(val) {
      // 欠费调整必填字段
      if (val == 1) {
        this.auditArrearageSel = true;
      } else {
        this.auditArrearageSel = false;
        this.ruleForm.auditEnsureEscapeType = ''
        this.ruleForm.auditFee = 0
        this.ruleForm.auditFeeText = '0'
        this.ruleForm.auditArrearage = 0
        this.ruleForm.auditArrearageText = '0'
        this.ruleForm.auditArrearageType = ''
      }
    },
    evidenceFileInfo() {
      let evidenceResult = this.$refs.evidenceFile.evidenceResult;
      //this.ruleForm.evidenceId = evidenceResult.evidenceId;
      this.ruleForm.auditEvidenceId = evidenceResult.evidenceId;
      this.ruleForm.evidenceFileName = evidenceResult.fileName;
      this.ruleForm.evidencePath = evidenceResult.fileUrl;

    },
    async audit(params) {
      const res = await audit(params);
      this.$nextTick(() => {
        let auditData = {};

        if (res.code == 200) {
          this.$message({
            message: '稽核成功!',
            type: 'success'
          });

        } else {
          this.$message.error('稽核失败!');
        }
      });
    },
    async exportFile() {
      let {data} = await count({serialNo: this.ruleForm.serialNo});
      if (!data) {
        this.$notify.warning('不存在证据文件，请上传');
        return false;
      }

      let params = {
        serialNo: this.ruleForm.serialNo,
        vehiclePlateText: this.ruleForm.vehiclePlateText
      }
      await download({url: 'api/v1/audit/comm/errorTravelDetail/downloadAllFile', method: 'get', params: params})
    },
    async getLastLogData(params) {
      await this.getLastLog(params)
    },
    async getLastLog(params) {
      const res = await getLastLog(params);

      if (res.code == 200 && res.data) {

        this.ruleForm = Object.assign(this.ruleForm, res.data);
        this.ruleForm.auditVehicleClass += '';
      }

    }

  }
}
</script>

<style scoped lang="scss">
/*/deep/ .el-tabs__item{
 font-size: 18px !important;
}*/

.event_input_panel {
  background: rgb(235 239 243);
  padding: 8px;
  border-radius: 5px;
  width: 100%;
  display: flex !important;
  flex-direction: row;
}

.event_input_panel .el-form-item__content {
  flex: 1 !important;
}

.event_form .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

.auditDesc ::v-deep .el-form-item__content {
  width: 100% !important;
}

.event_form ::v-deep .el-form-item__label {
  line-height: 36px !important;
}
</style>
