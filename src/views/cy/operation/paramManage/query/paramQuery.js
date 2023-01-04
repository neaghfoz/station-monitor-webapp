import request from 'ecip-web/utils/request'
export const getList = (params) => {
  return request({
    url: '/api/v1/paramMain',
    method: 'get',
    params: params
  })
}
export const paramData = (params) => {
  return request({
    url: '/api/v1/paramMain/paramData',
    method: 'get',
    params: params
  })
}

export const paramList = (params, data) => {
  return request({
    url: '/api/v1/param/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const checkTBName = (params, data) => {
  return request({
    url: '/api/v1/param/checkTBName',
    method: 'post',
    params: params,
    data: data
  })
}

