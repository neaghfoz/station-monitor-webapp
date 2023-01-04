module.exports = {
  //山西
  clearVersion: '2023.1.1001',
  logIndexTitle: '联网收费集中监控系统',
  title: '联网收费集中监控系统',
  logo: {type: 'img', /* img*/ src: '/img/logo_sx.png'},
  company: '山西交控',
  hgCompany: '',
  //password: {reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/, msg: '8-20位大小写字母数字特殊字符组合'},
  password: {reg: /^[0-9]{6,20}$/,msg: '6-20位数字组合'},
  index: {url: ''},  //首页配置 url:  对应菜单的url 例如：'/personalCenter' ,如果没有首页，则给空串 ‘’
}
