import request from 'ecip-web/utils/request'

export const dataRerunFindPage = (params, data) => {
  return request({
    url: `api/v1/collect/dataRerun/dataRerunFindPage`,
    method: 'post',
    params: params,
    data: data
  })
}

export const dataRerunMain = (params) => {
  return request({
    url: `/api/v1/collect/dataRerun/dataRerunMain`,
    method: 'post',
    params: params
  })
}

