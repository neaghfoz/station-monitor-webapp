<template>
  <div class="app-container" style=" background: #e8ebf0; padding:10px;">
    <el-form inline>
      <div class="el-header" style="background-color:white;height: 52px; border: 1px solid #EBEEF5;">
        <el-form-item label="路段" prop="sectionId" style="padding-top: 10px; ">
          <ti-select style="width: 200px" v-model="txfjhqst.sectionId" :clearable="true"
                     url="/api/v1/common/road/findListByAuth"
                     :props="{key:'roadId',value:'roadId',label:'roadName'}" placeholder="全部路段"
                     :multiple="false" aria-placeholder="路段" @change="txfjhqstChange"/>
        </el-form-item>
        <el-form-item label="月份" style="padding-top: 10px; ">
          <el-date-picker @change="monthChange"
                          v-model="txfjhqst.startDay"
                          type="month" :clearable="false"
                          placeholder="选择月" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item  style="padding-top: 10px; ">
          <el-button size="mini" type="primary" plain :disabled="mbtDisabled" @click="goMonth(-1)"><i class="el-icon-arrow-left el-icon--left"></i>上月</el-button>
          <el-button size="mini" type="primary" plain :disabled="mbtDisabled" @click="goMonth(1)">下月<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-form inline v-loading="feeSplit.loading">
      <el-card shadow="never" style="border-radius:0px;">
        <div class="flex todo">
          <div class="flexItem flex">
            <div class="img">
              <div class="monthdata pre_m">{{ top.st1.month }}</div>
            </div>
            <div class="flexItem dotted">
              <div v-show="showTheory"><i style="background: #0088ff;"></i>{{labelName.feeName}}(万元)<span class="text-blue">{{ top.st1.fee }}</span></div>
              <div><i style="background: #feb42f;"></i>{{labelName.payFeeName}}(万元)<span class="text-yellow">{{ top.st1.payFee }}</span>
              </div>
              <div><i style="background: #21d4b6;"></i>{{labelName.splitFeeName}}(万元)<span class="text-green">{{ top.st1.splitFee }}</span>
              </div>
              <el-tooltip class="item" effect="dark" :content="labelName.content" placement="bottom">
                <div>
                  <i style="background: #ff6160;"></i>差额比(%) <span class="text-red">{{ top.st1.diffFee }}</span>
                </div>
              </el-tooltip>
            </div>

          </div>
          <div class="flexItem flex">
            <div class="img">
              <div class="monthdata pre_m">{{ top.st2.month }}</div>
            </div>
            <div class="flexItem dotted">
              <div v-show="showTheory"><i style="background: #0088ff;"></i>{{labelName.feeName}}<span class="text-blue">{{ top.st2.fee }}</span></div>
              <div><i style="background: #feb42f;"></i>{{labelName.payFeeName}}<span class="text-yellow">{{ top.st2.payFee }}</span></div>
              <div><i style="background: #21d4b6;"></i>{{labelName.splitFeeName}}<span class="text-green">{{ top.st2.splitFee }}</span></div>
              <!--<div><i style="background: #ff6160;"></i>差额比(%)<span class="text-red">{{ top.st2.diffFee }}</span></div>-->
            </div>
          </div>
          <div class="flexItem flex">
            <div class="img">
              <div class="monthdata pre_m">{{ top.st3.month }}</div>
            </div>
            <div class="flexItem dotted">
              <div v-show="showTheory"><i style="background: #0088ff;"></i>{{labelName.feeName}}<span class="text-blue">{{ top.st3.fee }}</span></div>
              <div><i style="background: #feb42f;"></i>{{labelName.payFeeName}}<span class="text-yellow">{{ top.st3.payFee }}</span></div>
              <div><i style="background: #21d4b6;"></i>{{labelName.splitFeeName}}<span class="text-green">{{ top.st3.splitFee }}</span></div>
              <!--<div><i style="background: #ff6160;"></i>差额比(%)<span class="text-red">{{ top.st3.diffFee }}</span></div>-->
            </div>
          </div>
        </div>
      </el-card>

      <el-card style="margin-top:10px;background:none;padding:0;border-radius:0px;" shadow="never"
               :body-style="{ padding: '0px' }">
        <div class="row flex jhview double-line">
          <div class="flexItem">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>月度通行费趋势</span>
              </div>
              <div class="text item">
                <div ref="ydtxf" data-chart="jh-line" class="chart" style="height:300px"></div>
              </div>
            </el-card>
          </div>
          <div class="flexItem">
            <el-card class="box-card" shadow="never" v-loading="txfjhqst.loading">
              <div slot="header" class="clearfix">
                <span>通行费校核趋势</span>
                <div style="float: right">

                  <div class="type-tab" v-show="false">
                    <img :class="{on: $data.txfjhqst.chartType==1 }" @click="chartToggle(2,'txfjhqst2')"
                         src="@/assets/img/zxt.png"/>
                    <img :class="{on: $data.txfjhqst.chartType==2 }" @click="chartToggle(1,'txfjhqst')"
                         src="@/assets/img/qxt.png"/>
                  </div>
                  <!--<div class="flex month-click">
                    <div class="pre-month" @click="txfjhMonthChange(-1)">上月</div>
                    <div class="next-month" @click="txfjhMonthChange(1)">下月</div>
                  </div>-->
                </div>
              </div>
              <div class="text item">
                <div ref="txfjhqst" data-chart="line" class="chart" style="height:300px;"
                     v-show="$data.txfjhqst.chartType==1"></div>
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import chartOption from "@/views/pro/fitcheck/fee/indexFee/chartOption"
  import moment from 'moment'
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import TiSysRoad from "@/views/pro/common/tiElement/tiSysRoad/tiSysRoad"
  import { tibms,systemName } from '@/settings'
 
  export default {
    name: 'fitcheck.fee.indexFee.indexFee',
    mixins: [...mixin],
    components: {TiSelect, TiDateRange, tiSysOrg, TiSysRoad},
    data() {
      return {
        mbtDisabled: false,
        queryParams: {
          dateStatisticType: 'day', // 默认为天
          startDay: null,
          endDay: null,
          date: {
            startDay: moment().add(-30, 'days').format('YYYY-MM-DD'),
            endDay: moment().format('YYYY-MM-DD'),
          },
          month: {
            startDay: moment().add(-2, 'month').format('YYYY-MM'),
            endDay: moment().format('YYYY-MM'),
          },
          sysOrgIdStr: ''
        },
        txfjhqst: {
          sysOrgIdStr: '',
          sectionId: '',
          chartType: 1,
          month: 0,
          startDay: moment().startOf('month').format('YYYY-MM-DD'),
          endDay: moment().endOf('month').format('YYYY-MM-DD'),
          loading: false
        },
        ydtxf: {
          sectionId: '',
          type: 1, // 按年统计
          startDay: moment().startOf('month').add(-11, 'months').format('YYYY-MM-DD'),
          endDay: moment().endOf('month').format('YYYY-MM-DD')
        },
        feeSplit: {
          sectionId: '',
          //startDay: moment().startOf('month').add(-2, 'month').format('YYYY-MM-DD'),
          startDay: moment().startOf('month').format('YYYY-MM-DD'),
          endDay: moment().endOf('month').format('YYYY-MM-DD'),
          loading: false
        },
        ceyy: {
          type: 'related', // lossSplit splitMore
          diffFee: 0
        },
        chartTarget: [],
        top: {
          st1: {
            month: '/',
            payFee: '/',
            fee: '/',
            diffFee: '/',
            splitFee: '/'
          },
          st2: {
            month: '/',
            payFee: '/',
            fee: '/',
            diffFee: '/',
            splitFee: '/'
          },
          st3: {
            month: '/',
            payFee: '/',
            fee: '/',
            diffFee: '/',
            splitFee: '/'
          }
        },
        labelName:{
          feeName :(systemName && systemName === 'tibms_cy') ? '理论应得':'理论应收',
          payFeeName :(systemName && systemName === 'tibms_cy') ? '拟合应得':'拟合应收',
          splitFeeName : (systemName && systemName === 'tibms_cy') ? '拆分实得':'拆分实收',
          content: (systemName && systemName === 'tibms_cy') ? "公式:(拆分实得-拟合应得)/拟合应得*100%":"公式:(拆分实收-拟合应收)/拟合应收*100%"
        }
      }
    },
    computed: {
      isCloud(){
        return tibms && tibms.model == 'cloud'
      },
      showTheory(){
        return tibms && tibms.fitcheck && tibms.fitcheck.showTheory
      },
    },
    mounted() {
      // 初始化图表，差额原因分析ceyy由 gljz 查询后 关联查询
      //this.chartTarget = ['feeSplit','ydtxf','txfjhqst','gljz','txljtype','ckjftype']
      this.feeSplit.sectionId = this.txfjhqst.sectionId
      this.ydtxf.sectionId = this.txfjhqst.sectionId
      this.chartTarget = ['feeSplit', 'ydtxf', 'txfjhqst']
      this.submit()
    },
    methods: {
      // 切换月份
      goMonth(inc) {
        this.mbtDisabled = true
        this.txfjhqst.startDay = moment(this.txfjhqst.startDay, "yyyy-MM-DD").add(inc, "months").format('YYYY-MM-DD')
        this.monthChange()
        this.mbtDisabled = false
      },
      // 通行费趋势图--查询条件发生改变
      txfjhqstChange() {
        //console.log("sectionId:"+this.txfjhqst.sectionId)
        this.feeSplit.sectionId = this.txfjhqst.sectionId
        this.ydtxf.sectionId = this.txfjhqst.sectionId
        this.feeSplit.loading = true
        this.chartTarget = ['feeSplit', 'ydtxf', 'txfjhqst']
        this.submit()
      },
      // 通行费趋势图--切换图表
      chartToggle(type, chartId) {
        this.txfjhqst.chartType = type
        chartOption.init(this, chartId)
      },
      monthChange() {
        if (moment(this.txfjhqst.startDay, "yyyy-MM-DD").diff(moment().startOf('month'), 'months') > -6) {
          //离当前月份6个月以内的，取当前往前12个月内的。
          this.ydtxf.startDay = moment().startOf('month').add(-11, 'months').format('YYYY-MM-DD')
          this.ydtxf.endDay = moment().endOf('month').format('YYYY-MM-DD')
        } else {
          //比当前月份早6个月以上的，取选中日期的前5个月 及 选中日期的后6个月
          this.ydtxf.startDay = moment(this.txfjhqst.startDay, "yyyy-MM-DD").add(-5, "months").startOf('month').format('YYYY-MM-DD')
          this.ydtxf.endDay = moment(this.txfjhqst.startDay, "yyyy-MM-DD").add(6, "months").endOf('month').format('YYYY-MM-DD')
        }
        this.feeSplit.startDay = this.txfjhqst.startDay
        this.txfjhqst.endDay = moment(this.txfjhqst.startDay, "yyyy-MM-DD").endOf('month').format('YYYY-MM-DD')

        this.txfjhqstChange();
      },
      // 上月，下月事件
      txfjhMonthChange(month) {
        this.txfjhqst.loading = true
        this.txfjhqst.month += month
        this.txfjhqst.startDay = moment().add(this.txfjhqst.month, 'month').startOf('month').format('YYYY-MM-DD')
        this.txfjhqst.endDay = moment().add(this.txfjhqst.month, 'month').endOf('month').format('YYYY-MM-DD')
        //this.txfjhqstChange()
        this.chartTarget = ['txfjhqst']
        this.submit()
      },
      submit() {
        // if (this.queryParams.dateStatisticType == 'day') {
        //   this.queryParams.startDay = this.queryParams.date.startDay.replace(/\-/g, '')
        //   this.queryParams.endDay = this.queryParams.date.endDay.replace(/\-/g, '')
        // } else if (this.queryParams.dateStatisticType == 'month') {
        //   this.queryParams.startDay = this.queryParams.month.startDay.replace(/\-/g, '') + '01'
        //   this.queryParams.endDay = moment(this.queryParams.month.endDay, 'YYYY-MM').endOf('month').format('YYYYMMDD');
        // }
        if (this.chartTarget.length > 0) {
          chartOption.reload(this)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .flexItem {
    flex: 1;
  }

  .text-center {
    text-align: center;
  }

  .text-blue {
    color: #3086fd;
  }

  .text-lightblue {
    color: #5cb3fe;
  }

  .text-lightgreen {
    color: #98cfff;
  }

  .text-yellow {
    color: #feb42f;
  }

  .text-green {
    color: #21d4b6;
  }

  .text-red {
    color: #ff6160;
  }

  .text-purple {
    color: #8a57ff;
  }

  .row {
    margin: 0 -7.5px 15px;
    padding: 0 5px;
    box-sizing: border-box;
  }

  .row > .flexItem {
    position: relative;
    margin: 0 7.5px;
    border: 1px solid #e1e1e1;
  }

  /*new*/
  .jhview .el-card__header {
    text-align: left;
  }

  .screen_select_box {
    color: #666;
    padding: 15px;
  }

  .screen_select_box .el-form-item, .pie_box .el-form-item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    margin: 0;
  }

  .screen_select_box .layui-input-block, .pie_box .layui-input-block {
    min-height: 26px;
  }

  .screen_select_box .el-form-item.double_input, .pie_box .el-form-item.double_input {
    margin-left: 15px;
  }

  .month-click {
    position: absolute;
    right: 11%;
    top: 19px;
    justify-content: space-between;
    z-index: 2;
  }

  .month-click div {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #0088FF;
    padding: 0 15px;
    margin-left: 12px;
    border: 1px solid #0088FF;
    border-radius: 20px;
    cursor: pointer;
  }

  .type-tab {
    position: absolute;
    right: 4%;
    top: 12px;
    z-index: 2;
  }

  .type-tab img {
    display: none;
    width: 34px;
    cursor: pointer;
  }

  .type-tab img.on {
    display: block;
  }

  .pie-data {
    position: absolute;
    top: 25%;
    left: 60%;
    font-size: 14px;
    color: #666;
    z-index: 2;
    line-height: 1.5;
  }

  .pie-data i {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 5px;
  }

  .pie-data > div p {
    display: inline-block;
    width: 180px;
    line-height: 1;
  }

  .pie-data > div p:last-of-type {
    display: block;
    padding-left: 16px;
  }

  .pie-data > div {
    margin-bottom: 5px;
  }

  .ce {
    position: absolute;
    right: 6%;
    /*top: 34px;*/
    font-size: 12px;
    color: #333;
  }

  .ce span {
    font-size: 14px;
  }

  .percent_i {
    color: #666;
    font-size: 12px;
    line-height: 1;
  }

  .ce_type {
    display: inline-flex;
    display: -webkit-inline-flex;
    font-size: 12px;
    color: #333;
    border: 1px solid #999;
    border-radius: 20px;
    overflow: hidden;
  }

  .ce_type div {
    padding: 2px 15px;
    cursor: pointer;
  }

  .ce_type div.active {
    color: #fff;
    background: #0088ff;
  }

  .ce_type div:nth-child(even) {
    border-left: 1px solid #999;
    border-right: 1px solid #999;
  }

  .jhview .el-card__header img {
    position: absolute;
    right: 5px;
    top: 8px;
    width: 28px;
    cursor: pointer;
  }

  .tips_content {
    font-size: 14px;
    color: #333333;
    padding: 20px 30px;
  }

  .tips_content p {
    position: relative;
    padding-left: 72px;
    margin-bottom: 12px;
    text-align: justify;
  }

  .tips_content p span {
    position: absolute;
    left: 0;
    top: 0;
  }

  .dw {
    position: absolute;
    left: 25.5%;
    /*top: 34px;*/
    font-size: 12px;
    color: #333;
  }

  .pie-data > div p span:first-of-type {
    padding-right: 20px;
  }

  .todo {
    text-align: center;
  }

  .todo > .flexItem {
    align-items: center;
    padding: 10px 10px 10px 2%;
    font-size: 13px;
  }

  .todo > .flexItem:nth-of-type(2) {
    border-left: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
  }

  .todo p {
    font-size: 24px;
    line-height: 32px;
  }

  .todo i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 40px;
    margin-right: 10px;
    background: #424d6d;
  }

  .dotted {
    color: #333;
    padding-left: 7%;
    text-align: left;
    box-sizing: border-box;
  }

  .dotted > div {
    position: relative;
    line-height: 26px;
  }

  .dotted span {
    position: absolute;
    top: 0;
    left: 155px;
    font-size: 14px;
  }

  .next_m, .pre_m, .current_m {
    width: 58px;
    height: 58px;
    line-height: 58px;
    color: #fff;
    font-size: 22px;
    border-radius: 50%;
    background: #0088fe;
    text-align: center;
  }

  .screen_box {
    position: absolute;
    left: 170px;
    top: 14px;
    color: #666;
    z-index: 2;
  }

  .screen_box select, .screen_box input {
    color: #666;
    height: 26px;
    line-height: 1.3;
    line-height: 26px \9
  ;
  }

  .double-line {
    margin: 0 -7.5px;
    padding: 0;
  }

  .double-line .flexItem {
    border-radius: 2px;
    border: none;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05)
  }
</style>
