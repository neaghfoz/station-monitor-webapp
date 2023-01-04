import request from 'ecip-web/utils/request'

export const findListByVerion = (data) => {
  return request({
    url: '/api/v1/fitcheck/nodeCodeCoordinate/findListByVersion',
    // url: 'api/layui/v1/roadnet_api/test',
    method: 'post',
    data: data
  })
}

export const saveStartPoint = (data) => {
  return request({
    url: '/api/v1/fitcheck/nodeCodeCoordinate/saveStartPoint',
    // url: 'api/layui/v1/roadnet_api/test',
    method: 'post',
    data: data
  })
}

export const saveEndPoint = (data) => {
  return request({
    url: '/api/v1/fitcheck/nodeCodeCoordinate/saveEndPoint',
    // url: 'api/layui/v1/roadnet_api/test',
    method: 'post',
    data: data
  })
}
