import request from 'ecip-web/utils/request'

export const findDiffReason = (params, data) => {
  return request({
    url: 'api/v1/audit/list/feeAnalyse/findDiffReason',
    method: 'post',
    params: params,
    data: data
  })
}
