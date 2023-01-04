import request from 'ecip-web/utils/request'

const findPage = (params, data) => {
  return request({
    url: '/api/v1/shift/shiftProcessLink/findPage',
    method: 'post',
    params: params,
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

const selectShiftProcessRegCardUnitNo = (data) => {
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/selectShiftProcessRegCardUnitNo',
    method: 'post',
    data: data
  })
}

const selectLastShiftPassCardDetailRecord = (data) => {
  return request({
    url: '/api/v1/shift/shiftPassCardDetail/selectLastShiftPassCardDetailRecord',
    method: 'post',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/shift/shiftRegMainRecord/' + ids,
    method: 'delete',
    params: {}
  })
}


export default {
  findPage,
  checkShiftSettleStock,
  selectShiftProcessRegCardUnitNo,
  selectLastShiftPassCardDetailRecord,
  deleteByIds
}
