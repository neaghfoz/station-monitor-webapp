import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/exWeightData/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (hgSeq, enTolllaneId, checkTime) => {
  return request({
    url: `api/v1/search/list/exWeightData/detail/${hgSeq}/${checkTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {

  return request({
    url: 'api/v1/search/list/exWeightData/exportExcel',
    method: 'post',
    params: params,
    data: data
  })
}




