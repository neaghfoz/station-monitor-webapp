import request from 'ecip-web/utils/request'
export const versionList = (params, data) => {
  return request({
    url: '/api/v1/version/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const allSystems = () => {
  return request({
    url: '/api/v1/version/systemInfo/allSystems',
    method: 'get',
    params: {}
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/version',
    method: 'post',
    data: data
  })
}

export const detail = (id) => {
  return request({
    url: '/api/v1/version/detail/' + id,
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
    url: '/api/v1/version/addUpdation',
    method: 'post',
    data: data
  })
}

export const reAddUpdation = (data) => {
  return request({
    url: '/api/v1/version/reAddUpdation',
    method: 'post',
    data: data
  })
}

