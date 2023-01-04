<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">


      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基本信息</span></div>
        <el-row :gutter="5">
          <el-col :span="12">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="计费交易编号" :value="detailItem.tradeId"/></el-col>
                <el-col :span="12"><ti-detail-cell label="门架编号" :value="detailItem.gantryTxt"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="门架类型" :value="detailItem.gantryTypeTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="门架顺序号" :value="detailItem.gantryOrderNum"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="门架Hex值" :value="detailItem.gantryHex"/></el-col>
                <el-col :span="12"><ti-detail-cell label="对向门架Hex值" :value="detailItem.gantryHexOpposite"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="入口车道编号" :value="detailItem.enTollLaneId"/></el-col>
                <el-col :span="12"><ti-detail-cell label="入口车道hex" :value="detailItem.enTollStationHex"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="归属区域编码" :value="detailItem.netRoadId"/></el-col>
                <el-col :span="12"><ti-detail-cell label="归属路段编码" :value="detailItem.roadno"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="上一门架Hex值" :value="detailItem.lastGantryHex"/></el-col>
                <el-col :span="12"><ti-detail-cell label="通过上一门架时间" :value="detailItem.lastGantryTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="OBU中上一个门架HEX" :value="detailItem.obuLastGantryHex"/></el-col>
                <el-col :span="12"><ti-detail-cell label="OBU中通过上一个门架时间" :value="detailItem.obuLastGantryTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="计费车型" :value="detailItem.vehicleTypeTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="识别车型" :value="detailItem.identifyVehicleTypeTxt"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="车牌号码" :value="detailItem.vehiclePlateTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="车种" :value="detailItem.vehicleClassTxt"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="特情类型" :value="detailItem.specialTypeTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="小时批次号" :value="detailItem.hourBatchNo"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="入口交易时间" :value="detailItem.enTime"/></el-col>
                <el-col :span="12"><ti-detail-cell label="计费交易时间" :value="detailItem.transTime"/></el-col>
              </el-row>
              <!--<el-row :gutter="5">-->
                <!--<el-col :span="12"><ti-detail-cell label="日流水号" :value="detailItem.dayListNo"/></el-col>-->
                <!--<el-col :span="12"><ti-detail-cell label=" " /></el-col>-->
              <!--</el-row>-->
            </div>
          </el-col>
          <el-col :span="12">
            <div ref="baseInfoImg" class="baseInfoHeight">
              <el-image
                style="width: 100%; height: 100%"
                :src="imgUrl"
                fit="scale-down"
                :preview-src-list="[imgUrl]"/>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>交易信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="应收金额（元）" :value="detailItem.payFeeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="优惠金额（元）" :value="detailItem.discountFeeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="卡面扣费金额（元）	" :value="detailItem.transFeeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易金额（元）" :value="detailItem.feeTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="交易类型" :value="detailItem.tradeTypeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="标签入口状态" :value="detailItem.obuPassStateTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="读取标签入口信息类型" :value="detailItem.obuInfoTypeReadTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="本次写入标签入口信息类型" :value="detailItem.obuInfoTypeWriteTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="标签交易结果	" :value="detailItem.obuTradeResultTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="标签交易流水验证码" :value="detailItem.obuVerifyCode"/></el-col>
            <el-col :span="6"><ti-detail-cell label="计费车型" :value="detailItem.feeVehicleTypeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="计费处理模式" :value="detailItem.rateComputeTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="计费拟合点数" :value="detailItem.rateFitCount"/></el-col>
            <el-col :span="6"><ti-detail-cell label="计费里程数" :value="detailItem.feeMileage"/></el-col>
            <el-col :span="6"><ti-detail-cell label="本省计费起点" :value="detailItem.feeProvBeginHex"/></el-col>
            <el-col :span="6"><ti-detail-cell label="是否修正过" :value="detailItem.isFixDataTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="交易耗时（ms）	" :value="detailItem.consumeTime"/></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
          </el-row>

        </div>
      </el-card>

      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>交易明细</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="交易前标签累计应收金额" :value="detailItem.obupayFeeSumBeforeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后标签累计应收金额" :value="detailItem.obupayFeeSumAfterTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易前标签累计优惠金额	" :value="detailItem.obudiscountFeeSumBeforeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后标签累计优惠金额" :value="detailItem.obudiscountFeeSumAfterTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="交易前标签累计金额" :value="detailItem.obufeeSumBeforeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后标签累计金额" :value="detailItem.obufeeSumAfterTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易前卡片累计金额" :value="detailItem.cardfeeSumBeforeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后卡片累计金额" :value="detailItem.cardfeeSumAfterTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="（省内）交易前标签累计金额	" :value="detailItem.obuProvfeeSumBeforeTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="（省内）交易后标签累计金额" :value="detailItem.obuProvfeeSumAfterTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="（省内）交易前标签累计写入成功数量" :value="detailItem.obuProvTradeSuccNumBefore"/></el-col>
            <el-col :span="6"><ti-detail-cell label="（省内）交易后标签累计写入成功数量" :value="detailItem.obuProvTradeSuccNumAfter"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="交易前标签累计写入成功总量" :value="detailItem.obuTotalTradeSuccNumBefore"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后标签累计写入成功总量" :value="detailItem.obuTotalTradeSuccNumAfter"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易前累计无卡次数" :value="detailItem.noCardTimesBefore"/></el-col>
            <el-col :span="6"><ti-detail-cell label="交易后累计无卡次数" :value="detailItem.noCardTimesAfter"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="本次交易前累计省份数量" :value="detailItem.provinceNumBefore"/></el-col>
            <el-col :span="6"><ti-detail-cell label="本次交易后累计省份数量" :value="detailItem.provinceNumAfter"/></el-col>
            <el-col :span="6"><ti-detail-cell label="本次交易前标签累计里程" :value="detailItem.obuMileageBefore"/></el-col>
            <el-col :span="6"><ti-detail-cell label="本次交易后标签累计里程" :value="detailItem.obuMileageAfter"/></el-col>
          </el-row>

        </div>
      </el-card>

      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>卡片信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="通行介质类型" :value="detailItem.mediaTypeName"/></el-col>
            <el-col :span="6"><ti-detail-cell label="ETC/CPC卡编号" :value="detailItem.cardId"/></el-col>
            <el-col :span="6"><ti-detail-cell label="OBU单/双片标识	" :value="detailItem.obuSignName"/></el-col>
            <el-col :span="6"><ti-detail-cell label="ETC卡类别" :value="detailItem.cpuCardTypeTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="OBU序号编码" :value="detailItem.obuSN"/></el-col>
            <el-col :span="6"><ti-detail-cell label="通行标识ID" :value="detailItem.passId"/></el-col>
            <el-col :span="6"><ti-detail-cell label="单片式OBU/CPC卡电量百分比" :value="detailItem.obuElectrical"/></el-col>
            <el-col :span="6"><ti-detail-cell label="PSAM卡脱机交易序列号" :value="detailItem.terminalTransNo"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="终端机编号" :value="detailItem.terminalNo"/></el-col>
            <el-col :span="6"><ti-detail-cell label="TAC码" :value="detailItem.tac"/></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
          </el-row>

        </div>
      </el-card>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>其他</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="干扰信号" :value="detailItem.interruptSignalName"/></el-col>
            <el-col :span="6"><ti-detail-cell label="算法标识" :value="detailItem.algorithmIdentifierName"/></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
          </el-row>

        </div>
      </el-card>
      <br/>
      <br/>

      <el-row>
        <el-col :offset="11"><el-button @click="close()">关闭</el-button></el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import {detail} from "../gantryTransApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";
  import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
  import {getVehiclePicId} from "../gantryTransApi";

  export default {
    name: 'search.list.gantryTrans.gantryTransDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
        imgUrl:"",
        imageQueryParam:{
          vehiclePicId:'',
          vehiclePlate:'',
          transTime:''
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
      })
    },
    created() {
      this.detail(this.$route.query.tradeId, this.$route.query.transTime);
    },
    methods: {
      detail(tradeId, transTime) {
        this.$nextTick(() => {
          this.loading = true;
          detail(tradeId, transTime).then(res => {
            Object.assign(this.detailItem, res.data);
            //加载图片
            this.initImg(res.data);

            this.loading = false;
          }).catch(() => this.loading = false)
        })
      },
      close(){
        //this.$store.dispatch('name', this.$route)
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        this.$router.go(-1);
      },
      async initImg(data) {
        // this.imageQueryParam.transTime = data.transTime;
        // this.imageQueryParam.vehiclePlate = data.vehiclePlate;

        if (data.vehiclePicId == "" || data.vehiclePicId==null ){
          // this.imageQueryParam.vehiclePicId = 'NONE';
          // data.vehiclePicId = "NONE"
          // console.log("vehiclePicId:", this.imageQueryParam.vehiclePicId)
          let response = {};
         await getVehiclePicId({transTime:data.transTime,vehiclePlate:data.vehiclePlate}).then(res=>{
           response = res;
         });
          this.imageQueryParam.vehiclePicId = response.data ? '':response.data;
        }else{
          this.imageQueryParam.vehiclePicId = data.vehiclePicId;
        }
        //G001544006006040100602020102601010005_frontPic
        let sectionId = data.gantryId.substring(0,11);
        this.imgUrl = 'data:image/jpg;base64,' + (await getImgBase64(sectionId,0,this.imageQueryParam.vehiclePicId + '_' + ImgConstant.gdImgFix.gantryImage)).data;
      }
    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }
</style>
