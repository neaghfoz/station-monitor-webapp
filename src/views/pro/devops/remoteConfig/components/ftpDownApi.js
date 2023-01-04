import request from 'ecip-web/utils/request'

export const lsFtpFiles = (params, data) => {
  return request({
    url: 'api/v1/devops/ftp/files',
    method: 'post',
    params: params,
    data: data
  })
}
export const ftpDownload = (params, data) => {
  return request({
    url: 'api/v1/devops/ftp/download',
    method: 'post',
    params: params,
    data: data
  })
}
