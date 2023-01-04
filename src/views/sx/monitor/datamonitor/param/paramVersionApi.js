import request from 'ecip-web/utils/request'

export const findServerParamPage = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/serverParam/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const findLaneParamPage = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/laneParam/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const findDownPage = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/serverParamDown/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const reqDownLastest = (bsParamName, params) => {
  return request({
    url: `api/v1/monitor/datamonitor/serverParam/reqDownLastest/` + bsParamName,
    method: 'get',
    params: params
  })
}

export const reqDown = (bsParamName, version, params) => {
  return request({
    url: `api/v1/monitor/datamonitor/serverParam/reqDown/` + bsParamName + '/' + version,
    method: 'get',
    params: params
  })
}




