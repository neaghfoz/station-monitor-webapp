module.exports = {
  //京津
  clearVersion: '1201.2102.2',
  logIndexTitle: '京津校核系统',
  title: '京津校核系统',
  logo: {type: 'img', /* img*/ src: '/img/logo_jj.png'},
  company: '',
  hgCompany: '招商华软信息有限公司提供技术支持',
  password: {reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/, msg: '8-20位大小写字母数字特殊字符组合'},
  index: {url: '/fitcheck/indexFee'},  //首页配置 url:  对应菜单的url 例如：'/personalCenter' ,如果没有首页，则给空串 ‘’
}
