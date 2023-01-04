import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/enOverLoadData/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (hgSeq, enTollLaneId, checkTimeText) => {
  return request({
    url: `api/v1/search/list/enOverLoadData/detail/${hgSeq}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/enOverLoadData/exportExcel',
    method: 'post',
    params: params,
    data: data
  })
}

export const getImgBase64 = (businessKey) => {
    return request({
      url : 'api/v1/search/list/enOverLoadData/getImgBase64/${businessKey}',
      method: 'get'
    })
}



