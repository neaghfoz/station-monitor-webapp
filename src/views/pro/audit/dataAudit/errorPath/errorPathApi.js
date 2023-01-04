import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/audit/list/errorPathAudit/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getPathInfo = (params, data) => {
  return request({
    url: 'api/v1/audit/pathInfo',
    method: 'post',
    params: params,
    data: data
  })
}

export const getSerialNo = () => {
  return request({
    url: 'api/v1/audit/list/errorPathAudit/serialNo',
    method: 'get'
  })
}


export const restore = (data) => {
  return request({
    url: 'api/v1/audit/list/errorPathAudit/restore',
    method: 'post',
    params: {},
    data: data
  })
}

export const findEvidenceList = (params, data) => {
  return request({
    url: 'api/v1/audit/comm/evidence/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const audit = (data,passId,enTime) => {
  return request({
    url: `api/v1/audit/list/errorPathAudit/audit/${passId}/${enTime}`,
    method: 'post',
    params: {},
    data: data
  })
}
