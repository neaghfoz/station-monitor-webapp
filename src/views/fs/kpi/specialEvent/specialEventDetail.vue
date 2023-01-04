<template>
  <div v-loading="loading" class="app-container">
    <div v-if="!$route.query.issee">
      <el-form  v-if="$store.getters.roles.indexOf('specialEvent:save')>-1" class="event_form" ref="appForm" size="mini"
               :model="appForm" :rules="rules"
               inline :show-message="false" label-position="right" :label-width="'120px'">
        <div class="box-card timbs-div-title">
          <span class="title">登记信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="事件编号" prop="eventNo">
                <el-input disabled v-model="appForm.eventNo" type="text" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item disabled label="登记人" class="event_input_panel"  prop="register">
                <el-input disabled v-model="appForm.register" type="text" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item  class="event_input_panel" label="登记时间" prop="registTime">
                <el-input disabled v-model="appForm.registTime" type="text"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="事件类别" prop="eventType">
                <kpi-select clearable filterable v-model="appForm.eventType" dict-type="tibms_com_eventType"
                            :multiple="false" pstyle="width:100%" @change="doEventTypeChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item class="event_input_panel" label="事件标题" prop="title">
                <el-input clearable v-model="appForm.title" type="text" maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">位置信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="管理中心" prop="serviceOrgName">
                <el-input disabled v-model="appForm.serviceOrgName" type="text" maxlength="64"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="路段" prop="sectionName">
                <el-input disabled v-model="appForm.sectionName" type="text"
                          maxlength="64"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="appForm.eventType != '19'">
              <el-form-item class="event_input_panel" label="收费站" prop="stationOrgId" required="true">
                <ti-sys-org clearable filterable v-model="appForm.stationOrgId" url="/api/v1/common/sysOrg/orgListAll" :cache="true"  @change="stationChange" ref="stationOrgId" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-else-if="appForm.eventType == '19'">
              <el-form-item class="event_input_panel" label="收费站" prop="stationOrgId" required="true">
                <ti-sys-org clearable filterable v-model="appForm.stationOrgId" :cache="true" url="/api/v1/common/sysOrg/orgListAll"  @change="stationChange" ref="stationOrgId" pstyle="width:46%"/><span style="padding: 0px 3px 0px 3px;">至</span>
                <ti-sys-org clearable filterable v-model="appForm.endStationOrgId" :cache="true" url="/api/v1/common/sysOrg/orgListAll"  @change="endStationChange" ref="endStationOrgId" pstyle="width:46%" placeholder="收费站（终点）"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="车道号" prop="laneNo"
                            :required="matchElement([1,2,3,4,5,6,7,8,9,10,11,20,21],appForm.eventType)">
                <ti-sys-lane clearable filterable url="/api/v1/common/lane/listAll" v-model="appForm.laneNo" :station-id="appForm.stationId" :cache="true" ref="laneNo" @change="changeLaneType"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="excludeElement([12,13,16,18,19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="车道类型" prop="laneType">
                <ti-select clearable filterable v-model="appForm.laneType" ref="refLaneType" dict-type="tibms_com_laneType"
                           :multiple="false" pstyle="width:100%" disabled placeholder=""/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="出入口类型" prop="entryExitType">
                <ti-select clearable filterable v-model="appForm.entryExitType" ref="entryExitType" dict-type="tibms_com_inOutType"
                           :multiple="false" pstyle="width:100%" :disabled="excludeElement([4,12,14,16,18,19],appForm.eventType)" placeholder="请选择"
                           />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">具体信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="工班日期" prop="eventDay">
                <ti-date date-style="width:100%" v-model="appForm.eventDay"
                         dateType="date" clearable :futuredays="0" placeholder="选择工班日期"
                         format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="appForm.eventType == '14'">
              <el-form-item class="event_input_panel" label="异常事件分类" prop="errEventClass" :required="appForm.eventType == '14'">
                <ti-select clearable filterable v-model="appForm.errEventClass" dict-type="tibms_kpi_errEventClass"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '8'">
              <el-form-item class="event_input_panel" label="类型" prop="type8" :required="appForm.eventType == '8'">
                <ti-select clearable filterable v-model="appForm.type8" dict-type="tibms_kpi_type8"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '12'">
              <el-form-item class="event_input_panel" label="类型" prop="type12" :required="appForm.eventType == '12'">
                <ti-select clearable filterable v-model="appForm.type12" dict-type="tibms_kpi_type12"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <el-form-item class="event_input_panel" label="类型" prop="type6" :required="matchElement([6,20],appForm.eventType)">
                <ti-select clearable filterable v-model="appForm.type6" dict-type="tibms_kpi_type6"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="发生时间" prop="eventOccurTime" :required="excludeElement([19],appForm.eventType)">
                <el-time-picker
                  v-model="appForm.eventOccurTime"
                  value-format = 'HH:mm:ss'
                  placeholder="选择发生时间"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13,16,19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="开始时间" prop="eventStartTime" :required="matchElement([12,13,16,19],appForm.eventType)">
                <el-time-picker
                  v-model="appForm.eventStartTime"
                  value-format = 'HH:mm:ss'
                  placeholder="选择开始时间"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13,16,19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="结束时间" prop="eventEndTime" :required="matchElement([19],appForm.eventType)">
                <el-time-picker
                  v-model="appForm.eventEndTime"
                  value-format = 'HH:mm:ss'
                  placeholder="选择结束时间"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '19'">
              <el-form-item class="event_input_panel" label="工班" prop="shiftId" :required="appForm.eventType == '19'">
                <ti-select clearable filterable v-model="appForm.shiftId" dict-type="tibms_kpi_squadType" ref="shiftId"
                           :multiple="false" pstyle="width:100%" :watch-attr="appForm.eventStartTime" :watch-attr-fn="watchEventStartTime"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '13'">
              <el-form-item class="event_input_panel" label="发放张数" prop="providePaperNum" :required="appForm.eventType == '13'">
                <el-input-number clearable style="width:100%" v-model="appForm.providePaperNum" precision="0" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([1,2,3,4,5,6,7,8,9,10,11,14,18,20,21],appForm.eventType)">
              <el-form-item class="event_input_panel" label="车牌" prop="vehiclePlate" :required="matchElement([1,2,3,4,5,7,8,9,10,11,18,21],appForm.eventType)">
                <el-input clearable v-model="appForm.vehiclePlate" type="text" maxlength="10" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([1,2,3,4,5,6,7,8,9,10,11,14,18,20,21],appForm.eventType)">
              <el-form-item class="event_input_panel" label="车型" prop="vehicleType" :required="matchElement([1,2,3,4,5,7,8,9,11,18,21],appForm.eventType)">
                <ti-select clearable filterable v-model="appForm.vehicleType" dict-type="tibms_com_vehicleType"
                           :multiple="false" pstyle="width:100%" :watch-attr="appForm.eventType" :watch-attr-fn="filterVehicleType"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <el-form-item class="event_input_panel" label="数量" prop="commonNum"  :required="matchElement([6,20],appForm.eventType)">
                <el-input-number clearable style="width:100%" v-model="appForm.commonNum" precision="0" controls-position="right" :min="1"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '11'">
              <el-form-item class="event_input_panel" label="通行介质" prop="mediaType" :required="appForm.eventType == '11'">
                <ti-select clearable filterable v-model="appForm.mediaType" dict-type="tibms_kpi_mediaType"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '11'">
              <el-form-item class="event_input_panel" label="异常情况" prop="errorCase" :required="appForm.eventType == '11'">
                <ti-select clearable filterable v-model="appForm.errorCase" dict-type="tibms_kpi_errorCase"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '11'">
              <el-form-item class="event_input_panel" label="入口路段" prop="enSection">
                <kpi-select
                  ref="enSection"
                  v-model="appForm.enSectionId"
                  url="api/v1/common/road/findAllList"
                  placeholder="全部"
                  :props="{key:'roadId',value:'roadId',label:'roadText'}"
                  pstyle="width:100%"
                  :allow-create="true"
                  @change="setEnSection"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '11'">
              <el-form-item class="event_input_panel" label="入口站(修改后)" prop="enStation" :required="appForm.eventType == '11'">
                <kpi-select
                  ref="enStation"
                  v-model="appForm.enStationId"
                  url="api/v1/common/station/findAllList"
                  placeholder="全部"
                  :props="{key:'stationId',value:'stationId',label:'stationText'}"
                  pstyle="width:100%"
                  :watch-attr="appForm.enSectionId"
                  :watch-attr-fn="watchEnSection"
                  :allow-create="true"
                  @change="setEnStation"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="appForm.eventType == '9'">
              <el-form-item class="event_input_panel" label="入口总重(吨)" prop="enWeight" :required="appForm.eventType == '9'">
                <el-input-number clearable style="width:100%" v-model="appForm.enWeight" precision="2" controls-position="right" :min="0" @change="enWeightChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '9'">
              <el-form-item class="event_input_panel" label="限定重量(吨)" prop="limitWeight" :required="appForm.eventType == '9'">
                <el-input-number clearable style="width:100%"  v-model="appForm.limitWeight" precision="2" controls-position="right" :min="0" @change="limitWeightChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '9'">
              <el-form-item class="event_input_panel" label="轴数" prop="axCount"  :required="appForm.eventType == '9'">
                <el-input-number clearable style="width:100%" v-model="appForm.axCount" precision="0" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '9'">
              <el-form-item class="event_input_panel" label="超限比例(%)" prop="overloadScale">
                <el-input-number clearable style="width:100%" v-model="appForm.overloadScale" precision="3" controls-position="right" disabled/>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="matchElement([1,2,7],appForm.eventType)">
              <el-form-item class="event_input_panel" label="运载货物" prop="carryGoods" :required="matchElement([1,2,7],appForm.eventType)">
                <el-input clearable  v-model="appForm.carryGoods" type="text"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([7,10],appForm.eventType)">
              <el-form-item class="event_input_panel" label="是否有证件" prop="hasCredential" :required="matchElement([7,10],appForm.eventType)">
                <ti-select clearable filterable v-model="appForm.hasCredential" dict-type="tibms_com_yesno"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '18'">
                <el-form-item class="event_input_panel" label="损坏位置" prop="breakPosition" :required="appForm.eventType == '18'">
                <el-input clearable  v-model="appForm.breakPosition" type="text"
                          maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,16],appForm.eventType)">
              <el-form-item class="event_input_panel" label="施工/使用位置" prop="constUsePosition" :required="matchElement([12,16],appForm.eventType)">
                <el-input clearable  v-model="appForm.constUsePosition" type="text"
                          maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '16'">
              <el-form-item class="event_input_panel" label="施工内容" prop="constContent" :required="appForm.eventType == '16'">
                <el-input clearable  v-model="appForm.constContent" type="text"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="appForm.eventType == '4'">
              <el-form-item class="event_input_panel" label="拦截类型" prop="interceptType" :required="appForm.eventType == '4'">
                <ti-select clearable filterable v-model="appForm.interceptType" dict-type="tibms_kpi_interceptType"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '4'">
              <el-form-item class="event_input_panel" label="逃费类型" prop="escapeType" :required="appForm.eventType == '4'">
                <ti-select clearable filterable v-model="appForm.escapeType" dict-type="tibms_kpi_escapeType_full"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '4'">
              <el-form-item class="event_input_panel" label="追缴车次" prop="recoverTrainNum" :required="appForm.eventType == '4'">
                <el-input-number clearable style="width:100%" v-model="appForm.recoverTrainNum" precision="0" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="matchElement([2,4],appForm.eventType)">
              <el-form-item class="event_input_panel" label="打击/追缴金额(元)" label-width="150px" prop="strikeRecoverMoney" :required="matchElement([2,4],appForm.eventType)">
                <el-input-number clearable style="width:100%" v-model="appForm.strikeRecoverMoney" precision="2" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([11,18],appForm.eventType)">
              <el-form-item class="event_input_panel" label="金额(元)" prop="relatedMoney" :required="matchElement([11,18],appForm.eventType)">
                <el-input-number clearable style="width:100%" v-model="appForm.relatedMoney" precision="2" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '18'">
              <el-form-item class="event_input_panel" label="路产名称" prop="assetsName" :required="appForm.eventType == '18'">
                <el-input clearable  v-model="appForm.assetsName" type="text"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '1'">
              <el-form-item class="event_input_panel" label="免费金额(元)" prop="freeMoney" :required="appForm.eventType == '1'">
                <el-input-number clearable style="width:100%" v-model="appForm.freeMoney" precision="2" controls-position="right" :min="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item class="event_input_panel" label="图片上传">
                <ti-upload ref="upload" tip-msg="只能上传<30M的图片文件" accept=".png,.jpg" max-size="30" list-type="picture-card" @complete="onComplete" :biz-id="appForm.eventNo" biz-module="kpi" action="api/v1/kpi/specialEvent/save"></ti-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">处理信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item class="event_input_panel" label="检查/处理人" prop="dealer">
                <ti-sys-user clearable filterable :allow-create="true"  with-have-org-user :org-id="curOrgId" multiple="true" @change="dealerChange" v-model="appForm.dealer"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '1'">
              <el-form-item class="event_input_panel" label="是否有检疫证" prop="idCardIsReady" :required="appForm.eventType == '1'">
                <ti-select v-model="appForm.idCardIsReady" dict-type="tibms_kpi_civiState" :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <el-form-item class="event_input_panel" label="是否拦截" prop="isKeap" :required="matchElement([6,20],appForm.eventType)">
                <ti-select v-model="appForm.isKeap" dict-type="tibms_kpi_civiState" :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,7,8,10,20],appForm.eventType)">
              <el-form-item class="event_input_panel" label-width="150px" label="是否通知交警、路政" prop="isNotifyPolice" :required="matchElement([6,7,8,10,20],appForm.eventType)">
                <ti-select v-model="appForm.isNotifyPolice" dict-type="tibms_kpi_civiState" :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,7,8,9,10,21],appForm.eventType)">
              <el-form-item class="event_input_panel" label="处理结果" prop="dealResult"  :required="matchElement([6,7,8,9,10,21],appForm.eventType)">
                <ti-select clearable filterable v-model="appForm.dealResult" dict-type="tibms_kpi_dealResult"
                           :multiple="false" pstyle="width:100%" :watch-attr="appForm.eventType" :watch-attr-fn="dealResultFilter" />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([5,21],appForm.eventType)">
              <el-form-item class="event_input_panel" label="是否下载录像" prop="isDownVideo" :required="matchElement([5,21],appForm.eventType)">
                <ti-select v-model="appForm.isDownVideo" dict-type="tibms_kpi_civiState" :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([5,21],appForm.eventType)">
              <el-form-item class="event_input_panel" label="闯关原因" prop="breakPassReason" :required="matchElement([5,21],appForm.eventType)">
                <ti-select clearable filterable v-model="appForm.breakPassReason" dict-type="tibms_kpi_breakPassReason"
                           :multiple="false" pstyle="width:100%" :watch-attr="appForm.eventType" :watch-attr-fn="breakPassReasonFilter"/>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-show="appForm.eventType == '11'">
              <el-form-item class="event_input_panel" label="是否查询成功" prop="isQuerySuccess" :required="appForm.eventType == '11'">
                <ti-select clearable filterable v-model="appForm.isQuerySuccess" dict-type="tibms_kpi_civiState"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '16'">
              <el-form-item class="event_input_panel" label="是否计划施工" prop="isInPlan" :required="appForm.eventType == '16'">
                <ti-select clearable filterable v-model="appForm.isInPlan" dict-type="tibms_kpi_civiState"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '16'">
              <el-form-item class="event_input_panel" label="是否通知机电" prop="isNoticeElect" :required="appForm.eventType == '16'">
                <ti-select clearable filterable v-model="appForm.isNoticeElect" dict-type="tibms_kpi_civiState"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '3'">
              <el-form-item class="event_input_panel" label="免费原因" prop="freeReason" :required="appForm.eventType == '3'">
                <ti-select clearable filterable v-model="appForm.freeReason" dict-type="tibms_kpi_freeReason"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="appForm.eventType == '2'">
              <el-form-item class="event_input_panel" label="不合格原因" prop="unqualifiedReason" :required="appForm.eventType == '2'">
                <ti-select clearable filterable v-model="appForm.unqualifiedReason" dict-type="tibms_kpi_unqualifiedReason"
                           :multiple="false" pstyle="width:100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13],appForm.eventType)">
              <el-form-item class="event_input_panel" label="使用原因" prop="checkReason" :required="matchElement([12,13],appForm.eventType)">
                <el-input :rows="2" v-model="appForm.checkReason" type="text"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="matchElement([14,18],appForm.eventType)">
              <el-form-item class="event_input_panel" :label="appForm.eventType == '14' ? '处理方式' : '处理结果'" prop="dealType">
                <el-input :rows="1" v-model="appForm.dealType" type="textarea"
                          maxlength="200" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="matchElement([14,18,19],appForm.eventType)">
              <el-form-item class="event_input_panel" label="事件情况描述" prop="eventDesc">
                <el-input :rows="2" v-model="appForm.eventDesc" type="textarea" maxlength="500" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="event_input_panel" label="备注" prop="remark">
                <el-input :rows="2" v-model="appForm.remark" type="textarea"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">跟踪信息</span>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item class="event_input_panel" label="事后原因分析" prop="affairAnalyReason">
                <el-input :rows="2" v-model="appForm.affairAnalyReason" type="textarea"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="event_input_panel" label="跟踪进展情况" prop="followProgress">
                <el-input :rows="2" v-model="appForm.followProgress" type="textarea"
                          maxlength="200" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div align="center" style="padding:50px;" v-else>
        对不起，您没有没有权限.
      </div>
    </div>
    <div v-if="!$route.query.issee" style="margin: 20px 0;" align="center">
      <el-row  v-if="$store.getters.roles.indexOf('specialEvent:save')>-1"  :gutter="10" >
        <el-col :span="12" align="right">
          <el-button style="width: 20%;" type="primary" @click="close(false)">取消</el-button>
        </el-col>
        <el-col :span="12" align="left">
          <el-button style="width: 20%;" type="primary" @click="submit">提交</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="this.$route.query.issee">
      <el-form v-if="$store.getters.roles.indexOf('specialEvent:detail')>-1"  class="event_form" ref="appForm" size="mini"
               :model="appForm" :rules="rules"
               inline :show-message="false" label-position="right" :label-width="'120px'">

        <div class="box-card timbs-div-title">
          <span class="title">登记信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <ti-detail-cell label="事件编号" :value="appForm.eventNo"/>
            </el-col>
            <el-col :span="8">
              <ti-detail-cell label="登记人" :value="appForm.registerName"/>
            </el-col>
            <el-col :span="8">
              <ti-detail-cell label="登记时间" :value="appForm.registTime"/>
            </el-col>
            <el-col :span="8">
              <ti-detail-cell label="事件类别" :value="appForm.eventTypeTxt"/>
            </el-col>
            <el-col :span="16">
              <ti-detail-cell :labelSpan="5" label="事件标题" :value="appForm.title"/>
            </el-col>
          </el-row>
        </div>
        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">位置信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <ti-detail-cell label="管理中心" :value="appForm.serviceOrgName"/>
            </el-col>
            <el-col :span="8">
              <ti-detail-cell label="路段" :value="appForm.sectionName"/>
            </el-col>
            <el-col :span="8">
              <ti-detail-cell label="收费站" :value="appForm.stationName + (appForm.eventType == '19' ? ' 至 ' + appForm.endStationName : '')"/>
            </el-col>
            <el-col v-if="false" :span="8" v-show="matchElement([19],appForm.eventType)">
              <ti-detail-cell label="收费站(终点)" :value="appForm.endStationName"/>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <ti-detail-cell label="车道号" :value="appForm.laneNo"/>
            </el-col>
            <el-col :span="8" v-show="excludeElement([12,13,16,18,19],appForm.eventType)">
              <ti-detail-cell label="车道类型" :value="appForm.laneTypeTxt"/>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <ti-detail-cell label="出入口类型" :value="appForm.entryExitTypeTxt"/>
            </el-col>
          </el-row>
        </div>
        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">具体信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <ti-detail-cell label="工班日期" :value="appForm.eventDay"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([14],appForm.eventType)">
              <ti-detail-cell label="异常事件分类" :value="appForm.errEventClassTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([8],appForm.eventType)">
              <ti-detail-cell label="类型" :value="appForm.type8Txt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([12],appForm.eventType)">
              <ti-detail-cell label="类型" :value="appForm.type12Txt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <ti-detail-cell label="类型" :value="appForm.type6Txt"/>
            </el-col>
            <el-col :span="8" v-show="excludeElement([19],appForm.eventType)">
              <ti-detail-cell label="发生时间" :value="appForm.eventOccurTime"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13,16,19],appForm.eventType)">
              <ti-detail-cell label="开始时间" :value="appForm.eventStartTime"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13,16,19],appForm.eventType)">
              <ti-detail-cell label="结束时间" :value="appForm.eventEndTime"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([19],appForm.eventType)">
              <ti-detail-cell label="工班" :value="appForm.shiftIdTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([13],appForm.eventType)">
              <ti-detail-cell label="发放张数" :value="appForm.providePaperNum"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([1,2,3,4,5,6,7,8,9,10,11,14,18,20,21],appForm.eventType)">
              <ti-detail-cell label="车牌" :value="appForm.vehiclePlate"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([1,2,3,4,5,6,7,8,9,10,11,14,18,20,21],appForm.eventType)">
              <ti-detail-cell label="车型" :value="appForm.vehicleTypeTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <ti-detail-cell label="数量" :value="appForm.commonNum"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11],appForm.eventType)">
              <ti-detail-cell label="通行介质" :value="appForm.mediaTypeTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11],appForm.eventType)">
              <ti-detail-cell label="异常情况" :value="appForm.errorCaseTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11],appForm.eventType)">
              <ti-detail-cell label="入口路段" :value="appForm.enSection"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11],appForm.eventType)">
              <ti-detail-cell label="入口站(修改后)" :value="appForm.enStation"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([9],appForm.eventType)">
              <ti-detail-cell label="入口总重(吨)" :value="appForm.enWeightStr"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([9],appForm.eventType)">
              <ti-detail-cell label="限定重量(吨)" :value="appForm.limitWeightStr"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([9],appForm.eventType)">
              <ti-detail-cell label="轴数" :value="appForm.axCount"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([9],appForm.eventType)">
              <ti-detail-cell label="超限比例" :value="appForm.overloadScale"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([1,2,7],appForm.eventType)">
              <ti-detail-cell label="运载货物" :value="appForm.carryGoods"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([7,10],appForm.eventType)">
              <ti-detail-cell label="是否有证件" :value="appForm.hasCredentialTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([18],appForm.eventType)">
              <ti-detail-cell label="损坏位置" :value="appForm.breakPosition"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,16],appForm.eventType)">
              <ti-detail-cell label="施工/使用位置" :value="appForm.constUsePosition"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([16],appForm.eventType)">
              <ti-detail-cell label="施工内容" :value="appForm.constContent"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([4],appForm.eventType)">
              <ti-detail-cell label="拦截类型" :value="appForm.interceptTypeTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([4],appForm.eventType)">
              <ti-detail-cell label="逃费类型" :value="appForm.escapeTypeTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([4],appForm.eventType)">
              <ti-detail-cell label="追缴车次" :value="appForm.recoverTrainNum"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([2,4],appForm.eventType)">
              <ti-detail-cell label="打击/追缴金额(元)" :value="appForm.strikeRecoverMoneyStr"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11,18],appForm.eventType)">
              <ti-detail-cell label="金额(元)" :value="appForm.relatedMoneyStr"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([18],appForm.eventType)">
              <ti-detail-cell label="路产名称" :value="appForm.assetsName"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([1],appForm.eventType)">
              <ti-detail-cell label="免费金额(元)" :value="appForm.freeMoneyStr"/>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="false">
            <el-col :span="24">
              <ti-detail-cell :labelSpan="3" label="补充描述" :value="appForm.relatedDesc"/>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item class="event_input_panel" label="图片上传">
                <ti-upload ref="upload" :is-upload-file-show="false" disabled accept=".png,.jpg" max-size="10" list-type="picture-card" @complete="onComplete" :biz-id="appForm.eventNo" biz-module="kpi"></ti-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">处理信息</span>
          <el-row :gutter="10">
            <el-col :span="8">
              <ti-detail-cell label="检查/处理人" :value="appForm.dealerName"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([1],appForm.eventType)">
              <ti-detail-cell label="是否有检疫证" :value="appForm.idCardIsReadyTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,20],appForm.eventType)">
              <ti-detail-cell label="是否拦截" :value="appForm.isKeapTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,7,8,10,20],appForm.eventType)">
              <ti-detail-cell :labelSpan="12" label="是否通知交警、路政" :value="appForm.isNotifyPoliceTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([6,7,8,9,10,21],appForm.eventType)">
              <ti-detail-cell label="处理结果" :value="appForm.dealResultTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([5,21],appForm.eventType)">
              <ti-detail-cell label="是否下载录像" :value="appForm.isDownVideoTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([5,21],appForm.eventType)">
              <ti-detail-cell label="闯关原因" :value="appForm.breakPassReasonTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([11],appForm.eventType)">
              <ti-detail-cell label="是否查询成功" :value="appForm.isQuerySuccessTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([16],appForm.eventType)">
              <ti-detail-cell label="是否计划施工" :value="appForm.isInPlanTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([16],appForm.eventType)">
              <ti-detail-cell label="是否通知机电" :value="appForm.isNoticeElectTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([3],appForm.eventType)">
              <ti-detail-cell label="免费原因" :value="appForm.freeReasonTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([2],appForm.eventType)">
              <ti-detail-cell label="不合格原因" :value="appForm.unqualifiedReasonTxt"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([12,13],appForm.eventType)">
              <ti-detail-cell :labelSpan="5" label="使用原因" :value="appForm.checkReason"/>
            </el-col>
            <el-col :span="8" v-show="matchElement([14,18],appForm.eventType)">
              <ti-detail-cell :label="appForm.eventType == '14' ? '处理方式' : '处理结果'" :value="appForm.dealType"/>
            </el-col>
            <el-col :span="24" v-show="matchElement([14,18,19],appForm.eventType)">
              <ti-detail-cell :labelSpan="3" label="事件情况描述" :value="appForm.eventDesc"/>
            </el-col>
            <el-col :span="24">
              <ti-detail-cell :labelSpan="3" label="备注" :value="appForm.remark"/>
            </el-col>
          </el-row>
        </div>
        <div class="box-card timbs-div-title" style="margin-top: 12px;">
          <span class="title">跟踪信息</span>
          <el-row :gutter="10">
            <el-col :span="12">
              <ti-detail-cell :labelSpan="5" label="事后原因分析" :value="appForm.affairAnalyReason"/>
            </el-col>
            <el-col :span="12">
              <ti-detail-cell :labelSpan="5" label="跟踪进展情况" :value="appForm.followProgress"/>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div align="center" style="padding:50px;" v-else>
        对不起，您没有没有权限.
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail,submitEvent } from './specialEventApi'
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import tiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
import kpiUtil from "@/views/fs/kpi/common/kpiUtil"
import kpiMixin from "@/views/fs/kpi/common/kpiMixin"
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import TiUpload from "@/views/pro/common/tiElement/tiUpload/tiUpload"
import TiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi"
import TiSysRoad from "@/views/pro/common/tiElement/tiSysRoad/tiSysRoad"
import {getOrgTreeData} from "@/views/pro/common/util/dataUtil";
import VueOperationExamNumInfoView from "@/views/pro/train/test/exam/components/examNumInfoView";
import KpiSelect from "@/views/fs/kpi/common/kpiSelect/kpiSelect"
import app from "@/store/modules/app";

export default {
  name: "kpi.specialEventDetailView",
  mixins: [...kpiMixin],
  components: {VueOperationExamNumInfoView, TiUpload,TiDetailCell,TiSelect,tiSysOrg,tiDate,TiSysLane,TiSysUser,TiSysRoad,KpiSelect },
  data() {

    const vehiclePlateValid = (rule, value, callback) => {
      if (((this.appForm.eventType >= '1' && this.appForm.eventType <= '10' )
        || this.appForm.eventType == '15') && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    }
    const vehicleTypeValid = (rule, value, callback,e) => {
      if (XEUtils.toInteger(this.appForm.eventType) >= 1 && XEUtils.toInteger(this.appForm.eventType) <= 10  && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    }

    const limitValid = (rule, value, callback) => {
      if (this.appForm.eventType == '9'  && !value) {
        callback(new Error(''));
      } else{
        callback();
      }
    }

    const stationValid = (rule, value, callback) => {
      if(!value){
        callback(new Error(''));
      }else if (this.appForm.eventType == '19'  && !this.appForm.endStationOrgId) {
        callback(new Error(''));
      } else{
        callback();
      }
    }

    return {
      disabled: false,
      entryExitType_disable: true,
      curOrgId: null,
      appForm: {
        register: null,
        registTime: null,
        eventNo: null,
        dealer: null,
        dealerName: null,
        title: null,
        serviceOrgId: null,
        serviceOrgName: null,
        sectionId: null,
        sectionName: null,
        stationId: null,
        stationName: null,
        stationOrgId: null,
        endStationId: null,
        endStationName: null,
        endStationOrgId: null,
        laneNo: null,
        laneType: null,
        eventType: null,
        eventDay: XEUtils.toDateString(new Date(),'yyyy-MM-dd'),
        vehiclePlate: null,
        vehicleType: null,
        enWeight: 0.00,
        limitWeight: 0.00,
        axCount: 0,
        relatedMoney: 0.00,
        carryGoods: null,
        relatedDesc: null,
        isKeap: null,
        idCardIsReady: null,
        isNotifyPolice: null,
        isDownVideo: null,
        checkReason: null,
        dealType: null,
        remark: null,
        affairAnalyReason: null,
        followProgress: null,
        entryExitType: null,

        errEventClass: null,
        type8: null,
        type12: null,
        type6: null,
        eventOccurTime: null,
        eventStartTime: null,
        eventEndTime: null,
        shiftId: null,
        providePaperNum: 0,
        mediaType: null,
        errorCase: null,
        enSection: null,
        enSectionId: null,
        enStation: null,
        enStationId: null,
        overloadScale: 0.000,
        breakPosition: null,
        constUsePosition: null,
        constContent: null,
        interceptType: null,
        escapeType: null,
        recoverTrainNum: 0,
        strikeRecoverMoney: 0.00,
        freeMoney: 0.00,
        dealResult: null,
        breakPassReason: null,
        isQuerySuccess: null,
        isInPlan: null,
        isNoticeElect: null,
        unqualifiedReason: null,
        paperNum: 0,
        eventDesc: null,
        freeReason: null,
        assetsName: null,
        hasCredential: null,
        commonNum: 1
      },
      rules: {
        dealer: [
          { required: true, message: '', trigger: 'change' }
        ],
        title: [
          { required: false, message: '', trigger: 'blur'}
        ],
        sectionName: [
          { required: true, message: '', trigger: 'change' }
        ],
        serviceOrgName: [
          { required: true, message: '', trigger: 'change' }
        ],
        stationOrgId: [
          { validator: stationValid, trigger: 'change' }
        ],
        /*laneNo: [
          { required: true, message: '', trigger: 'change' }
        ],*/
        /*laneType: [
          { required: true, message: '', trigger: 'change' }
        ],*/
        eventType: [
          { required: true, message: '', trigger: 'change' }
        ],
        eventDay: [
          { required: true, message: '', trigger: 'change' }
        ],
        /*vehiclePlate: [
          { validator:vehiclePlateValid, trigger: 'blur' }
        ],
        vehicleType: [
          { validator:vehicleTypeValid, trigger: 'change' }
        ],
        axCount: [
          { validator:limitValid, trigger: 'change' }
        ],
        enWeight: [
          { validator:limitValid, trigger: 'change' }
        ],
        limitWeight: [
          { validator:limitValid, trigger: 'change' }
        ],
        carryGoods: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '1' || this.appForm.eventType == '2'
              ||this.appForm.eventType == '7')  && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'blur' }
        ],
        relatedMoney: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '1' || this.appForm.eventType == '2'
                ||this.appForm.eventType == '4'||this.appForm.eventType == '11'
                ||this.appForm.eventType == '18')  && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'blur' }
        ],
        isKeap: [
          { validator:(rule, value, callback) => {
              if (this.appForm.eventType == '6'  && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'change' }
        ],
        idCardIsReady: [
          { validator:(rule, value, callback) => {
              if (this.appForm.eventType == '1'  && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'change' }
        ],
        isNotifyPolice: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '6' || this.appForm.eventType == '7'
                || this.appForm.eventType == '8'|| this.appForm.eventType == '10') && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'change' }
        ],
        isDownVideo: [
          { validator:(rule, value, callback) => {
              if (this.appForm.eventType == '5'  && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'change' }
        ],
        checkReason: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '2' || this.appForm.eventType == '3'
                || this.appForm.eventType == '4' ||this.appForm.eventType == '5'
                || this.appForm.eventType == '12' ||this.appForm.eventType == '13') && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'blur' }
        ],
        dealType: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '9' || this.appForm.eventType == '15'
                || this.appForm.eventType == '18') && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'blur' }
        ],*/
        /*remark: [
          { validator:(rule, value, callback) => {
              if ((this.appForm.eventType == '14' || this.appForm.eventType == '15'
                || this.appForm.eventType == '17' || this.appForm.eventType == '18'
                || this.appForm.eventType == '19') && !value) {
                callback(new Error(''));
              } else{
                callback();
              }
            }, trigger: 'blur' }
        ]*/
      },
      visable: false,
      loading: false
    }
  },
  async created() {
    //this.$forceUpdate()
    this.disabled = false
    if(this.$route.query.eventNo){
      this.getData(this.$route.query.eventNo)
    }
    // 获取当前用户的组织机构，根据是根结点或是管理中心(目前所有用户只挂在管理中心或收费部下)取其ID,用于加载所有用户信息
    const org = (await TiSysOrgApi.getCurUserOrg()).data
    if(org){
      this.curOrgId = (org.parentId == '0' ? org.id : org.parentId)
      console.log(this.curOrgId)
    }
    if(!this.$route.query.issee){//如果非详情页面
      this.appForm.register = this.$store.getters.userInfo.realName
      this.appForm.registTime = XEUtils.toDateString(new Date(),'yyyy-MM-dd HH:mm:ss')
    }
  },
  activated(){
    /*this.$refs.appForm.clearValidate()

    this.appForm.enWeight = 0.00
    this.appForm.limitWeight = 0.00
    this.appForm.axCount = 0
    this.appForm.relatedMoney = 0.00
    this.appForm.overloadScale = 0.000
    this.appForm.recoverTrainNum =  0
    this.appForm.strikeRecoverMoney = 0.00
    this.appForm.freeMoney = 0.00
    this.appForm.providePaperNum = 0
    //this.$refs['appForm'].resetFields()
    this.$forceUpdate()*/
  },
  beforeDestroy(){
    //alert('被销毁')
    //this.$refs.appForm.clearValidate()
  },
  computed:{
    query(){
      return this.$route.query
    }
  },
  watch: {
    query: {
      handler(query, oldVal) {
        if(query.eventNo){
          this.getData(query.eventNo)
        }else{
          this.appForm = {}
        }
      },
      deep: true
    }
  },
  methods: {
    dealerChange(values,users){
      let dealerNameArr = []
      let valArr = values.split(',');
      valArr.forEach(v => {
        let matchUser = null
        users.forEach(u => {
          if(u.username == v){
            matchUser = u
          }
        })
        dealerNameArr.push(matchUser == null ? v : '[' + matchUser.username + ']' + matchUser.realName)
      })
      this.appForm.dealerName = dealerNameArr.join(',')
    },
    stationChange(val,station){
      station = this.$refs.stationOrgId.getSysOrg();
      if(station){
        this.appForm.stationId = station.stationId
        this.appForm.sectionName = station.roadName
        this.appForm.sectionId = station.roadId
        if(station.nodeLevel != 4){
          this.$notify.warning("请选择收费站")
          this.appForm.serviceOrgName = null
          this.appForm.serviceOrgId = null
          this.appForm.stationId = null
          this.appForm.stationOrgId = null
          return
        }
        const service  = kpiUtil.getCenterOrg(station)
        this.appForm.serviceOrgName = service.name
        this.appForm.serviceOrgId = service.id
      }
    },
    endStationChange(val,station){
      station = this.$refs.endStationOrgId.getSysOrg();
      if(station){
        if(station.nodeLevel != 4){
          this.appForm.endStationId = null
          this.appForm.endStationOrgId = null
          this.appForm.endStationName = null
          this.$notify.warning("请选择收费站")
          return
        }
        this.appForm.endStationId = station.stationId
      }
    },
    submit(){
      this.$refs.appForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$refs.upload.submit(this.appForm)
        }else{
          this.$notify.warning("请填写所有的必填项")
        }
      })
    },
    // 获取数据
    async getData(eventNo){
      this.loading = true
      try {
        const res = await getDetail(eventNo)
        //console.log(res.data)
        if(res.code==200){
          this.appForm = res.data
          //this.resetRelatedField();
        }else{
          this.appForm = {}
        }
      }finally {
        this.loading = false
      }
    },
    resetRelatedField(){// 数据表增加了冗余字段enSectionId,enStationId@20210726
      // 把入口路段名称赋值给下拉文本框上
      if(this.appForm.enSection){
        this.appForm.enSectionId = this.appForm.enSection
      }
      // 把入口站名称赋值给下拉文本框上
      if(this.appForm.enStation){
        this.appForm.enStationId = this.appForm.enStation
      }
    },
    close(isRefresh){
      //const index = this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path)
      //this.$store.state.tagsView.visitedViews.splice(index, 1)

      // 删除当前的页面@20210830,避免了关闭了页面造成数据未清除，导致第二次新增导出页面会存在下拉或输入框的值不显示的问题
      this.$store.dispatch('tagsView/delView',this.$route)

      const lastIndex = this.$store.state.tagsView.visitedViews.findIndex(item => item.path === '/kpi/event')
      if(lastIndex > -1 ){
        if(isRefresh){
          this.$router.push({
            path: '/kpi/event',
            query: {
              tick: new Date().getTime()
            }
          });
        }else{
          this.$router.push({
            path: '/kpi/event'
          });
        }
      }
    },
    onComplete(valid,res){
      this.loading = false
      if(!valid) return
      if(res.code==200){
        this.disabled = true
        if(this.appForm.eventNo){
          this.$notify.success("特殊事件修改成功")
        }else{
          this.$notify.success("特殊事件添加成功")
        }
        this.close(true)
      }else{
        if(this.appForm.eventNo){
          this.$notify.error("特殊事件添加失败")
        }else{
          this.$notify.error("特殊事件修改失败")
        }
      }
    },
    changeLaneType(){
      this.$nextTick(function (){
        const laneObj = this.$refs.laneNo.getObj();
        this.appForm.laneType = null
        this.$refs.refLaneType.selected = null
        if(laneObj){
          this.appForm.laneType = laneObj.laneType
          // 有时直接设置appForm对应值会不生效，所以要直接引用的方式设置@20210726
          this.$refs.refLaneType.selected = laneObj.laneType
        }
      })

    },
    watchEventType(newVal,oldVal,selectData){
      // 如果已经有值，则直接返回
      if(this.$refs.entryExitType.selected || this.appForm.entryExitType){
        return selectData;
      }
      //改变下拉列表
      if (newVal) {
        if(newVal == '1' || newVal == '2' || newVal == '3' || newVal == '5' || newVal == '11'){
          this.appForm.entryExitType = '2'
          this.$refs.entryExitType.selected = '2'
        }else if(newVal == '6' || newVal == '7' || newVal == '8' || newVal == '9' || newVal == '10' || newVal == '13'){
          this.appForm.entryExitType = '1'
          this.$refs.entryExitType.selected = '1'
        }else if(newVal == '19'){//隐藏
          this.appForm.entryExitType = null
          this.$refs.entryExitType.selected = null
        }else{//其他可选择并非必填
          this.appForm.entryExitType = null
          this.$refs.entryExitType.selected = null
        }
      }
      //console.log(this.appForm.entryExitType)
      return selectData;
    },
    matchElement(events,curEvent){//完全匹配
      return (curEvent == null || curEvent == '') ? false : events.includes(curEvent*1)
    },
    excludeElement(events,curEvent){//排除指定事件，包括未选择事件
      return (curEvent == null || curEvent == '') ? false : !events.includes(curEvent*1)
    },
    enWeightChange(value){
      const limitWeight = XEUtils.toFixedNumber(this.appForm.limitWeight,2)
      if(value){
        if(limitWeight && limitWeight != 0){
          const enWeight = XEUtils.toFixedNumber(value,2)
          this.appForm.overloadScale = ((enWeight - limitWeight) / limitWeight * 100.00).toFixed(3)
          //console.log(this.appForm.overloadScale)
        }else{
          this.appForm.overloadScale = 0.000
        }
      }
    },
    limitWeightChange(value){
      const enWeight = XEUtils.toFixedNumber(this.appForm.enWeight,2)
      if(value){
        if(enWeight && enWeight != 0){
          const limitWeight = XEUtils.toFixedNumber(value,2)
          this.appForm.overloadScale = ((enWeight - limitWeight) / limitWeight * 100.00).toFixed(3)
        }else{
          this.appForm.overloadScale = 0.000
        }
      }
    },
    doEventTypeChange(value){
      // 重置无关的字段值，暂时全清空
      if(!this.matchElement([19],value)){
        this.appForm.endStationId = null
        this.appForm.endStationName = null
        this.appForm.endStationOrgId = null
        this.appForm.shiftId = null
      }
      if(this.matchElement([19],value)){
        this.appForm.entryExitType = null
        this.appForm.laneNo = null
        this.appForm.eventOccurTime = null
      }
      if(this.matchElement([12,13,16,18,19],value)){
        this.appForm.laneType = null
      }
      if(!this.matchElement([1,2,3,4,5,6,7,8,9,10,11,14,18],value)){
        this.appForm.vehiclePlate = null
        this.appForm.vehicleType = null
      }
      if(!this.matchElement([9],value)){
        this.appForm.enWeight = null
        this.appForm.limitWeight = null
        this.appForm.axCount = null
        this.appForm.overloadScale = null
      }
      if(!this.matchElement([11,18],value)){
        this.appForm.relatedMoney = null
      }
      if(!this.matchElement([1,2,7],value)){
        this.appForm.carryGoods = null
      }
      this.appForm.relatedDesc = null
      if(!this.matchElement([6,7,8,10],value)){
        this.appForm.isNotifyPolice = null
      }
      if(!this.matchElement([5],value)){
        this.appForm.isDownVideo = null
        this.appForm.breakPassReason = null
      }
      if(!this.matchElement([12,13],value)){
        this.appForm.checkReason = null
      }
      if(!this.matchElement([14,18],value)){
        this.appForm.dealType = null
      }
      if(!this.matchElement([14],value)){
        this.appForm.errEventClass = null
      }
      if(!this.matchElement([8],value)){
        this.appForm.type8 = null
      }
      if(!this.matchElement([12],value)){
        this.appForm.type12 = null
      }
      if(!this.matchElement([6],value)){
        this.appForm.type6 = null
        this.appForm.isKeap = null
        this.appForm.commonNum = 0
      }
      if(!this.matchElement([12,13,16,19],value)) {
        this.appForm.eventStartTime = null
        this.appForm.eventEndTime = null
      }
      if(!this.matchElement([13],value)){
        this.appForm.providePaperNum = null
        this.appForm.paperNum = null
      }
      if(!this.matchElement([11],value)){
        this.appForm.mediaType = null
        this.appForm.isQuerySuccess = null
        this.appForm.errorCase = null
        this.appForm.enSection = null
        this.appForm.enStation = null
        this.appForm.enSectionId = null
        this.appForm.enStationId = null
      }
      if(!this.matchElement([18],value)){
        this.appForm.breakPosition = null
        this.appForm.assetsName = null
      }
      if(!this.matchElement([12,16],value)){
        this.appForm.constUsePosition = null
      }
      if(!this.matchElement([16],value)){
        this.appForm.constContent = null
        this.appForm.isInPlan = null
        this.appForm.isNoticeElect = null
      }
      if(!this.matchElement([4],value)){
        this.appForm.interceptType = null
        this.appForm.escapeType = null
        this.appForm.recoverTrainNum = null
      }
      if(!this.matchElement([2,4],value)){
        this.appForm.strikeRecoverMoney = null
      }
      if(!this.matchElement([1],value)){
        this.appForm.freeMoney = null
        this.appForm.idCardIsReady = null
      }
      if(!this.matchElement([6,7,8,9,10],value)){
        this.appForm.dealResult = null
      }
      if(!this.matchElement([2],value)){
        this.appForm.unqualifiedReason = null
      }
      if(!this.matchElement([14,18,19],value)){
        this.appForm.eventDesc = null
      }
      if(!this.matchElement([3],value)){
        this.appForm.freeReason = null
      }
      // 设置出入口类型
      if(this.matchElement([1,2,3,5,11,20],value)){
        this.appForm.entryExitType = '2'
      } else if(this.matchElement([6,7,8,9,10,13,21],value)){
        this.appForm.entryExitType = '1'
      } else{
        this.appForm.entryExitType = null
      }
      // 除事件7和10外，其他事件清除是否有证件@20210820
      if(!this.matchElement([7,10],value)){
        this.appForm.hasCredential = null
      }
      // 事件1和2（由于使用货车车型）清除车型@20210820
      if(this.matchElement([1,2],value)){
        this.appForm.vehicleType = null
      }
    },
    watchEnSection(newVal,oldVal,selectData){
      let selectDataShow = [];
      //console.log("newVal=" + newVal)
      //改变下拉列表
      if (newVal) {
        selectData.forEach(x=>{
          if(x.stationId.indexOf(newVal) > -1){
            selectDataShow.push(x)
          }
        })
        /*if(selectDataShow.length == 0){
          this.appForm.enSectionId = newVal
          this.appForm.enStation = newVal
        }*/
      }else{
        selectDataShow = selectData;
      }
      if(selectDataShow.length == 0){
        selectDataShow = selectData
      }
      return selectDataShow;
    },
    watchEventStartTime(newVal,oldVal,selectData){
      this.$refs.shiftId.selected = null
      if (newVal) {
        const hour = newVal.substring(0,2)
        if(hour >= '00' && hour < '08'){
          this.$refs.shiftId.selected = '1' //早班
        }else if(hour >= '08' && hour < '16'){
          this.$refs.shiftId.selected = '2' //中班
        }else if(hour >= '16' && hour <= '23'){
          this.$refs.shiftId.selected = '3' //晚班
        }
      }
      return selectData
    },
    handleEnSectionBlur(e){
      const enSection = e.target.value
      if (enSection && enSection != '') {
        if(enSection.indexOf('[') < 0){// 如果非可选路段，则给id直接赋值
          this.appForm.enSectionId = e.target.value
        }
        this.appForm.enSection = e.target.value
        //this.$refs.enSection.selected = e.target.value
      }else{
        this.appForm.enSectionId = null
        this.appForm.enSection = null
        this.$refs.enSection.selected = null
      }
      //console.log("enSection=" + this.appForm.enSection)
    },
    handleEnStationBlur(e){
      const enStation = e.target.value
      if (enStation && enStation != '') {
        if(enStation.indexOf('[') < 0){// 如果非可选收费站，则给id直接赋值
          this.appForm.enStationId = e.target.value
        }
        this.appForm.enStation = e.target.value
        //this.$refs.enStation.selected = e.target.value
      }else{
        this.appForm.enStationId = null
        this.appForm.enStation = null
        this.$refs.enStation.selected = null
      }
      //console.log("enStation=" + this.appForm.enStation)
    },
    setEnSection(sectionId,sectionObj){
      if(sectionObj){
        this.appForm.enSection = sectionObj.roadText
      }else{
        this.appForm.enSection = sectionId
      }
    },
    setEnStation(stationId,stationObj){
      if(stationObj){
        this.appForm.enStation = stationObj.stationText
      }else{
        this.appForm.enStation = stationId
      }
    },
    filterValid(selectDataShow){
      let selectDataShowNew = []
      selectDataShow.forEach(item => {
        if(item.value != 19){// 由于基础框架没有加载valid字段，因此直接显示地过滤已禁用的事件类别@20210825
          selectDataShowNew.push(item)
        }
      })
      // console.log(selectDataShowNew)
      return selectDataShowNew
    },
    filterVehicleType(newEventType,oldEventType,selectData){
      if(!this.matchElement([1,2],newEventType)){
        return selectData
      }
      let selectShowData = []
      selectData.forEach(v => {
        if(this.matchElement([11,12,13,14,15,16],v.value)){
          selectShowData.push(v)
        }
      })
      return selectShowData
    },
    breakPassReasonFilter(newVal,oldVal,selectData){
      if(!this.matchElement([21],newVal)){
        return selectData
      }
      // 事件类别为：入口闯关车，过滤掉移动支付失败闯关
      let selectShowData = []
      selectData.forEach(v => {
        if(!this.matchElement([3],v.value)){
          selectShowData.push(v)
        }
      })
      return selectShowData
    },
    dealResultFilter(newVal,oldVal,selectData){
      if(!this.matchElement([8],newVal)){
        return selectData
      }
      // 事件类别为：超长、超宽、超高车辆闯入，过滤掉行人劝返
      let selectShowData = []
      selectData.forEach(v => {
        if(!this.matchElement([6],v.value)){
          selectShowData.push(v)
        }
      })
      return selectShowData
    }
  }
}
</script>
<style scoped>
.event_form .event_input_panel{
  background: rgb(235 239 243);
  padding: 8px;
  border-radius: 5px;
  width: 100%;
  display: flex !important;
  flex-direction: row;
}
.event_form .event_input_panel .el-form-item__content{
  flex: 1 !important;
}
.event_form .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

/*.el-card{
  overflow: visible;
}
.el-card, .el-message{
  overflow: visible;
}*/

div.timbs-div-title{
  width:100%;
  height:100%;
  padding:2px 5px;
  /*margin-top:50px;
  margin-left:150px;*/
  border:1px solid #EBEEF5;
}
.event_form .title{
  display:block;
  width:100px;
  height:30px;
  position:relative;
  top:-15px;
  text-align: center;
  background: white;
}
/** 由于span的标题已经设置向上走15元素，那么行也向上走15元素，则避免标题空占@20210824*/
.event_form .el-row{
  margin-top: -15px;
}
</style>
