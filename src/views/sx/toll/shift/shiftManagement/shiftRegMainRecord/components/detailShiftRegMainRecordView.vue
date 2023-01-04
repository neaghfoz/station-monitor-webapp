<template>
  <div class="app-container" style="font-size: 15px;">

    <el-form v-show="addShow" ref="form":rules="rules" v-loading="loading" :model="shiftRegMainRecord" label-width="100px">
      <div class="page-header">
        <span>基础信息</span>
      </div>
      <el-row >
        <el-col :span="6">
          <el-form-item label="登记类型"  prop="userMarkNo"
                        :rules="[{required: true, message:'请选择登记类型', trigger:'blur'}]">
            <ti-select v-model="shiftRegMainRecord.userMarkNo" dict-type="tibms_toll_userMarkNo" @change="userMarkNoChange()"
                       disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收费站"  prop="stationNo"
                        :rules="[{required: true, message:'请选择收费站', trigger:'blur'}]">
            <ti-select v-model="shiftRegMainRecord.stationNo" url="/api/v1/common/sysOrg/findByAuth?showLevel=4"
                       :props="{key:'stationNo',value:'stationNo',label:'fullName'}" @change="stationChange()"
                       disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车道号"  prop="laneNo"
                        :rules="[{required: true, message:'请选择车道号', trigger:'blur'}]">
            <el-select v-model="shiftRegMainRecord.laneNo"  filterable  placeholder="请选择" @change="initModal()"
                       disabled>
              <el-option
                v-for="item in laneList"
                :key="item.laneNo"
                :label="item.laneNo"
                :value="item.laneNo">
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="工班日期"  prop="squadDateStr"
                        :rules="[{required: true, message:'请选择工班日期', trigger:'blur'}]">
            <el-date-picker type="date" placeholder="选择日期" v-model="shiftRegMainRecord.squadDateStr" @change="initModal()"
                            format="yyyy-MM-dd" disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="6">
          <el-form-item label="工班"  prop="squadNo"
                        :rules="[{required: true, message:'请选择工班', trigger:'blur'}]">
          <ti-select v-model="shiftRegMainRecord.squadNo" url="api/v1/common/squad/list"
                     :props="{key:'squadNo',value:'squadNo',label:'squadName'}"
                     disabled
                     @change="initModal()"
          />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作员"  prop="laneOperatorID"
                        :rules="[{required: true, message:'请选择操作员', trigger:'blur'}]">
            <el-input type="text" class="form-control" v-model="shiftRegMainRecord.laneOperatorText" disabled/>

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登记人"  >
          <div class="el-form-item__content" style="padding-left: 12px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;">
            [{{shiftRegMainRecord.registerOperatorID}}]{{shiftRegMainRecord.registerOperatorName}}
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登记人机构"  >
          <div class="el-form-item__content" style="padding-left: 12px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;" v-text="operator.org.fullName"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="(shiftRegMainRecord.userMarkNo != ''
                								&& shiftRegMainRecord.stationNo != ''
                								&& shiftRegMainRecord.laneNo != ''
                								&& shiftRegMainRecord.squadDate != ''
                								&& shiftRegMainRecord.squadNo != ''
                								&& shiftRegMainRecord.laneOperatorID != '')
                							&& ((process == 2 && shiftRegMainRecord.userMarkNo == 2)
                							|| (process == 2 && shiftRegMainRecord.userMarkNo == 1 && isHaveSpareMoney && isHaveSpareMoneyForWork)
                							|| (process == 1 && isHaveSpareMoney && isHaveSpareMoneyForWork))">
      <div class="page-header">
        <span>金额</span> 现金总额：
        <b class="text-danger">{{shiftRegMainRecord.totalMoney | numFilter}}</b>元
      </div>

      <!--上班-->
      <el-row
        v-show="(shiftRegMainRecord.userMarkNo != ''
								&& shiftRegMainRecord.stationNo != ''
								&& shiftRegMainRecord.laneNo != ''
								&& shiftRegMainRecord.squadDate != ''
								&& shiftRegMainRecord.squadNo != ''
								&& shiftRegMainRecord.laneOperatorID != '')
							&& (process == 1 || (process == 2 && shiftRegMainRecord.userMarkNo == 1))
							&& isHaveSpareMoney
							&& isHaveSpareMoneyForWork">
        <el-col :span="6" v-if="process == 1">
          <el-form-item label="备用金" prop="spareMoneyForWork">
            <el-input type="text" maxlength="8" v-model="shiftRegMainRecord.spareMoneyForWork"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="process == 2">
          <el-form-item label="备用金" prop="spareMoney">
            <el-input type="text" maxlength="8" v-model="shiftRegMainRecord.spareMoney"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--出口下班-->
      <div v-show="(shiftRegMainRecord.userMarkNo != ''
        && shiftRegMainRecord.stationNo != ''
        && shiftRegMainRecord.laneNo != ''
        && shiftRegMainRecord.squadDate != ''
        && shiftRegMainRecord.squadNo != ''
        && shiftRegMainRecord.laneOperatorID != '')
        && shiftRegMainRecord.userMarkNo == 2 && process == 2">
      <el-row>
        <el-col :span="6">
          <el-form-item label="通行费" prop="txMoney">
            <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.txMoney" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item label="pos金额" prop="posMoney">
            <el-input type="text" maxlength="10" v-model="shiftRegMainRecord.posMoney" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工本费" prop="gongBenFei">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.gongBenFei" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="不找赎"  prop="buZhaoShu">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.buZhaoShu" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="其他"  prop="other">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.other" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>-->

      </el-row>
      <!--<el-row >
        <el-col :span="6">
          <el-form-item label="备用金" prop="spareMoney">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.spareMoney" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司二维码" prop="gongSiErWeiMa">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.gongSiErWeiMa" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="港币" prop="gangBi">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.gangBi" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="假币" prop="jiaBi">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.jiaBi" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="6">
          <el-form-item label="卡赔款" prop="kaPeiKuan">
            <el-input type="text" maxlength="9" v-model="shiftRegMainRecord.kaPeiKuan" @input="checkTotalMoney()"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="钱袋号" prop="moneyBagNumber">
            <el-input type="text" maxlength="25" v-model="shiftRegMainRecord.moneyBagNumber"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->
      </div>
      </div>

      <div v-show="(shiftRegMainRecord.userMarkNo != ''
                                && shiftRegMainRecord.stationNo != ''
                                && shiftRegMainRecord.laneNo != ''
                                && shiftRegMainRecord.squadDateStr != ''
                                && shiftRegMainRecord.squadNo != ''
                                && shiftRegMainRecord.laneOperatorID != '')
                            && shiftRegMainRecord.userMarkNo == 2 && process == 2">
      <div class="page-header">
        <span>纸券</span>
      </div>
      <el-row >
        <el-col :span="6">
          <el-form-item label="纸券数量" prop="paperCount">
            <el-input type="text" maxlength="5" v-model="shiftRegMainRecord.paperCount"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="空白票" prop="blankInvCount">
            <el-input type="text" maxlength="5" v-model="shiftRegMainRecord.blankInvCount"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="重打票" prop="retakeInvCount">
            <el-input type="text" maxlength="5" v-model="shiftRegMainRecord.retakeInvCount"
                      :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </div>

      <!--卡单元、坏卡-->
      <el-row>
        <el-col :span="10" class="row-border" style="width: 41%;" v-show="(shiftRegMainRecord.userMarkNo != ''
									&& shiftRegMainRecord.stationNo != ''
									&& shiftRegMainRecord.laneNo != ''
									&& shiftRegMainRecord.squadDate != ''
									&& shiftRegMainRecord.squadNo != ''
									&& shiftRegMainRecord.laneOperatorID != '')">
          <div class="page-header">
            <span>卡单元</span>
          </div>

          <el-row class="bg-gray">
            <el-col :span="2" class="row-border">序号</el-col>
            <el-col :span="7" class="row-border">卡单元编号</el-col>
            <el-col :span="5" class="row-border">上班卡数量</el-col>
            <el-col :span="5" class="row-border">下班卡数量</el-col>
            <el-col :span="5" class="row-border">
              <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addCardUnitNoRecord()"
                         :disabled="controlDisabled || samePersonCheckDisabled"/>
              <el-button type="primary" class="tableButton" @click="selectCardUnitNoInList()"
                         :disabled="controlDisabled || samePersonCheckDisabled">流水查找</el-button>
            </el-col>
          </el-row>

          <el-row v-for="(item,index) in shiftRegMainRecord.shiftPassCardDetailList">
            <el-col :span="2" class="row-border elFormItem" style="text-align: center;">
               <el-input :value="index + 1" disabled="disabled"></el-input>
            </el-col>
            <el-col :span="7" class="row-border elFormItem" :class="'elColEdit'">
<!--              <ti-select v-model="item.cardUnitNo" is-post url="/api/v1/toll/cardUnit/findList" :data="{unitStatusStr:'2,4'.indexOf(shiftRegMainRecord.userMarkNo)>-1?0:''}" pstyle ="width:100%;" :props="{key:'unitNo',value:'unitNo',label:'unitNo'}"
                         :disabled="controlDisabled || samePersonCheckDisabled"/>-->
              <ti-select v-model="item.cardUnitNo" :data-list="cardUnitNoListShow" :data-filter="cardUnitNoListFilter" pstyle ="width:100%;" :props="{key:'unitNo',value:'unitNo',label:'unitNo'}"
                         :disabled="controlDisabled || samePersonCheckDisabled"/>
            </el-col>
            <el-col :span="5" class="row-border" :class="process == 1?'elColEdit':''">
              <el-input type="number" @input="checkCardCount(index)" :disabled="process == 2 || controlDisabled || samePersonCheckDisabled"
                        v-model="item.cpcCardCountForWork"></el-input>
            </el-col>
            <el-col :span="5" class="row-border" :class="process == 2?'elColEdit':''">
              <el-input type="number" @input="checkCardCount(index)" :disabled="process == 1 || controlDisabled || samePersonCheckDisabled"
                        v-model="item.cpcCardCountOffWork"></el-input>
            </el-col>
            <el-col :span="5" class="row-border"style="text-align: center;line-height: 32px;">
              <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeCardUnitRecord(index)"
                         :disabled="controlDisabled || samePersonCheckDisabled"/>
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in [0,1,2,3,4]" v-if="index >= shiftRegMainRecord.shiftPassCardDetailList.length">
            <el-col :span="2" class="row-border" style="height: 24px;"> </el-col>
            <el-col :span="7" class="row-border" style="height: 24px;"> </el-col>
            <el-col :span="5" class="row-border" style="height: 24px;"> </el-col>
            <el-col :span="5" class="row-border" style="height: 24px;"> </el-col>
            <el-col :span="5" class="row-border" style="height: 24px;"> </el-col>
          </el-row>

          <div v-show="process == 2">
            <el-form-item label="还卡数" prop="returnCardCnt" style="margin-top: 15px;width: 80%;">
              <el-input type="text" maxlength="5" v-model="shiftRegMainRecord.returnCardCnt"
                        :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
            </el-form-item>
          <div class="page-header">
            <span>坏卡</span>
            <div style="position: absolute;left: 120px;border: 0px;padding-bottom: 0px;padding-top: 0px;margin-top: -18px;">
              数量：{{totalShiftCpcPassCardBadCount}}张
            </div>
          </div>
          <table class="table" id="badCardTable">
            <tr class="bg-gray">
              <td style="width:40px;max-width: 40px;">序号</td>
              <td style="width:150px;max-width: 150px;" v-show="shiftRegMainRecord.userMarkNo == 1">卡单元编号</td>
              <td>坏卡卡号</td>
              <td style="width:150px;max-width: 150px;">
                <div class="text-center" style="background: #dddddd;">
                  <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addBadCardRecord()"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </div>
              </td>
            </tr>

            <tr v-for="(item, index) in shiftRegMainRecord.shiftCpcPassCardBadDetailList">
              <td>
                {{index + 1}}
              </td>
              <td v-show="shiftRegMainRecord.userMarkNo == 1">
                <el-input type="text" v-model="item.cardUnitNo" maxlength="10" disabled/>
              </td>
              <td>
                <el-input type="text" maxlength="16" v-model="item.badPassCardNo" @input="changeBadPassCardNo(item, index)"
                          :disabled="controlDisabled || samePersonCheckDisabled"/>
              </td>
              <td>
                <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeBadCardRecord(index)"
                           :disabled="controlDisabled || samePersonCheckDisabled"/>
              </td>
            </tr>

          </table>
          </div>
        </el-col>

        <el-col :span="14" style="width: 58%;float: right;">
          <div style="padding: 5px 5px;border: 1px solid #eee;" v-show="(shiftRegMainRecord.userMarkNo != ''
								&& shiftRegMainRecord.stationNo != ''
								&& shiftRegMainRecord.laneNo != ''
								&& shiftRegMainRecord.squadDate != ''
								&& shiftRegMainRecord.squadNo != ''
								&& shiftRegMainRecord.laneOperatorID != '')
                			&& shiftRegMainRecord.userMarkNo == 2 && process == 2">
            <!--机打发票-->
            <div class="page-header">
              <span>机打发票</span>
              <div style="position: relative;left: 100px;border: 0px;padding-bottom: 0px;padding-top: 0px;margin-top: -22px;">
                数量：{{totalShiftInvDetailInvCount}}张
              </div>
            </div>
            <table class="table" id="invCodeTable">
              <tr class="bg-gray">
                <td>机打发票代码</td>
                <td>机打发票起始号</td>
                <td>机打发票终止号</td>
                <td style="width:100px;max-width: 100px;">数量</td>
                <td style="width:150px;max-width: 150px;">
                  <div class="form-group">
                    <div class="col-md-12 text-center" style="background: #dddddd;">
                      <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addInvCodeRecord()"
                                 :disabled="controlDisabled || samePersonCheckDisabled"/>
                      <el-button type="primary" class="tableButton" @click="selectInvCodeInList()"
                                 :disabled="controlDisabled || samePersonCheckDisabled">流水查找</el-button>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-for="(item, index) in shiftRegMainRecord.shiftInvDetailList">
                <td style="min-width:160px" class="elColEdit">
                  <ti-select
                    pstyle="width:100%"
                    v-model="item.invCode"
                    placeholder="请选择"
                    url="/api/v1/invoicecode/list"
                    :isPost="true"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  />
                </td>
                <td style="min-width:160px" class="elColEdit">
                  <el-input type="number" @input="sumShiftInvDetailInvCount(index)" @blur="confirmInvCount(index)"
                            v-model="item.invStartNo"
                            :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
                </td>
                <td style="min-width:160px" class="elColEdit">
                  <el-input type="number" @input="sumShiftInvDetailInvCount(index)" @blur="confirmInvCount(index)"
                            v-model="item.invEndNo"
                            :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
                </td>
                <td style="min-width:80px">
                  <el-input :disabled="true" v-model="item.invCount"></el-input>
                </td>
                <td>
                  <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeInvCodeRecord(index)"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
              </tr>
              <tr v-for="(item,index) in [0,1,2]" v-if="index >= shiftRegMainRecord.shiftInvDetailList.length">
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
              </tr>
            </table>
            <!--机打废票-->
            <table class="table" id="badInvCodeTable">
              <tr class="bg-gray">
                <td>废票机打发票代码</td>
                <td>机打发票废票号</td>
                <td style="width:50px;max-width: 50px;">数量</td>
                <td>金额</td>
                <td style="width:150px;max-width: 150px;">
                  <div class="form-group">
                    <div class="col-md-12 text-center" style="background: #dddddd;">
                      <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addBadInvCodeRecord()"
                                 :disabled="controlDisabled || samePersonCheckDisabled"/>
                      <el-button type="primary" class="tableButton" @click="selectBadInvInList(true)"
                                 :disabled="controlDisabled || samePersonCheckDisabled">流水查找</el-button>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-for="(item, index) in shiftRegMainRecord.shiftSquadInvalidinvList">
                <td style="min-width:150px">
                  <ti-select
                    v-model="item.invCode"
                    placeholder="请选择"
                    url="/api/v1/invoicecode/list"
                    :isPost="true"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  />
                </td>
                <td>
                  <el-input type="number"
                            v-model="item.badInvID"
                            @input="checkBadInvID(index)"
                            :disabled="controlDisabled || samePersonCheckDisabled">

                  </el-input>
                </td>
                <td>
                  <el-input :disabled="true" v-model="item.invCount"/>
                </td>
                <td>
                  <el-input v-model="item.showMoney" type="number"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>

                <td>
                  <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeBadInvCodeRecord(index)"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
              </tr>
              <tr v-for="(item,index) in [0,1,2]" v-if="index >= shiftRegMainRecord.shiftSquadInvalidinvList.length">
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
                <td class="row-border" style="height: 24px;"></td>
              </tr>
            </table>
          </div>

          <!--<div style="margin-top: 10px;padding: 5px 5px;border: 1px solid #eee;" v-show="(shiftRegMainRecord.userMarkNo != ''
								&& shiftRegMainRecord.stationNo != ''
								&& shiftRegMainRecord.laneNo != ''
								&& shiftRegMainRecord.squadDate != ''
								&& shiftRegMainRecord.squadNo != ''
								&& shiftRegMainRecord.laneOperatorID != '')
                			&& shiftRegMainRecord.userMarkNo == 2 && process == 2">
            &lt;!&ndash;定额发票&ndash;&gt;
            <div class="page-header">
              <span>定额发票</span>
              <div style="position: relative;left: 100px;border: 0px;padding-bottom: 0px;padding-top: 0px;margin-top: -22px;">
                数量：{{totalManualInvCount}}张
              </div>
            </div>
            <table class="table" id="manualInvCodeTable">
              <tr class="bg-gray">
                <td>类型</td>
                <td style="min-width: 90px;">定额发票面额</td>
                <td>定额发票起始号</td>
                <td>定额发票终止号</td>
                <td>数量</td>
                <td style="width:50px;max-width: 50px;">
                  <div class="text-center" style="background: #dddddd;">
                    <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addManualInvRecord()"
                               :disabled="controlDisabled || samePersonCheckDisabled"/>
                  </div>
                </td>
              </tr>

              <tr v-for="(item, index) in shiftRegMainRecord.shiftSquadRationInvoiceList">
                <td>
                  <ti-select
                    v-model="item.invType"
                    placeholder="请选择"
                    dict-type="tibms_toll_rinvoiceType"
                    @change="changeManualInvType(index)"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  />
                </td>
                <td>
                  <el-input type="text" v-model="item.invRationMoneyInput" v-show="item.invRationMoneyInputShow" maxlength="4"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                  <el-select
                    v-model="item.invRationMoneySelect"
                    v-show="item.invRationMoneySelectShow"
                    placeholder="请选择"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  >
                    <el-option
                      v-for="item in moneyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input type="number"  v-model="item.invStartNo" maxlength="9" @input="sumManualInvCount(index)"
                            :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
                </td>
                <td>
                  <el-input type="number"  v-model="item.invEndNo" maxlength="9" @input="sumManualInvCount(index)"
                            :disabled="controlDisabled || samePersonCheckDisabled"></el-input>
                </td>
                <td>
                  <el-input type="number"  v-model="item.invCount":disabled="true"></el-input>
                </td>
                <td>
                  <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeManualInvRecord(index)"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
              </tr>

            </table>

            <div class="page-header">
              <span>废票</span>
            </div>
            &lt;!&ndash;机打废票&ndash;&gt;
            <table class="table" id="badManualInvCodeTable">
              <tr class="bg-gray">
                <td>类型</td>
                <td style="min-width: 120px;">定额发票废票面额</td>
                <td style="min-width: 120px;">定额发票废票号</td>
                <td>数量</td>
                <td style="width:50px;max-width: 50px;">
                  <div class="text-center" style="background: #dddddd;">
                    <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addBadManualInvRecord()"
                               :disabled="controlDisabled || samePersonCheckDisabled"/>
                  </div>
                </td>
              </tr>

              <tr v-for="(item, index) in shiftRegMainRecord.shiftSquadRationInvalidinvList">
                <td>
                  <ti-select
                    v-model="item.invType"
                    placeholder="请选择"
                    dict-type="tibms_toll_rinvoiceType"
                    @change="changeBadManualInvType(index)"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  />
                </td>
                <td>
                  <el-input type="text" v-model="item.invRationMoneyInput" v-show="item.badInvRationMoneyInputShow" maxlength="4"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                  <el-select
                    v-model="item.invRationMoneySelect"
                    v-show="item.badInvRationMoneySelectShow"
                    placeholder="请选择"
                    :disabled="controlDisabled || samePersonCheckDisabled"
                  >
                    <el-option
                      v-for="item in moneyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="item.badInvID" type="number" @input="checkRationBadInvId(index)"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
                <td>
                  <el-input :disabled="true" v-model="item.invCount"/>
                </td>
                <td>
                  <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removeBadManualInvRecord(index)"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
              </tr>

            </table>
          </div>-->

          <div style="margin-top: 10px;padding: 5px 5px;border: 1px solid #eee;"
               v-show="(shiftRegMainRecord.userMarkNo != ''
								&& shiftRegMainRecord.stationNo != ''
								&& shiftRegMainRecord.laneNo != ''
								&& shiftRegMainRecord.squadDate != ''
								&& shiftRegMainRecord.squadNo != ''
								&& shiftRegMainRecord.laneOperatorID != '')
                 			&& process == 2 && shiftRegMainRecord.userMarkNo == 1">


            <div class="page-header">
              <span>纸券</span>
            </div>
            <!--纸券-->
            <table class="table" id="paperTable">
              <tr class="bg-gray">
                <td>纸券起始号</td>
                <td>纸券结束号</td>
                <td>纸券数量</td>
                <td style="width:50px;max-width: 50px;">
                  <div class="text-center" style="background: #dddddd;">
                    <el-button type="primary" class="tableButton" icon="el-icon-plus" @click="addPaperRecord()"
                               :disabled="controlDisabled || samePersonCheckDisabled"/>
                  </div>
                </td>
              </tr>

              <tr v-for="(item, index) in shiftRegMainRecord.shiftSquadPaperList">
                <td>
                  <el-input type="text" name="paperStart" @input="sumPaperCount(index)" v-model="item.paperStart" min="1" maxlength="14"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
                <td>
                  <el-input type="text" name="paperStart" @input="sumPaperCount(index)" v-model="item.paperEnd" min="1" maxlength="14"
                            :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
                <td>
                  <el-input :disabled="true" v-model="item.paperCount"/>
                </td>
                <td>
                  <el-button type="primary" class="tableButton" icon="el-icon-minus" @click="removePaperRecord(index)"
                             :disabled="controlDisabled || samePersonCheckDisabled"/>
                </td>
              </tr>

            </table>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <div class="page-header">
          <span>备注</span>
        </div>
        <el-input
          type="textarea"
          :rows="2"
          maxlength="120"
          v-model="shiftRegMainRecord.spare1"
          :disabled="controlDisabled || samePersonCheckDisabled">
        </el-input>
      </el-row>
      <el-row style="text-align: center;margin-top: 10px;">
        <el-button @click="close()">关闭</el-button>
        <el-button type="primary" v-permission="['shiftRegMainRecord:goBack']" @click="goBack(1)"
                v-show="process == 2 && status != 5" id="goBackBtn">回退</el-button>
        <!--<el-button type="primary" v-permission="['shiftRegMainRecord:create']"
                   :loading="saveLoading" @click="save_1(4)" :disabled="samePersonCheckDisabled"
                   v-show="process == 1 || (process == 2 && status == 3)">保存</el-button>-->
        <el-button type="primary" v-permission="['shiftRegMainRecord:create']"
                   :loading="saveLoading" @click="save_1(2)" :disabled="samePersonCheckDisabled"
                   v-show="process == 1 || (process == 2 && status == 3)">保存</el-button>
      </el-row>
    </el-form>

    <invoice-code-stock ref="invoiceCodeStockDialog" :showData="shiftRegMainRecord.invoiceCodeStockCheckList"></invoice-code-stock>
    <manual-stock ref="manualStockDialog" :showData="shiftRegMainRecord.manualStockCheckList"></manual-stock>
    <paper-code-stock ref="paperCodeStockDialog" :showData="shiftRegMainRecord.paperCodeStockCheckList"></paper-code-stock>
    <pass-card-transfer ref="passCardTransferDialog" :showData="shiftRegMainRecord.transferShiftpasscarddetailList"
                        @transferAll="transferAll"
                        @transferSubmit="transferSubmit"></pass-card-transfer>
    <back-dialog ref="goBackDialog" @refreshData="getData"></back-dialog>
  </div>
</template>


<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment';
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import dictUtils from 'ecip-web/utils/dictUtils';
import sysOrgConstant from "@/views/pro/common/constant/sysOrgConstant.js";
import api from '../shiftRegMainRecordApi.js'
import shiftRulesUtil from '../shiftRulesUtil.js'
import invoiceCodeStock from './invoiceCodeStockDialog.vue';
import manualStock from './manualStockDialog.vue';
import paperCodeStock from './paperCodeStockDialog.vue';
import passCardTransfer from './passCardTransferDialog.vue';
import backDialog from './backDialog.vue';
import {findList} from "@/views/sx/toll/card/cardManage/cardUnit/cardUnitApi";

export default {
  name: 'detailShiftRegMainRecordForm',
  components: { TiSelect, tiSysOrg, invoiceCodeStock, manualStock, paperCodeStock, passCardTransfer, backDialog },
  mixins: [...mixin],
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      visible: false,
      addShow: false,
      loading: false,
      saveLoading: false,
      sysOrgConstant:{},
      workStatus : -1,  //0-上班 1-下班
      cardUnitNoMap:  {}, // 卡单元对应卡数Map
      cardBoxOpType: 1, // 卡单元操作类型：1：新增；0：删除
      buttonType:  -1, // 按钮类型：1：回退；2：提交；3：提交并新增；4：保存；5：取消；
      process:  1, // 流程节点：1：上班；2：下班； 默认进来是上班状态
      status:  1, // 业务状态：1：上班草稿；2：上班提交；3：下班草稿；4：下班提交；
      operationTyp:  1, // 操作类型：1：新增；2：修改；
      laneManageMode:'', //是否使用车道管理模式
      isHaveSpareMoney:'', //是否显示登记备用金开关
      isHaveSpareMoneyForWork: '', //上班是否需要登记备用金
      isShowDefaultTXMoney: '', //交接班出口下班是否显示通行费
      hkMoneyExchangeRate: '', //获取港币转换利率
      isHaveMobileMoney: '', //获取是否显示移动支付开关,
      controlDisabled: false,// 控件是否禁用：1、2、3：非禁用；4、5：禁用
      samePersonCheckDisabled : false,// 非本人登记：无权限只能看
      operationType:'', // 操作类型：1：新增；2：修改
      allLaneList:[],   //所有车道
      laneList:[],
      sysUserList:[],   //操作员
      laneNoDisabled: false,
      queryParams:{
        laneType:'',
        stationNo:'',
        laneNo:'',
        squadNo:'',
        operatorID:'',
        squadDate:'',
        opType:'',
        userMarkNo:''
      },  //条件
      title: '交班登记详情',
      totalShiftInvDetailInvCount:0,  //机打发票数量
      totalManualInvCount:0,          //定额发票
      totalShiftCpcPassCardBadCount: 0, //坏卡数量
      stationMap:{},
      operatorMap:{},
      shiftRegMainRecord: {
        userMarkNo:'',
        realUserMarkNo: '',
        stationNo: '',
        laneNo: '',
        squadDateStr: '',
        squadNo: '',
        laneOperatorID: '',
        laneOperatorName: '',
        spareMoneyForWork: '',
        spareMoney: '',
        txMoney:'',
        posMoney: '',
        gongBenFei: '',
        buZhaoShu: '',
        other: '',
        mobileMoney: '',
        gongSiErWeiMa: '',
        gangBi: '',
        jiaBi: '',
        kaPeiKuan: '',
        jiChaDuanKuan: '',
        jiChaChangKuan: '',
        jiChaDuanKuanModal: '',
        jiChaChangKuanModal: '',
        moneyBagNumber: '',
        paperCount: '',
        blankInvCount: '',
        retakeInvCount: '',
        totalMoney: '',
        returnCardCnt: '',

        shiftRegMoney:{},
        oldShiftregmoney:{},
        shiftPassCardDetailList: [],
        oldShiftPassCardDetailList: [],
        shiftInvDetailList: [],  //机打发票
        oldShiftInvDetailList: [],   //机打发票
        shiftSquadInvalidinvList: [], //机打废票
        oldShiftSquadInvalidinvList: [], //机打废票
        shiftSquadRationInvoiceList: [],  //定额发票
        oldShiftSquadRationInvoiceList: [],  //定额发票
        shiftSquadRationInvalidinvList: [],
        oldShiftSquadRationInvalidinvList: [],
        shiftSquadPaperList: [],
        oldShiftSquadPaperList: [],
        shiftCpcPassCardBadDetailList: [],
        oldShiftCpcPassCardBadDetailList: [],

        invoiceCodeStockCheckList: [],
        manualStockCheckList:[],
        paperCodeStockCheckList: [],
        transferShiftpasscarddetailList: [],
        opTime: '',
        regTime: '',
        registerOperatorID: '',
        registerOperatorName: '',
        regOperatorID: '',
        modifyOperatorID: '',
        modifyOperatorName: '',
        linkID: '',
        forWorkID: '',
        offWorkID: '',
        taskId: '',
        spare1: '',
        laneOperatorText: ''

      },
      shiftProcessLink:{},
      shiftHandInMoney: {

      },
      operator:{
        userName:'',
        realName:'',
        org:{}
      },
      moneyOptions: [
        {
          value: '20',
          label: '20'
        },
        {
          value: '50',
          label: '50'
        },
        {
          value: '100',
          label: '100'
        }
      ],
      rules:{
        spareMoneyForWork:[{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        spareMoney:[{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        txMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        posMoney: [{validator: shiftRulesUtil.checkTxMoney, trigger: 'blur'}],
        gongBenFei: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        buZhaoShu: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        mobileMoney: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        gangBi: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        jiaBi: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        kaPeiKuan: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        jiChaDuanKuan: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        jiChaChangKuan: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        gongSiErWeiMa: [{validator: shiftRulesUtil.checkPositiveNumber, trigger: 'blur'}],
        paperCount: [{validator: shiftRulesUtil.checkDigits, trigger: 'blur'}],
        blankInvCount: [{validator: shiftRulesUtil.checkDigits, trigger: 'blur'}],
        retakeInvCount: [{validator: shiftRulesUtil.checkDigits, trigger: 'blur'}],
        returnCardCnt: [{validator: shiftRulesUtil.checkDigits, trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getCardUnitNoList();
    this.detail(this.$route.query.id)

  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  methods: {
    cardUnitNoListFilter(data){
      // this.shiftProcessLink.status == 1
      // if(this.buttonType==1 || (this.buttonType == -1 && this.shiftProcessLink.status == 1)){
      if(this.workStatus == 0 || (this.workStatus == -1 && this.shiftProcessLink.status == 1 )){
        let arr = this.$stream(data).filter(x => x.used==0).toArray();
        this.shiftRegMainRecord.oldShiftPassCardDetailList.forEach((x)=> arr.push({unitNo:x.cardUnitNo}))
        return arr.sort((x1,x2)=>x1.unitNo-x2.unitNo)
      }else{
        return data
      }
    },
    async getCardUnitNoList() {
        this.cardUnitNoListShow = (await findList({},{})).data;
    },
    detail(id) {
      this.loading = false
      this.saveLoading = false
      this.operator.realName = this.$store.getters.userInfo.realName;
      this.operator.userName = this.$store.getters.userInfo.username;
      let isHaveSpareMoney = dictUtils.getDictLabel('tibms_config', 'toll_shift_haveSpareMoney', 'false');
      this.isHaveSpareMoney = isHaveSpareMoney == "true" ? true : false;

      let isHaveSpareMoneyForWork = dictUtils.getDictLabel('tibms_config', 'toll_shift_haveSpareMoneyForWork', 'false');
      this.isHaveSpareMoneyForWork  = isHaveSpareMoneyForWork == "true" ? true : false;

      let laneManageMode = dictUtils.getDictLabel('tibms_config', 'toll_shift_laneManageMode', 'false');
      this.laneManageMode = laneManageMode == "true" ? 1 : 0;

      let isShowDefaultTXMoney = dictUtils.getDictLabel('tibms_config', 'toll_shift_exportOffWorkMoney', 'false');
      this.isShowDefaultTXMoney = isShowDefaultTXMoney == "true" ? true : false;

      let isHaveMobileMoney = dictUtils.getDictLabel('tibms_config', 'toll_shift_haveMobileMoney', 'false');
      this.isHaveMobileMoney = isHaveMobileMoney == "true" ? true : false;

      let hkMoneyExchangeRate = dictUtils.getDictLabel('tibms_config', 'toll_shift_hkMoneyExchangeRate', '0');
      this.hkMoneyExchangeRate = parseInt(hkMoneyExchangeRate);

      this.sysOrgConstant = sysOrgConstant;

      this.$nextTick(async() => {
        let that = this

        let stationData = await api.findStationByAuth(4)
        if(stationData.code == 200){
          for(let data of stationData.data){
            that.stationMap[data.stationNo] = data.name
          }
        }

        //this.handleReset();
        let laneData = await api.findAllLane();
        this.allLaneList = laneData.data;

        const sysUserData = await api.getSysUser();
        this.sysUserList = sysUserData.data;
        this.sysUserList.forEach(function (data, index) {
          that.operatorMap[data.username] = data.realName
        })

        let orgData = await api.getCurrentOrg();
        this.operator.org = orgData.data;

        api.detail(id).then(async data => {
          if (null == data || null == data.data) {
            that.$alert("获取流程详情失败，请检查！")
            return
          }


          let shiftProcessLink = data.data
          that.shiftProcessLink = shiftProcessLink
          let tempShiftRegMainRecord = null == shiftProcessLink.forWorkShiftRegMainRecord ? shiftProcessLink.offWorkShiftRegMainRecord : shiftProcessLink.forWorkShiftRegMainRecord
          // 控制控件是否禁用
          that.controlDisabled = (parseInt(shiftProcessLink.status) == 4 || parseInt(shiftProcessLink.status) == 5) ? true : false

          // 流程控制变量设置
          switch (parseInt(shiftProcessLink.status)) {
            case 1:
              that.status = shiftProcessLink.status
              that.process = 1
              break
            case 2:
            case 3:
              that.status = 3
              that.process = 2
              break
            case 4:
            case 5:
              that.status = shiftProcessLink.status
              that.process = 2
              break
          }



          // 属性设置
          that.shiftRegMainRecord.userMarkNo = 3 == parseInt(tempShiftRegMainRecord.userMarkNo) || 4 == parseInt(tempShiftRegMainRecord.userMarkNo) ? '2' : '1'
          that.shiftRegMainRecord.realUserMarkNo = tempShiftRegMainRecord.userMarkNo
          that.shiftRegMainRecord.stationNo = tempShiftRegMainRecord.stationNo + ''
          if (that.laneManageMode == 0) {
            that.shiftRegMainRecord.laneNo = "0"
          } else {
            that.shiftRegMainRecord.laneNo = tempShiftRegMainRecord.laneNo + ''
          }
          that.shiftRegMainRecord.squadDateStr = moment(tempShiftRegMainRecord.squadDate).format("YYYY-MM-DD")
          that.shiftRegMainRecord.squadNo = tempShiftRegMainRecord.squadNo + ''
          that.shiftRegMainRecord.laneOperatorID = tempShiftRegMainRecord.laneOperatorID + ''
          that.shiftRegMainRecord.laneOperatorName = tempShiftRegMainRecord.laneOperatorName
          that.shiftRegMainRecord.laneOperatorText = '['+ tempShiftRegMainRecord.laneOperatorID +']'+ tempShiftRegMainRecord.laneOperatorName

          that.shiftRegMainRecord.opTime = tempShiftRegMainRecord.opTime
          that.shiftRegMainRecord.regTime = tempShiftRegMainRecord.regTime
          that.shiftRegMainRecord.registerOperatorID = tempShiftRegMainRecord.registerOperatorID + ''
          that.shiftRegMainRecord.registerOperatorName = tempShiftRegMainRecord.registerOperatorName
          that.shiftRegMainRecord.modifyOperatorID = tempShiftRegMainRecord.modifyOperatorID + ''
          that.shiftRegMainRecord.modifyOperatorName = tempShiftRegMainRecord.modifyOperatorName

          that.shiftRegMainRecord.linkID = shiftProcessLink.id + ''
          that.shiftRegMainRecord.forWorkID = shiftProcessLink.forWorkID
          that.shiftRegMainRecord.offWorkID = shiftProcessLink.offWorkID
          that.shiftRegMainRecord.taskId = shiftProcessLink.task == null ? "" : shiftProcessLink.task.id
          that.shiftRegMainRecord.spare1 = tempShiftRegMainRecord.spare1

          that.shiftRegMainRecord.totalMoney = null == tempShiftRegMainRecord.totalMoney ? 0 : parseInt(tempShiftRegMainRecord.totalMoney) / 100.0
          that.shiftRegMainRecord.txMoney = 0 == parseInt(tempShiftRegMainRecord.txMoney) ? "" : parseInt(tempShiftRegMainRecord.txMoney) / 100.0
          that.shiftRegMainRecord.posMoney = 0 == parseInt(tempShiftRegMainRecord.posMoney) ? "" : parseInt(tempShiftRegMainRecord.posMoney) / 100.0
          that.shiftRegMainRecord.gongBenFei = 0 == parseInt(tempShiftRegMainRecord.gongBenFei) ? "" : parseInt(tempShiftRegMainRecord.gongBenFei) / 100.0
          that.shiftRegMainRecord.buZhaoShu = 0 == parseInt(tempShiftRegMainRecord.buZhaoShu) ? "" : parseInt(tempShiftRegMainRecord.buZhaoShu) / 100.0
          that.shiftRegMainRecord.other = 0 == parseInt(tempShiftRegMainRecord.other) ? "" : parseInt(tempShiftRegMainRecord.other) / 100.0
          that.shiftRegMainRecord.spareMoney = parseInt(that.process) == 2 ?
            0 == parseInt(tempShiftRegMainRecord.spareMoney) ? "" : parseInt(tempShiftRegMainRecord.spareMoney) / 100.0 : ""
          that.shiftRegMainRecord.spareMoneyForWork = parseInt(that.process) == 1 ?
            0 == parseInt(tempShiftRegMainRecord.spareMoney) ? "" : parseInt(tempShiftRegMainRecord.spareMoney) / 100.0 : ""
          that.shiftRegMainRecord.mobileMoney = 0 == parseInt(tempShiftRegMainRecord.mobileMoney) ? "" : parseInt(tempShiftRegMainRecord.mobileMoney) / 100.0
          that.shiftRegMainRecord.gongSiErWeiMa = 0 == parseInt(tempShiftRegMainRecord.gongSiErWeiMa) ? "" : parseInt(tempShiftRegMainRecord.gongSiErWeiMa) / 100.0
          that.shiftRegMainRecord.gangBi = 0 == parseInt(tempShiftRegMainRecord.gangBi) ? "" : parseInt(tempShiftRegMainRecord.gangBi) / 100.0
          that.shiftRegMainRecord.jiaBi = 0 == parseInt(tempShiftRegMainRecord.jiaBi) ? "" : parseInt(tempShiftRegMainRecord.jiaBi) / 100.0
          that.shiftRegMainRecord.kaPeiKuan = 0 == parseInt(tempShiftRegMainRecord.kaPeiKuan) ? "" : parseInt(tempShiftRegMainRecord.kaPeiKuan) / 100.0
          that.shiftRegMainRecord.jiChaDuanKuan = 0 == parseInt(tempShiftRegMainRecord.jiChaDuanKuan) ? "" : parseInt(tempShiftRegMainRecord.jiChaDuanKuan) / 100.0
          that.shiftRegMainRecord.jiChaChangKuan = 0 == parseInt(tempShiftRegMainRecord.jiChaChangKuan) ? "" : parseInt(tempShiftRegMainRecord.jiChaChangKuan) / 100.0

          that.shiftRegMainRecord.moneyBagNumber = tempShiftRegMainRecord.shiftRegMoney.moneyBagNumber
          that.shiftRegMainRecord.blankInvCount = tempShiftRegMainRecord.blankInvCount
          that.shiftRegMainRecord.retakeInvCount = tempShiftRegMainRecord.retakeInvCount
          that.shiftRegMainRecord.returnCardCnt = tempShiftRegMainRecord.returnCardCnt
          if(that.shiftRegMainRecord.stationNo){
            api.getCardUnitList(that.shiftRegMainRecord.stationNo).then(res =>{
              if(res.code == 200){
                res.data.forEach(function (data , index) {
                  that.cardUnitNoMap[data.cardUnitNo] = data
                })
              }
            })
          }

          //
          that.shiftRegMainRecord.shiftRegMoney = tempShiftRegMainRecord.shiftRegMoney
          that.shiftRegMainRecord.oldShiftregmoney = tempShiftRegMainRecord.shiftRegMoney

          // 卡单元
          that.shiftRegMainRecord.shiftPassCardDetailList = tempShiftRegMainRecord.shiftPassCardDetailList
          that.shiftRegMainRecord.oldShiftPassCardDetailList = tempShiftRegMainRecord.oldShiftPassCardDetailList

          // 纸券
          that.shiftRegMainRecord.shiftSquadPaperList = tempShiftRegMainRecord.shiftSquadPaperList
          if(tempShiftRegMainRecord.shiftSquadPaperList != null && tempShiftRegMainRecord.shiftSquadPaperList.length > 0){
            let paperCount = 0
            for(let shiftSquadPaper of tempShiftRegMainRecord.shiftSquadPaperList){
              paperCount += parseInt(shiftSquadPaper.paperCount)
            }
            that.shiftRegMainRecord.paperCount = paperCount
          }
          that.shiftRegMainRecord.oldShiftSquadPaperList = tempShiftRegMainRecord.oldShiftSquadPaperList

          //坏卡
          that.shiftRegMainRecord.shiftCpcPassCardBadDetailList = tempShiftRegMainRecord.shiftCpcPassCardBadDetailList
          that.shiftRegMainRecord.oldShiftCpcPassCardBadDetailList = tempShiftRegMainRecord.oldShiftCpcPassCardBadDetailList

          // 机打发票
          that.shiftRegMainRecord.shiftInvDetailList = tempShiftRegMainRecord.shiftInvDetailList
          that.shiftRegMainRecord.oldShiftInvDetailList = tempShiftRegMainRecord.oldShiftInvDetailList
          that.shiftRegMainRecord.shiftSquadInvalidinvList = tempShiftRegMainRecord.shiftSquadInvalidInvList
          if (null != that.shiftRegMainRecord.shiftSquadInvalidinvList && that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
            for(let tmp of that.shiftRegMainRecord.shiftSquadInvalidinvList){
              tmp.money = parseFloat(tmp.money / 100.0)
              that.$set(tmp,'showMoney',tmp.money)
              tmp.invCount = 1
            }
          }
          that.shiftRegMainRecord.oldShiftsquadinvalidinvList = tempShiftRegMainRecord.oldShiftSquadInvalidInvList
          that.sumShiftInvDetailInvCount(null)

          // 定额发票
          that.shiftRegMainRecord.shiftSquadRationInvoiceList = tempShiftRegMainRecord.shiftSquadRationInvoiceList
          if (null != that.shiftRegMainRecord.shiftSquadRationInvoiceList && that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
            let index = 0
            for(let tmp of that.shiftRegMainRecord.shiftSquadRationInvoiceList){
              tmp.invType =  tmp.invType+''
              that.changeManualInvType(index)
              index++
            }
          }
          that.shiftRegMainRecord.oldShiftSquadRationInvoiceList = tempShiftRegMainRecord.oldShiftSquadRationInvoiceList
          if (null != that.shiftRegMainRecord.oldShiftSquadRationInvoiceList && that.shiftRegMainRecord.oldShiftSquadRationInvoiceList.length > 0) {
            for(let tmp of that.shiftRegMainRecord.oldShiftSquadRationInvoiceList){
              tmp.invType =  tmp.invType+''
            }
          }
          that.shiftRegMainRecord.shiftSquadRationInvalidinvList = tempShiftRegMainRecord.shiftSquadRationInvalidInvList
          if (null != that.shiftRegMainRecord.shiftSquadRationInvalidinvList && that.shiftRegMainRecord.shiftSquadRationInvalidinvList.length > 0) {
            let index = 0
            for(let tmp of that.shiftRegMainRecord.shiftSquadRationInvalidinvList){
              tmp.invType =  tmp.invType+''
              that.changeBadManualInvType(index)
              index++
            }
          }
          that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList = tempShiftRegMainRecord.oldShiftSquadRationInvalidInvList
          if (null != that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList && that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList.length > 0) {
            for(let tmp of that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList){
              tmp.invType =  tmp.invType+''
            }
          }
          that.sumManualInvCount(null)

          if (that.process == 2
            && that.status == 3
            && that.shiftRegMainRecord.userMarkNo == 2
            && that.shiftRegMainRecord.txMoney == ''
            && that.shiftRegMainRecord.posMoney == '') {
            that.showDefaultTXMoney()
          }

          if (that.shiftProcessLink.status != 5) {
            that.pageCheck()
          }

          that.visible = true
          that.addShow = true
        })
      })
    },
    async pageCheck() {
      // 判断操作类型
      if (!this.makeOperationType().flag) {
        this.samePersonCheckDisabled = true
        return

        this.operationType = this.makeOperationType().operationType

        // 校验登记人是否为本人
        if (!this.pageCheckRegOperatorID()) {
          this.close()
          return
        }

        // 校验记录是否被删除
        if (! await this.lastCheckOpTime()) {
          this.close()
          return
        }
      }
    },
    pageCheckRegOperatorID() {
      let powerSMG0100 = false
      if (!powerSMG0100) {
        let registerOperatorID = this.shiftRegMainRecord.registerOperatorID
        let loginOperator = this.operator.username
        if (registerOperatorID != loginOperator) {
          this.$alert("该交班记录不是本人登记，无法对此交接班记录进行操作！")
          this.samePersonCheckDisabled = true
          return false
        }
      }

      return true
    },
    async getData() {
      let that = this
      api.detail(that.shiftRegMainRecord.linkID).then(data => {
        if (null == data || null == data.data) {
          that.$alert("获取流程详情失败，请检查！")
          return
        }

        let shiftProcessLink = data.data
        that.shiftProcessLink = shiftProcessLink
        let tempShiftRegMainRecord = null == shiftProcessLink.forWorkShiftRegMainRecord ? shiftProcessLink.offWorkShiftRegMainRecord : shiftProcessLink.forWorkShiftRegMainRecord
        // 控制控件是否禁用
        that.controlDisabled = (parseInt(shiftProcessLink.status) == 4 || parseInt(shiftProcessLink.status) == 5) ? true : false

        // 流程控制变量设置
        switch (parseInt(shiftProcessLink.status)) {
          case 1:
            that.status = shiftProcessLink.status
            that.process = 1
            break
          case 2:
          case 3:
            that.status = 3
            that.process = 2
            break
          case 4:
          case 5:
            that.status = shiftProcessLink.status
            that.process = 2
            break
        }



        // 属性设置
        that.shiftRegMainRecord.userMarkNo = 3 == parseInt(tempShiftRegMainRecord.userMarkNo) || 4 == parseInt(tempShiftRegMainRecord.userMarkNo) ? '2' : '1'
        that.shiftRegMainRecord.realUserMarkNo = tempShiftRegMainRecord.userMarkNo
        that.shiftRegMainRecord.stationNo = tempShiftRegMainRecord.stationNo + ''
        if (that.laneManageMode == 0) {
          that.shiftRegMainRecord.laneNo = "0"
        } else {
          that.shiftRegMainRecord.laneNo = tempShiftRegMainRecord.laneNo + ''
        }
        that.shiftRegMainRecord.squadDateStr = moment(tempShiftRegMainRecord.squadDate).format("YYYY-MM-DD")
        that.shiftRegMainRecord.squadNo = tempShiftRegMainRecord.squadNo + ''
        that.shiftRegMainRecord.laneOperatorID = tempShiftRegMainRecord.laneOperatorID + ''
        that.shiftRegMainRecord.laneOperatorName = tempShiftRegMainRecord.laneOperatorName
        that.shiftRegMainRecord.laneOperatorText = '['+ tempShiftRegMainRecord.laneOperatorID +']'+ tempShiftRegMainRecord.laneOperatorName

        that.shiftRegMainRecord.opTime = tempShiftRegMainRecord.opTime
        that.shiftRegMainRecord.regTime = tempShiftRegMainRecord.regTime
        that.shiftRegMainRecord.registerOperatorID = tempShiftRegMainRecord.registerOperatorID + ''
        that.shiftRegMainRecord.registerOperatorName = tempShiftRegMainRecord.registerOperatorName
        that.shiftRegMainRecord.modifyOperatorID = tempShiftRegMainRecord.modifyOperatorID + ''
        that.shiftRegMainRecord.modifyOperatorName = tempShiftRegMainRecord.modifyOperatorName

        that.shiftRegMainRecord.linkID = shiftProcessLink.id + ''
        that.shiftRegMainRecord.forWorkID = shiftProcessLink.forWorkID
        that.shiftRegMainRecord.offWorkID = shiftProcessLink.offWorkID
        that.shiftRegMainRecord.taskId = shiftProcessLink.task == null ? "" : shiftProcessLink.task.id
        that.shiftRegMainRecord.spare1 = tempShiftRegMainRecord.spare1

        that.shiftRegMainRecord.totalMoney = null == tempShiftRegMainRecord.totalMoney ? 0 : parseInt(tempShiftRegMainRecord.totalMoney) / 100.0
        that.shiftRegMainRecord.txMoney = 0 == parseInt(tempShiftRegMainRecord.txMoney) ? "" : parseInt(tempShiftRegMainRecord.txMoney) / 100.0
        that.shiftRegMainRecord.posMoney = 0 == parseInt(tempShiftRegMainRecord.posMoney) ? "" : parseInt(tempShiftRegMainRecord.posMoney) / 100.0
        that.shiftRegMainRecord.gongBenFei = 0 == parseInt(tempShiftRegMainRecord.gongBenFei) ? "" : parseInt(tempShiftRegMainRecord.gongBenFei) / 100.0
        that.shiftRegMainRecord.buZhaoShu = 0 == parseInt(tempShiftRegMainRecord.buZhaoShu) ? "" : parseInt(tempShiftRegMainRecord.buZhaoShu) / 100.0
        that.shiftRegMainRecord.other = 0 == parseInt(tempShiftRegMainRecord.other) ? "" : parseInt(tempShiftRegMainRecord.other) / 100.0
        that.shiftRegMainRecord.spareMoney = parseInt(that.process) == 2 ?
          0 == parseInt(tempShiftRegMainRecord.spareMoney) ? "" : parseInt(tempShiftRegMainRecord.spareMoney) / 100.0 : ""
        that.shiftRegMainRecord.spareMoneyForWork = parseInt(that.process) == 1 ?
          0 == parseInt(tempShiftRegMainRecord.spareMoney) ? "" : parseInt(tempShiftRegMainRecord.spareMoney) / 100.0 : ""
        that.shiftRegMainRecord.mobileMoney = 0 == parseInt(tempShiftRegMainRecord.mobileMoney) ? "" : parseInt(tempShiftRegMainRecord.mobileMoney) / 100.0
        that.shiftRegMainRecord.gongSiErWeiMa = 0 == parseInt(tempShiftRegMainRecord.gongSiErWeiMa) ? "" : parseInt(tempShiftRegMainRecord.gongSiErWeiMa) / 100.0
        that.shiftRegMainRecord.gangBi = 0 == parseInt(tempShiftRegMainRecord.gangBi) ? "" : parseInt(tempShiftRegMainRecord.gangBi) / 100.0
        that.shiftRegMainRecord.jiaBi = 0 == parseInt(tempShiftRegMainRecord.jiaBi) ? "" : parseInt(tempShiftRegMainRecord.jiaBi) / 100.0
        that.shiftRegMainRecord.kaPeiKuan = 0 == parseInt(tempShiftRegMainRecord.kaPeiKuan) ? "" : parseInt(tempShiftRegMainRecord.kaPeiKuan) / 100.0
        that.shiftRegMainRecord.jiChaDuanKuan = 0 == parseInt(tempShiftRegMainRecord.jiChaDuanKuan) ? "" : parseInt(tempShiftRegMainRecord.jiChaDuanKuan) / 100.0
        that.shiftRegMainRecord.jiChaChangKuan = 0 == parseInt(tempShiftRegMainRecord.jiChaChangKuan) ? "" : parseInt(tempShiftRegMainRecord.jiChaChangKuan) / 100.0

        that.shiftRegMainRecord.moneyBagNumber = tempShiftRegMainRecord.shiftRegMoney.moneyBagNumber
        that.shiftRegMainRecord.blankInvCount = tempShiftRegMainRecord.blankInvCount
        that.shiftRegMainRecord.retakeInvCount = tempShiftRegMainRecord.retakeInvCount


        api.getCardUnitList(that.shiftRegMainRecord.stationNo).then(res =>{
          if(res.code == 200){
            res.data.forEach(function (data , index) {
              that.cardUnitNoMap[data.cardUnitNo] = data
            })
          }
        })

        //
        that.shiftRegMainRecord.shiftRegMoney = tempShiftRegMainRecord.shiftRegMoney
        that.shiftRegMainRecord.oldShiftregmoney = tempShiftRegMainRecord.shiftRegMoney

        // 卡单元
        that.shiftRegMainRecord.shiftPassCardDetailList = tempShiftRegMainRecord.shiftPassCardDetailList
        that.shiftRegMainRecord.oldShiftPassCardDetailList = tempShiftRegMainRecord.oldShiftPassCardDetailList

        // 纸券
        that.shiftRegMainRecord.shiftSquadPaperList = tempShiftRegMainRecord.shiftSquadPaperList
        if(tempShiftRegMainRecord.shiftSquadPaperList != null && tempShiftRegMainRecord.shiftSquadPaperList.length > 0){
          let paperCount = 0
          for(let shiftSquadPaper of tempShiftRegMainRecord.shiftSquadPaperList){
            paperCount += parseInt(shiftSquadPaper.paperCount)
          }
          that.shiftRegMainRecord.paperCount = paperCount
        }
        that.shiftRegMainRecord.oldShiftSquadPaperList = tempShiftRegMainRecord.oldShiftSquadPaperList

        //坏卡
        that.shiftRegMainRecord.shiftCpcPassCardBadDetailList = tempShiftRegMainRecord.shiftCpcPassCardBadDetailList
        that.shiftRegMainRecord.oldShiftCpcPassCardBadDetailList = tempShiftRegMainRecord.oldShiftCpcPassCardBadDetailList

        // 机打发票
        that.shiftRegMainRecord.shiftInvDetailList = tempShiftRegMainRecord.shiftInvDetailList
        that.shiftRegMainRecord.oldShiftInvDetailList = tempShiftRegMainRecord.oldShiftInvDetailList
        that.shiftRegMainRecord.shiftSquadInvalidinvList = tempShiftRegMainRecord.shiftSquadInvalidInvList
        if (null != that.shiftRegMainRecord.shiftSquadInvalidinvList && that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
          for(let tmp of that.shiftRegMainRecord.shiftSquadInvalidinvList){
            tmp.money = parseFloat(tmp.money / 100.0)
            that.$set(tmp,'showMoney',tmp.money)
            tmp.invCount = 1
          }
        }
        that.shiftRegMainRecord.oldShiftsquadinvalidinvList = tempShiftRegMainRecord.oldShiftSquadInvalidInvList
        that.sumShiftInvDetailInvCount(null)

        // 定额发票
        that.shiftRegMainRecord.shiftSquadRationInvoiceList = tempShiftRegMainRecord.shiftSquadRationInvoiceList
        if (null != that.shiftRegMainRecord.shiftSquadRationInvoiceList && that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
          let index = 0
          for(let tmp of that.shiftRegMainRecord.shiftSquadRationInvoiceList){
            tmp.invType =  tmp.invType+''
            that.changeManualInvType(index)
            index++
          }
        }
        that.shiftRegMainRecord.oldShiftSquadRationInvoiceList = tempShiftRegMainRecord.oldShiftSquadRationInvoiceList
        if (null != that.shiftRegMainRecord.oldShiftSquadRationInvoiceList && that.shiftRegMainRecord.oldShiftSquadRationInvoiceList.length > 0) {
          for(let tmp of that.shiftRegMainRecord.oldShiftSquadRationInvoiceList){
            tmp.invType =  tmp.invType+''
          }
        }
        that.shiftRegMainRecord.shiftSquadRationInvalidinvList = tempShiftRegMainRecord.shiftSquadRationInvalidInvList
        if (null != that.shiftRegMainRecord.shiftSquadRationInvalidinvList && that.shiftRegMainRecord.shiftSquadRationInvalidinvList.length > 0) {
          let index = 0
          for(let tmp of that.shiftRegMainRecord.shiftSquadRationInvalidinvList){
            tmp.invType =  tmp.invType+''
            that.changeBadManualInvType(index)
            index++
          }
        }
        that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList = tempShiftRegMainRecord.oldShiftSquadRationInvalidInvList
        if (null != that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList && that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList.length > 0) {
          for(let tmp of that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList){
            tmp.invType =  tmp.invType+''
          }
        }
        that.sumManualInvCount(null)

        if (that.process == 2
          && that.status == 3
          && that.shiftRegMainRecord.userMarkNo == 2
          && that.shiftRegMainRecord.txMoney == ''
          && that.shiftRegMainRecord.posMoney == '') {
          that.showDefaultTXMoney()
        }

        if (that.shiftProcessLink.status != 5) {
          that.pageCheck()
        }

      })
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    // 基础信息########################################################################################################
    initModal(){

      // 金额
      this.$set(this.shiftRegMainRecord,'totalMoney',0)
      this.$set(this.shiftRegMainRecord,'txMoney','')
      this.$set(this.shiftRegMainRecord,'posMoney','')
      this.$set(this.shiftRegMainRecord,'gongBenFei','')
      this.$set(this.shiftRegMainRecord,'buZhaoShu','')
      this.$set(this.shiftRegMainRecord,'other','')
      this.$set(this.shiftRegMainRecord,'spareMoney','')
      this.$set(this.shiftRegMainRecord,'spareMoneyForWork','')
      this.$set(this.shiftRegMainRecord,'mobileMoney','')
      this.$set(this.shiftRegMainRecord,'gongSiErWeiMa','')
      this.$set(this.shiftRegMainRecord,'jiaBi','')
      this.$set(this.shiftRegMainRecord,'kaPeiKuan','')
      this.$set(this.shiftRegMainRecord,'jiChaDuanKuan','')
      this.$set(this.shiftRegMainRecord,'jiChaChangKuan','')
      this.$set(this.shiftRegMainRecord,'moneyBagNumber','')

      // 卡单元
      this.$set(this.shiftRegMainRecord,'shiftPassCardDetailList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftPassCardDetailList',[])

      // 机打发票
      this.totalShiftInvDetailInvCount = 0
      this.$set(this.shiftRegMainRecord,'shiftInvDetailList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftInvDetailList',[])
      this.$set(this.shiftRegMainRecord,'shiftSquadInvalidinvList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadInvalidinvList',[])

      // 定额发票
      this.totalManualInvCount = 0
      this.$set(this.shiftRegMainRecord,'shiftSquadRationInvoiceList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadRationInvoiceList',[])
      this.$set(this.shiftRegMainRecord,'shiftSquadRationInvalidinvList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadRationInvalidinvList',[])

      // 纸券
      this.$set(this.shiftRegMainRecord,'shiftSquadPaperList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftSquadPaperList',[])

      //坏卡
      this.totalShiftCpcPassCardBadCount = 0
      this.$set(this.shiftRegMainRecord,'shiftCpcPassCardBadDetailList',[])
      this.$set(this.shiftRegMainRecord,'oldShiftCpcPassCardBadDetailList',[])

      // 其他属性
      this.shiftRegMainRecord.opTime = ''
      this.$set(this.shiftRegMainRecord,'opTime','')
      this.$set(this.shiftRegMainRecord,'regTime','')
      this.$set(this.shiftRegMainRecord,'regOperatorID','')
      this.$set(this.shiftRegMainRecord,'modifyOperatorID','')


      // 流程相关
      this.$set(this.shiftRegMainRecord,'linkID','')
      this.$set(this.shiftRegMainRecord,'forWorkID','')
      this.$set(this.shiftRegMainRecord,'offWorkID','')
      this.$set(this.shiftRegMainRecord,'taskId','')
      this.$set(this.shiftRegMainRecord,'spare1','')
      this.shiftProcessLink = {}
    },
    initLane(){
      let that = this
      // 初始化
      if (that.laneManageMode != 0) {
        that.laneList = []
      }else{
        that.shiftRegMainRecord.laneNo = "0"
      }
      if (that.shiftRegMainRecord.stationNo == '') {
        return that.laneList
      }
      if (that.shiftRegMainRecord.stationNo && that.laneManageMode != 0) {
        let lane0 = {laneNo : "0"}
        that.laneList.push(lane0)
        let roadNo = this.operator.org.roadNo
        let stationNo = that.shiftRegMainRecord.stationNo
        switch (that.shiftRegMainRecord.userMarkNo) {
          case "":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo){
                that.laneList.push(data)
              }
            })

            if (that.queryParams.laneNo) {
              that.shiftRegMainRecord.laneNo = that.queryParams.laneNo+''
              if (that.queryParams.opType == '1') {
                that.laneNoDisabled = true
              }
            }

            break
          case "1":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo && data.entryExitType == 1){
                that.laneList.push(data)
              }
            })

            if (that.queryParams.laneNo) {
              that.shiftRegMainRecord.laneNo = that.queryParams.laneNo+''
              if (that.queryParams.opType == '1') {
                that.laneNoDisabled = true
              }
            }

            break
          case "2":
            that.allLaneList.forEach(function (data) {
              if(data.roadNo == roadNo && data.stationNo == stationNo && data.entryExitType == 2){
                that.laneList.push(data)
              }
            })

            if (that.queryParams.laneNo) {
              that.shiftRegMainRecord.laneNo = that.queryParams.laneNo+''
              if (that.queryParams.opType == '1') {
                that.laneNoDisabled = true
              }
            }
            break
        }
      }
    },
    userMarkNoChange(){
      this.initModal()
      this.initLane()
      this.$set(this.shiftRegMainRecord,'laneNo','')
    },
    async stationChange(){
      this.initModal()
      this.initLane()
      this.$set(this.shiftRegMainRecord,'laneNo','')

      let that = this
      if(this.shiftRegMainRecord.stationNo){
        api.getCardUnitList(this.shiftRegMainRecord.stationNo).then(res =>{
          if(res.code == 200){
            res.data.forEach(function (data , index) {
              that.cardUnitNoMap[data.cardUnitNo] = data
            })
          }
        })
      }

    },


    //通行费#########################################################################################################
    async showDefaultTXMoney() {
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2 && this.isShowDefaultTXMoney) {
        let txMoneyResp = await api.getTxMoneyOffWork({
          stationNo: this.shiftRegMainRecord.stationNo,
          laneNo: this.shiftRegMainRecord.laneNo,
          squadDateStr:  moment(this.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
          squadNo: this.shiftRegMainRecord.squadNo,
          operatorID: this.shiftRegMainRecord.laneOperatorID
        })

        if(null != txMoneyResp && null != txMoneyResp.data){
          this.$set(this.shiftRegMainRecord,'txMoney',parseFloat((parseInt(txMoneyResp.data.CashMoney).toFixed(2) / 100.0) + "").toFixed(2))
          //this.$set(this.shiftRegMainRecord,'posMoney',parseFloat((parseInt(txMoneyResp.data.PosMoney).toFixed(2) / 100.0) + "").toFixed(2))
          this.checkTotalMoney()
        }
      }
    },

    // 卡单元########################################################################################################
    addCardUnitNoRecord(){
      let canAdd = true
      const that = this
      if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
        that.shiftRegMainRecord.shiftPassCardDetailList.forEach(function (item, index) {
          canAdd = that.checkCardUnitNoTr(index)
          if (!canAdd) {
            return false
          }
        })

        if (!canAdd) {
          return false
        }
      }

      if (canAdd) {
        that.shiftRegMainRecord.shiftPassCardDetailList.push({
          cardUnitNo: "",
          cpcCardCountForWork: "",
          cpcCardCountOffWork: ""
        })
      }
    },
    checkCardUnitNoTr(index){
      const positiveInteger = /^\d*$/

      const cardUnitNo = this.shiftRegMainRecord.shiftPassCardDetailList[index].cardUnitNo
      const cpcCardCountForWork = this.shiftRegMainRecord.shiftPassCardDetailList[index].cpcCardCountForWork
      const cpcCardCountOffWork = this.shiftRegMainRecord.shiftPassCardDetailList[index].cpcCardCountOffWork

      // 1、判断空
      if (!cardUnitNo) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡单元编号不能为空！")
        return false
      }

      if (this.process == 1 && (cpcCardCountForWork == undefined || cpcCardCountForWork == null || cpcCardCountForWork === '')) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡数量不能为空！")
        return false
      } else if (this.process == 2 && (cpcCardCountOffWork == undefined || cpcCardCountOffWork == null || cpcCardCountOffWork === '')) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡数量不能为空！")
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(cardUnitNo) || parseInt(cardUnitNo) < 0 || parseInt(cardUnitNo) > 9999999999) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡单元编号：" + cardUnitNo + " 异常，请输入正确的卡单元编号")
        return false
      }
      if (this.process == 1 && (!positiveInteger.test(cpcCardCountForWork) || parseInt(cpcCardCountForWork) < 0 || parseInt(cpcCardCountForWork) > 9999)) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡数量：" + cpcCardCountForWork + " 异常，请输入正确的卡数量")
        return false
      } else if (this.process == 2 && (!positiveInteger.test(cpcCardCountOffWork) || parseInt(cpcCardCountOffWork) < 0 || parseInt(cpcCardCountOffWork) > 9999)) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，卡数量：" + cpcCardCountForWork + " 异常，请输入正确的卡数量")
        return false
      }

      // 判断卡单元是否存在
      if (null == this.cardUnitNoMap[cardUnitNo]) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行卡单元编号不存在于所选收费站或对应的管理所！")
        return false
      }

      //判断数量有没有超过最大限制
      if (this.process == 1 && this.cardUnitNoMap[cardUnitNo].maxCardCount != -1 && this.cardUnitNoMap[cardUnitNo].maxCardCount < cpcCardCountForWork) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，上班卡数量不能最大值"+this.cardUnitNoMap[cardUnitNo].maxCardCount+"！");
        return false;
      }else  if (this.process == 2 && this.cardUnitNoMap[cardUnitNo].maxCardCount != -1 && this.cardUnitNoMap[cardUnitNo].maxCardCount < cpcCardCountOffWork) {
        this.$notify.error("卡单元列表第" + (index + 1) + "行，下班卡数量不能最大值"+this.cardUnitNoMap[cardUnitNo].maxCardCount+"！");
        return false;
      }


      // 3、判断领用以及交接情况（放到库存那里）
      return true
    },
    removeCardUnitRecord(index){
      this.shiftRegMainRecord.shiftPassCardDetailList.splice(index,1)
    },
    async selectCardUnitNoInList(){
      let that = this
      if (that.shiftRegMainRecord.userMarkNo == ''
        || that.shiftRegMainRecord.stationNo == ''
        || that.shiftRegMainRecord.laneNo == ''
        || that.shiftRegMainRecord.squadDateStr == ''
        || that.shiftRegMainRecord.squadNo == ''
        || that.shiftRegMainRecord.laneOperatorID == '') {
        that.$alert("请填写基础信息后再次点击！")
        return
      }

      if (!that.makeUserMarkNo().flag) {
        return
      }

      if(that.shiftRegMainRecord.shiftPassCardDetailList.length > 0){
        that.$confirm('当前操作将会清空目前所登记数据，重新从流水中关联卡单元信息，是否继续？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(async () => {
          that.shiftRegMainRecord.shiftPassCardDetailList = []
          await that.findCardUnitNoInList()
        })
      }else{
        await that.findCardUnitNoInList()
      }
    },

    async findCardUnitNoInList(){
      let that = this
      let userMarkNo = that.makeUserMarkNo().userMarkNo

      let selectCardUnitNoInListResp = await api.selectInListWater({
        userMarkNo: userMarkNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        operatorID: that.shiftRegMainRecord.laneOperatorID,
        squadDateStr: moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo
      })

      let hasData = false
      if (null != selectCardUnitNoInListResp && selectCardUnitNoInListResp.data.length != 0) {
        for(let data of selectCardUnitNoInListResp.data){
          let tempCardUnitNo = data.cardUnitNo
          let tempCardCount = data.cardCount
          let tempListCardCount = data.listCardCount
          if (parseInt(tempCardCount) == -1) {
            continue
          }

          if (userMarkNo == 1) {
            tempCardCount += tempListCardCount
          } else if (userMarkNo == 3) {
            tempCardCount -= tempListCardCount
            if (tempCardCount < 0) {
              tempCardCount = 0
            }
          }

          let cpcCardCountForWork = ""
          let cpcCardCountOffWork = ""
          if (that.process == 1) {
            cpcCardCountForWork = tempCardCount
          } else if (that.process == 2) {
            cpcCardCountOffWork = tempCardCount
          }

          // 校验是否存在相同的记录
          if (null != that.shiftRegMainRecord.shiftPassCardDetailList && that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
            let isHaveSameValue = false
            for(let data1 of that.shiftRegMainRecord.shiftPassCardDetailList){
              if (tempCardUnitNo == data1.cardUnitNo) {

                if (that.process == 1) {
                  data1.cpcCardCountForWork = tempCardCount
                } else if (that.process == 2) {
                  data1.cpcCardCountOffWork = tempCardCount
                }

                isHaveSameValue = true
                break
              }
            }

            if (isHaveSameValue) {
              continue
            }
          }

          that.shiftRegMainRecord.shiftPassCardDetailList.push({
            cardUnitNo: parseInt(tempCardUnitNo),
            cpcCardCountForWork: cpcCardCountForWork,
            cpcCardCountOffWork: cpcCardCountOffWork
          })
          hasData = true
        }
        if(hasData){
          that.$alert("请检查从流水中获取的卡单元信息！")
        }else{
          that.$alert("流水中无相关卡单元信息！")
        }
      } else {
        that.$alert("流水中无相关卡单元信息！")
      }
    },
    checkCardCount(index){
      let cpcCardCount
      if(this.process == 1){
        cpcCardCount = this.shiftRegMainRecord.shiftPassCardDetailList[index].cpcCardCountForWork
        if(cpcCardCount != undefined && cpcCardCount.length > 4){
          cpcCardCount = cpcCardCount.slice(0,4)
          this.$set(this.shiftRegMainRecord.shiftPassCardDetailList[index],'cpcCardCountForWork',cpcCardCount)
        }
      }else{
        cpcCardCount = this.shiftRegMainRecord.shiftPassCardDetailList[index].cpcCardCountOffWork
        if(cpcCardCount != undefined && cpcCardCount.length > 4){
          cpcCardCount = cpcCardCount.slice(0,4)
          this.$set(this.shiftRegMainRecord.shiftPassCardDetailList[index],'cpcCardCountOffWork',cpcCardCount)
        }
      }
    },


    //坏卡###########################################################################################################
    addBadCardRecord() {
      let canAdd = true
      let that = this
      if (that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.length > 0) {
        that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.forEach(function (data, index) {
          canAdd = that.checkBadCardTr(index)

          if (!canAdd) {
            return false
          }
        })

        if (!canAdd) {
          return
        }
      }

      if (canAdd) {
        that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.push({
          cardUnitNo: "",
          badPassCardNo: "",
          useNo: 3
        })
      }

      that.totalShiftCpcPassCardBadCount = that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.length
    },
    checkBadCardTr(index) {
      const reg = /^[0-9a-zA-Z]+$/

      const badPassCardNo = this.shiftRegMainRecord.shiftCpcPassCardBadDetailList[index].badPassCardNo

      // 1、判断空
      if (null == badPassCardNo || typeof badPassCardNo == "undefined" || badPassCardNo == '') {
        this.$notify.error("坏卡列表第" + (index + 1) + "行，坏卡卡号不能为空！")
        return false
      }

      //2、校验类型
      if(badPassCardNo.length != 16 || badPassCardNo == 0 || badPassCardNo == "0"){
        this.$notify.error("坏卡列表第" + (index + 1) + "行，请输入正确的坏卡卡号！")
        return false
      }

      if (!reg.test(badPassCardNo)) {
        this.$notify.error("坏卡列表第" + (index + 1) + "行，请输入正确的坏卡卡号！")
        return false
      }

      return true
    },
    removeBadCardRecord(index){
      this.shiftRegMainRecord.shiftCpcPassCardBadDetailList.splice(index, 1)
      this.totalShiftCpcPassCardBadCount = this.shiftRegMainRecord.shiftCpcPassCardBadDetailList.length
    },
    changeBadPassCardNo (data, index){
      let badPassCardNo = data.badPassCardNo
      if(badPassCardNo == null || badPassCardNo == undefined || badPassCardNo == "" ){
        return
      }
      badPassCardNo = badPassCardNo.replace(/[^\w\.\/]/ig,'')
      this.$set(this.shiftRegMainRecord.shiftCpcPassCardBadDetailList[index],'badPassCardNo',badPassCardNo)
      if(badPassCardNo.length < 16){
        return
      }
      if(parseInt(this.shiftRegMainRecord.userMarkNo) == 1){
        api.checkPassCardNo(badPassCardNo).then(res => {
          this.$set(this.shiftRegMainRecord.shiftCpcPassCardBadDetailList[index],'cardUnitNo',res.data.cardUnitNo)
        })
      }else {
        this.$set(this.shiftRegMainRecord.shiftCpcPassCardBadDetailList[index],'cardUnitNo',0)
      }

    },

    //机打发票########################################################################################################
    addInvCodeRecord(){
      let canAdd = true
      const that = this
      if (that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
        try {
          that.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
            canAdd = that.checkInvoiceCodeTr(index)
            if (!canAdd) {
              throw ('')
            }
          })
        } catch (e) {
          canAdd = false
        }

        if (!canAdd) {
          return
        }
      }

      if (canAdd) {
        let list = this.shiftRegMainRecord.shiftInvDetailList
        that.shiftRegMainRecord.shiftInvDetailList.push({
          invCode: list.length == 0 ? '' : list[list.length - 1].invCode,
          invStartNo: "",
          invEndNo: "",
          invCount: ""
        })
      }
    },
    checkInvoiceCodeTr(index){
      let positiveInteger = /^\d*$/

      let invCode = this.shiftRegMainRecord.shiftInvDetailList[index].invCode
      let startNo = this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo
      let endNo = this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo

      // 1、判断是否为空
      if (invCode == null || typeof invCode == "undefined" || invCode == '') {
        this.$notify.error('机打发票代码不能为空！')
        return false
      }
      if (startNo == null || typeof startNo == "undefined" || startNo == '') {
        this.$notify.error('机打发票起始号不能为空！')
        return false
      }
      if (endNo == null || typeof  endNo == "undefined" || endNo == '') {
        this.$notify.error('机打发票结束号不能为空！')
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(startNo)) {
        this.$notify.error('请填写正确的机打发票起始号！')
        return false
      }
      if (!positiveInteger.test(endNo)) {
        this.$notify.error('请填写正确的机打发票结束号！')
        return false
      }

      // 3、判断结束号和起始号大小
      if (parseInt(startNo) < 0 || parseInt(startNo) > 999999999) {
        this.$notify.error('机打发票起始号不能大于999999999！')
        return false
      }
      if (parseInt(endNo) < 0 || parseInt(endNo) > 999999999) {
        this.$notify.error('机打发票结束号不能大于999999999！')
        return false
      }
      if (parseInt(startNo) > parseInt(endNo)) {
        this.$notify.error('机打发票起始号不能大于结束号！')
        return false
      }

      // 4、判断交叉
      let canSubmit = true
      let that = this
      try {
       this.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, tTndex) {
          if (index != tTndex) {
            let tempInvCode = data.invCode
            let tempStartNo = parseInt(data.invStartNo)
            let tempEndNo = parseInt(data.invEndNo)
            if (invCode == tempInvCode && parseInt(startNo) <= tempEndNo && tempStartNo <= parseInt(endNo)) {
              canSubmit = false
              throw ('票段有交叉，请检查！')
            }
          }
        })
      } catch (e) {
        this.$notify.error('票段有交叉，请检查！')
      }


      // 5、判断库存（放到保存提交那里）
      return canSubmit
    },
    sumShiftInvDetailInvCount(index){
      if(null != index){
        let invStartNo = this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo
        if(invStartNo != '' && invStartNo.length > 9){
          invStartNo = invStartNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invStartNo',invStartNo)
        }
        let invEndNo = this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo
        if(invEndNo != '' && invEndNo.length > 9){
          invEndNo = invEndNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invEndNo',invEndNo)
        }
        let invCount = 0
        if (invStartNo != '' && invEndNo != ''){
          invCount =  parseInt(invEndNo) - parseInt(invStartNo) + 1
        }

        this.$set(this.shiftRegMainRecord.shiftInvDetailList[index],'invCount',invCount)
      }
      this.totalShiftInvDetailInvCount = api.sumInvCount(this.shiftRegMainRecord.shiftInvDetailList)
    },
    confirmInvCount(index) {
      let invStartNo = this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo
      let invEndNo = this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo
      if (invStartNo != '' && invEndNo != ''
        && parseInt(invStartNo) >= 0 && parseInt(invEndNo) >= parseInt(invStartNo)
        && parseInt(invEndNo) - parseInt(invStartNo) >= 2000) {
        this.$notify.warning("本次登记使用发票超过2000张，请确认是否误填！")
      }
    },
    removeInvCodeRecord(index) {
      // 清除废票
      if (this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo != ''
        && this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo != ''
        && this.shiftRegMainRecord.shiftInvDetailList[index].invCode != '') {
        let invStartNo = parseInt(this.shiftRegMainRecord.shiftInvDetailList[index].invStartNo)
        let invEndNo = parseInt(this.shiftRegMainRecord.shiftInvDetailList[index].invEndNo)
        let invCode = this.shiftRegMainRecord.shiftInvDetailList[index].invCode
        if (this.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
          let i = this.shiftRegMainRecord.shiftSquadInvalidinvList.length
          while (i--) {
            let badInvCode = this.shiftRegMainRecord.shiftSquadInvalidinvList[i].invCode
            let badInvID = parseInt(this.shiftRegMainRecord.shiftSquadInvalidinvList[i].badInvID)
            if (this.shiftRegMainRecord.shiftSquadInvalidinvList[i].invCode != ''
              && this.shiftRegMainRecord.shiftSquadInvalidinvList[i].badInvID != '') {
              if (invCode == badInvCode && badInvID >= invStartNo && badInvID <= invEndNo) {
                this.shiftRegMainRecord.shiftSquadInvalidinvList.splice(i, 1)
              }
            }
          }
        }
      }

      this.shiftRegMainRecord.shiftInvDetailList.splice(index, 1)
      this.sumShiftInvDetailInvCount(null)
    },
    async selectInvCodeInList(){
      let that = this
      if (that.shiftRegMainRecord.userMarkNo == ''
        || that.shiftRegMainRecord.stationNo == ''
        || that.shiftRegMainRecord.laneNo == ''
        || that.shiftRegMainRecord.squadDateStr == ''
        || that.shiftRegMainRecord.squadNo == ''
        || that.shiftRegMainRecord.laneOperatorID == '') {
        that.$alert("请填写基础信息后再次点击！")
        return
      }

      // 下班才进行查询
      if (!that.makeUserMarkNo().flag) {
        return
      }

      if (parseInt(that.makeUserMarkNo().userMarkNo) == 4) {
        if(that.shiftRegMainRecord.shiftInvDetailList.length > 0){
          that.$confirm('当前操作将会清空目前所登记数据，重新从流水中关联机打发票号段，是否继续？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(async () => {
            that.shiftRegMainRecord.shiftInvDetailList = []
            await that.findInvCodeInList()
          })
        }else{
          await that.findInvCodeInList()
        }

      }
    },

    async findInvCodeInList(){
      let that = this
      let selectInvCodeInListResp = await api.selectInvCodeInList({
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        operatorID: that.shiftRegMainRecord.laneOperatorID,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo
      })


      if (null != selectInvCodeInListResp && selectInvCodeInListResp.data.length != 0) {
        for(let data of selectInvCodeInListResp.data){
          let invStartID = parseInt(data.invCodeStart)
          let invEndID = parseInt(data.invCodeEnd)
          if (invStartID > invEndID) {
            that.$alert("从工班日志查出的机打发票票段起始号大于终止号，请手工录入！")
            return false
          }

          // 判断是否存在相同的记录
          /*if (null != that.shiftRegMainRecord.shiftInvDetailList && that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
            let isHaveSameValue = false
            for(let data1 of that.shiftRegMainRecord.shiftInvDetailList){
              if (invStartID == parseInt(data1.invStartNo) && invEndID == parseInt(data1.invEndNo)) {
                isHaveSameValue = true
                break
              }
            }

            if (isHaveSameValue) {
              continue
            }
          }*/

          let tempObj = {
            invCode: "",
            invStartNo: invStartID,
            invEndNo: invEndID
          }

          // 获取发票代码
          let selectInvCodeResp = await api.selectInvCodeByList({
            invStartNo: invStartID,
            invEndNo: invEndID,
            stationNo: that.shiftRegMainRecord.stationNo
          })

          if (null != selectInvCodeResp && selectInvCodeResp.data.flag) {
            tempObj.invCode = selectInvCodeResp.data.invCode
          }

          that.shiftRegMainRecord.shiftInvDetailList.push(tempObj)
          that.sumShiftInvDetailInvCount(that.shiftRegMainRecord.shiftInvDetailList.length - 1)
        }

        that.$alert("请检查从流水中获取的机打发票信息！",'提示',{
          confirmButtonText: "确定",
          callback: action => {
            that.selectBadInvInList(true)
          }
        })

      } else {
        that.$alert("流水中无相关机打发票信息！")
      }
    },


    //机打废票####################################################################################################
    addBadInvCodeRecord() {
      // 判断机打发票段是否存在记录
      if (this.shiftRegMainRecord.shiftInvDetailList.length == 0) {
        this.$notify.warning("请先登记使用的机打发票票段，再登记废票号！")
        return
      }

      // 校验废票
      let canAdd = true
      let that = this
      if (that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
        that.shiftRegMainRecord.shiftSquadInvalidinvList.forEach(function (data, index) {
          canAdd = that.checkBadInvoiceCodeTr(index)
          if (!canAdd) {
            return false
          }
        })

        if (!canAdd) {
          return
        }
      }

      if (canAdd) {
        const list = that.shiftRegMainRecord.shiftSquadInvalidinvList
        that.shiftRegMainRecord.shiftSquadInvalidinvList.push({
          invCode: list.length == 0 ? '' : list[list.length - 1].invCode,
          badInvID: "",
          money: "",
          showMoney:"",
          invCount: 1
        })
      }
    },
    checkBadInvoiceCodeTr(trIndex) {
      const positiveInteger = /^\d*$/

      const invCode = this.shiftRegMainRecord.shiftSquadInvalidinvList[trIndex].invCode
      const invNo = this.shiftRegMainRecord.shiftSquadInvalidinvList[trIndex].badInvID
      const money = this.shiftRegMainRecord.shiftSquadInvalidinvList[trIndex].showMoney

      // 1、判断是否为空
      if (invCode == null || typeof invCode == "undefined" || invCode == '') {
        this.$notify.error('废票机打发票代码不能为空！')
        return false
      }
      if (invNo == null || typeof invNo == "undefined" || invNo == '') {
        this.$notify.error('机打发票废票号不能为空！')
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(invNo)) {
        this.$notify.error('请填写正确的机打发票废票号！')
        return false
      }
      if (parseInt(invNo) < 0 || parseInt(invNo) > 999999999) {
        this.$notify.error('请填写正确的机打发票废票号！')
        return false
      }

      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(money) || money > 99999.99) {
        this.$notify.error('请填写正确的废票金额！')
        return false
      }

      // 3、判断废票号是否重复
      let isHaveSameInvNo = false
      this.shiftRegMainRecord.shiftSquadInvalidinvList.forEach(function (data, index) {
        if (trIndex != index) {
          const tempInvCode = data.invCode
          const tempInvNo = parseInt(data.badInvID)
          if (invCode == tempInvCode && parseInt(invNo) == tempInvNo) {
            isHaveSameInvNo = true
            return false
          }
        }
      })
      if (isHaveSameInvNo) {
        this.$notify.error("存在重复的机打发票废票号：" + invNo + " ！")
        return false
      }

      // 4、判断是否在发票段内
      let isInInvSection = false

      this.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
        const tempInvCode = data.invCode
        const tempStartNo = parseInt(data.invStartNo)
        const tempEndNo = parseInt(data.invEndNo)
        if (invCode == tempInvCode && parseInt(invNo) <= tempEndNo && tempStartNo <= parseInt(invNo)) {
          isInInvSection = true
          return false
        }
      })

      if (!isInInvSection) {
        this.$notify.error("机打发票代码：" + invCode + " 机打发票废票号：" + invNo + " 未在登记机打发票段范围内！")
        return false
      }

      return true
    },
    removeBadInvCodeRecord(index) {
      this.shiftRegMainRecord.shiftSquadInvalidinvList.splice(index, 1)
    },
    checkBadInvID(index){
      let badInvID = this.shiftRegMainRecord.shiftSquadInvalidinvList[index].badInvID
      if(badInvID != undefined && badInvID.length > 9){
        badInvID = badInvID.slice(0, 9)
        this.$set(this.shiftRegMainRecord.shiftSquadInvalidinvList[index],'badInvID',badInvID)
      }
    },

    async selectBadInvInList(isClick){
      let that = this
      if (null == that.shiftRegMainRecord.shiftInvDetailList || that.shiftRegMainRecord.shiftInvDetailList.length == 0) {
        that.$alert("请先填写机打发票信息！")
        return
      }

      if (that.shiftRegMainRecord.userMarkNo == ''
        || that.shiftRegMainRecord.stationNo == ''
        || that.shiftRegMainRecord.laneNo == ''
        || that.shiftRegMainRecord.squadDateStr == ''
        || that.shiftRegMainRecord.squadNo == ''
        || that.shiftRegMainRecord.laneOperatorID == '') {
        that.$alert("请填写基础信息后再次点击！")
        return
      }

      // 下班才进行查询
      if (!that.makeUserMarkNo().flag) {
        return
      }

      if (parseInt(that.makeUserMarkNo().userMarkNo) == 4) {
        if(that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0 && isClick){
          that.$confirm('当前操作将会清空目前所登记数据，重新从流水中关联机打废票号，是否继续？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(async () => {
            that.shiftRegMainRecord.shiftSquadInvalidinvList = []
            await that.findBadInvInList()
          })
        }else{
          that.shiftRegMainRecord.shiftSquadInvalidinvList = []
          await that.findBadInvInList()
        }
      }
    },

    async findBadInvInList(){
      let that = this
      let selectBadInvInListResp = await api.selectBadInvInList({
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        operatorID: that.shiftRegMainRecord.laneOperatorID,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo
      })

      if (null != selectBadInvInListResp && selectBadInvInListResp.data.length != 0) {
        for(let data of selectBadInvInListResp.data){
          let badInvID = parseInt(data.badInvID)
          let money = parseFloat(data.money / 100.0)

          // 判断是否存在相同的记录
          if (null != that.shiftRegMainRecord.shiftSquadInvalidinvList && that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
            let isHaveSameValue = false
            for(let data1 of that.shiftRegMainRecord.shiftSquadInvalidinvList){
              if (badInvID == parseInt(data1.badInvID)) {
                isHaveSameValue = true
                return false
              }
            }

            if (isHaveSameValue) {
              return
            }
          }

          let tempObj = {
            invCode: "",
            badInvID: badInvID,
            invCount: 1,
            money: money,
            showMoney: money
          }

          that.shiftRegMainRecord.shiftSquadInvalidinvList.push(tempObj)
        }

        that.$alert("请检查从流水中获取的废票信息！")
      } else {
        that.$alert("流水中无相关废票信息！")
      }
    },

    //定额发票####################################################################################################
    addManualInvRecord() {
      let canAdd = true
      let that = this
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
        that.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
          canAdd = that.checkManualInvoiceCodeTr(index)
          if (!canAdd) {
            return false
          }
        })

        if (!canAdd) {
          return
        }
      }

      if (canAdd) {
        that.shiftRegMainRecord.shiftSquadRationInvoiceList.push({
          invRationMoneySelectShow: false,
          invRationMoneyInputShow: false,
          invType: "",
          invRationMoneySelect: "",
          invRationMoneyInput: "",
          invStartNo: "",
          invEndNo: "",
          invCount: 0
        })
      }
    },
    checkManualInvoiceCodeTr(trIndex) {
      const positiveInteger = /^\d*$/

      const invType = this.shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invType
      const invRationMoneySelect = this.shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invRationMoneySelect
      const invRationMoneyInput = this.shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invRationMoneyInput
      const startNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invStartNo
      const endNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invEndNo

      // 1、判断空
      if (invType == null || typeof invType == "undefined" || invType == '') {
        this.$notify.error("定额发票类型不能为空！")
        return false
      }
      if (parseInt(invType) == 1) { // 大额定额发票
        if (invRationMoneySelect == null || typeof  invRationMoneySelect == 'undefined' || invRationMoneySelect == '') {
          this.$notify.error("定额发票面额不能为空！")
          return false
        }
      } else if (parseInt(invType) == 2) { // 其他
        if (invRationMoneyInput == null || typeof invRationMoneyInput == 'undefined' || invRationMoneyInput == '') {
          this.$notify.error("定额发票面额不能为空！")
          return false
        }
      }
      if (startNo == null || typeof startNo == "undefined" || startNo == '') {
        this.$notify.error("定额发票起始号不能为空！")
        return false
      }
      if (endNo == null || typeof  endNo == "undefined" || endNo == '') {
        this.$notify.error("定额发票结束号不能为空！")
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(startNo)) {
        this.$notify.error("请填写正确的定额发票起始号！")
        return false
      }
      if (!positiveInteger.test(endNo)) {
        this.$notify.error("请填写正确的定额发票结束号！")
        return false
      }
      if (parseInt(invType) == 2) { // 其他
        if (!positiveInteger.test(invRationMoneyInput) || parseInt(invRationMoneyInput) < 1 || parseInt(invRationMoneyInput) > 10) {
          this.$notify.error("请输入正确的定额发票面额！")
          return false
        }
      }


      // 3、结束号是否大于起始号
      if (parseInt(startNo) < 0 || parseInt(startNo) > 999999999) {
        this.$notify.error("定额发票起始号不能大于999999999！")
        return false
      }
      if (parseInt(endNo) < 0 || parseInt(endNo) > 999999999) {
        this.$notify.error("定额发票结束号不能大于999999999！")
        return false
      }
      if (parseInt(startNo) > parseInt(endNo)) {
        this.$notify.error("定额发票起始号不能大于结束号！")
        return false
      }

      // 4、票段交叉
      let canSubmit = true
      this.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
        if (trIndex != index) {
          const tempInvType = data.invType
          const tempInvRationMoneySelect = data.invRationMoneySelect
          const tempInvRationMoneyInput = data.invRationMoneyInput
          const tempStartNo = parseInt(data.invStartNo)
          const tempEndNo = parseInt(data.invEndNo)
          if (invType == tempInvType) {
            if (parseInt(tempInvType) == 1) { // 大额定额发票
              if (invRationMoneySelect == tempInvRationMoneySelect
                && parseInt(startNo) <= tempEndNo
                && parseInt(endNo) >= tempStartNo) {
                this.$notify.error("输入定额发票票段有交叉，请检查！")
                canSubmit = false
                return false
              }
            } else if (parseInt(tempInvType) == 2) { // 其他
              if (invRationMoneyInput == tempInvRationMoneyInput
                && parseInt(startNo) <= tempEndNo
                && parseInt(endNo) >= tempStartNo) {
                this.$notify.error("输入定额发票票段有交叉，请检查！")
                canSubmit = false
                return false
              }
            }
          }
        }
      })
      // 5、判断库存（放到保存提交那里）
      return canSubmit
    },

    changeManualInvType(index) {
      const invType = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invType

      if (invType != '') {
        if (parseInt(invType) == 1) {
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneySelectShow',true)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneyInputShow',false)
        } else if (parseInt(invType) == 2) {
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneySelectShow',false)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneyInputShow',true)
        }
      } else {
        this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneySelectShow',false)
        this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invRationMoneyInputShow',false)
      }
    },

    sumManualInvCount(index){
      if(null != index){
        let invStartNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invStartNo
        if(invStartNo != '' && invStartNo.length > 9){
          invStartNo = invStartNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invStartNo',invStartNo)
        }
        let invEndNo = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invEndNo
        if(invEndNo != '' && invEndNo.length > 9){
          invEndNo = invEndNo.slice(0, 9)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invEndNo',invEndNo)
        }
        let invCount = 0
        if (invStartNo != '' && invEndNo != ''){
          invCount =  parseInt(invEndNo) - parseInt(invStartNo) + 1
        }

        this.$set(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index],'invCount',invCount)
      }
      this.totalManualInvCount = api.sumInvCount(this.shiftRegMainRecord.shiftSquadRationInvoiceList)
    },

    removeManualInvRecord(index) {
      // 清除废票
      let needDelete = false
      if (this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invStartNo != ''
        && this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invEndNo != ''
        && this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invType != '') {
        if (parseInt(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invType) == 1
          && this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invRationMoneySelect != '') { // 大额定额发票
          needDelete = true
        } else if (parseInt(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invType) == 2
          && this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invRationMoneyInput != '') { // 其他
          needDelete = true
        }
      }

      if (needDelete) {
        let invStartNo = parseInt(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invStartNo)
        let invEndNo = parseInt(this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invEndNo)
        let invType = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invType
        let invRationMoneySelect = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invRationMoneySelect
        let invRationMoneyInput = this.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invRationMoneyInput

        if (this.shiftRegMainRecord.shiftSquadRationInvalidinvList.length > 0) {
          let i = this.shiftRegMainRecord.shiftSquadRationInvalidinvList.length
          while (i--) {
            const badInvType = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[i].invType
            const badInvRationMoneySelect = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[i].invRationMoneySelect
            const badInvRationMoneyInput = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[i].invRationMoneyInput
            const badInvID = parseInt(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[i].badInvID)
            if (badInvType == invType) {
              if (parseInt(invType) == 1) { // 大额定额发票
                if (badInvRationMoneySelect == invRationMoneySelect && badInvID >= invStartNo && badInvID <= invEndNo) {
                  this.shiftRegMainRecord.shiftSquadRationInvalidinvList.splice(i, 1)
                }
              } else if (parseInt(invType) == 2) { // 其他
                if (badInvRationMoneyInput == invRationMoneyInput && badInvID >= invStartNo && badInvID <= invEndNo) {
                  this.shiftRegMainRecord.shiftSquadRationInvalidinvList.splice(i, 1)
                }
              }
            }
          }
        }
      }

      this.shiftRegMainRecord.shiftSquadRationInvoiceList.splice(index, 1)
      this.sumManualInvCount(null)

    },

    //废票########################################################################################################
    addBadManualInvRecord(){
      let that = this
      // 判断正常的定额发票是否存在记录
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length == 0) {
        that.$notify.warning("请先登记使用的定额发票票段，再登记废票号！")
        return
      }

      // 校验废票
      let canAdd = true
      if (that.shiftRegMainRecord.shiftSquadRationInvalidinvList.length > 0) {
        that.shiftRegMainRecord.shiftSquadRationInvalidinvList.forEach(function (data, index) {
          canAdd = that.checkBadManualInvoiceCodeTr(index)
          if (!canAdd) {
            return false
          }
        })

        if (!canAdd) {
          return false
        }
      }

      if (canAdd) {
        that.shiftRegMainRecord.shiftSquadRationInvalidinvList.push({
          badInvRationMoneySelectShow: false,
          badInvRationMoneyInputShow: false,
          invType: "",
          invRationMoneySelect: "",
          invRationMoneyInput: "",
          badInvID: "",
          invCount: 1
        })
      }
    },

    checkBadManualInvoiceCodeTr(trIndex){
      const positiveInteger = /^\d*$/

      const invType = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[trIndex].invType
      const invRationMoneySelect = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[trIndex].invRationMoneySelect
      const invRationMoneyInput = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[trIndex].invRationMoneyInput
      const invNo = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[trIndex].badInvID

      // 1、判断空
      if (null == invType || typeof invType == 'undefined' || invType == '') {
        this.$notify.error("定额发票类型不能为空！")
        return false
      }
      if (parseInt(invType) == 1) { // 大额定额发票
        if (null == invRationMoneySelect || typeof invRationMoneySelect == 'undefined' || invRationMoneySelect == '') {
          this.$notify.error("定额发票面额不能为空！")
          return false
        }
      } else if (parseInt(invType == 2)) { // 其他
        if (null == invRationMoneyInput || typeof invRationMoneyInput == 'undefined' || invRationMoneyInput == '') {
          this.$notify.error("定额发票面额不能为空！")
          return false
        }
      }
      if (null == invNo || typeof invNo == 'undefined' || invNo == '') {
        this.$notify.error("定额发票废票号不能为空！")
        return false
      }

      // 2、判断类型
      if (parseInt(invType == 2)) { // 其他
        if (!positiveInteger.test(invRationMoneyInput) || parseInt(invRationMoneyInput) < 1 || parseInt(invRationMoneyInput) > 10) {
          this.$notify.error("请填写正确的定额发票面额！")
          return false
        }
      }
      if (!positiveInteger.test(invNo)) {
        this.$notify.error("请填写正确的定额发票废票号！")
        return false
      }
      if (parseInt(invNo) < 0 || parseInt(invNo) > 999999999) {
        this.$notify.error("请填写正确的定额发票废票号！")
        return false
      }

      // 3、判断废票号是否重复
      let isHaveSameInvNo = false
      this.shiftRegMainRecord.shiftSquadRationInvalidinvList.forEach(function (data, index) {
        if (trIndex != index) {
          const tempInvType = data.invType
          const tempInvRationMoneyInput = data.invRationMoneyInput
          const tempInvRationMoneySelect = data.invRationMoneySelect
          const tempInvNo = parseInt(data.badInvID)
          if (invType == tempInvType && parseInt(invType) == 1) {
            if (invRationMoneySelect == tempInvRationMoneySelect && parseInt(invNo) == tempInvNo) {
              isHaveSameInvNo = true
              return false
            }
          } else if (invType == tempInvType && parseInt(invType) == 2) {
            if (invRationMoneyInput == tempInvRationMoneyInput && parseInt(invNo) == tempInvNo) {
              isHaveSameInvNo = true
              return false
            }
          }
        }
      })
      if (isHaveSameInvNo) {
        this.$notify.error("存在重复的定额发票废票号：" + invNo + " ！")
        return false
      }

      // 4、判断废票号是否在发票段内
      let isInInvSection = false
      this.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
        const tempInvType = data.invType
        const tempInvRationMoneyInput = data.invRationMoneyInput
        const tempInvRationMoneySelect = data.invRationMoneySelect
        const tempInvStartNo = parseInt(data.invStartNo)
        const tempInvEndNo = parseInt(data.invEndNo)

        if (invType == tempInvType && parseInt(invType) == 1) {
          if (invRationMoneySelect == tempInvRationMoneySelect && parseInt(invNo) >= tempInvStartNo && parseInt(invNo) <= tempInvEndNo) {
            isInInvSection = true
            return false
          }
        } else if (invType == tempInvType && parseInt(invType) == 2) {
          if (invRationMoneyInput == tempInvRationMoneyInput && parseInt(invNo) >= tempInvStartNo && parseInt(invNo) <= tempInvEndNo) {
            isInInvSection = true
            return false
          }
        }
      })
      if (!isInInvSection) {
        this.$notify.error("定额发票：" + invNo + "（" + (parseInt(invType) == 1 ? invRationMoneySelect : invRationMoneyInput) + "元）未在登记发票段范围内！")
        return false
      }

      // 校验库存放到保存那里
      return true
    },

    removeBadManualInvRecord(index){
      this.shiftRegMainRecord.shiftSquadRationInvalidinvList.splice(index, 1)
    },
    checkRationBadInvId(index){
      let badInvID = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index].badInvID
      if(badInvID != undefined && badInvID.length > 9){
        badInvID = badInvID.slice(0, 9)
        this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvID',badInvID)
      }
    },

    changeBadManualInvType(index){
      let invType = this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index].invType

      if (invType != '') {
        if (parseInt(invType) == 1) {
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneySelectShow',true)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneyInputShow',false)
        } else if (parseInt(invType) == 2) {
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneySelectShow',false)
          this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneyInputShow',true)
        }
      } else {
        this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneySelectShow',false)
        this.$set(this.shiftRegMainRecord.shiftSquadRationInvalidinvList[index],'badInvRationMoneyInputShow',false)
      }
    },


    //纸券########################################################################################################
    addPaperRecord(){
      let canAdd = true
      let that = this
      if (that.shiftRegMainRecord.shiftSquadPaperList.length > 0) {
        that.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
          canAdd = that.checkPaperCodeTr(index)
        })

        if (!canAdd) {
          return
        }
      }

      if (canAdd) {
        that.shiftRegMainRecord.shiftSquadPaperList.push({
          paperStart: "",
          paperEnd: "",
          paperCount: 0
        })
      }
    },

    checkPaperCodeTr(trIndex){
      const positiveInteger = /^\d*$/
      const userMarkNo = this.shiftRegMainRecord.userMarkNo
      const paperStart = this.shiftRegMainRecord.shiftSquadPaperList[trIndex].paperStart
      const paperEnd = this.shiftRegMainRecord.shiftSquadPaperList[trIndex].paperEnd

      if (parseInt(userMarkNo) == 1) { // 入口
        if (null == paperStart || typeof paperStart == "undefined" || paperStart == '') {
          this.$notify.error("纸券起始号不能为空！")
          return false
        }
        if (null == paperEnd || typeof paperEnd == "undefined" || paperEnd == '') {
          this.$notify.error("纸券结束号不能为空！")
          return false
        }

        // 2、校验类型
        if (!positiveInteger.test(paperStart)) {
          this.$notify.error("请输入正确的纸券起始号！")
          return false
        }
        if (parseInt(paperStart) < 0 || parseInt(paperStart) > 999999999999999) {
          this.$notify.error("请输入正确的纸券起始号！")
          return false
        }
        if (!positiveInteger.test(paperEnd)) {
          this.$notify.error("请输入正确的纸券结束号！")
          return false
        }
        if (parseInt(paperEnd) < 0 || parseInt(paperEnd) > 999999999999999) {
          this.$notify.error("请输入正确的纸券结束号！")
          return false
        }
        if (parseInt(paperStart) > parseInt(paperEnd)) {
          this.$notify.error("起始纸券号不能大于终止纸券号！")
          return false
        }

        // 3、校验交叉
        let canAdd = true
        this.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
          if (trIndex != index) {
            let tempPaperStart = parseInt(data.paperStart)
            let tempPaperEnd = parseInt(data.paperEnd)
            if (parseInt(paperStart) <= tempPaperEnd
              && parseInt(paperEnd) >= tempPaperStart) {
              canAdd = false
              return false
            }
          }
        })
        if (!canAdd) {
          this.$notify.error("输入纸券号有交叉，请检查！")
          return false
        }
      } else {
        return true
      }

      return true
    },

    sumPaperCount(index){
      let paperStart = this.shiftRegMainRecord.shiftSquadPaperList[index].paperStart
      let paperEnd = this.shiftRegMainRecord.shiftSquadPaperList[index].paperEnd
      let paperCount = 0
      if (paperStart != '' && paperEnd != ''){
        paperCount =  parseInt(paperEnd) - parseInt(paperStart) + 1
      }

      this.$set(this.shiftRegMainRecord.shiftSquadPaperList[index],'paperCount',paperCount)
    },

    removePaperRecord(index){
      this.shiftRegMainRecord.shiftSquadPaperList.splice(index, 1)
    },

    //金额########################################################################################################
    checkTotalMoney () {
      this.$set(this.shiftRegMainRecord,'totalMoney',0.00)
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) { // 出口
        if (this.shiftRegMainRecord.txMoney) {
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.txMoney)
        }
        if (this.shiftRegMainRecord.posMoney) {
          this.shiftRegMainRecord.totalMoney += parseFloat(this.shiftRegMainRecord.posMoney)
        }

        if (this.shiftRegMainRecord.totalMoney != 0 && this.shiftRegMainRecord.totalMoney > 9999999999.99) {
          this.shiftHandInMoney.totalMoneyModal = 0.00
          this.shiftHandInMoney.txMoney = ''
          this.shiftHandInMoney.posMoney = ''
        }
      }
    },

    //保存##########################################################################################################
    async save_1(buttonType){
      let that = this

      that.buttonType = buttonType
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          this.saveLoading = true
          // 判断操作类型
          if (!that.makeOperationType().flag) {
            this.loading = false
            this.saveLoading = false
            return
          }
          that.operationType = that.makeOperationType().operationType
          // 基础校验（jquery.validate、下班必填项、港币兑换）
          if (!that.lastBaseCheck()) {
            this.loading = false
            this.saveLoading = false
            return
          }
          // 各个table基础校验（卡单元、发票、定额发票、纸券）
          if (!that.lastCheckTableTr()) {
            this.loading = false
            this.saveLoading = false
            return
          }

          //工班结算校验
          let settleDataResp = await api.checkShiftSettleStock({
            stationNo: this.shiftRegMainRecord.stationNo,
            laneNo: this.shiftRegMainRecord.laneNo,
            squadDateStr: moment(this.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
            squadNo: this.shiftRegMainRecord.squadNo,
            laneOperatorNo: this.shiftRegMainRecord.laneOperatorID
          })

          if(null == settleDataResp){
            this.$notify.error("检查工班结算状态异常，请检查!")
            this.loading = false
            this.saveLoading = false
            return
          }

          if(!settleDataResp.data){
            this.$notify.error("工班已结算，不能进行交班登记!")
            this.loading = false
            this.saveLoading = false
            return
          }

          // 上班校验是否全部信息为空
          if (!that.lastCheckForWorkAllNull(that.buttonType)) {
            this.loading = false
            this.saveLoading = false
            return
          }
          // 1、上班有卡，下班不能没有卡；2、上班没卡，下班不允许有卡；
          if (! await that.lastCheckForOffWorkCard(that.buttonType)) {
            this.loading = false
            this.saveLoading = false
            return
          }

          // 卡单元校验
          this.shiftRegMainRecord.transferShiftpasscarddetailList = []
          this.shiftRegMainRecord.transferMsgs = []
          if (! await that.lastCheckPassCardTable()) {
            let errorMsg = "<span>"
            that.shiftRegMainRecord.transferMsgs.forEach(function (data, index) {
              errorMsg += data
              errorMsg += "<br/>"
            })
            errorMsg += "</span>"
            that.$notify({
              title: '提示',
              dangerouslyUseHTMLString: true,
              message: errorMsg,
              type: 'error',
              position: 'top-right',
              duration: 3000
            })
            that.loading = false
            that.saveLoading = false
            return
          }

          if (that.shiftRegMainRecord.transferShiftpasscarddetailList.length > 0) {
            that.$refs.passCardTransferDialog.init()
            that.loading = false
            that.saveLoading = false
            return
          }

          that.save_2()

        }
      })

    },
    transferAll(){
      this.save_2()
    },
    transferSubmit(){
      let that = this
      // 先交接交接部分的卡单元
      if (that.shiftRegMainRecord.transferShiftpasscarddetailList.length > 0) {
        for(let data of that.shiftRegMainRecord.transferShiftpasscarddetailList){
          if (parseInt(data.isTransfer) == 0) {
            // 去除不交接的卡单元再去提交
            let cardUnitNo = data.cardUnitNo
            if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
              let i = that.shiftRegMainRecord.shiftPassCardDetailList.length
              while (i--) {
                let tempCardUnitNo = parseInt(that.shiftRegMainRecord.shiftPassCardDetailList[i].cardUnitNo);
                if (cardUnitNo == tempCardUnitNo) {
                  that.shiftRegMainRecord.shiftPassCardDetailList.splice(i, 1)
                }
              }
            }
          }
        }
      }

      if (that.shiftRegMainRecord.shiftPassCardDetailList.length == 0 && that.process == 2 && !that.lastCheckOffWorkRequiredValue()) {
        that.$alert("请至少填写一项信息！")
        return
      }

      that.save_2()
    },

    async save_2(){
      // 发票库存
      this.shiftRegMainRecord.invoiceCodeStockCheckList = []
      if (!await this.lastCheckInvoiceCodeTable()) {
        this.loading = false
        this.saveLoading = false
        return
      }
      // 定额发票库存
      this.shiftRegMainRecord.manualStockCheckList = []
      if (! await this.lastCheckManualTable()) {
        this.loading = false
        this.saveLoading = false
        return
      }
      // 纸券库存
      if(parseInt(this.shiftRegMainRecord.userMarkNo) == 1){//入口
        this.shiftRegMainRecord.paperCodeStockCheckList = []
        if (! await this.lastCheckPaperCodeTable()) {
          this.loading = false
          this.saveLoading = false
          return
        }
      }else if(parseInt(this.shiftRegMainRecord.userMarkNo) == 2 && this.process == 2){//出口下班
        let positiveInteger = /^\d*$/
        let paperCount = this.shiftRegMainRecord.paperCount
        if (null != paperCount && typeof paperCount != "undefined" && paperCount != '') {
          // 2、校验类型
          if (!positiveInteger.test(paperCount)) {
            this.$notify.error("请输入正确的纸券数量！")
            this.loading = false
            this.saveLoading = false
            return false
          }
          if (parseInt(paperCount) <= 0 || parseInt(paperCount) > 999999999999999) {
            this.$notify.error("请输入正确的纸券数量！")
            this.loading = false
            this.saveLoading = false
            return false
          }
          this.shiftRegMainRecord.shiftSquadPaperList = []
          this.shiftRegMainRecord.shiftSquadPaperList.push({
            paperStart: 1,
            paperEnd: paperCount,
            paperCount: paperCount
          })
        }
      }
      this.save_3()
    },

    async save_3(){
      // 校验登记时间
      if (!await this.lastCheckRegTime()) {
        this.loading = false
        this.saveLoading = false
        return
      }
      // 校验同一条车道是否多人上班
      if (!await this.lastCheckSameLaneShiftReg()) {
        this.loading = false
        this.saveLoading = false
        return
      }

      // 如果是下班的就校验对应的卡单元有没有上缴
      if (!await this.lastCheckCardUnitNoOffWorkReg()) {
        this.loading = false
        this.saveLoading = false
        return
      }

      this.save_4()
    },

    async save_4(){
      let that = this
      // 校验操作时间，查看是否已经被删除
      if (that.operationType == 2 && ! await that.lastCheckOpTime()) {
        that.loading = false
        that.saveLoading = false
        return
      }

      // 发票、定额发票、纸券数量回写
      that.makeInvCount()

      // 废票金额转换
      that.makeBadInvMoney()

      if(that.shiftRegMainRecord.shiftSquadPaperList.length == 0){
        that.save_5()
        return
      }

      api.findPaperCount({
        userMarkNo: that.makeUserMarkNo().userMarkNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo,
        operatorID: that.shiftRegMainRecord.laneOperatorID
      }).then(res => {
        let paperCount = res.data
        if(paperCount > 0){
          const msg = "收费员：" + that.operatorMap[that.shiftRegMainRecord.laneOperatorID] + "，工班日期："+
            moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD')+"，工班："+$("input[name=squadNoText]").val()+"，已登记的纸券数量为"+paperCount+"，确认继续登记？"
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.save_5()
          }).catch(() => {
            that.loading = false
            that.saveLoading = false
          })
        }else{
          that.save_5()
        }
      })

    },

    async save_5(){
      // 登记类型转换
      let that = this
      if (!that.makeUserMarkNo().flag) {
        that.loading = false
        that.saveLoading = false
        return
      }
      that.shiftRegMainRecord.realUserMarkNo = that.makeUserMarkNo().userMarkNo

      // 设置保存类型：（1）保存按钮：1/3-草稿；（2）提交、提交并新增：2/4-提交；
      if (!that.makeStatus(that.buttonType).flag) {
        that.loading = false
        that.saveLoading = false
        return
      }
      that.status = that.makeStatus(that.buttonType).status

      let totallMoneyText =this.$options.filters.numFilter(that.shiftRegMainRecord.totalMoney)

      let saveShiftRegMainRecord = {
        userMarkNo: that.shiftRegMainRecord.userMarkNo,
        realUserMarkNo: that.shiftRegMainRecord.realUserMarkNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneNo: that.shiftRegMainRecord.laneNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: that.shiftRegMainRecord.squadNo,
        laneOperatorID: that.shiftRegMainRecord.laneOperatorID,
        laneOperatorName: that.operatorMap[that.shiftRegMainRecord.laneOperatorID],

        totalMoney: that.accMul(totallMoneyText,100),
        txMoney: that.accMul(that.shiftRegMainRecord.txMoney,100),
        posMoney: that.accMul(that.shiftRegMainRecord.posMoney,100),
        gongBenFei:that.accMul(that.shiftRegMainRecord.gongBenFei,100),
        buZhaoShu: that.accMul(that.shiftRegMainRecord.buZhaoShu,100),
        kaPeiKuan: that.accMul(that.shiftRegMainRecord.kaPeiKuan,100),
        jiaBi:that.accMul(that.shiftRegMainRecord.jiaBi,100),
        gangBi: that.accMul(that.shiftRegMainRecord.gangBi,100),
        jiChaDuanKuan: that.accMul(that.shiftRegMainRecord.jiChaDuanKuan,100),
        jiChaChangKuan: that.accMul(that.shiftRegMainRecord.jiChaChangKuan,100),
        other: that.accMul(that.shiftRegMainRecord.other,100),
        spareMoney: that.accMul(that.shiftRegMainRecord.spareMoney,100),
        spareMoneyForWork:that.accMul(that.shiftRegMainRecord.spareMoneyForWork,100),
        mobileMoney: that.accMul(that.shiftRegMainRecord.mobileMoney,100),
        moneyBagNumber:that.shiftRegMainRecord.moneyBagNumber,
        gongSiErWeiMa: that.accMul(that.shiftRegMainRecord.gongSiErWeiMa,100),
        blankInvCount:that.shiftRegMainRecord.blankInvCount == null ? 0 : that.shiftRegMainRecord.blankInvCount,
        retakeInvCount:that.shiftRegMainRecord.retakeInvCount == null ? 0 : that.shiftRegMainRecord.retakeInvCount,
        returnCardCnt:that.shiftRegMainRecord.returnCardCnt == null ? 0 : that.shiftRegMainRecord.returnCardCnt,

        // 新的
        shiftPassCardDetailList: that.shiftRegMainRecord.shiftPassCardDetailList,
        shiftInvDetailList: that.shiftRegMainRecord.shiftInvDetailList,
        shiftSquadInvalidInvList: that.shiftRegMainRecord.shiftSquadInvalidinvList,
        shiftSquadPaperList: that.shiftRegMainRecord.shiftSquadPaperList,
        shiftSquadRationInvoiceList: that.shiftRegMainRecord.shiftSquadRationInvoiceList,
        shiftSquadRationInvalidInvList: that.shiftRegMainRecord.shiftSquadRationInvalidinvList,
        shiftCpcPassCardBadDetailList: that.shiftRegMainRecord.shiftCpcPassCardBadDetailList,

        // 旧的
        oldShiftPassCardDetailList: that.shiftRegMainRecord.oldShiftPassCardDetailList,
        oldShiftInvDetailList: that.shiftRegMainRecord.oldShiftInvDetailList,
        oldShiftSquadInvalidInvList: that.shiftRegMainRecord.oldShiftSquadInvalidinvList,
        oldShiftSquadPaperList: that.shiftRegMainRecord.oldShiftSquadPaperList,
        oldShiftSquadRationInvoiceList: that.shiftRegMainRecord.oldShiftSquadRationInvoiceList,
        oldShiftSquadRationInvalidInvList: that.shiftRegMainRecord.oldShiftSquadRationInvalidinvList,
        oldShiftCpcPassCardBadDetailList: that.shiftRegMainRecord.oldShiftCpcPassCardBadDetailList,

        // 流程相关
        linkID: that.shiftRegMainRecord.linkID,
        forWorkID: that.shiftRegMainRecord.forWorkID,
        offWorkID: that.shiftRegMainRecord.offWorkID,
        taskId: that.shiftRegMainRecord.taskId,

        process: that.process,
        operationType: that.operationType,
        status: that.status,
        spare1: that.shiftRegMainRecord.spare1
      }



      let saveShiftReg = await api.saveShiftReg(saveShiftRegMainRecord)

      switch (parseInt(that.buttonType)) {
        case 2:
          that.$alert("提交交班登记成功！",'提示',{
            confirmButtonText: "确定",
            callback: action => {
              if (that.process == 2) {
                that.close()
              } else {
                // 操作日志重新渲染
                that.shiftProcessLink = saveShiftReg.data.shiftProcessLink
                that.$set(that.shiftProcessLink,'id',saveShiftReg.data.shiftProcessLink.id)
                that.$set(that.shiftRegMainRecord,'linkID',saveShiftReg.data.shiftProcessLink.id)
                that.$set(that.shiftRegMainRecord,'forWorkID',saveShiftReg.data.shiftProcessLink.forWorkID)
                that.$set(that.shiftRegMainRecord,'spareMoney',that.shiftRegMainRecord.spareMoneyForWork)
                that.$set(that.shiftRegMainRecord,'regTime',saveShiftReg.data.shiftProcessLink.regTime)
                that.process = 2
                that.status = 3
                that.getData()
                that.loading = false
                that.saveLoading = false
                that.showDefaultTXMoney()

                that.shiftRegMainRecord.shiftPassCardDetailList = []
                that.workStatus = 1;
              }
            }
          })

          break
        case 4:
          that.$alert("保存交班登记成功！",'提示',{
            confirmButtonText: "确定",
            callback: action => {
              that.close()
            }
          })
          break
        default:
          break
      }
    },

    makeStatus(buttonType) {
      const data = {
        status: -1
      }
      if (buttonType == 4) {
        data.status = this.process == 1 ? 1 : 3
      } else if (buttonType == 2 || buttonType == 3) {
        data.status = this.process == 1 ? 2 : 4
      } else {
        data.status = (this.status == 3 || this.status == 2) ? 1 : 3
      }

      if (data.status == -1) {
        this.$notify.error("获取业务状态失败，请检查！")
        data.flag = false
      }

      data.flag = true
      return data
    },

    //save_1校验方法################################################################################################
    // 获取操作类型
    makeOperationType () {
      let result = {
        operationType: -1,
        flag: false
      }
      if ((this.process == 1 && this.shiftRegMainRecord.forWorkID)
        || (this.process == 2 && this.shiftRegMainRecord.offWorkID)) {
        result.operationType = 2
      } else {
        result.operationType = 1
      }

      result.flag = true
      return result
    },

    lastBaseCheck(){
      // 下班登记至少登记一项信息
      if (this.process == 2 && !this.lastCheckOffWorkRequiredValue()) {
        this.$notify.error("请至少填写一项信息！")
        return false
      }

      // 校验港币兑换
      if (!this.lastCheckHKMoney()) {
        this.$notify.error("换算成人民币的【港币】不应该大于【现金总额】")
        return false
      }

      return true
    },

    lastCheckOffWorkRequiredValue(){
      // 金额
      let moneyBoolean = true
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 1) { // 入口
        if (!this.shiftRegMainRecord.returnCardCnt) {
          moneyBoolean = false
        }
      } else if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) { // 出口
        if ((!this.shiftRegMainRecord.txMoney)
          && (!this.shiftRegMainRecord.posMoney)
          && (!this.shiftRegMainRecord.gongBenFei)
          && (!this.shiftRegMainRecord.buZhaoShu)
          && (!this.shiftRegMainRecord.other)
          && (!this.shiftRegMainRecord.gangBi)
          && (!this.shiftRegMainRecord.jiaBi)
          && (!this.shiftRegMainRecord.kaPeiKuan)
          && (!this.shiftRegMainRecord.jiChaDuanKuanModal)
          && (!this.shiftRegMainRecord.jiChaChangKuanModal)
          && (!this.shiftRegMainRecord.gongSiErWeiMa)
          && (!this.shiftRegMainRecord.paperCount)
          && (!this.shiftRegMainRecord.blankInvCount)
          && (!this.shiftRegMainRecord.retakeInvCount)
          && (!this.shiftRegMainRecord.returnCardCnt)){
          if (this.isHaveSpareMoney) { // 只有备用金
            if (!this.shiftRegMainRecord.spareMoney) {
              moneyBoolean = false;
            }
          }
        }
      }

      // 卡单元
      let cardUnitNoBoolean = true
      if (this.shiftRegMainRecord.shiftPassCardDetailList.length == 0) {
        cardUnitNoBoolean = false
      }

      // 发票
      let invCodeBoolean = true
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2
        && this.shiftRegMainRecord.shiftInvDetailList.length == 0
        && this.shiftRegMainRecord.shiftSquadInvalidinvList.length == 0) {
        invCodeBoolean = false
      }

      // 定额发票
      let manualInvBoolean = true
      if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2
        && this.shiftRegMainRecord.shiftSquadRationInvoiceList.length == 0
        && this.shiftRegMainRecord.shiftSquadRationInvalidinvList.length == 0) {
        manualInvBoolean = false
      }

      // 纸券
      let paperBoolean = true
      if (this.shiftRegMainRecord.shiftSquadPaperList.length == 0) {
        paperBoolean = false
      }

      //坏卡
      let badCardBoolean = true
      if(this.shiftRegMainRecord.shiftCpcPassCardBadDetailList.length == 0){
        badCardBoolean = false
      }

      return parseInt(this.shiftRegMainRecord.userMarkNo) == 1 ?
        moneyBoolean | cardUnitNoBoolean | paperBoolean | badCardBoolean :
        moneyBoolean | cardUnitNoBoolean | invCodeBoolean | manualInvBoolean | paperBoolean | badCardBoolean
    },
    lastCheckHKMoney(){
      if (this.shiftRegMainRecord.gangBi) {
        const gangbi = parseFloat(this.shiftRegMainRecord.gangBi)
        const totalMoney = parseFloat(this.shiftRegMainRecord.totalMoney) * this.hkMoneyExchangeRate / 100.0
        if (gangbi > totalMoney) {
          return false
        }
      }

      return true
    },

    lastCheckTableTr(){
      let checkFlag = true
      let that = this

      // 卡单元
      if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
        // 卡单元重复校验
        let repeatObj = {}
        let msg = ''
        that.shiftRegMainRecord.shiftPassCardDetailList.forEach(function (data, index) {
          if (null != repeatObj[data.cardUnitNo]) {
            msg += "第" + (repeatObj[data.cardUnitNo] + 1) + "行"
              + "与第" + (index + 1) + "行卡单元记录重复，"
              + "卡单元编号为：" + data.cardUnitNo + " ，请检查！<br/>"

          } else {
            repeatObj[data.cardUnitNo] = index
          }
        })
        if (msg != '') {
          that.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: '卡单元列表：<br/>' + msg,
            type: 'error',
            position: 'top-right',
            duration: 3000
          })
          return false
        }

        let index = 0
        for(let data of that.shiftRegMainRecord.shiftPassCardDetailList){
          checkFlag = that.checkCardUnitNoTr(index)

          if (!checkFlag) {
            return false
          }

          index++
        }

        if (!checkFlag) {
          return false
        }
      }

      // 发票
      if (that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
        try {
          that.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
            checkFlag = that.checkInvoiceCodeTr(index)

            if (!checkFlag) {
             throw('')
            }
          })
        } catch (e) {
          checkFlag = false
        }


        if (!checkFlag) {
          return false
        }
      }
      if (that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
        that.shiftRegMainRecord.shiftSquadInvalidinvList.forEach(function (data, index) {
          checkFlag = that.checkBadInvoiceCodeTr(index)

          if (!checkFlag) {
            return false
          }
        })

        if (!checkFlag) {
          return false
        }
      }
      // 定额发票
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
        that.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
          checkFlag = that.checkManualInvoiceCodeTr(index)

          if (!checkFlag) {
            return false
          }
        })

        if (!checkFlag) {
          return false
        }
      }
      if (that.shiftRegMainRecord.shiftSquadRationInvalidinvList.length > 0) {
        that.shiftRegMainRecord.shiftSquadRationInvalidinvList.forEach(function (data, index) {
          checkFlag = that.checkBadManualInvoiceCodeTr(index)

          if (!checkFlag) {
            return false
          }
        })

        if (!checkFlag) {
          return false
        }
      }
      // 纸券
      if (that.shiftRegMainRecord.shiftSquadPaperList.length > 0) {
        that.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
          checkFlag = that.checkPaperCodeTr(index)
          if (!checkFlag) {
            return false
          }
        })
        if (!checkFlag) {
          return false
        }
      }
      //坏卡
      if (that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.length > 0) {
        // 坏卡重复校验
        let repeatObj = {}
        let msg = ''
        that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.forEach(function (data, index) {
          if (null != repeatObj[data.badPassCardNo]) {
            msg += "第" + (repeatObj[data.badPassCardNo] + 1) + "行"
              + "与第" + (index + 1) + "行坏卡记录重复，"
              + "卡号为：" + data.badPassCardNo + " ，请检查！<br/>"
          } else {
            repeatObj[data.badPassCardNo] = index
          }
        })
        if (msg != '') {
          that.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: '坏卡列表：<br/>' + msg,
            type: 'error',
            position: 'top-right',
            duration: 3000
          })
          return false
        }

        that.shiftRegMainRecord.shiftCpcPassCardBadDetailList.forEach(function (data, index) {
          checkFlag = that.checkBadCardTr(index)

          if (!checkFlag) {
            return false
          }
        })

        if (!checkFlag) {
          return false
        }
      }

      return true
    },

    lastCheckForWorkAllNull(buttonType){
      if (this.process == 1) {
        let moneyBoolean = true
        if (this.isHaveSpareMoney && !this.shiftRegMainRecord.spareMoneyForWork) {
          moneyBoolean = false
        }
        if (!this.isHaveSpareMoneyForWork) {
          moneyBoolean = false
        }

        let cardUnitNoBoolean = true
        if (this.shiftRegMainRecord.shiftPassCardDetailList.length == 0) {
          cardUnitNoBoolean = false
        }

        let that = this

        let resultFlag = moneyBoolean | cardUnitNoBoolean
        if (!resultFlag) {
          this.$confirm('确认上班登记内容为空直接进行下班登记？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.save_2()
          })

          return resultFlag
        }
      }
      return true
    },
    // 上下班卡单元规则校验
    async lastCheckForOffWorkCard(buttonType){
      let that = this
      if (that.process == 2) {
        let lastCheckForOffWorkCardResp = await api.lastCheckForOffWorkCard({
          linkID: that.shiftRegMainRecord.linkID,
          shiftPassCardDetailList: that.shiftRegMainRecord.shiftPassCardDetailList
        })

        if (null == lastCheckForOffWorkCardResp || null == lastCheckForOffWorkCardResp.data.flag) {
          this.$notify.error("校验下班卡单元异常，请检查！")
          return false
        }

        if (!lastCheckForOffWorkCardResp.data.flag) {
          that.$notify.error(lastCheckForOffWorkCardResp.data.msg)
          return false
        }

      }

      return true
    },

    async lastCheckPassCardTable(){
      let flagArray = []
      let that = this
      if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
        var oldCardMap = {};
        if (that.shiftRegMainRecord.oldShiftPassCardDetailList.length > 0) {
          for(let data of that.shiftRegMainRecord.oldShiftPassCardDetailList){
            oldCardMap[data.cardUnitNo] = data.cpcCardCount;
          }
        }

        for(let data of that.shiftRegMainRecord.shiftPassCardDetailList){
          // 旧的就不校验了
          if (null != oldCardMap[data.cardUnitNo]) {
            delete oldCardMap[data.cardUnitNo]
            continue
          }

          if (!that.makeUserMarkNo().flag) {
            flagArray.push(false)
            return false
          }
          let userMarkNo = that.makeUserMarkNo().userMarkNo

          let cpcCardCount = -1
          if (that.process == 1) {
            cpcCardCount = data.cpcCardCountForWork
          } else if (that.process == 2) {
            cpcCardCount = data.cpcCardCountOffWork
          }
          if (parseInt(cpcCardCount) == -1) {
            that.$notify.error("卡数量异常！")
            flagArray.push(false)
            return false
          }

          // 后台校验
          let checkCardResp = await api.checkCard({
            userMarkNo: userMarkNo,
            stationNo: that.shiftRegMainRecord.stationNo,
            laneOperatorID: that.shiftRegMainRecord.laneOperatorID,
            laneNo: that.shiftRegMainRecord.laneNo,
            squadNo: that.shiftRegMainRecord.squadNo,
            squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
            operationType: that.operationType,
            cardBoxOpType: that.cardBoxOpType,
            cardUnitNo: data.cardUnitNo,
            cpcCardCount: cpcCardCount,
            shiftPassCardDetailList: that.shiftRegMainRecord.oldShiftPassCardDetailList,
            regTimeStr:  moment(that.shiftRegMainRecord.regTime).format('YYYY-MM-DD HH:mm:ss.SSS')
          })

          if (null == checkCardResp.data || null == checkCardResp.data.flag) {
            that.$notify.error("卡单元校验异常")
            flagArray.push(false)
            return false
          }
          if (!checkCardResp.data.flag) {
            if (!checkCardResp.data.confirm) {
              that.shiftRegMainRecord.transferMsgs.push(checkCardResp.data.msg)
              flagArray.push(false)
            } else {
              that.shiftRegMainRecord.transferShiftpasscarddetailList.push({
                cardUnitNo: data.cardUnitNo,
                cpcCardCount: cpcCardCount
              })
              flagArray.push(true)
            }
          } else {
            flagArray.push(true)
          }
        }

        if (flagArray.length > 0) {
          let resultFlag = true
          flagArray.forEach(function (data) {
            resultFlag &= data
          })

          if (resultFlag) {
            // 回退后修改再提交，校验被修改的卡单元
            if (JSON.stringify(oldCardMap) != "{}") {
              let checkModifyCardUnit = true;
              for (let unitNo in oldCardMap) {
                checkModifyCardUnit = await that.lastCheckPassCardTableDelete({
                  cardUnitNo: unitNo,
                  linkID: that.shiftRegMainRecord.linkID
                });
                if (!checkModifyCardUnit) {
                  return false;
                }
              }
              if (!checkModifyCardUnit) {
                return false;
              }
            }

            return true;
          }

          return resultFlag
        }
      }

      return true
    },
    async lastCheckPassCardTableDelete(data){
      let that = this
      if (!that.makeUserMarkNo().flag) {
        return false
      }
      let userMarkNo = that.makeUserMarkNo().userMarkNo

      let cpcCardCount = -1
      if (that.process == 1) {
        cpcCardCount = data.cpcCardCountForWork
      } else if (that.process == 2) {
        cpcCardCount = data.cpcCardCountOffWork
      }
      if (parseInt(cpcCardCount) == -1) {
        that.$notify.error("卡数量异常！")
        return false
      }

      let checkCardResp = await api.checkCard({
        userMarkNo: userMarkNo,
        stationNo: that.shiftRegMainRecord.stationNo,
        laneOperatorID: that.shiftRegMainRecord.laneOperatorID,
        laneNo: that.shiftRegMainRecord.laneNo,
        squadNo: that.shiftRegMainRecord.squadNo,
        squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        operationType: that.operationType,
        cardBoxOpType: 0,
        cardUnitNo: data.cardUnitNo,
        cpcCardCount: cpcCardCount,
        shiftPassCardDetailList: that.shiftRegMainRecord.oldShiftPassCardDetailList,
        regTimeStr:  moment(that.shiftRegMainRecord.regTime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        linkID: data.linkID
      })

      if (null == checkCardResp.data || null == checkCardResp.data.flag) {
        that.$notify.error("卡单元校验异常")
        return false
      }

      if (!checkCardResp.data.flag) {
        that.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: checkCardResp.data.msg,
          type: 'error',
          position: 'top-right',
          duration: 3000
        })
        return false
      }

      return true
    },
    makeUserMarkNo() {
      let result = {}
      let userMarkNo = -1
      if (this.process == 1) { // 上班
        if (parseInt(this.shiftRegMainRecord.userMarkNo) == 1) {
          userMarkNo = 1
        } else if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) {
          userMarkNo = 3
        }
      } else if (this.process == 2) { // 下班
        if (parseInt(this.shiftRegMainRecord.userMarkNo) == 1) {
          userMarkNo = 2
        } else if (parseInt(this.shiftRegMainRecord.userMarkNo) == 2) {
          userMarkNo = 4
        }
      }
      if (userMarkNo == -1) {
        this.$notify.error("登记类型转换异常，请检查！")
        result.flag = false
        return result
      }

      result.flag = true
      result.userMarkNo = userMarkNo
      return result
    },

    //save_2校验方法##################################################################################################
    //机打发票保存校验
    async lastCheckInvoiceCodeTable(){
      let canAdd = true
      let message = ''
      let inv_chk = []
      let that = this
      if (that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
        for(let data of that.shiftRegMainRecord.shiftInvDetailList){
          inv_chk = []
          let szInvCode = data.invCode
          let tStartNo = parseInt(data.invStartNo)
          let tEndNo = parseInt(data.invEndNo)

          if (that.operationType == 2 && that.shiftRegMainRecord.oldShiftInvDetailList.length > 0) { // 修改的逻辑
            for(let oldData of that.shiftRegMainRecord.oldShiftInvDetailList){
              if (parseInt(szInvCode) != parseInt(oldData.invCode)) {
                continue
              }

              if (parseInt(tStartNo) < parseInt(oldData.invStartNo)) {
                let iEndNo_in = parseInt(oldData.invStartNo) - 1 < parseInt(tEndNo) ? parseInt(oldData.invStartNo) - 1 : parseInt(tEndNo)
                inv_chk.push({
                  invCode: szInvCode,
                  invStartNo: tStartNo,
                  invEndNo: iEndNo_in
                })
              }

              tStartNo = parseInt(oldData.invEndNo) + 1 > tStartNo ? parseInt(oldData.invEndNo) + 1 : tStartNo
              if (parseInt(tEndNo) < parseInt(tStartNo)) {
                break
              }
            }
          }

          if (tEndNo >= tStartNo) {
            inv_chk.push({
              invCode: szInvCode,
              invStartNo: tStartNo,
              invEndNo: tEndNo
            })
          }

          if (inv_chk.length > 0) {
            for(let newData of inv_chk){
              let szInvCode_chk = newData.invCode
              let iStartNo_chk = parseInt(newData.invStartNo)
              let iEndNo_chk = parseInt(newData.invEndNo)

              let checkInvCodeStockResp = await api.checkInvCodeStock({
                invCode: szInvCode_chk,
                invStartNo: iStartNo_chk,
                invEndNo: iEndNo_chk,
                stationNo: that.shiftRegMainRecord.stationNo
              })
              if (null == checkInvCodeStockResp || checkInvCodeStockResp.code != 200) {
                message = "检查机打发票库存异常，请检查!"
                canAdd = false
                return false
              }

              if (checkInvCodeStockResp.data.length > 0) {
                let iStartNo_old
                let iEndNo_old
                let iTagNo_old
                checkInvCodeStockResp.data.forEach(function (data1, index1) {
                  let iTagNo_part = data1.tagNo
                  let iStartNo_part = parseInt(data1.invStartNo)
                  let iEndNo_part = parseInt(data1.invEndNo)
                  if (index1 != 0 && iTagNo_old != iTagNo_part) {
                    let msg = "机打发票代码：" + szInvCode_chk
                      + "机打发票" + tStartNo + "~" + tEndNo
                      + "中的" + iStartNo_old + "~" + iEndNo_old
                      + "与" + iStartNo_part + "~" + iEndNo_part
                      + "在库存中的状态不一致，必须分开登记！"
                    message = msg
                    canAdd = false
                    return false
                  }

                  let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                  let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                  if (iStartNo_chk < iStartNo_in) {
                    that.shiftRegMainRecord.invoiceCodeStockCheckList.push({
                      invCode: szInvCode_chk,
                      invStartNo: tStartNo,
                      invEndNo: tEndNo,
                      notInInvStartNo: iStartNo_chk,
                      notInInvEndNo: iStartNo_in - 1,
                      stationNo: that.shiftRegMainRecord.stationNo,
                      stationName: that.stationMap[that.shiftRegMainRecord.stationNo]
                    })
                    canAdd = false
                  }

                  iStartNo_chk = iEndNo_in + 1
                  if (iStartNo_chk > iEndNo_chk) {
                    return false
                  }
                  iStartNo_old = iStartNo_part
                  iEndNo_old = iEndNo_part
                  iTagNo_old = iTagNo_part
                })
              }

              if (iStartNo_chk <= iEndNo_chk) {
                that.shiftRegMainRecord.invoiceCodeStockCheckList.push({
                  invCode: szInvCode_chk,
                  invStartNo: tStartNo,
                  invEndNo: tEndNo,
                  notInInvStartNo: iStartNo_chk,
                  notInInvEndNo: iEndNo_chk,
                  stationNo: that.shiftRegMainRecord.stationNo,
                  stationName: that.stationMap[that.shiftRegMainRecord.stationNo]
                })
                canAdd = false
              }
            }
          }
        }

        if (!canAdd && message != '') {
          that.$notify.error(message)
          return false
        } else if (!canAdd && message == '') {
          that.$refs.invoiceCodeStockDialog.init()
          return false
        }
      }

      return true
    },

    //定额发票保存校验
    async lastCheckManualTable(){
      let that = this
      let canAdd = true
      let message = ''
      let inv_chk = []
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
        for(let data of that.shiftRegMainRecord.shiftSquadRationInvoiceList){
          inv_chk = []
          let invType_rem = data.invType
          let iInvStart_rem = parseInt(data.invStartNo)
          let iInvEnd_rem = parseInt(data.invEndNo)
          let manualInvMoney = parseInt(data.invType) == 1 ? data.invRationMoneySelect : data.invRationMoneyInput // 用来显示错误信息的
          if (that.operationType == 2 && that.shiftRegMainRecord.oldShiftSquadRationInvoiceList.length > 0) {
            for(let oldData of that.shiftRegMainRecord.oldShiftSquadRationInvoiceList){
              if (manualInvMoney != parseInt(oldData.invRationMoney)) {
                continue
              }

              if (iInvStart_rem < parseInt(oldData.invStartNo)) {
                let iInvEnd_in = parseInt(oldData.invStartNo) - 1 < iInvEnd_rem ? parseInt(oldData.invStartNo) - 1 : iInvEnd_rem
                inv_chk.push({
                  invType: invType_rem,
                  invStartNo: iInvStart_rem,
                  invEndNo: iInvEnd_in,
                  invRationMoney: manualInvMoney
                })
              }

              iInvStart_rem = parseInt(oldData.invEndNo) + 1 > iInvStart_rem ? parseInt(oldData.invEndNo) + 1 : iInvStart_rem
              if (iInvEnd_rem < iInvStart_rem) {
                break
              }
            }
          }

          if (iInvEnd_rem >= iInvStart_rem) {
            inv_chk.push({
              invType: invType_rem,
              invStartNo: iInvStart_rem,
              invEndNo: iInvEnd_rem,
              invRationMoney: manualInvMoney
            })
          }

          if (inv_chk.length > 0) {
            for(let newData of inv_chk){
              let invType_chk = newData.invType
              let iStartNo_chk = parseInt(newData.invStartNo)
              let iEndNo_chk = parseInt(newData.invEndNo)
              let manualMoney_chk = parseInt(newData.invType) == 1 ? newData.invRationMoney : 0 // 其他在库存表里面的钱为0，因为一开始领用的时候不知道是多少钱

              let checkManualInvStockResp = await api.checkManualInvStock({
                stationNo: that.shiftRegMainRecord.stationNo,
                invType: invType_chk,
                invStartNo: iStartNo_chk,
                invEndNo: iEndNo_chk,
                invMoney: manualMoney_chk
              })

              if (null == checkManualInvStockResp || checkManualInvStockResp.code != 200) {
                message = "检查定额发票库存异常，请检查!"
                canAdd = false
                break
              }

              if (checkManualInvStockResp.data.length > 0) {
                let iStartNo_old
                let iEndNo_old
                let iTagNo_old

                checkManualInvStockResp.data.forEach(function (data1, index1) {
                  let iTagNo_part = data1.tagNo
                  let iStartNo_part = parseInt(data1.invStartNo)
                  let iEndNo_part = parseInt(data1.invEndNo)
                  if (index1 != 0 && iTagNo_old != iTagNo_part) {
                    let msg = "定额发票（" + manualInvMoney + "元）" + iInvStart_rem + "~" + iInvEnd_rem
                      + " 中的 " + iStartNo_old + "~" + iEndNo_old
                      + "与" + iStartNo_part + "~" + iEndNo_part + "在库存中的状态不一致，必须分开登记！"
                    message = msg
                    canAdd = false
                    return false
                  }
                  let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                  let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                  if (iStartNo_chk < iStartNo_in) {
                    that.shiftRegMainRecord.manualStockCheckList.push({
                      stationNo: that.shiftRegMainRecord.stationNo,
                      stationName: that.stationMap[that.shiftRegMainRecord.stationNo],
                      invType: invType_chk,
                      invRationMoney: manualInvMoney,
                      invStartNo: iInvStart_rem,
                      invEndNo: iInvEnd_rem,
                      notInInvStartNo: iStartNo_chk,
                      notInInvEndNo: iStartNo_in - 1
                    })
                    canAdd = false
                  }

                  iStartNo_chk = iEndNo_in + 1
                  if (iStartNo_chk > iEndNo_chk) {
                    return false
                  }
                  iStartNo_old = iStartNo_part
                  iEndNo_old = iEndNo_part
                  iTagNo_old = iTagNo_part
                })
              }
              if (iStartNo_chk <= iEndNo_chk) {
                that.shiftRegMainRecord.manualStockCheckList.push({
                  stationNo: that.shiftRegMainRecord.stationNo,
                  stationName: that.stationMap[that.shiftRegMainRecord.stationNo],
                  invType: invType_chk,
                  invRationMoney: manualInvMoney,
                  invStartNo: iInvStart_rem,
                  invEndNo: iInvEnd_rem,
                  notInInvStartNo: iStartNo_chk,
                  notInInvEndNo: iEndNo_chk
                })
                canAdd = false
              }
            }
          }
        }
        if (!canAdd && message != '') {
          that.$notify.error(message)
          return false
        } else if (!canAdd && message == '') {
          that.$refs.manualStockDialog.init()
          return false
        }
      }

      return true
    },

    //纸券保存校验
    async lastCheckPaperCodeTable(){
      let that = this
      if (that.process == 2 && parseInt(that.shiftRegMainRecord.userMarkNo) == 1) {
        let canAdd = true
        let message = ''
        let paper_chk = []
        if (that.shiftRegMainRecord.shiftSquadPaperList.length > 0) {
          for(let data of that.shiftRegMainRecord.shiftSquadPaperList){
            paper_chk = []
            let iPaperStart_rem = parseInt(data.paperStart)
            let iPaperEnd_rem = parseInt(data.paperEnd)

            if (that.operationType == 2 && that.shiftRegMainRecord.oldShiftSquadPaperList.length > 0) {
              for(let oldData of that.shiftRegMainRecord.oldShiftSquadPaperList){
                if (parseInt(iPaperStart_rem) < parseInt(oldData.paperStart)) {
                  let iPaperEnd_in = parseInt(oldData.paperStart) - 1 < parseInt(iPaperEnd_rem) ? parseInt(oldData.paperStart) - 1 : parseInt(iPaperEnd_rem)
                  paper_chk.push({
                    paperStart: iPaperStart_rem,
                    paperEnd: iPaperEnd_in
                  })
                }

                iPaperStart_rem = parseInt(oldData.paperEnd) + 1 > parseInt(iPaperStart_rem) ? parseInt(oldData.paperEnd) + 1 : iPaperStart_rem
                if (parseInt(iPaperEnd_rem) < parseInt(iPaperStart_rem)) {
                  break
                }
              }
            }

            if (iPaperEnd_rem >= iPaperStart_rem) {
              paper_chk.push({
                paperStart: iPaperStart_rem,
                paperEnd: iPaperEnd_rem
              })
            }

            if (paper_chk.length > 0) {
              for(let newData of paper_chk){
                let iStartNo_chk = parseInt(newData.paperStart)
                let iEndNo_chk = parseInt(newData.paperEnd)

                let checkPaperStockResp = await api.checkPaperStock({
                  stationNo: that.shiftRegMainRecord.stationNo,
                  paperStartNo: iStartNo_chk,
                  paperEndNo: iEndNo_chk
                })
                if (null == checkPaperStockResp || checkPaperStockResp.code != 200) {
                  message = "校验纸券库存异常，请检查！"
                  canAdd = false
                  that.$notify.error(message)
                  return false
                }

                if (checkPaperStockResp.data.length > 0) {
                  let iStartNo_old
                  let iEndNo_old
                  let iTagNo_old
                  checkPaperStockResp.data.forEach(function (data1, index1) {
                    let iStartNo_part = parseInt(data1.paperStart)
                    let iEndNo_part = parseInt(data1.paperEnd)
                    let iTagNo_part = parseInt(data1.tagNo)

                    if (index1 != 0 && iTagNo_old != iTagNo_part) {
                      let msg = "纸券" + iPaperStart_rem + "~" + iPaperEnd_rem + "中的"
                        + iStartNo_old + "~" + iEndNo_old + "与"
                        + iStartNo_part + "~" + iEndNo_part + "在库存中的状态不一致，必须分开登记！"
                      message = msg
                      canAdd = false
                      return false
                    }

                    let iStartNo_in = iStartNo_chk > iStartNo_part ? iStartNo_chk : iStartNo_part
                    let iEndNo_in = iEndNo_chk < iEndNo_part ? iEndNo_chk : iEndNo_part
                    if (iStartNo_chk < iStartNo_in) {
                      that.shiftRegMainRecord.paperCodeStockCheckList.push({
                        stationNo: that.shiftRegMainRecord.stationNo,
                        stationName: that.stationMap[that.shiftRegMainRecord.stationNo],
                        paperStart: iPaperStart_rem,
                        paperEnd: iPaperEnd_rem,
                        notInPaperStart: iStartNo_chk,
                        notInPaperEnd: iStartNo_in - 1
                      })
                      canAdd = false
                    }

                    iStartNo_chk = iEndNo_in + 1
                    if (iStartNo_chk > iEndNo_chk) {
                      return false
                    }
                    iStartNo_old = iStartNo_part
                    iEndNo_old = iEndNo_part
                    iTagNo_old = iTagNo_part
                    index1 ++
                  })
                }

                if (iStartNo_chk <= iEndNo_chk) {
                  that.shiftRegMainRecord.paperCodeStockCheckList.push({
                    stationNo: that.shiftRegMainRecord.stationNo,
                    stationName: that.stationMap[that.shiftRegMainRecord.stationNo],
                    paperStart: iPaperStart_rem,
                    paperEnd: iPaperEnd_rem,
                    notInPaperStart: iStartNo_chk,
                    notInPaperEnd: iEndNo_chk
                  })
                  canAdd = false
                }
              }
            }
          }

          if (!canAdd && message != '') {
            that.$notify.error(message)
            return false
          } else if (!canAdd && message == '') {
            that.$refs.paperCodeStockDialog.init()
            return false
          }
        }
      }

      return true

    },

    //save_3校验方法
    // 校验登记时间
    async lastCheckRegTime(){
      // 校验登记时间，不能提前下班，且最多只能提前一天做上班登记
      let checkRegSubmitTimeResp = await api.checkRegSubmitTime()
      if (null == checkRegSubmitTimeResp || checkRegSubmitTimeResp.code != 200 || null == checkRegSubmitTimeResp.data) {
        this.$notify.error("校验登记时间异常，请检查！")
        return false
      }

      let dbSquadDate = moment(moment(checkRegSubmitTimeResp.data.squaddate)).valueOf()
      let dbAfter = moment(moment(checkRegSubmitTimeResp.data.squaddate)).valueOf() + 24 * 60 * 60 * 1000
      let squadDate = moment(moment(this.shiftRegMainRecord.squadDateStr)).valueOf()
      let squadNo = this.shiftRegMainRecord.squadNo
      let dbSquadNo = checkRegSubmitTimeResp.data.SquadNo

      // 登记类型转换
      if (!this.makeUserMarkNo().flag) {
        return false
      }
      let userMarkNo = this.makeUserMarkNo().userMarkNo

      if (userMarkNo == 2 || userMarkNo == 4) {
        if (dbSquadDate < squadDate || (dbSquadDate == squadDate && dbSquadNo <= squadNo)) {
          this.$notify.error("目前未到该工班日期的下班登记时间！")
          return false
        }
      }

      return true
    },

    //// 校验同一条车道是否多人上班
    async lastCheckSameLaneShiftReg(){
      let that = this
      // 登记类型转换
      if (!that.makeUserMarkNo().flag) {
        return false
      }
      let userMarkNo = that.makeUserMarkNo().userMarkNo

      // 如果使用车道模式就要校验一条车道是否有多个操作员上班
      if (that.laneManageMode != 0
        && parseInt(that.shiftRegMainRecord.laneNo) != 0
        && (userMarkNo == 1 || userMarkNo == 3)) {
        let checkLaneRegRsp = await api.checkSameLaneShiftReg({
          stationNo: that.shiftRegMainRecord.stationNo,
          laneNo: that.shiftRegMainRecord.laneNo,
          squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
          squadNo: that.shiftRegMainRecord.squadNo

        })
        if (null == checkLaneRegRsp) {
          that.$notify.error("校验车道上班情况异常，请检查！")
          return false
        }

        if (null != checkLaneRegRsp.data) {
          let dbUserMarkNo = checkLaneRegRsp.data.userMarkNo
          let dbSquadDate = moment(checkLaneRegRsp.data.squadDate).format("YYYY-MM-DD")
          let dbSquadNo = checkLaneRegRsp.data.squadNo
          let dbLaneOperatorID = checkLaneRegRsp.data.laneOperatorID
          let dbLaneOperatorName = checkLaneRegRsp.data.laneOperatorName
          if ((dbUserMarkNo == 1 || dbUserMarkNo == 3) && checkLaneRegRsp.data.id != that.shiftRegMainRecord.forWorkID) {
            let msg = "操作员：[" + dbLaneOperatorID + "] " + dbLaneOperatorName + "<br/>"
              + "工班：" + dbSquadDate + " " + dbSquadNo + "号工班<br/>"
              + "已经在 " + that.shiftRegMainRecord.laneNo + "号车道上班！<br/>"+ "一条车道不能同时有多人上班。"
            that.$notify({
              title: '提示',
              dangerouslyUseHTMLString: true,
              message: msg,
              type: 'error',
              position: 'top-right',
              duration: 0
            })
            return false
          }
        }
      }

      return true
    },

    // 如果是下班的就校验对应的卡单元有没有上缴
    async lastCheckCardUnitNoOffWorkReg(){
      let that = this
      // 登记类型转换
      if (!that.makeUserMarkNo().flag) {
        return false
      }
      let userMarkNo = that.makeUserMarkNo().userMarkNo

      // 下班登记时查找未进行下班登记的卡单元
      if (userMarkNo == 2 || userMarkNo == 4) {
        // 1、-------------------------------------------
        // 校验有上班没下班，无法过滤回退的情况
        let checkNotHandInCardUnitResp = await api.checkNotHandInCardUnit({
          stationNo: that.shiftRegMainRecord.stationNo,
          laneNo: that.shiftRegMainRecord.laneNo,
          squadDateStr:  moment(that.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
          squadNo: that.shiftRegMainRecord.squadNo,
          laneOperatorID: that.shiftRegMainRecord.laneOperatorID,
          userMarkNo: userMarkNo
        })
        if (null == checkNotHandInCardUnitResp || checkNotHandInCardUnitResp.code != 200) {
          that.$notify.error("查询未进行下班登记的卡单元异常，请检查！")
          return false
        }
        if (checkNotHandInCardUnitResp.data.length > 0) {
          let notHandInCardUnit = []
          checkNotHandInCardUnitResp.data.forEach(function (data, index) {
            let cardUnitNo = data.cardUnitNo
            notHandInCardUnit.push({
              cardUnitNo: cardUnitNo,
              cardUnitCnt: 1
            })
          })

          // 把旧的卡单元放进去
          if (that.operationType == 2) {
            that.shiftRegMainRecord.oldShiftPassCardDetailList.forEach(function (data, index) {
              notHandInCardUnit.push({
                cardUnitNo: data.cardUnitNo,
                cardUnitCnt: 1
              })
            })
          }

          // 将页面上卡单元在未下班卡单元列表删除，修改的时候上面会添加旧的那个部分
          if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
            that.shiftRegMainRecord.shiftPassCardDetailList.forEach(function (data, index) {
              for (let i = 0; i < notHandInCardUnit.length; i++) {
                if (parseInt(notHandInCardUnit[i].cardUnitNo) == parseInt(data.cardUnitNo)) {
                  notHandInCardUnit.splice(i--, 1)
                }
              }
            })
          }

          if (notHandInCardUnit.length > 0) {
            let cardUnitNoStr = ""
            notHandInCardUnit.forEach(function (data, index) {
              cardUnitNoStr += data.cardUnitNo + ","
            })
            cardUnitNoStr = cardUnitNoStr.substring(0, cardUnitNoStr.length - 1)
            let msg = "卡单元：" + cardUnitNoStr + "已被"
              + "[" + that.shiftRegMainRecord.laneOperatorID + "]" + that.operatorMap[that.shiftRegMainRecord.laneOperatorID]
              + "进行了上班登记，但未进行下班登记，是否继续?"
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.save_4()
            })
            return false
          }
        }

        // 2、-------------------------------------------
        // 处理回退，有记录，但是页面删除的情况
        let selectForWorkPassCardsResp = await api.selectForWorkPassCards({
          linkID: that.shiftRegMainRecord.linkID
        })
        if (null == selectForWorkPassCardsResp || selectForWorkPassCardsResp.code != 200) {
          that.$notify.error("查询未进行下班登记的卡单元异常，请检查！")
          return false
        }
        if (selectForWorkPassCardsResp.data.length > 0) {
          let notHandInCardUnit = []
          selectForWorkPassCardsResp.data.forEach(function (data) {
            let cardUnitNo = data.cardUnitNo
            notHandInCardUnit.push({
              cardUnitNo: cardUnitNo,
              cardUnitCnt: 1
            })
          })

          if (that.shiftRegMainRecord.shiftPassCardDetailList.length > 0) {
            that.shiftRegMainRecord.shiftPassCardDetailList.forEach(function (data) {
              for (let i = 0; i < notHandInCardUnit.length; i++) {
                if (parseInt(notHandInCardUnit[i].cardUnitNo) == parseInt(data.cardUnitNo)) {
                  notHandInCardUnit.splice(i--, 1)
                }
              }
            })
          }

          if (notHandInCardUnit.length > 0) {
            let cardUnitNoStr = ""
            notHandInCardUnit.forEach(function (data) {
              cardUnitNoStr += data.cardUnitNo + ","
            })
            cardUnitNoStr = cardUnitNoStr.substring(0, cardUnitNoStr.length - 1)
            let msg = "卡单元：" + cardUnitNoStr + "已被"
              + "[" + that.shiftRegMainRecord.laneOperatorID + "]" + that.operatorMap[that.shiftRegMainRecord.laneOperatorID]
              + "进行了上班登记，但未进行下班登记，是否继续?"
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.save_4()
            })
            return false
          }
        }
      }

      return true
    },

    //save_4校验方法###############################################################################################
    // 校验操作时间，查看是否已经被删除
    async lastCheckOpTime(){
      let checkLatestRecordResp = await api.checkLatestRecord({
        linkID: this.shiftRegMainRecord.linkID,
        forWorkID: this.shiftRegMainRecord.forWorkID,
        offWorkID: this.shiftRegMainRecord.offWorkID,
        process: this.process
      })
      if (null == checkLatestRecordResp || checkLatestRecordResp.code != 200) {
        this.$notify.error("校验最近记录数据失败，请检查！")
        return false
      }

      if (null == checkLatestRecordResp.data) {
        this.$notify.error("该交接班记录已被删除，请重新查询！")
        return false
      }
      return true
    },

    makeInvCount(){
      let that = this
      // 机打发票
      if (that.shiftRegMainRecord.shiftInvDetailList.length > 0) {
        that.shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
          const invStartNo = data.invStartNo
          const invEndNo = data.invEndNo
          that.shiftRegMainRecord.shiftInvDetailList[index].invCount = parseInt(invEndNo) - parseInt(invStartNo) + 1
        })
      }

      // 定额发票
      if (that.shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
        that.shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
          const invStartNo = data.invStartNo
          const invEndNo = data.invEndNo
          that.shiftRegMainRecord.shiftSquadRationInvoiceList[index].invCount = parseInt(invEndNo) - parseInt(invStartNo) + 1
        })
      }

      // 纸券
      if (that.shiftRegMainRecord.shiftSquadPaperList.length > 0) {
        that.shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
          const paperStart = data.paperStart
          const paperEnd = data.paperEnd
          that.shiftRegMainRecord.shiftSquadPaperList[index].paperCount = parseInt(paperEnd) - parseInt(paperStart) + 1

        })
      }
    },

    makeBadInvMoney(){
      let that = this
      if (null != that.shiftRegMainRecord.shiftSquadInvalidinvList && that.shiftRegMainRecord.shiftSquadInvalidinvList.length > 0) {
        that.shiftRegMainRecord.shiftSquadInvalidinvList.forEach(function (tmp, index) {
          tmp.money = that.accMul(tmp.showMoney, 100)
        })
      }
    },

    accMul(arg1,arg2) {
      if ("" == arg1 || null == arg1){
        arg1 = 0
      }
      let m = 0, s1 = arg1.toString(), s2 = arg2.toString()
      try {
        m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
        m += s2.split(".")[1].length
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },

    //回退#################################################################################################
    async goBack(buttonType){
      this.buttonType = buttonType;
      // 前置校验 ------------------------------------------------------
      if (!this.makeOperationType().flag) {
        return;
      }
      this.operationType = this.makeOperationType().operationType;

      //工班结算校验
      let settleDataResp = await api.checkShiftSettleStock({
        stationNo: this.shiftRegMainRecord.stationNo,
        laneNo: this.shiftRegMainRecord.laneNo,
        squadDateStr: moment(this.shiftRegMainRecord.squadDateStr).format('YYYY-MM-DD'),
        squadNo: this.shiftRegMainRecord.squadNo,
        laneOperatorNo: this.shiftRegMainRecord.laneOperatorID
      })

      if(null == settleDataResp){
        this.$notify.error("检查工班结算状态异常，请检查!")
        return
      }

      if(!settleDataResp.data){
        this.$notify.error("工班已结算，不能回退交班登记!")
        return
      }

      // 校验操作时间，查看是否已经被删除
      if (this.operationType == 2 && ! await this.lastCheckOpTime()) {
        return
      }

      this.workStatus = 0
      this.shiftRegMainRecord.shiftPassCardDetailList = []
      this.getCardUnitNoList()
      this.$refs.goBackDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.process, this.status, this.shiftRegMainRecord.linkID)
    }

  }
}
</script>

<style scoped>
  .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }
  table{
    border-spacing: 0;
    border: 0px !important;
    margin: 0px !important;
  }
  table, th, td {
    border: 1px solid #e4e4e4;
    text-align: center;
  }

  .tableButton{
    padding: 4px 4px !important;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  .page-header {
    margin: 10px 20px;
    padding-bottom: 3px;
    float: none !important;
    border-bottom: 1px solid #eee;
  }

  .page-header span {
    position: relative;
    border-bottom: 2px solid #44B1E4;
    font-size: 15px;
  }

  .text-danger {
    color: #a94442;
    font-weight: 700;
  }

  .row-border{
    border: 1px solid #eee;
  }

  .bg-gray {
    background: #ddd !important;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
  }

  .elFormItem div{
    margin-bottom: 0px;
  }

  .elFormItem .el-form-item div{
    margin-left: 0px !important;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
     width: auto;
  }

  /deep/ .elColEdit input {
    background-color: rgb(199,237,204)
  }
</style>
