<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">


      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基本信息</span></div>
        <el-row :gutter="5">
          <el-col :span="12">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="收费站" :value="detailItem.stationTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="车道号" :value="detailItem.tollLaneNo"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="车牌号码" :value="detailItem.vehiclePlateTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="车牌识别流水号" :value="detailItem.vehicleSignId"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="车型" :value="detailItem.vehicleTypeTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="车种" :value="detailItem.vehicleClassTxt"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="特情类型" :value="detailItem.specialTypeTxt"/></el-col>
                <el-col :span="12"><ti-detail-cell label="闯关时间" :value="detailItem.handleTime"/></el-col>

              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="　" value="　" /></el-col>
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
                <el-col :span="12"><ti-detail-cell label="　" value="　"/></el-col>
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

      <el-row>
        <el-col :offset="11"><el-button @click="close()">关闭</el-button></el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import {detail} from "../breakPassRecordApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  import {getImgBase64, getSxImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
  import dictUtils from "@ecip/ecip-web/src/utils/dictUtils";
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";

  export default {
    name: 'search.list.breakPassRecord.breakPassRecordDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
        imgUrl:"",
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
      })
    },
    created() {
      this.detail(this.$route.query.id);
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          console.log(val)
          if(val.name == 'search.list.breakPassRecord.breakPassRecordDetail'){
            this.detail(this.$route.params.id);
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    methods: {
      detail(id) {
        this.$nextTick(() => {
          this.loading = true;
          detail(id).then(res => {
            Object.assign(this.detailItem, res.data);

            //加载图片
            this.initImg(this.detailItem);

            this.loading = false;
          })
        })
      },
      close(){
        //this.$store.dispatch('name', this.$route)
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        this.$router.go(-1);
      },
      async initImg(data) {
        // let proId = dictUtils.getDictLabel('tibms_config', 'local_province', '44');
          //G001544006006040100602020102601010005_frontPic
          this.imgUrl = 'data:image/jpg;base64,' + (await getImgBase64(data.sectionId, data.stationID, data.vehicleSignId + '_' + ImgConstant.gdImgFix.frontPic)).data;
      }
    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }
</style>
