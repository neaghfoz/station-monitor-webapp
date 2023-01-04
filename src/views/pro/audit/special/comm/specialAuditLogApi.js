import request from 'ecip-web/utils/request'

export const findPage = (params, data,url) => {
  return request({
    url: url,
    method: 'post',
    params: params,
    data: data
  })
}
