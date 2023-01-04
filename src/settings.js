const settings = require('./settings/settings-sx.js')

module.exports = Object.assign(settings, {

  tibms: {
    // mapUrl: 'http://10.173.235.140:8888/OSM/map/{z}/{x}/{y}.png',
    mapUrl: '', // 深高瓦片服务地址
    // 校核相关配置
    fitcheck: {
      model: 'local',   //模式  local-本地版，cloud-云板
      // 校核地图服务，离线版url，在线版不需要配置
      mapUrl: '',
      // 是否开启地图服务
      mapEnabled: false,
      // 地图模式，是否使用在线地图，false 为离线地图
      onlineMap: false,
      // 路径展示，牌识图片展示开启
      vehicleImgShow: true,
      // 总览是否显示理论
      showTheory: true
    }
  },
  // 在线地图服务，一般固定不变
  FeeManageHost: '/fit/api/vue/v1/roadnet_api',

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   * 屏蔽页眉的虫子
   */
  errorLog: 'development',

  superAdmin: false,

  appId: -5,

  enableTenant: false,

  loginCaptcha: false,

  enableLang: false,

  loginPrivateKey: '',

  loginEncrypt: true,
  loginPublicKey: '-----BEGIN PUBLIC KEY-----\n' +
      'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHTsnwwNvd52nzAbi/Llv2fjIyKA\n' +
      'MuOFNU1YWTUZk23Wyg3tEn2344S7BXj1uenOR4Qc+LKjdSFcHu8cfd5lOH5Hq3v2\n' +
      '8ZOxU2dJZUTZRzaPMEW54URnCQSwGzBQiXqaVyNbp/NSAyKSVqxUPvoYc3hsvrMc\n' +
      'VGimK5rrlrG9Y1yhAgMBAAE=\n' +
      '-----END PUBLIC KEY-----',

  // password: { reg: /^[0-9]{6,20}$/, msg: '6-20位字母数字组合' },

  // password: {
  //   reg: /^(?!(\d)\1{5,})(?!((?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}\d))(?!((?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5}\d))(?!123321)(\d{6,20})+$/,
  //   msg: '6-20位字母数字组合且不能为弱密码（例如123456,111111等等）',
  //   same: false
  // },

  /*password: {
    reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/,
    msg: '8-20位大小写字母数字特殊字符组合'
  },*/

  loginTitle: '登录',

  cas: false,

  size: 'small',
  device: 'desktop',
  language: 'zh-CN', // en | zh | es

  sidebar: {
    opened: true,
    withoutAnimation: false
  },

  defaultTheme: '#304156',
  defaultLayout: 'left', // top-顶部菜单， left-左侧菜单， topOnly-只有顶部菜单
  // 导航条, 布局皮肤
  navbarLayoutType: 'primary',
  // 侧边栏, 布局皮肤
  sidebarLayoutSkin: 'bright',
  // 主入口标签页
  mainTabs: [],
  mainTabsActiveName: 'home',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /*logo: {
    type: 'img', // img
    src: '/img/logo.png'
  },*/

  fullscreen: true,

  notification: true,

  /**
   * @type {boolean} true | false
   * @description Whether support pinyin search in headerSearch
   * Bundle size minified 47.3kb,minified + gzipped 63kb
   */
  supportPinyinSearch: false,

  colorList: [
    {
      key: '拂晓蓝（默认）', color: '#1890FF'
    },
    {
      key: '薄暮', color: '#F5222D', label: '1'
    },
    {
      key: '火山', color: '#FA541C', label: '2'
    },
    {
      key: '日暮', color: '#FAAD14'
    },
    {
      key: '明青', color: '#13C2C2'
    },
    {
      key: '极光绿', color: '#52C41A'
    },
    {
      key: '极客蓝', color: '#2F54EB'
    },
    {
      key: '酱紫', color: '#722ED1'
    },
    {
      key: '天空蓝', color: '#3e8df7'
    },
    {
      key: '咖啡色', color: '#9a7b71'
    },
    {
      key: '深湖蓝', color: '#07b2d3'
    },
    {
      key: '原谅绿', color: '#0cc26c'
    },
    {
      key: '古铜灰', color: '#757575'
    },
    {
      key: '珊瑚紫', color: '#6779fa'
    },
    {
      key: '橙黄', color: '#eb6607'
    },
    {
      key: '粉红', color: '#f74584'
    },
    {
      key: '青紫', color: '#9463f7'
    },
    {
      key: '橄榄绿', color: '#16b2a3'
    }
  ],

  // vue-ls options
  storageOptions: {
    namespace: 'ec__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },

  ecipUrl: process.env.NODE_ENV === 'development' ? 'http://it.hgits.cn/ecip-api' : 'http://zhgly.hgits.cn/ecip-api'

})
