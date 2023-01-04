import request from 'ecip-web/utils/request'


export const getVersion = () => {
  return request({
    url: 'api/v1/audit/getRoadNetVersion',
    method: 'get'
  })
}
