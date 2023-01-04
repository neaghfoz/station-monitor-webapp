import request from 'ecip-web/utils/request'

export const getData = (data) => {
  return request({
    url: '/api/v1/audit/nodeCodeCoordinate/coordinate',
    // url: 'api/layui/v1/roadnet_api/test',
    method: 'post',
    data: data
  })
}
