import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/audit/uploadNotify/findPage',
    method: 'post',
    params: params,
    data: data
  })
}
export default { findList }
