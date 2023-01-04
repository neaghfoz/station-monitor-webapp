<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form :model="appForm" ref="appForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-row>
        <el-form-item label="路段" prop="sectionId">
          <ti-select v-model="appForm.sectionId" :clearable="false"
                     url="/api/v1/common/road/findListByAuth":props="{key:'roadId',value:'roadId',label:'roadName'}"
                     :multiple="false" default-first-value aria-placeholder="路段"/>
        </el-form-item>
        <el-form-item label="日期" prop="dateStatisticType">
          <ti-select v-model="appForm.dateStatisticType"
                     :clearable="false"
                     dict-type="tibms_rpt_dateStatisticType"/>

        </el-form-item>
        <el-form-item prop="dates">
          <el-col :span="30">
            <el-form-item v-show="appForm.dateStatisticType==='day'">
              <el-form-item prop="startDay" v-show="false"/>
              <el-form-item prop="endDay" v-show="false"/>
              <ti-date-range date-style="width:293px" ref="dayRang" :editable="false"
                             dateRule="oneMonth"
                             v-model="appForm"
                             date-type="daterange"
                             format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startDay"
                             end-key="endDay"/>
            </el-form-item>
            <el-form-item v-show="appForm.dateStatisticType==='month'">
              <el-form-item prop="startMonth" v-show="false"/>
              <el-form-item prop="endMonth" v-show="false"/>
              <ti-date-range ref="monthRang" date-style="width:293px" :editable="false"
                             dateRule="oneYear"
                             v-model="appForm"
                             date-type="monthrange"
                             format="yyyy-MM" value-format="yyyy-MM" begin-key="startMonth"
                             end-key="endMonth"/>
            </el-form-item>
            <el-form-item v-show="appForm.dateStatisticType==='year'">
              <el-form-item prop="startYear" v-show="false"/>
              <el-form-item prop="endYear" v-show="false"/>
              <ti-date-range ref="yearRang" date-style="width:293px" :editable="false"
                             v-model="appForm"
                             date-type="yearRang"
                             format="yyyy" value-format="yyyy" begin-key="startYear"
                             end-key="endYear"/>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="收费门架">
          <ti-select
            ref="gantry"
            v-model="appForm.gantryId"
            url="api/v1/common/gantry/gantry"
            :props="{key:'gantryId',value:'gantryId',label:'gantryText'}"
            :watch-attr="appForm.sectionId"
            :watch-attr-fn="filterGantrys"
            @change="gantryIdChange"
          />
        </el-form-item>
        <el-form-item label="收费站">
          <ti-select
            ref="station"
            v-model="appForm.stationId"
            url="api/v1/common/station/findListByAuth"
            :props="{key:'stationId',value:'stationId',label:'stationText'}"
            :watch-attr="appForm.sectionId"
            :watch-attr-fn="filterStations"
            @change="stationChange"
          />
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form inline>
      <el-card style="margin-top:10px;background:none;padding:0;border-radius:0px;" shadow="never"
             :body-style="{ padding: '0px' }">
      <div class="row flex jhview double-line">
        <div class="flexItem">
          <el-card class="box-card" shadow="never">
            <div style="color: rgb(52, 75, 88); font-size: 20px; margin-bottom: 16px;">
              <span class="b">门架交易情况</span>
            </div>
            <div class="text item">
              <div class="chart-index">
                <div ref="gantryFlowTurnover" data-chart="gflowt-pie" class="chart" style="height:400px"></div></div>
              <div class="chart-index2">
                <div ref="gantryFeeTurnover" data-chart="gfeet-pie" class="chart" style="height:400px"></div></div>
            </div>
          </el-card>
        </div>
        <div class="flexItem">
          <el-card class="box-card" shadow="never">
            <div style="color: rgb(52, 75, 88); font-size: 20px; margin-bottom: 16px;">
              <span class="b">收费站交易情况</span>
              <div style="float: right">
              </div></div>
                <div class="text item">
                  <div class="chart-index">
                    <div ref="stationFlowTurnover" data-chart="sflowt-pie" class="chart" style="height:400px"></div></div>
                  <div class="chart-index">
                    <div ref="stationFeeTurnover" data-chart="sfeet-pie" class="chart" style="height:400px"></div></div>
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
  import {reqData} from "@/views/pro/audit/traffic/gantry/gantryTrafficApi"
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import moment from "moment"
  import chartOption from "@/views/pro/analyse/flowTurnover/chartOption"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import { getRoadList } from "@/views/pro/common/util/dataUtil"

  export default {
    name: 'analyse.flow.flowTurnover.flowTurnover',
    mixins: [...mixin],
    components: {TiSelect,TiDateRange,tiSysOrg},
    data() {
      return {
        appForm:{
          sectionId:null,
          dateStatisticType: 'day',
          startDay: moment(new Date()).format('YYYY-MM-DD'),
          endDay: moment(new Date()).format('YYYY-MM-DD'),
          startMonth: moment(new Date()).format('YYYY-MM'),
          endMonth: moment(new Date()).format('YYYY-MM'),
          startYear: moment(new Date()).format('YYYY'),
          endYear: moment(new Date()).format('YYYY'),
          gantry:'',
          startDate: '',
          endDate: '',
        },
        chartTarget: [],
        gantryFlowTurnover: {
          sectionId:null,
          gantry:'',
          startDate: '',
          endDate: '',
        },
        rules: {
          sectionId: { type: 'string', required: true, message: '' },
          dataRange: [{
            type: 'array',
            required: true,
            message: '',
            fields: {
              startDay: { type: 'string', required: true, message: '' },
              endDay: { type: 'string', required: true, message: '' }
            }
          }]
        },
        dataSource:[],
        gantryId: '', // 按门架统计标记
        gantryMap:{}, // 门架键值对
        stationId: '', // 按收费站统计标记
        stationMap:{}, // 收费站键值对
      }
    },
    mounted(){
      this.chartTarget = ['gantryFlowTurnover','gantryFeeTurnover','stationFlowTurnover','stationFeeTurnover']
      this.submit()
    },
    methods: {
      /*download() {
        // 图表转换成canvas
        html2canvas(document.getElementById("download")).then(function (canvas) {
          var img = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          // 创建a标签，实现下载
          var creatIMg = document.createElement("a");
          creatIMg.download = "图表.png"; // 设置下载的文件名，
          creatIMg.href = img; // 下载url
          document.body.appendChild(creatIMg);
          creatIMg.click();
          creatIMg.remove(); // 下载之后把创建的元素删除
        });
      },*/

      chartToggle(type, chartId) {
        this.txfjhqst.chartType = type
        chartOption.init(this, chartId)
      },
      // 默认路段设置
      sectionFilter(datas){
        const seArr = []
        getRoadList(datas,seArr)
        if(!this.appForm.sectionId && seArr.length>0){
          this.appForm.sectionId = seArr[0].roadId
          // 获取到路段之后查询
          this.submit()
        }
        return seArr
      },
      // 门架变更
      gantryIdChange(val){
        this.gantryId = val
      },
      // 路段变更，过滤门架
      filterGantrys(newVal,oldVal,gantryList){
        let arr =  gantryList.filter((x)=>{return x.roadId == newVal})
        arr.forEach((x)=>{
          this.gantryMap[x.gantryId] = x.gantryName
        })
        return arr
      },
      // 收费站变更
      stationIdChange(val){
        this.stationId = val
      },
      // 路段变更，过滤收费站
      filterStations(newVal,oldVal,stationList){
        let arr =  stationList.filter((x)=>{return x.roadId == newVal})
        arr.forEach((x)=>{
          this.stationMap[x.stationId] = x.stationName
        })
        return arr
      },


      submit() {
        let dateTrans = {};
        if (this.appForm.dateStatisticType === 'day') {
          dateTrans = dateUtil.dateCombination(this.appForm.startDay, this.appForm.endDay,
            this.appForm.dateStatisticType);
        } else if (this.appForm.dateStatisticType === 'month') {
          dateTrans = dateUtil.dateCombination(this.appForm.startMonth,
            this.appForm.endMonth, this.appForm.dateStatisticType);
        } else if (this.appForm.dateStatisticType === 'year') {
          dateTrans = dateUtil.dateCombination(this.appForm.startYear,
            this.appForm.endYear, this.appForm.dateStatisticType);
        }
        this.appForm.startDate = dateTrans.startDate;
        this.appForm.endDate = dateTrans.endDate;
        if (this.chartTarget.length > 0) {
          chartOption.reload(this)
        }
      },
      reset() {
        this.$refs['appForm'].resetFields()
      },

    }
  }
</script>
<style scoped lang="scss">

</style>
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

  .chart-index{
    float:left;
    width: 48%;
  }

  .b{
    font-size: 30px;
    color: black;
    font-weight: bold;
  }

  .chart-index2{
    float:right;
    width: 48%;
  }
</style>

