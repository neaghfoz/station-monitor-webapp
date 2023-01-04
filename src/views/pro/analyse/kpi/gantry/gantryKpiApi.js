import request from 'ecip-web/utils/request'

/**
 * 获取门架性能指标数据
 * @param data
 */
export const getData = (data) => {
  return request({
    url: 'api/v1/analyse/list/gantryKpi/findGantryKpiStat',
    method: 'post',
    data: data
  })
}
