import request from 'ecip-web/utils/request'
export const sendRecordMainList = (params, data) => {
  return request({
    url: '/api/v1/sendRecordMain/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const issueDetails = (params, data) => {
  return request({
    url: '/api/v1/exportDataTask/listWithHis',
    method: 'post',
    params: params,
    data: data
  })
}

export const getUseTable = (params) => {
  return request({
    url: '/api/v1/sendpara/getUseTable',
    method: 'get',
    params: params
  })
}

export const getStation = (params) => {
  return request({
    url: '/api/v1/common/station/station',
    method: 'get',
    params: params
  })
}

export const getData = (url, params, data, isPost) => {
  const postReq = {
    url: url,
    method: 'post',
    params: params,
    data: data || {}
  }

  const getReq = {
    url: url,
    method: 'get',
    params: params
  }
  return request(isPost ? postReq : getReq)
}

export const findUseLanes = (data) => {
  return request({
    url: '/api/v1/common/orgUse/findLaneList',
    method: 'post',
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/sendRecordMain',
    method: 'post',
    data: data
  })
}

export const cancel = (data) => {
  return request({
    url: '/api/v1/exportDataTask/cancel',
    method: 'post',
    data: data
  })
}
