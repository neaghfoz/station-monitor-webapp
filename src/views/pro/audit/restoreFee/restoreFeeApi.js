import request from 'ecip-web/utils/request'

export const getData = (data) => {
  return request({
    url: 'api/v1/audit/restoreProFee',
    method: 'post',
    params: {},
    data: data
  })
}
