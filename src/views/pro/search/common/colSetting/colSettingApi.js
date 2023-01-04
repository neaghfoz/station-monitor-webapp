import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/com/colSetting/findPage',
    method: 'post',
    params: params,
    data: data
  })
}


export const update = (params, data) => {
  return request({
    url: 'api/v1/search/com/colSetting/update',
    method: 'post',
    params: params,
    data: data
  })
}


export const findUseList = (params) => {
  return request({
    url: 'api/v1/search/com/colSetting/useList',
    method: 'get',
    params: params
  })
}
