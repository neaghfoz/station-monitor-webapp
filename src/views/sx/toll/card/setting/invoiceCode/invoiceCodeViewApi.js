import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/invoicecode/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/invoicecode/save',
    method: 'post',
    data: data
  })
}

export const getById = (invCode) => {
  return request({
    url: '/api/v1/invoicecode/' + invCode,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (invCodes) => {
  return request({
    url: '/api/v1/invoicecode/' + invCodes,
    method: 'delete',
    params: {}
  })
}
