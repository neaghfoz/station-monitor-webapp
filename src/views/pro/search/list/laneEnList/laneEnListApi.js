import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneEnList/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (id, enTime) => {
  return request({
    url: `api/v1/search/list/laneEnList/detail/${id}/${enTime}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneEnList/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}

export const getImgBase64 = (businessKey) => {
  return request({
    url: `api/v1/search/list/laneEnList/getImgBase64/${businessKey}`,
    method: 'get'
  })
}


export const findDetailKeyList = ( data) => {
  return request({
    url: 'api/v1/search/list/laneEnList/detailKeyList',
    method: 'post',
    data: data
  })
}




