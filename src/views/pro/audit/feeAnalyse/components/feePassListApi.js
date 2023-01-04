import request from 'ecip-web/utils/request'

export const findPassList = (params, data) => {
  return request({
    url: 'api/v1/audit/list/feeAnalyse/passList',
    method: 'post',
    params: params,
    data: data
  })
}

export const findPathInfos = (params, data) => {
  return request({
    url: 'api/v1/audit/list/feeAnalyse/getPathInfos',
    method: 'post',
    params: params,
    data: data
  })
}

