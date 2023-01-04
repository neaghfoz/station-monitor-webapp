import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const updateBatch = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/updateBatch',
    method: 'post',
    params: params,
    data: data
  })
}

export const add = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/add',
    method: 'post',
    params: params,
    data: data
  })
}

export const addMobile = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/addMobile',
    method: 'post',
    params: params,
    data: data
  })
}

export const update = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/update',
    method: 'post',
    params: params,
    data: data
  })
}

export const del = (params, data) => {
  return request({
    url: 'api/v1/common/orgUse/delete',
    method: 'post',
    params: params,
    data: data
  })
}
