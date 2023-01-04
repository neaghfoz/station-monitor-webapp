import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/gantryTrans/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (tradeId, transTime) => {
  return request({
    url: `api/v1/search/list/gantryTrans/detail/${tradeId}/${transTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/gantryTrans/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}

export const getImgBase64 = (data,type) => {
  return request({
    url: `api/v1/search/list/gantryTrans/getImgBase64/${type}`,
    method: 'post',
    data: data,
  })
}

export const getVehiclePicId = (data) => {
  return request({
    url: 'api/v1/search/list/gantryTrans/getVehiclePicId',
    method: 'post',
    data: data,
  })
}

