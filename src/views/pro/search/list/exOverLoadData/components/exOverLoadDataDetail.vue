<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>出口称重超重信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="路段信息" :value="detailItem.roadText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="站信息" :value="detailItem.exStationText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="称重检测设备编号" :value="detailItem.equipCode"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="检测时间" :value="detailItem.checkTime"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="车牌号码/颜色" :value="detailItem.vehicleIdText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车型" :value="detailItem.vehicleTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车货总质量(千克)" :value="detailItem.weight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车辆轴数" :value="detailItem.alexCount"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="车速(km/h)" :value="detailItem.speed"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="最大允许总质量(千克)" :value="detailItem.limitWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="超限量(千克)" :value="detailItem.overWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="超限超载率(%)" :value="detailItem.overRateText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">

            <el-col :span="6">
              <ti-detail-cell label="是否为大件运输车辆" :value="detailItem.isBulkVehicleText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="大件运输许可证号" :value="detailItem.certNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="是否为黑名单车辆" :value="detailItem.isBlackvehicleText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="入口收费站" :value="detailItem.enStationName"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">

            <el-col :span="6">
              <ti-detail-cell label="入口时间" :value="detailItem.enTime"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="入口车货总质量(千克)" :value="detailItem.enWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="入口车辆轴数" :value="detailItem.enAlexCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label=""/>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>图片视频信息</span></div>
        <el-row :gutter="5">
          <el-col :span="8">
            <div>
              <div class="imageButton">
                <div style="float: left;height: 40px;width: 60%;">
                  <div class='page-header'>
                    <h3>
                      <span>入口车牌图片</span>
                    </h3>
                  </div>
                </div>
                <div class="downLoadImage">
                  <el-button type="primary" ng-click="saveImage(1)" id="saveVehPic2">保存图片
                  </el-button>
                </div>
              </div>
              <div id="vehPicContent0" style="width: 100%; height: 90%;">
                <div ref="baseInfoImg2" class="baseInfoHeight">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="imgUrlOverloadEnVeh"
                    fit="scale-down"
                    :preview-src-list="[imgUrlOverloadEnVeh]"
                  />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="imageButton">
                <div style="float: left;height: 40px;width: 60%;">
                  <div class='page-header'>
                    <h3>
                      <span>入口车辆正面照</span>
                    </h3>
                  </div>
                </div>
                <div class="downLoadImage">
                  <el-button type="primary" ng-click="saveImage(1)" id="saveVehPic">保存图片
                  </el-button>
                </div>
              </div>
              <div id="vehPicContent" style="width: 100%; height: 90%;">
                <div ref="baseInfoImg2" class="baseInfoHeight">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="imgUrlOverloadEnFront"
                    fit="scale-down"
                    :preview-src-list="[imgUrlOverloadEnFront]"/>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="imageButton">
                <div style="float: left;height: 40px;width: 60%;">
                  <div class='page-header'>
                    <h3>
                      <span>入口视频记录</span>
                    </h3>
                  </div>
                </div>
                <div class="downLoadImage">
                  <el-button type="primary" ng-click="saveImage(1)" id="saveVehPic1">保存图片
                  </el-button>
                </div>
              </div>
              <div id="vehPicContent1" style="width: 100%; height: 90%;">
                <div ref="baseInfoImg2" class="baseInfoHeight">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="imgUrlOverloadEnVideo"
                    fit="scale-down"
                    :preview-src-list="[imgUrlOverloadEnVideo]"/>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <div>
              <div class="imageButton">
                <div style="float: left;height: 40px;width: 60%;">
                  <div class='page-header'>
                    <h3>
                      <span>入口车辆侧面照</span>
                    </h3>
                  </div>
                </div>
                <div class="downLoadImage">
                  <el-button type="primary" ng-click="saveImage(1)" id="saveVehPic3">保存图片
                  </el-button>
                </div>
              </div>
              <div id="vehPicContent3" style="width: 100%; height: 90%;">
                <div ref="baseInfoImg2" class="baseInfoHeight">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="imgUrlOverloadEnLateral"
                    fit="scale-down"
                    :preview-src-list="[imgUrlOverloadEnLateral]"/>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="imageButton">
                <div style="float: left;height: 40px;width: 60%;">
                  <div class='page-header'>
                    <h3>
                      <span>入口车辆尾部照</span>
                    </h3>
                  </div>
                </div>
                <div class="downLoadImage">
                  <el-button type="primary" ng-click="saveImage(1)" id="saveVehPic4">保存图片
                  </el-button>
                </div>
              </div>
              <div id="vehPicContent4" style="width: 100%; height: 90%;">
                <div ref="baseInfoImg2" class="baseInfoHeight">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="imgUrlOverloadEnTail"
                    fit="scale-down"
                    :preview-src-list="[imgUrlOverloadEnTail]"/>
                </div>
              </div>
            </div>
          </el-col>

        </el-row>
      </el-card>

      <el-row>
        <el-col :offset="11">
          <el-button @click="close()">关闭</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import {detail} from "../exOverLoadDataApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";
  import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";

  export default {
    name: 'search.list.exOverLoadData.exOverLoadDataDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
        imgUrlOverloadEnVeh: "",
        imgUrlOverloadEnFront: "",
        imgUrlOverloadEnVideo: "",
        imgUrlOverloadEnLateral: "",
        imgUrlOverloadEnTail: ""
      }
    },
    mounted() {
      this.$nextTick(function () {
        //this.$refs.baseInfoImg1.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
        //this.$refs.baseInfoImg2.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')

      })
    },
    created() {
      this.detail(this.$route.query.hgSeq, this.$route.query.enTolllaneId, this.$route.query.checkTimeText);
    },
    methods: {
      detail(hgSeq, enTollLaneId, checkTimeText) {
        this.$nextTick(() => {
          this.loading = true;
          detail(hgSeq, enTollLaneId, checkTimeText).then(res => {
            Object.assign(this.detailItem, res.data);
            this.initImg(this.detailItem);
            this.loading = false;
          })
        })
      },
      close() {
        //this.$store.dispatch('name', this.$route)
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        this.$router.go(-1);
      },
      async initImg(data) {
        // * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnFrontPic"   imgUrlOverloadEnFront
        // * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnLateralPic" imgUrlOverloadEnLateral
        // * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnTailPic"    imgUrlOverloadEnTail
        // * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnVehPic"     imgUrlOverloadEnVeh
        // * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnVideo"      imgUrlOverloadEnVideo
        this.imgUrlOverloadEnFront =
          'data:image/jpg;base64,' +
          (await getImgBase64(data.sectionId, data.enStationId, data.enTollLaneid + data.checkTimeText + '_' + ImgConstant.gdImgFix.overloadEnFrontPic)).data;
        this.imgUrlOverloadEnLateral =
          'data:image/jpg;base64,' +
          (await getImgBase64(data.sectionId, data.enStationId, data.enTollLaneid + data.checkTimeText + '_' + ImgConstant.gdImgFix.overloadEnLateralPic)).data;
        this.imgUrlOverloadEnTail =
          'data:image/jpg;base64,' +
          (await getImgBase64(data.sectionId, data.enStationId, data.enTollLaneid + data.checkTimeText + '_' + ImgConstant.gdImgFix.overloadEnTailPic)).data;
        this.imgUrlOverloadEnVeh =
          'data:image/jpg;base64,' +
          (await getImgBase64(data.sectionId, data.enStationId, data.enTollLaneid + data.checkTimeText + '_' + ImgConstant.gdImgFix.overloadEnVehPic)).data;
        this.imgUrlOverloadEnVideo =
          'data:video/mp4;base64,' +
          (await getImgBase64(data.sectionId, data.enStationId, data.enTollLaneid + data.checkTimeText + '_' + ImgConstant.gdImgFix.overloadEnVideo)).data;

      }
    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }

  .hiddenClass {
    visibility: hidden;

  }
</style>


<style>
  #pic {
    margin-right: 55%;
  }

  .col-md-1_5 {
    width: 17.111111%;
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    float: left;
  }

  .col-md-1_6 {
    width: 11.111111%;
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    float: left;
  }

  .col-md-10_5 {
    width: 80.888889%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    float: left;
  }

  #qq {
    width: 100%;
    border: rgb(221, 221, 221) 2px double;
  }

  #right {
    text-align: right;
  }

  #left {
    text-align: left;
  }

  .col-md-8 {
    padding-left: 0px;
  }

  .form-group textarea.noticeBillNo {
    word-wrap: break-word;
    padding: 6px 12px;
    min-height: 20px;
    width: 100%;
  }

  .col-md-offset-5 {
    margin-left: 37.66666667%;
  }

  #messageLeft {
    float: left;
    width: 50%;
  }

  #messageRight {
    float: left;
    width: 50%;
  }

  .black_overlay {
    display: none;
    position: absolute;
    top: 0%;
    left: 0%;
    width: 300px;
    height: 100%;
    z-index: 99999999999;
    opacity: .70;
  }

  #showPopUpPic {
    display: none;
    position: absolute;
    left: 20%;
    width: 40%;
    height: 610px;
    padding: 16px;
    z-index: 9999999999;
    border: 1px solid rgb(193, 193, 193);
    cursor: pointer;
    margin-left: 25%;
  }

  .page-header {
    padding-bottom: 9px;
    border-bottom: 1px #eee;
  }

  .form-bordered:not(.form-bordered-3) .form-body {
    margin: 0;
    padding: 0;
    /* border: 1px solid #cacaca; */
    border-bottom: none;
  }

  #imgDiv {
    width: 100%;
    height: 680px;
    border: 1px solid #cacaca;
  }

  #imageDiv {
    width: 60%;
    height: 680px;
    float: left;
  }

  #vehPicDiv {
    width: 48%;
    height: 320px;
    float: left;
  }

  #frontPicDiv {
    width: 48%;
    height: 320px;
    float: left;
    margin-left: 20px;
  }

  #lateralPicDiv {
    width: 48%;
    height: 320px;
    float: left;
    margin-top: 10px;
  }

  #tailPicDiv {
    width: 48%;
    height: 320px;
    float: left;
    margin-left: 20px;
    margin-top: 10px;
  }

  #videoDiv {
    width: 40%;
    height: 680px;
    float: left;
    /*border: double red 3px;*/
  }

  .downLoadImage {
    /* margin-left: 40%;*/
    height: 40px;
    width: 30%;
    margin-right: 5px;
    float: right;
    margin-top: 2%;
  }

  .imageButton {
    height: 40px;
    width: 100%;
  }

</style>
