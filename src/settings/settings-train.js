module.exports = {
  //产品
  clearVersion: '9901.2100.3',
  logIndexTitle: '培训管理系统',
  title: '培训管理系统',
  logo: {type: 'img', /* img*/ src: '/img/logo_pro.png'},
  company: '招商华软信息有限公司版权所有  粤ICP备09068906号',
  hgCompany: '',
  password: {reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/, msg: '8-20位大小写字母数字特殊字符组合'},
  index: {url: ''},  //首页配置 url:  对应菜单的url 例如：'/personalCenter' ,如果没有首页，则给空串 ‘’
}
