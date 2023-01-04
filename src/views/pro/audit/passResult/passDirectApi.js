import request from 'ecip-web/utils/request'

export const getData = (page,data) => {
  return request({
    url: 'api/v1/audit/passResultList',
    method: 'post',
    params: page,
    data: data
  })
}

export const getPathList = (params, data) => {
  return request({
    url: 'api/v1/audit/pathInfo',
    method: 'post',
    params: params,
    data: data
  })
}
