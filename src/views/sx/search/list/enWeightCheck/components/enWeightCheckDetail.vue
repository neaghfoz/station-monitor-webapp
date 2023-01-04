<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>入口治超流水详情</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="路段信息" :value="detailItem.roadText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="收费站" :value="detailItem.stationText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="治超时间" :value="detailItem.hspTimeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车牌号码" :value="detailItem.vehicleIdText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="车型" :value="detailItem.vehicleTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="轴型" :value="detailItem.axleType"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="轴数" :value="detailItem.axleSum"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="总重(kg)" :value="detailItem.totalWeight"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="限重(kg)" :value="detailItem.overLimited"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="超限量(kg)" :value="detailItem.overWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="超载率(%)" :value="detailItem.overRateText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="是否大件运输车" :value="detailItem.isBulkVehicleText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="大件运输许可证" :value="detailItem.certNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="是否黑名单" :value="detailItem.isBlackvehicleText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="是否允许通行" :value="detailItem.allowPassText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="特殊事件" :value="detailItem.spEventText"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <div style="width: 100%">
                <div class="el-form-item el-form-item--small" style="width: 100%;border: 1px solid #ebebeb ;margin-bottom: 5px;" :title="value">
                  <label class="el-form-item__label" ref="label" style="background: #faf8f8;width:20.5%;height: 180px;text-align: right;line-height: 180px;">车辆正面照</label>
                  <div style="width:79.5%;height: 180px;padding-left: 0px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
                    <el-image
                      style="width: 100%; height: 100%;text-align: center"
                      :src="frontImageUrl"
                      fit="scale-down"
                      :preview-src-list="[frontImageUrl]"/>
                  </div>
                </div>
              </div>
            </el-col>
              <el-col :span="12">
                <div style="width: 100%">
                  <div class="el-form-item el-form-item--small" style="width: 100%;border: 1px solid #ebebeb ;margin-bottom: 5px;" :title="value">
                    <label class="el-form-item__label" ref="label" style="background: #faf8f8;width:20.5%;height: 180px;text-align: right;line-height: 180px;">车辆侧面照</label>
                    <div style="width:79.5%;height: 180px;padding-left: 0px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
                      <el-image
                        style="width: 100%; height: 100%;text-align: center"
                        :src="sideImageUrl"
                        fit="scale-down"
                        :preview-src-list="[sideImageUrl]"/>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

          <el-row :gutter="5">
            <el-col :span="12">
              <div style="width: 100%">
                <div class="el-form-item el-form-item--small" style="width: 100%;border: 1px solid #ebebeb ;margin-bottom: 5px;" :title="value">
                  <label class="el-form-item__label" ref="label" style="background: #faf8f8;width:20.5%;height: 180px;text-align: right;line-height: 180px;">车辆尾部照</label>
                  <div style="width:79.5%;height: 180px;padding-left: 0px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
                    <el-image
                      style="width: 100%; height: 100%;text-align: center"
                      :src="backImageUrl"
                      fit="scale-down"
                      :preview-src-list="[backImageUrl]"/>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="width: 100%">
                <div class="el-form-item el-form-item--small" style="width: 100%;border: 1px solid #ebebeb ;margin-bottom: 5px;" :title="value">
                  <label class="el-form-item__label" ref="label" style="background: #faf8f8;width:20.5%;height: 180px;text-align: right;line-height: 180px;">检测视频</label>
                  <div style="width:79.5%;height: 180px;padding-left: 0px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
                    <el-image
                      style="width: 100%; height: 100%;text-align: center"
                      :src="videoUrl"
                      fit="scale-down"
                      :preview-src-list="[videoUrl]" v-if="videoDefaultShow"/>

                    <video :src="videoUrl" controls  style="width: 100%; height: 100%;text-align: center" v-if="!videoDefaultShow"></video>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

        </div>
      </el-card>
      <el-row>
        <el-col :offset="9">
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
  import {detail, getImgBase64, findDetailKeyList} from "../enWeightCheckApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";

  export default {
    name: 'search.list.enWeightCheck.enWeightCheckDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
        frontImageUrl: "",
        sideImageUrl: "",
        backImageUrl: "",
        videoUrl: "",
        videoDefaultShow: false
      }
    },
    mounted() {
      this.$nextTick(function () {
        //this.$refs.baseInfoImg1.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
        //this.$refs.baseInfoImg2.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')

      })
    },
    beforeDestroy() {
      delete this.tempdata.idJsonAll
    },
    created() {

      this.url = XEUtils.clone(window.location.href,true)
      this.tempdata = this.$store.getters['cache/getTempdataItem'](this.$route.query.detailId)
      this.detail(this.$route.query.id, this.$route.query.hspTime);
      if (!this.tempdata) {
        let id = this.getQueryString('realId')
        let hspTime = this.getQueryString('realTime')
        this.tempdata = {
          curIndex: 'id0',
          idJson: {'id0': {id: id, time: hspTime}},
          idJsonAll: {'id0': {id: id, time: hspTime}}
        }
      } else if (!this.tempdata.idJsonAll) {
        this.detail(this.$route.query.listNo, this.$route.query.hspTime);
        try {
          findDetailKeyList(this.tempdata.queryParams).then(res => {
            this.tempdata.idJsonAll = {};
            res.data.forEach((x, i) => {
              this.tempdata.idJsonAll['id' + XEUtils.toString(i)] = {id: x.realId, time: x.realTime}
            })
          })
        } catch (e) {
          console.log(e)
          this.loading = false;
        }

      }
    },
    methods: {
      detail(listNo, hspTime) {
        this.$nextTick(() => {
          this.loading = true;

          if (this.tempdata) {
            let obj = this.tempdata.idJson[this.tempdata.curIndex] || this.tempdata.idJsonAll[this.tempdata.curIndex]
            listNo = obj.id
            hspTime = obj.time
          }
          //url记录当前的id信息
          if (this.url.lastIndexOf('&realId')>-1){
            this.url = this.url.replace(this.url.substr(this.url.lastIndexOf('&realId'),this.url.length),'')
          }
          window.location = this.url + '&realId=' + listNo + '&realTime=' + encodeURIComponent(hspTime)
          this.$route.query.realId = listNo
          this.$route.query.realTime= hspTime


          detail(listNo, hspTime).then(res => {
            Object.assign(this.detailItem, res.data);
            this.initImg(this.detailItem);
            this.loading = false;
          })
        })
      },
      async initImg(data) {

        var enWeightCheckMedia = data['enWeightCheckMedia']


            if (enWeightCheckMedia) {
              this.getImg('frontImageUrl', enWeightCheckMedia['frontImage'], 'nullImg.png' )
              this.getImg('sideImageUrl', enWeightCheckMedia['sideImage'], 'nullImg.png' )
              this.getImg('backImageUrl', enWeightCheckMedia['backImage'], 'nullImg.png' )
              this.getImg('videoUrl', enWeightCheckMedia['video'], 'nullVideo.png' )

            } else  {
              this['frontImageUrl']='/img/nullImg.png'
              this['sideImageUrl']='/img/nullImg.png'
              this['backImageUrl']='/img/nullImg.png'
              this['videoUrl']='/img/nullVideo.png'
            }
      },
      getImg(elImageurl, url, defaultPng) {
        if (!defaultPng) {
          defaultPng = 'nullImg.png'
        }
        this.videoDefaultShow = false
        if(!url) {
          this[elImageurl] = '/img/' + defaultPng;
          if (elImageurl == 'videoUrl') {
            this.videoDefaultShow = true
          }
          return
        }
        var temBase64 = ""
        try {
            getImgBase64({'imgUrl': url}).then(res => {
              if (res.code == 200) {
                temBase64 = res.data
                if (temBase64) {
                  if (elImageurl == 'videoUrl') {
                    this[elImageurl] = 'data:video/mp4;base64,' + temBase64
                  } else {
                    this[elImageurl] = 'data:image/jpg;base64,' + temBase64
                  }

                } else {
                  this[elImageurl] ='/img/' + defaultPng
                }
              } else {
                this[elImageurl]='/img/' + defaultPng
              }
            })
        } catch (e) {
          console.log(e)
          this.frontImageUrl ='/img/' + defaultPng
        }
      },
      close() {
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        let lastTag = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length-1]
        this.$router.push(lastTag?lastTag.fullPath:'/')
      },
      getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.href.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        };
        return null;
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

  .hiddenClass {
    visibility: hidden;

  }
</style>


<style scoped>
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


  .app-container {
    padding-top: 10px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    padding-bottom: 10px !important;
  }


</style>
