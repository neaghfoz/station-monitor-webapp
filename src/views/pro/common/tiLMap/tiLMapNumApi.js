import request from 'ecip-web/utils/request'

export const getData = (url,data) => {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
