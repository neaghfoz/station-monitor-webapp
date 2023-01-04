import request from 'ecip-web/utils/request'

export const getData = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/auditFittingRoadPathtypeRpt/data',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const listByReqParam = (data) => {
  return request({
    url: 'api/v1/fitcheck/auditFittingRoadPathtypeRpt/listByReqParam',
    method: 'post',
    data: data || {}
  })
}
