import request from 'ecip-web/utils/request'

export const findIndicators = (params, data) => {
  return request({
    url: 'api/v1/kpi/indicator/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const insertIndicator = (params, data) => {
  return request({
    url: 'api/v1/kpi/indicator/save',
    method: 'post',
    params: params,
    data: data
  })
}

/**查询岗位*/
export const queryPositions = (params, data) => {
  return request({
    url: 'api/v1/position/sysrPosition/list',
    method: 'post',
    params: params,
    data: data
  })
}

