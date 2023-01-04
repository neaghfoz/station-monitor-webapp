import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/breakPassRecord/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (hgSeq) => {
  return request({
    url: `api/v1/search/list/breakPassRecord/detail/${hgSeq}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/breakPassRecord/exportExcel',
    method: 'post',
    params: params,
    data: data
  })
}


