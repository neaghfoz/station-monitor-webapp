<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>机构信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="路段名称" :value="detailItem.roadTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="收费站名称" :value="detailItem.stationTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="车道类型" :value="detailItem.laneTypeName"/></el-col>
            <el-col :span="6"><ti-detail-cell label="车道号" :value="detailItem.laneNo"/></el-col>
          </el-row>
        </div>
      </el-card>

      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基本信息</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="工班日期" :value="detailItem.squadDate"/></el-col>
            <el-col :span="6"><ti-detail-cell label="上班时间" :value="detailItem.beginShiftTime"/></el-col>
            <el-col :span="6"><ti-detail-cell label="下班时间" :value="detailItem.endShiftTime"/></el-col>
            <el-col :span="6"><ti-detail-cell label="工班" :value="detailItem.squadTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="操作员" :value="detailItem.operatorTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
          </el-row>
        </div>
      </el-card>

      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>工班数据</span></div>
        <div>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="总车辆数" :value="detailItem.vehCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="总金额（元）" :value="detailItem.totalMoneyTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="工班流水号	" :value="detailItem.laneShiftSerialNum"/></el-col>
            <el-col :span="6"><ti-detail-cell label="流水记录数" :value="detailItem.listCnt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="发票起始编号" :value="detailItem.invStartID"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发票结束编号" :value="detailItem.invEndID"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发票起始编号2" :value="detailItem.invStartID2"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发票结束编号2" :value="detailItem.invEndID2"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="发票打印总数	" :value="detailItem.invPrintCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="发票金额（元）" :value="detailItem.invPrintMnyTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="废票总数" :value="detailItem.badInVoiceCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="废票金额（元）" :value="detailItem.badInVoiceMnyTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="无卡次数" :value="detailItem.noCardCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="坏卡次数" :value="detailItem.badCardCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
            <el-col :span="6"><ti-detail-cell label=" " /></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="套装ETC交易流量	" :value="detailItem.suitETCCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="套装ETC交易金额（元）" :value="detailItem.suitETCMnyTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="ETC单卡支付流量" :value="detailItem.singleETCCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="ETC单卡支付金额（元）" :value="detailItem.singleETCMnyTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="现金交易流量" :value="detailItem.newCashCnt|numeral('0,0.00')"/></el-col>
            <el-col :span="6"><ti-detail-cell label="现金金额（元）" :value="detailItem.newCachMnyTxt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="移动支付流量" :value="detailItem.mobileCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="移动支付金额（元）" :value="detailItem.mobileMnyTxt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="CPC卡过车数	" :value="detailItem.cpcCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="纸券过车数" :value="detailItem.paperCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="无通行介质过车数" :value="detailItem.noMediaCnt"/></el-col>
            <el-col :span="6"><ti-detail-cell label="闯关车数量" :value="detailItem.breakPassCnt"/></el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="6"><ti-detail-cell label="备用1" :value="detailItem.spare1"/></el-col>
            <el-col :span="6"><ti-detail-cell label="备用2" :value="detailItem.spare2"/></el-col>
            <el-col :span="6"><ti-detail-cell label="备用3" :value="detailItem.spare3"/></el-col>
            <el-col :span="6"><ti-detail-cell label="备用4" :value="detailItem.spare4"/></el-col>
          </el-row>
        </div>
      </el-card>
      <el-row>
        <el-col :offset="11"><el-button @click="close()">关闭</el-button></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import {detail} from "@/views/pro/search/list/laneShift/laneShiftApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"

  export default {
    name: 'sx.search.list.laneShift.laneShiftDetail',
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
          let _this = this;

          detail(id).then(res => {
            Object.assign(_this.detailItem, res.data);
            _this.detailItem.newCachMnyTxt = XEUtils.commafy((XEUtils.toNumber(_this.detailItem.cashMny) - XEUtils.toNumber(_this.detailItem.mobileMny))*0.01, { digits: 2 })
            _this.detailItem.newCashCnt = XEUtils.toNumber(_this.detailItem.cashCnt) - XEUtils.toNumber(_this.detailItem.mobileCnt)
            _this.loading = false;
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
