import request from 'ecip-web/utils/request'

export const getData = (params, data) => {
  return request({
    url: 'api/v1/audit/vehicleBase/vehicleInfoBase/data',
    method: 'post',
    params: params,
    data: data || {}
  })
}

export const findByPrimaryKey = (hgSeq) => {
  return request({
    url: `api/v1/audit/vehicleBase/vehicleInfoBase/${hgSeq}`,
    method: 'get'
  })
}

export const updateConfirmVehType = (data) => {
  return request({
    url: 'api/v1/audit/vehicleBase/vehicleInfoBase/updateConfirmVehType',
    method: 'put',
    data: data
  })
}
