import request from 'ecip-web/utils/request'


export const findParamList = (params, data) => {
  return request({
    url: '/api/v1/audit/rate/findParamList',
    method: 'post',
    params: params,
    data: data
  })
}

export const findProvPriceParamList = (params, data) => {
  return request({
    url: '/api/v1/audit/rate/findProvPriceParamList',
    method: 'post',
    params: params,
    data: data
  })
}


export const findNodeCodeList = (params, data) => {
  return request({
    url: '/api/v1/audit/rate/findNodeCodeList',
    method: 'post',
    params: params,
    data: data
  })
}

export const findNodeLinkList = (params, data) => {
  return request({
    url: '/api/v1/audit/rate/findNodeLinkList',
    method: 'post',
    params: params,
    data: data
  })
}

export const deleteByVersion = (params) => {
  return request({
    url: '/api/v1/audit/rate/delete',
    method: 'delete',
    params: params
  })
}



