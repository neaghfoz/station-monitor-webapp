<template>
  <div
    id="login"
    class="container" :style="'background-image:url('+ Background +');background-size: cover;'"
  >
    <theme-picker v-show="false"/>
    <div class="login-self-weaper">
      <div class="login-self-left">
        <div>
          <div style="top: 5%;" class="login-self-left-header">
            <img
              :src="logoUrl"
              alt=""
              style="height: 40px;vertical-align: middle;"
            >
            <span class="login-title">{{ logIndexTitle }}</span>
           <!-- <span class="login-desc">综合集中管理,&nbsp;让路段数字化运营更高效</span> -->
          </div>
          <div>
            <!-- <img
              src="/img/tu1.webp"
              alt=""
              :style="{ height: loginImgHeight + 'px' , width: loginImgWidth + 'px'}"
            > -->
          </div>
          <!-- <pre class="login-left-company">{{ company }}</pre> -->
          <br/>
          <pre class="login-left-company" style="bottom: 2%">{{ hgCompany }}</pre>
        </div>
      </div>
      <div class="login-self-border">
        <!-- <img
          src="img/bj.png"
          alt=""
          :style="{width: '100%',height: '100%', position: 'absolute', right: '0px'}"
        > -->
        <div class="login-self-main" :style="{ height: loginMainHeight + 'px' , width: loginMainWidth + 'px'}">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="账号登录" name="userLogin">
              <div class="select-time"><p v-for="(item,i) in selectList" :key="i" @click='sz(i)' :class="{current:sFlag==i,Scolor}">{{item}}</p></div>
              <div class="but" v-if="selectflag==false" @click="butclick(i)"></div>
              <userLogin
                ref="userLogin"
              />
            </el-tab-pane>
          </el-tabs>

        </div>

      </div>
    </div>
    <selectDialog v-if="showDialog"/>
  </div>
</template>
<script>
import userLogin from 'ecip-web/views/login/userlogin'
import {title, logIndexTitle, company, logo, hgCompany} from '@/settings'
import ThemePicker from 'ecip-web/components/ThemePicker'
import selectDialog from 'ecip-web/components/DialogPath/index.vue'

export default {
  name: 'Login',
  components: {
    userLogin,
    ThemePicker,
    selectDialog
    // codeLogin
  },
  props: [],
  data() {
    return {
      time: '',
      title: title,
      logIndexTitle: logIndexTitle,
      company: company,
      hgCompany: hgCompany,
      logoUrl: logo.src,
      activeTab: 'userLogin',
      screenHeight: document.body.clientHeight,
      loginMainHeight: 380,
      loginMainWidth: 327,
      loginImgHeight: 394,
      loginImgWidth: 541,
      showDialog: false,
      selectList:['早班','晚班'],
      selectflag:false,
      sFlag:null,
      Background: '/img/tu1.webp'
      
    }
  },
  computed: {
    defaultTheme() {
      return this.$store.state.settings.defaultTheme
    }
  },
  watch: {
    $route:{
      handler(val,oldval){
        this.routerChange()
      },
      // 深度观察监听
      deep: true
    },
    screenHeight(val) {
      this.changeHw(val)
    }
  },
  created() {
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  mounted() {
    this.changeHw(document.body.clientHeight)
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  methods: {
    sz(si){
      this.selectflag =true
      localStorage.setItem('select',this.selectList[si])
      this.sFlag = si
      var aa = this.selectList[si]
      this.$emit('select-x',aa)
    },

    butclick(i){

      this.$notify({
        title: '提示',
        message: '请选择早班或晚班！',
        duration: 0
      });

    },
    routerChange() {
      let router = this.$route.path
      if(router == '/') {
        this.showDialog = true
      }
    },
    getTime() {
      this.time = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    changeHw(val) {
      console.log(val)
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      return
      if (!this.timer) {
        if (val < 734) {
          val = 734
        }
        if (val <= 1080) {
          this.loginMainHeight = 380
          this.loginMainWidth = 327
        } else if (val > 1000 && val <= 1500) {
          this.loginMainHeight = 500
          this.loginMainWidth = 430
        } else {
          this.loginMainHeight = 600
          this.loginMainWidth = 516
        }

        this.loginImgHeight = val * 0.58
        this.loginImgWidth = this.loginImgHeight / 394 * 541

        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        const that = this
        setTimeout(function () {
          that.timer = false
        }, 10)
      }
    }
  }
}
</script>

<style lang="scss">
  .sidebar-logo-container .sidebar-logo-link {
    display: inline-block !important;
  }

  @import "./css/login.scss";
  #login .login-self-main{
    position: relative;
    .select-time{
      position: absolute;
      top: 50%;
      left: 0;
      display: flex;
      p{
        margin-left: 70px;
      }
    }
  }
  .but{
    width: 267px;
    height: 45px;
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 50%;
    margin-left: -133px;
    margin-top: 66px;
  }

  .el-notification.right{
    top: 50% !important;
    z-index: 100000 !important;
    left: 62%;
    border: 1px solid black;
  }
  .Scolor{
    background: white;
  }
  .current{
    background: #1890ff;
  }
</style>
