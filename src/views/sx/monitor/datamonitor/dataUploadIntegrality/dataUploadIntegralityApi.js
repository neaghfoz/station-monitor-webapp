import request from 'ecip-web/utils/request'

export const getRoadProTransData = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/dataUploadIntegrality/roadProTransDataList',
    method: 'post',
    params: params,
    data: data
  })
}

export const getStationProTransData = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/dataUploadIntegrality/stationProTransDataList',
    method: 'post',
    params: params,
    data: data
  })
}

export const getRoadProOtherData = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/dataUploadIntegrality/roadProOtherDataList',
    method: 'post',
    params: params,
    data: data
  })
}

export const getStationProOtherData = (params, data) => {
  return request({
    url: 'api/v1/monitor/datamonitor/dataUploadIntegrality/stationProOtherDataList',
    method: 'post',
    params: params,
    data: data
  })
}
