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

      <el-tab-pane style="overflow-y: auto;height: calc(100vh - 40px);" :label="isBreakPass?'闯关车流水稽查':(isEnList?'入口特情流水稽核':'出口特情流水稽核') " class="bgColor" name="audit">
        <el-row :gutter="10" type="flex" justify="space-around" v-loading="auditLoading">
          <el-col :span="8" >
            <div class="el-card box-card bgColor" v-if="isExList">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>出口图像信息</span></div>
              </div>
              <div class="el-card__body" style="padding: 0 20px">
                <el-image :src="exImageUrl" fit="scale-down" :preview-src-list="[exImageUrl]"
                          style="width: 100%;height: 300px;">
                </el-image>
              </div>
            </div>
             <div class="el-card box-card bgColor" v-if="isEnList||isExList">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>入口图像信息</span></div>
              </div>
              <div class="el-card__body" style="padding: 0 20px">
                <el-image :src="enImageUrl" fit="scale-down" :preview-src-list="[enImageUrl]"
                          style="width: 100%;height: 300px;">
                </el-image>
              </div>
            </div>
             <div class="el-card box-card bgColor" v-if="isBreakPass">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>牌识图像信息</span></div>
              </div>
              <div class="el-card__body" style="padding: 0 20px">
                <el-image :src="vehImageUrl" fit="scale-down" :preview-src-list="[vehImageUrl]"
                          style="width: 100%;height: 300px;">
                </el-image>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="min-width: 500px;">
            <ti-sys-user ref="staffUser" style="display: none;" :filterable="true" v-model="opertater" :org-id="dataInfo.stationOrgId"/>
            <div class="el-card box-card bgColor">
              <div class="el-card__header" style="text-align: center;">
                <div class="clearfix"><span>{{ isBreakPass?'闯关车流水稽查':(isEnList?'入口特情流水稽核':'出口特情流水稽核') }}</span></div>
              </div>
              <div class="el-card__body" style="padding: 0px;">
                <template v-if="isEnList">
                  <table class="detail-table">
                    <tr class="th">
                      <th>入口处理编号</th>
                      <th>特情类型</th>
                      <th>通行介质类型</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.id }}</td>
                      <td>{{ dataInfo.specialType }}</td>
                      <td>{{ dataInfo.mediaTypeStr }}</td>
                    </tr>
                    <tr class="th">
                      <th>通行介质编码</th>
                      <th>OBU单/双片标识</th>
                      <th>入口时间</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.mediaNo||(dataInfo.mediaType==1?dataInfo.obuId:dataInfo.cardId) }}</td>
                      <td>{{ dataInfo.obuSignStr }}</td>
                      <td>{{ dataInfo.enTime }}</td>
                    </tr>
                    <tr class="th">
                      <th>入口路段</th>
                      <th>入口收费站</th>
                      <th>入口车道编号</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.enRoadName }}</td>
                      <td>{{ dataInfo.enStationName }}</td>
                      <td>{{ dataInfo.enTollLaneNo }}</td>
                    </tr>
                    <tr class="th">
                      <th>车道类型</th>
                      <th>收费车型</th>
                      <th>车种</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.laneTypeStr }}</td>
                      <td>{{ dataInfo.vehicleTypeStr }}</td>
                      <td>{{ dataInfo.vehicleClassStr }}</td>
                    </tr>
                    <tr class="th">
                      <th>入口轴数</th>
                      <th>入口重量</th>
                      <th>实际车辆车牌</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.enAxleCount }}</td>
                      <td>{{ dataInfo.enWeight }}</td>
                      <td>{{ dataInfo.enVehiclePlateStr }}</td>
                    </tr>
                    <tr class="th">
                      <th>入口识别车牌</th>
                      <th>车辆识别标识</th>
                      <th>作业媒介</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.enIdentifyVehiclePlateStr }}</td>
                      <td>{{ dataInfo.vehicleSignStr }}</td>
                      <td>{{ dataInfo.operationMediaStr }}</td>
                    </tr>
                    <tr class="th">
                      <th>入口操作员</th>
                      <th>通行标识ID</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.enOperatorName }}</td>
                      <td>{{ dataInfo.passId }}</td>
                      <td></td>
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
               <template v-else-if="isExList">
                 <table class="detail-table">
                   <tr class="th">
                     <th>出口交易编号</th>
                     <th>特情类型</th>
                     <th>交易支付方式</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.id }}</td>
                     <td>{{ dataInfo.specialType }}</td>
                     <td>{{ dataInfo.transPayTypeStr }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口时间</th>
                     <th>出口时间</th>
                     <th>计费方式</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enTime }}</td>
                     <td>{{ dataInfo.exTime }}</td>
                     <td>{{ dataInfo.exitFeeTypeStr }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口路段</th>
                     <th>出口路段</th>
                     <th>总交易金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enRoadName }}</td>
                     <td>{{ dataInfo.exRoadName }}</td>
                     <td>{{ dataInfo.feeTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口收费站</th>
                     <th>出口收费站</th>
                     <th>应收金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enTollStationName }}</td>
                     <td>{{ dataInfo.exTollStationName }}</td>
                     <td>{{ dataInfo.payFeeTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口车道号</th>
                     <th>出口车道号</th>
                     <th>优惠金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enTollLaneNo }}</td>
                     <td>{{ dataInfo.exTollLaneNo }}</td>
                     <td>{{ dataInfo.discountFeeTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口车道类型</th>
                     <th>出口车道类型</th>
                     <th>用户卡累计金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enLaneTypeStr }}</td>
                     <td>{{ dataInfo.exLaneTypeStr }}</td>
                     <td>{{ dataInfo.cardTotalAmount }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口车型</th>
                     <th>出口车型</th>
                     <th>OBU累计优惠前通行费金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enVehicleTypeStr }}</td>
                     <td>{{ dataInfo.exVehicleTypeStr }}</td>
                     <td>{{ dataInfo.obuTotalAmountTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口车种</th>
                     <th>出口车种</th>
                     <th>OBU累计优惠后通行费金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enVehicleClassStr }}</td>
                     <td>{{ dataInfo.exVehicleClassStr }}</td>
                     <td>{{ dataInfo.obuTotalDiscountAmountTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口轴数</th>
                     <th>出口轴数</th>
                     <th>本省累计通行费金额</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enAxleCount }}</td>
                     <td>{{ dataInfo.exAxleCount }}</td>
                     <td>{{ dataInfo.obuProvinceFeeTxt }}</td>
                   </tr>
                   <tr class="th">
                     <th>入口重量</th>
                     <th>出口重量</th>
                     <th>实际车辆车牌</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.enWeight }}</td>
                     <td>{{ dataInfo.exWeight }}</td>
                     <td>{{ dataInfo.exVehiclePlateStr }}</td>
                     <td></td>
                   </tr>
                   <tr class="th">
                     <th>识别车辆车牌</th>
                     <th>通行介质类型</th>
                     <th>ETC卡号</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.exIdentifyVehiclePlateStr }}</td>
                     <td>{{ dataInfo.mediaTypeStr }}</td>
                     <td>{{ dataInfo.etcCardId }}</td>
                   </tr>
                   <tr class="th">
                     <th>介质编码</th>
                     <th>ETC卡类型</th>
                     <th>OBU单/双片标识</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.mediaNo||(dataInfo.mediaType==1?dataInfo.obuId:dataInfo.cardId) }}</td>
                     <td>{{ dataInfo.etcCardType }}</td>
                     <td>{{ dataInfo.obuSignStr }}</td>
                   </tr>
                   <tr class="th">
                     <th>车辆识别标识</th>
                     <th>通行标识ID</th>
                     <th>出口操作员</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.vehicleSignStr }}</td>
                     <td>{{ dataInfo.passId }}</td>
                     <td>{{ dataInfo.exOperatorName}}</td>
                   </tr>
                   <tr class="th">
                     <th>操作时间</th>
                     <th>计费总里程</th>
                     <th>通行省份个数</th>
                   </tr>
                   <tr>
                     <td>{{ dataInfo.exTime }}</td>
                     <td>{{ dataInfo.feeMileage }}</td>
                     <td>{{ dataInfo.provinceCount }}</td>
                   </tr>
                   <tr class="th" v-show="exListShow">
                     <th>省中心优惠类型</th>
                     <th>省中心优惠金额</th>
                     <th>省中心优惠前交易金额</th>
                   </tr>
                   <tr v-show="exListShow">
                     <td>{{ dataInfo.discountTypeStr }}</td>
                     <td>{{ dataInfo.provinceDiscountFeeTxt }}</td>
                     <td>{{ dataInfo.originFeeTxt }}</td>
                   </tr>
                   <tr class="th" v-show="exListShow">
                     <th>最短路径交易金额</th>
                     <th>交易金额占比</th>
                     <th>标签无卡次数</th>
                   </tr>
                   <tr v-show="exListShow">
                     <td>{{ dataInfo.shortFeeTxt }}</td>
                     <td>{{ dataInfo.feeRate }}</td>
                     <td>{{ dataInfo.noCardCount }}</td>
                   </tr>
                   <tr class="th" v-show="exListShow">
                     <th>本地特情</th>
                     <th>总交易成功次数</th>
                     <th>本省交易成功次数</th>
                   </tr>
                   <tr v-show="exListShow">
                     <td>{{ dataInfo.roadSpecialType }}</td>
                     <td>{{ dataInfo.totalCount }}</td>
                     <td>{{ dataInfo.provTransCount }}</td>
                   </tr>
                   <tr>
                     <td colspan="3">
                       <el-button type="default" @click="changeExListShow" size="middle" >{{exListShow ? '收起' : '展开'}}</el-button>
                     </td>
                   </tr>
                   <tr class="th">
                     <th></th>
                     <th></th>
                     <th></th>
                   </tr>
                   <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                   </tr>

                  </table>
                </template>
                <template v-else>
                  <table class="detail-table">
                    <tr class="th">
                      <th>特情类型</th>
                      <th>处理时间</th>
                      <th>路段</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.specialType }}</td>
                      <td>{{ dataInfo.exTime }}</td>
                      <td>{{ dataInfo.exRoadName }}</td>
                    </tr>
                    <tr class="th">
                      <th>收费站</th>
                      <th>车道号</th>
                      <th>车道类型</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.exTollStationName }}</td>
                      <td>{{ dataInfo.exTollLaneNo }}</td>
                      <td>{{ dataInfo.exLaneTypeStr }}</td>
                    </tr>
                    <tr class="th">
                      <th>收费车型</th>
                      <th>车种</th>
                      <th>实际车辆车牌</th>
                    </tr>
                    <tr>
                      <td>{{ dataInfo.exVehicleTypeStr }}</td>
                      <td>{{ dataInfo.exVehicleClassStr }}</td>
                      <td>{{ dataInfo.exVehiclePlateStr }}</td>
                    </tr>

                 </table>
               </template>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="min-width: 400px;">
            <audit-panel ref="audit1" title="站级稽核"  :is-ex-list="isExList" :is-break-pass="isBreakPass" :is-en-list="isEnList" :audit-type="1" :get-operater="getOperater" :audit-data="dataInfo"/>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane style="overflow-y: auto;height: calc(100vh - 80px);" label="本条流水稽核记录" name="log">
        <special-audit-log  :url="auditLogUrl"
                            :id="dataInfo.id"
                            :initParam="dataInfo"
                            :columns="logColumns"
                            :isBreakPass="isBreakPass"
                            ref="auditLog"></special-audit-log>
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
import AuditPanel from "@/views/pro/common/tiAuditPanel/auditPanel"
import moment from "moment";
import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi"
import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi"
import SpecialAuditLog from "@/views/pro/audit/special/comm/specialAuditLog"
import VehNotesView from "@/views/pro/search/list/vehNotes/vehNotesView"
import ImgConstant from "@/views/pro/common/constant/ImgConstant"
import {getEnVehicleSigId} from "@/views/pro/audit/special/exListSpecial/exListSpecialApi";
import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";

export default {
  name: "TiAuditPanelView",
  components: { SpecialAuditLog,TiSelect,TiSysUser,AuditPanel,VehNotesView },
  mixins: [...mixin],
  props: {
    isEnList: {
      type: [Boolean],
      required: true,
      default:false
    },
    isExList: {
      type: [Boolean],
      required: true,
      default:false
    },
    isBreakPass: {
      type: [Boolean],
      required: true,
      default:false
    },
    logColumns: {
      required: true
    }
  },
  data() {
    return {
      isFull: false,
      tabName: 'audit',
      auditLoading: false,
      logLoading: false,
      exListShow: false,
      listId: null,
      dataInfo: {
        auditStatusStation:"",
        auditVehiclePlateStation:"",
        auditVehicleTypeStation:"",
        auditAxleCountStation:"",
        auditVehicleClassStation:"",
        evidenceFileInfoStation:"",
        auditDescriptionStation:"",
      },
      auditLogUrl:'api/v1/audit/list/enListSpecialLog/findPage',
      enImageUrl: '',
      exImageUrl:'',
      vehImageUrl:'',
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
      return this.isEnList?this.dataInfo.enOperatorID:this.dataInfo.exOperatorID
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
  methods: {
    submit(data){
      this.$emit("submit",data);
      this.$refs.auditLog.getData();
    },
    getOperater(){
      const staffUser = this.$refs.staffUser.getUserById(this.opertater)
      return staffUser
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
        queryParams.operator = this.dataInfo.enOperatorId;
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

    async getData(row){
      try {
        this.auditLoading = true
        this.dataInfo = row
        this.$refs.audit1.setObj(this.dataInfo);
        this.$refs.auditLog.getData();
        if(this.isEnList){
          this.auditLogUrl = 'api/v1/audit/list/enListSpecialLog/findPage'
        }else if(this.isExList){
          this.auditLogUrl = 'api/v1/audit/list/exListSpecialLog/findPage'
        }else if(this.isBreakPass){
          this.auditLogUrl = 'api/v1/audit/list/breakPassRecordLog/findPage'
        }
        // this.getLogs()
        this.getImg()
      }finally {
        this.auditLoading = false
      }
    },
    async getImg(){

      if(this.isEnList){
        this.enImageUrl = 'data:image/jpg;base64,' + (await getImgBase64(this.dataInfo.enSectionId,this.dataInfo.enStationId,this.dataInfo.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }
      if(this.isExList){
        console.log("dataInfo"+this.dataInfo);
        console.log(this.dataInfo.vehicleSignId);
        let enVehicleSignId = await getEnVehicleSigId(this.dataInfo.passId, this.dataInfo.enTime).then(res => {
            let enVehicleSignId = res.data;
            if (!enVehicleSignId) {
              enVehicleSignId = ""
            }
            return enVehicleSignId;
          }
        );
        let proId = dictUtils.getDictLabel('tibms_config', 'local_province', '44');
        if (proId == 14) {
          this.exImageUrl = 'data:image/jpg;base64,' + (await getSxImgBase64(
              {roadId: this.dataInfo.exSectionId, stationId: this.dataInfo.exStationId}
              , {picId: this.dataInfo.id, picTime: this.dataInfo.exTime ? this.dataInfo.exTime.replace(' ', 'T') : null, vehiclePlate: null, gantryId: null, imgType: "1"})
          ).data;
          this.enImageUrl = 'data:image/jpg;base64,' + (await getSxImgBase64(
              {roadId: this.dataInfo.enSectionId, stationId: this.dataInfo.enStationId}
              , {picId: enVehicleSignId, picTime: this.dataInfo.enTime ? this.dataInfo.enTime.replace(' ', 'T') : null, vehiclePlate: null, gantryId: null, imgType: "1"})
          ).data;
        } else {
          this.exImageUrl = 'data:image/jpg;base64,' + (await getImgBase64(this.dataInfo.exSectionId, this.dataInfo.exStationId, this.dataInfo.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
          this.enImageUrl = 'data:image/jpg;base64,' + (await getImgBase64(this.dataInfo.enSectionId, this.dataInfo.enStationId, enVehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
        }
      }

      if(this.isBreakPass && this.dataInfo.exStationId!=null){
          this.vehImageUrl = 'data:image/jpg;base64,' + (await getImgBase64(this.dataInfo.exSectionId, this.dataInfo.exStationId, this.dataInfo.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }

    },
    // async getLogs(){
    //   this.logLoading = true
    //   try {
    //     const res = await request({
    //       url: `api/v1/audit/list/`+(this.isEnList?'enListSpecial':'exListSpecial')+`/findPage/${this.dataInfo.id}/${this.dataInfo.workOrderId}`,
    //       method: 'get',
    //       params: {},
    //       data: {}
    //     });
    //     if(res.code==200){
    //       this.logData = res.data
    //     }else{
    //       this.logData = []
    //     }
    //   }finally {
    //     this.logLoading = false
    //   }
    // },
    async init(row){
       this.getData(row)
       this.tabName = 'audit';
    },
    changeExListShow(){
      this.exListShow = !this.exListShow
    }
  },
  created() {
    console.log("enter auditpanel")
  },
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
</style>

