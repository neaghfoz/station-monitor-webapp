<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">


      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基本信息</span></div>
        <el-row :gutter="5">
          <el-col :span="12">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口流水号" :value="detailItem.id"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="缴费日期" :value="detailItem.exTimeText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口省份" :value="detailItem.exProvinceText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口省份" :value="detailItem.enProvinceText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车道类型" :value="detailItem.exTollLaneTypeText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车道类型" :value="detailItem.enTollLaneTypeText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口收费站" :value="detailItem.exStationText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口收费站" :value="detailItem.enStationText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口路段" :value="detailItem.exRoadText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口路段" :value="detailItem.enRoadText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车道" :value="detailItem.exTollLaneNo"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车道" :value="detailItem.enTollLaneNo"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车道hex" :value="detailItem.exTollLaneHex"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车道hex" :value="detailItem.enTollLaneHex"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口操作员" :value="detailItem.exOperatorText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="出口班次" :value="detailItem.exShiftIDText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口时间" :value="detailItem.exTimeText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口时间" :value="detailItem.enTimeText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车牌" :value="detailItem.exVehiclePlate"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车牌" :value="detailItem.enVehiclePlate"/>
                </el-col>
              </el-row>

              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车牌颜色" :value="detailItem.exVehiclePlateColorText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车牌颜色" :value="detailItem.enVehiclePlateColorText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车种" :value="detailItem.exVehicleClassText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车种" :value="detailItem.enVehicleClassText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口车型" :value="detailItem.exVehicleTypeText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车型" :value="detailItem.enVehicleTypeText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="出口识别车牌" :value="detailItem.exVehIdentifyPlate"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="出口识别车牌颜色" :value="detailItem.exVehIdentifyPlateColorText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="开票标识" :value="detailItem.identificationText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="发票号" :value="detailItem.invoiceID"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="本地特情" :value="detailItem.roadSpecialTypeText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="车牌识别流水号" :value="detailItem.vehicleSignId"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="特情类型" :value="detailItem.specialTypeText"/>
                </el-col>
                <el-col :span="12">
                  <!--                  出口流水表 otherTransvoId字段没有 -->
                  <ti-detail-cell label="冲减流水号"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="车辆状态标识" :value="detailItem.vehicleSignText"/>
                </el-col>
                <el-col :span="12">

                </el-col>
              </el-row>
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
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>费用类型</span></div>
        <div>
          <el-row :gutter="5">
            <!--<el-col :span="6">
              <ti-detail-cell label="交易金额（元）" :value="detailItem.realFeeText"/>
            </el-col>-->
            <el-col :span="6">
              <ti-detail-cell label="折扣金额（元）" :value="detailItem.disCountFeeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="应收金额（实收+优惠，元）" :value="detailItem.payFeeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="卡面扣费金额（元）" :value="detailItem.transFeeText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="交易金额fee（元）" :value="detailItem.feeText"/>
            </el-col>
            <!--<el-col :span="6">
              <ti-detail-cell label="备用1（元）" :value="detailItem.spare1Text"/>
            </el-col>-->
            <el-col :span="6">
              <ti-detail-cell label="兜底费率金额金额(实收+优惠，元)" :value="detailItem.shortFeeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="交易金额占比" :value="detailItem.feeRateText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="OBU交易成功次数" :value="detailItem.OBUtotalCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU累计交易金额（元）" :value="detailItem.totalAmountText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="标签无卡累计次数" :value="detailItem.noCardCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="ETC卡累计交易金额（元）" :value="detailItem.etctotalAmountText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="交易前余额（元）" :value="detailItem.preBalanceText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="交易后余额（元）" :value="detailItem.postBalanceText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="本省累计通行费金额（元）" :value="detailItem.obuProvinceFeeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="费显显示信息" :value="detailItem.feeBoardPlay"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="实际计费方式" :value="detailItem.exitFeeTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="交易类型标识" :value="detailItem.transTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="支付类型" :value="detailItem.payTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="交易服务类型" :value="detailItem.serviceTypeText"/>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="出口交易数据类型" :value="detailItem.transPayTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="移动支付商户号" :value="detailItem.payOrderListNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="移动支付TAC" :value="detailItem.payTac"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="标记状态" :value="detailItem.signStatusText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="路段计费请求发出时间" :value="detailItem.sectionRequestTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="路段计费响应接收时间" :value="detailItem.sectionResponseTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="省中心计费接口号" :value="detailItem.chargingIn"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="省中心计费流水号" :value="detailItem.proChargingSN"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="省中心计费请求接收时间" :value="detailItem.proRequestTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="省中心计费响应接收时间" :value="detailItem.proResponseTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="省中心计费返回码" :value="detailItem.proReturnCode"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="省中心计费返回说明" :value="detailItem.proReturnMemo"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="省中心计费软件版本" :value="detailItem.proChargingVersion"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="计费参数版本号" :value="detailItem.priceVersionGroup"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="部中心计费流水号" :value="detailItem.minChargingSN"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="部中心计费请求时间" :value="detailItem.minRequestTime"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="部中心计费响应时间" :value="detailItem.minResponseTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="全网最小费额计费版本号" :value="detailItem.spcRateVersion"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="计费争议标记" :value="detailItem.disputeFlag"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="计费争议结果记录" :value="detailItem.disputeResult"/>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="计费MAC" :value="detailItem.chargingMac"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="过站信息串" :value="detailItem.passGantrys"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="增加的过站信息串" :value="detailItem.addPassGantrys"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="增加的收费单元串" :value="detailItem.addTollIntervals"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="删除的过站信息串" :value="detailItem.delPassGantrys"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="删除的车牌误别流水号串" :value="detailItem.delVehInfoIds"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="删除的计费扣费交易串" :value="detailItem.delGantryPassIds"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="删除的收费单元串" :value="detailItem.delTollIntervals"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="收费数据明细记录条数" :value="detailItem.detailCnt"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="计费支撑明细" :value="detailItem.tollSupportDetails"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="是否多省交易" :value="detailItem.multiProvinceName"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="通行省份个数" :value="detailItem.provinceCount"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="计费总里程数" :value="detailItem.feeMileage"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="最小费额里程数" :value="detailItem.shortFeeMileage"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="本省交易成功次数" :value="detailItem.provTransCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label=""/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="24">
              <ti-detail-cell label="收费数据明细" :value="detailItem.splitProvinceText"/>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>卡片信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="ETC卡号" :value="detailItem.cardId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="ETC卡类型" :value="detailItem.etcCardTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="出口收费元身份卡ID号" :value="detailItem.exOpCardID"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="卡盒编号" :value="detailItem.cardBoxNo"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="出口CPU卡表面编号" :value="detailItem.exCPUCardSnNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU序号编码" :value="detailItem.obuId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="出口收费员身份卡表面号" :value="detailItem.cardTrunkNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="卡箱编号" :value="detailItem.cardTrunkNo"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="通行标识ID" :value="detailItem.passId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="出口终端机编码" :value="detailItem.terminalNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="单片式OBU/CPC卡电量百分比" :value="detailItem.electricalPercentage"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU单/双片标识" :value="detailItem.obuSignText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="TAC码" :value="detailItem.tac"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="PSAM卡脱机交易序列号" :value="detailItem.terminalTransNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="通行介质类型" :value="detailItem.mediaTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="通行介质编码" :value="detailItem.mediaNo"/>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <br/>
      <br/>
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>计重信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="入口重量（kg）" :value="detailItem.enWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="出口重量（kg）" :value="detailItem.exWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="过称速度" :value="detailItem.passSpeed"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="入口轴数" :value="detailItem.enAxleCount"/>
            </el-col>
          </el-row>
          <el-col :span="6">
            <ti-detail-cell label="出口轴数" :value="detailItem.exAxleCount"/>
          </el-col>
          <el-col :span="6">
            <ti-detail-cell label=""/>
          </el-col>
          <el-col :span="6">
            <ti-detail-cell label=""/>
          </el-col>
          <el-col :span="6">
            <ti-detail-cell label=""/>
          </el-col>

        </div>
      </el-card>
      <br/>
      <br/>
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>其他</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="承载门架编号" :value="detailItem.loadGantryId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="程序版本号" :value="detailItem.appVer"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车辆数" :value="detailItem.vehCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="算法标识" :value="detailItem.algorithmIdentifierText"/>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <br/>
      <br/>

      <el-row>
        <el-col :offset="9">
          <el-button type="primary" @click="goLaneOpLogView()">车道操作日志查询</el-button>
          <el-button @click="pre()">上一条</el-button>
          <el-button @click="next()">下一条</el-button>
          <el-button @click="close()">关闭</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import {detail, findDetailKeyList} from "../laneExListApi"
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import ImgConstant from "@/views/pro/common/constant/ImgConstant";
import {getImgBase64, getSxImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";
import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi";

export default {
  name: 'search.list.laneExList.laneExListDetail',
  components: {TiDetailCell},
  mixins: [...mixin],
  data() {
    return {
      loading: false, // 页面加载遮罩
      detailItem: {},
      imgUrl: "",
      index: 0,
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
    })
  },
  created() {
    this.url = XEUtils.clone(window.location.href, true)
    this.tempdata = this.$store.getters['cache/getTempdataItem'](this.$route.query.detailId)
    this.detail(this.$route.query.id, this.$route.query.exTime);
    if (!this.tempdata) {
      let id = this.getQueryString('realId')
      let exTime = this.getQueryString('realExTime')
      this.tempdata = {
        curIndex: 'id0',
        idJson: {'id0': {id: id, exTime: exTime}},
        idJsonAll: {'id0': {id: id, exTime: exTime}}
      }
    } else if (!this.tempdata.idJsonAll) {
      findDetailKeyList(this.tempdata.queryParams).then(res => {
        this.tempdata.idJsonAll = {};
        res.data.forEach((x, i) => {
          this.tempdata.idJsonAll['id' + XEUtils.toString(i)] = {id: x.id, exTime: x.exTime}
        })
      })
    }
  },
  beforeDestroy() {
    delete this.tempdata.idJsonAll
  },
  methods: {
    detail(id, exTime) {
      this.$nextTick(() => {

        this.loading = true;

        if (this.tempdata) {
          let obj = this.tempdata.idJson[this.tempdata.curIndex] || this.tempdata.idJsonAll[this.tempdata.curIndex]
          id = obj.id
          exTime = obj.exTime
        }

        //url记录当前的id信息
        if (this.url.lastIndexOf('&realId')>-1){
          this.url = this.url.replace(this.url.substr(this.url.lastIndexOf('&realId'),this.url.length),'')
        }
        window.location = this.url + '&realId=' + id + '&realExTime=' + encodeURIComponent(exTime)
        this.$route.query.realId = id
        this.$route.query.realExTime = exTime

        this.index--

        detail(id, exTime).then(res => {
          Object.assign(this.detailItem, res.data);

          //加载图片
          this.initImg(this.detailItem);

          this.loading = false;
        }).catch(() => this.loading = false)
      })
    },
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.href.substr(1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      };
      return null;
    },
    close() {
      //this.$store.dispatch('name', this.$route)
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
      let lastTag = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length-1]
      this.$router.push(lastTag?lastTag.fullPath:'/')
    },
    async initImg(data) {
      let proId = dictUtils.getDictLabel('tibms_config', 'local_province', '44');
      if (proId == 14) {
        this.imgUrl = 'data:image/jpg;base64,' + (await getSxImgBase64(
            {roadId: data.exSectionId, stationId: data.exStationID}
            , {picId: data.vehicleSignId, picTime: data.exTime ? data.exTime.replace(' ', 'T') : null, vehiclePlate: null, gantryId: null, imgType: "1"})
        ).data;
      } else {
        //G001544006006040100602020102601010005_frontPic
        this.imgUrl = 'data:image/jpg;base64,' + (await getImgBase64(data.exSectionId, data.exStationID, data.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }
    },
    async goLaneOpLogView() {
      var {data} = await tiSysOrgApi.findByEntity({stationId: this.detailItem.exStationID});
      this.$router.push({
        path: '/search/list/laneExList/vehNotes/' + Date.parse(new Date()),
        query: {
          sysOrgIdStr: data[0].id,
          laneNo: this.detailItem.exTollLaneNo,
          opTime: this.detailItem.exTime
        }
      });
    },
    pre() {
      let curIndex = XEUtils.toInteger(this.tempdata.curIndex.replace('id', ''))
      curIndex--
      if (curIndex < 0) {
        curIndex++
        this.tempdata.curIndex = 'id' + XEUtils.toString(curIndex)
        this.$alert("已经是第一条数据")
      } else {
        this.tempdata.curIndex = 'id' + XEUtils.toString(curIndex)
        this.detail();
      }
    },
    next() {
      let curIndex = XEUtils.toInteger(this.tempdata.curIndex.replace('id', ''))
      curIndex++
      if (curIndex >= Object.keys(this.tempdata.idJsonAll || this.tempdata.idJson).length) {
        curIndex--
        this.tempdata.curIndex = 'id' + XEUtils.toString(curIndex)
        this.$alert("已经是最后一条数据")
      } else {
        this.tempdata.curIndex = 'id' + XEUtils.toString(curIndex)
        this.detail();
      }
    }
  }
}
</script>

<style scoped>
.baseInfoHeight {
  height: var(--baseInfoHeight);
}
</style>
