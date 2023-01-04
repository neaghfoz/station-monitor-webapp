import request from 'ecip-web/utils/request'

export const version = () => {
  return request({
    url: '/api/v1/base/version',
    method: 'get',
  })
}

