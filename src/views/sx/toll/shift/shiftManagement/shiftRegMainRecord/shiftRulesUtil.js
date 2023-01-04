const checkPositiveNumber = (rule, value, callback) => {
  if (value) {
    const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确[0，99999.99]的金额'))
    }else if(value > 99999.99){
      callback(new Error('请输入正确[0，99999.99]的金额'))
    }else {
      callback()
    }
  } else {
    callback()
  }
}

const checkDigits = (rule, value, callback) => {
  if (value) {
    const reg = /^[0-9]\d*$/
    if (!reg.test(value)) {
      callback(new Error('只能输入整数'))
    }else {
      callback()
    }
  } else {
    callback()
  }
}

const checkTxMoney = (rule, value, callback) => {
  if (value) {
    const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确[0，9999999.99]的金额'))
    }else if(value > 9999999.99){
      callback(new Error('请输入正确[0，9999999.99]的金额'))
    }else {
      callback()
    }
  } else {
    callback()
  }
}

export default {checkPositiveNumber, checkDigits, checkTxMoney}
