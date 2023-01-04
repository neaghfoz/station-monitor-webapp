import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/question/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getParentTree = (data) => {
  return request({
    url: '/api/v1/train/knowledge/tree',
    method: 'post',
    params: {},
    data: data
  })
}

export const getCount = (data) => {
  return request({
    url: '/api/v1/train/question/count',
    method: 'post',
    params: {},
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/question/' + id,
    method: 'get',
    params: {}
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/train/question/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/train/question/update',
    method: 'post',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/train/question/' + ids,
    method: 'delete',
    params: {}
  })
}
