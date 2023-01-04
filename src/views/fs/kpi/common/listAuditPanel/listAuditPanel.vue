<template>
  <div style="position: relative; padding: 20px;">
    <el-row style="position: absolute;right: 20px;top:10px;z-index: 2;">
      <!--<el-button type="primary" :title="isFull?'还原':'全屏'" @click="isFull = !isFull">
        <i class="el-icon-full-screen" v-show="!isFull"></i>
        <i class="el-icon-copy-document" v-show="isFull"></i>
      </el-button>-->
      <slot name="operation"></slot>
    </el-row>
    <el-tabs v-model="tabName">
      <el-tab-pane style="overflow-y: auto;height: calc(100vh - 40px);" :label="isEnList?'入口流水稽核':'出口流水稽核'" class="bgColor" name="audit">
        <el-row :gutter="10" type="flex" justify="space-around" v-loading="auditLoading">
          <el-col :span="4" >
            <div class="el-card box-card bgColor">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>{{ isEnList?'入口图像信息':'出口图像信息' }}</span></div>
              </div>
              <div class="el-card__body" style="padding: 0 20px">
                <el-image :src="imageUrl" fit="scale-down" :preview-src-list="[imageUrl]"
                          style="width: 100%;">
                </el-image>
              </div>
            </div>
            <div class="el-card box-card bgColor" v-if="!isEnList">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>入口图像信息</span></div>
              </div>
              <div class="el-card__body" style="padding: 0 20px">
                <el-image :src="enImageUrl" fit="scale-down" :preview-src-list="[enImageUrl]"
                          style="width: 100%;height: 300px;">
                </el-image>
              </div>
            </div>
          </el-col>
          <el-col :span="12" style="min-width: 500px;">
            <ti-sys-user ref="staffUser" style="display: none;" :filterable="true" v-model="opertater" :org-id="dataInfo.serviceOrgId"/>
            <div class="el-card box-card bgColor">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>{{ isEnList?'入口通行流水信息':'出口通行流水信息' }}</span></div>
              </div>
              <div class="el-card__body" style="padding: 0px;">
                <template v-if="isEnList">
                  <table class="detail-table">
                    <tr>
                      <th>入口处理编号</th>
                      <td>{{ dataInfo.listNo }}</td>
                    </tr>
                    <tr>
                      <th>特情类型</th>
                      <td>{{ dataInfo.specialType }}</td>
                    </tr>
                    <tr>
                      <th>通行介质类型</th>
                      <td>{{ dataInfo.mediaTypeTxt }}</td>
                    </tr>
                    <tr>
                      <th>通行介质编码</th>
                      <td>{{ dataInfo.mediaNo||(dataInfo.mediaType==1?dataInfo.obuId:dataInfo.cardId) }}</td>
                    </tr>
                    <tr>
                      <th>OBU单/双片标识</th>
                      <td>{{ dataInfo.obuSignTxt }}</td>
                    </tr>
                    <tr>
                      <th>入口处理时间</th>
                      <td>{{ dataInfo.enTime }}</td>
                    </tr>
                    <tr>
                      <th>入口路段</th>
                      <td>{{ dataInfo.enRoadName }}</td>
                    </tr>
                    <tr>
                      <th>入口收费站</th>
                      <td>{{ dataInfo.enStationName }}</td>
                    </tr>
                    <tr>
                      <th>入口车道编号</th>
                      <td>{{ dataInfo.enTollLaneNo }}</td>
                    </tr>
                    <tr>
                      <th>车道类型</th>
                      <td>{{ dataInfo.laneTypeTxt }}</td>
                    </tr>
                    <tr>
                      <th>收费车型</th>
                      <td>{{ dataInfo.vehicleTypeTxt }}</td>
                    </tr>
                    <tr>
                      <th>车种</th>
                      <td>{{ dataInfo.vehicleClassTxt }}</td>
                    </tr>
                    <tr>
                      <th>入口轴数</th>
                      <td>{{ dataInfo.enAxleCount }}</td>
                    </tr>
                    <tr>
                      <th>入口重量</th>
                      <td>{{ dataInfo.enWeight }}</td>
                    </tr>
                    <tr>
                      <th>实际车辆车牌</th>
                      <td>{{ dataInfo.enVehiclePlateTxt }}</td>
                    </tr>
                    <tr>
                      <th>入口识别车牌</th>
                      <td>{{ dataInfo.enIdentifyVehiclePlateTxt }}</td>
                    </tr>
                    <tr>
                      <th>车辆识别标识</th>
                      <td>{{ dataInfo.vehicleSignTxt }}</td>
                    </tr>
                    <tr>
                      <th>作业媒介</th>
                      <td>{{ dataInfo.operationMediaTxt }}</td>
                    </tr>
                    <tr>
                      <th>工班日期</th>
                      <td>{{ dataInfo.squadDate }}</td>
                    </tr>
                    <tr>
                      <th>入口操作员</th>
                      <td>{{ dataInfo.operatorTxt }}</td>
                    </tr>
                    <tr>

                      <th>通行标识ID</th>
                      <td>{{ dataInfo.passId }}</td>
                    </tr>
                    <!--
                   <tr class="th">
                     <th>申诉次数</th>
                     <th>抽查次数</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.appealTimes }}</td>
                     <td>{{ dataInfo.spotCheckNum }}</td>
                   </tr>
                   -->
                 </table>
               </template>
               <template v-else>
                 <table class="detail-table">
                   <tr>
                     <th>出口交易编号</th>
                     <td>{{ dataInfo.listNo }}</td>
                     <th>通行标识ID</th>
                     <td>{{ dataInfo.passId }}</td>
                   </tr>
                   <tr>
                     <th>入口时间</th>
                     <td>{{ dataInfo.enTime }}</td>
                     <th>出口时间</th>
                     <td>{{ dataInfo.exTime }}</td>
                   </tr>
                   <tr>
                     <th>入口路段</th>
                     <td>{{ dataInfo.enRoadName }}</td>
                     <th>出口路段</th>
                     <td>{{ dataInfo.exRoadName }}</td>
                   </tr>
                   <tr>
                     <th>入口收费站</th>
                     <td>{{ dataInfo.enStationName }}</td>
                     <th>出口收费站</th>
                     <td>{{ dataInfo.exStationName }}</td>
                   </tr>
                   <tr>
                     <th>入口车道号</th>
                     <td>{{ dataInfo.enTollLaneNo }}</td>
                     <th>出口车道号</th>
                     <td>{{ dataInfo.exTollLaneNo }}</td>
                   </tr>
                   <tr>
                     <th>入口车道类型</th>
                     <td>{{ dataInfo.enLaneTypeTxt }}</td>
                     <th>出口车道类型</th>
                     <td>{{ dataInfo.laneTypeTxt }}</td>
                   </tr>
                   <tr>
                     <th>入口车型</th>
                     <td>{{ dataInfo.enVehicleTypeTxt }}</td>
                     <th>出口车型</th>
                     <td>{{ dataInfo.vehicleTypeTxt }}</td>
                   </tr>
                   <tr>
                     <th>入口车种</th>
                     <td>{{ dataInfo.enVehicleClassTxt }}</td>
                     <th>出口车种</th>
                     <td>{{ dataInfo.vehicleClassTxt }}</td>
                   </tr>
                   <tr>
                     <th>入口轴数</th>
                     <td>{{ dataInfo.enAxleCount }}</td>
                     <th>出口轴数</th>
                     <td>{{ dataInfo.exAxleCount }}</td>
                   </tr>
                   <tr>
                     <th>入口重量</th>
                     <td>{{ dataInfo.enWeight }}</td>
                     <th>出口重量</th>
                     <td>{{ dataInfo.exWeight }}</td>
                   </tr>
                   <tr>
                     <th>实际车辆车牌</th>
                     <td>{{ dataInfo.exVehiclePlateTxt }}</td>
                     <th>出口识别车辆车牌</th>
                     <td>{{ dataInfo.exIdentifyVehiclePlateTxt }}</td>
                   </tr>
                   <tr>
                     <th>车辆识别标识</th>
                     <td>{{ dataInfo.vehicleSignTxt }}</td>
                     <th>交易支付方式</th>
                     <td>{{ dataInfo.transPayTypeTxt }}</td>
                   </tr>
                   <th>发票号</th>
                   <td>{{ dataInfo.invoiceId }}</td>
                   <th>计费方式</th>
                   <td>{{ dataInfo.exitFeeTypeTxt }}</td>
                   <tr>
                   <tr>
                     <th>通行介质类型</th>
                     <td>{{ dataInfo.mediaTypeTxt }}</td>
                     <th>总交易金额</th>
                     <td>{{ dataInfo.feeTxt }}</td>
                   </tr>

                   <tr>
                     <th>OBU单/双片标识</th>
                     <td>{{ dataInfo.obuSignTxt }}</td>
                     <th>应收金额</th>
                     <td>{{ dataInfo.payFeeTxt }}</td>
                   </tr>
                   <tr>
                     <th>介质编码</th>
                     <td>{{ dataInfo.mediaNo||(dataInfo.mediaType==1?dataInfo.obuId:dataInfo.cardId) }}</td>
                     <th>优惠金额</th>
                     <td>{{ dataInfo.discountFeeTxt }}</td>
                   </tr>
                   <tr>
                     <th>ETC卡号</th>
                     <td>{{ dataInfo.etcCardId }}</td>
                     <th>特情类型</th>
                     <td>{{ dataInfo.specialType }}</td>

                   </tr>
                   <tr>
                     <th>ETC卡类型</th>
                     <td>{{ dataInfo.etcCardTypeTxt }}</td>
                     <th>省中心优惠类型</th>
                     <td>{{ dataInfo.discountTypeTxt }}</td>
                   </tr>
                   <tr>
                     <th>工班</th>
                     <td>{{ dataInfo.squadDate }}</td>
                     <th>最短路径交易金额</th>
                     <td>{{ dataInfo.shortFeeTxt }}</td>
                   </tr>
                   <tr>
                   <th>出口操作员</th>
                   <td>{{ dataInfo.operatorTxt}}</td>
                   <th>通行省份个数</th>
                   <td>{{ dataInfo.provinceCount }}</td>
                   </tr>
                 </table>
                </template>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="min-width: 400px;">
            <audit-panel ref="audit1" title="站级稽核" @submit="submit" :audit-type="1" :get-operater="getOperater"/>
            <audit-panel ref="audit2" title="路段稽核" @submit="submit" :audit-type="2" :get-operater="getOperater"/>
            <check-panel ref="audit3" title="路段审核" @submit="submit" :audit-type="3" :get-operater="getOperater"/>
            <audit-panel ref="audit4" title="管理中心稽核" @submit="submit" :audit-type="4" :get-operater="getOperater" />
            <check-panel ref="audit5" title="管理中心审核" @submit="submit" :audit-type="5" :get-operater="getOperater" />
            <spot-panel ref="audit6" title="收费部抽查" @submit="submit" :audit-type="8" :get-operater="getOperater" />

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane style="overflow-y: auto;height: calc(100vh - 80px);" label="本条流水稽核记录" name="log">
        <vxe-grid
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          keep-source
          highlight-current-row
          height="'300px'"
          class="vxe-table-element"
          :loading="logLoading"
          :columns="logColumns"
          :data="logData"/>
      </el-tab-pane>
      <el-tab-pane style="overflow-y: auto;height: calc(100vh - 120px);" label="车道操作日志" name="laneLog">
        <veh-notes-view ref="vehNotes">
        </veh-notes-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mixin from "@ecip/ecip-web/src/utils/common-mixin";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi"
import AuditPanel from "./auditPanel"
import CheckPanel from "./checkPanel"
import SpotPanel from "./spotPanel"
import request from "@ecip/ecip-web/src/utils/request"
import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi"
import {getEnVehicleSigId} from "@/views/fs/kpi/exAudit/exAuditApi"
import ImgConstant from "@/views/pro/common/constant/ImgConstant"
import VehNotesView from "@/views/pro/search/list/vehNotes/vehNotesView"
import moment from "moment";

export default {
  name: "ListAuditPanelView",
  components: { TiSelect,TiSysUser,AuditPanel,CheckPanel,SpotPanel,VehNotesView },
  mixins: [...mixin],
  props: {
    isEnList: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    return {
      isFull: false,
      tabName: 'audit',
      auditLoading: false,
      logLoading: false,
      listId: null,
      dataInfo: {},
      imageUrl: '',
      enImageUrl: '',
      logColumns: [
        { field: 'auditTypeTxt', title: '稽核权限', minWidth: 120, align: 'center' },
        { field: 'createTime', title: '稽核时间', minWidth: 170, align: 'center' },
        { field: 'createrTxt', title: '稽核人员', minWidth: 100, align: 'center' },
        { field: 'auditResultTxt', title: '稽核结论', minWidth: 100, align: 'center' },
        { field: 'bizCriterionTxt', title: '业务规范', minWidth: 100, align: 'center' },
        { field: 'indiDesc', title: '考核指标', minWidth: 100, align: 'center',showOverflow: true },
        { field: 'scoreVal', title: '考核分值', minWidth: 100, align: 'center' },
        { field: 'checkResultTxt', title: '审核结论', minWidth: 100, align: 'center' },
        //     //auditType 稽核类型：1 站级稽核，2路段稽核，3路段审核，4管理中心稽核，5管理中心审核，6路段申诉，7管理中心申诉，8收费部抽查
        { field: 'auditDesc', title: '说明', minWidth: 100, align: 'center',formatter:({row})=>{ return (row.auditType==1 || row.auditType==2 || row.auditType==4)?row.auditDesc:row.checkDesc   } }
      ],
      logData: [],
    }
  },
  watch: {
    tabName: {
      handler(newVal, oldVal) {
        if(newVal == 'log'){
          this.$refs.auditLog.getData();
        }
        if(newVal == 'laneLog'){
          this.setLaneLog();
        }
      },
      deep: true
    }
  },
  computed:{
    opertater(){
      return this.isEnList?this.dataInfo.enOperatorID:this.dataInfo.exOperatorId
    },
    sectionId(){
      return this.isEnList?this.dataInfo.enSectionId:this.dataInfo.exSectionId
    },
    stationId(){
      return this.isEnList?this.dataInfo.enStationId:this.dataInfo.exStationId
    },
    picId(){
      return this.isEnList?this.dataInfo.enPicId:this.dataInfo.exPicId
    }
  },
  inject:['nextOne'],
  provide(){
    return{
      nextList:this.nextList
    }
  },
  methods: {
    submit(data){
      this.$emit("submit",data)
      if(data){
        this.getLogs()
      }
    },
    nextList(){
      this.nextOne();
    },
    async setLaneLog(){
      var queryParams = {
        "sysOrgIdStr":"",
        "laneNo":"",
        "operator":"",
        "tranTime":moment(new Date()).format('YYYY-MM-DD')+' 00:00:00'
      }
      if(this.isEnList){
        var {data} = await tiSysOrgApi.findByEntity({stationId: this.dataInfo.enStationId});
        queryParams.sysOrgIdStr = data[0].id;
        queryParams.laneNo = this.dataInfo.enTollLaneNo;
        queryParams.operator = this.dataInfo.enOperatorID;
        queryParams.tranTime = this.dataInfo.enTime;
        queryParams.stationNo = this.dataInfo.enStationNo;
        queryParams.roadNo = this.dataInfo.enRoadNo;
      }else{
        var {data} = await tiSysOrgApi.findByEntity({stationId: this.dataInfo.exStationId});
        queryParams.sysOrgIdStr = data[0].id;
        queryParams.laneNo = this.dataInfo.exTollLaneNo;
        queryParams.operator = this.dataInfo.exOperatorId;
        queryParams.tranTime = this.dataInfo.exTime;
        queryParams.stationNo = this.dataInfo.exStationNo;
        queryParams.roadNo = this.dataInfo.exRoadNo;
      }
      this.$refs.vehNotes.initQuery(queryParams);
    },
    getOperater(){
      const staffUser = this.$refs.staffUser.getUserById(this.opertater)
      return staffUser
    },
    async getData(){
      try {
        this.auditLoading = true

        const url = `api/v1/kpi/`+(this.isEnList?'relatedEnlist':'relatedExlist')+`/detail/${this.listId}`
        const res = await request({
          url: url,
          method: 'get',
          params: {},
          data: {}
        });
        if(res.code==200 && res.data){
          this.dataInfo = res.data
          for(let i = 1 ;  i<7 ; i++ ){
            this.dataInfo['isEnList'] = this.isEnList
            this.$refs['audit'+i].init(this.dataInfo)
          }
          this.getLogs()
          this.getImg()
        }else{
          this.dataInfo = {}
        }
      }finally {
        this.auditLoading = false
      }
    },
    async getImg(){
      this.imageUrl = 'data:image/jpg;base64,' + (await
        getImgBase64(this.sectionId,this.stationId,this.picId + '_' + ImgConstant.gdImgFix.frontPic)).data;

      if (!this.isEnList){
        let enVehicleSignId = await getEnVehicleSigId(this.dataInfo.passId, this.dataInfo.enTime).then(res => {
            let enVehicleSignId = res.data;
            if (!enVehicleSignId) {
              enVehicleSignId = ""
            }
            return enVehicleSignId;
          }
        );
        this.enImageUrl = 'data:image/jpg;base64,' + (await
          getImgBase64(this.dataInfo.enSectionId, this.dataInfo.enStationId, enVehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }


    },
    async getLogs(){
      this.logLoading = true
      try {
        const res = await request({
          url: `api/v1/kpi/kpiAuditLog/findList/${this.dataInfo.listId}/${this.dataInfo.workOrderId}`,
          method: 'get',
          params: {},
          data: {}
        });
        if(res.code==200){
          this.logData = res.data
        }else{
          this.logData = []
        }
      }finally {
        this.logLoading = false
      }
    },
    init(listId){
      this.listId = listId
      this.getData()
    }
  }
}
</script>


<style scoped lang="scss">
.imgBox {
  margin: 5px;
}
.bgColor{
  background-color: #ebeef5;
}
.detail-table {
  border-collapse: collapse;
  border-spacing: 0px;
  border-color: #fff;
  color: #666;
  table-layout: fixed;
  width: 100%;
  margin: 1px;
  background-color: #ffffff;
}

.detail-table th, .detail-table td {
  border-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
  padding: 5px 0px;
  font-size: 14px;
  text-align: center;
}

.detail-table th {
  font-weight: 400;
  width: 33.33%;
  text-align: center;
  font-weight: 800;
  background-color: #f2f2f2;
}

.detail-table td {
  word-wrap: break-word;
  width: auto;
  height: 35px;
}

.fullScreen{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: .5em 1em;
  background-color: #fff;
  z-index: 1005;
}
.detail-table th{
  width: auto;
}
</style>

