import request from 'ecip-web/utils/request'

/**
 * 获取路段车流量统计数据
 * @param data
 */
export const reqData = (data) => {
  return request({
    url: 'api/v1/fitcheck/traffic/sectionTraffic',
    method: 'post',
    params: {},
    data: data
  })
}
