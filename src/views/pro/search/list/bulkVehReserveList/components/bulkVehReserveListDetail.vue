<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>预约大件运输名单详情</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="大件运输许可证号" :value="detailItem.certNo"/></el-col>
            <el-col :span="6"><ti-detail-cell label="牵引车车牌号" :value="detailItem.tractorVehiclePlateTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="挂车车牌号" :value="detailItem.trailerVehiclePlateTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发证单位" :value="detailItem.orgUnit"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="承运单位名称" :value="detailItem.carriorUnit"/></el-col>
            <el-col :span="6"><ti-detail-cell label="货物名称" :value="detailItem.goodsInfo"/></el-col>
            <el-col :span="6"><ti-detail-cell label="车货总质量(KG)" :value="detailItem.weight"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发证日期" :value="detailItem.certificationDate"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="车货总长度（m）" :value="detailItem.lengthTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="车货总宽度（m）" :value="detailItem.widthTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="车货总高度（m）" :value="detailItem.heightTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="  "/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="轴数" :value="detailItem.alexCount"/></el-col>
            <el-col :span="6"><ti-detail-cell label="轮胎数" :value="detailItem.tyleCount"/></el-col>
            <el-col :span="6"><ti-detail-cell label="各车轴轴荷" :value="detailItem.alexsLoad"/></el-col>
            <el-col :span="6"><ti-detail-cell label="  "/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="入口收费站" :value="detailItem.enStationTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="出口收费站" :value="detailItem.exStationTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="起始通行日期" :value="detailItem.startPassDate"/></el-col>
            <el-col :span="6"><ti-detail-cell label="结束通行日期" :value="detailItem.endPassDate"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="通行次数" :value="detailItem.passCount"/></el-col>
            <el-col :span="6"><ti-detail-cell label="通行路线说明" :value="detailItem.descName"/></el-col>
            <el-col :span="6"><ti-detail-cell label="途径省份" :value="detailItem.provinceTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="  "/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="24"><ti-detail-cell label="通行路线" :label-widh-per="10.3" :value="detailItem.roads"/></el-col>
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
  import {detail} from "../bulkVehReserveListApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"

  export default {
    name: 'search.list.bulkVehReserveList.bulkVehReserveListDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
       // imgUrl:"",
      }
    },
    mounted() {
      this.$nextTick(function () {
      //  this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
      })
    },
    created() {
      this.detail(this.$route.query.id);
    },
    methods: {
      detail(id) {
        this.$nextTick(() => {
          this.loading = true;
          detail(id).then(res => {
            Object.assign(this.detailItem, res.data);
            this.loading = false;
          })
        })
      },
      close(){
        //this.$store.dispatch('name', this.$route)
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }
</style>
