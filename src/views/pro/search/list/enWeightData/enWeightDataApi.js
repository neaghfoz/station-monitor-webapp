import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/enWeightData/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (hgSeq, enTolllaneId, checkTime) => {
  return request({
    url: `api/v1/search/list/enWeightData/detail/${hgSeq}/${checkTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/enWeightData/exportExcel',
    method: 'post',
    params: params,
    data: data
  })
}



