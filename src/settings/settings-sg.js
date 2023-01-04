module.exports = {
  //深高
  clearVersion: '4401.2105.2',
  logIndexTitle: '自由流模式下的收费稽查管理系统',
  title: '稽查管理系统',
  logo: {type: 'img', /* img*/ src: '/img/logo_sg.png'},
  company: '',
  hgCompany: '',
  password: {reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/, msg: '8-20位大小写字母数字特殊字符组合'},
  index: {url: '/indexFee'},  //首页配置 url:  对应菜单的url 例如：'/personalCenter' ,如果没有首页，则给空串 ‘’
}
