import request from 'ecip-web/utils/request'
export const list = (params, data) => {
  return request({
    url: '/api/v1/policyMainFile/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/policyMainFile/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/policyMainFile/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/policyMainFile/' + id,
    method: 'get',
    params: {}
  })
}

export const getDtailsById = (id) => {
  return request({
    url: '/api/v1/policyMainFile/details/' + id,
    method: 'get',
    params: {}
  })
}

export const del = (ids) => {
  return request({
    url: '/api/v1/policyMainFile/delete',
    method: 'delete',
    params: { ids: ids }
  })
}

export const withdraw = (ids) => {
  return request({
    url: '/api/v1/policyMainFile/withdraw',
    method: 'post',
    params: { ids: ids }
  })
}

export const policyFileList = (params, data) => {
  return request({
    url: '/api/v1/policyFile/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const getUserNodeLevel = () => {
  return request({
    url: '/api/v1/common/sysOrg/getCurrentOrg',
    method: 'get',
    params: {}
  })
}

export const getPreViewUrl = (id) => {
  return request({
    url: '/api/v1/policyMainFile/getPreViewUrl/' + id,
    method: 'get',
    params: {}
  })
}
