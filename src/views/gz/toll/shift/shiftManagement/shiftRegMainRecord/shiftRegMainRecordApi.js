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

const laneListWithUserAuth = () => {
  return request({
    url: '/api/v1/common/lane/listWithUserAuth',
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
    url: '/api/v1/shift/shiftInvDetail/selectInvCodeInListWater',
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

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/' + ids,
    method: 'delete',
    params: {}
  })
}

const findOrgByAuth = (data) => {
  return request({
    url: '/api/v1/common/sysOrg/findByAuth',
    method: 'get',
    params: data
  })
}

const findUserOfLaneShift = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/findUserOfLaneShift',
    method: 'post',
    data: data
  })
}

const findPaperCountOfList = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/findPaperCountOfList',
    method: 'post',
    data: data
  })
}

const getLastSquad = (data) =>{
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/getLastSquad',
    method: 'post',
    data: data
  })
}

const getRationInvoiceCodeList = (data) =>{
  return request({
    url: '/api/v1/rationInvoiceCode/list',
    method: 'post',
    data: data
  })
}

export default {
  findPage,
  findAllLane,
  laneListWithUserAuth,
  getCurrentOrg,
  getSysUser,
  sumInvCount,
  checkInvCodeStock,
  checkManualInvStock,
  checkPaperStock,
  findPaperCount,
  saveShiftReg,
  selectInListWater,
  selectInvCodeByList,
  selectBadInvInList,
  selectInvCodeInList,
  detail,
  checkShiftSettleStock,
  deleteByIds,
  findOrgByAuth,
  findUserOfLaneShift,
  findPaperCountOfList,
  getLastSquad,
  getRationInvoiceCodeList
}
