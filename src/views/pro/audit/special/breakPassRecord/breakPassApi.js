import request from 'ecip-web/utils/request'

export const findPageBr = (params, data) => {
  return request({
    url: 'api/v1/audit/list/exListSpecial/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/audit/list/breakPassRecord/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


export const auditBr = (params) => {
  return request({
    url: 'api/v1/audit/list/breakPassRecordResult/audit',
    method: 'post',
    data:params
  })
}

export const getEnImgBase64 = (businessKey) => {
  return request({
    url: `api/v1/audit/list/breakPassRecord/getImgBase64/${businessKey}`,
    method: 'get'
  })
}


