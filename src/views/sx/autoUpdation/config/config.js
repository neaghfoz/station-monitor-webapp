import request from 'ecip-web/utils/request'
export const versionList = (params, data) => {
  return request({
    url: '/api/v1/autoUpdation/config/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/autoUpdation/config',
    method: 'post',
    data: data
  })
}

export const detail = (id) => {
  return request({
    url: '/api/v1/autoUpdation/config/detail/' + id,
    method: 'get',
    params: {}
  })
}
export const updateHistoryList = (params, data) => {
  return request({
    url: '/api/v1/version/history/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const findUseLanes = (data) => {
  return request({
    url: '/api/v1/common/orgUse/findLaneList',
    method: 'post',
    data: data
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

export const addUpdation = (data) => {
  return request({
    url: '/api/v1/autoUpdation/config/addUpdation',
    method: 'post',
    data: data
  })
}

export const reAddUpdation = (data) => {
  return request({
    url: '/api/v1/autoUpdation/config/reAddUpdation',
    method: 'post',
    data: data
  })
}

