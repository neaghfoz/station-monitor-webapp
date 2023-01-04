import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/laneParam/findList',
    method: 'post',
    params: params,
    data: data
  })
}
