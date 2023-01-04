import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/rinvoice/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/rinvoice/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/rinvoice/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/rinvoice/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/rinvoice/' + ids,
    method: 'delete',
    params: {}
  })
}

export const cancel = (ids) => {
  return request({
    url: '/api/v1/rinvoice/cancel/' + ids,
    method: 'post',
    params: {}
  })
}
