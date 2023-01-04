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
    const reg = /^^(([0-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确[0，9999999.9999]的金额'))
    }else if(value > 9999999.9999){
      callback(new Error('请输入正确[0，9999999.9999]的金额'))
    }else {
      callback()
    }
  } else {
    callback()
  }
}

const checkInvStartNo = ({ cellValue }) => {
  if (cellValue) {
    const reg = /^\d*$/
    if (!reg.test(cellValue)) {
      return new Error('请填写正确的机打发票起始号！')
    }

    if (parseInt(cellValue) < 0 || parseInt(cellValue) > 999999999) {
      return new Error('机打发票起始号不能大于999999999！')
    }

  } else {
    return new Error('机打发票起始号不能为空！')
  }
}

const checkInvEndNo = ({ cellValue }) => {
  if (cellValue) {
    const reg = /^\d*$/
    if (!reg.test(cellValue)) {
      return new Error('请填写正确的机打发票结束号！')
    }

    if (parseInt(cellValue) < 0 || parseInt(cellValue) > 999999999) {
      return new Error('机打发票结束号不能大于999999999！')
    }

  } else {
    return new Error('机打发票结束号不能为空！')
  }
}

const checkInvoiceCodeTr = (shiftRegMainRecord, that)  => {
  let positiveInteger = /^\d*$/;

  let canSubmit = true

  if (shiftRegMainRecord.shiftInvDetailList.length > 0) {
    shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
      let invCode = shiftRegMainRecord.shiftInvDetailList[index].invCode;
      let startNo = shiftRegMainRecord.shiftInvDetailList[index].invStartNo;
      let endNo = shiftRegMainRecord.shiftInvDetailList[index].invEndNo;

      // 1、判断是否为空
      if (invCode == null || typeof invCode == "undefined" || invCode == '') {
        that.$notify.error('机打发票代码不能为空！')
        canSubmit = false
        return false
      }
      if (startNo == null || typeof startNo == "undefined" || startNo == '') {
        console.log(startNo)
        console.log('11111')
        that.$notify.error('机打发票起始号不能为空！')
        canSubmit = false
        return false
      }
      if (endNo == null || typeof  endNo == "undefined" || endNo == '') {
        that.$notify.error('机打发票结束号不能为空！')
        canSubmit = false
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(startNo)) {
        that.$notify.error('请填写正确的机打发票起始号！')
        canSubmit = false
        return false
      }
      if (!positiveInteger.test(endNo)) {
        that.$notify.error('请填写正确的机打发票结束号！')
        canSubmit = false
        return false
      }

      // 3、判断结束号和起始号大小
      if (parseInt(startNo) < 0 || parseInt(startNo) > 999999999) {
        that.$notify.error('机打发票起始号不能大于999999999！')
        canSubmit = false
        return false
      }
      if (parseInt(endNo) < 0 || parseInt(endNo) > 999999999) {
        that.$notify.error('机打发票结束号不能大于999999999！')
        canSubmit = false
        return false
      }
      if (parseInt(startNo) > parseInt(endNo)) {
        that.$notify.error('机打发票起始号不能大于结束号！')
        canSubmit = false
        return false
      }

      // 4、判断交叉
      shiftRegMainRecord.shiftInvDetailList.forEach(function (data, tTndex) {
        if (index != tTndex) {
          let tempInvCode = data.invCode;
          let tempStartNo = parseInt(data.invStartNo);
          let tempEndNo = parseInt(data.invEndNo);
          if (invCode == tempInvCode && parseInt(startNo) <= tempEndNo && tempStartNo <= parseInt(endNo)) {
            that.$notify.error('票段有交叉，请检查！');
            canSubmit = false
            return false
          }
        }
      })
    })

    if (!canSubmit) {
      return canSubmit
    }
  }
  // 5、判断库存（放到保存提交那里）
  return canSubmit
}

const checkBadInvoiceCodeTr = (shiftRegMainRecord, that)  => {
  const positiveInteger = /^\d*$/
  let canAdd = true

  if (shiftRegMainRecord.shiftSquadInvalidInvList.length > 0) {
    shiftRegMainRecord.shiftSquadInvalidInvList.forEach(function (data, trIndex) {
      const invCode = shiftRegMainRecord.shiftSquadInvalidInvList[trIndex].invCode
      const invNo = shiftRegMainRecord.shiftSquadInvalidInvList[trIndex].badInvID

      // 1、判断是否为空
      if (invCode == null || typeof invCode == "undefined" || invCode == '') {
        that.$notify.error('废票机打发票代码不能为空！')
        canAdd = false
        return false
      }
      if (invNo == null || typeof invNo == "undefined" || invNo == '') {
        that.$notify.error('机打发票废票号不能为空！')
        canAdd = false
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(invNo)) {
        that.$notify.error('请填写正确的机打发票废票号！')
        canAdd = false
        return false
      }
      if (parseInt(invNo) < 0 || parseInt(invNo) > 999999999) {
        that.$notify.error('请填写正确的机打发票废票号！')
        canAdd = false
        return false
      }

      // 3、判断废票号是否重复
      let isHaveSameInvNo = false
      shiftRegMainRecord.shiftSquadInvalidInvList.forEach(function (data, index) {
        if (trIndex != index) {
          const tempInvCode = data.invCode;
          const tempInvNo = parseInt(data.badInvID);
          if (invCode == tempInvCode && parseInt(invNo) == tempInvNo) {
            isHaveSameInvNo = true
            return false
          }
        }
      });
      if (isHaveSameInvNo) {
        that.$notify.error("存在重复的机打发票废票号：" + invNo + " ！")
        canAdd = false
        return false
      }

      // 4、判断是否在发票段内
      let isInInvSection = false
      shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
        const tempInvCode = data.invCode;
        const tempStartNo = parseInt(data.invStartNo);
        const tempEndNo = parseInt(data.invEndNo);
        if (invCode == tempInvCode && parseInt(invNo) <= tempEndNo && tempStartNo <= parseInt(invNo)) {
          isInInvSection = true
          return false
        }
      })

      if (!isInInvSection) {
        that.$notify.error("机打发票代码：" + invCode + " 机打发票废票号：" + invNo + " 未在登记机打发票段范围内！")
        canAdd = false
        return false
      }
    })

    if (!canAdd) {
      return canAdd
    }
  }

  return canAdd
}

const checkManualInvoiceCodeTr = (shiftRegMainRecord, that)  => {
  const positiveInteger = /^\d*$/
  let canAdd = true
  if (shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
    shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, trIndex) {
      const invType = shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invType
      const invRationMoney = shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invRationMoney
      const startNo = shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invStartNo
      const endNo = shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invEndNo
      const invCode = shiftRegMainRecord.shiftSquadRationInvoiceList[trIndex].invCode

      // 1、判断空
      if (invCode == null || typeof invCode == "undefined" || invCode == '') {
        that.$notify.error("定额发票代码不能为空！")
        canAdd = false
        return false
      }

      if (invRationMoney == null || typeof  invRationMoney == 'undefined' || invRationMoney == '') {
        that.$notify.error("定额发票面额不能为空！")
        canAdd = false
        return false
      }

      if (startNo == null || typeof startNo == "undefined" || startNo == '') {
        that.$notify.error("定额发票起始号不能为空！")
        canAdd = false
        return false
      }
      if (endNo == null || typeof  endNo == "undefined" || endNo == '') {
        that.$notify.error("定额发票结束号不能为空！")
        canAdd = false
        return false
      }

      // 2、判断类型
      if (!positiveInteger.test(startNo)) {
        that.$notify.error("请填写正确的定额发票起始号！")
        canAdd = false
        return false
      }
      if (!positiveInteger.test(endNo)) {
        that.$notify.error("请填写正确的定额发票结束号！")
        canAdd = false
        return false
      }

      // 3、结束号是否大于起始号
      if (parseInt(startNo) < 0 || parseInt(startNo) > 999999999) {
        that.$notify.error("定额发票起始号不能大于999999999！")
        canAdd = false
        return false
      }
      if (parseInt(endNo) < 0 || parseInt(endNo) > 999999999) {
        that.$notify.error("定额发票结束号不能大于999999999！")
        canAdd = false
        return false
      }
      if (parseInt(startNo) > parseInt(endNo)) {
        that.$notify.error("定额发票起始号不能大于结束号！")
        canAdd = false
        return false
      }

      // 4、票段交叉
      shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
        if (trIndex != index) {
          const tempInvType = data.invType;
          const tempInvRationMoneySelect = data.invRationMoneySelect;
          const tempInvRationMoneyInput = data.invRationMoneyInput;
          const tempStartNo = parseInt(data.invStartNo);
          const tempEndNo = parseInt(data.invEndNo);
          if (invType == tempInvType) {
            if (parseInt(tempInvType) == 1) { // 大额定额发票
              if (invRationMoneySelect == tempInvRationMoneySelect
                && parseInt(startNo) <= tempEndNo
                && parseInt(endNo) >= tempStartNo) {
                that.$notify.error("输入定额发票票段有交叉，请检查！")
                canAdd = false
                return false
              }
            } else if (parseInt(tempInvType) == 2) { // 其他
              if (invRationMoneyInput == tempInvRationMoneyInput
                && parseInt(startNo) <= tempEndNo
                && parseInt(endNo) >= tempStartNo) {
                that.$notify.error("输入定额发票票段有交叉，请检查！")
                canAdd = false
                return false
              }
            }
          }
        }
      })
    })

    if (!canAdd) {
      return canAdd
    }
  }

  return canAdd
}

const checkPaperCodeTr = (shiftRegMainRecord, that)  => {
  let canAdd = true
  if (shiftRegMainRecord.shiftSquadPaperList.length > 0) {
    shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, trIndex) {
      const positiveInteger = /^\d*$/;
      const userMarkNo = shiftRegMainRecord.userMarkNo;
      const paperStart = shiftRegMainRecord.shiftSquadPaperList[trIndex].paperStart;
      const paperEnd = shiftRegMainRecord.shiftSquadPaperList[trIndex].paperEnd;

      if (parseInt(userMarkNo) == 1) { // 入口
        if (null == paperStart || typeof paperStart == "undefined" || paperStart == '') {
          that.$notify.error("纸券起始号不能为空！")
          canAdd = false
          return false
        }
        if (null == paperEnd || typeof paperEnd == "undefined" || paperEnd == '') {
          that.$notify.error("纸券结束号不能为空！")
          canAdd = false
          return false
        }

        // 2、校验类型
        if (!positiveInteger.test(paperStart)) {
          that.$notify.error("请输入正确的纸券起始号！")
          canAdd = false
          return false
        }
        if (parseInt(paperStart) < 0 || parseInt(paperStart) > 999999999999999) {
          that.$notify.error("请输入正确的纸券起始号！")
          canAdd = false
          return false
        }
        if (!positiveInteger.test(paperEnd)) {
          that.$notify.error("请输入正确的纸券结束号！")
          canAdd = false
          return false
        }
        if (parseInt(paperEnd) < 0 || parseInt(paperEnd) > 999999999999999) {
          that.$notify.error("请输入正确的纸券结束号！")
          canAdd = false
          return false
        }
        if (parseInt(paperStart) > parseInt(paperEnd)) {
          that.$notify.error("起始纸券号不能大于终止纸券号！")
          canAdd = false
          return false
        }

        // 3、校验交叉
        shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
          if (trIndex != index) {
            let tempPaperStart = parseInt(data.paperStart);
            let tempPaperEnd = parseInt(data.paperEnd);
            if (parseInt(paperStart) <= tempPaperEnd
              && parseInt(paperEnd) >= tempPaperStart) {
              canAdd = false
              return false
            }
          }
        })

        if (!canAdd) {
          that.$notify.error("输入纸券号有交叉，请检查！")
          canAdd = false
          return false
        }
      } else {
        return true
      }
    })

    if (!canAdd) {
      return canAdd
    }
  }

  return canAdd
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

const makeInvCount = (shiftRegMainRecord)  => {
  // 机打发票
  if (shiftRegMainRecord.shiftInvDetailList.length > 0) {
    let invCount = 0
    shiftRegMainRecord.shiftInvDetailList.forEach(function (data, index) {
      const invStartNo = data.invStartNo
      const invEndNo = data.invEndNo
      shiftRegMainRecord.shiftInvDetailList[index].invCount = parseInt(invEndNo) - parseInt(invStartNo) + 1
      invCount += shiftRegMainRecord.shiftInvDetailList[index].invCount
    })
    shiftRegMainRecord.invCount = invCount
  }

  // 定额发票
  if (shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
    let totalManualInvCount = 0
    shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (data, index) {
      const invStartNo = data.invStartNo
      const invEndNo = data.invEndNo
      shiftRegMainRecord.shiftSquadRationInvoiceList[index].invCount = parseInt(invEndNo) - parseInt(invStartNo) + 1
      totalManualInvCount += shiftRegMainRecord.shiftSquadRationInvoiceList[index].invCount
    })

    shiftRegMainRecord.rationInvCount = totalManualInvCount
  }

  // 纸券
  if (shiftRegMainRecord.shiftSquadPaperList.length > 0) {
    let totalPaperCount = 0
    shiftRegMainRecord.shiftSquadPaperList.forEach(function (data, index) {
      const paperStart = data.paperStart
      const paperEnd = data.paperEnd
      const paperCount = parseInt(paperEnd) - parseInt(paperStart) + 1
      shiftRegMainRecord.shiftSquadPaperList[index].paperCount = paperCount
      totalPaperCount += paperCount
    })
    shiftRegMainRecord.paperCount = totalPaperCount
  }
}

const makeBadInvMoney = (shiftRegMainRecord) => {
  if (null != shiftRegMainRecord.shiftSquadInvalidInvList && shiftRegMainRecord.shiftSquadInvalidInvList.length > 0) {
    shiftRegMainRecord.shiftSquadInvalidInvList.forEach(function (tmp, index) {
      tmp.money = accMul(tmp.showMoney, 100)
    })
  }
}

const makeRationInvMoney = (shiftRegMainRecord) => {
  if (null != shiftRegMainRecord.shiftSquadRationInvoiceList && shiftRegMainRecord.shiftSquadRationInvoiceList.length > 0) {
    shiftRegMainRecord.shiftSquadRationInvoiceList.forEach(function (tmp, index) {
      tmp.invRationMoney = accMul(tmp.invRationMoney, 100)
    })
  }
}

export default {
  checkPositiveNumber,
  checkDigits,
  checkTxMoney,
  checkInvStartNo,
  checkInvEndNo,
  checkInvoiceCodeTr,
  checkBadInvoiceCodeTr,
  checkManualInvoiceCodeTr,
  checkPaperCodeTr,
  accMul,
  makeInvCount,
  makeBadInvMoney,
  makeRationInvMoney
}
