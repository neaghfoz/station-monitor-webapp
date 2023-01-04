import request from 'ecip-web/utils/request'

/**
 * 获取监控车道信息
 * @param params
 */
export const findLaneList = (data) => {
  return request({
    url: '/api/v1/toll/lane/laneMonitor/list',
    method: 'get',
    data: data
  })
}

/**
 * 特情记录分页查询
 * @param params
 * @param data
 */
export const spfindPage = (params, data) => {
  return request({
    url: '/api/v1/toll/lane/spMonitor/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 加载特殊事件字典
 * @param params
 */
export const loadDealStatus= (params) => {
  return request({
    url: '/api/v1/toll/lane/laneMonitor/list',
    method: 'get',
    params: {}
  })
}

/**
 * 更新特情记录
 * @param unitNo
 * @param data
 */
export const registerMark = (data) => {
  return request({
    url: '/api/v1/toll/lane/spMonitor/registerMark',
    method: 'post',
    data: data
  })
}

/**
 * 更新特情记录
 * @param unitNo
 * @param data
 */
export const synUpdate = (data) => {
  return request({
    url: '/api/v1/toll/lane/spMonitor/synUpdate',
    method: 'post',
    data: data
  })
}
