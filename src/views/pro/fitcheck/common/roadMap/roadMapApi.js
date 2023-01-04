import request from 'ecip-web/utils/request'


export const getVersion = () => {
  return request({
    url: 'api/v1/audit/getRoadNetVersion',
    method: 'get'
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

export const getCloudImg = ( data) => {
  return request({
    url: 'api/v1/fitcheck/getImage',
    method: 'post',
    data: data
  })
}

