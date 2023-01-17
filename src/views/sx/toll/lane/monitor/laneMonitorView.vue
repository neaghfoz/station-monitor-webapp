<template style="'background-color': '#e7e7e8'">
  <div id="laneMonitor" class="app-container" >
    <!--<div id = 'devDiv' ></div>-->
    <!--<div class="search-form">-->

      <!--<el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">-->
        <!--<el-form-item label="机构" prop="sysOrgIdStr">-->
          <!--<ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>-->
        <!--</el-form-item>-->

        <!--<el-button type="primary" @click="searchData">查询</el-button>-->
        <!--<el-button type="default" @click="handleReset">重置</el-button>-->

      <!--</el-form>-->
    <!--</div>-->
    <div id="box" class="box">
      <vxe-grid
        ref="laneMonitorXTable"
        keep-source
        highlight-hover-row
        border
        show-header-overflow
        resizable
        sync-resize
        auto-resize
        class="vxe-table-element laneMonitorXTable"
        zIndex="2000"
        :max-height="(screenHeight * 0.73)"
        :loading="tableData.loading"
        :data="tableData.columnsDataList"
        :toolbar="tableToolbar"
        :cell-style="cellStyle"
        @checkbox-all="({ selection }) => { selections = selection }"
        @checkbox-change="({ selection }) => { selections = selection }"
        @toggle-row-expand="toggleRowExpand"
        @zoom ="opZoom"
        :style="{'background-color': '#e7e7e8'}"
        :columns="columns"
      >

        <!--          <vxe-table-column align="center" type="expand" width="22px" field="expand" className="expandClass">-->
        <template v-slot:contentSlot="{ row, rowIndex}">
          <table style = "width: 100%" cellspacing="0" cellpadding="0" border="0" v-for="item in row.list">
            <tr class="vxe-body--row" >
              <td   class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6"  id ='imgTitle'>
                图片
              </td>
              <td   class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6"  width="34%">
                操作车道
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6"   width="11%">
                车型
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#fff"  width="11%">
                {{item.VehType}}
              </td>
              <td class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6"  width="11%">
                收费金额
              </td>
              <td class ='vxe-body--column col--center tdRlBorder tdBrBorder' style="background-color:#fff"  width="11%">
                {{item.Money}}
              </td>
            </tr>

            <tr>
              <td class ='vxe-body--column col--center tdRlrBorder' rowspan="4" style="background-color: white">
                <div  style=" overflow: auto; ;background-color: white" class="vehImgDiv">
                  <el-image
                    style="height: 220px;padding: 2px 2px 2px 2px;"
                    class="pic"
                    :src="row.vehImg"
                    :preview-src-list="[row.vehImg]"
                  />
                </div>

              </td>
              <td class ='vxe-body--column col--center tdBrBorder' rowspan="4" style="background-color:#fff" >
                <div :id ="'log_' + rowIndex" style=" overflow: auto;height: 205px" >
                  <div  style=""  class="logDiv" v-for="itemLog in row.logList">
                    {{itemLog.LogText}}
                  </div>
                </div>                  </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                车种
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#fff">
                {{item.VehClass}}
              </td>
              <td class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                支付方式
              </td>
              <td class ='vxe-body--column col--center tdRlBorder tdBrBorder' style="background-color:#fff">
                {{item.PayType}}
              </td>
            </tr>
            <tr>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                车牌
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#fff">
                {{item.VehPlate}}
              </td>
              <td class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                时间
              </td>
              <td class ='vxe-body--column col--center tdRlBorder tdBrBorder' style="background-color:#fff">
                {{item.Time}}
              </td>
            </tr>
            <tr>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                入口站
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#fff">
                {{item.inStationName}}
              </td>
              <td class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                特殊事件
              </td>
              <td class ='vxe-body--column col--center tdRlBorder tdBrBorder' style="background-color:#fff">
                {{item.SpEventNo}}
              </td>
            </tr>
            <tr>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">
                出口站
              </td>
              <td  class ='vxe-body--column col--center tdRlBorder' style="background-color:#fff">
                {{item.StationName}}
              </td>
              <td class ='vxe-body--column col--center tdRlBorder' style="background-color:#f6f6f6">

              </td>
              <td class ='vxe-body--column col--center tdRlBorder tdBrBorder' style="background-color:#fff">

              </td>
            </tr>
          </table>

        </template>
        <!--          </vxe-table-column>-->

        <!--          <vxe-table-column align="center" min-width="95px"  max-width="120px" field="roadText" title="路段" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="95px"  max-width="250px" field="stationText" title="所在机构" :visible="false"/>-->
        <!--          <vxe-table-column align="center" min-width="41px"  max-width="65px" field="laneNo" title="车道编号" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="45px"  max-width="75px" field="entryExitTypeText" title="出入口类型" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="132px"  max-width="190px" field="operatorName" title="操作员" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="82px"  max-width="85px" field="shiftDate" title="工班日" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="35px"  max-width="40px" field="shift" title="工班" :visible="false" />-->
        <!--          <vxe-table-column align="center" min-width="140px"  max-width="170px" field="laneDate" title="车道时间" :visible="false" />-->

        <!--          <vxe-table-column align="left" :max-width="(devArr.length + 1) * 38 + 10" :min-width="(devArr.length + 1) * 38 + 10" field="deviceStatus" header-align = "center" title="设备状态" type="html" :visible="false" >-->
        <template v-slot:deviceStatusSlot ="{row,rowIndex}">
          <img :id="'imgTopLight' + rowIndex" title="顶棚灯" height="33" style="padding-left:5px;padding-right:5px" :src="row.imgTopLightSrc" @click="devOperWindow(rowIndex)">
          <img :id="'imgPrinter' + rowIndex" title="打印机" height="33" style="padding-right:5px" :src="row.imgPrinterSrc">
          <img v-show="row.imgPreWireLoop1" :id="'imgPreWireLoop' + rowIndex + '_1'" title="地感1" height="33" style="padding-right:5px" :src="row.imgPreWireLoop1Src">
          <img v-show="row.imgPreWireLoop2" :id="'imgPreWireLoop' + rowIndex + '_2'" title="地感2" height="33" style="padding-right:5px" :src="row.imgPreWireLoop2Src">
          <img v-show="row.imgPreWireLoop3" :id="'imgPreWireLoop' + rowIndex + '_3'" title="地感3" height="33" style="padding-right:5px" :src="row.imgPreWireLoop3Src">
          <img v-show="row.imgPreWireLoop4" :id="'imgPreWireLoop' + rowIndex + '_4'" title="地感4" height="33" style="padding-right:5px" :src="row.imgPreWireLoop4Src">
          <img v-show="row.imgPreWireLoop5" :id="'imgPreWireLoop' + rowIndex + '_5'" title="地感5" height="33" style="padding-right:5px" :src="row.imgPreWireLoop5Src">
          <img v-show="row.imgPreWireLoop6" :id="'imgPreWireLoop' + rowIndex + '_6'" title="地感6" height="33" style="padding-right:5px" :src="row.imgPreWireLoop6Src">
          <img v-show="row.imgPreWireLoop7" :id="'imgPreWireLoop' + rowIndex + '_7'" title="地感7" height="33" style="padding-right:5px" :src="row.imgPreWireLoop7Src">
          <img v-show="row.imgPreWireLoop8" :id="'imgPreWireLoop' + rowIndex + '_8'" title="地感8" height="33" style="padding-right:5px" :src="row.imgPreWireLoop8Src">
          <img v-show="row.imgPreWireLoop9" :id="'imgPreWireLoop' + rowIndex + '_9'" title="地感9" height="33" style="padding-right:5px" :src="row.imgPreWireLoop9Src">
          <img v-show="row.imgPreWireLoop10" :id="'imgPreWireLoop' + rowIndex + '_10'" title="地感10" height="33" style="padding-right:5px" :src="row.imgPreWireLoop10Src">
          <img :id="'imgAutoBarryDown' + rowIndex" title="栏杆机" height="33" style="padding-right:5px" :src="row.imgAutoBarryDownSrc" @click="devOperWindow(rowIndex)">
          <img :id="'imgRSU' + rowIndex" title="天线" height="33" style="padding-right:5px" :src="row.imgRSUSrc">
          <img v-show="row.imgReader1"  :id="'imgReader' + rowIndex + '_1'" title="视频抓拍" height="33" style="padding-right:5px" :src="row.imgReader1Src">
          <!--              <img v-show="row.imgReader2" :id="'imgReader' + rowIndex + '_2'" title="车牌识别2" height="33" style="padding-right:5px" :src="row.imgReader2Src">-->
          <img :id="'imgParaRh' + rowIndex" title="通讯服务" height="33" style="padding-right:2px" :src="row.imgParaRhSrc">
        </template>
        <!--          </vxe-table-column>-->

        <!--          <vxe-table-column align="center" min-width="40px" max-width="60px" field="laneWarnInfo" title="车道告警" :visible="false" >-->
        <template v-slot:laneWarnInfoSlot="{row,rowIndex}">
          <a  style="text-decoration-line: underline;color: red;" @click="tip(row,'laneAlarmInfo')" v-if = "row.laneAlarmInfo === 'abnormal'" >{{row.laneAlarmsCount || 0}}</a>
          <a  style="text-decoration-line: none;"  v-else-if = "row.laneAlarmInfo === 'normal'" >{{row.laneAlarmsCount || 0}}</a>
        </template>
        <!--          </vxe-table-column>-->

        <!--          <vxe-table-column align="center" min-width="55px" max-width="75px"  field="heartBeatInfo" title="连通性" :visible="false" >-->
        <template v-slot:heartBeatInfoSlot="{row,rowIndex}">
          <a  style="text-decoration-line: underline;color: red;" @click="tip(row,'heartBeatInfo')" v-if = "row.heartBeatInfo === 'abnormal'" >连通性异常</a>
          <a  style="text-decoration-line: none;"  v-else-if = "row.heartBeatInfo === 'normal'" >连通性正常</a>
        </template>
        <!--          </vxe-table-column>-->

        <!--          <vxe-table-column align="center" min-width="55px" max-width="75px" field="transStaInfo" title="完整性" :visible="false" >-->
        <template v-slot:transStaInfoSlot="{row,rowIndex}">
          <a  style="text-decoration-line: underline;color: red;" @click="tip(row,'transStaInfo')" v-if = "row.transStaInfo === 'abnormal'" >完整性异常</a>
          <span  v-else-if = "row.transStaInfo === 'normal'" >完整性正常</span>
        </template>

        <!--          </vxe-table-column>-->

        <!--          <vxe-table-column align="center" min-width="53px" max-width="90px"  field="laneParamVersionInfo" title="车道参数版本" :visible="false" >-->
        <template v-slot:laneParamVersionInfoSlot="{row,rowIndex}">
          <a  style="text-decoration-line: underline;color: red;" @click="tip(row,'laneParamVersionInfo')" v-if = "row.laneParamVersionInfo === 'abnormal'" >参数异常</a>
          <span  v-else-if = "row.laneParamVersionInfo === 'normal'" >参数正常</span>
        </template>

        <!--          </vxe-table-column>-->
        <!--          <vxe-table-column align="center" width="165px" field="operation"  title="操作" :visible="false" >-->
        <!-- 操作行 -->
        <template v-slot:operationSlot="{row, rowIndex}" >
          <el-button v-if="row.serverIp != null" type="warning" @click="devOperWindow(rowIndex)" style="min-width:70px;padding-left: 2px;  padding-right: 2px;padding-top: 9px;padding-bottom: 9px;margin-bottom:2px;" >设备控制1</el-button>
          <el-button type="warning" @click="spMonitorRegShow(rowIndex, row)" v-permission="['spMonitorRecord:registerMark']" style="min-width:70px;margin-left: 3px;padding-left: 2px;  padding-right: 2px;padding-top: 9px;padding-bottom: 9px;" >特情登记<span style="color:blue">({{row.spEventCount || 0}})</span></el-button>
        </template>
        <!--          </vxe-table-column>-->

        <!-- wangning--下拉扩展行 -->
        <template v-slot:toolbar_buttons>
          <el-form ref="searchForm" :model="queryParams" inline :label-width="'50px'">

            <el-button @click="expandRow()">{{ expandTitle }}</el-button>
            <el-button @click="colSettingFn" v-permission="['laneMonitor:colSetting']" >列配置</el-button>
            <el-button @click="toggleStation()">{{ stationStatus }}</el-button>
            <span  style="color: red;font-size: 1.3em;margin-block-start: 0.83em;margin-block-end: 0.83em;margin-inline-start: 0px;margin-inline-end: 0px;font-weight: bold; margin-left: 20px;" v-show="stationStatusNo == 1">监控离岗中</span>

            <el-form-item label="机构" prop="sysOrgIdStr">
              <!--default-first-value-->
              <!--<ti-sys-org :multiple="true" ref="sysOrg" v-model="queryParams.sysOrgIdStr" />-->
              <ti-s :multiple="true" ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value/>
            </el-form-item>

            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>

          </el-form>


        </template>

        <!-- 特情列表图标 -->
        <template v-slot:toolbar_tools>
          <vxe-button type="text" >

            <img id="serverParamWarnWarnInfo" @click="serverParamWarnClick" title="参数" height="33" :src="monitorParamUrl">
          </vxe-button>

          <vxe-button type="text" >

            <img id="uploadTimelinessWarnInfo" @click="uploadTimelinessWarnClick" title="时效" height="33" :src="monitorUploadTimelinessUrl">
            <!--              <i class="el-icon-warning" style="font-size: 35px;" @click="serverParamWarnClick" id = 'serverParamWarnWarnInfo'></i>-->
            <!--              <i class="el-icon-warning" style="font-size: 35px;" @click="uploadTimelinessWarnClick" id = 'uploadTimelinessWarnInfo'></i>-->
          </vxe-button>
          <vxe-button type="text" >

            <!--              <i class="vxe-icon&#45;&#45;question" style="font-size: 30.9px;" id = "specialEventsWarning"></i>-->
            <img id="specialEventsWarning" title="回控" height="33" style="padding-right:2px" :src="monitorCtrUrl">

            <template v-slot:dropdowns  >
              <template v-for="(obj,i) in tableData.SpecialEvents" >
                <vxe-button v-if="obj != undefined" @click="windowPre(obj.index)">{{ obj == undefined ? '':obj.monitorInfo.spEventContent }}</vxe-button>
              </template>
            </template>


          </vxe-button>
        </template>

      </vxe-grid>
    </div>
    <template>
      <tip ref="warnTip" @refreshData="warnTipFresh" />
      <stationStatus ref="stationStatusRef" @refreshData="stationStatusFresh" />
      <sp-monitor-reg ref="spMonitorRegDialog" @refreshData="spMonitorRegFresh"/>
    </template>

    <template id="modal-template">
      <div id="weightDiv" class="">
<!--        <el-dialog title="货车重量选择" width="500px"-->
<!--                   v-show="showWeightDlg"-->
<!--                   id = "weightDialog"-->
<!--                   :modal-append-to-body="false"-->
<!--                   :lock-scroll="false"-->
<!--                   :fullscreen="false"-->
<!--                   :show-close="true"-->
<!--                   :before-close="handleWeightDialogClose"-->
<!--                   v-dialogDrag-->
<!--                   :modal=false-->
<!--                   :close-on-click-modal=false-->
<!--                   z-index =  2354-->
<!--                   :visible="true">-->
      <el-dialog :title="weightTitle" width="550px"
                 id ="weightDialog"
                 v-show="showWeightDlg"
                 :modal-append-to-body="false"
                 :lock-scroll="false"
                 :fullscreen="false"
                 :show-close="true"
                 v-dialogDrag
                 :modal=false
                 :close-on-click-modal=false
                 z-index = 100
                 :before-close="handleWeightDialogClose"
                 :visible="true">

          <div>
            <vxe-grid
              ref="weightVex"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              show-overflow
              max-height="768"
              class="vxe-table-element tdStyle"
              :loading="loading"
              :start-index="(pageWeight.currentPage - 1) * pageWeight.pageSize"
              :pager-config="pageWeight"
              :columns="columnsWeight"
              :data="tableWeightData"
              :toolbar="weightTableToolbar"
              @page-change="handlePageWeightChange"
              @cell-dblclick="cellDBLClickEvent"
            >
              <template v-slot:weight_toolbar_buttons>
                <el-button type="primary" @click="add()">新增</el-button>
              </template>

            </vxe-grid>

          </div>

        </el-dialog>
      </div>

      <add-dialog ref="addDialog" @refreshDataList="getAddWeightData"/>
    </template>

  </div>


</template>




<script>

import mixin from 'ecip-web/utils/common-mixin'
import dictUtils from 'ecip-web/utils/dictUtils'
import jq from 'jquery'
import addDialog from "./addDialog"
import { findLaneList } from './laneMonitorApi'
import Vue from 'vue/dist/vue.esm.js'
import VxeTableEvents from 'vxe-table'
import ElementUi from 'element-ui'
import spMonitorReg from './SpMonitorRecord'
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import tip from './tip'
import stationStatus from './stationStatus'
import {findUseList} from "@/views/pro/common/colSetting/colSettingApi"
import moment from 'moment-timezone'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import {deepClone} from '@ecip/ecip-web/src/utils'

moment.tz.setDefault("Asia/Shanghai");
moment.tz.guess()

// 为dialog绑定移动事件，让dialog支持移动
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el

    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

 //litao
function getVehTypeStr(searchStr){
  let returnStr = ""
  if(searchStr=='1'||searchStr=='客一')
  {
    returnStr='客一'
  }
  else if(searchStr=='2'||searchStr=='客二')
  {
    returnStr='客二'
  }
  else if(searchStr=='3'||searchStr=='客三')
  {
    returnStr='客三'
  }
   else if(searchStr=='4'||searchStr=='客四')
  {
    returnStr='客四'
  }
  else if(searchStr=='11'||searchStr=='货一')
  {
    returnStr='货一'
  }
  else if(searchStr=='12'||searchStr=='货二')
  {
    returnStr='货二'
  }
  else if(searchStr=='13'||searchStr=='货三')
  {
    returnStr='货三'
  }
   else if(searchStr=='14'||searchStr=='货四')
  {
    returnStr='货四'
  }
  else if(searchStr=='15'||searchStr=='货五')
  {
    returnStr='货五'
  }
   else if(searchStr=='16'||searchStr=='货六')
  {
    returnStr='货六'
  }
  else if(searchStr=='21'||searchStr=='专一')
  {
    returnStr='专一'
  }
  else if(searchStr=='22'||searchStr=='专二')
  {
    returnStr='专二'
  }
  else if(searchStr=='23'||searchStr=='专三')
  {
    returnStr='专三'
  }
   else if(searchStr=='24'||searchStr=='专四')
  {
    returnStr='专四'
  }
  else if(searchStr=='25'||searchStr=='专五')
  {
    returnStr='专三'
  }
   else if(searchStr=='26'||searchStr=='专六')
  {
    returnStr='专四'
  }
  return returnStr;
}

function getJsonLength(json){
  let jsonLength = 0
  for (const i in json) {
    jsonLength++;
  }
  return jsonLength;
}

Vue.use(ElementUi)
// 车道连接集合
var connetIPMap = {}
var laneMap = {}

/**
 * 设备控制
 */
var DevDialogVue

/**
 * 联通状态
 */
window.webStatusMap = new Object()

/**
 * 车道特情请求集合[目前不需要转义，仅做记录，如需使用，请查询数据库]
 */
var dealStatusMap = new Object()
dealStatusMap[45] = '修改金额'
dealStatusMap[10] = '信用黑名单'
dealStatusMap[11] = '省内黑灰名单'
dealStatusMap[14] = '出入口车型不符'
dealStatusMap[13] = '出入口车牌不符'
dealStatusMap[6] = '无卡'
dealStatusMap[12] = '坏卡'
//  '车队车放行' (协议里面没有体现特情)

/**
 * 离岗状态
 */
var stationStatusMap = new Object()
stationStatusMap[0] = '离岗'
stationStatusMap[1] = '取消离岗'
// 0-在岗，显示“离岗”, 1-离岗，显示“取消离岗”
var curStationStatus = 0

/**
 * 当前车辆
 */
var laneVehMap = new Object()

var laneParamUseCols = []
var serverParamUseCols = []

export default {
  name: 'laneMonitorView',
  components: { spMonitorReg, TiDetailCell, tip, stationStatus,addDialog ,tiSysOrg},
  mixins: [mixin],
  data() {
    return {
      colSetting: {
        belongModule: 'laneMonitor'
      },
      showWeightDlg : false,
      weightRowConfig:{height:50},
      loading: false,
      weightTitle: "选择货车重量",
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      dialog: true,
      expandTitle: '展开全部',
      stationStatus: stationStatusMap[0],
      stationStatusNo: 0,
      screenHeight: document.body.clientHeight,
      queryParams: {
      },
      addWeightformItem: {
        VehicleId: '',
        TotalWeight: '',
        VehAxleCnt: '',
        MaximumAllowWeight: ''
      },
      weightInfo: [],
      warnCollectData: '',
      uploadTimelinessWarnInfo: {},
      serverParamVersionWarnInfo: {},
      monitorParamUrl: 'lane/monitor/灰参.png',
      monitorUploadTimelinessUrl: 'lane/monitor/灰时.png',
      monitorCtrUrl: 'lane/monitor/灰控.png',
      timer: '',
      devArr: ['DEV013', 'DEV031', 'DEV001', 'DEV011', 'DEV028', 'DEV027'],
      soundMap: {'修改':'/sound/修改操作确认.mp3'
        ,'修改确认':'/sound/修改操作确认.mp3'
        ,'修改计重':'/sound/修改操作确认.mp3'
        ,'修改计重确认':'/sound/修改操作确认.mp3'
        ,'修改操作':'/sound/修改操作确认.mp3'
        ,'修改操作确认':'/sound/修改操作确认.mp3'
        ,'车队车':'/sound/车队车确认.mp3'
        ,'车队车确认':'/sound/车队车确认.mp3'
        ,'抬杆':'/sound/抬杆确认.mp3'
        ,'抬杆确认':'/sound/抬杆确认.mp3'
        ,'降杆':'/sound/降杆确认.mp3'
        ,'降杆确认':'/sound/降杆确认.mp3'
        ,'军警车确认':'/sound/军警车确认.mp3'
        ,'OBU通行省份数量为0':'/sound/设备内通行省份异常.mp3'
        ,'省内黑名单确认':'/sound/省内黑名单确认.mp3'
        ,'在线计费金额大于1.5倍最小费额':'/sound/在线计费超额.mp3'
        ,'在线计费失败':'/sound/在线计费失败.mp3'
        ,'计费金额小于入出口可达路径最小费额':'/sound/在线计费小于最小费额.mp3'
        ,'纸券车':'/sound/纸券.mp3'
        ,'纸券确认':'/sound/纸券.mp3'
        ,'纸券':'/sound/纸券.mp3'
        ,'坏卡':'/sound/坏卡.mp3'
        ,'无卡':'/sound/无卡.mp3'
        ,'出入口车型不符':'/sound/出入口车型不符.mp3'
        ,'出入口车牌不符':'/sound/出入口车牌不符.mp3'
        ,'绿通车确认':'/sound/绿通车确认.mp3'
        ,'车辆闯关':'/sound/车辆闯关.mp3'
        ,'重打确认':'/sound/重打确认.mp3'
        ,'倒车':'/sound/倒车.mp3'
        ,'拖车':'/sound/拖车.mp3'
        ,'坏卡,在线计费失败':'/sound/坏卡,在线计费失败.mp3'
        ,'坏卡,在线计费成功':'/sound/坏卡,在线计费成功.mp3'
        ,'无卡,在线计费失败':'/sound/无卡,在线计费失败.mp3'
        ,'无卡,在线计费成功':'/sound/无卡,在线计费成功.mp3'
      },
      colSettings: [],

      logData: [],
      tableData: {
        loading: false,
        SpecialEvents: [],
        columnsDataList: [],
        tableColumns: [
          { title: '车型', field: 'VehType', minWidth: 40, fixed: 'left', align: 'center', treeNode: true },
          { title: '车种', field: 'VehClass', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '车牌', field: 'VehPlate', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '入口站', field: 'inStationName', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '出口站', field: 'StationName', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '收费金额', field: 'Money', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '支付方式', field: 'PayType', minWidth: 40, showOverflow: true, align: 'center' },
          { title: '时间', field: 'Time', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '特殊事件', field: 'SpEventNo', minWidth: 80, showOverflow: true, align: 'center' }
        ]
      },
      columns: [
        // {title: '',field: 'expand',align: 'center',width: '22px',type: 'expand',className: 'expandClass',slots: {content: 'contentSlot'}},
        // {title: '路段',field: 'roadText',align: 'center',minWidth: '95px',maxWidth: '120px'},
        // {title: '所在机构',field: 'stationText',align: 'center',minWidth: '95px',maxWidth: '250px'},
        // {title: '车道编号',field: 'laneNo',align: 'center',minWidth: '41px',maxWidth: '65px'},
        // {title: '出入口类型',field: 'entryExitTypeText',align: 'center',minWidth: '45px',maxWidth: '75px'},
        // {title: '操作员',field: 'operatorName',align: 'center',minWidth: '132px',maxWidth: '190px'},
        // {title: '工班日',field: 'shiftDate',align: 'center',minWidth: '82px',maxWidth: '85px'},
        // {title: '工班',field: 'shift',align: 'center',minWidth: '35px',maxWidth: '40px'},
        // {title: '车道时间',field: 'laneDate',align: 'center',minWidth: '140px',maxWidth: '170px'},
        // {title: '设备状态',field: 'deviceStatus',align: 'center',minWidth: '305px',maxWidth: '305px',slots: {default: 'deviceStatusSlot'}},
        // {title: '车道告警',field: 'laneWarnInfo',align: 'center',minWidth: '40px',maxWidth: '60px',slots: {default: 'laneWarnInfoSlot'}},
        // {title: '连通性',field: 'heartBeatInfo',align: 'center',minWidth: '55px',maxWidth: '75px',slots: {default: 'heartBeatInfoSlot'}},
        // {title: '完整性',field: 'transStaInfo',align: 'center',minWidth: '55px',maxWidth: '75px',slots: {default: 'transStaInfoSlot'}},
        // {title: '车道参数版本',field: 'laneParamVersionInfo',align: 'center',minWidth: '53px',maxWidth: '90px',slots: {default: 'laneParamVersionInfoSlot'}},
        // {title: '操作',field: 'operation',align: 'center',width: '165px',slots: {default: 'operationSlot'}}
      ],
      deviceStatusCol: {},
      tableToolbar: {
        id: 'modules.paramQuery',
        custom: true,
        // 最大化按钮
        zoom: true,
        // 列宽操作记录
        resizable: {
          storage: true
        },
        slots: {
          buttons: 'toolbar_buttons',
          tools: 'toolbar_tools'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      tableHeight: null,
      selections: [],
      weightTableToolbar: {
        id: 'monitor.com.orgUse.orgUseView-toolbar',
        custom: true,
        slots: {
          buttons: 'weight_toolbar_buttons'
        },
        // 列宽操作记录
        resizable: {
          storage: true
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      pageWeight: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      selectedWeight: [],
      tableWeightData: [],
      columnsWeight: [
        {title: '车牌', field: 'VehicleId', width: 165, showOverflow: true},
        {title: '总重', field: 'TotalWeight', width: 115, showOverflow: true},
        {title: '限重', field: 'MaximumAllowWeight', width: 115, showOverflow: true},
        {title: '轴数', field: 'VehAxleCnt', width: 113, showOverflow: true},
        /*{title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}},*/
      ],
      popTotal:0,
    }
  },
  // 进入页面初始化前执行
  created() {
    const vehTypes = dictUtils.getDictList('tibms_com_vehicleType')
    const vehClasss = dictUtils.getDictList('tibms_com_vehicleClass')

    const sounds = dictUtils.getDictList('tibms_toll_ctrSound')


    for (const label of sounds) {
      this.soundMap[label.value] = '/sound/' + label.label
    }
    console.log(this.soundMap)

    // 将此方法暴露到全局
    window.dealLaneData = this.dealLaneData
    window.dealStationData = this.dealStationData
    window.reConnect = this.reConnect
    if(connetIPMap) {
      jq.each(connetIPMap,function(key, value) {
        try {
          if( value.status &&  value.websocket.readyState === 1) {
            value.websocket.close(3001,'刷新页面')
          }
        } catch (err) {
          // 处理错误
          console.error(err)
        }
      })
    }
    connetIPMap = {}

    this.$nextTick(() => {
      // 加载遮挡
      this.tableData.loading = true
      if(this.colSettings.length == 0) {
        this.columns = [];
        findUseList({belongModule: this.colSetting.belongModule}).then(res => {
          this.colSettings = res.data
          this.colSettings.forEach(item => {

            var title = item.name
            if ('expand' == item.code) {
              title = ''
            }


            var col = Object.assign({title: title, field: item.code}, JSON.parse(item.attrJson))
            if ('deviceStatus' == item.code) {
              this.deviceStatusCol = col
            }
            this.columns.push(col);

          });
          //, fixed: 'right'
          this.columns.push({title: '操作', width: '165px', align: 'center', slots: {default: 'operationSlot'}});

          this.getData()
        })
      } else {
        this.getData()
      }
    })

    var vehTypeMap = new Object()
    var vehClassMap = new Object()

    for (const label of vehTypes) {
      vehTypeMap[label.value] = label.label
    }

    for (const label of vehClasss) {
      vehClassMap[label.value] = label.label
    }

    window.vehTypeMap = vehTypeMap
    window.vehClassMap = vehClassMap

  },
  watch: {
    screenHeight(val){
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    },
    devArr (newVal, oldVal) {
      if (newVal) {

        this.deviceStatusCol.minWidth = (newVal.length + 1) * 38 + 10 + 'px'
        this.deviceStatusCol.maxWidth = (newVal.length + 1) * 38 + 10 + 'px'
        this.$refs.laneMonitorXTable.reloadColumn(this.columns)

      }
    }
  },
  // 在模板渲染成html后调用
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  methods: {
    searchData() {
      // Object.assign(this.$data.page, this.$options.data().page);
      // this.$data.page.currentPage = 1
      connetIPMap = {}
      laneMap = {}
      this.getData();
      window.reConnect ;
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
      // this.getData();
    },
    colSettingFn() {
      this.$router.push({
        path: '/laneMonitor/colSetting',
        query: {
          belongModule: this.colSetting.belongModule
        }
      });
    },
    async add() {
      this.$refs.addDialog.init()
    },
    getAddWeightData()
    {
      this.weightInfo[0].weightData.unshift(this.addWeightformItem)
    },
    cellDBLClickEvent({column,rowIndex}){
      console.log(`单元格双击${column.title}Row:${rowIndex},vehplate:${this.weightInfo[0].weightData[rowIndex].VehicleId}`)

      let obj = {}
      obj.SMType = 1
      obj.SMName = 'IF_RobotCtrlRsp'
      let data = {}
      data.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      data.popDlgCode = this.weightInfo[0].popDlgCode
      data.popDlgName = this.weightInfo[0].popDlgName
      data.confirm = 1
      data.msgType = 107
      let acmResult = {}
      acmResult.IsWeightMsg = 1
      acmResult.WeightData = {VehicleId:this.weightInfo[0].weightData[rowIndex].VehicleId,
        TotalWeight:this.weightInfo[0].weightData[rowIndex].TotalWeight,
        MaximumAllowWeight:this.weightInfo[0].weightData[rowIndex].MaximumAllowWeight,
        VehAxleCnt:this.weightInfo[0].weightData[rowIndex].VehAxleCnt}
      data.acmResult = acmResult
      data.terminalType = 2 //监控室回控
      obj.SMData = data

      let websocket = connetIPMap[this.weightInfo[0].index].websocket
      websocket.send(JSON.stringify(obj)) // 将消息发送到服务端

      this.handleWeightDialogClose()
    },
    handleWeightDialogClose() {
      this.weightInfo.shift()
      this.showWeightDlg = false
      if(this.weightInfo.length > 0)
      {
        this.getWeightData()
        this.showWeightDlg = true
      }
    },
    reConnect(index) {
      if (connetIPMap[index].status) {
        return
      }

      var websocket = connetIPMap[index].websocket
      var IP = connetIPMap[index].IP

      var newWebsocket = new WebSocket(websocket.url)
      newWebsocket.IP = websocket.IP
      newWebsocket.index = index
      // 设置车道连接状态
      connetIPMap[index] = { websocket: newWebsocket, index: index, status: true, IP: IP }

      // 连接发生错误的回调方法
      newWebsocket.onerror = websocket.onerror

      // 连接成功建立的回调方法
      newWebsocket.onopen = websocket.onopen

      // 接收到消息的回调方法
      newWebsocket.onmessage = websocket.onmessage

      newWebsocket.onclose = websocket.onclose
    },
    uploadTimelinessWarnClick(){
      if(this.uploadTimelinessWarnInfo.infoList){
        var zIndex = this.$refs.laneMonitorXTable.$el.style.zIndex || 0
        this.$refs.warnTip.init(this.uploadTimelinessWarnInfo.title, this.uploadTimelinessWarnInfo.infoList, zIndex)
      }
    },
    serverParamWarnClick(){
      if(this.serverParamVersionWarnInfo.infoList){
        var zIndex = this.$refs.laneMonitorXTable.$el.style.zIndex || 0
        this.$refs.warnTip.init(this.serverParamVersionWarnInfo.title, this.serverParamVersionWarnInfo.infoList, zIndex)
      }
    },
    opZoom({ type, $event}) {
    },
    async getData() {
      if (!('WebSocket' in window)) {
        alert('浏览器不支持网络监控功能，请联系运维！')
        return
      }

      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求

      // 加载遮挡
      this.tableData.loading = true

      // 加载数据
console.log(this.queryParams)
      const { data } = await findLaneList(this.queryParams)

      // 隐藏部分设备图标
      for (const index in data) {

        data[index].operatorName = '[0]未登录'
        // 顶棚灯
        data[index].imgTopLightSrc = false
        // 栏杆
        data[index].imgAutoBarryDown = false

        // 地感
        data[index].imgPreWireLoop1 = true
        data[index].imgPreWireLoop1Has  = false
        data[index].imgPreWireLoop2 = false
        data[index].imgPreWireLoop3 = false
        data[index].imgPreWireLoop4 = false
        data[index].imgPreWireLoop5 = false
        data[index].imgPreWireLoop6 = false
        data[index].imgPreWireLoop7 = false
        data[index].imgPreWireLoop8 = false
        data[index].imgPreWireLoop9 = false
        data[index].imgPreWireLoop10 = false


        data[index].imgReader1 = true
        data[index].imgReader1Has  = false

        // 车牌识别
        data[index].imgReader2 = false

        // 顶棚灯
        data[index].imgTopLightSrc =  'lane/monitor/雨棚灯(未知).bmp'
        data[index].imgPrinterSrc =  'lane/monitor/打印机(未连接).bmp'
        // 栏杆
        data[index].imgAutoBarryDownSrc = 'lane/monitor/栏杆(未知).bmp'
        // 地感
        data[index].imgPreWireLoop1Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop2Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop3Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop4Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop5Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop6Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop7Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop8Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop9Src = 'lane/monitor/线圈(异常).bmp'
        data[index].imgPreWireLoop10Src = 'lane/monitor/线圈(异常).bmp'

        data[index].imgRSUSrc = 'lane/monitor/RSU错误.bmp'
        // 车牌识别
        data[index].imgReader1Src = 'lane/monitor/Reader0.png'
        data[index].imgReader2Src = 'lane/monitor/Reader0.png'

        data[index].imgParaRhSrc = 'lane/monitor/webClose.bmp'
      }


      /*
                var data1 = new Array(2);
                data1[0] = data[0];
                if(data1[0] == undefined){
                  data1[0] = new Object();
                  data1[0].serverIp = '10.173.232.179';
                }else{
                  data1[0].serverIp = '10.173.232.179';
                }

                data1[1] = data[1];
                if(data1[1] == undefined){
                  data1[1] = new Object();
                  data1[1].serverIp = '10.173.11.98';
                }else{
                  data1[1].serverIp = '10.173.11.98';
                }
      */
      //        this.tableData.columnsDataList = data1;
      // for(var i = 0; i < 98; i ++) {
      //   data.push(deepClone(data[0]))
      // }
      for(var i = 0; i < data.length; i++)
      {
        data[i].wsID = (i+1);
        // data[i].laneNo = (i+1);
      }
      this.logData = []
      for(var i = 0; i < data.length; i++)
      {
        var item = {
          'index': i,
          'expanded': false,
          'logList': []
        }
        this.logData.push(item);
      }
      // for(var i = 0; i < data.length; i++)
      // {
      //   data[i].wsID = (i+1);
      //   data[i].laneNo = (i+1);
      // }
      this.tableData.columnsDataList = data
      this.tableData.SpecialEvents = new Array(this.tableData.columnsDataList.length)
      window.tableDataList = this.tableData.columnsDataList

      // 取消加载遮挡
      this.tableData.loading = false

      var wsIP = window.location.hostname;
      var wsPort = window.location.port;

      const dics = this.$dictUtils.getDictList('tibms_config')
      if(dics) {
        dics.forEach(item => {
          if(item.value== 'toll_laneMonitor_wsIP'){
            wsIP = item.label
          }
          if(item.value== 'toll_laneMonitor_wsPort'){
            wsPort = item.label
          }
        })
      }

      this.connetWs('stationServer', wsIP, wsPort + '/ws/laneMonitor')
      // 建立监控
      for (const index in this.tableData.columnsDataList) {

        laneMap[this.tableData.columnsDataList[index].laneId] = index

        this.tableData.columnsDataList[index].list = [{
          // 车型
          VehType: '',
          // 车种
          VehClass: '',
          // 车牌
          VehPlate: '',
          // 入口站
          inStationName: '',
          // 出口站
          StationName: '',
          // 收费金额
          Money: '',
          // 支付方式
          PayType: '',
          // 时间
          Time: '',
          // 特殊事件
          SpEventNo: ''
        }
        ]
        this.tableData.columnsDataList[index].logList = []
        this.tableData.columnsDataList[index].vehImg = ''
        this.tableData.columnsDataList[index].laneAlarmsCount = 0
        this.tableData.columnsDataList[index].laneAlarmInfo = 'normal'
        this.tableData.columnsDataList[index].transStaInfo = ''
        this.tableData.columnsDataList[index].transStaWarnInfo = {}
        this.tableData.columnsDataList[index].heartBeatInfo = ''
        this.tableData.columnsDataList[index].heartBeatWarnInfo = {}
        this.tableData.columnsDataList[index].laneParamVersionInfo = 'normal'
        this.tableData.columnsDataList[index].laneParamVersionWarnInfo = {}
       // debugger
        var hh=this.tableData.columnsDataList[index].serverIp
        console.log(hh)
        console.log(this.tableData.columnsDataList[index])
        this.connetWs(index, this.tableData.columnsDataList[index].serverIp, 9696)
        // this.connectWs(index, '1.14.191.144', 8000, this.tableData.columnsDataList[index].wsID)
      }
    },
    // 展开控制
    async expandRow() {
      if (this.expandTitle == '展开全部') {
        // 展开所有行
        this.$refs.laneMonitorXTable.setAllRowExpand(true)
        // for (const item in this.logData) {
        //   item.expanded = true
        // }
        for (let i = 0; i < this.logData.length; i++) {
          const item = this.logData[i]
          this.updateLaneRow(i, 'logList', item.logList)
        }
        this.expandTitle = '收起全部'
        var that = this
        for (const index in this.tableData.columnsDataList) {
          this.$nextTick(() => {
            var logId = '#log_'+ index
            if (jq(logId + ' div:last-child').length > 0) {
              //动画效果
              jq(logId).animate({
                scrollTop: jq(logId + ' div:last-child')[0].offsetTop * 1
              }, 0);
            }
          })
        }
      } else {
        // 收起所有行
        this.$refs.laneMonitorXTable.setAllRowExpand(false)
        this.expandTitle = '展开全部'
        // for (const item in this.logData) {
        //   item.expanded = false
        // }
        for (let i = 0; i < this.logData.length; i++) {
          const item = this.logData[i]
          item.expanded = false
        }
      }
    },
    // 离岗控制
    async toggleStation() {
      if (this.stationStatusNo == 0) {

        var zIndex = this.$refs.laneMonitorXTable.$el.style.zIndex || 0
        this.$refs.stationStatusRef.init(zIndex)
      } else {
        this.stationStatus = stationStatusMap[0]
        curStationStatus = 0
        this.stationStatusNo = 0
      }
    },
    /**
     * 打开特情监控登记
     */
    async spMonitorRegShow(index, row) {
      console.log("spMonitorRegShow")
      if (this.$refs.spMonitorRegDialog.spShow) {
        this.$refs.spMonitorRegDialog.spShow = false
      } else {
        var zIndex = this.$refs.laneMonitorXTable.$el.style.zIndex || 0
        this.$refs.spMonitorRegDialog.init(row,index, zIndex )
      }
    },
    // 声音播放
    soundPlay(text) {
      if(text) {
        const audio = new Audio()

        var src = this.soundMap[text]
        if(!src) {
          if (text.indexOf('大于1.5倍')  >= 0) {
            src = '/sound/在线计费超额.mp3'
          }
        }
        audio.src = src  ||  '/sound/tip.mp3'
        audio.play()
      }

    },
    async getWeightData() {
      this.loading = true
      // 每次查询初始化checkbox selections
      this.addWeightformItem.VehicleId = this.weightInfo[0].vehiclePlate
      this.selectedWeight = []
      this.tableWeightData = this.weightInfo[0].weightData
      this.weightTitle =  "选择货车重量:" + this.weightInfo[0].title
      this.pageWeight.total = getJsonLength(this.tableWeightData)
      this.loading = false
      this.soundPlay("修改计重")
    },
    handlePageWeightChange({currentPage, pageSize}) {
      this.pageWeight.currentPage = currentPage
      this.pageWeight.pageSize = pageSize
      this.getWeightData()
    },
    // 设备控制
    devOperWindow(index) {
      // 判断车道连接状态
      const connetInfo = connetIPMap[index]
      console.log("devOperWindow")
//需要删除开始 20220623
//        const DevDialogVue = this.openDevDialog(connetInfo)
//           if (DevDialogVue) {
//             window.DevDialogVue = DevDialogVue
//           }
//         return;
//需要删除结束 20220623
      if (window.webStatusMap[index]) {
        if (window.webStatusMap[index].status) {
          const DevDialogVue = this.openDevDialog(connetInfo)
          if (DevDialogVue) {
            window.DevDialogVue = DevDialogVue
          }
        } else {
          const row = this.tableData.columnsDataList[index]
          this.$notify.warning(row.stationText + '-车道[' + row.laneNo + ']监控通讯未联通!')
          return
        }
      } else {
        const row = this.tableData.columnsDataList[index]
        this.$notify.warning(row.stationText + '-车道[' + row.laneNo + ']监控通讯未联通!')
        return
      }
    },
    // 将特情窗口设置靠前
    windowPre(index) {
      const vuecom = connetIPMap[index].vuecom

      var divs = vuecom.$el.parentNode.childNodes
      for (const dom of divs) {
        let classVal = dom.getAttribute('class')
        classVal = classVal.replace('windows-pre', '')
        dom.setAttribute('class', classVal)
      }

      let classVal = vuecom.$el.getAttribute('class')
      classVal = classVal.concat(' windows-pre')
      vuecom.$el.setAttribute('class', classVal)
    },
    // 车道信息渲染
    updateLaneRow(index, target, value) {


      if (this.tableData.columnsDataList[index]) {
        var updateObj = this.tableData.columnsDataList[index]
        updateObj[target] = value
        this.$refs.laneMonitorXTable.reloadRow(this.$refs.laneMonitorXTable.getData(index), updateObj, target)

      }
    },
    // 更新监控信息
    updateMonitorInfo(index, data) {
      // 更新判断
      // 无车牌信息，不更新队列
      if (data.InputPlate.length == 0 && data.RegPlateText.length == 0 && data.EnVehPlate.length == 0) {
        return
      }

      // 未进入交易队列，不更新队列
      if (data.TransStatus == '0') {
        return
      }

      if (data.TransStatus == '100') {
        data.PayCardType = -1
        data.FeeMoney = ''
      }

      var monitorData = getMonitorData(data)
      monitorData[0].VehType = window.vehTypeMap[monitorData[0].VehType]
      monitorData[0].VehClass = window.vehClassMap[monitorData[0].VehClass]
      this.updateLaneRow(index, 'list', monitorData)
    },
    async connectWs(index, IP, port, laneId) {

      // if (connetIPMap[index]) {
      //   return
      // }
      // 判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
      var websocket = new WebSocket('ws://' + IP + ':' + port + '/webSocket/' + laneId)
      websocket.IP = IP
      websocket.index = index

      // 设置车道连接状态
      connetIPMap[index] = { websocket: websocket, index: index, status: true, IP: IP }

      // 连接发生错误的回调方法
      websocket.onerror = function(event) {
        // 设置车道连接状态
        const index = event.currentTarget.index
        if(!index) {
          return
        }
        connetIPMap[index].status = false
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = false
        }
        const imgParaRh = document.getElementById('imgParaRh' + index)
        if (imgParaRh) {
          imgParaRh.src = 'lane/monitor/webClose.bmp'
        }

        console.log('连接发生错误！')
      }

      // 连接成功建立的回调方法
      websocket.onopen = function(event) {
        const index = event.currentTarget.index
        connetIPMap[index].status = true
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = true
        }
        console.log('成功建立连接！')
      }

      // 连接发生错误的回调方法
      websocket.onclose = function(event) {
        // 设置车道连接状态
        const IP = event.currentTarget.IP
        const index = event.currentTarget.index
        if(!connetIPMap[index]) {
          return
        }
        connetIPMap[index].status = false
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = false
        }
        const imgParaRh = document.getElementById('imgParaRh' + index)
        if (imgParaRh) {
          imgParaRh.src = 'lane/monitor/webClose.bmp'
        }
        console.log('连接发生关闭！11111')
        // setTimeout(function() {
        //   window.reConnect(index)
        // }, 2000)
      }
      // 接收到消息的回调方法
      websocket.onmessage = function(event) {
        //debugger
        const index = event.currentTarget.index

        if('stationServer' === index) {
          window.dealStationData(index, JSON.parse(event.data))
        } else {
        // window.dealLaneData(index, JSON.parse(event.data))
        //let dataStr='{"SMData":{"CmdCode":"LU_ShowLog","CmdSerialNo":"110249","Data_VerNo":"1","LaneNo":"1","LogText":"15:46:12.087 请输入车型","OnlyWatchLog":"0"},"SMName":"IF_LaneGuiRsp","SMType":"1"}'
          let dataStr=event.data
        dataStr=dataStr.replace("请进行注册，尊重创作","")
          window.dealLaneData(index, JSON.parse(dataStr))
        }

      }
      },
    async connetWs(index, IP, port) {

      if (connetIPMap[index]) {
        return
      }
      // 判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
      var websocket = new WebSocket('ws://' + IP + ':' + port)
      websocket.IP = IP
      websocket.index = index

      // 设置车道连接状态
      connetIPMap[index] = { websocket: websocket, index: index, status: true, IP: IP }

      // 连接发生错误的回调方法
      websocket.onerror = function(event) {
        // 设置车道连接状态
        const index = event.currentTarget.index
        if(!index) {
          return
        }
        connetIPMap[index].status = false
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = false
        }
        const imgParaRh = document.getElementById('imgParaRh' + index)
        if (imgParaRh) {
          imgParaRh.src = 'lane/monitor/webClose.bmp'
        }

        console.log('连接发生错误！')
      }

      // 连接成功建立的回调方法
      websocket.onopen = function(event) {
        const index = event.currentTarget.index
        connetIPMap[index].status = true
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = true
        }
        console.log('成功建立连接！')
      }

      // 连接发生错误的回调方法
      websocket.onclose = function(event) {
        // 设置车道连接状态
        const IP = event.currentTarget.IP
        const index = event.currentTarget.index
        if(!connetIPMap[index]) {
          return
        }
        connetIPMap[index].status = false
        if (window.webStatusMap[index]) {
          window.webStatusMap[index].status = false
        }
        const imgParaRh = document.getElementById('imgParaRh' + index)
        if (imgParaRh) {
          imgParaRh.src = 'lane/monitor/webClose.bmp'
        }
        console.log('连接发生关闭！22222')
        // setTimeout(function() {
        //   window.reConnect(index)
        // }, 2000)
      }
      // 接收到消息的回调方法
      websocket.onmessage = function(event) {
        //debugger
        const index = event.currentTarget.index

        if('stationServer' === index) {
          window.dealStationData(index, JSON.parse(event.data))
        } else {
         // window.dealLaneData(index, JSON.parse(event.data))
         //let dataStr='{"SMData":{"CmdCode":"LU_ShowLog","CmdSerialNo":"110249","Data_VerNo":"1","LaneNo":"1","LogText":"15:46:12.087 请输入车型","OnlyWatchLog":"0"},"SMName":"IF_LaneGuiRsp","SMType":"1"}'
           let dataStr=event.data
         dataStr=dataStr.replace("请进行注册，尊重创作","")
          window.dealLaneData(index, JSON.parse(dataStr))
        }

      }
    },
    tip(row, type) {
      var title = '';
      var infoList = []

      switch(type) {
        case 'heartBeatInfo':
          title = row.heartBeatWarnInfo.title
          infoList = row.heartBeatWarnInfo.infoList
          break;
        case 'transStaInfo':
          title = row.transStaWarnInfo.title
          infoList = row.transStaWarnInfo.infoList
          break;
        case 'laneAlarmInfo':
          title = row.laneAlarmWarnInfo.title
          infoList = row.laneAlarmWarnInfo.infoList
          break;
        case 'laneParamVersionInfo':
          title = row.laneParamVersionWarnInfo.title
          infoList = row.laneParamVersionWarnInfo.infoList
          break;
        default:
          break;
      }
      var zIndex = this.$refs.laneMonitorXTable.$el.style.zIndex || 0
      this.$refs.warnTip.init(title, infoList, zIndex)
    },
    warnTipFresh(){

    },
    stationStatusFresh(val) {
      if (val) {
        this.stationStatus = stationStatusMap[1]
        this.stationStatusNo = 1
        curStationStatus = 1
      }
    },
    spMonitorRegFresh(index, count) {
      this.updateLaneRow(index, 'spEventCount', count)
    },
    dealStationData(index, data) {

      switch (data.infoType) {
        case 'warnInfo':
          this.dealWarnInfo(data)
          break;
        case 'spEvent':
          this.dealSpEvent(data)
          break;
        default:

          break;
      }
    },
    dealSpEvent(val){
      var data = val.data
      if(!data) {
        return
      }
      var that = this
      data.forEach(function(item, index) {
        var columnIndex = laneMap[item.laneId]
        if (columnIndex) {
          that.updateLaneRow(columnIndex, 'spEventCount', item.statusCount)
        }
      })

    },
    dealWarnInfo(val){
      this.warnCollectData = val['collectDateStr']
      var data = val.data
      if(!data) {
        return
      }


      try{
        var heartBeat = data['heartBeat']
        var that = this

        if (heartBeat) {
          heartBeat.forEach(function(item, index) {
            var columnIndex = laneMap[item.laneId]
            if (columnIndex) {
              var heartBeatWarnInfo = {}
              if('abnormal' === item.status) {
                heartBeatWarnInfo = {
                  title :'连通性异常（1条） ' + that.warnCollectData,
                  infoList: [{infoText:'[1]当前车道连通性异常，请及时检查'}]
                }
              }
              that.updateLaneRow(columnIndex, 'heartBeatInfo', item.status);
              that.updateLaneRow(columnIndex, 'heartBeatWarnInfo', heartBeatWarnInfo);

              if(item.hgCreateTime){
                that.updateLaneRow(columnIndex, 'laneDate', moment(item.hgCreateTime).format('YYYY-MM-DD HH:mm:ss'))
              }

            }

          })
        }

        var transSta = data['transSta']

        if (transSta) {
          var count = 0
          transSta.forEach(function(item, index) {

            var retainListCnt = item.retainListCnt //滞留数
            var recvFailCnt  = item.recvFailCnt //收费站入库失败数
            var spSendFailCnt  = item.spSendFailCnt //站省发送失败数
            var sdSendFailCnt  = item.sdSendFailCnt //站部发送失败数
            var infoList = []
            if(retainListCnt > 100) {
              ++ count
              infoList.push({infoText: '['+ count +']车道滞留数超过100，请及时检查'})
            }


            if(spSendFailCnt > 0) {
              ++ count
              infoList.push({infoText: '['+ count +']站省发送失败数超过0，请及时检查'})
            }

            if(sdSendFailCnt > 0) {
              ++ count
              infoList.push({infoText: '['+ count +']站部发送失败数超过0，请及时检查'})
            }


            if(recvFailCnt > 0) {
              ++ count
              infoList.push({infoText: '['+ count +'收费站入库失败数超过0，请及时检查'})
            }

            if (infoList.length > 0) {
              item.status = 'abnormal'
            } else {
              item.status = 'normal'
            }

            var transStaWarnInfo = {}
            if('abnormal' === item.status) {
              transStaWarnInfo = {
                title :'完整性异常 （' + infoList.length + '条） ' + that.warnCollectData,
                infoList: infoList
              }
            }
            var columnIndex = laneMap[item.laneId]
            that.updateLaneRow(columnIndex, 'transStaInfo', item.status)
            that.updateLaneRow(columnIndex, 'transStaWarnInfo', transStaWarnInfo)
          })
        }

        var uploadTimeliness = data['uploadTimeliness']
        if (uploadTimeliness) {

          var infoList = []
          var stationMap = {}
          uploadTimeliness.forEach(function(item, index) {
            var proSendCnt15_30 = item.proSendCnt15_30 || 0 // 15<T<=30(分钟)
            var proSendCnt30_60  = item.proSendCnt30_60 || 0 // 30<T<=60(分钟)
            var proSendCnt60_120  = item.proSendCnt60_120 || 0 //  60<T<=120(分钟)
            var proSendCnt120_n  = item.proSendCnt120_n || 0 // T>120(分钟)
            var stationText  = item.stationName || '未知'


            var sendCount = proSendCnt15_30 + proSendCnt30_60 + proSendCnt60_120 + proSendCnt120_n

            var stationMapKey = stationText + item.collectType
            if ('pro' === item.collectType) {
              if (!stationMap[stationMapKey]) {
                stationMap[stationMapKey] = {collectType:'pro' , count : sendCount, stationText : stationText}
              } else {
                stationMap[stationMapKey].count =  stationMap[stationMapKey].count + sendCount
              }
            }

            if ('dep' === item.collectType) {
              if (!stationMap[stationMapKey]) {
                stationMap[stationMapKey] = {collectType:'dep' , count : sendCount, stationText : stationText}
              } else {
                stationMap[stationMapKey].count =  stationMap[stationMapKey].count + sendCount
              }
            }
          })

          var cIndex = 0
          for(var key in stationMap) {
            var value = stationMap[key];
            var stationText = value.stationText;
            var count = value.count;

            if (count <= 10) {
              continue
            }
            if ('pro' === value.collectType) {
              ++ cIndex
              infoList.push({infoText: '['+ cIndex  +']' + stationText + '，站省发送数有' + count + '条超过15分钟'})
            }
            if ('dep' === value.collectType) {
              ++ cIndex
              infoList.push({infoText: '[' + cIndex + ']' + stationText + '，站部发送数有' + count + '条超过15分钟'})
            }
          }


          if(infoList.length > 0) {
            this.uploadTimelinessWarnInfo = {
              title : '时效性异常 （' + infoList.length + '条） ' + that.warnCollectData,
              infoList: infoList
            }
            this.monitorUploadTimelinessUrl =  'lane/monitor/蓝时.png'
          } else {
            this.uploadTimelinessWarnInfo = {}
            this.monitorUploadTimelinessUrl =  'lane/monitor/灰时.png'
          }
        }
      } catch (e) {
        console.log(e)
      }

      if(laneParamUseCols.length > 0) {
        this.dealLaneParamWarn(data)
      } else {
        this.findUseColLaneList(data)
      }

      if(serverParamUseCols.length > 0) {
        this.dealServerParamWarn(data)
      } else {
        this.findUseColServerList(data)
      }

    },
    async findUseColLaneList(data) {
      findUseList({ belongModule: 'monitorLaneParam'}).then(res => {
        if(res.data) {
          laneParamUseCols = []
          res.data.forEach(item => {
            if (item.code.indexOf('CurVer') > 0){
              laneParamUseCols.push(item)
            }
          })
        }
        if(laneParamUseCols.length > 0) {
          this.dealLaneParamWarn(data)
        }
      })
    },
    async findUseColServerList(data) {
      findUseList({ belongModule: 'monitorStationParam'}).then(res => {
        if(res.data) {
          serverParamUseCols = []
          res.data.forEach(item => {
            if (item.code.indexOf('CurVer') > 0){
              serverParamUseCols.push(item)
            }
          })
        }
        if(serverParamUseCols.length > 0) {
          this.dealServerParamWarn(data)
        }
      })
    },
    dealLaneParamWarn(data) {
      var laneParam = data['laneParam']
      var that = this
      if (laneParam) {
        var sumData = Object.assign({}, laneParam[0])
        laneParam.splice(0, 1)
        laneParam.forEach(function(item, index) {
          var columnIndex = laneMap[item.laneId]
          if (columnIndex) {
            var infoList = []
            var count = 0;
            var laneNo = item.laneNo || ''
            laneParamUseCols.forEach(function(column, index) {
              var col = column.code

              var serverVersion = (sumData[col] == '' || sumData[col] == null || typeof(sumData[col]) == "undefined")? '无' : sumData[col]
              var colVal = (item[col] == '' || item[col] == null  || typeof(item[col]) == "undefined")? '无' : item[col]
              if (serverVersion !== colVal) {
                if(colVal == '无') {
                  ++ count
                  infoList.push({infoText: '['+ count +']当前车道'+  column.name+'参数版本（无）与收费站' + (item.stationName || '')+ '参数版本（'+ serverVersion +'）不一致'})
                } else {
                  if("rateCurVer" ==  col) {
                    var versions = item[col].split('|');
                    var compareFlag = false
                    // 终止for循环，使用break
                    for (var i=0; i < versions.length; i++) {

                      if( versions[i].substring(2,versions[i].length) == sumData[item.code]) {
                        compareFlag = true
                        break;
                      }
                    }

                    if (!compareFlag) {
                      ++ count
                      infoList.push({infoText: '['+ count +']当前车道'+ column.name +'参数版本（' + colVal + '）与收费站' + (item.stationName || '')+ '参数版本（'+ serverVersion +'）不一致'})
                    }
                  } else {
                    ++ count
                    infoList.push({infoText: '['+ count +']当前车道'+ column.name +'参数版本（' + colVal + '）与收费站' + (item.stationName || '')+ '参数版本（'+ serverVersion +'）不一致'})
                  }
                }

              }
            })
            if (infoList.length > 0) {
              item.status = 'abnormal'
            } else {
              item.status = 'normal'
            }
            var laneParamVersionWarnInfo = {}
            if('abnormal' === item.status) {
              laneParamVersionWarnInfo = {
                title :'车道参数版本异常（' + infoList.length + '条） ' + that.warnCollectData,
                infoList: infoList
              }
            }
            that.updateLaneRow(columnIndex, 'laneParamVersionInfo', item.status)
            that.updateLaneRow(columnIndex, 'laneParamVersionWarnInfo', laneParamVersionWarnInfo)
          }
        })
      }
    },
    dealServerParamWarn(data) {
      var serverParam = data['serverParam']
      var that = this
      if (serverParam) {
        var sumData = Object.assign({}, serverParam[0])
        serverParam.splice(0, 1)
        var infoList = []
        serverParam.forEach(function(item, index) {
          var count = 0;
          serverParamUseCols.forEach(function(column, index) {
            var col = column.code
            var proVersion = (sumData[col] == '' || sumData[col] == null  ||  typeof(sumData[col]) == "undefined")? '无' : sumData[col]
            var colVal = (item[col] == '' || item[col] == null  || typeof(item[col]) == "undefined")? '无' : item[col]
            if (proVersion !== colVal) {
              ++count
              infoList.push({infoText: '['+ count +']' + item.stationName+ column.name + '参数版本（' + colVal + '）与省中心'+ column.name + '参数版本（'+proVersion+'）不一致'})
            }
          })
        })
        if(infoList.length > 0) {
          that.serverParamVersionWarnInfo = {
            title : '收费站参数版本异常 （' + infoList.length + '条） ' + that.warnCollectData,
            infoList: infoList
          }
          this.monitorParamUrl = 'lane/monitor/蓝参.png'
        } else {
          that.serverParamVersionWarnInfo = {}
          this.monitorParamUrl = 'lane/monitor/灰参.png'
        }
      }

    },
    dealLaneData(index, data) {
      const row = this.tableData.columnsDataList[index]
      if (!row) {
        return
      }
      var SMType = data.SMType + ''
      switch (SMType) {
        // 特殊事件请求

        //特殊事件处理（修改）
        case '1':
          this.robotDeal(index, data)
          break
        // 状态信息处理
        case '2':
          this.statusDeal(index, data)
          break
        default:

      }
    },
    // 状态信息处理
    statusDeal(index, data) {
      /**
       * 设备状态
       */
      if (data.SMName.substr(0, 16) == 'IF_LaneDevStatus') {
        this.laneDevStatusDeal(index, data)
      } else if (data.SMName == 'IF_GlobalInfo') {  //车道状态
        this.globalInfoDeal(index, data)
      } else if (data.SMName == 'IF_VehQ_TransInfo') { // 过车信息
        this.vehQTransInfoDeal(index, data)
      } else if (data.SMName == 'IF_VehQ_PicInfo') { // 车道图片信息
        this.vehQPicInfoDeal(index, data)
      } else if (data.SMName.indexOf('IF_LaneAlarm') >= 0) {
        // this.laneAlarmDealTEST(index, data)
        this.laneAlarmDeal(index, data)
      }

    },
    laneAlarmDeal(index, data){


      const obj = data.SMData
      const row = this.tableData.columnsDataList[index]
      var laneAlarmWarnInfo = this.tableData.columnsDataList[index].laneAlarmWarnInfo || { title :'',
        infoList: []}
      if(!row.laneAlarms) {
        row.laneAlarms = []
        row.laneAlarmNos = []
      }

      var infoList = []
      if (laneAlarmWarnInfo) {
        infoList = laneAlarmWarnInfo.infoList
      }
      if(obj.Flag === "1") {
        if(row.laneAlarmNos.indexOf(obj.AlarmNo) < 0) {

          row.laneAlarmNos.push(obj.AlarmNo)
          row.laneAlarms.push(obj)
          infoList.push({infoText: '[' + (infoList.length + 1) + ']' +obj['AlarmDetail']})
        }

      } else if (obj.Flag === "2") {
        for (let i = 0;i< row.laneAlarms.length;i++){
          let laneObj = row.laneAlarms[i];
          if (laneObj.AlarmNo === obj.AlarmNo){
            row.laneAlarms.splice(i,1);
            row.laneAlarmNos.splice(i,1);
            infoList.splice(i,1);
            i--
            break
          }
        }
      }

      var laneAlarmInfo = ''
      if (infoList.length > 0) {
        laneAlarmInfo = 'abnormal'
      } else {
        laneAlarmInfo = 'normal'
      }
      if('abnormal' === laneAlarmInfo) {
        laneAlarmWarnInfo = {
          title :'车道告警 （' + infoList.length + '条） ',
          infoList: infoList
        }
      }

      this.updateLaneRow(index, 'laneAlarmInfo', laneAlarmInfo)
      this.updateLaneRow(index, 'laneAlarmsCount', infoList.length)
      this.updateLaneRow(index, 'laneAlarmWarnInfo', laneAlarmWarnInfo)

    },


    // 回控信息
    robotDeal(index, data) {
      if (data.SMName == 'IF_LaneGuiRsp') { // 日志信息
        this.laneGuiRspDeal(index, data)
      }else if (data.SMName == 'IF_RobotCtrl') {
        //alert(index)
        this.robotCtrlDeal(index, data)
      }

    },

    robotCtrlDeal(index, data) {
      //console.log('robotCtrlDeal')
      //console.log(data)
      var monitorInfo = data.SMData
      if (monitorInfo.CtrlType == 6) {
        // 关闭前置事件请求
        var vuecom = connetIPMap[index].vuecom
        if (vuecom) {
          this.tableData.SpecialEvents[index] = undefined
          vuecom.$destroy(true)
          vuecom.$el.parentNode.removeChild(vuecom.$el)
        }

        // 回控请求
        monitorInfo.IP = connetIPMap[index].IP
        monitorInfo.index = index
        monitorInfo.genTime = monitorInfo.genTime.replace('T', ' ')

        // 离岗
        if (curStationStatus == 1) {
          // 返回特100-转班长授权
          try {
            connetIPMap[index].monitorInfo = monitorInfo
            var websocket = connetIPMap[index].websocket
            var monitorInfo = connetIPMap[index].monitorInfo
            var tableData = window.tableDataList[index]

            var ms = getDealStatus(tableData, monitorInfo, 100)
            websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
          } catch (err) {
            // 处理错误
            console.log(err)
          }
          return
        }

        var monitorDialog
        if (monitorInfo.popDlgText.search("选择货车重量") !== -1)
        {
          console.log(monitorInfo)
          monitorInfo.ACMReq = JSON.parse(monitorInfo.ACMReq)
          const dataLane = this.tableData.columnsDataList[index]
          console.log(monitorInfo.ACMReq)
          if(monitorInfo.ACMReq.weightInfo)
          {
            this.weightInfo.push({ip:monitorInfo.IP,index:monitorInfo.index,
              weightData:JSON.parse(monitorInfo.ACMReq.weightInfo),
              popDlgCode:monitorInfo.popDlgCode,popDlgName:monitorInfo.popDlgName,
              title:dataLane.stationText + '-' + dataLane.entryExitTypeText + '-' + dataLane.laneNo,
              vehiclePlate:monitorInfo.vehiclePlate})
          }
          else
          {
            this.weightInfo.push({ip:monitorInfo.IP,index:monitorInfo.index,
              weightData:[],
              popDlgCode:monitorInfo.popDlgCode,popDlgName:monitorInfo.popDlgName,
              title:dataLane.stationText + '-' + dataLane.entryExitTypeText + '-' + dataLane.laneNo,
              vehiclePlate:monitorInfo.vehiclePlate})
          }
          if(!this.showWeightDlg) {
            this.getWeightData()
            this.showWeightDlg = true
          }
          // this.getWeightData()
          // monitorDialog = this.openWeightDialog(monitorInfo, this.close)
          return;
        }
        else
        {
          console.log(monitorInfo)
          if(monitorInfo.ACMReq) {
            monitorInfo.ACMReq = JSON.parse(monitorInfo.ACMReq)
            if(monitorInfo.ACMReq.EnEntryInfo)
            {
              monitorInfo.ACMReq.EnEntryInfo = JSON.parse(monitorInfo.ACMReq.EnEntryInfo)
            }
          }
          if(monitorInfo.ACMReq && monitorInfo.ACMReq.ReqType)
          {
            // 车型错误
            if(monitorInfo.ACMReq.ReqType>=1 && monitorInfo.ACMReq.ReqType<=11)
            {
              console.log(monitorInfo)
              monitorDialog = this.openErrorDialog(monitorInfo, this.close)
            }

          }
          else{
            monitorDialog = this.openDialog(monitorInfo, this.close)
          }
        }


        const row = this.tableData.columnsDataList[index]
        var spEventContent = monitorInfo.popDlgText || ''
        var spEventText = spEventContent.substr(0, spEventContent.indexOf('\n'))
        monitorInfo['spEventContent'] = row.stationText + row.entryExitTypeText + row.laneNo + "："  + spEventText

        connetIPMap[index].vuecom = monitorDialog
        connetIPMap[index].monitorInfo = monitorInfo

        // 设置列表显示
        this.tableData.SpecialEvents[index] = connetIPMap[index]
        this.monitorCtrUrl = 'lane/monitor/蓝控.png'
        this.soundPlay(spEventText)
      } else {
        // 回控反馈
        // 关闭特殊事件请求
        if (monitorInfo.opStatus != 1) {
          var vuecom = connetIPMap[index].vuecom
          if (vuecom) {
            connetIPMap[index].vuecom = null
            this.tableData.SpecialEvents[index] = undefined
            this.monitorCtrUrl = 'lane/monitor/灰控.png'
            vuecom.$destroy(true)
            vuecom.$el.parentNode.removeChild(vuecom.$el)

          }
        }

        if (monitorInfo.opStatus == 0) {

        } else if (monitorInfo.opStatus == 1) {

        } else if (monitorInfo.opStatus == 2) {

        } else if (monitorInfo.opStatus == 3) {

        }
      }
    },

    laneDevStatusDeal(index, data) {
      const obj = data.SMData
      const row = this.tableData.columnsDataList[index]
      var useDev = true
      switch (data.SMKey) {
        // 顶棚状态
        case 'DEV013':
        //debugger
          if (!row) {
            return
          }
          if (obj.DevStatus == 0) {
            // WorkStatus 0-关，1-开
            if (obj.WorkStatus == 1) {
              if (!row.imgTopLight) {
                row.imgTopLightSrc = 'lane/monitor/雨棚灯(绿灯).bmp'
                row.imgTopLight = true

              }
            } else if (obj.WorkStatus == 0) {
              if (row.imgTopLight) {
                row.imgTopLight = false
                row.imgTopLightSrc = 'lane/monitor/雨棚灯(红灯).bmp'
              }
            }
          }
          // 故障
          else if (obj.DevStatus == 1) {
            if (row.imgTopLight) {
              row.imgTopLight = false
              row.imgTopLightSrc = 'lane/monitor/雨棚灯(未知).bmp'
            }
          }
          break
        // 打印机状态
        case 'DEV031':
          if (obj.DevStatus == 0) {
            row.imgPrinterSrc = 'lane/monitor/打印机(连接).bmp'
          } else if (obj.DevStatus == 1) {
            row.imgPrinterSrc = 'lane/monitor/打印机(未连接).bmp'
          }
          break
        // 地感状态（多个）
        case 'DEV001':
          row.imgPreWireLoop1Has = true
        case 'DEV002':
        case 'DEV003':
        case 'DEV004':
        case 'DEV005':
        case 'DEV006':
        case 'DEV007':
        case 'DEV008':
        case 'DEV009':
        case 'DEV010':

          var devnum = Number(data.SMKey.slice(3))
          // 不启用隐藏图标
          var temp = row['imgPreWireLoop' + devnum]

          if(devnum != 1 && !row.imgPreWireLoop1Has) {
            row.imgPreWireLoop1 = false
            var keyIndex = this.devArr.indexOf(data.SMKey);
            if( keyIndex >= 0) {
              this.devArr.splice(keyIndex, 1)
            }
          }
          // 不使用
          if (obj.DevStatus < 0) {
            if (temp) {
              row['imgPreWireLoop' + devnum] = false
            }
          } else {
            // 启用显示图标
            if (!temp) {
              row['imgPreWireLoop' + devnum] = true
            }

            // 控制状态图标
            if (obj.DevStatus == 0) {
              row['imgPreWireLoop' + devnum + 'Src'] = 'lane/monitor/线圈(正常).bmp'
            }
            // 故障
            else if (obj.DevStatus == 1) {
              row['imgPreWireLoop' + devnum + 'Src'] = 'lane/monitor/线圈(异常).bmp'
            }
          }
          break
        // 栏杆机状态
        case 'DEV011':

          if (!row) {
            return
          }

          if (obj.DevStatus == 0) {
            // WorkStatus 0-关，1-开
            if (obj.WorkStatus == 1) {
              if (!row.imgAutoBarryDown) {
                row.imgAutoBarryDown = true
                row['imgAutoBarryDownSrc'] = 'lane/monitor/栏杆(抬杆).bmp'
              }
            } else if (obj.WorkStatus == 0) {
              if (row.imgAutoBarryDown) {
                row.imgAutoBarryDown = false
                row['imgAutoBarryDownSrc'] = 'lane/monitor/栏杆(落杆).bmp'
              }
            }
          } else if (obj.DevStatus == 1) {
            row.imgAutoBarryDown = false
            row['imgAutoBarryDownSrc'] = 'lane/monitor/栏杆(未知).bmp'
          }
          break
        // 天线状态
        case 'DEV028':
          if (obj.DevStatus == 0) {
            row['imgRSUSrc'] = 'lane/monitor/RSU正常.bmp'
          } else if (obj.DevStatus == 1) {
            row['imgRSUSrc'] = 'lane/monitor/RSU错误.bmp'
          }
          break
        // 车牌识别状态（多个）
        //case 'DEV023':
        // 视频抓拍
        case 'DEV027':
          row.imgReader1Has= true
          if (obj.DevStatus == 0) {
            row['imgReader1Src'] = 'lane/monitor/Reader1.png'
          } else if (obj.DevStatus == 1) {
            row['imgReader1Src'] = 'lane/monitor/Reader0.png'
          }
          break
        // case 'DEV024':
        //
        //   if (!row) {
        //     return
        //   }
        //
        //   if(!row.imgReader1Has) {
        //     row.imgReader1 = false
        //   }
        //
        //   if (obj.DevStatus < 0) {
        //     if (row.imgReader2) {
        //       row.imgReader2 = false
        //     }
        //   } else {
        //     if (!row.imgReader2) {
        //       row.imgReader2 = true
        //     }
        //
        //     if (obj.DevStatus == 0) {
        //       row['imgReader2Src'] = 'lane/monitor/Reader1.png'
        //     } else if (obj.DevStatus == 1) {
        //       row['imgReader2Src'] = 'lane/monitor/Reader0.png'
        //     }
        //   }
        //   break
        default:
          useDev = false
          break
      }
      var keyIndex = this.devArr.indexOf(data.SMKey);

      if( useDev && keyIndex < 0 && obj.DevStatus >= 0) {
        this.devArr.push(data.SMKey)
        try {
          this.$refs.laneMonitorXTable.recalculate(true)
        } catch (error) {
          console.log(error)
        }
      }

      // 通讯服务状态（状态启用）

      if (row['imgParaRhSrc'].substring(row['imgParaRhSrc'].length - 12) == 'webClose.bmp') {
        window.webStatusMap[index] = {}
        window.webStatusMap[index].status = true
        row['imgParaRhSrc'] = 'lane/monitor/webOpen.bmp'
      }

    },
    globalInfoDeal(index, data) {
      console.log("globalInfoDeal")
      const obj = data.SMData
      var operatorName = '[0]未登录'
      var shiftDate = ''
      var shift = ''
      if (obj.LoginStatus == 1) {
        operatorName = '[' + obj.OperatorNo + ']' + obj.OperatorName
        shiftDate = obj.SquadDate.substr(0, 10)
        shift = obj.SquadName
      }
      this.updateLaneRow(index, 'operatorName', operatorName)
      this.updateLaneRow(index, 'shiftDate', shiftDate)
      this.updateLaneRow(index, 'shift', shift)
    },
    vehQTransInfoDeal(index, data) {
      const obj = data.SMData
      const row = this.tableData.columnsDataList[index]
      if (row.entryExitTypeText == '出口') {
        obj.stationText = row.stationText
      } else {
        obj.EnStationName = row.stationText
        obj.PayCardType = -1
      }
      this.updateMonitorInfo(index, obj)
    },
    vehQPicInfoDeal(index, data) {
      if (data.SMData.VehImg) {
        this.updateLaneRow(index, 'vehImg', 'data:image/jpeg;base64,' + data.SMData.VehImg )
      } else {
        this.updateLaneRow(index, 'vehImg', '' )
      }

    },
    laneGuiRspDeal(index, data) {
      // var logList = this.tableData.columnsDataList[index].logList
      var logList = this.logData[index].logList
      if (logList) {
        if (data.SMData.CmdCode == 'LU_ShowLog' && data.SMData.LogText) {
          logList.push(data.SMData)

          if (logList.length > 25) {
            logList = logList.slice(logList.length - 25, logList.length)
          }
          //jq(logId).append('<div style="height: 30px"  class="logDiv" >' + data.SMData.LogText + '</div>')
        }
        //20230116 修复logList刷新问题
        if(this.logData[index].expanded) {
          this.updateLaneRow(index, 'logList', logList)
          //如果展开，就播放动画
          this.$nextTick(() => {
            var logId = '#log_'+ index
            if (jq(logId + ' div:last-child').length > 0) {
              //动画效果
              jq(logId).animate({
                scrollTop: jq(logId + ' div:last-child')[0].offsetTop * 1
              }, 0);
            }
          })
        }
      }



    },
    toggleRowExpand(row, expanded, d) {
      if(row.expanded) {
        this.$refs.laneMonitorXTable.toggleRowExpand(row)
        //20230116
        this.logData[row.rowIndex].expanded = true
        this.$nextTick(() => {
          var logId = '#log_'+ row.rowIndex
          if (jq(logId + ' div:last-child').length > 0) {
            //动画效果
            jq(logId).animate({
              scrollTop: jq(logId + ' div:last-child')[0].offsetTop * 1
            }, 0);
          }
        })
      }
    },
    // 打开设备控制弹窗
    openDevDialog(obj) {
      // 移除前一个弹窗
      if (window.DevDialogVue) {
        window.DevDialogVue.$destroy(true)
        window.DevDialogVue.$el.parentNode.removeChild(window.DevDialogVue.$el)
        window.DevDialogVue = null
        return
      }

      const param = this.tableData.columnsDataList[obj.index]

      const tagDialog = {
        obj: null
      }

      // 初始化组件参数
      const options = {
        data: {
          IP: param.serverIp,
          index: obj.index,
          param: param,
          loading: this.loading,
          pageWeight: this.pageWeight,
          selectedWeight: this.selectedWeight,
          tableWeightData: this.tableWeightData,
          columnsWeight: this.columnsWeight
        },
        methods: {
          // 设备控制指令
          devOper(index, ctrlType, ctrlCode) {
            var obj = new Object()
            obj.SMType = 1
            obj.SMName = 'IF_RobotCtrlRsp'

            // 顶棚灯
            if (ctrlType == 11) {
              obj.SMData = getTopLightCtr(ctrlCode)
            }
            // 控制栏杆
            else if (ctrlType == 2) {
              obj.SMData = getRemoteCtrl(ctrlCode)
            }
            else if (ctrlType == 8) {
              obj.SMData = getPaperCtrl()
            }

            // 发送控制指令
            connetIPMap[index].websocket.send(JSON.stringify(obj))

            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
            window.DevDialogVue = null
          },
          handlePageWeightChange:this.handlePageWeightChange,
          cellDBLClickEvent:this.cellDBLClickEvent,
          /**
           * 点击 X 关闭对话框的回调
           **/
          handleDialogClose() {
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
            window.DevDialogVue = null
          }
        }
      }

      // 设置弹窗车道信息
      var title = ''
      if (connetIPMap[param.serverIp]) {
        var index = connetIPMap[param.serverIp].index
        var data = this.tableData.columnsDataList[index]
        title = data.stationText + '-' + data.entryExitTypeText + '-' + data.laneNo
      }

      // 传入组件的props
      const props = {
        title: '设备控制 > ' + title
      }

      // 初始化组件返回模板
      const tpl = generateDevOperDialog(options)

      // 使用Vue构造器创建一个“子类”
      const judy = Vue.extend(tpl)

      // 实例化“子类”并把它挂在dom上
      tagDialog.obj = new judy({
        propsData: props
      }).$mount(`#${tpl.id}`)
      return tagDialog.obj
    },
    // callback 弹窗点击确定后触发
    // 函数参数随意自定义
    openDialog(param, callback) {
      // 用于存储组件对象，可通过该对象直接操作组件的data或者调用组件的methods
      // object类型，为了应对ajax请求等 异步操作
      const tagDialog = {
        obj: null
      }

      // 设置弹窗车道信息
      var title = ''
      var entryExitTypeText = ''
      if (connetIPMap[param.index]) {
        if(this.popTotal==8){
          this.$notify.warning('待处理特情太多，请增加工位')
        }
        this.popTotal ++
        // 打开弹框
        console.log(111,this.popTotal,param.index)
        var index = param.index
        var data = this.tableData.columnsDataList[index]
        var that = this
        console.log(this.$refs.laneMonitorXTable)
        this.$refs.laneMonitorXTable.clearRowExpand()
        // for (var item in this.logData) {
        //   console.log(item)
        //   item.expanded = false
        // }
        for(var i = 0; i < this.logData.length; i++)
        {
          this.logData[i].expanded = false
        }
        setTimeout(()=>{
          this.$refs.laneMonitorXTable.toggleRowExpand(data,true)
          that.logData[index].expanded = true
          this.$refs.laneMonitorXTable.scrollTo(0, 48 * Number(index))
          this.$refs.laneMonitorXTable.setCurrentRow(data)
        },300)



        entryExitTypeText = data.entryExitTypeText

        title = data.stationText + '-' + data.entryExitTypeText + '-' + data.laneNo
      }

      // 初始化组件参数
      const options = {
        data: {
          IP: param.IP,
          entryExitTypeText: entryExitTypeText,
          param: param,
          index: index,
          loadingWeight : this.loading,
          pageSize : this.pageWeight.pageSize,
          currentPage : this.pageWeight.currentPage,
          columnsWeight : this.columnsWeight,
          pageWeight : this.pageWeight,
          tableWeightData : this.tableWeightData,
          handlePageWeightChange : this.handlePageWeightChange
        },
        methods: {
          confirmEvent(index) {
            console.log('-----confirmEvent')
            this.popTotal--
            // 返回特殊事件同意信号
            try {
              const websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]

              var ms = getDealStatus(tableData, monitorInfo, 1)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          },
          cancel(index) {
            this.popTotal--
            // 返回特殊事件拒绝信号
            try {
              var websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]

              var ms = getDealStatus(tableData, monitorInfo, 0)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          }
        }
      }

      // 传入组件的props
      const props = {
        title: '特情回控申请> ' + title
      }

      // 初始化组件返回模板
      let tpl = generateDialogTemplate(options)

      // 使用Vue构造器创建一个“子类”
      const judy = Vue.extend(tpl)

      // 实例化“子类”并把它挂在dom上
      tagDialog.obj = new judy({
        propsData: props
      }).$mount(`#${tpl.id}`)

      return tagDialog.obj
    } ,
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return 'background: #e7e7e8'
      }
    },
    //显示选择计重对话框
    openWeightDialog(param, callback) {
      // 用于存储组件对象，可通过该对象直接操作组件的data或者调用组件的methods
      // object类型，为了应对ajax请求等 异步操作
      const tagDialog = {
        obj: null
      }

      // 设置弹窗车道信息
      var title = ''
      var entryExitTypeText = ''
      if (connetIPMap[param.index]) {
        var index = param.index
        var data = this.tableData.columnsDataList[index]
        entryExitTypeText = data.entryExitTypeText

        title = data.stationText + '-' + data.entryExitTypeText + '-' + data.laneNo
      }

      // 初始化组件参数
      const options = {
        data: {
          IP: param.IP,
          entryExitTypeText: entryExitTypeText,
          param: param,
          index: index,
          loading: this.loading,
          pageWeight: JSON.stringify(this.pageWeight),
          selectedWeight: JSON.stringify(this.selectedWeight),
          tableWeightData: JSON.stringify(this.tableWeightData),
          columnsWeight: JSON.stringify(this.columnsWeight)
        },
        methods: {
          confirmEvent(index) {
            // 返回特殊事件同意信号
            try {
              const websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]

              var ms = getDealStatus(tableData, monitorInfo, 1)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          },
          handlePageWeightChange:this.handlePageWeightChange,
          cellDBLClickEvent:this.cellDBLClickEvent,
          cancel(index) {
            // 返回特殊事件拒绝信号
            try {
              var websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]

              var ms = getDealStatus(tableData, monitorInfo, 0)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          }
        }
      }

      // 传入组件的props
      const props = {
        title: '货车重量选择> ' + title
      }

      // 初始化组件返回模板
      let tpl = generateWeightDialog(options)

      // 使用Vue构造器创建一个“子类”
      const judy = Vue.extend(tpl)

      // 实例化“子类”并把它挂在dom上
      tagDialog.obj = new judy({
        propsData: props
      }).$mount(`#${tpl.id}`)

      return tagDialog.obj
    } ,
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return 'background: #e7e7e8'
      }
    },
    //xia修改
    openErrorDialog(param, callback) {
      // 用于存储组件对象，可通过该对象直接操作组件的data或者调用组件的methods
      // object类型，为了应对ajax请求等 异步操作
      const tagDialog = {
        obj: null
      }

      // 设置弹窗车道信息
      var title = ''
      var entryExitTypeText = ''
      var errorTypeText = ''
      var errorTypeArray = ["车型不符","车牌不符","选择入口信息","输入入口信息","车辆与ETC卡内车牌是否一致","车型错误","车牌错误","轴数不符","牵引拖挂车车种不符","第一辆车车牌重复","发起纸卷交易"]
      if (connetIPMap[param.index]) {
        var index = param.index
        var data = this.tableData.columnsDataList[index]
        entryExitTypeText = data.entryExitTypeText
        title = data.stationText + '-' + data.entryExitTypeText + '-' + data.laneNo
      }
        var reqType = param.ACMReq.ReqType
        errorTypeText = errorTypeArray[Number(reqType)-1]
        // 车型全景图
        if(param.ACMReq.VehicleWholePic)
          var img_base64 = param.ACMReq.VehicleWholePic
        // 车牌识别图
        if(param.ACMReq.VehiclePlatePic)
          var VehiclePlatePic = param.ACMReq.VehiclePlatePic
          // 车型不符 1 入口车型
        if(param.ACMReq.EnVehicleType)
          var EnVehicleType = getVehTypeStr(param.ACMReq.EnVehicleType)
          // 车型不符 1 出口车型
        if(param.ACMReq.ExVehicleType)
          var ExVehicleType = getVehTypeStr(param.ACMReq.ExVehicleType)
          // 车型错误 6
        if(param.ACMReq.VehicleType)
          var ExVehicleType = param.ACMReq.VehicleType
        if(param.ACMReq.ReqType=='2')
          {
              // 车牌不符 2 车牌
              if(param.ACMReq.EnVehiclePlate)
              {
                var EnVehiclePlate = param.ACMReq.EnVehiclePlate
              }
              // 车牌不符 2 颜色
              if(param.ACMReq.EnVehiclePlateColor)
              {
                var EnVehicleColor = param.ACMReq.EnVehiclePlateColor

              }
              // 车牌不符 2 车牌
              if(param.ACMReq.ExVehiclePlate)
              {
                var ExVehiclePlate = param.ACMReq.ExVehiclePlate
              }
              // 车牌不符 2 颜色
              if(param.ACMReq.ExVehiclePlateColor)
              {
                var ExVehicleColor = param.ACMReq.ExVehiclePlateColor

              }
        }
            if(param.ACMReq.EnEntryInfo)
            {
              //3  入口信息
              var EnInfor=param.ACMReq.EnEntryInfo
            }
         // 车牌错误 7 车牌
        if(param.ACMReq.VehiclePlate)
        {
           var ExVehiclePlate = param.ACMReq.VehiclePlate
        }
        // 车牌错误 7 颜色
        if(param.ACMReq.VehiclePlateColor)
        {
           var ExVehicleColor = param.ACMReq.VehiclePlateColor
        }
        //入口轴数
        if(param.ACMReq.EnAxisCount)
        {
           var EnAxisCount=param.ACMReq.EnAxisCount
        }
        //出口轴数
        if(param.ACMReq.ExAxisCount)
        {
           var ExAxisCount=param.ACMReq.ExAxisCount
        }
        if(param.ACMReq.EtcVehiclePlate)
        {
           var EnVehiclePlate = param.ACMReq.EtcVehiclePlate
        }
        if(param.ACMReq.VehiclePlate)
        {
           var ExVehiclePlate = param.ACMReq.VehiclePlate
        }
        if(param.ACMReq.LastLaneNo)
        {
           var EnVehiclePlate = param.ACMReq.LastLaneNo
        }
        if(param.ACMReq.LastPasstime)
        {
           var ExVehiclePlate = param.ACMReq.LastPasstime
        }
      // 初始化组件参数
      const options = {
        data: {
          IP: param.IP,
          entryExitTypeText: entryExitTypeText,
          param: param,
          index: index,
          loadingWeight : this.loading,
          pageSize : this.pageWeight.pageSize,
          currentPage : this.pageWeight.currentPage,
          columnsWeight : this.columnsWeight,
          pageWeight : this.pageWeight,
          tableWeightData : this.tableWeightData,
          handlePageWeightChange : this.handlePageWeightChange
        },
        methods: {
          confirmEvent(index,innerID,errInfo) {
            // 返回特殊事件同意信号
            try {
              const websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]

              var ms = getDealErrStatus(tableData, monitorInfo, '1',innerID,errInfo)
              console.log('ms 1')
              console.log(ms)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          },
          cancel(index,errInfo) {
            // 返回特殊事件拒绝信号
            try {
              var websocket = connetIPMap[index].websocket
              var monitorInfo = connetIPMap[index].monitorInfo
              var tableData = window.tableDataList[index]
              var ms = getDealErrStatus(tableData, monitorInfo, '0','',errInfo)
              console.log('ms 2')
              console.log(ms)
              websocket.send(JSON.stringify(ms)) // 将消息发送到服务端
            } catch (err) {
              // 处理错误
              console.log(err)
            }
          }
        }
      }

      // 传入组件的props
      const props = {
        title: '> ' + title,
        img_base64,
        reqType,
        errorTypeText,
        VehiclePlatePic,
        EnVehicleType,
        ExVehicleType,
        EnVehiclePlate,
        EnVehicleColor,
        ExVehiclePlate,
        ExVehicleColor,
        EnAxisCount,
        ExAxisCount,
        EnInfor
      }
      // 初始化组件返回模板
      let tpl = generateErrDialogTemplate(options)

      // 使用Vue构造器创建一个“子类”
      const judy = Vue.extend(tpl)

      // 实例化“子类”并把它挂在dom上
      tagDialog.obj = new judy({
        propsData: props
      }).$mount(`#${tpl.id}`)

      return tagDialog.obj
    } ,
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return 'background: #e7e7e8'
      }
    }
  }
}

// 组装特殊事件响应信息, 状态（status）
var getDealStatus = function(tableData, monitorInfo, status) {
  var obj = new Object()
  obj.SMType = 1
  obj.SMName = 'IF_RobotCtrlRsp'

  var data = new Object()
  data.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  if(monitorInfo.popDlgCode)
    data.popDlgCode = monitorInfo.popDlgCode
  if(monitorInfo.popDlgName)
    data.popDlgName = monitorInfo.popDlgName
  data.confirm = status
  data.msgType = 107
  data.terminalType = 2 //监控室回控
  obj.SMData = data
  return obj
}
// --xia修改---组装特殊事件响应信息, 状态（status）
var getDealErrStatus = function(tableData, monitorInfo, status,innerID,param) {
  console.log('tableData')
  console.log(tableData)
  console.log('monitorInfo')
  console.log(monitorInfo)
  console.log(param)
  var obj = new Object()
  obj.SMType = 1
  obj.SMName = 'IF_RobotCtrlRsp'

  var data = new Object()
  data.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  data.confirm = status
  data.msgType = 107
  data.terminalType = 2 //监控室回控
  var acmData = new Object()
   acmData.ResultType = monitorInfo.ACMReq.ReqType

    if(monitorInfo.ACMReq.ReqType==1)
    {
      if(status==1)
      {
       if(innerID=='0')
       {
         acmData.ExVehicleType =monitorInfo.ACMReq.EnVehicleType
       }
       else  if(innerID=='1')
       {
         acmData.ExVehicleType =monitorInfo.ACMReq.ExVehicleType
       }
       else
       {
       acmData.ExVehicleType = param
       }
      }
      else
      {
        acmData.ExVehicleType ='';
      }
    }
  else if(monitorInfo.ACMReq.ReqType==2)
    {
      if(status==1)
      {
       if(innerID=='0')
       {
           acmData.ExVehiclePlate =monitorInfo.ACMReq.EnVehiclePlate;
           acmData.ExVehiclePlateColor =monitorInfo.ACMReq.EnVehiclePlateColor;
       }
       else  if(innerID=='1')
       {
           acmData.ExVehiclePlate =monitorInfo.ACMReq.ExVehiclePlate;
           acmData.ExVehiclePlateColor =monitorInfo.ACMReq.ExVehiclePlateColor;
       }
       else
       {
         acmData.ExVehiclePlate = param.split("_")[0]
         acmData.ExVehiclePlateColor = param.split("_")[1]
       }
      }
      else
      {
        acmData.ExVehiclePlate ='';
        acmData.ExVehiclePlateColor ='';
      }
    }
    else if(monitorInfo.ACMReq.ReqType==3)
    {
      if(status==1)
      {
          acmData.EnEntryInfo = monitorInfo.ACMReq.EnEntryInfo[param];
      }
      else
      {
        acmData.EnEntryInfo = "{}";
      }
    }
    else if(monitorInfo.ACMReq.ReqType==4)
    {
      if(status==1)
      {
          acmData.EnTollStationHex = param;
      }
      else
      {
          acmData.EnTollStationHex ='';
      }
    }
  else if(monitorInfo.ACMReq.ReqType==6)
    {
       acmData.VehicleType = param
     }
   else if(monitorInfo.ACMReq.ReqType==7)
    {
      if(status==1)
      {
       acmData.VehiclePlate = param.split("_")[0]
       acmData.VehiclePlateColor = param.split("_")[1]
      }
      else
      {
        acmData.VehiclePlate = ''
       acmData.VehiclePlateColor = ''
      }

     }
    else if(monitorInfo.ACMReq.ReqType==8)
    {
      if(status==1)
      {
       if(innerID=='0')
       {
           acmData.ExAxisCount =monitorInfo.ACMReq.EnAxisCount;
       }
       else  if(innerID=='1')
       {
           acmData.ExAxisCount =monitorInfo.ACMReq.ExAxisCount;
       }
       else
       {
        acmData.ExAxisCount =param;
       }
      }
      else
      {
        acmData.ExAxisCount ='';
      }
    }
    else if(monitorInfo.ACMReq.ReqType==9)
    {
      if(status==1)
      {
          acmData.TrailerCarClass = param;
      }
      else
      {
          acmData.TrailerCarClass =null;
      }
    }
     else
     {

    }

  data.acmResult = acmData
  obj.SMData = data
  return obj
}
// 组装监控数据
var getMonitorData = function(data) {
  // 支付方式
  let payTypeTxt = ''
  if (data.PayCardType == 22 || data.PayCardType == 23) {
    payTypeTxt = 'ETC卡支付'
  } else if (data.PayCardType == 100) {
    payTypeTxt = '移动支付'
  } else if (data.PayCardType == 0) {
    payTypeTxt = '现金'
  }

  // 出口站

  var list = [
    {
      // 车型
      VehType: data.InputVehType ? data.InputVehType : data.EnVehType,
      // 车种
      VehClass: data.FeeType ? data.FeeType : '',
      // 车牌
      VehPlate: data.InputPlate ? data.InputPlate : data.RegPlateText ? data.RegPlateText : data.EnVehPlate,
      // 入口站
      inStationName: data.EnStationName ? data.EnStationName : '',
      // 出口站
      StationName: data.stationText ? data.stationText : '',
      // 收费金额
      Money: data.FeeMoney ? Number(data.FeeMoney) / 100.00 : '',
      // 支付方式
      PayType: payTypeTxt,
      // 时间
      Time: data.TransTime ? data.TransTime : data.EnPassTime,
      // 特殊事件
      SpEventNo: data.SpEvent ? data.SpEvent : ''
    }
  ]

  return list
}

// 创建弹窗内容
function generateDialogTemplate(options) {
  // 创建弹窗容器
  var index = ''
  if (connetIPMap[options.IP]) {
    var index = connetIPMap[options.IP].index
  }
  const id = 'dialog' + index
  if(jq('#bodyDevDiv').length <= 0 ) {
    jq('body').append(`<div id="bodyDevDiv"></div>`)
  }
  jq('#bodyDevDiv').append(`<div id="${id}"></div>`)
  var zIndex  = 0
  if (jq(".laneMonitorXTable").css("zIndex") != 'auto') {
    zIndex = jq(".laneMonitorXTable").css("zIndex") || 0
  }
  zIndex = parseInt(zIndex) + 40001
  const tpl = {
    id: id,
    template: `
        <el-dialog :title="title" width="550px"
            id ="spEventCtrDialog"
            :modal-append-to-body="false"
            :lock-scroll="false"
            :fullscreen="false"
            :show-close="false"
            v-dialogDrag
            :modal=false
            :close-on-click-modal=false
             z-index = "` + zIndex + `"
            :visible="true">
            <!--
            <div>车道请求（{{param.SpEventNoStr}}）</div>
            <div>收费员选择了{{param.OpInfo}}</div>
            -->

            <div style="color: red;text-align: center;font-size: 18px;">{{param.popDlgText}}</div>
            <div>
              <h2>车辆信息</h2>
              <div>
                <table style="font-size: 18px;">
                  <tr>
                    <td align="right" width="100px">车牌：</td><td style="min-width:100px">{{param.params[1]}}</td>
                    <td width="100px" align="right" >请求时间：</td><td style="min-width:100px">{{param.genTime}}</td>
                   </tr>
                  <tr v-if="entryExitTypeText == '入口'">
                    <td align="right" width="100px">入口车型：</td><td style="min-width:100px">{{param.params[0]}}</td>
                  </tr>
                  <tr v-if="entryExitTypeText == '出口'">
                    <td  align="right" width="100px">入口车型：</td><td style="min-width:100px">{{param.params[2]}}</td>
                    <td  align="right" width="100px"  >出口车型：</td><td style="min-width:100px">{{param.params[0]}}</td>
                   </tr>
                </table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer" style = "text-align: center;">
                <el-button type="primary" @click="confirmEvent('${options.data.index}')">同意</el-button>
                <el-button @click="cancel('${options.data.index}')" >拒绝</el-button>
            </div>
        </el-dialog>
        `,
    data: {
      //  不要写成函数形态，下面会对其操作
    },
    created() {

    },
    props: {
      title: String
    },
    watch: {

    },
    mounted() {

    },
    methods: {

    }
  }

  // 把参数中的data和methods与当前合并，相当于mixin
  if (options.data) {
    Object.keys(options.data).forEach(item => {
      tpl.data[item] = options.data[item]
    })
  }
  const temp = tpl.data
  tpl.data = function() {
    return temp
  }

  if (options.methods) {
    Object.keys(options.methods).forEach(item => {
      tpl.methods[item] = options.methods[item]
    })
  }
  return tpl
}

// 创建错误弹窗内容----xiamodify
function generateErrDialogTemplate(options) {
  // 创建弹窗容器
  var index = ''
  if (connetIPMap[options.IP]) {
    var index = connetIPMap[options.IP].index
  }
  const id = 'dialog' + index
  if(jq('#bodyDevDiv').length <= 0 ) {
    jq('body').append(`<div id="bodyDevDiv"></div>`)
  }
  jq('#bodyDevDiv').append(`<div id="${id}"></div>`)
  var zIndex  = 0
  if (jq(".laneMonitorXTable").css("zIndex") != 'auto') {
    zIndex = jq(".laneMonitorXTable").css("zIndex") || 0
  }
  zIndex = parseInt(zIndex) + 40001
  const tpl = {
    id: id,
    template: `
        <el-dialog :title="title" width="800px"
            id ="spEventCtrDialog"
            :modal-append-to-body="false"
            :lock-scroll="false"
            :fullscreen="false"
            :show-close="false"
            v-dialogDrag
            :modal=false
            :close-on-click-modal=false
             z-index = "` + zIndex + `"
            :visible="true">
            <div style="color: red;text-align: center;font-size: 18px;">{{errorTypeText}} 等待监控员确认</div>
            <div>
              <h2>车辆信息</h2>
              <div>
                <table style="font-size: 18px;">
                  <tr v-if="['1','6','8','9'].includes(reqType)">
                    <td align="right" width="130px">车辆全身图：</td><td style="min-width:100px"><img width="300" :src="'data:img/jpg;base64,'+img_base64" alt="图片加载失败" /></td>
                   </tr>
                  <tr v-if="reqType == '1'">
                      <td align="right" width="130px">入口车型：</td>
                      <td align="left" width="130px"> <input  width="130px" type="text" readonly="readonly" v-model = 'EnVehicleType'/>  <input v-model='selectStatus' type="radio" name="selectStatus"  value="0" checked ></td>
                   </tr>
                   <tr v-if="reqType == '1'">
                      <td align="right" width="130px">出口车型：</td>
                     <td align="left" width="130px">  <input  type="text" readonly="readonly" v-model = 'ExVehicleType'/>   <input v-model='selectStatus' type="radio" name="selectStatus" value="1"  checked > </td>
                   </tr>
                   <tr v-if="reqType == '1'">
                      <td align="right" width="130px">输入车型：</td>
                      <td align="left">
                             <select style =" width:208px "  v-model='OtherVehicleType'>
                                 <Option v-for="item in ExVehicleTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                             </select>
                                 <input v-model='selectStatus' type="radio" name="selectStatus" value="2" checked >
                        </td>
                   </tr>
                   <tr v-if="reqType == '3'">
                      <td align="right" width="100px">入口信息：</td>
                      <td align="left">
                             <select v-model='curVehicleColor' style =" font-size:5px; width:600px "  >
                                 <Option v-for="(item, index) in EnInfor" :value="index" :key="index">{{ item }}</Option>
                             </select>

                        </td>
                   </tr>
                   <tr v-if="reqType == '4'">
                      <td align="right" width="100px">收费站HEX码：</td>
                      <td align="left">
                          <input style =" width:182px "  type="text"  v-model = 'OtherVehiclePlate' />
                        </td>
                   </tr>
                   <tr v-if="reqType == '6'">
                     <td align="right" width="130px">车型：</td>
                     <td>
                        <select v-model='OtherVehicleType' style="min-width:208px">
                           <Option v-for="item in ExVehicleTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </select>
                     </td>
                   </tr>

                   <tr v-if="['2','5','7'].includes(reqType)">
                     <td align="right" width="130px">出口车牌图：</td><td style="min-width:100px"><img width="300" :src="'data:img/jpg;base64,'+VehiclePlatePic" alt="图片加载失败" /></td>
                   </tr>

                   <tr v-if="reqType == '5'">
                      <td align="right" width="130px">ETC卡内车牌：</td>
                      <td align="left" width="130px"> <input  width="130px" type="text" readonly="readonly" v-model = 'EnVehiclePlate'/> </td>
                   </tr>
                   <tr v-if="reqType == '5'">
                      <td align="right" width="130px">出口车牌：</td>
                     <td align="left" width="130px">  <input  type="text" readonly="readonly" v-model = 'ExVehiclePlate'/>  </td>
                   </tr>

                   <tr v-if="reqType == '7'">
                      <td align="right" width="130px">车牌：</td>
                      <td style="min-width:200px">
                        <input type="text" v-model = 'ExVehiclePlate' />
                        <span v-show="isFormat" style="color:red" >输入错误</span>
                    </td>
                   </tr>
                    <tr v-if="reqType == '7'">
                    <td align="right" width="130px">车牌颜色：</td>
                    <td>
                      <select v-model = 'curVehicleColor'style="min-width:208px">
                      <Option v-for="item in ExPlateColorTypes" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                      </select>
                    </td>
                   </tr>

                   <tr v-if="reqType == '8'">
                      <td align="right" width="130px">入口轴数：</td>
                      <td align="left" width="230px"> <input  width="130px" type="text" readonly="readonly" v-model = 'EnAxisCount'/>  <input v-model='selectStatus' type="radio" name="selectStatus"  value="0" checked ></td>
                   </tr>
                   <tr v-if="reqType == '8'">
                      <td align="right" width="130px">出口轴数：</td>
                     <td align="left" width="230px">  <input  type="text" readonly="readonly" v-model = 'ExAxisCount'/>   <input v-model='selectStatus' type="radio" name="selectStatus" value="1"  checked > </td>
                   </tr>
                   <tr v-if="reqType == '8'">
                      <td align="right" width="130px">输入轴数：</td>
                      <td align="left">
                             <select style =" width:208px "  v-model='OtherVehicleType'>
                                 <Option v-for="item in AxisCount" :value="item.value" :key="item.value">{{ item.label }}</Option>
                             </select>
                                 <input v-model='selectStatus' type="radio" name="selectStatus" value="2" checked >
                        </td>
                   </tr>
                  <tr v-if="reqType == '9'">
                      <td align="right" width="100px">车种：</td>
                      <td align="left">
                             <select v-model='OtherVehicleType' style =" width:230px "  >
                                  <Option v-for="item in TractorVehTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                             </select>

                        </td>
                   </tr>
                   <tr v-if="reqType == '10'">
                      <td align="right" width="130px">最后交易车道：</td>
                      <td align="left" width="130px"> <input  width="130px" type="text" readonly="readonly" v-model = 'EnVehiclePlate'/> </td>
                   </tr>
                   <tr v-if="reqType == '10'">
                      <td align="right" width="130px">最后交易时间：</td>
                     <td align="left" width="130px">  <input  type="text" readonly="readonly" v-model = 'ExVehiclePlate'/>  </td>
                   </tr>
                </table>
              </div>
             <div style="padding-left: 0px;">
                <table v-if="reqType == '2'" style="font-size: 18px;">
                 <tr>
                    <td align="right" width="130px">入口车牌：</td>
                    <td align="left" >
                       <input style =" width:182px "  type="text" readonly="readonly" v-model = 'EnVehiclePlate'/>
                    </td>
                    <td align="right" width="130px">车牌颜色：</td>
                    <td align="left">
                        <input style =" width:182px "  type="text" readonly="readonly" v-model = 'EnVehicleColor'/>
                    </td>
                    <td align="right" width="30px"> <input v-model='selectStatus' type="radio" name="selectStatus"  value="0" checked ></td>
                 </tr>
                 <tr>
                   <td align="right" width="130px">出口车牌：</td>
                    <td align="left" >
                       <input style =" width:182px "  type="text" readonly="readonly" v-model = 'ExVehiclePlate'/>
                    </td>
                    <td align="right" width="130px">车牌颜色：</td>
                    <td align="left">
                        <input style =" width:182px "  type="text" readonly="readonly" v-model = 'ExVehicleColor'/>
                    </td>
                    <td align="right" width="30px"> <input v-model='selectStatus' type="radio" name="selectStatus"  value="1" checked >
                    </td>
                  </tr>
                  <tr>
                     <td align="right" width="130px">输入车牌：</td>
                     <td align="left" >
                       <input style =" width:182px "  type="text"  v-model = 'OtherVehiclePlate' @blur="blur(1)"/>
                        <span v-show="isFormat" style="color:red" >输入错误</span>
                     </td>
                     <td align="right" width="130px">车牌颜色：</td>
                     <td align="left">
                         <select v-model = 'curVehicleColor'style="min-width:182px">
                            <Option v-for="item in ExPlateColorTypes" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                        </select>
                     </td>
                     <td align="right" width="30px"> <input v-model='selectStatus' type="radio" name="selectStatus"  value="2" checked >
                     </td>
                  </tr>

                </table>
              </div>
              <div style="padding-top: 20px;">
                   <div  v-if="['1','8'].includes(reqType)"  slot="footer" class="dialog-footer" style = "text-align: center;">
                           <el-button type="primary" @click="confirmEvent('${options.data.index}',selectStatus,OtherVehicleType)">同意</el-button>
                           <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
                   <div v-if="reqType == '2'" slot="footer" class="dialog-footer" style = "text-align: center;">
                           <el-button type="primary" @click="confirmEvent('${options.data.index}',selectStatus,OtherVehiclePlate +'_'+ curVehicleColor)">同意</el-button>
                           <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>

                    <div v-if="reqType == '3'"  slot="footer" class="dialog-footer" style = "text-align: center;">
                          <el-button type="primary" @click="confirmEvent('${options.data.index}','',curVehicleColor)">同意</el-button>
                          <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
                   <div v-if="reqType == '4'" slot="footer" class="dialog-footer" style = "text-align: center;">
                           <el-button type="primary" @click="confirmEvent('${options.data.index}','',OtherVehiclePlate )">同意</el-button>
                           <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
                   <div   v-if="['6','9'].includes(reqType)" slot="footer" class="dialog-footer" style = "text-align: center;">
                          <el-button type="primary" @click="confirmEvent('${options.data.index}','',OtherVehicleType)">同意</el-button>
                          <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
                   <div v-if="reqType == '7'" slot="footer" class="dialog-footer" style = "text-align: center;">
                          <el-button type="primary" @click="!isFormat&&confirmEvent('${options.data.index}','',ExVehiclePlate +'_'+ curVehicleColor)">同意</el-button>
                          <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
                   <div   v-if="['5','10'].includes(reqType)" slot="footer" class="dialog-footer" style = "text-align: center;">
                          <el-button type="primary" @click="confirmEvent('${options.data.index}','','')">同意</el-button>
                          <el-button @click="cancel('${options.data.index}','')" >取消</el-button>
                   </div>
              </div>
            </div>
        </el-dialog>
        `,
    data: {
      //牵引拖挂车车种
       TractorVehTypes:[
                       {
                        value: '1',
                        label: '1-普通车'
                       },
                       {
                        value: '2',
                        label: '2-J1集装箱车辆'
                       },
                       {
                        value: '3',
                        label: '3-大件运输车辆'
                       },
                       {
                        value: '4',
                        label: '4-货车列车或半挂汽车列车'
                       }
       ],
      //  轴数
      AxisCount:[
                {
                  value: '1',
                  label: '1'
                },
                {
                  value: '2',
                  label: '2'
                },
                {
                  value: '3',
                  label: '3'
                },
                {
                  value: '4',
                  label: '4'
                },
                {
                  value: '5',
                  label: '5'
                },
                {
                  value: '6',
                  label: '6'
                },
      ],
      //  车型
      ExVehicleTypes:[
                     {
                      value: '1',
                      label: '客一'
                     },
                     {
                      value: '2',
                      label: '客二'
                     },
                     {
                      value: '3',
                      label: '客三'
                     },
                     {
                      value: '4',
                      label: '客四'
                     },
                     {
                      value: '11',
                      label: '货一'
                     },
                     {
                      value: '12',
                      label: '货二'
                     },
                     {
                      value: '13',
                      label: '货三'
                     },
                     {
                      value: '14',
                      label: '货四'
                     },
                     {
                      value: '15',
                      label: '货五'
                     },
                     {
                      value: '16',
                      label: '货六'
                     },
                     {
                      value: '21',
                      label: '专一'
                     },
                     {
                      value: '22',
                      label: '专二'
                     },
                     {
                      value: '23',
                      label: '专三'
                     },
                     {
                      value: '24',
                      label: '专四'
                     },
                     {
                      value: '25',
                      label: '专五'
                     },
                     {
                      value: '26',
                      label: '专六'
                     },
                    ],
      // 当前车型
      curSelectedVType:'2',

      //选中返回代号
      selectStatus: '1',
      //其他车型
      OtherVehicleType:'1',
        //其他车牌
      OtherVehiclePlate:'',
      // 车牌颜色
      ExPlateColorTypes:[
                     {
                      value: '0',
                      label: '0-蓝色'
                     },
                     {
                      value: '1',
                      label: '1-黄色'
                     },
                     {
                      value: '2',
                      label: '2-黑色'
                     },
                     {
                      value: '3',
                      label: '3-白色'
                     },
                     {
                      value: '4',
                      label: '4-渐变绿色'
                     },
                     {
                      value: '5',
                      label: '5-黄绿双拼色'
                     },
                     {
                      value: '6',
                      label: '6-蓝白渐变色'
                     },
                     {
                      value: '9',
                      label: '9-未确定'
                     },
                     {
                      value: '11',
                      label: '11-绿色'
                     },
                     {
                      value: '12',
                      label: '12-红色'
                     }
                    ],
          //当前车牌颜色
        curVehicleColor: '0',
      // 验证格式是否争取
      isFormat:false
      // 当前车牌颜色
      //ExVehicleType:'3'
    },
    created() {

    },
    props: {
      title: String,
      // 车型全身图
      img_base64: String,
      // 错误类型
      reqType: String,
      // 错误类型Name
      errorTypeText: String,
      // 车牌图片
      VehiclePlatePic: String,
      // 入口车型
      EnVehicleType: String,
      // 当前车型
      ExVehicleType: String,
      //当前车牌
      ExVehiclePlate: String,
      //当前车牌颜色
      ExVehicleColor: String,
      //入口车牌
      EnVehiclePlate: String,
      //入口车牌颜色
      EnVehicleColor: String,
      //入口轴数
      EnAxisCount: String,
      //出口轴数
      ExAxisCount: String,
      //入口信息
      EnInfor:Array
    },
    computed: {

    },
    watch: {

    },
    mounted() {

    },
    methods: {
      blur(num){
         var wholePlate =''
        if(num=1)
        {
          wholePlate = this.OtherVehiclePlate + '_' + this.curVehicleColor
        }
        else
        {
         wholePlate = this.ExVehiclePlate + '_' + this.ExVehicleColor
        }
        console.log(wholePlate)
       var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z挂学警港澳领试超外0-9.]{3,9}_(0|1|2|3|4|5|6|7|9|11|12)$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z0-9][A-Z0-9]{4}应急_(0|1|2|3|4|5|6|7|9|11|12)$|^闯关车$|^闯关$|^(闯关车|闯关)_(0|1|2|3|4|5|6|7|9|11|12)$/;
       console.log(xreg.test(wholePlate))
       if(wholePlate.match(xreg))
        {
         this.isFormat=false
         console.log('FALSE')
        }
        else
        {
          this.isFormat=true
         console.log('true')
        }
        return
      }


    }
  }

  // 把参数中的data和methods与当前合并，相当于mixin
  if (options.data) {
    Object.keys(options.data).forEach(item => {
      tpl.data[item] = options.data[item]
    })
  }
  const temp = tpl.data
  tpl.data = function() {
    return temp
  }

  if (options.methods) {
    Object.keys(options.methods).forEach(item => {
      tpl.methods[item] = options.methods[item]
    })
  }
  return tpl
}


// 创建设备操作弹窗
function generateDevOperDialog(options) {
  // 创建弹窗容器
  const id = 'DevDialog'
  jq('#devDiv').append(`<div id="${id}"></div>`)
  var zIndex  = 0
  if (jq(".laneMonitorXTable").css("zIndex") != 'auto') {
    zIndex = jq(".laneMonitorXTable").css("zIndex") || 0
  }
  zIndex = parseInt(zIndex) + 2001
  const tpl = {
    id: id,
    template: `
        <el-dialog :title="title" width="500px"
            id = "devDialog"
            :modal-append-to-body="false"
            :lock-scroll="false"
            :fullscreen="false"
            :show-close="true"
            :before-close="handleDialogClose"
            v-dialogDrag
            :modal=false
            :close-on-click-modal=false
             z-index =  "` + zIndex + `"
            :visible="true">

            <div>
                <div style="text-align:center">
                  <el-button v-if="!param.imgTopLight" style="width:100px" type="warning" @click="devOper(index, 11, 1)">打开顶棚灯</el-button>
                  <el-button v-if="!param.imgTopLight" style="width:100px" type="info">关闭顶棚灯</el-button>
                  <el-button v-if="param.imgTopLight" style="width:100px" type="info">打开顶棚灯</el-button>
                  <el-button v-if="param.imgTopLight" style="width:100px" type="warning" @click="devOper(index, 11, 0)">关闭顶棚灯</el-button>
                </div>
                <div style="text-align:center;padding-top:10px">
                  <el-button v-if="!param.imgAutoBarryDown" style="width:100px" type="warning" @click="devOper(index, 2, 1)">抬起栏杆</el-button>
                  <el-button v-if="!param.imgAutoBarryDown" style="width:100px" type="info">降下栏杆</el-button>
                  <el-button v-if="param.imgAutoBarryDown" style="width:100px" type="info">抬起栏杆</el-button>
                  <el-button v-if="param.imgAutoBarryDown" style="width:100px" type="warning" @click="devOper(index, 2, 2)">降下栏杆</el-button>
                </div>
                 <div style="text-align:center;padding-top:10px">
                  <el-button v-if="!param.imgAutoBarryDown" style="width:100px" type="warning" @click="devOper(index, 8, 8)">发起纸卷</el-button>
                </div>
            </div>
        </el-dialog>
        `,
    data: {
      //  不要写成函数形态，下面会对其操作

    },
    props: {
      title: String
    },
    methods: {

    }
  }

  // 把参数中的data和methods与当前合并，相当于mixin
  if (options.data) {
    Object.keys(options.data).forEach(item => {
      tpl.data[item] = options.data[item]
    })
  }

  const temp = tpl.data
  tpl.data = function() {
    return temp
  }

  if (options.methods) {
    Object.keys(options.methods).forEach(item => {
      tpl.methods[item] = options.methods[item]
    })
  }
  return tpl
}


// 创建选择计重信息弹窗
function generateWeightDialog(options) {
  // 创建弹窗容器
  const id = 'DevDialog'
  jq('#devDiv').append(`<div id="${id}"></div>`)
  var zIndex  = 0
  if (jq(".laneMonitorXTable").css("zIndex") != 'auto') {
    zIndex = jq(".laneMonitorXTable").css("zIndex") || 0
  }
  zIndex = parseInt(zIndex) + 2001
  const tpl = {
    id: id,
    template: `
        <el-dialog :title="title" width="550px"
            id ="spWeightDialog"
            :modal-append-to-body="false"
            :lock-scroll="false"
            :fullscreen="false"
            :show-close="false"
            v-dialogDrag
            :modal=false
            :close-on-click-modal=false
             z-index = "` + zIndex + `"
            :visible="true">


            <div>
<!--            <vxe-grid-->
<!--              ref="weightVex"-->
<!--              highlight-hover-row-->
<!--              border-->
<!--              resizable-->
<!--              sync-resize-->
<!--              auto-resize-->
<!--              show-overflow-->
<!--              max-height="768"-->
<!--              class="vxe-table-element"-->
<!--              :loading="loading"-->
<!--              :start-index="(pageWeight.currentPage - 1) * pageWeight.pageSize"-->
<!--              :pager-config=pageWeight-->
<!--              columns=JSON.parse(columnsWeight)-->
<!--              :data=JSON.parse(tableWeightData)-->
<!--              row-config="{height: 50}"-->
<!--              @page-change="handlePageWeightChange"-->
<!--              @cell-dblclick="cellDBLClickEvent"-->
<!--            >-->
<!--            </vxe-grid>-->
                <div class="el-dialog__wrapper" id="weightDialog" style="display: none; z-index: 2354;">
                   <div role="dialog" aria-modal="true" aria-label="货车重量选择" class="el-dialog" style="margin-top: 15vh; width: 500px;">
                    <div class="el-dialog__header">
                     <span class="el-dialog__title">货车重量选择</span>
                     <button type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
                    </div>
                    <div class="el-dialog__body">
                     <div>
                      <div class="vxe-table-element vxe-grid t--animat" row-config="[object Object]">
                       <div class="vxe-table tid_2 border--full show--head t--animat row--highlight is--empty scroll--x">
                        <div class="vxe-table-slots"></div>
                        <div class="vxe-table--main-wrapper">
                         <div data-tid="2" class="vxe-table--header-wrapper body--wrapper">
                          <div class="vxe-body--x-space"></div>
                          <table data-tid="2" cellspacing="0" cellpadding="0" border="0" class="vxe-table--header" style="width: 385px;">
                           <colgroup>
                            <col name="col_9" style="width: 125px;" />
                            <col name="col_10" style="width: 100px;" />
                            <col name="col_11" style="width: 100px;" />
                            <col name="col_12" style="width: 60px;" />
                           </colgroup>
                           <thead>
                            <tr class="vxe-header--row">
                             <th data-colid="col_9" class="vxe-header--column col_9">
                              <div class="vxe-cell">
                               <span class="vxe-cell--title">车牌</span>
                              </div>
                              <div class="vxe-resizable"></div></th>
                             <th data-colid="col_10" class="vxe-header--column col_10">
                              <div class="vxe-cell">
                               <span class="vxe-cell--title">总重</span>
                              </div>
                              <div class="vxe-resizable"></div></th>
                             <th data-colid="col_11" class="vxe-header--column col_11">
                              <div class="vxe-cell">
                               <span class="vxe-cell--title">限重</span>
                              </div>
                              <div class="vxe-resizable"></div></th>
                             <th data-colid="col_12" class="vxe-header--column col_12 col--last">
                              <div class="vxe-cell">
                               <span class="vxe-cell--title">轴数</span>
                              </div>
                              <div class="vxe-resizable"></div></th>
                            </tr>
                           </thead>
                          </table>
                          <div class="vxe-table--header-border-line" style="width: 385px;"></div>
                         </div>
                         <div data-tid="2" class="vxe-table--body-wrapper body--wrapper" style="max-height: 768px;">
                          <div class="vxe-body--x-space"></div>
                          <div class="vxe-body--y-space"></div>
                          <table data-tid="2" cellspacing="0" cellpadding="0" border="0" class="vxe-table--body" style="width: 385px;">
                           <colgroup>
                            <col name="col_9" style="width: 125px;" />
                            <col name="col_10" style="width: 100px;" />
                            <col name="col_11" style="width: 100px;" />
                            <col name="col_12" style="width: 60px;" />
                           </colgroup>
                           <tbody></tbody>
                          </table>
                          <div class="vxe-table--checkbox-range"></div>
                          <div class="vxe-table--empty-block" style="width: 385px;">
                           <div class="vxe-table--empty-content">
                            暂无数据
                           </div>
                          </div>
                         </div>
                        </div>
                        <!---->
                        <!---->
                        <div class="vxe-table--empty-placeholder" style="top: 0px; height: 0px;">
                         <div class="vxe-table--empty-content">
                          暂无数据
                         </div>
                        </div>
                        <div class="vxe-table--border-line"></div>
                        <div class="vxe-table--resizable-bar" style="padding-bottom: 0px;"></div>
                        <div class="vxe-table--loading vxe-loading">
                         <div class="vxe-loading--spinner"></div>
                        </div>
                        <!---->
                        <!---->
                        <!---->
                       </div>
                       <div class="vxe-grid--pager-wrapper">
                        <div class="vxe-pager align--left is--perfect">
                         <div class="vxe-pager--wrapper">
                          <div class="vxe-select vxe-pager--sizes">
                           <div class="vxe-input type--text is--suffix is--readonly">
                            <input type="text" readonly="readonly" autocomplete="off" class="vxe-input--inner" />
                            <span class="vxe-input--suffix"><i class="vxe-input--suffix-icon vxe-icon--caret-bottom"></i></span>
                           </div>
                           <div class="vxe-table--ignore-clear vxe-select--panel">
                            <div class="vxe-select-option--wrapper">
                             <div data-optid="opt_47" class="vxe-select-option is--selected">
                              10条/页
                             </div>
                             <div data-optid="opt_48" class="vxe-select-option">
                              20条/页
                             </div>
                             <div data-optid="opt_49" class="vxe-select-option">
                              50条/页
                             </div>
                             <div data-optid="opt_50" class="vxe-select-option">
                              100条/页
                             </div>
                             <div data-optid="opt_51" class="vxe-select-option">
                              200条/页
                             </div>
                             <div data-optid="opt_52" class="vxe-select-option">
                              500条/页
                             </div>
                            </div>
                           </div>
                          </div>
                          <span title="向上跳页" class="vxe-pager--jump-prev is--fixed is--disabled"><i class="vxe-pager--jump-icon vxe-icon--d-arrow-left"></i></span>
                          <span title="上一页" class="vxe-pager--prev-btn is--disabled"><i class="vxe-pager--btn-icon vxe-icon--arrow-left"></i></span>
                          <ul class="vxe-pager--btn-wrapper">
                           <li class="vxe-pager--num-btn is--active">1</li>
                          </ul>
                          <span title="下一页" class="vxe-pager--next-btn is--disabled"><i class="vxe-pager--btn-icon vxe-icon--arrow-right"></i></span>
                          <span title="向下跳页" class="vxe-pager--jump-next is--fixed is--disabled"><i class="vxe-pager--jump-icon vxe-icon--d-arrow-right"></i></span>
                          <span class="vxe-pager--jump"><span class="vxe-pager--goto-text">前往</span><input type="text" autocomplete="off" class="vxe-pager--goto" /><span class="vxe-pager--classifier-text">页</span></span>
                          <span class="vxe-pager--total">共 0 条记录</span>
                         </div>
                        </div>
                       </div>
                      </div>
                     </div>
                    </div>
                    <!---->
                   </div>
                  </div>

          </div>
        </el-dialog>
        `,
    data: {
      //  不要写成函数形态，下面会对其操作
      pageWeight1: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      selectedWeight1: [],
      tableWeightData1: [],
      columnsWeight1: [
        {title: '车牌', field: 'VehicleId', minWidth: 125, showOverflow: true},
        {title: '总重', field: 'TotalWeight', minWidth: 100, showOverflow: true},
        {title: '限重', field: 'MaximumAllowWeight', minWidth: 100, showOverflow: true},
        {title: '轴数', field: 'VehAxleCnt', minWidth: 60, showOverflow: true},
        /*{title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}},*/
      ]
    },
    props: {
      title: String
    },
    methods: {

    }
  }

  // 把参数中的data和methods与当前合并，相当于mixin
  if (options.data) {
    Object.keys(options.data).forEach(item => {
      tpl.data[item] = options.data[item]
    })
  }

  const temp = tpl.data
  tpl.data = function() {
    return temp
  }

  if (options.methods) {
    Object.keys(options.methods).forEach(item => {
      tpl.methods[item] = options.methods[item]
    })
  }
  return tpl
}

// 顶棚灯控制请求命令
var getTopLightCtr = function(ctrlCode) {
  var obj = new Object()
  obj.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  obj.ctrlType = 11
  obj.ctrlCode = ctrlCode
  obj.msgType = 104
  obj.showText = ''// 显示内容
  obj.textColor = ''// 显示颜色

  return obj
}

// 栏杆控制请求
var getRemoteCtrl = function(ctrlCode) {
  var obj = new Object()
  obj.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  obj.ctrlType = 2 // 控制类型，2-控制栏杆
  obj.ctrlCode = ctrlCode // 1-抬杠，0-降杆
  obj.msgType = 104
  return obj
}

// 发起纸卷请求
var getPaperCtrl = function() {
  var obj = new Object()
  obj.genTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  obj.terminalType = 2
  obj.msgType = 107
  var objAcmResult = new Object()
  objAcmResult.ResultType=11
  obj.acmResult=objAcmResult
  return obj
}

</script>
<style>
.el-icon-circle-close {
  color: black;
}

#laneMonitor .vxe-tools--wrapper{
  margin-right: 5px;
}
#laneMonitor .vxe-tools--wrapper > div > button > i:first-child{
  font-size: 30px !important;
}
#bodyDevDiv .windows-pre{
  z-index: 100000 !important;
}

#laneMonitor .vxe-table .vxe-body--expanded-cell {
  padding: 0px 0px 10px 25px !important;
}

#spEventCtrDialog {
  position: absolute !important;
  overflow: hidden !important;
  width: 800px;
  margin:auto !important;
}
#spEventCtrDialog > .el-dialog {
  box-shadow: 0 0px 0px rgb(0 0 0);
  border: 1px solid rgb(205, 205, 205);
}

#weightDialog {
  position: absolute !important;
  overflow: hidden !important;
  width: 550px;
  margin:auto !important;
}
#weightDialog > .el-dialog {
  box-shadow: 0 0px 0px rgb(0 0 0);
  border: 1px solid rgb(205, 205, 205);
}

.tdStyle /deep/ .vxe-table .vxe-body--column.col--ellipsis {
  height: 28px;
}

#devDialog{
  position: absolute !important;
  overflow: hidden !important;
  width: 500px;
  margin:auto !important;
}
#devDialog > div {
  position: absolute !important;
  margin-top:80px !important;
  margin-bottom:0px !important;
  float:left !important;
}


#laneMonitor {
  padding-top: 10px;
  padding-bottom: 0px;
  padding-left: 10px;
  padding-right: 0px;
  background-color: #e7e7e8;
}

#laneMonitor #box .el-dialog__wrapper {
  position: absolute !important;
  overflow: hidden !important;
  width: 1050px;
  margin:auto !important;
}

#laneMonitor #box .el-dialog__wrapper .el-dialog__body{
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

#laneMonitor #box .vxe-table {
  color: black !important;
  font-weight: 500 !important;
}
#laneMonitor #box .el-dialog__wrapper .el-dialog__body .app-container {
  padding: 0px 0px !important;
}

.tdBrBorder {
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
}

.tdRlBorder {
  border-top: 1px solid #e8eaec;
  border-left: 1px solid #e8eaec;
}

.tdRlrBorder {
  border-top: 1px solid #e8eaec;
  border-left: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
}
.logDiv {
  text-align: left;
  margin-left: 10px;
}

.vxe-button+.vxe-button, .vxe-button+.vxe-button--dropdown, .vxe-input+.vxe-button, .vxe-input+.vxe-button--dropdown {
  margin-left: 0px;
}

body .el-notification {
  z-index: 100000!important;
}

.el-select-dropdown, .el-popper {
  z-index: 100000
}

#laneMonitor #box .vxe-button--dropdown-panel {
  position: absolute;
  left: -150px !important;
  padding: 4px 0;
  top: 37px;
  max-height:500px !important;
  overflow: auto !important;
  background-color: white;
}

#box .vehImgDiv .el-image__error{
  display: none;
}

#laneMonitor #box .vxe-button--dropdown-panel::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #F5F5F5;
}

#laneMonitor #box .vxe-button--dropdown-panel::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #F5F5F5;
}

#laneMonitor #box .vxe-button--dropdown-wrapper {
  padding: 0px !important;
  background-color: #fff !important;
  border-radius: 4px !important;
  border: 0px solid #fff !important;
  -webkit-box-shadow: 0 1px 6px rgb(255 255 255) !important;
  box-shadow: 0 1px 6px rgb(255 255 255) !important;
}

#laneMonitor #box .vxe-table .vxe-cell {
  padding-left: 2px !important;
  padding-right: 2px !important;
}

#laneMonitor #box .vxe-table tbody > tr > td {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#laneMonitor .el-card__body {
  padding-top: 10px;
  padding-bottom: 60px;
}

#tip {
  padding: 0px !important;
}

#laneMonitor .expandClass {
  background: rgb(231, 231, 232);
}
</style>
