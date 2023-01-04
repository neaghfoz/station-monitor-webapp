import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/paper/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/paper/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/paper/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/paper/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/paper/' + ids,
    method: 'delete',
    params: {}
  })
}

export const cancel = (ids) => {
  return request({
    url: '/api/v1/paper/cancel/' + ids,
    method: 'post',
    params: {}
  })
}
