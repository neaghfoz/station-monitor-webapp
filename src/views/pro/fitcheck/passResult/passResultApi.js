import request from 'ecip-web/utils/request'

export const getData = (page,data) => {
  return request({
    url: 'api/v1/fitcheck/passResult/list',
    method: 'post',
    params: page,
    data: data
  })
}

export const getPathList = (params, data) => {
  return request({
    url: 'api/v1/fitcheck/pathInfo',
    method: 'post',
    params: params,
    data: data
  })
}
