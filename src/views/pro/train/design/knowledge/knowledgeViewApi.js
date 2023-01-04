import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/knowledge/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/knowledge/' + id,
    method: 'get',
    params: {}
  })
}

export const getParentTree = (data) => {
  return request({
    url: '/api/v1/train/section/tree',
    method: 'post',
    params: {},
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/train/knowledge/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/train/knowledge/update',
    method: 'post',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/train/knowledge/' + ids,
    method: 'delete',
    params: {}
  })
}
