import request from 'ecip-web/utils/request'

const findPage = (params, data) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/findPage',
    method: 'post',
    params: params,
    data: data
  })
}


const findAllLane = () => {
  return request({
    url: '/api/v1/toll/lane/list',
    method: 'get',
    params: {}
  })
}

const getCurrentOrg = () => {
  return request({
    url: '/api/v1/common/sysOrg/getCurrentOrg',
    method: 'get',
    params: {}
  })
}

const getSysUser = () => {
  return request({
    url: '/api/v1/common/sysUser/list',
    method: 'get',
    params: {}
  })
}

const getCardUnitList = (stationNo) => {
  return request({
    url: '/api/v1/toll/cardUnit/getCardUnitList/'+stationNo,
    method: 'get',
    params: {}
  })
}

const checkPassCardNo = (badPassCardNo) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/checkPassCardNo/'+badPassCardNo,
    method: 'get',
    params: {}
  })
}

const sumInvCount = (items) =>{
  var totalInvCount = 0;
  if (items.length > 0){
    items.forEach(function (data) {
      if (data.invStartNo != null
        &&  data.invEndNo != null
        && data.invStartNo != ''
        && data.invEndNo != '') {
        totalInvCount = totalInvCount + parseInt(data.invEndNo) - parseInt(data.invStartNo) + 1;
      }
    });
  }
  return totalInvCount;
}

const lastCheckForOffWorkCard = (data) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/lastCheckForOffWorkCard',
    method: 'post',
    data: data
  })
}

const checkCard = (data) =>{
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/checkCard',
    method: 'post',
    data: data
  })
}

const findStationByAuth = (showLevel) => {
  return request({
    url: '/api/v1/common/sysOrg/findByAuth',
    method: 'get',
    params: {showLevel:showLevel}
  })
}

const checkInvCodeStock = (data) =>{
  return request({
    url: '/api/v1/invoice/checkStock',
    method: 'post',
    data: data
  })
}

const checkManualInvStock = (data) =>{
  return request({
    url: '/api/v1/rinvoice/checkStock',
    method: 'post',
    data: data
  })
}

const checkPaperStock = (data) =>{
  return request({
    url: '/api/v1/paper/checkStock',
    method: 'post',
    data: data
  })
}

const checkRegSubmitTime = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/checkRegSubmitTime',
    method: 'post',
    data: data
  })
}

const checkSameLaneShiftReg = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/checkSameLaneShiftReg',
    method: 'post',
    data: data
  })
}

const checkNotHandInCardUnit = (data) =>{
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/checkNotHandInCardUnit',
    method: 'post',
    data: data
  })
}

const selectForWorkPassCards = (data) =>{
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/selectForWorkPassCards',
    method: 'post',
    data: data
  })
}

const checkLatestRecord = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/checkLatestRecord',
    method: 'post',
    data: data
  })
}

const findPaperCount = (data) =>{
  return request({
    url: '/api/v1/shift/shiftSquadPaper/findPaperCount',
    method: 'post',
    data: data
  })
}

const saveShiftReg = (data) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/saveShiftReg',
    method: 'post',
    data: data
  })
}

const selectInListWater = (data) =>{
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/selectInListWater',
    method: 'post',
    data: data
  })
}

const selectInvCodeInList = (data) =>{
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/selectInvCodeInListWater',
    method: 'post',
    data: data
  })
}

const selectInvCodeByList = (data) =>{
  return request({
    url: '/api/v1/shift/shiftInvDetail/selectInvCodeByList',
    method: 'post',
    data: data
  })
}

const selectBadInvInList = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/selectBadInvInList',
    method: 'post',
    data: data
  })
}

const getTxMoneyOffWork = (data) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/txMoneyOffWork',
    method: 'post',
    data: data
  })
}

const checkShiftSettleStock = (data) => {
  return request({
    url: '/api/v1/shift/shiftSettle/settleStock',
    method: 'post',
    data: data
  })
}

const detail = (linkID) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/detail/'+linkID,
    method: 'get'
  })
}

const goBack = (data) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/goBack',
    method: 'post',
    data: data
  })
}

export default {
  findPage,
  findAllLane,
  getCurrentOrg,
  getSysUser,
  getCardUnitList,
  checkPassCardNo,
  sumInvCount,
  lastCheckForOffWorkCard,
  checkCard,
  findStationByAuth,
  checkInvCodeStock,
  checkManualInvStock,
  checkPaperStock,
  checkRegSubmitTime,
  checkSameLaneShiftReg,
  checkNotHandInCardUnit,
  selectForWorkPassCards,
  checkLatestRecord,
  findPaperCount,
  saveShiftReg,
  selectInListWater,
  selectInvCodeByList,
  selectBadInvInList,
  getTxMoneyOffWork,
  selectInvCodeInList,
  detail,
  checkShiftSettleStock,
  goBack
}
