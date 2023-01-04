<template>
  <div class="app-container">
    <el-dialog
      id="testPaper"
      :key="componentKey"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      show-close="false"
      destroy-on-close
      fullscreen
      class="dialog-box"
      width="100%"
      @open="stopSrcoll"
      @close="beforeClose"
    >
      <div v-loading="loading" class="main">
        <el-row class="topMain">
          <el-col class="topLeftMain" :span="15">
            <div class="t_l_box1" :class="areaContent.area2_img ? '' : 't_l_box_hide'">
              <img
                v-for="(item,index) in area2ImgList"
                v-show="areaContent.area2_img === item.imgUrl"
                :key="index"
                :src="item.imgUrl"
                alt=""
                srcset=""
              >
            </div>
            <div class="t_l_box2" :class="areaContent.area3_txt ? '' : 't_l_box_hide'">
              <div v-html="formatterCont(areaContent.area3_txt)" />
            </div>
            <div class="t_l_box3">
              <div style="line-height: 14px;margin-bottom: 10px;">费额显示器</div>
              <div class="feieBox">
                <div>
                  <span>{{ areaContent.area4_txt1 }}</span><span>{{ areaContent.area4_txt2 }}</span>
                </div>
                <div>
                  <span>{{ areaContent.area4_txt3 }}</span><span>{{ areaContent.area4_txt4 }}</span>
                </div>
                <div>
                  <span>{{ areaContent.area4_txt5 }}</span><span>{{ areaContent.area4_txt6 }}</span>
                </div>
                <div>
                  <span>{{ areaContent.area4_txt7 }}</span><span>{{ areaContent.area4_txt8 }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col class="topRightMain" :span="7">
            <div v-if="!method" class="topButton">
              <img v-show="page.currentPage !== 1" src="@/assets/img/train/practical/shicaolianxi/shangyiti.png" alt="" srcset="" @click="switchTopics(1)" @load="imgLoad" @error="imgError">
              <img v-show="page.currentPage !== page.total" src="@/assets/img/train/practical/shicaolianxi/xiayiti.png" alt="" srcset="" @click="switchTopics(2)" @load="imgLoad" @error="imgError">
              <img src="@/assets/img/train/practical/shicaolianxi/tuichu.png" alt="" srcset="" @click="Close" @load="imgLoad" @error="imgError">
            </div>
            <div v-else class="topButton">
              <img src="@/assets/img/train/practical/shicaolianxi/tijiao.png" alt="" srcset="" @click="clickSubmit" @load="imgLoad" @error="imgError">
              <img src="@/assets/img/train/practical/shicaolianxi/tuichu.png" alt="" srcset="" @click="Close" @load="imgLoad" @error="imgError">
<!--              <img v-show="isActivate" src="@/assets/img/train/practical/shicaolianxi/zanting.png" alt="" srcset="" @click="suspendOrContinue(1)" @load="imgLoad" @error="imgError">
              <img v-show="!isActivate" src="@/assets/img/train/practical/shicaolianxi/jixu.png" alt="" srcset="" @click="suspendOrContinue(2)" @load="imgLoad" @error="imgError">-->
            </div>
            <div class="fzButton1">{{ typeText }}</div>
            <div class="fzButton2">收费场景：{{ examInfo.scene }}
              <div class="fzButton3">{{ method ? '剩余时间':'已练习' }}:<span class="time-text">{{ examInfo.timeText }}</span>学员:<span>{{ examInfo.userName }}</span></div>
            </div>
          </el-col>
        </el-row>
        <!-- bottom -->
        <el-row class="bottomMain">
          <el-col :span="15" class="bottomLeftMain">
            <img
              v-for="(item,index) in area1ImgList"
              v-show="areaContent.area1_img === item.imgUrl"
              :key="index"
              :src="item.imgUrl"
              alt=""
              srcset=""
            >
            <!--子组件-->
            <vehiclePopup v-if="showConfig.keyboard === '--' || showConfig.keyboard === 'jianpan1'" v-show="vehicleShow" ref="vehicleChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />
            <vehiclePopup2 v-if="showConfig.keyboard === 'jianpan2'" v-show="vehicleShow" ref="vehicleChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />

            <kahaoPopup v-show="kahaoShow" ref="kahaoChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />
            <shoufeizhanPopup v-show="shoufeizhanShow" ref="shoufeizhanChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />
            <zhiquanPopup v-show="zhiquanShow" ref="zhiquanChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />
            <rukoushijianPopup v-show="rukoushijianShow" ref="rukoushijianChild" @popupReturn="popupReturn" @setClickKeyboardNameReturn="setClickKeyboardNameReturn" />
          </el-col>
          <el-col :span="7" class="bottomRightMain">
            <div class="B_rightTopBox">
              <div class="shuakaBox">
                <div class="shuakaButton">
                  <div class="shuaEtc shua-btn" :class="'KEY_ETC' === ClickKeyboardName && method !== 'formalexam' ? 'cur' : ''">
                    <img id="etckey" src="@/assets/img/train/practical/shuakasaoma/ETCanniu.png" alt="" srcset="" @click="clickCardOrcode('KEY_ETC')" @load="imgLoad" @error="imgError">
                  </div>
                  <div class="shuaCpc shua-btn" :class="'KEY_CPC' === ClickKeyboardName && method !== 'formalexam' ? 'cur' : ''">
                    <img id="cpckey" src="@/assets/img/train/practical/shuakasaoma/CPCanniu.png" alt="" srcset="" @click="clickCardOrcode('KEY_CPC')" @load="imgLoad" @error="imgError">
                  </div>
                </div>
                <div class="saomaButton shua-btn" :class="'KEY_SCAN' === ClickKeyboardName && method !== 'formalexam' ? 'cur' : ''">
                  <img id="shaomakey" src="@/assets/img/train/practical/shuakasaoma/saomaanniu.png" alt="" srcset="" @click="clickCardOrcode('KEY_SCAN')" @load="imgLoad" @error="imgError">
                </div>
              </div>
              <div class="saomaBox">
                <div class="shuakaImg">
                  <img id="shuaka" :src="isPayCard ? (clickType === 'etc' ? cardEtcGif : cardCpcGif) : cardStatic" alt="" srcset="">
                </div>
                <div class="saomaImage">
                  <img id="shaoma" :src="isScanCode ? codeGif : codeStatic" alt="" srcset="">
                </div>
              </div>
            </div>
            <div id="rightBottomBox" class="B_rightBottomBox">
              <!-- 键盘组件 -->
              <TiKeyboard1
                v-if="showConfig.keyboard === '--' || showConfig.keyboard === 'jianpan1'"
                ref="keyboard"
                :method="method"
                :keyboard-name="ClickKeyboardName"
                @isLoadFinish="LoadFinish"
                @clickKeyboard="clickKeyboard"
              />
              <!-- 键盘组件 -->
              <TiKeyboard2
                v-if="showConfig.keyboard === 'jianpan2'"
                ref="keyboard"
                :method="method"
                :keyboard-name="ClickKeyboardName"
                @isLoadFinish="LoadFinish"
                @clickKeyboard="clickKeyboard"
              />
            </div>
          </el-col>
        </el-row>
      </div>

      <!--  -->
      <div v-show="isShowGif" class="centerImage">
        <div class="mainClass">
          <img :src="gifType === 'invoice' ? invoiceGif : taiganGif" alt="">
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :close-on-click-modal="false"
      :visible.sync="comfireVisible"
      width="300"
    >
      <div>正在提交中，请稍候...</div>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>

    <!-- 提示 -->
    <Remind
      ref="saasRemindDialog"
      @refLoadNextQut="LoadNextQut"
      @refPracticeAgain="practicalAgain"
      @refComfireResult="submit"
      @refDialogClose="DialogClose"
      @refReLoad="contReLoad"
      @refReSubmit="requestReLoad"
    />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import vehiclePopup from '../../../popup/components/inputVehicle'
import vehiclePopup2 from '../../../popup/components/inputVehicle2'
import kahaoPopup from '../../../popup/components/inputKahao'
import shoufeizhanPopup from '../../../popup/components/inputShouFeiZhan'
import zhiquanPopup from '../../../popup/components/inputZhiQuan'
import rukoushijianPopup from '../../../popup/components/inputRuKouShiJian'
import moment from 'moment'
import TiKeyboard1 from '@/views/pro/common/tiElement/tiKeyboard/tiKeyboard1'
import TiKeyboard2 from '@/views/pro/common/tiElement/tiKeyboard/tiKeyboard2'
import { findPage } from '@/views/pro/train/testmng/question/questionViewApi'
import { startOrSuspend } from './../practiceViewApi'
import { ExamDrafts, ExamSubmitAnswer } from '@/views/pro/train/test/exam/mockExamViewApi'
import store from '@/store'
import Remind from '@/views/pro/train/test/exam/components/remindView'
import dictUtils from '@ecip/ecip-web/src/utils/dictUtils'

export default {
  name: 'VuePracticalExercisesView',
  components: { Remind, vehiclePopup, vehiclePopup2, kahaoPopup, shoufeizhanPopup, TiKeyboard1, TiKeyboard2,
    zhiquanPopup, rukoushijianPopup },
  mixins: [...mixin],
  data() {
    return {
      practicalAgainExam: null,
      isLeave: false,
      leaveTime: null,
      showCj: null,
      vehicleShow: false,
      kahaoShow: false,
      shoufeizhanShow: false,
      zhiquanShow: false,
      rukoushijianShow: false,
      visible: false,
      endVisible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      comfireVisible: false, // 提交
      method: '',
      title: '实操训练',
      typeText: '实操练习模式',
      queryParams: {
        examHistoryId: '',
        examInfo: {}
      },
      formItem: {
        examHistoryId: '',
        answerResult: [],
        testPaper: [],
        temporaryStorage: [],
        examMode: 1, // 考试模式  1练习模式  2考核模式  3 竞赛模式
        examNumId: null
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 1,
        align: 'right',
        pageSizes: [5, 10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      examInfo: {
        userName: '',
        scene: '',
        examTime: 0,
        examTimeMinutes: 0,
        timeText: '00分钟00秒',
        prefixOpenTime: new Date(),
        prefixUsedTime: 0,
        openTimeFirst: new Date(),
        endTime: null,
        deadlineTime: null,
        totalScore: 100,
        qualifiedScore: 60,
        surplusTime: 0, // 剩余时间 s
        suspendDate: null, // 点击暂停时的时间保存
        usedTime: 0, // 已使用时间
        loadPaperIndex: 0 // 加载试题的索引
      },
      answerTimes: null,
      fullscreen: false,
      isShowGif: false, // 抬杆和打印发票的弹框是否显示
      gifType: '', // invoice 打印发票
      taiganGif: require('@/assets/img/train/practical/taigan.gif'),
      invoiceGif: require('@/assets/img/train/practical/fapiao.gif'),
      isPayCard: false, // 是否点击了刷卡
      clickType: 'etc',
      cardStatic: require('@/assets/img/train/practical/shuakasaoma/shuakatu.png'),
      cardEtcGif: require('@/assets/img/train/practical/shuakasaoma/dongxiao_etc.gif'),
      cardCpcGif: require('@/assets/img/train/practical/shuakasaoma/dongxiao_cpc.gif'),
      isScanCode: false, // 是否点击了扫码
      codeStatic: require('@/assets/img/train/practical/shuakasaoma/saomatu.png'),
      codeGif: require('@/assets/img/train/practical/shuakasaoma/dongxiao_shaoma.gif'),
      times: null,
      cardTimes: null,
      codeTimes: null,
      ClickKeyboardName: '',
      keyboardTimes: null,

      totalNum: 1, // 总题数
      curLoopIndex: 1,
      questionlist: [], // 题目id集合
      curIndex: 0, // 当前题目索引
      answer: [],
      lastNode: 0, // 保存上一步操作得是哪个节点
      curNode: 0,
      curStepObj: {},

      serialIndex: 0, // 串行时的索引

      areaContent: {
        area1_img: '',
        area2_img: '',
        area3_txt: '',
        area4_txt1: '',
        area4_txt2: '',
        area4_txt3: '',
        area4_txt4: '',
        area4_txt5: '',
        area4_txt6: '',
        area4_txt7: '',
        area4_txt8: ''
      },
      dataList: [],
      curQuestionId: null, // 当前题目id
      isActivate: true, // 当前状态是否激活
      isClickLastOrNext: null, // 1 上一题   2下一题
      area1ImgList: [],
      area2ImgList: [],
      isAgainOpen: false, // 是否再次打开接着上次的进度做题，仅针对考核模式
      loadFinishTime: null,
      isfinish: false, // 键盘渲染完成
      staticLoadCount: 0,
      staticFinish: false,
      bgLoadFinish: false,
      areaLoadFinish: false,
      changeHasErr: false, // 切换上一题/下一题 时图片加载是否有错误
      bgImgList: [
        { 'imgUrl': require('@/assets/img/train/practical/feiexianshiqi/beijing.png') },
        { 'imgUrl': require('@/assets/img/train/practical/shicaolianxi/chedaoyingji.png') },
        { 'imgUrl': require('@/assets/img/train/practical/shicaolianxi/beijing.png') },
        { 'imgUrl': require('@/assets/img/train/practical/shuakasaoma/beijing.png') },
        { 'imgUrl': require('@/assets/img/train/practical/jianpan1/beijing.png') },
        { 'imgUrl': require('@/assets/img/train/practical/feiexianshiqi/duihua.png') }
      ],
      componentKey: 0
    }
  },
  computed: {
    showConfig() {
      return {
        keyboard: dictUtils.getDictLabel('tibms_train_config', 'train_keyboard')
      }
    }
  },
  created() {
    this.examInfo.userName = store.getters.username
    this.examInfo.realName = store.getters.name
  },
  mounted() {
    const self = this
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        self.isLeave = true
        self.leaveTime = new Date()
      } else {
        self.isLeave = false
      }
    })
  },
  methods: {
    init(txObj, knowledObj) {
      this.commonInit()
      Object.assign(this.queryParams, {
        choice: txObj.choice,
        knowledgeId: knowledObj.knowledgeId
      })

      this.totalNum = txObj.num
      this.practicalOneByOneAgain()
    },
    practicalOneByOneAgain() {
      this.page.pageSize = 1
      this.page.currentPage = 1

      this.questionlist = []
      this.curLoopIndex = 1
      this.curIndex = 0

      this.examInfo.examTime = 0
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }
      this.examInfo.timeText = '00分钟00秒'
      this.countTime() // 计时
      this.getData()

      this.visible = true
    },
    examInit(id, exam, method, type, examInfo) {
      // type考试类型  0综合训练  1练习模式  2考核模式  3竞赛模式
      // method用于区分来源  train综合训练 exam模拟考试   formalexam正式考试   为空是个人练习
      this.commonInit(method)

      this.isActivate = true
      this.formItem.examNumId = id || ''
      this.queryParams.examInfo = examInfo || {}
      this.examInfo.loadPaperIndex = 0
      this.examInfo.usedTime = 0
      this.dataList = exam
      this.formItem.examMode = type // (type === 2 || type === 3) ? type : 1

      this.formItem.examHistoryId = exam.examSessionId
      this.method = method

      this.handleExamInfo(exam)
      this.getData()
      this.visible = true
    },
    commonInit(method) {
      // 设置全屏
      if (!this.fullscreen) {
        this.screen()
      }
      if (this.loadFinishTime) {
        clearTimeout(this.loadFinishTime)
        this.loadFinishTime = null
      }
      this.loading = true
      this.ResetHandle()
      this.typeText = method === 'formalexam' ? '实操考核模式' : '实操练习模式'
      this.examInfo.prefixOpenTime = new Date()
      this.examInfo.endTime = null
      this.leaveTime = null
      this.page.currentPage = 1
      this.staticLoadCount = 0
      this.staticFinish = false
      this.bgLoadFinish = false
      this.areaLoadFinish = false
      this.changeHasErr = false
      this.componentKey++
      this.imgReady()
      this.stopSrcoll()
    },
    // 键盘加载完成
    LoadFinish(status) {
      if (status) {
        // 完成
        this.isfinish = true
      } else {
        this.imgError()
      }
    },
    // 1区 2区图片加载情况
    areaLoad() {
      const pics = this.area1ImgList.concat(this.area2ImgList)
      const picsAll = pics.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = item.imgUrl
          img.onload = () => resolve(item)
          img.onerror = () => reject(new Error(item.imgUrl + ' load error'))
        })
      })
      Promise.all(picsAll).then(() => {
        this.areaLoadFinish = true
        if (this.isfinish && this.areaLoadFinish && this.staticFinish && this.bgLoadFinish) {
          this.loading = false
        }
      }).catch((e) => {
        this.areaLoadFinish = false
        if (!this.isClickLastOrNext) {
          if (this.loadFinishTime) {
            clearTimeout(this.loadFinishTime)
            this.loadFinishTime = null
          }
          this.$refs.saasRemindDialog.init(8, '网络出错，请重新加载！')
        } else {
          this.changeHasErr = true
        }
      })
    },
    // 静态图片加载
    imgLoad() {
      this.staticLoadCount++
      if (this.method && this.staticLoadCount === 5) {
        this.staticFinish = true
      } else if (!this.method && this.staticLoadCount === 4) {
        this.staticFinish = true
      }
    },
    imgError() {
      // 非上下一题切换情况下
      if (!this.isClickLastOrNext) {
        if (this.loadFinishTime) {
          clearTimeout(this.loadFinishTime)
          this.loadFinishTime = null
        }
        this.$refs.saasRemindDialog.init(8, '网络出错，请重新加载！')
      } else {
        this.changeHasErr = true
      }
    },
    // 背景图加载
    imgReady() {
      const pics = this.bgImgList
      const picsAll = pics.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = item.imgUrl
          img.onload = () => resolve(item)
          img.onerror = () => reject(new Error(item.imgUrl + ' load error'))
        })
      })
      Promise.all(picsAll).then(() => {
        this.bgLoadFinish = true
      }).catch((e) => {
        this.$refs.saasRemindDialog.init(8, '网络出错，请重新加载！')
      })
    },
    // 重新加载
    contReLoad() {
      this.componentKey++
      this.areaLoad()
    },
    handleExamInfo(exam) {
      this.practicalAgainExam = exam
      // lists.consumeTime为试卷的设置耗时，单位为毫秒
      this.examInfo.qualifiedScore = exam.passPoints ? exam.passPoints / 100 : 90
      this.examInfo.totalScore = exam.totalPoints / 100
      this.examInfo.examTimeMinutes = exam.consumeTime / 1000 / 60
      this.examInfo.surplusTime = exam.consumeTime / 1000
      this.examInfo.usedTime = 0

      const choiceArr = exam.choiceMapList
      const _objArr = []; const newDataList = []; let temporaryStorage = []
      let totalNum = 0
      const doNum = 0
      const userAnswer = exam.userAnswer ? JSON.parse(exam.userAnswer) : []
      let loadPaperIndex = 0
      const curT = new Date()

      let timeConsum = 0 // 耗时
      let totalConsumeTime = 0 // 数据返回的总耗时
      let lastSuspendTime = null // 最近暂停时间
      let lastStartTime = null // 最近开始时间

      // lists.startTime有值时，代表非第一次进入，例如考试中退出后再次进入，只有正式考试才有
      if (this.method === 'formalexam' && exam.startTime) {
        const startT = new Date(exam.startTime)

        this.examInfo.prefixOpenTime = startT
        this.examInfo.openTimeFirst = startT

        totalConsumeTime = exam.totalConsumeTime
        lastSuspendTime = exam.lastSuspendTime
        lastStartTime = exam.lastStartTime

        // 转为整型，避免小数精度问题
        const jgT = parseInt((curT.getTime() - startT.getTime()) / 1000)
        this.examInfo.surplusTime = this.examInfo.examTimeMinutes * 60 - jgT
        this.examInfo.usedTime = jgT
        this.examInfo.prefixUsedTime = jgT
      } else {
        this.examInfo.openTimeFirst = new Date()
      }

      // 设置deadline时间，深复制日期信息
      const startTime = new Date(this.examInfo.openTimeFirst.valueOf())
      this.examInfo.deadlineTime = new Date(startTime.setSeconds(startTime.getSeconds() + this.examInfo.surplusTime))

      for (const item in choiceArr) {
        const choiceItem = choiceArr[item]
        if (choiceItem.choiceList) {
          const len = choiceItem.choiceList.length

          if (len > 0) {
            totalNum = totalNum + len
            choiceItem.choiceList.map((j, k) => {
              /**
               * questionId   试题id
               * correct      实操题填写：是否正确 0错误 1正确
               * time         耗时，该题花费时间
               * userAnswer   理论题填写：用户答案
               * userTime     作答时间
               * points       试题分
               * operPoints   实操题填写：系统设置的操作分
               * timePoints   实操题填写：系统设置的耗时分
               * sort         排序号
               * operationScore 实际获得的操作分
               * timeScore    实际获得的耗时分
               */
              const _obj = { questionId: j.id, userAnswer: '', userTime: '', correct: 0, time: 0,
                consumingTime: j.time, // 设置一题的耗时（s），用于比较用户做题耗时得分
                timePoints: j.timePoints, // 耗时分
                operPoints: j.operPoints, // 操作分
                points: 0,
                sort: j.sort,
                operationScore: 0,
                timeScore: 0,
                isFinish: false }
              if (this.method === 'formalexam') {
                const hasAnswer = userAnswer.find((v, i) => { return v.questionId === j.id })
                if (hasAnswer) { //  && hasAnswer.time
                  let operationScore = 0
                  let timeScore = 0
                  if (hasAnswer.correct === 1) {
                    operationScore = hasAnswer.operPoints
                    if (hasAnswer.time <= _obj.consumingTime) {
                      // 耗时得分
                      timeScore = hasAnswer.timePoints
                    }
                  }

                  _obj.correct = hasAnswer.correct
                  _obj.userTime = hasAnswer.userTime
                  _obj.time = hasAnswer.time
                  _obj.points = operationScore + timeScore
                  _obj.operationScore = operationScore
                  _obj.timeScore = timeScore
                  _obj.isFinish = hasAnswer.isFinish

                  temporaryStorage = temporaryStorage.concat([_obj])
                  timeConsum += Number(hasAnswer.time)
                }
              }

              _objArr.push(_obj)
              newDataList.push(j)
            })
          }
        }
      }
      const tLen = temporaryStorage.length
      if (tLen > 0) {
        // 当userAnswer不为空,说明之前有暂存过做题信息，将从最后一道完成的下一道开始做题
        loadPaperIndex = tLen
        this.examInfo.prefixOpenTime = new Date(_objArr[loadPaperIndex - 1].userTime)
        this.isAgainOpen = true
      }

      if (this.method === 'formalexam' && lastSuspendTime) {
        // 首先判断是否有暂停时间，如为空，没有进行过暂停操作
        let useTime = 0 // this.examInfo.usedTime
        if (lastSuspendTime > lastStartTime) {
          // 最近暂停时间 比 最近开始时间 晚
          if (totalConsumeTime > timeConsum) {
            // 记录的总耗时与所有完成题所耗时的差，设为当前题已经消耗的时间
            const timeDiff = totalConsumeTime - timeConsum
            this.examInfo.surplusTime = this.examInfo.examTimeMinutes * 60 - totalConsumeTime
            _objArr[loadPaperIndex].time = timeDiff
            useTime += totalConsumeTime
          } else {
            this.examInfo.surplusTime = this.examInfo.examTimeMinutes * 60 - timeConsum
            useTime += timeConsum
          }
        } else {
          // 最近暂停时间 比 最近开始时间 早，即在退出的那瞬间，试题是处于激活状态
          const lastStartToCur = (curT.getTime() - (new Date(lastStartTime)).getTime()) / 1000
          if (totalConsumeTime > timeConsum) {
            const timeDiff = totalConsumeTime - timeConsum
            this.examInfo.surplusTime = this.examInfo.examTimeMinutes * 60 - totalConsumeTime - lastStartToCur
            _objArr[loadPaperIndex].time = timeDiff + lastStartToCur
            useTime += (totalConsumeTime + lastStartToCur)
          } else {
            this.examInfo.surplusTime = this.examInfo.examTimeMinutes * 60 - timeConsum - lastStartToCur
            _objArr[loadPaperIndex].time = lastStartToCur
            useTime += (timeConsum + lastStartToCur)
          }
        }
        this.examInfo.prefixOpenTime = curT
        this.examInfo.usedTime = useTime
        this.examInfo.prefixUsedTime = useTime
      }

      this.examInfo.loadPaperIndex = loadPaperIndex
      this.page.currentPage = loadPaperIndex + 1
      this.examInfo.doNum = doNum
      this.examInfo.totalNum = _objArr.length
      this.totalNum = _objArr.length
      this.formItem.testPaper = _objArr
      this.formItem.temporaryStorage = temporaryStorage
      this.questionlist = [].concat(newDataList)
      this.examInfo.timeText = this.secondToDate(this.examInfo.surplusTime, 2)
      this.countDown()
    },
    // 数据
    async getData(hasError) {
      this.changeHasErr = false
      if (!this.method) {
        // 当method为空时，代表是个人练习，需要每一次获取一个场景进行练习
        this.getOnePracticalData()
        return
      }
      const paperIndex = this.examInfo.loadPaperIndex
      const { method, questionlist, totalNum, isClickLastOrNext, isAgainOpen } = this
      this.curQuestionId = questionlist[paperIndex].id
      if (paperIndex === 0) {
        this.handleData()
        // 键盘加载完成 ， 1区2区图片加载完成
        if (this.isfinish && this.areaLoadFinish && this.staticFinish && this.bgLoadFinish) {
          this.$refs.saasRemindDialog.init(1, questionlist[paperIndex].mainContent, totalNum, method, null, isClickLastOrNext)
          this.loading = false
        } else {
          this.eventLoadImg(() => {
            this.$refs.saasRemindDialog.init(1, questionlist[paperIndex].mainContent, totalNum, method, null, isClickLastOrNext)
            // this.handleData()

            this.loading = false
          })
        }
      } else {
        if (isAgainOpen) {
          this.handleData()
          if (!this.isfinish && !this.areaLoadFinish && !this.staticFinish && !this.bgLoadFinish) {
            this.eventLoadImg(() => {
              this.$refs.saasRemindDialog.reinit(7, questionlist[paperIndex].mainContent, totalNum, method, paperIndex)
              this.isAgainOpen = false
              this.loading = false
            })
            return
          }
          this.$refs.saasRemindDialog.reinit(7, questionlist[paperIndex].mainContent, totalNum, method, paperIndex)
          this.isAgainOpen = false
          this.loading = false
          return
        }
        let typeIdx = 2
        if (hasError && this.method === 'formalexam') {
          typeIdx = 6
        }
        this.$refs.saasRemindDialog.init(typeIdx, questionlist[paperIndex].mainContent, totalNum, method, null, isClickLastOrNext)
        if (isClickLastOrNext) {
          this.ResetHandle()
          this.handleData()
          this.loading = false
        }
      }
    },
    // 一道一道题练习获取数据
    async getOnePracticalData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.examInfo.loadPaperIndex = 0
      if (this.method === 'train' || this.method === 'exam') {
        // 1
      } else {
        findPage(Object.assign({}, {
          size: this.page.pageSize,
          current: this.page.currentPage
        }), this.queryParams).then(res => {
          this.questionlist = res.data.records
          this.page.total = res.data.total
          if (this.page.currentPage === 1) {
            this.ResetHandle()
            this.handleData()
            if (this.isfinish && this.areaLoadFinish && this.staticFinish && this.bgLoadFinish) {
              this.$refs.saasRemindDialog.init(1, this.questionlist[0].mainContent, this.totalNum, '', null, this.isClickLastOrNext)
              this.loading = false
            } else {
              this.eventLoadImg(() => {
                this.$refs.saasRemindDialog.init(1, this.questionlist[0].mainContent, this.totalNum, '', null, this.isClickLastOrNext)
                this.loading = false
              })
            }
          } else {
            this.$refs.saasRemindDialog.init(2, this.questionlist[0].mainContent, this.totalNum, '', null, this.isClickLastOrNext)
            if (this.isClickLastOrNext) {
              this.ResetHandle()
              this.handleData()
              this.loading = false
            }
          }
        }).catch(() => {
          // 切换题目，请求出错，归位
          this.loading = false
          if (this.isClickLastOrNext === 2) {
            this.page.currentPage--
            this.examInfo.loadPaperIndex--
          } else if (this.isClickLastOrNext === 1) {
            this.page.currentPage++
            this.examInfo.loadPaperIndex++
          } else if (this.page.currentPage !== 1) {
            this.page.currentPage--
            this.examInfo.loadPaperIndex--
          }
          this.$refs.saasRemindDialog.init(9, '网络异常，请重试')
        })
      }
    },
    // 加载下一题数据
    LoadNextQut() {
      if (!this.isClickLastOrNext) {
        this.loading = true
        this.ResetHandle()
        this.handleData()
      } else {
        if (!this.areaLoadFinish) {
          this.changeHasErr = false
          this.$nextTick(() => {
            this.$refs.saasRemindDialog.init(8, '网络出错，请重新加载！')
          })
        } else {
          this.eventLoadImg(() => {
            this.loading = false
          })
        }
        if (this.changeHasErr) {
          this.changeHasErr = false
        }
        this.isClickLastOrNext = null // 重置初始化
      }
    },
    handleData() {
      const paperIndex = this.examInfo.loadPaperIndex
      const obj = this.questionlist[paperIndex]
      this.answer = obj.answer ? ((typeof obj.answer === 'object') && (obj.answer.constructor === Array) ? obj.answer : JSON.parse(obj.answer)) : []
      this.curStepObj = this.answer[0]
      this.curNode = this.answer[0].node
      this.lastNode = 0

      // 把所有图片保存在一个集合中，全部先预加载，减少后面切换不流畅
      // if(!this.method) {
      const imgList1 = []; const imgList2 = []
      this.answer.map(v => {
        v.areas.map(g => {
          if (g.area === 'AREA_1' && g.type === 'image') {
            imgList1.push({ 'imgUrl': g.content })
          }
          if (g.area === 'AREA_2' && g.type === 'image') {
            imgList2.push({ 'imgUrl': g.content })
          }
        })
      })

      this.area1ImgList = [].concat(imgList1)
      this.area2ImgList = [].concat(imgList2)
      this.areaLoadFinish = false
      this.areaLoad()
      // 非第一次加载
      if ((this.page.currentPage !== 1 || !this.isAgainOpen) && !this.isClickLastOrNext) {
        if (!this.areaLoadFinish) {
          this.eventLoadImg(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      } else if (this.isAgainOpen) {
        this.loading = false
      }

      this.examInfo.scene = obj.mainContent
      this.setExamData(this.curStepObj)
    },
    // 统一处理图片加载情况
    eventLoadImg(fun) {
      if (this.loadFinishTime) {
        clearTimeout(this.loadFinishTime)
        this.loadFinishTime = null
      }
      this.loadFinishTime = setTimeout(() => {
        if (this.isfinish && this.areaLoadFinish && this.staticFinish && this.bgLoadFinish) {
          clearTimeout(this.loadFinishTime)
          this.loadFinishTime = null
          this.loading = false
          return fun()
        } else {
          this.eventLoadImg(fun)
        }
      }, 800)
    },
    // 考试试题处理
    setExamData(item) {
      const areas = item.areas || []
      const custom = item.custom
      const ejects = item.ejects
      const wait = item.wait
      const keysArr = item.keys
      let hasArea1 = false
      const { curNode, lastNode } = this

      if (curNode <= lastNode) {
        // 节点倒推时,先把司机对话框和费显内容清空
        this.areaContentReset()
      }

      areas.map(v => {
        const keyName = v.area
        if (keyName === 'AREA_1') hasArea1 = true
        this.areaHandle(keyName, v.content, v)
      })

      if (!hasArea1) {
        // 当前节点 1区 内容没有返回，获取上一节点 1区 内容展示
        if (curNode <= lastNode) {
          // 节点倒推时才需要
          this.setArea1Cont(curNode)
        }
      }

      // 设置下一步有心跳效果的按键
      if (keysArr.length > 0) {
        const key = keysArr[0].key
        this.setClickKeyboardName(key)
      } else {
        this.ClickKeyboardName = ''
      }

      // 该节点的自定义弹框，没有时为null
      if (custom) {
        const cont = custom.content

        switch (cont) {
          case 'INPUT_VEHICLE': // 车牌输入
            this.vehicleShow = true
            this.$refs.vehicleChild.init(this.method, custom)
            break
          case 'INPUT_ZHIQUAN': // 纸劵输入
            this.zhiquanShow = true
            this.$refs.zhiquanChild.init(this.method, custom)
            break
          case 'INPUT_KAHAO': // 卡号输入
            this.kahaoShow = true
            this.$refs.kahaoChild.init(this.method, custom)
            break
          case 'INPUT_SHOUFEIZHAN': // 收费站输入
            this.shoufeizhanShow = true
            this.$refs.shoufeizhanChild.init(this.method, custom)
            break
          case 'INPUT_RUKOUSHIJIAN': // 入口时间输入
            this.rukoushijianShow = true
            this.$refs.rukoushijianChild.init(this.method, custom)
            break
          default:
            break
        }
      }

      if (ejects) {
        // 动图中间弹框，只存在于抬杆和打印发票动图，串行显示
        const ejectArr = ejects.ejectArr.split(',')
        this.ejectsHandle(ejects, ejectArr[0])
      }

      if (wait) {
        // 等待毫秒数自动跳转，如果为-1，默认等待操作跳转
        setTimeout(() => {
          this.jumpHandle(wait.jump)
        }, wait.time)
      }
    },
    // 设置下一步有心跳效果的按键
    setClickKeyboardName(key) {
      if (key.indexOf(',') !== -1) {
        // 串行
        const serial = key.split(',')
        for (const item in serial) {
          if (serial[item].indexOf(':') !== -1) {
            const orArr = serial[item].split(':')
            this.ClickKeyboardName = orArr[0]
          } else {
            this.ClickKeyboardName = serial[0]
          }
        }
      } else if (key.indexOf(':') !== -1) {
        // 或
        const orArr = key.split(':')
        this.ClickKeyboardName = orArr[0]
      } else {
        // 单个
        this.ClickKeyboardName = key
      }
    },
    // 区域内容显示
    areaHandle(name, content, item) {
      switch (name) {
        case 'AREA_1':
          if (item.loadImg) {
            this.areaContent.area1_img = item.loadImg
          } else {
            this.areaContent.area1_img = content
          }
          break
        case 'AREA_2':
          if (item.loadImg) {
            this.areaContent.area2_img = item.loadImg
          } else {
            this.areaContent.area2_img = content
          }
          break
        case 'AREA_3_TEXT':
          this.areaContent.area3_txt = content
          break
        case 'AREA_4_TEXT1':
          this.areaContent.area4_txt1 = content
          break
        case 'AREA_4_TEXT2':
          this.areaContent.area4_txt2 = content
          break
        case 'AREA_4_TEXT3':
          this.areaContent.area4_txt3 = content
          break
        case 'AREA_4_TEXT4':
          this.areaContent.area4_txt4 = content
          break
        case 'AREA_4_TEXT5':
          this.areaContent.area4_txt5 = content
          break
        case 'AREA_4_TEXT6':
          this.areaContent.area4_txt6 = content
          break
        case 'AREA_4_TEXT7':
          this.areaContent.area4_txt7 = content
          break
        case 'AREA_4_TEXT8':
          this.areaContent.area4_txt8 = content
          break
        default:
          break
      }
    },
    // 清空司机对话框和费显内容，即 3区 和 4区 的内容
    areaContentReset() {
      this.areaContent.area3_txt = ''
      this.areaContent.area4_txt1 = ''
      this.areaContent.area4_txt2 = ''
      this.areaContent.area4_txt3 = ''
      this.areaContent.area4_txt4 = ''
      this.areaContent.area4_txt5 = ''
      this.areaContent.area4_txt6 = ''
      this.areaContent.area4_txt7 = ''
      this.areaContent.area4_txt8 = ''
    },
    // 1区内容显示处理
    setArea1Cont(curNode) {
      // 当前节点 1区 内容没有返回，获取上一节点 1区 内容展示，一直到找到为止
      const answer = this.answer
      const _item = answer.find(v => { return v.node === curNode - 1 })
      if (_item) {
        const child = _item.areas.find(v => { return v.area === 'AREA_1' })
        if (child) {
          this.areaContent.area1_img = child.content
          this.lastNode = curNode - 1
        } else {
          this.setArea1Cont(curNode - 1)
        }
      }
    },
    // 刷卡扫码
    clickCardOrcode(btnType) {
      if (!this.isActivate) {
        return
      }
      const { curStepObj } = this
      const keysArr = curStepObj.keys
      let hasStep = false
      let jump = null

      if (keysArr.length === 0) {
        if (this.method !== 'formalexam') {
          this.$refs.saasRemindDialog.init(4, '操作错误，请选择正确的操作')
        } else {
          this.jumpHandle(-1, true)
        }
        return
      }

      keysArr.map(v => {
        const key = v.key
        if (key.indexOf(',') !== -1) {
          // 串行
          const serial = key.split(',')
          const len = serial.length
          for (const item in serial) {
            const idx = Number(item)
            if (serial[idx].indexOf(':') !== -1) {
              const orArr = serial[idx].split(':')
              for (const k in orArr) {
                if (orArr[k] === btnType) {
                  if (idx === len - 1) {
                    // 串行最后一个
                    jump = v.jump
                    hasStep = true
                  } else if (idx === 0) {
                    this.serialIndex = 0
                    hasStep = true
                  } else if (this.serialIndex === idx - 1) {
                    this.serialIndex = idx
                    hasStep = true
                  }
                  break
                }
              }
            } else {
              if (serial[idx] === btnType) {
                if (idx === 0) {
                  this.serialIndex = 0
                  hasStep = true
                } else if (idx === len - 1) {
                  hasStep = true
                  jump = v.jump
                } else if (this.serialIndex === idx - 1) {
                  this.serialIndex = idx
                  hasStep = true
                }
              }
            }
          }
        } else if (key.indexOf(':') !== -1) {
          // 或
          const orArr = key.split(':')
          for (const item in orArr) {
            const idx = Number(item)
            if (orArr[idx] === btnType) {
              hasStep = true
              jump = v.jump
              break
            }
          }
        } else {
          if (key === btnType) {
            hasStep = true
            jump = v.jump
          }
        }
      })

      if (hasStep) {
        if (btnType === 'KEY_SCAN') {
          this.isScanCode = true
          if (this.cardTimes) {
            clearTimeout(this.cardTimes)
            this.cardTimes = null
          }
          this.ClickKeyboardName = ''

          this.cardTimes = setTimeout(() => {
            this.isScanCode = false
            if (jump) {
              this.jumpHandle(jump)
            }
          }, 2000)
        } else {
          this.isPayCard = true
          if (btnType === 'KEY_ETC') {
            this.clickType = 'etc'
          } else {
            this.clickType = 'cpc'
          }
          if (this.codeTimes) {
            clearTimeout(this.codeTimes)
            this.codeTimes = null
          }

          if (jump) {
            this.jumpHandle(jump)
          }
          this.codeTimes = setTimeout(() => {
            this.isPayCard = false
          }, 2000)
        }
      } else {
        if (this.method !== 'formalexam') {
          this.$refs.saasRemindDialog.init(4, '操作错误，请选择正确的操作')
        } else {
          this.jumpHandle(-1, true)
        }
      }
    },
    // 点击键盘
    clickKeyboard(name, idx, type, letter) {
      if (!this.isActivate) {
        return
      }

      const { curStepObj } = this

      if (this.keyboardTimes) {
        clearTimeout(this.keyboardTimes)
        this.keyboardTimes = null
      }

      const keysArr = curStepObj.keys
      const custom = curStepObj.custom
      const ejects = curStepObj.ejects

      // 自定义弹窗
      if (custom) {
        if (this.vehicleShow) {
          this.$refs.vehicleChild.select(name, this.method)
        } else if (this.kahaoShow) {
          this.$refs.kahaoChild.select(name, this.method)
        } else if (this.shoufeizhanShow) {
          this.$refs.shoufeizhanChild.select(name, letter, this.method)
        } else if (this.zhiquanShow) {
          this.$refs.zhiquanChild.select(name, this.method)
        } else if (this.rukoushijianShow) {
          this.$refs.rukoushijianChild.select(name, this.method)
        }
      }

      if (keysArr.length > 0) {
        // 按键
        this.keysHandle(keysArr, name)
      }

      if (ejects) {
        // 中间动图弹框
        this.ejectsHandle(ejects, name)
      }
    },
    // 输入组件确认后返回父组件
    popupReturn(isRight, msg, jump) {
      if (isRight) {
        this.shoufeizhanShow = false
        this.kahaoShow = false
        this.vehicleShow = false
        this.zhiquanShow = false
        this.rukoushijianShow = false
        this.jumpHandle(jump)
      } else {
        if (this.method === 'formalexam') {
          // 只要错误，直接进入下一题
          this.jumpHandle(-1, true)
        } else {
          // 练习模式
          this.$refs.saasRemindDialog.init(4, msg)
        }
      }
    },
    // 子组件设置心跳
    setClickKeyboardNameReturn(key, isRight) {
      if (this.method !== 'formalexam') {
        if (isRight) {
          this.setClickKeyboardName(key)
        } else {
          this.$refs.saasRemindDialog.init(4, '操作错误，请选择正确的操作')
        }
      }
    },
    // 按键处理
    keysHandle(keysArr, name) {
      let clickyes = false
      const nameArr = name.split('|')
      keysArr.map(v => {
        const key = v.key
        if (key.indexOf(',') !== -1) {
          // 串行
          const serial = key.split(',')
          const len = serial.length
          for (const item in serial) {
            const idx = Number(item)
            if (serial[idx].indexOf(':') !== -1) {
              const orArr = serial[idx].split(':')
              for (const k in orArr) {
                const _name = nameArr.find(n => n === orArr[k])
                if (_name) { // orArr[k] === name
                  if (idx === len - 1) {
                    // 串行最后一个
                    clickyes = true
                    this.jumpHandle(v.jump)
                  } else if (idx === 0 || this.serialIndex === idx - 1) {
                    this.serialIndex = idx
                    clickyes = true

                    const nextS = serial[Number(item) + 1]
                    const nextSOrArr = nextS.split(':')
                    this.ClickKeyboardName = nextSOrArr[0]
                  }
                  break
                }
              }
            } else {
              const _name = nameArr.find(n => n === serial[idx])
              if (_name) { // serial[idx] === name
                if (idx === len - 1) {
                  clickyes = true
                  this.jumpHandle(v.jump)
                } else if (idx === 0 || this.serialIndex === idx - 1) {
                  this.serialIndex = idx
                  clickyes = true
                  const nextS = serial[Number(item) + 1]
                  const nextSOrArr = nextS.split(':')
                  this.ClickKeyboardName = nextSOrArr[0]
                }
              }
            }
          }
        } else if (key.indexOf(':') !== -1) {
          // 或
          const orArr = key.split(':')
          for (const item in orArr) {
            const _name = nameArr.find(n => n === orArr[item])
            if (_name) { // orArr[item] === name
              clickyes = true
              this.jumpHandle(v.jump)
              break
            }
          }
        } else {
          // 单个
          const _name = nameArr.find(n => n === key)
          if (_name) { // key === name
            clickyes = true
            this.jumpHandle(v.jump)
            return
          }
        }
      })

      if (!clickyes) {
        if (this.method !== 'formalexam') {
          // 除正式考试外
          this.$refs.saasRemindDialog.init(4, '操作错误，请选择正确的操作')
        } else {
          this.jumpHandle(-1, true)
        }
      }
    },
    // 跳转节点处理
    jumpHandle(jump, hasError) {
      // hasError 为true  该题有错，直接下一题，仅针对考核模式
      this.serialIndex = null
      if (jump === -1) {
        const { totalNum, page, formItem, curQuestionId } = this
        const _date = new Date()
        const testPaperList = formItem.testPaper
        let idx = null
        let timeNum = 0

        testPaperList.map((v, i) => {
          let correct = 1
          timeNum += v.time
          if (v.questionId === curQuestionId) {
            // 取整，避免小数部分
            let diff = parseInt((_date.getTime() - this.examInfo.prefixOpenTime.getTime()) / 1000) // 秒
            const userTime = moment(_date).format('YYYY-MM-DD HH:mm:ss')
            this.examInfo.prefixOpenTime = _date
            this.examInfo.prefixUsedTime = this.examInfo.usedTime
            timeNum += diff

            diff += v.time
            diff = parseInt(diff)
            let operationScore = 0
            let timeScore = 0
            if (this.method !== 'formalexam') {
              operationScore = v.operPoints
              if (diff <= v.consumingTime) {
                // 耗时得分
                timeScore = v.timePoints
              }
            } else {
              if (hasError) {
                correct = 0
              } else {
                operationScore = v.operPoints
                if (diff <= v.consumingTime) {
                  // 耗时得分
                  timeScore = v.timePoints
                }
              }
            }

            const points = operationScore + timeScore

            const _obj = {
              userTime: userTime,
              correct: correct,
              time: diff,
              points,
              operationScore,
              timeScore,
              isFinish: true }

            idx = i
            Object.assign(this.formItem.testPaper[i], _obj)
          }
        })

        if ((idx || idx === 0) && this.method === 'formalexam') {
          this.formItem.temporaryStorage[idx] = {}
          Object.assign(this.formItem.temporaryStorage[idx], this.formItem.testPaper[idx])
        }

        // 更正截止当前题用的总耗时，减少误差
        this.examInfo.usedTime = timeNum

        this.ClickKeyboardName = ''
        if (totalNum === page.currentPage) {
          // 最后一题，结束，计时停止
          if (this.times) {
            clearTimeout(this.times)
            this.times = null
          }
          this.examInfo.endTime = _date
          if (this.method) {
            // 所有任务完成后，自动跳转clickSubmit逻辑，公共处理
            this.clickSubmit()
          } else {
            // 个人练习，表示练习结束
            this.$refs.saasRemindDialog.init(3, '', totalNum)
          }
        } else {
          // 下一题
          this.page.currentPage++
          this.examInfo.loadPaperIndex++
          this.getData(hasError)
          this.TemporaryData(true)
        }
      } else {
        const hasItem = this.answer.find(v => { return v.node === jump })
        if (hasItem) {
          this.lastNode = this.curNode
          this.curNode = jump
          this.curStepObj = hasItem
          this.setExamData(hasItem)
        }
      }
    },
    // 动图弹框处理
    ejectsHandle(ejects, name, isLoop) {
      const ejectArr = ejects.ejectArr.split(',')
      const len = ejectArr.length
      const jump = ejects.jump

      for (const item in ejectArr) {
        const idx = Number(item)
        if (ejectArr[idx] === name) {
          if (idx === 0) {
            this.isShowGif = true
            if (len === 1) {
              setTimeout(() => {
                this.isShowGif = false
                this.jumpHandle(jump)
              }, 1000)
            }
          } else if (idx === len - 1 && len > 1) {
            setTimeout(() => {
              this.isShowGif = false
              this.jumpHandle(jump)
            }, 1000)
            return
          }
          if (ejectArr[idx] === 'EJECT_TAIGAN') {
            this.gifType = 'taigan'
          } else if (ejectArr[idx] === 'EJECT_PRINT') {
            this.gifType = 'invoice'
          }

          if (len > 1) {
            setTimeout(() => {
              if (ejectArr[idx + 1] === 'EJECT_TAIGAN') {
                this.gifType = 'taigan'
              } else if (ejectArr[idx + 1] === 'EJECT_PRINT') {
                this.gifType = 'invoice'
              }
              this.ejectsHandle(ejects, ejectArr[idx + 1], true)
            }, 1000)
          }

          return
        }
      }
    },
    // 暂停或继续
    async suspendOrContinue(type) {
      const examSessionId = this.formItem.examHistoryId
      const useTime = this.examInfo.usedTime
      const answerResult = this.formItem.testPaper
      const curQuestionId = this.curQuestionId
      const _date = new Date()
      const formatDate = moment(_date).format('YYYY-MM-DD HH:mm:ss')

      if (type === 1) {
        // 当前是激活状态，点击后变为暂停，按钮同步变化为继续
        // 练习模式
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        this.isActivate = false
        this.examInfo.suspendDate = _date

        answerResult.map((v, i) => {
          if (v.questionId === curQuestionId) {
            let diff = (_date.getTime() - this.examInfo.prefixOpenTime.getTime()) / 1000 // 秒
            diff = parseInt(diff)
            v.time += diff
          }
        })
        if (this.method === 'formalexam') {
          // 仅针对考核模式
          const _obj = { suspendTime: formatDate, consumeTime: parseInt(useTime) }
          await startOrSuspend(examSessionId, _obj)
        }
      } else {
        this.isActivate = true
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        this.examInfo.prefixOpenTime = _date
        this.countDown() // 倒计时
        if (this.method === 'formalexam') {
          const _obj = { startTime: formatDate }
          await startOrSuspend(examSessionId, _obj)
        }
      }
    },
    // 提交
    clickSubmit() {
      const answerResult = this.formItem.testPaper
      const curQuestionId = this.curQuestionId
      const _date = new Date()

      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }

      // 有可能超过最终的deadline，但实际耗时需要控制好
      let lastDate = _date
      if (lastDate >= this.examInfo.deadlineTime) {
        lastDate = this.examInfo.deadlineTime
        // 总时间设置最大耗时
        this.examInfo.usedTime = this.examInfo.examTimeMinutes * 60
      }
      this.examInfo.endTime = lastDate

      // 设置最后一道题的耗时
      let prefixTotalTime = 0
      answerResult.map((v, i) => {
        if (v.questionId !== curQuestionId) {
          prefixTotalTime += v.time
        }
      })
      const lastQuestionTime = this.examInfo.usedTime - prefixTotalTime

      answerResult.map((v, i) => {
        if (v.questionId === curQuestionId) {
          v.time = lastQuestionTime
          v.userTime = moment(lastDate).format('YYYY-MM-DD HH:mm:ss')
          this.examInfo.prefixOpenTime = lastDate
        }
      })
      this.showCj = answerResult
      // 正式考试下，自动提交考试成绩，成功后才能显示成绩信息
      if (this.method === 'formalexam') {
        this.submit()
      } else {
        // 模拟考试等，先显示成绩信息，在弹窗框中手动点击提交成绩
        this.$refs.saasRemindDialog.init(5, '', this.totalNum, this.method, this.showCj)
      }
    },
    // 交卷
    submit() {
      if (this.method !== 'formalexam') {
        this.comfireVisible = true
      }
      try {
        const answerResult = this.formItem.testPaper
        this.examSubmit(answerResult)
      } catch {
        this.comfireVisible = false
      }
    },
    async examSubmit(answerResult) {
      const { formItem, examInfo, dataList, queryParams } = this
      const infoObj = {
        'examNumId': formItem.examNumId,
        'startTime': moment(examInfo.openTimeFirst).format('YYYY-MM-DD HH:mm:ss'),
        'endTime': moment(examInfo.endTime).format('YYYY-MM-DD HH:mm:ss'),
        'questionTypeSort': dataList.questionTypeSort,
        'examSessionId': dataList.examSessionId, // "真实考试填写：会话id"
        'subjectId': queryParams.examInfo.subjectId, // "综合训练填写：科目id",
        'sectionId': queryParams.examInfo.sectionId, // "综合训练填写：章节id",
        'knowledgeId': queryParams.examInfo.knowledgeId, // "综合训练填写：知识点id",
        'totalConsumeTime': parseInt(examInfo.usedTime), // 总耗时
        'userAnswers': answerResult
      }
      await ExamSubmitAnswer(this.formItem.examMode, infoObj).then(res => {
        this.$notify.success('提交成功')
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        this.comfireVisible = false
        if (this.method !== 'formalexam') {
          this.DialogClose()
        } else {
          // 正式考试后，必须展示成绩信息，然后在弹出框点击“好的”关闭窗口
          this.$refs.saasRemindDialog.init(5, '', this.totalNum, this.method, this.showCj)
        }
      }).catch(err => {
        this.comfireVisible = false
        // 10 用来做提交后重试
        this.$refs.saasRemindDialog.init(10, '网络异常，请重新提交成绩')
      })
    },
    // 请求失败
    requestReLoad() {
      this.loading = false
      if (this.method === 'formalexam') {
        this.submit()
      } else if (!this.method && !this.isClickLastOrNext && this.page.currentPage === 1) {
        // 个人练习，首次加载，请求失败，重新请求，相当于重新练习
        this.practicalAgain()
      }
    },
    // 正式考试中，定时保存数据
    setTimeSave() {
      // 正式考试中，定时保存数据
      if (this.method === 'formalexam') {
        // 每隔10s记录一下最新答案
        if (this.answerTimes) {
          clearTimeout(this.answerTimes)
          this.answerTimes = null
        }
        this.answerTimes = setTimeout((t) => {
          this.TemporaryData()
        }, 10000)
      }
    },
    // 暂存
    TemporaryData(issave) {
      // 非考核模式，不需要定时保存
      if (this.method !== 'formalexam') {
        return
      }
      if (issave) {
        // 直接保存
        if (this.answerTimes) {
          clearTimeout(this.answerTimes)
          this.answerTimes = null
        }
        ExamDrafts(this.formItem.examHistoryId, this.formItem.temporaryStorage)
      }
    },
    // 个人练习，切换题目
    switchTopics(type) {
      if (type === 1) {
        this.page.currentPage--
        this.examInfo.loadPaperIndex--
      } else {
        this.page.currentPage++
        this.examInfo.loadPaperIndex++
      }

      this.isClickLastOrNext = type
      this.loading = true

      this.ResetHandle()
      this.getData()
    },
    clearInterval(type) {
      let canContinue = true
      if (this.times) {
        clearTimeout(this.times)
        this.times = null

        // 页签离开时，仅循环或死掉也无所谓
        if (this.isLeave) {
          this.times = setTimeout(() => {
            if (type === 1) {
              this.countTime()
            } else {
              this.countDown()
            }
          }, 1000)
          canContinue = false
        }
      }

      return canContinue
    },
    // 顺序计时
    countTime() {
      const canContinue = this.clearInterval(1)
      if (!canContinue) {
        return
      }

      // 存在离开时间的情况下，附加耗时（进入实操时注意该时间必须初始化为null）
      if (this.leaveTime) {
        // 获取区间耗时
        const now = new Date()
        const time = parseInt((now.getTime() - this.leaveTime.getTime()) / 1000)
        this.examInfo.examTime += time
        this.leaveTime = null
      }

      this.times = setTimeout(() => {
        this.examInfo.examTime++
        this.examInfo.timeText = this.secondToDate(this.examInfo.examTime)
        this.countTime()
      }, 1000)
    },
    // 倒序计时
    countDown() {
      const canContinue = this.clearInterval(2)
      if (!canContinue) {
        return
      }

      // 存在离开时间的情况下，附加耗时（进入实操时注意该时间必须初始化为null）
      if (this.leaveTime) {
        // 获取区间耗时
        const now = new Date()
        const time = parseInt((now.getTime() - this.leaveTime.getTime()) / 1000)
        this.examInfo.usedTime += time
        this.examInfo.surplusTime -= time
        this.leaveTime = null
      }

      const openFirst = this.examInfo.openTimeFirst.getTime()
      const usedTime = this.examInfo.usedTime
      const currentTime = (new Date()).getTime()
      // 多次进入考试，并时间到了
      if (openFirst !== currentTime && usedTime >= this.examInfo.examTimeMinutes * 60) {
        this.examInfo.surplusTime = 0
        this.examInfo.timeText = '00:00:00'
        if (this.times) {
          clearTimeout(this.times)
          this.times = null
        }
        // 时间到，自动调用提交按钮，模拟提交
        this.clickSubmit()
      } else if (this.examInfo.surplusTime === 0) {
        this.$notify.success('交卷时间到')
        // 时间到，自动调用提交按钮，模拟提交
        this.clickSubmit()
      } else {
        this.times = setTimeout(() => {
          this.examInfo.surplusTime--
          this.examInfo.usedTime++
          this.examInfo.timeText = this.secondToDate(this.examInfo.surplusTime, 2)
          this.countDown()
        }, 1000)
      }
    },
    // 重新练习
    practicalAgain() {
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }

      // 有method情况下，需要重新初始化信息，为空代表个人练习，只需重新获取数据即可
      if (this.method) {
        // 上次已经存储的试题信息，重新渲染考试，一切初始化
        this.commonInit(this.method)
        this.handleExamInfo(this.practicalAgainExam)
        this.getData()
      } else {
        this.practicalOneByOneAgain()
      }
    },
    // 关闭
    DialogClose() {
      this.Close()
    },
    practicalEnd() {
      this.endVisible = false
      this.Close()
    },
    // 弹框关闭监听
    beforeClose() {
      if (this.fullscreen) {
        this.screen()
      }
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }
    },
    stopSrcoll() {
      const mo = function(e) { e.preventDefault() }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false)// 禁止页面滑动
    },
    openSrcoll() {
      const mo = function(e) { e.preventDefault() }
      document.body.style.overflow = ''// 出现滚动条
      document.removeEventListener('touchmove', mo, false)
    },
    Close() {
      if (this.fullscreen) {
        this.screen()
      }
      if (this.times) {
        clearTimeout(this.times)
        this.times = null
      }
      if (this.cardTimes) {
        clearTimeout(this.cardTimes)
        this.cardTimes = null
      }
      if (this.codeTimes) {
        clearTimeout(this.codeTimes)
        this.codeTimes = null
      }
      if (this.loadFinishTime) {
        clearTimeout(this.loadFinishTime)
        this.loadFinishTime = null
      }
      this.isfinish = false
      this.visible = false
      this.openSrcoll()
    },
    // 设置全屏
    screen() {
      try {
        const element = document.documentElement
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen()
          }
        }
        this.fullscreen = !this.fullscreen
      } catch (error) {
        // error
      }
    },
    // 清除
    ResetHandle() {
      // this.curIndex = 0 // 当前题目索引
      this.answer = []
      this.lastNode = 0
      this.curNode = 0
      this.curStepObj = {}
      this.serialIndex = null
      this.isShowGif = false
      this.isPayCard = false // 是否点击了刷卡
      this.isScanCode = false // 是否点击了扫码
      this.vehicleShow = false
      this.kahaoShow = false
      this.shoufeizhanShow = false
      this.zhiquanShow = false
      this.rukoushijianShow = false
      this.areaContent = {
        area1_img: this.page.currentPage === 1 ? '' : this.areaContent.area1_img,
        area2_img: '',
        area3_txt: '',
        area4_txt1: '',
        area4_txt2: '',
        area4_txt3: '',
        area4_txt4: '',
        area4_txt5: '',
        area4_txt6: '',
        area4_txt7: '',
        area4_txt8: ''
      }
    },
    // 输出00:00:00  时分秒
    secondToDate(result, method) {
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      if (method === 2) {
        result = h + ':' + m + ':' + s
        return result
      } else {
        result = h + '小时' + m + '分钟' + s + '秒'
        return result
      }
    },
    KeyDown(event) {
      // 屏蔽 F11 、 F12
      if (event.keyCode === 122 || event.keyCode === 123) {
        event.returnValue = false
        event.cancelBubble = true
        return false
      }
    },
    formatterCont(txt) {
      // 适用于司机对话框
      if (txt) {
        const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
        return txt.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
          return arrEntities[t]
        })
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.dialog-box >>> .el-dialog__header{
  display: none;
}
.dialog-box >>> .el-dialog__body{
  padding: 0;
}
.dialog-box >>> .el-loading-mask{
  background: rgba(0, 0, 0, 0.25);
}
.main{
  padding: 1vh;
  font-size: 20px;
  /* 用于全屏显示，避免某种情况下某main下有width：960px ，导致宽度未能全屏*/
  width: 100% !important;
}
@media (max-width: 1400px) {
  .main {
    font-size: 20px;
  }
}
@media (max-width: 1200px) {
  .main {
    font-size: 16px;
  }
}
@media (max-width: 992px) {
  .main {
    font-size: 14px;
  }
}
@media (max-width: 768px) {
  .main {
    font-size: 10px;
  }
}
.topMain{
  margin-bottom: 1vh;
  height: 25vh;
  /* background-color: red; */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topLeftMain{
  width: 60%;
  margin-right: 1%;
  height: 100%;
  background-image: url('~@/assets/img/train/practical/feiexianshiqi/beijing.png');
  background-size: 100% 100%;
  /* background-color: green; */
  padding: 1vh 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.topRightMain{
  height: 100%;
  width: 39%;
  background-image: url('~@/assets/img/train/practical/shicaolianxi/chedaoyingji.png'),url('~@/assets/img/train/practical/shicaolianxi/beijing.png');
  background-size: 100% 100%,100% 100%;
  position: relative;
}
.bottomMain{
  height: 72vh;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottomLeftMain{
  width: 60%;
  margin-right: 1%;
  height: 100%;
  position: relative;
}
.bottomRightMain{
  height: 100%;
  width: 39%;
}
.B_rightTopBox{
  width: 100%;
  height: 28.5vh;
  margin-bottom: 1vh;
  background-image: url('~@/assets/img/train/practical/shuakasaoma/beijing.png');
  background-size: 100% 100%;
  padding: 2%;
  box-sizing: border-box;
}
.B_rightBottomBox{
  width: 100%;
  height: 42.5vh;
  text-align: center;
  background-image: url('~@/assets/img/train/practical/jianpan1/beijing.png');
  background-size: 100% 100%;
  color: #333;
  box-sizing: border-box;
}
.t_l_box1{
  flex: 1;
  height: 94%;
  border-radius: 20px;
  border: 2px solid yellow;
  overflow: hidden;
}
.t_l_box1 img{
  height: 100%;
  width: 100%;
  border-radius: 20px;
}
.t_l_box2{
  flex: 1;
  height: 94%;
  margin: 0 2%;
  border-radius: 20px;
  background-image: url('~@/assets/img/train/practical/feiexianshiqi/duihua.png');
  background-size: 100% 100%;
  position: relative;
  padding: 2% 2% 2% 4%;
  box-sizing: border-box;
  font-weight: bold;
  letter-spacing: 2px;
}
.t_l_box_hide{
  visibility: hidden;
}
/* .t_l_box2::after{
    position:absolute;
    content: "";
    width: 0px;
    height: 0px;
    left: -40px;
    top: 44%;
    border-bottom: 20px solid transparent;
    border-left: 20px solid transparent;
    border-top: 20px solid transparent;
    border-right: 20px solid yellow;
} */
.t_l_box3{
  flex: 1;
  height: 98%;
  text-align: center;
  color: #fff;
}
.t_l_box3 .feieBox{
  height: 85%;
  width: 100%;
  background: url('~@/assets/img/train/practical/feiexianshiqi/feixianxianshiping.png') no-repeat;
  background-size: 100% 100%;
  font-size: 1vh;
}
.feieBox{
  padding:2vh 12% 0 10%;
  box-sizing: border-box;
}
.feieBox>div{
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: red;
  margin-top: 1.2vh;
}
.topButton{
  position: absolute;
  right: 5%;
  top: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 36%;
}
.topButton img{
  margin-left: 2%;
  width: 30%;
}
.fzButton1{
  /* font-size: 1rem; */
  color: #fff;
  font-weight: bold;
  margin-top: 1.2vh;
  margin-left: 4%;
}
.fzButton2{
  /* font-size: 1rem; */
  color: yellow;
  font-weight: bold;
  position: absolute;
  right: 3%;
  bottom: 6%;
  min-width: 359px;
  max-width: 95%;
}
.fzButton3{
  /* font-size: 15px; */
  color: yellow;
  font-weight: bold;
  margin-top: 1vh;
  /* position: absolute;
  right: 3%;
  bottom: 6%; */
}
.bottomLeftMain img{
  height: 100%;
  width: 100%;
}
.shuakaButton{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 64%;
  margin-right: 4%;
}
.saomaButton{
  width: 32%;
  max-width: 165px;
}
.shuakaButton img,.saomaButton img{
  width: 98%;
}
.shuakaBox{
  height: 8vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.saomaBox{
  text-align: center;
  height: 18.5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.shuakaImg{
  width: 64%;
  margin-right: 4%;
}
.saomaImage{
  width: 32%;
  max-width: 165px;
}
.shuakaImg,.saomaImage{
  height: 100%;
}
.shuakaImg img{
  height: 100%;
  margin: 0 auto;
}
.saomaImage img{
  width: 84.5%;
  height: 100%;
}

.windowMain{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: none;
}
.centerImage img{
  width: 100%;
}
.windowBox1{
  width: 400px!important;
}
.windowBox2{
  width: 600px!important;
}
.windowBox4,.windowBox5{
  width: 540px!important;
}
.windowBox3{
  width: 500px!important;
}
.windowBox2 input{
  width: 250px;
}
.windowBox2 .divList{
  width: 200px;
  height: 250px;
  border: 1px solid #ddd;
}
.windowBox1,.windowBox2,.windowBox3,.windowBox4,.windowBox5{
  border: 1px solid #999;
  display: none;
}
.windowTop{
  background: linear-gradient(rgb(76, 144, 245), #fff);
  height: 30px;
  padding-left: 3px;
  font-weight: bold;
  line-height: 30px;
  font-size: 14px;
}
.windowBox1 .windowMainBox,.windowBox3 .windowMainBox{
  padding:10px 20px;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowBox2 .windowMainBox{
  padding:5px 20px;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowBox4 .windowMainBox,.windowBox5 .windowMainBox{
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowMainBox input{
  border: 1px solid #e1e1e1;
  width: 200px;
  height: 25px;
  line-height: 25px;
  padding-left: 5px;
  outline: none;
}
input[type=number] {
  -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.windowDesc{
  height: 30px;
  line-height: 30px;
  padding-left: 3px;
  font-size: 16px;
  color: #333;
  background-color: #f5f5f5;
}
.red{
  color: red;
}
.fz12{
  font-size: 12px;
}
textarea{
  resize: none;
  outline: none;
  border: 1px solid #e1e1e1;
  width: 200px;
}
.lineTitle{
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 10px;
  position: absolute;
  background-color: #fff;
  padding: 0 5px;
  left: 16px;
  top: -10px;
}
.textAreaBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.topInput{
  height: 40px;
  color: red;
  background-color: #fff;
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.inputMain{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.inputColor{
  text-align: center;
}
.inputColor>div{
  height: 30px;
  line-height: 30px;
  width: 120px;
  border: 1px solid #999;
}
.inputNumber{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 420px;
}
.inputNumber>div{
  width: 138px;
  height: 73.5px;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.inputN{
  text-align: center;
  height: 73.5px;
  line-height: 73.5px;
  width: 40px;
  background-color: rgb(62, 144, 236);
  font-weight: bold;
  font-size: 30px;
}
.jianpan{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: #f5f5f5;
  width: 97px;
}
.jianpan>div{
  width: 31px;
  height: 24px;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
  line-height: 24px;
  text-align: center;
}
.borderMain{
  border: 1px #999 solid ;
  border-radius: 5px;
  padding: 10px 20px;
  position: relative;
  margin:20px 0;
}
.stItem{
  width: 100%;
  background-color: #e2e3e4;
  color: red;
  height: 30px;
  line-height: 30px;
  padding-left: 4px;
  font-size: 12px;
}
.active{
  background-color: #3d95ff;
}
.active1,.active2{
  background-color: #3d95ff;
  color: red;
}
.province{
  font-weight: bold;
  font-size: 67px;
  width: 98px;
  text-align: center;
}
.time-text{
  display: inline-block;
  margin-right: 20px;
}

@keyframes myfirst {
  0% {
    transform:scale(1);
  }
  30% {
    transform:scale(1.4);
  }
  100% {
    transform:scale(1);
  }
}
@keyframes myfirst2 {
  0% {
    transform:scale(1);
  }
  30% {
    transform:scale(1.2);
  }
  100% {
    transform:scale(1);
  }
}

.jianpanLeftImage.cur,.jianpanRightImage.cur{
  animation: myfirst 1.5s infinite;
}
.shua-btn.cur {
  animation: myfirst2 1.5s infinite;
}
.centerImage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
