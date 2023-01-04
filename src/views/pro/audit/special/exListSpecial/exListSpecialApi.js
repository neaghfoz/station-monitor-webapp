import request from 'ecip-web/utils/request'

export const findPageEx = (params, data) => {
  return request({
    url: 'api/v1/audit/list/exListSpecial/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/audit/list/exListSpecial/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


export const auditEx = (params) => {
  return request({
    url: 'api/v1/audit/list/exListSpecialResult/audit',
    method: 'post',
    data:params
  })
}

export const getExImgBase64 = (businessKey) => {
  return request({
    url: `api/v1/audit/list/exListSpecial/getImgBase64/${businessKey}`,
    method: 'get'
  })
}


export const getEnVehicleSigId =(passId,enTime) => {
  return request({
    url: `api/v1/audit/list/exListSpecial/getEnVehicleSigId/${passId}/${enTime}`,
    method: 'get'
  })
}

