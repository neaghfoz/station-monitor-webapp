import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/cardunitvolume/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/cardunitvolume/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/cardunitvolume/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/cardunitvolume/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/cardunitvolume/' + ids,
    method: 'delete',
    params: {}
  })
}
