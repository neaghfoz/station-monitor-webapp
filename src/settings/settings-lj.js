module.exports = {
  //路径
  clearVersion: '4301.2101.2',
  logIndexTitle: '路劲高速收费营运管理系统',
  title: '路劲高速收费营运管理系统',
  logo: {type: 'img', /* img*/ src: '/img/logo_lj.png'},
  company: '路劲企业管理顾问（深圳）有限公司',
  hgCompany: '招商华软信息有限公司提供技术支持',
  password: {reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/, msg: '8-20位大小写字母数字特殊字符组合'},
  index: {url: ''},  //首页配置 url:  对应菜单的url 例如：'/personalCenter' ,如果没有首页，则给空串 ‘’
}
