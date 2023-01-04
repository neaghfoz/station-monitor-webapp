import request from 'ecip-web/utils/request'

/**
 * 获取断面车流量统计数据
 * @param data
 */
export const reqData = (data) => {
  return request({
    url: 'api/v1/fitcheck/traffic/gantryTraffic',
    method: 'post',
    params: {},
    data: data
  })
}
