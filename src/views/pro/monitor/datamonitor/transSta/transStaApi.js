import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/transSta/findPage',
    method: 'post',
    params: params,
    data: data
  })
}



