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
                  <ti-detail-cell label="入口路段" :value="detailItem.enRoadText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="流水号" :value="detailItem.id"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="入口收费站" :value="detailItem.enStationText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口路网" :value="detailItem.enNetRoadID"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="车道号" :value="detailItem.enTollLaneNo"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="自然日" :value="detailItem.naturalDate"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="车道类型" :value="detailItem.enTollLaneType"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口收费车型" :value="detailItem.enVehicleTypeText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="入口车道hex" :value="detailItem.enTollLaneHex"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="车种" :value="detailItem.enVehicleClassText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="收费员姓名" :value="detailItem.enOperatorText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口车牌" :value="detailItem.enVehiclePlateText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="入口时间" :value="detailItem.enTime"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口识别车牌" :value="detailItem.enIdentifyVehiclePlateText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="工班日" :value="detailItem.squadDate"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="入口ETC卡车牌" :value="detailItem.enCardVehPlate"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="班次" :value="detailItem.enShiftIDText"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="标志状态" :value="detailItem.signStatusText"/>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <ti-detail-cell label="承载门架编号"/>
                </el-col>
                <el-col :span="12">
                  <ti-detail-cell label="　"/>
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
        <div slot="header" class="clearfix"><span>计重和交易信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="入口重量（kg）" :value="detailItem.enWeight"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="入口轴数" :value="detailItem.enAxleCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="车辆数" :value="detailItem.vehCount"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="卡面扣费金额（元）" :value="detailItem.transFee"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="交易类型标识" :value="detailItem.transTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="　"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="　"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="　"/>
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
              <ti-detail-cell label="入口TAC码" :value="detailItem.tac"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="通行标识ID" :value="detailItem.passId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="通行介质类型" :value="detailItem.mediaTypeText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="卡盒号" :value="detailItem.cardBoxNo"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="CPC/ETC卡号" :value="detailItem.cardId"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU标识" :value="detailItem.obuSignText"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU/CPC卡电量" :value="detailItem.electricalPercentage"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="身份卡表面号" :value="detailItem.enOpCardNo"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="卡箱编号" :value="detailItem.cardTrunkNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="身份卡ID" :value="detailItem.enOpCardID"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="PSAM卡交易序列号" :value="detailItem.terminalTransNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="OBU编码" :value="detailItem.obuId"/>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>其他</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6">
              <ti-detail-cell label="车道程序版本号" :value="detailItem.appVer"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="终端机编号" :value="detailItem.terminalNo"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="　"/>
            </el-col>
            <el-col :span="6">
              <ti-detail-cell label="　"/>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="24">
              <ti-detail-cell label="特情类型" :label-widh-per="10.3" :value="detailItem.specialTypeText"/>
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
import {detail, findDetailKeyList} from "../laneEnListApi"
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import ImgConstant from "@/views/pro/common/constant/ImgConstant";
import {getImgBase64, getSxImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";
import tiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi";

export default {
  name: 'search.list.laneEnList.laneEnListDetail',
  components: {TiDetailCell},
  mixins: [...mixin],
  data() {
    return {
      loading: false, // 页面加载遮罩
      detailItem: {},
      imgUrl: "",
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
    })
  },
  created() {
    this.url = XEUtils.clone(window.location.href,true)
    this.tempdata = this.$store.getters['cache/getTempdataItem'](this.$route.query.detailId)
    this.detail(this.$route.query.id, this.$route.query.enTime);
    if (!this.tempdata) {
      let id = this.getQueryString('realId')
      let enTime = this.getQueryString('realEnTime')
      this.tempdata = {
        curIndex: 'id0',
        idJson: {'id0': {id: id, enTime: enTime}},
        idJsonAll: {'id0': {id: id, enTime: enTime}}
      }
    } else if (!this.tempdata.idJsonAll) {
      findDetailKeyList(this.tempdata.queryParams).then(res => {
        this.tempdata.idJsonAll = {};
        res.data.forEach((x, i) => {
          this.tempdata.idJsonAll['id' + XEUtils.toString(i)] = {id: x.id, enTime: x.enTime}
        })
      })
    }
  },
  beforeDestroy() {
    delete this.tempdata.idJsonAll
  },
  // 监听,当路由发生变化的时候执行,由于该页面打开的情况下，、
  //修改路由信息不触发created的内容需通过监听路由的操作执行created中的方法
  // watch: {
  //   $route: {
  //     handler: function(val, oldVal){
  //       console.log(val)
  //       if(val.name == 'search.list.laneEnList.laneEnListDetail'){
  //         this.detail(this.$route.query.id, this.$route.query.enTime);
  //       }
  //     },
  //     // 深度观察监听
  //     deep: true
  //   }
  // },
  methods: {
    detail(id, enTime) {
      this.$nextTick(() => {
        this.loading = true;

        if (this.tempdata) {
          let obj = this.tempdata.idJson[this.tempdata.curIndex] || this.tempdata.idJsonAll[this.tempdata.curIndex]
          id = obj.id
          enTime = obj.enTime
        }
        //url记录当前的id信息
        if (this.url.lastIndexOf('&realId')>-1){
          this.url = this.url.replace(this.url.substr(this.url.lastIndexOf('&realId'),this.url.length),'')
        }
        window.location = this.url + '&realId=' + id + '&realEnTime=' + encodeURIComponent(enTime)
        this.$route.query.realId = id
        this.$route.query.realEnTime = enTime

        detail(id, enTime).then(res => {
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
      // this.$router.go(-1);
    },
    async initImg(data) {
      let proId = dictUtils.getDictLabel('tibms_config', 'local_province', '44');
      if (proId == 14) {
        this.imgUrl = 'data:image/jpg;base64,' + (await getSxImgBase64(
            {roadId: data.enSectionId, stationId: data.enStationId}
            , {picId: data.vehicleSignId, picTime: data.enTime ? data.enTime.replace(' ', 'T') : null, vehiclePlate: null, gantryId: null, imgType: "1"})
        ).data;
      } else {
        //G001544006006040100602020102601010005_frontPic
        this.imgUrl = 'data:image/jpg;base64,' + (await getImgBase64(data.enSectionId, data.enStationId, data.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }
    },
    async goLaneOpLogView() {
      var {data} = await tiSysOrgApi.findByEntity({stationId: this.detailItem.enStationId});
      this.$router.push({
        path: '/search/list/laneEnList/vehNotes/' + Date.parse(new Date()),
        query: {
          sysOrgIdStr: data[0].id,
          laneNo: this.detailItem.enTollLaneNo,
          opTime: this.detailItem.enTime
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
