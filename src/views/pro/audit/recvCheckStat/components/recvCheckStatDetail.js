import request from 'ecip-web/utils/request'

export const findEnCountPage = (params, data) => {
  return request({
    url: 'api/v1/audit/list/dataRecvCheckStat/findEnCountPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const findExCountPage = (params, data) => {
  return request({
    url: 'api/v1/audit/list/dataRecvCheckStat/findExCountPage',
    method: 'post',
    params: params,
    data: data
  })
}


export const findGantryTransSumPage = (params, data) => {
  return request({
    url: 'api/v1/audit/list/dataRecvCheckStat/findGantryTransSumPage',
    method: 'post',
    params: params,
    data: data
  })
}


