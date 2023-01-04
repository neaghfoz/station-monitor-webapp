<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="detailItem">

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>基础数据</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="收费车道编号" :value="detailItem.laneId"/></el-col>
                <el-col :span="8"><ti-detail-cell label="数据日期" :value="detailItem.heatVersion"/></el-col>
                <el-col :span="8"><ti-detail-cell label="采集时间" :value="detailItem.gatherTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="进入车道车辆数" :value="laneBaseDatas.enterLaneVehNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="发现标签数" :value="laneBaseDatas.obuCaptureNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="读标签成功数" :value="laneBaseDatas.businessRefuseNum"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="读卡成功数" :value="laneBaseDatas.obuTradeableNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="物理失败车辆数" :value="laneBaseDatas.physicalFailVehNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="业务拒绝车辆数" :value="laneBaseDatas.obuTradeableNum"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="可交易标签数" :value="laneBaseDatas.obuTradeableNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="交易成功数" :value="laneBaseDatas.tradeSucNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="一次交易成功数" :value="laneBaseDatas.onceTradeSucNum"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="远区交易成功数" :value="laneBaseDatas.farSecTradeSucNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="近区交易成功数" :value="laneBaseDatas.nearSecTradeSucNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="扣款交易成功数" :value="laneBaseDatas.deductSucNum"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="扣费失败数" :value="laneBaseDatas.deductFailNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="交易失败" :value="laneBaseDatas.tradeFailNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="发起交易数" :value="laneBaseDatas.initiatedTransNum"/></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>特情信息</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
<!--                <el-col :span="8"><ti-detail-cell label="特情类型" :value="detailItem.id"/></el-col>-->
<!--                <el-col :span="8"><ti-detail-cell label="特情数量" :value="detailItem.exTimeText"/></el-col>-->
                <vxe-grid
                  border
                  show-overflow
                  highlight-hover-row
                  class="reverse-table"
                  :show-header="false"
                  :columns="tableColumnSpecialInfos"
                  :data="tableDataSpecialInfos"></vxe-grid>
              </el-row>



            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>性能信息</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="平均车速" :value="performances.avgSpeed"/></el-col>
                <el-col :span="8"><ti-detail-cell label="最大车速" :value="performances.maxSpeed"/></el-col>
                <el-col :span="8"><ti-detail-cell label="平均天线核心交易时间" :value="performances.avgAntennaTradeTime"/></el-col>

              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="地感延迟次数" :value="performances.groundSeDelayTimes"/></el-col>
                <el-col :span="8"><ti-detail-cell label="地感延迟耗时" :value="performances.groundSeDeElpTimes"/></el-col>
                <el-col :span="8"><ti-detail-cell label="" :value="detailItem.empty"/></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>车牌识别</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="牌识准确数" :value="vehicleIdentities.plateIdentifySucNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="牌识捕获数" :value="vehicleIdentities.plateCaptureSucNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="" :value="detailItem.exTimeText"/></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>小时车流量</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <vxe-grid
                  border
                  show-overflow
                  highlight-hover-row
                  class="reverse-table"
                  :show-header="false"
                  :columns="tableColumnHourTraffics"
                  :data="tableDataHourTraffics"></vxe-grid>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>天线帧</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="是否透传" :value="antennas.transMode"/></el-col>
                <el-col :span="8"><ti-detail-cell label="FB2耗时" :value="antennas.btwoBFiveElpTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="B2错误标签数" :value="antennas.obuBTwoErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B2错误次数" :value="antennas.btwoErrrorNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B2-B3耗时" :value="antennas.btwoBThrElpTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="B3错误标签数" :value="antennas.obuBThreeErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B3错误次数" :value="antennas.bthreeErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B3-B4耗时" :value="antennas.bthrBFourElpTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="B4错误标签数" :value="antennas.obuBFourErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B4错误次数" :value="antennas.bfourErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B4-C6/C3耗时" :value="antennas.bfourCSixCThrElpTime"/></el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="8"><ti-detail-cell label="B5错误标签数" :value="antennas.obuBFiveErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="B5错误次数" :value="antennas.bfiveErrNum"/></el-col>
                <el-col :span="8"><ti-detail-cell label="C6-B5耗时" :value="antennas.csixBfiveElpTime"/></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>地感信息</span></div>
        <el-row :gutter="5">
          <el-col :span="24">
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第一地感变化数" :value="groundSenses.firthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第一地感跳变数" :value="groundSenses.firthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第二地感变化数" :value="groundSenses.secondGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第二地感跳变数" :value="groundSenses.secondGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第三地感变化数" :value="groundSenses.thirthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第三地感跳变数" :value="groundSenses.thirthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第四地感变化数" :value="groundSenses.fourthGrroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第四地感跳变数" :value="groundSenses.fourthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第五地感变化数" :value="groundSenses.fifthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第五地感跳变数" :value="groundSenses.fifthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第六地感变化数" :value="groundSenses.sixthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第六地感跳变数" :value="groundSenses.sixthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第七地感变化数" :value="groundSenses.sevthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第七地感跳变数" :value="groundSenses.sevthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
            <div ref="baseInfoRow">
              <el-row :gutter="5">
                <el-col :span="12"><ti-detail-cell label="第八地感变化数" :value="groundSenses.eighthGroundSeChangeNum"/></el-col>
                <el-col :span="12"><ti-detail-cell label="第八地感跳变数" :value="groundSenses.eighthGroundSeLeapNum"/></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>

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
  import {detail} from "../laneLogAnalysisApi"
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"

  export default {
    name: 'pro.audit.laneLogAnalysis.laneLogAnalysisDetail',
    components: {TiDetailCell},
    mixins: [...mixin],
    data() {
      return {
        loading: false, // 页面加载遮罩
        detailItem: {},
        imgUrl: "",
        laneBaseDatas:{},
        performances:{},
        vehicleIdentities:{},
        antennas:{},
        groundSenses:{},
        specialInfos:[],
        myColumnsSpecialInfos:[{field: 'specialTypeStr', title: '特情类型'},{field: 'specialNum', title: '特情数'}],
        hourTraffics:[],
        myColumnsHourTraffics:[{field: 'hour', title: '小时'},{field: 'trafficNum', title: '车次'}],
        tableDataSpecialInfos:[],
        tableColumnSpecialInfos:[],
        tableDataHourTraffics:[],
        tableColumnHourTraffics:[],

      }
    },
    mounted() {
      // this.$nextTick(function () {
      //   this.$refs.baseInfoImg.style.setProperty("--baseInfoHeight", this.$refs.baseInfoRow.offsetHeight + 'px')
      // })
      //
      // //window.vue =  this;
      // debugger
    },
    created() {
      if (this.$route.query.row instanceof Object){
        sessionStorage.setItem("laneLogAnalysisDetail",JSON.stringify(this.$route.query.row))
      }
      let row = JSON.parse(sessionStorage.getItem("laneLogAnalysisDetail"));
      this.detail(row);
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          //console.log(val)
          if(val.name == 'audit.laneLogAnalysis.laneLogAnalysisDetail'){
            this.detail(this.$route.query.laneId, this.$route.query.gatherTime);
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    methods: {
      detail(row) {
        this.$nextTick(() => {
          this.loading = true;
          Object.assign(this.detailItem, row);
          if (row.laneBaseDatas) {
            Object.assign(this.laneBaseDatas, row.laneBaseDatas[0]);
          }
          if(row.performances){
            Object.assign(this.performances, row.performances[0]);
          }
          if(row.vehicleIdentities){
            Object.assign(this.vehicleIdentities, row.vehicleIdentities[0]);
          }
          if(row.antennas){
            Object.assign(this.antennas, row.antennas[0]);
          }
          if (row.groundSenses) {
            Object.assign(this.groundSenses, row.groundSenses[0]);
          }

          Object.assign(this.specialInfos, row.specialInfos);
          this.reverseTableSpecialInfos(this.myColumnsSpecialInfos, this.specialInfos)
          Object.assign(this.hourTraffics, row.hourTraffics);
          this.reverseTableHourTraffics(this.myColumnsHourTraffics, this.hourTraffics)
          this.loading = false;

        })
      },
      close() {
        //this.$store.dispatch('name', this.$route)
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
        this.$router.go(-1);
      },
      // 反转函数
      reverseTableSpecialInfos (columns, list) {
        const buildData = columns.map(column => {
          const item = { col0: column.title }
          list.forEach((row, index) => {
            item[`col${index + 1}`] = row[column.field]
          })
          return item
        })
        const buildColumns = [{
          field: 'col0',
          fixed: 'left',
          width: 80
        }]
        list.forEach((item, index) => {
          buildColumns.push({
            field: `col${index + 1}`,
            minWidth: 120
          })
        })
        this.tableDataSpecialInfos = buildData
        this.tableColumnSpecialInfos = buildColumns
      },
      // 反转函数
      reverseTableHourTraffics (columns, list) {
        const buildData = columns.map(column => {
          const item = { col0: column.title }
          list.forEach((row, index) => {
            item[`col${index + 1}`] = row[column.field]
          })
          return item
        })
        const buildColumns = [{
          field: 'col0',
          fixed: 'left',
          width: 80
        }]
        list.forEach((item, index) => {
          buildColumns.push({
            field: `col${index + 1}`,
            minWidth: 120
          })
        })
        this.tableDataHourTraffics = buildData
        this.tableColumnHourTraffics = buildColumns
      }

    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }
</style>
