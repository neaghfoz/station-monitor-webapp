import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneExListFail/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (id, exTime) => {
  return request({
    url: `api/v1/search/list/laneExListFail/detail/${id}/${exTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneExListFail/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}

export const getImgBase64 = (businessKey) => {
  return request({
    url: `api/v1/search/list/laneExListFail/getImgBase64/${businessKey}`,
    method: 'get'
  })
}

export const findDetailKeyList = ( data) => {
  return request({
    url: 'api/v1/search/list/laneExListFail/detailKeyList',
    method: 'post',
    data: data
  })
}


