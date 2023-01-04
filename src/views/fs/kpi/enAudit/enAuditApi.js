import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/relatedEnlist/findList',
    method: 'post',
    params: params,
    data: data
  })
}
