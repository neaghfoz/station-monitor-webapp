import request from 'ecip-web/utils/request'

export const getData = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/feeAnalyse/auditSplitDiffSumRpt/data',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const pageByDate = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/feeAnalyse/auditSplitDiffSumRpt/pageByDate',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const listReasonByDate = (data) => {
  return request({
    url: 'api/v1/fitcheck/feeAnalyse/auditSplitDiffSumRpt/listReasonByDate',
    method: 'post',
    data: data || {}
  })
}
