import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/testpaper/findPage',
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

export const getById = (id) => {
  return request({
    url: '/api/v1/train/testpaper/' + id,
    method: 'get',
    params: {}
  })
}

export const getQuestionById = (id) => {
  return request({
    url: '/api/v1/train/testpaper/' + id + '/questions',
    method: 'get',
    params: {}
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/train/testpaper/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/train/testpaper/update',
    method: 'post',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/train/testpaper/' + ids,
    method: 'delete',
    params: {}
  })
}
