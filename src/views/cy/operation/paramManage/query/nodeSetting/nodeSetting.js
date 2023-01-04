import request from 'ecip-web/utils/request'
export const getList = (params) => {
  return request({
    url: '/api/v1/paramMain',
    method: 'get',
    params: params
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/paramMain/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/paramMain/update',
    method: 'post',
    data: data
  })
}

export const getById = (params) => {
  return request({
    url: '/api/v1/paramMain/' + params.id,
    method: 'get',
    params: {}
  })
}

export const delById = (params) => {
  return request({
    url: '/api/v1/paramMain/delete/' + params.id,
    method: 'DELETE',
    params: params
  })
}
