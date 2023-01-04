const checkMoney = (rule, value, callback) => {
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

const accMul = (arg1,arg2)  => {
  if ("" == arg1){
    arg1 = 0;
  }
  let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}


export default {
  checkMoney,
  accMul
}
