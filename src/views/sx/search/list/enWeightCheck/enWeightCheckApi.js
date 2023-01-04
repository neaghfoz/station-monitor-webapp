import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/enWeightCheck/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (listNo, hspTime) => {
  return request({
    url: `api/v1/search/list/enWeightCheck/detail/${listNo}/${hspTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/enWeightCheck/exportExcel',
    method: 'post',
    params: params,
    data: data
  })
}

export const getImgBase64 = (params) => {
  return request({
    url: `api/v1/search/list/enWeightCheck/getImgBase64`,
    method: 'post',
    params: params
  })
}

export const findDetailKeyList = ( data) => {
  return request({
    url: 'api/v1/search/list/enWeightCheck/detailKeyList',
    method: 'post',
    data: data
  })
}

