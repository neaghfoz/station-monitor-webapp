import request from 'ecip-web/utils/request'

const findPage = (params, data) => {
  return request({
    url: '/api/v1/shift/shiftSettle/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

const settle = (data) => {
  return request({
    url: '/api/v1/shift/shiftSettle/settle',
    method: 'post',
    data: data
  })
}

const cancelSettle = (data) => {
  return request({
    url: '/api/v1/shift/shiftSettle/cancelSettle',
    method: 'post',
    data: data
  })
}

const checkLaneSumStatusStock = (data) => {
  return request({
    url: '/api/v1/shift/shiftSettle/checkLaneSumStatusStock',
    method: 'post',
    data: data
  })
}

const getCurrentOrg = () => {
  return request({
    url: '/api/v1/common/sysOrg/getCurrentOrg',
    method: 'get',
    params: {}
  })
}


export default {
  findPage,
  settle,
  cancelSettle,
  checkLaneSumStatusStock,
  getCurrentOrg
}
