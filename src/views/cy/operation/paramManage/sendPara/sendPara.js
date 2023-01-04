import request from 'ecip-web/utils/request'
export const sendParaList = (params, data) => {
  return request({
    url: '/api/v1/sendpara/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/sendpara/save',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/sendpara/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/sendpara/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteById = (id) => {
  return request({
    url: '/api/v1/sendpara/delete/' + id,
    method: 'delete',
    params: {}
  })
}

export const statusChange = (params, data) => {
  return request({
    url: '/api/v1/sendpara/statusChange',
    method: 'post',
    data: data,
    params: params
  })
}

