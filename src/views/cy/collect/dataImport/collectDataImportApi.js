import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/collect/dataImport/findPage',
    method: 'post',
    params: params,
    data: data,
  })
} 
export const checkIsAllow = (data) => {
  return request({
    url: 'api/v1/collect/dataImport/checkIsAllow',
    method: 'post', 
    data: data
  })
} 
export default {findList,checkIsAllow}
