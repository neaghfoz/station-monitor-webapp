<template>
  <div class="kpi-index"
       v-loading="loading"
       element-loading-text="拼命加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.4)"
       style="background-color: #f5f5f5">
    <el-container>
      <el-main style="padding: 0; margin-right: 14px">
        <!--
        <div style="height: 68px" class="warnInfo">
          <div>
            <img
              style="
                width: 18px;
                height: 14px;
                vertical-align: middle;
                margin-right: 4px;
              "
              src="@/assets/img/xtxx.png"
            />
            <span class="ft16">系统消息：</span>
            <span>智慧公路云1.1版本上线啦！赶紧扫一扫二维码体验一下吧！</span>
          </div>
          <div>
            <span>2021/5/13 14:00:00</span>
            <span class="moreText">更多>></span>
          </div>
        </div>
        -->
        <div class="mainItemBox" style="margin-top: 0px;" v-if="indexStatVo.auditPendingCnt || indexStatVo.enAuditCnt || indexStatVo.exAuditCnt || indexStatVo.enCheckCnt || indexStatVo.exCheckCnt
                      || indexStatVo.auditPendingCnt == 0 || indexStatVo.enAuditCnt == 0 || indexStatVo.exAuditCnt == 0 || indexStatVo.enCheckCnt == 0 || indexStatVo.exCheckCnt == 0 ">
          <div class="topTitleInfo">
            <img src="@/assets/img/dbx.png" alt="">
            <span>稽核工单</span>
          </div>
          <div class="mainItemBoxL">
            <el-row :gutter="20">
              <el-col :span="5" class="itemBox" v-if="indexStatVo.auditPendingCnt || indexStatVo.auditPendingCnt == 0">
                <div class="itemBoxL">
                  <div class="item1">
                    <img src="@/assets/img/order-pending.png" alt="">
                    <span>{{ indexStatVo.auditPendingCnt }}</span>
                  </div>
                  <div class="item2">
                    <span>待处理工单</span>
                    <span data-id="1" @click="detailRowEvent($event,'0')">详情</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5" class="itemBox" v-if="indexStatVo.enAuditCnt || indexStatVo.enAuditCnt == 0">
                <div class="itemBoxL">
                  <div class="item1">
                    <img src="@/assets/img/jiaoyiliushuibiandong.png" alt="">
                    <span>{{ indexStatVo.enAuditCnt }}</span>
                  </div>
                  <div class="item2">
                    <span>待稽查入口流水</span>
                    <span data-id="2" @click="detailRowEvent($event,'2')">详情</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5" class="itemBox" v-if="indexStatVo.exAuditCnt || indexStatVo.exAuditCnt == 0">
                <div class="itemBoxL">
                  <div class="item1">
                    <img src="@/assets/img/navicon-jylstj.png" alt="">
                    <span>{{ indexStatVo.exAuditCnt }}</span>
                  </div>
                  <div class="item2">
                    <span>待稽查出口流水</span>
                    <span data-id="3" @click="detailRowEvent($event,'2')">详情</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5" class="itemBox" v-if="indexStatVo.enCheckCnt || indexStatVo.enCheckCnt == 0">
                <div class="itemBoxL">
                  <div class="item1">
                    <img src="@/assets/img/dancheliushuichaifen.png" alt="">
                    <span>{{ indexStatVo.enCheckCnt }}</span>
                  </div>
                  <div class="item2">
                    <span>待审核入口流水</span>
                    <span data-id="4" @click="detailRowEvent($event,'3')">详情</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5" class="itemBox" v-if="indexStatVo.exCheckCnt ||　indexStatVo.exCheckCnt == 0">
                <div class="itemBoxL">
                  <div class="item1">
                    <img src="@/assets/img/tubiaozhizuomoban.png" alt="">
                    <span>{{ indexStatVo.exCheckCnt }}</span>
                  </div>
                  <div class="item2">
                    <span>待审核出口流水</span>
                    <span data-id="5" @click="detailRowEvent($event,'3')">详情</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="mainItemBox" v-if="indexStatVo.dailyCommitCnt || indexStatVo.dailyAuditCnt || indexStatVo.dailyCheckCnt ||
                          indexStatVo.dailyCommitCnt == 0 || indexStatVo.dailyAuditCnt == 0 || indexStatVo.dailyCheckCnt == 0">
          <div class="topTitleInfo">
            <img src="@/assets/img/dbx.png" alt="">
            <span>日常考核工单</span>
          </div>
          <div class="mainItemBoxL">
            <el-row>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.dailyCommitCnt || indexStatVo.dailyCommitCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/001.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.dailyCommitCnt }}</div>
                    <div style="margin:4px 0;">待提交工单</div>
                    <div style="color: #0088FE;" data-id="6" @click="detailRowEvent($event,'0')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.dailyAuditCnt || indexStatVo.dailyAuditCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/002.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.dailyAuditCnt }}</div>
                    <div style="margin:4px 0;">待审核工单</div>
                    <div style="color: #0088FE;" data-id="7" @click="detailRowEvent($event,'1')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.dailyCheckCnt || indexStatVo.dailyCheckCnt == 0" style="border:none">
                <div class="itemBoxR">
                  <img src="@/assets/img/003.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.dailyCheckCnt }}</div>
                    <div style="margin:4px 0;">待确认工单</div>
                    <div style="color: #0088FE;" data-id="8" @click="detailRowEvent($event,'2')">详情</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="mainItemBox" v-if="indexStatVo.civilCommitCnt || indexStatVo.civilAuditCnt || indexStatVo.civilCheckCnt
                      || indexStatVo.civilCommitCnt == 0 || indexStatVo.civilAuditCnt == 0 || indexStatVo.civilCheckCnt == 0">
          <div class="topTitleInfo">
            <img src="@/assets/img/dbx.png" alt="">
            <span>文明服务质量考核工单</span>
          </div>
          <div class="mainItemBoxL">
            <el-row>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.civilCommitCnt || indexStatVo.civilCommitCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/001.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.civilCommitCnt }}</div>
                    <div style="margin:4px 0;">待提交工单</div>
                    <div style="color: #0088FE;" data-id="9" @click="detailRowEvent($event,'0')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.civilAuditCnt || indexStatVo.civilAuditCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/002.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.civilAuditCnt }}</div>
                    <div style="margin:4px 0;">待审核工单</div>
                    <div style="color: #0088FE;" data-id="10" @click="detailRowEvent($event,'1')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.civilCheckCnt || indexStatVo.civilCheckCnt == 0" style="border:none">
                <div class="itemBoxR">
                  <img src="@/assets/img/003.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.civilCheckCnt }}</div>
                    <div style="margin:4px 0;">待确认工单</div>
                    <div style="color: #0088FE;" data-id="11" @click="detailRowEvent($event,'2')">详情</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="mainItemBox" v-if="indexStatVo.moneyCommitCnt || indexStatVo.moneyAuditCnt || indexStatVo.moneyCheckCnt
                                || indexStatVo.moneyCommitCnt == 0 || indexStatVo.moneyAuditCnt == 0 || indexStatVo.moneyCheckCnt == 0">
          <div class="topTitleInfo">
            <img src="@/assets/img/dbx.png" alt="">
            <span>长短款考核工单</span>
          </div>
          <div class="mainItemBoxL">
            <el-row>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.moneyCommitCnt || indexStatVo.moneyCommitCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/001.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.moneyCommitCnt }}</div>
                    <div style="margin:4px 0;">待提交工单</div>
                    <div style="color: #0088FE;" data-id="12" @click="detailRowEvent($event,'0')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.moneyAuditCnt || indexStatVo.moneyAuditCnt == 0">
                <div class="itemBoxR">
                  <img src="@/assets/img/002.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.moneyAuditCnt }}</div>
                    <div style="margin:4px 0;">待审核工单</div>
                    <div style="color: #0088FE;" data-id="13" @click="detailRowEvent($event,'1')">详情</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" class="itemTBox" v-if="indexStatVo.moneyCheckCnt || indexStatVo.moneyCheckCnt == 0" style="border:none">
                <div class="itemBoxR">
                  <img src="@/assets/img/003.png" alt="">
                  <div class="itemRightBox">
                    <div>{{ indexStatVo.moneyCheckCnt }}</div>
                    <div style="margin:4px 0;">待确认工单</div>
                    <div style="color: #0088FE;" data-id="14" @click="detailRowEvent($event,'2')">详情</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
      <el-aside width="361px">
        <div class="infoMain">
          <el-row :gutter="25" style="align-items: center; display: flex">
            <el-col :span="12" style="height: 119.5px">
              <img v-if="curUserInfo.sex == 0" src="@/assets/img/avatar.png" alt="">
              <img v-else src="@/assets/img/n.png" alt="">
            </el-col>
            <el-col :span="12">
              <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;">
                <span class="workName">{{ curUserInfo.realName }}</span>
                <span class="workInfo" v-bind:title="roleNames">{{ roleName }}</span>
              </div>
              <div
                style="margin: 18px 0 22px 0; font-size: 12px; color: #878787"
              >
                ID:{{ curUserInfo.id }}
              </div>
              <div>{{ curUserOrg.name }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="font-size: 12px; margin-top: 24px">
            <el-col :span="18" style="color: #222">
              最近登录时间：{{ lastLoginTime }}
            </el-col>
            <!--
            <el-col :span="6" style="color: #0088fe"><span data-id='personal' @click="detailRowEvent($event)">查看更多>></span> </el-col>
            -->
          </el-row>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import tiUserApi from '@/views/pro/common/tiApi/tiUser/tiUserApi';
import indexStatApi from "@/views/fs/kpi/index/indexStatApi";

export default {
  name: 'KpiPerSystemsView',
  comments: [tiUserApi, indexStatApi],
  data() {
    return {
      loading: true,
      indexStatVo: {sysUserVo: null},
      userOptLog: {},
      lastLoginTime: null,
      roleName: null,
      roleNames: null,
      curUserOrg: {},
      curUserAllInfo: {},
      curUserInfo:{},
      urlList: {
        '1': '/kpi/workOrder',
        '2': '/kpi/relatedEnlist/view',
        '3': '/kpi/relatedExlist/view',
        '4': '/kpi/relatedEnlist/view',
        '5': '/kpi/relatedExlist/view',
        '6': '/kpi/check/daily',
        '7': '/kpi/check/daily',
        '8': '/kpi/check/daily',
        '9': '/kpi/check/civil',
        '10': '/kpi/check/civil',
        '11': '/kpi/check/civil',
        '12': '/kpi/check/money',
        '13': '/kpi/check/money',
        '14': '/kpi/check/money',
        'personal': '/personalCenter',
        'info': ''
      }
    }
  },
  async created() {
    // 当前用户组织机构
    //this.curUserOrg = (await tiUserApi.getCurUserOrg()).data
    // 当前用户信息：包括岗位、角色等
    this.curUserInfo = this.$store.getters.userInfo;
    //console.log(this.curUserInfo)
    //this.curUserAllInfo = (await tiUserApi.getCurUserInfo({ username:this.curUserInfo.username },null)).data
    //console.log(this.curUserAllInfo)
    await this.doIndexStat();
  },
  methods: {
    async doIndexStat(){
      /*let loading = this.$loading({
        lock: true,
        text: '首页统计加载中，请稍后。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)',
        target: '.kpi-index',
        body: true,
        customClass: 'mask'
      })*/
      try{
        this.indexStatVo = (await indexStatApi.doStat()).data;
        // console.log(this.indexStatVo)
        if(this.indexStatVo){
          await this.initInfo()
        }
      } finally {
        this.loading = false
        //loading.close();//关闭遮罩层
      }
    },
    async initInfo(){
      this.curUserAllInfo = this.indexStatVo.sysUserVo||{}
      this.curUserOrg = this.indexStatVo.sysOrg||{name:null}
      if(this.curUserAllInfo.roleList && this.curUserAllInfo.roleList.length > 0){
        this.roleName = this.curUserAllInfo.roleList[0].roleName
        this.curUserAllInfo.roleList.forEach(role => {
          if(this.roleNames == null){
            this.roleNames = role.roleName
          }else{
            this.roleNames = this.roleNames + ',' + role.roleName
          }
        })
      }
      this.userOptLog = (await indexStatApi.getLastLogin()).data
      if(this.userOptLog && this.userOptLog.optTime){
        this.lastLoginTime = XEUtils.toDateString(this.userOptLog.optTime, 'yyyy-MM-dd HH:mm:ss')
      }
      //console.log(this.userOptLog)
    },
    detailRowEvent(e,workState) {
      //console.log(e.srcElement.dataset.id)
      //console.log(workState)
      var row = e.srcElement.dataset.id
      const url = this.urlList[row]
      this.$router.push({
        path: url,
        query: {
          workState: workState,
          timestamp: new Date().getTime(),
          type: 'query'
        }
      })
    }
  }
}
</script>
<style scoped>
.warnInfo {
  border: 1px solid #fcbf47;
  padding: 0 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  background: #fffbf3;
}
.warnInfo span {
  vertical-align: middle;
}
.ft16 {
  font-size: 16px;
}
.moreText {
  font-size: 14px;
  color: #0088fe;
  padding-left: 8px;
}
.infoMain {
  height: 239px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 1px rgba(229, 232, 236, 0.77);
  padding: 39px 23px;
}
.workInfo {
  font-size: 12px;
  color: #fff;
  background: #0088fe;
  border-radius: 13px;
  padding: 6px 14px;
  vertical-align: middle;
}
.workName {
  font-size: 16px;
  padding-right: 8px;
  vertical-align: middle;
}
.mainItemBox{
  margin-top: 16px;
  background-color: #fff;
}
.topTitleInfo {
  height: 52px;
  padding-left: 30px;
  line-height: 52px;
  box-shadow: 0px 1px 4px 1px rgba(229, 232, 236, 0.77);
}
.topTitleInfo img {
  width: 17px;
  height: 17px;
  vertical-align: middle;
}
.topTitleInfo span {
  font-size: 16px;
  color: #2c2c2b;
  vertical-align: middle;
  padding-left: 10px;
}
.itemBoxL{
  background: #FFFFFF;
  box-shadow: 1px 2px 8px 0px rgba(88, 132, 171, 0.2);
  border-radius: 6px;
}
.item1{
  padding: 12px 0;
}
.item1,.item2{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.item1 img{
  width: 33px;
  height: 38px;
}
.item1 span{
  font-size: 32px;
  font-family: Arial;
  font-weight: 400;
  color: #16407C;
}
.item2{
  font-size: 12px;
  border-top: 1px solid #DDE0E3;
  padding: 8px 0px 18px 0px;
}
.item2 span:nth-child(1){
  color: #333333;
}
.item2 span:nth-child(2){
  color: #0088FE;
}
.itemBox{
  width: 20%!important;
}
.mainItemBoxL{
  padding:40px 30px;
}
.itemBoxR{
  display: flex;
  align-items: center;
  justify-content: space-between
}
.itemBoxR img{
  height: 80px;
  width: 80px;
  margin-top: 5px;
}
.itemTBox{
  border-right:1px solid #DDE0E3;
  padding: 0 5% 0 0;
  margin-right: 5%;
  max-width: 230px;
}
.itemRightBox{
  font-size: 12px;
}
.itemRightBox div:nth-child(1){
  font-size: 32px;
  font-family: Arial;
  font-weight: 400;
  color: #16407C;
}
</style>
