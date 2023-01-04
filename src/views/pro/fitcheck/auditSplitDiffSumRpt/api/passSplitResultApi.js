import request from 'ecip-web/utils/request'

export const getData = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/feeAnalyse/passSplitResult/data',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const findPathInfo = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/feeAnalyse/passSplitResult/findPathDetail',
    method: 'post',
    params: params,
    data: data || {}
  })
}
