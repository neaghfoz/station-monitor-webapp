<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="通行介质" prop="mediaType">
          <ti-select
            v-model="queryParams.mediaType"
            :data-list="[{value:'1',name:'OBU'},{value:'2',name:'CPC'}]"
            :props="{key:'value',value:'value',label:'name'}"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号"
                    maxlength="16"/>
        </el-form-item>
          <el-form-item label="异常类型" prop="restoreType">
            <ti-select v-model="queryParams.restoreType" dict-type="tibms_audit_errorRestoreType"/>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="入口交易时间" label-width="110px" prop="transDateRange">
          <el-form-item prop="beginDate" v-show="false"/>
          <el-form-item prop="endDate" v-show="false"/>
          <ti-date-range date-style="width:490px" ref="dateRang" date-type="daterange"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                         :clearable="false"
                         v-model="queryParams.transDateRange" begin-key="beginDate"
                         end-key="endDate"/>
        </el-form-item>
        <el-form-item label="稽核状态" prop="auditStatus">
          <ti-select v-model="queryParams.auditStatus" dict-type="tibms_audit_auditStatus" :clearable="false"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
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
      height="400px"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @current-change="currentChangeEvent">
      >
      <template v-slot:toolbar_buttons>
        <el-button v-permission="['errorPath:exportExcel']" @click="exportExcel.dialog = true">
          导出
        </el-button>
      </template>
    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
    <ti-road-net id="passDetailInfo" :restore-type-flag="true" :restore-type="restoreType" button-z-index="1025" v-show="pathList.length>0" ref="roadNet" :path-info-list="pathList" :image-show="true" :check-show="true">
<!--      <template slot="btns">-->
<!--      </template>-->
      <template slot="operation">
        <el-button   type="warning" :disabled="auditStatus === 2" @click="addInterval">添加收费单元
        </el-button>
        <add-interval ref="addInterval" :params="addIntervalParams"
                      @addIntervalInfo="addIntervalInfo"></add-interval>
        <el-button type="warning" :disabled="auditStatus === 2" @click="removeInterval">移除收费单元
        </el-button>
        <el-button type="warning"  @click="addEvidence">上传查看证据
        </el-button>
        <ti-evidence ref="evidence" :params="evidenceParams"
                     :upload-flag="auditStatus !== 2"></ti-evidence>
        <el-button :loading="restoreLoading" type="warning" :disabled="auditStatus === 2" @click="restore">拟合验证</el-button>
        <el-button :loading="auditLoading" type="warning" :disabled="auditStatus === 2" @click="audit">确认稽核</el-button>
        <el-button :loading = "lastLoading" type="primary" icon="el-icon-arrow-left" @click="lastOne">上一条</el-button>
        <el-button :loading = "nextLoading" type="primary" icon="el-icon-arrow-right" @click="nextOne">下一条</el-button>
      </template>
    </ti-road-net>

  </div>
</template>

<script>
  import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import {findPage, getPathInfo, restore, findEvidenceList, audit} from "./errorPathApi"
  import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"
  import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
  import TiLMap from "@/views/pro/common/tiLMap/tiLMap2";
  import TiRoadNet from "@/views/pro/audit/comm/tiRoadNet/tiRoadNet";
  import AddInterval from "./components/addInterval"
  import {defaulrImageurl} from "@/views/pro/audit/comm/util/pathUtil";
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";

  export default {
    name: "pro.audit.dataAudit.errorPath.errorPathView",
    components: {
      TiSysOrg,
      TiSelect,
      TiDateRange,
      TiExportExcel,
      TiEvidence,
      TiRoadNet,
      TiLMap,
      AddInterval
    },
    mixins: [...mixin],
    data() {
      return {
        restoreLoading: false,
        auditLoading:false,
        queryParams: {
          transDateRange: {
            beginDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            // beginDate: moment('2020-06-01').format('YYYY-MM-DD'),
            // endDate: moment('2021-01-01').format('YYYY-MM-DD')
          },
          startTime: '',
          endTime: '',
          mediaType: '',
          vehiclePlate: '',
          restoreType: '',
          auditStatus: '1'
        },
        exportExcel: {
          url: 'api/v1/audit/list/errorPathAudit/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'pro.audit.dataAudit.errorPath.errorPathView-toolbar',
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
        tableData: [],
        columns: [
          {
            field: "passId",
            title: "通行标识",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "restoreTypeStr",
            title: "异常路径类型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "auditStatusStr",
            title: "稽核状态",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "vehiclePlateStr",
            title: "交易车牌",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "pathFirsnName",
            title: "入口站",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "enTollTime",
            title: "入口交易时间",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "pathLastnName",
            title: "出口站",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "pathLastnTime",
            title: "出口交易时间",
            minWidth: 180,
            showOverflow: true
          },
          {
            field: "mediaTypeStr",
            title: "通行介质",
            minWidth: 100,
            showOverflow: true
          },
          {
            field: "vehicleTypeStr",
            title: "计费车型",
            minWidth: 150,
            showOverflow: true
          },
          {
            field: "vehicleClassStr",
            title: "计费车种",
            minWidth: 150,
            showOverflow: true
          },
          // {
          //   field: "vehicleClassStr",
          //   title: "交易金额(元)",
          //   width: 150,
          //   showOverflow: true
          // },
        ],
        currentDetail: [],
        selectRowIndex: 0,
        pathListTmp: [],
        restoreType:'',
        pathList: [],
        checkData: {},
        lastLoading: false,
        nextLoading: false,
        evidenceParams: {},
        restoreFlag: false,
        auditStatus: 2,
        addIntervalParams: {},
        mapParams: {
          pathList: [],
          version: '4420200101001'
        },
        // geoServerUrl: 'http://10.173.235.140:8888/OSM/map/{z}/{x}/{y}.png'
      }
    },
    created() {
      this.getData();
    },
    methods: {
      submit() {
        this.$data.page.currentPage = 1
        this.getData();
      },
      async getData() {
        this.checkData = {};
        this.pathList = [];
        this.selectRowIndex = 0;
        this.queryParams.startTime = this.queryParams.transDateRange.beginDate + " 00:00:00";
        this.queryParams.endTime = this.queryParams.transDateRange.endDate + " 23:59:59";
        this.loading = true;
        const {data} = await findPage(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          this.queryParams);
        this.tableData = data.records;
        this.page.total = data.total

        //默认第一行高亮
        if (this.tableData.length > 0) {
          this.$nextTick(() => {
            this.$refs.vex.setCurrentRow(this.$refs.vex.data[0]);
            this.getPassPath(this.$refs.vex.data[0]);
          })
        }
        this.loading = false;
        //保存导出的查询条件
        this.exportExcel.queryParams = this.queryParams;
      },
      async getPassPath(rowData) {
        let params = {
          passId: rowData.passId,
          enTime: rowData.enTime
        }
        this.currentDetail = rowData;
        this.evidenceParams.serialNo = rowData.passId;
        this.auditStatus = rowData.auditStatus;
        this.addIntervalParams.vehicleClass = rowData.vehicleClass;
        this.addIntervalParams.vehicleType = rowData.vehicleType;
        this.addIntervalParams.mediaType = rowData.mediaType;
        this.addIntervalParams.passId = rowData.passId;

        const {data} = await getPathInfo({}, params);
        let pathInfos = data.pathInfos;
       // await this.getImgUrl(pathInfos);
        this.copyListValue(this.pathListTmp, pathInfos);
        this.$refs.roadNet.mapParamsFlag = true;
        this.restoreType = rowData.restoreType;
        this.pathList = pathInfos;
        // this.mapParams.version = data.version;
        //
        // let passPathInfos = data.pathInfos;
        // console.log("passPathInfos:",passPathInfos);
        // //构造通行路径
        // let pathList = transferPathInfo(passPathInfos);
        // //获取图片
        // await this.getImgUrl(pathList);
        // this.setMapDataList(pathList);
        // this.pathList = pathList;

      },
      // async getImgUrl(pathList) {
      //   if (!pathList || pathList.length <= 0) {
      //     return;
      //   }
      //   for (let i = 0; i < pathList.length; i++) {
      //     pathList[i].imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(
      //       pathList[i].vehicleSignId + '_frontPic')).data;
      //   }
      // },
      async  getImgUrl(pathList){
        if(!pathList || pathList.length<=0){
          return;
        }
        for(let i=0;i<pathList.length;i++){
          if(pathList[i].vehicleSignId == null || pathList[i].vehicleSignId == ''){
            pathList[i].imageUrl = 'data:image/jpg;base64,' + defaulrImageurl;
          }else{
            let length =pathList[i].tollIntervalId.length;
            if(length == 14){
              pathList[i].imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(pathList[i].tollIntervalId.substring(0,11),pathList[i].tollIntervalId.substring(0,14),pathList[i].vehicleSignId + '_'+ImgConstant.gdImgFix.frontPic)).data;
            }else{
              pathList[i].imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(pathList[i].tollIntervalId.substring(0,11),0,pathList[i].vehicleSignId + '_'+ImgConstant.gdImgFix.gantryImage)).data;
            }

          }
        }
        // return  'data:image/jpg;base64,' + (await getImgBase64(item.vehicleSignId + '_frontPic')).data;
        // return item.imageUrl;

      },
      // setMapDataList(pathInfoList){
      //
      //   if(!pathInfoList || pathInfoList.length<=0){
      //     return;
      //   }
      //   const _this = this
      //   setTimeout(function() {
      //     let mapDataList = [];
      //     for(let i = 0;i < pathInfoList.length;i++){
      //       let mapData = {
      //         nodeId:pathInfoList[i].tollIntervalId,
      //         type:pathInfoList[i].pathType
      //       }
      //       mapDataList.push(mapData);
      //     }
      //     _this.mapParams.pathList = mapDataList;
      //   },5000)
      //
      // },
      addInterval() {
        this.$refs.addInterval.dialogVisible = true;
      },
      addIntervalInfo() {
        this.$nextTick(()=>{
          let addIntervalInfo = this.$refs.addInterval.intervalParams;
          let intervalInfo = {};
          Object.assign(intervalInfo, addIntervalInfo);
          this.pathList = this.$refs.roadNet.pathList;
          console.log("intervalInfo:", intervalInfo);
          let pathList = [];
          this.copyListValue(pathList, this.pathList);
          console.log("pathList...1:", pathList);
          this.addPathToList(pathList, intervalInfo);
          console.log("pathList...2:", pathList);
          this.pathList = [];
          this.$refs.roadNet.mapParamsFlag = false;
          this.copyListValue(this.pathList, pathList);
          console.log("pathList...3:", this.pathList);
          this.restoreFlag = false;
          this.$notify.success("添加成功");
        })


      },
      addPathToList(pathList, addIntervalInfo) {
        if (!pathList || pathList.length <= 0) {
          return;
        }
        let length = pathList.length;
        let addTradeTime = addIntervalInfo.tradeTime;
        if (addTradeTime > pathList[length - 1].tradeTime) {
          pathList.push(addIntervalInfo);
          return;
        }
        for (let i = 0; i < length; i++) {
          let tradeTime = pathList[i].tradeTime;
          if (tradeTime === addTradeTime) {
            pathList.splice(i + 1, 0, addIntervalInfo);
            break;
          } else if (addTradeTime < tradeTime) {
            pathList.splice(i, 0, addIntervalInfo);
            break;
          }
        }
        console.log("pathList2:", pathList);
      },
      copyListValue(targetListOne, sourceList) {
        if (sourceList && sourceList.length > 0) {
          sourceList.forEach(item => {
            let obj = {};
            Object.assign(obj, item);
            targetListOne.push(obj);
          });
        }
      },
      removeInterval() {
        let checkData = this.$refs.roadNet.getCheckData();
        if (JSON.stringify(checkData) == "{}") {
          this.$notify.warning("请最少选择一条！")
        } else {
          try {
            let indexList = [];
            let pathList = [];
            this.copyListValue(pathList, this.pathList);
            // console.log("pathList:",pathList);
            for (let key in checkData) {
              if (checkData.hasOwnProperty(key)) {
                indexList.push(checkData[key].index);
                for (let j = 0; j < pathList.length; j++) {
                  let serialNo = pathList[j].serialNo;
                  if (key === serialNo) {
                    pathList.splice(j, 1);
                    break;
                  }
                }
              }

            }
            this.$refs.roadNet.mapParamsFlag = false;
            this.pathList = pathList;
            console.log("indexList:", indexList);
            for (let i = 0; i < indexList.length; i++) {
              this.$refs.roadNet.checkBox(indexList[i]);
            }
            this.restoreFlag = false;
            this.$notify.success("移除成功")
          } catch (e) {
            this.$notify.error("移除失败" + e)
          }

        }
      },
      addEvidence() {
        this.$refs.evidence.dialogVisible = true;
      },
      async restore() {
        let pathList = [];
        let response;
        try {
          this.restoreLoading = true;
          console.log("restore....pathList:", this.pathList);
          response = await restore(this.pathList);
          if (response.success) {
            pathList = response.data;
            this.$refs.roadNet.mapParamsFlag = true;
            this.restoreType = '0';
            this.pathList = pathList;
            this.restoreFlag = true;
            this.$notify.success("拟合验证成功！")
          } else {
            this.$notify.error("路径拟合失败，请重新操作！" + response.message)
          }


        }catch (e) {
          // this.$nextTick(()=>{
          //   this.$notify.error("路径拟合失败，请重新操作！" + e.message)
          // })

        }
        this.restoreLoading = false;
        if(response && response.success){
          await this.getImgUrl(this.pathList);
        }
      },
      async audit() {
        if (!this.restoreFlag) {
          this.$notify.warning("请先对该异常路径执行拟合验证操作")
          return
        }
        //判断是否上传稽核证据
        const {data} = await findEvidenceList({}, {serialNo: this.evidenceParams.serialNo});
        if (data == null || data.length <= 0) {
          this.$notify.warning("请上传稽核证据文件")
          return
        }
        try{
          this.auditLoading = true;
          let response;
          await audit(this.pathList, this.currentDetail.passId,
            this.currentDetail.enTime + " 00:00:00").then(res => {
            response = res;
          });
          if (response.success) {
            this.$notify.success("确认稽核成功！")
            this.$refs.vex.reloadRow(this.$refs.vex.data[this.selectRowIndex], response.data);
            this.$nextTick(()=>{
              this.nextOne();
            })
            if (this.selectRowIndex === this.tableData.length - 1) {
              this.getPassPath(this.$refs.vex.data[this.selectRowIndex]);
            }

          } else {
            this.$notify.error("稽核失败！" + response.message)
          }

        }catch (e) {
          // this.$notify.error("稽核失败！" + e)
        }
        this.auditLoading = false;
      },
      lastOne() {
        if (this.selectRowIndex === 0) {
          this.$notify.warning("已经是第一条数据!");
          return;
        }
        this.lastLoading = true;
        this.selectRowIndex = this.selectRowIndex - 1;
        this.$refs.vex.setCurrentRow(this.$refs.vex.data[this.selectRowIndex]);
        this.getPassPath(this.$refs.vex.data[this.selectRowIndex]);
        this.lastLoading = false;
      },
      nextOne() {
        if (this.selectRowIndex === this.tableData.length - 1) {
          // setTimeout(function() {
          //   //alert('数组置空')
          // }, 1000)
          this.$notify.warning("已经是最后条数据了!");
          return;
        }
        this.nextLoading = true;
        this.selectRowIndex = this.selectRowIndex + 1;
        this.$refs.vex.setCurrentRow(this.$refs.vex.data[this.selectRowIndex]);
        this.getPassPath(this.$refs.vex.data[this.selectRowIndex]);
        this.nextLoading = false;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      currentChangeEvent({row}) {
        this.selectRowIndex = this.$refs.vex.getRowIndex(row);
        this.getPassPath(this.$refs.vex.getCurrentRecord());
        document.getElementById("passDetailInfo").scrollIntoView();

      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
      },

    }
  }
</script>

<style scoped>
  /*@import "../../comm/css/fillPointPassInfo.css";*/
</style>
