import request from 'ecip-web/utils/request'

export const getData = (params, data) => {
  return request({
    url: 'api/v1/audit/vehicleBase/vehiclePassStat/data',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const listByVehicle = (data) => {
  return request({
    url: 'api/v1/audit/vehicleBase/vehiclePassStat/listByVehicle',
    method: 'post',
    data: data || {}
  })
}
