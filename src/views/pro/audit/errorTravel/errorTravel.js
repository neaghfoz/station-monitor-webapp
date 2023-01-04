import request from 'ecip-web/utils/request'


export const findPlateList = (params, data) => {
  return request({
    url: '/api/v1/audit/comm/errorTravel/findPlateList',
    method: 'post',
    params: params,
    data: data
  })
}

export const findEscapeTypeList = (params, data) => {
  return request({
    url: '/api/v1/audit/comm/errorTravel/findEscapeTypeList',
    method: 'post',
    params: params,
    data: data
  })
}


export const findPlateDeailList = (params, data) => {
  return request({
    url: '/api/v1/audit/comm/errorTravelDetail/findPlateDetailList',
    method: 'post',
    params: params,
    data: data
  })
}

export const audit = (params) => {
  return request({
    url: '/api/v1/audit/comm/errorTravelDetail/audit',
    method: 'post',
    data: params,
  })
}


export const getLastLog = (params) => {
  return request({
    url: '/api/v1/audit/comm/errorTravelDetail/getLastLog',
    method: 'post',
    data: params,
  })
}


