import request from 'ecip-web/utils/request'

export const findPageEn = (params, data) => {
  return request({
    url: 'api/v1/audit/list/enListSpecial/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/audit/list/enListSpecial/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


export const auditEn = (params) => {
  return request({
    url: 'api/v1/audit/list/enListSpecialResult/audit',
    method: 'post',
    data:params
  })
}

export const getEnImgBase64 = (businessKey) => {
  return request({
    url: `api/v1/audit/list/enListSpecial/getImgBase64/${businessKey}`,
    method: 'get'
  })
}


