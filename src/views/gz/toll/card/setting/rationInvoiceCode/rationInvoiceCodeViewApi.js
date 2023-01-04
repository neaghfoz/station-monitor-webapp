import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/rationInvoiceCode/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/rationInvoiceCode/save',
    method: 'post',
    data: data
  })
}

export const getById = (invCode) => {
  return request({
    url: '/api/v1/rationInvoiceCode/' + invCode,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (invCodes, invMoneys) => {
  return request({
    url: '/api/v1/rationInvoiceCode/' + invCodes + '/' + invMoneys,
    method: 'delete',
    params: {}
  })
}
